"use strict";(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[136],{34777:(e,t,n)=>{n.r(t),n.d(t,{ApiCtx:()=>z,ApiCtxRoot:()=>U,DEFAULT_AUX:()=>T,DEFAULT_DECIMALS:()=>P,DEFAULT_SS58:()=>Z,api:()=>H});var a=n(52322),s=n(71066),i=n(2784),r=n(23729),o=n.n(r),l=n(1719),c=n(21899),d=n(86613),u=n(36733),m=n(3919),h=n(16265),p=n(20525),g=n(345),f=n(39764),b=n(86135),x=n(47564),v=n(11677);const A=(0,x.Rf)(((e,t)=>t||e)),w=(0,v.e)("useEndpoint",(function(e){return(0,i.useMemo)((()=>function(e){return A.find((({value:t})=>t===e))||null}(e)),[e])}));var y=n(18837);class j{#e;#t;#n;constructor(e,t,n){this.#e=t,this.#t=n,this.#n=e}async signPayload(e){return new Promise(((t,n)=>{this.#e(this.#n,e,((e,a)=>{a?t(a):n(new Error("Unable to sign"))}))}))}update(e,t){t instanceof this.#n.createClass("Hash")?this.#t(e,"sent",t.toHex()):this.#t(e,t.status.type.toLowerCase(),t)}}var k=n(69187),N=n(16039),C=n(33403),E=n(92730),S=n(30495),I=n(11147),D=n(65968),B=n(68145),L=n(36956),$=n(23802),V=n(81369);const P=$.default.createType("u32",12),Z=$.default.createType("u32",B.c.prefix),T=["Aux1","Aux2","Aux3","Aux4","Aux5","Aux6","Aux7","Aux8","Aux9"],z=i.createContext({}),M=[],F={hasInjectedAccounts:!1,isApiReady:!1};let H;async function R(e){try{return await e,(await(0,g.vK)()).map((({address:e,meta:t},n)=>({address:e,meta:(0,C.Z)({},t,{name:`${t.name||"unknown"} (${"polkadot-js"===t.source?"extension":t.source})`,whenCreated:n})})))}catch(e){return console.error("web3Accounts",e),[]}}function U({apiUrl:e,children:t,isElectron:r,store:x}){const{queuePayload:v,queueSetTxStatus:A}=(0,b.L)(),[B,U]=(0,i.useState)(F),[q,O]=(0,i.useState)(!1),[W,Q]=(0,i.useState)(!1),[K,G]=(0,i.useState)(null),[J,Y]=(0,i.useState)(),X=w(e),_=(0,i.useMemo)((()=>X&&X.valueRelay&&(0,D.h)(X.paraId)&&X.paraId<2e3?X.valueRelay:null),[X]),ee=(0,y.J)(_),te=(0,i.useMemo)((()=>function(e,t){return(n,a)=>`${t?"https://polkadot.js.org/apps/":`${window.location.origin}${window.location.pathname}`}?rpc=${encodeURIComponent(a||e)}#${n}`}(e,r)),[e,r]),ne=(0,i.useMemo)((()=>(0,C.Z)({},B,{api:H,apiEndpoint:X,apiError:K,apiRelay:ee,apiUrl:e,createLink:te,extensions:J,isApiConnected:q,isApiInitialized:W,isElectron:r,isWaitingInjected:!J})),[K,te,J,q,W,r,B,X,ee,e]);return(0,i.useEffect)((()=>{const t=e=>{console.error(e),G(e.message)};(async function(e,t,a){const i=function(){const e=(0,V.decodeUrlTypes)()||o().get("types",{}),t=Object.keys(e);return t.length&&console.log("Injected types:",t.join(", ")),e}(),r=e.startsWith("light://");try{const a=r?await async function(e){const[t,a,i]=e.split("/");if("substrate-connect"!==t)throw new Error(`Cannot connect to non substrate-connect protocol ${e}`);if(!L.relaySpecs[a]||i&&(!L.lightSpecs[a]||!L.lightSpecs[a][i]))throw new Error(`Unable to construct light chain ${e}`);const r=new l.x(s,L.relaySpecs[a]);if(!i)return r;const o=await n(29038)(`${L.lightSpecs[a][i]}`);return new l.x(s,JSON.stringify(o.default),r)}(e.replace("light://","")):new c.U(e);H=new d.G({provider:a,registry:$.default,signer:t,types:i,typesBundle:p.UD}),r&&await a.connect()}catch(e){a(e)}return i})(e,new j($.default,v,A),t).then((e=>{H.on("connected",(()=>O(!0))),H.on("disconnected",(()=>O(!1))),H.on("error",t),H.on("ready",(()=>{const n=(0,g.$y)("polkadot-js/apps");n.then(Y).catch(console.error),async function(e,t,n,a,s){$.default.register(s);const{injectedAccounts:i,properties:r,systemChain:o,systemChainType:l,systemName:c,systemVersion:d}=await async function(e,t){const[n,a,s,i,r]=await Promise.all([e.rpc.system.chain(),e.rpc.system.chainType?e.rpc.system.chainType():Promise.resolve($.default.createType("ChainType","Live")),e.rpc.system.name(),e.rpc.system.version(),R(t)]);return{injectedAccounts:r.filter((({meta:{source:e}})=>!M.includes(e))),properties:$.default.createType("ChainProperties",{ss58Format:e.registry.chainSS58,tokenDecimals:e.registry.chainDecimals,tokenSymbol:e.registry.chainTokens}),systemChain:(n||"<unknown>").toString(),systemChainType:a,systemName:s.toString(),systemVersion:i.toString()}}(e,n),p=r.ss58Format.unwrapOr(Z).toNumber(),g=-1===N.X.prefix?p:N.X.prefix,b=r.tokenSymbol.unwrapOr([E.a.getDefaults().unit,...T]),x=r.tokenDecimals.unwrapOr([P]),v=h.W.includes(e.runtimeVersion.specName.toString()),A=l.isDevelopment||l.isLocal||(0,S.s)(o);console.log(`chain: ${o} (${l.toString()}), ${(0,I.P)(r)}`),$.default.setChainProperties($.default.createType("ChainProperties",{ss58Format:g,tokenDecimals:x,tokenSymbol:b})),E.a.setDefaults({decimals:x.map((e=>e.toNumber())),unit:b[0].toString()}),f.k.setAbbr(b[0].toString()),function(){try{return!!k.Nn.keyring}catch{return!1}}()||k.Nn.loadAll({genesisHash:e.genesisHash,genesisHashAdd:t&&(0,D.h)(t.paraId)&&t.paraId<2e3&&t.genesisHashRelay?[t.genesisHashRelay]:[],isDevelopment:A,ss58Format:g,store:a,type:v?"ethereum":"ed25519"},i);const w=Object.keys(e.tx)[0],y=Object.keys(e.tx[w])[0],j=e.tx[w][y],C=e.tx.system&&e.tx.system.setCode||j;return(0,u.u)(e.genesisHash.toHex(),m.A),{apiDefaultTx:j,apiDefaultTxSudo:C,chainSS58:p,hasInjectedAccounts:0!==i.length,isApiReady:!0,isDevelopment:A,isEthereum:v,specName:e.runtimeVersion.specName.toString(),specVersion:e.runtimeVersion.specVersion.toString(),systemChain:o,systemName:c,systemVersion:d}}(H,X,n,x,e).then(U).catch(t)})),Q(!0)})).catch(t)}),[X,e,v,A,x]),ne.isApiInitialized?(0,a.jsx)(z.Provider,{value:ne,children:t}):null}},94356:(e,t,n)=>{n.r(t),n.d(t,{default:()=>o});var a=n(52322),s=n(2784),i=n(48731),r=n(34777);function o(e,t={}){class n extends s.PureComponent{component=s.createRef();render(){return(0,a.jsx)(r.ApiCtx.Consumer,{children:n=>((0,i.hu)(n&&n.api,"Application root must be wrapped inside 'react-api/Api' to provide API context"),(0,a.jsx)(e,{...t,...n,...this.props,ref:this.component}))})}}return n}},98727:(e,t,n)=>{n.r(t),n.d(t,{default:()=>g});var a=n(52322),s=n(2784),i=n(17965),r=n(1346),o=n(17751),l=n(48731),c=n(80522),d=n(41186),u=n(94356);const m=()=>{},h=()=>!1,p={};function g(e,{at:t,atProp:n,callOnResult:g,fallbacks:f,isMulti:b=!1,paramName:x,paramPick:v,paramValid:A=!1,params:w=[],propName:y,skipIf:j=h,transform:k=c.default,withIndicator:N=!1}={}){return c=>{class h extends s.Component{state={callResult:void 0,callUpdated:!1,callUpdatedAt:0};destroy;isActive=!1;propName;timerId=-1;constructor(t){super(t);const[,n,a]=e.split(".");this.propName=`${n}_${a}`}componentDidUpdate(e){const t=this.getParams(e),n=this.getParams(this.props);this.isActive&&!(0,d.isEqual)(n,t)&&this.subscribe(n).then(m).catch(m)}componentDidMount(){this.isActive=!0,N&&(this.timerId=window.setInterval((()=>{const e=Date.now()-(this.state.callUpdatedAt||0)<=1500;e!==this.state.callUpdated&&this.nextState({callUpdated:e})}),500)),(0,i.Y)((()=>{this.subscribe(this.getParams(this.props)).then(m).catch(m)}))}componentWillUnmount(){this.isActive=!1,this.unsubscribe().then(m).catch(m),-1!==this.timerId&&clearInterval(this.timerId)}nextState(e){this.isActive&&this.setState(e)}getParams(e){const a=v?v(e):x?e[x]:void 0;return n&&(t=e[n]),!A&&x&&((0,r.o)(a)||(0,o.F)(a))?[!1,[]]:[!0,(0,r.o)(a)?w:w.concat(Array.isArray(a)&&!a.toU8a?a:[a])]}constructApiSection=e=>{const{api:n}=this.props,[a,s,i,...r]=e.split(".");return(0,l.hu)(a.length&&s.length&&i.length&&0===r.length,`Invalid API format, expected <area>.<section>.<method>, found ${e}`),(0,l.hu)(["consts","rpc","query","derive"].includes(a),`Unknown api.${a}, expected consts, rpc, query or derive`),(0,l.hu)(!t||"query"===a,"Only able to do an 'at' query on the api.query interface"),[n[a][s],a,s,i]};getApiMethod(t){if("subscribe"===e){const[e,...n]=t;return[e,n,"subscribe"]}const n=[e].concat(f||[]).map(this.constructApiSection),[a,s,i,c]=n.find((([e])=>!!e))||[{},n[0][1],n[0][2],n[0][3]];(0,l.hu)(a&&a[c],`Unable to find api.${s}.${i}.${c}`);const d=a[c].meta;if("query"===s&&d?.type.isMap){const e=t[0];(0,l.hu)(!(0,r.o)(e)&&!(0,o.F)(e)||d.type.asMap.kind.isLinkedMap,`${d.name} expects one argument`)}return[a[c],t,c.startsWith("subscribe")?"subscribe":s]}async subscribe([a,s]){if(!a||j(this.props))return;const{api:i}=this.props;let r;await i.isReady;try{(0,l.hu)(t||!n,"Unable to perform query on non-existent at hash"),r=this.getApiMethod(s)}catch(t){p[t.message]||(console.warn(e,"::",t),p[t.message]=!0)}if(!r)return;const[o,c,d]=r,u=e=>this.triggerUpdate(this.props,e);await this.unsubscribe();try{["derive","subscribe"].includes(d)||"query"===d&&!t&&!n?this.destroy=b?await o.multi(c,u):await o(...c,u):u("consts"===d?o:t?await o.at(t,...c):await o(...c))}catch{}}async unsubscribe(){this.destroy&&(this.destroy(),this.destroy=void 0)}triggerUpdate(e,t){try{const n=(e.transform||k)(t);if(!this.isActive||(0,d.isEqual)(n,this.state.callResult))return;(0,d.triggerChange)(n,g,e.callOnResult),this.nextState({callResult:n,callUpdated:!0,callUpdatedAt:Date.now()})}catch{}}render(){const{callResult:e,callUpdated:t,callUpdatedAt:n}=this.state,s={...this.props,callUpdated:t,callUpdatedAt:n};return(0,r.o)(e)||(s[y||this.propName]=e),(0,a.jsx)(c,{...s})}}return(0,u.default)(h)}}},3364:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i});var a=n(52322),s=(n(2784),n(98727));function i(e,t={}){return(n,i={})=>(0,s.default)(e,{...t,propName:"callResult"})((function({callResult:e,callUpdated:t,children:s,className:r=i.className,label:o=""}){return(0,a.jsxs)("div",{...i,className:[r||"",t?"rx--updated":void 0].join(" "),children:[o,n(e),s]})}))}},5246:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});var a=n(98727);function s(...e){return t=>e.reverse().reduce(((e,t)=>Array.isArray(t)?(0,a.default)(...t)(e):(0,a.default)(t)(e)),t)}},69356:(e,t,n)=>{n.r(t),n.d(t,{onlyOnApp:()=>c.onlyOnApp,onlyOnWeb:()=>c.onlyOnWeb,withApi:()=>a.default,withCall:()=>s.default,withCallDiv:()=>r.default,withCalls:()=>i.default,withMulti:()=>o.default,withObservable:()=>l.default});var a=n(94356),s=n(98727),i=n(5246),r=n(3364),o=n(60028),l=n(33989),c=n(35475)},60028:(e,t,n)=>{function a(e,...t){return t.reverse().reduce(((e,t)=>t(e)),e)}n.r(t),n.d(t,{default:()=>a})},33989:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var a=n(52322),s=n(2784),i=n(77984),r=n(47009),o=n(35120),l=n(80522),c=n(41186);function d(e,{callOnResult:t,propName:n="value",transform:d=l.default}={}){return(l,u={},m)=>{class h extends s.Component{isActive=!0;state={callResult:void 0,callUpdated:!1,callUpdatedAt:0,subscriptions:[]};componentDidMount(){this.setState({subscriptions:[e.pipe((0,i.U)(d),(0,r.K)((()=>(0,o.of)(void 0)))).subscribe((e=>this.triggerUpdate(this.props,e))),(0,c.intervalObservable)(this)]})}componentWillUnmount(){this.isActive=!1,this.state.subscriptions.forEach((e=>e.unsubscribe()))}triggerUpdate=(e,n)=>{try{if(!this.isActive||(0,c.isEqual)(n,this.state.callResult))return;(0,c.triggerChange)(n,t,e.callOnResult||u.callOnResult),this.setState({callResult:n,callUpdated:!0,callUpdatedAt:Date.now()})}catch(e){console.error(this.props,e)}};render(){const{children:e}=this.props,{callResult:t,callUpdated:s,callUpdatedAt:i}=this.state,r={...u,...this.props,callUpdated:s,callUpdatedAt:i,[n]:t};return(0,a.jsxs)(l,{...r,children:[m&&m(t),e]})}}return h}}},35475:(e,t,n)=>{n.r(t),n.d(t,{onlyOnApp:()=>r,onlyOnWeb:()=>i});var a=n(41186);const s=e=>t=>(0,a.getEnvironment)()===e?t:()=>null,i=s("web"),r=s("app")},57139:(e,t,n)=>{n.r(t),n.d(t,{ApiCtx:()=>a.ApiCtx,ApiCtxRoot:()=>a.ApiCtxRoot,DEFAULT_DECIMALS:()=>a.DEFAULT_DECIMALS,DEFAULT_SS58:()=>a.DEFAULT_SS58,api:()=>a.api,withApi:()=>s.withApi,withCallDiv:()=>s.withCallDiv,withCalls:()=>s.withCalls,withMulti:()=>s.withMulti,withObservable:()=>s.withObservable});var a=n(34777),s=n(69356)},36956:(e,t,n)=>{n.r(t),n.d(t,{lightSpecs:()=>r,relaySpecs:()=>o});var a=n(71066),s=n(37178),i=n(15299);const r=Object.entries({kusama:s.specs,polkadot:i.specs}).reduce(((e,[t,n])=>(e[t]=n.reduce(((e,n)=>(e[n]=`./light/${t}/${n}.json`,e)),{}),e)),{}),o={kusama:a.WellKnownChain.ksmcc3,polkadot:a.WellKnownChain.polkadot,rococo:a.WellKnownChain.rococo_v2_2,westend:a.WellKnownChain.westend2}},37178:(e,t,n)=>{n.r(t),n.d(t,{specs:()=>a});const a=["gm","shiden","tinkernet"]},15299:(e,t,n)=>{n.r(t),n.d(t,{specs:()=>a});const a=["astar"]},80522:(e,t,n)=>{function a(e,t){return e}n.r(t),n.d(t,{default:()=>a})},23802:(e,t,n)=>{n.r(t),n.d(t,{default:()=>a});const a=new(n(35562).P)},81369:(e,t,n)=>{n.r(t),n.d(t,{decodeUrlTypes:()=>d,encodeUrlTypes:()=>u});var a=n(13824),s=n(85168),i=n(16039),r=n(48731),o=n(56623),l=n(64021),c=n(41444);function d(){const e=s.Z.parse(location.href.split("?")[1]);if(e.types)try{(0,r.hu)(!Array.isArray(e.types),"Expected a single type specification");const t=e.types.split("#"),n=(0,c.tV)(decodeURIComponent(t[0])),s=(0,a.HT)(n);return JSON.parse((0,o.z)(s))}catch(e){console.error(e)}return null}function u(e){const t=(0,l.d)(JSON.stringify(e)),n=(0,a.iZ)(t,{level:9}),s=(0,c.h$)(n);return`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(i.X.apiUrl)}&types=${encodeURIComponent(s)}`}},68372:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});var a=n(34406);function s(){return a?.versions?.electron||"renderer"===window?.process?.type||navigator?.userAgent?.indexOf("Electron")>=0?"app":"web"}},77809:(e,t,n)=>{async function a(e,t,n){return Promise.all(n.map((n=>e(n,...t)))).then((e=>e.map(((e,t)=>[n[t],e]))))}n.r(t),n.d(t,{default:()=>a})},41186:(e,t,n)=>{n.r(t),n.d(t,{getEnvironment:()=>a.default,getHistoric:()=>s.default,intervalObservable:()=>i.default,isEqual:()=>r.default,triggerChange:()=>o.default});var a=n(68372),s=n(77809),i=n(71951),r=n(65345),o=n(74733)},71951:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});const a=(0,n(487).F)(500);function s(e){return a.subscribe((()=>{const t=Date.now()-(e.state.callUpdatedAt||0)<=1500;t!==e.state.callUpdated&&e.setState({callUpdated:t})}))}},65345:(e,t,n)=>{function a(e,t){return t?t.$$typeof?"":Array.isArray(t)?t.map((e=>a(0,e))):t:t}function s(e,t){return JSON.stringify({test:e},a)===JSON.stringify({test:t},a)}n.r(t),n.d(t,{default:()=>s})},74733:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i});var a=n(4757),s=n(33661);function i(e,...t){t&&t.length&&t.forEach((t=>{(0,a.b)(t)?t.next(e):(0,s.m)(t)&&t(e)}))}},2729:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(52322),s=n(2784),i=n(15445),r=n(48166),o=n(21779);const l=o.z.div`
  margin: 1rem 0;
  text-align: right;

  & .clear {
    clear: both;
  }

  &.isCentered {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  &+.ui--Table {
    margin-top: 1.5rem;
  }

  .ui--Button {
    margin: 0 0.25rem;
  }

  .ui--CopyButton {
    display: inline-block;
  }

  .ui--ToggleGroup, .ui--Dropdown {
    float: left;
  }
`,c=s.memo((function({children:e,className:t="",isCentered:n}){return(0,a.jsxs)(l,{className:`${t} ui--Button-Group ${n?"isCentered":""}`,children:[e,(0,a.jsx)("div",{className:"clear"})]})})),d=o.z.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  line-height: 1;
  margin: 0;
  outline: none;
  position: relative;
  vertical-align: middle;
  text-align: center;

  &:not(.hasLabel) {
    padding: 0.7em;

    .ui--Icon {
      padding: 0.6rem;
      margin: -0.6rem;
    }
  }

  &:not(.isCircular) {
    border-radius: 0.25rem;
  }

  &:focus {
    outline:0;
  }

  &.hasLabel {
    padding: 0.7rem 1.1rem 0.7rem ${1.1-.5}rem;

    .ui--Icon {
      margin-right: 0.425rem !important;
    }
  }

  &.isBasic {
    background: var(--bg-table);
  }

  &.isCircular {
    border-radius: 10rem;
  }

  &.isDisabled, &.isReadOnly {
    background: none;
    box-shadow: none;
    cursor: not-allowed;
  }

  &.isBusy {
    cursor: wait;
  }

  &.isFull {
    display: block;
    width: 100%;
  }

  &.isIcon {
    background: transparent;
  }

  .ui--Button-overlay {
    background: rgba(253, 252, 251, 0.75);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
  }

  .ui--Icon {
    border-radius: 50%;
    box-sizing: content-box;
    height: 1rem;
    margin: -${.5}rem 0;
    padding: ${.5}rem;
    width: 1rem;
  }

  &.isDisabled {
    color: #bcbbba;
  }
`,u=s.memo((function({activeOnEnter:e,children:t,className:n="",dataTestId:o="",icon:l,isBasic:c,isBusy:u,isCircular:m,isDisabled:h,isFull:p,isIcon:g,isSelected:f,isToplevel:b,label:x,onClick:v,isReadOnly:A=!v,onMouseEnter:w,onMouseLeave:y,tabIndex:j,withoutLink:k}){const N=(0,s.useCallback)((()=>{!u&&!h&&v&&Promise.resolve(v()).catch(console.error)}),[u,h,v]),C=(0,s.useCallback)((()=>{w&&Promise.resolve(w()).catch(console.error)}),[w]),E=(0,s.useCallback)((()=>{y&&Promise.resolve(y()).catch(console.error)}),[y]),S=(0,s.useCallback)((e=>{u||h||"Enter"!==e.key||v&&Promise.resolve(v()).catch(console.error)}),[u,h,v]);return(0,s.useEffect)((()=>(e&&window.addEventListener("keydown",S,!0),()=>{e&&window.removeEventListener("keydown",S,!0)})),[e,S]),(0,a.jsxs)(d,{className:`${n} ui--Button ${x?"hasLabel":""} ${c?"isBasic":""} ${m?"isCircular":""} ${p?"isFull":""} ${g?"isIcon":""} ${u||h?"isDisabled":""} ${u?"isBusy":""} ${A?"isReadOnly":""}${f?"isSelected":""} ${b?"isToplevel":""} ${k?"withoutLink":""}`,"data-testid":o,onClick:N,onMouseEnter:C,onMouseLeave:E,tabIndex:j,children:[l&&(0,a.jsx)(i.Z,{icon:l}),x,t,u&&(0,a.jsx)(r.Z,{className:"ui--Button-spinner",variant:"cover"})]})}));u.Group=c;const m=u},25294:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(52322),s=n(2784),i=n(25650),r=n(67557),o=n(1346),l=n(12493);const c=(0,n(21779).z)(l.Z)`
  .ui--Dropdown-item {
    position: relative;
    white-space: nowrap;

    .ui--Dropdown-icon,
    .ui--Dropdown-name {
      display: inline-block;
    }

    .ui--Dropdown-icon {
      height: 32px;
      left: 0;
      position: absolute;
      top: -9px;
      width: 32px;

      &.opaque {
        opacity: var(--opacity-light);
      }
    }

    .ui--Dropdown-name {
      margin-left: 3rem;
    }
  }

  .ui.selection.dropdown {
    > .text > .ui--Dropdown-item {
      .ui--Dropdown-icon {
        left: -2.6rem;
        top: -1.15rem;
        opacity: 1;
      }

      .ui--Dropdown-name {
        margin-left: 0;
      }
    }
  }
`,d=s.memo((function({allowAdd:e=!1,children:t,className:n="",defaultValue:l,dropdownClassName:d,isButton:u,isDisabled:m,isError:h,isFull:p,isMultiple:g,label:f,labelExtra:b,onAdd:x,onBlur:v,onChange:A,onClose:w,onSearch:y,options:j,placeholder:k,renderLabel:N,searchInput:C,tabIndex:E,transform:S,value:I,withEllipsis:D,withLabel:B}){const L=(0,s.useRef)(""),[$,V]=(0,s.useState)(),P=(0,s.useCallback)((e=>{const t=JSON.stringify({v:e});L.current!==t&&(L.current=t,V(e),A&&A(S?S(e):e))}),[A,S]);(0,s.useEffect)((()=>{P((0,o.o)(I)?l:I)}),[P,l,I]);const Z=(0,s.useCallback)(((e,{value:t})=>x&&x(t)),[x]),T=(0,s.useCallback)(((e,{value:t})=>P(t)),[P]),z=(0,a.jsx)(i.Z,{allowAdditions:e,button:u,className:d,compact:u,disabled:m,error:h,floating:u,multiple:g,onAddItem:Z,onBlur:v,onChange:T,onClose:w,options:j,placeholder:k,renderLabel:N,search:y||e,searchInput:C,selection:!0,tabIndex:E,value:$});return u?(0,a.jsxs)(r.Z.Group,{children:[z,t]}):(0,a.jsxs)(c,{className:`${n} ui--Dropdown`,isFull:p,label:f,labelExtra:b,withEllipsis:D,withLabel:B,children:[z,t]})}));d.Header=i.Z.Header;const u=d},79472:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(69316),r=n(15445);const o=n(21779).z.div`
  cursor: pointer;

  .ui--Icon.icon-button {
    color: ${i.Iv};
    cursor: pointer;
    margin: 0 0 0 0.5rem;
  }

  .editSpan {
    white-space: nowrap;
  }
`,l=s.memo((function({children:e,className:t="",icon:n="edit",onClick:s}){return(0,a.jsxs)(o,{className:`${t} ui--EditButton`,onClick:s,children:[e,(0,a.jsx)("span",{className:"editSpan",children:(0,a.jsx)(r.Z,{className:"icon-button",icon:n})})]})}))},15445:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(52322),s=n(81674),i=n(9725),r=n(49929),o=n(2784),l=n(21779);s.vI.add(i.mRB);const c=(0,l.z)(r.G)`
  outline: none;

  &.isClickable {
    cursor: pointer;
  }

  &.isPadded {
    margin: 0 0.25rem;
  }

  &.grayColor {
    opacity: 0.25;
  }

  &.greenColor {
    color: green;
  }

  &.orangeColor {
    color: darkorange;
  }

  &.redColor {
    color: darkred;
  }

  &.transparentColor {
    color: transparent;
  }

  &.whiteColor {
    color: white;
  }

  &.darkGrayColor {
    color: #8B8B8B;
  }
`,d=o.memo((function({className:e="",color:t="normal",icon:n,isPadded:s,isSpinning:i,onClick:r,size:o="1x",tooltip:l}){const d={"data-testid":n,...l?{"data-for":l,"data-tip":!0}:{}};return(0,a.jsx)(c,{...d,className:`${e} ui--Icon ${t}Color${r?" isClickable":""}${s?" isPadded":""}`,icon:n,onClick:r,size:o,spin:i,tabIndex:-1})}))},33749:(e,t,n)=>{n.d(t,{ZP:()=>u,nk:()=>c});var a=n(52322),s=n(2784),i=n(46340),r=n(33661),o=n(1346),l=n(12493);const c=["Alt","Meta","Control"];let d=0;const u=s.memo((function({autoFocus:e=!1,children:t,className:n,defaultValue:c,icon:u,inputClassName:m,isAction:h=!1,isDisabled:p=!1,isDisabledError:g=!1,isEditable:f=!1,isError:b=!1,isFull:x=!1,isHidden:v=!1,isInPlaceEditor:A=!1,isLoading:w=!1,isReadOnly:y=!1,isWarning:j=!1,label:k,labelExtra:N,max:C,maxLength:E,min:S,name:I,onBlur:D,onChange:B,onEnter:L,onEscape:$,onKeyDown:V,onKeyUp:P,onPaste:Z,placeholder:T,tabIndex:z,type:M="text",value:F,withEllipsis:H,withLabel:R}){const[U]=(0,s.useState)((()=>`in_${d++}_at_${Date.now()}`)),[q]=(0,s.useState)((()=>c));(0,s.useEffect)((()=>{q&&B&&B(q)}),[q,B]);const O=(0,s.useCallback)((()=>D&&D()),[D]),W=(0,s.useCallback)((({target:e})=>B&&B(e.value)),[B]),Q=(0,s.useCallback)((e=>V&&V(e)),[V]),K=(0,s.useCallback)((e=>{P&&P(e),!L||"Enter"!==e.key&&13!==e.keyCode||(e.target.blur(),(0,r.m)(L)&&L()),!$||"Escape"!==e.key&&27!==e.keyCode||(e.target.blur(),$())}),[L,$,P]),G=(0,s.useCallback)((e=>Z&&Z(e)),[Z]);return(0,a.jsx)(l.Z,{className:n,isFull:x,label:k,labelExtra:N,withEllipsis:H,withLabel:R,children:(0,a.jsxs)(i.Z,{action:h,autoFocus:e,className:[f?"ui--Input edit icon":"ui--Input",A?"inPlaceEditor":"",w?"--tmp":"",m||"",j&&!b?"isWarning":""].join(" "),defaultValue:(0,o.o)(F)?c||"":void 0,disabled:p||w,error:!p&&b||g,hidden:v,iconPosition:(0,o.o)(u)?void 0:"left",id:I,max:C,maxLength:E,min:S,name:I||U,onBlur:O,onChange:W,onKeyDown:Q,onKeyUp:K,placeholder:T,readOnly:y,tabIndex:z,type:M,value:F,children:[(0,a.jsx)("input",{autoCapitalize:"off",autoComplete:"password"===M?"new-password":"off",autoCorrect:"off","data-testid":k,onPaste:G,spellCheck:!1}),f&&(0,a.jsx)("i",{className:"edit icon"}),u,t]})})}))},44294:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(92730),r=n(1346),o=n(39764);const l=s.memo((function({autoFocus:e,children:t,className:n="",defaultValue:l,isDisabled:c,isError:d,isFull:u,isLoading:m,isWarning:h,isZeroable:p,label:g,labelExtra:f,maxValue:b,onChange:x,onEnter:v,onEscape:A,placeholder:w,siDecimals:y,siSymbol:j,value:k,withEllipsis:N,withLabel:C,withMax:E}){const{defaultValue:S,siDefault:I}=(0,s.useMemo)((()=>function(e,t=!1,n){if(!e)return{};const a=(0,i.a)(e,{decimals:(0,r.o)(n)?i.a.getDefaults().decimals:n,forceUnit:"-",withAll:!0,withSi:!1,withZero:!1});return{defaultValue:t?`${a}.`.split(".").slice(0,2).map(((e,t)=>t?e.padEnd(4,"0"):e)).join("."):a.replace(/,/g,""),siDefault:i.a.findSi("-")}}(l,c,y)),[l,c,y]);return(0,a.jsx)(o.Z,{autoFocus:e,bitLength:128,className:`${n} ui--InputBalance`,defaultValue:S,isDisabled:c,isError:d,isFull:u,isLoading:m,isSi:!0,isWarning:h,isZeroable:p,label:g,labelExtra:f,maxValue:b,onChange:x,onEnter:v,onEscape:A,placeholder:w,siDecimals:y,siDefault:I,siSymbol:j,value:k,withEllipsis:N,withLabel:C,withMax:E,children:t})}))},39764:(e,t,n)=>{n.d(t,{Z:()=>y,k:()=>g});var a=n(52322),s=n(2784),i=n(90778),r=n(95292),o=n(48801),l=n.n(o),c=n(1346),d=n(92730),u=n(6485),m=n(33749),h=n(21779),p=n(43151);class g{static abbr="Unit";static setAbbr(e=g.abbr){g.abbr=e}}function f(e){return r.um.pow(new(l())(e||32)).isub(r.If)}function b(e,t){return new RegExp(e?`^${t?"-?":""}(0|[1-9]\\d*)(\\.\\d*)?$`:`^${t?"-?":""}(0|[1-9]\\d*)$`)}function x(e,t,n,a,s){return!(!n&&e.lt(r.nw)||e.gt(f(t))||!a&&e.isZero()||e.bitLength()>(t||32)||s&&s.gtn(0)&&e.gt(s))}function v(e,t,n,a,s,i,o,u){const[m,h,p]=function(e,t){if(!e)return[r.nw,0,0];const n=(0,c.o)(t)?d.a.getDefaults().decimals:t;return[new(l())(n+e.power),n,e.power]}(n,u),g=t.match(/^(\d+)\.(\d+)$/);let f;if(g){p-g[2].length<-h&&(f=new(l())(-1));const n=new(l())(t.replace(/\.\d*$/,"")),a=t.replace(/^\d+\./,"").substring(0,e.registry.chainDecimals[0]),s=new(l())(a);f=n.mul(r.aP.pow(m)).add(s.mul(r.aP.pow(new(l())(h+p-a.length))))}else f=new(l())(t.replace(/[^\d]/g,"")).mul(r.aP.pow(m)).muln(s&&t.startsWith("-")?-1:1);return[f,x(f,a,s,i,o)]}function A(e,t,n,a,s,i,r,o){return[t,...v(e,t,n,a,s,i,r,o)]}const w=(0,h.z)(m.ZP)`
  .siUnit {
    bottom: 0.85rem;
    color: var(--color-label);
    font-size: var(--font-size-tiny);
    font-weight: var(--font-weight-label);
    position: absolute;
    font-weight: var(--font-weight-bold);
    right: 1.25rem;
  }
`,y=s.memo((function({autoFocus:e,bitLength:t=32,children:n,className:o="",defaultValue:h,isDecimal:x,isDisabled:v,isError:y=!1,isFull:j,isLoading:k,isSi:N,isSigned:C=!1,isWarning:E,isZeroable:S=!0,label:I,labelExtra:D,maxLength:B,maxValue:L,onChange:$,onEnter:V,onEscape:P,placeholder:Z,siDecimals:T,siDefault:z,siSymbol:M,value:F}){const{t:H}=(0,p.$)(),{api:R}=(0,i.h)(),[U]=(0,s.useState)((()=>N?z||d.a.findSi("-"):null)),[[q,O,W],Q]=(0,s.useState)((()=>function(e,t=r.nw,n,a,s,i,o,m){return(0,u.H)(t)?function(e,t,n,a,s){const i=(0,c.o)(s)?d.a.getDefaults().decimals:s;return[t?e.div(r.aP.pow(new(l())(i+t.power))).toString():e.toString(),e,!(!a&&!n)||e.gt(r.nw)]}(t,n,s,i,m):A(e,t,n,a,s,i,o,m)}(R,F||h,U,t,C,S,L,T))),[K,G]=(0,s.useState)(!1);(0,s.useEffect)((()=>{$&&$(W?O:void 0)}),[W,$,O]);const J=(0,s.useCallback)(((e,n)=>Q(A(R,e,n,t,C,S,L,T))),[R,t,C,S,L,T]),Y=(0,s.useCallback)((e=>J(e,U)),[J,U]);(0,s.useEffect)((()=>{h&&Y(h.toString())}),[Y,h]);const X=(0,s.useCallback)((e=>{if(m.nk.includes(e.key))G(!0);else if(1===e.key.length&&!K){const{selectionEnd:t,selectionStart:n,value:a}=e.target,s=`${a.substring(0,n||0)}${e.key}${a.substring(t||0)}`;b(x||!!U,C).test(s)||e.preventDefault()}}),[x,K,C,U]),_=(0,s.useCallback)((e=>{m.nk.includes(e.key)&&G(!1)}),[]),ee=(0,s.useCallback)((e=>{const{value:t}=e.target;b(x||!!U,C).test(t)||e.preventDefault()}),[x,C,U]),te=f(t).toString().length;return(0,a.jsxs)(w,{autoFocus:e,className:`${o} ui--InputNumber ${v?"isDisabled":""}`,isDisabled:v,isError:!W||y,isFull:j,isLoading:k,isWarning:E,label:I,labelExtra:D,maxLength:B||te,onChange:Y,onEnter:V,onEscape:P,onKeyDown:X,onKeyUp:_,onPaste:ee,placeholder:Z||H(C?"Valid number":"Positive number"),type:"text",value:q,children:[U&&(0,a.jsx)("div",{className:"siUnit",children:M||g.abbr}),n]})}))},35220:(e,t,n)=>{n.d(t,{Z:()=>g});var a=n(52322),s=n(2784),i=n(23729),r=n.n(i),o=n(82740),l=n(25294),c=n(21779);function d(e){return{key:e,text:e,value:e}}const u=(r().get("tags")||["Default"]).sort(),m=u.map(d);function h(e){u.push(e),m.push(d(e)),function(e){r().set("tags",e.sort())}(u)}const p=(0,c.z)(l.Z)`
  && .ui.label {
    border: none;
    border-radius: 0.25rem;
    box-shadow: none;
    color: #fff;
    display: inline-block;
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
    line-height: 1.143rem;
    margin: 0.125rem 0.125rem;
    padding: 0.571em 0.857em;
    position: relative;
    white-space: nowrap;
    z-index: 1;

    .delete.icon::before {
      content: '\u2715';
    }
  }

  &&.darkTheme .ui.label {
    background-color: rgba(255, 255, 255, 0.08);
  }
`,g=s.memo((function({allowAdd:e=!0,className:t="",defaultValue:n,isDisabled:i,isError:r,label:l,onBlur:c,onChange:d,onClose:u,placeholder:g,searchInput:f,value:b,withLabel:x}){const{theme:v}=(0,s.useContext)(o.Ni);return(0,a.jsx)(p,{allowAdd:e&&!i,className:`${t} ui--InputTags ${v}Theme`,defaultValue:n,isDisabled:i,isError:r,isMultiple:!0,label:l,onAdd:h,onBlur:c,onChange:d,onClose:u,options:m,placeholder:g,searchInput:f,value:b,withLabel:x})}))},12493:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(21779);const r=(0,a.jsx)("div",{children:" "}),o=i.z.div`
  &.ui--Labelled {
    display: block;
    position: relative;

    label {
      padding-right: 1rem;
    }

    .ui--CopyButton {
      position: absolute;
      top: 0.9rem;
      right: 0.5rem;
    }

    .withEllipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.isSmall {
      display: block;

      > label {
        margin: 0;
        min-width: 0;
        padding-right: 0;
      }
    }

    &:not(.isSmall) {
      padding-left: 2rem;

      &:not(.isOuter) {
        > label,
        .labelExtra {
          position: absolute;
          text-align: left;
          top: 0.75rem;
          z-index: 1;
        }

        > label {
          left: 3.55rem;
          right: 0;
          text-align: left;
        }
      }

      &.isFull {
        padding-left: 0;

        > label {
          left: 1.55rem;
        }
      }

      &.isOuter {
        margin: 0.25rem 0;

        .labelExtra {
          top: -0.125rem;
          // right: 0;
        }
      }

      .labelExtra {
        color: var(--color-label);
        font-size: var(--font-size-label);
        font-weight: var(--font-weight-label);
        position: absolute;
        right: 1.25rem;
        text-align: right;
        text-transform: var(--text-transform-label);
        top: 0.75rem;
        z-index: 1;

        > .ui--Toggle > label {
          padding-right: 0 !important;
        }
      }

      > .ui--Labelled-content {
        box-sizing: border-box;
        flex: 1 1;
        min-width: 0;

        > .--tmp {
          // existing is a bit too much
          opacity: 0.15;
        }

        .ui.selection.dropdown {
          &:not(.floating) {
            padding-left: 1.45rem;
            padding-top: 1.75rem;
          }

          &.floating {
            > .dropdown.icon {
              top: 1.25rem;
            }

            .text {
              line-height: 1;
              padding: 0.47rem 0
            }
          }

          &.search:not(.multiple) > input.search {
            padding-left: 1.45rem;
            padding-top: 1.75rem;
          }

          > .delete.icon,
          > .dropdown.icon,
          > .search.icon {
            top: 1.75rem;
          }
        }

        .ui--InputFile,
        .ui.input > input,
        .ui--output {
          padding-left: 1.45rem;
          padding-top: 1.75rem;
        }

        .ui--Messages {
          padding-bottom: 2rem;
          padding-left: 1.45rem;
          padding-top: 2rem;
        }
      }
    }
  }
`,l=s.memo((function({children:e,className:t="",isFull:n,isHidden:s,isOuter:i,isSmall:l,label:c=r,labelExtra:d,withEllipsis:u,withLabel:m=!0}){return s?null:m?(0,a.jsxs)(o,{className:`${t} ui--Labelled ${l?"isSmall":""} ${n?"isFull":""} ${i?"isOuter":""}`,children:[(0,a.jsx)("label",{children:u?(0,a.jsx)("div",{className:"withEllipsis",children:c}):c}),d&&(0,a.jsx)("div",{className:"labelExtra",children:d}),(0,a.jsx)("div",{className:"ui--Labelled-content",children:e})]}):(0,a.jsx)("div",{className:t,children:e})}))},16613:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(52322),s=n(2784),i=n(38894),r=n(79472),o=n(33749),l=n(21779),c=n(53657);const d=l.z.div`
  text-align: left;

  &.isDisabled {
    opacity: var(--opacity-light);

    .ui--IdentityIcon  {
      filter: grayscale(100%);
    }
  }

  &.isInline {
    display: flex;

    .ui--Row-accountId {
      white-space: nowrap;
    }
  }

  &.isInvalid {
    .ui--Row-accountId,
    .ui--Row-icon {
      filter: grayscale(100);
      opacity: var(--opacity-light);
    }
  }

  .ui--Row-base {
    display: flex;
    min-width: 16rem;
  }

  .ui--Row-buttons {
    position: relative;
    margin-right: -0.5rem;
    margin-top: -0.5rem;
    white-space: nowrap;
    height: 0rem;
    overflow: visible;

    button.ui.button:last-child {
      margin-right: 0;
    }
  }

  .ui--Row-children {
    display: block;
    padding-left: 1rem;
    padding-top: 1rem;
  }

  .ui--Row-details {
    flex: 1;
    margin-right: 1rem;
    padding: 0.25rem 0 0;
    width: 100%;
    min-width: 0;

    .account-label{
      margin: -0.75rem 0 0 0
    }

    * {
      vertical-align: middle;
    }
  }

  .ui--Row-address,
  .ui--Row-accountIndex {
    padding: 0;
    margin-bottom: 0.25rem;

    &.shortAddr {
      min-width: var(--width-shortaddr);
      max-width: var(--width-shortaddr);
      opacity: var(--opacity-light);
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .ui--Row-name {
    display: flex;
    box-sizing: border-box;
    height: 1.5rem;
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: inherit;
  }

  .ui--Row-icon {
    flex: 0;
    margin-right: 1em;
    position: relative;

    .ui--Row-icon-info {
      left: -0.5rem;
      position: absolute;
      top: -0.5rem;
    }
  }

  .ui--Row-name-input {
    input {
      height: 1em;
      text-transform: uppercase;
      margin-top: -0.3em;
    }
  }

  .ui--Row-tags {
    &.editable {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;

      .addTags {
        border: 1px #00000052 solid;
        border-radius: .5em;
        border-style: dashed;
        color: grey;
        font-size: var(--font-size-tiny);
        padding: .1em 0.3em 0.1em 0.3em;
        margin-top: .2em;
      }

      > div.label {
        margin-top:.3em
      }
    }
  }

  .ui--Row-tags-input {
    margin-bottom: -1.4em;
  }
`,u=s.memo((function({address:e,buttons:t,children:n,className:l="",defaultName:u,details:m,icon:h,iconInfo:p,isDisabled:g,isEditableName:f,isEditableTags:b,isInline:x,isShortAddr:v=!0,name:A,onChangeName:w,onChangeTags:y,onSaveName:j,onSaveTags:k,tags:N}){const[C,E]=(0,i.O)(),[S,I]=(0,i.O)(),D=(0,s.useCallback)((()=>{j&&j(),E()}),[j,E]);return(0,a.jsxs)(d,{className:`${l} ui--Row ${g?"isDisabled":""} ${x?"isInline":""}`,children:[(0,a.jsxs)("div",{className:"ui--Row-base",children:[h&&(0,a.jsxs)("div",{className:"ui--Row-icon",children:[h,p&&(0,a.jsx)("div",{className:"ui--Row-icon-info",children:p})]}),(0,a.jsxs)("div",{className:"ui--Row-details",children:[(A||u)&&(f&&C?(0,a.jsx)(o.ZP,{autoFocus:!0,defaultValue:A||u,isInPlaceEditor:!0,onBlur:D,onChange:w,onEnter:!0,withLabel:!1}):(0,a.jsx)("div",{className:"ui--Row-name",children:f?(0,a.jsx)(r.Z,{onClick:E,children:A||u}):A||u})),e&&(0,a.jsx)("div",{className:"ui--Row-address "+(v?"shortAddr":""),children:e}),m,N&&(0,a.jsx)(c.Z,{className:"ui--Row-tags",isEditable:b,isEditing:S,onChange:y,onSave:k,onToggleIsEditing:I,value:N})]}),t&&(0,a.jsx)("div",{className:"ui--Row-buttons",children:t})]}),n&&(0,a.jsx)("div",{className:"ui--Row-children",children:n})]})}))},88909:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(52322),s=n(2784),i=n(2729);const r=n(21779).z.div`
  background: var(--bg-page);
  bottom: 0;
  margin-left: -0.125rem;
  max-width: 24rem;
  min-width: 24rem;
  position: fixed;
  padding: 1rem;
  overflow-y: auto;
  top: 0;
  z-index: 999;

  &.leftPosition {
    box-shadow: 6px 0px 20px 0px rgba(0, 0, 0, 0.3);
    left: 0;
  }

  &.rightPosition {
    box-shadow: -6px 0px 20px 0px rgba(0, 0, 0, 0.3);
    right: 0;
  }

  .ui--Sidebar-buttons {
    margin: 0;
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
`,o=s.memo((function({button:e,children:t,className:n="",dataTestId:s="",onClose:o,position:l,sidebarRef:c}){return(0,a.jsxs)(r,{className:`${n} ui--Sidebar ${l}Position`,"data-testid":s,ref:c,children:[(0,a.jsxs)(i.Z.Group,{className:"ui--Sidebar-buttons",children:[e,(0,a.jsx)(i.Z,{dataTestId:"close-sidebar-button",icon:"times",isBasic:!0,isCircular:!0,onClick:o})]}),t]})}))},48166:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(21779),r=n(43151);const o=i.z.div`
  display: block;
  line-height: 1rem;
  margin: 0 auto;
  text-align: center;

  &.variant-appPadded {
    margin-top: 0.5rem;
  }

  img {
    border: 1px solid transparent;
    border-radius: 10rem;
  }

  &.variant-cover {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;

    img {
      border: 1 px solid white;
      margin: 0 auto;
    }
  }

  .text {
    color: inherit !important;
    margin: 0.25rem auto 1.5rem auto;
    opacity: var(--opacity-light);

    div+div {
      margin-top: 0.25rem;
    }
  }
`,l=s.memo((function({className:e="",label:t,noLabel:n,variant:s="app"}){const{t:i}=(0,r.$)();return(0,a.jsxs)(o,{className:`${e} ui--Spinner variant-${s}`,children:[(0,a.jsx)("img",{className:"push"===s?"":"highlight--bg highlight--border",src:"data:image/png;base64,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"}),!n&&s.startsWith("app")&&(0,a.jsx)("div",{className:"text",children:t||i("Retrieving data")})]})}))},56245:(e,t,n)=>{n.d(t,{z:()=>a});const a=["finalitytimeout","finalized","inblock","usurped","dropped","invalid","cancelled","error","sent"]},17608:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(52322),s=n(2784),i=n(82740),r=n(21779),o=n(527);let l=0;const c=r.z.div`
  border-radius: 0.25rem;
  color: #fff;
  display: inline-block;
  font-size: var(--font-size-tiny);
  font-weight: var(--font-weight-normal);
  line-height: 1rem;
  margin: 0 0.125rem;
  opacity: 0.85;
  padding: 0.25em 0.75em;
  position: relative;
  white-space: nowrap;
  z-index: 1;

  &.tinySize {
    font-size: var(--font-size-tiny);
  }

  &.blackColor {
    background: #000;
  }

  &.blueColor {
    background: #2185d0;
  }

  &.greenColor {
    background: #21ba45;
  }

  &.greyColor {
    background: #767676;
  }

  &.lightgreyColor {
    background: #b6b6b6;
    opacity: 0.7;
  }

  &.orangeColor {
    background: #f2711c;
  }

  &.pinkColor {
    background: #e03997;
  }

  &.purpleColor {
    background: #a45ee5;
  }

  &.redColor {
    background: #db2828;
  }

  &.yellowColor {
    background: darkgoldenrod;
  }

  &.themeColor.darkTheme {
    background-color: rgba(255,255,255,0.08);
  }
`,d=s.memo((function({className:e="",color:t="theme",hover:n,label:r,size:d="small"}){const{theme:u}=(0,s.useContext)(i.Ni),[m]=(0,s.useState)((()=>`tag-hover-${Date.now()}-${l++}`));return(0,a.jsxs)(c,{className:`${e} ui--Tag ${t}Color ${d}Size ${u}Theme`,color:t||"grey","data-for":n&&m,"data-tip":!!n,children:[r,n&&(0,a.jsx)(o.Z,{text:n,trigger:m})]})}))},53657:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(52322),s=n(2784),i=n(79472),r=n(35220),o=n(21779),l=n(17608),c=n(43151);const d=o.z.div`
  label {
    display: inline-block;
  }

  .ui--EditButton {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    &.center {
      justify-content: center;
    }

    &.left {
      justify-content: left;
    }
  }

  .ui--Tag {
    margin: 0.1rem 0 0.1rem 0.571rem;
  }
`,u=s.memo((function({children:e,className:t="",isEditable:n,isEditing:o,onChange:u,onSave:m,onToggleIsEditing:h,value:p,withEditButton:g=!0,withTitle:f}){const{t:b}=(0,c.$)(),x=(0,s.useMemo)((()=>p.length?p.map((e=>(0,a.jsx)(l.Z,{label:e},e))):(0,a.jsx)("div",{children:b("none")})),[b,p]),v=(0,s.useCallback)((()=>{m&&m(),h&&h()}),[m,h]);return(0,a.jsxs)(d,{className:`${t} ui--Tags`,children:[f&&(0,a.jsx)("h5",{children:b("Tags")}),n&&o?(0,a.jsx)(r.Z,{defaultValue:p,onBlur:v,onChange:u,onClose:v,openOnFocus:!0,searchInput:{autoFocus:!1},value:p,withLabel:!1}):n&&g?(0,a.jsx)(i.Z,{className:0===p.length?"center":"left",onClick:h,children:x}):x,e]})}))},527:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(28316),r=n(33710);const o=(0,n(21779).z)(r.Z)`
  .tooltipSpacer {
    padding: 0.375rem;
  }

  > div {
    overflow: hidden;
  }

  &.ui--Tooltip {
    z-index: 1002;
  }

  table {
    border: 0;
    overflow: hidden;
    width: 100%;

    td {
      text-align: left;
    }

    td:first-child {
      opacity: 0.75;
      padding-right: 0.25rem;
      text-align: right;
      white-space: nowrap;
    }
  }

  div+table,
  table+div {
    margin-top: 0.75rem;
  }

  > div+div {
    margin-top: 0.5rem;
  }

  &.address div {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .faded {
    margin-top: 0;
    opacity: 0.75 !important;
    font-size: var(--font-size-tiny) !important;

    .faded {
      font-size: 1em !important;
    }
  }

  .faded+.faded {
    margin-top: 0;
  }

  .row+.row {
    margin-top: 0.5rem;
  }
`,l=s.memo((function({children:e,className:t="",isClickable:n=!1,place:r,text:l,trigger:c}){const[d]=(0,s.useState)("undefined"==typeof document?{}:document.createElement("div"));return(0,s.useEffect)((()=>{const e="undefined"==typeof document?null:document.getElementById("tooltips");return e&&e.appendChild(d),()=>{e&&e.removeChild(d)}}),[d]),(0,i.createPortal)((0,a.jsx)(o,{className:`${t} ui--Tooltip`,clickable:n,effect:"solid",id:c,place:r,children:(0,a.jsxs)("div",{className:"tooltipSpacer",children:[l,e]})}),d)}))},54926:(e,t,n)=>{n.d(t,{Z:()=>a});const a={}},94953:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(24991),s=n(42754),i=n(61349),r=n(16039),o=n(2453),l=n(54926);const c={},d=new s.Z;d.addDetector({lookup:()=>{const e=r.X.i18nLang;return e===o.cr?void 0:e},name:"i18nLangDetector"}),a.ZP.use(d).use(i.Db).use(class{type="backend";static type="backend";async read(e,t,n){if(l.Z[e])return n(null,l.Z[e]);c[e]||(c[e]=this.createLoader(e));const[a,s]=await c[e];return n(a,s)}async createLoader(e){try{const t=await fetch(`locales/${e}/translation.json`,{});return t.ok?(l.Z[e]=await t.json(),[null,l.Z[e]]):[`i18n: failed loading ${e}`,t.status>=500&&t.status<600]}catch(e){return[e.message,!1]}}}).init({backend:{},debug:!1,detection:{order:["i18nLangDetector","navigator"]},fallbackLng:!1,interpolation:{escapeValue:!1,prefix:"{{",suffix:"}}"},keySeparator:!1,load:"languageOnly",ns:["apps","apps-config","apps-electron","apps-routing","app-accounts","app-claims","app-contracts","app-council","app-democracy","app-explorer","app-extrinsics","app-generic-asset","app-js","app-parachains","app-poll","app-rpc","app-settings","app-signing","app-society","app-staking","app-storage","app-sudo","app-tech-comm","app-treasury","react-api","react-components","react-hooks","react-params","react-query","react-signer","translation"],nsSeparator:!1,react:{useSuspense:!0},returnEmptyString:!1,returnNull:!1}).catch((e=>console.log("i18n: failure",e))),r.X.on("change",(e=>{(e.i18nLang===o.cr?a.ZP.changeLanguage():a.ZP.changeLanguage(e.i18nLang)).catch(console.error)}));const u=a.ZP},68087:(e,t,n)=>{n.d(t,{RV:()=>P,hl:()=>je,ax:()=>He,mV:()=>We,N:()=>Je,Kc:()=>nt,jb:()=>st,Ct:()=>k,RN:()=>ot,zx:()=>ie.Z,Ig:()=>Nt,Uv:()=>Ct,Zb:()=>St,Jy:()=>Zt,Mj:()=>Ut,H_:()=>Wt,kL:()=>pn,XZ:()=>fn,P0:()=>yn,v:()=>En,qi:()=>wt,lK:()=>q,Lt:()=>Nn.Z,ML:()=>Dn,SV:()=>cn,ju:()=>Ln,Vh:()=>Qr,xH:()=>Y,n0:()=>da,n6:()=>Na,HS:()=>Yr,lm:()=>Ea,WN:()=>Da,u5:()=>Ka,JO:()=>v.Z,JH:()=>_a,k:()=>De,Kd:()=>ts,II:()=>Bn.ZP,rp:()=>Bs,m3:()=>Zs,bm:()=>zs,H:()=>Ms.Z,$q:()=>Os,eV:()=>Ys,UT:()=>fa,ht:()=>ri,Rn:()=>oi.Z,iQ:()=>pi,nU:()=>Ai,RF:()=>ki,R2:()=>os,__:()=>X,ob:()=>Ei,jN:()=>yt.Z,NR:()=>Bi,oy:()=>$i,Pd:()=>rt,v2:()=>Ri,u_:()=>qa,EK:()=>qi,r_:()=>ss,f:()=>_i,ro:()=>Wi,YV:()=>Ji,GI:()=>hr,Ex:()=>Vt,lV:()=>pr,iH:()=>a.r_,K0:()=>a.K0,CU:()=>a.CU,lB:()=>a.lB,YE:()=>gr.Z,ak:()=>Gr,$j:()=>Gn.Z,d4:()=>fr,by:()=>le,JM:()=>me,qG:()=>jt,qb:()=>yr,Ty:()=>kr,iA:()=>oa,mQ:()=>Pr,mO:()=>$r,Vp:()=>Sa.Z,$G:()=>Zr.Z,Kx:()=>Or,ZD:()=>Xe,tX:()=>Mr,u:()=>w.Z,cA:()=>re,UE:()=>Fr,xb:()=>Ur,zo:()=>A.z});var a=n(63684),s=n(52322),i=n(2784),r=n(29455),o=n(60773);i.memo((function({children:e,className:t="",defaultValue:n,label:a,value:l}){const c=(0,r.J)(),d=(0,o.Y)(l),u=(0,i.useMemo)((()=>function({accountIndex:e}={}){return e?e.toString():null}(d)),[d]);return c&&c.query.indices?(0,s.jsxs)("div",{className:`${t} ui--AccountIndex`,children:[a||"",(0,s.jsx)("div",{className:"account-index",children:u||n||"-"}),e]}):null}));var l=n(66425),c=n(23802),d=n(64021),u=n(24107),m=n(65417),h=n(38628),p=n(14681),g=n(16737),f=n(33661),b=n(11798),x=n(3663),v=n(15445),A=n(21779),w=n(527);let y=0;const j=A.z.div`
  border-radius: 16px;
  box-sizing: border-box;
  color: #eeedec;
  display: inline-block;
  font-size: var(--font-size-tiny);
  height: 20px;
  line-height: 20px;
  margin-right: 0.43rem;
  min-width: 20px;
  padding: 0 4px;
  overflow: hidden;
  text-align: center;
  vertical-align: middle;
  width: 20px;

  &.isTooltip {
    cursor: help;
  }

  &.isBlock {
    display: block;
  }

  .ui--Icon {
    cursor: inherit;
    margin-top: 4px;
    vertical-align: top;
    width: 1em;
  }

  &.isClickable:not(.withAction) {
    cursor: pointer;
  }

  &.isSmall {
    font-size: 10px;
    height: 16px;
    line-height: 16px;
    min-width: 16px;
    padding: 0;
    width: 16px;

    .ui--Icon {
      margin-top: 3px;
    }
  }

  &.blueColor {
    background: steelblue;
  }

  &.counterColor {
    margin: 0 0.5rem;
    vertical-align: middle;
  }

  &.grayColor {
    background: #eeedec !important;
    color: #aaa9a8;
  }

  &.redColor {
    background: darkred;
  }

  &.greenColor {
    background: green;
  }

  &.orangeColor {
    background: darkorange;
  }

  &.purpleColor {
    background: indigo;
  }

  &.transparentColor {
    background: transparent;
    box-shadow: none;
  }

  &.whiteColor {
    background: rgba(255, 255, 255, 0.3);
  }

  &.recovery, &.warning, &.information, &.important {
    background-color: #FFFFFF;

    &.darkTheme {
      background-color: #212227;
    }
  }

  &.recovery {
    background-image: linear-gradient(0deg, rgba(17, 185, 74, 0.08), rgba(17, 185, 74, 0.08));
    color: #11B94A;
  }

  &.warning {
    background-image: linear-gradient(0deg, rgba(232, 111, 0, 0.08), rgba(232, 111, 0, 0.08));
    color: #FF7D01;
  }

  &.information {
    background-image: linear-gradient(0deg, rgba(226, 246, 255, 0.08), rgba(226, 246, 255, 0.08));
    color: #3BBEFF;

    &.lightTheme {
      background-color: rgba(226, 246, 255, 1);
    }
  }

  &.important {
    background: linear-gradient(0deg, rgba(230, 0, 122, 0.08), rgba(230, 0, 122, 0.08)), rgba(230, 0, 122, 0.01);
    color: #E6007A;
  }

  &.withAction.withIcon:not(.withInfo) {
    width: 34px;
    border-radius: 4px;
  }

  &.withInfo.withIcon:not(.withAction) {
    width: 34px;
    border-radius: 18px;
  }

  &.withAction.withIcon.withInfo {
    width: 44px;
    border-radius: 4px;
  }

  &.withInfo .ui--Icon:not(.action-icon) {
    margin-right: 4px;
  }

  .hoverContent {
    display: flex;
    flex-direction: column;
  }

  .action-icon {
    margin-left: 4px;
  }
`,k=i.memo((function({className:e="",color:t="normal",hover:n,hoverAction:a,icon:r,info:o,isBlock:l,isSmall:c,onClick:d}){const u=(r?`${r}-`:"")+"badge",{theme:m}=(0,x.F)(),[h]=(0,i.useState)((()=>`${u}-hover-${Date.now()}-${y++}`)),p=n?{"data-for":h,"data-tip":!0}:{},g="highlight"===t,f=(0,i.useMemo)((()=>(0,s.jsxs)("div",{className:"hoverContent",children:[(0,s.jsx)("div",{children:n}),a&&(0,s.jsx)("a",{className:`${t}Color`,onClick:d,children:a})]})),[t,n,a,d]);return(0,s.jsxs)(j,{...p,className:`${e} ui--Badge ${n?"isTooltip":""} ${l?"isBlock":""} ${c?"isSmall":""} ${d?"isClickable":""} ${g?"highlight--bg":""} ${t}Color ${r?"withIcon":""} ${o?"withInfo":""} ${a?"withAction":""} ${m}Theme`,"data-testid":u,onClick:a?void 0:d,children:[(0,s.jsxs)("div",{className:g?"highlight--color-contrast":"",children:[r&&(0,s.jsx)(v.Z,{icon:r}),o,a&&(0,s.jsx)(v.Z,{className:"action-icon",icon:"chevron-right"})]}),n&&(0,s.jsx)(w.Z,{className:"accounts-badge",isClickable:!!a,text:f,trigger:h})]})}));function N(e,t){const n=c.default.createType("AccountId",(0,d.d)(e.padEnd(32,"\0")));return e=>n.eq(e)?t:null}function C(e,t,n){const a=(0,d.d)(e),s=a.length+4;return e=>{const i=(0,u.c)(e)?e.toU8a():c.default.createType("AccountId",e).toU8a();return i.length>=s&&(0,m.S)(a,i.subarray(0,a.length))&&(0,h.S)(i.subarray(s))?`${t} ${(0,p.u)((0,g._)(i.subarray(a.length,s)))}${n?` (${n})`:""}`:null}}const E=[N("modlpy/socie","Society"),N("modlpy/trsry","Treasury"),N("modlpy/xcmch","XCM"),C("modlpy/cfund","Crowdloan"),C("modlpy/npols\0","Pool","Stash"),C("modlpy/npols","Pool","Reward"),C("modlpy/nopls\0","Pool","Stash"),C("modlpy/nopls","Pool","Reward"),C("para","Parachain"),C("sibl","Sibling")],S=new Map,I=new Map,D=new Map;function B(e="",t,n){let a=null;for(let e=0;null===a&&e<E.length;e++)a=E[e](t);if(a)return[a,!1,!1,!0];const s=t.toString();if(!s)return[e,!1,!1,!1];const[i,,r]=(0,b.s2)(s,null,e),o=(n||"").toString()||I.get(s);return i&&o?(I.set(s,o),[o,!1,!0,!1]):[r,!i,i,!1]}function L(e="",t,n){const[a,,i]=B(e,t,n);return i?(0,s.jsx)("span",{className:"isAddress",children:a}):a}function $(e,t,n){const a=S.get(e);if(a)return a;const[i,r,o,l]=B(n,e,t);return(0,s.jsxs)("span",{className:"via-identity",children:[l&&(0,s.jsx)(k,{color:"green",icon:"archway",isSmall:!0}),(0,s.jsx)("span",{className:"name"+(r||l?" isLocal":o?" isAddress":""),children:i})]})}const V=A.z.span`
  border: 1px dotted transparent;
  line-height: 1;
  vertical-align: middle;
  white-space: nowrap;

  &.withSidebar:hover {
    border-bottom-color: #333;
    cursor: help !important;
  }

  .isAddress {
    display: inline-block;
    min-width: var(--width-shortaddr);
    max-width: var(--width-shortaddr);
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
  }

  .via-identity {
    word-break: break-all;

    .name {
      font-weight: var(--font-weight-normal) !important;
      filter: grayscale(100%);
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;

      &:not(.isAddress) {
        text-transform: uppercase;
      }

      &.isAddress {
        opacity: var(--opacity-light);
      }

      .sub,
      .top {
        vertical-align: middle;
      }

      .sub {
        font-size: var(--font-size-tiny);
        opacity: var(--opacity-light);
      }
    }
  }
`,P=i.memo((function({children:e,className:t="",defaultName:n,label:a,onClick:c,override:d,toggle:u,value:m,withSidebar:h}){const p=(0,r.J)(),g=(0,o.Y)(m),[b,x]=(0,i.useState)((()=>$((m||"").toString(),void 0,n))),v=(0,i.useContext)(l.d);(0,i.useEffect)((()=>{const{accountId:e,accountIndex:t,identity:a,nickname:i}=g||{},r=(e||m||"").toString();a?.parent&&D.set(r,a.parent.toString()),p&&(0,f.m)(p.query.identity?.identityOf)?x((()=>a?.display?function(e,t){const n=t.judgements.filter((([,e])=>!e.isFeePaid)),a=n.some((([,e])=>e.isKnownGood||e.isReasonable)),i=n.some((([,e])=>e.isErroneous||e.isLowQuality)),r=a?t.display:(t.display||"").replace(/[^\x20-\x7E]/g,""),o=t.displayParent&&(a?t.displayParent:t.displayParent.replace(/[^\x20-\x7E]/g,"")),l=(c=(0,s.jsxs)("span",{className:"name"+(a&&!i?" isGood":""),children:[(0,s.jsx)("span",{className:"top",children:o||r}),o&&(0,s.jsx)("span",{className:"sub",children:`/${r||""}`})]}),d=i?"red":a?"green":"gray",u=t.parent?"link":a&&!i?"check":"minus",(0,s.jsxs)("span",{className:"via-identity",children:[(0,s.jsx)(k,{color:d,icon:u,isSmall:!0}),c]}));var c,d,u;return S.set(e,l),l}(r,a):$(r,t))):x(i||L(n,r,t))}),[p,n,g,u,m]);const A=(0,i.useCallback)((()=>x(L(n,(m||"").toString()))),[n,m]),w=(0,i.useCallback)((()=>v&&m&&v([m.toString(),A])),[A,v,m]);return(0,s.jsxs)(V,{className:`${t}  ui--AccountName ${h?"withSidebar":""}`,"data-testid":"account-name",onClick:h?w:c,children:[a||"",d||b,e]})}));var Z=n(69356),T=n(54383),z=n(58607),M=n(65874),F=n(82671),H=n(95292),R=n(92730),U=n(52107);const q=i.memo((function({accountId:e,className:t="",label:n=""}){const[a,r]=(0,i.useState)("unknown");return(0,i.useEffect)((()=>{const t=(0,b.C9)(e);"unknown"!==t&&r(t)}),[e]),(0,s.jsxs)("div",{className:`${t} ui--CryptoType`,children:[n,a]})}));var O=n(43151);let W=0;const Q=A.z.div`
  white-space: nowrap;

  .ui--FormatBalance {
    display: inline-block;
  }
`,K=i.memo((function({className:e="",value:t}){const{t:n}=(0,O.$)(),a=(0,T.C)(),[r]=(0,i.useState)((()=>`${Date.now()}-democracy-locks-${++W}`)),[{maxBalance:o,sorted:l},c]=(0,i.useState)({maxBalance:H.nw,sorted:[]});return(0,i.useEffect)((()=>{a&&c((e=>{const i=function(e,t,n=[]){return{maxBalance:(0,U.x)(...n.map((({balance:e})=>e)).filter((e=>!!e))),sorted:n.map((e=>[e,e.unlockAt&&e.unlockAt.gt(t)?e.unlockAt.sub(t):H.nw])).sort(((e,t)=>(e[0].referendumId||H.nw).cmp(t[0].referendumId||H.nw))).sort(((e,t)=>e[1].cmp(t[1]))).sort(((e,t)=>e[0].isFinished===t[0].isFinished?0:e[0].isFinished?-1:1)).reduce(((t,[{balance:n,isDelegated:a,isFinished:i=!1,referendumId:r,vote:o},l])=>{const c=l.gt(H.nw),d=r&&o?(0,s.jsxs)("div",{children:["#",r.toString()," ",(0,R.a)(n,{forceUnit:"-"})," ",o.conviction?.toString(),a&&"/d"]}):(0,s.jsx)("div",{children:e("Prior locked voting")}),u=t.length?t[t.length-1]:null;return!u||c||i!==u.isFinished?t.push({details:(0,s.jsx)("div",{className:"faded",children:c?(0,s.jsx)(M.Z,{label:`${e("{{blocks}} blocks",{replace:{blocks:(0,p.u)(l)}})}, `,value:l}):e(i?"lock expired":"ongoing referendum")}),headers:[d],isCountdown:c,isFinished:i}):u.headers.push(d),t}),[])}}(n,a,t);return e.sorted.length!==i.sorted.length||e.sorted.some(((e,t)=>e.headers.length!==i.sorted[t].headers.length))?i:e}))}),[a,n,t]),l.length?(0,s.jsxs)(Q,{className:e,children:[(0,s.jsx)(z.Z,{labelPost:(0,s.jsx)(v.Z,{icon:"clock",tooltip:r}),value:o}),(0,s.jsx)(w.Z,{trigger:r,children:l.map((({details:e,headers:t},n)=>(0,s.jsxs)("div",{className:"row",children:[t.map(((e,t)=>(0,s.jsx)("div",{children:e},t))),(0,s.jsx)("div",{className:"faded",children:e})]},n)))})]}):null}));var G=n(38894);const J=A.z.div`
  max-width: 60rem;
  overflow: hidden;
  text-overflow: ellipsis;

  &:not(.isExpanded) {
    .ui--Expander-content {
      display: none;
    }
  }

  &.isExpanded {
    .ui--Expander-content {
      margin-top: 0.75rem;

      .body.column {
        justify-content: end;
      }
    }
  }

  &.isHeader {
    margin-left: 2rem;
  }

  &.withBreaks .ui--Expander-content {
    white-space: normal;
  }

  .ui--Expander-summary {
    margin: 0;
    min-width: 13.5rem;
    overflow: hidden;

    .ui--Expander-summary-header {
      display: inline-block;
      max-width: calc(100% - 2rem);
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;

      span {
        white-space: normal;
      }

      .ui--Expander-summary-header-sub,
      .ui--Expander-summary-title {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        box-orient: vertical;
        display: -webkit-box;
        line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }

      .ui--Expander-summary-header-sub {
        font-size: var(--font-size-small);
        opacity: var(--opacity-light);
      }
    }

    .ui--Icon {
      vertical-align: middle;
    }

    &:not(.isLeft) > .ui--Icon {
      margin-left: 0.75rem;
    }

    &.isLeft > .ui--Icon {
      margin-right: 0.75rem;
    }

    .ui--LabelHelp {
      .ui--Icon {
        margin-left: 0;
        margin-right: 0.5rem;
        vertical-align: text-bottom;
      }
    }
  }

  &.hasContent .ui--Expander-summary {
    cursor: pointer;
  }

  &.isPadded .ui--Expander-summary {
    margin-left: 2.25rem;
  }
`,Y=i.memo((function({children:e,className:t="",isHeader:n,isLeft:a,isOpen:r,isPadded:o,onClick:l,renderChildren:c,summary:d,summaryHead:u,summaryMeta:m,summarySub:h,withBreaks:p,withHidden:g}){const[f,b]=(0,G.O)(r,l),x=(0,i.useMemo)((()=>f&&c&&c()),[f,c]),[A,w]=(0,i.useMemo)((()=>function(e){if(!e||!e.docs.length)return null;const t=e.docs.map((e=>e.toString().trim())),n=t.findIndex((e=>!e.length)),a=(i=(-1===n?t:t.slice(0,n)).join(" ").replace(/#(<weight>| <weight>).*<\/weight>/,"").replace(/\\/g,"").replace(/`/g,""),["[","]"].reduce(((e,t)=>function(e,t){return e.reduce(((e,n)=>n.split(t).reduce(((e,t)=>e.concat(t)),e)),[])}(e,t)),[i]));var i;return[a[0].split(/[.(]/)[0],(0,s.jsxs)(s.Fragment,{children:[a.map(((e,t)=>t%2?(0,s.jsxs)("em",{children:["[",e,"]"]},t):(0,s.jsx)("span",{children:e},t)))," "]})]}(m)||[h,h]),[m,h]),y=(0,i.useMemo)((()=>!!c||!!e&&(!Array.isArray(e)||0!==e.length)),[e,c]),j=(0,i.useMemo)((()=>(0,s.jsx)(v.Z,{color:y?void 0:"transparent",icon:f?"caret-up":"caret-down"})),[y,f]);return(0,s.jsxs)(J,{className:`${t} ui--Expander ${f?"isExpanded":""} ${n?"isHeader":""} ${o?"isPadded":""} ${y?"hasContent":""} ${p?"withBreaks":""}`,children:[(0,s.jsxs)("div",{className:"ui--Expander-summary"+(a?" isLeft":""),onClick:b,children:[a&&j,(0,s.jsxs)("div",{className:"ui--Expander-summary-header",children:[(0,s.jsx)("div",{className:"ui--Expander-summary-title",children:u}),d,w&&(0,s.jsx)("div",{className:"ui--Expander-summary-header-sub",children:f?w:A})]}),!a&&j]}),y&&(f||g)&&(0,s.jsx)("div",{className:"ui--Expander-content",children:e||x})]})})),X=i.memo((function({className:e="",label:t,withEllipsis:n}){return(0,s.jsx)("label",{className:e,children:n?(0,s.jsx)("div",{className:"withEllipsis",children:t}):t})}));var _=n(90778),ee=n(34814),te=n(9118),ne=n(74065),ae=n(86135),se=n(48731),ie=n(2729);const re=i.memo((function({accountId:e,className:t="",extrinsic:n,icon:a,isBasic:r,isBusy:o,isDisabled:l,isIcon:c,isToplevel:d,isUnsigned:u,label:m,onClick:h,onFailed:p,onSendRef:g,onStart:b,onSuccess:x,onUpdate:v,params:A,tooltip:w,tx:y,withSpinner:j,withoutLink:k}){const{t:N}=(0,O.$)(),C=(0,ne.X)(),{queueExtrinsic:E}=(0,ae.L)(),[S,I]=(0,i.useState)(!1),[D,B]=(0,i.useState)(!1);(0,i.useEffect)((()=>{D&&b&&b()}),[D,b]);const L=(0,i.useCallback)((e=>{C.current&&I(!1),p&&p(e)}),[p,I,C]),$=(0,i.useCallback)((e=>{C.current&&I(!1),x&&x(e)}),[x,I,C]),V=(0,i.useCallback)((()=>{C.current&&B(!0)}),[B,C]),P=(0,i.useCallback)((()=>{let t;n?t=Array.isArray(n)?n:[n]:y&&(t=[y(...(0,f.m)(A)?A():A||[])]),(0,se.hu)(t?.length,"Expected generated extrinsic passed to TxButton"),C.current&&j&&I(!0),t.forEach((t=>{E({accountId:e&&e.toString(),extrinsic:t,isUnsigned:u,txFailedCb:j?L:p,txStartCb:V,txSuccessCb:j?$:x,txUpdateCb:v})})),h&&h()}),[L,V,$,e,u,h,p,x,v,A,n,E,I,y,j,C]);return g&&(g.current=P),(0,s.jsx)(ie.Z,{className:t,icon:a||"check",isBasic:r,isBusy:o,isDisabled:S||l||!u&&!e||!y&&(Array.isArray(n)?0===n.length:!n),isIcon:c,isToplevel:d,label:m||(c?"":N("Submit")),onClick:P,tooltip:w,withoutLink:k})})),oe={transform:e=>e.isNone?0:e.unwrap().prior.length+1},le=i.memo((function({className:e="",isPool:t,stakingInfo:n}){const{api:a}=(0,_.h)(),{allAccounts:i}=(0,ee.x)(),{t:r}=(0,O.$)(),o=(0,te.W7)(a.query.staking.slashingSpans,[n?.stashId],oe);return n?.redeemable?.gtn(0)?(0,s.jsx)("div",{className:e,children:(0,s.jsx)(z.Z,{value:n.redeemable,children:i.includes((n.controllerId||"").toString())?(0,s.jsx)(re,{accountId:n.controllerId,icon:"lock",isIcon:!0,params:t?[n.controllerId,o]:1===a.tx.staking.withdrawUnbonded.meta.args.length?[o]:[],tooltip:r("Withdraw these unbonded funds"),tx:t?a.tx.nominationPools.withdrawUnbonded:a.tx.staking.withdrawUnbonded},"unlock"):(0,s.jsx)("span",{className:"icon-void",children:" "})})}):null}));var ce=n(48801),de=n.n(ce);const ue=A.z.div`
  white-space: nowrap;

  .ui--Icon.left {
    margin-left: 0;
    margin-right: 0.25rem;
  }

  .ui--Icon.right {
    margin-left: 0.25rem;
    margin-right: 0;
  }

  .ui--FormatBalance {
    display: inline-block;
  }
`,me=i.memo((function({className:e="",iconPosition:t="left",stakingInfo:n}){const{api:a}=(0,_.h)(),r=(0,te.W7)(a.derive.session.progress),{t:o}=(0,O.$)(),[l,c]=(0,i.useMemo)((()=>function(e,t){if(!e?.unlocking||!t)return[[],H.nw];const n=e.unlocking.filter((({remainingEras:e,value:t})=>t.gt(H.nw)&&e.gt(H.nw))).map((e=>[e,e.remainingEras,e.remainingEras.sub(H.If).imul(t.eraLength).iadd(t.eraLength).isub(t.eraProgress)])),a=n.reduce(((e,[{value:t}])=>e.iadd(t)),new(de())(0));return[n,a]}(n,r)),[r,n]);if(!n||!l.length)return null;const d=`${n.accountId.toString()}-unlocking-trigger`;return(0,s.jsxs)(ue,{className:e,children:["left"===t&&(0,s.jsx)(v.Z,{className:"left",icon:"clock",tooltip:d}),(0,s.jsx)(z.Z,{value:c}),(0,s.jsx)(w.Z,{trigger:d,children:l.map((([{value:e},t,n],i)=>(0,s.jsxs)("div",{className:"row",children:[(0,s.jsx)("div",{children:o("Unbonding {{value}}",{replace:{value:(0,R.a)(e,{forceUnit:"-"})}})}),(0,s.jsx)("div",{className:"faded",children:a.consts.babe?.epochDuration?(0,s.jsx)(M.Z,{label:`${o("{{blocks}} blocks",{replace:{blocks:(0,p.u)(n)}})}, `,value:n}):o("{{eras}} eras remaining",{replace:{eras:(0,p.u)(t)}})})]},i)))}),"right"===t&&(0,s.jsx)(v.Z,{className:"right",icon:"clock",tooltip:d})]})})),he={available:!0,bonded:!0,locked:!0,redeemable:!0,reserved:!0,total:!0,unlocking:!0,vested:!0},pe={crypto:!0,nonce:!0},ge={unstakeThreshold:!0,validatorPayment:!0};function fe(){return(0,s.jsx)("span",{className:"icon-void",children:" "})}function be(e,t){const n=t.toHuman();try{return e[n]||n}catch{return n}}function xe({stakingInfo:e,withBalance:t=!0,withValidatorPrefs:n=!1}){if(e)return!0;if(!0===t||n)return!1;if((0,F.K)(t)){if(t.unlocking||t.redeemable)return!1;if(t.bonded)return Array.isArray(t.bonded)}return!0}function ve({address:e,balancesAll:t,withExtended:n},a){const i=!0===n?pe:n||void 0;return i?(0,s.jsxs)("div",{className:"column",children:[t&&i.nonce&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(X,{label:a("transactions")}),(0,s.jsx)("div",{className:"result",children:(0,p.u)(t.accountNonce)})]}),i.crypto&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(X,{label:a("type")}),(0,s.jsx)(q,{accountId:e,className:"result"})]})]}):null}function Ae({stakingInfo:e,withValidatorPrefs:t=!1},n){const a=!0===t?ge:t;return a&&e&&e.validatorPrefs?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{}),a.unstakeThreshold&&e.validatorPrefs.unstakeThreshold&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(X,{label:n("unstake threshold")}),(0,s.jsx)("div",{className:"result",children:e.validatorPrefs.unstakeThreshold.toString()})]}),a.validatorPayment&&(e.validatorPrefs.commission||e.validatorPrefs.validatorPayment)&&(e.validatorPrefs.validatorPayment?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(X,{label:n("commission")}),(0,s.jsx)(z.Z,{className:"result",value:e.validatorPrefs.validatorPayment})]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(X,{label:n("commission")}),(0,s.jsxs)("span",{children:[(e.validatorPrefs.commission.unwrap().toNumber()/1e7).toFixed(2),"%"]})]}))]}):null}function we(e,t,n,{address:a,balanceDisplay:r,balancesAll:o,bestNumber:l,convictionLocks:c,democracyLocks:d,isAllLocked:u,otherBonded:m,ownBonded:h,stakingInfo:g,votingOf:f,withBalanceToggle:b,withLabel:x}){const A=[],y=o;if(!b&&r.total&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:x?n("total"):""}),(0,s.jsx)(z.Z,{className:"result "+(o?"":"--tmp"),formatIndex:e,labelPost:(0,s.jsx)(fe,{}),value:o?o.freeBalance.add(o.reservedBalance):1})]},0)),o&&r.available&&y.availableBalance&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("transferrable")}),(0,s.jsx)(z.Z,{className:"result",formatIndex:e,labelPost:(0,s.jsx)(fe,{}),value:y.availableBalance})]},1)),l&&r.vested&&y?.isVesting){const t=y.vesting.filter((({endBlock:e})=>l.lt(e)));A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("vested")}),(0,s.jsx)(z.Z,{className:"result",formatIndex:e,labelPost:(0,s.jsx)(v.Z,{icon:"info-circle",tooltip:`${a}-vested-trigger`}),value:y.vestedBalance,children:(0,s.jsxs)(w.Z,{trigger:`${a}-vested-trigger`,children:[(0,s.jsxs)("div",{children:[(0,R.a)(y.vestedClaimable,{forceUnit:"-"}),(0,s.jsx)("div",{className:"faded",children:n("available to be unlocked")})]}),t.map((({endBlock:e,locked:t,perBlock:a,vested:i},r)=>(0,s.jsxs)("div",{className:"inner",children:[(0,s.jsxs)("div",{children:[(0,R.a)(i,{forceUnit:"-"}),(0,s.jsx)("div",{className:"faded",children:n("of {{locked}} vested",{replace:{locked:(0,R.a)(t,{forceUnit:"-"})}})})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)(M.Z,{value:e.sub(l)}),(0,s.jsxs)("div",{className:"faded",children:[n("until block")," ",(0,p.u)(e)]})]}),(0,s.jsxs)("div",{children:[(0,R.a)(a),(0,s.jsx)("div",{className:"faded",children:n("per block")})]})]},`item:${r}`)))]})})]},2))}const j=(y?.namedReserves||[]).reduce(((e,t)=>e.concat(...t)),[]),k=!!j&&0!==j.length;if(r.locked&&o&&(u||y.lockedBalance?.gtn(0))&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("locked")}),(0,s.jsx)(z.Z,{className:"result",formatIndex:e,labelPost:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(v.Z,{icon:"info-circle",tooltip:`${a}-locks-trigger`}),(0,s.jsx)(w.Z,{trigger:`${a}-locks-trigger`,children:y.lockedBreakdown.map((({amount:e,id:a,reasons:i},r)=>(0,s.jsxs)("div",{className:"row",children:[e?.isMax()?n("everything"):(0,R.a)(e,{forceUnit:"-"}),a&&(0,s.jsx)("div",{className:"faded",children:be(t,a)}),(0,s.jsx)("div",{className:"faded",children:i.toString()})]},r)))})]}),value:u?"all":y.lockedBalance})]},3)),r.reserved&&o?.reservedBalance?.gtn(0)&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("reserved")}),(0,s.jsx)(z.Z,{className:"result",formatIndex:e,labelPost:k?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(v.Z,{icon:"info-circle",tooltip:`${a}-named-reserves-trigger`}),(0,s.jsx)(w.Z,{trigger:`${a}-named-reserves-trigger`,children:j.map((({amount:e,id:n},a)=>(0,s.jsxs)("div",{children:[(0,R.a)(e,{forceUnit:"-"}),n&&(0,s.jsx)("div",{className:"faded",children:be(t,n)})]},a)))})]}):(0,s.jsx)(fe,{}),value:o.reservedBalance})]},4)),r.bonded&&(h.gtn(0)||0!==m.length)&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("bonded")}),(0,s.jsx)(z.Z,{className:"result",formatIndex:e,labelPost:(0,s.jsx)(fe,{}),value:h,children:0!==m.length&&(0,s.jsxs)(s.Fragment,{children:[" (+",m.map(((t,n)=>(0,s.jsx)(z.Z,{formatIndex:e,labelPost:(0,s.jsx)(fe,{}),value:t},n))),")"]})})]},5)),r.redeemable&&g?.redeemable?.gtn(0)&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("redeemable")}),(0,s.jsx)(le,{className:"result",stakingInfo:g})]},6)),r.unlocking){if(g?.unlocking&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("unbonding")}),(0,s.jsx)("div",{className:"result",children:(0,s.jsx)(me,{iconPosition:"right",stakingInfo:g})})]},7)),d&&0!==d.length)A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("democracy")}),(0,s.jsx)("div",{className:"result",children:(0,s.jsx)(K,{value:d})})]},8));else if(l&&f&&f.isDirect){const{prior:[e,t]}=f.asDirect;t.gt(H.nw)&&e.gt(H.nw)&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("democracy")}),(0,s.jsx)("div",{className:"result",children:(0,s.jsx)(K,{value:[{balance:t,isFinished:l.gt(e),unlockAt:e}]})})]},8))}if(l&&c&&c.length){const e=c.reduce(((e,{total:t})=>(0,U.x)(e,t)),H.nw);A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("referenda")}),(0,s.jsx)(z.Z,{className:"result",labelPost:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(v.Z,{icon:"clock",tooltip:`${a}-conviction-locks-trigger`}),(0,s.jsx)(w.Z,{trigger:`${a}-conviction-locks-trigger`,children:c.map((({endBlock:e,locked:t,refId:a,total:i},r)=>(0,s.jsxs)("div",{className:"row",children:[(0,s.jsxs)("div",{className:"nowrap",children:["#",a.toString()," ",(0,R.a)(i,{forceUnit:"-"})," ",t]}),(0,s.jsx)("div",{className:"faded nowrap",children:e.eq(H.Ew)?n("ongoing referendum"):l.gte(e)?n("lock expired"):(0,s.jsxs)(s.Fragment,{children:[(0,p.u)(e.sub(l))," ",n("blocks"),", ",(0,s.jsx)(M.Z,{isInline:!0,value:e.sub(l)})]})})]},r)))})]}),value:e})]},9))}}return o&&o.accountNonce&&r.nonce&&A.push((0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:n("transactions")}),(0,s.jsxs)("div",{className:"result",children:[(0,p.u)(o.accountNonce),(0,s.jsx)(fe,{})]})]},10)),b?(0,s.jsx)(i.Fragment,{children:(0,s.jsx)(Y,{className:o?"":"isBlurred",summary:(0,s.jsx)(z.Z,{formatIndex:e,value:o&&o.freeBalance.add(o.reservedBalance)}),children:0!==A.length&&(0,s.jsx)("div",{className:"body column",children:A})})},e):(0,s.jsx)(i.Fragment,{children:A},e)}function ye(e,t,n,a){const{address:s,balancesAll:i,convictionLocks:r,democracyLocks:o,stakingInfo:l,votingOf:c,withBalance:d=!0,withBalanceToggle:u=!1,withLabel:m=!1}=e,h=!0===d?he:d||!1;if(!h)return[null];const[p,g]=function(e,t){let n=[],a=H.nw;return Array.isArray(t)?(n=t.filter(((e,t)=>0!==t)).filter((e=>e.gt(H.nw))),a=t[0]):e&&e.stakingLedger&&e.stakingLedger.active&&e.accountId.eq(e.stashId)&&(a=e.stakingLedger.active.unwrap()),[a,n]}(l,h.bonded),f={address:s,balanceDisplay:h,bestNumber:n,convictionLocks:r,democracyLocks:o,isAllLocked:!!i&&i.lockedBreakdown.some((({amount:e})=>e?.isMax())),otherBonded:g,ownBonded:p,votingOf:c,withBalanceToggle:u,withLabel:m},b=[we(0,t,a,{...f,balancesAll:i,stakingInfo:l})];return u&&i?.additional.length&&i.additional.forEach(((e,n)=>{b.push(we(n+1,t,a,{...f,balancesAll:e}))})),b}const je=(0,Z.withMulti)((0,A.z)((function(e){const{t}=(0,O.$)(),n=(0,T.C)(),{children:a,className:r="",extraInfo:o,withBalanceToggle:l,withHexSessionId:c}=e,d=(0,i.useRef)({democrac:t("via Democracy/Vote"),phrelect:t("via Council/Vote"),pyconvot:t("via Referenda/Vote"),"staking ":t("via Staking/Bond"),"vesting ":t("via Vesting")});return(0,s.jsxs)("div",{className:`${r} ui--AddressInfo ${l?"ui--AddressInfo-expander":""}`,children:[(0,s.jsxs)("div",{className:"column"+(l?" column--expander":""),children:[ye(e,d.current,n,t),c&&c[0]&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(X,{label:t("session keys")}),(0,s.jsx)("div",{className:"result",children:c[0]})]}),c&&c[0]!==c[1]&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(X,{label:t("session next")}),(0,s.jsx)("div",{className:"result",children:c[1]})]}),Ae(e,t),o&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{}),o.map((([e,t],n)=>(0,s.jsxs)(i.Fragment,{children:[(0,s.jsx)(X,{label:e}),(0,s.jsx)("div",{className:"result",children:t})]},`label:${n}`)))]})]}),ve(e,t),a&&(0,s.jsx)("div",{className:"column",children:a})]})}))`
    align-items: flex-start;
    display: flex;
    flex: 1;
    white-space: nowrap;

    &:not(.ui--AddressInfo-expander) {
      justify-content: flex-end;
    }

    .nowrap {
      white-space: nowrap;

      .ui--FormatBalance {
        display: inline-block;
      }
    }

    & + .ui--Button,
    & + .ui--ButtonGroup {
      margin-right: 0.25rem;
      margin-top: 0.5rem;
    }

    .column {
      max-width: 260px;
      &.column--expander {
        width: 17.5rem;

        .ui--Expander {
          width: 100%;

          .summary {
            display: inline-block;
            text-align: right;
            min-width: 12rem;
          }
        }
      }

      &:not(.column--expander) {
        flex: 1;
        display: grid;
        column-gap: 0.75rem;
        row-gap: 0.5rem;
        opacity: 1;

        div.inner {
          margin-top: 0.25rem;

          &:first-child {
            margin-top: 0;
          }
        }

        label {
          grid-column: 1;
          padding-right: 0.5rem;
          text-align: right;
          vertical-align: middle;
          margin-bottom: 0.25rem;

          .help.circle.icon {
            display: none;
          }
        }

        .result {
          grid-column: 2;
          text-align: right;

          .ui--Icon,
          .icon-void {
            margin-left: 0.25rem;
            margin-right: 0;
            padding-right: 0 !important;
          }

          .icon-void {
            float: right;
            width: 1em;
          }
        }
      }
    }
  `,(0,Z.withCalls)(["derive.balances.all",{paramName:"address",propName:"balancesAll",skipIf:function({withBalance:e=!0,withExtended:t=!1}){if(!0===e||!0===t)return!1;if((0,F.K)(e)){if(e.available||e.locked||e.reserved||e.total||e.vested)return!1}else if((0,F.K)(t)&&t.nonce)return!1;return!0}}],["derive.staking.account",{paramName:"address",propName:"stakingInfo",skipIf:xe}],["derive.democracy.locks",{paramName:"address",propName:"democracyLocks",skipIf:xe}],["query.democracy.votingOf",{paramName:"address",propName:"votingOf",skipIf:xe}]));var ke=n(9652),Ne=n(15221),Ce=n(16039),Ee=n(47025);function Se(e){return!(!e||!e.toHuman)}const Ie=(0,A.z)(Ne.ZP)((({theme:e})=>`\n  ${"dark"===e.theme?"circle:first-child {\n      fill: #282829;\n    }":""}\n\n  border: 1px solid ${"dark"===e.theme?"transparent":"#ddd"};\n  border-radius: 50%;\n  display: inline-block;\n  overflow: hidden;\n`)),De=i.memo((function({className:e="",forceIconType:t,prefix:n,size:a=24,theme:r,value:o}){const{isEthereum:l,specName:c,systemName:d}=(0,_.h)(),{t:u}=(0,O.$)(),{queueAction:m}=(0,ae.L)(),h=r||function(e,t){return"default"===Ce.X.icon&&(0,ke.t)(e,t)||Ce.X.icon}(d,c),p="robohash"===h?Ee.Z:void 0,g=(0,i.useCallback)((e=>m({account:e,action:u("clipboard"),message:u("address copied"),status:"queued"})),[m,u]);return(0,s.jsx)(Ie,{Custom:p,className:e,onCopy:g,prefix:n,size:a,theme:t||(l?"ethereum":h),value:Se(o)?o.toString():o})}));var Be=n(36609);function Le({className:e="",label:t,value:n}){let a;if(Array.isArray(n)){const e=n.filter(((e,t)=>0!==t)),t=e.reduce(((e,t)=>e.add(t)),H.nw).gtn(0);t&&(a=e.map(((e,t)=>(0,s.jsx)(z.Z,{value:e},t))))}return(0,s.jsx)(z.Z,{className:`${e} ui--Balance`,label:t,value:Array.isArray(n)?n[0]:n,children:a&&(0,s.jsxs)("span",{children:[" (+",a,")"]})})}const $e=i.memo((function(e){const{balance:t,className:n="",label:a,params:i}=e;return i?t?(0,s.jsx)(s.Fragment,{children:Le({className:n,label:a,value:t})}):(0,s.jsx)(Be.Z,{className:`${n} ui--Balance`,label:a,params:i}):null})),Ve={transform:e=>e.unwrapOr(null)},Pe={transform:e=>e.unwrapOr(null)},Ze=i.memo((function({children:e,className:t="",label:n,params:a}){const{api:i}=(0,_.h)(),r=(0,te.W7)(i.query.staking?.bonded,[a],Ve),o=(0,te.W7)(r&&i.query.staking?.ledger,[r],Pe);return(0,s.jsx)(z.Z,{className:t,label:n,value:o?.active,children:e})})),Te=i.memo((function(e){const{bonded:t,className:n="",label:a,params:i}=e;return i?t?(0,s.jsx)(s.Fragment,{children:Le({className:n,label:a,value:t})}):(0,s.jsx)(Ze,{className:`${n} ui--Bonded`,label:a,params:i}):null})),ze=i.memo((function({children:e,className:t="",label:n,params:a}){const{api:i}=(0,_.h)(),r=(0,te.W7)(i.derive.council.votesOf,[a]);return r?.stake.gtn(0)?(0,s.jsx)(z.Z,{className:t,label:n,value:r?.stake,children:e}):null})),Me=i.memo((function({className:e="",label:t,params:n}){return n?(0,s.jsx)(ze,{className:`${e} ui--LockedVote`,label:t,params:n}):null})),Fe=A.z.div`
  overflow-x: hidden;
  padding: 0 0.25rem 0 1rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.padded {
    padding: 0 1rem 0 0;
  }

  &.summary {
    position: relative;
    top: -0.2rem;
  }

  .ui--AddressMini-info {
  }

  .ui--AddressMini-address {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;

    > div {
      overflow: hidden;
      text-overflow: ellipsis;

      &.shortAddress {
        min-width: var(--width-shortaddr);
        max-width: var(--width-shortaddr);
        opacity: var(--opacity-light);
      }
    }
  }

  &.withShrink {
    .ui--AddressMini-address {
      min-width: 3rem;
    }
  }

  .ui--AddressMini-label {
    margin: 0 0 -0.5rem 2.25rem;
  }

  .ui--AddressMini-balances {
    display: grid;

    .ui--Balance,
    .ui--Bonded,
    .ui--LockedVote {
      font-size: var(--font-size-tiny);
      margin-left: 2.25rem;
      margin-top: -0.5rem;
      text-align: left;
    }
  }

  .ui--AddressMini-icon {
    .ui--AddressMini-icon-info {
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
      z-index: 1;
    }

    .ui--IdentityIcon {
      margin-right: 0.5rem;
      vertical-align: middle;
    }
  }

  .ui--AddressMini-icon,
  .ui--AddressMini-info {
    position: relative;
    vertical-align: middle;
  }

  .ui--AddressMini-summary {
    font-size: var(--font-size-small);
    line-height: 1.2;
    margin-left: 2.25rem;
    margin-top: -0.2rem;
    text-align: left;
  }
`,He=i.memo((function({balance:e,bonded:t,children:n,className:a="",iconInfo:i,isHighlight:r,isPadded:o=!0,label:l,labelBalance:c,nameExtra:d,onNameClick:u,summary:m,value:h,withAddress:p=!0,withBalance:g=!1,withBonded:f=!1,withLockedVote:b=!1,withName:x=!0,withShrink:v=!1,withSidebar:A=!0}){return h?(0,s.jsxs)(Fe,{className:`${a} ui--AddressMini ${r?"isHighlight":""} ${o?"padded":""} ${v?"withShrink":""}`,children:[l&&(0,s.jsx)("label",{className:"ui--AddressMini-label",children:l}),(0,s.jsxs)("span",{className:"ui--AddressMini-icon",children:[(0,s.jsx)(De,{value:h}),i&&(0,s.jsx)("div",{className:"ui--AddressMini-icon-info",children:i})]}),(0,s.jsxs)("span",{className:"ui--AddressMini-info",children:[p&&(0,s.jsx)("span",{className:"ui--AddressMini-address",onClick:u,children:x?(0,s.jsx)(P,{value:h,withSidebar:A,children:d}):(0,s.jsx)("span",{className:"shortAddress",children:h})}),n]}),(0,s.jsxs)("div",{className:"ui--AddressMini-balances",children:[g&&(0,s.jsx)($e,{balance:e,label:c,params:h}),f&&(0,s.jsx)(Te,{bonded:t,label:"",params:h}),b&&(0,s.jsx)(Me,{params:h}),m&&(0,s.jsx)("div",{className:"ui--AddressMini-summary",children:m})]})]}):null}));var Re=n(37198),Ue=n(16613);const qe="5".padEnd(48,"x"),Oe=(0,A.z)(Ue.Z)`
  button.u.ui--Icon.editButton {
    padding: 0 .3em .3em .3em;
    color: #2e86ab;
    background: none;
    /*trick to let the button in the flow but keep the content centered regardless*/
    margin-left: -2em;
    position: relative;
    right: -2.3em;
    z-index: 1;
  }

  .editSpan {
    white-space: nowrap;

    &:before {
      content: '';
    }
  }

  .ui--AddressRow-balances {
    display: flex;
    .column {
      display: block;

      label,
      .result {
        display: inline-block;
        vertical-align: middle;
      }
    }

    > span {
      text-align: left;
    }
  }

  .ui--AddressRow-placeholder {
    opacity: var(--opacity-light);
  }
`,We=i.memo((function({buttons:e,children:t,className:n,defaultName:a,fullLength:i=!1,isContract:r=!1,isDisabled:o,isEditableName:l,isInline:c,isValid:d,overlay:u,value:m,withTags:h=!1}){const{accountIndex:p,isNull:g,name:f,onSaveName:b,onSaveTags:x,setName:v,setTags:A,tags:w}=(0,Re.B)(m?m.toString():null,r),y=!g&&(d||m||p),j=m?De:Ne.ZP,k=m&&y?m:qe;return(0,s.jsxs)(Oe,{address:k,buttons:e,className:n,defaultName:a,icon:(0,s.jsx)(j,{size:32,value:m?m.toString():null}),isDisabled:o,isEditableName:l,isEditableTags:!0,isInline:c,isShortAddr:!i,name:f,onChangeName:v,onChangeTags:A,onSaveName:b,onSaveTags:x,tags:h?w:void 0,children:[t,u]})})),Qe=A.z.div`
  align-items: center;
  color: #8B8B8B;
  var(--font-size-small);
  display: flex;

  & .parent-icon {
    font-size: var(--font-size-percent-small);
    margin-right: 0.3rem;
    margin-left: 0.15rem;
  }
`,Ke=i.memo((function({address:e,className:t}){return(0,s.jsxs)(Qe,{className:t,"data-testid":"parent",children:[(0,s.jsx)(v.Z,{className:"parent-icon",icon:"code-branch"}),(0,s.jsx)(P,{value:e,withSidebar:!0})]})})),Ge=A.z.div`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.withPadding {
    padding: 0.75rem 0;
  }

  .ui--AddressSmall-icon {
    .ui--IdentityIcon {
      margin-right: 0.5rem;
      vertical-align: middle;
    }
  }

  .ui--AddressSmall-info {
    position: relative;
    vertical-align: middle;

    .parentName, .shortAddress {
      font-size: var(--font-size-tiny);
    }

    .parentName {
      left: 0;
      position: absolute;
      top: -0.80rem;
    }

    .shortAddress {
      bottom: -0.95rem;
      color: #8B8B8B;
      display: inline-block;
      left: 0;
      min-width: var(--width-shortaddr);
      max-width: var(--width-shortaddr);
      overflow: hidden;
      position: absolute;
      text-overflow: ellipsis;
    }
  }

  .ui--AccountName {
    overflow: hidden;
    vertical-align: middle;
    white-space: nowrap;

    &.withSidebar {
      cursor: help;
    }
  }
`,Je=i.memo((function({children:e,className:t="",defaultName:n,onClickName:a,overrideName:i,parentAddress:r,toggle:o,value:l,withShortAddress:c=!1,withSidebar:d=!0}){return(0,s.jsxs)(Ge,{className:`${t} ui--AddressSmall ${r||c?"withPadding":""}`,children:[(0,s.jsx)("span",{className:"ui--AddressSmall-icon",children:(0,s.jsx)(De,{value:l})}),(0,s.jsxs)("span",{className:"ui--AddressSmall-info",children:[r&&(0,s.jsx)("div",{className:"parentName",children:(0,s.jsx)(Ke,{address:r})}),(0,s.jsx)(P,{className:"accountName "+(d?"withSidebar":""),defaultName:n,onClick:a,override:i,toggle:o,value:l,withSidebar:d,children:e}),c&&(0,s.jsx)("div",{className:"shortAddress","data-testid":"short-address",children:l})]})]})})),Ye=A.z.div`
  > label {
    display: inline-block;
    margin: 0 0.5rem !important;
  }

  > label,
  > div {
    vertical-align: middle;
  }

  .ui--Toggle-Slider {
    background: var(--bg-toggle);
    border-radius: 1.5rem;
    display: inline-block;
    height: 1.5rem;
    position: relative;
    width: 3rem;

    &::before {
      background: var(--bg-table);
      border: 0.125rem solid var(--bg-toggle);
      border-radius: 50%;
      content: "";
      height: 1.5rem;
      left: 0;
      position: absolute;
      top: 0;
      width: 1.5rem;
    }
  }

  &:not(.isDisabled) {
    cursor: pointer;

    > label {
      cursor: pointer;
    }
  }

  &.isChecked {
    &:not(.isRadio) {
      .ui--Toggle-Slider:before {
        transform: translateX(1.5rem);
      }
    }

    &.isRadio {
      .ui--Toggle-Slider:before {
        border-width: 0.5rem;
      }
    }
  }

  &.isRadio {
    .ui--Toggle-Slider {
      width: 1.5rem;
    }
  }
`,Xe=i.memo((function({className:e="",isDisabled:t,isRadio:n,label:a,onChange:r,preventDefault:o,value:l}){const c=(0,i.useCallback)((e=>{t||(o&&(e.preventDefault(),e.stopPropagation()),r&&r(!l))}),[t,r,o,l]);return(0,s.jsxs)(Ye,{className:`${e} ui--Toggle ${l?"isChecked":""} ${t?"isDisabled":""} ${n?"isRadio":""}`,onClick:c,children:[a&&(0,s.jsx)("label",{children:a}),(0,s.jsx)("div",{className:"ui--Toggle-Slider "+(n?"highlight--before-border":"")})]})})),_e=A.z.div`
  align-items: flex-start;
  border: 1px solid transparent; /* #eee */
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin: 0.125rem;
  padding: 0.125rem 0.25rem;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;

  .ui--AddressToggle-address {
    filter: grayscale(100%);
    opacity: var(--opacity-light);
  }

  &:hover {
    border-color: #ccc;
  }

  &.isHidden {
    display: none;
  }

  &.isDragging {
    background: white;
    box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.15);
  }

  .ui--AddressToggle-address,
  .ui--AddressToggle-toggle {
    flex: 1;
    padding: 0;
  }

  .ui--AddressToggle-toggle {
    margin-top: 0.1rem;
    text-align: right;
  }

  &.isAye {
    .ui--AddressToggle-address {
      filter: none;
      opacity: 1;
    }
  }
`,et=i.memo((function({address:e,className:t="",filter:n,isHidden:a,noToggle:r,onChange:l,value:c}){const{api:d}=(0,_.h)(),u=(0,o.Y)(e),m=(0,i.useMemo)((()=>!u||(0,b.r7)(d,e,u,n,!1)),[d,e,n,u]),h=(0,i.useCallback)((()=>l&&l(!c)),[l,c]);return(0,s.jsxs)(_e,{className:`${t} ui--AddressToggle ${c||r?"isAye":"isNay"} ${a||!m?"isHidden":""}`,onClick:h,children:[(0,s.jsx)(He,{className:"ui--AddressToggle-address",value:e,withSidebar:!1}),!r&&(0,s.jsx)("div",{className:"ui--AddressToggle-toggle",children:(0,s.jsx)(Xe,{label:"",value:c})})]})}));var tt=n(13940);const nt=i.memo((function({className:e="",label:t,params:n}){return n?(0,s.jsx)(tt.Z,{className:`${e} ui--Available`,label:t,params:n}):null})),at=A.z.div`
  & {
    display: flex;
    align-items: center;

    .ui--AvatarItem-icon {
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .ui--AvatarItem-details {
    .ui--AvatarItem-title {
      font-weight: 600;
      font-size: var(--font-size-base);
    }

    .ui--AvatarItem-subtitle {
      font-weight: var(--font-weight-normal);
      font-size: var(--font-size-base);
    }
  }

  &.big {
    .ui--AvatarItem-icon {
      width: 3.4rem;
      height: 3.4rem;
      margin-right: 0.6rem;

      > .ui--Icon {
        font-size: 1.6rem;
        line-height: 3.4rem;
      }
    }

    .ui--AvatarItem-details {
      .ui--AvatarItem-name {
        font-size: 1.4rem;
        line-height: 1.4rem;
      }
    }
  }
`,st=i.memo((function({children:e,className:t="",icon:n,isBig:a,subtitle:i,title:r}){return(0,s.jsxs)(at,{className:["ui--AvatarItem",t,a&&"big"].join(" "),children:[(0,s.jsx)("div",{className:"ui--AvatarItem-icon",children:n}),(0,s.jsxs)("div",{className:"ui--AvatarItem-details",children:[(0,s.jsx)("div",{className:"ui--AvatarItem-title",children:r}),(0,s.jsx)("div",{className:"ui--AvatarItem-subtitle",children:i})]}),e]})})),it=A.z.article`
  .ui--Icon {
    color: rgba(255, 196, 12, 1);
    margin-right: 0.5rem;
  }
`,rt=i.memo((function({children:e,className:t="",content:n,withIcon:a=!0}){return(0,s.jsxs)(it,{className:`${t} mark warning`,children:[a&&(0,s.jsx)(v.Z,{icon:"exclamation-triangle"}),n,e]})})),ot=i.memo((function(){const{t:e}=(0,O.$)(),{api:t}=(0,_.h)();return(0,f.m)(t.tx.utility.batchAll)?null:(0,s.jsx)(rt,{content:e("This chain does not yet support atomic batch operations. This means that if the transaction gets executed and one of the operations do fail (due to invalid data or lack of available funds) some of the changes made may not be applied.")})}));i.memo((function({className:e="",isDisabled:t,label:n,onClick:a,tabIndex:i}){const{t:r}=(0,O.$)();return(0,s.jsx)(ie.Z,{className:e,icon:"times",isDisabled:t,label:n||r("Cancel"),onClick:a,tabIndex:i})}));var lt=n(87418),ct=n(6046),dt=n(27113),ut=n(40943);const mt=["auctions.bid","balances.forceTransfer","balances.forceUnreserve","balances.setBalance","balances.transfer","balances.transferAllowDeath","balances.transferKeepAlive","bounties.proposeBounty","bounties.proposeCurator","childBounties.proposeCurator","claims.mintClaim","convictionVoting.delegate","convictionVoting.vote","crowdloan.contribute","crowdloan.create","crowdloan.edit","democracy.delegate","democracy.propose","democracy.vote","identity.requestJudgement","identity.setFee","nominationPools.bondExtra","nominationPools.join","nominationPools.unbond","phragmenElection.vote","society.bid","society.vouch","staking.bond","staking.bondExtra","staking.rebond","staking.unbond","tips.tip","tips.tipNew","treasury.proposeSpend","treasury.spend","vesting.forceVestedTransfer","vesting.vestedTransfer"],ht=["auctions.BidAccepted","auctions.ReserveConfiscated","auctions.Reserved","auctions.Unreserved","balances.Deposit","balances.DustLost","balances.Endowed","balances.Transfer","balances.Unreserved","balances.Withdraw","bounties.BountyClaimed","bounties.BountyRejected","claims.Claimed","convictionVoting.Voted","crowdloan.Contributed","crowdloan.Withdrew","democracy.Voted","nominationPools.Bonded","nominationPools.PaidOut","nominationPools.PoolSlashed","nominationPools.Unbonded","nominationPools.UnbondingPoolSlashed","referenda.DecisionDepositPlaced","referenda.DecisionDepositRefunded","referenda.DepositSlashed","referenda.SubmissionDepositRefunded","staking.Bonded","staking.Rewarded","staking.Unbonded","staking.Withdrawn","transactionPayment.TransactionFeePaid","treasury.Deposit"],pt={"Compact<u128>":ut.Z,u128:ut.Z},gt=pt;var ft=n(72282),bt=n.n(ft),xt=n(54371);const vt=()=>{},At=A.z.div`
  .copySpan {
    white-space: nowrap;
  }
`,wt=i.memo((function({children:e,className:t="",icon:n="copy",label:a,type:r,value:o}){const{t:l}=(0,O.$)(),{queueAction:c}=(0,ae.L)(),d=(0,i.useCallback)((()=>{c&&c({action:l("clipboard"),message:l("{{type}} copied",{replace:{type:r||l("value")}}),status:"queued"})}),[r,c,l]);return(0,xt.H)(o)?(0,s.jsx)(At,{className:`${t} ui--CopyButton`,children:(0,s.jsx)(bt(),{onCopy:d,text:o,children:(0,s.jsxs)("div",{className:"copyContainer",children:[e,(0,s.jsx)("span",{className:"copySpan",children:(0,s.jsx)(ie.Z,{className:"icon-button show-on-hover",icon:n,isDisabled:!o,label:a,onClick:vt})})]})})}):null}));var yt=n(12493);const jt=i.memo((function({children:e,className:t="",copyValue:n,defaultValue:a,isFull:i,isHidden:r,isSmall:o,label:l,value:c,withCopy:d,withLabel:u}){return(0,s.jsxs)(yt.Z,{className:t,isFull:i,isHidden:r,isSmall:o,label:l,withLabel:u,children:[(0,s.jsxs)("div",{className:"ui--Static ui dropdown selection disabled",children:[c||a,e]}),d&&(0,s.jsx)(wt,{value:n||c||a})]})})),kt=A.z.div`
  .ui--Labelled.hash .ui--Static {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: unset;
    word-wrap: unset;
    white-space: nowrap;
  }

  .ui--Call--toplevel {
    margin-top: 0;

    .ui--Labelled {
      &:last-child > .ui--Labelled-content > .ui--Static {
        margin-bottom: 0;
      }

      > .ui--Labelled-content > .ui--Static {
        background: var(--bg-static-extra);
      }

      + .ui--Labelled > .ui--Labelled-content > .ui--Static {
        margin-top: 0;
      }
    }
  }

  > .ui--Params {
    margin-top: -0.25rem;
  }
`,Nt=i.memo((function({callName:e,children:t,className:n="",labelHash:a,labelSignature:r,mortality:o,onError:l,tip:c,value:d,withBorder:u,withExpander:m,withHash:h,withSignature:p}){const{t:g}=(0,O.$)(),[{hash:f,overrides:b,params:x,signature:v,signatureType:A,values:w},y]=(0,i.useState)({hash:null,params:[],signature:null,signatureType:null,values:[]});return(0,i.useEffect)((()=>{y(function(e,t,n,a){const s=a&&mt.includes(a)?pt:void 0,i=e.meta.args.map((({name:e,type:t})=>({name:e.toString(),type:(0,ct.s)(t.toString())}))),r=e.args.map((e=>({isValid:!0,value:e}))),o=t?e.hash.toHex():null;let l=null,c=null;if(n&&function(e){return!!e.signature}(e)&&e.isSigned){const t=function(e){return e._raw?.signature?.multiSignature}(e);l=e.signature.toHex(),c=t instanceof dt.x?t.type:null}return{hash:o,overrides:s,params:i,signature:l,signatureType:c,values:r}}(d,h,p,e))}),[e,d,h,p]),(0,s.jsx)(kt,{className:`${n} ui--Call`,children:(0,s.jsxs)(lt.Z,{isDisabled:!0,onError:l,overrides:b,params:x,registry:d.registry,values:w,withBorder:u,withExpander:m,children:[t,(0,s.jsxs)("div",{className:"ui--Call--toplevel",children:[f&&(0,s.jsx)(jt,{className:"hash",label:a||g("extrinsic hash"),value:f,withCopy:!0}),v&&(0,s.jsx)(jt,{className:"hash",label:r||g("signature {{type}}",{replace:{type:A?`(${A})`:""}}),value:v,withCopy:!0}),o&&(0,s.jsx)(jt,{className:"mortality",label:g("lifetime"),value:o}),c?.gtn(0)&&(0,s.jsx)(jt,{className:"tip",label:g("tip"),value:(0,s.jsx)(z.Z,{value:c})})]})]})})})),Ct=i.memo((function({children:e,className:t="",isHeader:n,labelHash:a,labelSignature:r,mortality:o,onError:l,stringId:c,tip:d,value:u,withBorder:m,withHash:h,withSignature:p}){const g=(0,i.useMemo)((()=>u&&u.callIndex?u.registry.findMetaCall(u.callIndex):null),[u]);if(!g||!u)return null;const{meta:f,method:b,section:x}=g,v=`${x}.${b}`;return(0,s.jsx)("div",{className:`${t} ui--CallExpander`,children:(0,s.jsxs)(Y,{isHeader:n,isLeft:!0,summaryHead:(0,s.jsxs)(s.Fragment,{children:[c&&`#${c}: `,v]}),summaryMeta:f,children:[(0,s.jsx)(Nt,{callName:v,labelHash:a,labelSignature:r,mortality:o,onError:l,tip:d,value:u,withBorder:m,withExpander:!0,withHash:h,withSignature:p}),e]})})})),Et=A.z.article`
  position: relative;
  flex: 1 1;
  min-width: 24%;
  justify-content: space-around;

  label {
    opacity: 0.42;
  }

  i.help.circle.icon,
  .ui.button.mini,
  .ui.button.tiny,
  .addTags {
    visibility: hidden;
  }

  .ui--AddressSummary-buttons {
    text-align: right;
    margin-bottom: 2em;

    button {
      margin-left: 0.2em;
    }
  }

  &:hover {
    i.help.circle.icon,
    .ui.button.mini,
    .ui.button.tiny,
    .addTags {
      visibility: visible;
    }

    label {
      opacity: 1;
    }
  }

  &.error {
    background: rgba(255, 0, 0, 0.05);

    &, h1, h2, h3, h4, h5, h6, p {
      color: rgba(156, 0, 0) !important;
    }
  }

  &.success {
    border: 1px solid rgb(168, 255, 136);
    background: rgba(0, 255, 0, 0.05);

    &, h1, h2, h3, h4, h5, h6, p {
      color: rgba(34, 125, 0) !important;
    }
  }

  &.withBottomMargin {
    margin-bottom: 1.5rem;
  }
`,St=i.memo((function({children:e,className:t="",isError:n,isSuccess:a,withBottomMargin:i}){return(0,s.jsx)(Et,{className:`${t} ui--Card ${n&&!a?"error":""} ${!n&&a?"success":""} ${i?"withBottomMargin":""}`,children:e})}));var It=n(1346),Dt=n(12372);const Bt=i.memo((function({angle:e,type:t}){return(0,s.jsx)("div",{className:`clip ${t}`,children:(0,s.jsx)("div",{className:"highlight--bg",style:{transform:`rotate(${e}deg)`}})})})),Lt="3.5rem",$t=A.z.div`
  border-radius: 100%;
  clip-path: circle(50%);
  height: ${Lt};
  position: relative;
  width: ${Lt};

  &.isDisabled {
    filter: grayscale(100%);
    opacity: 0.25;
  }

  .background,
  .clip {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .background {
    opacity: 0.125;
  }

  .inner {
    align-items: center;
    background: var(--bg-inverse);
    border-radius: 100%;
    bottom: 0.375rem;
    color: var(--color-summary);
    display: flex;
    justify-content: center;
    left: 0.375rem;
    position: absolute;
    right: 0.375rem;
    top: 0.375rem;

    div {
      font-size: var(--font-size-small);
      line-height: 1;
    }
  }

  .clip {
    div {
      border-radius: 100%;
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      transform: rotate(0);
      top: 0;
      zoom: 1;
    }
  }

  .clip.first {
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);

    div {
      clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
    }
  }

  .clip.second {
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);

    div {
      clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
    }
  }
`,Vt=i.memo((function({className:e="",isBlurred:t,isDisabled:n,total:a,value:i}){const r=(0,Dt.G)(a||0),o=r.gtn(0)?(0,Dt.G)(i||0).muln(36e3).div(r).toNumber()/100:0;if(o<0)return null;const l=360===o?360:o%360;return(0,s.jsxs)($t,{className:`${e} ui--Progress ${n?"isDisabled":""} ${t?"--tmp":""}`,children:[(0,s.jsx)("div",{className:"background highlight--bg"}),(0,s.jsx)(Bt,{angle:l<=180?l.toFixed(1):"180",type:"first"}),(0,s.jsx)(Bt,{angle:l<=180?"0":(l-180).toFixed(1),type:"second"}),(0,s.jsx)("div",{className:"inner",children:(0,s.jsxs)("div",{children:[Math.floor(100*o/360),"%"]})})]})})),Pt=A.z.article`
  align-items: center;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: var(--color-summary);
  display: flex;
  flex: 0 1 auto;
  flex-flow: row wrap;
  justify-content: flex-end;
  padding: 0 1.5rem;

  .ui--FormatBalance .balance-postfix {
    opacity: 1;
  }

  .ui--Progress {
    margin: 0.5rem 0.125rem 0.125rem 0.75rem;
  }

  > .ui--Labelled {
    font-size: var(--font-size-h1);
    font-weight: var(--font-weight-header);
    position: relative;
    line-height: 1;
    text-align: right;

    > .ui--Labelled-content {
      color: var(--color-header);
    }

    > * {
      margin: 0.25rem 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .isSecondary {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-normal);

      .timer {
        min-width: 8rem;
      }
    }
  }

  @media(max-width: 767px) {
    min-height: 4.8rem;
    padding: 0.25 0.4em;

    > div {
      font-size: 1.4rem;
    }
  }
`,Zt=i.memo((function({children:e,className:t="",label:n,progress:a}){const i=a&&a.value,r=a&&a.total,o=a&&!(0,It.o)(i)&&!(0,It.o)(r)&&i.gten(0)&&r.gtn(0)?i.gt(r)?`>${a.isPercent?"100":(0,p.u)(r)}`:a.isPercent?i.mul(H.S8).div(r).toString():(0,p.u)(i):void 0;if(a&&(0,It.o)(o))return null;const l=a&&a.withTime&&!(0,It.o)(a.total),c=(n??"").toString();return(0,s.jsxs)(Pt,{className:t,"data-testid":`card-summary:${c}`,children:[(0,s.jsxs)(yt.Z,{isSmall:!0,label:n,children:[e,a&&!a.hideValue&&(0,s.jsxs)(s.Fragment,{children:[l&&!e&&(0,s.jsx)(M.Z,{className:a.isBlurred?"--tmp":"",value:a.total}),(0,s.jsx)("div",{className:l?"isSecondary":"isPrimary",children:!o||(0,It.o)(a.total)?"-":l&&!a.isPercent&&a.value?(0,s.jsx)(M.Z,{className:(a.isBlurred?"--tmp":"")+" timer",value:a.total.sub(a.value)}):`${o}${a.isPercent?"":"/"}${a.isPercent?"%":(0,p.u)(a.total)}`})]})]}),a&&!a.hideGraph&&(0,s.jsx)(Vt,{...a})]})}));var Tt=n(47564),zt=n(84522);const Mt=(0,Tt.Rf)((()=>"")),Ft="\n  background: white;\n  border-radius: 50%;\n  box-sizing: border-box;\n  color: #333;\n\n  &.isInline {\n    display: inline-block;\n    height: 24px;\n    margin-right: 0.75rem;\n    vertical-align: middle;\n    width: 24px;\n  }\n",Ht=(0,A.z)(v.Z)`${Ft}`,Rt=A.z.img`${Ft}`,Ut=i.memo((function({className:e="",isInline:t,logo:n,onClick:a,withoutHl:r}){const{apiEndpoint:o}=(0,_.h)(),[l,c,d]=(0,i.useMemo)((()=>{const e=Mt.find((e=>e.info===n))?.ui.logo||n||o?.ui.logo,t=e||zt.h,[a,s]=t&&"empty"!==t&&(t.startsWith("data:")||t.startsWith("fa;"))?t.startsWith("fa;")?[!0,t.substring(3)]:[!1,t]:[!1,zt.h];return[!e||"empty"===n,s,a]}),[o,n]),u=`${e} ui--ChainImg ${l&&!r?"highlight--bg":""} ${t?"isInline":""}`;return d?(0,s.jsx)(Ht,{className:u,icon:c}):(0,s.jsx)(Rt,{alt:"chain logo",className:u,onClick:a,src:c})}));var qt=n(22581);const Ot=(0,A.z)(Xe)`
  text-align: right;
`,Wt=i.memo((function({className:e="",genesisHash:t,isDisabled:n,onChange:a}){const{t:r}=(0,O.$)(),{api:o,isDevelopment:l}=(0,_.h)(),c=(0,i.useMemo)((()=>function(e,t){return!!t&&(Object.values(qt.p).find((t=>t.includes(e)))||[e]).includes(t)}(o.genesisHash.toHex(),t)),[o,t]),d=(0,i.useCallback)((e=>a(e?o.genesisHash.toHex():null)),[o,a]);return l?null:(0,s.jsx)(Ot,{className:e,isDisabled:n,label:r("only this network"),onChange:d,preventDefault:!0,value:c})}));var Qt=n(24468),Kt=n(80808),Gt=n(74844),Jt=n(93738);const Yt=A.z.div`
  position: relative;
  display: inline-block;
  padding: 1em 1em 0;
  height: 15vw;
  width: 15vw;
`,Xt=i.memo((function({children:e,className:t=""}){return(0,s.jsx)(Yt,{className:`${t} ui--Chart`,children:e})})),_t=i.memo((function({className:e="",size:t=100,values:n}){const a={colorHover:[],colorNormal:[],data:[],labels:[]};return n.forEach((({colors:[e="#00f",t],label:n,value:s})=>{a.colorNormal.push(e),a.colorHover.push(t||e),a.data.push((0,Dt.G)(s).toNumber()),a.labels.push(n)})),(0,s.jsx)(Xt,{className:`${e} ui--Chart-Doughnut`,children:(0,s.jsx)(Jt.$I,{data:{datasets:[{backgroundColor:a.colorNormal,data:a.data,hoverBackgroundColor:a.colorHover}],labels:a.labels},height:t,width:t})})}));var en=n(65968),tn=n(88858);function nn(e){return tn.c(e).alpha(.65).rgbString()}const an=i.memo((function({aspectRatio:e=8,className:t="",max:n=100,showLabels:a=!1,values:r}){const[{chartData:o,chartOptions:l,jsonValues:c},d]=(0,i.useState)({});return(0,i.useEffect)((()=>{const t=JSON.stringify(r);t!==c&&d(function(e,t,n,a,s){return{chartData:t.reduce(((e,{colors:[t="#00f",n],label:a,value:s})=>{const i=e.datasets[0];return i.backgroundColor.push(nn(t)),i.hoverBackgroundColor.push(nn(n||t)),i.data.push((0,en.h)(s)?s:(0,Dt.G)(s).toNumber()),e.labels.push(a),e}),{datasets:[{backgroundColor:[],data:[],hoverBackgroundColor:[]}],labels:[]}),chartOptions:{aspectRatio:e,plugins:{legend:{display:!1},tooltip:{callbacks:{label:e=>t[e.dataIndex].tooltip||t[e.dataIndex].label}}},scales:{x:s?{beginAtZero:!0,max:a}:{display:!1}}},jsonValues:n}}(e,r,t,n,a))}),[e,c,n,a,r]),o?(0,s.jsx)("div",{className:`${t} ui--Chart-HorizBar`,children:(0,s.jsx)(Jt.$Q,{data:o,height:null,options:l,width:null})}):null}));var sn=n(33403),rn=n(6485);function on(e="<unknown>"){return(0,s.jsx)(s.Fragment,{children:e.split("\n").map(((e,t)=>(0,s.jsx)("div",{children:e},t)))})}class ln extends i.Component{state={error:null,prevTrigger:null};static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps({trigger:e},{prevTrigger:t}){const n=JSON.stringify({trigger:e});return t!==n?{error:null,prevTrigger:n}:null}componentDidCatch(e){const{doThrow:t,onError:n}=this.props;if(n&&n(),t)throw e}render(){const{children:e,error:t,t:n}=this.props,{error:a}=this.state,i=t||a;return i?(0,s.jsxs)("article",{className:"error extraMargin",children:[(0,s.jsx)("p",{children:n("Uncaught error. Something went wrong with the query and rendering of this component. Please supply all the details below when logging an issue, it may help in tracing the cause.")}),(0,s.jsx)("p",{children:i.message}),on(i.stack)]}):e}}const cn=(0,O.Z)(ln),dn=["#ff8c00","#008c8c","#8c008c"],un={animation:{duration:0},elements:{point:{hoverRadius:6,radius:0}},hover:{intersect:!1},interaction:{intersect:!1,mode:"index"},plugins:{crosshair:{line:{color:"#ff8c00",dashPattern:[5,5],width:2},snap:{enabled:!0},sync:{enabled:!0},zoom:{enabled:!1}},legend:{display:!1},tooltip:{intersect:!1}},scales:{x:{ticks:{maxRotation:60,minRotation:60}}}},mn=A.z.div`
  h1.ui--Chart-Header {
    margin-bottom: 0.25rem;
    margin-top: 1rem;
    padding-left: 0.25rem;
  }
`,hn=i.memo((function({className:e="",colors:t,labels:n,legends:a,options:r,title:o,values:l}){const c=(0,i.useMemo)((()=>function(e={}){return(0,sn.Z)({},un,e,{plugins:(0,sn.Z)({},un.plugins,e.plugins,{annotation:(0,sn.Z)({},un.plugins?.annotation,e.plugins?.annotation),crosshair:(0,sn.Z)({},un.plugins?.crosshair,e.plugins?.crosshair),tooltip:(0,sn.Z)({},un.plugins?.tooltip,e.plugins?.tooltip)}),scales:(0,sn.Z)({},un.scales,e.scales,{x:(0,sn.Z)({},un.scales?.x,e.scales?.x),y:(0,sn.Z)({},un.scales?.y,e.scales?.y)})})}(r)),[r]),d=(0,i.useMemo)((()=>function(e=[],t,n,a){return a.reduce(((n,a,s)=>{const i=e[s]||nn(dn[s]),r=a.map((e=>(0,rn.H)(e)?e.toNumber():e));return n.datasets.push({backgroundColor:i,borderColor:i,cubicInterpolationMode:"default",data:r,fill:!1,hoverBackgroundColor:i,label:t[s],lineTension:.25}),n}),{datasets:[],labels:n})}(t,a,n,l)),[t,n,a,l]);return(0,s.jsxs)(mn,{className:`${e} ui--Chart-Line`,children:[o&&(0,s.jsx)("h1",{className:"ui--Chart-Header",children:o}),(0,s.jsx)(cn,{children:(0,s.jsx)(Jt.x1,{data:d,options:c})})]})}));Qt.kL.register(Qt.uw,Qt.f$,Qt.jn,Qt.od,Qt.Dx,Qt.u,Kt.Z,Gt.ZP);const pn={Doughnut:_t,HorizBar:an,Line:hn},gn=A.z.div`
  display: inline-block;
  cursor: pointer;

  &.isDisabled {
    opacity: 0.5;
  }

  &:not(.isDisabled) {
    cursor: pointer;
  }

  > label {
    color: var(--color-text);
    display: inline-block;
    margin: 0 0.5rem;
    opacity: 1;
    cursor: pointer;
    user-select: none;
  }

  > label,
  > .ui--Icon {
    vertical-align: middle;
  }

  .ui--Icon {
    border: 1px solid var(--color-checkbox);
    border-radius: 0.125rem;
  }
`,fn=i.memo((function({className:e="",isDisabled:t,label:n,onChange:a,value:r}){const o=(0,i.useCallback)((()=>{!t&&a&&a(!r)}),[t,a,r]);return(0,s.jsxs)(gn,{className:`${e} ui--Checkbox ${t?"isDisabled":""}`,onClick:o,children:[(0,s.jsx)(v.Z,{color:r?"normal":"transparent",icon:"check"}),n&&(0,s.jsx)("label",{children:n})]})})),bn="750px",xn="550px",vn="\n  display: flex;\n  flex-wrap: wrap;\n\n  &.is50 {\n    > .ui--Column {\n      max-width: 50%;\n      min-width: 50%;\n    }\n  }\n\n  &.is60 {\n    > .ui--Column:first-child {\n      max-width: 60%;\n      min-width: 60%;\n    }\n\n    > .ui--Column:last-child {\n      max-width: 40%;\n      min-width: 40%;\n    }\n  }\n\n  &.is100 {\n    > .ui--Column {\n      max-width: 100%;\n      min-width: 100%;\n    }\n  }\n",An=A.z.div`
  &.isReverse {
    flex-direction: row-reverse;
  }

  &.defaultSize {
    @media only screen and (min-width: ${"1025px"}) {
      ${vn}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.75rem;
    }
  }

  &.smallSize {
    @media only screen and (min-width: ${bn}) {
      ${vn}
    }

    &isPadded > .ui--Column {
      padding: 0 0.5rem;
    }
  }

  &.tinySize {
    @media only screen and (min-width: ${xn}) {
      ${vn}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.25rem;
    }
  }

  &.defaultSize, &.smallSize {
    @media only screen and (max-width: ${bn}) {
      &.isPadded > .ui--Column {
        padding: 0 0.5rem;
      }
    }
  }

  &.defaultSize, &.smallSize, &.tinySize {
    @media only screen and (max-width: ${xn}) {
      &.isPadded > .ui--Column {
        padding: 0 0.25rem;
      }
    }
  }

  > .ui--Column {
    box-sizing: border-box;
    max-width: 100%;
    flex: 1 1;
    margin: 0;
    width: 100%;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }
`,wn=i.memo((function({children:e,className:t="",is60:n,is100:a,isPadded:i=!0,isReverse:r,size:o="default"}){return(0,s.jsx)(An,{className:`${t} ui--Columar ${a?"is100":n?"is60":"is50"} ${i?"isPadded":""} ${r?"isReverse":""} ${o}Size`,children:e})}));wn.Column=function({children:e,className:t=""}){return(0,s.jsx)("div",{className:`${t} ui--Column`,children:e})};const yn=wn;var jn=n(56360),kn=n(97794),Nn=n(25294);const Cn=[1,2,4,8,16,32].map(((e,t)=>[t+1,e,new(de())(e)])),En=i.memo((function({className:e="",label:t,onChange:n,value:a,voteLockingPeriod:r}){const{t:o}=(0,O.$)(),l=(0,jn.n)(),c=(0,i.useRef)(function(e,t,n){return[{text:n("0.1x voting balance, no lockup period"),value:0},...Cn.map((([a,s,i])=>({text:n("{{value}}x voting balance, locked for {{duration}}x duration{{period}}",{replace:{duration:s,period:t&&t.gt(H.nw)?` (${(0,kn.A)(e,i.mul(t),n)[1]})`:"",value:a}}),value:a})))]}(l,r,o));return(0,s.jsx)(Nn.Z,{className:e,label:t,onChange:n,options:c.current,value:a})}));n(79472);var Sn=n(92890);const In=A.z.div`
  .codeflask {
    border: 1px solid var(--border-input);
    background: transparent;
  }

  &.invalid {
    .codeflask {
      background-color: #fff6f6;
      border-color: #e0b4b4;
    }
  }
`,Dn=i.memo((function({className:e="",code:t,isValid:n,onEdit:a}){const[r]=(0,i.useState)((()=>`flask-${Date.now()}`)),o=(0,i.useRef)(null);return(0,i.useEffect)((()=>{const e=new Sn.Z(`#${r}`,{language:"js",lineNumbers:!0});e.updateCode(t),e.editorRoot.addEventListener("keydown",(()=>{e.onUpdate(a)})),o.current=e}),[]),(0,i.useEffect)((()=>{o.current&&o.current.updateCode(t)}),[t]),(0,s.jsx)(In,{className:`${e} ui-Editor ${!1===n?"invalid":""}`,id:r})}));var Bn=n(33749);const Ln=i.memo((function({children:e,className:t="",eventName:n,value:a,withExpander:r}){const{t:o}=(0,O.$)(),l=a.data.names,c=a.typeDef.map(((e,t)=>({name:l&&l[t]||void 0,type:e}))),d=a.data.map((e=>({isValid:!0,value:e}))),u=(0,i.useMemo)((()=>n&&ht.includes(n)?gt:void 0),[n]),m=(0,i.useMemo)((()=>{if("contracts"===a.section&&"ContractExecution"===a.method&&2===a.data.length){const[e,t]=a.data;try{const n=(0,b.oX)(e.toString());if(n){const e=n.decodeEvent(t);return{...e,values:e.args.map((e=>({isValid:!0,value:e})))}}}catch(e){console.error(e)}}return null}),[a]);return(0,s.jsxs)("div",{className:`${t} ui--Event`,children:[e,(0,s.jsx)(lt.Z,{isDisabled:!0,overrides:u,params:c,registry:a.registry,values:d,withExpander:r,children:m&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(Bn.ZP,{isDisabled:!0,label:o("contract event"),value:m.event.identifier}),(0,s.jsx)(lt.Z,{isDisabled:!0,params:m.event.args,registry:a.registry,values:m.values})]})})]})}));var $n=n(11677),Vn=n(27421),Pn=n(91012);const Zn=(0,$n.e)("useWindowSize",(function(){return(0,i.useContext)(Pn.d)})),Tn=(0,$n.e)("useWindowColumns",(function(e=3){const t=Zn();return(0,Vn.N)(e>=3&&t.width>=1500?3:e>=2&&t.width>=1050?2:1)})),zn=i.memo((function({children:e,className:t="",colSpan:n,label:a,labelPost:i,rowSpan:r,value:o,withLoading:l}){return(0,s.jsxs)("td",{className:`${t} ui--Table-Column-Balance number`,colSpan:n,rowSpan:r,children:[o?(0,s.jsx)(z.Z,{label:a,labelPost:i,value:o}):l&&(0,s.jsx)(z.Z,{className:"--tmp",value:1}),e]})})),Mn=A.z.td`
  && {
    box-sizing: content-box;
    cursor: pointer;
    min-width: 1.7rem;
    padding-left: 0;
    text-align: left;
    width: 1.7rem;

    > div {
      align-items: center;
      border: 1px solid var(--border-table);
      border-radius: 4px;
      box-sizing: border-box;
      display: inline-flex;
      height: 1.7rem;
      justify-content: center;
      width: 1.7rem;
    }
  }
`,Fn=i.memo((function({className:e="",colSpan:t,isExpanded:n,rowSpan:a,toggle:i}){return(0,s.jsx)(Mn,{className:`${e} ui--Table-Column-Expand`,colSpan:t,onClick:i,rowSpan:a,children:(0,s.jsx)("div",{children:(0,s.jsx)(v.Z,{icon:n?"caret-up":"caret-down"})})})})),Hn=A.z.td`
  && {
    box-sizing: content-box;
    cursor: pointer;
    min-width: 1rem;
    padding-right: 0.35rem;
    text-align: right;
    width: 1rem;
  }
`,Rn=i.memo((function({address:e,className:t="",colSpan:n,isFavorite:a,rowSpan:r,toggle:o}){const l=(0,i.useCallback)((()=>o(e)),[e,o]);return(0,s.jsx)(Hn,{className:`${t} ui--Table-Column-Favorite`,colSpan:n,onClick:l,rowSpan:r,children:(0,s.jsx)(v.Z,{color:a?"orange":"gray",icon:"star"})})})),Un=`${7.15.toFixed(3)}ch`,qn=A.z.td`
  && {
    box-sizing: content-box;
    min-width: ${Un};
    text-align: right;
    white-space: nowrap;
    width: ${Un};
`,On=i.memo((function({children:e,className:t="",colSpan:n,rowSpan:a,value:i}){return(0,s.jsxs)(qn,{className:`${t} ui--Table-Column-Id`,colSpan:n,rowSpan:a,children:[(0,s.jsx)("h2",{className:"--digits",children:(0,p.u)(i)}),e]})})),Wn=i.memo((function({children:e,className:t=""}){return(0,s.jsx)("td",{className:`${t} ui--Table-Column`,children:e})}));Wn.Balance=zn,Wn.Expand=Fn,Wn.Favorite=Rn,Wn.Id=On;const Qn=Wn,Kn=i.memo((function({children:e,className:t=""}){return(0,s.jsx)("tr",{className:`${t} ui--Table-Row`,children:e})}));var Gn=n(48166);const Jn=i.memo((function({children:e,className:t="",empty:n,emptySpinner:a,isEmpty:i,noBodyTag:r}){const o=`${t} ui--Table-Body`;return i?(0,s.jsx)("tbody",{className:o,children:(0,s.jsx)("tr",{children:(0,s.jsx)("td",{colSpan:100,children:(0,xt.H)(n)?(0,s.jsx)("div",{className:"empty",children:n}):n||(0,s.jsx)(Gn.Z,{label:a})})})}):r?(0,s.jsx)(s.Fragment,{children:e}):(0,s.jsx)("tbody",{className:o,children:e})})),Yn=A.z.tfoot`
  td {
    color: var(--color-table-foot);
    font: var(--font-sans);
    font-weight: var(--font-weight-normal);
    padding: 0.75rem 1rem 0.25rem;
    text-align: right;
    vertical-align: baseline;
    white-space: nowrap;
  }

  tr {
    background: var(--bg-page);
  }
`,Xn=i.memo((function({className:e="",footer:t,isEmpty:n}){return!t||n?null:(0,s.jsx)(Yn,{className:`${e} ui--Table-Foot`,children:t})})),_n=A.z.thead`
  z-index: 1;

  th {
    background: var(--bg-table);
    font: var(--font-sans);
    font-weight: var(--font-weight-normal);
    padding: 0.375rem 1rem;
    text-align: right;
    vertical-align: middle;
    white-space: nowrap;

    h1 {
      display: table-cell;
      vertical-align: middle;

      .sub {
        display: inline-block;
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-normal);
        opacity: var(--opacity-light);
        padding-left: 1.5rem;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }

    > label {
      margin: 0 !important;
    }

    &.address {
      padding-left: 3rem;
      text-align: left;
    }

    &.badge {
      padding: 0;
    }

    &.expand,
    &.number {
      text-align: right;
    }

    &.isClickable {
      cursor: pointer;
    }

    &.mini {
      padding: 0 !important;
    }

    &.no-pad-left {
      padding-left: 0.125rem;
    }

    &.no-pad-right {
      padding-right: 0.125rem;
    }

    &.start {
      text-align: left;
    }

    &.balances {
      text-align: right;
      padding-right: 2.25rem;
    }
  }

  tr {
    text-transform: lowercase;

    &.filter {
      .ui.input,
      .ui.selection.dropdown {
        background: transparent;

        &:first-child {
          margin-top: 0;
        }
      }

      th {
        padding: 0;
      }
    }

    &:not(.filter) {
      th {
        color: var(--color-table-head);
      }
    }
  }
`,ea=i.memo((function({children:e,className:t="",filter:n,header:a,isEmpty:i}){return a?.length?(0,s.jsxs)(_n,{className:`${t} ui--Table-Head`,children:[n&&(0,s.jsx)("tr",{className:"filter",children:(0,s.jsx)("th",{colSpan:100,children:n})}),(0,s.jsx)("tr",{children:a.filter((e=>!!e)).map((([e,t="default",n=1,a],r)=>(0,s.jsx)("th",{className:t,colSpan:n,onClick:a,children:0===r?(0,s.jsx)("h1",{children:e}):!i&&e&&(0,s.jsx)("label",{children:e})},r)))}),e]}):null})),ta={2:[0,1],3:[0,1,2]},na="0.125rem solid var(--bg-page)",aa="0.25rem solid var(--bg-page)",sa="0.5rem",ia=A.z.div`
  max-width: 100%;
  width: 100%;

  .ui--Table-Split {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 1.5rem;

    > .ui--Table-Split-3 {
      max-width: 33.3%;
      min-width: 33.3%;
    }

    > .ui--Table-Split-2 {
      max-width: 50%;
      min-width: 50%;
    }
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
    z-index: 1;

    &.isFixed {
      table-layout: fixed;
    }

    &:not(.isInline):not(.noMargin) {
      margin-bottom: 1.5rem;
    }

    &.isInline {
      tbody tr td {
        border-top-width: 1px;
        padding: 0.25rem 0.75rem;
      }
    }

    tr {
      max-width: 100%;
      width: 100%;

      td,
      &:not(.filter) th {
        &:first-child {
          padding-left: 1.5rem;
        }

        &:last-child {
          padding-right: 0.75rem;
        }

        &.all {
          width: 100%;

          &:not(.overflow) {
            word-break: break-word;
          }

          summary {
            white-space: normal;
          }
        }
      }
    }
  }

  tbody, thead {
    position: relative;
    width: 100%;

    tr {
      width: 100%;
    }
  }

  tbody {
    position: relative;

    td {
      background: var(--bg-table);
      padding: 0.5rem 1rem;
      text-align: left;
      vertical-align: middle;

      > article.mark {
        margin-left: 0rem;
      }

      &:first-child {
        border-left: ${na};
      }

      &:last-child {
        border-right: ${na};
      }

      label {
        display: block !important;
        white-space: nowrap;
      }

      div.empty {
        opacity: var(--opacity-light);
        padding: 0.25rem;
      }

      .ui--Spinner {
        margin: 0 auto;

        .text {
          margin-bottom: 0;
        }
      }

      &.actions {
        padding-left: 0.35rem;
        width: 1%;

        > div {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          justify-content: flex-end;

          & > * + * {
            margin-left: 0.35rem;
          }

          .ui--Button {
            white-space: nowrap;
          }
        }

        &:not(:last-child) {
          padding-right: 0;
        }
      }

      &.address {
        max-width: 0;
        min-width: 15rem;
        overflow-x: hidden;
      }

      &.badge {
        padding: 0.5rem;
      }

      &.balance {
        min-width: 20rem;
        padding: 0.5rem 0 0.75rem;
      }

      &.button {
        padding: 0.25rem 0.35rem 0.5rem;
        text-align: right;
        white-space: nowrap;

        > * {
          vertical-align: middle;
        }

        .ui--Toggle {
          display: inline-block;
          white-space: nowrap;

          label {
            display: inline-block !important;
          }
        }
      }

      &.chart {
        padding: 0;
      }

      &.expand {
        &:not(.left) {
          text-align: right;
        }

        .ui--Expander + .ui--Expander {
          margin-top: 0.375rem;
        }
      }

      &.hash {
        // we actually want to use 10ch here, however in the
        // block expand page gives different sizes to the hashes
        min-width: 7.5rem;
        white-space: nowrap;

        > .shortHash {
          max-width: var(--width-shorthash);
          min-width: 3em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: var(--width-shorthash);
        }
      }

      &.links {
        padding: 0.5rem 0.75rem;
        text-align: center;
        width: 0;
      }

      &.no-pad-left {
        padding-left: 0.125rem;
      }

      &.no-pad-right {
        padding-right: 0.125rem;
      }

      &.no-pad-top {
        padding-top: 0.125rem;
      }

      &.no-pad {
        padding: 0;
      }

      &.number {
        font-variant-numeric: tabular-nums;
        text-align: right;
      }

      &.relative {
        position: relative;

        .absolute {
          position: absolute;
          right: 0.5rem;
          // this seems aligned with expander (when zoomed in)
          top: 0.72rem;
          white-space: nowrap;
        }
      }

      &.overflow {
        max-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: none;
      }

      &.start {
        text-align: left;
      }

      &.together {
        white-space: nowrap;
      }

      &.top {
        vertical-align: top;
      }

      &.columar {
        vertical-align: top;

        .ui--Columar .ui--Column {
          margin: 1rem 0 0.75rem 0;
          padding: 0;

          * + h5 {
            margin-top: 1rem;
          }

          .ui--Chart-Line {
            padding: 0 0.5rem;
          }
        }
      }

      &.middle {
        text-align: center;
      }

      &.mini {
        padding: 0 !important;
        width: fit-content;
        white-space: normal;

        > div {
          margin-right: 0.75rem;
          max-width: 3.8rem;
          min-width: 3.8rem;
        }
      }

      &.upper {
        text-transform: uppercase;
      }

      .ui--Button-Group .ui--Button:not(.isToplevel) {
        margin: 0;
      }
    }

    tr {
      &:not(.isExpanded) {
        td {
          border-top: ${aa};

          &:first-child {
            border-top-left-radius: ${sa};
            border-bottom-left-radius: ${sa};
          }

          &:last-child {
            border-top-right-radius: ${sa};
            border-bottom-right-radius: ${sa};
          }
        }
      }

      &.isExpanded {
        &.isFirst {
          td {
            border-top: ${aa};

            &:first-child {
              border-top-left-radius: ${sa};
            }

            &:last-child {
              border-top-right-radius: ${sa};
            }
          }
        }

        &.isLast {
          td {
            &:first-child {
              border-bottom-left-radius: ${sa};
            }

            &:last-child {
              border-bottom-right-radius: ${sa};
            }
          }
        }
      }

      &.packedBottom {
        td {
          padding-bottom: 0;
        }
      }

      &.packedTop {
        td {
          padding-top: 0;
        }
      }

      &.packedAll {
        td {
          padding-bottom: 0;
          padding-top: 0;
        }
      }

      &.transparent {
        background: transparent;
      }

      &.isCollapsed {
        display: none;
      }

      .ui--Button-Group {
        margin: 0;
      }

      .ui--Button:not(.isIcon):not(:hover) {
        background: transparent !important;
        box-shadow: none !important;
      }

      .ui.toggle.checkbox input:checked ~ .box:before,
      .ui.toggle.checkbox input:checked ~ label:before {
        background-color: #eee !important;
      }
    }
  }

  thead {
    tr {
      &:first-child {
        th {
          border-top: ${aa};

          &:first-child {
            border-top-left-radius: ${sa};
          }

          &:last-child {
            border-top-right-radius: ${sa};
          }
        }
      }

      &:last-child {
        th {
          padding-top: 1rem;

          &:first-child {
            border-bottom-left-radius: ${sa};
          }

          &:last-child {
            border-bottom-right-radius: ${sa};
          }
        }
      }

      th {
        &:first-child {
          border-left: ${na};
        }

        &:last-child {
          border-right: ${na};
        }
      }
    }
  }
`,ra=i.memo((function({children:e,className:t="",empty:n,emptySpinner:a,filter:i,footer:r,header:o,headerChildren:l,isFixed:c,isInline:d,isSplit:u,legend:m,maxColumns:h,noBodyTag:p}){const g=Tn(h),f=Array.isArray(e),b=!e||f&&0===e.length,x=(0,s.jsx)(ea,{filter:i,header:o,isEmpty:b,children:l});return u&&f&&!b&&1!==g?(0,s.jsxs)(ia,{className:`${t} ui--Table isSplit`,children:[m,(0,s.jsx)("table",{className:"noMargin",children:x}),(0,s.jsx)("div",{className:"ui--Table-Split",children:ta[g].map((t=>(0,s.jsx)("div",{className:`ui--Table-Split-${g}`,children:(0,s.jsx)("table",{className:"noMargin",children:(0,s.jsx)("tbody",{className:"ui--Table-Body",children:e.filter(((e,n)=>n%g===t))})})},t)))})]}):(0,s.jsxs)(ia,{className:`${t} ui--Table`,children:[m,(0,s.jsxs)("table",{className:`${c&&!b?"isFixed":"isNotFixed"} ${d?"isInline":""}`,children:[x,(0,s.jsx)(Jn,{empty:n,emptySpinner:a,isEmpty:b,noBodyTag:p,children:e}),(0,s.jsx)(Xn,{footer:r,isEmpty:b})]})]})}));ra.Column=Qn,ra.Row=Kn;const oa=ra;function la(e,t){return(0,s.jsx)("tr",{children:(0,s.jsx)("td",{children:e})},t)}const ca=(0,A.z)(Y)`
  .tableContainer {
    overflow-y: scroll;
    display: block;
    margin: 0 0 0 auto;
    max-height: 13.75rem;
    max-width: 25rem;
    overflow-x: hidden;
  }
`,da=i.memo((function({children:e,className:t,empty:n,renderChildren:a,summary:r}){const o=(0,i.useMemo)((()=>!(!a&&!e)),[e,a]),l=(0,i.useCallback)((()=>(a||e)&&(0,s.jsx)("div",{className:"tableContainer",children:(0,s.jsx)(oa,{empty:n,isInline:!0,children:a?a()?.map(la):Array.isArray(e)?e.map(la):(0,s.jsx)("tr",{children:(0,s.jsx)("td",{children:e})})})})),[e,n,a]);return(0,s.jsx)(ca,{className:t,renderChildren:o?l:void 0,summary:r})}));function ua(e,t,n){const a=e.tx[t],i=!n||n(t);return a&&0!==Object.keys(a).length&&i?Object.keys(a).filter((e=>!e.startsWith("$")&&(!n||n(t,e)))).sort().map((e=>{const n=a[e],i=n.meta.args.map((e=>e.name.toString())).join(", ");return{className:"ui--DropdownLinked-Item",key:`${t}_${e}`,text:[(0,s.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[e,"(",i,")"]},`${t}_${e}:call`),(0,s.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(n.meta.docs[0]||e).toString()},`${t}_${e}:text`)],value:e}})):[]}const ma=A.z.div`
  .ui--DropdownLinked-Items {
    .text {
      box-sizing: border-box;
      display: flex !important;
      flex-wrap: nowrap;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
      width: 100%;
      white-space: nowrap;
    }

    > .text {
      padding-left: 1em;
    }
  }

  .ui--DropdownLinked-Item-text,
  .ui--DropdownLinked-Item-call {
    display: inline-block;
  }

  .ui--DropdownLinked-Item-call {
    flex: 1 0;
    margin-right: 1rem;
    text-align: left;
    text-overflow: ellipsis;
  }

  .ui--DropdownLinked-Item-text {
    flex: 1;
    font-size: var(--font-size-small);
    opacity: var(--opacity-light);
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  > .ui--Labelled > label {
    text-transform: none;
  }
`,ha=i.memo((function({children:e,className:t="",label:n,withLabel:a}){return(0,s.jsx)(ma,{className:t,children:(0,s.jsx)(yt.Z,{label:n,withLabel:a,children:(0,s.jsx)("div",{className:"ui--DropdownLinked ui--row",children:e})})})})),pa=i.memo((function({api:e,className:t="",defaultValue:n,isDisabled:a,isError:r,onChange:o,options:l,value:c}){const d=(0,i.useCallback)((t=>e.tx[c.section][t]),[e,c]);return l.length?(0,s.jsx)(Nn.Z,{className:`${t} ui--DropdownLinked-Items`,defaultValue:n,isDisabled:a,isError:r,onChange:o,options:l,transform:d,value:c.method,withLabel:!1}):null})),ga=i.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:a,onChange:i,options:r,value:o}){return(0,s.jsx)(Nn.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isDisabled:n,isError:a,onChange:i,options:r,value:o.section,withLabel:!1})})),fa=i.memo((function({className:e="",defaultValue:t,filter:n,isDisabled:a,label:r,onChange:o,withLabel:l}){const{api:c}=(0,_.h)(),[d,u]=(0,i.useState)((()=>ua(c,t.section,n))),[m]=(0,i.useState)((()=>function(e,t){return Object.keys(e.tx).filter((e=>!e.startsWith("$")&&(!t||t(e)))).sort().filter((t=>Object.keys(e.tx[t]).length)).map((e=>({text:e,value:e})))}(c,n))),[h,p]=(0,i.useState)((()=>t)),[{defaultMethod:g,defaultSection:f}]=(0,i.useState)((()=>({defaultMethod:t.method,defaultSection:t.section}))),b=(0,i.useCallback)((e=>{h!==e&&(p((()=>e)),o&&o(e))}),[o,h]),x=(0,i.useCallback)((e=>{if(e!==h.section){const t=ua(c,e,n);u(t),b(c.tx[e][t[0].value])}}),[b,c,n,h]);return(0,s.jsxs)(ha,{className:e,label:r,withLabel:l,children:[(0,s.jsx)(ga,{className:"small",defaultValue:f,isDisabled:a,onChange:a?void 0:x,options:m,value:h}),(0,s.jsx)(pa,{api:c,className:"large",defaultValue:g,isDisabled:a,onChange:a?void 0:b,options:d,value:h})]})})),ba=i.memo((function({className:e="",defaultArgs:t,defaultValue:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:c,onEnter:d,onEscape:u,withLabel:m}){const h=(0,i.useCallback)((e=>c&&c({isValid:!!e,value:e})),[c]);return(0,s.jsx)(Na,{className:e,defaultArgs:t,defaultValue:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:h,onEnter:d,onEscape:u,withLabel:m})}));function xa(e){return e.map((e=>({isValid:!0,value:e})))}function va(e,t,n){try{return n&&n.value?(a=n.value,(0,xt.H)(a.section)&&(0,xt.H)(a.method)?{initialArgs:xa(n.value.args),initialValue:e.tx[n.value.section][n.value.method]}:function(e){return(0,F.K)(e.method)&&(0,xt.H)(e.method.section)&&(0,xt.H)(e.method.method)}(n.value)?{initialArgs:xa(n.value.method.args),initialValue:e.tx[n.value.method.section][n.value.method.method]}:{initialValue:n.value}):{initialValue:t}}catch{return{initialValue:t}}var a}const Aa=i.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:a,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:d}){const{api:u,apiDefaultTx:m}=(0,_.h)(),[{initialArgs:h,initialValue:p}]=(0,i.useState)((()=>va(u,m,t)));return(0,s.jsx)(ba,{className:e,defaultArgs:h,defaultValue:p,isDisabled:n,isError:a,isPrivate:!1,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:d})})),wa={Call:Aa,OpaqueCall:i.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:a,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:d}){const{api:u,apiDefaultTxSudo:m}=(0,_.h)(),[{initialArgs:h,initialValue:p}]=(0,i.useState)((()=>va(u,m,t))),g=(0,i.useCallback)((({isValid:e,value:t})=>{let n=null;e&&t&&(n=t.method.toHex()),o&&o({isValid:e,value:n})}),[o]);return(0,s.jsx)(ba,{className:e,defaultArgs:h,defaultValue:p,isDisabled:n,isError:a,isPrivate:!0,label:r,onChange:g,onEnter:l,onEscape:c,withLabel:d})})),Proposal:i.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:a,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:d}){const{api:u,apiDefaultTxSudo:m}=(0,_.h)(),[{initialArgs:h,initialValue:p}]=(0,i.useState)((()=>va(u,m,t))),g=(0,i.useCallback)((({isValid:e,value:t})=>{let n=null;e&&t&&(n=u.createType("Proposal",t)),o&&o({isValid:e,value:n})}),[u,o]);return(0,s.jsx)(ba,{className:e,defaultArgs:h,defaultValue:p,isDisabled:n,isError:a,isPrivate:!0,label:r,onChange:g,onEnter:l,onEscape:c,withLabel:d})})),RuntimeCall:Aa},ya=(0,sn.Z)({},wa,pt);function ja({meta:e}){return e.args.map((({name:e,type:t,typeName:n})=>({name:e.toString(),type:{...(0,ct.s)(t.toString()),...n.isSome?{typeName:n.unwrap().toString()}:{}}})))}function ka(e,t=[]){return{extrinsic:{fn:e,params:ja(e)},values:t}}const Na=i.memo((function({defaultArgs:e,defaultValue:t,filter:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:c,onEnter:d,onError:u,onEscape:m,withLabel:h}){const[{extrinsic:p,values:g},f]=(0,i.useState)((()=>ka(t,e)));(0,i.useEffect)((()=>{const e=function(e,t){return t.reduce(((e,t)=>e&&!(0,It.o)(t)&&!(0,It.o)(t.value)&&t.isValid),e.length===t.length)}(p.params,g);let t;if(e)try{t=p.fn(...g.map((({value:e})=>e)))}catch(e){u&&u(e)}else u&&u(null);c(t)}),[p,c,u,g]);const b=(0,i.useMemo)((()=>mt.includes(`${p.fn.section}.${p.fn.method}`)?ya:wa),[p]),x=(0,i.useCallback)((e=>f((t=>e.section===t.extrinsic.fn.section&&e.method===t.extrinsic.fn.method?t:ka(e)))),[]),v=(0,i.useCallback)((e=>f((({extrinsic:t})=>({extrinsic:t,values:e})))),[]),{fn:{method:A,section:w},params:y}=p;return(0,s.jsxs)("div",{className:"extrinsics--Extrinsic",children:[(0,s.jsx)(fa,{defaultValue:t,filter:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:x,withLabel:h}),(0,s.jsx)(lt.Z,{onChange:v,onEnter:d,onEscape:m,overrides:b,params:y,values:g},`${w}.${A}:params`)]})})),Ca=A.z.div`
  display: none;
  right: calc(50% - var(--width-half) + 1.5rem);

  .ui--Labelled label {
    display: none;
  }

  && .ui--Input {
    margin: 0.29rem 0;
  }

  @media only screen and (min-width: 1150px) {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 0;

    > div {
      max-width: 35rem !important;
    }

    .ui--Labelled label {
      display: flex;
    }

    .ui.selection.dropdown {
      white-space: nowrap;
    }
  }

  /* hardcoded: var(--width-full) doesn't work in media */
  @media only screen and (max-width: 1750px) {
    right: 1.5rem;
  }
`,Ea=i.memo((function({children:e,className:t}){return(0,s.jsx)(Ca,{className:t,children:e})}));var Sa=n(17608);const Ia=(0,A.z)(Sa.Z)`
  border-radius: 0 0.25rem 0.25rem 0;
  padding: 0.5833em 1.25em 0.5833em 1.5em;
  font-size: var(--font-size-tiny);
  line-height: 1;
  color: #fff !important;

  &.darkTheme {
    :after {
      background-color: var(--bg-tabs);
    }
  }

  &:after {
    background-color: #fff;
    border-radius: 500rem;
    content: '';
    left: -0.25em;
    margin-top: -0.25em;
    position: absolute;
    width: 0.5em;
    height: 0.5em;
    top: 50%;
  }

  &:before {
    border-radius: 0.2rem 0 0.1rem 0;
    background-color: inherit;
    background-image: none;
    content: '';
    right: 100%;
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    transform: translateY(-50%) translateX(50%) rotate(-45deg);
    top: 50%;
    transition: none;
  }
`,Da=i.memo((function({className:e="",color:t,label:n}){return(0,s.jsx)(Ia,{className:`${e} ${"theme"===t?" highlight--color-bg highlight--bg":""}`,color:t,label:n,size:"tiny"})}));var Ba=n(28316),La=n(82740);const $a=A.z.div`
  background-color: var(--bg-input);
  border-radius: 0 0 4px 4px;

  .ui--Button-Group {
    margin: 1rem 1rem;
  }
`,Va=i.memo((function({children:e,className:t=""}){return(0,s.jsx)($a,{className:`${t} ui--Modal-Actions`,children:(0,s.jsx)(ie.Z.Group,{children:e})})})),Pa=A.z.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  &.centerAlign > div.ui--Modal-Columns-content {
    text-align: center;
  }

  &.rightAlign > div.ui--Modal-Columns-content {
    text-align: right;
  }

  &+& {
    margin-top: 0.25rem;
  }

  > div {
    padding: 0.25em 0;

    &:nth-child(1) {
      flex: 100%;
      max-width: 100%;
    }

    &:nth-child(2) {
      display: none;
      flex: 0%;
    }

    @media only screen and (min-width: 1024px) {
      &:nth-child(1),
      &:only-child {
        flex: 0 65%;
        max-width: 65%;
      }

      &:nth-child(2) {
        box-sizing: border-box;
        display: block;
        flex: 0 34%;
        font-size: var(--font-size-small);
        opacity: 0.75;
        padding: 0.25rem 0 0.25rem 0.5rem;
      }
    }
  }
`,Za=i.memo((function({align:e="left",children:t,className:n="",hint:a}){return(0,s.jsxs)(Pa,{className:`${n} ui--Modal-Columns ${e}Align`,children:[(0,s.jsx)("div",{className:"ui--Modal-Columns-content",children:t}),a&&(0,s.jsx)("div",{className:"ui--Modal-Columns-hint",children:a})]})})),Ta=A.z.div`
  padding: 1.5rem;
`,za=i.memo((function({children:e,className:t=""}){return(0,s.jsx)(Ta,{className:`${t} ui--Modal-Content`,children:e})})),Ma=A.z.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem 0;
`,Fa=i.memo((function({className:e="",header:t,onClose:n}){return(0,s.jsxs)(Ma,{className:`${e} ui--Modal-Header`,children:[t&&(0,s.jsx)("h1",{children:t}),(0,s.jsx)(ie.Z,{dataTestId:"close-modal",icon:"times",onClick:n})]})})),Ha=La.vJ`
  body {
    overflow: hidden;
  }
`,Ra=A.z.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  z-index: 1000;
  overflow-y: auto;

  .ui--Modal__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(96, 96, 96, 0.5);
  }

  .ui--Modal__body {
    margin-top: 30px;
    background: var(--bg-page);
    border-radius: 4px;
    box-shadow: none;

    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);

    max-width: 900px;
    width: calc(100% - 16px);

    color: var(--color-text);
    font: var(--font-sans);
  }

  &.smallSize .ui--Modal__body {
    max-width: 720px;
  }

  &.largeSize .ui--Modal__body {
    max-width: 1080px;
  }
`,Ua=i.memo((function({children:e,className:t="",header:n,onClose:a,size:r="medium",testId:o="modal"}){const{themeClassName:l}=(0,x.F)(),c=(0,i.useCallback)((e=>{"Escape"!==e.key&&27!==e.keyCode||a()}),[a]);return(0,i.useEffect)((()=>(window.addEventListener("keydown",c,!0),()=>{window.removeEventListener("keydown",c,!0)})),[c]),(0,Ba.createPortal)((0,s.jsxs)(Ra,{className:`${t} ui--Modal ${r}Size ${l} `,"data-testid":o,children:[(0,s.jsx)(Ha,{}),(0,s.jsx)("div",{className:"ui--Modal__overlay",onClick:a}),(0,s.jsxs)("div",{className:"ui--Modal__body",children:[(0,s.jsx)(Fa,{header:n,onClose:a}),(0,s.jsx)(cn,{children:e})]})]}),document.body)}));Ua.Actions=Va,Ua.Columns=Za,Ua.Content=za;const qa=Ua;function Oa(e,t){switch(e){case"account":return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{children:t("You are about to remove this account from your list of available accounts. Once completed, should you need to access it again, you will have to re-create the account either via seed or via a backup file.")}),(0,s.jsx)("p",{children:t("This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the account on this browser.")})]});case"address":return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{children:t("You are about to remove this address from your address book. Once completed, should you need to access it again, you will have to re-add the address.")}),(0,s.jsx)("p",{children:t("This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the address on this browser.")})]});case"contract":return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{children:t("You are about to remove this contract from your list of available contracts. Once completed, should you need to access it again, you will have to manually add the contract's address in the Instantiate tab.")}),(0,s.jsx)("p",{children:t("This operation does not remove the history of the contract from the chain, nor any associated funds from its account. The forget operation only limits your access to the contract on this browser.")})]});default:return null}}function Wa(e,t){switch(e){case"account":return t("Confirm account removal");case"address":return t("Confirm address removal");case"contract":return t("Confirm contract removal");case"code":return t("Confirm code removal")}}function Qa(e,t){const{address:n,mode:a="account"}=e;switch(a){case"account":case"address":case"contract":return(0,s.jsx)(We,{isInline:!0,value:n||"",children:Oa(a,t)});default:return null}}const Ka=i.memo((function(e){const{t}=(0,O.$)(),{children:n,mode:a="account",onClose:i,onForget:r}=e;return(0,s.jsxs)(qa,{className:"app--accounts-Modal",header:Wa(a,t),onClose:i,children:[(0,s.jsx)(qa.Content,{children:n||Qa(e,t)}),(0,s.jsx)(qa.Actions,{children:(0,s.jsx)(ie.Z,{icon:"trash",label:t("Forget"),onClick:r})})]})}));var Ga=n(71689);const Ja=[n(70827).Z],Ya=A.z.div`
  .help-button {
    color: var(--color-text);
    cursor: pointer;
    font-size: 2rem;
    padding: 0.35rem 1.5rem 0 0;
  }

  > .help-button {
    position: absolute;
    right: 0rem;
    top: 0rem;
    z-index: 10;
  }

  .help-slideout {
    background: var(--bg-page);
    box-shadow: -6px 0px 20px 0px rgba(0, 0, 0, 0.3);
    bottom: 0;
    max-width: 50rem;
    overflow-y: scroll;
    position: fixed;
    right: -50rem;
    top: 0;
    transition-duration: .5s;
    transition-property: all;
    z-index: 225; /* 5 more than menubar */

    .help-button {
      text-align: right;
    }

    .help-content {
      padding: 1rem 1.5rem 5rem;
    }

    &.open {
      right: 0;
    }
  }
`;i.memo((function({className:e="",md:t}){const[n,a]=(0,G.O)();return(0,s.jsxs)(Ya,{className:`${e} ui--HelpOverlay`,children:[(0,s.jsx)("div",{className:"help-button",children:(0,s.jsx)(v.Z,{icon:"question-circle",onClick:a})}),(0,s.jsxs)("div",{className:"help-slideout "+(n?"open":"closed"),children:[(0,s.jsx)("div",{className:"help-button",children:(0,s.jsx)(v.Z,{icon:"times",onClick:a})}),(0,s.jsx)(Ga.D,{className:"help-content",rehypePlugins:Ja,children:t})]})]})}));const Xa=A.z.a`
  .ui--Icon {
    margin-right: 0.5em;
  }
`,_a=i.memo((function({className:e="",href:t,icon:n,label:a,onClick:i,rel:r,target:o}){return(0,s.jsxs)(Xa,{className:e,href:t,onClick:i,rel:r,target:o,children:[n&&(0,s.jsx)(v.Z,{icon:n}),a]})})),es=(0,A.z)(yt.Z)`
  background: white;
  border-radius: 0 0 0.25rem 0.25rem;
  margin: -0.5rem 0 0.25rem;
  padding: 1.25rem 1.5rem 1rem;

  &.error {
    background: #db2828;
    color: #eee;
  }

  &.warning {
    background: #ffffe0;
  }

  > ul {
    margin: 0;
    padding: 0;
  }
`,ts=i.memo((function({children:e,className:t="",type:n="info"}){return(0,s.jsx)(es,{children:(0,s.jsx)("div",{className:`${t} ${n}`,children:e})})}));var ns=n(55858);const as=(0,A.z)(yt.Z)`
  .ui.selection.dropdown.ui--output.isDisabled {
    background: transparent;
    border-style: dashed;
    opacity: 1;
  }

  pre {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,ss=i.memo((function({children:e,className:t="",isDisabled:n,isError:a,isFull:i,isHidden:r,isMonospace:o,isSmall:l,isTrimmed:c,label:d,labelExtra:u,value:m,withCopy:h=!1,withLabel:p}){return(0,s.jsxs)(as,{className:`${t} ui--Output`,isFull:i,isHidden:r,isSmall:l,label:d,labelExtra:u,withLabel:p,children:[(0,s.jsxs)("div",{className:`ui--output ui dropdown selection ${a?" error":""}${o?" monospace":""}${n?"isDisabled":""}`,children:[c&&(0,xt.H)(m)&&m.length>512?`${m.slice(0,256)}…${m.slice(-256)}`:m,e]}),h&&(0,s.jsx)(wt,{value:m})]})}));function is({inner:e=[],name:t="",outer:n=[]},a=[]){if(n.length){const e=new Array(n.length);for(let t=0;t<n.length;t++)e[t]=(0,ns.c)(n[t],void 0,!1);a.push({name:t,value:e.join(" ")})}for(let t=0;t<e.length;t++)is(e[t],a);return a}const rs=(0,A.z)(ss)`
  table {
    width: 100%;

    tbody {
      width: 100%;

      tr {
        width: 100%;

        td {
          vertical-align: top;
        }

        td:first-child {
          text-align: right;
          vertical-align: middle;
          white-space: nowrap;

          label {
            padding: 0 0.5rem 0 1.25rem;
          }
        }

        &:not(.isLink) td:last-child {
          font: var(--font-mono);
          width: 100%;
        }

        &.isLink td {
          &:last-child {
            max-width: 0;
          }

          a {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
`,os=i.memo((function({className:e,hex:t,inspect:n,label:a}){const{t:r}=(0,O.$)(),{createLink:o}=(0,_.h)(),l=(0,i.useMemo)((()=>n&&is(n)),[n]),[c,d]=(0,i.useMemo)((()=>{if(t){const e=`/extrinsics/decode/${t}`;return[o(e),`#${e}`]}return[null,null]}),[o,t]);return l?(0,s.jsx)(rs,{className:e,isDisabled:!0,label:a,children:(0,s.jsx)("table",{children:(0,s.jsxs)("tbody",{children:[l.map((({name:e,value:t},n)=>(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{children:(0,s.jsx)("label",{children:e})}),(0,s.jsx)("td",{children:t})]},n))),c&&(0,s.jsxs)("tr",{className:"isLink",children:[(0,s.jsx)("td",{children:(0,s.jsx)("label",{children:r("link")})}),(0,s.jsx)("td",{children:(0,s.jsx)("a",{href:c,rel:"noreferrer",target:"_blank",children:d})})]},"hex")]})})}):null}));var ls=n(23729),cs=n.n(ls),ds=n(69187),us=n(99374),ms=n(17751),hs=n(61162),ps=n(94175);const gs=A.z.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
  white-space: nowrap;

  > .address {
    display: inline-block;
    flex: 1;
    font-size: var(--font-size-small);
    margin-left: 1rem;
    max-width: var(--width-shortaddr);
    min-width: var(--width-shortaddr);
    opacity: var(--opacity-light);
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  > .icon {
    position: absolute;
    top: -5px;
    left: 0;
  }

  > .name {
    display: inline-block;
    flex: 1 0;
    margin-left: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;

    &.uppercase {
      text-transform: uppercase;
    }
  }
`,fs=i.memo((function({address:e,className:t=""}){return(0,s.jsxs)(gs,{className:`${t} ui--KeyPair`,children:[(0,s.jsx)(De,{className:"icon",value:e}),(0,s.jsx)("div",{className:"name",children:(0,s.jsx)(P,{value:e})}),(0,s.jsx)("div",{className:"address",children:e})]})}));function bs(e,t=!0){const n="ethereum"===ds.Nn.keyring.type?20:32;try{if((0,ps.m)(e.key).length>=n)return{...e,text:(0,s.jsx)(fs,{address:e.key||"",isUppercase:t,name:e.name})}}catch{}return null}const xs="options:InputAddress",vs="all",As=[];function ws(e){try{return(0,b.Hc)(e,!1,"ethereum"===ds.Nn.keyring.type?20:32)||null}catch{}return null}function ys(e){if(!e)return null;return ws(e)||null}function js(e){let t;const n=ds.Nn.getAccount(e);let a;if(n)a=n.meta.name;else{const n=ds.Nn.getAddress(e);n?(a=n.meta.name,t=n.meta.isRecent):t=!0}return bs((0,us.e)(e,a),!t)}function ks(){return cs().get(xs)||{defaults:{}}}function Ns(e=vs){return ks().defaults[e]}function Cs(e=vs,t){const n=ks();n.defaults[e]=t,cs().set(xs,n)}function Es(e){return e.reduce(((e,t,n)=>(e.some((({key:e},a)=>a!==n&&e===t.key))||e.push(t),e)),[])}class Ss extends i.PureComponent{state={};static getDerivedStateFromProps({type:e,value:t},{lastValue:n}){try{return{lastValue:n||Ns(e),value:Array.isArray(t)?t.map((e=>(0,b.Hc)(e))):(0,b.Hc)(t)||void 0}}catch{return null}}render(){const{className:e="",defaultValue:t,hideAddress:n=!1,isDisabled:a=!1,isError:i,isMultiple:r,label:o,labelExtra:l,options:c,optionsAll:d,placeholder:u,type:m=vs,withEllipsis:h,withLabel:p}=this.props;if(!(c&&0!==c.length||d&&0!==Object.keys(d[m]).length||a))return(0,s.jsx)(jt,{className:e,label:o,children:"No accounts are available for selection."});const{lastValue:g,value:f}=this.state,b=this.getLastOptionValue(),x=ws(a||t&&"0x"!==t&&(this.hasValue(t)||"allPlus"===m)?t:this.hasValue(g)?g:b&&b.value),v=c?Es(c.map((e=>bs(e))).filter((e=>!!e))):a&&x?[js(x)].filter((e=>!!e)):x?this.addActual(x):this.getFiltered(),A=r||!(0,It.o)(f)?void 0:x;return(0,s.jsx)(Is,{className:`${e} ui--InputAddress ${n?"hideAddress":""}`,defaultValue:A,isDisabled:a,isError:i,isMultiple:r,label:o,labelExtra:l,onChange:r?this.onChangeMulti:this.onChange,onSearch:this.onSearch,options:v,placeholder:u,renderLabel:r?this.renderLabel:void 0,value:r&&!f?As:f,withEllipsis:h,withLabel:p})}addActual(e){const t=this.getFiltered();return this.hasValue(e)?t:t.concat(...[js(e)].filter((e=>!!e)))}renderLabel=({value:e})=>{if(e)return(0,b.s2)(e)};getLastOptionValue(){const e=this.getFiltered();return e.length?e[e.length-1]:void 0}hasValue(e){const t=e&&e.toString();return this.getFiltered().some((({value:e})=>e===t))}getFiltered(){const{filter:e,optionsAll:t,type:n=vs,withExclude:a=!1}=this.props;return t?Es(t[n]).filter((({value:t})=>!e||!!t&&(a?!e.includes(t):e.includes(t)))):[]}onChange=e=>{const{filter:t,onChange:n,type:a}=this.props;!t&&Cs(a,e),n&&n(e&&(this.hasValue(e)||"allPlus"===a&&(0,hs.U)(e))?ys(e):null)};onChangeMulti=e=>{const{onChangeMulti:t}=this.props;t&&t(e.map(ys).filter((e=>e)))};onSearch=(e,t)=>{const{isInput:n=!0}=this.props,a=t.trim(),s=a.toLowerCase(),i=e.filter((e=>!!e.value&&(e.name.toLowerCase&&e.name.toLowerCase().includes(s)||e.value.toLowerCase().includes(s))));if(n&&0===i.length){const e=ys(a);e&&i.push(ds.Nn.saveRecent(e.toString()).option)}return i.filter(((e,t)=>{const n=t===i.length-1,a=i[t+1],s=a&&a.value;return!((0,ms.F)(e.value)||(0,It.o)(e.value))||!n&&!!s}))}}const Is=(0,A.z)(Nn.Z)`
  .ui.dropdown .text {
    width: 100%;
  }

  .ui.disabled.search {
    pointer-events: all;
  }

  .ui.search.selection.dropdown {
    > .text > .ui--KeyPair {
      .ui--IdentityIcon {
        left: -2.75rem;
        top: -1.05rem;

        > div,
        img,
        svg {
          height: 32px !important;
          width: 32px !important;
        }
      }

      .name {
        margin-left: 0;

        > .ui--AccountName {
          height: auto;
        }
      }
    }

    > .menu > div.item > .ui--KeyPair > .name  > .ui--AccountName {
      height: auto;
    }
  }

  &.hideAddress .ui.search.selection.dropdown > .text > .ui--KeyPair .address {
    flex: 0;
    max-width: 0;
  }
`,Ds=(0,Z.withMulti)(Ss,(0,Z.withObservable)(ds.Nn.keyringOption.optionsSubject,{propName:"optionsAll",transform:e=>Object.entries(e).reduce(((e,[t,n])=>(e[t]=n.map((e=>null===e.value?function(e){return(0,s.jsx)(Nn.Z.Header,{content:e.name},e.key||e.name)}(e):bs(e))).filter((e=>!!e)),e)),{})}));Ds.createOption=bs,Ds.setLastValue=Cs;const Bs=Ds;var Ls=n(47623);const $s=i.memo((function({address:e,filter:t,isHidden:n,onSelect:a}){const r=(0,i.useCallback)((()=>a(e)),[e,a]);return n?null:(0,s.jsx)(et,{address:e,filter:t,noToggle:!0,onChange:r})})),Vs=i.memo((function({address:e,filter:t,isHidden:n,onDeselect:a}){const r=(0,i.useCallback)((()=>a(e)),[e,a]);return n?null:(0,s.jsx)(et,{address:e,filter:t,noToggle:!0,onChange:r})})),Ps=A.z.div`
  border-top-width: 0px;
  margin-left: 2rem;
  width: calc(100% - 2rem);

  .ui--InputAddressMulti-Input {
    .ui.input {
      margin-bottom: 0.25rem;
      opacity: 1 !important;
    }
  }

  .ui--InputAddressMulti-columns {
    display: inline-flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    width: 100%;

    .ui--InputAddressMulti-column {
      display: flex;
      flex-direction: column;
      min-height: 15rem;
      max-height: 15rem;
      width: 50%;
      padding: 0.25rem 0.5rem;

      .ui--InputAddressMulti-items {
        padding: 0.5rem 0;
        background: var(--bg-input);
        border: 1px solid var(--border-input);
        border-radius: 0.286rem 0.286rem;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        .ui--Spinner {
          margin-top: 2rem;
        }

        .ui--AddressToggle {
          padding-left: 0.75rem;
        }

        .ui--AddressMini-address {
          min-width: auto;
          max-width: 100%;
        }

        .ui--AddressMini-info {
          max-width: 100%;
        }
      }
    }
  }
`,Zs=i.memo((function({available:e,availableLabel:t,className:n="",defaultValue:a,maxCount:r,onChange:o,valueLabel:l}){const{t:c}=(0,O.$)(),[d,u]=(0,i.useState)(""),[m,h]=(0,i.useState)([]),p=(0,Vn.N)(d),g=(0,Ls.q)();(0,i.useEffect)((()=>{a&&h(a)}),[a]),(0,i.useEffect)((()=>{m&&o(m)}),[o,m]);const f=(0,i.useCallback)((e=>h((t=>function(e,t,n){return!e.includes(t)&&e.length<n?e.concat(t):e}(t,e,r)))),[r]),b=(0,i.useCallback)((e=>h((t=>function(e,t){return e.includes(t)?e.filter((e=>e!==t)):e}(t,e)))),[]);return(0,s.jsxs)(Ps,{className:`${n} ui--InputAddressMulti`,children:[(0,s.jsx)(Bn.ZP,{autoFocus:!0,className:"ui--InputAddressMulti-Input",isSmall:!0,onChange:u,placeholder:c("filter by name, address, or account index"),value:d,withLabel:!1}),(0,s.jsxs)("div",{className:"ui--InputAddressMulti-columns",children:[(0,s.jsxs)("div",{className:"ui--InputAddressMulti-column",children:[(0,s.jsx)("label",{children:l}),(0,s.jsx)("div",{className:"ui--InputAddressMulti-items",children:m.map((e=>(0,s.jsx)(Vs,{address:e,onDeselect:b},e)))})]}),(0,s.jsxs)("div",{className:"ui--InputAddressMulti-column",children:[(0,s.jsx)("label",{children:t}),(0,s.jsx)("div",{className:"ui--InputAddressMulti-items",children:g?e.map((e=>(0,s.jsx)($s,{address:e,filter:p,isHidden:m?.includes(e),onSelect:f},e))):(0,s.jsx)(Gn.Z,{})})]})]})]})})),Ts=A.z.div`
  position: relative;

  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: 0.75rem;
    position: absolute;
    top: 1rem;
  }
`,zs=i.memo((function({autoFocus:e,bytesLength:t,children:n,className:a="",defaultValue:r,forceIconType:o,isDisabled:l,isError:c,isFull:d,label:u,noConvert:m,onChange:h,onEnter:p,onEscape:g,placeholder:f}){const[x,v]=(0,i.useState)(r||null),A=(0,i.useCallback)((e=>{const n=(0,b.Hc)(e,void 0,t)||null,a=m?n?e:null:n;v(a),h&&h(a)}),[t,m,h]);return(0,s.jsxs)(Ts,{className:`${a} ui--InputAddressSimple`,children:[(0,s.jsx)(Bn.ZP,{autoFocus:e,defaultValue:r,isDisabled:l,isError:c||!x,isFull:d,label:u,onChange:A,onEnter:p,onEscape:g,placeholder:f,children:n}),(0,s.jsx)(De,{className:"ui--InputAddressSimpleIcon",forceIconType:o,size:32,value:x})]})}));var Ms=n(44294);function Fs(e,t){if(!t)return[];const n=e[t];return n&&0!==Object.keys(e[t]).length?Object.keys(e[t]).filter((e=>!e.startsWith("$"))).sort().map((e=>n[e])).map((({description:e,method:n,params:a})=>{const i=a.map((({name:e})=>e)).join(", ");return{className:"ui--DropdownLinked-Item",key:`${t}_${n}`,text:[(0,s.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[n,"(",i,")"]},`${t}_${n}:call`),(0,s.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:e||n},`${t}_${n}:text`)],value:n}})):[]}const Hs=i.memo((function({className:e="",defs:t,isError:n,onChange:a,options:r,value:o}){const l=(0,i.useCallback)((e=>t[o.section][e]),[t,o]);return r.length?(0,s.jsx)(Nn.Z,{className:`${e} ui--DropdownLinked-Items`,isError:n,onChange:a,options:r,transform:l,value:o.method,withLabel:!1}):null})),Rs=i.memo((function({className:e="",defaultValue:t,isError:n,onChange:a,options:i,value:r}){return(0,s.jsx)(Nn.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:i,value:r.section,withLabel:!1})}));function Us(e){return Object.entries(e).sort((([e],[t])=>e.localeCompare(t)))}const qs=(0,$n.e)("useRuntime",(function(){const{api:e}=(0,_.h)();return(0,i.useMemo)((()=>function(e){const t={};let n=null;const a=Us(e.call);for(let e=0;e<a.length;e++){const[s,i]=a[e],r=Us(i);for(let e=0;e<r.length;e++){const[a,{meta:i}]=r[e];i&&(t[s]||(t[s]={},null===n&&(n=i)),t[s][a]=i)}}return[t,n]}(e)),[e])})),Os=i.memo((function({className:e,label:t,onChange:n,withLabel:a}){const[r,o]=qs(),[l]=(0,i.useState)((()=>{return e=r,Object.keys(e).filter((e=>!e.startsWith("$"))).sort().filter((t=>0!==Object.keys(e[t]).length)).map((e=>({text:e,value:e})));var e})),[c,d]=(0,i.useState)((()=>Fs(r,o&&o.section))),[u,m]=(0,i.useState)((()=>o));(0,i.useEffect)((()=>{u&&n&&n(u)}),[n,u]);const h=(0,i.useCallback)((e=>{u!==e&&m((()=>e))}),[u]),p=(0,i.useCallback)((e=>{if(u&&e!==u.section){const t=Fs(r,e);d(t),h(r[e][t[0].value])}}),[h,r,u]);return u?(0,s.jsxs)(ha,{className:e,label:t,withLabel:a,children:[(0,s.jsx)(Rs,{className:"small",onChange:p,options:l,value:u}),(0,s.jsx)(Hs,{className:"large",defs:r,onChange:h,options:c,value:u})]}):null}));var Ws=n(44055);function Qs(e,t){const n=e.consts[t];return n&&0!==Object.keys(n).length?Object.keys(n).filter((e=>!e.startsWith("$"))).sort().map((a=>{const i=n[a];return{className:"ui--DropdownLinked-Item",key:`${t}_${a}`,text:[(0,s.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[a,": ",(0,Ws.I)(e.registry.lookup,i.meta.type)]},`${t}_${a}:call`),(0,s.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(i.meta.docs[0]||i.meta.name).toString()},`${t}_${a}:text`)],value:a}})):[]}function Ks({value:e}){return t=>({method:t,section:e.section})}const Gs=i.memo((function(e){const{className:t="",isError:n,onChange:a,options:i,value:r}=e;return i.length?(0,s.jsx)(Nn.Z,{className:`${t} ui--DropdownLinked-Items`,isError:n,onChange:a,options:i,transform:Ks(e),value:r.method,withLabel:!1}):null})),Js=i.memo((function({className:e="",defaultValue:t,isError:n,onChange:a,options:i,value:{section:r}}){return(0,s.jsx)(Nn.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:i,value:r,withLabel:!1})})),Ys=i.memo((function({className:e="",defaultValue:t,label:n,onChange:a,withLabel:r}){const{api:o}=(0,_.h)(),[l,c]=(0,i.useState)((()=>Qs(o,t.section))),[d]=(0,i.useState)((()=>function(e){return Object.keys(e.consts).filter((e=>!e.startsWith("$"))).sort().filter((t=>Object.keys(e.consts[t]).length)).map((e=>({text:e,value:e})))}(o))),[u,m]=(0,i.useState)((()=>function(e,{method:t,section:n}){const a=Object.keys(e.consts)[0],s=Object.keys(e.consts[a])[0],i=e.consts[n]&&e.consts[n][t]?{method:t,section:n}:{method:s,section:a};return{...i,meta:e.consts[i.section][i.method].meta}}(o,t))),h=(0,i.useCallback)((e=>{if(u.section!==e.section||u.method!==e.method){const{method:t,section:n}=e,s={meta:o.consts[n][t].meta,method:t,section:n};m(s),a&&a(s)}}),[o,a,u]),p=(0,i.useCallback)((e=>{if(e!==u.section){const t=Qs(o,e);c(t),h({method:t[0].value,section:e})}}),[h,o,u]);return(0,s.jsxs)(ha,{className:e,label:n,withLabel:r,children:[(0,s.jsx)(Js,{className:"small",onChange:p,options:d,value:u}),(0,s.jsx)(Gs,{className:"large",onChange:h,options:l,value:u})]})}));var Xs=n(6574),_s=n(56623),ei=n(74076),ti=n(48533);const ni="0".charCodeAt(0),ai="x".charCodeAt(0),si=()=>{},ii=A.z.div`
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 0.28571429rem;
  font-size: var(--font-size-base);
  margin: 0.25rem 0;
  padding: 0.67857143em 1em;
  width: 100% !important;

  &.error {
    background: var(--bg-input-error);
    border-color: #e0b4b4;
  }

  &:hover {
    cursor: pointer;
  }
`,ri=i.memo((function({accept:e,className:t="",clearContent:n,isDisabled:a,isError:r=!1,isFull:o,label:l,labelExtra:c,onChange:d,placeholder:u,withEllipsis:m,withLabel:h}){const{t:g}=(0,O.$)(),f=(0,i.createRef)(),[b,x]=(0,i.useState)(),v=(0,i.useCallback)((e=>{e.forEach((e=>{const t=new FileReader;t.onabort=si,t.onerror=si,t.onload=({target:t})=>{if(t&&t.result){const n=e.name,a=function(e){const t=new Uint8Array(e);if(t[0]===ni&&t[1]===ai){let e=(0,_s.z)(t);for(;"\n"===e[e.length-1];)e=e.substring(0,e.length-1);if((0,ei.vq)(e))return(0,ti.G)(e)}return t}(t.result);d&&d(a,n),f&&x({name:n,size:a.length})}},t.readAsArrayBuffer(e)}))}),[f,d]),{getInputProps:A,getRootProps:w}=(0,Xs.uI)({accept:e&&e.reduce(((e,t)=>({...e,[t]:[]})),{}),disabled:a,onDrop:v}),y=(0,s.jsxs)(ii,{...w({className:`${t} ui--InputFile ${r?"error":""}`}),children:[(0,s.jsx)("input",{...A()}),(0,s.jsx)("em",{className:"label",children:!b||n?u||g("click to select or drag and drop the file here"):u||g("{{name}} ({{size}} bytes)",{replace:{name:b.name,size:(0,p.u)(b.size)}})})]});return l?(0,s.jsx)(yt.Z,{isFull:o,label:l,labelExtra:c,withEllipsis:m,withLabel:h,children:y}):y}));var oi=n(39764);function li(e,t,n){const a=t[n];return a&&0!==Object.keys(e.rpc[n]).length?Object.keys(e.rpc[n]).filter((e=>!e.startsWith("$"))).sort().map((e=>a[e])).filter((e=>!!e)).filter((({isSubscription:e})=>!e)).map((({description:e,method:t,params:a})=>{const i=a.map((({name:e})=>e)).join(", ");return{className:"ui--DropdownLinked-Item",key:`${n}_${t}`,text:[(0,s.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[t,"(",i,")"]},`${n}_${t}:call`),(0,s.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:e||t},`${n}_${t}:text`)],value:t}})):[]}var ci=n(13529),di=n(91783);const ui=(0,$n.e)("useRpcs",(function(){const{api:e}=(0,_.h)();return(0,i.useMemo)((()=>function(e,t,{specName:n}){return Object.entries((0,di.KM)(e,t,n)).reduce(((e,[t,n])=>(e[t]??=function(e,t){return Object.entries(t).reduce(((t,[n,a])=>(t[n]={isSubscription:!1,jsonrpc:`${n}_${e}`,method:n,section:e,...a},t)),{})}(t,n),e)),{...ci.Z})}(e.registry,e.runtimeChain,e.runtimeVersion)),[e])})),mi=i.memo((function({className:e="",isError:t,onChange:n,options:a,value:r}){const o=ui(),l=(0,i.useCallback)((e=>o[r.section][e]),[o,r]);return a.length?(0,s.jsx)(Nn.Z,{className:`${e} ui--DropdownLinked-Items`,isError:t,onChange:n,options:a,transform:l,value:r.method,withLabel:!1}):null})),hi=i.memo((function({className:e="",defaultValue:t,isError:n,onChange:a,options:i,value:r}){return(0,s.jsx)(Nn.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:i,value:r.section,withLabel:!1})})),pi=i.memo((function({className:e="",defaultValue:t,label:n,onChange:a,withLabel:r}){const{api:o}=(0,_.h)(),l=ui(),[c,d]=(0,i.useState)((()=>li(o,l,t.section))),[u]=(0,i.useState)((()=>function(e){return Object.keys(e.rpc).filter((e=>!e.startsWith("$"))).sort().filter((t=>0!==Object.keys(e.rpc[t]).length)).map((e=>({text:e,value:e})))}(o))),[m,h]=(0,i.useState)((()=>t));(0,i.useEffect)((()=>{a&&a(m)}),[a,m]);const p=(0,i.useCallback)((e=>{m!==e&&h((()=>e))}),[m]),g=(0,i.useCallback)((e=>{if(e!==m.section){const t=li(o,l,e);d(t),p(l[e][t[0].value])}}),[p,o,l,m]);return(0,s.jsxs)(ha,{className:e,label:n,withLabel:r,children:[(0,s.jsx)(hi,{className:"small",onChange:g,options:u,value:m}),(0,s.jsx)(mi,{className:"large",onChange:p,options:c,value:m})]})}));var gi=n(12782);function fi(e,t){const n=e.query[t];return n&&0!==Object.keys(n).length?Object.keys(n).filter((e=>!e.startsWith("$"))).sort().map((a=>{const{meta:{docs:i,modifier:r,name:o,type:l}}=n[a],c=(0,gi.PL)(e.registry,l,r.isOptional);let d="";if(l.isMap){const{hashers:t,key:n}=l.asMap;if(1===t.length)d=(0,Ws.I)(e.registry.lookup,n);else{const t=e.registry.lookup.getSiType(n).def;d=t.isTuple?t.asTuple.map((t=>(0,Ws.I)(e.registry.lookup,t))).join(", "):t.asHistoricMetaCompat.toString()}}return{className:"ui--DropdownLinked-Item",key:`${t}_${a}`,text:[(0,s.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[a,"(",d,"): ",c]},`${t}_${a}:call`),(0,s.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(i[0]||o).toString()},`${t}_${a}:text`)],value:a}})):[]}function bi(e,{value:t}){return function(n){return e.query[t.creator.section]?e.query[t.creator.section][n]:t}}const xi=i.memo((function(e){const{api:t}=(0,_.h)(),{className:n="",isError:a,onChange:i,options:r,value:o}=e;return r.length?(0,s.jsx)(Nn.Z,{className:`${n} ui--DropdownLinked-Items`,isError:a,onChange:i,options:r,transform:bi(t,e),value:o.creator.method,withLabel:!1}):null})),vi=i.memo((function({className:e="",defaultValue:t,isError:n,onChange:a,options:i,value:{creator:{section:r}}}){return(0,s.jsx)(Nn.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:i,value:r,withLabel:!1})})),Ai=i.memo((function({className:e="",defaultValue:t,label:n,onChange:a,withLabel:r}){const{api:o}=(0,_.h)(),[l,c]=(0,i.useState)((()=>fi(o,t.creator.section))),[d]=(0,i.useState)((()=>function(e){return Object.keys(e.query).filter((e=>!e.startsWith("$"))).sort().filter((t=>Object.keys(e.query[t]).length)).map((e=>({text:e,value:e})))}(o))),[u,m]=(0,i.useState)((()=>t)),h=(0,i.useCallback)((e=>{u!==e&&(m((()=>e)),a&&a(e))}),[a,u]),p=(0,i.useCallback)((e=>{if(e!==u.creator.section){const t=fi(o,e);c(t),h(o.query[e][t[0].value])}}),[h,o,u]);return(0,s.jsxs)(ha,{className:e,label:n,withLabel:r,children:[(0,s.jsx)(vi,{className:"small",onChange:p,options:d,value:u}),(0,s.jsx)(xi,{className:"large",onChange:h,options:l,value:u},u.creator.section)]})}));n(35220);var wi=n(6226),yi=n(88311);const ji=["application/wasm"],ki=i.memo((function({onChange:e,...t}){const n=(0,i.useCallback)(((t,n)=>{const a=(0,wi.F)(t);e((0,yi.N)(t),a,n)}),[e]);return(0,s.jsx)(ri,{...t,accept:ji,onChange:n})}));let Ni=0;const Ci=A.z.div`
  cursor: help;
  display: inline-block;
  line-height: 1rem;
  margin: 0 0 0 0.25rem;
`,Ei=i.memo((function({className:e="",help:t,icon:n="question-circle"}){const[a]=(0,i.useState)((()=>"label-help-"+ ++Ni));return(0,s.jsxs)(Ci,{className:`${e} ui--LabelHelp`,tabIndex:-1,children:[(0,s.jsx)(v.Z,{icon:n,tooltip:a}),(0,s.jsx)(w.Z,{text:t,trigger:a})]})}));var Si=n(31530);function Ii(e,{data:t,hash:n,isText:a,type:i}){return Object.entries(Si.N).map((([r,{chains:o,create:l,homepage:c,isActive:d,paths:u,ui:m}])=>{const h=o[e],p=u[i];return d&&h&&p?(0,s.jsx)("a",{href:l(h,p,t,n),rel:"noopener noreferrer",target:"_blank",title:`${r}, ${c}`,children:a?r:(0,s.jsx)("img",{src:m.logo})},r):null})).filter((e=>!!e))}const Di=A.z.div`
  text-align: right;

  &.isMain {
    text-align: left;
  }

  &.isSmall {
    font-size: var(--font-size-small);
    line-height: 1.35;
    text-align: center;
  }

  &.isSidebar {
    text-align: center;

    .links {
      img {
        height: 2rem;
        width: 2rem;
      }
    }
  }

  &:not(.fullColor) {
    .links {
      img {
        filter: grayscale(1) opacity(0.66);

        &:hover {
          filter: grayscale(0) opacity(1);
        }
      }
    }
  }

  .links {
    img {
      border-radius: 50%;
      cursor: pointer;
      height: 1.5rem;
      width: 1.5rem;
    }

    span {
      word-wrap: normal;
      display: inline-block;
    }

    span+span {
      margin-left: 0.3rem;
    }
  }

  &.isLogo {
    line-height: 1;

    .links {
      white-space: nowrap;
    }
  }
`,Bi=i.memo((function({className:e="",data:t,hash:n,isSidebar:a,isSmall:r,isText:o,type:l,withTitle:c}){const{t:d}=(0,O.$)(),{systemChain:u}=(0,_.h)(),m=(0,i.useMemo)((()=>Ii(u,{data:t,hash:n,isSidebar:a,isText:o,type:l})),[u,t,n,a,o,l]);return m.length||c?(0,s.jsxs)(Di,{className:`${e} ui--LinkExternal ${o?"isText":"isLogo"} ${c?"isMain":""} ${r?"isSmall":""} ${a?"isSidebar":""}`,children:[o&&!r&&(0,s.jsx)("div",{children:d("View this externally")}),c&&(0,s.jsx)("h5",{children:d("external links")}),(0,s.jsx)("div",{className:"links",children:m.length?m.map(((e,t)=>(0,s.jsx)("span",{children:e},t))):(0,s.jsx)("div",{children:d("none")})})]}):null})),Li=A.z.article`
  .ui--Icon {
    color: rgba(255, 12, 12, 1);
    margin-right: 0.5rem;
  }
`,$i=i.memo((function({children:e,className:t="",content:n}){return(0,s.jsxs)(Li,{className:`${t} mark error`,children:[(0,s.jsx)(v.Z,{icon:"exclamation-triangle"}),n,e]})})),Vi=A.z.div`
  margin: 0.25rem 0 1rem;
  border-top: 1px solid var(--border-table);

  &:first-child, &:last-child {
    display: none
  }
`,Pi=i.memo((function({className:e=""}){return(0,s.jsx)(Vi,{className:`${e} ui--Menu__Divider`})})),Zi=A.z.div`
  color: var(--color-label);
  font-size: var(--font-size-tiny);
  line-height: 0.857rem;
  margin-bottom: 0.3rem;
`,Ti=i.memo((function({children:e,className:t}){return(0,s.jsx)(Zi,{className:t,children:e})})),zi=A.z.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: var(--font-size-small);
  line-height: 0.93rem;
  padding: 0.5rem 1rem;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  &.hasIcon {
    padding-left: 2.6rem;
  }

  .ui--Icon {
    position: absolute;
    left: 1rem;
  }

  &.isDisabled {
    cursor: default;
    opacity: 0.5;
  }
`,Mi=i.memo((function({children:e,className:t="",icon:n,isDisabled:a,label:r,onClick:o}){const l=(0,i.useCallback)((()=>{!a&&o&&Promise.resolve(o()).catch(console.error)}),[a,o]);return(0,s.jsxs)(zi,{className:`${t} ui--Menu__Item ${n?"hasIcon":""} ${a?"isDisabled":""}`,onClick:l,children:[n&&(0,s.jsx)(v.Z,{color:"darkGray",icon:n}),r,e]})})),Fi=A.z.div`
  display: flex;
  flex-direction: column;
  min-width: 14.286rem;
  margin: 1rem 0;

  & > *:not(.ui--Menu__Item):not(.ui--Menu__Divider) {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`,Hi=i.memo((function({children:e,className:t=""}){return(0,s.jsx)(Fi,{className:`${t} ui--Menu`,children:e})}));Hi.Divider=Pi,Hi.Item=Mi,Hi.Header=Ti;const Ri=Hi;var Ui=n(17965);const qi=i.memo((function({children:e,isActive:t=!0}){const[n,a]=(0,i.useState)((()=>new Array(e.length).fill(!1)));return(0,i.useEffect)((()=>{if(t){const e=n.findIndex((e=>!e));-1!==e&&(0,Ui.Y)((()=>a(n.map(((t,n)=>n===e||t)))))}}),[t,n]),(0,s.jsx)(s.Fragment,{children:t?n.map(((t,n)=>t&&e[n])):(0,s.jsx)(Gn.Z,{})})})),Oi=i.memo((function({children:e,className:t="",label:n,params:a}){const{api:i}=(0,_.h)(),r=(0,te.W7)(i.derive.balances?.all,[a]);return(0,s.jsxs)("div",{className:t,children:[n||"",(0,p.u)(r?.accountNonce),e]})}));i.memo((function({className:e="",label:t,params:n}){return n?(0,s.jsx)(Oi,{className:`${e} ui--Nonce`,label:t,params:n.toString()}):null}));const Wi=i.memo((function({autoFocus:e,children:t,className:n="",defaultValue:a,isDisabled:i,isError:r,isFull:o,label:l,labelExtra:c,name:d,onChange:u,onEnter:m,onEscape:h,tabIndex:p,value:g,withLabel:f}){return(0,s.jsx)(Bn.ZP,{autoFocus:e,className:`${n} ui--Password`,defaultValue:a,isDisabled:i,isError:r,isFull:o,label:l,labelExtra:c,name:d,onChange:u,onEnter:m,onEscape:h,tabIndex:p,type:"password",value:g,withLabel:f,children:t})}));var Qi=n(81679),Ki=n.n(Qi);Ki().config({allowPassphrases:!0,maxLength:128,minLength:8,minPhraseLength:20});const Gi=A.z.div`
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 2rem;
  font-size: var(--font-size-base);
  text-transform: uppercase;
  color: var(--color-label);

  .ui--Strength-bar {
    position: relative;
    height: 0.6rem;
    width: 100%;
    margin: 0 10px;
    border: 1px solid #DFDFDF;
    border-radius: 0.15rem;
    background: #ECECEC;
  }

  .ui--Strength-bar-highlighted {
    position: absolute;
    top: -0.07rem;
    height: 0.6rem;
    width: 100%;
    border-radius: 0.15rem;
    background: linear-gradient(90.43deg, #FF8B00 0%, #FFBB50 112.75%);
  }
`,Ji=i.memo((function({className:e="",value:t}){const{t:n}=(0,O.$)(),a={width:100*function(e){const t=Ki().test(e),n=Math.max(0,t.passedTests.length-t.failedTests.length);return t.isPassphrase?7:n}(t)/7+"%"};return(0,s.jsxs)(Gi,{className:e,style:{display:t?"flex":"none"},children:[n("weak"),(0,s.jsx)("div",{className:"ui--Strength-bar",children:(0,s.jsx)("div",{className:"ui--Strength-bar-highlighted",style:a})}),n("strong")]})}));var Yi=n(84450);const Xi=A.z.div`
  vertical-align: middle;
  white-space: nowrap;

  a.chainAlign {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    max-width: 10em;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
`,_i=i.memo((function({className:e,id:t}){const n=(0,Yi.jC)(t),a=(0,i.useMemo)((()=>n.filter((({isDisabled:e,isUnreachable:t})=>!e&&!t))),[n]);if(!n.length)return null;const{text:r,ui:o,value:l}=a.length?a[a.length-1]:n[0];return(0,s.jsxs)(Xi,{className:e,children:[(0,s.jsx)(Ut,{isInline:!0,logo:o.logo||"empty",withoutHl:!0}),a.length?(0,s.jsx)("a",{className:"chainAlign",href:`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(l)}`,children:r}):r]})}));var er=n(63198);const tr=14*.8;function nr(e,t){return"left"===t?e-tr:"right"===t?tr:e/2}function ar(e,t,n,a,s){const{height:i,y:r}=t;return"bottom"===e?a.height-i-r-14>n:s<56?r-(56-s)>n:r>n}function sr(e,t,n){return"bottom"===t?e/2:-1*(e/2+n+tr)}function ir(e,t,n,a){return"bottom"===t?e+n.height-a-14:e<56?56:e}const rr=(0,$n.e)("useScroll",(function(){const[e,t]=(0,i.useState)(window.scrollY),n=(0,i.useCallback)((()=>t(window.scrollY)),[]);return(0,i.useEffect)((()=>(window.addEventListener("scroll",n),()=>{window.removeEventListener("scroll",n)})),[n]),e})),or=(0,$n.e)("useElementPosition",(function(e){const[t,n]=(0,i.useState)(),a=(0,ne.X)(),s=Zn(),r=rr();return(0,i.useEffect)((()=>{if(a.current&&e&&e.current){const{height:t,width:a,x:s,y:i}=e.current.getBoundingClientRect();n({height:t,width:a,x:s,y:i})}}),[a,e,r,s]),t})),lr={x:0,y:0},cr=(0,$n.e)("usePopupWindow",(function(e,t,n){const[a,s]=(0,i.useState)(lr),[r,o]=(0,i.useState)("top"),l=or(e),c=or(t),d=rr(),u=Zn();return(0,i.useEffect)((()=>{u&&c&&o(c.y>u.height/2?"top":"bottom")}),[c,u]),(0,i.useEffect)((()=>{l&&c&&s(function(e,t,n,a,s,i){const r=e.x+e.width/2,o=e.y+s+e.height/2;return{x:r-nr(a.width,t),y:ar(n,e,a.height,i,s)?o+sr(e.height,n,a.height):ir(s,n,i,a.height)}}(c,n,r,l,d,u))}),[n,d,c,r,l,u]),(0,i.useMemo)((()=>({pointerStyle:r,renderCoords:a})),[a,r])})),dr=A.z.div`
  background-color: var(--bg-menu);
  border: 1px solid #d4d4d5;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);
  color: var(--color-text);
  left: 0;
  margin: 0.7rem 0;
  padding: 0;
  position: absolute;
  top: 0;
  z-index: -1;

  &.leftPosition {
    &::before {
      left: unset;
      right: 0.75rem;
    }
  }

  &.rightPosition {
    &::before {
      left: 0.75rem;
      right: unset;
    }
  }

  &::before {
    background-color: var(--bg-menu);
    bottom: -0.5rem;
    box-shadow: 1px 1px 0 0 #bababc;
    content: '';
    height: 1rem;
    position: absolute;
    right: 50%;
    top: unset;
    width: 1rem;
    transform: rotate(45deg);
    z-index: 2;
  }

  &.bottomPointer::before {
    box-shadow: -1px -1px 0 0 #bababc;

    top: -0.5rem;
    bottom: unset;
  }

  .ui.text.menu .item {
    color: var(--color-text) !important;
    text-align: left;

    &.disabled {
     opacity: 0.3;
    }
  }

  & > *:not(.ui--Menu) {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  & > *:first-child:not(.ui--Menu) {
    margin-top: 1rem;
  }

  & > *:last-child:not(.ui--Menu) {
    margin-bottom: 1rem;
  }
`,ur=i.memo((function({children:e,className:t="",position:n,triggerRef:a,windowRef:i}){const{pointerStyle:r,renderCoords:{x:o,y:l}}=cr(i,a,n);return(0,Ba.createPortal)((0,s.jsx)(dr,{className:`${t} ${r}Pointer ${n}Position`,"data-testid":"popup-window",ref:i,style:o&&l&&{transform:`translate3d(${o}px, ${l}px, 0)`,zIndex:1e3}||void 0,children:e}),document.body)})),mr=A.z.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`,hr=i.memo((function({children:e,className:t="",closeOnScroll:n,isDisabled:a,onCloseAction:r,position:o="left",value:l}){const{themeClassName:c}=(0,x.F)(),[d,u,m]=(0,G.O)(!1),h=(0,i.useRef)(null),p=(0,i.useRef)(null),g=(0,i.useCallback)((()=>m(!1)),[m]),f=(0,i.useMemo)((()=>[h,p]),[h,p]);return(0,er.O)(f,g),(0,i.useEffect)((()=>(n&&document.addEventListener("scroll",g,!0),()=>document.removeEventListener("scroll",g,!0))),[n,g,m]),(0,i.useEffect)((()=>{!d&&r&&r()}),[d,r]),(0,s.jsxs)(mr,{className:`${t} ui--Popup ${c}`,children:[d&&(0,s.jsx)(ur,{position:o,triggerRef:h,windowRef:p,children:l}),(0,s.jsx)("div",{"data-testid":"popup-open",onClick:u,ref:h,children:e??(0,s.jsx)(ie.Z,{className:d?"isOpen":"",icon:"ellipsis-v",isDisabled:a,isReadOnly:!1})})]})})),pr=i.memo((function({className:e="",idNumber:t,proposal:n}){const{t:a}=(0,O.$)(),i=(0,xt.H)(t)||(0,It.o)(t)?t:(0,p.u)(t);return n?(0,s.jsx)("div",{className:`${e} ui--ProposedAction`,children:(0,s.jsx)(Ct,{isHeader:!0,labelHash:a("preimage"),stringId:i,value:n,withHash:!0})}):(0,s.jsx)("div",{className:`${e} ui--ProposedAction`,children:(0,s.jsxs)("div",{children:[i?`#${i}: `:"",a("No execution details available for this proposal")]})})}));var gr=n(88909);const fr=i.memo((function({className:e="",stakingInfo:t}){const n=t?.stakingLedger?.active?.unwrap();return n?.gtn(0)?(0,s.jsx)(z.Z,{className:e,value:n}):null}));var br=n(56245);function xr(e){switch(e){case"error":return"ban";case"event":case"eventWarn":return"assistive-listening-systems";case"received":return"telegram-plane";default:return"check"}}function vr({account:e,action:t,id:n,message:a,removeItem:i,status:r}){return(0,s.jsx)("div",{className:`item ${r}`,children:(0,s.jsx)("div",{className:"wrapper",children:(0,s.jsxs)("div",{className:"container",children:[(0,s.jsx)(v.Z,{icon:"times",onClick:i}),(0,s.jsx)("div",{className:"short",children:(0,s.jsx)(v.Z,{icon:xr(r)})}),(0,s.jsxs)("div",{className:"desc",children:[(0,s.jsx)("div",{className:"header",children:Array.isArray(t)?t.map(((e,t)=>(0,s.jsx)("div",{children:e},t))):t}),e&&(0,s.jsx)(He,{value:e}),(0,s.jsx)("div",{className:"status",children:a})]})]})})},n)}function Ar({error:e,extrinsic:t,id:n,removeItem:a,rpc:i,status:r}){let{method:o,section:l}=i;if(t){const e=t.registry.findMetaCall(t.callIndex);"unknown"!==e.section&&(o=e.method,l=e.section)}const c=function(e){switch(e){case"cancelled":return"ban";case"completed":case"inblock":case"finalized":case"sent":return"check";case"dropped":case"invalid":case"usurped":return"arrow-down";case"error":case"finalitytimeout":return"exclamation-triangle";case"queued":return"random";default:return"spinner"}}(r);return(0,s.jsx)("div",{className:`item ${r}`,children:(0,s.jsx)("div",{className:"wrapper",children:(0,s.jsxs)("div",{className:"container",children:[br.z.includes(r)&&(0,s.jsx)(v.Z,{icon:"times",onClick:a}),(0,s.jsx)("div",{className:"short",children:"spinner"===c?(0,s.jsx)(Gn.Z,{variant:"push"}):(0,s.jsx)(v.Z,{icon:c})}),(0,s.jsxs)("div",{className:"desc",children:[(0,s.jsxs)("div",{className:"header",children:[l,".",o]}),(0,s.jsx)("div",{className:"status",children:e?e.message||e:r})]})]})})},n)}const wr=A.z.div`
  display: inline-block;
  overflow: hidden;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  transition-property: width;
  transition-duration: 0.75s;
  width: 4.5rem;
  z-index: 1001;

  :hover {
    transform: scale(1);
    width: 23rem;

    .item .desc {
      display: block;
    }
  }

  .item {
    display: block;

    .desc {
      display: none;
    }

    > .wrapper > .container {
      align-items: top;
      background: #00688b;
      border-radius: 0.25rem;
      color: white;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      padding: 0 0.5rem;
      vertical-align: middle;
      position: relative;

      .desc {
        flex: 1;
        overflow: hidden;
        padding: 0.75rem 1rem 0.5rem;
        width: 19rem;

        .status {
          font-weight: var(--font-weight-normal);
        }

        .ui--AddressMini {
          .ui--AddressMini-address {
            min-width: 0;
            text-align: left;
          }
        }
      }

      .header {
        opacity: 0.66;
      }

      .short {
        font-size: 2.5rem;
        min-width: 3rem;
        opacity:  0.75;
        padding: 0.5rem 0 0.5rem 0.5rem;

        .ui--Icon {
          color: white !important;
          line-height: 1;
        }

        .ui--Spinner {
          display: inline-block;
          height: 1em;
          line-height: 1;
          vertical-align: -0.125em;

          img {
            height: 1em;
            width: 1em;
          }
        }
      }

      .padded {
        padding: 0.25rem 0 0 0 !important;
      }

      .ui--Icon.isClickable {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        cursor: pointer;
      }
    }

    &.cancelled > .wrapper > .container {
      background: #cd9b1d
    }

    &.event > .wrapper > .container {
      background: teal;
    }

    &.eventWarn > .wrapper > .container {
      background: darkorange;
    }

    &.completed,
    &.finalized,
    &.inblock,
    &.sent,
    &.success {
      & > .wrapper > .container {
        background: green;
      }
    }

    &.dropped,
    &.error,
    &.finalitytimeout,
    &.invalid,
    &.usurped {
      & > .wrapper > .container {
        background: red;
      }
    }
  }
`,yr=i.memo((function({className:e=""}){const{stqueue:t,txqueue:n}=(0,ae.L)(),[a,r]=(0,i.useState)([]),[o,l]=(0,i.useState)([]);return(0,i.useEffect)((()=>{r(function(e){return(e||[]).filter((({isCompleted:e})=>!e))}(t))}),[t]),(0,i.useEffect)((()=>{l(function(e){return(e||[]).filter((({status:e})=>!["completed","incomplete"].includes(e)))}(n))}),[n]),a.length||o.length?(0,s.jsxs)(wr,{className:`${e} ui--Status`,children:[o.map(Ar),a.map(vr)]}):null})),jr=A.z.div`
  align-items: stretch;
  border-radius: 0.25rem;
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  margin: 1.5rem 0;

  > section {
    display: flex;
    flex: 0 1 auto;
    text-align: left;
  }

  details & {
    display: block;
    margin: 0.5rem 0.25rem;
    opacity: 0.75;
    outline: none;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;

    + div {
      margin-top: 0.75rem;
    }
  }

  &.isSmall {
    margin-bottom: 0;
  }

  .ui.label {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
`,kr=i.memo((function({children:e,className:t="",isSmall:n}){return(0,s.jsx)(jr,{className:`${t}${n?" isSmall":""}`,children:e})}));var Nr=n(73557);const Cr=A.z.div`
  margin: 0 2.5rem 0 1.5rem;
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-base);
  line-height: 1.57rem;
  min-width: max-content;
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--color-text);

  .ui--Icon {
    margin-right: 0.85rem;
    max-width: 1rem;
    max-height: 1rem;
  }

  @media only screen and (max-width: 900px) {
    margin: 0 1.5rem;
  }
`,Er=i.memo((function({className:e="",icon:t,text:n}){return(0,s.jsxs)(Cr,{className:`${e} active-tab`,children:[(0,s.jsx)(v.Z,{icon:t}),(0,s.jsx)("span",{children:n})]})}));var Sr=n(39857);const Ir=(0,A.z)(Sr.OL)`
  align-items: center;
  display: flex;
  color: #8B8B8B;
  height: 100%;
  padding: 0 1.5rem;
  position: relative;

  &:hover {
    color: #8B8B8B;

    .tabLinkText::after {
      background-color: #8B8B8B;
    }
  }

  &.active, &:hover {
    .tabLinkText::after {
      content: '';
      position: absolute;
      width: 3.14rem;
      height: 2px;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &.active {
    color: var(--color-text) !important;
    font-weight: var(--font-weight-normal);

    &:hover {
      cursor: default;
    }
  }

  .tabLinkText {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .tabCounter {
    margin: -1rem 0 -1rem 0.75rem;
  }

  .tabIcon {
    margin-left: 0.75rem;
  }
`,Dr=i.memo((function({basePath:e,className:t="",count:n,hasParams:a,index:i,isExact:r,isRoot:o,name:l,text:c}){const d=o?e:`${e}/${l}`,u=r||!a||0===i;return(0,s.jsxs)(Ir,{className:`${t} ui--Tab`,end:u,to:d,children:[(0,s.jsx)("div",{className:"tabLinkText",children:c}),!!n&&(0,s.jsx)(k,{className:"tabCounter",color:"counter",info:n})]})})),Br=A.z.div`
  height: 100%;
  width: auto;
`,Lr=i.memo((function({className:e=""}){return(0,s.jsx)(Br,{className:e,children:(0,s.jsx)("svg",{fill:"none",height:"47",viewBox:"0 0 17 65",width:"17",xmlns:"http://www.w3.org/2000/svg",children:(0,s.jsx)("path",{className:"highlight--stroke",d:"M1 1L16 32.5L1 64",stroke:"#D1D1D1"})})})})),$r=i.createContext({}),Vr=A.z.header`
  background: var(--bg-tabs);
  border-bottom: 1px solid var(--border-tabs);
  text-align: left;
  z-index: 1;

  & .tabs-container {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    max-width: var(--width-full);
    padding: 0 1.5rem 0 0;
    height: 3.286rem;
  }

  &::-webkit-scrollbar {
    display: none;
    width: 0px;
  }

  .ui--TabsList {
    display: flex;
    height: 100%;
    list-style: none;
    margin: 0 1.4rem;
    padding: 0;
    white-space: nowrap;

    @media only screen and (max-width: 900px) {
      margin: 0 2.72rem 0 2.35rem;
    }
  }
`,Pr=i.memo((function({basePath:e,className:t="",hidden:n,items:a}){const r=(0,Nr.TH)(),{icon:o,text:l}=i.useContext($r),c=(0,i.useMemo)((()=>a.filter((e=>!(!e||n&&n.includes(e.name))))),[n,a]);return(0,i.useEffect)((()=>function(e,t,n,a){if(t.pathname!==e){const[,,s]=t.pathname.split("/"),i=n.find((e=>e&&e.alias===s));i?window.location.hash=i.isRoot?e:`${e}/${i.name}`:!a||!a.includes(s)&&n.some((e=>e&&!e.isRoot&&e.name===s))||(window.location.hash=e)}}(e,r,a,n)),[e,n,a,r]),(0,s.jsx)(Vr,{className:`${t} ui--Tabs`,children:(0,s.jsxs)("div",{className:"tabs-container",children:[l&&o&&(0,s.jsx)(Er,{icon:o,text:l}),(0,s.jsx)(Lr,{}),(0,s.jsx)("ul",{className:"ui--TabsList",children:c.map(((t,n)=>(0,s.jsx)("li",{className:t.isHidden?"--hidden":"",children:(0,i.createElement)(Dr,{...t,basePath:e,index:n,key:t.name})},n)))})]})})}));var Zr=n(53657);const Tr=i.memo((function({index:e,isDisabled:t,isSelected:n,onChange:a,text:r,value:o}){const l=(0,i.useCallback)((()=>{!t&&a(e,o)}),[t,e,a,o]);return(0,s.jsx)(ie.Z,{icon:n?"check":"circle",isBasic:!0,isDisabled:t,isSelected:n,label:r,onClick:l},r)})),zr=A.z.div`
  display: inline-block;
  margin-right: 1.5rem;

  .ui--Button {
    margin: 0;

    &:not(:first-child) {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }

    &:not(:last-child) {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }

    .ui--Icon {
      width: 1em;
    }
  }
`,Mr=i.memo((function({className:e="",onChange:t,options:n,value:a}){const r=(0,i.useMemo)((()=>n.filter((e=>!!e))),[n]);return r.length&&r[0].value?(0,s.jsx)(zr,{className:`${e} ui--ToggleGroup`,children:r.map((({isDisabled:e,text:n,value:i},r)=>(0,s.jsx)(Tr,{index:r,isDisabled:e,isSelected:a===r,onChange:t,text:n,value:i},r)))}):null})),Fr=i.memo((function({className:e="",filter:t,onChange:n}){const{t:a}=(0,O.$)();return(0,s.jsx)(Bs,{className:e,filter:t,label:a("vote with account"),onChange:n,type:"account",withLabel:!0})})),Hr=i.memo((function({children:e,className:t="",label:n,params:a}){const{api:i}=(0,_.h)(),r=(0,te.W7)(i.derive.balances?.all,[a]);return(0,s.jsx)(z.Z,{className:t,label:n,value:r?.votingBalance,children:e})})),Rr=["pyconvot","democrac","phrelect"],Ur=i.memo((function({accountId:e,autoFocus:t,label:n,noDefault:a,onChange:r}){const{t:o}=(0,O.$)(),{api:l}=(0,_.h)(),c=(0,te.W7)(l.derive.balances?.all,[e]),[{defaultValue:d,maxValue:u,selectedId:m,value:h},p]=(0,i.useState)({defaultValue:H.nw,maxValue:H.nw,value:H.nw});(0,i.useEffect)((()=>{c&&c.accountId.eq(e)&&p((t=>t.selectedId!==e?function(e,t,n,a){const s=n.lockedBreakdown.sort(((e,t)=>t.amount.cmp(e.amount))).sort(((e,t)=>{if(!e.id.eq(t.id))for(let n=0;n<Rr.length;n++){const a=Rr[n];if(e.id.eq(a))return-1;if(t.id.eq(a))return 1}return 0})).map((({amount:e})=>e)),i=n.votingBalance;let r=s[0]||n.lockedBalance;if(t)r=H.nw;else if(r.isZero()){let e=i.sub(a);for(let t=0;t<3;t++)e.gt(a)&&(r=e,e=e.sub(a))}return{defaultValue:r,maxValue:i,selectedId:e,value:r}}(e,a,c,l.consts.balances.existentialDeposit):t))}),[c,e,l,a]),(0,i.useEffect)((()=>{r(h)}),[r,h]);const g=(0,i.useCallback)((t=>p((n=>n.selectedId===e&&t&&!t.eq(n.value)?{...n,value:t}:n))),[e]),f=e!==m;return(0,s.jsx)(Ms.Z,{autoFocus:t,defaultValue:f?void 0:d,isDisabled:f,isZeroable:!0,label:n||o("vote value"),labelExtra:(0,s.jsx)(Hr,{label:(0,s.jsx)("label",{children:o("voting balance")}),params:e}),maxValue:u,onChange:g})})),qr=(0,A.z)(yt.Z)`
  .TextAreaWithDropdown {
    display: flex;
    textarea {
      border-radius: 0.25rem 0 0 0.25rem;
      border: 1px solid #DDE1EB;
      border-right: none;
      background: var(--bg-input);
      box-sizing: border-box;
      color: var(--color-text);
      display: block;
      outline: none;
      padding: 1.75rem 3rem 0.75rem 1.5rem;
      resize: none;
      width: 100%;

      &:read-only {
        background: var(--bg-inverse);
        box-shadow: none;
        outline: none;

        ~ .ui.buttons > .ui.selection.dropdown {
          background: var(--bg-inverse);
        }
      }

      &.ui-textArea-withError {
        background: var(--bg-input-error);
        color: var(--color-error);
      }
    }

    & > .ui.buttons > .ui.button.floating.selection.dropdown {
      border: 1px solid #DDE1EB;
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      & > .dropdown.icon {
        top: 2rem;
      }
    }
  }
`,Or=i.memo((function({children:e,className:t,isError:n,isReadOnly:a,label:r,onChange:o,seed:l,withLabel:c}){const d=(0,i.useCallback)((({target:{value:e}})=>{o&&o(e)}),[o]);return(0,s.jsx)(qr,{className:t,label:r,withLabel:c,children:(0,s.jsxs)("div",{className:"TextAreaWithDropdown",children:[(0,s.jsx)("textarea",{autoCapitalize:"off",autoCorrect:"off",autoFocus:!1,className:n?"ui-textArea-withError":"",onChange:d,readOnly:a,rows:2,spellCheck:!1,value:l}),e]})})})),Wr=A.z.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid var(--border-table);
  border-radius: 4px;
  cursor: pointer;
`,Qr=i.memo((function({className:e="",expanded:t,onClick:n}){return(0,s.jsx)(Wr,{className:`${e} ui--ExpandButton`,"data-testid":"row-toggle",onClick:n,children:(0,s.jsx)(v.Z,{icon:t?"caret-up":"caret-down"})})})),Kr=A.z.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-right: 0.5rem;

  && .ui--Labelled.ui--Dropdown {
    padding: 0;

    label {
      left: 1.55rem;
      z-index: 115;
    }

    .ui.selection.dropdown {
      min-width: 7.857rem;
      z-index: 110;

      border-width: 1px 0 1px 1px;
      border-style: solid;
      border-color: var(--border-input);
      border-radius: 4px 0 0 4px;

      &.active {
        position: absolute;
        min-width: 10.714rem;

        z-index: 120;

        border-width: 1px;
        border-radius: 4px;
        top: 0;
        left: 0;
      }

      .visible.menu {
        border-color: var(--border-input);
      }
    }
  }

  button {
    margin: 0.25rem 0;
    position: relative;
    width: 2.857rem;
    height: 3.893rem;

    background-color: var(--bg-input);
    border-width: 1px 1px 1px 0;
    border-style: solid;
    border-color: var(--border-input);
    border-radius: 0 4px 4px 0;

    align-items: center;
    display: flex;
    flex-flow: column;
    justify-content: center;

    &:hover {
      cursor: pointer;
    }

    .arrow {
      &:first-child {
        margin-bottom: -20%;
      }

      &:last-child {
        margin-top: -20%;
      }
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: 7.857rem;
    top: 10%;

    width: 1px;
    height: 80%;

    background-color: var(--border-input);
    z-index: 99;
  }

  button:hover,
  .ui--Labelled.ui--Dropdown:hover {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      height: 100%;
      width: 1px;
      z-index: 100;
    }
  }

  button:hover::after {
    left: 0;
  }

  .ui--Labelled.ui--Dropdown:hover::after {
    left: 7.857rem;
  }
`,Gr=i.memo((function({className:e="",defaultValue:t,label:n,onChange:a,onClick:i,options:r,sortDirection:o}){return(0,s.jsxs)(Kr,{className:`${e} ui--Sort`,children:[(0,s.jsx)(Nn.Z,{defaultValue:t,label:n,onChange:a,options:r}),(0,s.jsxs)("button",{onClick:i,children:[(0,s.jsx)(v.Z,{className:"arrow up"+("ascending"===o?" isActive":""),color:"gray",icon:"sort-up"}),(0,s.jsx)(v.Z,{className:"arrow down"+("descending"===o?" isActive":""),color:"gray",icon:"sort-down"})]})]})})),Jr=A.z.div`
  width: 29.5rem;

  .ui--Input {
    margin: 0;
    height: 3.893rem;
  }
`,Yr=i.memo((function({className:e="",filterOn:t,label:n,setFilter:a}){return(0,s.jsx)(Jr,{className:e,children:(0,s.jsx)(Bn.ZP,{autoFocus:!0,isFull:!0,label:n,onChange:a,value:t})})}))},21779:(e,t,n)=>{n.d(t,{z:()=>s});var a=n(82740);const s=a.ZP.styled||a.ZP.default||a.ZP},37731:(e,t,n)=>{n.d(t,{Z:()=>g});var a=n(82740);const s=["2000","1900","1800","1700","1600","1500","1400","1300","1200","1100","1000","900","800","700","600","500","400"].map((e=>`\n  .media--${e} {\n    @media only screen and (max-width: ${e}px) {\n      display: none !important;\n    }\n  }\n\n  .media--${e}-noPad {\n    @media only screen and (max-width: ${e}px) {\n      min-width: 0 !important;\n      padding: 0 !important;\n    }\n  }\n`)).join("");var i=n(69316);const r=160,o=[.2126,.7152,.0722],l=[0,2,4],c="#f19135";function d(e){return e||c}function u(e){const t=d(e).replace("#","").toLowerCase();return l.reduce(((e,n,a)=>e+parseInt(t.substring(n,n+2),16)*o[a]),0)}function m(e){return u(e)>r?"rgba(45, 43, 41, 0.875)":"rgba(255, 253, 251, 0.875)"}function h(e){const t=u(e);return t<16?"rgba(255, 255, 255, 0.15)":t<r?"rgba(0, 0, 0, 0.15)":"rgba(255, 255, 255, 0.15)"}function p(e,t){const n=parseInt(e.slice(1,3),16),a=parseInt(e.slice(3,5),16),s=parseInt(e.slice(5,7),16);return t?`rgba(${n}, ${a}, ${s}, ${t})`:`rgb(${n}, ${a}, ${s})`}const g=(0,a.vJ)((({theme:e,uiHighlight:t})=>`\n  .highlight--all {\n    background: ${d(t)} !important;\n    border-color: ${d(t)} !important;\n    color: ${d(t)} !important;\n  }\n\n  .highlight--before:before {\n    background: ${d(t)} !important;\n  }\n\n  .highlight--before-border:before {\n    border-color: ${d(t)} !important;\n  }\n\n  .highlight--bg {\n    background: ${d(t)} !important;\n  }\n\n  .highlight--bg-contrast {\n    background: ${m(t)};\n  }\n\n  .ui--MenuItem.isActive .ui--Badge {\n    background: ${d(t)};\n    color: ${m(t)} !important;\n  }\n\n  .ui--MenuItem {\n    & .ui--Badge {\n      color: ${u(t)<r?"#fff":"#424242"};\n    }\n\n    &:hover:not(.isActive) .ui--Badge {\n      background: ${u(t)<r?"rgba(255, 255, 255, 0.8)":"#4D4D4D"};\n      color: ${u(t)>r?"#fff":"#424242"};\n    }\n  }\n\n  .ui--Tab .ui--Badge {\n    background: ${d(t)};\n    color: ${u(t)<r?"#fff":"#424242"};\n  }\n\n  .highlight--bg-faint,\n  .highlight--bg-light {\n    background: var(--bg-table);\n    position: relative;\n\n    &:before {\n      background: ${d(t)};\n      bottom: 0;\n      content: ' ';\n      left: 0;\n      position: absolute;\n      right: 0;\n      top: 0;\n      z-index: -1;\n    }\n  }\n\n  .highlight--bg-faint:before {\n    opacity: 0.025;\n  }\n\n  .highlight--bg-light:before {\n    opacity: 0.2;\n  }\n\n  .highlight--border {\n    border-color: ${d(t)} !important;\n  }\n\n  .highlight--color {\n    color: ${d(t)} !important;\n  }\n\n  .highlight--color-contrast {\n    color: ${m(t)};\n  }\n\n  .highlight--fill {\n    fill: ${d(t)} !important;\n  }\n\n  .highlight--gradient {\n    background: linear-gradient(90deg, ${t||c}, transparent);\n  }\n\n  .ui--MenuItem.topLevel:hover,\n  .ui--MenuItem.isActive.topLevel:hover {\n    color: ${m(t)};\n\n    a {\n      background-color: ${h(t)};\n    }\n  }\n\n  .menuItems li:hover .groupHdr {\n    background: ${h(t)};\n    color: ${m(t)};\n  }\n\n  .groupMenu {\n    background: ${d(t)} !important;\n\n    &::before {\n      background: ${h(t)};\n      color:  ${m(t)};\n    }\n    li {\n      color:  ${m(t)};\n    }\n  }\n\n  .highlight--hover-bg:hover {\n    background: ${d(t)} !important;\n  }\n\n  .highlight--hover-color:hover {\n    color: ${d(t)} !important;\n  }\n\n  .highlight--icon {\n    .ui--Icon {\n      color: ${d(t)} !important;\n    }\n  }\n\n  .highlight--shadow {\n    box-shadow: 0 0 1px ${d(t)} !important;\n  }\n\n  .highlight--stroke {\n    stroke: ${d(t)} !important;\n  }\n\n  .ui--Button {\n    &:not(.isDisabled):not(.isIcon):not(.isBasic),\n    &.withoutLink:not(.isDisabled) {\n      .ui--Icon {\n        background: ${d(t)};\n        color: ${m(t)};\n      }\n    }\n\n    &.isBasic:not(.isDisabled):not(.isIcon):not(.isSelected) {\n      &:not(.isReadOnly) {\n        box-shadow: 0 0 1px ${d(t)};\n      }\n\n      .ui--Icon {\n        color: ${d(t)};\n      }\n    }\n\n    &.isSelected {\n      box-shadow: 0 0 1px ${d(t)};\n    }\n\n    &:hover:not(.isDisabled):not(.isReadOnly),\n    &.isSelected {\n      background: ${d(t)};\n      color: ${m(t)};\n      text-shadow: none;\n\n      &:not(.isIcon),\n      &.withoutLink {\n        .ui--Icon {\n          color: inherit;\n        }\n      }\n    }\n  }\n\n  .ui--Table td .ui--Button {\n    &:not(.isDisabled):not(.isIcon):not(.isToplevel),\n    &.withoutLink:not(.isDisabled) {\n      &:hover {\n        .ui--Icon {\n          color: ${m(t)};\n        }\n      }\n\n      .ui--Icon {\n        background: transparent;\n        color: inherit;\n        color: ${d(t)};\n      }\n    }\n  }\n\n  .ui--Popup .ui--Button.isOpen:not(.isDisabled):not(.isReadOnly) {\n    background: ${d(t)} !important;\n    color: ${m(t)} !important;\n\n    .ui--Icon {\n      background: transparent !important;\n      color: ${m(t)} !important;\n    }\n  }\n\n\n  .ui--Menu {\n    .ui--Menu__Item:hover {\n       background: ${p(d(t),".1")};\n    }\n\n    .ui--Toggle.isChecked .ui--Toggle-Slider {\n      background: ${d(t)};\n\n      &::before {\n        border-color: ${d(t)};\n      }\n    }\n  }\n\n  .ui--Sort {\n    .ui--Labelled.ui--Dropdown:hover {\n     .ui.selection.dropdown {\n        border-color: ${d(t)};\n\n       .visible.menu {\n         border: 1px solid ${d(t)};\n        }\n      }\n    }\n\n    button:hover {\n      border-color: ${d(t)};\n    }\n\n    button:hover,\n    .ui--Labelled.ui--Dropdown:hover {\n      &::after {\n        background-color:  ${d(t)};\n      }\n    }\n\n    .arrow.isActive {\n      color:  ${d(t)};\n      opacity: 1;\n    }\n  }\n\n  .theme--dark,\n  .theme--light {\n    .ui--Tabs .active .tabLinkText::after {\n      background: ${d(t)};\n    }\n\n    .ui.primary.button,\n    .ui.buttons .primary.button {\n      background: ${d(t)};\n\n      &.active,\n      &:active,\n      &:focus,\n      &:hover {\n        background-color: ${d(t)};\n      }\n    }\n\n    .ui--Toggle.isChecked {\n      &:not(.isRadio) {\n        .ui--Toggle-Slider {\n          background: ${d(t)} !important;\n\n          &:before {\n            border-color: ${d(t)} !important;\n          }\n        }\n      }\n    }\n  }\n\n  .ui--ExpandButton:hover {\n    border-color: ${d(t)} !important;\n\n    .ui--Icon {\n      color: ${d(t)} !important;\n    }\n  }\n\n  .ui--Tag.themeColor.lightTheme,\n  .ui--InputTags.lightTheme .ui.label {\n    background: ${p(d(t),"0.08")};\n    color: ${u(t)>r?"#424242":d(t)};\n  }\n\n  .ui--Tag.themeColor.darkTheme,\n  .ui--InputTags.darkTheme .ui.label {\n    color: ${u(t)>r?d(t):"#fff"};\n  }\n\n  #root {\n    background: var(--bg-page);\n    color: var(--color-text);\n    font: var(--font-sans);\n    font-weight: var(--font-weight-normal);\n    height: 100%;\n  }\n\n  a {\n    cursor: pointer;\n  }\n\n  article {\n    background: var(--bg-table);\n    border: 1px solid #f2f2f2;\n    border-radius: 0.25rem;\n    box-sizing: border-box;\n    margin: 0.25rem;\n    padding: 1.25rem;\n    position: relative;\n    text-align: left;\n\n    > ul {\n      margin: 0;\n      padding: 0;\n    }\n\n    &.error,\n    &.warning {\n      border-left-width: 0.25rem;\n      font-size: var(--font-size-small);\n      line-height: 1.5;\n      margin-left: 2.25rem;\n      padding: 0.75rem 1rem;\n      position: relative;\n      z-index: 5;\n\n      &:before {\n        border-radius: 0.25rem;\n        bottom: 0;\n        content: ' ';\n        left: 0;\n        position: absolute;\n        right: 0;\n        top: 0;\n        z-index: -1;\n      }\n    }\n\n    &.mark {\n      margin: 0.5rem 0 0.5rem 2.25rem;\n      padding: 0.5rem 1rem !important;\n    }\n\n    &.nomargin {\n      margin-left: 0;\n    }\n\n    &.extraMargin {\n      margin: 2rem auto;\n    }\n\n    &.centered {\n      margin: 1.5rem auto;\n      max-width: 75rem;\n\n      &+.ui--Button-Group {\n        margin-top: 2rem;\n      }\n    }\n\n    &.error {\n      &:before {\n        background: rgba(255, 12, 12, 0.05);\n      }\n\n      border-color: rgba(255, 12, 12, 1);\n    }\n\n    &.padded {\n      padding: 0.75rem 1rem;\n\n      > div {\n        margin: 0.25rem;\n      }\n    }\n\n    &.warning {\n      &:before {\n        background: rgba(255, 196, 12, 0.05);\n      }\n\n      border-color: rgba(255, 196, 12, 1);\n    }\n  }\n\n  body {\n    height: 100%;\n    margin: 0;\n    font: var(--font-sans);\n  }\n\n  br {\n    line-height: 1.5rem;\n  }\n\n  details {\n    cursor: pointer;\n\n    &[open] > summary {\n      white-space: normal;\n\n      br, br + * {\n        display: block;\n      }\n    }\n\n    > summary {\n      text-overflow: ellipsis;\n      overflow: hidden;\n      white-space: nowrap;\n      outline: none;\n\n      br, br + * {\n        display: none;\n      }\n    }\n  }\n\n  h1, h2, h3, h4, h5 {\n    color: var(--color-header);\n    font: var(--font-sans);\n    font-weight: var(--font-weight-header);\n    margin-bottom: 0.25rem;\n  }\n\n\n  h1 {\n    font-size: var(--font-size-h1);\n    text-transform: lowercase;\n\n    em {\n      font-style: normal;\n      text-transform: none;\n    }\n  }\n\n  h2 {\n    font-size: var(--font-size-h2);\n  }\n\n  h3 {\n    font-size: var(--font-size-h3);\n  }\n\n  h4 {\n    font-size: var(--font-size-h4);\n  }\n\n  header {\n    margin-bottom: 1.5rem;\n    text-align: center;\n\n    > article {\n      background: transparent;\n    }\n  }\n\n  html {\n    height: 100%;\n  }\n\n  label {\n    box-sizing: border-box;\n    display: block;\n    font: var(--font-sans);\n  }\n\n  // we treat h5 and label as equivalents\n  label, h5 {\n    color: var(--color-label);\n    font-size: var(--font-size-label);\n    font-style: normal;\n    font-weight: var(--font-weight-label);\n    line-height: 1rem;\n    margin-bottom: 0.25rem !important;\n    text-transform: var(--text-transform-label);\n    vertical-align: middle;\n  }\n\n  button {\n    font-size: var(--font-size-small);\n    font-weight: var(--font-weight-normal);\n  }\n\n  main {\n    > section {\n      margin-bottom: 2em;\n    }\n  }\n\n  /* Add our overrides */\n  \n  .ui.hidden.divider {\n    margin: 0.5rem 0;\n  }\n\n  .ui.dropdown {\n    display: block;\n    min-width: 0;\n    width: 100%;\n  }\n\n  .ui.dropdown,\n  .ui.input {\n    margin: 0.25rem 0;\n  }\n\n  .ui.selection.dropdown,\n  .ui.input > input,\n  .ui.selection.dropdown > input {\n    background: var(--bg-input);\n    border-color: var(--border-input);\n    color: var(--color-text);\n    font: var(--font-sans);\n    font-size: var(--font-size-base);\n\n    &:focus {\n      background: var(--bg-input);\n      color: var(--color-text);\n    }\n  }\n\n  .ui.action.input > .buttons {\n    position: relative;\n  }\n\n  .ui.dropdown {\n    &.disabled {\n      background: transparent;\n      border-style: dashed;\n      opacity: 1;\n\n      .dropdown.icon {\n        opacity: 0;\n      }\n    }\n\n    &.selection.visible {\n      background: var(--bg-input);\n      color: var(--color-text);\n    }\n\n    .menu {\n      background: var(--bg-input);\n      color: var(--color-text);\n\n      > .item {\n        border-color: transparent !important;\n        color: var(--color-text) !important;\n\n        &.header.disabled {\n          margin: 1em 0 0 0;\n          opacity: 1;\n\n          &:hover,\n          &.selected {\n            background: var(--bg-input);\n          }\n        }\n      }\n    }\n\n    > .text {\n      min-height: 1em;\n\n      &:not(.default) {\n        color: var(--color-text) !important;\n      }\n    }\n  }\n\n  .ui.input {\n    width: 100%;\n\n    &.disabled:not(.retain-appearance) {\n      opacity: 1;\n\n      input {\n        background: transparent;\n        border-style: dashed;\n      }\n\n      .ui.buttons {\n        .ui.button {\n          background: transparent;\n        }\n\n        &.primary .ui.button {\n          background-color: #666;\n          border-color: transparent;\n          color: #f9f8f7;\n          opacity: 0.5;\n\n          .dropdown.icon {\n            opacity: 0;\n          }\n        }\n      }\n    }\n\n    &.error input {\n      background-color: var(--bg-input-error);\n      border-color: #e0b4b4;\n    }\n\n    > input {\n      width: 0;\n    }\n  }\n\n  .ui.label {\n    background: transparent;\n    font-weight: var(--font-weight-normal);\n    position: relative;\n    z-index: 1;\n  }\n\n  .ui.page.modals.transition.visible {\n    display: flex !important;\n  }\n\n  .ui.secondary.vertical.menu > .item {\n    margin: 0;\n  }\n\n  .ui[class*="left icon"].input.left.icon > input {\n    padding-left: 4rem !important;\n  }\n\n  .ui[class*="left icon"].input.left.icon > .ui--Icon.big {\n    left: -7px;\n    opacity: 1;\n  }\n\n  /* modals aligned to top, not center */\n  .ui.dimmer {\n    background-color: rgba(96, 96, 96, 0.5);\n    justify-content: flex-start;\n  }\n\n  /* remove the default white background, settings app has it as part of Tab */\n  .ui.segment {\n    background: transparent;\n  }\n\n  ${i.ZP}\n  \n  .ui--grid,\n  .ui--row {\n    width: 100%;\n  }\n\n  .ui--grid,\n  .ui--row {\n    align-items: stretch;\n    display: flex;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: flex-start;\n    text-align: left;\n    min-width: 0;\n  }\n\n  .ui--grid > div,\n  .ui--row > div {\n    box-sizing: border-box;\n    min-width: 0;\n  }\n\n  .ui--grid > div:not(.grow):not(.shrink),\n  .ui--row > div:not(.grow):not(.shrink) {\n    width: 100%;\n  }\n\n  .ui--grid > div:not(.shrink),\n  .ui--grid > div.full,\n  .ui--row > div.full {\n    flex: 0 100%;\n  }\n\n  .ui--grid > div.shrink,\n  .ui--row > div.shrink {\n    flex: 0 1 auto;\n  }\n\n  .ui--grid > div.grow,\n  .ui--row > div.grow {\n    flex: 1 1 auto;\n  }\n\n  .ui--grid > div.large,\n  .ui--row > div.large {\n    flex: 0 75%;\n  }\n\n  .ui--grid > div.medium,\n  .ui--row > div.medium {\n    flex: 0 50%;\n  }\n\n  .ui--grid > div.small,\n  .ui--row > div.small {\n    flex: 0 25%;\n  }\n\n  .ui--grid > div.sixty6,\n  .ui--row > div.sixty6 {\n    flex: 0 66.66%;\n  }\n\n  .ui--grid > div.thirty3,\n  .ui--row > div.thirty3 {\n    flex: 0 33.33%;\n  }\n\n  ${s}\n  \n  .ui--output {\n    background: var(--bg-input);\n    border-radius: 4px;\n    border: 1px dashed #eee;\n    box-sizing: border-box;\n    line-height: 1rem;\n    max-height: 25rem;\n    overflow-y: auto;\n    padding: 0.75rem 1rem;\n    position: relative;\n    word-break: break-all;\n\n    &.error {\n      background: var(--bg-input-error);\n      border-color: #e0b4b4;\n    }\n\n    &.monospace {\n      font-family: monospace;\n    }\n  }\n\n  header .ui--Button-Group {\n    text-align: center;\n  }\n\n  .ui.input .ui--Button-Group {\n    margin: 0;\n  }\n\n  button.u.ui--Icon.icon-button {\n    padding-top: 0;\n    padding-right: 0;\n    padding-bottom: 0.3em;\n    padding-left: 0.3em;\n    color: #2e86ab !important;\n    background: none !important;\n  }\n\n  button.ui--Button {\n    font: var(--font-sans);\n  }\n\n  .editable {\n    cursor: pointer;\n  }\n\n  .ui--DropdownLinked.ui--row {\n    .small .ui.selection.dropdown {\n      border-right: none;\n      border-bottom-right-radius: 0;\n      border-top-right-radius: 0;\n      min-width: 5rem;\n    }\n\n    .large .ui.selection.dropdown {\n      border-left: none;\n      border-bottom-left-radius: 0;\n      border-top-left-radius: 0;\n    }\n  }\n\n  .ui--Input {\n    &.disabled {\n      overflow: hidden;\n\n      input {\n        overflow: hidden;\n        text-overflow: ellipsis;\n        white-space: nowrap;\n      }\n    }\n\n    &.inPlaceEditor {\n      margin: 0 !important;\n\n      input {\n        padding: 0 !important;\n        background: rgba(230, 230, 230, 0.8) !important;\n        border: 0 !important;\n        border-radius: 0 !important;\n        box-shadow: 0 3px 3px rgba(0,0,0,.2);\n      }\n    }\n\n    &.isWarning.ui.input {\n      > input,\n      input:focus {\n        background: #ffffe0;\n        border-color: #eeeeae;\n      }\n    }\n\n    .ui--SiDropdown {\n      width: 6rem;\n      text-align: center;\n    }\n  }\n\n  .ui--Static {\n    min-width: 2rem; /* adjust width from normal dropdown sizing */\n    overflow: hidden;\n    word-break: break-all;\n  }\n\n  .ui--Tooltip {\n    text-align: center;\n    z-index: 1002;\n    max-width: 300px;\n\n\n    &.accounts-badge {\n      background-color: var(--bg-menu) !important;\n      color: var(--color-text) !important;\n      box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);\n      z-index: 999;\n\n      &.place-top::after {\n        border-top-color: var(--bg-menu) !important;\n      }\n\n      &.place-right::after {\n        border-right-color: var(--bg-menu) !important;\n      }\n\n    a {\n      color: #3BBEFF;\n\n      &.purpleColor {\n        color: #E6007A;\n      }\n    }\n  }\n\n`))},69316:(e,t,n)=>{n.d(t,{Iv:()=>a,ZP:()=>s});const a="#2e86ab",s=`\n  .theme--dark,\n  .theme--light {\n    a:not(.ui--Tab) {\n      color: ${a};\n\n      &:hover,\n      a:visited {\n        color: ${a};\n      }\n    }\n\n    .ui--Button {\n      &.isIcon:not(.isDisabled):not(.withoutLink):not(:hover) {\n        .ui--Icon {\n          color: ${a};\n        }\n      }\n    }\n\n    .ui.modal > .header:not(.ui) {\n      border-bottom-color: #767778;\n    }\n\n    .ui.negative.button,\n    .ui.buttons .negative.button {\n      background: #666 !important;\n    }\n  }\n`},43151:(e,t,n)=>{n.d(t,{$:()=>s,Z:()=>i});var a=n(61349);function s(){return(0,a.$G)("react-components")}const i=(0,a.Zh)(["react-components"])},11798:(e,t,n)=>{n.d(t,{r7:()=>i,C9:()=>g,Ly:()=>r,s2:()=>o,oX:()=>d,Hc:()=>p});var a=n(69187),s=n(33661);function i(e,t,n,i="",r=!1){let o=!1;const l=i.toLowerCase();if(l||r){if(n){const{accountId:t,accountIndex:a,identity:c,nickname:d}=n,u=!!t&&t.toString().includes(i)||!!a&&a.toString().includes(i);!r&&u?o=!0:(0,s.m)(e.query.identity?.identityOf)?o=!!c&&(!!c.display||!!c.displayParent)&&(u||!!c.display&&c.display.toLowerCase().includes(l)||!!c.displayParent&&c.displayParent.toLowerCase().includes(l)):d&&(o=d.toLowerCase().includes(l))}if(!o){const e=a.Nn.getAddress(t);o=!!e?.meta?.name&&e.meta.name.toLowerCase().includes(l)}}else o=!0;return o}function r(e,t=null){let n;try{const s=a.Nn.getAddress(e,t);n=s&&s.meta}catch{}return n||{}}function o(e,t=null,n){const a=r(e,t);return a.name?[!1,!1,a.name.toUpperCase()]:n?[!1,!0,n.toUpperCase()]:[!0,!1,e]}var l=n(8257),c=n(57139);function d(e){if(!e)return null;let t;const n=r(e,"contract");try{const e=n.contract&&JSON.parse(n.contract.abi);t=new l.P(e,c.api.registry.getChainProperties())}catch(e){console.error(e)}return t||null}var u=n(74076),m=n(48533),h=n(73493);function p(e,t=!1,n){if(e)try{const s=(0,u.vq)(e)?(0,m.G)(e):a.Nn.decodeAddress(e);if(!t&&32!==s.length&&20!==s.length)throw new Error("AccountIndex values not allowed");if(n&&s.length!==n)throw new Error("Invalid key length");return 20===s.length?(0,h.K)(s):a.Nn.encodeAddress(s)}catch{}}function g(e){try{const t=e?a.Nn.getPair(e.toString()):null;if(t)return t.meta.isInjected?"injected":t.meta.isHardware?t.meta.hardwareType||"hardware":t.meta.isExternal?t.meta.isMultisig?"multisig":t.meta.isProxied?"proxied":"qr":t.type}catch{}return"unknown"}},11677:(e,t,n)=>{function a(e,t){return(...n)=>{try{return t(...n)}catch(t){throw new Error(`${e}:: ${t.message}:: ${t.stack||"<unknown>"}`)}}}n.d(t,{e:()=>a})},68944:(e,t,n)=>{n.d(t,{y:()=>l,u:()=>c});var a=n(52322),s=n(2784),i=n(90778),r=n(74065);const o=[],l=s.createContext(o);function c({children:e}){const{api:t}=(0,i.h)(),n=(0,s.useCallback)((e=>function(e,t){return 0===t.length?[e]:60===t.length?t.concat(e).slice(-60):t.concat(e)}(function(...e){const t={active:{requests:0,subscriptions:0},total:{bytesRecv:0,bytesSent:0,cached:0,errors:0,requests:0,subscriptions:0,timeout:0}};for(let n=0;n<e.length;n++){const a=e[n].stats;a&&(t.active.requests+=a.active.requests,t.active.subscriptions+=a.active.subscriptions,t.total.bytesRecv+=a.total.bytesRecv,t.total.bytesSent+=a.total.bytesSent,t.total.cached+=a.total.cached,t.total.errors+=a.total.errors,t.total.requests+=a.total.requests,t.total.subscriptions+=a.total.subscriptions,t.total.timeout+=a.total.timeout)}return{stats:t,when:Date.now()}}(t),e)),[t]),c=function(e,t,n){const[a,i]=(0,s.useState)(t),o=(0,s.useRef)(null),l=(0,r.X)();return(0,s.useEffect)((()=>(function t(){if(o.current=null,l.current){try{i(e)}catch(e){console.error(e)}o.current=setTimeout(t,5e3)}}(),()=>{o.current&&clearTimeout(o.current)})),[]),a}(n,o);return(0,a.jsx)(l.Provider,{value:c,children:e})}},57120:(e,t,n)=>{n.d(t,{U:()=>u,g:()=>m});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(14681);const l={},c={},d={byAuthor:l,eraPoints:c,lastBlockAuthors:[],lastHeaders:[]},u=s.createContext(d);function m({children:e}){const{api:t,isApiReady:n}=(0,i.h)(),m=(0,r.W7)(n&&t.derive.staking?.currentPoints),[h,p]=(0,s.useState)(d);return(0,s.useEffect)((()=>{t.isReady.then((()=>{let e=[],n=[],a="";t.derive.chain.subscribeNewHeads((t=>{if(t?.number){const s=t.number.unwrap();let i="";t.author&&(i=t.author.toString());const r=(0,o.u)(s);i&&(l[i]=r,r!==a?(a=r,n=[i]):n.push(i)),e=e.filter(((e,t)=>t<75&&e.number.unwrap().lt(s))).reduce(((e,t)=>(e.push(t),e)),[t]).sort(((e,t)=>t.number.unwrap().cmp(e.number.unwrap()))),p({byAuthor:l,eraPoints:c,lastBlockAuthors:n.slice(),lastBlockNumber:a,lastHeader:t,lastHeaders:e})}})).catch(console.error)})).catch(console.error)}),[]),(0,s.useEffect)((()=>{if(m){const e=[...m.individual.entries()].map((([e,t])=>[e.toString(),(0,o.u)(t)])),t=Object.keys(c);t.length!==e.length&&t.forEach((e=>{delete c[e]})),e.forEach((([e,t])=>{c[e]=t}))}}),[m]),(0,a.jsx)(u.Provider,{value:h,children:e})}},44028:(e,t,n)=>{n.d(t,{m:()=>u,w:()=>m});var a=n(52322),s=n(2784),i=n(64021),r=n(11147),o=n(69516),l=n(90778),c=n(9118);const d={eventCount:0,events:[]},u=s.createContext(d);function m({children:e}){const{api:t,isApiReady:n}=(0,l.h)(),[m,h]=(0,s.useState)(d),p=(0,c.W7)(n&&t.query.system.events),g=(0,s.useRef)({block:null,event:null});return(0,s.useEffect)((()=>{p&&async function(e,t,n,a){const s=n.map(((e,t)=>({indexes:[t],record:e}))).filter((({record:{event:{method:e,section:t}}})=>!("system"===t||["balances","treasury"].includes(t)&&["Deposit","UpdatedInactive","Withdraw"].includes(e)||["transactionPayment"].includes(t)&&["TransactionFeePaid"].includes(e)||["paraInclusion","parasInclusion","inclusion"].includes(t)&&["CandidateBacked","CandidateIncluded"].includes(e)||["relayChainInfo"].includes(t)&&["CurrentBlockNumbers"].includes(e)))).reduce(((e,t)=>{const n=e.find((({record:{event:{method:e,section:n}}})=>t.record.event.section===n&&t.record.event.method===e));return n?n.indexes.push(...t.indexes):e.push(t),e}),[]).reverse(),l=(0,o.R)((0,i.d)((0,r.P)(s)));if(l!==t.event&&s.length){t.event=l;const i=await e.rpc.chain.getHeader(n.createdAtHash),r=i.number.unwrap(),o=i.hash.toHex();o!==t.block&&(t.block=o,a((({events:e})=>({eventCount:n.length,events:[...s.map((({indexes:e,record:t})=>({blockHash:o,blockNumber:r,indexes:e,key:`${r.toNumber()}-${o}-${e.join(".")}`,record:t}))),...e.filter((e=>!e.blockNumber?.eq(r)))].slice(0,75)}))))}else a((({events:e})=>({eventCount:n.length,events:e})))}(t,g.current,p,h).catch(console.error)}),[t,g,p,h]),(0,a.jsx)(u.Provider,{value:m,children:e})}},3773:(e,t,n)=>{n.d(t,{H:()=>h,y:()=>x});var a=n(52322),s=n(2784),i=n(43806),r=n(77984),o=n(69187),l=n(55858),c=n(94175),d=n(90778);const u=()=>!1,m={accounts:{allAccounts:[],allAccountsHex:[],areAccountsLoaded:!1,hasAccounts:!1,isAccount:u},addresses:{allAddresses:[],allAddressesHex:[],areAddressesLoaded:!1,hasAddresses:!1,isAddress:u}},h=s.createContext(m);function p(e,t,n=[]){const a=e?20:32;return t.reduce(((e,t)=>{if(!e.includes(t)&&!n.includes(t))try{(0,c.m)(t).length>=a?e.push(t):console.warn(`Not adding address ${t}, not in correct format for chain (requires publickey from address)`)}catch{console.error(t,a)}return e}),[])}function g(e){return e.map((e=>{try{return(0,l.c)((0,c.m)(e))}catch(t){return console.error(`Unable to convert address ${e} to hex`,t.message),null}})).filter((e=>!!e))}function f(e){return t=>!!t&&e.includes(t.toString())}function b(e,t={},n){const a=p(e,Object.keys(t),n);return{allAddresses:a,allAddressesHex:g(a),areAddressesLoaded:!0,hasAddresses:0!==a.length,isAddress:f(a)}}function x({children:e}){const{isApiReady:t,isEthereum:n}=(0,d.h)(),[l,c]=(0,s.useState)(m);return(0,s.useEffect)((()=>{let e=null;return t&&(e=(0,i.a)([o.Nn.accounts.subject.pipe((0,r.U)((e=>function(e,t={}){const n=p(e,Object.keys(t));return{allAccounts:n,allAccountsHex:g(n),areAccountsLoaded:!0,hasAccounts:0!==n.length,isAccount:f(n)}}(n,e)))),o.Nn.addresses.subject]).pipe((0,r.U)((([e,t])=>({accounts:e,addresses:b(n,t,e.allAccounts)})))).subscribe((e=>c(e)))),()=>{e&&e.unsubscribe()}}),[t,n]),(0,a.jsx)(h.Provider,{value:l,children:e})}},87561:(e,t,n)=>{n.d(t,{l:()=>x,q:()=>w});var a=n(52322),s=n(2784);const i="incomplete execution";function r(e){return e?e.isErr?`error: ${u(e.asErr)}`:null:i}function o({data:[e]}){return r(e)}const l={Executed:function({data:[,e]}){return r(e)}},c={Attempted:function({data:[e]}){if(!e)return i;if(e.isIncomplete){const[,t]=e.asIncomplete;return`error: ${t.type}`}return null}},d={allianceMotion:l,council:l,membership:l,multisig:{MultisigExecuted:function({data:[,,,,e]}){return r(e)}},polkadotXcm:c,proxy:{ProxyExecuted:o},sudo:{Sudid:o,SudoAsDone:o},technicalCommittee:l,utility:{BatchInterrupted:function({data:[e,t]}){return`error: ${e.toString()}: ${u(t)}`},DispatchedAs:o},xcmPallet:c};function u(e){let t=e.type;if(e.isModule)try{const n=e.asModule,a=e.registry.findMetaError(n);t=`${a.section}.${a.name}`}catch{}else e.isToken&&(t=`${e.type}.${e.asToken.type}`);return t}var m=n(56245),h=n(11798),p=n(13529);let g=0;const f="extrinsic event",b=p.Z.author.submitAndWatchExtrinsic,x=s.createContext({stqueue:[],txqueue:[]});const v=[],A=[];function w({children:e}){const[t,n]=(0,s.useState)(v),[i,r]=(0,s.useState)(A),o=(0,s.useRef)(t),l=(0,s.useRef)(i),c=(0,s.useCallback)((e=>{o.current=e,n(e)}),[]),p=(0,s.useCallback)((e=>{l.current=e,r(e)}),[]),w=(0,s.useCallback)((e=>{const t=++g;p([...l.current,{...e,id:t,removeItem:()=>p([...l.current.map((e=>e.id===t?{...e,status:"completed"}:e))]),rpc:e.rpc||b,status:"queued"}])}),[p]),y=(0,s.useCallback)((e=>{const t=Array.isArray(e)?e:[e];t.length&&c([...o.current,...t.map((e=>{const t=++g,n=()=>c([...o.current.filter((e=>e.id!==t))]);return setTimeout(n,7500),{...e,id:t,isCompleted:!1,removeItem:n}}))])}),[c]),j=(0,s.useCallback)((e=>w({...e})),[w]),k=(0,s.useCallback)(((e,t,n)=>{w({accountId:t.address,extrinsic:e.createType("Extrinsic",{method:e.createType("Call",t.method)},{version:t.version}),payload:t,signerCb:n})}),[w]),N=(0,s.useCallback)((e=>w({...e})),[w]),C=(0,s.useCallback)(((e,t,n,a)=>{p([...l.current.map((s=>s.id===e?{...s,error:void 0===a?s.error:a,result:void 0===n?s.result:n,status:"completed"===s.status?s.status:t}:s))]),y(function(e){return function(e){let t=null;const n=e.reduce(((e,t)=>{const n=e.find((({status:e})=>e.action===t.action&&e.status===t.status));return n?n.count++:e.push({count:1,status:t}),e}),[]).map((({count:e,status:t})=>1===e?t:{...t,action:`${t.action} (x${e})`})).filter((e=>e.message!==f||(t?e.action.startsWith("system.ExtrinsicSuccess")?t.action.unshift(e.action):t.action.push(e.action):t={...e,action:[e.action]},!1)));return t?n.concat(t):n}((e&&e.events||[]).filter((e=>!!e.event&&"democracy"!==e.event.section)).map((e=>{const{event:{data:t,method:n,section:a}}=e;if("system"===a&&"ExtrinsicFailed"===n){const[e]=t;return{action:`${a}.${n}`,message:u(e),status:"error"}}const s=function({event:e}){const{method:t,section:n}=e;return!!d[n]&&!!d[n][t]&&d[n][t](e)}(e);if(s)return{action:`${a}.${n}`,message:s,status:"eventWarn"};if("contracts"===a)if("ContractExecution"===n&&2===t.length){const[e,n]=t;try{const t=(0,h.oX)(e.toString());if(t)return{action:t.decodeEvent(n).event.identifier,message:"contract event",status:"event"}}catch(e){console.error(e)}}else if("Evicted"===n)return{action:`${a}.${n}`,message:"contract evicted",status:"error"};return{action:`${a}.${n}`,message:f,status:"event"}})))}(n)),m.z.includes(t)&&setTimeout((()=>{const t=l.current.find((t=>t.id===e));t&&t.removeItem()}),7500)}),[y,p]),E=(0,s.useMemo)((()=>({queueAction:y,queueExtrinsic:j,queuePayload:k,queueRpc:N,queueSetTxStatus:C,stqueue:t,txqueue:i})),[y,j,k,N,C,t,i]);return(0,a.jsx)(x.Provider,{value:E,children:e})}},91012:(e,t,n)=>{n.d(t,{A:()=>o,d:()=>r});var a=n(52322),s=n(2784);function i(){return{height:window.innerHeight,width:window.innerWidth}}const r=s.createContext(i());function o({children:e}){const[t,n]=(0,s.useState)((()=>i()));return(0,s.useEffect)((()=>{function e(){n(i())}return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}}),[]),(0,a.jsx)(r.Provider,{value:t,children:e})}},52953:(e,t,n)=>{n.d(t,{n:()=>a});const a="Discord"},58800:(e,t,n)=>{n.d(t,{F:()=>s});var a=n(2784);const s=(0,n(11677).e)("useAccountId",(function(e=null,t){const[n,s]=(0,a.useState)(e),i=(0,a.useCallback)(((e=null)=>{s(e),t&&t(e)}),[t]);return[n,i]}))},37198:(e,t,n)=>{n.d(t,{B:()=>f});var a=n(2784),s=n(69187),i=n(33661),r=n(74076),o=n(11677),l=n(90778),c=n(9118),d=n(29455);const u=(0,o.e)("useDeriveAccountFlags",(function(e){const t=(0,d.J)();return(0,c.W7)(t&&t.derive.accounts.flags,[e])}));var m=n(60773),h=n(37146),p=n(38894);const g={isCouncil:!1,isDevelopment:!1,isEditable:!1,isEthereum:!1,isExternal:!1,isFavorite:!1,isHardware:!1,isInContacts:!1,isInjected:!1,isMultisig:!1,isNominator:!1,isOwned:!1,isProxied:!1,isSociety:!1,isSudo:!1,isTechCommittee:!1,isValidator:!1},f=(0,o.e)("useAccountInfo",(function(e,t=!1){const{api:n}=(0,l.h)(),{accounts:{isAccount:o},addresses:{isAddress:d}}=(0,h.i)(),f=(0,m.Y)(e),b=u(e),x=(0,c.W7)(n.query.staking?.nominators,[e]),v=(0,c.W7)(n.query.staking?.validators,[e]),[A,w]=(0,a.useState)(void 0),[y,j]=(0,a.useState)([]),[k,N]=(0,a.useState)(""),[C,E]=(0,a.useState)(null),[S,I]=(0,a.useState)(),[D,B]=(0,a.useState)(g),[L,$]=(0,a.useState)(),[V,P,Z]=(0,p.O)(),[T,z,M]=(0,p.O)();(0,a.useEffect)((()=>{v&&B((e=>({...e,isValidator:!v.isEmpty})))}),[v]),(0,a.useEffect)((()=>{x&&B((e=>({...e,isNominator:!x.isEmpty})))}),[x]),(0,a.useEffect)((()=>{b&&B((e=>({...e,...b})))}),[b]),(0,a.useEffect)((()=>{const{accountIndex:e,identity:t,nickname:a}=f||{},s=e?.toString();let r;if(w((e=>e!==s?s:e)),(0,i.m)(n.query.identity?.identityOf)?t?.display&&(r=t.display):a&&(r=a),N(r||""),t){const e=t.judgements.filter((([,e])=>!e.isFeePaid)),n=e.some((([,e])=>e.isKnownGood));I({...t,isExistent:!!t.display,isKnownGood:n,judgements:e,waitCount:t.judgements.length-e.length})}else I(void 0)}),[f,n]),(0,a.useEffect)((()=>{if(e)try{const t=s.Nn.getAccount(e)||s.Nn.getAddress(e),n=o(e),a=d(e);E(t?.meta.genesisHash||null),B((s=>({...s,isDevelopment:t?.meta.isTesting||!1,isEditable:!(S?.display||!(a||t?.meta.isMultisig||t&&!t.meta.isInjected))||!1,isEthereum:(0,r.vq)(e,160),isExternal:!!t?.meta.isExternal||!1,isHardware:!!t?.meta.isHardware||!1,isInContacts:a,isInjected:!!t?.meta.isInjected||!1,isMultisig:!!t?.meta.isMultisig||!1,isOwned:n,isProxied:!!t?.meta.isProxied||!1}))),$(t?.meta),N(t?.meta.name||""),j(t?.meta.tags?t.meta.tags.sort():[])}catch{}}),[S,o,d,e]);const F=(0,a.useCallback)((()=>{V&&P();const a={name:k,whenEdited:Date.now()};if(t)try{if(e){const t=s.Nn.getAddress(e)?.meta;s.Nn.saveContract(e,{...t,...a})}}catch(e){console.error(e)}else if(e)try{const t=s.Nn.getPair(e);t&&s.Nn.saveAccountMeta(t,a)}catch{s.Nn.getAddress(e)?s.Nn.saveAddress(e,a):s.Nn.saveAddress(e,{genesisHash:n.genesisHash.toHex(),...a})}}),[n,t,V,k,P,e]),H=(0,a.useCallback)((()=>{const n={tags:y,whenEdited:Date.now()};if(t)try{if(e){const t=s.Nn.getAddress(e)?.meta;e&&s.Nn.saveContract(e,{...t,...n})}}catch(e){console.error(e)}else if(e)try{const t=s.Nn.getPair(e);t&&s.Nn.saveAccountMeta(t,n)}catch{s.Nn.saveAddress(e,n)}}),[t,y,e]),R=(0,a.useCallback)((()=>{V&&P(),T&&z();try{e&&s.Nn.forgetAddress(e)}catch(e){console.error(e)}}),[V,T,P,z,e]),U=(0,a.useCallback)((t=>{if(e){const n=s.Nn.getPair(e);n&&s.Nn.saveAccountMeta(n,{...n.meta,genesisHash:t}),E(t)}}),[e]),q=(0,a.useCallback)((e=>j(e.sort())),[]),O=(0,a.useCallback)((()=>V||T),[V,T]);return(0,a.useMemo)((()=>({accountIndex:A,flags:D,genesisHash:C,identity:S,isEditing:O,isEditingName:V,isEditingTags:T,isNull:!e,meta:L,name:k,onForgetAddress:R,onSaveName:F,onSaveTags:H,onSetGenesisHash:U,setIsEditingName:Z,setIsEditingTags:M,setName:N,setTags:q,tags:y,toggleIsEditingName:P,toggleIsEditingTags:z})),[A,D,C,S,O,V,T,L,k,R,F,H,U,Z,M,N,q,y,P,z,e])}))},34814:(e,t,n)=>{n.d(t,{x:()=>i});var a=n(2784),s=n(3773);const i=(0,n(11677).e)("useAccounts",(function(){return(0,a.useContext)(s.H).accounts}))},81642:(e,t,n)=>{n.d(t,{J:()=>i});var a=n(2784),s=n(3773);const i=(0,n(11677).e)("useAddresses",(function(){return(0,a.useContext)(s.H).addresses}))},90778:(e,t,n)=>{n.d(t,{h:()=>i});var a=n(2784),s=n(57139);const i=(0,n(11677).e)("useApi",(function(){return(0,a.useContext)(s.ApiCtx)}))},47297:(e,t,n)=>{n.d(t,{m:()=>i});var a=n(2784),s=n(68944);const i=(0,n(11677).e)("useApiStats",(function(){return(0,a.useContext)(s.y)}))},18837:(e,t,n)=>{n.d(t,{J:()=>m});var a=n(2784),s=n(86613),i=n(21899),r=n(20525),o=n(54371),l=n(26912),c=n(11677),d=n(74065);function u(e){return e&&e.disconnect().catch(console.error),null}const m=(0,c.e)("useApiUrl",(function(e){const t=(0,a.useRef)(null),n=(0,d.X)(),[c,m]=(0,a.useState)(null),h=(0,a.useMemo)((()=>e?(0,o.H)(e)?[e]:(0,l.r)(e.filter((e=>!e.startsWith("light://")))):[]),[e]);return(0,a.useEffect)((()=>()=>{t.current=u(t.current)}),[]),(0,a.useEffect)((()=>{m(null),t.current=u(t.current),h.length&&s.G.create({provider:t.current=new i.U(h),typesBundle:r.UD}).then((e=>n.current&&m(e))).catch(console.error)}),[n,t,h]),c}))},43223:(e,t,n)=>{n.d(t,{g:()=>u});var a=n(2784),s=n(95292),i=n(48801),r=n.n(i),o=n(11677),l=n(90778),c=n(9118),d=n(74065);const u=(0,o.e)("useAvailableSlashes",(function(){const{api:e}=(0,l.h)(),t=(0,c.W7)(e.derive.session?.indexes),n=(0,c.W7)(e.query.staking?.earliestUnappliedSlash),i=(0,d.X)(),[o,u]=(0,a.useState)([]);return(0,a.useEffect)((()=>{let a;const[o,l]=e.query.staking?.earliestUnappliedSlash?[n&&n.unwrapOr(null),s.nw]:[t?.activeEra,s.If.add(e.consts.staking?.slashDeferDuration||s.S8)];if(i.current&&t&&o){const n=[],c=t.activeEra.add(l);let d=new(r())(o);for(;d.lte(c);)n.push(d),d=d.add(s.If);n.length&&(async()=>{a=await e.query.staking.unappliedSlashes.multi(n,(e=>{i.current&&u(e.map(((e,t)=>[o.addn(t),e])).filter((([,e])=>e.length)))}))})().catch(console.error)}return()=>{a&&a()}}),[e,n,t,i]),o}))},83696:(e,t,n)=>{n.d(t,{r:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useBalancesAll",(function(e){const{api:t}=(0,s.h)();return(0,i.W7)(t.derive.balances?.all,[e])}))},62395:(e,t,n)=>{n.d(t,{P:()=>o});var a=n(11677),s=n(90778),i=n(9118);const r={transform:e=>e.hash.toHex()},o=(0,a.e)("useBestHash",(function(){const{api:e}=(0,s.h)();return(0,i.W7)(e.rpc.chain.subscribeNewHeads,void 0,r)}))},54383:(e,t,n)=>{n.d(t,{C:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useBestNumber",(function(){const{api:e}=(0,s.h)();return(0,i.W7)(e.derive.chain.bestNumber)}))},75387:(e,t,n)=>{n.d(t,{E:()=>i});var a=n(2784),s=n(57120);const i=(0,n(11677).e)("useBlockAuthors",(function(){return(0,a.useContext)(s.U)}))},67405:(e,t,n)=>{n.d(t,{d:()=>i});var a=n(2784),s=n(44028);const i=(0,n(11677).e)("useBlockEvents",(function(){return(0,a.useContext)(s.m)}))},56360:(e,t,n)=>{n.d(t,{n:()=>h});var a=n(2784),s=n(95292),i=n(48801),r=n.n(i),o=n(52107),l=n(11677),c=n(90778),d=n(49255);const u=s.D_.div(s.um),m=new(r())(6e3),h=(0,l.e)("useBlockInterval",(function(e){const{api:t}=(0,c.h)();return(0,a.useMemo)((()=>function(e){return(0,o.N)(d.P,e.consts.babe?.expectedBlockTime||e.consts.difficulty?.targetBlockTime||e.consts.subspace?.expectedBlockTime||(e.consts.timestamp?.minimumPeriod.gte(u)?e.consts.timestamp.minimumPeriod.mul(s.um):e.query.parachainSystem?m.mul(s.um):m))}(e||t)),[t,e])}))},97794:(e,t,n)=>{n.d(t,{A:()=>u,h:()=>m});var a=n(2784),s=n(52107),i=n(95292),r=n(22771),o=n(12372),l=n(11677),c=n(61349);(0,c.Zh)(["react-hooks"]);var d=n(56360);function u(e,t,n){const a=(0,s.N)(i.Ew,e.mul(t)).toNumber(),o=(0,r.E)(Math.abs(a)),{days:l,hours:c,minutes:d,seconds:u}=o;return[e.toNumber(),`${a<0?"+":""}${[l?l>1?n("{{days}} days",{replace:{days:l}}):n("1 day"):null,c?c>1?n("{{hours}} hrs",{replace:{hours:c}}):n("1 hr"):null,d?d>1?n("{{minutes}} mins",{replace:{minutes:d}}):n("1 min"):null,u?u>1?n("{{seconds}} s",{replace:{seconds:u}}):n("1 s"):null].filter((e=>!!e)).slice(0,2).join(" ")}`,o]}const m=(0,l.e)("useBlockTime",(function(e=i.If,t){const{t:n}=(0,c.$G)("react-hooks"),s=(0,d.n)(t);return(0,a.useMemo)((()=>u(s,(0,o.G)(e),n)),[s,e,n])}))},49255:(e,t,n)=>{n.d(t,{P:()=>c,u:()=>d});var a=n(2784),s=n(48801),i=n.n(s),r=n(12372),o=n(11677),l=n(56360);const c=new(i())(864e5),d=(0,o.e)("useBlocksPerDays",(function(e=1){const t=(0,l.n)();return(0,a.useMemo)((()=>c.mul((0,r.G)(e)).div(t)),[t,e])}))},9118:(e,t,n)=>{n.d(t,{S3:()=>u,SB:()=>d,W7:()=>h,r1:()=>m});var a=n(2784),s=n(1346),i=n(17751),r=n(33661),o=n(17965),l=n(90778),c=n(74065);function d(e){return e}function u(e,t,n){console.error(t.current.error=new Error(`${t.current.type}(${function(e){return!!e&&!(0,s.o)(e.creator)}(n)?`${n.creator.section}.${n.creator.method}`:"..."}):: ${e.message}:: ${e.stack||"<unknown>"}`))}function m(e){e.current.isActive=!1,e.current.subscriber&&(e.current.subscriber.then((e=>(0,r.m)(e)&&e())).catch((t=>u(t,e))),e.current.subscriber=null)}function h(e,t,n){const{api:r}=(0,l.h)(),h=(0,c.X)(),p=(0,a.useRef)({error:null,fn:null,isActive:!1,serialized:null,subscriber:null,type:"useCall"}),[g,f]=(0,a.useState)((n||{}).defaultValue);return(0,a.useEffect)((()=>()=>m(p)),[]),(0,a.useEffect)((()=>{if(h.current&&e){const[a,l]=function(e,t,{paramMap:n=d}={}){return[JSON.stringify({f:e?.name,p:t}),0!==t.length&&t.some((e=>(0,i.F)(e)||(0,s.o)(e)))?null:n(t)]}(e,t||[],n);!l||e===p.current.fn&&a===p.current.serialized||(p.current.fn=e,p.current.serialized=a,function(e,t,n,a,i,r,{transform:l=d,withParams:c,withParamsTransform:h}={}){const p=i.filter((e=>!(0,s.o)(e)));m(n),(0,o.Y)((()=>{t.current&&(!a||function(e){return!!e.meta?.type?.isMap}(a)&&a.meta.type.asMap.hashers.length!==p.length?n.current.subscriber=null:(n.current.isActive=!0,n.current.subscriber=a(...i,(s=>{if(t.current&&n.current.isActive)try{r(c?[i,l(s,e)]:l(h?[i,s]:s,e))}catch(e){u(e,n,a)}})).catch((e=>u(e,n,a)))))}))}(r,h,p,e,l,f,n))}}),[r,e,n,h,t]),g}},54890:(e,t,n)=>{n.d(t,{L:()=>c});var a=n(2784),s=n(17965),i=n(1346),r=n(90778),o=n(9118),l=n(74065);function c(e,t){const{api:n}=(0,r.h)(),c=(0,l.X)(),d=(0,a.useRef)({error:null,fn:null,isActive:!1,serialized:null,subscriber:null,type:"useCallMulti"}),[u,m]=(0,a.useState)((()=>(0,i.o)((t||{}).defaultValue)?[]:(t||{}).defaultValue));return(0,a.useEffect)((()=>()=>(0,o.r1)(d)),[]),(0,a.useEffect)((()=>{if(c.current&&e){const a=JSON.stringify(e);a!==d.current.serialized&&(d.current.serialized=a,function(e,t,n,a,i,{transform:r=o.SB}={}){(0,o.r1)(n),(0,s.Y)((()=>{if(t.current){const s=a.map((e=>!(!e||Array.isArray(e)&&!e[0]))),l=a.filter(((e,t)=>s[t]));l.length?(n.current.isActive=!0,n.current.subscriber=e.queryMulti(l,(l=>{if(t.current&&n.current.isActive){let t=-1;try{i(r(a.map(((e,n)=>s[n]?l[++t]:void 0)),e))}catch(e){(0,o.S3)(e,n)}}})).catch((e=>(0,o.S3)(e,n)))):n.current.subscriber=null}}))}(n,c,d,e,m,t))}}),[n,e,t,c]),u}},81190:(e,t,n)=>{n.d(t,{m:()=>r});var a=n(2784),s=n(90778),i=n(33661);const r=(0,n(11677).e)("useCollectiveInstance",(function(e,t){const{api:n}=(0,s.h)();return(0,a.useMemo)((()=>{const a=t||0,s=n.registry.getModuleInstances(n.runtimeVersion.specName.toString(),e),r=s&&a<s.length?s[a]:e;return n.tx[r]&&(0,i.m)(n.tx[r].close)?r:null}),[n,t,e])}))},70563:(e,t,n)=>{n.d(t,{V:()=>d});var a=n(2784),s=n(11677),i=n(34814),r=n(90778),o=n(9118);const l={transform:e=>e.map((e=>e.toString()))},c={transform:e=>e&&e.toString()},d=(0,s.e)("useCollectiveMembers",(function(e){const{api:t}=(0,r.h)(),{allAccounts:n}=(0,i.x)(),s=(0,o.W7)(t.derive[e]?.members,[],l),d=(0,o.W7)(t.derive[e]?.prime,[],c);return(0,a.useMemo)((()=>({isMember:(s||[]).some((e=>n.includes(e))),members:s||[],prime:d})),[n,s,d])}))},27421:(e,t,n)=>{n.d(t,{N:()=>i});var a=n(2784),s=n(74065);function i(e,t=250){const n=(0,s.X)(),[i,r]=(0,a.useState)(e);return(0,a.useEffect)((()=>{const a=setTimeout((()=>{n.current&&r(e)}),t);return()=>{clearTimeout(a)}}),[t,e,n]),i}},32980:(e,t,n)=>{n.d(t,{W:()=>r});var a=n(90778),s=n(34814),i=n(9118);const r=(0,n(11677).e)("useDelegations",(function(){const{api:e}=(0,a.h)(),{allAccounts:t}=(0,s.x)();return(0,i.W7)(e.query.democracy?.votingOf?.multi,[t])}))},60773:(e,t,n)=>{n.d(t,{Y:()=>r});var a=n(11677),s=n(9118),i=n(29455);const r=(0,a.e)("useDeriveAccountInfo",(function(e){const t=(0,i.J)();return(0,s.W7)(t&&t.derive.accounts.info,[e])}))},39824:(e,t,n)=>{n.d(t,{N:()=>c});var a=n(2784),s=n(33661),i=n(90778),r=n(24305),o=n(80501);function l(e=[],{added:t=[],removed:n=[]}){if(!t.length&&!n.length)return e;const a={};[e,t].forEach((e=>e.forEach((e=>{a[e.toHex()]=e})))),n.forEach((e=>{delete a[e.toHex()]}));const i=Object.entries(a).sort(((e,t)=>(0,s.m)(e[1].cmp)?e[1].cmp(t[1]):e[0].localeCompare(t[0]))).map((([,e])=>e));return i.length!==e.length||i.find(((t,n)=>!t.eq(e[n])))?i:e}function c(e,t,n,s){const{api:c}=(0,i.h)(),[d,u]=(0,a.useState)(),m=(0,o.Wg)(e),{blockHash:h,events:p}=(0,r.b)(m);return(0,a.useEffect)((()=>{n&&u((e=>l(e,{added:n})))}),[n]),(0,a.useEffect)((()=>{h&&u((e=>l(e,t(p,c,s))))}),[s,c,h,p,t]),d}},24305:(e,t,n)=>{n.d(t,{b:()=>u});var a=n(2784),s=n(11677),i=n(90778),r=n(9118),o=n(74065),l=n(80501);const c={blockHash:"",events:[]},d=()=>!0,u=(0,s.e)("useEventTrigger",(function(e,t=d){const{api:n}=(0,i.h)(),[s,u]=(0,a.useState)((()=>c)),m=(0,l.Wg)(e),h=(0,o.X)(),p=(0,r.W7)(n.query.system.events);return(0,a.useEffect)((()=>{if(h.current&&p){const e=p.filter((e=>e.event&&m.some((t=>t&&t.is(e.event)))&&t(e)));e.length&&u({blockHash:p.createdAtHash?.toHex()||"",events:e})}}),[p,t,m,h]),s}))},54131:(e,t,n)=>{n.d(t,{r:()=>l});var a=n(2784),s=n(11677),i=n(23729),r=n.n(i),o=n(90778);const l=(0,s.e)("useFavorites",(function(e){const[t,n]=function(e){const{api:t,isDevelopment:n}=(0,o.h)(),s=(0,a.useMemo)((()=>`${e}:${n?"development":t.genesisHash.toHex()}`),[t,n,e]);return[(0,a.useCallback)((()=>r().get(s)),[s]),(0,a.useCallback)((e=>r().set(s,e)),[s])]}(e),[s,i]=(0,a.useState)((()=>t()||[])),l=(0,a.useCallback)((e=>i((t=>n(t.includes(e)?t.filter((t=>e!==t)):[...t,e])))),[n]);return(0,a.useMemo)((()=>[s,l]),[s,l])}))},93803:(e,t,n)=>{n.d(t,{Y:()=>r});var a=n(2784),s=n(1346);const i=()=>!0;function r(e,t=i){const[n,r]=(0,a.useState)(e),o=(0,a.useMemo)((()=>!!n&&t(n)),[t,n]),l=(0,a.useCallback)((e=>!(0,s.o)(e)&&r(e)),[]);return[n,o,l]}},60864:(e,t,n)=>{n.d(t,{y:()=>r});var a=n(2784),s=n(11677),i=n(74065);const r=(0,s.e)("useIncrement",(function(e=1){const t=(0,i.X)(),[n,s]=(0,a.useState)(e),r=(0,a.useCallback)((()=>{t.current&&s((e=>++e))}),[t]);return[n,r,s]}))},57493:(e,t,n)=>{n.d(t,{V:()=>d});var a=n(2784),s=n(6119),i=n(95292),r=n(11677),o=n(90778),l=n(9118);const c={idealInterest:0,idealStake:0,inflation:0,stakedFraction:0,stakedReturn:0},d=(0,r.e)("useInflation",(function(e){const{api:t}=(0,o.h)(),n=(0,l.W7)(t.query.balances?.totalIssuance),r=(0,l.W7)(t.query.auctions?.auctionCounter),[d,u]=(0,a.useState)(c);return(0,a.useEffect)((()=>{const a=t.query.auctions?r:i.nw;a&&n&&e&&u(function(e,t,n,a){const{auctionAdjust:r,auctionMax:o,falloff:l,maxInflation:c,minInflation:d,stakeTarget:u}=(0,s.S)(e),m=t.isZero()||n.isZero()?0:t.mul(i.uy).div(n).toNumber()/i.uy.toNumber(),h=u-Math.min(o,a.toNumber())*r,p=c/h,g=100*(d+(m<=h?m*(p-d/h):(p*h-d)*Math.pow(2,(h-m)/l)));return{idealInterest:p,idealStake:h,inflation:g,stakedFraction:m,stakedReturn:m?g/m:0}}(t,e,n,a))}),[t,r,n,e]),d}))},83337:(e,t,n)=>{n.d(t,{K:()=>c,g:()=>d});var a=n(2784),s=n(11677);const i=["ipfs","ipns"],r=i.map((e=>`/${e}/`)),o=".ipfs.localhost",l=".ipns.localhost";function c(){const[e]=window.location.href.split("#");return e.includes(o)?function(e){const[,,t]=e.split("/"),n=t.split(":")[0];return{ipfsHash:n.replace(o,""),ipfsPath:n,ipnsChain:null,ipnsDomain:null,isIpfs:!0,isIpns:!1}}(e):e.includes(l)?function(e){const[,,t]=e.split("/"),n=t.split(":")[0],a=n.replace(l,""),s=a.split(".");let i=null,r=null;return s.length>2?(i=s[0],r=s.slice(1).join(".")):r=a,{ipfsHash:null,ipfsPath:n,ipnsChain:i,ipnsDomain:r,isIpfs:!0,isIpns:!0}}(e):function(e){const t=r.some((t=>e.includes(t))),n=e.includes(r[1]),a=e.split("/"),s=a.indexOf(n?i[1]:i[0]);let o=null,l=null,c=null,d=null;if(-1!==s)if(l=a.slice(0,s+1).join("/"),n){const e=a[s+1],t=e.split(".");t.length>2?(c=t[0],d=t.slice(1).join(".")):d=e}else o=a[s+1];return{ipfsHash:o,ipfsPath:l,ipnsChain:c,ipnsDomain:d,isIpfs:t,isIpns:n}}(e)}const d=(0,s.e)("useIpfs",(function(){const[e]=(0,a.useState)((()=>c()));return e}))},67239:(e,t,n)=>{n.d(t,{g:()=>o});var a=n(33702),s=n(2784),i=n(74065);const r=new Map;function o(e,t){const n=(0,i.X)(),[o,l]=(0,s.useState)(),c=(0,s.useMemo)((()=>{if(e)return e.map((e=>{return(t=e)&&(a.rb(t)||a.MC(t.toLowerCase()))?e:"";var t})).filter((e=>!!e))}),[e]);return(0,s.useEffect)((()=>{n.current&&c&&async function(e){const t=new Map,n=e.map((e=>r.has(e)?(t.set(e,r.get(e)),Promise.resolve()):fetch(`https://ipfs.io/ipfs/${e}`).then((async n=>{const a=n.status>=200&&n.status<300?await n.text():null;r.set(e,a),t.set(e,a)}))));return await Promise.allSettled(n),t}(c).then((e=>l(function(e,{transform:t}={}){if(!t)return e;for(const[n,a]of e.entries())e.set(n,t(a));return e}(e,t)))).catch((()=>{}))}),[c,t,n]),o}},62837:(e,t,n)=>{n.d(t,{Y:()=>s});var a=n(2784);const s=(0,n(11677).e)("useIpfsLink",(function(e){return(0,a.useMemo)((()=>e?{ipfsHash:e,ipfsShort:`${e.substring(0,4)}…${e.slice(-4)}`,ipfsUrl:`https://ipfs.io/ipfs/${e}`}:null),[e])}))},74065:(e,t,n)=>{n.d(t,{X:()=>s});var a=n(2784);const s=(0,n(11677).e)("useIsMountedRef",(function(){const e=(0,a.useRef)(!1);return(0,a.useEffect)((()=>(e.current=!0,()=>{e.current=!1})),[]),e}))},48783:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(2784);const s=e=>e.filter((([,e])=>!e.isFeePaid)),i=e=>e.filter((([,e])=>e.isKnownGood)),r=e=>e.filter((([,e])=>e.isReasonable)),o=e=>e.filter((([,e])=>e.isErroneous)),l=e=>e.filter((([,e])=>e.isLowQuality));var c=n(11677),d=n(37198),u=n(71984);const m=(0,c.e)("useJudgements",(function(e){const{identity:t}=(0,d.B)(e),{registrars:n}=(0,u.F)(),c=(0,a.useMemo)((()=>function(e){if(!e)return[];const t=function(e){const t=s(e),n=i(t),a=r(t);return{Erroneous:o(t),"Known good":n,"Low quality":l(t),Reasonable:a}}(e.judgements),n=[];for(const e in t){const s=e;0!==t[s].length&&n.push({judgementName:s,registrarsIndexes:(a=t[s],a.map((e=>e[0])))})}var a;return n}(t)),[t]);return(0,a.useMemo)((()=>function(e,t){return e.map((({judgementName:e,registrarsIndexes:n})=>({judgementName:e,registrars:n.map((e=>(e=>t.find((t=>t.index===e)))(e.toNumber())))})))}(c,n)),[n,c])}))},37146:(e,t,n)=>{n.d(t,{i:()=>i});var a=n(2784),s=n(3773);const i=(0,n(11677).e)("useKeyring",(function(){return(0,a.useContext)(s.H)}))},45479:(e,t,n)=>{n.d(t,{c:()=>x});var a=n(2784),s=n(99736),i=n(70392),r=n(7404),o=n(38711),l=n(48731),c=n(11677),d=n(90778);const u={hasLedgerChain:!1,hasWebUsb:!1,isLedgerCapable:!1,isLedgerEnabled:!1},m=!!window.USB,h=Object.keys(i.A).filter((e=>r.Y[e])),p=h.reduce(((e,t)=>[...e,...i.A[t]]),[]);let g=null,f=null;function b(e){const t=p.includes(e.genesisHash.toHex()),n=m&&t;return{hasLedgerChain:t,hasWebUsb:m,isLedgerCapable:n,isLedgerEnabled:n&&"none"!==o.ZP.ledgerConn}}const x=(0,c.e)("useLedger",(function(){const{api:e,isApiReady:t}=(0,d.h)(),n=(0,a.useCallback)((()=>function(e){const t=o.ZP.ledgerConn;if(!g||f!==t){const n=e.genesisHash.toHex(),a=h.find((e=>i.A[e].includes(n)));(0,l.hu)(a,`Unable to find a known Ledger config for genesisHash ${n}`),g=new s.P(t,a),f=t}return g}(e)),[e]);return(0,a.useMemo)((()=>({...t?b(e):u,getLedger:n})),[e,n,t])}))},51240:(e,t,n)=>{n.d(t,{t:()=>i});var a=n(2784),s=n(11147);function i(e,t,{transform:n}={},i){const[r,o]=(0,a.useState)(),l=(0,a.useRef)(null);return(0,a.useEffect)((()=>{if(e&&t){const a=(0,s.P)({at:i,params:t});a!==l.current&&(l.current=a,(i&&"0"!==i?e.entriesAt(i,...t):e.entries(...t)).then((e=>o(n?n(e):e))).catch(console.error))}}),[i,e,t,n]),r}},12298:(e,t,n)=>{n.d(t,{k:()=>i});var a=n(2784),s=n(11147);function i(e,t,{transform:n}={},i){const[r,o]=(0,a.useState)(),l=(0,a.useRef)(null);return(0,a.useEffect)((()=>{if(e&&t){const a=(0,s.P)({at:i,params:t});a!==l.current&&(l.current=a,(i&&"0"!==i?e.keysAt(i,...t):e.keys(...t)).then((e=>o(n?n(e):e))).catch(console.error))}}),[i,e,t,n]),r}},80501:(e,t,n)=>{n.d(t,{Wg:()=>o});var a=n(2784),s=n(11147);function i(e,t,n=-1){return n++,e!==t&&(!(n<2&&Array.isArray(e)&&Array.isArray(t)&&e.length===t.length)||e.some(((e,a)=>i(e,t[a],n))))}function r(e,t){if(!e.current||i(e.current.value,t)){const n=(0,s.P)({value:t});e.current&&e.current.stringified===n||(e.current={stringified:n,value:t})}return e.current.value}function o(e){const t=(0,a.useRef)(null);return(0,a.useMemo)((()=>r(t,e)),[t,e])}},65121:(e,t,n)=>{n.d(t,{d:()=>r});var a=n(2784),s=n(11677),i=n(38894);const r=(0,s.e)("useModal",(function(e,t,n){const[s,,r]=(0,i.O)(e||!1),o=(0,a.useCallback)((()=>{r(!0),t&&t()}),[t,r]);return{isOpen:s,onClose:(0,a.useCallback)((()=>{r(!1),n&&n()}),[n,r]),onOpen:o}}))},47623:(e,t,n)=>{n.d(t,{q:()=>i});var a=n(2784),s=n(17965);const i=(0,n(11677).e)("useNextTick",(function(){const[e,t]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{(0,s.Y)((()=>t(!0)))}),[]),e}))},6589:(e,t,n)=>{n.d(t,{n:()=>r});var a=n(11677),s=n(93803);function i(e){return e&&e.length>0||!1}const r=(0,a.e)("useNonEmptyString",(function(e=""){return(0,s.Y)(e,i)}))},63198:(e,t,n)=>{n.d(t,{O:()=>s});var a=n(2784);const s=(0,n(11677).e)("useOutsideClick",(function(e,t){const n=(0,a.useCallback)((n=>{e.length&&!function(e,t){return e.some((e=>e.current&&e.current.contains(t.target)))}(e,n)&&t()}),[e,t]);(0,a.useEffect)((()=>(document.addEventListener("click",n,!0),()=>{document.removeEventListener("click",n,!0)})),[n,t])}))},59118:(e,t,n)=>{n.d(t,{Q:()=>h});var a=n(2784),s=n(95292),i=n(11677),r=n(90778),o=n(9118),l=n(74065),c=n(50417);const d={filteredEras:[],validatorEras:[]},u={isLoadingRewards:!0,rewardCount:0},m={withParams:!0},h=(0,i.e)("useOwnEraRewards",(function(e,t,n){const{api:i}=(0,r.h)(),h=(0,l.X)(),p=(0,c.q)(n),g=(0,o.W7)(i.derive.staking?.erasHistoric),[{filteredEras:f,validatorEras:b},x]=(0,a.useState)(d),[v,A]=(0,a.useState)(u),w=(0,o.W7)(!t?.length&&!!f.length&&p&&i.derive.staking?.stakerRewardsMultiEras,[p,f],m),y=(0,o.W7)(!!b.length&&!!f.length&&i.derive.staking._erasPoints,[f,!1]),j=(0,o.W7)(!!b.length&&!!f.length&&i.derive.staking._erasRewards,[f,!1]);return(0,a.useEffect)((()=>{A({allRewards:null,isLoadingRewards:!0,rewardCount:0})}),[e,t]),(0,a.useEffect)((()=>{if(g&&e){const n=g.slice(-1*e),a=[];0===g.length?(A({allRewards:{},isLoadingRewards:!1,rewardCount:0}),x({filteredEras:n,validatorEras:a})):t?.length&&(t.forEach((({stakingLedger:e,stashId:t})=>{if(e){const s=n.filter((t=>!e.claimedRewards.some((e=>t.eq(e)))));s.length&&a.push({eras:s,stashId:t})}})),n.length&&!a.length&&A({allRewards:{},isLoadingRewards:!1,rewardCount:0})),x({filteredEras:n,validatorEras:a})}}),[g,e,t]),(0,a.useEffect)((()=>{h.current&&w&&!t&&A(function([[e],t]){const n={};return e.forEach(((e,a)=>{n[e]=t[a].filter((({eraReward:e})=>!e.isZero()))})),{allRewards:n,isLoadingRewards:!1,rewardCount:Object.values(n).filter((e=>0!==e.length)).length}}(w))}),[h,t,w]),(0,a.useEffect)((()=>{h&&y&&j&&t&&A(function(e,t,n,a){const i={};return t.forEach((({eras:t,stashId:r})=>{t.forEach((t=>{const o=n.find((e=>e.era.eq(t))),l=a.find((e=>e.era.eq(t)));if(o?.eraPoints.gt(s.nw)&&o?.validators[r]&&l){const n=o.validators[r].mul(l.eraReward).div(o.eraPoints);if(!n.isZero()){const a=e.createType("Balance",n);i[r]||(i[r]=[]),i[r].push({era:t,eraReward:l.eraReward,isEmpty:!1,isValidator:!0,nominating:[],validators:{[r]:{total:a,value:a}}})}}}))})),{allRewards:i,isLoadingRewards:!1,rewardCount:Object.values(i).filter((e=>0!==e.length)).length}}(i,b,y,j))}),[i,y,j,h,t,b]),v}))},12213:(e,t,n)=>{n.d(t,{w:()=>m});var a=n(2784),s=n(51330),i=n(55858),r=n(11677),o=n(34814),l=n(90778),c=n(74065),d=n(50417);function u(e){return e?e.toString():null}const m=(0,r.e)("useOwnStashInfos",(function(){const{api:e}=(0,l.h)(),{allAccounts:t}=(0,o.x)(),n=(0,c.X)(),r=(0,d.y)(),[m,h]=(0,a.useState)();return(0,a.useEffect)((()=>{let t;if(r)if(r.length){const a=r.map((([e])=>e)),s=[[e.derive.staking.accounts,a],[e.query.staking.validators.multi,a]];e.combineLatest(s,(([e,t])=>{n.current&&r.length===e.length&&r.length===t.length&&h(r.reduce(((n,[a,s],i)=>({...n,[a]:[s,e[i],t[i]]})),{}))})).then((e=>{t=e})).catch(console.error)}else n.current&&h({});return()=>{t&&t()}}),[e,n,r]),(0,a.useMemo)((()=>r&&m&&r.length===Object.keys(m).length?r.filter((([e])=>m[e])).map((([e])=>function(e,t,[n,{controllerId:a,exposure:r,nextSessionIds:o,nominators:l,rewardDestination:c,sessionIds:d,stakingLedger:m,validatorPrefs:h},p]){const g=!!l?.length,f=!(Array.isArray(p)?p[1].isEmpty:p.isEmpty),b=o instanceof Map?[...o.values()]:o,x=(0,s.e)(...b.map((e=>e.toU8a()))),v=d instanceof Map?[...d.values()]:d,A=(0,s.e)(...v.map((e=>e.toU8a()))),w=u(a);return{controllerId:w,destination:c,exposure:r,hexSessionIdNext:(0,i.c)(x,48),hexSessionIdQueue:(0,i.c)(A.length?A:x,48),isLoading:!1,isOwnController:t.includes(w||""),isOwnStash:n,isStashNominating:g,isStashValidating:f,nominating:l?.map(u),sessionIds:(b.length?b:v).map(u),stakingLedger:m,stashId:e,validatorPrefs:h}}(e,t,m[e]))):void 0),[t,r,m])}))},50417:(e,t,n)=>{n.d(t,{q:()=>c,y:()=>l});var a=n(2784),s=n(11677),i=n(34814),r=n(90778),o=n(9118);const l=(0,s.e)("useOwnStashes",(function(e){const{allAccounts:t}=(0,i.x)(),{api:n}=(0,r.h)(),s=(0,a.useMemo)((()=>t.concat(e||[])),[t,e]),l=(0,o.W7)(0!==s.length&&n.query.staking?.bonded.multi,[s]),c=(0,o.W7)(0!==s.length&&n.query.staking?.ledger.multi,[s]);return(0,a.useMemo)((()=>s.length?l&&c?function(e,t,n){const a=[];return t.forEach(((t,n)=>{t.isSome&&a.push([e[n],!0])})),n.forEach((e=>{if(e.isSome){const t=e.unwrap().stash.toString();!a.some((([e])=>e===t))&&a.push([t,!1])}})),a}(s,l,c):void 0:[]),[s,l,c])})),c=(0,s.e)("useOwnStashIds",(function(e){const t=l(e);return(0,a.useMemo)((()=>t?t.map((([e])=>e)):void 0),[t])}))},36198:(e,t,n)=>{n.d(t,{x:()=>c});var a=n(2784),s=n(26912),i=n(11677),r=n(18837),o=n(74065),l=n(84450);const c=(0,i.e)("useParaApi",(function(e){const t=(0,o.X)(),n=(0,l.jC)(e),[i,c]=(0,a.useState)((()=>({api:null,endpoints:n,urls:[]}))),d=(0,r.J)(i.urls);return(0,a.useEffect)((()=>{t.current&&c({api:null,endpoints:n,urls:(0,s.r)(n.filter((({isDisabled:e,isUnreachable:t})=>!e&&!t)).map((({value:e})=>e)))})}),[n,t]),(0,a.useEffect)((()=>{t.current&&c((({endpoints:e,urls:t})=>({api:d,endpoints:e,urls:t})))}),[d,t]),i}))},84450:(e,t,n)=>{n.d(t,{gW:()=>m,jC:()=>u});var a=n(2784),s=n(47564),i=n(12372),r=n(11677),o=n(90778);const l=(0,s.Rf)(((e,t)=>t||e));function c(e,t){const n=(0,i.G)(t).toNumber();return e.filter((({paraId:e})=>e===n))}const d=(0,r.e)("useRelayEndpoints",(function(){const{api:e}=(0,o.h)();return(0,a.useMemo)((()=>{return t=e.genesisHash.toHex(),l.filter((({genesisHashRelay:e})=>t===e));var t}),[e])})),u=(0,r.e)("useParaEndpoints",(function(e){const t=d();return(0,a.useMemo)((()=>c(t,e)),[t,e])})),m=(0,r.e)("useIsParasLinked",(function(e){const t=d();return(0,a.useMemo)((()=>e?e.reduce(((e,n)=>({...e,[n.toString()]:0!==c(t,n).length})),{}):{}),[t,e])}))},31313:(e,t,n)=>{n.d(t,{CH:()=>A,uD:()=>b});var a=n(2784),s=n(90778),i=n(9118),r=n(11677),o=n(37602),l=n(54371),c=n(48358),d=n(55858),u=n(48801),m=n.n(u),h=n(14681),p=n(33403),g=n(95292);function f(e){if(e.query.preimage&&e.query.preimage.preimageFor&&e.query.preimage.preimageFor.creator.meta.type.isMap){const{type:t}=e.registry.lookup.getTypeDef(e.query.preimage.preimageFor.creator.meta.type.asMap.key);if("H256"===t)return"hash";if("(H256,u32)"===t)return"hashAndLen"}return"unknown"}function b(e,t){let n,a;if((0,l.H)(t))n=t;else if((0,c.U)(t))n=t.toHex();else{const s=t;s.isInline?(a=s.asInline.toU8a(!0),n=(0,d.c)(e.registry.hash(a))):t.isLegacy?n=t.asLegacy.hash_.toHex():t.isLookup?n=t.asLookup.hash_.toHex():console.error(`Unhandled FrameSupportPreimagesBounded type ${t.type}`)}return{inlineData:a,paramsStatus:n&&[n],proposalHash:n,resultPreimageHash:n&&{count:0,isCompleted:!1,isHashParam:"hash"===f(e),proposalHash:n,proposalLength:a&&new(m())(a.length),registry:e.registry,status:null}}}function x(e,t){const n=(0,c.U)(t)?t:t.unwrapOr(null);let a,s=null,i=null,r=null;if(n)try{s=e.registry.createType("Call",n);const t=s.encodedLength;if(e.proposalLength){const n=e.proposalLength.toNumber();t!==n&&(r=`Decoded call length does not match on-chain stored preimage length (${(0,h.u)(t)} bytes vs ${(0,h.u)(n)} bytes)`)}else a=new(m())(t)}catch(e){console.error(e),i="Unable to decode preimage bytes into a valid Call"}else r="No preimage bytes found";return(0,p.Z)({},e,{isCompleted:!0,proposal:s,proposalError:i,proposalLength:a||e.proposalLength,proposalWarning:r})}function v(e){return e?{amount:e[1],who:e[0].toString()}:void 0}const A=(0,r.e)("usePreimage",(function(e){const{api:t}=(0,s.h)(),{inlineData:n,paramsStatus:r,resultPreimageHash:l}=(0,a.useMemo)((()=>e?b(t,e):{}),[t,e]),c=(0,i.W7)(!n&&r&&t.query.preimage?.statusFor,r),{paramsBytes:d,resultPreimageFor:u}=(0,a.useMemo)((()=>l&&c?function(e,t){const n=(0,p.Z)({},e,{status:t.unwrapOr(null)});if(n.status)if(n.status.isRequested){const e=n.status.asRequested;if(e instanceof o.W);else{const{count:t,deposit:a,len:s}=e;n.count=t.toNumber(),n.deposit=v(a.unwrapOr(null)),n.proposalLength=s.unwrapOr(g.nw)}}else if(n.status.isUnrequested){const e=n.status.asUnrequested;if(e instanceof o.W)n.deposit=v(e.unwrapOr(null));else{const{deposit:e,len:t}=n.status.asUnrequested;n.deposit=v(e),n.proposalLength=t}}else console.error(`Unhandled PalletPreimageRequestStatus type: ${n.status.type}`);return{paramsBytes:n.isHashParam?[n.proposalHash]:[[n.proposalHash,n.proposalLength||g.nw]],resultPreimageFor:n}}(l,c):{}),[c,l]),m=(0,i.W7)(d&&t.query.preimage?.preimageFor,d);return(0,a.useMemo)((()=>u?m?x(u,m):u:l?n?x(l,n):l:void 0),[n,m,l,u])}))},19276:(e,t,n)=>{n.d(t,{N:()=>l});var a=n(11677),s=n(34814),i=n(90778),r=n(9118);const o={transform:(e,t)=>3===t.tx.proxy.addProxy.meta.args.length?e:e.map((([e,n])=>[e.map((([e,n])=>t.createType("ProxyDefinition",{delegate:e,proxyType:n}))),n]))},l=(0,a.e)("useProxies",(function(){const{api:e}=(0,i.h)(),{allAccounts:t}=(0,s.x)();return(0,r.W7)(e.query.proxy?.proxies.multi,[t],o)}))},86135:(e,t,n)=>{n.d(t,{L:()=>i});var a=n(2784),s=n(87561);const i=(0,n(11677).e)("useQueue",(function(){return(0,a.useContext)(s.l)}))},71984:(e,t,n)=>{n.d(t,{F:()=>l});var a=n(2784),s=n(11677),i=n(34814),r=n(90778),o=n(9118);const l=(0,s.e)("useRegistrars",(function(e){const{api:t}=(0,r.h)(),{allAccounts:n,hasAccounts:s}=(0,i.x)(),l=(0,o.W7)(!e&&t.query.identity?.registrars);return(0,a.useMemo)((()=>{const e=(l||[]).map(((e,t)=>({address:e.isSome?e.unwrap().account.toString():null,index:t}))).filter((e=>!!e.address));return{isRegistrar:s&&e.some((({address:e})=>n.includes(e))),registrars:e}}),[n,s,l])}))},69250:(e,t,n)=>{n.d(t,{o:()=>o});var a=n(2784),s=n(23729),i=n.n(s),r=n(47538);function o(e,t){const[n,s]=(0,a.useState)((()=>function(e,t){const n=i().get(`flags:${e}`,{});return Object.keys(t).reduce(((e,t)=>((0,r.j)(n[t])&&(e[t]=n[t]),e)),{...t})}(e,t))),[o]=(0,a.useState)((()=>function(e,t){return Object.keys(e).reduce(((e,n)=>(e[n]=(e=>n=>t((t=>({...t,[e]:n}))))(n),e)),{})}(t,s)));return(0,a.useEffect)((()=>{i().set(`flags:${e}`,n)}),[n,e]),[n,o]}},78627:(e,t,n)=>{n.d(t,{_:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useStakingInfo",(function(e){const{api:t}=(0,s.h)();return(0,i.W7)(t.derive.staking?.account,[e])}))},98551:(e,t,n)=>{n.d(t,{t:()=>s});var a=n(2784);const s=(0,n(11677).e)("useStepper",(function(){const[e,t]=(0,a.useState)(1),n=(0,a.useCallback)((()=>t((e=>e+1))),[]),s=(0,a.useCallback)((()=>t((e=>e-1))),[]);return(0,a.useMemo)((()=>[e,n,s,t]),[e,n,s,t])}))},19008:(e,t,n)=>{n.d(t,{x:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useSubidentities",(function(e){const{api:t}=(0,s.h)();return(0,i.W7)(t.query.identity?.subsOf,[e])?.[1]}))},74421:(e,t,n)=>{n.d(t,{p:()=>c});var a=n(2784),s=n(11677),i=n(34814),r=n(90778),o=n(9118);const l={transform:e=>e.toString()},c=(0,s.e)("useSudo",(function(){const{api:e}=(0,r.h)(),{allAccounts:t,hasAccounts:n}=(0,i.x)(),s=(0,o.W7)(n&&e.query.sudo?.key,void 0,l),[c,d]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{d(!!s&&!!t&&t.some((e=>e===s)))}),[t,s]),{allAccounts:t,hasSudoKey:c,sudoKey:s}}))},29455:(e,t,n)=>{n.d(t,{J:()=>r});var a=n(2784),s=n(11677),i=n(90778);const r=(0,s.e)("useSystemApi",(function(){const{api:e,apiRelay:t}=(0,i.h)();return(0,a.useMemo)((()=>t||e),[t,e])}))},41411:(e,t,n)=>{n.d(t,{M:()=>m});var a=n(2784),s=n(47564),i=n(65968),r=n(11677),o=n(90778),l=n(9118);const c={allowTeleport:!1,destinations:[],oneWay:[]},d=(0,s.Rf)(((e,t)=>t||e)).filter((e=>!!e.teleport));function u(e,t){return d.filter((n=>(n.genesisHashRelay===e||n.genesisHash===e)&&t(n))).reduce(((e,t)=>(e.some((({genesisHash:e,paraId:n})=>n===t.paraId||e&&e===t.genesisHash))||e.push(t),e)),[]).sort(((e,t)=>e.isRelay===t.isRelay?0:e.isRelay?-1:1))}const m=(0,r.e)("useTeleport",(function(){const{api:e,apiUrl:t,isApiReady:n}=(0,o.h)(),s=(0,l.W7)(n&&e.query.parachainInfo?.parachainId),[r,m]=(0,a.useState)((()=>({...c})));return(0,a.useEffect)((()=>{if(n){const t=e.genesisHash.toHex(),n=d.find((({genesisHash:e})=>e===t));if(n){const e=u(t,(({paraId:e})=>(0,i.h)(e)&&n.teleport.includes(e))),a=u(t,(({paraId:e,teleport:t})=>(0,i.h)(e)&&!t.includes(-1))).map((({paraId:e})=>e||-1));m({allowTeleport:0!==e.length,destinations:e,isRelayTeleport:!0,oneWay:a})}}}),[e,n]),(0,a.useEffect)((()=>{if(s){const e=d.find((({value:e})=>e===t));if(e&&e.genesisHashRelay){const t=u(e.genesisHashRelay,(({paraId:t})=>e.teleport.includes((0,i.h)(t)?t:-1))),n=u(e.genesisHashRelay,(({paraId:e,teleport:t})=>!t.includes((0,i.h)(e)?e:-1))).map((({paraId:e})=>e||-1));m({allowTeleport:0!==t.length,destinations:t,isParaTeleport:!0,oneWay:n})}}}),[t,s]),r}))},3663:(e,t,n)=>{n.d(t,{F:()=>i});var a=n(2784),s=n(82740);const i=(0,n(11677).e)("useTheme",(function(){const{theme:e}=(0,a.useContext)(s.Ni);return(0,a.useMemo)((()=>({theme:e,themeClassName:`theme--${e}`})),[e])}))},38894:(e,t,n)=>{n.d(t,{O:()=>r});var a=n(2784),s=n(11677),i=n(74065);const r=(0,s.e)("useToggle",(function(e=!1,t){const n=(0,i.X)(),[s,r]=(0,a.useState)(e),o=(0,a.useCallback)((()=>{n.current&&r((e=>!e))}),[n]),l=(0,a.useCallback)((e=>{n.current&&r(e)}),[n]);return(0,a.useEffect)((()=>t&&t(s)),[s,t]),(0,a.useMemo)((()=>[s,o,l]),[s,o,l])}))},68920:(e,t,n)=>{n.d(t,{_:()=>m});var a=n(2784),s=n(95292),i=n(51330),r=n(48801),o=n.n(r),l=n(11677),c=n(90778),d=n(9118);const u=new Uint8Array(32),m=(0,l.e)("useTreasury",(function(){const{api:e}=(0,c.h)(),[t,n]=(0,a.useState)((()=>({pendingBounties:s.nw,pendingProposals:s.nw,spendPeriod:e.consts.treasury?e.consts.treasury.spendPeriod:s.nw,treasuryAccount:(0,i.e)("modl",e.consts.treasury&&e.consts.treasury.palletId?e.consts.treasury.palletId.toU8a(!0):"py/trsry",u).subarray(0,32)}))),r=(0,d.W7)(e.derive.bounties?.bounties),l=(0,d.W7)(e.derive.treasury.proposals),m=(0,d.W7)(e.derive.balances?.account,[t.treasuryAccount]);return(0,a.useEffect)((()=>{m&&e.consts.treasury&&n((({pendingBounties:t,pendingProposals:n,spendPeriod:a,treasuryAccount:i})=>({burn:m.freeBalance.gt(s.nw)&&!e.consts.treasury.burn.isZero()?e.consts.treasury.burn.mul(m.freeBalance).div(s.uy):s.nw,pendingBounties:t,pendingProposals:n,spendPeriod:a,treasuryAccount:i,value:m.freeBalance.gt(s.nw)?m.freeBalance:void 0})))}),[e,m]),(0,a.useEffect)((()=>{l&&n((e=>({...e,pendingProposals:l.approvals.reduce(((e,{proposal:{value:t}})=>e.iadd(t)),new(o())(0)),totalProposals:l.proposalCount.toNumber()})))}),[l]),(0,a.useEffect)((()=>{r&&n((e=>({...e,pendingBounties:r.reduce(((e,{bounty:{status:t,value:n}})=>e.iadd(t.isApproved?n:s.nw)),new(o())(0))})))}),[r]),t}))},79760:(e,t,n)=>{n.d(t,{b:()=>f});var a=n(2784),s=n(12372),i=n(57826),r=n(95292),o=n(52107),l=n(33661),c=n(17965),d=n(11677),u=n(34814),m=n(90778),h=n(56949);function p(e){return{proofSize:e.proofSize?(0,s.G)((0,i.f)(e.proofSize)?e.proofSize.unwrap():e.proofSize):r.nw,refTime:(0,s.G)((0,i.f)(e.refTime)?e.refTime.unwrap():e.refTime)}}function g(e,t){const n=p(e),a=p(t);return{proofSize:(0,o.x)(r.nw,n.proofSize.sub(a.proofSize)),refTime:(0,o.x)(r.nw,n.refTime.sub(a.refTime))}}const f=(0,d.e)("useTxBatch",(function(e,t){const{api:n}=(0,m.h)(),{allAccounts:s}=(0,u.x)(),[i,d]=(0,a.useState)((()=>Math.floor(t?.max||4))),f=(0,a.useMemo)((()=>function(e){return{baseExtrinsic:e.consts.system.blockWeights?p((0,h.ZQ)(e.consts.system.blockWeights.perClass.normal.baseExtrinsic).v2Weight):null,maxBlock:p((0,h.ZQ)(e.consts.system.blockWeights?e.consts.system.blockWeights.maxBlock:e.consts.system.maximumBlockWeight).v2Weight),maxExtrinsic:e.consts.system.blockWeights&&e.consts.system.blockWeights.perClass.normal.maxExtrinsic.isSome?p((0,h.ZQ)(e.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrap()).v2Weight):null}}(n)),[n]);return(0,a.useEffect)((()=>{e&&e.length&&s[0]&&e[0].hasPaymentInfo&&(0,c.Y)((async()=>{try{const t=await e[0].paymentInfo(s[0]),n=(0,h.ZQ)(t.weight);d((e=>n.v1Weight.isZero()?e:function({v1Weight:e,v2Weight:t},{baseExtrinsic:n,maxBlock:a,maxExtrinsic:s}){let i=0;return n&&s&&(i=Math.floor(.85*function(e,t){const n=p(e),a=p(t),s={proofSize:a.proofSize.isZero()?r.nw:(0,o.x)(r.nw,n.proofSize.mul(r.S8).div(a.proofSize)),refTime:a.refTime.isZero()?r.nw:(0,o.x)(r.nw,n.refTime.mul(r.S8).div(a.refTime))};return(s.proofSize.isZero()?s.refTime.toNumber():(0,o.N)(s.proofSize,s.refTime).toNumber())/100}(g(s,n),g(t,n)))),i||Math.floor(a.refTime.muln(64).div(e).toNumber()/100)}(n,f)))}catch(e){console.error(e)}}))}),[s,n,f,t,e]),(0,a.useMemo)((()=>e&&e.length?function(e,t,n,a="default"){return 1!==n&&(0,l.m)(e.tx.utility?.batch)?t.reduce(((e,t)=>{const a=e[e.length-1];return a.length>=n?e.push([t]):a.push(t),e}),[[]]).map((t=>1===t.length?t[0]:"all"===a&&(0,l.m)(e.tx.utility.batchAll)?e.tx.utility.batchAll(t):e.tx.utility.batch(t))):t}(n,e,i,t?.type):null),[n,i,t,e])}))},87660:(e,t,n)=>{n.d(t,{I:()=>c});var a=n(2784),s=n(33661),i=n(11677),r=n(90778),o=n(54383);const l={hasFailed:!1,hasPassed:!1,isCloseable:!1,isVoteable:!1,remainingBlocks:null},c=(0,i.e)("useVotingStatus",(function(e,t,n){const{api:i}=(0,r.h)(),c=(0,o.C)();return(0,a.useMemo)((()=>c&&e?function(e,t,n,a,i){const[r]=e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),i)||[i],o=(0,s.m)(e.tx[r]?.close)?r:null;if(!n.end||!o)return{hasFailed:!1,hasPassed:!1,isCloseable:!1,isVoteable:!0,remainingBlocks:null};const l=t.gte(n.end),c=n.threshold.lten(n.ayes.length),d=n.threshold.gtn(Math.abs(a-n.nays.length));return{hasFailed:d,hasPassed:c,isCloseable:4===e.tx[o].close.meta.args.length?l||c||d:l,isVoteable:!l,remainingBlocks:l?null:n.end.sub(t)}}(i,c,e,t,n):l),[i,c,t,n,e])}))},56949:(e,t,n)=>{n.d(t,{TS:()=>u,ZQ:()=>h,h7:()=>p});var a=n(2784),s=n(95292),i=n(33403),r=n(33661),o=n(17965),l=n(11677),c=n(90778),d=n(74065);const u="0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",m={encodedCallLength:0,v1Weight:s.nw,v2Weight:{refTime:s.nw},weight:s.nw};function h(e){if(e.proofSize)return{v1Weight:e.refTime.toBn(),v2Weight:e};if(e.refTime){const t=e.refTime.toBn();return{v1Weight:t,v2Weight:{refTime:t}}}const t=e.toBn();return{v1Weight:t,v2Weight:{refTime:t}}}const p=(0,l.e)("useWeight",(function(e){const{api:t}=(0,c.h)(),n=(0,d.X)(),[s,l]=(0,a.useState)((()=>(0,i.Z)({isWeightV2:!(0,r.m)(t.registry.createType("Weight").toBn)},m)));return(0,a.useEffect)((()=>{e&&t.call.transactionPaymentApi?(0,o.Y)((async()=>{try{const{v1Weight:a,v2Weight:s}=h((await t.tx(e).paymentInfo(u)).weight);n.current&&l((t=>(0,i.Z)({},t,{encodedCallLength:e.encodedLength,v1Weight:a,v2Weight:s,weight:t.isWeightV2?s:a})))}catch(e){console.error(e)}})):l((e=>(0,i.Z)({},e,m)))}),[t,e,n]),s}))},37245:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(52322),s=n(2784);const i=n(68087).zo.div`
  &.withBorder {
    padding-left: 2rem;

    .ui--Params-Content {
      border-left: 1px dashed var(--border-input);

      .ui--Params.withBorder {
        padding-left: 0;
      }
    }
  }

  &.withExpander {
    padding-left: 0.25rem;
  }

  &.withPadding {
    padding-left: 4rem;
  }

  .ui--Param-composite .ui--row,
  .ui--Param-composite .ui--row .ui--InputAddressSimple {
    & > .ui--Labelled > label {
      text-transform: none !important;
    }
  }

  .ui--row {
    flex-wrap: wrap;
  }

  .ui--Param-Address {
  }

  .ui--Params-Content {
    box-sizing: border-box;
    padding: 0;

    .ui--Params-Content {
      margin-left: 2rem;
    }
  }

  .ui--Param-text {
    display: inline-block;
    font-size: var(--font-size-base);
    line-height: 1.714rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ui--Param-text .icon {
    margin-right: 0.5rem !important;
  }

  .ui--Param-text * {
    vertical-align: middle;
  }

  .ui--Param-text.nowrap {
    white-space: nowrap;
  }

  .ui--Param-text.name {
    color: rgba(0, 0, 0, .6);
    font-style: italic;
  }

  .ui--Param-text + .ui--Param-text {
    margin-left: 0.5rem;
  }

  .ui--Param-Vector-buttons {
    text-align: right;
  }

  .ui--Param-composite {
    position: relative;

    .ui--Param-overlay {
      position: absolute;
      top: 0.5rem;
      right: 3.5rem;
    }
  }
`,r=s.memo((function({children:e,className:t="",withBorder:n,withExpander:s,withPadding:r}){return(0,a.jsx)(i,{className:`${t} ui--Params ${n?"withBorder":""} ${r?"withPadding":""} ${s?"withExpander":""}`,children:e})}))},40943:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(52322),s=n(2784),i=n(44294),r=n(48801),o=n.n(r),l=n(50005);const c=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:r,label:c,onChange:d,onEnter:u,onEscape:m,withLabel:h}){const[p,g]=(0,s.useState)(!1),[f]=(0,s.useState)((()=>new(o())((t||"0").toString()).toString(10))),b=(0,s.useCallback)((e=>{const t=!r&&!!e;d&&d({isValid:t,value:e}),g(t)}),[r,d]);return(0,a.jsx)(l.Z,{className:e,children:(0,a.jsx)(i.Z,{className:"full",defaultValue:f,isDisabled:n,isError:r||!p,label:c,onChange:b,onEnter:u,onEscape:m,withEllipsis:!0,withLabel:h})})}))},50005:(e,t,n)=>{n.d(t,{Z:()=>s});var a=n(52322);const s=n(2784).memo((function({children:e,className:t=""}){return(0,a.jsx)("div",{className:`${t} ui--row --relative`,children:e})}))},87418:(e,t,n)=>{n.d(t,{Z:()=>at});var a=n(52322),s=n(2784),i=n(57139),r=n(68087),o=n(11147),l=n(37245),c=n(6046),d=n(45469),u=n(1346),m=n(23601),h=n(6485),p=n(69187),g=n(50005),f=n(27113),b=n(82671);function x(e,t){const n=e.createType(t.type).toRawType();return(0,c.s)(n).sub}const v=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:i,isError:o,label:l,onChange:c,overrides:d,registry:u,type:m,withLabel:h}=e,[{options:p,subTypes:v}]=(0,s.useState)((()=>function(e,t){const n=x(e,t).filter((({name:e})=>!!e&&!e.startsWith("__Unused")));return{options:n.map((({name:e})=>({text:e,value:e}))),subTypes:n}}(u,m))),[A,w]=(0,s.useState)((()=>function(e,t,n,a){const s=x(e,t);return n.value instanceof f.x?[{name:n.value.type,type:s[n.value.index]}]:[{name:a[0].name,type:a[0]}]}(u,m,n,v))),[{initialEnum:y,initialParams:j},k]=(0,s.useState)((()=>function(e,t){return{initialEnum:e&&e.value?e.value instanceof f.x?e.value.type:(0,b.K)(e.value)?Object.keys(e.value)[0]:t[0]&&t[0].value:t[0]&&t[0].value,initialParams:e&&e.value?e.value instanceof f.x?[{isValid:!0,value:e.value.inner}]:(0,b.K)(e.value)?[{isValid:!0,value:e.value[Object.keys(e.value)[0]]}]:void 0:void 0}}(n,p))),N=(0,s.useCallback)((e=>{if(i)return;const t=v.find((({name:t})=>t===e))||null;w(t?[{name:t.name,type:t}]:null),t&&k((e=>t.name===e.initialEnum?e:{initialEnum:e.initialEnum,initialParams:null}))}),[i,v]),C=(0,s.useCallback)((([{isValid:e,value:t}])=>{i||A&&c&&c({isValid:e,value:{[A[0].name]:t}})}),[A,i,c]);return(0,a.jsxs)(g.Z,{className:t,children:[(0,a.jsx)(r.Lt,{className:"full",defaultValue:y,isDisabled:i,isError:o,label:l,onChange:N,options:p,withEllipsis:!0,withLabel:h}),A&&(0,a.jsx)(at,{isDisabled:i,isError:o,onChange:C,overrides:d,params:A,registry:u,values:j})]})}));function A(e){if(e)try{return p.Nn.decodeAddress(e),!0}catch(e){console.error(e)}return!1}const w=s.memo((function(e){const{className:t="",defaultValue:{value:n},isDisabled:i,isError:o,label:l,onChange:c,type:d,withLabel:u}=e,[m]=(0,s.useState)((()=>n?.toString())),h=(0,s.useCallback)((e=>c&&c({isValid:A(e),value:e})),[c]);return"MultiAddress"!==d.type||i&&n&&"Id"===n.type?(0,a.jsx)(g.Z,{className:t,children:(0,a.jsx)(r.rp,{className:"full",defaultValue:m,isDisabled:i,isError:o,isInput:!0,label:l,onChange:h,placeholder:"5...",type:"allPlus",withEllipsis:!0,withLabel:u})}):(0,a.jsx)(v,{...e})}));var y=n(14681),j=n(12372);const k=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:o,onChange:l,onEnter:c,registry:d,type:m,withLabel:h}){const p=(0,s.useMemo)((()=>/^i\d*$/.test(m.type)),[m]),f=(0,s.useMemo)((()=>n?t instanceof d.createClass("AccountIndex")?t.toString():(0,y.u)(t):(0,j.G)(t||0).toString()),[n,d,t]),b=(0,s.useMemo)((()=>function(e,{type:t}){try{return e.createType(t).bitLength()}catch{return 32}}(d,m)),[d,m]),x=(0,s.useCallback)((e=>l&&l({isValid:!(0,u.o)(e),value:e})),[l]);return(0,a.jsx)(g.Z,{className:e,children:n?(0,a.jsx)(r.II,{className:"full",defaultValue:f,isDisabled:!0,label:o,withEllipsis:!0,withLabel:h}):(0,a.jsx)(r.Rn,{bitLength:b,className:"full",defaultValue:f,isError:i,isSigned:p,isZeroable:!0,label:o,onChange:x,onEnter:c,withLabel:h})})}));var N=n(40943),C=n(68774),E=n(5122);function S(e,t){if(e)try{return t?(0,C.u)(e):(0,E.Y)(e)}catch(e){console.error(e)}return!1}const I=s.memo((function(e){const{bytesLength:t,className:n="",defaultValue:{value:i},isDisabled:o,isError:l,label:c,onChange:d}=e,[u]=(0,s.useState)((()=>i?.toString())),m=(0,s.useCallback)((e=>d&&d({isValid:S(e,20===t),value:e})),[t,d]);return(0,a.jsx)(g.Z,{className:n,children:(0,a.jsx)(r.bm,{bytesLength:t,className:"full",defaultValue:u,forceIconType:20===t?"ethereum":"substrate",isDisabled:o,isError:l,label:c,noConvert:!0,onChange:m,placeholder:20===t?"0x1...":"5..."})})})),D=s.memo((function(e){return(0,a.jsx)(I,{...e,bytesLength:20})})),B=s.memo((function(e){return(0,a.jsx)(I,{...e,bytesLength:32})}));var L=n(47538),$=n(61349);function V(){return(0,$.$G)("react-params")}const P=(0,$.Zh)(["react-params"]),Z=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:o,onChange:l,withLabel:c}){const{t:d}=V(),[u]=(0,s.useState)(t instanceof Boolean?t.valueOf():!!(0,L.j)(t)&&t),m=(0,s.useRef)([{text:d("No"),value:!1},{text:d("Yes"),value:!0}]),h=(0,s.useCallback)((e=>l&&l({isValid:!0,value:e})),[l]);return(0,a.jsx)(g.Z,{className:e,children:(0,a.jsx)(r.Lt,{className:"full",defaultValue:u,isDisabled:n,isError:i,label:o,onChange:h,options:m.current,withEllipsis:!0,withLabel:c})})}));var T=n(88311),z=n(48533),M=n(70676),F=n(64021),H=n(46610),R=n(56623),U=n(55858),q=n(74076),O=n(94175);const W=()=>!0,Q=(0,r.zo)(g.Z)`
  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: -16px;
    position: absolute;
    top: 8px;
  }
`,K=s.memo((function({asHex:e,children:t,className:n="",defaultValue:{value:i},isDisabled:o,isError:l,label:c,labelExtra:d,length:u=-1,onChange:m,onEnter:h,onEscape:p,size:g="full",validate:f=W,withCopy:b,withLabel:x,withLength:v}){const{t:A}=V(),[w]=(0,s.useState)((()=>{if(i){const e=(0,H.Y)(i);return(0,M._)(e)?(0,R.z)(e):(0,U.c)(e)}})),[{isAddress:y,isValid:j,lastValue:k},N]=(0,s.useState)((()=>({isAddress:!1,isValid:(0,q.vq)(w)||(0,M._)(w)}))),C=(0,s.useCallback)((t=>{let[n,a,s]=function(e){if("0x"===e)return[!0,!1,new Uint8Array([])];if(e.startsWith("0x"))try{return[!0,!1,(0,z.G)(e)]}catch{return[!1,!1,new Uint8Array([])]}try{return[!0,!0,(0,O.m)(e)]}catch{}return(0,M._)(e)?[!0,!1,(0,F.d)(e)]:["0x"===e,!1,new Uint8Array([])]}(t);n=n&&f(s)&&(-1!==u?s.length===u:0!==s.length||"0x"===t),v&&n&&(s=(0,T.N)(s)),m&&m({isValid:n,value:e?(0,U.c)(s):s}),N({isAddress:a,isValid:n,lastValue:s})}),[e,u,m,f,v]);return(0,a.jsx)(Q,{className:n,children:(0,a.jsxs)(r.II,{className:g,defaultValue:w,isAction:!!t,isDisabled:o,isError:l||!j,label:c,labelExtra:d,onChange:C,onEnter:h,onEscape:p,placeholder:A("0x prefixed hex, e.g. 0x1234 or ascii data"),type:"text",withEllipsis:!0,withLabel:x,children:[t,b&&(0,a.jsx)(r.qi,{value:w}),y&&(0,a.jsx)(r.k,{className:"ui--InputAddressSimpleIcon",size:32,value:k})]})})})),G=s.memo((function({className:e="",isDisabled:t,isError:n=!1,label:s,labelExtra:i,onChange:o,placeholder:l,withLabel:c}){return(0,a.jsx)(g.Z,{className:e,children:(0,a.jsx)(r.ht,{isDisabled:t,isError:n,label:s,labelExtra:i,onChange:o,placeholder:l,withEllipsis:!0,withLabel:c})})})),J=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:o,name:l,onChange:c,onEnter:d,onEscape:u,type:m,withLabel:h}){const{t:p}=V(),[g,f]=(0,s.useState)(!1),[b,x]=(0,s.useState)(!1),v=(0,s.useCallback)((e=>{const t=0!==e.length;c&&c({isValid:t,value:(0,T.N)(e)}),f(t)}),[c]),A=!n&&(0,a.jsx)(r.ZD,{label:p("file upload"),onChange:x,value:b});return(0,a.jsx)("div",{className:`${e} --relative`,children:!n&&b?(0,a.jsx)(G,{isDisabled:n,isError:i||!g,label:o,labelExtra:A,onChange:v,withLabel:h}):(0,a.jsx)(K,{defaultValue:t,isDisabled:n,isError:i,label:o,labelExtra:A,length:-1,name:l,onChange:c,onEnter:d,onEscape:u,type:m,withLabel:h,withLength:!0})})}));var Y=n(83488);const X=(0,r.zo)(g.Z)`
  pre {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ui--Static {
    margin-bottom: 0 !important;
  }
`,_=s.memo((function({asHex:e,children:t,childrenPre:n,className:i="",defaultValue:o,isOptional:l,label:c}){const{t:d}=V(),u=(0,s.useMemo)((()=>o&&o.value&&(e?o.value.toHex():(0,Y.k)(o.value.toHuman?o.value.toHuman():o.value))),[e,o]);return(0,a.jsxs)(X,{className:i,children:[n,(0,a.jsx)(r.qG,{className:"full",label:c,value:(0,a.jsx)("pre",{children:u||(l?(0,a.jsx)(a.Fragment,{children:" "}):d("<empty>"))})}),t]})})),ee=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:s,isError:i,label:r,name:o,onChange:l,onEnter:c,onEscape:d,type:u}=e;return s?(0,a.jsx)(_,{...e}):(0,a.jsx)(K,{asHex:!0,className:t,defaultValue:n,isDisabled:s,isError:i,label:r,length:-1,name:o,onChange:l,onEnter:c,onEscape:d,type:u})})),te=s.memo((function(e){const{t}=V(),{className:n="",defaultValue:{value:s},isDisabled:i,label:o,withLabel:l}=e;if(!i)return(0,a.jsx)(ee,{...e});const c=s,{method:d,section:u}=c.registry.findMetaCall(c.callIndex),m=`${u}.${d}`;return(0,a.jsxs)(g.Z,{children:[(0,a.jsx)(r.qG,{className:`${n} full`,label:o,withLabel:l,children:m}),(0,a.jsx)(r.Ig,{callName:m,labelHash:t("call hash / {{section}}.{{method}}",{replace:{method:d,section:u}}),value:c,withHash:!0})]})}));var ne=n(24107),ae=n(67292),se=n(45409);const ie=s.memo((function({children:e,className:t="",isOuter:n,label:s,labelExtra:i,size:o="full",withLabel:l}){return(0,a.jsxs)(g.Z,{className:t,children:[(0,a.jsx)(r.jN,{className:o,isOuter:!0,label:s,labelExtra:i,withEllipsis:!0,withLabel:l,children:!n&&e}),n&&e]})}));const re=(0,n(11677).e)("useParamDefs",(function(e,t){return(0,s.useMemo)((()=>function(e,t){const n=function(e,t){try{return(0,c.s)(e.createType(t.type).toRawType())}catch{return t}}(e,t);return n.sub?(Array.isArray(n.sub)?n.sub:[n.sub]).map((e=>({length:n.length,name:e.name,type:e}))):[]}(e,t)),[e,t])})),oe=s.memo((function(e){const t=re(e.registry,e.type),{className:n="",defaultValue:i,isDisabled:r,label:o,onChange:l,overrides:c,withLabel:d}=e,[u]=(0,s.useState)((()=>function({isValid:e,value:t}){return e&&(0,ne.c)(t)&&t instanceof se.A?t.toArray().map((e=>({isValid:!0,value:e}))):void 0}(i))),m=(0,s.useCallback)((e=>{r||l&&l({isValid:e.reduce(((e,{isValid:t})=>e&&t),!0),value:t.reduce(((t,{name:n},a)=>(t[n]=e[a].value,t)),{})})}),[r,t,l]);return(0,a.jsxs)("div",{className:"ui--Params-Struct",children:[(0,a.jsx)(ie,{className:n,label:o,withLabel:d}),(0,a.jsx)(at,{isDisabled:r,onChange:m,overrides:c,params:t,registry:e.registry,values:u})]})})),le=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:i,isError:o,label:l,onChange:c,withLabel:d}=e,[u,m]=(0,s.useState)(!1),[h]=(0,s.useState)((()=>i&&n&&(0,ne.c)(n.value)?(0,ae.c)(n.value):null)),[p]=(0,s.useState)((()=>i||!n||(0,ne.c)(n.value))),f=(0,s.useCallback)((e=>{const t=(0,ae.h)(e),n=!!t;c&&c({isValid:n,value:t}),m(n)}),[c]);return h?(0,a.jsx)(_,{...e,children:(0,a.jsx)(r.II,{className:"full",isDisabled:!0,label:"ipfs",type:"text",value:h,withLabel:d})}):p?(0,a.jsx)(oe,{...e}):(0,a.jsx)(g.Z,{className:t,children:(0,a.jsx)(r.II,{className:"full",isDisabled:i,isError:o||!u,label:l,onChange:f,placeholder:"IPFS compatible CID",type:"text",withLabel:d})})}));var ce=n(6226);const de=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,registry:d,type:u,withLabel:m}){const[h,p]=(0,s.useState)(!1),g=(0,s.useCallback)((e=>{const t=(0,ce.F)(e);o&&o({isValid:t,value:e}),p(t)}),[o]);return n?(0,a.jsx)(J,{className:e,defaultValue:t,isError:i||!h,label:r,onEnter:l,onEscape:c,registry:d,type:u,withLabel:m}):(0,a.jsx)(G,{className:e,defaultValue:t,isError:i||!h,label:r,onChange:g,withLabel:m})})),ue=s.memo((function(e){const{t}=V(),[{details:n,type:i},o]=(0,s.useState)({});return(0,s.useEffect)((()=>{const{value:t}=e.defaultValue||{};if(function(e){return!(!e||!e.isModule&&!e.isToken)}(t))if(t.isModule)try{const e=t.asModule,{docs:n,name:a,section:s}=e.registry.findMetaError(e);return o({details:n.join(", "),type:`${s}.${a}`})}catch(e){console.error(e)}else if(t.isToken)return o({details:t.asToken.type,type:t.type});o({details:null})}),[e.defaultValue]),e.isDisabled&&n?(0,a.jsxs)(_,{...e,children:[(0,a.jsx)(r.II,{className:"full",isDisabled:!0,label:t("type"),value:i}),n&&(0,a.jsx)(r.II,{className:"full",isDisabled:!0,label:t("details"),value:n})]}):(0,a.jsx)(ee,{...e})})),me=s.memo((function(e){const{defaultValue:t,isDisabled:n,label:i}=e,o=(0,s.useMemo)((()=>{return t&&(e=t.value)&&e.isErr?{isValid:!0,value:t.value.asErr}:null;var e}),[t]);return n?o?(0,a.jsx)(ue,{...e,childrenPre:(0,a.jsx)(r.II,{className:"full",isDisabled:!0,label:i,value:"Err"}),defaultValue:o,label:"DispatchError"}):(0,a.jsx)(_,{...e,defaultValue:{isValid:!0,value:"Ok"}}):(0,a.jsx)(ee,{...e})})),he=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:s,label:i,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withLabel:u}){return(0,a.jsx)(K,{asHex:!0,className:e,defaultValue:t,isDisabled:n,isError:s,label:i,length:20,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withCopy:n,withLabel:u})})),pe=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:o,name:l,onChange:c,onEnter:d,onEscape:u,registry:m,type:h,withLabel:p}){const{t:g}=V(),[f,b]=(0,s.useState)(!1),[x,v]=(0,s.useState)(null),A=(0,s.useCallback)((e=>{const t=m.hash(e);v((0,U.c)(t)),c&&c({isValid:!0,value:t})}),[c,m]),w=(0,s.useCallback)((e=>{v(null),b(e)}),[b,v]),y=!n&&(0,a.jsx)(r.ZD,{label:g("hash a file"),onChange:w,value:f});return(0,a.jsx)("div",{className:e,children:!n&&f?(0,a.jsx)(G,{isDisabled:n,isError:i,label:o,labelExtra:y,onChange:A,placeholder:x||void 0,withLabel:p}):(0,a.jsx)(K,{asHex:!0,defaultValue:t,isDisabled:n,isError:i,label:o,labelExtra:y,length:32,name:l,onChange:c,onEnter:d,onEscape:u,type:h,withCopy:n,withLabel:p})})})),ge=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:s,label:i,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withLabel:u}){return(0,a.jsx)(K,{asHex:!0,className:e,defaultValue:t,isDisabled:n,isError:s,label:i,length:64,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withCopy:n,withLabel:u})}));var fe=n(51330);function be(e,t=!1){let n,a=!1;try{n=(0,z.G)(e.toString()),a=t||0!==n.length}catch{n=new Uint8Array([])}return{isValid:a,u8a:(0,T.N)(n)}}const xe=s.memo((function({className:e="",isDisabled:t,label:n,onChange:i,onEnter:o,withLabel:l}){const[,c]=(0,s.useState)(!1),[d,u]=(0,s.useState)((()=>({isValid:!1,u8a:new Uint8Array([])}))),[m,h]=(0,s.useState)((()=>({isValid:!1,u8a:new Uint8Array([])})));(0,s.useEffect)((()=>{const e=d.isValid&&m.isValid;i&&i({isValid:e,value:(0,fe.e)(d.u8a,m.u8a)}),c(e)}),[d,i,m]);const p=(0,s.useCallback)((e=>u(be(e))),[]),f=(0,s.useCallback)((e=>h(be(e,!0))),[]);return(0,a.jsxs)(g.Z,{className:e,children:[(0,a.jsx)(r.II,{className:"medium",isDisabled:t,isError:!d.isValid,label:n,onChange:p,placeholder:"0x...",type:"text",withLabel:l}),(0,a.jsx)(r.II,{className:"medium",isDisabled:t,isError:!m.isValid,onChange:f,onEnter:o,placeholder:"0x...",type:"text",withLabel:l})]})}));var ve=n(48731);const Ae={info:0,type:"Bytes"},we=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,registry:d,withLabel:u}){const{t:m}=V(),[h,p]=(0,s.useState)(m("click to select or drag and drop JSON key/value (hex-encoded) file")),g=(0,s.useCallback)((e=>{let t={isValid:!1,value:[]};try{t=function(e){const t=JSON.parse((0,R.z)(e)),n=Object.keys(t);let a=0!==n.length;const s=n.map((e=>{const n=t[e];(0,ve.hu)((0,q.vq)(e)&&(0,q.vq)(n),`Non-hex key/value pair found in ${e.toString()} => ${n.toString()}`);const s=be(e),i=be(n,!0);return a=a&&s.isValid&&i.isValid,[s.u8a,i.u8a]}));return{isValid:a,value:s}}(e),p(m("{{count}} key/value pairs encoded for submission",{replace:{count:t.value.length}}))}catch(e){console.error("Error converting json k/v",e),p(m("click to select or drag and drop JSON key/value (hex-encoded) file"))}o&&o(t)}),[o,m]);if(n){const n=t.value;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ie,{className:e,label:r,children:(0,a.jsx)("div",{})}),(0,a.jsx)("div",{className:"ui--Params",children:n.map((([e,t])=>{const n=(0,U.c)(e.toU8a(!0));return(0,a.jsx)(J,{defaultValue:{value:t},isDisabled:!0,label:n,name:n,onEnter:l,onEscape:c,registry:d,type:Ae},n)}))})]})}return(0,a.jsx)(G,{className:e,isDisabled:n,isError:i,label:r,onChange:g,placeholder:h,withLabel:u})})),ye=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:o,onChange:l,onEnter:c,onEscape:d,registry:u,type:m,withLabel:h}){const p=(0,s.useCallback)((e=>l&&l(e)),[l]);return n?(0,a.jsx)(r.qG,{className:e,defaultValue:t&&t.value?t.value.toString():"",isError:i,label:o,withLabel:h}):(0,a.jsx)(k,{className:e,defaultValue:t,isDisabled:n,isError:i,label:o,onChange:p,onEnter:c,onEscape:d,registry:u,type:m,withLabel:h})})),je=s.memo((function({onChange:e}){return(0,s.useEffect)((()=>{e&&e({isValid:!0,value:null})}),[e]),null})),ke=s.memo((function(e){if(!e.isDisabled)return(0,a.jsx)(ee,{...e});const t=e.registry.createType("Call",e.defaultValue.value.toHex());return(0,a.jsx)(te,{...e,defaultValue:{isValid:!0,value:t}})}));var Ne=n(37602),Ce=n(48358);const Ee={isValid:!0,value:void 0},Se=new Uint8Array([1]),Ie=s.memo((function({className:e="",defaultValue:t,isDisabled:n,label:i,onChange:o,onEnter:c,onEscape:d,registry:u,type:{sub:m,withOptionActive:h},withLabel:p}){const{t:g}=V(),[f,b]=(0,s.useState)((()=>h||!!(t&&t.value instanceof Ne.W&&t.value.isSome)||!1)),[x]=(0,s.useState)((()=>f||n?t&&(t.value instanceof Ne.W&&t.value.isSome?{isValid:t.isValid,value:t.value.unwrap()}:Ee):Ee));(0,s.useEffect)((()=>{!f&&o&&o({isValid:!0,value:null})}),[f,o]);const v=(0,s.useCallback)((e=>o&&o(e.isValid&&(0,Ce.U)(e.value)&&!h&&f?{isValid:!0,value:(0,fe.e)(Se,e.value)}:e)),[f,o,h]);return(0,a.jsxs)("div",{className:`${e} --relative`,children:[(0,a.jsx)(ie,{className:"--relative",label:i,labelExtra:!n&&(0,a.jsx)(r.ZD,{label:g("include option"),onChange:b,value:f}),withLabel:p}),(0,a.jsx)(l.Z,{children:(0,a.jsx)("div",{className:"ui--Params-Content",children:f?(0,a.jsx)(et,{defaultValue:x,isDisabled:n||!f,isOptional:!f&&!n,onChange:v,onEnter:c,onEscape:d,registry:u,type:m}):(0,a.jsx)(_,{defaultValue:Ee,isOptional:!0,label:"None"})})})]})})),De=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:o,onChange:l,onEnter:c,onEscape:d,withLabel:u}){const[m,h]=(0,s.useState)(!1),p=(0,s.useCallback)((e=>{const t=0!==e.length;l&&l({isValid:t,value:e}),h(t)}),[l]),f=t?t.toHex?t.toHex():t:"";return(0,a.jsx)(g.Z,{className:e,children:(0,a.jsx)(r.II,{className:"full",defaultValue:f,isDisabled:n,isError:i||!m,label:o,onChange:p,onEnter:c,onEscape:d,placeholder:"Hex data",type:"text",withLabel:u})})})),Be=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:o,onChange:l,onEnter:c,onEscape:d,withLabel:u}){const[m,h]=(0,s.useState)(!1),p=(0,s.useCallback)((e=>{const t=0!==e.length;l&&l({isValid:t,value:e}),h(t)}),[l]),f=(t||"").toString();return(0,a.jsx)(g.Z,{className:e,children:(0,a.jsx)(r.II,{className:"full",defaultValue:f,isDisabled:n,isError:i||!m,label:o,onChange:p,onEnter:c,onEscape:d,placeholder:"<any string>",type:"text",withLabel:u})})}));var Le=n(71285);const $e=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:i,label:r,onChange:o,overrides:l,registry:c,type:d,withLabel:u}=e,m=re(c,d),[h]=(0,s.useState)((()=>function({value:e}){return e instanceof Le.p?e.map((e=>({isValid:!0,value:e}))):e}(n))),p=(0,s.useCallback)((e=>{i||o&&o({isValid:e.reduce(((e,{isValid:t})=>e&&t),!0),value:e.map((({value:e})=>e))})}),[i,o]);return(0,a.jsxs)("div",{className:"ui--Params-Tuple",children:[(0,a.jsx)(ie,{className:t,label:r,withLabel:u}),(0,a.jsx)(at,{isDisabled:i,onChange:p,overrides:l,params:m,registry:c,values:h})]})}));var Ve=n(95292);const Pe=[];function Ze(e,t){if(t.info===m.u.Vec)return[Ze(e,t.sub)];if(t.info===m.u.Tuple)return Array.isArray(t.sub)?t.sub.map((t=>Ze(e,t))):[];if(t.info===m.u.Struct)return Array.isArray(t.sub)?t.sub.reduce(((t,n)=>(t[n.name]=Ze(e,n),t)),{}):{};if(t.info===m.u.Enum)return Array.isArray(t.sub)?{[t.sub[0].name]:Ze(e,t.sub[0])}:{};const n=[m.u.Compact,m.u.Option].includes(t.info)?t.sub.type:t.type;switch(n){case"AccountIndex":case"Balance":case"BalanceOf":case"BlockNumber":case"Compact":case"Gas":case"Index":case"Nonce":case"ParaId":case"PropIndex":case"ProposalIndex":case"ReferendumIndex":case"i8":case"i16":case"i32":case"i64":case"i128":case"u8":case"u16":case"u32":case"u64":case"u128":case"VoteIndex":case"Moment":return Ve.nw;case"bool":return!1;case"Bytes":case"AccountId":case"AccountId20":case"AccountId32":case"AccountIdOf":case"Address":case"Call":case"CandidateReceipt":case"Digest":case"Header":case"KeyValue":case"LookupSource":case"MisbehaviorReport":case"Proposal":case"RuntimeCall":case"Signature":case"SessionKey":case"StorageKey":case"ValidatorId":return;case"String":case"Text":case"Raw":case"Keys":return"";case"Vote":return-1;case"VoteThreshold":return 0;case"BlockHash":case"CodeHash":case"Hash":case"H256":return e.createType("H256");case"H512":return e.createType("H512");case"H160":return e.createType("H160");case"Extrinsic":return e.createType("Raw");case"Null":return null;default:{let a=null;try{const t=e.createType(n),a=(0,c.s)(t.toRawType());if((0,h.H)(t))return Ve.nw;if([m.u.Struct].includes(a.info))return;if([m.u.Enum,m.u.Tuple].includes(a.info))return Ze(e,a)}catch(e){a=e.message}return Pe.includes(n)||(Pe.push(n),a&&console.error(`params: initValue: ${a}`),console.info(`params: initValue: No default value for type ${n} from ${JSON.stringify(t)}, using defaults`)),"0x"}}}function Te([{name:e,type:t}],n){return{name:`${n}: ${e||t.type}`,type:t}}function ze(e,t,n){if(t.length===n||(0,u.o)(n))return t;const a=[];for(let t=0;t<n;t++)a.push(Te(e,t));return a}function Me({value:e}){return e instanceof Set&&(e=[...e.values()]),Array.isArray(e)?e.map((e=>(0,u.o)(e)||(0,u.o)(e.isValid)?{isValid:!(0,u.o)(e),value:e}:e)):[]}const Fe=s.memo((function({className:e="",defaultValue:t,isDisabled:n=!1,label:i,onChange:o,overrides:l,registry:c,type:d,withLabel:m}){const{t:h}=V(),p=re(c,d),[g,f]=(0,s.useState)((()=>Me(t))),[b,x]=(0,s.useState)((()=>g.length)),[v,A]=(0,s.useState)((()=>ze(p,[],b)));(0,s.useEffect)((()=>{p.length&&A((e=>ze(p,e,n?(t.value||[]).length:b)))}),[b,t,n,p]),(0,s.useEffect)((()=>{!n&&p.length&&f((e=>{if(e.length===b)return e;for(;e.length<b;){const t=Ze(c,p[0].type);e.push({isValid:!(0,u.o)(t),value:t})}return e.slice(0,b)}))}),[b,t,p,n,c]),(0,s.useEffect)((()=>{o&&o({isValid:g.reduce(((e,{isValid:t})=>e&&t),!0),value:g.map((({value:e})=>e))})}),[g,o]);const w=(0,s.useCallback)((()=>x((e=>e+1))),[]),y=(0,s.useCallback)((()=>x((e=>e-1))),[]);return(0,a.jsxs)(ie,{className:e,isOuter:!0,label:i,withLabel:m,children:[!n&&(0,a.jsxs)("div",{className:"ui--Param-Vector-buttons",children:[(0,a.jsx)(r.zx,{icon:"plus",label:h("Add item"),onClick:w}),(0,a.jsx)(r.zx,{icon:"minus",isDisabled:0===g.length,label:h("Remove item"),onClick:y})]}),(0,a.jsx)(at,{isDisabled:n,onChange:f,overrides:l,params:v,registry:c,values:g})]})}));var He=n(65581);const Re=s.memo((function({className:e="",defaultValue:t,isDisabled:n=!1,label:i,onChange:r,overrides:o,registry:l,type:c,withLabel:d}){const m=re(l,c),[h]=(0,s.useState)((()=>ze(m,[],m[0].length||1))),[p,g]=(0,s.useState)((()=>function(e){return e.value instanceof He.$?e.value.map((e=>({isValid:!0,value:e}))):Me(e)}(t)));return(0,s.useEffect)((()=>{!n&&m.length&&g((e=>{const t=m[0].length||1;if(e.length===t)return e;for(;e.length<t;){const t=Ze(l,m[0].type);e.push({isValid:!(0,u.o)(t),value:t})}return e.slice(0,t)}))}),[m,n,l]),(0,s.useEffect)((()=>{r&&r({isValid:p.reduce(((e,{isValid:t})=>e&&t),!0),value:p.map((({value:e})=>e))})}),[p,r]),(0,a.jsx)(ie,{className:e,isOuter:!0,label:i,withLabel:d,children:(0,a.jsx)(at,{isDisabled:n,onChange:g,overrides:o,params:h,registry:l,values:p})})}));var Ue=n(70447);const qe={aye:!0,conviction:0},Oe=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,onChange:o,withLabel:l}){const{t:c}=V(),[d,u]=(0,s.useState)(qe);(0,s.useEffect)((()=>{o&&o({isValid:!0,value:d})}),[o,d]);const m=(0,s.useCallback)((e=>u((({conviction:t})=>({aye:e,conviction:t})))),[]),p=(0,s.useCallback)((e=>u((({aye:t})=>({aye:t,conviction:e})))),[]),f=(0,s.useRef)([{text:c("Nay"),value:!1},{text:c("Aye"),value:!0}]),b=(0,s.useRef)([{text:c("None"),value:0},{text:c("Locked1x"),value:1},{text:c("Locked2x"),value:2},{text:c("Locked3x"),value:3},{text:c("Locked4x"),value:4},{text:c("Locked5x"),value:5},{text:c("Locked6x"),value:6}]),x=(0,h.H)(t)?0!==t.toNumber():t instanceof Ue.P?t.isAye:0!==t,v=t instanceof Ue.P?t.conviction.index:0;return(0,a.jsxs)(g.Z,{className:e,children:[(0,a.jsx)(r.Lt,{className:"full",defaultValue:x,isDisabled:n,isError:i,label:c("aye: bool"),onChange:m,options:f.current,withLabel:l}),(0,a.jsx)(r.Lt,{className:"full",defaultValue:v,isDisabled:n,isError:i,label:c("conviction: Conviction"),onChange:p,options:b.current,withLabel:l})]})}));var We=n(33661);const Qe=[{text:"Super majority approval",value:0},{text:"Super majority rejection",value:1},{text:"Simple majority",value:2}];Qe.reduce(((e,{text:t,value:n})=>(e[n]=t,e)),{});const Ke=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:o,onChange:l,withLabel:c}){const d=(0,s.useCallback)((e=>l&&l({isValid:!0,value:e})),[l]),u=(0,s.useMemo)((()=>(0,We.m)(t.toNumber)?t.toNumber():(0,j.G)(t).toNumber()),[t]);return(0,a.jsx)(g.Z,{className:e,children:(0,a.jsx)(r.Lt,{className:"full",defaultValue:u,isDisabled:n,isError:i,label:o,onChange:d,options:Qe,withLabel:c})})})),Ge=["AccountId","AccountId20","AccountId32","AccountIndex","Address","Balance","BalanceOf","Vec<KeyValue>"],Je=["DispatchError","SpRuntimeDispatchError"],Ye=[{c:w,t:["AccountId","Address","LookupSource","MultiAddress"]},{c:k,t:["AccountIndex","i8","i16","i32","i64","i128","u8","u16","u32","u64","u128","u256"]},{c:N.Z,t:["Amount","Balance","BalanceOf"]},{c:Z,t:["bool"]},{c:J,t:["Bytes","Vec<u8>"]},{c:te,t:["Call","Proposal","RuntimeCall"]},{c:le,t:["PalletAllianceCid"]},{c:de,t:["Code"]},{c:ue,t:Je},{c:me,t:["DispatchResult","Result<Null, SpRuntimeDispatchError>"]},{c:De,t:["Raw","RuntimeSessionKeys","Keys"]},{c:v,t:["Enum"]},{c:pe,t:["Hash","H256"]},{c:he,t:["H160"]},{c:ge,t:["H512"]},{c:xe,t:["KeyValue"]},{c:we,t:["Vec<KeyValue>"]},{c:ye,t:["Moment","MomentOf"]},{c:je,t:["Null"]},{c:ke,t:["OpaqueCall"]},{c:Ie,t:["Option"]},{c:Be,t:["String","Text"]},{c:oe,t:["Struct"]},{c:$e,t:["Tuple"]},{c:Fe,t:["Vec","BTreeSet"]},{c:Re,t:["VecFixed"]},{c:Oe,t:["Vote"]},{c:Ke,t:["VoteThreshold"]},{c:ee,t:["Unknown"]}].reduce(((e,{c:t,t:n})=>(n.forEach((n=>{e[n]=t})),e)),{}),Xe=[];function _e({displayName:e,info:t,lookupName:n,sub:a,type:s}){if(e&&Ge.includes(e))return e;if(s.endsWith("RuntimeSessionKeys"))return"RuntimeSessionKeys";const i=n||s;switch(t){case m.u.Compact:return a.type;case m.u.Option:return"Option";case m.u.Enum:return"Enum";case m.u.Result:{const[,e]=a;return Je.includes(e.lookupName||e.type)?"DispatchResult":i}case m.u.Struct:return"Struct";case m.u.BTreeSet:return"BTreeSet";case m.u.Tuple:return Ye[s]===w?s:"Tuple";case m.u.Vec:return"Vec<u8>"===s?"Bytes":["Vec<KeyValue>"].includes(s)?"Vec<KeyValue>":"Vec";case m.u.VecFixed:return"u8"===a.type?s:"VecFixed";default:return i}}const et=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,isOptional:r,name:o,onChange:l,onEnter:p,onEscape:g,overrides:f,registry:b,type:x}){const v=(0,s.useMemo)((()=>function(e,t,n={}){if(["AccountId20","AccountId32"].includes(t.type)){const n=`AccountId${e.createType("AccountId").length}`;if(t.type!==n)return"AccountId20"===t.type?D:B}const a=e=>e?n[e]||Ye[e]:null,s=_e(t);let i=a(t.lookupName)||a(t.type)||a(s);if(!i){try{const t=e.createType(s),n=(0,c.s)(t.toRawType());if(i=a(n.lookupName||n.type)||a(_e(n)),i)return i;if((0,h.H)(t))return k}catch(e){console.error(`params: findComponent: ${e.message}`)}Xe.includes(s)||(Xe.push(s),console.info(`params: findComponent: No pre-defined component for type ${s} from ${m.u[t.info]}: ${JSON.stringify(t)}`))}return i||ee}(b,x,f)),[b,x,f]),A=(0,s.useMemo)((()=>{const e=(0,d.RH)(b,b.isLookupType(x.lookupName||x.type)?(0,c.s)(b.createType(x.type).toRawType()):x).replace(/"/g,"").replace(/\\/g,"").replace(/:Null/g,"").replace(/:/g,": ").replace(/,/g,", ").replace(/^{_alias: {.*}, /,"{");return`${(0,u.o)(o)?"":`${o}: `}${e}${x.typeName&&!e.includes(x.typeName)?` (${x.typeName})`:""}`}),[o,b,x]);return v?r?(0,a.jsx)(_,{defaultValue:t,isOptional:!0,label:"None"}):(0,a.jsx)(v,{className:`${e} ui--Param`,defaultValue:t,isDisabled:n,isError:i,label:A,name:o,onChange:l,onEnter:p,onEscape:g,overrides:f,registry:b,type:x},`${o||"unknown"}:${A}`):null})),tt=s.memo((function({defaultValue:e,index:t,isDisabled:n,isError:i,name:r,onChange:o,onEnter:l,onEscape:c,overrides:d,registry:u,type:m}){const h=(0,s.useCallback)((e=>o(t,e)),[t,o]);return(0,a.jsx)("div",{className:"ui--Param-composite",children:(0,a.jsx)(et,{defaultValue:e,isDisabled:n,isError:i,name:r,onChange:h,onEnter:l,onEscape:c,overrides:d,registry:u,type:m},`input:${t}`)})}));class nt extends s.PureComponent{state={params:null};static getDerivedStateFromProps({isDisabled:e,params:t,registry:n=i.api.registry,values:a},s){return e||(0,o.P)(s.params)===(0,o.P)(t)?null:{params:t,values:t.reduce(((e,t,s)=>(e.push(a&&a[s]?a[s]:function(e,t){const n=Ze(e,t.type);return{isValid:!(0,u.o)(n),value:n}}(n,t)),e)),[])}}componentDidMount(){this.componentDidUpdate(null,{})}componentDidUpdate(e,t){const{isDisabled:n}=this.props,{values:a}=this.state;n||(0,o.P)(t.values)===(0,o.P)(a)||this.triggerUpdate()}render(){const{children:e,className:t="",isDisabled:n,isError:s,onEnter:c,onEscape:d,overrides:u,params:m,registry:h=i.api.registry,withBorder:p=!0,withExpander:g}=this.props,{values:f=this.props.values}=this.state;return f&&f.length?(0,a.jsx)(l.Z,{className:t,withBorder:p,withExpander:g,children:(0,a.jsx)(r.SV,{onError:this.onRenderError,children:(0,a.jsxs)("div",{className:"ui--Params-Content",children:[f&&m.map((({name:e,type:t},i)=>(0,a.jsx)(tt,{defaultValue:f[i],index:i,isDisabled:n,isError:s,name:e,onChange:this.onChangeParam,onEnter:c,onEscape:d,overrides:u,registry:h,type:t},`${e||""}:${t.type.toString()}:${i}:${n?(0,o.P)(f[i]):""}`))),e]})})}):null}onChangeParam=(e,t)=>{const{isDisabled:n}=this.props;if(n)return;const{isValid:a=!1,value:s}=t;this.setState((t=>({values:(t.values||[]).map(((t,n)=>n!==e?t:{isValid:a,value:s}))})),this.triggerUpdate)};triggerUpdate=()=>{const{isDisabled:e,onChange:t}=this.props,{values:n}=this.state;!e&&n&&t&&t(n)};onRenderError=()=>{const{onError:e}=this.props;e&&e()}}const at=P(nt)},67292:(e,t,n)=>{n.d(t,{c:()=>r,h:()=>i});var a=n(33410),s=n(55858);function i(e){try{const{code:t,multihash:{code:n,digest:i},version:r}=a.k0.parse(e);return{codec:t,hash:{code:n,digest:(0,s.c)(i)},version:r}}catch(t){return console.error(`fromIpfsCid: ${t.message}::`,e),null}}function r(e){try{const{codec:t,hash_:{code:n,digest:s},version:i}=e,r=s.toU8a(!0),o=a.PP.encodingLength(n.toNumber()),l=a.PP.encodingLength(r.length),c=new Uint8Array(o+l+r.length);return a.PP.encodeTo(n.toNumber(),c,0),a.PP.encodeTo(r.length,c,o),c.set(r,o+l),a.k0.create(i.index,t.toNumber(),a.uR.decode(c)).toString()}catch(t){return console.error(`toIpfsCid: ${t.message}::`,e.toHuman()),null}}},83488:(e,t,n)=>{n.d(t,{Z:()=>p,k:()=>h});var a=n(52322),s=(n(2784),n(49754)),i=n(37602),r=n(33661),o=n(11147),l=n(17751),c=n(1346),d=n(55858);function u({className:e="",key:t},...n){return(0,a.jsx)("div",{className:`${e} ui--Param-text`,children:n},t)}function m(e){return(0,r.m)(e.toHuman)?e.toHuman():Array.isArray(e)?e.map((e=>m(e))):e.toString()}function h(e){return(0,o.P)(e,2).replace(/,\n/g,"\n").replace(/"/g,"").replace(/\\/g,"").replace(/\],\[/g,"],\n[")}function p(e,t){return(0,l.F)(t)||(0,c.o)(t)?u({},"<unknown>"):u({},["Bytes","Raw","Option<Keys>","Keys"].includes(e)&&(0,r.m)(t.toU8a)?(0,d.c)(t.toU8a(!0)):"Vec<(ValidatorId,Keys)>"===e?h((n=t,JSON.stringify(n.map((([e,t])=>[e.toString(),t.toHex()]))))):t instanceof s.N?t.isEmpty?"<empty>":t.toString():t instanceof i.W&&t.isNone?"<none>":h(m(t)));var n}},13940:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n,params:s}){const{api:l}=(0,i.h)(),c=(0,r.W7)(l.derive.balances?.all,[s]);return(0,a.jsx)(o.Z,{className:t,label:n,value:c?.availableBalance,children:e})}))},36609:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n,params:s}){const{api:l}=(0,i.h)(),c=(0,r.W7)(l.derive.balances?.all,[s]);return(0,a.jsx)(o.Z,{className:t,label:n,value:c?.freeBalance,children:e})}))},26839:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(14681);const l=s.memo((function({children:e,className:t="",label:n}){const{api:s}=(0,i.h)(),l=(0,r.W7)(s.derive.chain.bestNumberFinalized);return(0,a.jsxs)("div",{className:`${t} ${l?"":"--tmp"}`,children:[n||"",(0,a.jsx)("span",{className:"--digits",children:(0,o.u)(l||1234)}),e]})}))},95689:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(14681);const l=s.memo((function({children:e,className:t="",isFinalized:n,label:s,withPound:l}){const{api:c,isApiReady:d}=(0,i.h)(),u=(0,r.W7)(d&&(n?c.derive.chain.bestNumberFinalized:c.derive.chain.bestNumber));return(0,a.jsxs)("div",{className:`${t} ${u?"":"--tmp"}`,children:[s||"",l&&"#",(0,a.jsx)("span",{className:"--digits",children:(0,o.u)(u||1234)}),e]})}))},65874:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(21779),r=n(97794);const o=i.z.div`
  &.isInline {
    display: inline-block;
  }

  span+span {
    padding-left: 0.25em;
  }

  span.timeUnits {
    font-size: var(--font-percent-tiny);
  }
`,l=s.memo((function({api:e,children:t,className:n="",isInline:s,label:i,value:l}){const[,c]=(0,r.h)(l,e);return!l||l.isZero()?null:(0,a.jsxs)(o,{className:`${n} ui--BlockToTime ${s?"isInline":""}`,children:[i||"",c.split(" ").map(((e,t)=>(0,a.jsx)("span",{className:t%2?"timeUnits":void 0,children:e},t))),t]})}))},12176:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(52322),s=n(2784),i=n(90778),r=n(68256);const o=s.memo((function({children:e,className:t="",label:n}){const{t:s}=(0,r.$)(),{systemChain:o}=(0,i.h)();return(0,a.jsxs)("div",{className:t,children:[n||"",o||s("Unknown"),e]})}))},53598:(e,t,n)=>{n.d(t,{Z:()=>h});var a=n(52322),s=n(2784),i=n(21779),r=n(12372);const o=new Map;let l=Date.now(),c=0;function d(e,t="s",n=!1){const[s,i]=e.toFixed(1).split(".");return n?(0,a.jsxs)(a.Fragment,{children:[s,".",i," ",(0,a.jsx)("span",{className:"timeUnit",children:t})]}):(0,a.jsxs)(a.Fragment,{children:[s," ",(0,a.jsx)("span",{className:"timeUnit",children:t})]})}function u(e=0,t=0){const n=(t&&t.getTime?t.getTime():(0,r.G)(t).toNumber())||0;if(!e||!n)return d(0,"s",!0);const a=Math.max(Math.abs(e-n),0)/1e3;return a<60?d(a,"s",a<15):a<3600?d(a/60,"min"):d(a/3600,"hr")}!function e(){l=Date.now();for(const e of o.values())e(l);setTimeout(e,100)}();const m=i.z.div`
  .timeUnit {
    font-size: var(--font-percent-tiny);
  }
`,h=s.memo((function({children:e,className:t="",value:n}){const[i,r]=(0,s.useState)(l);return(0,s.useEffect)((()=>{const e=c++;return o.set(e,r),()=>{o.delete(e)}}),[]),(0,a.jsxs)(m,{className:`${t} ui--Elapsed --digits`,children:[u(i,n),e]})}))},58607:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(52322),s=n(2784),i=n(21779),r=n(90778),o=n(92730),l=n(54371),c=n(68256);function d(e,t,n,s="",i=!1){return(0,a.jsxs)(a.Fragment,{children:[`${e}${i?"":"."}`,!i&&(0,a.jsx)("span",{className:"ui--FormatBalance-postfix",children:`0000${t||""}`.slice(-4)}),(0,a.jsxs)("span",{className:"ui--FormatBalance-unit",children:[" ",n]}),s]})}function u(e,t,n){const[a,s]=e.split("."),[i,r]=s.split(" ");return d(a,i,r,t,n)}function m(e,[t,n],s=!0,i,r,l){const[c,u]=(0,o.a)(e,{decimals:t,forceUnit:"-",withSi:!1}).split("."),m=r||i&&c.length>=4,h=s?n:"";if(c.length>7){const[n,s]=(0,o.a)(e,{decimals:t,withUnit:!1}).split("."),i=s.substring(0,4),r=s.substring(4);return(0,a.jsxs)(a.Fragment,{children:[n,".",(0,a.jsx)("span",{className:"ui--FormatBalance-postfix",children:i}),(0,a.jsxs)("span",{className:"ui--FormatBalance-unit",children:[r,r?h:` ${h}`]}),l||""]})}return d(c,u,h,l,m)}const h=i.z.span`
  vertical-align: baseline;
  white-space: nowrap;

  * {
    vertical-align: baseline !important;
  }

  > label,
  > .label {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: baseline;
  }

  .ui--FormatBalance-unit {
    font-size: var(--font-percent-tiny);
    text-transform: uppercase;
  }

  .ui--FormatBalance-value {
    text-align: right;

    > .ui--FormatBalance-postfix {
      font-weight: lighter;
      vertical-align: baseline;
    }
  }

  > .ui--Button {
    margin-left: 0.25rem;
  }

  .ui--Icon {
    margin-bottom: -0.25rem;
    margin-top: 0.25rem;
  }

  .ui--Icon+.ui--FormatBalance-value {
    margin-left: 0.375rem;
  }
`,p=s.memo((function({children:e,className:t="",format:n,formatIndex:i,isShort:o,label:d,labelPost:p,value:g,valueFormatted:f,withCurrency:b,withSi:x}){const{t:v}=(0,c.$)(),{api:A}=(0,r.h)(),w=(0,s.useMemo)((()=>n||function(e,t=0){const n=e.chainDecimals,a=e.chainTokens;return[t<n.length?n[t]:n[0],t<a.length?a[t]:a[1]]}(A.registry,i)),[A,n,i]);return(0,a.jsxs)(h,{className:`${t} ui--FormatBalance`,children:[d?(0,a.jsxs)(a.Fragment,{children:[d," "]}):"",(0,a.jsx)("span",{className:"ui--FormatBalance-value --digits","data-testid":"balance-summary",children:f?u(f,p,o):g?"all"===g?(0,a.jsxs)(a.Fragment,{children:[v("everything"),p||""]}):m(g,w,b,x,o,p):(0,l.H)(p)?`-${p.toString()}`:p}),e]})}))},39082:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(52322),s=n(2784),i=n(90778);const r=s.memo((function({children:e,className:t="",label:n}){const{systemName:s}=(0,i.h)();return(0,a.jsxs)("div",{className:t,children:[n||"",s,e]})}))},52727:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(52322),s=n(2784),i=n(90778);const r=s.memo((function({children:e,className:t="",label:n}){const{systemVersion:s}=(0,i.h)(),r=s.split("-")[0];return(0,a.jsxs)("div",{className:t,children:[n||"",r,e]})}))},99924:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(95292),l=n(65874);const c=s.memo((function({children:e,className:t,isInline:n,label:c,value:d}){const{api:u}=(0,i.h)(),m=(0,r.W7)(u.derive.session.progress),h=(0,s.useMemo)((()=>m&&d&&m.currentIndex.lt(d)?d.sub(m.currentIndex).imul(m.sessionLength).isub(m.sessionProgress):o.nw),[m,d]);return(0,a.jsx)(l.Z,{className:t,isInline:n,label:c,value:h,children:e})}))},67634:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(53598);const l=s.memo((function({children:e,className:t="",label:n,value:l}){const{api:c}=(0,i.h)(),d=(0,r.W7)(!l&&c.query.timestamp?.now),[u,m]=(0,s.useMemo)((()=>[l||d,!(!l&&!d)]),[d,l]);return(0,a.jsxs)("div",{className:`${t} ${m?"":"--tmp"}`,children:[n||"",(0,a.jsx)(o.Z,{value:m?u:Date.now()}),e]})}))},96916:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n}){const{api:s}=(0,i.h)(),l=(0,r.W7)(s.query.balances?.inactiveIssuance);return(0,a.jsxs)("div",{className:t,children:[n||"",(0,a.jsx)(o.Z,{className:l?"":"--tmp",value:l||1,withSi:!0}),e]})}))},79608:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n}){const{api:s}=(0,i.h)(),l=(0,r.W7)(s.query.balances?.totalIssuance);return(0,a.jsxs)("div",{className:t,children:[n||"",(0,a.jsx)(o.Z,{className:l?"":"--tmp",value:l||1,withSi:!0}),e]})}))},68256:(e,t,n)=>{n.d(t,{$:()=>s});var a=n(61349);function s(){return(0,a.$G)("react-query")}(0,a.Zh)(["react-query"])},4984:(e,t,n)=>{n.d(t,{Z:()=>le});var a=n(52322),s=n(2784),i=n(68087),r=n(90778),o=n(86135),l=n(48731),c=n(33661),d=n(4615),u=n(61349);function m(){return(0,u.$G)("react-signer")}(0,u.Zh)(["react-signer"]);var h=n(345),p=n(45479),g=n(38894),f=n(69187),b=n(17965),x=n(29659);let v=0;class A{#a;#s;#i;#n;constructor(e,t,n,a){this.#a=n,this.#s=a,this.#i=t,this.#n=e}async signPayload(e){const t=this.#n.createType("ExtrinsicPayload",e,{version:e.version}),{signature:n}=await this.#i().sign(t.toU8a(!0),this.#a,this.#s);return{id:++v,signature:n}}}var w=n(34323);class y{#n;#r;constructor(e,t){this.#n=e,this.#r=t}async signPayload(e){return new Promise(((t,n)=>{const a=e.method.length>5e3,s=this.#n.createType("ExtrinsicPayload",e,{version:e.version}),i=a?(0,w.b)(s.toU8a(!0)):s.toU8a();this.#r({isQrHashed:a,qrAddress:e.address,qrPayload:i,qrReject:n,qrResolve:t})}))}}var j=n(33403);const k=()=>{},N={accountOffset:0,addressOffset:0,isHardware:!1,isMultisig:!1,isProxied:!1,isQr:!1,isUnlockable:!1,threshold:0,who:[]},C={};function E(e){if(!e)return N;let t;try{t=f.Nn.decodeAddress(e)}catch(e){return console.error(e),N}const n=f.Nn.getPair(t),{isExternal:a,isHardware:s,isInjected:i,isMultisig:r,isProxied:o}=n.meta,l=!a&&!s&&!i;if(l){const e=C[n.address];e&&Date.now()>e&&!n.isLocked&&(n.lock(),C[n.address]=0)}return{accountOffset:n.meta.accountOffset||0,addressOffset:n.meta.addressOffset||0,hardwareType:n.meta.hardwareType,isHardware:!!s,isMultisig:!!r,isProxied:!!o,isQr:!(!a||r||o||s||i),isUnlockable:l&&n.isLocked,threshold:n.meta.threshold||0,who:(n.meta.who||[]).map(S)}}function S(e){return f.Nn.encodeAddress(f.Nn.decodeAddress(e))}function I(e,t,{id:n,txFailedCb:a=k,txSuccessCb:s=k,txUpdateCb:i=k},r){return o=>{if(!o||!o.status)return;const l=o.status.type.toLowerCase();console.log(`${e}: status :: ${JSON.stringify(o)}`),t(n,l,o),i(o),o.status.isFinalized||o.status.isInBlock?o.events.filter((({event:{section:e}})=>"system"===e)).forEach((({event:{method:e}})=>{"ExtrinsicFailed"===e?a(o):"ExtrinsicSuccess"===e&&s(o)})):o.isError&&a(o),o.isCompleted&&r()}}let D=0;class B{#o;#n;constructor(e,t){this.#o=t,this.#n=e}async signPayload(e){return new Promise((t=>{const n=this.#n.createType("ExtrinsicPayload",e,{version:e.version}).sign(this.#o);var a;a=this.#o,Date.now()>(C[a.address]||0)&&!a.isLocked&&a.lock(),t((0,j.Z)({id:++D},n))}))}}var L=n(34814),$=n(74065),V=n(95292);const P=(0,i.zo)(i.u_.Columns)`
  .errorLabel {
    margin-right: 1rem;
    color: #9f3a38 !important;
  }

  .ui--Toggle {
    bottom: 1.1rem;
  }
`,Z=s.memo((function({address:e,className:t,error:n,onChange:r,onEnter:o,tabIndex:l}){const{t:c}=m(),[d,u]=(0,s.useState)(""),[h,p]=(0,s.useState)(!1),g=(0,s.useMemo)((()=>function(e){try{return f.Nn.getPair(e)}catch{return null}}(e)),[e]);return(0,s.useEffect)((()=>{r(d,h)}),[r,h,d]),g&&g.isLocked&&!g.meta.isInjected?(0,a.jsx)(P,{className:t,hint:c("Unlock the sending account to allow signing of this transaction."),children:(0,a.jsx)(i.ro,{autoFocus:!0,isError:!!n,label:c("unlock account with password"),labelExtra:(0,a.jsx)(i.ZD,{label:c("unlock for {{expiry}} min",{replace:{expiry:15}}),onChange:p,value:h}),onChange:u,onEnter:o,tabIndex:l,value:d})}):null}));const T=s.memo((function({currentItem:e,onChange:t,onEnter:n,passwordError:o,requestAddress:l}){const{t:d}=m(),{api:u}=(0,r.h)(),{allAccounts:h}=(0,L.x)(),p=(0,$.X)(),[g,f]=(0,s.useState)(null),[b,x]=(0,s.useState)(null),[v,A]=(0,s.useState)(!1),[w,y]=(0,s.useState)(!0),[j,k]=(0,s.useState)(null),[N,C]=(0,s.useState)(null),[{isUnlockCached:S,signPassword:I},D]=(0,s.useState)((()=>({isUnlockCached:!1,signPassword:""}))),[B,P]=(0,s.useMemo)((()=>{const e=j&&g||w&&N&&b||l;try{return[e,E(e)]}catch{return[e,{}]}}),[g,b,w,j,N,l]),T=(0,s.useCallback)(((e,t)=>D({isUnlockCached:t,signPassword:e})),[]);return(0,s.useEffect)((()=>{!N&&x(null)}),[N]),(0,s.useEffect)((()=>{C(null),e.extrinsic&&async function(e,t,n,a){if((0,c.m)(e.query.proxy?.proxies)){const{isProxied:s}=E(n),[i]=await e.query.proxy.proxies(n),r=3===e.tx.proxy.addProxy.meta.args.length?i.map((({delay:e,delegate:t,proxyType:n})=>[t.toString(),e,n])):i.map((([e,t])=>[e.toString(),V.nw,t])),o=function(e,t,n){const{method:a,section:s}=function(e){try{const{method:t,section:n}=e.registry.findMetaCall(e.callIndex);return{method:t,section:n}}catch{return{method:"unknown",section:"unknown"}}}(t);return n.filter((([t,n,a])=>!(!e.includes(t)||!n.isZero()))).map((([e])=>e))}(t,a,r);if(o.length)return{address:n,isProxied:s,proxies:r,proxiesFilter:o}}return null}(u,h,l,e.extrinsic).then((e=>p.current&&C(e))).catch(console.error)}),[h,u,e,p,l]),(0,s.useEffect)((()=>{k(null),e.extrinsic&&E(b||l).isMultisig&&async function(e,t,n,a){const s=e.tx.multisig?"multisig":"utility";if((0,c.m)(e.query[s]?.multisigs)){const i=n||t,{threshold:r,who:o}=E(i),l=(n?e.tx.proxy.proxy(t||"",null,a):a).method.hash,c=(await e.query[s].multisigs(i,l)).unwrapOr(null);return c?{address:i,isMultiCall:c.approvals.length+1>=r,who:o,whoFilter:o.filter((e=>!c.approvals.some((t=>t.eq(e)))))}:{address:i,isMultiCall:!1,who:o,whoFilter:o}}return null}(u,l,b,e.extrinsic).then((e=>{p.current&&(k(e),A(e?.isMultiCall||!1))})).catch(console.error)}),[b,u,e,p,l]),(0,s.useEffect)((()=>{t({isMultiCall:v,isUnlockCached:S,multiRoot:j?j.address:null,proxyRoot:N&&w?N.address:null,signAddress:B,signPassword:I})}),[w,v,S,g,j,t,b,N,B,I]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.u_.Columns,{hint:d("The sending account that will be used to send this transaction. Any applicable fees will be paid by this account."),children:(0,a.jsx)(i.rp,{className:"full",defaultValue:l,isDisabled:!0,isInput:!0,label:d("sending from my account"),withLabel:!0})}),N&&w&&(0,a.jsx)(i.u_.Columns,{hint:d("The proxy is one of the allowed proxies on the account, as set and filtered by the transaction type."),children:(0,a.jsx)(i.rp,{filter:N.proxiesFilter,label:d("proxy account"),onChange:x,type:"account"})}),j&&(0,a.jsx)(i.u_.Columns,{hint:d("The signatory is one of the allowed accounts on the multisig, making a recorded approval for the transaction."),children:(0,a.jsx)(i.rp,{filter:j.whoFilter,label:d("multisig signatory"),onChange:f,type:"account"})}),B&&!e.isUnsigned&&P.isUnlockable&&(0,a.jsx)(Z,{address:B,error:o,onChange:T,onEnter:n}),o&&(0,a.jsx)(i.u_.Columns,{children:(0,a.jsx)(i.oy,{content:o})}),N&&(0,a.jsx)(i.u_.Columns,{hint:d("This could either be an approval for the hash or with full call details. The call as last approval triggers execution."),children:(0,a.jsx)(i.ZD,{className:"tipToggle",isDisabled:N.isProxied,label:d(w?"Use a proxy for this call":"Don't use a proxy for this call"),onChange:y,value:w})}),j&&(0,a.jsx)(i.u_.Columns,{hint:d("This could either be an approval for the hash or with full call details. The call as last approval triggers execution."),children:(0,a.jsx)(i.ZD,{className:"tipToggle",label:d(v?"Multisig message with call (for final approval)":"Multisig approval with hash (non-final approval)"),onChange:A,value:v})})]})}));var z=n(74076);const M=(0,i.zo)(i.P0)`
  .qrDisplay {
    margin: 0 auto;
    max-width: 30rem;

    img {
      border: 1px solid white;
    }
  }
`,F=s.memo((function({address:e,className:t,genesisHash:n,isHashed:r,onSignature:o,payload:l}){const{t:c}=m(),[d,u]=(0,s.useState)(null),h=(0,s.useCallback)((e=>{if((0,z.vq)(e.signature))o(e);else{const t=e.signature;u(c('Non-signature, non-hex data received from QR. Data contains "{{sample}}" instead of a hex-only signature. Please present the correct signature generated from the QR presented for submission.',{replace:{sample:t.length>47?`${t.slice(0,24)}…${t.slice(-22)}`:t}}))}}),[o,c]);return e?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(M,{className:t,children:[(0,a.jsx)(i.P0.Column,{children:(0,a.jsx)("div",{className:"qrDisplay",children:(0,a.jsx)(i.iH,{address:e,cmd:r?1:2,genesisHash:n,payload:l})})}),(0,a.jsx)(i.P0.Column,{children:(0,a.jsx)("div",{className:"qrDisplay",children:(0,a.jsx)(i.lB,{onScan:h})})})]}),d&&(0,a.jsx)(i.oy,{className:"nomargin",content:d})]}):(0,a.jsx)(i.$j,{label:c("Preparing QR for signing")})}));var H=n(48801),R=n.n(H);const U=s.memo((function({address:e,onChange:t,signedTx:n}){const{api:o}=(0,r.h)(),[l,c]=(0,s.useState)((()=>new(R())(64))),[d,u]=(0,s.useState)(V.nw),{t:h}=m();(0,s.useEffect)((()=>{e&&o.derive.balances.account(e).then((({accountNonce:e})=>u(e))).catch(console.error)}),[e,o]),(0,s.useEffect)((()=>{t({era:l.toNumber(),nonce:d})}),[l,d,t]);const p=(0,s.useCallback)(((e=V.nw)=>c(e)),[]),g=(0,s.useCallback)(((e=V.nw)=>u(e)),[]);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(i.u_.Columns,{hint:h("Override any applicable values for the specific signed output. These will be used to construct and display the signed transaction."),children:[(0,a.jsx)(i.Rn,{isDisabled:!!n,isZeroable:!0,label:h("Nonce"),labelExtra:h("Current account nonce: {{accountNonce}}",{replace:{accountNonce:d}}),onChange:g,value:d}),(0,a.jsx)(i.Rn,{isDisabled:!!n,isZeroable:!0,label:h("Lifetime (# of blocks)"),labelExtra:h("Set to 0 to make transaction immortal"),onChange:p,value:l})]}),!!n&&(0,a.jsx)(i.u_.Columns,{hint:h("The actual fully constructed signed output. This can be used for submission via other channels."),children:(0,a.jsx)(i.r_,{isFull:!0,isTrimmed:!0,label:h("Signed transaction"),value:n,withCopy:!0})})]})})),q=s.memo((function({className:e,onChange:t}){const{t:n}=m(),[r,o]=(0,s.useState)(),[l,c]=(0,s.useState)(!1);return(0,s.useEffect)((()=>{t(l?r:V.nw)}),[t,l,r]),(0,a.jsxs)(i.u_.Columns,{className:e,hint:n("Adding an optional tip to the transaction could allow for higher priority, especially when the chain is busy."),children:[(0,a.jsx)(i.ZD,{className:"tipToggle",label:n(l?"Include an optional tip for faster processing":"Do not include a tip for the block author"),onChange:c,value:l}),l&&(0,a.jsx)(i.H,{isZeroable:!0,label:n("Tip (optional)"),onChange:o})]})}));var O=n(9118),W=n(92730);const Q=s.memo((function({accountId:e,className:t="",extrinsic:n,isHeader:o}){const{t:l}=m(),{api:c}=(0,r.h)(),[d,h]=(0,s.useState)(null),p=(0,O.W7)(c.derive.balances?.all,[e]),g=(0,$.X)();if((0,s.useEffect)((()=>{e&&n&&n.hasPaymentInfo&&(0,b.Y)((async()=>{try{const t=await n.paymentInfo(e);g.current&&h(t)}catch(e){console.error(e)}}))}),[c,e,n,g]),!d||!n)return null;const f=c.consts.balances&&!(c.tx.balances?.transferAllowDeath?.is(n)||c.tx.balances?.transfer?.is(n))&&p?.accountId.eq(e)&&(p.availableBalance.lte(d.partialFee)||p.freeBalance.sub(d.partialFee).lte(c.consts.balances.existentialDeposit));return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.xH,{className:t,isHeader:o,summary:(0,a.jsxs)(u.cC,{i18nKey:"feesForSubmission",children:["Fees of ",(0,a.jsx)("span",{className:"highlight",children:(0,W.a)(d.partialFee,{withSiFull:!0})})," will be applied to the submission"]})}),f&&(0,a.jsx)(i.Pd,{content:l("The account does not have enough free funds (excluding locked/bonded/reserved) available to cover the transaction fees without dropping the balance below the account existential amount.")})]})})),K=(0,i.zo)(i.u_.Columns)`
  .paymentInfo {
    margin-top: 0.5rem;
  }
`,G=s.memo((function({accountId:e,className:t,currentItem:{extrinsic:n,isUnsigned:s,payload:r},onError:o,tip:l}){const{t:c}=m();return n?(0,a.jsxs)(K,{className:t,hint:c("The details of the transaction including the type, the description (as available from the chain metadata) as well as any parameters and fee estimations (as available) for the specific type of call."),children:[(0,a.jsx)(i.Uv,{isHeader:!0,onError:o,value:n}),!s&&!r&&(0,a.jsx)(Q,{accountId:e,className:"paymentInfo",extrinsic:n,isHeader:!0,tip:l})]}):null})),J=()=>{},Y={innerHash:null,innerTx:null};let X=0;async function _(e,t,{isMultiCall:n,multiRoot:a,proxyRoot:s,signAddress:i}){let r=t.extrinsic;if(s&&(r=e.tx.proxy.proxy(s,null,r)),a){const t=e.tx.multisig?"multisig":"utility",[s,{weight:o}]=await Promise.all([e.query[t].multisigs(a,r.method.hash),r.paymentInfo(a)]);console.log("multisig max weight=",o.toString());const{threshold:l,who:c}=E(a),d=c.filter((e=>e!==i));let u=null;s.isSome&&(u=s.unwrap().when),r=n?5===e.tx[t].asMulti.meta.args.length?e.tx[t].asMulti(l,d,u,r.method.toHex(),o):6===e.tx[t].asMulti.meta.args.length?e.tx[t].asMulti(l,d,u,r.method.toHex(),!1,o):e.tx[t].asMulti(l,d,u,r.method):5===e.tx[t].approveAsMulti.meta.args.length?e.tx[t].approveAsMulti(l,d,u,r.method.hash,o):e.tx[t].approveAsMulti(l,d,u,r.method.hash)}return r}async function ee(e,t,n,a,s){const i=f.Nn.getPair(t),{meta:{accountOffset:r,addressOffset:o,isExternal:c,isHardware:d,isInjected:u,isProxied:m,source:p}}=i;if(d)return["signing",t,{...n,signer:new A(e.registry,a,r||0,o||0)}];if(c&&!m)return["qr",t,{...n,signer:new y(e.registry,s)}];if(u){const e=await(0,h.R0)(p);return(0,l.hu)(e,`Unable to find a signer for ${t}`),["signing",t,{...n,signer:e.signer}]}return(0,l.hu)((0,x.Q)(t,i.address),`Unable to retrieve keypair for ${t}`),["signing",t,{...n,signer:new B(e.registry,i)}]}function te(e){try{return E(e)}catch{return{}}}const ne=(0,i.zo)(i.u_.Content)`
  .tipToggle {
    width: 100%;
    text-align: right;
  }

  .ui--Checks {
    margin-top: 0.75rem;
  }
`,ae=s.memo((function({className:e,currentItem:t,isQueueSubmit:n,queueSize:l,requestAddress:c,setIsQueueSubmit:d}){const{t:u}=m(),{api:h}=(0,r.h)(),{getLedger:x}=(0,p.c)(),{queueSetTxStatus:v}=(0,o.L)(),[A,w]=(0,s.useState)((()=>te(c))),[y,j]=(0,s.useState)(null),[{isQrHashed:k,qrAddress:N,qrPayload:E,qrResolve:S},D]=(0,s.useState)((()=>({isQrHashed:!1,qrAddress:"",qrPayload:new Uint8Array}))),[B,L]=(0,s.useState)(!1),[$,V]=(0,g.O)(),[P,Z]=(0,s.useState)(!0),[z,M]=(0,s.useState)(null),[H,R]=(0,s.useState)((()=>({isMultiCall:!1,isUnlockCached:!1,multiRoot:null,proxyRoot:null,signAddress:c,signPassword:""}))),[O,W]=(0,s.useState)({}),[Q,K]=(0,s.useState)(null),[{innerHash:ae,innerTx:se},ie]=(0,s.useState)(Y),[re,oe]=(0,s.useState)(),[le]=(0,s.useState)(n);(0,s.useEffect)((()=>{w(te(H.signAddress)),M(null)}),[H]),(0,s.useEffect)((()=>{const e=t.extrinsic&&(H.proxyRoot?h.tx.proxy.proxy(H.proxyRoot,null,t.extrinsic):t.extrinsic).method;ie(e?{innerHash:e.hash.toHex(),innerTx:H.multiRoot?e.toHex():null}:Y)}),[h,t,H]);const ce=(0,s.useCallback)((({signature:e})=>S&&S({id:++X,signature:e})),[S]),de=(0,s.useCallback)((async()=>{let e=null;if(H.signAddress)if(A.isUnlockable)e=function({isUnlockCached:e,signAddress:t,signPassword:n}){let a;try{a=f.Nn.decodeAddress(t)}catch(e){return console.error(e),"unable to decode address"}const s=f.Nn.getPair(a);try{s.decodePkcs8(n),e&&function(e){C[e.address]=Date.now()+9e5}(s)}catch(e){return console.error(e),e.message}return null}(H);else if(A.isHardware)try{const e=x(),{address:t}=await e.getAddress(!1,A.accountOffset,A.addressOffset);console.log(`Signing with Ledger address ${t}`)}catch(t){console.error(t),e=u("Unable to connect to the Ledger, ensure support is enabled in settings and no other app is using it. {{error}}",{replace:{error:t.message}})}return M(e),!e}),[A,x,H,u]),ue=(0,s.useCallback)(((e,t,n)=>{if(n.signAddress&&t.payload){const{id:a,payload:s,signerCb:i=J}=t,r=f.Nn.getPair(n.signAddress);i(a,{id:a,...h.createType("ExtrinsicPayload",s,{version:s.version}).sign(r)}),e(a,"completed")}}),[h]),me=(0,s.useCallback)((async(e,t,n)=>{if(n.signAddress){const[a,[s,i,r]]=await Promise.all([_(h,t,n),ee(h,n.signAddress,{nonce:-1,tip:re},x,D)]);e(t.id,s),await async function(e,t,n,a,s){t.txStartCb&&t.txStartCb();try{await n.signAsync(a,s),console.info("sending",n.toHex()),e(t.id,"sending");const i=await n.send(I("signAndSend",e,t,(()=>{i()})))}catch(n){console.error("signAndSend: error:",n),e(t.id,"error",{},n),t.txFailedCb&&t.txFailedCb(n)}}(e,t,a,i,r)}}),[h,x,re]),he=(0,s.useCallback)((async(e,t,n)=>{if(n.signAddress){const[a,[,s,i]]=await Promise.all([_(h,t,n),ee(h,n.signAddress,{...O,tip:re},x,D)]);K(await async function(e,{id:t,txFailedCb:n=J,txStartCb:a=J},s,i,r){a();try{return await s.signAsync(i,r),s.toJSON()}catch(a){console.error("signAsync: error:",a),e(t,"error",void 0,a),n(a)}return null}(e,t,a,s,i))}}),[h,x,O,re]),pe=(0,s.useCallback)((()=>{L(!0),(0,b.Y)((()=>{const e=e=>{console.error(e),L(!1),j(e)};de().then((n=>{n?P?t.payload?ue(v,t,H):me(v,t,H).catch(e):he(v,t,H).catch(e):L(!1)})).catch((t=>{e(t)}))}))}),[me,ue,he,de,t,P,v,H]),ge=H.signAddress&&l>1&&P&&!(A.isHardware||A.isMultisig||A.isProxied||A.isQr||A.isUnlockable)&&!$;return!B&&ge&&le?(L(!0),setTimeout(pe,1e3),null):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ne,{className:e,children:(0,a.jsx)(i.SV,{error:y,onError:V,children:B&&A.isQr?(0,a.jsx)(F,{address:N,genesisHash:h.genesisHash,isHashed:k,onSignature:ce,payload:E}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(G,{accountId:H.signAddress,currentItem:t,onError:V}),(0,a.jsx)(T,{currentItem:t,onChange:R,onEnter:pe,passwordError:z,requestAddress:c}),!t.payload&&(0,a.jsx)(q,{onChange:oe}),!P&&(0,a.jsx)(U,{address:H.signAddress,onChange:W,signedTx:Q}),P&&!H.isMultiCall&&se&&(0,a.jsx)(i.u_.Columns,{hint:u("The full call data that can be supplied to a final call to multi approvals"),children:(0,a.jsx)(i.r_,{isDisabled:!0,isTrimmed:!0,label:u("multisig call data"),value:se,withCopy:!0})}),P&&ae&&(0,a.jsx)(i.u_.Columns,{hint:u("The call hash as calculated for this transaction"),children:(0,a.jsx)(i.r_,{isDisabled:!0,isTrimmed:!0,label:u("call hash"),value:ae,withCopy:!0})})]})})}),(0,a.jsxs)(i.u_.Actions,{children:[(0,a.jsx)(i.zx,{icon:A.isQr?"qrcode":"sign-in-alt",isBusy:B,isDisabled:!H.signAddress||$,label:A.isQr?u("Sign via Qr"):u(P?"Sign and Submit":"Sign (no submission)"),onClick:pe,tabIndex:2}),(0,a.jsxs)("div",{className:"signToggle",children:[!B&&(0,a.jsx)(i.ZD,{isDisabled:!!t.payload,label:u(P?"Sign and Submit":"Sign (no submission)"),onChange:Z,value:P}),ge&&(0,a.jsx)(i.ZD,{label:n?u("Submit {{queueSize}} items",{replace:{queueSize:l}}):u("Submit individual"),onChange:d,value:n})]})]})]})})),se=s.memo((function({className:e,currentItem:t}){const{t:n}=m(),{queueSetTxStatus:r}=(0,o.L)(),[l,c]=(0,g.O)(),d=(0,s.useCallback)((async()=>{t.extrinsic&&await async function(e,t,n){t.txStartCb&&t.txStartCb();try{const a=await n.send(I("send",e,t,(()=>{a()})))}catch(n){console.error("send: error:",n),e(t.id,"error",{},n),t.txFailedCb&&t.txFailedCb(null)}}(r,t,t.extrinsic)}),[t,r]);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.u_.Content,{className:e,children:(0,a.jsx)(i.SV,{onError:c,children:(0,a.jsx)(G,{currentItem:t,onError:c})})}),(0,a.jsx)(i.u_.Actions,{children:(0,a.jsx)(i.zx,{icon:"sign-in-alt",isDisabled:l,label:n("Submit (no signature)"),onClick:d,tabIndex:2})})]})})),ie=()=>{},re=["queued","qr","signing"];const oe=(0,i.zo)(i.u_)`
  .signToggle {
    bottom: 1.5rem;
    left: 1.5rem;
    position: absolute;

    .ui--Toggle {
      display: inline-block;

      &+.ui--Toggle {
        margin-left: 1rem;
      }
    }
  }
`,le=s.memo((function({children:e,className:t=""}){const{api:n}=(0,r.h)(),{t:i}=m(),{queueSetTxStatus:u,txqueue:h}=(0,o.L)(),[p,g]=(0,s.useState)(!1),{currentItem:f,isRpc:b,isVisible:x,queueSize:v,requestAddress:A}=(0,s.useMemo)((()=>function(e){const t=e.filter((({status:e})=>re.includes(e))),n=t[0]||null;let a=!1,s=!1;return n&&("queued"!==n.status||n.extrinsic||n.payload?"signing"!==n.status&&(s=!0):a=!0),{currentItem:n,isRpc:a,isVisible:s,queueSize:t.length,requestAddress:n&&n.accountId||null}}(h)),[h]);(0,s.useEffect)((()=>{1===v&&g(!1)}),[v]),(0,s.useEffect)((()=>{b&&f&&async function(e,t,{id:n,rpc:a,values:s=[]}){if(a){t(n,"sending");const{error:i,result:r,status:o}=await async function(e,{method:t,section:n},a){try{const s=e.rpc;(0,l.hu)((0,c.m)(s[n]&&s[n][t]),`api.rpc.${n}.${t} does not exist`);const i=await s[n][t](...a);return console.log("submitRpc: result ::",(0,d.a)(i)),{result:i,status:"sent"}}catch(e){return console.error(e),{error:e,status:"error"}}}(e,a,s);t(n,o,r,i)}}(n,u,f).catch(console.error)}),[n,b,f,u]);const w=(0,s.useCallback)((()=>{if(f){const{id:e,signerCb:t=ie,txFailedCb:n=ie}=f;u(e,"cancelled"),t(e,null),n(null)}}),[f,u]);return(0,a.jsxs)(a.Fragment,{children:[e,f&&x&&(0,a.jsx)(oe,{className:t,header:(0,a.jsxs)(a.Fragment,{children:[i("Authorize transaction"),1===v?void 0:(0,a.jsxs)(a.Fragment,{children:[" 1/",v]})]}),onClose:w,size:"large",children:f.isUnsigned?(0,a.jsx)(se,{currentItem:f}):(0,a.jsx)(ae,{currentItem:f,isQueueSubmit:p,queueSize:v,requestAddress:A,setIsQueueSubmit:g})},f.id)]})}))}}]);