import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {
  ShippingProtection,
  useShippingProtection,
  type SdkCartData,
  type SdkCartSetting,
  type ShippingProtectionInfo,
} from '@captain/shipping-protection-react';
import {useMemo, type ReactElement} from 'react';
import {useFetcher, useRouteLoaderData} from 'react-router';
import type {FetcherWithComponents} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

type CartProtectionDemoProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
};

type CaptainShippingProtectionWidgetProps = {
  checked: boolean;
  className?: string;
  info: ShippingProtectionInfo;
  onToggle: (checked: boolean, info: ShippingProtectionInfo) => void;
  setting: SdkCartSetting | null;
};

type CaptainUseShippingProtectionParams = {
  cart: SdkCartData;
  country?: string;
  currency?: string;
  locale?: string;
  onToggle?: (checked: boolean, info: ShippingProtectionInfo) => void;
  shop: string;
  theme?: string;
};

type CaptainUseShippingProtectionResult = {
  checked: boolean;
  error: unknown;
  info: ShippingProtectionInfo | null;
  loading: boolean;
  setting: SdkCartSetting | null;
  toggle: (checked?: boolean) => void;
};

const useCaptainShippingProtection = useShippingProtection as unknown as (
  params: CaptainUseShippingProtectionParams,
) => CaptainUseShippingProtectionResult;

function CaptainShippingProtectionWidget(
  props: CaptainShippingProtectionWidgetProps,
): ReactElement | null {
  return ShippingProtection(props) as unknown as ReactElement | null;
}

export function CartProtectionDemo({cart}: CartProtectionDemoProps) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const fetcher = useFetcher({key: 'captain-shipping-protection'});
  const sdkCart = useMemo(() => toSdkCartData(cart), [cart]);

  if (!sdkCart || !rootData?.publicStoreDomain) return null;

  return (
    <CartProtectionDemoContent
      cart={cart}
      fetcher={fetcher}
      sdkCart={sdkCart}
      shop={rootData.publicStoreDomain}
    />
  );
}

function CartProtectionDemoContent({
  cart,
  fetcher,
  sdkCart,
  shop,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  fetcher: FetcherWithComponents<unknown>;
  sdkCart: SdkCartData;
  shop: string;
}) {
  const protection = useCaptainShippingProtection({
    cart: sdkCart,
    shop,
    locale: 'en',
    currency: sdkCart.currency,
    country: 'US',
    onToggle: handleToggle,
  });

  if (protection.error || !shouldRenderShippingProtection(protection.info)) {
    return null;
  }

  function submitCartAction(action: string, inputs: unknown) {
    const formData = new FormData();
    formData.set(CartForm.INPUT_NAME, JSON.stringify({action, inputs}));
    void fetcher.submit(formData, {method: 'POST', action: '/cart'});
  }

  function handleToggle(checked: boolean, info: ShippingProtectionInfo) {
    if (checked) {
      submitCartAction(CartForm.ACTIONS.LinesAdd, {
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
      submitCartAction(CartForm.ACTIONS.LinesRemove, {lineIds});
    }
  }

  return (
    <CaptainShippingProtectionWidget
      checked={protection.checked}
      info={protection.info}
      setting={protection.setting}
      onToggle={(checked) => protection.toggle(checked)}
    />
  );
}

function shouldRenderShippingProtection(
  info: ShippingProtectionInfo | null,
): info is ShippingProtectionInfo {
  return Boolean(
    info &&
      info.hasRealProduct &&
      !info.isHiddenTransportInsurance &&
      info.checkDisplayShow,
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
