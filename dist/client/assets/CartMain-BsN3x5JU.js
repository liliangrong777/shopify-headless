import{p as r,J as v,a as s,C as he,H as ce,v as fe}from"./index-BZDajVce.js";import{I as _e,P as xe,M as oe}from"./ProductPrice-CIP7tn5f.js";function me({layout:e,line:n}){var h;const{id:t,merchandise:i}=n,{product:c,title:o,image:a,selectedOptions:u}=i;return r.jsxs("li",{className:"cart-line",children:[a&&r.jsx(_e,{alt:o,aspectRatio:"1/1",data:a,height:100,loading:"lazy",width:100}),r.jsxs("div",{children:[r.jsx("p",{children:r.jsx("strong",{children:c.title})}),r.jsx(xe,{price:(h=n==null?void 0:n.cost)==null?void 0:h.totalAmount}),r.jsx("ul",{children:u.map(f=>r.jsx("li",{children:r.jsxs("small",{children:[f.name,": ",f.value]})},f.name))}),r.jsx(ge,{line:n})]})]},t)}function ge({line:e}){if(!e||typeof(e==null?void 0:e.quantity)>"u")return null;const{id:n,quantity:t,isOptimistic:i}=e,c=Number(Math.max(0,t-1).toFixed(0)),o=Number((t+1).toFixed(0));return r.jsxs("div",{className:"cart-line-quantity",children:[r.jsxs("small",{children:["Quantity: ",t,"   "]}),r.jsx(te,{lines:[{id:n,quantity:c}],children:r.jsx("button",{"aria-label":"Decrease quantity",disabled:t<=1||!!i,name:"decrease-quantity",value:c,children:r.jsx("span",{children:"− "})})})," ",r.jsx(te,{lines:[{id:n,quantity:o}],children:r.jsx("button",{"aria-label":"Increase quantity",name:"increase-quantity",value:o,disabled:!!i,children:r.jsx("span",{children:"+"})})})," ",r.jsx(be,{lineIds:[n],disabled:!!i})]})}function be({lineIds:e,disabled:n}){return r.jsx(v,{fetcherKey:se(e),route:"/cart",action:v.ACTIONS.LinesRemove,inputs:{lineIds:e},children:r.jsx("button",{disabled:n,type:"submit",children:"Remove"})})}function te({children:e,lines:n}){const t=n.map(i=>i.id);return r.jsx(v,{fetcherKey:se(t),route:"/cart",action:v.ACTIONS.LinesUpdate,inputs:{lines:n},children:e})}function se(e){return[v.ACTIONS.LinesUpdate,...e].join("-")}function $(...e){return e.filter(Boolean).join(" ")}function we(e,n){return`${n} ${e.price}`}function ye(e,n){var i;const t=(i=e==null?void 0:e.translation)==null?void 0:i.content_data;return{claimsGuideUrl:(t==null?void 0:t.claims_guide_url)??(e==null?void 0:e.tm_claims_guide_url)??"",claimsGuideUrlText:(t==null?void 0:t.claims_guide_url_text)??(e==null?void 0:e.tm_claims_guide_url_text)??"",description:n?(t==null?void 0:t.description)??(e==null?void 0:e.tm_description)??"":(t==null?void 0:t.disabled_description)??(e==null?void 0:e.tm_disabled_description)??"",title:(t==null?void 0:t.title)??(e==null?void 0:e.tm_title)??""}}function ve(e,n){const t=e==null?void 0:e.customized_style,i={};return E(i,"--csp-widget-background",t==null?void 0:t.background),E(i,"--csp-widget-border-color",t==null?void 0:t.border_color),A(i,"--csp-widget-border-radius",t==null?void 0:t.widget_corner_radius),A(i,"--csp-widget-border-width",t==null?void 0:t.widget_border_size),A(i,"--csp-widget-padding-x",t==null?void 0:t.widget_horizontal_padding),A(i,"--csp-widget-padding-y",t==null?void 0:t.widget_vertical_padding),E(i,"--csp-title-color",t==null?void 0:t.title),E(i,"--csp-description-color",n?t==null?void 0:t.enable_description:t==null?void 0:t.disable_description),A(i,"--csp-icon-size",t==null?void 0:t.icon_size),A(i,"--csp-icon-radius",t==null?void 0:t.icon_corner_radius),E(i,"--csp-switch-on-color",(t==null?void 0:t.opt_in_action_button)??(e==null?void 0:e.tm_switch_color)),E(i,"--csp-switch-off-color",t==null?void 0:t.opt_out_action_button),i}function E(e,n,t){t&&(e[n]=`#${t}`)}function A(e,n,t){t&&t>0&&(e[n]=`${t}px`)}const je=`
.csp-widget {
    all: revert;
    align-items: center;
    background: var(--csp-widget-background, transparent);
    border: var(--csp-widget-border-width, 0) solid var(--csp-widget-border-color, transparent);
    border-radius: var(--csp-widget-border-radius, 0);
    box-sizing: border-box;
    color: var(--csp-title-color, inherit);
    display: flex;
    font-family: inherit;
    gap: 12px;
    padding: var(--csp-widget-padding-y, 0) var(--csp-widget-padding-x, 0);
    width: 100%;
}

.csp-widget :where(a, button, div, img, input, label, span) {
    all: revert;
    box-sizing: border-box;
    font: inherit;
}

.csp-widget *,
.csp-widget *::before,
.csp-widget *::after {
    box-sizing: border-box;
}

.csp-widget__icon {
    flex: 0 0 auto;
    line-height: 0;
}

.csp-widget__icon--disabled {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
}

.csp-widget__icon img {
    border-radius: var(--csp-icon-radius, 0);
    display: block;
    height: var(--csp-icon-size, auto);
    object-fit: contain;
    width: var(--csp-icon-size, auto);
}

.csp-widget__content {
    flex: 1 1 auto;
    min-width: 0;
}

.csp-widget__main {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
}

.csp-widget__heading {
    align-items: baseline;
    color: var(--csp-title-color, inherit);
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    min-width: 0;
}

.csp-widget__title,
.csp-widget__price {
    font-size: 14px;
    line-height: 1.35;
}

.csp-widget__title {
    font-weight: 600;
}

.csp-widget__description {
    color: var(--csp-description-color, inherit);
    font-size: 12px;
    line-height: 1.4;
    margin-top: 4px;
}

.csp-widget__policy {
    color: #707070;
    font-size: 12px;
    line-height: 1.4;
    margin-top: 4px;
    text-align: left;
}

.csp-widget__policy a {
    color: #2c6ecb;
    cursor: pointer;
    display: block;
    font-size: 12px;
    margin-top: 4px;
    text-decoration: none;
}

.csp-widget__policy a:hover {
    text-decoration: underline;
}

.csp-widget__switch {
    appearance: none;
    -webkit-appearance: none;
    background: var(--csp-switch-off-color, #d1d5db);
    border: 0;
    border-radius: 30px;
    cursor: pointer;
    flex: 0 0 auto;
    height: 20px;
    min-width: 40px;
    overflow: hidden;
    padding: 0;
    position: relative;
    transition: background 0.3s ease;
    width: 40px;
}

.csp-widget__switch--checked {
    background: var(--csp-switch-on-color, #6BCE6A);
}

.csp-widget__switch:disabled,
.csp-widget__checkbox input:disabled + .csp-widget__checkbox-box {
    cursor: not-allowed;
    opacity: 0.6;
}

.csp-widget__switch-knob {
    background: #fff;
    border-radius: 50%;
    display: block;
    height: 14px;
    left: 4px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: left 0.3s ease;
    width: 14px;
    z-index: 1;
}

.csp-widget__switch--checked .csp-widget__switch-knob {
    left: 22px;
}

.csp-widget__switch:focus-visible,
.csp-widget__checkbox input:focus-visible + .csp-widget__checkbox-box {
    box-shadow: 0 0 0 2px #fff;
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

.csp-widget__checkbox {
    cursor: pointer;
    flex: 0 0 auto;
    height: 22px;
    position: relative;
    width: 22px;
}

.csp-widget__checkbox--disabled {
    cursor: not-allowed;
}

.csp-widget__checkbox input {
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    height: 1px;
    margin: 0;
    opacity: 0;
    padding: 0;
    position: absolute;
    width: 1px;
}

.csp-widget__checkbox-box {
    border: 2px solid var(--csp-switch-off-color, #d1d5db);
    border-radius: 4px;
    display: block;
    height: 22px;
    position: relative;
    width: 22px;
}

.csp-widget__checkbox input:checked + .csp-widget__checkbox-box {
    background: var(--csp-switch-on-color, #6BCE6A);
    border-color: var(--csp-switch-on-color, #6BCE6A);
}

.csp-widget__checkbox input:checked + .csp-widget__checkbox-box::after {
    border: solid #fff;
    border-width: 0 2px 2px 0;
    content: "";
    height: 10px;
    left: 7px;
    position: absolute;
    top: 3px;
    transform: rotate(45deg);
    width: 5px;
}
`;function Se({checked:e,className:n,currency:t,disabled:i=!1,info:c,onToggle:o,setting:a}){var d,b;const u=ye(a,e),h=((d=a==null?void 0:a.customized_style)==null?void 0:d.icon_visibility)===1&&!!a.tm_insurance_icon,f=(a==null?void 0:a.tm_is_claims_guide_url)!==!1&&!!u.claimsGuideUrlText,w=((b=a==null?void 0:a.customized_style)==null?void 0:b.select_button)!==0,x=j=>{i||o==null||o(j,c)};return r.jsxs(r.Fragment,{children:[r.jsx("style",{children:je}),r.jsxs("div",{className:$("csp-widget",n),style:ve(a,e),children:[h?r.jsx("div",{className:$("csp-widget__icon",!e&&"csp-widget__icon--disabled"),children:r.jsx("img",{src:a.tm_insurance_icon,alt:"","aria-hidden":"true"})}):null,r.jsxs("div",{className:"csp-widget__content",children:[r.jsxs("div",{className:"csp-widget__main",children:[r.jsxs("div",{className:"csp-widget__heading",children:[r.jsx("span",{className:"csp-widget__title",children:u.title}),r.jsxs("span",{className:"csp-widget__price",children:["(",we(c,t),")"]})]}),w?r.jsx("button",{"aria-checked":e,"aria-label":"Shipping protection switch",className:$("csp-widget__switch",e&&"csp-widget__switch--checked"),disabled:i,role:"switch",type:"button",onClick:()=>x(!e),children:r.jsx("span",{className:"csp-widget__switch-knob"})}):r.jsxs("label",{className:$("csp-widget__checkbox",i&&"csp-widget__checkbox--disabled"),children:[r.jsx("input",{checked:e,disabled:i,type:"checkbox","aria-label":"Shipping protection checkbox",onChange:j=>{x(j.currentTarget.checked)}}),r.jsx("span",{className:"csp-widget__checkbox-box"})]})]}),r.jsx("div",{className:"csp-widget__description",children:u.description}),f?r.jsx("div",{className:"csp-widget__policy",children:u.claimsGuideUrl?r.jsx("a",{href:u.claimsGuideUrl,target:"_blank",rel:"noopener noreferrer",children:u.claimsGuideUrlText}):u.claimsGuideUrlText}):null]})]})]})}const ne="b5efb1a93d2s52d1bf14dc0ccc1b1bb0";async function Ce(e,n){const t=new TextEncoder,i=await crypto.subtle.importKey("raw",t.encode(n),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),c=await crypto.subtle.sign("HMAC",i,t.encode(e));return Array.from(new Uint8Array(c)).map(o=>o.toString(16).padStart(2,"0")).join("")}function ke(e){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";let t="";for(let i=0;i<e;i+=1)t+=n[Math.floor(Math.random()*n.length)];return t}async function ae(e){const n={nonce:ke(6),s2t:Math.floor(Date.now()/1e3).toString(),shop_url:e},t=Object.keys(n).sort().map(c=>`${c}=${n[c]}`).join("&"),i=await Ce(`${t}&key=${ne}`,ne);return{nonce:n.nonce,s2t:n.s2t,sign:i}}async function Ie(e){const n=await ae(e);return`&s2t=${n.s2t}&nonce=${n.nonce}&sign=${encodeURIComponent(n.sign)}`}async function Ne(e){const n=await ae(e);return{nonce:n.nonce,s2t:Number(n.s2t),sign:n.sign}}const Pe="https://insurance.captaintop.com";function J(e,n,t){t&&e.set(n,t)}async function de(e){if(!e.ok)throw new Error(`ShippingProtection SDK request failed: ${e.status}`);return e.json()}function Ee(e){return{shop:e.shop,country:e.country,locale:e.locale,currency:e.currency,apiBaseUrl:Pe}}async function Ae(e){const n=new URLSearchParams({shop_url:e.shop});J(n,"country",e.country),J(n,"locale",e.locale),J(n,"currency",e.currency);const t=await Ie(e.shop),i=await de(await fetch(`${e.apiBaseUrl}/api/v1/getCartSettingByShopUrl?${n.toString()}${t}`,{headers:{"content-type":"application/json"},method:"get"}));if(i.code!==200||!i.data)throw new Error("ShippingProtection SDK failed to load cart setting");return i.data}async function Re(e,n,t){const i=e.items.filter(c=>String(c.product_id)!==String(n.tm_product_exclusion)).map(c=>({product_id:c.product_id,variant_id:c.variant_id,title:c.title??c.product_title??"",sku:String(c.sku??"")}));return de(await fetch(`${t.apiBaseUrl}/api/v1/checkDisplay`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({shop_url:t.shop,line_items:i,country:t.country,locale:t.locale,...await Ne(t.shop)})}))}function Me(e){if(typeof e!="string")return e;try{const n=JSON.parse(e);return n&&typeof n=="object"?n:{}}catch{return{}}}function Ue(e,n){if(n.tm_compute===1){const t=Number(n.tm_proportion),i=e*(t/100),c=Number(n.tm_min_protection_val),o=Number(n.tm_max_protection_val);if(i<c)return{price:String(n.tm_min_protection_val),variantId:String(n.tm_min_variant_id)};if(i>o)return{price:String(n.tm_max_protection_val),variantId:String(n.tm_max_variant_id)};const a=Me(n.tm_variants),u=Object.keys(a).map(Number).filter(Number.isFinite).sort((h,f)=>h-f).find(h=>h>=i);if(u!=null)return{price:String(u),variantId:String(a[String(u)])}}else{const t=n.tm_fixed_ladder.filter(i=>Number(i.min_value)<=e&&e<=Number(i.max_value)).sort((i,c)=>Number(c.insurance_price)-Number(i.insurance_price))[0];if(t)return{price:String(t.insurance_price),variantId:String(t.variant_id)}}return{price:String(n.tm_fixed_val),variantId:String(n.tm_fixed_variant_id)}}function q(e,n){return new Set(n.map(String)).has(e)}function Oe(e,n){if(!n.exclusion_has_value)return{code:200,data:{show:!0,excluded_product_ids:[]}};if(n.exclusion_type===1||n.exclusion_type===2){const t=e.items.filter(i=>String(i.product_id)!==String(n.tm_product_exclusion)).filter(i=>q(String(i.variant_id),n.exclusion_variants)).map(i=>String(i.product_id));return{code:200,data:{show:!(n.excluded_hide_widget_show===1&&t.length>0),excluded_product_ids:t}}}return{code:200,data:{show:!0,excluded_product_ids:[]}}}function Le(e){return(e==null?void 0:e.code)===200&&e.data!=null?{show:!!e.data.show,reason:e.data.reason,excludedProductIds:Array.isArray(e.data.excluded_product_ids)?e.data.excluded_product_ids.map(String):[]}:{show:!0,reason:void 0,excludedProductIds:[]}}function Te(e,n,t=Oe(e,n)){const i=e.items.some(p=>String(p.product_id)===String(n.tm_product_exclusion)),c=(p,g,k)=>({productId:n.tm_product_exclusion,variantsId:p.variantId,price:p.price,includedProtection:i,isExcluded:g,...k?{excludedReason:k}:{}}),o={price:n.tm_fixed_val,variantId:n.tm_fixed_variant_id};if(!e.items.length)return c(o,!0,"empty_cart");if(e.items.some(p=>!p.product_id))return c(o,!0,"invalid_cart");if(!e.items.some(p=>String(p.product_id)!==String(n.tm_product_exclusion)))return c(o,!0,"only_shipping_protection");const u=e.items.find(p=>String(p.product_id)===String(n.tm_product_exclusion)),h=Le(t),f=new Set(h.excludedProductIds),w=p=>f.has(String(p)),x=()=>{let p=Number(e.total_price);if(u&&(p-=Number(u.final_line_price??0)),n.excluded_hide_widget_show===2)return e.items.filter(g=>String(g.product_id)!==String(n.tm_product_exclusion)&&!q(String(g.variant_id),n.exclusion_variants)&&!w(g.product_id)).reduce((g,k)=>g+Number(k.final_line_price??0),0);for(const g of e.items)w(g.product_id)&&(p-=Number(g.final_line_price??0));return p},{price:d,variantId:b}=Ue(x()/100,n),j=e.items.some(p=>q(String(p.variant_id),n.exclusion_variants)||i&&e.items.length===1),y=n.excluded_hide_widget_show===2?!e.items.some(g=>!q(String(g.variant_id),n.exclusion_variants)||i&&e.items.length===1)&&j:j,C=!h.show,R=(()=>{if(C)return h.reason||"check_display_hidden";if(y)return"excluded_variant"})();return c({price:d,variantId:b},y||C,R)}class Ge{constructor(){this.setting=null,this.context=null}async init(n){this.context=Ee(n),this.setting=await Ae(this.context)}async getInfo(n){if(!this.setting||!this.context)throw new Error("ShippingProtection SDK has not been initialized. Call init() before getInfo().");let t;if(this.setting.exclusion_has_value&&this.setting.exclusion_type===3)try{t=await Re(n.cartData,this.setting,this.context)}catch{t=null}return Te(n.cartData,this.setting,t)}}const F=new Ge;function Be({initParams:e}){const{init:n,initOver:t}=De(e),{getInfo:i}=$e();return{getInfo:i,init:n,initOver:t,sdk:F,setting:F.setting}}function De(e){const[n,t]=s.useState(!1);return s.useEffect(()=>{t(!1)},[e.shop,e.country,e.locale,e.currency]),{init:s.useMemo(()=>async()=>{t(!1),await F.init({shop:e.shop,country:e.country,locale:e.locale,currency:e.currency}),t(!0)},[e.shop,e.country,e.locale,e.currency]),initOver:n}}function $e(){return{getInfo:s.useMemo(()=>n=>F.getInfo({cartData:n}),[])}}function qe({cart:e,country:n,currency:t,locale:i,onInfoChange:c,onToggle:o,removeProtection:a,shop:u}){const[h,f]=s.useState(!1),[w,x]=s.useState(null),[d,b]=s.useState(null),[j,_]=s.useState(!1),[y,C]=s.useState(!1),[R,p]=s.useState(null),[g,k]=s.useState(!1),[Q,W]=s.useState(!1),O=s.useMemo(()=>({current:h}),[]),Y=s.useMemo(()=>({current:d}),[]),L=s.useMemo(()=>({current:!1}),[]),M=s.useMemo(()=>({current:!1}),[]),N=s.useMemo(()=>({current:!0}),[]),V=s.useMemo(()=>({current:null}),[]),T=s.useMemo(()=>({current:c}),[]),G=s.useMemo(()=>({current:o}),[]),X=s.useMemo(()=>({current:a}),[]),P=s.useMemo(()=>({current:0}),[]),B=s.useMemo(()=>({current:g}),[]),D=s.useMemo(()=>({current:Q}),[]);O.current=h,Y.current=d,T.current=c,G.current=o,X.current=a,B.current=g,D.current=Q;const S=Be({initParams:{shop:u,country:n,locale:i,currency:t}}),I=s.useMemo(()=>l=>{O.current=l,f(l)},[]),le=s.useMemo(()=>async(l,m=Y.current)=>{var ee;if(!m||D.current)return;const H=O.current;D.current=!0,W(!0),I(l);try{await((ee=G.current)==null?void 0:ee.call(G,l,m))}catch{I(H)}finally{D.current=!1,W(!1)}},[I]),Z=s.useMemo(()=>l=>{var m;if(Ke(V.current,l)){V.current=l;try{(m=T.current)==null||m.call(T,l)}catch{}}},[]),z=s.useMemo(()=>async l=>{const m=X.current;if(!m)return N.current=!1,!1;if(M.current||B.current)return N.current;M.current=!0,N.current=!1,B.current=!0,k(!0),p(null);try{return await m(l),N.current=!0,!0}catch(H){return M.current=!1,p(H),!1}finally{B.current=!1,k(!1)}},[]),U=s.useMemo(()=>async()=>{if(!S.initOver)return null;const l=P.current+1;P.current=l,_(!0);try{const m=await S.getInfo(e);return l!==P.current||(b(m),x(null),Z(m),m.includedProtection?(L.current=!0,I(!0),await z(m)):(M.current=!1,N.current=!0,p(null),!L.current&&!m.isExcluded?(L.current=!0,I(Fe(S.sdk.setting))):m.isExcluded&&I(!1)),l!==P.current)?null:m}catch(m){return l!==P.current||(b(null),x(m)),null}finally{l===P.current&&_(!1)}},[e,Z,S.getInfo,S.initOver,S.sdk.setting,z,I]),pe=s.useMemo(()=>async()=>{const l=await U();return!l||!O.current||l.isExcluded||!N.current?null:l},[U]);return s.useEffect(()=>{let l=!1;return P.current+=1,L.current=!1,M.current=!1,N.current=!0,V.current=null,b(null),_(!1),C(!0),p(null),I(!1),S.init().then(()=>{l||x(null)}).catch(m=>{l||(b(null),x(m))}).finally(()=>{l||C(!1)}),()=>{l=!0}},[S.init,I]),s.useEffect(()=>{if(!S.initOver)return;let l=!1;return U().then(()=>{}),()=>{l=!0}},[S.initOver,U]),{checked:h,error:w,excludedReason:d==null?void 0:d.excludedReason,info:d,infoPending:j,initPending:y,prepareCheckout:pe,refresh:U,removeError:R,removePending:g,sdk:S.sdk,setting:S.setting,toggle:le,togglePending:Q,visible:!w&&!!d&&!d.isExcluded}}function Fe(e){return(e==null?void 0:e.tm_default_display_status)===1}function Ke(e,n){return!e||e.productId!==n.productId||e.variantsId!==n.variantsId||e.price!==n.price||e.includedProtection!==n.includedProtection||e.isExcluded!==n.isExcluded||e.excludedReason!==n.excludedReason}function Qe(e){return Se(e)}function Ve({cart:e,checkoutUrl:n}){const t=he("root"),i=s.useMemo(()=>We(e),[e]);return!i||!(t!=null&&t.publicStoreDomain)?r.jsx(ue,{checkoutUrl:n}):r.jsx(He,{cart:e,checkoutUrl:n,sdkCart:i,shop:t.publicStoreDomain})}function He({cart:e,checkoutUrl:n,sdkCart:t,shop:i}){const c=ce(),o=s.useRef(null),[a,u]=s.useState(!1),[h,f]=s.useState("idle"),[w,x]=s.useState(null),d=qe({cart:t,shop:i,locale:"en",currency:t.currency,country:"US",removeProtection:async _=>{const y=Ye(e,_);y.length&&await b(v.ACTIONS.LinesRemove,{lineIds:y})}});s.useEffect(()=>{var y,C;if(c.state!=="idle"||!o.current)return;const _=o.current;if(o.current=null,(C=(y=c.data)==null?void 0:y.errors)!=null&&C.length){console.error("Captain shipping protection cart mutation failed",c.data),_.reject(new Error("Captain shipping protection cart mutation failed"));return}_.resolve(c.data??{})},[c.data,c.state]),s.useEffect(()=>()=>{var _;(_=o.current)==null||_.reject(new Error("Captain shipping protection cart mutation was cancelled")),o.current=null},[]);function b(_,y,C={}){return o.current?Promise.reject(new Error("Captain shipping protection cart mutation already pending")):new Promise((R,p)=>{o.current={resolve:R,reject:p};const g={[v.INPUT_NAME]:JSON.stringify({action:_,inputs:y})};C.redirectToCheckout&&(g.redirectToCheckout="true"),c.submit(g,{action:"/cart",method:"POST"}).catch(k=>{o.current&&(o.current=null,p(k))})})}async function j(){if(!(!n||a||d.removePending)){u(!0),f("preparing"),x(null);try{const _=await d.prepareCheckout();if(!_){f("redirecting"),window.location.assign(n);return}f("adding"),await b(v.ACTIONS.LinesAdd,{lines:[{merchandiseId:Ze(_.variantsId),quantity:1}]},{redirectToCheckout:!0})}catch(_){x(_)}finally{u(!1),f("idle")}}}return r.jsxs(r.Fragment,{children:[d.visible&&d.info?r.jsx(Qe,{checked:d.checked,className:"cart-protection-demo",currency:t.currency,disabled:d.togglePending||d.removePending,info:d.info,setting:d.setting,onToggle:(_,y)=>{d.toggle(_,y)}}):null,d.removeError?r.jsx("small",{children:"Unable to refresh shipping protection. Please try again."}):null,w?r.jsx("small",{children:"Unable to prepare checkout. Please try again."}):null,r.jsx(ue,{checkoutUrl:n,disabled:a||d.infoPending||d.initPending||d.removePending,pending:a,pendingLabel:Je(h),onCheckout:()=>{j()}})]})}function ue({checkoutUrl:e,disabled:n=!1,onCheckout:t,pending:i=!1,pendingLabel:c="Preparing Checkout..."}){return e?r.jsxs("div",{children:[r.jsx("a",{"aria-disabled":n,href:e,onClick:o=>{t&&(o.preventDefault(),n||t())},children:r.jsx("p",{children:i?c:"Continue to Checkout →"})}),r.jsx("br",{})]}):null}function Je(e){switch(e){case"preparing":return"Preparing protection...";case"adding":return"Adding protection...";case"redirecting":return"Opening checkout...";default:return"Preparing Checkout..."}}function We(e){var c,o,a,u,h,f,w;const n=((c=e==null?void 0:e.lines)==null?void 0:c.nodes)??[],t=((a=(o=e==null?void 0:e.cost)==null?void 0:o.subtotalAmount)==null?void 0:a.currencyCode)??"USD";if(!(e!=null&&e.id)||!n.length)return null;const i=[];for(const x of n){const d=x.merchandise,b=K(d.id),j=K(d.product.id);!b||!j||i.push({id:Number(b),key:x.id,quantity:x.quantity,variant_id:Number(b),product_id:Number(j),final_line_price:re((h=(u=x.cost)==null?void 0:u.totalAmount)==null?void 0:h.amount),product_title:d.product.title,title:d.title,sku:""})}return{token:e.id,currency:t,total_price:re((w=(f=e.cost)==null?void 0:f.subtotalAmount)==null?void 0:w.amount),item_count:e.totalQuantity??n.length,items:i}}function Ye(e,n){return Xe(e,n).map(t=>t.id)}function Xe(e,n){var c;const t=String(n.productId),i=String(n.variantsId);return(((c=e==null?void 0:e.lines)==null?void 0:c.nodes)??[]).filter(o=>{const a=K(o.merchandise.product.id),u=K(o.merchandise.id);return a===t||u===i})}function K(e){return(e==null?void 0:e.split("/").pop())??""}function Ze(e){return`gid://shopify/ProductVariant/${e}`}function re(e){return Math.round(Number(e??0)*100)}function ze({cart:e,layout:n}){var i,c,o;const t=n==="page"?"cart-summary-page":"cart-summary-aside";return r.jsxs("div",{"aria-labelledby":"cart-summary",className:t,children:[r.jsx("h4",{children:"Totals"}),r.jsxs("dl",{className:"cart-subtotal",children:[r.jsx("dt",{children:"Subtotal"}),r.jsx("dd",{children:(c=(i=e==null?void 0:e.cost)==null?void 0:i.subtotalAmount)!=null&&c.amount?r.jsx(oe,{data:(o=e==null?void 0:e.cost)==null?void 0:o.subtotalAmount}):"-"})]}),r.jsx(et,{discountCodes:e==null?void 0:e.discountCodes}),r.jsx(tt,{giftCardCodes:e==null?void 0:e.appliedGiftCards}),r.jsx(Ve,{cart:e,checkoutUrl:e==null?void 0:e.checkoutUrl})]})}function et({discountCodes:e}){var t;const n=((t=e==null?void 0:e.filter(i=>i.applicable))==null?void 0:t.map(({code:i})=>i))||[];return r.jsxs("div",{children:[r.jsx("dl",{hidden:!n.length,children:r.jsxs("div",{children:[r.jsx("dt",{children:"Discount(s)"}),r.jsx(ie,{children:r.jsxs("div",{className:"cart-discount",children:[r.jsx("code",{children:n==null?void 0:n.join(", ")})," ",r.jsx("button",{children:"Remove"})]})})]})}),r.jsx(ie,{discountCodes:n,children:r.jsxs("div",{children:[r.jsx("input",{type:"text",name:"discountCode",placeholder:"Discount code"})," ",r.jsx("button",{type:"submit",children:"Apply"})]})})]})}function ie({discountCodes:e,children:n}){return r.jsx(v,{route:"/cart",action:v.ACTIONS.DiscountCodesUpdate,inputs:{discountCodes:e||[]},children:n})}function tt({giftCardCodes:e}){const n=s.useRef([]),t=s.useRef(null),i=ce({key:"gift-card-add"});s.useEffect(()=>{i.data&&(t.current.value="")},[i.data]);function c(o){const a=o.replace(/\s/g,"");n.current.includes(a)||n.current.push(a)}return r.jsxs("div",{children:[e&&e.length>0&&r.jsxs("dl",{children:[r.jsx("dt",{children:"Applied Gift Card(s)"}),e.map(o=>r.jsx(rt,{giftCardId:o.id,children:r.jsxs("div",{className:"cart-discount",children:[r.jsxs("code",{children:["***",o.lastCharacters]})," ",r.jsx(oe,{data:o.amountUsed})," ",r.jsx("button",{type:"submit",children:"Remove"})]})},o.id))]}),r.jsx(nt,{giftCardCodes:n.current,saveAppliedCode:c,fetcherKey:"gift-card-add",children:r.jsxs("div",{children:[r.jsx("input",{type:"text",name:"giftCardCode",placeholder:"Gift card code",ref:t})," ",r.jsx("button",{type:"submit",disabled:i.state!=="idle",children:"Apply"})]})})]})}function nt({giftCardCodes:e,saveAppliedCode:n,fetcherKey:t,children:i}){return r.jsx(v,{fetcherKey:t,route:"/cart",action:v.ACTIONS.GiftCardCodesUpdate,inputs:{giftCardCodes:e||[]},children:c=>{var a;const o=(a=c.formData)==null?void 0:a.get("giftCardCode");return o&&n&&n(o),i}})}function rt({giftCardId:e,children:n}){return r.jsx(v,{route:"/cart",action:v.ACTIONS.GiftCardCodesRemove,inputs:{giftCardCodes:[e]},children:n})}function at({layout:e,cart:n}){var u,h,f,w,x;const t=fe(n),i=!!((h=(u=t==null?void 0:t.lines)==null?void 0:u.nodes)!=null&&h.length),o=`cart-main ${t&&!!((w=(f=t==null?void 0:t.discountCodes)==null?void 0:f.filter(d=>d.applicable))!=null&&w.length)?"with-discount":""}`,a=t!=null&&t.totalQuantity?t.totalQuantity>0:!1;return r.jsxs("div",{className:o,children:[r.jsx(it,{hidden:i,layout:e}),r.jsxs("div",{className:"cart-details",children:[r.jsx("div",{"aria-labelledby":"cart-lines",children:r.jsx("ul",{children:(((x=t==null?void 0:t.lines)==null?void 0:x.nodes)??[]).map(d=>r.jsx(me,{line:d,layout:e},d.id))})}),a&&r.jsx(ze,{cart:t,layout:e})]})]})}function it({hidden:e=!1}){return r.jsxs("div",{hidden:e,children:[r.jsx("br",{}),r.jsx("p",{children:"Your cart is empty. Add a product from the homepage to test the cart."})]})}export{at as C};
