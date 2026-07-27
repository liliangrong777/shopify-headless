import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {
  ShippingProtectionWidget,
  type SdkCartData,
  type ShippingProtectionInfo,
  type ShippingProtectionWidgetProps,
  useShippingProtectionController,
} from 'captain-shipping-protection-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import {useFetcher, useRouteLoaderData} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

type CartProtectionDemoProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  checkoutUrl?: string;
};

type CartActionResult = {
  cart?: {
    checkoutUrl?: string;
  } | null;
  errors?: unknown[];
  warnings?: unknown[];
};

type PendingCartAction = {
  reject: (reason?: unknown) => void;
  resolve: (result: CartActionResult) => void;
};

type CheckoutStage = 'idle' | 'preparing' | 'adding' | 'redirecting';

function CaptainShippingProtectionWidget(
  props: ShippingProtectionWidgetProps,
): ReactElement | null {
  return ShippingProtectionWidget(props) as unknown as ReactElement | null;
}

export function CartProtectionDemo({
  cart,
  checkoutUrl,
}: CartProtectionDemoProps) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const sdkCart = useMemo(() => toSdkCartData(cart), [cart]);

  if (!sdkCart || !rootData?.publicStoreDomain) {
    return <CheckoutLink checkoutUrl={checkoutUrl} />;
  }

  return (
    <CartProtectionController
      cart={cart}
      checkoutUrl={checkoutUrl}
      sdkCart={sdkCart}
      shop={rootData.publicStoreDomain}
    />
  );
}

function CartProtectionController({
  cart,
  checkoutUrl,
  sdkCart,
  shop,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  checkoutUrl?: string;
  sdkCart: SdkCartData;
  shop: string;
}) {
  const fetcher = useFetcher<CartActionResult>();
  const pendingCartAction = useRef<PendingCartAction | null>(null);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>('idle');
  const [checkoutError, setCheckoutError] = useState<unknown>(null);
  const protection = useShippingProtectionController({
    cart: sdkCart,
    shop,
    locale: 'en',
    currency: sdkCart.currency,
    country: 'US',
    removeProtection: async (info) => {
      const lineIds = findInsuranceLineIds(cart, info);
      if (lineIds.length) {
        await submitCartAction(CartForm.ACTIONS.LinesRemove, {lineIds});
      }
    },
  });

  useEffect(() => {
    if (fetcher.state !== 'idle' || !pendingCartAction.current) return;

    const pending = pendingCartAction.current;
    pendingCartAction.current = null;

    if (fetcher.data?.errors?.length) {
      console.error(
        'Captain shipping protection cart mutation failed',
        fetcher.data,
      );
      pending.reject(
        new Error('Captain shipping protection cart mutation failed'),
      );
      return;
    }

    pending.resolve(fetcher.data ?? {});
  }, [fetcher.data, fetcher.state]);

  useEffect(
    () => () => {
      pendingCartAction.current?.reject(
        new Error('Captain shipping protection cart mutation was cancelled'),
      );
      pendingCartAction.current = null;
    },
    [],
  );

  function submitCartAction(
    action: string,
    inputs: unknown,
    options: {redirectToCheckout?: boolean} = {},
  ) {
    if (pendingCartAction.current) {
      return Promise.reject(
        new Error('Captain shipping protection cart mutation already pending'),
      );
    }

    return new Promise<CartActionResult>((resolve, reject) => {
      pendingCartAction.current = {resolve, reject};
      const submission: Record<string, string> = {
        [CartForm.INPUT_NAME]: JSON.stringify({action, inputs}),
      };

      if (options.redirectToCheckout) {
        submission.redirectToCheckout = 'true';
      }

      void fetcher
        .submit(
          submission,
          {
            action: '/cart',
            method: 'POST',
          },
        )
        .catch((error: unknown) => {
          if (!pendingCartAction.current) return;

          pendingCartAction.current = null;
          reject(error);
        });
    });
  }

  async function handleCheckout() {
    if (!checkoutUrl || checkoutPending || protection.removePending) return;

    setCheckoutPending(true);
    setCheckoutStage('preparing');
    setCheckoutError(null);

    try {
      const info = await protection.prepareCheckout();

      if (!info) {
        setCheckoutStage('redirecting');
        window.location.assign(checkoutUrl);
        return;
      }

      setCheckoutStage('adding');
      await submitCartAction(
        CartForm.ACTIONS.LinesAdd,
        {
          lines: [
            {
              merchandiseId: variantNumericIdToGid(info.variantsId),
              quantity: 1,
            },
          ],
        },
        {redirectToCheckout: true},
      );
    } catch (error: unknown) {
      setCheckoutError(error);
    } finally {
      setCheckoutPending(false);
      setCheckoutStage('idle');
    }
  }

  return (
    <>
      {protection.visible && protection.info ? (
        <CaptainShippingProtectionWidget
          checked={protection.checked}
          className="cart-protection-demo"
          currency={sdkCart.currency}
          disabled={protection.togglePending || protection.removePending}
          info={protection.info}
          setting={protection.setting}
          onToggle={(checked, info) => {
            void protection.toggle(checked, info);
          }}
        />
      ) : null}
      {protection.removeError ? (
        <small>Unable to refresh shipping protection. Please try again.</small>
      ) : null}
      {checkoutError ? (
        <small>Unable to prepare checkout. Please try again.</small>
      ) : null}
      <CheckoutLink
        checkoutUrl={checkoutUrl}
        disabled={
          checkoutPending ||
          protection.infoPending ||
          protection.initPending ||
          protection.removePending
        }
        pending={checkoutPending}
        pendingLabel={getCheckoutStageLabel(checkoutStage)}
        onCheckout={() => {
          void handleCheckout();
        }}
      />
    </>
  );
}

function CheckoutLink({
  checkoutUrl,
  disabled = false,
  onCheckout,
  pending = false,
  pendingLabel = 'Preparing Checkout...',
}: {
  checkoutUrl?: string;
  disabled?: boolean;
  onCheckout?: () => void;
  pending?: boolean;
  pendingLabel?: string;
}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a
        aria-disabled={disabled}
        href={checkoutUrl}
        onClick={(event) => {
          if (!onCheckout) return;
          event.preventDefault();
          if (!disabled) onCheckout();
        }}
      >
        <p>{pending ? pendingLabel : 'Continue to Checkout →'}</p>
      </a>
      <br />
    </div>
  );
}

function getCheckoutStageLabel(stage: CheckoutStage) {
  switch (stage) {
    case 'preparing':
      return 'Preparing protection...';
    case 'adding':
      return 'Adding protection...';
    case 'redirecting':
      return 'Opening checkout...';
    default:
      return 'Preparing Checkout...';
  }
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
  return findInsuranceLines(cart, info).map((line) => line.id);
}

function findInsuranceLines(
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
    });
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
