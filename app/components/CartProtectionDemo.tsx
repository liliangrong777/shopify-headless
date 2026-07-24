import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {
  ShippingProtection,
  type SdkCartData,
  type ShippingProtectionInfo,
} from '@captain/shipping-protection-react';
import {useMemo, type ReactElement} from 'react';
import {useRevalidator, useRouteLoaderData} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

type CartProtectionDemoProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
};

type CaptainShippingProtectionWidgetProps = {
  className?: string;
  cart: SdkCartData;
  country: string;
  currency: string;
  locale: string;
  onToggle: (
    checked: boolean,
    info: ShippingProtectionInfo,
  ) => void | Promise<void>;
  shop: string;
};

function CaptainShippingProtectionWidget(
  props: CaptainShippingProtectionWidgetProps,
): ReactElement | null {
  return ShippingProtection(props) as unknown as ReactElement | null;
}

export function CartProtectionDemo({cart}: CartProtectionDemoProps) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const revalidator = useRevalidator();
  const sdkCart = useMemo(() => toSdkCartData(cart), [cart]);

  if (!sdkCart || !rootData?.publicStoreDomain) return null;

  async function submitCartAction(action: string, inputs: unknown) {
    const formData = new FormData();
    formData.set(CartForm.INPUT_NAME, JSON.stringify({action, inputs}));

    const response = await fetch('/cart', {
      body: formData,
      method: 'POST',
    });
    const result = (await response.json()) as {
      errors?: unknown[];
      warnings?: unknown[];
    };

    if (!response.ok || result.errors?.length) {
      console.error('Captain shipping protection cart mutation failed', result);
      throw new Error('Captain shipping protection cart mutation failed');
    }

    void revalidator.revalidate();
  }

  async function handleToggle(checked: boolean, info: ShippingProtectionInfo) {
    if (checked) {
      await submitCartAction(CartForm.ACTIONS.LinesAdd, {
        lines: [
          {
            merchandiseId: variantNumericIdToGid(info.variantsId),
            quantity: 1,
          },
        ],
      });
      return;
    }

    const lineIds = findInsuranceLineIds(cart, info);
    if (lineIds.length) {
      await submitCartAction(CartForm.ACTIONS.LinesRemove, {lineIds});
    }
  }

  return (
    <CaptainShippingProtectionWidget
      cart={sdkCart}
      className="cart-protection-demo"
      shop={rootData.publicStoreDomain}
      locale="en"
      currency={sdkCart.currency}
      country="US"
      onToggle={handleToggle}
    />
  );
}

function toSdkCartData(
  cart: OptimisticCart<CartApiQueryFragment | null>,
): SdkCartData | null {
  const lines = cart?.lines?.nodes ?? [];
  const currency = cart?.cost?.subtotalAmount?.currencyCode ?? 'USD';

  if (!cart?.id || !lines.length) return null;

  const items: SdkCartData['items'] = [];

  for (const line of lines) {
    const merchandise = line.merchandise;
    const variantId = gidToNumericId(merchandise.id);
    const productId = gidToNumericId(merchandise.product.id);

    if (!variantId || !productId) continue;

    items.push({
      id: Number(variantId),
      key: line.id,
      quantity: line.quantity,
      variant_id: Number(variantId),
      product_id: Number(productId),
      final_line_price: moneyToCents(line.cost?.totalAmount?.amount),
      product_title: merchandise.product.title,
      title: merchandise.title,
      sku: '',
    });
  }

  return {
    token: cart.id,
    currency,
    total_price: moneyToCents(cart.cost?.subtotalAmount?.amount),
    item_count: cart.totalQuantity ?? lines.length,
    items,
  };
}

function findInsuranceLineIds(
  cart: OptimisticCart<CartApiQueryFragment | null>,
  info: ShippingProtectionInfo,
) {
  const insuranceProductId = String(info.productId);
  const insuranceVariantId = String(info.variantsId);

  return (cart?.lines?.nodes ?? [])
    .filter((line) => {
      const productId = gidToNumericId(line.merchandise.product.id);
      const variantId = gidToNumericId(line.merchandise.id);

      return (
        productId === insuranceProductId || variantId === insuranceVariantId
      );
    })
    .map((line) => line.id);
}

function gidToNumericId(gid?: string | null) {
  return gid?.split('/').pop() ?? '';
}

function variantNumericIdToGid(id: string | number) {
  return `gid://shopify/ProductVariant/${id}`;
}

function moneyToCents(amount?: string | null) {
  return Math.round(Number(amount ?? 0) * 100);
}
