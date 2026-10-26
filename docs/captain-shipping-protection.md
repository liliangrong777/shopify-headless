# 需求：接入 Captain Shipping Protection（Option A）

状态：已按本文开始执行。

来源：[Integrate Captain Shipping Protection with a Shopify Headless Storefront](https://docs.captaintop.com/integrate-captain-shipping-protection-with-a-shopify-headless-storefront#option-a-react-integration)，采用文档里的 Option A（React widget + controller）。

## 1. 和现有路书的关系

`docs/product-roadmap.md` 把第一版定成一家普通店，明确不接 Captain，并要求删除未引用的保障组件。当前仓库里已经没有 Captain 组件。

本文是第一版之后的插件接入范围。确认开工后只做本文，不回头改第一版「普通店」的其他约定。

## 2. 现成路径

不必从零画保障开关，也不必用 Core SDK 自己管勾选状态。

Captain 官方 React 包已经提供：

- `ShippingProtectionWidget`：标准开关 UI。
- `useShippingProtectionController`：默认勾选、购物车变化后记住选择、发现已有保障行时勾选并清掉、排除购物车时隐藏、结账前重新要最新价格和变体。

安装：

```sh
npm install captain-shipping-protection-react captain-shipping-protection-sdk
```

本仓库要补的是店面适配：把 Hydrogen 购物车映射成 Captain 的 `SdkCartData`，在结账时按 controller 的结果加一行或直接跳转。

Hydrogen 2026.10 默认购物车 fragment 已经带上映射所需字段：购物车 id、`totalQuantity`、`cost.subtotalAmount`、行 id、数量、行总价、变体 id / title / sku、商品 id / title。不必为这次接入再写自定义 `CartFragment`。

购物车数据在客户端 `useCart` 里。Captain 的 `init`、`getInfo`、`prepareCheckout` 只在浏览器里跑，不在服务端渲染时调用。

## 3. 要做到什么

购物车抽屉和 `/cart` 页，在有商品时展示 Captain 标准保障组件。

1. 勾选或取消只记录顾客意愿，不立刻往 Shopify 购物车加行或删行。
2. 购物车里如果已经有 Captain 保障商品，组件保持勾选，并按商品 id 删掉这些行，再刷新购物车。删的是商品 id 匹配的行，因为总价变化后 Captain 可能换成另一个变体。
3. 点 Checkout 时先 `prepareCheckout()`。需要保障时，把返回的 `variantsId` 转成 `gid://shopify/ProductVariant/...`，向当前购物车加 1 件，用这次变更返回的 `checkoutUrl` 立刻跳转。不需要保障时，用当前购物车的 `checkoutUrl` 跳转。
4. 加上保障行之后马上离开本页。不要停在购物车页上把这次加购展示出来，否则 controller 会把刚加的保障行当成「已有保障」再删掉。
5. Captain 请求失败、购物车被排除、或清理已有保障行失败时，顾客仍能结账，这次不带保障。清理失败时按文档展示错误，并允许重试刷新。
6. 空购物车、仅有保障商品、或 Captain 判定排除时，不展示开关。

国家、语言用店面现有配置：`US` / `EN`（`app/lib/shop.ts` 的 `storefrontConfig.i18n`）。货币用当前购物车 `cost.subtotalAmount.currencyCode`。店铺域名用 `getStoreDomain` 得到的 `*.myshopify.com`，传给 controller 的 `shop`。

## 4. 不做

- 不用 Option B 自绘 UI。
- 不改 Shop Pay 按钮。它仍直接去 Shop Pay，这次不经 Captain，也不加保障行。
- 不在商品页、首页或其他页面放开关。
- 不做多市场切换。店面现在没有国家/语言切换器。
- 不在 mock.shop 上假装能算出保障价。mock.shop 没有这家店的 Captain 配置。

## 5. 可行性

能做。React 19 满足官方「React 18 或更高」的要求。购物车读写已经在 Hydrogen cart store 上，`window.Shopify.actions.updateCart` 负责加减行。

约束：

- 店铺后台必须已经配置 Captain Shipping Protection，并且把 Captain Shipping Protection 商品发布到本店面所用的那个 Headless 销售渠道。发到别的 Headless 渠道不够。这一步在 Shopify Admin 做，代码做不到。没发布时，加购常见报错是 merchandise does not exist。
- 本地要连真实已装 Captain 的店（`PUBLIC_STORE_DOMAIN` 为该店域名，并带上 Storefront API token）。连 mock.shop 时开关不会按真实配置出现。
- 金额要换成整数最小货币单位再交给 Captain。美元 `"12.99"` 变成 `1299`。GID 要换成数字 id。
- 结账加保障不能走「更新可见购物车然后留在本页」这条路。Hydrogen 的 cart store 会立刻看到新行，controller 的清理逻辑会把它删掉。加行和跳转必须用同一次变更返回的 checkout URL，并且立刻 `location.assign`。
- 本仓库应用代码里没有 Content-Security-Policy。若上线环境另加了 CSP，`connect-src` 要允许 `https://insurance.captaintop.com`。组件若展示商家配置的外部图标，还要把该图标的源加进 `img-src`。不要为这次接入放开 `*` 或 `'unsafe-inline'`。
- 抽屉和 `/cart` 各有一个 Checkout 链接。两处都要改成同一套结账处理，否则从抽屉结账会绕过保障。

## 6. 怎样算做成

在已链接、已配置 Captain 的真实店上：

1. 符合条件的购物车里，抽屉和 `/cart` 都出现标准保障开关。
2. 来回切换开关，购物车行不变。
3. 勾选后点 Checkout，结账页购物车里有且只有 1 件最新保障变体，然后离开本店面。
4. 取消勾选后点 Checkout，结账页没有保障行。
5. 购物车里预先放着保障行时，打开购物车后该行被清掉，开关保持勾选。
6. 空购物车不显示开关，原有加购和结账仍可用。

## 7. 开工前的默认

不回复就按这些做：

1. 抽屉和 `/cart` 都接。Shop Pay 不接。
2. 用官方 widget，不改它的外观。
3. Captain 失败时允许无保障结账。
4. 国家 `US`、语言 `EN`，货币跟购物车小计。
