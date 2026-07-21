import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {
  analyzeInsuranceCart,
  buildInsuranceCartChange,
  type HeadlessCartSetting,
} from '../../../cw3-insurance-captain-web-client-headless/src/headless/core';
import {
  toHeadlessCart,
  variantNumericIdToGid,
} from '../../../cw3-insurance-captain-web-client-headless/src/headless/storefront';

const DEMO_SETTING: HeadlessCartSetting = {
  tm_compute: 1,
  tm_proportion: '2',
  tm_min_protection_val: '1',
  tm_min_variant_id: '0',
  tm_max_protection_val: '20',
  tm_max_variant_id: '0',
  tm_variants: JSON.stringify({1: 0, 5: 0, 10: 0, 20: 0}),
  tm_fixed_ladder: [],
  tm_fixed_val: '1',
  tm_fixed_variant_id: '0',
  tm_product_exclusion: '0',
  exclusion_variants: [],
  exclusion_has_value: false,
  exclusion_type: 0,
  exclusion_countries: [],
  exclusion_locales: [],
  excluded_hide_widget_show: 1,
};

export function CaptainInsuranceDemo({
  cart,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
}) {
  const headlessCart = toHeadlessCart(cart);
  const analysis = analyzeInsuranceCart(headlessCart, DEMO_SETTING);
  const checked = analysis.hasInsuranceVariant;
  const change = buildInsuranceCartChange(analysis, !checked);
  const addVariantId = analysis.quote.variantId;
  const canSubmit = Boolean(addVariantId) && String(addVariantId) !== '0';

  if (!analysis.hasRealProduct || analysis.isHiddenTransportInsurance) return null;

  return (
    <section className="captain-insurance-demo" aria-label="Shipping protection">
      <h4>Shipping Protection</h4>
      <p>
        Demo calculation from extracted headless core:{' '}
        <Money
          data={{
            amount: analysis.quote.price,
            currencyCode: (headlessCart.currency || 'USD') as CurrencyCode,
          }}
        />
      </p>
      {checked ? (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesRemove}
          inputs={{lineIds: change.removeLineIds}}
        >
          <button disabled={!change.removeLineIds.length} type="submit">
            Remove protection
          </button>
        </CartForm>
      ) : (
        <CartForm
          route="/cart"
          action={CartForm.ACTIONS.LinesAdd}
          inputs={{
            lines: canSubmit
              ? [
                  {
                    merchandiseId: variantNumericIdToGid(addVariantId!),
                    quantity: 1,
                  },
                ]
              : [],
          }}
        >
          <button disabled={!canSubmit} type="submit">
            Add protection
          </button>
        </CartForm>
      )}
      {!canSubmit && (
        <small>
          Configure a real insurance product variant in the development store to
          enable cart mutation testing.
        </small>
      )}
    </section>
  );
}
