import {CartForm, Image} from '@shopify/hydrogen';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {ProductPrice} from '~/components/ProductPrice';
import {useAside} from '~/components/Aside';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Captain Insurance | Storefront cart test'},
    {
      name: 'description',
      content: 'Storefront API product list and cart test page.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const {products} = await storefront.query(HOMEPAGE_PRODUCTS_QUERY, {
    cache: storefront.CacheShort(),
    variables: {
      first: 12,
    },
  });

  return {products};
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <section className="home-hero">
        <p className="eyebrow">Captain Insurance compatibility demo</p>
        <h1>Storefront API cart test</h1>
        <p>
          This single-page storefront loads live Shopify products and lets you
          add variants to the cart for Captain Insurance integration testing.
        </p>
      </section>

      <section className="products-grid" aria-label="Products">
        {products.nodes.map((product) => {
          const variant = product.variants.nodes[0];
          const image = product.featuredImage;
          const canAdd = Boolean(variant?.id && variant.availableForSale);

          return (
            <article className="product-item" key={product.id}>
              {image ? (
                <Image
                  alt={image.altText || product.title}
                  aspectRatio="1/1"
                  data={image}
                  loading="lazy"
                  sizes="(min-width: 45em) 25vw, 50vw"
                />
              ) : (
                <div className="product-image-placeholder" />
              )}
              <div className="product-card-body">
                <p className="product-vendor">{product.vendor}</p>
                <h2>{product.title}</h2>
                <ProductPrice
                  price={variant?.price}
                  compareAtPrice={variant?.compareAtPrice}
                />
                <AddToCartButton
                  availableForSale={canAdd}
                  merchandiseId={variant?.id}
                />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function AddToCartButton({
  availableForSale,
  merchandiseId,
}: {
  availableForSale: boolean;
  merchandiseId?: string;
}) {
  const {open} = useAside();

  if (!merchandiseId) {
    return (
      <button className="add-to-cart" disabled type="button">
        Unavailable
      </button>
    );
  }

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: [
          {
            merchandiseId,
            quantity: 1,
          },
        ],
      }}
    >
      <button
        className="add-to-cart"
        disabled={!availableForSale}
        onClick={() => open('cart')}
        type="submit"
      >
        {availableForSale ? 'Add to cart' : 'Sold out'}
      </button>
    </CartForm>
  );
}

const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query HomepageProducts(
    $country: CountryCode
    $first: Int!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        vendor
        handle
        featuredImage {
          id
          url
          altText
          width
          height
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
` as const;
