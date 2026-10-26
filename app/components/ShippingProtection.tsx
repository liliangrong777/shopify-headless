import {
  ShippingProtectionWidget,
  useShippingProtectionController,
} from "captain-shipping-protection-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useCart, useCartActions } from "~/lib/cart";
import { storefrontConfig } from "~/lib/shop";
import {
  addProtectionAndGetCheckoutUrl,
  findProtectionLineIds,
  toSdkCartData,
  toVariantGid,
} from "~/lib/shipping-protection-cart";

const checkoutClassName =
  "rounded-button button-primary focus-visible:outline-accent inline-flex h-11 w-full items-center justify-center gap-2 px-4 text-sm font-medium no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-[color,background-color,border-color,transform] motion-safe:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

type ShippingProtectionActions = {
  checkoutDisabled: boolean;
  enabled: boolean;
  offer: ReactNode;
  onCheckout: () => void;
};

const ShippingProtectionContext = createContext<ShippingProtectionActions | null>(null);

export function captainShopDomain(domain: string): string | null {
  return domain.endsWith(".myshopify.com") ? domain : null;
}

export function ShippingProtectionProvider({
  shop,
  children,
}: {
  shop: string | null;
  children: ReactNode;
}) {
  if (!shop) {
    return (
      <ShippingProtectionContext.Provider value={directCheckout}>
        {children}
      </ShippingProtectionContext.Provider>
    );
  }

  return <CaptainShippingProtection shop={shop}>{children}</CaptainShippingProtection>;
}

export function ShippingProtectionOffer() {
  return <>{useShippingProtectionActions().offer}</>;
}

export function ShippingProtectionCheckout() {
  const checkoutUrl = useCart((state) => state.data.checkoutUrl);
  const actions = useShippingProtectionActions();

  if (!checkoutUrl) return null;
  if (!actions.enabled) {
    return (
      <a href={checkoutUrl} className={checkoutClassName}>
        Checkout
      </a>
    );
  }

  return (
    <button
      type="button"
      className={checkoutClassName}
      disabled={actions.checkoutDisabled}
      aria-busy={actions.checkoutDisabled}
      onClick={actions.onCheckout}
    >
      Checkout
    </button>
  );
}

const directCheckout: ShippingProtectionActions = {
  checkoutDisabled: false,
  enabled: false,
  offer: null,
  onCheckout: () => {},
};

function CaptainShippingProtection({ shop, children }: { shop: string; children: ReactNode }) {
  const cart = useCart((state) => state.data);
  const { refresh } = useCartActions();
  const cartRef = useRef(cart);
  cartRef.current = cart;
  const sdkCart = useMemo(() => toSdkCartData(cart), [cart]);
  const protection = useShippingProtectionController({
    shop,
    country: storefrontConfig.i18n.country,
    locale: storefrontConfig.i18n.language.toLowerCase(),
    currency: cart.cost.subtotalAmount.currencyCode,
    cart: sdkCart,
    removeProtection: async (info) => {
      const lineIds = findProtectionLineIds(cartRef.current, info.productId);
      if (lineIds.length === 0) return;
      await removeCartLines(lineIds);
      refresh();
    },
  });
  const [hydrated, setHydrated] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const checkoutPendingRef = useRef(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const checkoutDisabled =
    !hydrated ||
    checkoutPending ||
    protection.initPending ||
    protection.infoPending ||
    protection.removePending;
  const showWidget = protection.visible && protection.info;

  async function handleCheckout() {
    if (checkoutPendingRef.current) return;
    checkoutPendingRef.current = true;
    setCheckoutPending(true);
    setAddError(null);

    try {
      let latestInfo = null;
      try {
        latestInfo = await protection.prepareCheckout();
      } catch {
        latestInfo = null;
      }

      const cartId = cartRef.current.id;
      const checkoutUrl =
        latestInfo && cartId
          ? await addProtectionAndGetCheckoutUrl(cartId, toVariantGid(latestInfo.variantsId))
          : cartRef.current.checkoutUrl;
      if (!checkoutUrl) {
        checkoutPendingRef.current = false;
        setAddError("Checkout is unavailable.");
        setCheckoutPending(false);
        return;
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      checkoutPendingRef.current = false;
      setAddError(error instanceof Error ? error.message : "Could not add shipping protection.");
      setCheckoutPending(false);
    }
  }

  const actions = useMemo<ShippingProtectionActions>(
    () => ({
      checkoutDisabled,
      enabled: true,
      offer:
        showWidget || protection.removeError || addError ? (
          <div className="grid gap-3">
            {showWidget && protection.info ? (
              <ShippingProtectionWidget
                checked={protection.checked}
                currency={cart.cost.subtotalAmount.currencyCode}
                disabled={protection.togglePending || protection.removePending}
                info={protection.info}
                onToggle={protection.toggle}
                setting={protection.setting}
              />
            ) : null}
            {protection.removeError ? (
              <div role="alert">
                <p className="text-critical text-sm">Could not clean up the existing protection line.</p>
                <button
                  type="button"
                  className="text-on-surface mt-2 text-sm underline"
                  onClick={() => void protection.refresh()}
                >
                  Retry
                </button>
              </div>
            ) : null}
            {addError ? (
              <p className="text-critical text-sm" role="alert">
                {addError}
              </p>
            ) : null}
          </div>
        ) : null,
      onCheckout: () => {
        void handleCheckout();
      },
    }),
    [
      addError,
      cart.cost.subtotalAmount.currencyCode,
      checkoutDisabled,
      protection,
      showWidget,
    ],
  );

  return (
    <ShippingProtectionContext.Provider value={actions}>{children}</ShippingProtectionContext.Provider>
  );
}

function useShippingProtectionActions(): ShippingProtectionActions {
  const actions = useContext(ShippingProtectionContext);
  if (!actions) {
    throw new Error("ShippingProtectionProvider is missing.");
  }
  return actions;
}

async function removeCartLines(lineIds: string[]) {
  const updateCart = window.Shopify?.actions?.updateCart;
  if (!updateCart || updateCart.isDefault()) {
    throw new Error("Could not clean up the existing protection line.");
  }

  for (const id of lineIds) {
    const result = await updateCart({ lines: [{ id, quantity: 0 }] });
    const message = result.userErrors?.[0]?.message;
    if (message) throw new Error(message);
  }
}
