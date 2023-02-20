"use strict";(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[136],{19910:(e,t,n)=>{n.r(t),n.d(t,{ApiCtx:()=>z,ApiCtxRoot:()=>U,DEFAULT_AUX:()=>T,DEFAULT_DECIMALS:()=>P,DEFAULT_SS58:()=>Z,api:()=>H});var a=n(13649),s=n(2784),i=n(23729),r=n.n(i),o=n(1719),l=n(21899),c=n(23134),u=n(36733),d=n(3919),m=n(48901),h=n(8877),p=n(345),g=n(51833),f=n(54782),b=n(43212),v=n(89448);const x=(0,b.Rf)(((e,t)=>t||e)),A=(0,v.e)("useEndpoint",(function(e){return(0,s.useMemo)((()=>function(e){return x.find((({value:t})=>t===e))||null}(e)),[e])}));var w=n(69877);class y{#e;#t;#n;constructor(e,t,n){this.#e=t,this.#t=n,this.#n=e}async signPayload(e){return new Promise(((t,n)=>{this.#e(this.#n,e,((e,a)=>{a?t(a):n(new Error("Unable to sign"))}))}))}update(e,t){t instanceof this.#n.createClass("Hash")?this.#t(e,"sent",t.toHex()):this.#t(e,t.status.type.toLowerCase(),t)}}var j=n(69187),k=n(16039),N=n(33403),C=n(92730),E=n(30495),S=n(11147),I=n(65968),D=n(68145),B=n(95003),L=n(48963),$=n(58321),V=n(52322);const P=L.default.createType("u32",12),Z=L.default.createType("u32",D.c.prefix),T=["Aux1","Aux2","Aux3","Aux4","Aux5","Aux6","Aux7","Aux8","Aux9"],z=s.createContext({}),F=[],M={hasInjectedAccounts:!1,isApiReady:!1};let H;async function R(e){try{return await e,(await(0,p.vK)()).map((({address:e,meta:t},n)=>({address:e,meta:(0,N.Z)({},t,{name:`${t.name||"unknown"} (${"polkadot-js"===t.source?"extension":t.source})`,whenCreated:n})})))}catch(e){return console.error("web3Accounts",e),[]}}function U({apiUrl:e,children:t,isElectron:i,store:b}){const{queuePayload:v,queueSetTxStatus:x}=(0,f.L)(),[D,U]=(0,s.useState)(M),[q,O]=(0,s.useState)(!1),[W,Q]=(0,s.useState)(!1),[K,G]=(0,s.useState)(null),[J,Y]=(0,s.useState)(),X=A(e),_=(0,s.useMemo)((()=>X&&X.valueRelay&&(0,I.h)(X.paraId)&&X.paraId<2e3?X.valueRelay:null),[X]),ee=(0,w.J)(_),te=(0,s.useMemo)((()=>function(e,t){return(n,a)=>`${t?"https://polkadot.js.org/apps/":`${window.location.origin}${window.location.pathname}`}?rpc=${encodeURIComponent(a||e)}#${n}`}(e,i)),[e,i]),ne=(0,s.useMemo)((()=>(0,N.Z)({},D,{api:H,apiEndpoint:X,apiError:K,apiRelay:ee,apiUrl:e,createLink:te,extensions:J,isApiConnected:q,isApiInitialized:W,isElectron:i,isWaitingInjected:!J})),[K,te,J,q,W,i,D,X,ee,e]);return(0,s.useEffect)((()=>{const t=e=>{console.error(e),G(e.message)};(async function(e,t,s){const i=function(){const e=(0,$.decodeUrlTypes)()||r().get("types",{}),t=Object.keys(e);return t.length&&console.log("Injected types:",t.join(", ")),e}(),u=e.startsWith("light://");try{const s=u?await async function(e){const[t,s,i]=e.split("/");if("substrate-connect"!==t)throw new Error(`Cannot connect to non substrate-connect protocol ${e}`);if(!B.relaySpecs[s]||i&&(!B.lightSpecs[s]||!B.lightSpecs[s][i]))throw new Error(`Unable to construct light chain ${e}`);const r=new o.x(a,B.relaySpecs[s]);if(!i)return r;const l=await n(29038)(`${B.lightSpecs[s][i]}`);return new o.x(a,JSON.stringify(l.default),r)}(e.replace("light://","")):new l.U(e);H=new c.G({provider:s,registry:L.default,signer:t,types:i,typesBundle:h.UD}),u&&await s.connect()}catch(e){s(e)}return i})(e,new y(L.default,v,x),t).then((e=>{H.on("connected",(()=>O(!0))),H.on("disconnected",(()=>O(!1))),H.on("error",t),H.on("ready",(()=>{const n=(0,p.$y)("polkadot-js/apps");n.then(Y).catch(console.error),async function(e,t,n,a,s){L.default.register(s);const{injectedAccounts:i,properties:r,systemChain:o,systemChainType:l,systemName:c,systemVersion:h}=await async function(e,t){const[n,a,s,i,r]=await Promise.all([e.rpc.system.chain(),e.rpc.system.chainType?e.rpc.system.chainType():Promise.resolve(L.default.createType("ChainType","Live")),e.rpc.system.name(),e.rpc.system.version(),R(t)]);return{injectedAccounts:r.filter((({meta:{source:e}})=>!F.includes(e))),properties:L.default.createType("ChainProperties",{ss58Format:e.registry.chainSS58,tokenDecimals:e.registry.chainDecimals,tokenSymbol:e.registry.chainTokens}),systemChain:(n||"<unknown>").toString(),systemChainType:a,systemName:s.toString(),systemVersion:i.toString()}}(e,n),p=r.ss58Format.unwrapOr(Z).toNumber(),f=-1===k.X.prefix?p:k.X.prefix,b=r.tokenSymbol.unwrapOr([C.a.getDefaults().unit,...T]),v=r.tokenDecimals.unwrapOr([P]),x=m.W.includes(e.runtimeVersion.specName.toString()),A=l.isDevelopment||l.isLocal||(0,E.s)(o);console.log(`chain: ${o} (${l.toString()}), ${(0,S.P)(r)}`),L.default.setChainProperties(L.default.createType("ChainProperties",{ss58Format:f,tokenDecimals:v,tokenSymbol:b})),C.a.setDefaults({decimals:v.map((e=>e.toNumber())),unit:b[0].toString()}),g.k.setAbbr(b[0].toString()),function(){try{return!!j.Nn.keyring}catch{return!1}}()||j.Nn.loadAll({genesisHash:e.genesisHash,genesisHashAdd:t&&(0,I.h)(t.paraId)&&t.paraId<2e3&&t.genesisHashRelay?[t.genesisHashRelay]:[],isDevelopment:A,ss58Format:f,store:a,type:x?"ethereum":"ed25519"},i);const w=Object.keys(e.tx)[0],y=Object.keys(e.tx[w])[0],N=e.tx[w][y],D=e.tx.system&&e.tx.system.setCode||N;return(0,u.u)(e.genesisHash.toHex(),d.A),{apiDefaultTx:N,apiDefaultTxSudo:D,chainSS58:p,hasInjectedAccounts:0!==i.length,isApiReady:!0,isDevelopment:!x&&A,isEthereum:x,specName:e.runtimeVersion.specName.toString(),specVersion:e.runtimeVersion.specVersion.toString(),systemChain:o,systemName:c,systemVersion:h}}(H,X,n,b,e).then(U).catch(t)})),Q(!0)})).catch(t)}),[X,e,v,x,b]),ne.isApiInitialized?(0,V.jsx)(z.Provider,{value:ne,children:t}):null}},17366:(e,t,n)=>{n.r(t),n.d(t,{default:()=>o});var a=n(2784),s=n(48731),i=n(19910),r=n(52322);function o(e,t={}){class n extends a.PureComponent{component=a.createRef();render(){return(0,r.jsx)(i.ApiCtx.Consumer,{children:n=>((0,s.hu)(n&&n.api,"Application root must be wrapped inside 'react-api/Api' to provide API context"),(0,r.jsx)(e,{...t,...n,...this.props,ref:this.component}))})}}return n}},26869:(e,t,n)=>{n.r(t),n.d(t,{default:()=>g});var a=n(2784),s=n(17965),i=n(1346),r=n(17751),o=n(48731),l=n(86484),c=n(90298),u=n(17366),d=n(52322);const m=()=>{},h=()=>!1,p={};function g(e,{at:t,atProp:n,callOnResult:g,fallbacks:f,isMulti:b=!1,paramName:v,paramPick:x,paramValid:A=!1,params:w=[],propName:y,skipIf:j=h,transform:k=l.default,withIndicator:N=!1}={}){return l=>{class h extends a.Component{state={callResult:void 0,callUpdated:!1,callUpdatedAt:0};isActive=!1;timerId=-1;constructor(t){super(t);const[,n,a]=e.split(".");this.propName=`${n}_${a}`}componentDidUpdate(e){const t=this.getParams(e),n=this.getParams(this.props);this.isActive&&!(0,c.isEqual)(n,t)&&this.subscribe(n).then(m).catch(m)}componentDidMount(){this.isActive=!0,N&&(this.timerId=window.setInterval((()=>{const e=Date.now()-(this.state.callUpdatedAt||0)<=1500;e!==this.state.callUpdated&&this.nextState({callUpdated:e})}),500)),(0,s.Y)((()=>{this.subscribe(this.getParams(this.props)).then(m).catch(m)}))}componentWillUnmount(){this.isActive=!1,this.unsubscribe().then(m).catch(m),-1!==this.timerId&&clearInterval(this.timerId)}nextState(e){this.isActive&&this.setState(e)}getParams(e){const a=x?x(e):v?e[v]:void 0;return n&&(t=e[n]),!A&&v&&((0,i.o)(a)||(0,r.F)(a))?[!1,[]]:[!0,(0,i.o)(a)?w:w.concat(Array.isArray(a)&&!a.toU8a?a:[a])]}constructApiSection=e=>{const{api:n}=this.props,[a,s,i,...r]=e.split(".");return(0,o.hu)(a.length&&s.length&&i.length&&0===r.length,`Invalid API format, expected <area>.<section>.<method>, found ${e}`),(0,o.hu)(["consts","rpc","query","derive"].includes(a),`Unknown api.${a}, expected consts, rpc, query or derive`),(0,o.hu)(!t||"query"===a,"Only able to do an 'at' query on the api.query interface"),[n[a][s],a,s,i]};getApiMethod(t){if("subscribe"===e){const[e,...n]=t;return[e,n,"subscribe"]}const n=[e].concat(f||[]).map(this.constructApiSection),[a,s,l,c]=n.find((([e])=>!!e))||[{},n[0][1],n[0][2],n[0][3]];(0,o.hu)(a&&a[c],`Unable to find api.${s}.${l}.${c}`);const u=a[c].meta;if("query"===s&&null!=u&&u.type.isMap){const e=t[0];(0,o.hu)(!(0,i.o)(e)&&!(0,r.F)(e)||u.type.asMap.kind.isLinkedMap,`${u.name} expects one argument`)}return[a[c],t,c.startsWith("subscribe")?"subscribe":s]}async subscribe([a,s]){if(!a||j(this.props))return;const{api:i}=this.props;let r;await i.isReady;try{(0,o.hu)(t||!n,"Unable to perform query on non-existent at hash"),r=this.getApiMethod(s)}catch(t){p[t.message]||(console.warn(e,"::",t),p[t.message]=!0)}if(!r)return;const[l,c,u]=r,d=e=>this.triggerUpdate(this.props,e);await this.unsubscribe();try{["derive","subscribe"].includes(u)||"query"===u&&!t&&!n?this.destroy=b?await l.multi(c,d):await l(...c,d):d("consts"===u?l:t?await l.at(t,...c):await l(...c))}catch(e){}}async unsubscribe(){this.destroy&&(this.destroy(),this.destroy=void 0)}triggerUpdate(e,t){try{const n=(e.transform||k)(t);if(!this.isActive||(0,c.isEqual)(n,this.state.callResult))return;(0,c.triggerChange)(n,g,e.callOnResult),this.nextState({callResult:n,callUpdated:!0,callUpdatedAt:Date.now()})}catch(e){}}render(){const{callResult:e,callUpdated:t,callUpdatedAt:n}=this.state,a={...this.props,callUpdated:t,callUpdatedAt:n};return(0,i.o)(e)||(a[y||this.propName]=e),(0,d.jsx)(l,{...a})}}return(0,u.default)(h)}}},11944:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i}),n(2784);var a=n(26869),s=n(52322);function i(e,t={}){return(n,i={})=>(0,a.default)(e,{...t,propName:"callResult"})((function({callResult:e,callUpdated:t,children:a,className:r=i.className,label:o=""}){return(0,s.jsxs)("div",{...i,className:[r||"",t?"rx--updated":void 0].join(" "),children:[o,n(e),a]})}))}},56281:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});var a=n(26869);function s(...e){return t=>e.reverse().reduce(((e,t)=>Array.isArray(t)?(0,a.default)(...t)(e):(0,a.default)(t)(e)),t)}},79136:(e,t,n)=>{n.r(t),n.d(t,{onlyOnApp:()=>c.onlyOnApp,onlyOnWeb:()=>c.onlyOnWeb,withApi:()=>a.default,withCall:()=>s.default,withCallDiv:()=>r.default,withCalls:()=>i.default,withMulti:()=>o.default,withObservable:()=>l.default});var a=n(17366),s=n(26869),i=n(56281),r=n(11944),o=n(55215),l=n(33546),c=n(96725)},55215:(e,t,n)=>{function a(e,...t){return t.reverse().reduce(((e,t)=>t(e)),e)}n.r(t),n.d(t,{default:()=>a})},33546:(e,t,n)=>{n.r(t),n.d(t,{default:()=>u});var a=n(2784),s=n(77984),i=n(47009),r=n(35120),o=n(86484),l=n(90298),c=n(52322);function u(e,{callOnResult:t,propName:n="value",transform:u=o.default}={}){return(o,d={},m)=>{class h extends a.Component{isActive=!0;state={callResult:void 0,callUpdated:!1,callUpdatedAt:0,subscriptions:[]};componentDidMount(){this.setState({subscriptions:[e.pipe((0,s.U)(u),(0,i.K)((()=>(0,r.of)(void 0)))).subscribe((e=>this.triggerUpdate(this.props,e))),(0,l.intervalObservable)(this)]})}componentWillUnmount(){this.isActive=!1,this.state.subscriptions.forEach((e=>e.unsubscribe()))}triggerUpdate=(e,n)=>{try{if(!this.isActive||(0,l.isEqual)(n,this.state.callResult))return;(0,l.triggerChange)(n,t,e.callOnResult||d.callOnResult),this.setState({callResult:n,callUpdated:!0,callUpdatedAt:Date.now()})}catch(e){console.error(this.props,e)}};render(){const{children:e}=this.props,{callResult:t,callUpdated:a,callUpdatedAt:s}=this.state,i={...d,...this.props,callUpdated:a,callUpdatedAt:s,[n]:t};return(0,c.jsxs)(o,{...i,children:[m&&m(t),e]})}}return h}}},96725:(e,t,n)=>{n.r(t),n.d(t,{onlyOnApp:()=>r,onlyOnWeb:()=>i});var a=n(90298);const s=e=>t=>(0,a.getEnvironment)()===e?t:()=>null,i=s("web"),r=s("app")},9921:(e,t,n)=>{n.r(t),n.d(t,{ApiCtx:()=>a.ApiCtx,ApiCtxRoot:()=>a.ApiCtxRoot,DEFAULT_DECIMALS:()=>a.DEFAULT_DECIMALS,DEFAULT_SS58:()=>a.DEFAULT_SS58,api:()=>a.api,withApi:()=>s.withApi,withCallDiv:()=>s.withCallDiv,withCalls:()=>s.withCalls,withMulti:()=>s.withMulti,withObservable:()=>s.withObservable});var a=n(19910),s=n(79136)},95003:(e,t,n)=>{n.r(t),n.d(t,{lightSpecs:()=>r,relaySpecs:()=>o});var a=n(13649),s=n(88137),i=n(81023);const r=Object.entries({kusama:s.specs,polkadot:i.specs}).reduce(((e,[t,n])=>(e[t]=n.reduce(((e,n)=>(e[n]=`./light/${t}/${n}.json`,e)),{}),e)),{}),o={kusama:a.WellKnownChain.ksmcc3,polkadot:a.WellKnownChain.polkadot,rococo:a.WellKnownChain.rococo_v2_2,westend:a.WellKnownChain.westend2}},88137:(e,t,n)=>{n.r(t),n.d(t,{specs:()=>a});const a=["gm","shiden","tinkernet"]},81023:(e,t,n)=>{n.r(t),n.d(t,{specs:()=>a});const a=["astar"]},86484:(e,t,n)=>{function a(e,t){return e}n.r(t),n.d(t,{default:()=>a})},48963:(e,t,n)=>{n.r(t),n.d(t,{default:()=>a});const a=new(n(35562).P)},58321:(e,t,n)=>{n.r(t),n.d(t,{decodeUrlTypes:()=>u,encodeUrlTypes:()=>d});var a=n(13824),s=n(85168),i=n(16039),r=n(48731),o=n(56623),l=n(64021),c=n(41444);function u(){const e=s.Z.parse(location.href.split("?")[1]);if(e.types)try{(0,r.hu)(!Array.isArray(e.types),"Expected a single type specification");const t=e.types.split("#"),n=(0,c.tV)(decodeURIComponent(t[0])),s=(0,a.HT)(n);return JSON.parse((0,o.z)(s))}catch(e){console.error(e)}return null}function d(e){const t=(0,l.d)(JSON.stringify(e)),n=(0,a.iZ)(t,{level:9}),s=(0,c.h$)(n);return`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(i.X.apiUrl)}&types=${encodeURIComponent(s)}`}},424:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});var a=n(34406);function s(){return null!=a&&null!=(e=a.versions)&&e.electron||"renderer"===(null==(t=window)||null==(n=t.process)?void 0:n.type)||(null==(s=navigator)||null==(i=s.userAgent)?void 0:i.indexOf("Electron"))>=0?"app":"web";var e,t,n,s,i}},78968:(e,t,n)=>{async function a(e,t,n){return Promise.all(n.map((n=>e(n,...t)))).then((e=>e.map(((e,t)=>[n[t],e]))))}n.r(t),n.d(t,{default:()=>a})},90298:(e,t,n)=>{n.r(t),n.d(t,{getEnvironment:()=>a.default,getHistoric:()=>s.default,intervalObservable:()=>i.default,isEqual:()=>r.default,triggerChange:()=>o.default});var a=n(424),s=n(78968),i=n(54142),r=n(6815),o=n(88593)},54142:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});const a=(0,n(487).F)(500);function s(e){return a.subscribe((()=>{const t=Date.now()-(e.state.callUpdatedAt||0)<=1500;t!==e.state.callUpdated&&e.setState({callUpdated:t})}))}},6815:(e,t,n)=>{function a(e,t){return t?t.$$typeof?"":Array.isArray(t)?t.map((e=>a(0,e))):t:t}function s(e,t){return JSON.stringify({test:e},a)===JSON.stringify({test:t},a)}n.r(t),n.d(t,{default:()=>s})},88593:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i});var a=n(4757),s=n(33661);function i(e,...t){t&&t.length&&t.forEach((t=>{(0,a.b)(t)?t.next(e):(0,s.m)(t)&&t(e)}))}},7087:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(2784),s=n(24313),i=n(28515),r=n(14028),o=n(52322);function l({children:e,className:t="",isCentered:n}){return(0,o.jsxs)(c,{className:`${t} ui--Button-Group ${n?"isCentered":""}`,children:[e,(0,o.jsx)("div",{className:"clear"})]})}const c=r.z.div`
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
`,u=a.memo(l);function d({activeOnEnter:e,children:t,className:n="",dataTestId:r="",icon:l,isBasic:c,isBusy:u,isCircular:d,isDisabled:h,isFull:p,isIcon:g,isSelected:f,isToplevel:b,label:v,onClick:x,isReadOnly:A=!x,onMouseEnter:w,onMouseLeave:y,tabIndex:j,withoutLink:k}){const N=(0,a.useCallback)((()=>{!u&&!h&&x&&Promise.resolve(x()).catch(console.error)}),[u,h,x]),C=(0,a.useCallback)((()=>{w&&Promise.resolve(w()).catch(console.error)}),[w]),E=(0,a.useCallback)((()=>{y&&Promise.resolve(y()).catch(console.error)}),[y]),S=(0,a.useCallback)((e=>{u||h||"Enter"!==e.key||x&&Promise.resolve(x()).catch(console.error)}),[u,h,x]);return(0,a.useEffect)((()=>(e&&window.addEventListener("keydown",S,!0),()=>{e&&window.removeEventListener("keydown",S,!0)})),[e,S]),(0,o.jsxs)(m,{className:`${n} ui--Button ${v?"hasLabel":""} ${c?"isBasic":""} ${d?"isCircular":""} ${p?"isFull":""} ${g?"isIcon":""} ${u||h?"isDisabled":""} ${u?"isBusy":""} ${A?"isReadOnly":""}${f?"isSelected":""} ${b?"isToplevel":""} ${k?"withoutLink":""}`,"data-testid":r,onClick:N,onMouseEnter:C,onMouseLeave:E,tabIndex:j,children:[l&&(0,o.jsx)(s.Z,{icon:l}),v,t,u&&(0,o.jsx)(i.Z,{className:"ui--Button-spinner",variant:"cover"})]})}const m=r.z.button`
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
`,h=a.memo(d);h.Group=u;const p=h},21507:(e,t,n)=>{n.d(t,{Z:()=>h});var a=n(2784),s=n(25650),i=n(67557),r=n(1346),o=n(91220),l=n(14028),c=n(52322);function u({allowAdd:e=!1,children:t,className:n="",defaultValue:o,dropdownClassName:l,isButton:u,isDisabled:m,isError:h,isFull:p,isMultiple:g,label:f,labelExtra:b,onAdd:v,onBlur:x,onChange:A,onClose:w,onSearch:y,options:j,placeholder:k,renderLabel:N,searchInput:C,tabIndex:E,transform:S,value:I,withEllipsis:D,withLabel:B}){const L=(0,a.useRef)(""),[$,V]=(0,a.useState)(),P=(0,a.useCallback)((e=>{const t=JSON.stringify({v:e});L.current!==t&&(L.current=t,V(e),A&&A(S?S(e):e))}),[A,S]);(0,a.useEffect)((()=>{P((0,r.o)(I)?o:I)}),[P,o,I]);const Z=(0,a.useCallback)(((e,{value:t})=>v&&v(t)),[v]),T=(0,a.useCallback)(((e,{value:t})=>P(t)),[P]),z=(0,c.jsx)(s.Z,{allowAdditions:e,button:u,className:l,compact:u,disabled:m,error:h,floating:u,multiple:g,onAddItem:Z,onBlur:x,onChange:T,onClose:w,options:j,placeholder:k,renderLabel:N,search:y||e,searchInput:C,selection:!0,tabIndex:E,value:$});return u?(0,c.jsxs)(i.Z.Group,{children:[z,t]}):(0,c.jsxs)(d,{className:`${n} ui--Dropdown`,isFull:p,label:f,labelExtra:b,withEllipsis:D,withLabel:B,children:[z,t]})}const d=(0,l.z)(o.Z)`
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
`,m=a.memo(u);m.Header=s.Z.Header;const h=m},93323:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(2784),s=n(99022),i=n(24313),r=n(14028),o=n(52322);function l({children:e,className:t="",icon:n="edit",onClick:a}){return(0,o.jsxs)(c,{className:`${t} ui--EditButton`,onClick:a,children:[e,(0,o.jsx)("span",{className:"editSpan",children:(0,o.jsx)(i.Z,{className:"icon-button",icon:n})})]})}const c=r.z.div`
  cursor: pointer;

  .ui--Icon.icon-button {
    color: ${s.Iv};
    cursor: pointer;
    margin: 0 0 0 0.5rem;
  }

  .editSpan {
    white-space: nowrap;
  }
`,u=a.memo(l)},40972:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(2784),s=n(56120),i=n(52322);function r(e="<unknown>"){return(0,i.jsx)(i.Fragment,{children:e.split("\n").map(((e,t)=>(0,i.jsx)("div",{children:e},t)))})}class o extends a.Component{state={error:null,prevTrigger:null};static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps({trigger:e},{prevTrigger:t}){const n=JSON.stringify({trigger:e});return t!==n?{error:null,prevTrigger:n}:null}componentDidCatch(e){const{doThrow:t,onError:n}=this.props;if(n&&n(),t)throw e}render(){const{children:e,error:t,t:n}=this.props,{error:a}=this.state,s=t||a;return s?(0,i.jsxs)("article",{className:"error extraMargin",children:[(0,i.jsx)("p",{children:n("Uncaught error. Something went wrong with the query and rendering of this component. Please supply all the details below when logging an issue, it may help in tracing the cause.")}),(0,i.jsx)("p",{children:s.message}),r(s.stack)]}):e}}const l=(0,s.Z)(o)},24313:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(81674),s=n(9725),i=n(49929),r=n(2784),o=n(14028),l=n(52322);function c({className:e="",color:t="normal",icon:n,isPadded:a,isSpinning:s,onClick:i,size:r="1x",tooltip:o}){const c={"data-testid":n,...o?{"data-for":o,"data-tip":!0}:{}};return(0,l.jsx)(u,{...c,className:`${e} ui--Icon ${t}Color${i?" isClickable":""}${a?" isPadded":""}`,icon:n,onClick:i,size:r,spin:s,tabIndex:-1})}a.vI.add(s.mRB);const u=(0,o.z)(i.G)`
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
`,d=r.memo(c)},4197:(e,t,n)=>{n.d(t,{ZP:()=>m,nk:()=>c});var a=n(2784),s=n(46340),i=n(33661),r=n(1346),o=n(91220),l=n(52322);const c=["Alt","Meta","Control"];let u=0;function d({autoFocus:e=!1,children:t,className:n,defaultValue:c,icon:d,inputClassName:m,isAction:h=!1,isDisabled:p=!1,isDisabledError:g=!1,isEditable:f=!1,isError:b=!1,isFull:v=!1,isHidden:x=!1,isInPlaceEditor:A=!1,isLoading:w=!1,isReadOnly:y=!1,isWarning:j=!1,label:k,labelExtra:N,max:C,maxLength:E,min:S,name:I,onBlur:D,onChange:B,onEnter:L,onEscape:$,onKeyDown:V,onKeyUp:P,onPaste:Z,placeholder:T,tabIndex:z,type:F="text",value:M,withEllipsis:H,withLabel:R}){const[U]=(0,a.useState)((()=>`in_${u++}_at_${Date.now()}`)),[q]=(0,a.useState)((()=>c));(0,a.useEffect)((()=>{q&&B&&B(q)}),[q,B]);const O=(0,a.useCallback)((()=>D&&D()),[D]),W=(0,a.useCallback)((({target:e})=>B&&B(e.value)),[B]),Q=(0,a.useCallback)((e=>V&&V(e)),[V]),K=(0,a.useCallback)((e=>{P&&P(e),!L||"Enter"!==e.key&&13!==e.keyCode||(e.target.blur(),(0,i.m)(L)&&L()),!$||"Escape"!==e.key&&27!==e.keyCode||(e.target.blur(),$())}),[L,$,P]),G=(0,a.useCallback)((e=>Z&&Z(e)),[Z]);return(0,l.jsx)(o.Z,{className:n,isFull:v,label:k,labelExtra:N,withEllipsis:H,withLabel:R,children:(0,l.jsxs)(s.Z,{action:h,autoFocus:e,className:[f?"ui--Input edit icon":"ui--Input",A?"inPlaceEditor":"",w?"--tmp":"",m||"",j&&!b?"isWarning":""].join(" "),defaultValue:(0,r.o)(M)?c||"":void 0,disabled:p||w,error:!p&&b||g,hidden:x,iconPosition:(0,r.o)(d)?void 0:"left",id:I,max:C,maxLength:E,min:S,name:I||U,onBlur:O,onChange:W,onKeyDown:Q,onKeyUp:K,placeholder:T,readOnly:y,tabIndex:z,type:F,value:M,children:[(0,l.jsx)("input",{autoCapitalize:"off",autoComplete:"password"===F?"new-password":"off",autoCorrect:"off","data-testid":k,onPaste:G,spellCheck:!1}),f&&(0,l.jsx)("i",{className:"edit icon"}),d,t]})})}const m=a.memo(d)},94586:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92730),i=n(1346),r=n(51833),o=n(52322);function l({autoFocus:e,children:t,className:n="",defaultValue:l,isDisabled:c,isError:u,isFull:d,isLoading:m,isWarning:h,isZeroable:p,label:g,labelExtra:f,maxValue:b,onChange:v,onEnter:x,onEscape:A,placeholder:w,siDecimals:y,siSymbol:j,value:k,withEllipsis:N,withLabel:C,withMax:E}){const{defaultValue:S,siDefault:I}=(0,a.useMemo)((()=>function(e,t=!1,n){if(!e)return{};const a=(0,s.a)(e,{decimals:(0,i.o)(n)?s.a.getDefaults().decimals:n,forceUnit:"-",withAll:!0,withSi:!1,withZero:!1});return{defaultValue:t?`${a}.`.split(".").slice(0,2).map(((e,t)=>t?e.padEnd(4,"0"):e)).join("."):a.replace(/,/g,""),siDefault:s.a.findSi("-")}}(l,c,y)),[l,c,y]);return(0,o.jsx)(r.Z,{autoFocus:e,bitLength:128,className:`${n} ui--InputBalance`,defaultValue:S,isDisabled:c,isError:u,isFull:d,isLoading:m,isSi:!0,isWarning:h,isZeroable:p,label:g,labelExtra:f,maxValue:b,onChange:v,onEnter:x,onEscape:A,placeholder:w,siDecimals:y,siDefault:I,siSymbol:j,value:k,withEllipsis:N,withLabel:C,withMax:E,children:t})}const c=a.memo(l)},51833:(e,t,n)=>{n.d(t,{Z:()=>j,k:()=>g});var a=n(2784),s=n(92529),i=n(95292),r=n(48801),o=n.n(r),l=n(1346),c=n(92730),u=n(6485),d=n(4197),m=n(14028),h=n(56120),p=n(52322);class g{static abbr="Unit";static setAbbr(e=g.abbr){g.abbr=e}}function f(e){return i.um.pow(new(o())(e||32)).isub(i.If)}function b(e,t){return new RegExp(e?`^${t?"-?":""}(0|[1-9]\\d*)(\\.\\d*)?$`:`^${t?"-?":""}(0|[1-9]\\d*)$`)}function v(e,t,n,a,s){return!(!n&&e.lt(i.nw)||e.gt(f(t))||!a&&e.isZero()||e.bitLength()>(t||32)||s&&s.gtn(0)&&e.gt(s))}function x(e,t,n,a,s,r,u,d){const[m,h,p]=function(e,t){if(!e)return[i.nw,0,0];const n=(0,l.o)(t)?c.a.getDefaults().decimals:t;return[new(o())(n+e.power),n,e.power]}(n,d),g=t.match(/^(\d+)\.(\d+)$/);let f;if(g){p-g[2].length<-h&&(f=new(o())(-1));const n=new(o())(t.replace(/\.\d*$/,"")),a=t.replace(/^\d+\./,"").substring(0,e.registry.chainDecimals[0]),s=new(o())(a);f=n.mul(i.aP.pow(m)).add(s.mul(i.aP.pow(new(o())(h+p-a.length))))}else f=new(o())(t.replace(/[^\d]/g,"")).mul(i.aP.pow(m)).muln(s&&t.startsWith("-")?-1:1);return[f,v(f,a,s,r,u)]}function A(e,t,n,a,s,i,r,o){return[t,...x(e,t,n,a,s,i,r,o)]}function w({autoFocus:e,bitLength:t=32,children:n,className:r="",defaultValue:m,isDecimal:v,isDisabled:x,isError:w=!1,isFull:j,isLoading:k,isSi:N,isSigned:C=!1,isWarning:E,isZeroable:S=!0,label:I,labelExtra:D,maxLength:B,maxValue:L,onChange:$,onEnter:V,onEscape:P,placeholder:Z,siDecimals:T,siDefault:z,siSymbol:F,value:M}){const{t:H}=(0,h.$)(),{api:R}=(0,s.h)(),[U]=(0,a.useState)((()=>N?z||c.a.findSi("-"):null)),[[q,O,W],Q]=(0,a.useState)((()=>function(e,t=i.nw,n,a,s,r,d,m){return(0,u.H)(t)?function(e,t,n,a,s){const r=(0,l.o)(s)?c.a.getDefaults().decimals:s;return[t?e.div(i.aP.pow(new(o())(r+t.power))).toString():e.toString(),e,!(!a&&!n)||e.gt(i.nw)]}(t,n,s,r,m):A(e,t,n,a,s,r,d,m)}(R,M||m,U,t,C,S,L,T))),[K,G]=(0,a.useState)(!1);(0,a.useEffect)((()=>{$&&$(W?O:void 0)}),[W,$,O]);const J=(0,a.useCallback)(((e,n)=>Q(A(R,e,n,t,C,S,L,T))),[R,t,C,S,L,T]),Y=(0,a.useCallback)((e=>J(e,U)),[J,U]);(0,a.useEffect)((()=>{m&&Y(m.toString())}),[Y,m]);const X=(0,a.useCallback)((e=>{if(d.nk.includes(e.key))G(!0);else if(1===e.key.length&&!K){const{selectionEnd:t,selectionStart:n,value:a}=e.target,s=`${a.substring(0,n||0)}${e.key}${a.substring(t||0)}`;b(v||!!U,C).test(s)||e.preventDefault()}}),[v,K,C,U]),_=(0,a.useCallback)((e=>{d.nk.includes(e.key)&&G(!1)}),[]),ee=(0,a.useCallback)((e=>{const{value:t}=e.target;b(v||!!U,C).test(t)||e.preventDefault()}),[v,C,U]),te=f(t).toString().length;return(0,p.jsxs)(y,{autoFocus:e,className:`${r} ui--InputNumber ${x?"isDisabled":""}`,isDisabled:x,isError:!W||w,isFull:j,isLoading:k,isWarning:E,label:I,labelExtra:D,maxLength:B||te,onChange:Y,onEnter:V,onEscape:P,onKeyDown:X,onKeyUp:_,onPaste:ee,placeholder:Z||H(C?"Valid number":"Positive number"),type:"text",value:q,children:[U&&(0,p.jsx)("div",{className:"siUnit",children:F||g.abbr}),n]})}const y=(0,m.z)(d.ZP)`
  .siUnit {
    bottom: 0.85rem;
    color: var(--color-label);
    font-size: var(--font-size-tiny);
    font-weight: var(--font-weight-label);
    position: absolute;
    font-weight: var(--font-weight-bold);
    right: 1.25rem;
  }
`,j=a.memo(w)},82242:(e,t,n)=>{n.d(t,{Z:()=>f});var a=n(2784),s=n(23729),i=n.n(s),r=n(82740),o=n(21507),l=n(14028),c=n(52322);function u(e){return{key:e,text:e,value:e}}const d=(i().get("tags")||["Default"]).sort(),m=d.map(u);function h(e){d.push(e),m.push(u(e)),function(e){i().set("tags",e.sort())}(d)}function p({allowAdd:e=!0,className:t="",defaultValue:n,isDisabled:s,isError:i,label:o,onBlur:l,onChange:u,onClose:d,placeholder:p,searchInput:f,value:b,withLabel:v}){const{theme:x}=(0,a.useContext)(r.Ni);return(0,c.jsx)(g,{allowAdd:e&&!s,className:`${t} ui--InputTags ${x}Theme`,defaultValue:n,isDisabled:s,isError:i,isMultiple:!0,label:o,onAdd:h,onBlur:l,onChange:u,onClose:d,options:m,placeholder:p,searchInput:f,value:b,withLabel:v})}const g=(0,l.z)(o.Z)`
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
`,f=a.memo(p)},91220:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(14028),i=n(52322);const r=(0,i.jsx)("div",{children:" "});function o({children:e,className:t="",isFull:n,isHidden:a,isOuter:s,isSmall:o,label:c=r,labelExtra:u,withEllipsis:d,withLabel:m=!0}){return a?null:m?(0,i.jsxs)(l,{className:`${t} ui--Labelled ${o?"isSmall":""} ${n?"isFull":""} ${s?"isOuter":""}`,children:[(0,i.jsx)("label",{children:d?(0,i.jsx)("div",{className:"withEllipsis",children:c}):c}),u&&(0,i.jsx)("div",{className:"labelExtra",children:u}),(0,i.jsx)("div",{className:"ui--Labelled-content",children:e})]}):(0,i.jsx)("div",{className:t,children:e})}const l=s.z.div`
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
`,c=a.memo(o)},15108:(e,t,n)=>{n.d(t,{Z:()=>E});var a=n(2784),s=n(28316),i=n(82740),r=n(70681),o=n(40972),l=n(14028),c=n(7087),u=n(52322);function d({children:e,className:t=""}){return(0,u.jsx)(m,{className:`${t} ui--Modal-Actions`,children:(0,u.jsx)(c.Z.Group,{children:e})})}const m=l.z.div`
  background-color: var(--bg-input);
  border-radius: 0 0 4px 4px;

  .ui--Button-Group {
    margin: 1rem 1rem;
  }
`,h=a.memo(d);function p({align:e="left",children:t,className:n="",hint:a}){return(0,u.jsxs)(g,{className:`${n} ui--Modal-Columns ${e}Align`,children:[(0,u.jsx)("div",{className:"ui--Modal-Columns-content",children:t}),a&&(0,u.jsx)("div",{className:"ui--Modal-Columns-hint",children:a})]})}const g=l.z.div`
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
`,f=a.memo(p);function b({children:e,className:t=""}){return(0,u.jsx)(v,{className:`${t} ui--Modal-Content`,children:e})}const v=l.z.div`
  padding: 1.5rem;
`,x=a.memo(b);function A({className:e="",header:t,onClose:n}){return(0,u.jsxs)(w,{className:`${e} ui--Modal-Header`,children:[t&&(0,u.jsx)("h1",{children:t}),(0,u.jsx)(c.Z,{dataTestId:"close-modal",icon:"times",onClick:n})]})}const w=l.z.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem 0;
`,y=a.memo(A);function j({children:e,className:t="",header:n,onClose:i,size:l="medium",testId:c="modal"}){const{themeClassName:d}=(0,r.F)(),m=(0,a.useCallback)((e=>{"Escape"!==e.key&&27!==e.keyCode||i()}),[i]);return(0,a.useEffect)((()=>(window.addEventListener("keydown",m,!0),()=>{window.removeEventListener("keydown",m,!0)})),[m]),(0,s.createPortal)((0,u.jsxs)(N,{className:`${t} ui--Modal ${l}Size ${d} `,"data-testid":c,children:[(0,u.jsx)(k,{}),(0,u.jsx)("div",{className:"ui--Modal__overlay",onClick:i}),(0,u.jsxs)("div",{className:"ui--Modal__body",children:[(0,u.jsx)(y,{header:n,onClose:i}),(0,u.jsx)(o.Z,{children:e})]})]}),document.body)}const k=(0,i.vJ)(["body{overflow:hidden;}"]),N=l.z.div`
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
`,C=a.memo(j);C.Actions=h,C.Columns=f,C.Content=x;const E=C},94031:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(2784),s=n(7840),i=n(93323),r=n(4197),o=n(14028),l=n(95350),c=n(52322);function u({address:e,buttons:t,children:n,className:o="",defaultName:u,details:m,icon:h,iconInfo:p,isDisabled:g,isEditableName:f,isEditableTags:b,isInline:v,isShortAddr:x=!0,name:A,onChangeName:w,onChangeTags:y,onSaveName:j,onSaveTags:k,tags:N}){const[C,E]=(0,s.O)(),[S,I]=(0,s.O)(),D=(0,a.useCallback)((()=>{j&&j(),E()}),[j,E]);return(0,c.jsxs)(d,{className:`${o} ui--Row ${g?"isDisabled":""} ${v?"isInline":""}`,children:[(0,c.jsxs)("div",{className:"ui--Row-base",children:[h&&(0,c.jsxs)("div",{className:"ui--Row-icon",children:[h,p&&(0,c.jsx)("div",{className:"ui--Row-icon-info",children:p})]}),(0,c.jsxs)("div",{className:"ui--Row-details",children:[(A||u)&&(f&&C?(0,c.jsx)(r.ZP,{autoFocus:!0,defaultValue:A||u,isInPlaceEditor:!0,onBlur:D,onChange:w,onEnter:!0,withLabel:!1}):(0,c.jsx)("div",{className:"ui--Row-name",children:f?(0,c.jsx)(i.Z,{onClick:E,children:A||u}):A||u})),e&&(0,c.jsx)("div",{className:"ui--Row-address "+(x?"shortAddr":""),children:e}),m,N&&(0,c.jsx)(l.Z,{className:"ui--Row-tags",isEditable:b,isEditing:S,onChange:y,onSave:k,onToggleIsEditing:I,value:N})]}),t&&(0,c.jsx)("div",{className:"ui--Row-buttons",children:t})]}),n&&(0,c.jsx)("div",{className:"ui--Row-children",children:n})]})}const d=o.z.div`
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
`,m=a.memo(u)},5678:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(7087),i=n(14028),r=n(52322);function o({button:e,children:t,className:n="",dataTestId:a="",onClose:i,position:o,sidebarRef:c}){return(0,r.jsxs)(l,{className:`${n} ui--Sidebar ${o}Position`,"data-testid":a,ref:c,children:[(0,r.jsxs)(s.Z.Group,{className:"ui--Sidebar-buttons",children:[e,(0,r.jsx)(s.Z,{dataTestId:"close-sidebar-button",icon:"times",isBasic:!0,isCircular:!0,onClick:i})]}),t]})}const l=i.z.div`
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
`,c=a.memo(o)},28515:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(14028),i=n(56120),r=n(52322);function o({className:e="",label:t,noLabel:n,variant:a="app"}){const{t:s}=(0,i.$)();return(0,r.jsxs)(l,{className:`${e} ui--Spinner variant-${a}`,children:[(0,r.jsx)("img",{className:"push"===a?"":"highlight--bg highlight--border",src:"data:image/png;base64,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"}),!n&&a.startsWith("app")&&(0,r.jsx)("div",{className:"text",children:t||s("Retrieving data")})]})}const l=s.z.div`
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
`,c=a.memo(o)},62528:(e,t,n)=>{n.d(t,{z:()=>a});const a=["finalitytimeout","finalized","inblock","usurped","dropped","invalid","cancelled","error","sent"]},4463:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(2784),s=n(82740),i=n(14028),r=n(54003),o=n(52322);let l=0;function c({className:e="",color:t="theme",hover:n,label:i,size:c="small"}){const{theme:d}=(0,a.useContext)(s.Ni),[m]=(0,a.useState)((()=>`tag-hover-${Date.now()}-${l++}`));return(0,o.jsxs)(u,{className:`${e} ui--Tag ${t}Color ${c}Size ${d}Theme`,color:t||"grey","data-for":n&&m,"data-tip":!!n,children:[i,n&&(0,o.jsx)(r.Z,{text:n,trigger:m})]})}const u=i.z.div`
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
`,d=a.memo(c)},95350:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(2784),s=n(93323),i=n(82242),r=n(14028),o=n(4463),l=n(56120),c=n(52322);function u({children:e,className:t="",isEditable:n,isEditing:r,onChange:u,onSave:m,onToggleIsEditing:h,value:p,withEditButton:g=!0,withTitle:f}){const{t:b}=(0,l.$)(),v=(0,a.useMemo)((()=>p.length?p.map((e=>(0,c.jsx)(o.Z,{label:e},e))):(0,c.jsx)("div",{children:b("none")})),[b,p]),x=(0,a.useCallback)((()=>{m&&m(),h&&h()}),[m,h]);return(0,c.jsxs)(d,{className:`${t} ui--Tags`,children:[f&&(0,c.jsx)("h5",{children:b("Tags")}),n&&r?(0,c.jsx)(i.Z,{defaultValue:p,onBlur:x,onChange:u,onClose:x,openOnFocus:!0,searchInput:{autoFocus:!1},value:p,withLabel:!1}):n&&g?(0,c.jsx)(s.Z,{className:0===p.length?"center":"left",onClick:h,children:v}):v,e]})}const d=r.z.div`
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
`,m=a.memo(u)},54003:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(2784),s=n(28316),i=n(33710),r=n(14028),o=n(52322);function l({children:e,className:t="",isClickable:n=!1,place:i,text:r,trigger:l}){const[u]=(0,a.useState)("undefined"==typeof document?{}:document.createElement("div"));return(0,a.useEffect)((()=>{const e="undefined"==typeof document?null:document.getElementById("tooltips");return e&&e.appendChild(u),()=>{e&&e.removeChild(u)}}),[u]),(0,s.createPortal)((0,o.jsx)(c,{className:`${t} ui--Tooltip`,clickable:n,effect:"solid",id:l,place:i,children:(0,o.jsxs)("div",{className:"tooltipSpacer",children:[r,e]})}),u)}const c=(0,r.z)(i.Z)`
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
`,u=a.memo(l)},81204:(e,t,n)=>{n.d(t,{Z:()=>a});const a={}},49668:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(24991),s=n(42754),i=n(61349),r=n(16039),o=n(2453),l=n(81204);const c={},u=new s.Z;u.addDetector({lookup:()=>{const e=r.X.i18nLang;return e===o.cr?void 0:e},name:"i18nLangDetector"}),a.ZP.use(u).use(i.Db).use(class{type="backend";static type="backend";async read(e,t,n){if(l.Z[e])return n(null,l.Z[e]);c[e]||(c[e]=this.createLoader(e));const[a,s]=await c[e];return n(a,s)}async createLoader(e){try{const t=await fetch(`locales/${e}/translation.json`,{});return t.ok?(l.Z[e]=await t.json(),[null,l.Z[e]]):[`i18n: failed loading ${e}`,t.status>=500&&t.status<600]}catch(e){return[e.message,!1]}}}).init({backend:{},debug:!1,detection:{order:["i18nLangDetector","navigator"]},fallbackLng:!1,interpolation:{escapeValue:!1,prefix:"{{",suffix:"}}"},keySeparator:!1,load:"languageOnly",ns:["apps","apps-config","apps-electron","apps-routing","app-accounts","app-claims","app-contracts","app-council","app-democracy","app-explorer","app-extrinsics","app-generic-asset","app-js","app-parachains","app-poll","app-rpc","app-settings","app-signing","app-society","app-staking","app-storage","app-sudo","app-tech-comm","app-treasury","react-api","react-components","react-hooks","react-params","react-query","react-signer","translation"],nsSeparator:!1,react:{useSuspense:!0},returnEmptyString:!1,returnNull:!1}).catch((e=>console.log("i18n: failure",e))),r.X.on("change",(e=>{a.ZP.changeLanguage(e.i18nLang===o.cr?a.ZP.services.languageDetector.detect():e.i18nLang).catch(console.error)}));const d=a.ZP},61397:(e,t,n)=>{n.d(t,{RV:()=>T,hl:()=>Le,ax:()=>at,mV:()=>ct,N:()=>gt,Kc:()=>kt,jb:()=>Et,Ct:()=>k,RN:()=>Lt,zx:()=>de.Z,Ig:()=>_t,Uv:()=>tn,Zb:()=>sn,Jy:()=>fn,Mj:()=>yn,H_:()=>Cn,kL:()=>Gn,XZ:()=>Xn,P0:()=>ia,v:()=>da,qi:()=>Qt,lK:()=>Q,Lt:()=>la.Z,ML:()=>ga,SV:()=>Un.Z,ju:()=>va,Vh:()=>Tl,xH:()=>ne,n0:()=>os,n6:()=>Bs,HS:()=>Ul,lm:()=>Vs,WN:()=>zs,u5:()=>qs,JO:()=>v.Z,JH:()=>Qs,k:()=>Je,Kd:()=>Js,II:()=>fa.ZP,rp:()=>Ii,m3:()=>Ti,bm:()=>Mi,H:()=>Hi.Z,$q:()=>Ji,eV:()=>ir,UT:()=>bs,ht:()=>gr,Rn:()=>fr.Z,iQ:()=>Cr,nU:()=>Pr,RF:()=>Fr,R2:()=>si,__:()=>se,ob:()=>Ur,jN:()=>Kt.Z,NR:()=>Kr,oy:()=>Yr,Pd:()=>Dt,v2:()=>uo,u_:()=>Fs.Z,EK:()=>po,r_:()=>ei,f:()=>No,ro:()=>fo,YV:()=>wo,GI:()=>Ro,Ex:()=>hn,lV:()=>qo,iH:()=>a.r_,K0:()=>a.K0,CU:()=>a.CU,lB:()=>a.lB,YE:()=>Oo.Z,ak:()=>Ml,$j:()=>ka.Z,d4:()=>Qo,by:()=>fe,JM:()=>we,qG:()=>Jt,qb:()=>el,Ty:()=>al,iA:()=>as,mQ:()=>vl,mO:()=>gl,Vp:()=>Ps.Z,$G:()=>xl.Z,Kx:()=>Vl,ZD:()=>vt,tX:()=>kl,u:()=>A.Z,cA:()=>he,UE:()=>Cl,xb:()=>Bl,zo:()=>x.z});var a=n(63684),s=n(2784),i=n(52322),r=n(91295),o=n(48963),l=n(28444),c=n(1957),u=n(64021),d=n(24107),m=n(65417),h=n(38628),p=n(14681),g=n(16737),f=n(33661),b=n(70681),v=n(24313),x=n(14028),A=n(54003);let w=0;function y({className:e="",color:t="normal",hover:n,hoverAction:a,icon:r,info:o,isBlock:l,isSmall:c,onClick:u}){const d=(r?`${r}-`:"")+"badge",{theme:m}=(0,b.F)(),[h]=(0,s.useState)((()=>`${d}-hover-${Date.now()}-${w++}`)),p=n?{"data-for":h,"data-tip":!0}:{},g="highlight"===t,f=(0,s.useMemo)((()=>(0,i.jsxs)("div",{className:"hoverContent",children:[(0,i.jsx)("div",{children:n}),a&&(0,i.jsx)("a",{className:`${t}Color`,onClick:u,children:a})]})),[t,n,a,u]);return(0,i.jsxs)(j,{...p,className:`${e} ui--Badge ${n?"isTooltip":""} ${l?"isBlock":""} ${c?"isSmall":""} ${u?"isClickable":""} ${g?"highlight--bg":""} ${t}Color ${r?"withIcon":""} ${o?"withInfo":""} ${a?"withAction":""} ${m}Theme`,"data-testid":d,onClick:a?void 0:u,children:[(0,i.jsxs)("div",{className:g?"highlight--color-contrast":"",children:[r&&(0,i.jsx)(v.Z,{icon:r}),o,a&&(0,i.jsx)(v.Z,{className:"action-icon",icon:"chevron-right"})]}),n&&(0,i.jsx)(A.Z,{className:"accounts-badge",isClickable:!!a,text:f,trigger:h})]})}const j=x.z.div`
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
`,k=s.memo(y);var N=n(21009);function C(e,t){const n=o.default.createType("AccountId",(0,u.d)(e.padEnd(32,"\0")));return e=>n.eq(e)?t:null}function E(e,t,n){const a=(0,u.d)(e),s=a.length+4;return e=>{const i=(0,d.c)(e)?e.toU8a():o.default.createType("AccountId",e).toU8a();return i.length>=s&&(0,m.S)(a,i.subarray(0,a.length))&&(0,h.S)(i.subarray(s))?`${t} ${(0,p.u)((0,g._)(i.subarray(a.length,s)))}${n?` (${n})`:""}`:null}}const S=[C("modlpy/socie","Society"),C("modlpy/trsry","Treasury"),C("modlpy/xcmch","XCM"),E("modlpy/cfund","Crowdloan"),E("modlpy/npols\0","Pool","Stash"),E("modlpy/npols","Pool","Reward"),E("modlpy/nopls\0","Pool","Stash"),E("modlpy/nopls","Pool","Reward"),E("para","Parachain"),E("sibl","Sibling")],I=new Map,D=new Map,B=new Map;function L(e="",t,n){let a=null;for(let e=0;null===a&&e<S.length;e++)a=S[e](t);if(a)return[a,!1,!1,!0];const s=t.toString();if(!s)return[e,!1,!1,!1];const[i,,r]=(0,N.s2)(s,null,e),o=(n||"").toString()||D.get(s);return i&&o?(D.set(s,o),[o,!1,!0,!1]):[r,!i,i,!1]}function $(e="",t,n){const[a,,s]=L(e,t,n);return s?(0,i.jsx)("span",{className:"isAddress",children:a}):a}function V(e,t,n){const a=I.get(e);if(a)return a;const[s,r,o,l]=L(n,e,t);return(0,i.jsxs)("span",{className:"via-identity",children:[l&&(0,i.jsx)(k,{color:"green",icon:"archway",isSmall:!0}),(0,i.jsx)("span",{className:"name"+(r||l?" isLocal":o?" isAddress":""),children:s})]})}function P({children:e,className:t="",defaultName:n,label:a,onClick:o,override:u,toggle:d,value:m,withSidebar:h}){const p=(0,l.J)(),g=(0,c.Y)(m),[b,v]=(0,s.useState)((()=>V((m||"").toString(),void 0,n))),x=(0,s.useContext)(r.d);(0,s.useEffect)((()=>{var e;const{accountId:t,accountIndex:a,identity:s,nickname:r}=g||{},o=(t||m||"").toString();null!=s&&s.parent&&B.set(o,s.parent.toString()),p&&(0,f.m)(null==(e=p.query.identity)?void 0:e.identityOf)?v((()=>null!=s&&s.display?function(e,t){const n=t.judgements.filter((([,e])=>!e.isFeePaid)),a=n.some((([,e])=>e.isKnownGood||e.isReasonable)),s=n.some((([,e])=>e.isErroneous||e.isLowQuality)),r=a?t.display:(t.display||"").replace(/[^\x20-\x7E]/g,""),o=t.displayParent&&(a?t.displayParent:t.displayParent.replace(/[^\x20-\x7E]/g,"")),l=(c=(0,i.jsxs)("span",{className:"name"+(a&&!s?" isGood":""),children:[(0,i.jsx)("span",{className:"top",children:o||r}),o&&(0,i.jsx)("span",{className:"sub",children:`/${r||""}`})]}),u=s?"red":a?"green":"gray",d=t.parent?"link":a&&!s?"check":"minus",(0,i.jsxs)("span",{className:"via-identity",children:[(0,i.jsx)(k,{color:u,icon:d,isSmall:!0}),c]}));var c,u,d;return I.set(e,l),l}(o,s):V(o,a))):v(r||$(n,o,a))}),[p,n,g,d,m]);const A=(0,s.useCallback)((()=>v($(n,(m||"").toString()))),[n,m]),w=(0,s.useCallback)((()=>x&&m&&x([m.toString(),A])),[A,x,m]);return(0,i.jsxs)(Z,{className:`${t}  ui--AccountName ${h?"withSidebar":""}`,"data-testid":"account-name",onClick:h?w:o,children:[a||"",u||b,e]})}const Z=x.z.span`
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
`,T=s.memo(P);var z=n(79136),F=n(65182),M=n(76277),H=n(67738),R=n(82671),U=n(95292),q=n(92730),O=n(52107);function W({accountId:e,className:t="",label:n=""}){const[a,r]=(0,s.useState)("unknown");return(0,s.useEffect)((()=>{const t=(0,N.C9)(e);"unknown"!==t&&r(t)}),[e]),(0,i.jsxs)("div",{className:`${t} ui--CryptoType`,children:[n,a]})}const Q=s.memo(W);var K=n(56120);let G=0;function J({className:e="",value:t}){const{t:n}=(0,K.$)(),a=(0,F.C)(),[r]=(0,s.useState)((()=>`${Date.now()}-democracy-locks-${++G}`)),[{maxBalance:o,sorted:l},c]=(0,s.useState)({maxBalance:U.nw,sorted:[]});return(0,s.useEffect)((()=>{a&&c((e=>{const s=function(e,t,n=[]){return{maxBalance:(0,O.x)(...n.map((({balance:e})=>e)).filter((e=>!!e))),sorted:n.map((e=>[e,e.unlockAt&&e.unlockAt.gt(t)?e.unlockAt.sub(t):U.nw])).sort(((e,t)=>(e[0].referendumId||U.nw).cmp(t[0].referendumId||U.nw))).sort(((e,t)=>e[1].cmp(t[1]))).sort(((e,t)=>e[0].isFinished===t[0].isFinished?0:e[0].isFinished?-1:1)).reduce(((t,[{balance:n,isDelegated:a,isFinished:s=!1,referendumId:r,vote:o},l])=>{var c;const u=l.gt(U.nw),d=r&&o?(0,i.jsxs)("div",{children:["#",r.toString()," ",(0,q.a)(n,{forceUnit:"-"})," ",null==(c=o.conviction)?void 0:c.toString(),a&&"/d"]}):(0,i.jsx)("div",{children:e("Prior locked voting")}),m=t.length?t[t.length-1]:null;return!m||u||s!==m.isFinished?t.push({details:(0,i.jsx)("div",{className:"faded",children:u?(0,i.jsx)(H.Z,{label:`${e("{{blocks}} blocks",{replace:{blocks:(0,p.u)(l)}})}, `,value:l}):e(s?"lock expired":"ongoing referendum")}),headers:[d],isCountdown:u,isFinished:s}):m.headers.push(d),t}),[])}}(n,a,t);return e.sorted.length!==s.sorted.length||e.sorted.some(((e,t)=>e.headers.length!==s.sorted[t].headers.length))?s:e}))}),[a,n,t]),l.length?(0,i.jsxs)(Y,{className:e,children:[(0,i.jsx)(M.Z,{labelPost:(0,i.jsx)(v.Z,{icon:"clock",tooltip:r}),value:o}),(0,i.jsx)(A.Z,{trigger:r,children:l.map((({details:e,headers:t},n)=>(0,i.jsxs)("div",{className:"row",children:[t.map(((e,t)=>(0,i.jsx)("div",{children:e},t))),(0,i.jsx)("div",{className:"faded",children:e})]},n)))})]}):null}const Y=x.z.div`
  white-space: nowrap;

  .ui--FormatBalance {
    display: inline-block;
  }
`,X=s.memo(J);var _=n(7840);function ee({children:e,className:t="",isHeader:n,isLeft:a,isOpen:r,isPadded:o,onClick:l,renderChildren:c,summary:u,summaryHead:d,summaryMeta:m,summarySub:h,withBreaks:p,withHidden:g}){const[f,b]=(0,_.O)(r,l),x=(0,s.useMemo)((()=>f&&c&&c()),[f,c]),[A,w]=(0,s.useMemo)((()=>function(e){if(!e||!e.docs.length)return null;const t=e.docs.map((e=>e.toString().trim())),n=t.findIndex((e=>!e.length)),a=(s=(-1===n?t:t.slice(0,n)).join(" ").replace(/#(<weight>| <weight>).*<\/weight>/,"").replace(/\\/g,"").replace(/`/g,""),["[","]"].reduce(((e,t)=>function(e,t){return e.reduce(((e,n)=>n.split(t).reduce(((e,t)=>e.concat(t)),e)),[])}(e,t)),[s]));var s;return[a[0].split(/[.(]/)[0],(0,i.jsxs)(i.Fragment,{children:[a.map(((e,t)=>t%2?(0,i.jsxs)("em",{children:["[",e,"]"]},t):(0,i.jsx)("span",{children:e},t)))," "]})]}(m)||[h,h]),[m,h]),y=(0,s.useMemo)((()=>!!c||!!e&&(!Array.isArray(e)||0!==e.length)),[e,c]),j=(0,s.useMemo)((()=>(0,i.jsx)(v.Z,{color:y?void 0:"transparent",icon:f?"caret-up":"caret-down"})),[y,f]);return(0,i.jsxs)(te,{className:`${t} ui--Expander ${f?"isExpanded":""} ${n?"isHeader":""} ${o?"isPadded":""} ${y?"hasContent":""} ${p?"withBreaks":""}`,children:[(0,i.jsxs)("div",{className:"ui--Expander-summary"+(a?" isLeft":""),onClick:b,children:[a&&j,(0,i.jsxs)("div",{className:"ui--Expander-summary-header",children:[(0,i.jsx)("div",{className:"ui--Expander-summary-title",children:d}),u,w&&(0,i.jsx)("div",{className:"ui--Expander-summary-header-sub",children:f?w:A})]}),!a&&j]}),y&&(f||g)&&(0,i.jsx)("div",{className:"ui--Expander-content",children:e||x})]})}const te=x.z.div`
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
`,ne=s.memo(ee);function ae({className:e="",label:t,withEllipsis:n}){return(0,i.jsx)("label",{className:e,children:n?(0,i.jsx)("div",{className:"withEllipsis",children:t}):t})}const se=s.memo(ae);var ie=n(92529),re=n(13328),oe=n(36856),le=n(96464),ce=n(54782),ue=n(48731),de=n(7087);function me({accountId:e,className:t="",extrinsic:n,icon:a,isBasic:r,isBusy:o,isDisabled:l,isIcon:c,isToplevel:u,isUnsigned:d,label:m,onClick:h,onFailed:p,onSendRef:g,onStart:b,onSuccess:v,onUpdate:x,params:A,tooltip:w,tx:y,withSpinner:j,withoutLink:k}){const{t:N}=(0,K.$)(),C=(0,le.X)(),{queueExtrinsic:E}=(0,ce.L)(),[S,I]=(0,s.useState)(!1),[D,B]=(0,s.useState)(!1);(0,s.useEffect)((()=>{D&&b&&b()}),[D,b]);const L=(0,s.useCallback)((e=>{C.current&&I(!1),p&&p(e)}),[p,I,C]),$=(0,s.useCallback)((e=>{C.current&&I(!1),v&&v(e)}),[v,I,C]),V=(0,s.useCallback)((()=>{C.current&&B(!0)}),[B,C]),P=(0,s.useCallback)((()=>{var t;let a;n?a=Array.isArray(n)?n:[n]:y&&(a=[y(...(0,f.m)(A)?A():A||[])]),(0,ue.hu)(null==(t=a)?void 0:t.length,"Expected generated extrinsic passed to TxButton"),C.current&&j&&I(!0),a.forEach((t=>{E({accountId:e&&e.toString(),extrinsic:t,isUnsigned:d,txFailedCb:j?L:p,txStartCb:V,txSuccessCb:j?$:v,txUpdateCb:x})})),h&&h()}),[L,V,$,e,d,h,p,v,x,A,n,E,I,y,j,C]);return g&&(g.current=P),(0,i.jsx)(de.Z,{className:t,icon:a||"check",isBasic:r,isBusy:o,isDisabled:S||l||!d&&!e||!y&&(Array.isArray(n)?0===n.length:!n),isIcon:c,isToplevel:u,label:m||(c?"":N("Submit")),onClick:P,tooltip:w,withoutLink:k})}const he=s.memo(me),pe={transform:e=>e.isNone?0:e.unwrap().prior.length+1};function ge({className:e="",isPool:t,stakingInfo:n}){var a;const{api:s}=(0,ie.h)(),{allAccounts:r}=(0,re.x)(),{t:o}=(0,K.$)(),l=(0,oe.W7)(s.query.staking.slashingSpans,[null==n?void 0:n.stashId],pe);return null!=n&&null!=(a=n.redeemable)&&a.gtn(0)?(0,i.jsx)("div",{className:e,children:(0,i.jsx)(M.Z,{value:n.redeemable,children:r.includes((n.controllerId||"").toString())?(0,i.jsx)(he,{accountId:n.controllerId,icon:"lock",isIcon:!0,params:t?[n.controllerId,l]:1===s.tx.staking.withdrawUnbonded.meta.args.length?[l]:[],tooltip:o("Withdraw these unbonded funds"),tx:t?s.tx.nominationPools.withdrawUnbonded:s.tx.staking.withdrawUnbonded},"unlock"):(0,i.jsx)("span",{className:"icon-void",children:" "})})}):null}const fe=s.memo(ge);var be=n(48801),ve=n.n(be);function xe({className:e="",iconPosition:t="left",stakingInfo:n}){const{api:a}=(0,ie.h)(),r=(0,oe.W7)(a.derive.session.progress),{t:o}=(0,K.$)(),[l,c]=(0,s.useMemo)((()=>function(e,t){if(null==e||!e.unlocking||!t)return[[],U.nw];const n=e.unlocking.filter((({remainingEras:e,value:t})=>t.gt(U.nw)&&e.gt(U.nw))).map((e=>[e,e.remainingEras,e.remainingEras.sub(U.If).imul(t.eraLength).iadd(t.eraLength).isub(t.eraProgress)])),a=n.reduce(((e,[{value:t}])=>e.iadd(t)),new(ve())(0));return[n,a]}(n,r)),[r,n]);if(!n||!l.length)return null;const u=`${n.accountId.toString()}-unlocking-trigger`;return(0,i.jsxs)(Ae,{className:e,children:["left"===t&&(0,i.jsx)(v.Z,{className:"left",icon:"clock",tooltip:u}),(0,i.jsx)(M.Z,{value:c}),(0,i.jsx)(A.Z,{trigger:u,children:l.map((([{value:e},t,n],s)=>{var r;return(0,i.jsxs)("div",{className:"row",children:[(0,i.jsx)("div",{children:o("Unbonding {{value}}",{replace:{value:(0,q.a)(e,{forceUnit:"-"})}})}),(0,i.jsx)("div",{className:"faded",children:null!=(r=a.consts.babe)&&r.epochDuration?(0,i.jsx)(H.Z,{label:`${o("{{blocks}} blocks",{replace:{blocks:(0,p.u)(n)}})}, `,value:n}):o("{{eras}} eras remaining",{replace:{eras:(0,p.u)(t)}})})]},s)}))}),"right"===t&&(0,i.jsx)(v.Z,{className:"right",icon:"clock",tooltip:u})]})}const Ae=x.z.div`
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
`,we=s.memo(xe),ye={available:!0,bonded:!0,locked:!0,redeemable:!0,reserved:!0,total:!0,unlocking:!0,vested:!0},je={crypto:!0,nonce:!0},ke={unstakeThreshold:!0,validatorPayment:!0};function Ne(){return(0,i.jsx)("span",{className:"icon-void",children:" "})}function Ce(e,t){const n=t.toHuman();try{return e[n]||n}catch(e){return n}}function Ee({stakingInfo:e,withBalance:t=!0,withValidatorPrefs:n=!1}){if(e)return!0;if(!0===t||n)return!1;if((0,R.K)(t)){if(t.unlocking||t.redeemable)return!1;if(t.bonded)return Array.isArray(t.bonded)}return!0}function Se({address:e,balancesAll:t,withExtended:n},a){const s=!0===n?je:n||void 0;return s?(0,i.jsxs)("div",{className:"column",children:[t&&s.nonce&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(se,{label:a("transactions")}),(0,i.jsx)("div",{className:"result",children:(0,p.u)(t.accountNonce)})]}),s.crypto&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(se,{label:a("type")}),(0,i.jsx)(Q,{accountId:e,className:"result"})]})]}):null}function Ie({stakingInfo:e,withValidatorPrefs:t=!1},n){const a=!0===t?ke:t;return a&&e&&e.validatorPrefs?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{}),a.unstakeThreshold&&e.validatorPrefs.unstakeThreshold&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(se,{label:n("unstake threshold")}),(0,i.jsx)("div",{className:"result",children:e.validatorPrefs.unstakeThreshold.toString()})]}),a.validatorPayment&&(e.validatorPrefs.commission||e.validatorPrefs.validatorPayment)&&(e.validatorPrefs.validatorPayment?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(se,{label:n("commission")}),(0,i.jsx)(M.Z,{className:"result",value:e.validatorPrefs.validatorPayment})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(se,{label:n("commission")}),(0,i.jsxs)("span",{children:[(e.validatorPrefs.commission.unwrap().toNumber()/1e7).toFixed(2),"%"]})]}))]}):null}function De(e,t,n,{address:a,balanceDisplay:r,balancesAll:o,bestNumber:l,convictionLocks:c,democracyLocks:u,isAllLocked:d,otherBonded:m,ownBonded:h,stakingInfo:g,votingOf:f,withBalanceToggle:b,withLabel:x}){var w,y,j;const k=[],N=o;if(!b&&r.total&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:x?n("total"):""}),(0,i.jsx)(M.Z,{className:"result "+(o?"":"--tmp"),formatIndex:e,labelPost:(0,i.jsx)(Ne,{}),value:o?o.freeBalance.add(o.reservedBalance):1})]},0)),o&&r.available&&N.availableBalance&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("transferrable")}),(0,i.jsx)(M.Z,{className:"result",formatIndex:e,labelPost:(0,i.jsx)(Ne,{}),value:N.availableBalance})]},1)),l&&r.vested&&null!=N&&N.isVesting){const t=N.vesting.filter((({endBlock:e})=>l.lt(e)));k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("vested")}),(0,i.jsx)(M.Z,{className:"result",formatIndex:e,labelPost:(0,i.jsx)(v.Z,{icon:"info-circle",tooltip:`${a}-vested-trigger`}),value:N.vestedBalance,children:(0,i.jsxs)(A.Z,{trigger:`${a}-vested-trigger`,children:[(0,i.jsxs)("div",{children:[(0,q.a)(N.vestedClaimable,{forceUnit:"-"}),(0,i.jsx)("div",{className:"faded",children:n("available to be unlocked")})]}),t.map((({endBlock:e,locked:t,perBlock:a,vested:s},r)=>(0,i.jsxs)("div",{className:"inner",children:[(0,i.jsxs)("div",{children:[(0,q.a)(s,{forceUnit:"-"}),(0,i.jsx)("div",{className:"faded",children:n("of {{locked}} vested",{replace:{locked:(0,q.a)(t,{forceUnit:"-"})}})})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)(H.Z,{value:e.sub(l)}),(0,i.jsxs)("div",{className:"faded",children:[n("until block")," ",(0,p.u)(e)]})]}),(0,i.jsxs)("div",{children:[(0,q.a)(a),(0,i.jsx)("div",{className:"faded",children:n("per block")})]})]},`item:${r}`)))]})})]},2))}const C=((null==N?void 0:N.namedReserves)||[]).reduce(((e,t)=>e.concat(...t)),[]),E=!!C&&0!==C.length;if(r.locked&&o&&(d||(null==(w=N.lockedBalance)?void 0:w.gtn(0)))&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("locked")}),(0,i.jsx)(M.Z,{className:"result",formatIndex:e,labelPost:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(v.Z,{icon:"info-circle",tooltip:`${a}-locks-trigger`}),(0,i.jsx)(A.Z,{trigger:`${a}-locks-trigger`,children:N.lockedBreakdown.map((({amount:e,id:a,reasons:s},r)=>(0,i.jsxs)("div",{className:"row",children:[null!=e&&e.isMax()?n("everything"):(0,q.a)(e,{forceUnit:"-"}),a&&(0,i.jsx)("div",{className:"faded",children:Ce(t,a)}),(0,i.jsx)("div",{className:"faded",children:s.toString()})]},r)))})]}),value:d?"all":N.lockedBalance})]},3)),r.reserved&&(null==o||null==(y=o.reservedBalance)?void 0:y.gtn(0))&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("reserved")}),(0,i.jsx)(M.Z,{className:"result",formatIndex:e,labelPost:E?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(v.Z,{icon:"info-circle",tooltip:`${a}-named-reserves-trigger`}),(0,i.jsx)(A.Z,{trigger:`${a}-named-reserves-trigger`,children:C.map((({amount:e,id:n},a)=>(0,i.jsxs)("div",{children:[(0,q.a)(e,{forceUnit:"-"}),n&&(0,i.jsx)("div",{className:"faded",children:Ce(t,n)})]},a)))})]}):(0,i.jsx)(Ne,{}),value:o.reservedBalance})]},4)),r.bonded&&(h.gtn(0)||0!==m.length)&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("bonded")}),(0,i.jsx)(M.Z,{className:"result",formatIndex:e,labelPost:(0,i.jsx)(Ne,{}),value:h,children:0!==m.length&&(0,i.jsxs)(i.Fragment,{children:[" (+",m.map(((t,n)=>(0,i.jsx)(M.Z,{formatIndex:e,labelPost:(0,i.jsx)(Ne,{}),value:t},n))),")"]})})]},5)),r.redeemable&&(null==g||null==(j=g.redeemable)?void 0:j.gtn(0))&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("redeemable")}),(0,i.jsx)(fe,{className:"result",stakingInfo:g})]},6)),r.unlocking){if((null==g?void 0:g.unlocking)&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("unbonding")}),(0,i.jsx)("div",{className:"result",children:(0,i.jsx)(we,{iconPosition:"right",stakingInfo:g})})]},7)),u&&0!==u.length)k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("democracy")}),(0,i.jsx)("div",{className:"result",children:(0,i.jsx)(X,{value:u})})]},8));else if(l&&f&&f.isDirect){const{prior:[e,t]}=f.asDirect;t.gt(U.nw)&&e.gt(U.nw)&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("democracy")}),(0,i.jsx)("div",{className:"result",children:(0,i.jsx)(X,{value:[{balance:t,isFinished:l.gt(e),unlockAt:e}]})})]},8))}if(l&&c&&c.length){const e=c.reduce(((e,{total:t})=>(0,O.x)(e,t)),U.nw);k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("referenda")}),(0,i.jsx)(M.Z,{className:"result",labelPost:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(v.Z,{icon:"clock",tooltip:`${a}-conviction-locks-trigger`}),(0,i.jsx)(A.Z,{trigger:`${a}-conviction-locks-trigger`,children:c.map((({endBlock:e,locked:t,refId:a,total:s},r)=>(0,i.jsxs)("div",{className:"row",children:[(0,i.jsxs)("div",{className:"nowrap",children:["#",a.toString()," ",(0,q.a)(s,{forceUnit:"-"})," ",t]}),(0,i.jsx)("div",{className:"faded nowrap",children:e.eq(U.Ew)?n("ongoing referendum"):l.gte(e)?n("lock expired"):(0,i.jsxs)(i.Fragment,{children:[(0,p.u)(e.sub(l))," ",n("blocks"),", ",(0,i.jsx)(H.Z,{isInline:!0,value:e.sub(l)})]})})]},r)))})]}),value:e})]},9))}}return o&&o.accountNonce&&r.nonce&&k.push((0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:n("transactions")}),(0,i.jsxs)("div",{className:"result",children:[(0,p.u)(o.accountNonce),(0,i.jsx)(Ne,{})]})]},10)),b?(0,i.jsx)(s.Fragment,{children:(0,i.jsx)(ne,{className:o?"":"isBlurred",summary:(0,i.jsx)(M.Z,{formatIndex:e,value:o&&o.freeBalance.add(o.reservedBalance)}),children:0!==k.length&&(0,i.jsx)("div",{className:"body column",children:k})})},e):(0,i.jsx)(s.Fragment,{children:k},e)}function Be(e,t,n,a){const{address:s,balancesAll:i,convictionLocks:r,democracyLocks:o,stakingInfo:l,votingOf:c,withBalance:u=!0,withBalanceToggle:d=!1,withLabel:m=!1}=e,h=!0===u?ye:u||!1;if(!h)return[null];const[p,g]=function(e,t){let n=[],a=U.nw;return Array.isArray(t)?(n=t.filter(((e,t)=>0!==t)).filter((e=>e.gt(U.nw))),a=t[0]):e&&e.stakingLedger&&e.stakingLedger.active&&e.accountId.eq(e.stashId)&&(a=e.stakingLedger.active.unwrap()),[a,n]}(l,h.bonded),f={address:s,balanceDisplay:h,bestNumber:n,convictionLocks:r,democracyLocks:o,isAllLocked:!!i&&i.lockedBreakdown.some((({amount:e})=>null==e?void 0:e.isMax())),otherBonded:g,ownBonded:p,votingOf:c,withBalanceToggle:d,withLabel:m},b=[De(0,t,a,{...f,balancesAll:i,stakingInfo:l})];return d&&(null==i?void 0:i.additional.length)&&i.additional.forEach(((e,n)=>{b.push(De(n+1,t,a,{...f,balancesAll:e}))})),b}const Le=(0,z.withMulti)((0,x.z)((function(e){const{t}=(0,K.$)(),n=(0,F.C)(),{children:a,className:r="",extraInfo:o,withBalanceToggle:l,withHexSessionId:c}=e,u=(0,s.useRef)({democrac:t("via Democracy/Vote"),phrelect:t("via Council/Vote"),pyconvot:t("via Referenda/Vote"),"staking ":t("via Staking/Bond"),"vesting ":t("via Vesting")});return(0,i.jsxs)("div",{className:`${r} ui--AddressInfo ${l?"ui--AddressInfo-expander":""}`,children:[(0,i.jsxs)("div",{className:"column"+(l?" column--expander":""),children:[Be(e,u.current,n,t),c&&c[0]&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(se,{label:t("session keys")}),(0,i.jsx)("div",{className:"result",children:c[0]})]}),c&&c[0]!==c[1]&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(se,{label:t("session next")}),(0,i.jsx)("div",{className:"result",children:c[1]})]}),Ie(e,t),o&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{}),o.map((([e,t],n)=>(0,i.jsxs)(s.Fragment,{children:[(0,i.jsx)(se,{label:e}),(0,i.jsx)("div",{className:"result",children:t})]},`label:${n}`)))]})]}),Se(e,t),a&&(0,i.jsx)("div",{className:"column",children:a})]})}))`
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
  `,(0,z.withCalls)(["derive.balances.all",{paramName:"address",propName:"balancesAll",skipIf:function({withBalance:e=!0,withExtended:t=!1}){if(!0===e||!0===t)return!1;if((0,R.K)(e)){if(e.available||e.locked||e.reserved||e.total||e.vested)return!1}else if((0,R.K)(t)&&t.nonce)return!1;return!0}}],["derive.staking.account",{paramName:"address",propName:"stakingInfo",skipIf:Ee}],["derive.democracy.locks",{paramName:"address",propName:"democracyLocks",skipIf:Ee}],["query.democracy.votingOf",{paramName:"address",propName:"votingOf",skipIf:Ee}]));var $e=n(31832);function Ve({className:e="",label:t,value:n}){let a;if(Array.isArray(n)){const e=n.filter(((e,t)=>0!==t)),t=e.reduce(((e,t)=>e.add(t)),U.nw).gtn(0);t&&(a=e.map(((e,t)=>(0,i.jsx)(M.Z,{value:e},t))))}return(0,i.jsx)(M.Z,{className:`${e} ui--Balance`,label:t,value:Array.isArray(n)?n[0]:n,children:a&&(0,i.jsxs)("span",{children:[" (+",a,")"]})})}function Pe(e){const{balance:t,className:n="",label:a,params:s}=e;return s?t?(0,i.jsx)(i.Fragment,{children:Ve({className:n,label:a,value:t})}):(0,i.jsx)($e.Z,{className:`${n} ui--Balance`,label:a,params:s}):null}const Ze=s.memo(Pe),Te={transform:e=>e.unwrapOr(null)},ze={transform:e=>e.unwrapOr(null)};function Fe({children:e,className:t="",label:n,params:a}){var s,r;const{api:o}=(0,ie.h)(),l=(0,oe.W7)(null==(s=o.query.staking)?void 0:s.bonded,[a],Te),c=(0,oe.W7)(l&&(null==(r=o.query.staking)?void 0:r.ledger),[l],ze);return(0,i.jsx)(M.Z,{className:t,label:n,value:null==c?void 0:c.active,children:e})}const Me=s.memo(Fe);function He(e){const{bonded:t,className:n="",label:a,params:s}=e;return s?t?(0,i.jsx)(i.Fragment,{children:Ve({className:n,label:a,value:t})}):(0,i.jsx)(Me,{className:`${n} ui--Bonded`,label:a,params:s}):null}const Re=s.memo(He);var Ue=n(10371),qe=n(15221),Oe=n(16039),We=n(87528);function Qe(e){return!(!e||!e.toHuman)}function Ke({className:e="",forceIconType:t,prefix:n,size:a=24,theme:r,value:o}){const{isEthereum:l,specName:c,systemName:u}=(0,ie.h)(),{t:d}=(0,K.$)(),{queueAction:m}=(0,ce.L)(),h=r||function(e,t){return"default"===Oe.X.icon&&(0,Ue.t)(e,t)||Oe.X.icon}(u,c),p="robohash"===h?We.Z:void 0,g=(0,s.useCallback)((e=>m({account:e,action:d("clipboard"),message:d("address copied"),status:"queued"})),[m,d]);return(0,i.jsx)(Ge,{Custom:p,className:e,onCopy:g,prefix:n,size:a,theme:t||(l?"ethereum":h),value:Qe(o)?o.toString():o})}const Ge=(0,x.z)(qe.ZP)((({theme:e})=>`\n  ${"dark"===e.theme?"circle:first-child {\n      fill: #282829;\n    }":""}\n\n  border: 1px solid ${"dark"===e.theme?"transparent":"#ddd"};\n  border-radius: 50%;\n  display: inline-block;\n  overflow: hidden;\n`)),Je=s.memo(Ke);function Ye({children:e,className:t="",label:n,params:a}){const{api:s}=(0,ie.h)(),r=(0,oe.W7)(s.derive.council.votesOf,[a]);return null!=r&&r.stake.gtn(0)?(0,i.jsx)(M.Z,{className:t,label:n,value:null==r?void 0:r.stake,children:e}):null}const Xe=s.memo(Ye);function _e({className:e="",label:t,params:n}){return n?(0,i.jsx)(Xe,{className:`${e} ui--LockedVote`,label:t,params:n}):null}const et=s.memo(_e);function tt({balance:e,bonded:t,children:n,className:a="",iconInfo:s,isHighlight:r,isPadded:o=!0,label:l,labelBalance:c,nameExtra:u,onNameClick:d,summary:m,value:h,withAddress:p=!0,withBalance:g=!1,withBonded:f=!1,withLockedVote:b=!1,withName:v=!0,withShrink:x=!1,withSidebar:A=!0}){return h?(0,i.jsxs)(nt,{className:`${a} ui--AddressMini ${r?"isHighlight":""} ${o?"padded":""} ${x?"withShrink":""}`,children:[l&&(0,i.jsx)("label",{className:"ui--AddressMini-label",children:l}),(0,i.jsxs)("span",{className:"ui--AddressMini-icon",children:[(0,i.jsx)(Je,{value:h}),s&&(0,i.jsx)("div",{className:"ui--AddressMini-icon-info",children:s})]}),(0,i.jsxs)("span",{className:"ui--AddressMini-info",children:[p&&(0,i.jsx)("span",{className:"ui--AddressMini-address",onClick:d,children:v?(0,i.jsx)(T,{value:h,withSidebar:A,children:u}):(0,i.jsx)("span",{className:"shortAddress",children:h})}),n]}),(0,i.jsxs)("div",{className:"ui--AddressMini-balances",children:[g&&(0,i.jsx)(Ze,{balance:e,label:c,params:h}),f&&(0,i.jsx)(Re,{bonded:t,label:"",params:h}),b&&(0,i.jsx)(et,{params:h}),m&&(0,i.jsx)("div",{className:"ui--AddressMini-summary",children:m})]})]}):null}const nt=x.z.div`
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
`,at=s.memo(tt);var st=n(420),it=n(94031);const rt="5".padEnd(48,"x");function ot({buttons:e,children:t,className:n,defaultName:a,fullLength:s=!1,isContract:r=!1,isDisabled:o,isEditableName:l,isInline:c,isValid:u,overlay:d,value:m,withTags:h=!1}){const{accountIndex:p,isNull:g,name:f,onSaveName:b,onSaveTags:v,setName:x,setTags:A,tags:w}=(0,st.B)(m?m.toString():null,r),y=!g&&(u||m||p),j=m?Je:qe.ZP,k=m&&y?m:rt;return(0,i.jsxs)(lt,{address:k,buttons:e,className:n,defaultName:a,icon:(0,i.jsx)(j,{size:32,value:m?m.toString():null}),isDisabled:o,isEditableName:l,isEditableTags:!0,isInline:c,isShortAddr:!s,name:f,onChangeName:x,onChangeTags:A,onSaveName:b,onSaveTags:v,tags:h?w:void 0,children:[t,d]})}const lt=(0,x.z)(it.Z)`
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
`,ct=s.memo(ot);function ut({address:e,className:t}){return(0,i.jsxs)(dt,{className:t,"data-testid":"parent",children:[(0,i.jsx)(v.Z,{className:"parent-icon",icon:"code-branch"}),(0,i.jsx)(T,{value:e,withSidebar:!0})]})}const dt=x.z.div`
  align-items: center;
  color: #8B8B8B;
  var(--font-size-small);
  display: flex;

  & .parent-icon {
    font-size: var(--font-size-percent-small);
    margin-right: 0.3rem;
    margin-left: 0.15rem;
  }
`,mt=s.memo(ut);function ht({children:e,className:t="",defaultName:n,onClickName:a,overrideName:s,parentAddress:r,toggle:o,value:l,withShortAddress:c=!1,withSidebar:u=!0}){return(0,i.jsxs)(pt,{className:`${t} ui--AddressSmall ${r||c?"withPadding":""}`,children:[(0,i.jsx)("span",{className:"ui--AddressSmall-icon",children:(0,i.jsx)(Je,{value:l})}),(0,i.jsxs)("span",{className:"ui--AddressSmall-info",children:[r&&(0,i.jsx)("div",{className:"parentName",children:(0,i.jsx)(mt,{address:r})}),(0,i.jsx)(T,{className:"accountName "+(u?"withSidebar":""),defaultName:n,onClick:a,override:s,toggle:o,value:l,withSidebar:u,children:e}),c&&(0,i.jsx)("div",{className:"shortAddress","data-testid":"short-address",children:l})]})]})}const pt=x.z.div`
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
`,gt=s.memo(ht);function ft({className:e="",isDisabled:t,isRadio:n,label:a,onChange:r,preventDefault:o,value:l}){const c=(0,s.useCallback)((e=>{t||(o&&(e.preventDefault(),e.stopPropagation()),r&&r(!l))}),[t,r,o,l]);return(0,i.jsxs)(bt,{className:`${e} ui--Toggle ${l?"isChecked":""} ${t?"isDisabled":""} ${n?"isRadio":""}`,onClick:c,children:[a&&(0,i.jsx)("label",{children:a}),(0,i.jsx)("div",{className:"ui--Toggle-Slider "+(n?"highlight--before-border":"")})]})}const bt=x.z.div`
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
`,vt=s.memo(ft);function xt({address:e,className:t="",filter:n,isHidden:a,noToggle:r,onChange:o,value:l}){const{api:u}=(0,ie.h)(),d=(0,c.Y)(e),m=(0,s.useMemo)((()=>!d||(0,N.r7)(u,e,d,n,!1)),[u,e,n,d]),h=(0,s.useCallback)((()=>o&&o(!l)),[o,l]);return(0,i.jsxs)(At,{className:`${t} ui--AddressToggle ${l||r?"isAye":"isNay"} ${a||!m?"isHidden":""}`,onClick:h,children:[(0,i.jsx)(at,{className:"ui--AddressToggle-address",value:e,withSidebar:!1}),!r&&(0,i.jsx)("div",{className:"ui--AddressToggle-toggle",children:(0,i.jsx)(vt,{label:"",value:l})})]})}const At=x.z.div`
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
`,wt=s.memo(xt);var yt=n(49753);function jt({className:e="",label:t,params:n}){return n?(0,i.jsx)(yt.Z,{className:`${e} ui--Available`,label:t,params:n}):null}const kt=s.memo(jt);function Nt({children:e,className:t="",icon:n,isBig:a,subtitle:s,title:r}){return(0,i.jsxs)(Ct,{className:["ui--AvatarItem",t,a&&"big"].join(" "),children:[(0,i.jsx)("div",{className:"ui--AvatarItem-icon",children:n}),(0,i.jsxs)("div",{className:"ui--AvatarItem-details",children:[(0,i.jsx)("div",{className:"ui--AvatarItem-title",children:r}),(0,i.jsx)("div",{className:"ui--AvatarItem-subtitle",children:s})]}),e]})}const Ct=x.z.div`
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
`,Et=s.memo(Nt);function St({children:e,className:t="",content:n,withIcon:a=!0}){return(0,i.jsxs)(It,{className:`${t} mark warning`,children:[a&&(0,i.jsx)(v.Z,{icon:"exclamation-triangle"}),n,e]})}const It=x.z.article`
  .ui--Icon {
    color: rgba(255, 196, 12, 1);
    margin-right: 0.5rem;
  }
`,Dt=s.memo(St);function Bt(){const{t:e}=(0,K.$)(),{api:t}=(0,ie.h)();return(0,f.m)(t.tx.utility.batchAll)?null:(0,i.jsx)(Dt,{content:e("This chain does not yet support atomic batch operations. This means that if the transaction gets executed and one of the operations do fail (due to invalid data or lack of available funds) some of the changes made may not be applied.")})}const Lt=s.memo(Bt);var $t=n(13739),Vt=n(6046),Pt=n(27113),Zt=n(75502);const Tt=["auctions.bid","balances.forceTransfer","balances.forceUnreserve","balances.setBalance","balances.transfer","balances.transferKeepAlive","bounties.proposeBounty","bounties.proposeCurator","childBounties.proposeCurator","claims.mintClaim","convictionVoting.delegate","convictionVoting.vote","crowdloan.contribute","crowdloan.create","crowdloan.edit","democracy.delegate","democracy.propose","democracy.vote","identity.requestJudgement","identity.setFee","nominationPools.bondExtra","nominationPools.join","nominationPools.unbond","phragmenElection.vote","society.bid","society.vouch","staking.bond","staking.bondExtra","staking.rebond","staking.unbond","tips.tip","tips.tipNew","treasury.proposeSpend","treasury.spend","vesting.forceVestedTransfer","vesting.vestedTransfer"],zt=["auctions.BidAccepted","auctions.ReserveConfiscated","auctions.Reserved","auctions.Unreserved","balances.Deposit","balances.DustLost","balances.Endowed","balances.Transfer","balances.Unreserved","balances.Withdraw","bounties.BountyClaimed","bounties.BountyRejected","claims.Claimed","convictionVoting.Voted","crowdloan.Contributed","crowdloan.Withdrew","democracy.Voted","nominationPools.Bonded","nominationPools.PaidOut","nominationPools.PoolSlashed","nominationPools.Unbonded","nominationPools.UnbondingPoolSlashed","referenda.DecisionDepositPlaced","referenda.DecisionDepositRefunded","referenda.DepositSlashed","referenda.SubmissionDepositRefunded","staking.Bonded","staking.Rewarded","staking.Unbonded","staking.Withdrawn","transactionPayment.TransactionFeePaid","treasury.Deposit"],Ft={"Compact<u128>":Zt.Z,u128:Zt.Z},Mt=Ft;var Ht=n(72282),Rt=n.n(Ht),Ut=n(54371);const qt=()=>{};function Ot({children:e,className:t="",icon:n="copy",label:a,type:r,value:o}){const{t:l}=(0,K.$)(),{queueAction:c}=(0,ce.L)(),u=(0,s.useCallback)((()=>{c&&c({action:l("clipboard"),message:l("{{type}} copied",{replace:{type:r||l("value")}}),status:"queued"})}),[r,c,l]);return(0,Ut.H)(o)?(0,i.jsx)(Wt,{className:`${t} ui--CopyButton`,children:(0,i.jsx)(Rt(),{onCopy:u,text:o,children:(0,i.jsxs)("div",{className:"copyContainer",children:[e,(0,i.jsx)("span",{className:"copySpan",children:(0,i.jsx)(de.Z,{className:"icon-button show-on-hover",icon:n,isDisabled:!o,label:a,onClick:qt})})]})})}):null}const Wt=x.z.div`
  .copySpan {
    white-space: nowrap;
  }
`,Qt=s.memo(Ot);var Kt=n(91220);function Gt({children:e,className:t="",copyValue:n,defaultValue:a,isFull:s,isHidden:r,isSmall:o,label:l,value:c,withCopy:u,withLabel:d}){return(0,i.jsxs)(Kt.Z,{className:t,isFull:s,isHidden:r,isSmall:o,label:l,withLabel:d,children:[(0,i.jsxs)("div",{className:"ui--Static ui dropdown selection disabled",children:[c||a,e]}),u&&(0,i.jsx)(Qt,{value:n||c||a})]})}const Jt=s.memo(Gt);function Yt({callName:e,children:t,className:n="",labelHash:a,labelSignature:r,mortality:o,onError:l,tip:c,value:u,withBorder:d,withExpander:m,withHash:h,withSignature:p}){const{t:g}=(0,K.$)(),[{hash:f,overrides:b,params:v,signature:x,signatureType:A,values:w},y]=(0,s.useState)({hash:null,params:[],signature:null,signatureType:null,values:[]});return(0,s.useEffect)((()=>{y(function(e,t,n,a){const s=a&&Tt.includes(a)?Ft:void 0,i=e.meta.args.map((({name:e,type:t})=>({name:e.toString(),type:(0,Vt.s)(t.toString())}))),r=e.args.map((e=>({isValid:!0,value:e}))),o=t?e.hash.toHex():null;let l=null,c=null;if(n&&function(e){return!!e.signature}(e)&&e.isSigned){const t=function(e){var t,n;return null==(t=e._raw)||null==(n=t.signature)?void 0:n.multiSignature}(e);l=e.signature.toHex(),c=t instanceof Pt.x?t.type:null}return{hash:o,overrides:s,params:i,signature:l,signatureType:c,values:r}}(u,h,p,e))}),[e,u,h,p]),(0,i.jsx)(Xt,{className:`${n} ui--Call`,children:(0,i.jsxs)($t.Z,{isDisabled:!0,onError:l,overrides:b,params:v,registry:u.registry,values:w,withBorder:d,withExpander:m,children:[t,(0,i.jsxs)("div",{className:"ui--Call--toplevel",children:[f&&(0,i.jsx)(Jt,{className:"hash",label:a||g("extrinsic hash"),value:f,withCopy:!0}),x&&(0,i.jsx)(Jt,{className:"hash",label:r||g("signature {{type}}",{replace:{type:A?`(${A})`:""}}),value:x,withCopy:!0}),o&&(0,i.jsx)(Jt,{className:"mortality",label:g("lifetime"),value:o}),(null==c?void 0:c.gtn(0))&&(0,i.jsx)(Jt,{className:"tip",label:g("tip"),value:(0,i.jsx)(M.Z,{value:c})})]})]})})}const Xt=x.z.div`
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
`,_t=s.memo(Yt);function en({children:e,className:t="",isHeader:n,labelHash:a,labelSignature:r,mortality:o,onError:l,stringId:c,tip:u,value:d,withBorder:m,withHash:h,withSignature:p}){const g=(0,s.useMemo)((()=>d&&d.callIndex?d.registry.findMetaCall(d.callIndex):null),[d]);if(!g||!d)return null;const{meta:f,method:b,section:v}=g,x=`${v}.${b}`;return(0,i.jsx)("div",{className:`${t} ui--CallExpander`,children:(0,i.jsxs)(ne,{isHeader:n,isLeft:!0,summaryHead:(0,i.jsxs)(i.Fragment,{children:[c&&`#${c}: `,x]}),summaryMeta:f,children:[(0,i.jsx)(_t,{callName:x,labelHash:a,labelSignature:r,mortality:o,onError:l,tip:u,value:d,withBorder:m,withExpander:!0,withHash:h,withSignature:p}),e]})})}const tn=s.memo(en);function nn({children:e,className:t="",isError:n,isSuccess:a,withBottomMargin:s}){return(0,i.jsx)(an,{className:`${t} ui--Card ${n&&!a?"error":""} ${!n&&a?"success":""} ${s?"withBottomMargin":""}`,children:e})}const an=x.z.article`
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
`,sn=s.memo(nn);var rn=n(1346),on=n(12372);function ln({angle:e,type:t}){return(0,i.jsx)("div",{className:`clip ${t}`,children:(0,i.jsx)("div",{className:"highlight--bg",style:{transform:`rotate(${e}deg)`}})})}const cn=s.memo(ln);function un({className:e="",isBlurred:t,isDisabled:n,total:a,value:s}){const r=(0,on.G)(a||0),o=r.gtn(0)?(0,on.G)(s||0).muln(36e3).div(r).toNumber()/100:0;if(o<0)return null;const l=360===o?360:o%360;return(0,i.jsxs)(mn,{className:`${e} ui--Progress ${n?"isDisabled":""} ${t?"--tmp":""}`,children:[(0,i.jsx)("div",{className:"background highlight--bg"}),(0,i.jsx)(cn,{angle:l<=180?l.toFixed(1):"180",type:"first"}),(0,i.jsx)(cn,{angle:l<=180?"0":(l-180).toFixed(1),type:"second"}),(0,i.jsx)("div",{className:"inner",children:(0,i.jsxs)("div",{children:[Math.floor(100*o/360),"%"]})})]})}const dn="3.5rem",mn=x.z.div`
  border-radius: 100%;
  clip-path: circle(50%);
  height: ${dn};
  position: relative;
  width: ${dn};

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
`,hn=s.memo(un);function pn({children:e,className:t="",label:n,progress:a}){const s=a&&a.value,r=a&&a.total,o=a&&!(0,rn.o)(s)&&!(0,rn.o)(r)&&s.gten(0)&&r.gtn(0)?s.gt(r)?`>${a.isPercent?"100":(0,p.u)(r)}`:a.isPercent?s.mul(U.S8).div(r).toString():(0,p.u)(s):void 0;if(a&&(0,rn.o)(o))return null;const l=a&&a.withTime&&!(0,rn.o)(a.total),c=(null!=n?n:"").toString();return(0,i.jsxs)(gn,{className:t,"data-testid":`card-summary:${c}`,children:[(0,i.jsxs)(Kt.Z,{isSmall:!0,label:n,children:[e,a&&!a.hideValue&&(0,i.jsxs)(i.Fragment,{children:[l&&!e&&(0,i.jsx)(H.Z,{className:a.isBlurred?"--tmp":"",value:a.total}),(0,i.jsx)("div",{className:l?"isSecondary":"isPrimary",children:!o||(0,rn.o)(a.total)?"-":l&&!a.isPercent&&a.value?(0,i.jsx)(H.Z,{className:(a.isBlurred?"--tmp":"")+" timer",value:a.total.sub(a.value)}):`${o}${a.isPercent?"":"/"}${a.isPercent?"%":(0,p.u)(a.total)}`})]})]}),a&&!a.hideGraph&&(0,i.jsx)(hn,{...a})]})}const gn=x.z.article`
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
`,fn=s.memo(pn);var bn=n(32136);function vn({className:e="",isInline:t,logo:n,onClick:a,withoutHl:r}){const{apiEndpoint:o}=(0,ie.h)(),[l,c,u]=(0,s.useMemo)((()=>{const e=n||(null==o?void 0:o.ui.logo),t=e||bn.h,[a,s]=t&&"empty"!==t&&(t.startsWith("data:")||t.startsWith("fa;"))?t.startsWith("fa;")?[!0,t.substring(3)]:[!1,t]:[!1,bn.h];return[!e||"empty"===n,s,a]}),[o,n]),d=`${e} ui--ChainImg ${l&&!r?"highlight--bg":""} ${t?"isInline":""}`;return u?(0,i.jsx)(An,{className:d,icon:c}):(0,i.jsx)(wn,{alt:"chain logo",className:d,onClick:a,src:c})}const xn="\n  background: white;\n  border-radius: 50%;\n  box-sizing: border-box;\n  color: #333;\n\n  &.isInline {\n    display: inline-block;\n    height: 24px;\n    margin-right: 0.75rem;\n    vertical-align: middle;\n    width: 24px;\n  }\n",An=(0,x.z)(v.Z)`${xn}`,wn=x.z.img`${xn}`,yn=s.memo(vn);var jn=n(22581);function kn({className:e="",genesisHash:t,isDisabled:n,onChange:a}){const{t:r}=(0,K.$)(),{api:o,isDevelopment:l}=(0,ie.h)(),c=(0,s.useMemo)((()=>function(e,t){return!!t&&(Object.values(jn.p).find((t=>t.includes(e)))||[e]).includes(t)}(o.genesisHash.toHex(),t)),[o,t]),u=(0,s.useCallback)((e=>a(e?o.genesisHash.toHex():null)),[o,a]);return l?null:(0,i.jsx)(Nn,{className:e,isDisabled:n,label:r("only this network"),onChange:u,preventDefault:!0,value:c})}const Nn=(0,x.z)(vt)`
  text-align: right;
`,Cn=s.memo(kn);var En=n(65511),Sn=n(80808),In=n(74844),Dn=n(19309);function Bn({children:e,className:t=""}){return(0,i.jsx)(Ln,{className:`${t} ui--Chart`,children:e})}const Ln=x.z.div`
  position: relative;
  display: inline-block;
  padding: 1em 1em 0;
  height: 15vw;
  width: 15vw;
`,$n=s.memo(Bn);function Vn({className:e="",size:t=100,values:n}){const a={colorHover:[],colorNormal:[],data:[],labels:[]};return n.forEach((({colors:[e="#00f",t],label:n,value:s})=>{a.colorNormal.push(e),a.colorHover.push(t||e),a.data.push((0,on.G)(s).toNumber()),a.labels.push(n)})),(0,i.jsx)($n,{className:`${e} ui--Chart-Doughnut`,children:(0,i.jsx)(Dn.$I,{data:{datasets:[{backgroundColor:a.colorNormal,data:a.data,hoverBackgroundColor:a.colorHover}],labels:a.labels},height:t,width:t})})}const Pn=s.memo(Vn);var Zn=n(65968),Tn=n(41935);function zn(e){return Tn.$_(e).alpha(.65).rgbString()}function Fn({aspectRatio:e=8,className:t="",max:n=100,showLabels:a=!1,values:r}){const[{chartData:o,chartOptions:l,jsonValues:c},u]=(0,s.useState)({});return(0,s.useEffect)((()=>{const t=JSON.stringify(r);t!==c&&u(function(e,t,n,a,s){return{chartData:t.reduce(((e,{colors:[t="#00f",n],label:a,value:s})=>{const i=e.datasets[0];return i.backgroundColor.push(zn(t)),i.hoverBackgroundColor.push(zn(n||t)),i.data.push((0,Zn.h)(s)?s:(0,on.G)(s).toNumber()),e.labels.push(a),e}),{datasets:[{backgroundColor:[],data:[],hoverBackgroundColor:[]}],labels:[]}),chartOptions:{aspectRatio:e,plugins:{legend:{display:!1},tooltip:{callbacks:{label:e=>t[e.dataIndex].tooltip||t[e.dataIndex].label}}},scales:{x:s?{beginAtZero:!0,max:a}:{display:!1}}},jsonValues:n}}(e,r,t,n,a))}),[e,c,n,a,r]),o?(0,i.jsx)("div",{className:`${t} ui--Chart-HorizBar`,children:(0,i.jsx)(Dn.$Q,{data:o,height:null,options:l,width:null})}):null}const Mn=s.memo(Fn);var Hn=n(33403),Rn=n(6485),Un=n(40972);const qn=["#ff8c00","#008c8c","#8c008c"],On={animation:{duration:0},elements:{point:{hoverRadius:6,radius:0}},hover:{intersect:!1},interaction:{intersect:!1,mode:"index"},plugins:{crosshair:{line:{color:"#ff8c00",dashPattern:[5,5],width:2},snap:{enabled:!0},sync:{enabled:!0},zoom:{enabled:!1}},legend:{display:!1},tooltip:{intersect:!1}},scales:{x:{ticks:{maxRotation:60,minRotation:60}}}};function Wn({className:e="",colors:t,labels:n,legends:a,options:r,title:o,values:l}){const c=(0,s.useMemo)((()=>function(e={}){var t,n,a,s,i,r,o,l,c,u;return(0,Hn.Z)({},On,e,{plugins:(0,Hn.Z)({},On.plugins,e.plugins,{annotation:(0,Hn.Z)({},null==(t=On.plugins)?void 0:t.annotation,null==(n=e.plugins)?void 0:n.annotation),crosshair:(0,Hn.Z)({},null==(a=On.plugins)?void 0:a.crosshair,null==(s=e.plugins)?void 0:s.crosshair),tooltip:(0,Hn.Z)({},null==(i=On.plugins)?void 0:i.tooltip,null==(r=e.plugins)?void 0:r.tooltip)}),scales:(0,Hn.Z)({},On.scales,e.scales,{x:(0,Hn.Z)({},null==(o=On.scales)?void 0:o.x,null==(l=e.scales)?void 0:l.x),y:(0,Hn.Z)({},null==(c=On.scales)?void 0:c.y,null==(u=e.scales)?void 0:u.y)})})}(r)),[r]),u=(0,s.useMemo)((()=>function(e=[],t,n,a){return a.reduce(((n,a,s)=>{const i=e[s]||zn(qn[s]),r=a.map((e=>(0,Rn.H)(e)?e.toNumber():e));return n.datasets.push({backgroundColor:i,borderColor:i,cubicInterpolationMode:"default",data:r,fill:!1,hoverBackgroundColor:i,label:t[s],lineTension:.25}),n}),{datasets:[],labels:n})}(t,a,n,l)),[t,n,a,l]);return(0,i.jsxs)(Qn,{className:`${e} ui--Chart-Line`,children:[o&&(0,i.jsx)("h1",{className:"ui--Chart-Header",children:o}),(0,i.jsx)(Un.Z,{children:(0,i.jsx)(Dn.x1,{data:u,options:c})})]})}const Qn=x.z.div`
  h1.ui--Chart-Header {
    margin-bottom: 0.25rem;
    margin-top: 1rem;
    padding-left: 0.25rem;
  }
`,Kn=s.memo(Wn);En.kL.register(En.uw,En.f$,En.jn,En.od,En.Dx,En.u,Sn.Z,In.ZP);const Gn={Doughnut:Pn,HorizBar:Mn,Line:Kn};function Jn({className:e="",isDisabled:t,label:n,onChange:a,value:r}){const o=(0,s.useCallback)((()=>{!t&&a&&a(!r)}),[t,a,r]);return(0,i.jsxs)(Yn,{className:`${e} ui--Checkbox ${t?"isDisabled":""}`,onClick:o,children:[(0,i.jsx)(v.Z,{color:r?"normal":"transparent",icon:"check"}),n&&(0,i.jsx)("label",{children:n})]})}const Yn=x.z.div`
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
`,Xn=s.memo(Jn),_n="750px",ea="550px",ta="\n  display: flex;\n  flex-wrap: wrap;\n\n  &.is50 {\n    > .ui--Column {\n      max-width: 50%;\n      min-width: 50%;\n    }\n  }\n\n  &.is60 {\n    > .ui--Column:first-child {\n      max-width: 60%;\n      min-width: 60%;\n    }\n\n    > .ui--Column:last-child {\n      max-width: 40%;\n      min-width: 40%;\n    }\n  }\n\n  &.is100 {\n    > .ui--Column {\n      max-width: 100%;\n      min-width: 100%;\n    }\n  }\n";function na({children:e,className:t="",is60:n,is100:a,isPadded:s=!0,isReverse:r,size:o="default"}){return(0,i.jsx)(aa,{className:`${t} ui--Columar ${a?"is100":n?"is60":"is50"} ${s?"isPadded":""} ${r?"isReverse":""} ${o}Size`,children:e})}const aa=x.z.div`
  &.isReverse {
    flex-direction: row-reverse;
  }

  &.defaultSize {
    @media only screen and (min-width: ${"1025px"}) {
      ${ta}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.75rem;
    }
  }

  &.smallSize {
    @media only screen and (min-width: ${_n}) {
      ${ta}
    }

    &isPadded > .ui--Column {
      padding: 0 0.5rem;
    }
  }

  &.tinySize {
    @media only screen and (min-width: ${ea}) {
      ${ta}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.25rem;
    }
  }

  &.defaultSize, &.smallSize {
    @media only screen and (max-width: ${_n}) {
      &.isPadded > .ui--Column {
        padding: 0 0.5rem;
      }
    }
  }

  &.defaultSize, &.smallSize, &.tinySize {
    @media only screen and (max-width: ${ea}) {
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
`,sa=s.memo(na);sa.Column=function({children:e,className:t=""}){return(0,i.jsx)("div",{className:`${t} ui--Column`,children:e})};const ia=sa;var ra=n(27229),oa=n(65308),la=n(21507);const ca=[1,2,4,8,16,32].map(((e,t)=>[t+1,e,new(ve())(e)]));function ua({className:e="",label:t,onChange:n,value:a,voteLockingPeriod:r}){const{t:o}=(0,K.$)(),l=(0,ra.n)(),c=(0,s.useRef)(function(e,t,n){return[{text:n("0.1x voting balance, no lockup period"),value:0},...ca.map((([a,s,i])=>({text:n("{{value}}x voting balance, locked for {{duration}}x duration{{period}}",{replace:{duration:s,period:t&&t.gt(U.nw)?` (${(0,oa.A)(e,i.mul(t),n)[1]})`:"",value:a}}),value:a})))]}(l,r,o));return(0,i.jsx)(la.Z,{className:e,label:t,onChange:n,options:c.current,value:a})}const da=s.memo(ua);n(93323);var ma=n(92890);function ha({className:e="",code:t,isValid:n,onEdit:a}){const[r]=(0,s.useState)((()=>`flask-${Date.now()}`)),o=(0,s.useRef)(null);return(0,s.useEffect)((()=>{const e=new ma.Z(`#${r}`,{language:"js",lineNumbers:!0});e.updateCode(t),e.editorRoot.addEventListener("keydown",(()=>{e.onUpdate(a)})),o.current=e}),[]),(0,s.useEffect)((()=>{o.current&&o.current.updateCode(t)}),[t]),(0,i.jsx)(pa,{className:`${e} ui-Editor ${!1===n?"invalid":""}`,id:r})}const pa=x.z.div`
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
`,ga=s.memo(ha);var fa=n(4197);function ba({children:e,className:t="",eventName:n,value:a,withExpander:r}){const{t:o}=(0,K.$)(),l=a.data.names,c=a.typeDef.map(((e,t)=>({name:l&&l[t]||void 0,type:e}))),u=a.data.map((e=>({isValid:!0,value:e}))),d=(0,s.useMemo)((()=>n&&zt.includes(n)?Mt:void 0),[n]),m=(0,s.useMemo)((()=>{if("contracts"===a.section&&"ContractExecution"===a.method&&2===a.data.length){const[e,t]=a.data;try{const n=(0,N.oX)(e.toString());if(n){const e=n.decodeEvent(t);return{...e,values:e.args.map((e=>({isValid:!0,value:e})))}}}catch(e){console.error(e)}}return null}),[a]);return(0,i.jsxs)("div",{className:`${t} ui--Event`,children:[e,(0,i.jsx)($t.Z,{isDisabled:!0,overrides:d,params:c,registry:a.registry,values:u,withExpander:r,children:m&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(fa.ZP,{isDisabled:!0,label:o("contract event"),value:m.event.identifier}),(0,i.jsx)($t.Z,{isDisabled:!0,params:m.event.args,registry:a.registry,values:m.values})]})})]})}const va=s.memo(ba);var xa=n(89448),Aa=n(53964),wa=n(53197);const ya=(0,xa.e)("useWindowSize",(function(){return(0,s.useContext)(wa.d)})),ja=(0,xa.e)("useWindowColumns",(function(e=3){const t=ya();return(0,Aa.N)(e>=3&&t.width>=1500?3:e>=2&&t.width>=1050?2:1)}));var ka=n(28515);function Na({children:e,className:t="",empty:n,emptySpinner:a,isEmpty:s,noBodyTag:r}){const o=`${t} ui--Table-Body`;return s?(0,i.jsx)("tbody",{className:o,children:(0,i.jsx)("tr",{children:(0,i.jsx)("td",{colSpan:100,children:(0,Ut.H)(n)?(0,i.jsx)("div",{className:"empty",children:n}):n||(0,i.jsx)(ka.Z,{label:a})})})}):r?(0,i.jsx)(i.Fragment,{children:e}):(0,i.jsx)("tbody",{className:o,children:e})}const Ca=s.memo(Na);function Ea({children:e,className:t="",colSpan:n,label:a,labelPost:s,rowSpan:r,value:o,withLoading:l}){return(0,i.jsxs)("td",{className:`${t} ui--Table-Column-Balance number`,colSpan:n,rowSpan:r,children:[o?(0,i.jsx)(M.Z,{label:a,labelPost:s,value:o}):l&&(0,i.jsx)(M.Z,{className:"--tmp",value:1}),e]})}const Sa=s.memo(Ea);function Ia({className:e="",colSpan:t,isExpanded:n,rowSpan:a,toggle:s}){return(0,i.jsx)(Da,{className:`${e} ui--Table-Column-Expand`,colSpan:t,onClick:s,rowSpan:a,children:(0,i.jsx)("div",{children:(0,i.jsx)(v.Z,{icon:n?"caret-up":"caret-down"})})})}const Da=x.z.td`
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
`,Ba=s.memo(Ia);function La({address:e,className:t="",colSpan:n,isFavorite:a,rowSpan:r,toggle:o}){const l=(0,s.useCallback)((()=>o(e)),[e,o]);return(0,i.jsx)($a,{className:`${t} ui--Table-Column-Favorite`,colSpan:n,onClick:l,rowSpan:r,children:(0,i.jsx)(v.Z,{color:a?"orange":"gray",icon:"star"})})}const $a=x.z.td`
  && {
    box-sizing: content-box;
    cursor: pointer;
    min-width: 1rem;
    padding-right: 0.35rem;
    text-align: right;
    width: 1rem;
  }
`,Va=s.memo(La);function Pa({children:e,className:t="",colSpan:n,rowSpan:a,value:s}){return(0,i.jsxs)(Ta,{className:`${t} ui--Table-Column-Id`,colSpan:n,rowSpan:a,children:[(0,i.jsx)("h2",{className:"--digits",children:(0,p.u)(s)}),e]})}const Za=`${7.15.toFixed(3)}ch`,Ta=x.z.td`
  && {
    box-sizing: content-box;
    min-width: ${Za};
    text-align: right;
    white-space: nowrap;
    width: ${Za};
`,za=s.memo(Pa);function Fa({children:e,className:t=""}){return(0,i.jsx)("td",{className:`${t} ui--Table-Column`,children:e})}const Ma=s.memo(Fa);Ma.Balance=Sa,Ma.Expand=Ba,Ma.Favorite=Va,Ma.Id=za;const Ha=Ma;function Ra({className:e="",footer:t,isEmpty:n}){return!t||n?null:(0,i.jsx)(Ua,{className:`${e} ui--Table-Foot`,children:t})}const Ua=x.z.tfoot`
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
`,qa=s.memo(Ra);function Oa({children:e,className:t="",filter:n,header:a,isEmpty:s}){return null!=a&&a.length?(0,i.jsxs)(Wa,{className:`${t} ui--Table-Head`,children:[n&&(0,i.jsx)("tr",{className:"filter",children:(0,i.jsx)("th",{colSpan:100,children:n})}),(0,i.jsx)("tr",{children:a.filter((e=>!!e)).map((([e,t="default",n=1,a],r)=>(0,i.jsx)("th",{className:t,colSpan:n,onClick:a,children:0===r?(0,i.jsx)("h1",{children:e}):!s&&e&&(0,i.jsx)("label",{children:e})},r)))}),e]}):null}const Wa=x.z.thead`
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
`,Qa=s.memo(Oa);function Ka({children:e,className:t=""}){return(0,i.jsx)("tr",{className:`${t} ui--Table-Row`,children:e})}const Ga=s.memo(Ka),Ja={2:[0,1],3:[0,1,2]};function Ya({children:e,className:t="",empty:n,emptySpinner:a,filter:s,footer:r,header:o,headerChildren:l,isFixed:c,isInline:u,isSplit:d,legend:m,maxColumns:h,noBodyTag:p}){const g=ja(h),f=Array.isArray(e),b=!e||f&&0===e.length,v=(0,i.jsx)(Qa,{filter:s,header:o,isEmpty:b,children:l});return d&&f&&!b&&1!==g?(0,i.jsxs)(ts,{className:`${t} ui--Table isSplit`,children:[m,(0,i.jsx)("table",{className:"noMargin",children:v}),(0,i.jsx)("div",{className:"ui--Table-Split",children:Ja[g].map((t=>(0,i.jsx)("div",{className:`ui--Table-Split-${g}`,children:(0,i.jsx)("table",{className:"noMargin",children:(0,i.jsx)("tbody",{className:"ui--Table-Body",children:e.filter(((e,n)=>n%g===t))})})},t)))})]}):(0,i.jsxs)(ts,{className:`${t} ui--Table`,children:[m,(0,i.jsxs)("table",{className:`${c&&!b?"isFixed":"isNotFixed"} ${u?"isInline":""}`,children:[v,(0,i.jsx)(Ca,{empty:n,emptySpinner:a,isEmpty:b,noBodyTag:p,children:e}),(0,i.jsx)(qa,{footer:r,isEmpty:b})]})]})}const Xa="0.125rem solid var(--bg-page)",_a="0.25rem solid var(--bg-page)",es="0.5rem",ts=x.z.div`
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
        border-left: ${Xa};
      }

      &:last-child {
        border-right: ${Xa};
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
          border-top: ${_a};

          &:first-child {
            border-top-left-radius: ${es};
            border-bottom-left-radius: ${es};
          }

          &:last-child {
            border-top-right-radius: ${es};
            border-bottom-right-radius: ${es};
          }
        }
      }

      &.isExpanded {
        &.isFirst {
          td {
            border-top: ${_a};

            &:first-child {
              border-top-left-radius: ${es};
            }

            &:last-child {
              border-top-right-radius: ${es};
            }
          }
        }

        &.isLast {
          td {
            &:first-child {
              border-bottom-left-radius: ${es};
            }

            &:last-child {
              border-bottom-right-radius: ${es};
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
          border-top: ${_a};

          &:first-child {
            border-top-left-radius: ${es};
          }

          &:last-child {
            border-top-right-radius: ${es};
          }
        }
      }

      &:last-child {
        th {
          padding-top: 1rem;

          &:first-child {
            border-bottom-left-radius: ${es};
          }

          &:last-child {
            border-bottom-right-radius: ${es};
          }
        }
      }

      th {
        &:first-child {
          border-left: ${Xa};
        }

        &:last-child {
          border-right: ${Xa};
        }
      }
    }
  }
`,ns=s.memo(Ya);ns.Column=Ha,ns.Row=Ga;const as=ns;function ss(e,t){return(0,i.jsx)("tr",{children:(0,i.jsx)("td",{children:e})},t)}function is({children:e,className:t,empty:n,renderChildren:a,summary:r}){const o=(0,s.useMemo)((()=>!(!a&&!e)),[e,a]),l=(0,s.useCallback)((()=>{var t;return(a||e)&&(0,i.jsx)("div",{className:"tableContainer",children:(0,i.jsx)(as,{empty:n,isInline:!0,children:a?null==(t=a())?void 0:t.map(ss):Array.isArray(e)?e.map(ss):(0,i.jsx)("tr",{children:(0,i.jsx)("td",{children:e})})})})}),[e,n,a]);return(0,i.jsx)(rs,{className:t,renderChildren:o?l:void 0,summary:r})}const rs=(0,x.z)(ne)`
  .tableContainer {
    overflow-y: scroll;
    display: block;
    margin: 0 0 0 auto;
    max-height: 13.75rem;
    max-width: 25rem;
    overflow-x: hidden;
  }
`,os=s.memo(is);function ls(e,t,n){const a=e.tx[t],s=!n||n(t);return a&&0!==Object.keys(a).length&&s?Object.keys(a).filter((e=>!e.startsWith("$")&&(!n||n(t,e)))).sort().map((e=>{const n=a[e],s=n.meta.args.map((e=>e.name.toString())).join(", ");return{className:"ui--DropdownLinked-Item",key:`${t}_${e}`,text:[(0,i.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[e,"(",s,")"]},`${t}_${e}:call`),(0,i.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(n.meta.docs[0]||e).toString()},`${t}_${e}:text`)],value:e}})):[]}function cs({children:e,className:t="",label:n,withLabel:a}){return(0,i.jsx)(us,{className:t,children:(0,i.jsx)(Kt.Z,{label:n,withLabel:a,children:(0,i.jsx)("div",{className:"ui--DropdownLinked ui--row",children:e})})})}const us=x.z.div`
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
`,ds=s.memo(cs);function ms({api:e,className:t="",defaultValue:n,isDisabled:a,isError:r,onChange:o,options:l,value:c}){const u=(0,s.useCallback)((t=>e.tx[c.section][t]),[e,c]);return l.length?(0,i.jsx)(la.Z,{className:`${t} ui--DropdownLinked-Items`,defaultValue:n,isDisabled:a,isError:r,onChange:o,options:l,transform:u,value:c.method,withLabel:!1}):null}const hs=s.memo(ms);function ps({className:e="",defaultValue:t,isDisabled:n,isError:a,onChange:s,options:r,value:o}){return(0,i.jsx)(la.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isDisabled:n,isError:a,onChange:s,options:r,value:o.section,withLabel:!1})}const gs=s.memo(ps);function fs({className:e="",defaultValue:t,filter:n,isDisabled:a,label:r,onChange:o,withLabel:l}){const{api:c}=(0,ie.h)(),[u,d]=(0,s.useState)((()=>ls(c,t.section,n))),[m]=(0,s.useState)((()=>function(e,t){return Object.keys(e.tx).filter((e=>!e.startsWith("$")&&(!t||t(e)))).sort().filter((t=>Object.keys(e.tx[t]).length)).map((e=>({text:e,value:e})))}(c,n))),[h,p]=(0,s.useState)((()=>t)),[{defaultMethod:g,defaultSection:f}]=(0,s.useState)((()=>({defaultMethod:t.method,defaultSection:t.section}))),b=(0,s.useCallback)((e=>{h!==e&&(p((()=>e)),o&&o(e))}),[o,h]),v=(0,s.useCallback)((e=>{if(e!==h.section){const t=ls(c,e,n);d(t),b(c.tx[e][t[0].value])}}),[b,c,n,h]);return(0,i.jsxs)(ds,{className:e,label:r,withLabel:l,children:[(0,i.jsx)(gs,{className:"small",defaultValue:f,isDisabled:a,onChange:a?void 0:v,options:m,value:h}),(0,i.jsx)(hs,{api:c,className:"large",defaultValue:g,isDisabled:a,onChange:a?void 0:b,options:u,value:h})]})}const bs=s.memo(fs);function vs({className:e="",defaultArgs:t,defaultValue:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:c,onEnter:u,onEscape:d,withLabel:m}){const h=(0,s.useCallback)((e=>c&&c({isValid:!!e,value:e})),[c]);return(0,i.jsx)(Bs,{className:e,defaultArgs:t,defaultValue:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:h,onEnter:u,onEscape:d,withLabel:m})}const xs=s.memo(vs);function As(e){return e.map((e=>({isValid:!0,value:e})))}function ws(e,t,n){try{return n&&n.value?(a=n.value,(0,Ut.H)(a.section)&&(0,Ut.H)(a.method)?{initialArgs:As(n.value.args),initialValue:e.tx[n.value.section][n.value.method]}:function(e){return(0,R.K)(e.method)&&(0,Ut.H)(e.method.section)&&(0,Ut.H)(e.method.method)}(n.value)?{initialArgs:As(n.value.method.args),initialValue:e.tx[n.value.method.section][n.value.method.method]}:{initialValue:n.value}):{initialValue:t}}catch(e){return{initialValue:t}}var a}function ys({className:e="",defaultValue:t,isDisabled:n,isError:a,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const{api:d,apiDefaultTx:m}=(0,ie.h)(),[{initialArgs:h,initialValue:p}]=(0,s.useState)((()=>ws(d,m,t)));return(0,i.jsx)(xs,{className:e,defaultArgs:h,defaultValue:p,isDisabled:n,isError:a,isPrivate:!1,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u})}const js=s.memo(ys);function ks({className:e="",defaultValue:t,isDisabled:n,isError:a,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const{api:d,apiDefaultTxSudo:m}=(0,ie.h)(),[{initialArgs:h,initialValue:p}]=(0,s.useState)((()=>ws(d,m,t))),g=(0,s.useCallback)((({isValid:e,value:t})=>{let n=null;e&&t&&(n=t.method.toHex()),o&&o({isValid:e,value:n})}),[o]);return(0,i.jsx)(xs,{className:e,defaultArgs:h,defaultValue:p,isDisabled:n,isError:a,isPrivate:!0,label:r,onChange:g,onEnter:l,onEscape:c,withLabel:u})}function Ns({className:e="",defaultValue:t,isDisabled:n,isError:a,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const{api:d,apiDefaultTxSudo:m}=(0,ie.h)(),[{initialArgs:h,initialValue:p}]=(0,s.useState)((()=>ws(d,m,t))),g=(0,s.useCallback)((({isValid:e,value:t})=>{let n=null;e&&t&&(n=d.createType("Proposal",t)),o&&o({isValid:e,value:n})}),[d,o]);return(0,i.jsx)(xs,{className:e,defaultArgs:h,defaultValue:p,isDisabled:n,isError:a,isPrivate:!0,label:r,onChange:g,onEnter:l,onEscape:c,withLabel:u})}const Cs={Call:js,OpaqueCall:s.memo(ks),Proposal:s.memo(Ns),RuntimeCall:js},Es=(0,Hn.Z)({},Cs,Ft);function Ss({meta:e}){return e.args.map((({name:e,type:t,typeName:n})=>({name:e.toString(),type:{...(0,Vt.s)(t.toString()),...n.isSome?{typeName:n.unwrap().toString()}:{}}})))}function Is(e,t=[]){return{extrinsic:{fn:e,params:Ss(e)},values:t}}function Ds({defaultArgs:e,defaultValue:t,filter:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:c,onEnter:u,onError:d,onEscape:m,withLabel:h}){const[{extrinsic:p,values:g},f]=(0,s.useState)((()=>Is(t,e)));(0,s.useEffect)((()=>{const e=function(e,t){return t.reduce(((e,t)=>e&&!(0,rn.o)(t)&&!(0,rn.o)(t.value)&&t.isValid),e.length===t.length)}(p.params,g);let t;if(e)try{t=p.fn(...g.map((({value:e})=>e)))}catch(e){d&&d(e)}else d&&d(null);c(t)}),[p,c,d,g]);const b=(0,s.useMemo)((()=>Tt.includes(`${p.fn.section}.${p.fn.method}`)?Es:Cs),[p]),v=(0,s.useCallback)((e=>f((t=>e.section===t.extrinsic.fn.section&&e.method===t.extrinsic.fn.method?t:Is(e)))),[]),x=(0,s.useCallback)((e=>f((({extrinsic:t})=>({extrinsic:t,values:e})))),[]),{fn:{method:A,section:w},params:y}=p;return(0,i.jsxs)("div",{className:"extrinsics--Extrinsic",children:[(0,i.jsx)(bs,{defaultValue:t,filter:n,isDisabled:a,isError:r,isPrivate:o,label:l,onChange:v,withLabel:h}),(0,i.jsx)($t.Z,{onChange:x,onEnter:u,onEscape:m,overrides:b,params:y,values:g},`${w}.${A}:params`)]})}const Bs=s.memo(Ds);function Ls({children:e,className:t}){return(0,i.jsx)($s,{className:t,children:e})}const $s=x.z.div`
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
`,Vs=s.memo(Ls);var Ps=n(4463);function Zs({className:e="",color:t,label:n}){return(0,i.jsx)(Ts,{className:`${e} ${"theme"===t?" highlight--color-bg highlight--bg":""}`,color:t,label:n,size:"tiny"})}const Ts=(0,x.z)(Ps.Z)`
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
`,zs=s.memo(Zs);var Fs=n(15108);function Ms(e,t){switch(e){case"account":return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("p",{children:t("You are about to remove this account from your list of available accounts. Once completed, should you need to access it again, you will have to re-create the account either via seed or via a backup file.")}),(0,i.jsx)("p",{children:t("This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the account on this browser.")})]});case"address":return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("p",{children:t("You are about to remove this address from your address book. Once completed, should you need to access it again, you will have to re-add the address.")}),(0,i.jsx)("p",{children:t("This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the address on this browser.")})]});case"contract":return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("p",{children:t("You are about to remove this contract from your list of available contracts. Once completed, should you need to access it again, you will have to manually add the contract's address in the Instantiate tab.")}),(0,i.jsx)("p",{children:t("This operation does not remove the history of the contract from the chain, nor any associated funds from its account. The forget operation only limits your access to the contract on this browser.")})]});default:return null}}function Hs(e,t){switch(e){case"account":return t("Confirm account removal");case"address":return t("Confirm address removal");case"contract":return t("Confirm contract removal");case"code":return t("Confirm code removal")}}function Rs(e,t){const{address:n,mode:a="account"}=e;switch(a){case"account":case"address":case"contract":return(0,i.jsx)(ct,{isInline:!0,value:n||"",children:Ms(a,t)});default:return null}}function Us(e){const{t}=(0,K.$)(),{children:n,mode:a="account",onClose:s,onForget:r}=e;return(0,i.jsxs)(Fs.Z,{className:"app--accounts-Modal",header:Hs(a,t),onClose:s,children:[(0,i.jsx)(Fs.Z.Content,{children:n||Rs(e,t)}),(0,i.jsx)(Fs.Z.Actions,{children:(0,i.jsx)(de.Z,{icon:"trash",label:t("Forget"),onClick:r})})]})}const qs=s.memo(Us);function Os({className:e="",href:t,icon:n,label:a,onClick:s,rel:r,target:o}){return(0,i.jsxs)(Ws,{className:e,href:t,onClick:s,rel:r,target:o,children:[n&&(0,i.jsx)(v.Z,{icon:n}),a]})}n(70827).Z,x.z.div`
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
`;const Ws=x.z.a`
  .ui--Icon {
    margin-right: 0.5em;
  }
`,Qs=s.memo(Os);function Ks({children:e,className:t="",type:n="info"}){return(0,i.jsx)(Gs,{children:(0,i.jsx)("div",{className:`${t} ${n}`,children:e})})}const Gs=(0,x.z)(Kt.Z)`
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
`,Js=s.memo(Ks);var Ys=n(55858);function Xs({children:e,className:t="",isDisabled:n,isError:a,isFull:s,isHidden:r,isMonospace:o,isSmall:l,isTrimmed:c,label:u,labelExtra:d,value:m,withCopy:h=!1,withLabel:p}){return(0,i.jsxs)(_s,{className:`${t} ui--Output`,isFull:s,isHidden:r,isSmall:l,label:u,labelExtra:d,withLabel:p,children:[(0,i.jsxs)("div",{className:`ui--output ui dropdown selection ${a?" error":""}${o?" monospace":""}${n?"isDisabled":""}`,children:[c&&(0,Ut.H)(m)&&m.length>512?`${m.slice(0,256)}…${m.slice(-256)}`:m,e]}),h&&(0,i.jsx)(Qt,{value:m})]})}const _s=(0,x.z)(Kt.Z)`
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
`,ei=s.memo(Xs);function ti({inner:e=[],name:t="",outer:n=[]},a=[]){if(n.length){const e=new Array(n.length);for(let t=0;t<n.length;t++)e[t]=(0,Ys.c)(n[t],void 0,!1);a.push({name:t,value:e.join(" ")})}for(let t=0;t<e.length;t++)ti(e[t],a);return a}function ni({className:e,hex:t,inspect:n,label:a}){const{t:r}=(0,K.$)(),{createLink:o}=(0,ie.h)(),l=(0,s.useMemo)((()=>n&&ti(n)),[n]),[c,u]=(0,s.useMemo)((()=>{if(t){const e=`/extrinsics/decode/${t}`;return[o(e),`#${e}`]}return[null,null]}),[o,t]);return l?(0,i.jsx)(ai,{className:e,isDisabled:!0,label:a,children:(0,i.jsx)("table",{children:(0,i.jsxs)("tbody",{children:[l.map((({name:e,value:t},n)=>(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{children:(0,i.jsx)("label",{children:e})}),(0,i.jsx)("td",{children:t})]},n))),c&&(0,i.jsxs)("tr",{className:"isLink",children:[(0,i.jsx)("td",{children:(0,i.jsx)("label",{children:r("link")})}),(0,i.jsx)("td",{children:(0,i.jsx)("a",{href:c,rel:"noreferrer",target:"_blank",children:u})})]},"hex")]})})}):null}const ai=(0,x.z)(ei)`
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
`,si=s.memo(ni);var ii=n(23729),ri=n.n(ii),oi=n(69187),li=n(99374),ci=n(17751),ui=n(61162),di=n(94175);function mi({address:e,className:t=""}){return(0,i.jsxs)(hi,{className:`${t} ui--KeyPair`,children:[(0,i.jsx)(Je,{className:"icon",value:e}),(0,i.jsx)("div",{className:"name",children:(0,i.jsx)(T,{value:e})}),(0,i.jsx)("div",{className:"address",children:e})]})}const hi=x.z.div`
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
`,pi=s.memo(mi);function gi(e,t=!0){const n="ethereum"===oi.Nn.keyring.type?20:32;try{if((0,di.m)(e.key).length>=n)return{...e,text:(0,i.jsx)(pi,{address:e.key||"",isUppercase:t,name:e.name})}}catch{}return null}const fi="options:InputAddress",bi="all",vi=[];function xi(e){try{return(0,N.Hc)(e,!1,"ethereum"===oi.Nn.keyring.type?20:32)||null}catch(e){}return null}function Ai(e){if(!e)return null;return xi(e)||null}function wi(e){let t;const n=oi.Nn.getAccount(e);let a;if(n)a=n.meta.name;else{const n=oi.Nn.getAddress(e);n?(a=n.meta.name,t=n.meta.isRecent):t=!0}return gi((0,li.e)(e,a),!t)}function yi(){return ri().get(fi)||{defaults:{}}}function ji(e=bi){return yi().defaults[e]}function ki(e=bi,t){const n=yi();n.defaults[e]=t,ri().set(fi,n)}function Ni(e){return e.reduce(((e,t,n)=>(e.some((({key:e},a)=>a!==n&&e===t.key))||e.push(t),e)),[])}class Ci extends s.PureComponent{state={};static getDerivedStateFromProps({type:e,value:t},{lastValue:n}){try{return{lastValue:n||ji(e),value:Array.isArray(t)?t.map((e=>(0,N.Hc)(e))):(0,N.Hc)(t)||void 0}}catch(e){return null}}render(){const{className:e="",defaultValue:t,hideAddress:n=!1,isDisabled:a=!1,isError:s,isMultiple:r,label:o,labelExtra:l,options:c,optionsAll:u,placeholder:d,type:m=bi,withEllipsis:h,withLabel:p}=this.props;if(!(c&&0!==c.length||u&&0!==Object.keys(u[m]).length||a))return(0,i.jsx)(Jt,{className:e,label:o,children:"No accounts are available for selection."});const{lastValue:g,value:f}=this.state,b=this.getLastOptionValue(),v=xi(a||t&&"0x"!==t&&(this.hasValue(t)||"allPlus"===m)?t:this.hasValue(g)?g:b&&b.value),x=c?Ni(c.map((e=>gi(e))).filter((e=>!!e))):a&&v?[wi(v)].filter((e=>!!e)):v?this.addActual(v):this.getFiltered(),A=r||!(0,rn.o)(f)?void 0:v;return(0,i.jsx)(Ei,{className:`${e} ui--InputAddress ${n?"hideAddress":""}`,defaultValue:A,isDisabled:a,isError:s,isMultiple:r,label:o,labelExtra:l,onChange:r?this.onChangeMulti:this.onChange,onSearch:this.onSearch,options:x,placeholder:d,renderLabel:r?this.renderLabel:void 0,value:r&&!f?vi:f,withEllipsis:h,withLabel:p})}addActual(e){const t=this.getFiltered();return this.hasValue(e)?t:t.concat(...[wi(e)].filter((e=>!!e)))}renderLabel=({value:e})=>{if(e)return(0,N.s2)(e)};getLastOptionValue(){const e=this.getFiltered();return e.length?e[e.length-1]:void 0}hasValue(e){const t=e&&e.toString();return this.getFiltered().some((({value:e})=>e===t))}getFiltered(){const{filter:e,optionsAll:t,type:n=bi,withExclude:a=!1}=this.props;return t?Ni(t[n]).filter((({value:t})=>!e||!!t&&(a?!e.includes(t):e.includes(t)))):[]}onChange=e=>{const{filter:t,onChange:n,type:a}=this.props;!t&&ki(a,e),n&&n(e&&(this.hasValue(e)||"allPlus"===a&&(0,ui.U)(e))?Ai(e):null)};onChangeMulti=e=>{const{onChangeMulti:t}=this.props;t&&t(e.map(Ai).filter((e=>e)))};onSearch=(e,t)=>{const{isInput:n=!0}=this.props,a=t.trim(),s=a.toLowerCase(),i=e.filter((e=>!!e.value&&(e.name.toLowerCase&&e.name.toLowerCase().includes(s)||e.value.toLowerCase().includes(s))));if(n&&0===i.length){const e=Ai(a);e&&i.push(oi.Nn.saveRecent(e.toString()).option)}return i.filter(((e,t)=>{const n=t===i.length-1,a=i[t+1],s=a&&a.value;return!((0,ci.F)(e.value)||(0,rn.o)(e.value))||!n&&!!s}))}}const Ei=(0,x.z)(la.Z)`
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
`,Si=(0,z.withMulti)(Ci,(0,z.withObservable)(oi.Nn.keyringOption.optionsSubject,{propName:"optionsAll",transform:e=>Object.entries(e).reduce(((e,[t,n])=>(e[t]=n.map((e=>null===e.value?function(e){return(0,i.jsx)(la.Z.Header,{content:e.name},e.key||e.name)}(e):gi(e))).filter((e=>!!e)),e)),{})}));Si.createOption=gi,Si.setLastValue=ki;const Ii=Si;var Di=n(61842);function Bi({address:e,filter:t,isHidden:n,onSelect:a}){const r=(0,s.useCallback)((()=>a(e)),[e,a]);return n?null:(0,i.jsx)(wt,{address:e,filter:t,noToggle:!0,onChange:r})}const Li=s.memo(Bi);function $i({address:e,filter:t,isHidden:n,onDeselect:a}){const r=(0,s.useCallback)((()=>a(e)),[e,a]);return n?null:(0,i.jsx)(wt,{address:e,filter:t,noToggle:!0,onChange:r})}const Vi=s.memo($i);function Pi({available:e,availableLabel:t,className:n="",defaultValue:a,maxCount:r,onChange:o,valueLabel:l}){const{t:c}=(0,K.$)(),[u,d]=(0,s.useState)(""),[m,h]=(0,s.useState)([]),p=(0,Aa.N)(u),g=(0,Di.q)();(0,s.useEffect)((()=>{a&&h(a)}),[a]),(0,s.useEffect)((()=>{m&&o(m)}),[o,m]);const f=(0,s.useCallback)((e=>h((t=>function(e,t,n){return!e.includes(t)&&e.length<n?e.concat(t):e}(t,e,r)))),[r]),b=(0,s.useCallback)((e=>h((t=>function(e,t){return e.includes(t)?e.filter((e=>e!==t)):e}(t,e)))),[]);return(0,i.jsxs)(Zi,{className:`${n} ui--InputAddressMulti`,children:[(0,i.jsx)(fa.ZP,{autoFocus:!0,className:"ui--InputAddressMulti-Input",isSmall:!0,onChange:d,placeholder:c("filter by name, address, or account index"),value:u,withLabel:!1}),(0,i.jsxs)("div",{className:"ui--InputAddressMulti-columns",children:[(0,i.jsxs)("div",{className:"ui--InputAddressMulti-column",children:[(0,i.jsx)("label",{children:l}),(0,i.jsx)("div",{className:"ui--InputAddressMulti-items",children:m.map((e=>(0,i.jsx)(Vi,{address:e,onDeselect:b},e)))})]}),(0,i.jsxs)("div",{className:"ui--InputAddressMulti-column",children:[(0,i.jsx)("label",{children:t}),(0,i.jsx)("div",{className:"ui--InputAddressMulti-items",children:g?e.map((e=>(0,i.jsx)(Li,{address:e,filter:p,isHidden:null==m?void 0:m.includes(e),onSelect:f},e))):(0,i.jsx)(ka.Z,{})})]})]})]})}const Zi=x.z.div`
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
`,Ti=s.memo(Pi);function zi({autoFocus:e,bytesLength:t,children:n,className:a="",defaultValue:r,forceIconType:o,isDisabled:l,isError:c,isFull:u,label:d,noConvert:m,onChange:h,onEnter:p,onEscape:g,placeholder:f}){const[b,v]=(0,s.useState)(r||null),x=(0,s.useCallback)((e=>{const n=(0,N.Hc)(e,void 0,t)||null,a=m?n?e:null:n;v(a),h&&h(a)}),[t,m,h]);return(0,i.jsxs)(Fi,{className:`${a} ui--InputAddressSimple`,children:[(0,i.jsx)(fa.ZP,{autoFocus:e,defaultValue:r,isDisabled:l,isError:c||!b,isFull:u,label:d,onChange:x,onEnter:p,onEscape:g,placeholder:f,children:n}),(0,i.jsx)(Je,{className:"ui--InputAddressSimpleIcon",forceIconType:o,size:32,value:b})]})}const Fi=x.z.div`
  position: relative;

  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: 0.75rem;
    position: absolute;
    top: 1rem;
  }
`,Mi=s.memo(zi);var Hi=n(94586);function Ri(e,t){if(!t)return[];const n=e[t];return n&&0!==Object.keys(e[t]).length?Object.keys(e[t]).filter((e=>!e.startsWith("$"))).sort().map((e=>n[e])).map((({description:e,method:n,params:a})=>{const s=a.map((({name:e})=>e)).join(", ");return{className:"ui--DropdownLinked-Item",key:`${t}_${n}`,text:[(0,i.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[n,"(",s,")"]},`${t}_${n}:call`),(0,i.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:e||n},`${t}_${n}:text`)],value:n}})):[]}function Ui({className:e="",defs:t,isError:n,onChange:a,options:r,value:o}){const l=(0,s.useCallback)((e=>t[o.section][e]),[t,o]);return r.length?(0,i.jsx)(la.Z,{className:`${e} ui--DropdownLinked-Items`,isError:n,onChange:a,options:r,transform:l,value:o.method,withLabel:!1}):null}const qi=s.memo(Ui);function Oi({className:e="",defaultValue:t,isError:n,onChange:a,options:s,value:r}){return(0,i.jsx)(la.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:s,value:r.section,withLabel:!1})}const Wi=s.memo(Oi);function Qi(e){return Object.entries(e).sort((([e],[t])=>e.localeCompare(t)))}const Ki=(0,xa.e)("useRuntime",(function(){const{api:e}=(0,ie.h)();return(0,s.useMemo)((()=>function(e){const t={};let n=null;const a=Qi(e.call);for(let e=0;e<a.length;e++){const[s,i]=a[e],r=Qi(i);for(let e=0;e<r.length;e++){const[a,{meta:i}]=r[e];i&&(t[s]||(t[s]={},null===n&&(n=i)),t[s][a]=i)}}return[t,n]}(e)),[e])}));function Gi({className:e,label:t,onChange:n,withLabel:a}){const[r,o]=Ki(),[l]=(0,s.useState)((()=>{return e=r,Object.keys(e).filter((e=>!e.startsWith("$"))).sort().filter((t=>0!==Object.keys(e[t]).length)).map((e=>({text:e,value:e})));var e})),[c,u]=(0,s.useState)((()=>Ri(r,o&&o.section))),[d,m]=(0,s.useState)((()=>o));(0,s.useEffect)((()=>{d&&n&&n(d)}),[n,d]);const h=(0,s.useCallback)((e=>{d!==e&&m((()=>e))}),[d]),p=(0,s.useCallback)((e=>{if(d&&e!==d.section){const t=Ri(r,e);u(t),h(r[e][t[0].value])}}),[h,r,d]);return d?(0,i.jsxs)(ds,{className:e,label:t,withLabel:a,children:[(0,i.jsx)(Wi,{className:"small",onChange:p,options:l,value:d}),(0,i.jsx)(qi,{className:"large",defs:r,onChange:h,options:c,value:d})]}):null}const Ji=s.memo(Gi);var Yi=n(44055);function Xi(e,t){const n=e.consts[t];return n&&0!==Object.keys(n).length?Object.keys(n).filter((e=>!e.startsWith("$"))).sort().map((a=>{const s=n[a];return{className:"ui--DropdownLinked-Item",key:`${t}_${a}`,text:[(0,i.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[a,": ",(0,Yi.I)(e.registry.lookup,s.meta.type)]},`${t}_${a}:call`),(0,i.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(s.meta.docs[0]||s.meta.name).toString()},`${t}_${a}:text`)],value:a}})):[]}function _i({value:e}){return t=>({method:t,section:e.section})}function er(e){const{className:t="",isError:n,onChange:a,options:s,value:r}=e;return s.length?(0,i.jsx)(la.Z,{className:`${t} ui--DropdownLinked-Items`,isError:n,onChange:a,options:s,transform:_i(e),value:r.method,withLabel:!1}):null}const tr=s.memo(er);function nr({className:e="",defaultValue:t,isError:n,onChange:a,options:s,value:{section:r}}){return(0,i.jsx)(la.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:s,value:r,withLabel:!1})}const ar=s.memo(nr);function sr({className:e="",defaultValue:t,label:n,onChange:a,withLabel:r}){const{api:o}=(0,ie.h)(),[l,c]=(0,s.useState)((()=>Xi(o,t.section))),[u]=(0,s.useState)((()=>function(e){return Object.keys(e.consts).filter((e=>!e.startsWith("$"))).sort().filter((t=>Object.keys(e.consts[t]).length)).map((e=>({text:e,value:e})))}(o))),[d,m]=(0,s.useState)((()=>function(e,{method:t,section:n}){const a=Object.keys(e.consts)[0],s=Object.keys(e.consts[a])[0],i=e.consts[n]&&e.consts[n][t]?{method:t,section:n}:{method:s,section:a};return{...i,meta:e.consts[i.section][i.method].meta}}(o,t))),h=(0,s.useCallback)((e=>{if(d.section!==e.section||d.method!==e.method){const{method:t,section:n}=e,s={meta:o.consts[n][t].meta,method:t,section:n};m(s),a&&a(s)}}),[o,a,d]),p=(0,s.useCallback)((e=>{if(e!==d.section){const t=Xi(o,e);c(t),h({method:t[0].value,section:e})}}),[h,o,d]);return(0,i.jsxs)(ds,{className:e,label:n,withLabel:r,children:[(0,i.jsx)(ar,{className:"small",onChange:p,options:u,value:d}),(0,i.jsx)(tr,{className:"large",onChange:h,options:l,value:d})]})}const ir=s.memo(sr);var rr=n(6574),or=n(56623),lr=n(74076),cr=n(48533);const ur="0".charCodeAt(0),dr="x".charCodeAt(0),mr=()=>{};function hr({accept:e,className:t="",clearContent:n,isDisabled:a,isError:r=!1,isFull:o,label:l,labelExtra:c,onChange:u,placeholder:d,withEllipsis:m,withLabel:h}){const{t:g}=(0,K.$)(),f=(0,s.createRef)(),[b,v]=(0,s.useState)(),x=(0,s.useCallback)((e=>{e.forEach((e=>{const t=new FileReader;t.onabort=mr,t.onerror=mr,t.onload=({target:t})=>{if(t&&t.result){const n=e.name,a=function(e){const t=new Uint8Array(e);if(t[0]===ur&&t[1]===dr){let e=(0,or.z)(t);for(;"\n"===e[e.length-1];)e=e.substring(0,e.length-1);if((0,lr.vq)(e))return(0,cr.G)(e)}return t}(t.result);u&&u(a,n),f&&v({name:n,size:a.length})}},t.readAsArrayBuffer(e)}))}),[f,u]),A=(0,i.jsx)(rr.ZP,{accept:e,disabled:a,multiple:!1,onDrop:x,ref:f,children:({getInputProps:e,getRootProps:a})=>(0,i.jsxs)(pr,{...a({className:`${t} ui--InputFile ${r?"error":""}`}),children:[(0,i.jsx)("input",{...e()}),(0,i.jsx)("em",{className:"label",children:!b||n?d||g("click to select or drag and drop the file here"):d||g("{{name}} ({{size}} bytes)",{replace:{name:b.name,size:(0,p.u)(b.size)}})})]})});return l?(0,i.jsx)(Kt.Z,{isFull:o,label:l,labelExtra:c,withEllipsis:m,withLabel:h,children:A}):A}const pr=x.z.div`
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
`,gr=s.memo(hr);var fr=n(51833);function br(e,t,n){const a=t[n];return a&&0!==Object.keys(e.rpc[n]).length?Object.keys(e.rpc[n]).filter((e=>!e.startsWith("$"))).sort().map((e=>a[e])).filter((e=>!!e)).filter((({isSubscription:e})=>!e)).map((({description:e,method:t,params:a})=>{const s=a.map((({name:e})=>e)).join(", ");return{className:"ui--DropdownLinked-Item",key:`${n}_${t}`,text:[(0,i.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[t,"(",s,")"]},`${n}_${t}:call`),(0,i.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:e||t},`${n}_${t}:text`)],value:t}})):[]}var vr=n(13529),xr=n(91783);const Ar=(0,xa.e)("useRpcs",(function(){const{api:e}=(0,ie.h)();return(0,s.useMemo)((()=>function(e,t,{specName:n}){return Object.entries((0,xr.KM)(e,t,n)).reduce(((e,[t,n])=>(null!=e[t]||(e[t]=function(e,t){return Object.entries(t).reduce(((t,[n,a])=>(t[n]={isSubscription:!1,jsonrpc:`${n}_${e}`,method:n,section:e,...a},t)),{})}(t,n)),e)),{...vr.Z})}(e.registry,e.runtimeChain,e.runtimeVersion)),[e])}));function wr({className:e="",isError:t,onChange:n,options:a,value:r}){const o=Ar(),l=(0,s.useCallback)((e=>o[r.section][e]),[o,r]);return a.length?(0,i.jsx)(la.Z,{className:`${e} ui--DropdownLinked-Items`,isError:t,onChange:n,options:a,transform:l,value:r.method,withLabel:!1}):null}const yr=s.memo(wr);function jr({className:e="",defaultValue:t,isError:n,onChange:a,options:s,value:r}){return(0,i.jsx)(la.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:s,value:r.section,withLabel:!1})}const kr=s.memo(jr);function Nr({className:e="",defaultValue:t,label:n,onChange:a,withLabel:r}){const{api:o}=(0,ie.h)(),l=Ar(),[c,u]=(0,s.useState)((()=>br(o,l,t.section))),[d]=(0,s.useState)((()=>function(e){return Object.keys(e.rpc).filter((e=>!e.startsWith("$"))).sort().filter((t=>0!==Object.keys(e.rpc[t]).length)).map((e=>({text:e,value:e})))}(o))),[m,h]=(0,s.useState)((()=>t));(0,s.useEffect)((()=>{a&&a(m)}),[a,m]);const p=(0,s.useCallback)((e=>{m!==e&&h((()=>e))}),[m]),g=(0,s.useCallback)((e=>{if(e!==m.section){const t=br(o,l,e);u(t),p(l[e][t[0].value])}}),[p,o,l,m]);return(0,i.jsxs)(ds,{className:e,label:n,withLabel:r,children:[(0,i.jsx)(kr,{className:"small",onChange:g,options:d,value:m}),(0,i.jsx)(yr,{className:"large",onChange:p,options:c,value:m})]})}const Cr=s.memo(Nr);var Er=n(12782);function Sr(e,t){const n=e.query[t];return n&&0!==Object.keys(n).length?Object.keys(n).filter((e=>!e.startsWith("$"))).sort().map((a=>{const{meta:{docs:s,modifier:r,name:o,type:l}}=n[a],c=(0,Er.PL)(e.registry,l,r.isOptional);let u="";if(l.isMap){const{hashers:t,key:n}=l.asMap;if(1===t.length)u=(0,Yi.I)(e.registry.lookup,n);else{const t=e.registry.lookup.getSiType(n).def;u=t.isTuple?t.asTuple.map((t=>(0,Yi.I)(e.registry.lookup,t))).join(", "):t.asHistoricMetaCompat.toString()}}return{className:"ui--DropdownLinked-Item",key:`${t}_${a}`,text:[(0,i.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[a,"(",u,"): ",c]},`${t}_${a}:call`),(0,i.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(s[0]||o).toString()},`${t}_${a}:text`)],value:a}})):[]}function Ir(e,{value:t}){return function(n){return e.query[t.creator.section]?e.query[t.creator.section][n]:t}}function Dr(e){const{api:t}=(0,ie.h)(),{className:n="",isError:a,onChange:s,options:r,value:o}=e;return r.length?(0,i.jsx)(la.Z,{className:`${n} ui--DropdownLinked-Items`,isError:a,onChange:s,options:r,transform:Ir(t,e),value:o.creator.method,withLabel:!1}):null}const Br=s.memo(Dr);function Lr({className:e="",defaultValue:t,isError:n,onChange:a,options:s,value:{creator:{section:r}}}){return(0,i.jsx)(la.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:a,options:s,value:r,withLabel:!1})}const $r=s.memo(Lr);function Vr({className:e="",defaultValue:t,label:n,onChange:a,withLabel:r}){const{api:o}=(0,ie.h)(),[l,c]=(0,s.useState)((()=>Sr(o,t.creator.section))),[u]=(0,s.useState)((()=>function(e){return Object.keys(e.query).filter((e=>!e.startsWith("$"))).sort().filter((t=>Object.keys(e.query[t]).length)).map((e=>({text:e,value:e})))}(o))),[d,m]=(0,s.useState)((()=>t)),h=(0,s.useCallback)((e=>{d!==e&&(m((()=>e)),a&&a(e))}),[a,d]),p=(0,s.useCallback)((e=>{if(e!==d.creator.section){const t=Sr(o,e);c(t),h(o.query[e][t[0].value])}}),[h,o,d]);return(0,i.jsxs)(ds,{className:e,label:n,withLabel:r,children:[(0,i.jsx)($r,{className:"small",onChange:p,options:u,value:d}),(0,i.jsx)(Br,{className:"large",onChange:h,options:l,value:d},d.creator.section)]})}const Pr=s.memo(Vr);n(82242);var Zr=n(6226),Tr=n(88311);function zr({onChange:e,...t}){const n=(0,s.useCallback)(((t,n)=>{const a=(0,Zr.F)(t);e((0,Tr.N)(t),a,n)}),[e]);return(0,i.jsx)(gr,{...t,accept:"application/wasm",onChange:n})}const Fr=s.memo(zr);x.z.div`
  & {
    box-shadow: 0 3px 3px rgba(0,0,0,.2);
    position: relative;
    background: #fefefe;
    padding: 1rem;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;

    &.bottom-margin {
      margin-bottom: 2rem;
    }

    &.top-margin {
      margin-top: 2rem;
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

    .header {
      cursor: pointer;
      height: 2rem;
      width: 100%;

      h3 {
        line-height: 2rem;
        margin-bottom: 0;
      }

      .icon {
        height: 4rem;
        width: 4rem;
        font-size: 2rem;
        color: rgba(0,0,0,0.35);
        position: absolute;
        right: 0;
        top: 0;
        line-height: 4rem;
        transition: all 0.2s;
        transform-origin: center center;

        &.collapsed {
          transform: rotate(180deg);
        }
      }
    }

    .children {
      &.collapsed {
        display: none;
      }
    }

    &.as-link {
      cursor: pointer;

      &:hover {
        box-shadow: 0 5px 5px rgba(0,0,0,.2);
        transform: translateY(-2px);
      }
    }
  }
`;let Mr=0;function Hr({className:e="",help:t,icon:n="question-circle"}){const[a]=(0,s.useState)((()=>"label-help-"+ ++Mr));return(0,i.jsxs)(Rr,{className:`${e} ui--LabelHelp`,tabIndex:-1,children:[(0,i.jsx)(v.Z,{icon:n,tooltip:a}),(0,i.jsx)(A.Z,{text:t,trigger:a})]})}const Rr=x.z.div`
  cursor: help;
  display: inline-block;
  line-height: 1rem;
  margin: 0 0 0 0.25rem;
`,Ur=s.memo(Hr);var qr=n(2491);function Or(e,{data:t,hash:n,isText:a,type:s}){return Object.entries(qr.N).map((([r,{chains:o,create:l,homepage:c,isActive:u,paths:d,ui:m}])=>{const h=o[e],p=d[s];return u&&h&&p?(0,i.jsx)("a",{href:l(h,p,t,n),rel:"noopener noreferrer",target:"_blank",title:`${r}, ${c}`,children:a?r:(0,i.jsx)("img",{src:m.logo})},r):null})).filter((e=>!!e))}function Wr({className:e="",data:t,hash:n,isSidebar:a,isSmall:r,isText:o,type:l,withTitle:c}){const{t:u}=(0,K.$)(),{systemChain:d}=(0,ie.h)(),m=(0,s.useMemo)((()=>Or(d,{data:t,hash:n,isSidebar:a,isText:o,type:l})),[d,t,n,a,o,l]);return m.length||c?(0,i.jsxs)(Qr,{className:`${e} ui--LinkExternal ${o?"isText":"isLogo"} ${c?"isMain":""} ${r?"isSmall":""} ${a?"isSidebar":""}`,children:[o&&!r&&(0,i.jsx)("div",{children:u("View this externally")}),c&&(0,i.jsx)("h5",{children:u("external links")}),(0,i.jsx)("div",{className:"links",children:m.length?m.map(((e,t)=>(0,i.jsx)("span",{children:e},t))):(0,i.jsx)("div",{children:u("none")})})]}):null}const Qr=x.z.div`
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
`,Kr=s.memo(Wr);function Gr({children:e,className:t="",content:n}){return(0,i.jsxs)(Jr,{className:`${t} mark error`,children:[(0,i.jsx)(v.Z,{icon:"exclamation-triangle"}),n,e]})}const Jr=x.z.article`
  .ui--Icon {
    color: rgba(255, 12, 12, 1);
    margin-right: 0.5rem;
  }
`,Yr=s.memo(Gr);function Xr({className:e=""}){return(0,i.jsx)(_r,{className:`${e} ui--Menu__Divider`})}const _r=x.z.div`
  margin: 0.25rem 0 1rem;
  border-top: 1px solid var(--border-table);

  &:first-child, &:last-child {
    display: none
  }
`,eo=s.memo(Xr);function to({children:e,className:t}){return(0,i.jsx)(no,{className:t,children:e})}const no=x.z.div`
  color: var(--color-label);
  font-size: var(--font-size-tiny);
  line-height: 0.857rem;
  margin-bottom: 0.3rem;
`,ao=s.memo(to);function so({children:e,className:t="",icon:n,isDisabled:a,label:r,onClick:o}){const l=(0,s.useCallback)((()=>{!a&&o&&Promise.resolve(o()).catch(console.error)}),[a,o]);return(0,i.jsxs)(io,{className:`${t} ui--Menu__Item ${n?"hasIcon":""} ${a?"isDisabled":""}`,onClick:l,children:[n&&(0,i.jsx)(v.Z,{color:"darkGray",icon:n}),r,e]})}const io=x.z.div`
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
`,ro=s.memo(so);function oo({children:e,className:t=""}){return(0,i.jsx)(lo,{className:`${t} ui--Menu`,children:e})}const lo=x.z.div`
  display: flex;
  flex-direction: column;
  min-width: 14.286rem;
  margin: 1rem 0;

  & > *:not(.ui--Menu__Item):not(.ui--Menu__Divider) {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`,co=s.memo(oo);co.Divider=eo,co.Item=ro,co.Header=ao;const uo=co;var mo=n(17965);function ho({children:e,isActive:t=!0}){const[n,a]=(0,s.useState)((()=>new Array(e.length).fill(!1)));return(0,s.useEffect)((()=>{if(t){const e=n.findIndex((e=>!e));-1!==e&&(0,mo.Y)((()=>a(n.map(((t,n)=>n===e||t)))))}}),[t,n]),(0,i.jsx)(i.Fragment,{children:t?n.map(((t,n)=>t&&e[n])):(0,i.jsx)(ka.Z,{})})}const po=s.memo(ho);function go({autoFocus:e,children:t,className:n="",defaultValue:a,isDisabled:s,isError:r,isFull:o,label:l,labelExtra:c,name:u,onChange:d,onEnter:m,onEscape:h,tabIndex:p,value:g,withLabel:f}){return(0,i.jsx)(fa.ZP,{autoFocus:e,className:`${n} ui--Password`,defaultValue:a,isDisabled:s,isError:r,isFull:o,label:l,labelExtra:c,name:u,onChange:d,onEnter:m,onEscape:h,tabIndex:p,type:"password",value:g,withLabel:f,children:t})}const fo=s.memo(go);var bo=n(81679),vo=n.n(bo);function xo({className:e="",value:t}){const{t:n}=(0,K.$)(),a={width:100*function(e){const t=vo().test(e),n=Math.max(0,t.passedTests.length-t.failedTests.length);return t.isPassphrase?7:n}(t)/7+"%"};return(0,i.jsxs)(Ao,{className:e,style:{display:t?"flex":"none"},children:[n("weak"),(0,i.jsx)("div",{className:"ui--Strength-bar",children:(0,i.jsx)("div",{className:"ui--Strength-bar-highlighted",style:a})}),n("strong")]})}vo().config({allowPassphrases:!0,maxLength:128,minLength:8,minPhraseLength:20});const Ao=x.z.div`
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
`,wo=s.memo(xo);var yo=n(76015);function jo({className:e,id:t}){const n=(0,yo.jC)(t),a=(0,s.useMemo)((()=>n.filter((({isDisabled:e,isUnreachable:t})=>!e&&!t))),[n]);if(!n.length)return null;const{text:r,ui:o,value:l}=a.length?a[a.length-1]:n[0];return(0,i.jsxs)(ko,{className:e,children:[(0,i.jsx)(yn,{isInline:!0,logo:o.logo||"empty",withoutHl:!0}),a.length?(0,i.jsx)("a",{className:"chainAlign",href:`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(l)}`,children:r}):r]})}const ko=x.z.div`
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
`,No=s.memo(jo);var Co=n(47951),Eo=n(28316);const So=14*.8;function Io(e,t){return"left"===t?e-So:"right"===t?So:e/2}function Do(e,t,n,a,s){const{height:i,y:r}=t;return"bottom"===e?a.height-i-r-14>n:s<56?r-(56-s)>n:r>n}function Bo(e,t,n){return"bottom"===t?e/2:-1*(e/2+n+So)}function Lo(e,t,n,a){return"bottom"===t?e+n.height-a-14:e<56?56:e}const $o=(0,xa.e)("useScroll",(function(){const[e,t]=(0,s.useState)(window.scrollY),n=(0,s.useCallback)((()=>t(window.scrollY)),[]);return(0,s.useEffect)((()=>(window.addEventListener("scroll",n),()=>{window.removeEventListener("scroll",n)})),[n]),e})),Vo=(0,xa.e)("useElementPosition",(function(e){const[t,n]=(0,s.useState)(),a=(0,le.X)(),i=ya(),r=$o();return(0,s.useEffect)((()=>{if(a.current&&e&&e.current){const{height:t,width:a,x:s,y:i}=e.current.getBoundingClientRect();n({height:t,width:a,x:s,y:i})}}),[a,e,r,i]),t})),Po={x:0,y:0},Zo=(0,xa.e)("usePopupWindow",(function(e,t,n){const[a,i]=(0,s.useState)(Po),[r,o]=(0,s.useState)("top"),l=Vo(e),c=Vo(t),u=$o(),d=ya();return(0,s.useEffect)((()=>{d&&c&&o(c.y>d.height/2?"top":"bottom")}),[c,d]),(0,s.useEffect)((()=>{l&&c&&i(function(e,t,n,a,s,i){const r=e.x+e.width/2,o=e.y+s+e.height/2;return{x:r-Io(a.width,t),y:Do(n,e,a.height,i,s)?o+Bo(e.height,n,a.height):Lo(s,n,i,a.height)}}(c,n,r,l,u,d))}),[n,u,c,r,l,d]),(0,s.useMemo)((()=>({pointerStyle:r,renderCoords:a})),[a,r])}));function To({children:e,className:t="",position:n,triggerRef:a,windowRef:s}){const{pointerStyle:r,renderCoords:{x:o,y:l}}=Zo(s,a,n);return(0,Eo.createPortal)((0,i.jsx)(zo,{className:`${t} ${r}Pointer ${n}Position`,"data-testid":"popup-window",ref:s,style:o&&l&&{transform:`translate3d(${o}px, ${l}px, 0)`,zIndex:1e3}||void 0,children:e}),document.body)}const zo=x.z.div`
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
`,Fo=s.memo(To);function Mo({children:e,className:t="",closeOnScroll:n,isDisabled:a,onCloseAction:r,position:o="left",value:l}){const{themeClassName:c}=(0,b.F)(),[u,d,m]=(0,_.O)(!1),h=(0,s.useRef)(null),p=(0,s.useRef)(null),g=(0,s.useCallback)((()=>m(!1)),[m]),f=(0,s.useMemo)((()=>[h,p]),[h,p]);return(0,Co.O)(f,g),(0,s.useEffect)((()=>(n&&document.addEventListener("scroll",g,!0),()=>document.removeEventListener("scroll",g,!0))),[n,g,m]),(0,s.useEffect)((()=>{!u&&r&&r()}),[u,r]),(0,i.jsxs)(Ho,{className:`${t} ui--Popup ${c}`,children:[u&&(0,i.jsx)(Fo,{position:o,triggerRef:h,windowRef:p,children:l}),(0,i.jsx)("div",{"data-testid":"popup-open",onClick:d,ref:h,children:null!=e?e:(0,i.jsx)(de.Z,{className:u?"isOpen":"",icon:"ellipsis-v",isDisabled:a,isReadOnly:!1})})]})}const Ho=x.z.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`,Ro=s.memo(Mo);function Uo({className:e="",idNumber:t,proposal:n}){const{t:a}=(0,K.$)(),s=(0,Ut.H)(t)||(0,rn.o)(t)?t:(0,p.u)(t);return n?(0,i.jsx)("div",{className:`${e} ui--ProposedAction`,children:(0,i.jsx)(tn,{isHeader:!0,labelHash:a("preimage"),stringId:s,value:n,withHash:!0})}):(0,i.jsx)("div",{className:`${e} ui--ProposedAction`,children:(0,i.jsxs)("div",{children:[s?`#${s}: `:"",a("No execution details available for this proposal")]})})}const qo=s.memo(Uo);var Oo=n(5678);function Wo({className:e="",stakingInfo:t}){var n,a;const s=null==t||null==(n=t.stakingLedger)||null==(a=n.active)?void 0:a.unwrap();return null!=s&&s.gtn(0)?(0,i.jsx)(M.Z,{className:e,value:s}):null}const Qo=s.memo(Wo);var Ko=n(62528);function Go(e){switch(e){case"error":return"ban";case"event":case"eventWarn":return"assistive-listening-systems";case"received":return"telegram-plane";default:return"check"}}function Jo({account:e,action:t,id:n,message:a,removeItem:s,status:r}){return(0,i.jsx)("div",{className:`item ${r}`,children:(0,i.jsx)("div",{className:"wrapper",children:(0,i.jsxs)("div",{className:"container",children:[(0,i.jsx)(v.Z,{icon:"times",onClick:s}),(0,i.jsx)("div",{className:"short",children:(0,i.jsx)(v.Z,{icon:Go(r)})}),(0,i.jsxs)("div",{className:"desc",children:[(0,i.jsx)("div",{className:"header",children:Array.isArray(t)?t.map(((e,t)=>(0,i.jsx)("div",{children:e},t))):t}),e&&(0,i.jsx)(at,{value:e}),(0,i.jsx)("div",{className:"status",children:a})]})]})})},n)}function Yo({error:e,extrinsic:t,id:n,removeItem:a,rpc:s,status:r}){let{method:o,section:l}=s;if(t){const e=t.registry.findMetaCall(t.callIndex);"unknown"!==e.section&&(o=e.method,l=e.section)}const c=function(e){switch(e){case"cancelled":return"ban";case"completed":case"inblock":case"finalized":case"sent":return"check";case"dropped":case"invalid":case"usurped":return"arrow-down";case"error":case"finalitytimeout":return"exclamation-triangle";case"queued":return"random";default:return"spinner"}}(r);return(0,i.jsx)("div",{className:`item ${r}`,children:(0,i.jsx)("div",{className:"wrapper",children:(0,i.jsxs)("div",{className:"container",children:[Ko.z.includes(r)&&(0,i.jsx)(v.Z,{icon:"times",onClick:a}),(0,i.jsx)("div",{className:"short",children:"spinner"===c?(0,i.jsx)(ka.Z,{variant:"push"}):(0,i.jsx)(v.Z,{icon:c})}),(0,i.jsxs)("div",{className:"desc",children:[(0,i.jsxs)("div",{className:"header",children:[l,".",o]}),(0,i.jsx)("div",{className:"status",children:e?e.message||e:r})]})]})})},n)}function Xo({className:e=""}){const{stqueue:t,txqueue:n}=(0,ce.L)(),[a,r]=(0,s.useState)([]),[o,l]=(0,s.useState)([]);return(0,s.useEffect)((()=>{r(function(e){return(e||[]).filter((({isCompleted:e})=>!e))}(t))}),[t]),(0,s.useEffect)((()=>{l(function(e){return(e||[]).filter((({status:e})=>!["completed","incomplete"].includes(e)))}(n))}),[n]),a.length||o.length?(0,i.jsxs)(_o,{className:`${e} ui--Status`,children:[o.map(Yo),a.map(Jo)]}):null}const _o=x.z.div`
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
`,el=s.memo(Xo);function tl({children:e,className:t="",isSmall:n}){return(0,i.jsx)(nl,{className:`${t}${n?" isSmall":""}`,children:e})}const nl=x.z.div`
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
`,al=s.memo(tl);var sl=n(7267);function il({className:e="",icon:t,text:n}){return(0,i.jsxs)(rl,{className:`${e} active-tab`,children:[(0,i.jsx)(v.Z,{icon:t}),(0,i.jsx)("span",{children:n})]})}const rl=x.z.div`
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
`,ol=s.memo(il);var ll=n(47933);function cl({basePath:e,className:t="",count:n,hasParams:a,index:s,isExact:r,isRoot:o,name:l,text:c}){const u=o?e:`${e}/${l}`,d=r||!a||0===s;return(0,i.jsxs)(ul,{activeClassName:"tabLinkActive",className:`${t} ui--Tab`,exact:d,strict:d,to:u,children:[(0,i.jsx)("div",{className:"tabLinkText",children:c}),!!n&&(0,i.jsx)(k,{className:"tabCounter",color:"counter",info:n})]})}const ul=(0,x.z)(ll.OL)`
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

  &:hover .tabLinkText::after,
  &.tabLinkActive .tabLinkText::after {
    content: '';
    position: absolute;
    width: 3.14rem;
    height: 2px;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.tabLinkActive {
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
`,dl=s.memo(cl);function ml({className:e=""}){return(0,i.jsx)(hl,{className:e,children:(0,i.jsx)("svg",{fill:"none",height:"47",viewBox:"0 0 17 65",width:"17",xmlns:"http://www.w3.org/2000/svg",children:(0,i.jsx)("path",{className:"highlight--stroke",d:"M1 1L16 32.5L1 64",stroke:"#D1D1D1"})})})}const hl=x.z.div`
  height: 100%;
  width: auto;
`,pl=s.memo(ml),gl=s.createContext({});function fl({basePath:e,className:t="",hidden:n,items:a}){const r=(0,sl.TH)(),{icon:o,text:l}=s.useContext(gl),c=(0,s.useMemo)((()=>a.filter((e=>!(!e||n&&n.includes(e.name))))),[n,a]);return(0,s.useEffect)((()=>function(e,t,n,a){if(t.pathname!==e){const[,,s]=t.pathname.split("/"),i=n.find((e=>e&&e.alias===s));i?window.location.hash=i.isRoot?e:`${e}/${i.name}`:!a||!a.includes(s)&&n.some((e=>e&&!e.isRoot&&e.name===s))||(window.location.hash=e)}}(e,r,a,n)),[e,n,a,r]),(0,i.jsx)(bl,{className:`${t} ui--Tabs`,children:(0,i.jsxs)("div",{className:"tabs-container",children:[l&&o&&(0,i.jsx)(ol,{icon:o,text:l}),(0,i.jsx)(pl,{}),(0,i.jsx)("ul",{className:"ui--TabsList",children:c.map(((t,n)=>(0,i.jsx)("li",{className:t.isHidden?"--hidden":"",children:(0,s.createElement)(dl,{...t,basePath:e,index:n,key:t.name})},n)))})]})})}const bl=x.z.header`
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
`,vl=s.memo(fl);var xl=n(95350);function Al({index:e,isDisabled:t,isSelected:n,onChange:a,text:r,value:o}){const l=(0,s.useCallback)((()=>{!t&&a(e,o)}),[t,e,a,o]);return(0,i.jsx)(de.Z,{icon:n?"check":"circle",isBasic:!0,isDisabled:t,isSelected:n,label:r,onClick:l},r)}const wl=s.memo(Al);function yl({className:e="",onChange:t,options:n,value:a}){const r=(0,s.useMemo)((()=>n.filter((e=>!!e))),[n]);return r.length&&r[0].value?(0,i.jsx)(jl,{className:`${e} ui--ToggleGroup`,children:r.map((({isDisabled:e,text:n,value:s},r)=>(0,i.jsx)(wl,{index:r,isDisabled:e,isSelected:a===r,onChange:t,text:n,value:s},r)))}):null}const jl=x.z.div`
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
`,kl=s.memo(yl);function Nl({className:e="",filter:t,onChange:n}){const{t:a}=(0,K.$)();return(0,i.jsx)(Ii,{className:e,filter:t,label:a("vote with account"),onChange:n,type:"account",withLabel:!0})}const Cl=s.memo(Nl);function El({children:e,className:t="",label:n,params:a}){var s;const{api:r}=(0,ie.h)(),o=(0,oe.W7)(null==(s=r.derive.balances)?void 0:s.all,[a]);return(0,i.jsx)(M.Z,{className:t,label:n,value:null==o?void 0:o.votingBalance,children:e})}const Sl=s.memo(El),Il=["pyconvot","democrac","phrelect"];function Dl({accountId:e,autoFocus:t,label:n,noDefault:a,onChange:r}){var o;const{t:l}=(0,K.$)(),{api:c}=(0,ie.h)(),u=(0,oe.W7)(null==(o=c.derive.balances)?void 0:o.all,[e]),[{defaultValue:d,maxValue:m,selectedId:h,value:p},g]=(0,s.useState)({defaultValue:U.nw,maxValue:U.nw,value:U.nw});(0,s.useEffect)((()=>{u&&u.accountId.eq(e)&&g((t=>t.selectedId!==e?function(e,t,n,a){const s=n.lockedBreakdown.sort(((e,t)=>t.amount.cmp(e.amount))).sort(((e,t)=>{if(!e.id.eq(t.id))for(let n=0;n<Il.length;n++){const a=Il[n];if(e.id.eq(a))return-1;if(t.id.eq(a))return 1}return 0})).map((({amount:e})=>e)),i=n.votingBalance;let r=s[0]||n.lockedBalance;if(t)r=U.nw;else if(r.isZero()){let e=i.sub(a);for(let t=0;t<3;t++)e.gt(a)&&(r=e,e=e.sub(a))}return{defaultValue:r,maxValue:i,selectedId:e,value:r}}(e,a,u,c.consts.balances.existentialDeposit):t))}),[u,e,c,a]),(0,s.useEffect)((()=>{r(p)}),[r,p]);const f=(0,s.useCallback)((t=>g((n=>n.selectedId===e&&t&&!t.eq(n.value)?{...n,value:t}:n))),[e]),b=e!==h;return(0,i.jsx)(Hi.Z,{autoFocus:t,defaultValue:b?void 0:d,isDisabled:b,isZeroable:!0,label:n||l("vote value"),labelExtra:(0,i.jsx)(Sl,{label:(0,i.jsx)("label",{children:l("voting balance")}),params:e}),maxValue:m,onChange:f})}const Bl=s.memo(Dl);function Ll({children:e,className:t,isError:n,isReadOnly:a,label:r,onChange:o,seed:l,withLabel:c}){const u=(0,s.useCallback)((({target:{value:e}})=>{o&&o(e)}),[o]);return(0,i.jsx)($l,{className:t,label:r,withLabel:c,children:(0,i.jsxs)("div",{className:"TextAreaWithDropdown",children:[(0,i.jsx)("textarea",{autoCapitalize:"off",autoCorrect:"off",autoFocus:!1,className:n?"ui-textArea-withError":"",onChange:u,readOnly:a,rows:2,spellCheck:!1,value:l}),e]})})}const $l=(0,x.z)(Kt.Z)`
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
`,Vl=s.memo(Ll);function Pl({className:e="",expanded:t,onClick:n}){return(0,i.jsx)(Zl,{className:`${e} ui--ExpandButton`,"data-testid":"row-toggle",onClick:n,children:(0,i.jsx)(v.Z,{icon:t?"caret-up":"caret-down"})})}const Zl=x.z.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid var(--border-table);
  border-radius: 4px;
  cursor: pointer;
`,Tl=s.memo(Pl);function zl({className:e="",defaultValue:t,label:n,onChange:a,onClick:s,options:r,sortDirection:o}){return(0,i.jsxs)(Fl,{className:`${e} ui--Sort`,children:[(0,i.jsx)(la.Z,{defaultValue:t,label:n,onChange:a,options:r}),(0,i.jsxs)("button",{onClick:s,children:[(0,i.jsx)(v.Z,{className:"arrow up"+("ascending"===o?" isActive":""),color:"gray",icon:"sort-up"}),(0,i.jsx)(v.Z,{className:"arrow down"+("descending"===o?" isActive":""),color:"gray",icon:"sort-down"})]})]})}const Fl=x.z.div`
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
      margin:0;
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
    position: relative;
    width: 2.857rem;
    height: 3.893rem;

    background-color: var(--bg-input);

    border-width: 1px 1px 1px 0;
    border-style: solid;
    border-color: var(--border-input);
    border-radius: 0 4px 4px 0;

    &:hover {
      cursor: pointer;
    }

    .arrow.down {
      position: absolute;
      top: calc(50% - 0.5rem);
      left: calc(50% - 0.313rem);
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
`,Ml=s.memo(zl);function Hl({className:e="",filterOn:t,label:n,setFilter:a}){return(0,i.jsx)(Rl,{className:e,children:(0,i.jsx)(fa.ZP,{autoFocus:!0,isFull:!0,label:n,onChange:a,value:t})})}const Rl=x.z.div`
  width: 29.5rem;

  .ui--Input {
    margin: 0;
    height: 3.893rem;
  }
`,Ul=s.memo(Hl)},14028:(e,t,n)=>{n.d(t,{z:()=>s});var a=n(82740);const s=a.ZP.styled||a.ZP.default||a.ZP},75688:(e,t,n)=>{n.d(t,{Z:()=>g});var a=n(82740);const s=["2000","1900","1800","1700","1600","1500","1400","1300","1200","1100","1000","900","800","700","600","500","400"].map((e=>`\n  .media--${e} {\n    @media only screen and (max-width: ${e}px) {\n      display: none !important;\n    }\n  }\n\n  .media--${e}-noPad {\n    @media only screen and (max-width: ${e}px) {\n      min-width: 0 !important;\n      padding: 0 !important;\n    }\n  }\n`)).join("");var i=n(99022);const r=160,o=[.2126,.7152,.0722],l=[0,2,4],c="#f19135";function u(e){return e||c}function d(e){const t=u(e).replace("#","").toLowerCase();return l.reduce(((e,n,a)=>e+parseInt(t.substring(n,n+2),16)*o[a]),0)}function m(e){return d(e)>r?"rgba(45, 43, 41, 0.875)":"rgba(255, 253, 251, 0.875)"}function h(e){const t=d(e);return t<16?"rgba(255, 255, 255, 0.15)":t<r?"rgba(0, 0, 0, 0.15)":"rgba(255, 255, 255, 0.15)"}function p(e,t){const n=parseInt(e.slice(1,3),16),a=parseInt(e.slice(3,5),16),s=parseInt(e.slice(5,7),16);return t?`rgba(${n}, ${a}, ${s}, ${t})`:`rgb(${n}, ${a}, ${s})`}const g=(0,a.vJ)((({theme:e,uiHighlight:t})=>`\n  .highlight--all {\n    background: ${u(t)} !important;\n    border-color: ${u(t)} !important;\n    color: ${u(t)} !important;\n  }\n\n  .highlight--before:before {\n    background: ${u(t)} !important;\n  }\n\n  .highlight--before-border:before {\n    border-color: ${u(t)} !important;\n  }\n\n  .highlight--bg {\n    background: ${u(t)} !important;\n  }\n\n  .highlight--bg-contrast {\n    background: ${m(t)};\n  }\n\n  .ui--MenuItem.isActive .ui--Badge {\n    background: ${u(t)};\n    color: ${m(t)} !important;\n  }\n\n  .ui--MenuItem {\n    & .ui--Badge {\n      color: ${d(t)<r?"#fff":"#424242"};\n    }\n\n    &:hover:not(.isActive) .ui--Badge {\n      background: ${d(t)<r?"rgba(255, 255, 255, 0.8)":"#4D4D4D"};\n      color: ${d(t)>r?"#fff":"#424242"};\n    }\n  }\n\n  .ui--Tab .ui--Badge {\n    background: ${u(t)};\n    color: ${d(t)<r?"#fff":"#424242"};\n  }\n\n  .highlight--bg-faint,\n  .highlight--bg-light {\n    background: var(--bg-table);\n    position: relative;\n\n    &:before {\n      background: ${u(t)};\n      bottom: 0;\n      content: ' ';\n      left: 0;\n      position: absolute;\n      right: 0;\n      top: 0;\n      z-index: -1;\n    }\n  }\n\n  .highlight--bg-faint:before {\n    opacity: 0.025;\n  }\n\n  .highlight--bg-light:before {\n    opacity: 0.2;\n  }\n\n  .highlight--border {\n    border-color: ${u(t)} !important;\n  }\n\n  .highlight--color {\n    color: ${u(t)} !important;\n  }\n\n  .highlight--color-contrast {\n    color: ${m(t)};\n  }\n\n  .highlight--fill {\n    fill: ${u(t)} !important;\n  }\n\n  .highlight--gradient {\n    background: linear-gradient(90deg, ${t||c}, transparent);\n  }\n\n  .ui--MenuItem.topLevel:hover,\n  .ui--MenuItem.isActive.topLevel:hover {\n    color: ${m(t)};\n\n    a {\n      background-color: ${h(t)};\n    }\n  }\n\n  .menuItems li:hover .groupHdr {\n    background: ${h(t)};\n    color: ${m(t)};\n  }\n\n  .groupMenu {\n    background: ${u(t)} !important;\n\n    &::before {\n      background: ${h(t)};\n      color:  ${m(t)};\n    }\n    li {\n      color:  ${m(t)};\n    }\n  }\n\n  .highlight--hover-bg:hover {\n    background: ${u(t)} !important;\n  }\n\n  .highlight--hover-color:hover {\n    color: ${u(t)} !important;\n  }\n\n  .highlight--icon {\n    .ui--Icon {\n      color: ${u(t)} !important;\n    }\n  }\n\n  .highlight--shadow {\n    box-shadow: 0 0 1px ${u(t)} !important;\n  }\n\n  .highlight--stroke {\n    stroke: ${u(t)} !important;\n  }\n\n  .ui--Button {\n    &:not(.isDisabled):not(.isIcon):not(.isBasic),\n    &.withoutLink:not(.isDisabled) {\n      .ui--Icon {\n        background: ${u(t)};\n        color: ${m(t)};\n      }\n    }\n\n    &.isBasic:not(.isDisabled):not(.isIcon):not(.isSelected) {\n      &:not(.isReadOnly) {\n        box-shadow: 0 0 1px ${u(t)};\n      }\n\n      .ui--Icon {\n        color: ${u(t)};\n      }\n    }\n\n    &.isSelected {\n      box-shadow: 0 0 1px ${u(t)};\n    }\n\n    &:hover:not(.isDisabled):not(.isReadOnly),\n    &.isSelected {\n      background: ${u(t)};\n      color: ${m(t)};\n      text-shadow: none;\n\n      &:not(.isIcon),\n      &.withoutLink {\n        .ui--Icon {\n          color: inherit;\n        }\n      }\n    }\n  }\n\n  .ui--Table td .ui--Button {\n    &:not(.isDisabled):not(.isIcon):not(.isToplevel),\n    &.withoutLink:not(.isDisabled) {\n      &:hover {\n        .ui--Icon {\n          color: ${m(t)};\n        }\n      }\n\n      .ui--Icon {\n        background: transparent;\n        color: inherit;\n        color: ${u(t)};\n      }\n    }\n  }\n\n  .ui--Popup .ui--Button.isOpen:not(.isDisabled):not(.isReadOnly) {\n    background: ${u(t)} !important;\n    color: ${m(t)} !important;\n\n    .ui--Icon {\n      background: transparent !important;\n      color: ${m(t)} !important;\n    }\n  }\n\n\n  .ui--Menu {\n    .ui--Menu__Item:hover {\n       background: ${p(u(t),".1")};\n    }\n\n    .ui--Toggle.isChecked .ui--Toggle-Slider {\n      background: ${u(t)};\n\n      &::before {\n        border-color: ${u(t)};\n      }\n    }\n  }\n\n  .ui--Sort {\n    .ui--Labelled.ui--Dropdown:hover {\n     .ui.selection.dropdown {\n        border-color: ${u(t)};\n\n       .visible.menu {\n         border: 1px solid ${u(t)};\n        }\n      }\n    }\n\n    button:hover {\n      border-color: ${u(t)};\n    }\n\n    button:hover,\n    .ui--Labelled.ui--Dropdown:hover {\n      &::after {\n        background-color:  ${u(t)};\n      }\n    }\n\n    .arrow.isActive {\n      color:  ${u(t)};\n      opacity: 1;\n    }\n  }\n\n  .theme--dark,\n  .theme--light {\n    .ui--Tabs .tabLinkActive .tabLinkText::after{\n        background: ${u(t)};\n    }\n\n    .ui.primary.button,\n    .ui.buttons .primary.button {\n      background: ${u(t)};\n\n      &.active,\n      &:active,\n      &:focus,\n      &:hover {\n        background-color: ${u(t)};\n      }\n    }\n\n    .ui--Toggle.isChecked {\n      &:not(.isRadio) {\n        .ui--Toggle-Slider {\n          background: ${u(t)} !important;\n\n          &:before {\n            border-color: ${u(t)} !important;\n          }\n        }\n      }\n    }\n  }\n\n  .ui--ExpandButton:hover {\n    border-color: ${u(t)} !important;\n\n    .ui--Icon {\n      color: ${u(t)} !important;\n    }\n  }\n\n  .ui--Tag.themeColor.lightTheme,\n  .ui--InputTags.lightTheme .ui.label {\n    background: ${p(u(t),"0.08")};\n    color: ${d(t)>r?"#424242":u(t)};\n  }\n\n  .ui--Tag.themeColor.darkTheme,\n  .ui--InputTags.darkTheme .ui.label {\n    color: ${d(t)>r?u(t):"#fff"};\n  }\n\n  #root {\n    background: var(--bg-page);\n    color: var(--color-text);\n    font: var(--font-sans);\n    font-weight: var(--font-weight-normal);\n    height: 100%;\n  }\n\n  a {\n    cursor: pointer;\n  }\n\n  article {\n    background: var(--bg-table);\n    border: 1px solid #f2f2f2;\n    border-radius: 0.25rem;\n    box-sizing: border-box;\n    margin: 0.25rem;\n    padding: 1.25rem;\n    position: relative;\n    text-align: left;\n\n    > ul {\n      margin: 0;\n      padding: 0;\n    }\n\n    &.error,\n    &.warning {\n      border-left-width: 0.25rem;\n      font-size: var(--font-size-small);\n      line-height: 1.5;\n      margin-left: 2.25rem;\n      padding: 0.75rem 1rem;\n      position: relative;\n      z-index: 5;\n\n      &:before {\n        border-radius: 0.25rem;\n        bottom: 0;\n        content: ' ';\n        left: 0;\n        position: absolute;\n        right: 0;\n        top: 0;\n        z-index: -1;\n      }\n    }\n\n    &.mark {\n      margin: 0.5rem 0 0.5rem 2.25rem;\n      padding: 0.5rem 1rem !important;\n    }\n\n    &.nomargin {\n      margin-left: 0;\n    }\n\n    &.extraMargin {\n      margin: 2rem auto;\n    }\n\n    &.centered {\n      margin: 1.5rem auto;\n      max-width: 75rem;\n\n      &+.ui--Button-Group {\n        margin-top: 2rem;\n      }\n    }\n\n    &.error {\n      &:before {\n        background: rgba(255, 12, 12, 0.05);\n      }\n\n      border-color: rgba(255, 12, 12, 1);\n    }\n\n    &.padded {\n      padding: 0.75rem 1rem;\n\n      > div {\n        margin: 0.25rem;\n      }\n    }\n\n    &.warning {\n      &:before {\n        background: rgba(255, 196, 12, 0.05);\n      }\n\n      border-color: rgba(255, 196, 12, 1);\n    }\n  }\n\n  body {\n    height: 100%;\n    margin: 0;\n    font: var(--font-sans);\n  }\n\n  br {\n    line-height: 1.5rem;\n  }\n\n  details {\n    cursor: pointer;\n\n    &[open] > summary {\n      white-space: normal;\n\n      br, br + * {\n        display: block;\n      }\n    }\n\n    > summary {\n      text-overflow: ellipsis;\n      overflow: hidden;\n      white-space: nowrap;\n      outline: none;\n\n      br, br + * {\n        display: none;\n      }\n    }\n  }\n\n  h1, h2, h3, h4, h5 {\n    color: var(--color-header);\n    font: var(--font-sans);\n    font-weight: var(--font-weight-header);\n    margin-bottom: 0.25rem;\n  }\n\n\n  h1 {\n    font-size: var(--font-size-h1);\n    text-transform: lowercase;\n\n    em {\n      font-style: normal;\n      text-transform: none;\n    }\n  }\n\n  h2 {\n    font-size: var(--font-size-h2);\n  }\n\n  h3 {\n    font-size: var(--font-size-h3);\n  }\n\n  h4 {\n    font-size: var(--font-size-h4);\n  }\n\n  header {\n    margin-bottom: 1.5rem;\n    text-align: center;\n\n    > article {\n      background: transparent;\n    }\n  }\n\n  html {\n    height: 100%;\n  }\n\n  label {\n    box-sizing: border-box;\n    display: block;\n    font: var(--font-sans);\n  }\n\n  // we treat h5 and label as equivalents\n  label, h5 {\n    color: var(--color-label);\n    font-size: var(--font-size-label);\n    font-style: normal;\n    font-weight: var(--font-weight-label);\n    line-height: 1rem;\n    margin-bottom: 0.25rem !important;\n    text-transform: var(--text-transform-label);\n    vertical-align: middle;\n  }\n\n  button {\n    font-size: var(--font-size-small);\n    font-weight: var(--font-weight-normal);\n  }\n\n  main {\n    > section {\n      margin-bottom: 2em;\n    }\n  }\n\n  /* Add our overrides */\n  \n  .ui.hidden.divider {\n    margin: 0.5rem 0;\n  }\n\n  .ui.dropdown {\n    display: block;\n    min-width: 0;\n    width: 100%;\n  }\n\n  .ui.dropdown,\n  .ui.input {\n    margin: 0.25rem 0;\n  }\n\n  .ui.selection.dropdown,\n  .ui.input > input,\n  .ui.selection.dropdown > input {\n    background: var(--bg-input);\n    border-color: var(--border-input);\n    color: var(--color-text);\n    font: var(--font-sans);\n    font-size: var(--font-size-base);\n\n    &:focus {\n      background: var(--bg-input);\n      color: var(--color-text);\n    }\n  }\n\n  .ui.action.input > .buttons {\n    position: relative;\n  }\n\n  .ui.dropdown {\n    &.disabled {\n      background: transparent;\n      border-style: dashed;\n      opacity: 1;\n\n      .dropdown.icon {\n        opacity: 0;\n      }\n    }\n\n    &.selection.visible {\n      background: var(--bg-input);\n      color: var(--color-text);\n    }\n\n    .menu {\n      background: var(--bg-input);\n      color: var(--color-text);\n\n      > .item {\n        border-color: transparent !important;\n        color: var(--color-text) !important;\n\n        &.header.disabled {\n          margin: 1em 0 0 0;\n          opacity: 1;\n\n          &:hover,\n          &.selected {\n            background: var(--bg-input);\n          }\n        }\n      }\n    }\n\n    > .text {\n      min-height: 1em;\n\n      &:not(.default) {\n        color: var(--color-text) !important;\n      }\n    }\n  }\n\n  .ui.input {\n    width: 100%;\n\n    &.disabled:not(.retain-appearance) {\n      opacity: 1;\n\n      input {\n        background: transparent;\n        border-style: dashed;\n      }\n\n      .ui.buttons {\n        .ui.button {\n          background: transparent;\n        }\n\n        &.primary .ui.button {\n          background-color: #666;\n          border-color: transparent;\n          color: #f9f8f7;\n          opacity: 0.5;\n\n          .dropdown.icon {\n            opacity: 0;\n          }\n        }\n      }\n    }\n\n    &.error input {\n      background-color: var(--bg-input-error);\n      border-color: #e0b4b4;\n    }\n\n    > input {\n      width: 0;\n    }\n  }\n\n  .ui.label {\n    background: transparent;\n    font-weight: var(--font-weight-normal);\n    position: relative;\n    z-index: 1;\n  }\n\n  .ui.page.modals.transition.visible {\n    display: flex !important;\n  }\n\n  .ui.secondary.vertical.menu > .item {\n    margin: 0;\n  }\n\n  .ui[class*="left icon"].input.left.icon > input {\n    padding-left: 4rem !important;\n  }\n\n  .ui[class*="left icon"].input.left.icon > .ui--Icon.big {\n    left: -7px;\n    opacity: 1;\n  }\n\n  /* modals aligned to top, not center */\n  .ui.dimmer {\n    background-color: rgba(96, 96, 96, 0.5);\n    justify-content: flex-start;\n  }\n\n  /* remove the default white background, settings app has it as part of Tab */\n  .ui.segment {\n    background: transparent;\n  }\n\n  ${i.ZP}\n  \n  .ui--grid,\n  .ui--row {\n    width: 100%;\n  }\n\n  .ui--grid,\n  .ui--row {\n    align-items: stretch;\n    display: flex;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: flex-start;\n    text-align: left;\n    min-width: 0;\n  }\n\n  .ui--grid > div,\n  .ui--row > div {\n    box-sizing: border-box;\n    min-width: 0;\n  }\n\n  .ui--grid > div:not(.grow):not(.shrink),\n  .ui--row > div:not(.grow):not(.shrink) {\n    width: 100%;\n  }\n\n  .ui--grid > div:not(.shrink),\n  .ui--grid > div.full,\n  .ui--row > div.full {\n    flex: 0 100%;\n  }\n\n  .ui--grid > div.shrink,\n  .ui--row > div.shrink {\n    flex: 0 1 auto;\n  }\n\n  .ui--grid > div.grow,\n  .ui--row > div.grow {\n    flex: 1 1 auto;\n  }\n\n  .ui--grid > div.large,\n  .ui--row > div.large {\n    flex: 0 75%;\n  }\n\n  .ui--grid > div.medium,\n  .ui--row > div.medium {\n    flex: 0 50%;\n  }\n\n  .ui--grid > div.small,\n  .ui--row > div.small {\n    flex: 0 25%;\n  }\n\n  .ui--grid > div.sixty6,\n  .ui--row > div.sixty6 {\n    flex: 0 66.66%;\n  }\n\n  .ui--grid > div.thirty3,\n  .ui--row > div.thirty3 {\n    flex: 0 33.33%;\n  }\n\n  ${s}\n  \n  .ui--output {\n    background: var(--bg-input);\n    border-radius: 4px;\n    border: 1px dashed #eee;\n    box-sizing: border-box;\n    line-height: 1rem;\n    max-height: 25rem;\n    overflow-y: auto;\n    padding: 0.75rem 1rem;\n    position: relative;\n    word-break: break-all;\n\n    &.error {\n      background: var(--bg-input-error);\n      border-color: #e0b4b4;\n    }\n\n    &.monospace {\n      font-family: monospace;\n    }\n  }\n\n  header .ui--Button-Group {\n    text-align: center;\n  }\n\n  .ui.input .ui--Button-Group {\n    margin: 0;\n  }\n\n  button.u.ui--Icon.icon-button {\n    padding-top: 0;\n    padding-right: 0;\n    padding-bottom: 0.3em;\n    padding-left: 0.3em;\n    color: #2e86ab !important;\n    background: none !important;\n  }\n\n  button.ui--Button {\n    font: var(--font-sans);\n  }\n\n  .editable {\n    cursor: pointer;\n  }\n\n  .ui--DropdownLinked.ui--row {\n    .small .ui.selection.dropdown {\n      border-right: none;\n      border-bottom-right-radius: 0;\n      border-top-right-radius: 0;\n      min-width: 5rem;\n    }\n\n    .large .ui.selection.dropdown {\n      border-left: none;\n      border-bottom-left-radius: 0;\n      border-top-left-radius: 0;\n    }\n  }\n\n  .ui--Input {\n    &.disabled {\n      overflow: hidden;\n\n      input {\n        overflow: hidden;\n        text-overflow: ellipsis;\n        white-space: nowrap;\n      }\n    }\n\n    &.inPlaceEditor {\n      margin: 0 !important;\n\n      input {\n        padding: 0 !important;\n        background: rgba(230, 230, 230, 0.8) !important;\n        border: 0 !important;\n        border-radius: 0 !important;\n        box-shadow: 0 3px 3px rgba(0,0,0,.2);\n      }\n    }\n\n    &.isWarning.ui.input {\n      > input,\n      input:focus {\n        background: #ffffe0;\n        border-color: #eeeeae;\n      }\n    }\n\n    .ui--SiDropdown {\n      width: 6rem;\n      text-align: center;\n    }\n  }\n\n  .ui--Static {\n    min-width: 2rem; /* adjust width from normal dropdown sizing */\n    overflow: hidden;\n    word-break: break-all;\n  }\n\n  .ui--Tooltip {\n    text-align: center;\n    z-index: 1002;\n    max-width: 300px;\n\n\n    &.accounts-badge {\n      background-color: var(--bg-menu) !important;\n      color: var(--color-text) !important;\n      box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);\n      z-index: 999;\n\n      &.place-top::after {\n        border-top-color: var(--bg-menu) !important;\n      }\n\n      &.place-right::after {\n        border-right-color: var(--bg-menu) !important;\n      }\n\n    a {\n      color: #3BBEFF;\n\n      &.purpleColor {\n        color: #E6007A;\n      }\n    }\n  }\n\n`))},99022:(e,t,n)=>{n.d(t,{Iv:()=>a,ZP:()=>s});const a="#2e86ab",s=`\n  .theme--dark,\n  .theme--light {\n    a:not(.ui--Tab) {\n      color: ${a};\n\n      &:hover,\n      a:visited {\n        color: ${a};\n      }\n    }\n\n    .ui--Button {\n      &.isIcon:not(.isDisabled):not(.withoutLink):not(:hover) {\n        .ui--Icon {\n          color: ${a};\n        }\n      }\n    }\n\n    .ui.modal > .header:not(.ui) {\n      border-bottom-color: #767778;\n    }\n\n    .ui.negative.button,\n    .ui.buttons .negative.button {\n      background: #666 !important;\n    }\n  }\n`},56120:(e,t,n)=>{n.d(t,{$:()=>s,Z:()=>i});var a=n(61349);function s(){return(0,a.$G)("react-components")}const i=(0,a.Zh)(["react-components"])},21009:(e,t,n)=>{n.d(t,{r7:()=>i,C9:()=>g,Ly:()=>r,s2:()=>o,oX:()=>u,Hc:()=>p});var a=n(69187),s=n(33661);function i(e,t,n,i="",r=!1){let o=!1;const l=i.toLowerCase();if(l||r){if(n){var c;const{accountId:t,accountIndex:a,identity:u,nickname:d}=n,m=!!t&&t.toString().includes(i)||!!a&&a.toString().includes(i);!r&&m?o=!0:(0,s.m)(null==(c=e.query.identity)?void 0:c.identityOf)?o=!!u&&(!!u.display||!!u.displayParent)&&(m||!!u.display&&u.display.toLowerCase().includes(l)||!!u.displayParent&&u.displayParent.toLowerCase().includes(l)):d&&(o=d.toLowerCase().includes(l))}if(!o){var u;const e=a.Nn.getAddress(t);o=!(null==e||null==(u=e.meta)||!u.name)&&e.meta.name.toLowerCase().includes(l)}}else o=!0;return o}function r(e,t=null){let n;try{const s=a.Nn.getAddress(e,t);n=s&&s.meta}catch(e){}return n||{}}function o(e,t=null,n){const a=r(e,t);return a.name?[!1,!1,a.name.toUpperCase()]:n?[!1,!0,n.toUpperCase()]:[!0,!1,e]}var l=n(8257),c=n(9921);function u(e){if(!e)return null;let t;const n=r(e,"contract");try{const e=n.contract&&JSON.parse(n.contract.abi);t=new l.P(e,c.api.registry.getChainProperties())}catch(e){console.error(e)}return t||null}var d=n(74076),m=n(48533),h=n(73493);function p(e,t=!1,n){if(e)try{const s=(0,d.vq)(e)?(0,m.G)(e):a.Nn.decodeAddress(e);if(!t&&32!==s.length&&20!==s.length)throw new Error("AccountIndex values not allowed");if(n&&s.length!==n)throw new Error("Invalid key length");return 20===s.length?(0,h.K)(s):a.Nn.encodeAddress(s)}catch(e){}}function g(e){try{const t=e?a.Nn.getPair(e.toString()):null;if(t)return t.meta.isInjected?"injected":t.meta.isHardware?t.meta.hardwareType||"hardware":t.meta.isExternal?t.meta.isMultisig?"multisig":t.meta.isProxied?"proxied":"qr":t.type}catch{}return"unknown"}},89448:(e,t,n)=>{function a(e,t){return(...n)=>{try{return t(...n)}catch(t){throw new Error(`${e}:: ${t.message}:: ${t.stack||"<unknown>"}`)}}}n.d(t,{e:()=>a})},83780:(e,t,n)=>{n.d(t,{y:()=>l,u:()=>c});var a=n(2784),s=n(92529),i=n(96464),r=n(52322);const o=[],l=a.createContext(o);function c({children:e}){const{api:t}=(0,s.h)(),n=(0,a.useCallback)((e=>function(e,t){return 0===t.length?[e]:60===t.length?t.concat(e).slice(-60):t.concat(e)}(function(...e){const t={active:{requests:0,subscriptions:0},total:{bytesRecv:0,bytesSent:0,cached:0,errors:0,requests:0,subscriptions:0,timeout:0}};for(let n=0;n<e.length;n++){const a=e[n].stats;a&&(t.active.requests+=a.active.requests,t.active.subscriptions+=a.active.subscriptions,t.total.bytesRecv+=a.total.bytesRecv,t.total.bytesSent+=a.total.bytesSent,t.total.cached+=a.total.cached,t.total.errors+=a.total.errors,t.total.requests+=a.total.requests,t.total.subscriptions+=a.total.subscriptions,t.total.timeout+=a.total.timeout)}return{stats:t,when:Date.now()}}(t),e)),[t]),c=function(e,t,n){const[s,r]=(0,a.useState)(t),o=(0,a.useRef)(null),l=(0,i.X)();return(0,a.useEffect)((()=>(function t(){if(o.current=null,l.current){try{r(e)}catch(e){console.error(e)}o.current=setTimeout(t,5e3)}}(),()=>{o.current&&clearTimeout(o.current)})),[]),s}(n,o);return(0,r.jsx)(l.Provider,{value:c,children:e})}},62463:(e,t,n)=>{n.d(t,{U:()=>d,g:()=>m});var a=n(2784),s=n(92529),i=n(36856),r=n(14681),o=n(52322);const l={},c={},u={byAuthor:l,eraPoints:c,lastBlockAuthors:[],lastHeaders:[]},d=a.createContext(u);function m({children:e}){var t;const{api:n,isApiReady:m}=(0,s.h)(),h=(0,i.W7)(m&&(null==(t=n.derive.staking)?void 0:t.currentPoints)),[p,g]=(0,a.useState)(u);return(0,a.useEffect)((()=>{n.isReady.then((()=>{let e=[],t=[],a="";n.derive.chain.subscribeNewHeads((n=>{if(null!=n&&n.number){const s=n.number.unwrap();let i="";n.author&&(i=n.author.toString());const o=(0,r.u)(s);i&&(l[i]=o,o!==a?(a=o,t=[i]):t.push(i)),e=e.filter(((e,t)=>t<75&&e.number.unwrap().lt(s))).reduce(((e,t)=>(e.push(t),e)),[n]).sort(((e,t)=>t.number.unwrap().cmp(e.number.unwrap()))),g({byAuthor:l,eraPoints:c,lastBlockAuthors:t.slice(),lastBlockNumber:a,lastHeader:n,lastHeaders:e})}})).catch(console.error)})).catch(console.error)}),[]),(0,a.useEffect)((()=>{if(h){const e=[...h.individual.entries()].map((([e,t])=>[e.toString(),(0,r.u)(t)])),t=Object.keys(c);t.length!==e.length&&t.forEach((e=>{delete c[e]})),e.forEach((([e,t])=>{c[e]=t}))}}),[h]),(0,o.jsx)(d.Provider,{value:p,children:e})}},58939:(e,t,n)=>{n.d(t,{m:()=>d,w:()=>m});var a=n(2784),s=n(64021),i=n(11147),r=n(69516),o=n(92529),l=n(36856),c=n(52322);const u={eventCount:0,events:[]},d=a.createContext(u);function m({children:e}){const{api:t,isApiReady:n}=(0,o.h)(),[m,h]=(0,a.useState)(u),p=(0,l.W7)(n&&t.query.system.events),g=(0,a.useRef)({block:null,event:null});return(0,a.useEffect)((()=>{p&&async function(e,t,n,a){const o=n.map(((e,t)=>({indexes:[t],record:e}))).filter((({record:{event:{method:e,section:t}}})=>!("system"===t||["balances","treasury"].includes(t)&&["Deposit","Withdraw"].includes(e)||["transactionPayment"].includes(t)&&["TransactionFeePaid"].includes(e)||["paraInclusion","parasInclusion","inclusion"].includes(t)&&["CandidateBacked","CandidateIncluded"].includes(e)||["relayChainInfo"].includes(t)&&["CurrentBlockNumbers"].includes(e)))).reduce(((e,t)=>{const n=e.find((({record:{event:{method:e,section:n}}})=>t.record.event.section===n&&t.record.event.method===e));return n?n.indexes.push(...t.indexes):e.push(t),e}),[]).reverse(),l=(0,r.R)((0,s.d)((0,i.P)(o)));if(l!==t.event&&o.length){t.event=l;const s=await e.rpc.chain.getHeader(n.createdAtHash),i=s.number.unwrap(),r=s.hash.toHex();r!==t.block&&(t.block=r,a((({events:e})=>({eventCount:n.length,events:[...o.map((({indexes:e,record:t})=>({blockHash:r,blockNumber:i,indexes:e,key:`${i.toNumber()}-${r}-${e.join(".")}`,record:t}))),...e.filter((e=>{var t;return!(null!=(t=e.blockNumber)&&t.eq(i))}))].slice(0,75)}))))}else a((({events:e})=>({eventCount:n.length,events:e})))}(t,g.current,p,h).catch(console.error)}),[t,g,p,h]),(0,c.jsx)(d.Provider,{value:m,children:e})}},48720:(e,t,n)=>{n.d(t,{H:()=>h,y:()=>v});var a=n(2784),s=n(43806),i=n(77984),r=n(69187),o=n(55858),l=n(94175),c=n(92529),u=n(52322);const d=()=>!1,m={accounts:{allAccounts:[],allAccountsHex:[],areAccountsLoaded:!1,hasAccounts:!1,isAccount:d},addresses:{allAddresses:[],allAddressesHex:[],areAddressesLoaded:!1,hasAddresses:!1,isAddress:d}},h=a.createContext(m);function p(e,t,n=[]){const a=e?20:32;return t.reduce(((e,t)=>{if(!e.includes(t)&&!n.includes(t))try{(0,l.m)(t).length>=a?e.push(t):console.warn(`Not adding address ${t}, not in correct format for chain (requires publickey from address)`)}catch{console.error(t,a)}return e}),[])}function g(e){return e.map((e=>{try{return(0,o.c)((0,l.m)(e))}catch(t){return console.error(`Unable to convert address ${e} to hex`,t.message),null}})).filter((e=>!!e))}function f(e){return t=>!!t&&e.includes(t.toString())}function b(e,t={},n){const a=p(e,Object.keys(t),n);return{allAddresses:a,allAddressesHex:g(a),areAddressesLoaded:!0,hasAddresses:0!==a.length,isAddress:f(a)}}function v({children:e}){const{isApiReady:t,isEthereum:n}=(0,c.h)(),[o,l]=(0,a.useState)(m);return(0,a.useEffect)((()=>{let e=null;return t&&(e=(0,s.a)([r.Nn.accounts.subject.pipe((0,i.U)((e=>function(e,t={}){const n=p(e,Object.keys(t));return{allAccounts:n,allAccountsHex:g(n),areAccountsLoaded:!0,hasAccounts:0!==n.length,isAccount:f(n)}}(n,e)))),r.Nn.addresses.subject]).pipe((0,i.U)((([e,t])=>({accounts:e,addresses:b(n,t,e.allAccounts)})))).subscribe((e=>l(e)))),()=>{e&&e.unsubscribe()}}),[t,n]),(0,u.jsx)(h.Provider,{value:o,children:e})}},85584:(e,t,n)=>{n.d(t,{l:()=>x,q:()=>y});var a=n(2784);const s="incomplete execution";function i(e){return e?e.isErr?`error: ${u(e.asErr)}`:null:s}function r({data:[e]}){return i(e)}const o={Executed:function({data:[,e]}){return i(e)}},l={Attempted:function({data:[e]}){if(!e)return s;if(e.isIncomplete){const[,t]=e.asIncomplete;return`error: ${t.type}`}return null}},c={allianceMotion:o,council:o,membership:o,multisig:{MultisigExecuted:function({data:[,,,,e]}){return i(e)}},polkadotXcm:l,proxy:{ProxyExecuted:r},sudo:{Sudid:r,SudoAsDone:r},technicalCommittee:o,utility:{BatchInterrupted:function({data:[e,t]}){return`error: ${e.toString()}: ${u(t)}`},DispatchedAs:r},xcmPallet:l};function u(e){let t=e.type;if(e.isModule)try{const n=e.asModule,a=e.registry.findMetaError(n);t=`${a.section}.${a.name}`}catch(e){}else e.isToken&&(t=`${e.type}.${e.asToken.type}`);return t}var d=n(62528),m=n(21009),h=n(13529),p=n(52322);const g={stqueue:[],txqueue:[]};let f=0;const b="extrinsic event",v=h.Z.author.submitAndWatchExtrinsic,x=a.createContext(g);const A=[],w=[];function y({children:e}){const[t,n]=(0,a.useState)(A),[s,i]=(0,a.useState)(w),r=(0,a.useRef)(t),o=(0,a.useRef)(s),l=(0,a.useCallback)((e=>{r.current=e,n(e)}),[]),h=(0,a.useCallback)((e=>{o.current=e,i(e)}),[]),g=(0,a.useCallback)((e=>{const t=++f;h([...o.current,{...e,id:t,removeItem:()=>h([...o.current.map((e=>e.id===t?{...e,status:"completed"}:e))]),rpc:e.rpc||v,status:"queued"}])}),[h]),y=(0,a.useCallback)((e=>{const t=Array.isArray(e)?e:[e];t.length&&l([...r.current,...t.map((e=>{const t=++f,n=()=>l([...r.current.filter((e=>e.id!==t))]);return setTimeout(n,7500),{...e,id:t,isCompleted:!1,removeItem:n}}))])}),[l]),j=(0,a.useCallback)((e=>g({...e})),[g]),k=(0,a.useCallback)(((e,t,n)=>{g({accountId:t.address,extrinsic:e.createType("Extrinsic",{method:e.createType("Call",t.method)},{version:t.version}),payload:t,signerCb:n})}),[g]),N=(0,a.useCallback)((e=>g({...e})),[g]),C=(0,a.useCallback)(((e,t,n,a)=>{h([...o.current.map((s=>s.id===e?{...s,error:void 0===a?s.error:a,result:void 0===n?s.result:n,status:"completed"===s.status?s.status:t}:s))]),y(function(e){return function(e){let t=null;const n=e.reduce(((e,t)=>{const n=e.find((({status:e})=>e.action===t.action&&e.status===t.status));return n?n.count++:e.push({count:1,status:t}),e}),[]).map((({count:e,status:t})=>1===e?t:{...t,action:`${t.action} (x${e})`})).filter((e=>e.message!==b||(t?e.action.startsWith("system.ExtrinsicSuccess")?t.action.unshift(e.action):t.action.push(e.action):t={...e,action:[e.action]},!1)));return t?n.concat(t):n}((e&&e.events||[]).filter((e=>!!e.event&&"democracy"!==e.event.section)).map((e=>{const{event:{data:t,method:n,section:a}}=e;if("system"===a&&"ExtrinsicFailed"===n){const[e]=t;return{action:`${a}.${n}`,message:u(e),status:"error"}}const s=function({event:e}){const{method:t,section:n}=e;return!!c[n]&&!!c[n][t]&&c[n][t](e)}(e);if(s)return{action:`${a}.${n}`,message:s,status:"eventWarn"};if("contracts"===a)if("ContractExecution"===n&&2===t.length){const[e,n]=t;try{const t=(0,m.oX)(e.toString());if(t)return{action:t.decodeEvent(n).event.identifier,message:"contract event",status:"event"}}catch(e){console.error(e)}}else if("Evicted"===n)return{action:`${a}.${n}`,message:"contract evicted",status:"error"};return{action:`${a}.${n}`,message:b,status:"event"}})))}(n)),d.z.includes(t)&&setTimeout((()=>{const t=o.current.find((t=>t.id===e));t&&t.removeItem()}),7500)}),[y,h]),E=(0,a.useMemo)((()=>({queueAction:y,queueExtrinsic:j,queuePayload:k,queueRpc:N,queueSetTxStatus:C,stqueue:t,txqueue:s})),[y,j,k,N,C,t,s]);return(0,p.jsx)(x.Provider,{value:E,children:e})}},53197:(e,t,n)=>{n.d(t,{A:()=>o,d:()=>r});var a=n(2784),s=n(52322);function i(){return{height:window.innerHeight,width:window.innerWidth}}const r=a.createContext(i());function o({children:e}){const[t,n]=(0,a.useState)((()=>i()));return(0,a.useEffect)((()=>{function e(){n(i())}return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}}),[]),(0,s.jsx)(r.Provider,{value:t,children:e})}},32921:(e,t,n)=>{n.d(t,{F:()=>s});var a=n(2784);const s=(0,n(89448).e)("useAccountId",(function(e=null,t){const[n,s]=(0,a.useState)(e),i=(0,a.useCallback)(((e=null)=>{s(e),t&&t(e)}),[t]);return[n,i]}))},420:(e,t,n)=>{n.d(t,{B:()=>f});var a=n(2784),s=n(69187),i=n(33661),r=n(74076),o=n(89448),l=n(92529),c=n(36856),u=n(28444);const d=(0,o.e)("useDeriveAccountFlags",(function(e){const t=(0,u.J)();return(0,c.W7)(t&&t.derive.accounts.flags,[e])}));var m=n(1957),h=n(85897),p=n(7840);const g={isCouncil:!1,isDevelopment:!1,isEditable:!1,isEthereum:!1,isExternal:!1,isFavorite:!1,isHardware:!1,isInContacts:!1,isInjected:!1,isMultisig:!1,isNominator:!1,isOwned:!1,isProxied:!1,isSociety:!1,isSudo:!1,isTechCommittee:!1,isValidator:!1},f=(0,o.e)("useAccountInfo",(function(e,t=!1){var n,o;const{api:u}=(0,l.h)(),{accounts:{isAccount:f},addresses:{isAddress:b}}=(0,h.i)(),v=(0,m.Y)(e),x=d(e),A=(0,c.W7)(null==(n=u.query.staking)?void 0:n.nominators,[e]),w=(0,c.W7)(null==(o=u.query.staking)?void 0:o.validators,[e]),[y,j]=(0,a.useState)(void 0),[k,N]=(0,a.useState)([]),[C,E]=(0,a.useState)(""),[S,I]=(0,a.useState)(null),[D,B]=(0,a.useState)(),[L,$]=(0,a.useState)(g),[V,P]=(0,a.useState)(),[Z,T,z]=(0,p.O)(),[F,M,H]=(0,p.O)();(0,a.useEffect)((()=>{w&&$((e=>({...e,isValidator:!w.isEmpty})))}),[w]),(0,a.useEffect)((()=>{A&&$((e=>({...e,isNominator:!A.isEmpty})))}),[A]),(0,a.useEffect)((()=>{x&&$((e=>({...e,...x})))}),[x]),(0,a.useEffect)((()=>{var e;const{accountIndex:t,identity:n,nickname:a}=v||{},s=null==t?void 0:t.toString();let r;if(j((e=>e!==s?s:e)),(0,i.m)(null==(e=u.query.identity)?void 0:e.identityOf)?null!=n&&n.display&&(r=n.display):a&&(r=a),E(r||""),n){const e=n.judgements.filter((([,e])=>!e.isFeePaid)),t=e.some((([,e])=>e.isKnownGood));B({...n,isExistent:!!n.display,isKnownGood:t,judgements:e,waitCount:n.judgements.length-e.length})}else B(void 0)}),[v,u]),(0,a.useEffect)((()=>{if(e)try{const t=s.Nn.getAccount(e)||s.Nn.getAddress(e),n=f(e),a=b(e);I((null==t?void 0:t.meta.genesisHash)||null),$((s=>({...s,isDevelopment:(null==t?void 0:t.meta.isTesting)||!1,isEditable:!(null!=D&&D.display||!(a||null!=t&&t.meta.isMultisig||t&&!t.meta.isInjected))||!1,isEthereum:(0,r.vq)(e,160),isExternal:!(null==t||!t.meta.isExternal)||!1,isHardware:!(null==t||!t.meta.isHardware)||!1,isInContacts:a,isInjected:!(null==t||!t.meta.isInjected)||!1,isMultisig:!(null==t||!t.meta.isMultisig)||!1,isOwned:n,isProxied:!(null==t||!t.meta.isProxied)||!1}))),P(null==t?void 0:t.meta),E((null==t?void 0:t.meta.name)||""),N(null!=t&&t.meta.tags?t.meta.tags.sort():[])}catch(e){}}),[D,f,b,e]);const R=(0,a.useCallback)((()=>{Z&&T();const n={name:C,whenEdited:Date.now()};if(t)try{if(e){var a;const t=null==(a=s.Nn.getAddress(e))?void 0:a.meta;s.Nn.saveContract(e,{...t,...n})}}catch(e){console.error(e)}else if(e)try{const t=s.Nn.getPair(e);t&&s.Nn.saveAccountMeta(t,n)}catch(t){s.Nn.getAddress(e)?s.Nn.saveAddress(e,n):s.Nn.saveAddress(e,{genesisHash:u.genesisHash.toHex(),...n})}}),[u,t,Z,C,T,e]),U=(0,a.useCallback)((()=>{const n={tags:k,whenEdited:Date.now()};if(t)try{if(e){var a;const t=null==(a=s.Nn.getAddress(e))?void 0:a.meta;e&&s.Nn.saveContract(e,{...t,...n})}}catch(e){console.error(e)}else if(e)try{const t=s.Nn.getPair(e);t&&s.Nn.saveAccountMeta(t,n)}catch(t){s.Nn.saveAddress(e,n)}}),[t,k,e]),q=(0,a.useCallback)((()=>{Z&&T(),F&&M();try{e&&s.Nn.forgetAddress(e)}catch(e){console.error(e)}}),[Z,F,T,M,e]),O=(0,a.useCallback)((t=>{if(e){const n=s.Nn.getPair(e);n&&s.Nn.saveAccountMeta(n,{...n.meta,genesisHash:t}),I(t)}}),[e]),W=(0,a.useCallback)((e=>N(e.sort())),[]),Q=(0,a.useCallback)((()=>Z||F),[Z,F]);return(0,a.useMemo)((()=>({accountIndex:y,flags:L,genesisHash:S,identity:D,isEditing:Q,isEditingName:Z,isEditingTags:F,isNull:!e,meta:V,name:C,onForgetAddress:q,onSaveName:R,onSaveTags:U,onSetGenesisHash:O,setIsEditingName:z,setIsEditingTags:H,setName:E,setTags:W,tags:k,toggleIsEditingName:T,toggleIsEditingTags:M})),[y,L,S,D,Q,Z,F,V,C,q,R,U,O,z,H,E,W,k,T,M,e])}))},13328:(e,t,n)=>{n.d(t,{x:()=>i});var a=n(2784),s=n(48720);const i=(0,n(89448).e)("useAccounts",(function(){return(0,a.useContext)(s.H).accounts}))},29043:(e,t,n)=>{n.d(t,{J:()=>i});var a=n(2784),s=n(48720);const i=(0,n(89448).e)("useAddresses",(function(){return(0,a.useContext)(s.H).addresses}))},92529:(e,t,n)=>{n.d(t,{h:()=>i});var a=n(2784),s=n(9921);const i=(0,n(89448).e)("useApi",(function(){return(0,a.useContext)(s.ApiCtx)}))},58166:(e,t,n)=>{n.d(t,{m:()=>i});var a=n(2784),s=n(83780);const i=(0,n(89448).e)("useApiStats",(function(){return(0,a.useContext)(s.y)}))},69877:(e,t,n)=>{n.d(t,{J:()=>m});var a=n(2784),s=n(23134),i=n(21899),r=n(8877),o=n(54371),l=n(26912),c=n(89448),u=n(96464);function d(e){return e&&e.disconnect().catch(console.error),null}const m=(0,c.e)("useApiUrl",(function(e){const t=(0,a.useRef)(null),n=(0,u.X)(),[c,m]=(0,a.useState)(null),h=(0,a.useMemo)((()=>e?(0,o.H)(e)?[e]:(0,l.r)(e.filter((e=>!e.startsWith("light://")))):[]),[e]);return(0,a.useEffect)((()=>()=>{t.current=d(t.current)}),[]),(0,a.useEffect)((()=>{m(null),t.current=d(t.current),h.length&&s.G.create({provider:t.current=new i.U(h),typesBundle:r.UD}).then((e=>n.current&&m(e))).catch(console.error)}),[n,t,h]),c}))},65342:(e,t,n)=>{n.d(t,{g:()=>d});var a=n(2784),s=n(95292),i=n(48801),r=n.n(i),o=n(89448),l=n(92529),c=n(36856),u=n(96464);const d=(0,o.e)("useAvailableSlashes",(function(){var e,t;const{api:n}=(0,l.h)(),i=(0,c.W7)(null==(e=n.derive.session)?void 0:e.indexes),o=(0,c.W7)(null==(t=n.query.staking)?void 0:t.earliestUnappliedSlash),d=(0,u.X)(),[m,h]=(0,a.useState)([]);return(0,a.useEffect)((()=>{var e,t;let a;const[l,c]=null!=(e=n.query.staking)&&e.earliestUnappliedSlash?[o&&o.unwrapOr(null),s.nw]:[null==i?void 0:i.activeEra,s.If.add((null==(t=n.consts.staking)?void 0:t.slashDeferDuration)||s.S8)];if(d.current&&i&&l){const e=[],t=i.activeEra.add(c);let o=new(r())(l);for(;o.lte(t);)e.push(o),o=o.add(s.If);e.length&&(async()=>{a=await n.query.staking.unappliedSlashes.multi(e,(e=>{d.current&&h(e.map(((e,t)=>[l.addn(t),e])).filter((([,e])=>e.length)))}))})().catch(console.error)}return()=>{a&&a()}}),[n,o,i,d]),m}))},90605:(e,t,n)=>{n.d(t,{r:()=>r});var a=n(89448),s=n(92529),i=n(36856);const r=(0,a.e)("useBalancesAll",(function(e){var t;const{api:n}=(0,s.h)();return(0,i.W7)(null==(t=n.derive.balances)?void 0:t.all,[e])}))},96124:(e,t,n)=>{n.d(t,{P:()=>o});var a=n(89448),s=n(92529),i=n(36856);const r={transform:e=>e.hash.toHex()},o=(0,a.e)("useBestHash",(function(){const{api:e}=(0,s.h)();return(0,i.W7)(e.rpc.chain.subscribeNewHeads,void 0,r)}))},65182:(e,t,n)=>{n.d(t,{C:()=>r});var a=n(89448),s=n(92529),i=n(36856);const r=(0,a.e)("useBestNumber",(function(){const{api:e}=(0,s.h)();return(0,i.W7)(e.derive.chain.bestNumber)}))},56732:(e,t,n)=>{n.d(t,{E:()=>i});var a=n(2784),s=n(62463);const i=(0,n(89448).e)("useBlockAuthors",(function(){return(0,a.useContext)(s.U)}))},55650:(e,t,n)=>{n.d(t,{d:()=>i});var a=n(2784),s=n(58939);const i=(0,n(89448).e)("useBlockEvents",(function(){return(0,a.useContext)(s.m)}))},27229:(e,t,n)=>{n.d(t,{n:()=>h});var a=n(2784),s=n(95292),i=n(48801),r=n.n(i),o=n(52107),l=n(89448),c=n(92529),u=n(2898);const d=s.D_.div(s.um),m=new(r())(6e3),h=(0,l.e)("useBlockInterval",(function(e){const{api:t}=(0,c.h)();return(0,a.useMemo)((()=>function(e){var t,n,a,i;return(0,o.N)(u.P,(null==(t=e.consts.babe)?void 0:t.expectedBlockTime)||(null==(n=e.consts.difficulty)?void 0:n.targetBlockTime)||(null==(a=e.consts.subspace)?void 0:a.expectedBlockTime)||(null!=(i=e.consts.timestamp)&&i.minimumPeriod.gte(d)?e.consts.timestamp.minimumPeriod.mul(s.um):e.query.parachainSystem?m.mul(s.um):m))}(e||t)),[t,e])}))},65308:(e,t,n)=>{n.d(t,{A:()=>d,h:()=>m});var a=n(2784),s=n(52107),i=n(95292),r=n(22771),o=n(12372),l=n(89448),c=n(61349);(0,c.Zh)(["react-hooks"]);var u=n(27229);function d(e,t,n){const a=(0,s.N)(i.Ew,e.mul(t)).toNumber(),o=(0,r.E)(Math.abs(a)),{days:l,hours:c,minutes:u,seconds:d}=o;return[e.toNumber(),`${a<0?"+":""}${[l?l>1?n("{{days}} days",{replace:{days:l}}):n("1 day"):null,c?c>1?n("{{hours}} hrs",{replace:{hours:c}}):n("1 hr"):null,u?u>1?n("{{minutes}} mins",{replace:{minutes:u}}):n("1 min"):null,d?d>1?n("{{seconds}} s",{replace:{seconds:d}}):n("1 s"):null].filter((e=>!!e)).slice(0,2).join(" ")}`,o]}const m=(0,l.e)("useBlockTime",(function(e=i.If,t){const{t:n}=(0,c.$G)("react-hooks"),s=(0,u.n)(t);return(0,a.useMemo)((()=>d(s,(0,o.G)(e),n)),[s,e,n])}))},2898:(e,t,n)=>{n.d(t,{P:()=>c,u:()=>u});var a=n(2784),s=n(48801),i=n.n(s),r=n(12372),o=n(89448),l=n(27229);const c=new(i())(864e5),u=(0,o.e)("useBlocksPerDays",(function(e=1){const t=(0,l.n)();return(0,a.useMemo)((()=>c.mul((0,r.G)(e)).div(t)),[t,e])}))},36856:(e,t,n)=>{n.d(t,{S3:()=>d,SB:()=>u,W7:()=>h,r1:()=>m});var a=n(2784),s=n(1346),i=n(17751),r=n(33661),o=n(17965),l=n(92529),c=n(96464);function u(e){return e}function d(e,t,n){console.error(t.current.error=new Error(`${t.current.type}(${function(e){return!!e&&!(0,s.o)(e.creator)}(n)?`${n.creator.section}.${n.creator.method}`:"..."}):: ${e.message}:: ${e.stack||"<unknown>"}`))}function m(e){e.current.isActive=!1,e.current.subscriber&&(e.current.subscriber.then((e=>(0,r.m)(e)&&e())).catch((t=>d(t,e))),e.current.subscriber=null)}function h(e,t,n){const{api:r}=(0,l.h)(),h=(0,c.X)(),p=(0,a.useRef)({error:null,fn:null,isActive:!1,serialized:null,subscriber:null,type:"useCall"}),[g,f]=(0,a.useState)((n||{}).defaultValue);return(0,a.useEffect)((()=>()=>m(p)),[]),(0,a.useEffect)((()=>{if(h.current&&e){const[a,l]=function(e,t,{paramMap:n=u}={}){return[JSON.stringify({f:null==e?void 0:e.name,p:t}),0!==t.length&&t.some((e=>(0,i.F)(e)||(0,s.o)(e)))?null:n(t)]}(e,t||[],n);!l||e===p.current.fn&&a===p.current.serialized||(p.current.fn=e,p.current.serialized=a,function(e,t,n,a,i,r,{transform:l=u,withParams:c,withParamsTransform:h}={}){const p=i.filter((e=>!(0,s.o)(e)));m(n),(0,o.Y)((()=>{t.current&&(!a||function(e){var t,n;return!(null==(t=e.meta)||null==(n=t.type)||!n.isMap)}(a)&&a.meta.type.asMap.hashers.length!==p.length?n.current.subscriber=null:(n.current.isActive=!0,n.current.subscriber=a(...i,(s=>{if(t.current&&n.current.isActive)try{r(c?[i,l(s,e)]:l(h?[i,s]:s,e))}catch(e){d(e,n,a)}})).catch((e=>d(e,n,a)))))}))}(r,h,p,e,l,f,n))}}),[r,e,n,h,t]),g}},54984:(e,t,n)=>{n.d(t,{L:()=>c});var a=n(2784),s=n(17965),i=n(1346),r=n(92529),o=n(36856),l=n(96464);function c(e,t){const{api:n}=(0,r.h)(),c=(0,l.X)(),u=(0,a.useRef)({error:null,fn:null,isActive:!1,serialized:null,subscriber:null,type:"useCallMulti"}),[d,m]=(0,a.useState)((()=>(0,i.o)((t||{}).defaultValue)?[]:(t||{}).defaultValue));return(0,a.useEffect)((()=>()=>(0,o.r1)(u)),[]),(0,a.useEffect)((()=>{if(c.current&&e){const a=JSON.stringify(e);a!==u.current.serialized&&(u.current.serialized=a,function(e,t,n,a,i,{transform:r=o.SB}={}){(0,o.r1)(n),(0,s.Y)((()=>{if(t.current){const s=a.map((e=>!(!e||Array.isArray(e)&&!e[0]))),l=a.filter(((e,t)=>s[t]));l.length?(n.current.isActive=!0,n.current.subscriber=e.queryMulti(l,(l=>{if(t.current&&n.current.isActive){let t=-1;try{i(r(a.map(((e,n)=>s[n]?l[++t]:void 0)),e))}catch(e){(0,o.S3)(e,n)}}})).catch((e=>(0,o.S3)(e,n)))):n.current.subscriber=null}}))}(n,c,u,e,m,t))}}),[n,e,t,c]),d}},78896:(e,t,n)=>{n.d(t,{m:()=>r});var a=n(2784),s=n(92529),i=n(33661);const r=(0,n(89448).e)("useCollectiveInstance",(function(e,t){const{api:n}=(0,s.h)();return(0,a.useMemo)((()=>{const a=t||0,s=n.registry.getModuleInstances(n.runtimeVersion.specName.toString(),e),r=s&&a<s.length?s[a]:e;return n.tx[r]&&(0,i.m)(n.tx[r].close)?r:null}),[n,t,e])}))},92067:(e,t,n)=>{n.d(t,{V:()=>u});var a=n(2784),s=n(89448),i=n(13328),r=n(92529),o=n(36856);const l={transform:e=>e.map((e=>e.toString()))},c={transform:e=>e&&e.toString()},u=(0,s.e)("useCollectiveMembers",(function(e){var t,n;const{api:s}=(0,r.h)(),{allAccounts:u}=(0,i.x)(),d=(0,o.W7)(null==(t=s.derive[e])?void 0:t.members,[],l),m=(0,o.W7)(null==(n=s.derive[e])?void 0:n.prime,[],c);return(0,a.useMemo)((()=>({isMember:(d||[]).some((e=>u.includes(e))),members:d||[],prime:m})),[u,d,m])}))},53964:(e,t,n)=>{n.d(t,{N:()=>i});var a=n(2784),s=n(96464);function i(e,t=250){const n=(0,s.X)(),[i,r]=(0,a.useState)(e);return(0,a.useEffect)((()=>{const a=setTimeout((()=>{n.current&&r(e)}),t);return()=>{clearTimeout(a)}}),[t,e,n]),i}},19738:(e,t,n)=>{n.d(t,{W:()=>r});var a=n(92529),s=n(13328),i=n(36856);const r=(0,n(89448).e)("useDelegations",(function(){var e,t;const{api:n}=(0,a.h)(),{allAccounts:r}=(0,s.x)();return(0,i.W7)(null==(e=n.query.democracy)||null==(t=e.votingOf)?void 0:t.multi,[r])}))},1957:(e,t,n)=>{n.d(t,{Y:()=>r});var a=n(89448),s=n(36856),i=n(28444);const r=(0,a.e)("useDeriveAccountInfo",(function(e){const t=(0,i.J)();return(0,s.W7)(t&&t.derive.accounts.info,[e])}))},26238:(e,t,n)=>{n.d(t,{N:()=>c});var a=n(2784),s=n(33661),i=n(92529),r=n(67847),o=n(6341);function l(e=[],{added:t=[],removed:n=[]}){if(!t.length&&!n.length)return e;const a={};[e,t].forEach((e=>e.forEach((e=>{a[e.toHex()]=e})))),n.forEach((e=>{delete a[e.toHex()]}));const i=Object.entries(a).sort(((e,t)=>(0,s.m)(e[1].cmp)?e[1].cmp(t[1]):e[0].localeCompare(t[0]))).map((([,e])=>e));return i.length!==e.length||i.find(((t,n)=>!t.eq(e[n])))?i:e}function c(e,t,n,s){const{api:c}=(0,i.h)(),[u,d]=(0,a.useState)(),m=(0,o.Wg)(e),{blockHash:h,events:p}=(0,r.b)(m);return(0,a.useEffect)((()=>{n&&d((e=>l(e,{added:n})))}),[n]),(0,a.useEffect)((()=>{h&&d((e=>l(e,t(p,c,s))))}),[s,c,h,p,t]),u}},67847:(e,t,n)=>{n.d(t,{b:()=>d});var a=n(2784),s=n(89448),i=n(92529),r=n(36856),o=n(96464),l=n(6341);const c={blockHash:"",events:[]},u=()=>!0,d=(0,s.e)("useEventTrigger",(function(e,t=u){const{api:n}=(0,i.h)(),[s,d]=(0,a.useState)((()=>c)),m=(0,l.Wg)(e),h=(0,o.X)(),p=(0,r.W7)(n.query.system.events);return(0,a.useEffect)((()=>{if(h.current&&p){const n=p.filter((e=>e.event&&m.some((t=>t&&t.is(e.event)))&&t(e)));var e;n.length&&d({blockHash:(null==(e=p.createdAtHash)?void 0:e.toHex())||"",events:n})}}),[p,t,m,h]),s}))},25314:(e,t,n)=>{n.d(t,{r:()=>l});var a=n(2784),s=n(89448),i=n(23729),r=n.n(i),o=n(92529);const l=(0,s.e)("useFavorites",(function(e){const[t,n]=function(e){const{api:t,isDevelopment:n}=(0,o.h)(),s=(0,a.useMemo)((()=>`${e}:${n?"development":t.genesisHash.toHex()}`),[t,n,e]);return[(0,a.useCallback)((()=>r().get(s)),[s]),(0,a.useCallback)((e=>r().set(s,e)),[s])]}(e),[s,i]=(0,a.useState)((()=>t()||[])),l=(0,a.useCallback)((e=>i((t=>n(t.includes(e)?t.filter((t=>e!==t)):[...t,e])))),[n]);return(0,a.useMemo)((()=>[s,l]),[s,l])}))},31475:(e,t,n)=>{n.d(t,{Y:()=>r});var a=n(2784),s=n(1346);const i=()=>!0;function r(e,t=i){const[n,r]=(0,a.useState)(e),o=(0,a.useMemo)((()=>!!n&&t(n)),[t,n]),l=(0,a.useCallback)((e=>!(0,s.o)(e)&&r(e)),[]);return[n,o,l]}},54309:(e,t,n)=>{n.d(t,{y:()=>r});var a=n(2784),s=n(89448),i=n(96464);const r=(0,s.e)("useIncrement",(function(e=1){const t=(0,i.X)(),[n,s]=(0,a.useState)(e),r=(0,a.useCallback)((()=>{t.current&&s((e=>++e))}),[t]);return[n,r,s]}))},66571:(e,t,n)=>{n.d(t,{V:()=>u});var a=n(2784),s=n(16038),i=n(95292),r=n(89448),o=n(92529),l=n(36856);const c={idealInterest:0,idealStake:0,inflation:0,stakedFraction:0,stakedReturn:0},u=(0,r.e)("useInflation",(function(e){var t,n;const{api:r}=(0,o.h)(),u=(0,l.W7)(null==(t=r.query.balances)?void 0:t.totalIssuance),d=(0,l.W7)(null==(n=r.query.auctions)?void 0:n.auctionCounter),[m,h]=(0,a.useState)(c);return(0,a.useEffect)((()=>{const t=r.query.auctions?d:i.nw;t&&u&&e&&h(function(e,t,n,a){const{auctionAdjust:r,auctionMax:o,falloff:l,maxInflation:c,minInflation:u,stakeTarget:d}=(0,s.S)(e),m=t.isZero()||n.isZero()?0:t.mul(i.uy).div(n).toNumber()/i.uy.toNumber(),h=d-Math.min(o,a.toNumber())*r,p=c/h,g=100*(u+(m<=h?m*(p-u/h):(p*h-u)*Math.pow(2,(h-m)/l)));return{idealInterest:p,idealStake:h,inflation:g,stakedFraction:m,stakedReturn:m?g/m:0}}(r,e,u,t))}),[r,d,u,e]),m}))},3679:(e,t,n)=>{n.d(t,{K:()=>c,g:()=>u});var a=n(2784),s=n(89448);const i=["ipfs","ipns"],r=i.map((e=>`/${e}/`)),o=".ipfs.localhost",l=".ipns.localhost";function c(){const[e]=window.location.href.split("#");return e.includes(o)?function(e){const[,,t]=e.split("/"),n=t.split(":")[0];return{ipfsHash:n.replace(o,""),ipfsPath:n,ipnsChain:null,ipnsDomain:null,isIpfs:!0,isIpns:!1}}(e):e.includes(l)?function(e){const[,,t]=e.split("/"),n=t.split(":")[0],a=n.replace(l,""),s=a.split(".");let i=null,r=null;return s.length>2?(i=s[0],r=s.slice(1).join(".")):r=a,{ipfsHash:null,ipfsPath:n,ipnsChain:i,ipnsDomain:r,isIpfs:!0,isIpns:!0}}(e):function(e){const t=r.some((t=>e.includes(t))),n=e.includes(r[1]),a=e.split("/"),s=a.indexOf(n?i[1]:i[0]);let o=null,l=null,c=null,u=null;if(-1!==s)if(l=a.slice(0,s+1).join("/"),n){const e=a[s+1],t=e.split(".");t.length>2?(c=t[0],u=t.slice(1).join(".")):u=e}else o=a[s+1];return{ipfsHash:o,ipfsPath:l,ipnsChain:c,ipnsDomain:u,isIpfs:t,isIpns:n}}(e)}const u=(0,s.e)("useIpfs",(function(){const[e]=(0,a.useState)((()=>c()));return e}))},17909:(e,t,n)=>{n.d(t,{g:()=>o});var a=n(33702),s=n(2784),i=n(96464);const r=new Map;function o(e,t){const n=(0,i.X)(),[o,l]=(0,s.useState)(),c=(0,s.useMemo)((()=>{if(e)return e.map((e=>{return(t=e)&&(a.rb(t)||a.MC(t.toLowerCase()))?e:"";var t})).filter((e=>!!e))}),[e]);return(0,s.useEffect)((()=>{n.current&&c&&async function(e){const t=new Map,n=e.map((e=>r.has(e)?(t.set(e,r.get(e)),Promise.resolve()):fetch(`https://ipfs.io/ipfs/${e}`).then((async n=>{const a=n.status>=200&&n.status<300?await n.text():null;r.set(e,a),t.set(e,a)}))));return await Promise.allSettled(n),t}(c).then((e=>l(function(e,{transform:t}={}){if(!t)return e;for(const[n,a]of e.entries())e.set(n,t(a));return e}(e,t)))).catch((()=>{}))}),[c,t,n]),o}},86609:(e,t,n)=>{n.d(t,{Y:()=>s});var a=n(2784);const s=(0,n(89448).e)("useIpfsLink",(function(e){return(0,a.useMemo)((()=>e?{ipfsHash:e,ipfsShort:`${e.substring(0,4)}…${e.slice(-4)}`,ipfsUrl:`https://ipfs.io/ipfs/${e}`}:null),[e])}))},96464:(e,t,n)=>{n.d(t,{X:()=>s});var a=n(2784);const s=(0,n(89448).e)("useIsMountedRef",(function(){const e=(0,a.useRef)(!1);return(0,a.useEffect)((()=>(e.current=!0,()=>{e.current=!1})),[]),e}))},21258:(e,t,n)=>{n.d(t,{Z:()=>m});var a=n(2784);const s=e=>e.filter((([,e])=>!e.isFeePaid)),i=e=>e.filter((([,e])=>e.isKnownGood)),r=e=>e.filter((([,e])=>e.isReasonable)),o=e=>e.filter((([,e])=>e.isErroneous)),l=e=>e.filter((([,e])=>e.isLowQuality));var c=n(89448),u=n(420),d=n(20147);const m=(0,c.e)("useJudgements",(function(e){const{identity:t}=(0,u.B)(e),{registrars:n}=(0,d.F)(),c=(0,a.useMemo)((()=>function(e){if(!e)return[];const t=function(e){const t=s(e),n=i(t),a=r(t);return{Erroneous:o(t),"Known good":n,"Low quality":l(t),Reasonable:a}}(e.judgements),n=[];for(const e in t){const s=e;0!==t[s].length&&n.push({judgementName:s,registrarsIndexes:(a=t[s],a.map((e=>e[0])))})}var a;return n}(t)),[t]);return(0,a.useMemo)((()=>function(e,t){return e.map((({judgementName:e,registrarsIndexes:n})=>({judgementName:e,registrars:n.map((e=>(e=>t.find((t=>t.index===e)))(e.toNumber())))})))}(c,n)),[n,c])}))},85897:(e,t,n)=>{n.d(t,{i:()=>i});var a=n(2784),s=n(48720);const i=(0,n(89448).e)("useKeyring",(function(){return(0,a.useContext)(s.H)}))},37095:(e,t,n)=>{n.d(t,{c:()=>v});var a=n(2784),s=n(70731),i=n(70392),r=n(7404),o=n(38711),l=n(48731),c=n(89448),u=n(92529);const d={hasLedgerChain:!1,hasWebUsb:!1,isLedgerCapable:!1,isLedgerEnabled:!1},m=!!window.USB,h=Object.keys(i.A).filter((e=>r.Y[e])),p=h.reduce(((e,t)=>[...e,...i.A[t]]),[]);let g=null,f=null;function b(e){const t=p.includes(e.genesisHash.toHex()),n=m&&t;return{hasLedgerChain:t,hasWebUsb:m,isLedgerCapable:n,isLedgerEnabled:n&&"none"!==o.ZP.ledgerConn}}const v=(0,c.e)("useLedger",(function(){const{api:e,isApiReady:t}=(0,u.h)(),n=(0,a.useCallback)((()=>function(e){const t=o.ZP.ledgerConn;if(!g||f!==t){const n=e.genesisHash.toHex(),a=h.find((e=>i.A[e].includes(n)));(0,l.hu)(a,`Unable to find a known Ledger config for genesisHash ${n}`),g=new s.P(t,a),f=t}return g}(e)),[e]);return(0,a.useMemo)((()=>({...t?b(e):d,getLedger:n})),[e,n,t])}))},30581:(e,t,n)=>{n.d(t,{t:()=>i});var a=n(2784),s=n(11147);function i(e,t,{transform:n}={},i){const[r,o]=(0,a.useState)(),l=(0,a.useRef)(null);return(0,a.useEffect)((()=>{if(e&&t){const a=(0,s.P)({at:i,params:t});a!==l.current&&(l.current=a,(i&&"0"!==i?e.entriesAt(i,...t):e.entries(...t)).then((e=>o(n?n(e):e))).catch(console.error))}}),[i,e,t,n]),r}},57513:(e,t,n)=>{n.d(t,{k:()=>i});var a=n(2784),s=n(11147);function i(e,t,{transform:n}={},i){const[r,o]=(0,a.useState)(),l=(0,a.useRef)(null);return(0,a.useEffect)((()=>{if(e&&t){const a=(0,s.P)({at:i,params:t});a!==l.current&&(l.current=a,(i&&"0"!==i?e.keysAt(i,...t):e.keys(...t)).then((e=>o(n?n(e):e))).catch(console.error))}}),[i,e,t,n]),r}},6341:(e,t,n)=>{n.d(t,{Wg:()=>o});var a=n(2784),s=n(11147);function i(e,t,n=-1){return n++,e!==t&&(!(n<2&&Array.isArray(e)&&Array.isArray(t)&&e.length===t.length)||e.some(((e,a)=>i(e,t[a],n))))}function r(e,t){if(!e.current||i(e.current.value,t)){const n=(0,s.P)({value:t});e.current&&e.current.stringified===n||(e.current={stringified:n,value:t})}return e.current.value}function o(e){const t=(0,a.useRef)(null);return(0,a.useMemo)((()=>r(t,e)),[t,e])}},33024:(e,t,n)=>{n.d(t,{d:()=>r});var a=n(2784),s=n(89448),i=n(7840);const r=(0,s.e)("useModal",(function(e,t,n){const[s,,r]=(0,i.O)(e||!1),o=(0,a.useCallback)((()=>{r(!0),t&&t()}),[t,r]);return{isOpen:s,onClose:(0,a.useCallback)((()=>{r(!1),n&&n()}),[n,r]),onOpen:o}}))},61842:(e,t,n)=>{n.d(t,{q:()=>i});var a=n(2784),s=n(17965);const i=(0,n(89448).e)("useNextTick",(function(){const[e,t]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{(0,s.Y)((()=>t(!0)))}),[]),e}))},64461:(e,t,n)=>{n.d(t,{n:()=>r});var a=n(89448),s=n(31475);function i(e){return e&&e.length>0||!1}const r=(0,a.e)("useNonEmptyString",(function(e=""){return(0,s.Y)(e,i)}))},47951:(e,t,n)=>{n.d(t,{O:()=>s});var a=n(2784);const s=(0,n(89448).e)("useOutsideClick",(function(e,t){const n=(0,a.useCallback)((n=>{e.length&&!function(e,t){return e.some((e=>e.current&&e.current.contains(t.target)))}(e,n)&&t()}),[e,t]);(0,a.useEffect)((()=>(document.addEventListener("click",n,!0),()=>{document.removeEventListener("click",n,!0)})),[n,t])}))},19363:(e,t,n)=>{n.d(t,{Q:()=>h});var a=n(2784),s=n(95292),i=n(89448),r=n(92529),o=n(36856),l=n(96464),c=n(2447);const u={filteredEras:[],validatorEras:[]},d={isLoadingRewards:!0,rewardCount:0},m={withParams:!0},h=(0,i.e)("useOwnEraRewards",(function(e,t,n){var i,h;const{api:p}=(0,r.h)(),g=(0,l.X)(),f=(0,c.q)(n),b=(0,o.W7)(null==(i=p.derive.staking)?void 0:i.erasHistoric),[{filteredEras:v,validatorEras:x},A]=(0,a.useState)(u),[w,y]=(0,a.useState)(d),j=(0,o.W7)(!(null!=t&&t.length)&&!!v.length&&f&&(null==(h=p.derive.staking)?void 0:h.stakerRewardsMultiEras),[f,v],m),k=(0,o.W7)(!!x.length&&!!v.length&&p.derive.staking._erasPoints,[v,!1]),N=(0,o.W7)(!!x.length&&!!v.length&&p.derive.staking._erasRewards,[v,!1]);return(0,a.useEffect)((()=>{y({allRewards:null,isLoadingRewards:!0,rewardCount:0})}),[e,t]),(0,a.useEffect)((()=>{if(b&&e){const n=b.slice(-1*e),a=[];0===b.length?(y({allRewards:{},isLoadingRewards:!1,rewardCount:0}),A({filteredEras:n,validatorEras:a})):null!=t&&t.length&&(t.forEach((({stakingLedger:e,stashId:t})=>{if(e){const s=n.filter((t=>!e.claimedRewards.some((e=>t.eq(e)))));s.length&&a.push({eras:s,stashId:t})}})),n.length&&!a.length&&y({allRewards:{},isLoadingRewards:!1,rewardCount:0})),A({filteredEras:n,validatorEras:a})}}),[b,e,t]),(0,a.useEffect)((()=>{g.current&&j&&!t&&y(function([[e],t]){const n={};return e.forEach(((e,a)=>{n[e]=t[a].filter((({eraReward:e})=>!e.isZero()))})),{allRewards:n,isLoadingRewards:!1,rewardCount:Object.values(n).filter((e=>0!==e.length)).length}}(j))}),[g,t,j]),(0,a.useEffect)((()=>{g&&k&&N&&t&&y(function(e,t,n,a){const i={};return t.forEach((({eras:t,stashId:r})=>{t.forEach((t=>{const o=n.find((e=>e.era.eq(t))),l=a.find((e=>e.era.eq(t)));if(null!=o&&o.eraPoints.gt(s.nw)&&null!=o&&o.validators[r]&&l){const n=o.validators[r].mul(l.eraReward).div(o.eraPoints);if(!n.isZero()){const a=e.createType("Balance",n);i[r]||(i[r]=[]),i[r].push({era:t,eraReward:l.eraReward,isEmpty:!1,isValidator:!0,nominating:[],validators:{[r]:{total:a,value:a}}})}}}))})),{allRewards:i,isLoadingRewards:!1,rewardCount:Object.values(i).filter((e=>0!==e.length)).length}}(p,x,k,N))}),[p,k,N,g,t,x]),w}))},74944:(e,t,n)=>{n.d(t,{w:()=>m});var a=n(2784),s=n(51330),i=n(55858),r=n(89448),o=n(13328),l=n(92529),c=n(96464),u=n(2447);function d(e){return e?e.toString():null}const m=(0,r.e)("useOwnStashInfos",(function(){const{api:e}=(0,l.h)(),{allAccounts:t}=(0,o.x)(),n=(0,c.X)(),r=(0,u.y)(),[m,h]=(0,a.useState)();return(0,a.useEffect)((()=>{let t;if(r)if(r.length){const a=r.map((([e])=>e)),s=[[e.derive.staking.accounts,a],[e.query.staking.validators.multi,a]];e.combineLatest(s,(([e,t])=>{n.current&&r.length===e.length&&r.length===t.length&&h(r.reduce(((n,[a,s],i)=>({...n,[a]:[s,e[i],t[i]]})),{}))})).then((e=>{t=e})).catch(console.error)}else n.current&&h({});return()=>{t&&t()}}),[e,n,r]),(0,a.useMemo)((()=>r&&m&&r.length===Object.keys(m).length?r.filter((([e])=>m[e])).map((([e])=>function(e,t,[n,{controllerId:a,exposure:r,nextSessionIds:o,nominators:l,rewardDestination:c,sessionIds:u,stakingLedger:m,validatorPrefs:h},p]){const g=!(null==l||!l.length),f=!(Array.isArray(p)?p[1].isEmpty:p.isEmpty),b=o instanceof Map?[...o.values()]:o,v=(0,s.e)(...b.map((e=>e.toU8a()))),x=u instanceof Map?[...u.values()]:u,A=(0,s.e)(...x.map((e=>e.toU8a()))),w=d(a);return{controllerId:w,destination:c,exposure:r,hexSessionIdNext:(0,i.c)(v,48),hexSessionIdQueue:(0,i.c)(A.length?A:v,48),isLoading:!1,isOwnController:t.includes(w||""),isOwnStash:n,isStashNominating:g,isStashValidating:f,nominating:null==l?void 0:l.map(d),sessionIds:(b.length?b:x).map(d),stakingLedger:m,stashId:e,validatorPrefs:h}}(e,t,m[e]))):void 0),[t,r,m])}))},2447:(e,t,n)=>{n.d(t,{q:()=>c,y:()=>l});var a=n(2784),s=n(89448),i=n(13328),r=n(92529),o=n(36856);const l=(0,s.e)("useOwnStashes",(function(e){var t,n;const{allAccounts:s}=(0,i.x)(),{api:l}=(0,r.h)(),c=(0,a.useMemo)((()=>s.concat(e||[])),[s,e]),u=(0,o.W7)(0!==c.length&&(null==(t=l.query.staking)?void 0:t.bonded.multi),[c]),d=(0,o.W7)(0!==c.length&&(null==(n=l.query.staking)?void 0:n.ledger.multi),[c]);return(0,a.useMemo)((()=>c.length?u&&d?function(e,t,n){const a=[];return t.forEach(((t,n)=>{t.isSome&&a.push([e[n],!0])})),n.forEach((e=>{if(e.isSome){const t=e.unwrap().stash.toString();!a.some((([e])=>e===t))&&a.push([t,!1])}})),a}(c,u,d):void 0:[]),[c,u,d])})),c=(0,s.e)("useOwnStashIds",(function(e){const t=l(e);return(0,a.useMemo)((()=>t?t.map((([e])=>e)):void 0),[t])}))},91572:(e,t,n)=>{n.d(t,{x:()=>c});var a=n(2784),s=n(26912),i=n(89448),r=n(69877),o=n(96464),l=n(76015);const c=(0,i.e)("useParaApi",(function(e){const t=(0,o.X)(),n=(0,l.jC)(e),[i,c]=(0,a.useState)((()=>({api:null,endpoints:n,urls:[]}))),u=(0,r.J)(i.urls);return(0,a.useEffect)((()=>{t.current&&c({api:null,endpoints:n,urls:(0,s.r)(n.filter((({isDisabled:e,isUnreachable:t})=>!e&&!t)).map((({value:e})=>e)))})}),[n,t]),(0,a.useEffect)((()=>{t.current&&c((({endpoints:e,urls:t})=>({api:u,endpoints:e,urls:t})))}),[u,t]),i}))},76015:(e,t,n)=>{n.d(t,{gW:()=>m,jC:()=>d});var a=n(2784),s=n(43212),i=n(12372),r=n(89448),o=n(92529);const l=(0,s.Rf)(((e,t)=>t||e));function c(e,t){const n=(0,i.G)(t).toNumber();return e.filter((({paraId:e})=>e===n))}const u=(0,r.e)("useRelayEndpoints",(function(){const{api:e}=(0,o.h)();return(0,a.useMemo)((()=>{return t=e.genesisHash.toHex(),l.filter((({genesisHashRelay:e})=>t===e));var t}),[e])})),d=(0,r.e)("useParaEndpoints",(function(e){const t=u();return(0,a.useMemo)((()=>c(t,e)),[t,e])})),m=(0,r.e)("useIsParasLinked",(function(e){const t=u();return(0,a.useMemo)((()=>e?e.reduce(((e,n)=>({...e,[n.toString()]:0!==c(t,n).length})),{}):{}),[t,e])}))},96288:(e,t,n)=>{n.d(t,{CH:()=>A,uD:()=>b});var a=n(2784),s=n(92529),i=n(36856),r=n(89448),o=n(37602),l=n(54371),c=n(48358),u=n(55858),d=n(48801),m=n.n(d),h=n(14681),p=n(33403),g=n(95292);function f(e){if(e.query.preimage&&e.query.preimage.preimageFor&&e.query.preimage.preimageFor.creator.meta.type.isMap){const{type:t}=e.registry.lookup.getTypeDef(e.query.preimage.preimageFor.creator.meta.type.asMap.key);if("H256"===t)return"hash";if("(H256,u32)"===t)return"hashAndLen"}return"unknown"}function b(e,t){let n,a;if((0,l.H)(t))n=t;else if((0,c.U)(t))n=t.toHex();else{const s=t;s.isInline?(a=s.asInline.toU8a(!0),n=(0,u.c)(e.registry.hash(a))):t.isLegacy?n=t.asLegacy.hash_.toHex():t.isLookup?n=t.asLookup.hash_.toHex():console.error(`Unhandled FrameSupportPreimagesBounded type ${t.type}`)}return{inlineData:a,paramsStatus:n&&[n],proposalHash:n,resultPreimageHash:n&&{count:0,isCompleted:!1,isHashParam:"hash"===f(e),proposalHash:n,proposalLength:a&&new(m())(a.length),registry:e.registry,status:null}}}function v(e,t){const n=(0,c.U)(t)?t:t.unwrapOr(null);let a,s=null,i=null,r=null;if(n)try{s=e.registry.createType("Call",n);const t=s.encodedLength;if(e.proposalLength){const n=e.proposalLength.toNumber();t!==n&&(r=`Decoded call length does not match on-chain stored preimage length (${(0,h.u)(t)} bytes vs ${(0,h.u)(n)} bytes)`)}else a=new(m())(t)}catch(e){console.error(e),i="Unable to decode preimage bytes into a valid Call"}else r="No preimage bytes found";return(0,p.Z)({},e,{isCompleted:!0,proposal:s,proposalError:i,proposalLength:a||e.proposalLength,proposalWarning:r})}function x(e){return e?{amount:e[1],who:e[0].toString()}:void 0}const A=(0,r.e)("usePreimage",(function(e){var t,n;const{api:r}=(0,s.h)(),{inlineData:l,paramsStatus:c,resultPreimageHash:u}=(0,a.useMemo)((()=>e?b(r,e):{}),[r,e]),d=(0,i.W7)(!l&&c&&(null==(t=r.query.preimage)?void 0:t.statusFor),c),{paramsBytes:m,resultPreimageFor:h}=(0,a.useMemo)((()=>u&&d?function(e,t){const n=(0,p.Z)({},e,{status:t.unwrapOr(null)});if(n.status)if(n.status.isRequested){const e=n.status.asRequested;if(e instanceof o.W);else{const{count:t,deposit:a,len:s}=e;n.count=t.toNumber(),n.deposit=x(a.unwrapOr(null)),n.proposalLength=s.unwrapOr(g.nw)}}else if(n.status.isUnrequested){const e=n.status.asUnrequested;if(e instanceof o.W)n.deposit=x(e.unwrapOr(null));else{const{deposit:e,len:t}=n.status.asUnrequested;n.deposit=x(e),n.proposalLength=t}}else console.error(`Unhandled PalletPreimageRequestStatus type: ${n.status.type}`);return{paramsBytes:n.isHashParam?[n.proposalHash]:[[n.proposalHash,n.proposalLength||g.nw]],resultPreimageFor:n}}(u,d):{}),[d,u]),f=(0,i.W7)(m&&(null==(n=r.query.preimage)?void 0:n.preimageFor),m);return(0,a.useMemo)((()=>h?f?v(h,f):h:u?l?v(u,l):u:void 0),[l,f,u,h])}))},59268:(e,t,n)=>{n.d(t,{N:()=>l});var a=n(89448),s=n(13328),i=n(92529),r=n(36856);const o={transform:(e,t)=>3===t.tx.proxy.addProxy.meta.args.length?e:e.map((([e,n])=>[e.map((([e,n])=>t.createType("ProxyDefinition",{delegate:e,proxyType:n}))),n]))},l=(0,a.e)("useProxies",(function(){var e;const{api:t}=(0,i.h)(),{allAccounts:n}=(0,s.x)();return(0,r.W7)(null==(e=t.query.proxy)?void 0:e.proxies.multi,[n],o)}))},54782:(e,t,n)=>{n.d(t,{L:()=>i});var a=n(2784),s=n(85584);const i=(0,n(89448).e)("useQueue",(function(){return(0,a.useContext)(s.l)}))},20147:(e,t,n)=>{n.d(t,{F:()=>l});var a=n(2784),s=n(89448),i=n(13328),r=n(92529),o=n(36856);const l=(0,s.e)("useRegistrars",(function(e){var t;const{api:n}=(0,r.h)(),{allAccounts:s,hasAccounts:l}=(0,i.x)(),c=(0,o.W7)(!e&&(null==(t=n.query.identity)?void 0:t.registrars));return(0,a.useMemo)((()=>{const e=(c||[]).map(((e,t)=>({address:e.isSome?e.unwrap().account.toString():null,index:t}))).filter((e=>!!e.address));return{isRegistrar:l&&e.some((({address:e})=>s.includes(e))),registrars:e}}),[s,l,c])}))},27662:(e,t,n)=>{n.d(t,{o:()=>o});var a=n(2784),s=n(23729),i=n.n(s),r=n(47538);function o(e,t){const[n,s]=(0,a.useState)((()=>function(e,t){const n=i().get(`flags:${e}`,{});return Object.keys(t).reduce(((e,t)=>((0,r.j)(n[t])&&(e[t]=n[t]),e)),{...t})}(e,t))),[o]=(0,a.useState)((()=>function(e,t){return Object.keys(e).reduce(((e,n)=>(e[n]=(e=>n=>t((t=>({...t,[e]:n}))))(n),e)),{})}(t,s)));return(0,a.useEffect)((()=>{i().set(`flags:${e}`,n)}),[n,e]),[n,o]}},10037:(e,t,n)=>{n.d(t,{_:()=>r});var a=n(89448),s=n(92529),i=n(36856);const r=(0,a.e)("useStakingInfo",(function(e){var t;const{api:n}=(0,s.h)();return(0,i.W7)(null==(t=n.derive.staking)?void 0:t.account,[e])}))},63315:(e,t,n)=>{n.d(t,{t:()=>s});var a=n(2784);const s=(0,n(89448).e)("useStepper",(function(){const[e,t]=(0,a.useState)(1),n=(0,a.useCallback)((()=>t((e=>e+1))),[]),s=(0,a.useCallback)((()=>t((e=>e-1))),[]);return(0,a.useMemo)((()=>[e,n,s,t]),[e,n,s,t])}))},17196:(e,t,n)=>{n.d(t,{x:()=>r});var a=n(89448),s=n(92529),i=n(36856);const r=(0,a.e)("useSubidentities",(function(e){var t,n;const{api:a}=(0,s.h)();return null==(t=(0,i.W7)(null==(n=a.query.identity)?void 0:n.subsOf,[e]))?void 0:t[1]}))},67993:(e,t,n)=>{n.d(t,{p:()=>c});var a=n(2784),s=n(89448),i=n(13328),r=n(92529),o=n(36856);const l={transform:e=>e.toString()},c=(0,s.e)("useSudo",(function(){var e;const{api:t}=(0,r.h)(),{allAccounts:n,hasAccounts:s}=(0,i.x)(),c=(0,o.W7)(s&&(null==(e=t.query.sudo)?void 0:e.key),void 0,l),[u,d]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{d(!!c&&!!n&&n.some((e=>e===c)))}),[n,c]),{allAccounts:n,hasSudoKey:u,sudoKey:c}}))},28444:(e,t,n)=>{n.d(t,{J:()=>r});var a=n(2784),s=n(89448),i=n(92529);const r=(0,s.e)("useSystemApi",(function(){const{api:e,apiRelay:t}=(0,i.h)();return(0,a.useMemo)((()=>t||e),[t,e])}))},36546:(e,t,n)=>{n.d(t,{M:()=>m});var a=n(2784),s=n(43212),i=n(65968),r=n(89448),o=n(92529),l=n(36856);const c={allowTeleport:!1,destinations:[],oneWay:[]},u=(0,s.Rf)(((e,t)=>t||e)).filter((e=>!!e.teleport));function d(e,t){return u.filter((n=>(n.genesisHashRelay===e||n.genesisHash===e)&&t(n))).reduce(((e,t)=>(e.some((({genesisHash:e,paraId:n})=>n===t.paraId||e&&e===t.genesisHash))||e.push(t),e)),[]).sort(((e,t)=>e.isRelay===t.isRelay?0:e.isRelay?-1:1))}const m=(0,r.e)("useTeleport",(function(){var e;const{api:t,apiUrl:n,isApiReady:s}=(0,o.h)(),r=(0,l.W7)(s&&(null==(e=t.query.parachainInfo)?void 0:e.parachainId)),[m,h]=(0,a.useState)((()=>({...c})));return(0,a.useEffect)((()=>{if(s){const e=t.genesisHash.toHex(),n=u.find((({genesisHash:t})=>t===e));if(n){const t=d(e,(({paraId:e})=>(0,i.h)(e)&&n.teleport.includes(e))),a=d(e,(({paraId:e,teleport:t})=>(0,i.h)(e)&&!t.includes(-1))).map((({paraId:e})=>e||-1));h({allowTeleport:0!==t.length,destinations:t,isRelayTeleport:!0,oneWay:a})}}}),[t,s]),(0,a.useEffect)((()=>{if(r){const e=u.find((({value:e})=>e===n));if(e&&e.genesisHashRelay){const t=d(e.genesisHashRelay,(({paraId:t})=>e.teleport.includes((0,i.h)(t)?t:-1))),n=d(e.genesisHashRelay,(({paraId:e,teleport:t})=>!t.includes((0,i.h)(e)?e:-1))).map((({paraId:e})=>e||-1));h({allowTeleport:0!==t.length,destinations:t,isParaTeleport:!0,oneWay:n})}}}),[n,r]),m}))},70681:(e,t,n)=>{n.d(t,{F:()=>i});var a=n(2784),s=n(82740);const i=(0,n(89448).e)("useTheme",(function(){const{theme:e}=(0,a.useContext)(s.Ni);return(0,a.useMemo)((()=>({theme:e,themeClassName:`theme--${e}`})),[e])}))},7840:(e,t,n)=>{n.d(t,{O:()=>r});var a=n(2784),s=n(89448),i=n(96464);const r=(0,s.e)("useToggle",(function(e=!1,t){const n=(0,i.X)(),[s,r]=(0,a.useState)(e),o=(0,a.useCallback)((()=>{n.current&&r((e=>!e))}),[n]),l=(0,a.useCallback)((e=>{n.current&&r(e)}),[n]);return(0,a.useEffect)((()=>t&&t(s)),[s,t]),(0,a.useMemo)((()=>[s,o,l]),[s,o,l])}))},5500:(e,t,n)=>{n.d(t,{_:()=>m});var a=n(2784),s=n(95292),i=n(51330),r=n(48801),o=n.n(r),l=n(89448),c=n(92529),u=n(36856);const d=new Uint8Array(32),m=(0,l.e)("useTreasury",(function(){var e,t;const{api:n}=(0,c.h)(),[r,l]=(0,a.useState)((()=>({pendingBounties:s.nw,pendingProposals:s.nw,spendPeriod:n.consts.treasury?n.consts.treasury.spendPeriod:s.nw,treasuryAccount:(0,i.e)("modl",n.consts.treasury&&n.consts.treasury.palletId?n.consts.treasury.palletId.toU8a(!0):"py/trsry",d).subarray(0,32)}))),m=(0,u.W7)(null==(e=n.derive.bounties)?void 0:e.bounties),h=(0,u.W7)(n.derive.treasury.proposals),p=(0,u.W7)(null==(t=n.derive.balances)?void 0:t.account,[r.treasuryAccount]);return(0,a.useEffect)((()=>{p&&n.consts.treasury&&l((({pendingBounties:e,pendingProposals:t,spendPeriod:a,treasuryAccount:i})=>({burn:p.freeBalance.gt(s.nw)&&!n.consts.treasury.burn.isZero()?n.consts.treasury.burn.mul(p.freeBalance).div(s.uy):s.nw,pendingBounties:e,pendingProposals:t,spendPeriod:a,treasuryAccount:i,value:p.freeBalance.gt(s.nw)?p.freeBalance:void 0})))}),[n,p]),(0,a.useEffect)((()=>{h&&l((e=>({...e,pendingProposals:h.approvals.reduce(((e,{proposal:{value:t}})=>e.iadd(t)),new(o())(0)),totalProposals:h.proposalCount.toNumber()})))}),[h]),(0,a.useEffect)((()=>{m&&l((e=>({...e,pendingBounties:m.reduce(((e,{bounty:{status:t,value:n}})=>e.iadd(t.isApproved?n:s.nw)),new(o())(0))})))}),[m]),r}))},95155:(e,t,n)=>{n.d(t,{b:()=>u});var a=n(2784),s=n(33661),i=n(17965),r=n(89448),o=n(13328),l=n(92529),c=n(25943);const u=(0,r.e)("useTxBatch",(function(e,t){const{api:n}=(0,l.h)(),{allAccounts:r}=(0,o.x)(),[u,d]=(0,a.useState)((()=>Math.floor((null==t?void 0:t.max)||64)));return(0,a.useEffect)((()=>{e&&e.length&&r[0]&&e[0].hasPaymentInfo&&(0,i.Y)((async()=>{try{const t=await e[0].paymentInfo(r[0]),a=(0,c.ZQ)(t.weight),s=(0,c.ZQ)(n.consts.system.blockWeights?n.consts.system.blockWeights.maxBlock:n.consts.system.maximumBlockWeight);d((e=>a.v1Weight.isZero()?e:Math.floor(s.v1Weight.muln(64).div(a.v1Weight).toNumber()/100)))}catch(e){console.error(e)}}))}),[r,n,t,e]),(0,a.useMemo)((()=>e&&e.length?function(e,t,n,a="default"){var i;return 1!==n&&(0,s.m)(null==(i=e.tx.utility)?void 0:i.batch)?t.reduce(((e,t)=>{const a=e[e.length-1];return a.length>=n?e.push([t]):a.push(t),e}),[[]]).map((t=>1===t.length?t[0]:"all"===a&&(0,s.m)(e.tx.utility.batchAll)?e.tx.utility.batchAll(t):e.tx.utility.batch(t))):t}(n,e,u,null==t?void 0:t.type):null),[n,u,t,e])}))},94042:(e,t,n)=>{n.d(t,{I:()=>c});var a=n(2784),s=n(33661),i=n(89448),r=n(92529),o=n(65182);const l={hasFailed:!1,hasPassed:!1,isCloseable:!1,isVoteable:!1,remainingBlocks:null},c=(0,i.e)("useVotingStatus",(function(e,t,n){const{api:i}=(0,r.h)(),c=(0,o.C)();return(0,a.useMemo)((()=>c&&e?function(e,t,n,a,i){var r;const[o]=e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),i)||[i],l=(0,s.m)(null==(r=e.tx[o])?void 0:r.close)?o:null;if(!n.end||!l)return{hasFailed:!1,hasPassed:!1,isCloseable:!1,isVoteable:!0,remainingBlocks:null};const c=t.gte(n.end),u=n.threshold.lten(n.ayes.length),d=n.threshold.gtn(Math.abs(a-n.nays.length));return{hasFailed:d,hasPassed:u,isCloseable:4===e.tx[l].close.meta.args.length?c||u||d:c,isVoteable:!c,remainingBlocks:c?null:n.end.sub(t)}}(i,c,e,t,n):l),[i,c,t,n,e])}))},25943:(e,t,n)=>{n.d(t,{TS:()=>d,ZQ:()=>h,h7:()=>p});var a=n(2784),s=n(95292),i=n(33403),r=n(33661),o=n(17965),l=n(89448),c=n(92529),u=n(96464);const d="0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",m={encodedCallLength:0,v1Weight:s.nw,v2Weight:{refTime:s.nw},weight:s.nw};function h(e){if(e.proofSize)return{v1Weight:e.refTime.toBn(),v2Weight:e};if(e.refTime){const t=e.refTime.toBn();return{v1Weight:t,v2Weight:{refTime:t}}}const t=e.toBn();return{v1Weight:t,v2Weight:{refTime:t}}}const p=(0,l.e)("useWeight",(function(e){const{api:t}=(0,c.h)(),n=(0,u.X)(),[s,l]=(0,a.useState)((()=>(0,i.Z)({isWeightV2:!(0,r.m)(t.registry.createType("Weight").toBn)},m)));return(0,a.useEffect)((()=>{e&&t.call.transactionPaymentApi?(0,o.Y)((async()=>{try{const{v1Weight:a,v2Weight:s}=h((await t.tx(e).paymentInfo(d)).weight);n.current&&l((t=>(0,i.Z)({},t,{encodedCallLength:e.encodedLength,v1Weight:a,v2Weight:s,weight:t.isWeightV2?s:a})))}catch(e){console.error(e)}})):l((e=>(0,i.Z)({},e,m)))}),[t,e,n]),s}))},16501:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(2784),s=n(61397),i=n(52322);function r({children:e,className:t="",withBorder:n,withExpander:a,withPadding:s}){return(0,i.jsx)(o,{className:`${t} ui--Params ${n?"withBorder":""} ${s?"withPadding":""} ${a?"withExpander":""}`,children:e})}const o=s.zo.div`
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
`,l=a.memo(r)},75502:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(2784),s=n(94586),i=n(48801),r=n.n(i),o=n(21362),l=n(52322);function c({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:c,onChange:u,onEnter:d,onEscape:m,withLabel:h}){const[p,g]=(0,a.useState)(!1),[f]=(0,a.useState)((()=>new(r())((t||"0").toString()).toString(10))),b=(0,a.useCallback)((e=>{const t=!i&&!!e;u&&u({isValid:t,value:e}),g(t)}),[i,u]);return(0,l.jsx)(o.Z,{className:e,children:(0,l.jsx)(s.Z,{className:"full",defaultValue:f,isDisabled:n,isError:i||!p,label:c,onChange:b,onEnter:d,onEscape:m,withEllipsis:!0,withLabel:h})})}const u=a.memo(c)},21362:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(2784),s=n(52322);function i({children:e,className:t=""}){return(0,s.jsx)("div",{className:`${t} ui--row --relative`,children:e})}const r=a.memo(i)},13739:(e,t,n)=>{n.d(t,{Z:()=>Mt});var a=n(2784),s=n(9921),i=n(61397),r=n(11147),o=n(16501),l=n(6046),c=n(45469),u=n(1346),d=n(23601),m=n(6485),h=n(69187),p=n(21362),g=n(27113),f=n(82671),b=n(52322);function v(e,t){const n=e.createType(t.type).toRawType();return(0,l.s)(n).sub}function x(e){const{className:t="",defaultValue:n,isDisabled:s,isError:r,label:o,onChange:l,overrides:c,registry:u,type:d,withLabel:m}=e,[{options:h,subTypes:x}]=(0,a.useState)((()=>function(e,t){const n=v(e,t).filter((({name:e})=>!!e&&!e.startsWith("__Unused")));return{options:n.map((({name:e})=>({text:e,value:e}))),subTypes:n}}(u,d))),[A,w]=(0,a.useState)((()=>function(e,t,n,a){const s=v(e,t);return n.value instanceof g.x?[{name:n.value.type,type:s[n.value.index]}]:[{name:a[0].name,type:a[0]}]}(u,d,n,x))),[{initialEnum:y,initialParams:j},k]=(0,a.useState)((()=>function(e,t){return{initialEnum:e&&e.value?e.value instanceof g.x?e.value.type:(0,f.K)(e.value)?Object.keys(e.value)[0]:t[0]&&t[0].value:t[0]&&t[0].value,initialParams:e&&e.value?e.value instanceof g.x?[{isValid:!0,value:e.value.inner}]:(0,f.K)(e.value)?[{isValid:!0,value:e.value[Object.keys(e.value)[0]]}]:void 0:void 0}}(n,h))),N=(0,a.useCallback)((e=>{if(s)return;const t=x.find((({name:t})=>t===e))||null;w(t?[{name:t.name,type:t}]:null),t&&k((e=>t.name===e.initialEnum?e:{initialEnum:e.initialEnum,initialParams:null}))}),[s,x]),C=(0,a.useCallback)((([{isValid:e,value:t}])=>{s||A&&l&&l({isValid:e,value:{[A[0].name]:t}})}),[A,s,l]);return(0,b.jsxs)(p.Z,{className:t,children:[(0,b.jsx)(i.Lt,{className:"full",defaultValue:y,isDisabled:s,isError:r,label:o,onChange:N,options:h,withEllipsis:!0,withLabel:m}),A&&(0,b.jsx)(Mt,{isDisabled:s,isError:r,onChange:C,overrides:c,params:A,registry:u,values:j})]})}const A=a.memo(x);function w(e){if(e)try{return h.Nn.decodeAddress(e),!0}catch(e){console.error(e)}return!1}function y(e){const{className:t="",defaultValue:{value:n},isDisabled:s,isError:r,label:o,onChange:l,type:c,withLabel:u}=e,[d]=(0,a.useState)((()=>null==n?void 0:n.toString())),m=(0,a.useCallback)((e=>l&&l({isValid:w(e),value:e})),[l]);return"MultiAddress"!==c.type||s&&n&&"Id"===n.type?(0,b.jsx)(p.Z,{className:t,children:(0,b.jsx)(i.rp,{className:"full",defaultValue:d,isDisabled:s,isError:r,isInput:!0,label:o,onChange:m,placeholder:"5...",type:"allPlus",withEllipsis:!0,withLabel:u})}):(0,b.jsx)(A,{...e})}const j=a.memo(y);var k=n(14681),N=n(12372);function C({className:e="",defaultValue:{value:t},isDisabled:n,isError:s,label:r,onChange:o,onEnter:l,registry:c,type:d,withLabel:m}){const h=(0,a.useMemo)((()=>/^i\d*$/.test(d.type)),[d]),g=(0,a.useMemo)((()=>n?t instanceof c.createClass("AccountIndex")?t.toString():(0,k.u)(t):(0,N.G)(t||0).toString()),[n,c,t]),f=(0,a.useMemo)((()=>function(e,{type:t}){try{return e.createType(t).bitLength()}catch(e){return 32}}(c,d)),[c,d]),v=(0,a.useCallback)((e=>o&&o({isValid:!(0,u.o)(e),value:e})),[o]);return(0,b.jsx)(p.Z,{className:e,children:n?(0,b.jsx)(i.II,{className:"full",defaultValue:g,isDisabled:!0,label:r,withEllipsis:!0,withLabel:m}):(0,b.jsx)(i.Rn,{bitLength:f,className:"full",defaultValue:g,isError:s,isSigned:h,isZeroable:!0,label:r,onChange:v,onEnter:l,withLabel:m})})}const E=a.memo(C);var S=n(75502),I=n(68774),D=n(5122);function B(e,t){if(e)try{return t?(0,I.u)(e):(0,D.Y)(e)}catch(e){console.error(e)}return!1}function L(e){const{bytesLength:t,className:n="",defaultValue:{value:s},isDisabled:r,isError:o,label:l,onChange:c}=e,[u]=(0,a.useState)((()=>null==s?void 0:s.toString())),d=(0,a.useCallback)((e=>c&&c({isValid:B(e,20===t),value:e})),[t,c]);return(0,b.jsx)(p.Z,{className:n,children:(0,b.jsx)(i.bm,{bytesLength:t,className:"full",defaultValue:u,forceIconType:20===t?"ethereum":"substrate",isDisabled:r,isError:o,label:l,noConvert:!0,onChange:d,placeholder:20===t?"0x1...":"5..."})})}const $=a.memo(L);function V(e){return(0,b.jsx)($,{...e,bytesLength:20})}const P=a.memo(V);function Z(e){return(0,b.jsx)($,{...e,bytesLength:32})}const T=a.memo(Z);var z=n(47538),F=n(61349);function M(){return(0,F.$G)("react-params")}const H=(0,F.Zh)(["react-params"]);function R({className:e="",defaultValue:{value:t},isDisabled:n,isError:s,label:r,onChange:o,withLabel:l}){const{t:c}=M(),[u]=(0,a.useState)(t instanceof Boolean?t.valueOf():!!(0,z.j)(t)&&t),d=(0,a.useRef)([{text:c("No"),value:!1},{text:c("Yes"),value:!0}]),m=(0,a.useCallback)((e=>o&&o({isValid:!0,value:e})),[o]);return(0,b.jsx)(p.Z,{className:e,children:(0,b.jsx)(i.Lt,{className:"full",defaultValue:u,isDisabled:n,isError:s,label:r,onChange:m,options:d.current,withEllipsis:!0,withLabel:l})})}const U=a.memo(R);var q=n(88311),O=n(48533),W=n(70676),Q=n(64021),K=n(46610),G=n(56623),J=n(55858),Y=n(74076),X=n(94175);const _=()=>!0;function ee({asHex:e,children:t,className:n="",defaultValue:{value:s},isDisabled:r,isError:o,label:l,labelExtra:c,length:u=-1,onChange:d,onEnter:m,onEscape:h,size:p="full",validate:g=_,withCopy:f,withLabel:v,withLength:x}){const{t:A}=M(),[w]=(0,a.useState)((()=>{if(s){const e=(0,K.Y)(s);return(0,W._)(e)?(0,G.z)(e):(0,J.c)(e)}})),[{isAddress:y,isValid:j,lastValue:k},N]=(0,a.useState)((()=>({isAddress:!1,isValid:(0,Y.vq)(w)||(0,W._)(w)}))),C=(0,a.useCallback)((t=>{let[n,a,s]=function(e){if("0x"===e)return[!0,!1,new Uint8Array([])];if(e.startsWith("0x"))try{return[!0,!1,(0,O.G)(e)]}catch(e){return[!1,!1,new Uint8Array([])]}try{return[!0,!0,(0,X.m)(e)]}catch(e){}return(0,W._)(e)?[!0,!1,(0,Q.d)(e)]:["0x"===e,!1,new Uint8Array([])]}(t);n=n&&g(s)&&(-1!==u?s.length===u:0!==s.length||"0x"===t),x&&n&&(s=(0,q.N)(s)),d&&d({isValid:n,value:e?(0,J.c)(s):s}),N({isAddress:a,isValid:n,lastValue:s})}),[e,u,d,g,x]);return(0,b.jsx)(te,{className:n,children:(0,b.jsxs)(i.II,{className:p,defaultValue:w,isAction:!!t,isDisabled:r,isError:o||!j,label:l,labelExtra:c,onChange:C,onEnter:m,onEscape:h,placeholder:A("0x prefixed hex, e.g. 0x1234 or ascii data"),type:"text",withEllipsis:!0,withLabel:v,children:[t,f&&(0,b.jsx)(i.qi,{value:w}),y&&(0,b.jsx)(i.k,{className:"ui--InputAddressSimpleIcon",size:32,value:k})]})})}const te=(0,i.zo)(p.Z)`
  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: -16px;
    position: absolute;
    top: 8px;
  }
`,ne=a.memo(ee);function ae({className:e="",isDisabled:t,isError:n=!1,label:a,labelExtra:s,onChange:r,placeholder:o,withLabel:l}){return(0,b.jsx)(p.Z,{className:e,children:(0,b.jsx)(i.ht,{isDisabled:t,isError:n,label:a,labelExtra:s,onChange:r,placeholder:o,withEllipsis:!0,withLabel:l})})}const se=a.memo(ae);function ie({className:e="",defaultValue:t,isDisabled:n,isError:s,label:r,name:o,onChange:l,onEnter:c,onEscape:u,type:d,withLabel:m}){const{t:h}=M(),[p,g]=(0,a.useState)(!1),[f,v]=(0,a.useState)(!1),x=(0,a.useCallback)((e=>{const t=0!==e.length;l&&l({isValid:t,value:(0,q.N)(e)}),g(t)}),[l]),A=!n&&(0,b.jsx)(i.ZD,{label:h("file upload"),onChange:v,value:f});return(0,b.jsx)("div",{className:`${e} --relative`,children:!n&&f?(0,b.jsx)(se,{isDisabled:n,isError:s||!p,label:r,labelExtra:A,onChange:x,withLabel:m}):(0,b.jsx)(ne,{defaultValue:t,isDisabled:n,isError:s,label:r,labelExtra:A,length:-1,name:o,onChange:l,onEnter:c,onEscape:u,type:d,withLabel:m,withLength:!0})})}const re=a.memo(ie);var oe=n(6847);function le({asHex:e,children:t,childrenPre:n,className:s="",defaultValue:r,isOptional:o,label:l}){const{t:c}=M(),u=(0,a.useMemo)((()=>r&&r.value&&(e?r.value.toHex():(0,oe.k)(r.value.toHuman?r.value.toHuman():r.value))),[e,r]);return(0,b.jsxs)(ce,{className:s,children:[n,(0,b.jsx)(i.qG,{className:"full",label:l,value:(0,b.jsx)("pre",{children:u||(o?(0,b.jsx)(b.Fragment,{children:" "}):c("<empty>"))})}),t]})}const ce=(0,i.zo)(p.Z)`
  pre {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ui--Static {
    margin-bottom: 0 !important;
  }
`,ue=a.memo(le);function de(e){const{className:t="",defaultValue:n,isDisabled:a,isError:s,label:i,name:r,onChange:o,onEnter:l,onEscape:c,type:u}=e;return a?(0,b.jsx)(ue,{...e}):(0,b.jsx)(ne,{asHex:!0,className:t,defaultValue:n,isDisabled:a,isError:s,label:i,length:-1,name:r,onChange:o,onEnter:l,onEscape:c,type:u})}const me=a.memo(de);function he(e){const{t}=M(),{className:n="",defaultValue:{value:a},isDisabled:s,label:r,withLabel:o}=e;if(!s)return(0,b.jsx)(me,{...e});const l=a,{method:c,section:u}=l.registry.findMetaCall(l.callIndex),d=`${u}.${c}`;return(0,b.jsxs)(p.Z,{children:[(0,b.jsx)(i.qG,{className:`${n} full`,label:r,withLabel:o,children:d}),(0,b.jsx)(i.Ig,{callName:d,labelHash:t("call hash / {{section}}.{{method}}",{replace:{method:c,section:u}}),value:l,withHash:!0})]})}const pe=a.memo(he);var ge=n(24107),fe=n(8260),be=n(45409);function ve({children:e,className:t="",isOuter:n,label:a,labelExtra:s,size:r="full",withLabel:o}){return(0,b.jsxs)(p.Z,{className:t,children:[(0,b.jsx)(i.jN,{className:r,isOuter:!0,label:a,labelExtra:s,withEllipsis:!0,withLabel:o,children:!n&&e}),n&&e]})}const xe=a.memo(ve);const Ae=(0,n(89448).e)("useParamDefs",(function(e,t){return(0,a.useMemo)((()=>function(e,t){const n=function(e,t){try{return(0,l.s)(e.createType(t.type).toRawType())}catch(e){return t}}(e,t);return n.sub?(Array.isArray(n.sub)?n.sub:[n.sub]).map((e=>({length:n.length,name:e.name,type:e}))):[]}(e,t)),[e,t])}));function we(e){const t=Ae(e.registry,e.type),{className:n="",defaultValue:s,isDisabled:i,label:r,onChange:o,overrides:l,withLabel:c}=e,[u]=(0,a.useState)((()=>function({isValid:e,value:t}){return e&&(0,ge.c)(t)&&t instanceof be.A?t.toArray().map((e=>({isValid:!0,value:e}))):void 0}(s))),d=(0,a.useCallback)((e=>{i||o&&o({isValid:e.reduce(((e,{isValid:t})=>e&&t),!0),value:t.reduce(((t,{name:n},a)=>(t[n]=e[a].value,t)),{})})}),[i,t,o]);return(0,b.jsxs)("div",{className:"ui--Params-Struct",children:[(0,b.jsx)(xe,{className:n,label:r,withLabel:c}),(0,b.jsx)(Mt,{isDisabled:i,onChange:d,overrides:l,params:t,registry:e.registry,values:u})]})}const ye=a.memo(we);function je(e){const{className:t="",defaultValue:n,isDisabled:s,isError:r,label:o,onChange:l,withLabel:c}=e,[u,d]=(0,a.useState)(!1),[m]=(0,a.useState)((()=>s&&n&&(0,ge.c)(n.value)?(0,fe.c)(n.value):null)),[h]=(0,a.useState)((()=>s||!n||(0,ge.c)(n.value))),g=(0,a.useCallback)((e=>{const t=(0,fe.h)(e),n=!!t;l&&l({isValid:n,value:t}),d(n)}),[l]);return m?(0,b.jsx)(ue,{...e,children:(0,b.jsx)(i.II,{className:"full",isDisabled:!0,label:"ipfs",type:"text",value:m,withLabel:c})}):h?(0,b.jsx)(ye,{...e}):(0,b.jsx)(p.Z,{className:t,children:(0,b.jsx)(i.II,{className:"full",isDisabled:s,isError:r||!u,label:o,onChange:g,placeholder:"IPFS compatible CID",type:"text",withLabel:c})})}const ke=a.memo(je);var Ne=n(6226);function Ce({className:e="",defaultValue:t,isDisabled:n,isError:s,label:i,onChange:r,onEnter:o,onEscape:l,registry:c,type:u,withLabel:d}){const[m,h]=(0,a.useState)(!1),p=(0,a.useCallback)((e=>{const t=(0,Ne.F)(e);r&&r({isValid:t,value:e}),h(t)}),[r]);return n?(0,b.jsx)(re,{className:e,defaultValue:t,isError:s||!m,label:i,onEnter:o,onEscape:l,registry:c,type:u,withLabel:d}):(0,b.jsx)(se,{className:e,defaultValue:t,isError:s||!m,label:i,onChange:p,withLabel:d})}const Ee=a.memo(Ce);function Se(e){const{t}=M(),[{details:n,type:s},r]=(0,a.useState)({});return(0,a.useEffect)((()=>{const{value:t}=e.defaultValue||{};if(function(e){return!(!e||!e.isModule&&!e.isToken)}(t))if(t.isModule)try{const e=t.asModule,{docs:n,name:a,section:s}=e.registry.findMetaError(e);return r({details:n.join(", "),type:`${s}.${a}`})}catch(e){console.error(e)}else if(t.isToken)return r({details:t.asToken.type,type:t.type});r({details:null})}),[e.defaultValue]),e.isDisabled&&n?(0,b.jsxs)(ue,{...e,children:[(0,b.jsx)(i.II,{className:"full",isDisabled:!0,label:t("type"),value:s}),n&&(0,b.jsx)(i.II,{className:"full",isDisabled:!0,label:t("details"),value:n})]}):(0,b.jsx)(me,{...e})}const Ie=a.memo(Se);function De(e){const{defaultValue:t,isDisabled:n,label:s}=e,r=(0,a.useMemo)((()=>{return t&&(e=t.value)&&e.isErr?{isValid:!0,value:t.value.asErr}:null;var e}),[t]);return n?r?(0,b.jsx)(Ie,{...e,childrenPre:(0,b.jsx)(i.II,{className:"full",isDisabled:!0,label:s,value:"Err"}),defaultValue:r,label:"DispatchError"}):(0,b.jsx)(ue,{...e,defaultValue:{isValid:!0,value:"Ok"}}):(0,b.jsx)(me,{...e})}const Be=a.memo(De);function Le({className:e="",defaultValue:t,isDisabled:n,isError:a,label:s,name:i,onChange:r,onEnter:o,onEscape:l,type:c,withLabel:u}){return(0,b.jsx)(ne,{asHex:!0,className:e,defaultValue:t,isDisabled:n,isError:a,label:s,length:20,name:i,onChange:r,onEnter:o,onEscape:l,type:c,withCopy:n,withLabel:u})}const $e=a.memo(Le);function Ve({className:e="",defaultValue:t,isDisabled:n,isError:s,label:r,name:o,onChange:l,onEnter:c,onEscape:u,registry:d,type:m,withLabel:h}){const{t:p}=M(),[g,f]=(0,a.useState)(!1),[v,x]=(0,a.useState)(null),A=(0,a.useCallback)((e=>{const t=d.hash(e);x((0,J.c)(t)),l&&l({isValid:!0,value:t})}),[l,d]),w=(0,a.useCallback)((e=>{x(null),f(e)}),[f,x]),y=!n&&(0,b.jsx)(i.ZD,{label:p("hash a file"),onChange:w,value:g});return(0,b.jsx)("div",{className:e,children:!n&&g?(0,b.jsx)(se,{isDisabled:n,isError:s,label:r,labelExtra:y,onChange:A,placeholder:v||void 0,withLabel:h}):(0,b.jsx)(ne,{asHex:!0,defaultValue:t,isDisabled:n,isError:s,label:r,labelExtra:y,length:32,name:o,onChange:l,onEnter:c,onEscape:u,type:m,withCopy:n,withLabel:h})})}const Pe=a.memo(Ve);function Ze({className:e="",defaultValue:t,isDisabled:n,isError:a,label:s,name:i,onChange:r,onEnter:o,onEscape:l,type:c,withLabel:u}){return(0,b.jsx)(ne,{asHex:!0,className:e,defaultValue:t,isDisabled:n,isError:a,label:s,length:64,name:i,onChange:r,onEnter:o,onEscape:l,type:c,withCopy:n,withLabel:u})}const Te=a.memo(Ze);var ze=n(51330);function Fe(e,t=!1){let n,a=!1;try{n=(0,O.G)(e.toString()),a=t||0!==n.length}catch(e){n=new Uint8Array([])}return{isValid:a,u8a:(0,q.N)(n)}}function Me({className:e="",isDisabled:t,label:n,onChange:s,onEnter:r,withLabel:o}){const[,l]=(0,a.useState)(!1),[c,u]=(0,a.useState)((()=>({isValid:!1,u8a:new Uint8Array([])}))),[d,m]=(0,a.useState)((()=>({isValid:!1,u8a:new Uint8Array([])})));(0,a.useEffect)((()=>{const e=c.isValid&&d.isValid;s&&s({isValid:e,value:(0,ze.e)(c.u8a,d.u8a)}),l(e)}),[c,s,d]);const h=(0,a.useCallback)((e=>u(Fe(e))),[]),g=(0,a.useCallback)((e=>m(Fe(e,!0))),[]);return(0,b.jsxs)(p.Z,{className:e,children:[(0,b.jsx)(i.II,{className:"medium",isDisabled:t,isError:!c.isValid,label:n,onChange:h,placeholder:"0x...",type:"text",withLabel:o}),(0,b.jsx)(i.II,{className:"medium",isDisabled:t,isError:!d.isValid,onChange:g,onEnter:r,placeholder:"0x...",type:"text",withLabel:o})]})}const He=a.memo(Me);var Re=n(48731);const Ue={info:0,type:"Bytes"};function qe({className:e="",defaultValue:t,isDisabled:n,isError:s,label:i,onChange:r,onEnter:o,onEscape:l,registry:c,withLabel:u}){const{t:d}=M(),[m,h]=(0,a.useState)(d("click to select or drag and drop JSON key/value (hex-encoded) file")),p=(0,a.useCallback)((e=>{let t={isValid:!1,value:[]};try{t=function(e){const t=JSON.parse((0,G.z)(e)),n=Object.keys(t);let a=0!==n.length;const s=n.map((e=>{const n=t[e];(0,Re.hu)((0,Y.vq)(e)&&(0,Y.vq)(n),`Non-hex key/value pair found in ${e.toString()} => ${n.toString()}`);const s=Fe(e),i=Fe(n,!0);return a=a&&s.isValid&&i.isValid,[s.u8a,i.u8a]}));return{isValid:a,value:s}}(e),h(d("{{count}} key/value pairs encoded for submission",{replace:{count:t.value.length}}))}catch(e){console.error("Error converting json k/v",e),h(d("click to select or drag and drop JSON key/value (hex-encoded) file"))}r&&r(t)}),[r,d]);if(n){const n=t.value;return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(xe,{className:e,label:i,children:(0,b.jsx)("div",{})}),(0,b.jsx)("div",{className:"ui--Params",children:n.map((([e,t])=>{const n=(0,J.c)(e.toU8a(!0));return(0,b.jsx)(re,{defaultValue:{value:t},isDisabled:!0,label:n,name:n,onEnter:o,onEscape:l,registry:c,type:Ue},n)}))})]})}return(0,b.jsx)(se,{className:e,isDisabled:n,isError:s,label:i,onChange:p,placeholder:m,withLabel:u})}const Oe=a.memo(qe);function We({className:e="",defaultValue:t,isDisabled:n,isError:s,label:r,onChange:o,onEnter:l,onEscape:c,registry:u,type:d,withLabel:m}){const h=(0,a.useCallback)((e=>o&&o(e)),[o]);return n?(0,b.jsx)(i.qG,{className:e,defaultValue:t&&t.value?t.value.toString():"",isError:s,label:r,withLabel:m}):(0,b.jsx)(E,{className:e,defaultValue:t,isDisabled:n,isError:s,label:r,onChange:h,onEnter:l,onEscape:c,registry:u,type:d,withLabel:m})}const Qe=a.memo(We);function Ke({onChange:e}){return(0,a.useEffect)((()=>{e&&e({isValid:!0,value:null})}),[e]),null}const Ge=a.memo(Ke);function Je(e){if(!e.isDisabled)return(0,b.jsx)(me,{...e});const t=e.registry.createType("Call",e.defaultValue.value.toHex());return(0,b.jsx)(pe,{...e,defaultValue:{isValid:!0,value:t}})}const Ye=a.memo(Je);var Xe=n(37602),_e=n(48358);const et={isValid:!0,value:void 0},tt=new Uint8Array([1]);function nt({className:e="",defaultValue:t,isDisabled:n,label:s,onChange:r,onEnter:l,onEscape:c,registry:u,type:{sub:d,withOptionActive:m},withLabel:h}){const{t:p}=M(),[g,f]=(0,a.useState)((()=>m||!!(t&&t.value instanceof Xe.W&&t.value.isSome)||!1)),[v]=(0,a.useState)((()=>g||n?t&&(t.value instanceof Xe.W&&t.value.isSome?{isValid:t.isValid,value:t.value.unwrap()}:et):et));(0,a.useEffect)((()=>{!g&&r&&r({isValid:!0,value:null})}),[g,r]);const x=(0,a.useCallback)((e=>r&&r(e.isValid&&(0,_e.U)(e.value)&&!m&&g?{isValid:!0,value:(0,ze.e)(tt,e.value)}:e)),[g,r,m]);return(0,b.jsxs)("div",{className:`${e} --relative`,children:[(0,b.jsx)(xe,{className:"--relative",label:s,labelExtra:!n&&(0,b.jsx)(i.ZD,{label:p("include option"),onChange:f,value:g}),withLabel:h}),(0,b.jsx)(o.Z,{children:(0,b.jsx)("div",{className:"ui--Params-Content",children:g?(0,b.jsx)(Zt,{defaultValue:v,isDisabled:n||!g,isOptional:!g&&!n,onChange:x,onEnter:l,onEscape:c,registry:u,type:d}):(0,b.jsx)(ue,{defaultValue:et,isOptional:!0,label:"None"})})})]})}const at=a.memo(nt);function st({className:e="",defaultValue:{value:t},isDisabled:n,isError:s,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const[d,m]=(0,a.useState)(!1),h=(0,a.useCallback)((e=>{const t=0!==e.length;o&&o({isValid:t,value:e}),m(t)}),[o]),g=t?t.toHex?t.toHex():t:"";return(0,b.jsx)(p.Z,{className:e,children:(0,b.jsx)(i.II,{className:"full",defaultValue:g,isDisabled:n,isError:s||!d,label:r,onChange:h,onEnter:l,onEscape:c,placeholder:"Hex data",type:"text",withLabel:u})})}const it=a.memo(st);function rt({className:e="",defaultValue:{value:t},isDisabled:n,isError:s,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const[d,m]=(0,a.useState)(!1),h=(0,a.useCallback)((e=>{const t=0!==e.length;o&&o({isValid:t,value:e}),m(t)}),[o]),g=(t||"").toString();return(0,b.jsx)(p.Z,{className:e,children:(0,b.jsx)(i.II,{className:"full",defaultValue:g,isDisabled:n,isError:s||!d,label:r,onChange:h,onEnter:l,onEscape:c,placeholder:"<any string>",type:"text",withLabel:u})})}const ot=a.memo(rt);var lt=n(71285);function ct(e){const{className:t="",defaultValue:n,isDisabled:s,label:i,onChange:r,overrides:o,registry:l,type:c,withLabel:u}=e,d=Ae(l,c),[m]=(0,a.useState)((()=>function({value:e}){return e instanceof lt.p?e.map((e=>({isValid:!0,value:e}))):e}(n))),h=(0,a.useCallback)((e=>{s||r&&r({isValid:e.reduce(((e,{isValid:t})=>e&&t),!0),value:e.map((({value:e})=>e))})}),[s,r]);return(0,b.jsxs)("div",{className:"ui--Params-Tuple",children:[(0,b.jsx)(xe,{className:t,label:i,withLabel:u}),(0,b.jsx)(Mt,{isDisabled:s,onChange:h,overrides:o,params:d,registry:l,values:m})]})}const ut=a.memo(ct);var dt=n(95292);const mt=[];function ht(e,t){if(t.info===d.u.Vec)return[ht(e,t.sub)];if(t.info===d.u.Tuple)return Array.isArray(t.sub)?t.sub.map((t=>ht(e,t))):[];if(t.info===d.u.Struct)return Array.isArray(t.sub)?t.sub.reduce(((t,n)=>(t[n.name]=ht(e,n),t)),{}):{};if(t.info===d.u.Enum)return Array.isArray(t.sub)?{[t.sub[0].name]:ht(e,t.sub[0])}:{};const n=[d.u.Compact,d.u.Option].includes(t.info)?t.sub.type:t.type;switch(n){case"AccountIndex":case"Balance":case"BalanceOf":case"BlockNumber":case"Compact":case"Gas":case"Index":case"Nonce":case"ParaId":case"PropIndex":case"ProposalIndex":case"ReferendumIndex":case"i8":case"i16":case"i32":case"i64":case"i128":case"u8":case"u16":case"u32":case"u64":case"u128":case"VoteIndex":case"Moment":return dt.nw;case"bool":return!1;case"Bytes":case"AccountId":case"AccountId20":case"AccountId32":case"AccountIdOf":case"Address":case"Call":case"CandidateReceipt":case"Digest":case"Header":case"KeyValue":case"LookupSource":case"MisbehaviorReport":case"Proposal":case"RuntimeCall":case"Signature":case"SessionKey":case"StorageKey":case"ValidatorId":return;case"String":case"Text":case"Raw":case"Keys":return"";case"Vote":return-1;case"VoteThreshold":return 0;case"BlockHash":case"CodeHash":case"Hash":case"H256":return e.createType("H256");case"H512":return e.createType("H512");case"H160":return e.createType("H160");case"Extrinsic":return e.createType("Raw");case"Null":return null;default:{let a=null;try{const t=e.createType(n),a=(0,l.s)(t.toRawType());if((0,m.H)(t))return dt.nw;if([d.u.Struct].includes(a.info))return;if([d.u.Enum,d.u.Tuple].includes(a.info))return ht(e,a)}catch(e){a=e.message}return mt.includes(n)||(mt.push(n),a&&console.error(`params: initValue: ${a}`),console.info(`params: initValue: No default value for type ${n} from ${JSON.stringify(t)}, using defaults`)),"0x"}}}function pt([{name:e,type:t}],n){return{name:`${n}: ${e||t.type}`,type:t}}function gt(e,t,n){if(t.length===n)return t;const a=[];for(let t=0;t<n;t++)a.push(pt(e,t));return a}function ft({value:e}){return Array.isArray(e)?e.map((e=>(0,u.o)(e)||(0,u.o)(e.isValid)?{isValid:!(0,u.o)(e),value:e}:e)):[]}function bt({className:e="",defaultValue:t,isDisabled:n=!1,label:s,onChange:r,overrides:o,registry:l,type:c,withLabel:d}){const{t:m}=M(),h=Ae(l,c),[p,g]=(0,a.useState)((()=>ft(t))),[f,v]=(0,a.useState)((()=>p.length)),[x,A]=(0,a.useState)((()=>gt(h,[],f)));(0,a.useEffect)((()=>{h.length&&A((e=>gt(h,e,n?(t.value||[]).length:f)))}),[f,t,n,h]),(0,a.useEffect)((()=>{!n&&h.length&&g((e=>{if(e.length===f)return e;for(;e.length<f;){const t=ht(l,h[0].type);e.push({isValid:!(0,u.o)(t),value:t})}return e.slice(0,f)}))}),[f,t,h,n,l]),(0,a.useEffect)((()=>{r&&r({isValid:p.reduce(((e,{isValid:t})=>e&&t),!0),value:p.map((({value:e})=>e))})}),[p,r]);const w=(0,a.useCallback)((()=>v((e=>e+1))),[]),y=(0,a.useCallback)((()=>v((e=>e-1))),[]);return(0,b.jsxs)(xe,{className:e,isOuter:!0,label:s,withLabel:d,children:[!n&&(0,b.jsxs)("div",{className:"ui--Param-Vector-buttons",children:[(0,b.jsx)(i.zx,{icon:"plus",label:m("Add item"),onClick:w}),(0,b.jsx)(i.zx,{icon:"minus",isDisabled:0===p.length,label:m("Remove item"),onClick:y})]}),(0,b.jsx)(Mt,{isDisabled:n,onChange:g,overrides:o,params:x,registry:l,values:p})]})}const vt=a.memo(bt);var xt=n(65581);function At({className:e="",defaultValue:t,isDisabled:n=!1,label:s,onChange:i,overrides:r,registry:o,type:l,withLabel:c}){const d=Ae(o,l),[m]=(0,a.useState)((()=>gt(d,[],d[0].length||1))),[h,p]=(0,a.useState)((()=>function(e){return e.value instanceof xt.$?e.value.map((e=>({isValid:!0,value:e}))):ft(e)}(t)));return(0,a.useEffect)((()=>{!n&&d.length&&p((e=>{const t=d[0].length||1;if(e.length===t)return e;for(;e.length<t;){const t=ht(o,d[0].type);e.push({isValid:!(0,u.o)(t),value:t})}return e.slice(0,t)}))}),[d,n,o]),(0,a.useEffect)((()=>{i&&i({isValid:h.reduce(((e,{isValid:t})=>e&&t),!0),value:h.map((({value:e})=>e))})}),[h,i]),(0,b.jsx)(xe,{className:e,isOuter:!0,label:s,withLabel:c,children:(0,b.jsx)(Mt,{isDisabled:n,onChange:p,overrides:r,params:m,registry:o,values:h})})}const wt=a.memo(At);var yt=n(70447);const jt={aye:!0,conviction:0};function kt({className:e="",defaultValue:{value:t},isDisabled:n,isError:s,onChange:r,withLabel:o}){const{t:l}=M(),[c,u]=(0,a.useState)(jt);(0,a.useEffect)((()=>{r&&r({isValid:!0,value:c})}),[r,c]);const d=(0,a.useCallback)((e=>u((({conviction:t})=>({aye:e,conviction:t})))),[]),h=(0,a.useCallback)((e=>u((({aye:t})=>({aye:t,conviction:e})))),[]),g=(0,a.useRef)([{text:l("Nay"),value:!1},{text:l("Aye"),value:!0}]),f=(0,a.useRef)([{text:l("None"),value:0},{text:l("Locked1x"),value:1},{text:l("Locked2x"),value:2},{text:l("Locked3x"),value:3},{text:l("Locked4x"),value:4},{text:l("Locked5x"),value:5},{text:l("Locked6x"),value:6}]),v=(0,m.H)(t)?0!==t.toNumber():t instanceof yt.P?t.isAye:0!==t,x=t instanceof yt.P?t.conviction.index:0;return(0,b.jsxs)(p.Z,{className:e,children:[(0,b.jsx)(i.Lt,{className:"full",defaultValue:v,isDisabled:n,isError:s,label:l("aye: bool"),onChange:d,options:g.current,withLabel:o}),(0,b.jsx)(i.Lt,{className:"full",defaultValue:x,isDisabled:n,isError:s,label:l("conviction: Conviction"),onChange:h,options:f.current,withLabel:o})]})}const Nt=a.memo(kt);var Ct=n(33661);const Et=[{text:"Super majority approval",value:0},{text:"Super majority rejection",value:1},{text:"Simple majority",value:2}];function St({className:e="",defaultValue:{value:t},isDisabled:n,isError:s,label:r,onChange:o,withLabel:l}){const c=(0,a.useCallback)((e=>o&&o({isValid:!0,value:e})),[o]),u=(0,a.useMemo)((()=>(0,Ct.m)(t.toNumber)?t.toNumber():(0,N.G)(t).toNumber()),[t]);return(0,b.jsx)(p.Z,{className:e,children:(0,b.jsx)(i.Lt,{className:"full",defaultValue:u,isDisabled:n,isError:s,label:r,onChange:c,options:Et,withLabel:l})})}Et.reduce(((e,{text:t,value:n})=>(e[n]=t,e)),{});const It=a.memo(St),Dt=["AccountId","AccountId20","AccountId32","AccountIndex","Address","Balance","BalanceOf","Vec<KeyValue>"],Bt=["DispatchError","SpRuntimeDispatchError"],Lt=[{c:j,t:["AccountId","Address","LookupSource","MultiAddress"]},{c:E,t:["AccountIndex","i8","i16","i32","i64","i128","u8","u16","u32","u64","u128","u256"]},{c:S.Z,t:["Amount","Balance","BalanceOf"]},{c:U,t:["bool"]},{c:re,t:["Bytes","Vec<u8>"]},{c:pe,t:["Call","Proposal","RuntimeCall"]},{c:ke,t:["PalletAllianceCid"]},{c:Ee,t:["Code"]},{c:Ie,t:Bt},{c:Be,t:["DispatchResult","Result<Null, SpRuntimeDispatchError>"]},{c:it,t:["Raw","RuntimeSessionKeys","Keys"]},{c:A,t:["Enum"]},{c:Pe,t:["Hash","H256"]},{c:$e,t:["H160"]},{c:Te,t:["H512"]},{c:He,t:["KeyValue"]},{c:Oe,t:["Vec<KeyValue>"]},{c:Qe,t:["Moment","MomentOf"]},{c:Ge,t:["Null"]},{c:Ye,t:["OpaqueCall"]},{c:at,t:["Option"]},{c:ot,t:["String","Text"]},{c:ye,t:["Struct"]},{c:ut,t:["Tuple"]},{c:vt,t:["Vec"]},{c:wt,t:["VecFixed"]},{c:Nt,t:["Vote"]},{c:It,t:["VoteThreshold"]},{c:me,t:["Unknown"]}].reduce(((e,{c:t,t:n})=>(n.forEach((n=>{e[n]=t})),e)),{}),$t=[];function Vt({displayName:e,info:t,lookupName:n,sub:a,type:s}){if(e&&Dt.includes(e))return e;if(s.endsWith("RuntimeSessionKeys"))return"RuntimeSessionKeys";const i=n||s;switch(t){case d.u.Compact:return a.type;case d.u.Option:return"Option";case d.u.Enum:return"Enum";case d.u.Result:{const[,e]=a;return Bt.includes(e.lookupName||e.type)?"DispatchResult":i}case d.u.Struct:return"Struct";case d.u.Tuple:return Lt[s]===j?s:"Tuple";case d.u.Vec:return"Vec<u8>"===s?"Bytes":["Vec<KeyValue>"].includes(s)?"Vec<KeyValue>":"Vec";case d.u.VecFixed:return"u8"===a.type?s:"VecFixed";default:return i}}function Pt({className:e="",defaultValue:t,isDisabled:n,isError:s,isOptional:i,name:r,onChange:o,onEnter:h,onEscape:p,overrides:g,registry:f,type:v}){const x=(0,a.useMemo)((()=>function(e,t,n={}){if(["AccountId20","AccountId32"].includes(t.type)){const n=`AccountId${e.createType("AccountId").length}`;if(t.type!==n)return"AccountId20"===t.type?P:T}const a=e=>e?n[e]||Lt[e]:null,s=Vt(t);let i=a(t.lookupName)||a(t.type)||a(s);if(!i){try{const t=e.createType(s),n=(0,l.s)(t.toRawType());if(i=a(n.lookupName||n.type)||a(Vt(n)),i)return i;if((0,m.H)(t))return E}catch(e){console.error(`params: findComponent: ${e.message}`)}$t.includes(s)||($t.push(s),console.info(`params: findComponent: No pre-defined component for type ${s} from ${d.u[t.info]}: ${JSON.stringify(t)}`))}return i||me}(f,v,g)),[f,v,g]),A=(0,a.useMemo)((()=>{const e=(0,c.RH)(f,f.isLookupType(v.lookupName||v.type)?(0,l.s)(f.createType(v.type).toRawType()):v).replace(/"/g,"").replace(/\\/g,"").replace(/:Null/g,"").replace(/:/g,": ").replace(/,/g,", ").replace(/^{_alias: {.*}, /,"{");return`${(0,u.o)(r)?"":`${r}: `}${e}${v.typeName&&!e.includes(v.typeName)?` (${v.typeName})`:""}`}),[r,f,v]);return x?i?(0,b.jsx)(ue,{defaultValue:t,isOptional:!0,label:"None"}):(0,b.jsx)(x,{className:`${e} ui--Param`,defaultValue:t,isDisabled:n,isError:s,label:A,name:r,onChange:o,onEnter:h,onEscape:p,overrides:g,registry:f,type:v},`${r||"unknown"}:${A}`):null}const Zt=a.memo(Pt);function Tt({defaultValue:e,index:t,isDisabled:n,isError:s,name:i,onChange:r,onEnter:o,onEscape:l,overrides:c,registry:u,type:d}){const m=(0,a.useCallback)((e=>r(t,e)),[t,r]);return(0,b.jsx)("div",{className:"ui--Param-composite",children:(0,b.jsx)(Zt,{defaultValue:e,isDisabled:n,isError:s,name:i,onChange:m,onEnter:o,onEscape:l,overrides:c,registry:u,type:d},`input:${t}`)})}const zt=a.memo(Tt);class Ft extends a.PureComponent{state={params:null};static getDerivedStateFromProps({isDisabled:e,params:t,registry:n=s.api.registry,values:a},i){return e||(0,r.P)(i.params)===(0,r.P)(t)?null:{params:t,values:t.reduce(((e,t,s)=>(e.push(a&&a[s]?a[s]:function(e,t){const n=ht(e,t.type);return{isValid:!(0,u.o)(n),value:n}}(n,t)),e)),[])}}componentDidMount(){this.componentDidUpdate(null,{})}componentDidUpdate(e,t){const{isDisabled:n}=this.props,{values:a}=this.state;n||(0,r.P)(t.values)===(0,r.P)(a)||this.triggerUpdate()}render(){const{children:e,className:t="",isDisabled:n,isError:a,onEnter:l,onEscape:c,overrides:u,params:d,registry:m=s.api.registry,withBorder:h=!0,withExpander:p}=this.props,{values:g=this.props.values}=this.state;return g&&g.length?(0,b.jsx)(o.Z,{className:t,withBorder:h,withExpander:p,children:(0,b.jsx)(i.SV,{onError:this.onRenderError,children:(0,b.jsxs)("div",{className:"ui--Params-Content",children:[g&&d.map((({name:e,type:t},s)=>(0,b.jsx)(zt,{defaultValue:g[s],index:s,isDisabled:n,isError:a,name:e,onChange:this.onChangeParam,onEnter:l,onEscape:c,overrides:u,registry:m,type:t},`${e||""}:${t.type.toString()}:${s}:${n?(0,r.P)(g[s]):""}`))),e]})})}):null}onChangeParam=(e,t)=>{const{isDisabled:n}=this.props;if(n)return;const{isValid:a=!1,value:s}=t;this.setState((t=>({values:(t.values||[]).map(((t,n)=>n!==e?t:{isValid:a,value:s}))})),this.triggerUpdate)};triggerUpdate=()=>{const{isDisabled:e,onChange:t}=this.props,{values:n}=this.state;!e&&n&&t&&t(n)};onRenderError=()=>{const{onError:e}=this.props;e&&e()}}const Mt=H(Ft)},8260:(e,t,n)=>{n.d(t,{c:()=>r,h:()=>i});var a=n(33410),s=n(55858);function i(e){try{const{code:t,multihash:{code:n,digest:i},version:r}=a.k0.parse(e);return{codec:t,hash:{code:n,digest:(0,s.c)(i)},version:r}}catch(t){return console.error(`fromIpfsCid: ${t.message}::`,e),null}}function r(e){try{const{codec:t,hash_:{code:n,digest:s},version:i}=e,r=s.toU8a(!0),o=a.PP.encodingLength(n.toNumber()),l=a.PP.encodingLength(r.length),c=new Uint8Array(o+l+r.length);return a.PP.encodeTo(n.toNumber(),c,0),a.PP.encodeTo(r.length,c,o),c.set(r,o+l),a.k0.create(i.index,t.toNumber(),a.uR.decode(c)).toString()}catch(t){return console.error(`toIpfsCid: ${t.message}::`,e.toHuman()),null}}},6847:(e,t,n)=>{n.d(t,{Z:()=>p,k:()=>h}),n(2784);var a=n(49754),s=n(37602),i=n(33661),r=n(11147),o=n(17751),l=n(1346),c=n(55858),u=n(52322);function d({className:e="",key:t},...n){return(0,u.jsx)("div",{className:`${e} ui--Param-text`,children:n},t)}function m(e){return(0,i.m)(e.toHuman)?e.toHuman():Array.isArray(e)?e.map((e=>m(e))):e.toString()}function h(e){return(0,r.P)(e,2).replace(/,\n/g,"\n").replace(/"/g,"").replace(/\\/g,"").replace(/\],\[/g,"],\n[")}function p(e,t){return(0,o.F)(t)||(0,l.o)(t)?d({},"<unknown>"):d({},["Bytes","Raw","Option<Keys>","Keys"].includes(e)&&(0,i.m)(t.toU8a)?(0,c.c)(t.toU8a(!0)):"Vec<(ValidatorId,Keys)>"===e?h((n=t,JSON.stringify(n.map((([e,t])=>[e.toString(),t.toHex()]))))):t instanceof a.N?t.isEmpty?"<empty>":t.toString():t instanceof s.W&&t.isNone?"<none>":h(m(t)));var n}},49753:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92529),i=n(36856),r=n(76277),o=n(52322);function l({children:e,className:t="",label:n,params:a}){var l;const{api:c}=(0,s.h)(),u=(0,i.W7)(null==(l=c.derive.balances)?void 0:l.all,[a]);return(0,o.jsx)(r.Z,{className:t,label:n,value:null==u?void 0:u.availableBalance,children:e})}const c=a.memo(l)},31832:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92529),i=n(36856),r=n(76277),o=n(52322);function l({children:e,className:t="",label:n,params:a}){var l;const{api:c}=(0,s.h)(),u=(0,i.W7)(null==(l=c.derive.balances)?void 0:l.all,[a]);return(0,o.jsx)(r.Z,{className:t,label:n,value:null==u?void 0:u.freeBalance,children:e})}const c=a.memo(l)},75034:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92529),i=n(36856),r=n(14681),o=n(52322);function l({children:e,className:t="",label:n}){const{api:a}=(0,s.h)(),l=(0,i.W7)(a.derive.chain.bestNumberFinalized);return(0,o.jsxs)("div",{className:`${t} ${l?"":"--tmp"}`,children:[n||"",(0,o.jsx)("span",{className:"--digits",children:(0,r.u)(l||1234)}),e]})}const c=a.memo(l)},92698:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92529),i=n(36856),r=n(14681),o=n(52322);function l({children:e,className:t="",isFinalized:n,label:a,withPound:l}){const{api:c,isApiReady:u}=(0,s.h)(),d=(0,i.W7)(u&&(n?c.derive.chain.bestNumberFinalized:c.derive.chain.bestNumber));return(0,o.jsxs)("div",{className:`${t} ${d?"":"--tmp"}`,children:[a||"",l&&"#",(0,o.jsx)("span",{className:"--digits",children:(0,r.u)(d||1234)}),e]})}const c=a.memo(l)},67738:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(14028),i=n(65308),r=n(52322);function o({api:e,children:t,className:n="",isInline:a,label:s,value:o}){const[,c]=(0,i.h)(o,e);return!o||o.isZero()?null:(0,r.jsxs)(l,{className:`${n} ui--BlockToTime ${a?"isInline":""}`,children:[s||"",c.split(" ").map(((e,t)=>(0,r.jsx)("span",{className:t%2?"timeUnits":void 0,children:e},t))),t]})}const l=s.z.div`
  &.isInline {
    display: inline-block;
  }

  span+span {
    padding-left: 0.25em;
  }

  span.timeUnits {
    font-size: var(--font-percent-tiny);
  }
`,c=a.memo(o)},38434:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(2784),s=n(92529),i=n(19582),r=n(52322);function o({children:e,className:t="",label:n}){const{t:a}=(0,i.$)(),{systemChain:o}=(0,s.h)();return(0,r.jsxs)("div",{className:t,children:[n||"",o||a("Unknown"),e]})}const l=a.memo(o)},34351:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(2784),s=n(14028),i=n(12372),r=n(52322);const o=new Map;let l=Date.now(),c=0;function u(e,t="s",n=!1){const[a,s]=e.toFixed(1).split(".");return n?(0,r.jsxs)(r.Fragment,{children:[a,".",s," ",(0,r.jsx)("span",{className:"timeUnit",children:t})]}):(0,r.jsxs)(r.Fragment,{children:[a," ",(0,r.jsx)("span",{className:"timeUnit",children:t})]})}function d(e=0,t=0){const n=(t&&t.getTime?t.getTime():(0,i.G)(t).toNumber())||0;if(!e||!n)return u(0,"s",!0);const a=Math.max(Math.abs(e-n),0)/1e3;return a<60?u(a,"s",a<15):a<3600?u(a/60,"min"):u(a/3600,"hr")}function m({children:e,className:t="",value:n}){const[s,i]=(0,a.useState)(l);return(0,a.useEffect)((()=>{const e=c++;return o.set(e,i),()=>{o.delete(e)}}),[]),(0,r.jsxs)(h,{className:`${t} ui--Elapsed --digits`,children:[d(s,n),e]})}!function e(){l=Date.now();for(const e of o.values())e(l);setTimeout(e,100)}();const h=s.z.div`
  .timeUnit {
    font-size: var(--font-percent-tiny);
  }
`,p=a.memo(m)},76277:(e,t,n)=>{n.d(t,{Z:()=>g});var a=n(2784),s=n(14028),i=n(92529),r=n(92730),o=n(54371),l=n(19582),c=n(52322);function u(e,t,n,a="",s=!1){return(0,c.jsxs)(c.Fragment,{children:[`${e}${s?"":"."}`,!s&&(0,c.jsx)("span",{className:"ui--FormatBalance-postfix",children:`0000${t||""}`.slice(-4)}),(0,c.jsxs)("span",{className:"ui--FormatBalance-unit",children:[" ",n]}),a]})}function d(e,t,n){const[a,s]=e.split("."),[i,r]=s.split(" ");return u(a,i,r,t,n)}function m(e,[t,n],a=!0,s,i,o){const[l,d]=(0,r.a)(e,{decimals:t,forceUnit:"-",withSi:!1}).split("."),m=i||s&&l.length>=4,h=a?n:"";if(l.length>7){const[n,a]=(0,r.a)(e,{decimals:t,withUnit:!1}).split("."),s=a.substring(0,4),i=a.substring(4);return(0,c.jsxs)(c.Fragment,{children:[n,".",(0,c.jsx)("span",{className:"ui--FormatBalance-postfix",children:s}),(0,c.jsxs)("span",{className:"ui--FormatBalance-unit",children:[i,i?h:` ${h}`]}),o||""]})}return u(l,d,h,o,m)}function h({children:e,className:t="",format:n,formatIndex:s,isShort:r,label:u,labelPost:h,value:g,valueFormatted:f,withCurrency:b,withSi:v}){const{t:x}=(0,l.$)(),{api:A}=(0,i.h)(),w=(0,a.useMemo)((()=>n||function(e,t=0){const n=e.chainDecimals,a=e.chainTokens;return[t<n.length?n[t]:n[0],t<a.length?a[t]:a[1]]}(A.registry,s)),[A,n,s]);return(0,c.jsxs)(p,{className:`${t} ui--FormatBalance`,children:[u?(0,c.jsxs)(c.Fragment,{children:[u," "]}):"",(0,c.jsx)("span",{className:"ui--FormatBalance-value --digits","data-testid":"balance-summary",children:f?d(f,h,r):g?"all"===g?(0,c.jsxs)(c.Fragment,{children:[x("everything"),h||""]}):m(g,w,b,v,r,h):(0,o.H)(h)?`-${h.toString()}`:h}),e]})}const p=s.z.span`
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
`,g=a.memo(h)},88795:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(2784),s=n(92529),i=n(52322);function r({children:e,className:t="",label:n}){const{systemName:a}=(0,s.h)();return(0,i.jsxs)("div",{className:t,children:[n||"",a,e]})}const o=a.memo(r)},44364:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(2784),s=n(92529),i=n(52322);function r({children:e,className:t="",label:n}){const{systemVersion:a}=(0,s.h)(),r=a.split("-")[0];return(0,i.jsxs)("div",{className:t,children:[n||"",r,e]})}const o=a.memo(r)},6152:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(2784),s=n(92529),i=n(36856),r=n(95292),o=n(67738),l=n(52322);function c({children:e,className:t,isInline:n,label:c,value:u}){const{api:d}=(0,s.h)(),m=(0,i.W7)(d.derive.session.progress),h=(0,a.useMemo)((()=>m&&u&&m.currentIndex.lt(u)?u.sub(m.currentIndex).imul(m.sessionLength).isub(m.sessionProgress):r.nw),[m,u]);return(0,l.jsx)(o.Z,{className:t,isInline:n,label:c,value:h,children:e})}const u=a.memo(c)},63721:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92529),i=n(36856),r=n(34351),o=n(52322);function l({children:e,className:t="",label:n,value:l}){var c;const{api:u}=(0,s.h)(),d=(0,i.W7)(!l&&(null==(c=u.query.timestamp)?void 0:c.now)),[m,h]=(0,a.useMemo)((()=>[l||d,!(!l&&!d)]),[d,l]);return(0,o.jsxs)("div",{className:`${t} ${h?"":"--tmp"}`,children:[n||"",(0,o.jsx)(r.Z,{value:h?m:Date.now()}),e]})}const c=a.memo(l)},85557:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92529),i=n(36856),r=n(76277),o=n(52322);function l({children:e,className:t="",label:n}){var a;const{api:l}=(0,s.h)(),c=(0,i.W7)(null==(a=l.query.balances)?void 0:a.inactiveIssuance);return(0,o.jsxs)("div",{className:t,children:[n||"",(0,o.jsx)(r.Z,{className:c?"":"--tmp",value:c||1,withSi:!0}),e]})}const c=a.memo(l)},1735:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(2784),s=n(92529),i=n(36856),r=n(76277),o=n(52322);function l({children:e,className:t="",label:n}){var a;const{api:l}=(0,s.h)(),c=(0,i.W7)(null==(a=l.query.balances)?void 0:a.totalIssuance);return(0,o.jsxs)("div",{className:t,children:[n||"",(0,o.jsx)(r.Z,{className:c?"":"--tmp",value:c||1,withSi:!0}),e]})}const c=a.memo(l)},19582:(e,t,n)=>{n.d(t,{$:()=>s});var a=n(61349);function s(){return(0,a.$G)("react-query")}(0,a.Zh)(["react-query"])},72339:(e,t,n)=>{n.d(t,{Z:()=>ve});var a=n(2784),s=n(61397),i=n(92529),r=n(54782),o=n(48731),l=n(33661),c=n(4615),u=n(61349);function d(){return(0,u.$G)("react-signer")}(0,u.Zh)(["react-signer"]);var m=n(345),h=n(37095),p=n(7840),g=n(69187),f=n(17965),b=n(29659),v=n(13328),x=n(96464),A=n(95292);const w=()=>{},y={accountOffset:0,addressOffset:0,isHardware:!1,isMultisig:!1,isProxied:!1,isQr:!1,isUnlockable:!1,threshold:0,who:[]},j={};function k(e){if(!e)return y;let t;try{t=g.Nn.decodeAddress(e)}catch(e){return console.error(e),y}const n=g.Nn.getPair(t),{isExternal:a,isHardware:s,isInjected:i,isMultisig:r,isProxied:o}=n.meta,l=!a&&!s&&!i;if(l){const e=j[n.address];e&&Date.now()>e&&!n.isLocked&&(n.lock(),j[n.address]=0)}return{accountOffset:n.meta.accountOffset||0,addressOffset:n.meta.addressOffset||0,hardwareType:n.meta.hardwareType,isHardware:!!s,isMultisig:!!r,isProxied:!!o,isQr:!(!a||r||o||s||i),isUnlockable:l&&n.isLocked,threshold:n.meta.threshold||0,who:(n.meta.who||[]).map(N)}}function N(e){return g.Nn.encodeAddress(g.Nn.decodeAddress(e))}function C(e,t,{id:n,txFailedCb:a=w,txSuccessCb:s=w,txUpdateCb:i=w},r){return o=>{if(!o||!o.status)return;const l=o.status.type.toLowerCase();console.log(`${e}: status :: ${JSON.stringify(o)}`),t(n,l,o),i(o),o.status.isFinalized||o.status.isInBlock?o.events.filter((({event:{section:e}})=>"system"===e)).forEach((({event:{method:e}})=>{"ExtrinsicFailed"===e?a(o):"ExtrinsicSuccess"===e&&s(o)})):o.isError&&a(o),o.isCompleted&&r()}}var E=n(52322);function S({address:e,className:t,error:n,onChange:i,onEnter:r,tabIndex:o}){const{t:l}=d(),[c,u]=(0,a.useState)(""),[m,h]=(0,a.useState)(!1),p=(0,a.useMemo)((()=>function(e){try{return g.Nn.getPair(e)}catch(e){return null}}(e)),[e]);return(0,a.useEffect)((()=>{i(c,m)}),[i,m,c]),p&&p.isLocked&&!p.meta.isInjected?(0,E.jsx)(I,{className:t,hint:l("Unlock the sending account to allow signing of this transaction."),children:(0,E.jsx)(s.ro,{autoFocus:!0,isError:!!n,label:l("unlock account with password"),labelExtra:(0,E.jsx)(s.ZD,{label:l("unlock for {{expiry}} min",{replace:{expiry:15}}),onChange:h,value:m}),onChange:u,onEnter:r,tabIndex:o,value:c})}):null}const I=(0,s.zo)(s.u_.Columns)`
  .errorLabel {
    margin-right: 1rem;
    color: #9f3a38 !important;
  }

  .ui--Toggle {
    bottom: 1.1rem;
  }
`,D=a.memo(S);function B({currentItem:e,onChange:t,onEnter:n,passwordError:r,requestAddress:o}){const{t:c}=d(),{api:u}=(0,i.h)(),{allAccounts:m}=(0,v.x)(),h=(0,x.X)(),[p,g]=(0,a.useState)(null),[f,b]=(0,a.useState)(null),[w,y]=(0,a.useState)(!1),[j,N]=(0,a.useState)(!0),[C,S]=(0,a.useState)(null),[I,B]=(0,a.useState)(null),[{isUnlockCached:L,signPassword:$},V]=(0,a.useState)((()=>({isUnlockCached:!1,signPassword:""}))),[P,Z]=(0,a.useMemo)((()=>{const e=C&&p||j&&I&&f||o;try{return[e,k(e)]}catch{return[e,{}]}}),[p,f,j,C,I,o]),T=(0,a.useCallback)(((e,t)=>V({isUnlockCached:t,signPassword:e})),[]);return(0,a.useEffect)((()=>{!I&&b(null)}),[I]),(0,a.useEffect)((()=>{B(null),e.extrinsic&&async function(e,t,n,a){var s;if((0,l.m)(null==(s=e.query.proxy)?void 0:s.proxies)){const{isProxied:s}=k(n),[i]=await e.query.proxy.proxies(n),r=3===e.tx.proxy.addProxy.meta.args.length?i.map((({delay:e,delegate:t,proxyType:n})=>[t.toString(),e,n])):i.map((([e,t])=>[e.toString(),A.nw,t])),o=function(e,t,n){const{method:a,section:s}=function(e){try{const{method:t,section:n}=e.registry.findMetaCall(e.callIndex);return{method:t,section:n}}catch(e){return{method:"unknown",section:"unknown"}}}(t);return n.filter((([t,n,a])=>!(!e.includes(t)||!n.isZero()))).map((([e])=>e))}(t,a,r);if(o.length)return{address:n,isProxied:s,proxies:r,proxiesFilter:o}}return null}(u,m,o,e.extrinsic).then((e=>h.current&&B(e))).catch(console.error)}),[m,u,e,h,o]),(0,a.useEffect)((()=>{S(null),e.extrinsic&&k(f||o).isMultisig&&async function(e,t,n,a){var s;const i=e.tx.multisig?"multisig":"utility";if((0,l.m)(null==(s=e.query[i])?void 0:s.multisigs)){const s=n||t,{threshold:r,who:o}=k(s),l=(n?e.tx.proxy.proxy(t||"",null,a):a).method.hash,c=(await e.query[i].multisigs(s,l)).unwrapOr(null);return c?{address:s,isMultiCall:c.approvals.length+1>=r,who:o,whoFilter:o.filter((e=>!c.approvals.some((t=>t.eq(e)))))}:{address:s,isMultiCall:!1,who:o,whoFilter:o}}return null}(u,o,f,e.extrinsic).then((e=>{h.current&&(S(e),y((null==e?void 0:e.isMultiCall)||!1))})).catch(console.error)}),[f,u,e,h,o]),(0,a.useEffect)((()=>{t({isMultiCall:w,isUnlockCached:L,multiRoot:C?C.address:null,proxyRoot:I&&j?I.address:null,signAddress:P,signPassword:$})}),[j,w,L,p,C,t,f,I,P,$]),(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(s.u_.Columns,{hint:c("The sending account that will be used to send this transaction. Any applicable fees will be paid by this account."),children:(0,E.jsx)(s.rp,{className:"full",defaultValue:o,isDisabled:!0,isInput:!0,label:c("sending from my account"),withLabel:!0})}),I&&j&&(0,E.jsx)(s.u_.Columns,{hint:c("The proxy is one of the allowed proxies on the account, as set and filtered by the transaction type."),children:(0,E.jsx)(s.rp,{filter:I.proxiesFilter,label:c("proxy account"),onChange:b,type:"account"})}),C&&(0,E.jsx)(s.u_.Columns,{hint:c("The signatory is one of the allowed accounts on the multisig, making a recorded approval for the transaction."),children:(0,E.jsx)(s.rp,{filter:C.whoFilter,label:c("multisig signatory"),onChange:g,type:"account"})}),P&&!e.isUnsigned&&Z.isUnlockable&&(0,E.jsx)(D,{address:P,error:r,onChange:T,onEnter:n}),r&&(0,E.jsx)(s.u_.Columns,{children:(0,E.jsx)(s.oy,{content:r})}),I&&(0,E.jsx)(s.u_.Columns,{hint:c("This could either be an approval for the hash or with full call details. The call as last approval triggers execution."),children:(0,E.jsx)(s.ZD,{className:"tipToggle",isDisabled:I.isProxied,label:c(j?"Use a proxy for this call":"Don't use a proxy for this call"),onChange:N,value:j})}),C&&(0,E.jsx)(s.u_.Columns,{hint:c("This could either be an approval for the hash or with full call details. The call as last approval triggers execution."),children:(0,E.jsx)(s.ZD,{className:"tipToggle",label:c(w?"Multisig message with call (for final approval)":"Multisig approval with hash (non-final approval)"),onChange:y,value:w})})]})}const L=a.memo(B);var $=n(74076);function V({address:e,className:t,genesisHash:n,isHashed:i,onSignature:r,payload:o}){const{t:l}=d(),[c,u]=(0,a.useState)(null),m=(0,a.useCallback)((e=>{if((0,$.vq)(e.signature))r(e);else{const t=e.signature;u(l('Non-signature, non-hex data received from QR. Data contains "{{sample}}" instead of a hex-only signature. Please present the correct signature generated from the QR presented for submission.',{replace:{sample:t.length>47?`${t.slice(0,24)}…${t.slice(-22)}`:t}}))}}),[r,l]);return e?(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)(P,{className:t,children:[(0,E.jsx)(s.P0.Column,{children:(0,E.jsx)("div",{className:"qrDisplay",children:(0,E.jsx)(s.iH,{address:e,cmd:i?1:2,genesisHash:n,payload:o})})}),(0,E.jsx)(s.P0.Column,{children:(0,E.jsx)("div",{className:"qrDisplay",children:(0,E.jsx)(s.lB,{onScan:m})})})]}),c&&(0,E.jsx)(s.oy,{className:"nomargin",content:c})]}):(0,E.jsx)(s.$j,{label:l("Preparing QR for signing")})}const P=(0,s.zo)(s.P0)`
  .qrDisplay {
    margin: 0 auto;
    max-width: 30rem;

    img {
      border: 1px solid white;
    }
  }
`,Z=a.memo(V);let T=0;class z{#a;#s;#i;#n;constructor(e,t,n,a){this.#a=n,this.#s=a,this.#i=t,this.#n=e}async signPayload(e){const t=this.#n.createType("ExtrinsicPayload",e,{version:e.version}),{signature:n}=await this.#i().sign(t.toU8a(!0),this.#a,this.#s);return{id:++T,signature:n}}}var F=n(34323);class M{#n;#r;constructor(e,t){this.#n=e,this.#r=t}async signPayload(e){return new Promise(((t,n)=>{const a=e.method.length>5e3,s=this.#n.createType("ExtrinsicPayload",e,{version:e.version}),i=a?(0,F.b)(s.toU8a(!0)):s.toU8a();this.#r({isQrHashed:a,qrAddress:e.address,qrPayload:i,qrReject:n,qrResolve:t})}))}}var H=n(33403);let R=0;class U{#o;#n;constructor(e,t){this.#o=t,this.#n=e}async signPayload(e){return new Promise((t=>{const n=this.#n.createType("ExtrinsicPayload",e,{version:e.version}).sign(this.#o);var a;a=this.#o,Date.now()>(j[a.address]||0)&&!a.isLocked&&a.lock(),t((0,H.Z)({id:++R},n))}))}}var q=n(48801),O=n.n(q);function W({address:e,onChange:t,signedTx:n}){const{api:r}=(0,i.h)(),[o,l]=(0,a.useState)((()=>new(O())(64))),[c,u]=(0,a.useState)(A.nw),{t:m}=d();(0,a.useEffect)((()=>{e&&r.derive.balances.account(e).then((({accountNonce:e})=>u(e))).catch(console.error)}),[e,r]),(0,a.useEffect)((()=>{t({era:o.toNumber(),nonce:c})}),[o,c,t]);const h=(0,a.useCallback)(((e=A.nw)=>l(e)),[]),p=(0,a.useCallback)(((e=A.nw)=>u(e)),[]);return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsxs)(s.u_.Columns,{hint:m("Override any applicable values for the specific signed output. These will be used to construct and display the signed transaction."),children:[(0,E.jsx)(s.Rn,{isDisabled:!!n,isZeroable:!0,label:m("Nonce"),labelExtra:m("Current account nonce: {{accountNonce}}",{replace:{accountNonce:c}}),onChange:p,value:c}),(0,E.jsx)(s.Rn,{isDisabled:!!n,isZeroable:!0,label:m("Lifetime (# of blocks)"),labelExtra:m("Set to 0 to make transaction immortal"),onChange:h,value:o})]}),!!n&&(0,E.jsx)(s.u_.Columns,{hint:m("The actual fully constructed signed output. This can be used for submission via other channels."),children:(0,E.jsx)(s.r_,{isFull:!0,isTrimmed:!0,label:m("Signed transaction"),value:n,withCopy:!0})})]})}const Q=a.memo(W);function K({className:e,onChange:t}){const{t:n}=d(),[i,r]=(0,a.useState)(),[o,l]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{t(o?i:A.nw)}),[t,o,i]),(0,E.jsxs)(s.u_.Columns,{className:e,hint:n("Adding an optional tip to the transaction could allow for higher priority, especially when the chain is busy."),children:[(0,E.jsx)(s.ZD,{className:"tipToggle",label:n(o?"Include an optional tip for faster processing":"Do not include a tip for the block author"),onChange:l,value:o}),o&&(0,E.jsx)(s.H,{isZeroable:!0,label:n("Tip (optional)"),onChange:r})]})}const G=a.memo(K);var J=n(36856),Y=n(92730);function X({accountId:e,className:t="",extrinsic:n,isHeader:r}){var o,l;const{t:c}=d(),{api:m}=(0,i.h)(),[h,p]=(0,a.useState)(null),g=(0,J.W7)(null==(o=m.derive.balances)?void 0:o.all,[e]),b=(0,x.X)();if((0,a.useEffect)((()=>{e&&n&&n.hasPaymentInfo&&(0,f.Y)((async()=>{try{const t=await n.paymentInfo(e);b.current&&p(t)}catch(e){console.error(e)}}))}),[m,e,n,b]),!h||!n)return null;const v=m.consts.balances&&!(null!=(l=m.tx.balances)&&l.transfer.is(n))&&(null==g?void 0:g.accountId.eq(e))&&(g.availableBalance.lte(h.partialFee)||g.freeBalance.sub(h.partialFee).lte(m.consts.balances.existentialDeposit));return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(s.xH,{className:t,isHeader:r,summary:(0,E.jsxs)(u.cC,{i18nKey:"feesForSubmission",children:["Fees of ",(0,E.jsx)("span",{className:"highlight",children:(0,Y.a)(h.partialFee,{withSiFull:!0})})," will be applied to the submission"]})}),v&&(0,E.jsx)(s.Pd,{content:c("The account does not have enough free funds (excluding locked/bonded/reserved) available to cover the transaction fees without dropping the balance below the account existential amount.")})]})}const _=a.memo(X);function ee({accountId:e,className:t,currentItem:{extrinsic:n,isUnsigned:a,payload:i},onError:r,tip:o}){const{t:l}=d();return n?(0,E.jsxs)(te,{className:t,hint:l("The details of the transaction including the type, the description (as available from the chain metadata) as well as any parameters and fee estimations (as available) for the specific type of call."),children:[(0,E.jsx)(s.Uv,{isHeader:!0,onError:r,value:n}),!a&&!i&&(0,E.jsx)(_,{accountId:e,className:"paymentInfo",extrinsic:n,isHeader:!0,tip:o})]}):null}const te=(0,s.zo)(s.u_.Columns)`
  .paymentInfo {
    margin-top: 0.5rem;
  }
`,ne=a.memo(ee),ae=()=>{},se={innerHash:null,innerTx:null};let ie=0;async function re(e,t,{isMultiCall:n,multiRoot:a,proxyRoot:s,signAddress:i}){let r=t.extrinsic;if(s&&(r=e.tx.proxy.proxy(s,null,r)),a){const t=e.tx.multisig?"multisig":"utility",[s,{weight:o}]=await Promise.all([e.query[t].multisigs(a,r.method.hash),r.paymentInfo(a)]);console.log("multisig max weight=",o.toString());const{threshold:l,who:c}=k(a),u=c.filter((e=>e!==i));let d=null;s.isSome&&(d=s.unwrap().when),r=n?5===e.tx[t].asMulti.meta.args.length?e.tx[t].asMulti(l,u,d,r.method.toHex(),o):6===e.tx[t].asMulti.meta.args.length?e.tx[t].asMulti(l,u,d,r.method.toHex(),!1,o):e.tx[t].asMulti(l,u,d,r.method):5===e.tx[t].approveAsMulti.meta.args.length?e.tx[t].approveAsMulti(l,u,d,r.method.hash,o):e.tx[t].approveAsMulti(l,u,d,r.method.hash)}return r}async function oe(e,t,n,a,s){const i=g.Nn.getPair(t),{meta:{accountOffset:r,addressOffset:l,isExternal:c,isHardware:u,isInjected:d,isProxied:h,source:p}}=i;if(u)return["signing",t,{...n,signer:new z(e.registry,a,r||0,l||0)}];if(c&&!h)return["qr",t,{...n,signer:new M(e.registry,s)}];if(d){const e=await(0,m.R0)(p);return(0,o.hu)(e,`Unable to find a signer for ${t}`),["signing",t,{...n,signer:e.signer}]}return(0,o.hu)((0,b.Q)(t,i.address),`Unable to retrieve keypair for ${t}`),["signing",t,{...n,signer:new U(e.registry,i)}]}function le(e){try{return k(e)}catch{return{}}}function ce({className:e,currentItem:t,isQueueSubmit:n,queueSize:o,requestAddress:l,setIsQueueSubmit:c}){const{t:u}=d(),{api:m}=(0,i.h)(),{getLedger:b}=(0,h.c)(),{queueSetTxStatus:v}=(0,r.L)(),[x,A]=(0,a.useState)((()=>le(l))),[w,y]=(0,a.useState)(null),[{isQrHashed:k,qrAddress:N,qrPayload:S,qrResolve:I},D]=(0,a.useState)((()=>({isQrHashed:!1,qrAddress:"",qrPayload:new Uint8Array}))),[B,$]=(0,a.useState)(!1),[V,P]=(0,p.O)(),[T,z]=(0,a.useState)(!0),[F,M]=(0,a.useState)(null),[H,R]=(0,a.useState)((()=>({isMultiCall:!1,isUnlockCached:!1,multiRoot:null,proxyRoot:null,signAddress:l,signPassword:""}))),[U,q]=(0,a.useState)({}),[O,W]=(0,a.useState)(null),[{innerHash:K,innerTx:J},Y]=(0,a.useState)(se),[X,_]=(0,a.useState)(),[ee]=(0,a.useState)(n);(0,a.useEffect)((()=>{A(le(H.signAddress)),M(null)}),[H]),(0,a.useEffect)((()=>{const e=t.extrinsic&&(H.proxyRoot?m.tx.proxy.proxy(H.proxyRoot,null,t.extrinsic):t.extrinsic).method;Y(e?{innerHash:e.hash.toHex(),innerTx:H.multiRoot?e.toHex():null}:se)}),[m,t,H]);const te=(0,a.useCallback)((({signature:e})=>I&&I({id:++ie,signature:e})),[I]),ce=(0,a.useCallback)((async()=>{let e=null;if(H.signAddress)if(x.isUnlockable)e=function({isUnlockCached:e,signAddress:t,signPassword:n}){let a;try{a=g.Nn.decodeAddress(t)}catch(e){return console.error(e),"unable to decode address"}const s=g.Nn.getPair(a);try{s.decodePkcs8(n),e&&function(e){j[e.address]=Date.now()+9e5}(s)}catch(e){return console.error(e),e.message}return null}(H);else if(x.isHardware)try{const e=b(),{address:t}=await e.getAddress(!1,x.accountOffset,x.addressOffset);console.log(`Signing with Ledger address ${t}`)}catch(t){console.error(t),e=u("Unable to connect to the Ledger, ensure support is enabled in settings and no other app is using it. {{error}}",{replace:{error:t.message}})}return M(e),!e}),[x,b,H,u]),de=(0,a.useCallback)(((e,t,n)=>{if(n.signAddress&&t.payload){const{id:a,payload:s,signerCb:i=ae}=t,r=g.Nn.getPair(n.signAddress);i(a,{id:a,...m.createType("ExtrinsicPayload",s,{version:s.version}).sign(r)}),e(a,"completed")}}),[m]),me=(0,a.useCallback)((async(e,t,n)=>{if(n.signAddress){const[a,[s,i,r]]=await Promise.all([re(m,t,n),oe(m,n.signAddress,{nonce:-1,tip:X},b,D)]);e(t.id,s),await async function(e,t,n,a,s){t.txStartCb&&t.txStartCb();try{await n.signAsync(a,s),console.info("sending",n.toHex()),e(t.id,"sending");const i=await n.send(C("signAndSend",e,t,(()=>{i()})))}catch(n){console.error("signAndSend: error:",n),e(t.id,"error",{},n),t.txFailedCb&&t.txFailedCb(n)}}(e,t,a,i,r)}}),[m,b,X]),he=(0,a.useCallback)((async(e,t,n)=>{if(n.signAddress){const[a,[,s,i]]=await Promise.all([re(m,t,n),oe(m,n.signAddress,{...U,tip:X},b,D)]);W(await async function(e,{id:t,txFailedCb:n=ae,txStartCb:a=ae},s,i,r){a();try{return await s.signAsync(i,r),s.toJSON()}catch(a){console.error("signAsync: error:",a),e(t,"error",void 0,a),n(a)}return null}(e,t,a,s,i))}}),[m,b,U,X]),pe=(0,a.useCallback)((()=>{$(!0),(0,f.Y)((()=>{const e=e=>{console.error(e),$(!1),y(e)};ce().then((n=>{n?T?t.payload?de(v,t,H):me(v,t,H).catch(e):he(v,t,H).catch(e):$(!1)})).catch((t=>{e(t)}))}))}),[me,de,he,ce,t,T,v,H]),ge=H.signAddress&&o>1&&T&&!(x.isHardware||x.isMultisig||x.isProxied||x.isQr||x.isUnlockable)&&!V;return!B&&ge&&ee?($(!0),setTimeout(pe,1e3),null):(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(ue,{className:e,children:(0,E.jsx)(s.SV,{error:w,onError:P,children:B&&x.isQr?(0,E.jsx)(Z,{address:N,genesisHash:m.genesisHash,isHashed:k,onSignature:te,payload:S}):(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(ne,{accountId:H.signAddress,currentItem:t,onError:P}),(0,E.jsx)(L,{currentItem:t,onChange:R,onEnter:pe,passwordError:F,requestAddress:l}),!t.payload&&(0,E.jsx)(G,{onChange:_}),!T&&(0,E.jsx)(Q,{address:H.signAddress,onChange:q,signedTx:O}),T&&!H.isMultiCall&&J&&(0,E.jsx)(s.u_.Columns,{hint:u("The full call data that can be supplied to a final call to multi approvals"),children:(0,E.jsx)(s.r_,{isDisabled:!0,isTrimmed:!0,label:u("multisig call data"),value:J,withCopy:!0})}),T&&K&&(0,E.jsx)(s.u_.Columns,{hint:u("The call hash as calculated for this transaction"),children:(0,E.jsx)(s.r_,{isDisabled:!0,isTrimmed:!0,label:u("call hash"),value:K,withCopy:!0})})]})})}),(0,E.jsxs)(s.u_.Actions,{children:[(0,E.jsx)(s.zx,{icon:x.isQr?"qrcode":"sign-in-alt",isBusy:B,isDisabled:!H.signAddress||V,label:x.isQr?u("Sign via Qr"):u(T?"Sign and Submit":"Sign (no submission)"),onClick:pe,tabIndex:2}),(0,E.jsxs)("div",{className:"signToggle",children:[!B&&(0,E.jsx)(s.ZD,{isDisabled:!!t.payload,label:u(T?"Sign and Submit":"Sign (no submission)"),onChange:z,value:T}),ge&&(0,E.jsx)(s.ZD,{label:n?u("Submit {{queueSize}} items",{replace:{queueSize:o}}):u("Submit individual"),onChange:c,value:n})]})]})]})}const ue=(0,s.zo)(s.u_.Content)`
  .tipToggle {
    width: 100%;
    text-align: right;
  }

  .ui--Checks {
    margin-top: 0.75rem;
  }
`,de=a.memo(ce);function me({className:e,currentItem:t}){const{t:n}=d(),{queueSetTxStatus:i}=(0,r.L)(),[o,l]=(0,p.O)(),c=(0,a.useCallback)((async()=>{t.extrinsic&&await async function(e,t,n){t.txStartCb&&t.txStartCb();try{const a=await n.send(C("send",e,t,(()=>{a()})))}catch(n){console.error("send: error:",n),e(t.id,"error",{},n),t.txFailedCb&&t.txFailedCb(null)}}(i,t,t.extrinsic)}),[t,i]);return(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(s.u_.Content,{className:e,children:(0,E.jsx)(s.SV,{onError:l,children:(0,E.jsx)(ne,{currentItem:t,onError:l})})}),(0,E.jsx)(s.u_.Actions,{children:(0,E.jsx)(s.zx,{icon:"sign-in-alt",isDisabled:o,label:n("Submit (no signature)"),onClick:c,tabIndex:2})})]})}const he=a.memo(me),pe=()=>{},ge=["queued","qr","signing"];function fe({children:e,className:t=""}){const{api:n}=(0,i.h)(),{t:s}=d(),{queueSetTxStatus:u,txqueue:m}=(0,r.L)(),[h,p]=(0,a.useState)(!1),{currentItem:g,isRpc:f,isVisible:b,queueSize:v,requestAddress:x}=(0,a.useMemo)((()=>function(e){const t=e.filter((({status:e})=>ge.includes(e))),n=t[0]||null;let a=!1,s=!1;return n&&("queued"!==n.status||n.extrinsic||n.payload?"signing"!==n.status&&(s=!0):a=!0),{currentItem:n,isRpc:a,isVisible:s,queueSize:t.length,requestAddress:n&&n.accountId||null}}(m)),[m]);(0,a.useEffect)((()=>{1===v&&p(!1)}),[v]),(0,a.useEffect)((()=>{f&&g&&async function(e,t,{id:n,rpc:a,values:s=[]}){if(a){t(n,"sending");const{error:i,result:r,status:u}=await async function(e,{method:t,section:n},a){try{const s=e.rpc;(0,o.hu)((0,l.m)(s[n]&&s[n][t]),`api.rpc.${n}.${t} does not exist`);const i=await s[n][t](...a);return console.log("submitRpc: result ::",(0,c.a)(i)),{result:i,status:"sent"}}catch(e){return console.error(e),{error:e,status:"error"}}}(e,a,s);t(n,u,r,i)}}(n,u,g).catch(console.error)}),[n,f,g,u]);const A=(0,a.useCallback)((()=>{if(g){const{id:e,signerCb:t=pe,txFailedCb:n=pe}=g;u(e,"cancelled"),t(e,null),n(null)}}),[g,u]);return(0,E.jsxs)(E.Fragment,{children:[e,g&&b&&(0,E.jsx)(be,{className:t,header:(0,E.jsxs)(E.Fragment,{children:[s("Authorize transaction"),1===v?void 0:(0,E.jsxs)(E.Fragment,{children:[" 1/",v]})]}),onClose:A,size:"large",children:g.isUnsigned?(0,E.jsx)(he,{currentItem:g}):(0,E.jsx)(de,{currentItem:g,isQueueSubmit:h,queueSize:v,requestAddress:x,setIsQueueSubmit:p})},g.id)]})}const be=(0,s.zo)(s.u_)`
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
`,ve=a.memo(fe)}}]);