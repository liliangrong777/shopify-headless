import type { SdkCartData } from "captain-shipping-protection-sdk";

import type { CartData } from "~/lib/cart";

// Captain expects numeric Shopify ids and integer minor-unit prices.
// Hydrogen's default cart fragment already selects the fields this mapper reads.
export function toSdkCartData(cart: CartData): SdkCartData {
  return {
    token: cart.id ?? "",
    currency: cart.cost.subtotalAmount.currencyCode,
    total_price: toMinorUnits(cart.cost.subtotalAmount.amount),
    item_count: cart.totalQuantity,
    items: cart.lines.nodes.flatMap((line) => {
      const merchandise = line.merchandise;
      const productId = merchandise?.product.id;
      if (!merchandise?.id || typeof productId !== "string") return [];

      let variantId: number;
      let numericProductId: number;
      try {
        variantId = numericShopifyId(merchandise.id);
        numericProductId = numericShopifyId(productId);
      } catch {
        return [];
      }

      return [
        {
          id: variantId,
          key: line.id,
          quantity: line.quantity,
          variant_id: variantId,
          product_id: numericProductId,
          final_line_price: toMinorUnits(line.cost.totalAmount.amount),
          title: merchandise.title ?? "",
          product_title: merchandise.product.title,
          sku: typeof merchandise.sku === "string" ? merchandise.sku : "",
        },
      ];
    }),
  };
}

export function findProtectionLineIds(cart: CartData, productId: string): string[] {
  return cart.lines.nodes.flatMap((line) => {
    const id = line.merchandise?.product.id;
    if (typeof id !== "string") return [];
    const numericId = id.split("/").pop()?.split("?")[0];
    if (numericId !== productId && id !== productId) return [];
    return [line.id];
  });
}

export function toVariantGid(variantId: string): string {
  return variantId.startsWith("gid://shopify/ProductVariant/")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`;
}

// Posts straight to the cart endpoint and does not touch the cart store.
// Publishing the new protection line back onto the cart page makes the
// controller delete it before checkout.
export async function addProtectionAndGetCheckoutUrl(
  cartId: string,
  variantGid: string,
): Promise<string> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      cartId,
      lines: [{ merchandiseId: variantGid, quantity: 1 }],
    }),
  });
  const body = (await response.json()) as {
    cart?: { checkoutUrl?: string | null } | null;
    error?: { message?: string };
    userErrors?: Array<{ message: string }>;
  };
  const message = body.userErrors?.[0]?.message ?? body.error?.message;
  if (!response.ok || message) {
    throw new Error(message || "Could not add shipping protection.");
  }
  if (!body.cart?.checkoutUrl) {
    throw new Error("Could not add shipping protection.");
  }
  return body.cart.checkoutUrl;
}

function numericShopifyId(gid: string): number {
  const value = Number(gid.split("/").pop()?.split("?")[0]);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid Shopify GID: ${gid}`);
  }
  return value;
}

function toMinorUnits(amount: string): number {
  const minor = Math.round(Number(amount) * 100);
  return Number.isFinite(minor) ? minor : 0;
}
