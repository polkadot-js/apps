"use strict";(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[136],{8188:(e,t,n)=>{n.r(t),n.d(t,{ApiCtxRoot:()=>G,DEFAULT_AUX:()=>U,DEFAULT_DECIMALS:()=>q,DEFAULT_SS58:()=>H});var a=n(52322),s=n(5111),i=n(59039),r=n(2784),o=n(23729),l=n.n(o),c=n(1719),d=n(42582),u=n(64176),m=n(36733),h=n(3919),p=n(16265),g=n(76833),f=n(345),b=n(50265),x=n(86135),v=n(33318),A=n(11677);const w=(0,v.Rf)(((e,t)=>t?.toString()||e)),y=(0,A.e)("useEndpoint",(function(e){return(0,r.useMemo)((()=>function(e){return w.find((({value:t})=>t===e))||null}(e)),[e])}));var k=n(54371);const j=(0,v.Rf)(((e,t)=>t?.toString()||e)),N=(0,A.e)("usePeopleEndpoint",(function(e){return(0,r.useMemo)((()=>{return t=e,j.find((({info:e,isPeople:n})=>n&&(0,k.H)(e)&&(0,k.H)(t)&&e.toLowerCase().includes(t.toLowerCase())))||null;var t}),[e])})),C=(0,v.Rf)(((e,t)=>t?.toString()||e)),E=(0,A.e)("useCoretimeEndpoint",(function(e){return(0,r.useMemo)((()=>{return t=e,C.find((({info:e})=>(0,k.H)(e)&&(0,k.H)(t)&&e.toLowerCase().includes("coretime")&&e.toLowerCase().includes(t.toLowerCase())))||null;var t}),[e])}));var S=n(18837),I=n(87206);class B{#e;#t;#n;constructor(e,t,n){this.#e=t,this.#t=n,this.#n=e}async signPayload(e){return new Promise(((t,n)=>{this.#e(this.#n,e,((e,a)=>{a?t(a):n(new Error("Unable to sign"))}))}))}update(e,t){t instanceof this.#n.createClass("Hash")?this.#t(e,"sent",t.toHex()):this.#t(e,t.status.type.toLowerCase(),t)}}var D=n(69187),L=n(16039),P=n(33403),T=n(92730),V=n(30495),M=n(11147),F=n(65968),z=n(68145),Z=n(36956),R=n(95267),$=n(81369);const q=R.statics.registry.createType("u32",12),H=R.statics.registry.createType("u32",z.c.prefix),U=["Aux1","Aux2","Aux3","Aux4","Aux5","Aux6","Aux7","Aux8","Aux9"],W=[],O={hasInjectedAccounts:!1,isApiReady:!1};async function Q(e){try{return await e,(await(0,f.vK)()).map((({address:e,meta:t},n)=>({address:e,meta:(0,P.Z)({},t,{name:`${t.name||"unknown"} (${"polkadot-js"===t.source?"extension":t.source})`,whenCreated:n})})))}catch(e){return console.error("web3Accounts",e),[]}}function G({apiUrl:e,children:t,isElectron:o,store:v}){const{queuePayload:A,queueSetTxStatus:w}=(0,x.L)(),[k,j]=(0,r.useState)(O),[C,z]=(0,r.useState)(!1),[G,J]=(0,r.useState)(!1),[K,Y]=(0,r.useState)(null),[X,_]=(0,r.useState)(),[ee]=(0,r.useState)(l().get("localFork")===e),te=y(e),ne=N(te?.relayName||te?.info),ae=E(te?.relayName||te?.info),se=(0,r.useMemo)((()=>te?.valueRelay&&(0,F.h)(te.paraId)&&te.paraId<2e3?te.valueRelay:null),[te]),ie=(0,r.useMemo)((()=>ne?.isPeople&&!te?.isPeople&&ne?.providers&&te?.isPeopleForIdentity?ne.providers:null),[te,ne]),re=(0,r.useMemo)((()=>ae?.providers?ae.providers:null),[ae]),oe=(0,S.J)(se),le=(0,S.J)(re),ce=(0,S.J)(ie),de=(0,r.useMemo)((()=>function(e,t){return(n,a)=>`${t?"https://polkadot.js.org/apps/":`${window.location.origin}${window.location.pathname}`}?rpc=${encodeURIComponent(a||e)}#${n}`}(e,o)),[e,o]),ue=te?.isPeople||(0,F.h)(te?.paraId)&&te?.paraId>=2e3&&!te?.isPeopleForIdentity||"boolean"==typeof te?.isPeopleForIdentity&&!te?.isPeopleForIdentity,me=(0,r.useMemo)((()=>(0,P.Z)({},k,{api:R.statics.api,apiCoretime:le,apiEndpoint:te,apiError:K,apiIdentity:te?.isPeopleForIdentity&&ce||R.statics.api,apiRelay:oe,apiSystemPeople:ce,apiUrl:e,createLink:de,enableIdentity:ue,extensions:X,isApiConnected:C,isApiInitialized:G,isElectron:o,isLocalFork:ee,isWaitingInjected:!X})),[K,de,X,C,G,o,ee,k,te,le,oe,e,ce,ue]);return(0,r.useEffect)((()=>{const t=e=>{console.error(e),Y(e.message)};(async function(e,t,a,r){const o=function(){const e=(0,$.decodeUrlTypes)()||l().get("types",{}),t=Object.keys(e);return t.length&&console.log("Injected types:",t.join(", ")),e}(),m=e.startsWith("light://");let h,p,f=null,b=!1;if(a)try{p=await s.FY.fromEndpoint(e),f=p.chain,await(0,s.po)(f,{System:{Account:[[["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],{data:{free:5e15},providers:1}]]}}),b=!0}catch(e){throw l().set("localFork",""),r(new Error("Local fork failed, please refresh to switch back to default API provider. This is likely due to chain not supported by chopsticks.\n      Please consider to send an issue to https://github.com/AcalaNetwork/chopsticks.")),e}try{h=m?await async function(e){const[t,a,s]=e.split("/");if("substrate-connect"!==t)throw new Error(`Cannot connect to non substrate-connect protocol ${e}`);if(!Z.relaySpecs[a]||s&&!Z.lightSpecs[a]?.[s])throw new Error(`Unable to construct light chain ${e}`);const r=new c.x(i,Z.relaySpecs[a]);if(!s)return r;const o=await n(29038)(`${Z.lightSpecs[a][s]}`);return new c.x(i,JSON.stringify(o.default),r)}(e.replace("light://","")):a&&b?p:new d.U(e),R.statics.api=new u.G({provider:h,registry:R.statics.registry,signer:t,types:o,typesBundle:g.UD}),m&&await(h?.connect())}catch(e){r(e)}return{fork:f,types:o}})(e,new B(R.statics.registry,A,w),ee,t).then((({fork:e,types:n})=>{R.statics.api.on("connected",(()=>z(!0))),R.statics.api.on("disconnected",(()=>z(!1))),R.statics.api.on("error",t),R.statics.api.on("ready",(()=>{const a=(0,f.$y)("polkadot-js/apps");a.then(_).catch(console.error);const s=!!location.href.includes("keyring-type=ethereum");(async function(e,t,n,a,s,i,r=!1){R.statics.registry.register(i);const{injectedAccounts:o,properties:l,systemChain:c,systemChainType:d,systemName:u,systemVersion:g}=await async function(e,t){const[n,a,s,i,r]=await Promise.all([e.rpc.system.chain(),e.rpc.system.chainType?e.rpc.system.chainType():Promise.resolve(R.statics.registry.createType("ChainType","Live")),e.rpc.system.name(),e.rpc.system.version(),Q(t)]);return{injectedAccounts:r.filter((({meta:{source:e}})=>!W.includes(e))),properties:R.statics.registry.createType("ChainProperties",{isEthereum:e.registry.chainIsEthereum,ss58Format:e.registry.chainSS58,tokenDecimals:e.registry.chainDecimals,tokenSymbol:e.registry.chainTokens}),systemChain:(n||"<unknown>").toString(),systemChainType:a,systemName:s.toString(),systemVersion:i.toString()}}(e,a),f=l.ss58Format.unwrapOr(H).toNumber(),x=-1===L.X.prefix?f:L.X.prefix,v=l.tokenSymbol.unwrapOr([T.a.getDefaults().unit,...U]),A=l.tokenDecimals.unwrapOr([q]),w=l.isEthereum.isTrue||p.W.includes(e.runtimeVersion.specName.toString())||r,y=d.isDevelopment||d.isLocal||(0,V.s)(c);console.log(`chain: ${c} (${d.toString()}), ${(0,M.P)(l)}`),R.statics.registry.setChainProperties(R.statics.registry.createType("ChainProperties",{isEthereum:w,ss58Format:x,tokenDecimals:A,tokenSymbol:v})),T.a.setDefaults({decimals:A.map((e=>e.toNumber())),unit:v[0].toString()}),b.k.setAbbr(v[0].toString()),function(){try{return!!D.Nn.keyring}catch{return!1}}()||D.Nn.loadAll({genesisHash:e.genesisHash,genesisHashAdd:t&&(0,F.h)(t.paraId)&&t.paraId<2e3&&t.genesisHashRelay?[t.genesisHashRelay]:[],isDevelopment:y,ss58Format:x,store:s,type:w?"ethereum":"ed25519"},o);const k=Object.keys(e.tx)[0],j=Object.keys(e.tx[k])[0],N=e.tx[k][j],C=e.tx.system?.setCode||N;return(0,m.u)(e.genesisHash.toHex(),h.A),{apiDefaultTx:N,apiDefaultTxSudo:C,chainSS58:f,fork:n,hasInjectedAccounts:0!==o.length,isApiReady:!0,isDevelopment:y,isEthereum:w,specName:e.runtimeVersion.specName.toString(),specVersion:e.runtimeVersion.specVersion.toString(),systemChain:c,systemName:u,systemVersion:g}})(R.statics.api,te,e,a,v,n,s).then(j).catch(t)})),ee&&(l().set("localFork",""),R.statics.api.connect().catch(t)),J(!0)})).catch(t)}),[te,e,A,w,v,ee]),me.isApiInitialized?(0,a.jsx)(I.E.Provider,{value:me,children:t}):null}},94356:(e,t,n)=>{n.r(t),n.d(t,{default:()=>o});var a=n(52322),s=n(2784),i=n(87206),r=n(48731);function o(e,t={}){class n extends s.PureComponent{component=s.createRef();render(){return(0,a.jsx)(i.E.Consumer,{children:n=>((0,r.hu)(n?.api,"Application root must be wrapped inside 'react-api/Api' to provide API context"),(0,a.jsx)(e,{...t,...n,...this.props,ref:this.component}))})}}return n}},98727:(e,t,n)=>{n.r(t),n.d(t,{default:()=>g});var a=n(52322),s=n(2784),i=n(17965),r=n(1346),o=n(17751),l=n(48731),c=n(80522),d=n(41186),u=n(94356);const m=()=>{},h=()=>!1,p={};function g(e,{at:t,atProp:n,callOnResult:g,fallbacks:f,isMulti:b=!1,paramName:x,paramPick:v,paramValid:A=!1,params:w=[],propName:y,skipIf:k=h,transform:j=c.default,withIndicator:N=!1}={}){return c=>{class h extends s.Component{state={callResult:void 0,callUpdated:!1,callUpdatedAt:0};destroy;isActive=!1;propName;timerId=-1;constructor(t){super(t);const[,n,a]=e.split(".");this.propName=`${n}_${a}`}componentDidUpdate(e){const t=this.getParams(e),n=this.getParams(this.props);this.isActive&&!(0,d.isEqual)(n,t)&&this.subscribe(n).then(m).catch(m)}componentDidMount(){this.isActive=!0,N&&(this.timerId=window.setInterval((()=>{const e=Date.now()-(this.state.callUpdatedAt||0)<=1500;e!==this.state.callUpdated&&this.nextState({callUpdated:e})}),500)),(0,i.Y)((()=>{this.subscribe(this.getParams(this.props)).then(m).catch(m)}))}componentWillUnmount(){this.isActive=!1,this.unsubscribe().then(m).catch(m),-1!==this.timerId&&clearInterval(this.timerId)}nextState(e){this.isActive&&this.setState(e)}getParams(e){const a=v?v(e):x?e[x]:void 0;return n&&(t=e[n]),!A&&x&&((0,r.o)(a)||(0,o.F)(a))?[!1,[]]:[!0,(0,r.o)(a)?w:w.concat(Array.isArray(a)&&!a.toU8a?a:[a])]}constructApiSection=e=>{const{api:n}=this.props,[a,s,i,...r]=e.split(".");return(0,l.hu)(a.length&&s.length&&i.length&&0===r.length,`Invalid API format, expected <area>.<section>.<method>, found ${e}`),(0,l.hu)(["consts","rpc","query","derive"].includes(a),`Unknown api.${a}, expected consts, rpc, query or derive`),(0,l.hu)(!t||"query"===a,"Only able to do an 'at' query on the api.query interface"),[n[a][s],a,s,i]};getApiMethod(t){if("subscribe"===e){const[e,...n]=t;return[e,n,"subscribe"]}const n=[e].concat(f||[]).map(this.constructApiSection),[a,s,i,c]=n.find((([e])=>!!e))||[{},n[0][1],n[0][2],n[0][3]];(0,l.hu)(a?.[c],`Unable to find api.${s}.${i}.${c}`);const d=a[c].meta;if("query"===s&&d?.type.isMap){const e=t[0];(0,l.hu)(!(0,r.o)(e)&&!(0,o.F)(e)||d.type.asMap.kind.isLinkedMap,`${d.name} expects one argument`)}return[a[c],t,c.startsWith("subscribe")?"subscribe":s]}async subscribe([a,s]){if(!a||k(this.props))return;const{api:i}=this.props;let r;await i.isReady;try{(0,l.hu)(t||!n,"Unable to perform query on non-existent at hash"),r=this.getApiMethod(s)}catch(t){p[t.message]||(console.warn(e,"::",t),p[t.message]=!0)}if(!r)return;const[o,c,d]=r,u=e=>this.triggerUpdate(this.props,e);await this.unsubscribe();try{["derive","subscribe"].includes(d)||"query"===d&&!t&&!n?this.destroy=b?await o.multi(c,u):await o(...c,u):u("consts"===d?o:t?await o.at(t,...c):await o(...c))}catch{}}async unsubscribe(){this.destroy&&(this.destroy(),this.destroy=void 0)}triggerUpdate(e,t){try{const n=(e.transform||j)(t);if(!this.isActive||(0,d.isEqual)(n,this.state.callResult))return;(0,d.triggerChange)(n,g,e.callOnResult),this.nextState({callResult:n,callUpdated:!0,callUpdatedAt:Date.now()})}catch{}}render(){const{callResult:e,callUpdated:t,callUpdatedAt:n}=this.state,s={...this.props,callUpdated:t,callUpdatedAt:n};return(0,r.o)(e)||(s[y||this.propName]=e),(0,a.jsx)(c,{...s})}}return(0,u.default)(h)}}},3364:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i});var a=n(52322),s=(n(2784),n(98727));function i(e,t={}){return(n,i={})=>(0,s.default)(e,{...t,propName:"callResult"})((function({callResult:e,callUpdated:t,children:s,className:r=i.className,label:o=""}){return(0,a.jsxs)("div",{...i,className:[r||"",t?"rx--updated":void 0].join(" "),children:[o,n(e),s]})}))}},5246:(e,t,n)=>{n.r(t),n.d(t,{default:()=>s});var a=n(98727);function s(...e){return t=>e.reverse().reduce(((e,t)=>Array.isArray(t)?(0,a.default)(...t)(e):(0,a.default)(t)(e)),t)}},69356:(e,t,n)=>{n.r(t),n.d(t,{onlyOnApp:()=>c.onlyOnApp,onlyOnWeb:()=>c.onlyOnWeb,withApi:()=>a.default,withCall:()=>s.default,withCallDiv:()=>i.default,withCalls:()=>r.default,withMulti:()=>o.default,withObservable:()=>l.default});var a=n(94356),s=n(98727),i=n(3364),r=n(5246),o=n(60028),l=n(33989),c=n(35475)},60028:(e,t,n)=>{function a(e,...t){return t.reverse().reduce(((e,t)=>t(e)),e)}n.r(t),n.d(t,{default:()=>a})},33989:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var a=n(52322),s=n(2784),i=n(77984),r=n(47009),o=n(35120),l=n(80522),c=n(41186);function d(e,{callOnResult:t,propName:n="value",transform:d=l.default}={}){return(l,u={},m)=>{class h extends s.Component{isActive=!0;state={callResult:void 0,callUpdated:!1,callUpdatedAt:0,subscriptions:[]};componentDidMount(){this.setState({subscriptions:[e.pipe((0,i.U)(d),(0,r.K)((()=>(0,o.of)(void 0)))).subscribe((e=>this.triggerUpdate(this.props,e))),(0,c.intervalObservable)(this)]})}componentWillUnmount(){this.isActive=!1,this.state.subscriptions.forEach((e=>e.unsubscribe()))}triggerUpdate=(e,n)=>{try{if(!this.isActive||(0,c.isEqual)(n,this.state.callResult))return;(0,c.triggerChange)(n,t,e.callOnResult||u.callOnResult),this.setState({callResult:n,callUpdated:!0,callUpdatedAt:Date.now()})}catch(e){console.error(this.props,e)}};render(){const{children:e}=this.props,{callResult:t,callUpdated:s,callUpdatedAt:i}=this.state,r={...u,...this.props,callUpdated:s,callUpdatedAt:i,[n]:t};return(0,a.jsxs)(l,{...r,children:[m?.(t),e]})}}return h}}},35475:(e,t,n)=>{n.r(t),n.d(t,{onlyOnApp:()=>r,onlyOnWeb:()=>i});var a=n(41186);const s=e=>t=>(0,a.getEnvironment)()===e?t:()=>null,i=s("web"),r=s("app")},57139:(e,t,n)=>{n.r(t),n.d(t,{ApiCtxRoot:()=>a.ApiCtxRoot,DEFAULT_DECIMALS:()=>a.DEFAULT_DECIMALS,DEFAULT_SS58:()=>a.DEFAULT_SS58,statics:()=>i.statics,withApi:()=>s.withApi,withCallDiv:()=>s.withCallDiv,withCalls:()=>s.withCalls,withMulti:()=>s.withMulti,withObservable:()=>s.withObservable});var a=n(8188),s=n(69356),i=n(95267)},36956:(e,t,n)=>{n.r(t),n.d(t,{lightSpecs:()=>r,relaySpecs:()=>o});var a=n(59039),s=n(37178),i=n(15299);const r=Object.entries({kusama:s.specs,polkadot:i.specs}).reduce(((e,[t,n])=>(e[t]=n.reduce(((e,n)=>(e[n]=`./light/${t}/${n}.json`,e)),{}),e)),{}),o={kusama:a.WellKnownChain.ksmcc3,polkadot:a.WellKnownChain.polkadot,rococo:a.WellKnownChain.rococo_v2_2,westend:a.WellKnownChain.westend2}},37178:(e,t,n)=>{n.r(t),n.d(t,{specs:()=>a});const a=["gm","shiden","tinkernet"]},15299:(e,t,n)=>{n.r(t),n.d(t,{specs:()=>a});const a=["astar"]},95267:(e,t,n)=>{n.r(t),n.d(t,{statics:()=>a});const a={api:void 0,registry:new(n(35562).P)}},80522:(e,t,n)=>{function a(e,t){return e}n.r(t),n.d(t,{default:()=>a})},81369:(e,t,n)=>{n.r(t),n.d(t,{decodeUrlTypes:()=>d,encodeUrlTypes:()=>u});var a=n(13824),s=n(85168),i=n(16039),r=n(48731),o=n(56623),l=n(64021),c=n(41444);function d(){const e=s.Z.parse(location.href.split("?")[1]);if(e.types)try{(0,r.hu)(!Array.isArray(e.types),"Expected a single type specification");const t=e.types.split("#"),n=(0,c.tV)(decodeURIComponent(t[0])),s=(0,a.HT)(n);return JSON.parse((0,o.z)(s))}catch(e){console.error(e)}return null}function u(e){const t=(0,l.d)(JSON.stringify(e)),n=(0,a.iZ)(t,{level:9}),s=(0,c.h$)(n);return`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(i.X.apiUrl)}&types=${encodeURIComponent(s)}`}},68372:(e,t,n)=>{n.r(t),n.d(t,{getEnvironment:()=>s});var a=n(34406);function s(){return a?.versions?.electron||"renderer"===window?.process?.type||navigator?.userAgent?.indexOf("Electron")>=0?"app":"web"}},77809:(e,t,n)=>{async function a(e,t,n){return Promise.all(n.map((n=>e(n,...t)))).then((e=>e.map(((e,t)=>[n[t],e]))))}n.r(t),n.d(t,{getHistoric:()=>a})},41186:(e,t,n)=>{n.r(t),n.d(t,{getEnvironment:()=>a.getEnvironment,getHistoric:()=>s.getHistoric,intervalObservable:()=>i.intervalObservable,isEqual:()=>r.isEqual,triggerChange:()=>o.triggerChange});var a=n(68372),s=n(77809),i=n(71951),r=n(65345),o=n(74733)},71951:(e,t,n)=>{n.r(t),n.d(t,{intervalObservable:()=>s});const a=(0,n(487).F)(500);function s(e){return a.subscribe((()=>{const t=Date.now()-(e.state.callUpdatedAt||0)<=1500;t!==e.state.callUpdated&&e.setState({callUpdated:t})}))}},65345:(e,t,n)=>{function a(e,t){return t?t.$$typeof?"":Array.isArray(t)?t.map((e=>a(0,e))):t:t}function s(e,t){return JSON.stringify({test:e},a)===JSON.stringify({test:t},a)}n.r(t),n.d(t,{isEqual:()=>s})},74733:(e,t,n)=>{n.r(t),n.d(t,{triggerChange:()=>i});var a=n(4757),s=n(33661);function i(e,...t){t?.length&&t.forEach((t=>{(0,a.b)(t)?t.next(e):(0,s.m)(t)&&t(e)}))}},13731:(e,t,n)=>{n.d(t,{Z:()=>h,d:()=>m});var a=n(52322),s=n(2784),i=n(56360),r=n(97794),o=n(48801),l=n.n(o),c=n(95292),d=n(25294),u=n(43151);const m=[1,2,4,8,16,32].map(((e,t)=>[t+1,e,new(l())(e)])),h=s.memo((function({className:e="",label:t,onChange:n,value:o,voteLockingPeriod:l}){const{t:h}=(0,u.$)(),p=(0,i.n)(),g=(0,s.useRef)(function(e,t,n){return[{text:n("0.1x voting balance, no lockup period"),value:0},...m.map((([a,s,i])=>({text:n("{{value}}x voting balance, locked for {{duration}}x duration{{period}}",{replace:{duration:s,period:t&&t.gt(c.nw)?` (${(0,r.A)(e,i.mul(t),n)[1]})`:"",value:a}}),value:a})))]}(p,l,h));return(0,a.jsx)(d.Z,{className:e,label:t,onChange:n,options:g.current,value:o})}))},25294:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(52322),s=n(2784),i=n(25650),r=n(31076),o=n(1346),l=n(12493);const c=(0,n(21779).z)(l.Z)`
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
`,d=s.memo((function({allowAdd:e=!1,children:t,className:n="",defaultValue:l,dropdownClassName:d,isButton:u,isDisabled:m,isError:h,isFull:p,isMultiple:g,label:f,labelExtra:b,onAdd:x,onBlur:v,onChange:A,onClose:w,onSearch:y,options:k,placeholder:j,renderLabel:N,searchInput:C,tabIndex:E,transform:S,value:I,withEllipsis:B,withLabel:D}){const L=(0,s.useRef)(""),[P,T]=(0,s.useState)(),V=(0,s.useCallback)((e=>{const t=JSON.stringify({v:e});L.current!==t&&(L.current=t,T(e),A&&A(S?S(e):e))}),[A,S]);(0,s.useEffect)((()=>{V((0,o.o)(I)?l:I)}),[V,l,I]);const M=(0,s.useCallback)(((e,{value:t})=>x&&x(t)),[x]),F=(0,s.useCallback)(((e,{value:t})=>V(t)),[V]),z=(0,a.jsx)(i.Z,{allowAdditions:e,button:u,className:d,compact:u,disabled:m,error:h,floating:u,multiple:g,onAddItem:M,onBlur:v,onChange:F,onClose:w,options:k,placeholder:j,renderLabel:N,search:y||e,searchInput:C,selection:!0,tabIndex:E,value:P});return u?(0,a.jsxs)(r.Z.Group,{children:[z,t]}):(0,a.jsxs)(c,{className:`${n} ui--Dropdown`,isFull:p,label:f,labelExtra:b,withEllipsis:B,withLabel:D,children:[z,t]})}));d.Header=i.Z.Header;const u=d},79472:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(69316),r=n(15445);const o=n(21779).z.div`
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
`,d=o.memo((function({className:e="",color:t="normal",icon:n,isPadded:s,isSpinning:i,onClick:r,size:o="1x",tooltip:l}){const d={"data-testid":n,...l?{"data-for":l,"data-tip":!0}:{}};return(0,a.jsx)(c,{...d,className:`${e} ui--Icon ${t}Color${r?" isClickable":""}${s?" isPadded":""}`,icon:n,onClick:r,size:o,spin:i,tabIndex:-1})}))},33749:(e,t,n)=>{n.d(t,{ZP:()=>u,nk:()=>c});var a=n(52322),s=n(2784),i=n(46340),r=n(33661),o=n(1346),l=n(12493);const c=["Alt","Meta","Control"];let d=0;const u=s.memo((function({autoFocus:e=!1,children:t,className:n,defaultValue:c,icon:u,inputClassName:m,isAction:h=!1,isDisabled:p=!1,isDisabledError:g=!1,isEditable:f=!1,isError:b=!1,isFull:x=!1,isHidden:v=!1,isInPlaceEditor:A=!1,isLoading:w=!1,isReadOnly:y=!1,isWarning:k=!1,label:j,labelExtra:N,max:C,maxLength:E,min:S,name:I,onBlur:B,onChange:D,onEnter:L,onEscape:P,onKeyDown:T,onKeyUp:V,onPaste:M,placeholder:F,tabIndex:z,type:Z="text",value:R,withEllipsis:$,withLabel:q}){const[H]=(0,s.useState)((()=>`in_${d++}_at_${Date.now()}`)),[U]=(0,s.useState)((()=>c));(0,s.useEffect)((()=>{U&&D&&D(U)}),[U,D]);const W=(0,s.useCallback)((()=>B&&B()),[B]),O=(0,s.useCallback)((({target:e})=>D&&D(e.value)),[D]),Q=(0,s.useCallback)((e=>T&&T(e)),[T]),G=(0,s.useCallback)((e=>{V&&V(e),!L||"Enter"!==e.key&&13!==e.keyCode||(e.target.blur(),(0,r.m)(L)&&L()),!P||"Escape"!==e.key&&27!==e.keyCode||(e.target.blur(),P())}),[L,P,V]),J=(0,s.useCallback)((e=>M&&M(e)),[M]);return(0,a.jsx)(l.Z,{className:n,isFull:x,label:j,labelExtra:N,withEllipsis:$,withLabel:q,children:(0,a.jsxs)(i.Z,{action:h,autoFocus:e,className:[f?"ui--Input edit icon":"ui--Input",A?"inPlaceEditor":"",w?"--tmp":"",m||"",k&&!b?"isWarning":""].join(" "),defaultValue:(0,o.o)(R)?c||"":void 0,disabled:p||w,error:!p&&b||g,hidden:v,iconPosition:(0,o.o)(u)?void 0:"left",id:I,max:C,maxLength:E,min:S,name:I||H,onBlur:W,onChange:O,onKeyDown:Q,onKeyUp:G,placeholder:F,readOnly:y,tabIndex:z,type:Z,value:R,children:[(0,a.jsx)("input",{autoCapitalize:"off",autoComplete:"password"===Z?"new-password":"off",autoCorrect:"off","data-testid":j,onPaste:J,spellCheck:!1,style:{pointerEvents:"auto"}}),f&&(0,a.jsx)("i",{className:"edit icon"}),u,t]})})}))},44294:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(92730),r=n(1346),o=n(39764);const l=s.memo((function({autoFocus:e,children:t,className:n="",defaultValue:l,isDisabled:c,isError:d,isFull:u,isLoading:m,isWarning:h,isZeroable:p,label:g,labelExtra:f,maxValue:b,onChange:x,onEnter:v,onEscape:A,placeholder:w,siDecimals:y,siSymbol:k,value:j,withEllipsis:N,withLabel:C,withMax:E}){const{defaultValue:S,siDefault:I}=(0,s.useMemo)((()=>function(e,t=!1,n){if(!e)return{};const a=(0,i.a)(e,{decimals:(0,r.o)(n)?i.a.getDefaults().decimals:n,forceUnit:"-",withAll:!0,withSi:!1,withZero:!1});return{defaultValue:t?`${a}.`.split(".").slice(0,2).map(((e,t)=>t?e.padEnd(4,"0"):e)).join("."):a.replace(/,/g,""),siDefault:i.a.findSi("-")}}(l,c,y)),[l,c,y]);return(0,a.jsx)(o.Z,{autoFocus:e,bitLength:128,className:`${n} ui--InputBalance`,defaultValue:S,isDisabled:c,isError:d,isFull:u,isLoading:m,isSi:!0,isWarning:h,isZeroable:p,label:g,labelExtra:f,maxValue:b,onChange:x,onEnter:v,onEscape:A,placeholder:w,siDecimals:y,siDefault:I,siSymbol:k,value:j,withEllipsis:N,withLabel:C,withMax:E,children:t})}))},50265:(e,t,n)=>{n.d(t,{k:()=>a});class a{static abbr="Unit";static setAbbr(e=a.abbr){a.abbr=e}}},39764:(e,t,n)=>{n.d(t,{Z:()=>k});var a=n(52322),s=n(2784),i=n(90778),r=n(95292),o=n(48801),l=n.n(o),c=n(1346),d=n(92730),u=n(6485),m=n(50265),h=n(33749),p=n(21779),g=n(43151);const f=32;function b(e){return r.um.pow(new(l())(e||f)).isub(r.If)}function x(e,t){return new RegExp(e?`^${t?"-?":""}(0|[1-9]\\d*)(\\.\\d*)?$`:`^${t?"-?":""}(0|[1-9]\\d*)$`)}function v(e,t,n,a,s){return!(!n&&e.lt(r.nw)||e.gt(b(t))||!a&&e.isZero()||e.bitLength()>(t||f)||s&&s.gtn(0)&&e.gt(s))}function A(e,t,n,a,s,i,o,u){const[m,h,p]=function(e,t){if(!e)return[r.nw,0,0];const n=(0,c.o)(t)?d.a.getDefaults().decimals:t;return[new(l())(n+e.power),n,e.power]}(n,u),g=t.match(/^(\d+)\.(\d+)$/);let f;if(g){p-g[2].length<-h&&(f=new(l())(-1));const n=new(l())(t.replace(/\.\d*$/,"")),a=t.replace(/^\d+\./,"").substring(0,e.registry.chainDecimals[0]),s=new(l())(a);f=n.mul(r.aP.pow(m)).add(s.mul(r.aP.pow(new(l())(h+p-a.length))))}else f=new(l())(t.replace(/[^\d]/g,"")).mul(r.aP.pow(m)).muln(s&&t.startsWith("-")?-1:1);return[f,v(f,a,s,i,o)]}function w(e,t,n,a,s,i,r,o){return[t,...A(e,t,n,a,s,i,r,o)]}const y=(0,p.z)(h.ZP)`
  .siUnit {
    bottom: 0.85rem;
    color: var(--color-label);
    font-size: var(--font-size-tiny);
    font-weight: var(--font-weight-label);
    position: absolute;
    font-weight: var(--font-weight-bold);
    right: 1.25rem;
  }
`,k=s.memo((function({autoFocus:e,bitLength:t=f,children:n,className:o="",defaultValue:p,isDecimal:v,isDisabled:A,isError:k=!1,isFull:j,isLoading:N,isSi:C,isSigned:E=!1,isWarning:S,isZeroable:I=!0,label:B,labelExtra:D,maxLength:L,maxValue:P,onChange:T,onEnter:V,onEscape:M,placeholder:F,siDecimals:z,siDefault:Z,siSymbol:R,value:$}){const{t:q}=(0,g.$)(),{api:H}=(0,i.h)(),[U]=(0,s.useState)((()=>C?Z||d.a.findSi("-"):null)),[[W,O,Q],G]=(0,s.useState)((()=>function(e,t=r.nw,n,a,s,i,o,m){return(0,u.H)(t)?function(e,t,n,a,s){const i=(0,c.o)(s)?d.a.getDefaults().decimals:s;return[t?e.div(r.aP.pow(new(l())(i+t.power))).toString():e.toString(),e,!(!a&&!n)||e.gt(r.nw)]}(t,n,s,i,m):w(e,t,n,a,s,i,o,m)}(H,$||p,U,t,E,I,P,z))),[J,K]=(0,s.useState)(!1);(0,s.useEffect)((()=>{T&&T(Q?O:void 0)}),[Q,T,O]);const Y=(0,s.useCallback)(((e,n)=>G(w(H,e,n,t,E,I,P,z))),[H,t,E,I,P,z]),X=(0,s.useCallback)((e=>Y(e,U)),[Y,U]);(0,s.useEffect)((()=>{p&&X(p.toString())}),[X,p]);const _=(0,s.useCallback)((e=>{if(h.nk.includes(e.key))K(!0);else if(1===e.key.length&&!J){const{selectionEnd:t,selectionStart:n,value:a}=e.target,s=`${a.substring(0,n||0)}${e.key}${a.substring(t||0)}`;x(v||!!U,E).test(s)||e.preventDefault()}}),[v,J,E,U]),ee=(0,s.useCallback)((e=>{h.nk.includes(e.key)&&K(!1)}),[]),te=(0,s.useCallback)((e=>{const{value:t}=e.target;x(v||!!U,E).test(t)||e.preventDefault()}),[v,E,U]),ne=b(t).toString().length;return(0,a.jsxs)(y,{autoFocus:e,className:`${o} ui--InputNumber ${A?"isDisabled":""}`,isDisabled:A,isError:!Q||k,isFull:j,isLoading:N,isWarning:S,label:B,labelExtra:D,maxLength:L||ne,onChange:X,onEnter:V,onEscape:M,onKeyDown:_,onKeyUp:ee,onPaste:te,placeholder:F||q(E?"Valid number":"Positive number"),type:"text",value:W,children:[U&&(0,a.jsx)("div",{className:"siUnit",children:R||m.k.abbr}),n]})}))},35220:(e,t,n)=>{n.d(t,{Z:()=>g});var a=n(52322),s=n(2784),i=n(23729),r=n.n(i),o=n(3663),l=n(25294),c=n(21779);function d(e){return{key:e,text:e,value:e}}const u=(r().get("tags")||["Default"]).sort(),m=u.map(d);function h(e){u.push(e),m.push(d(e)),function(e){r().set("tags",e.sort())}(u)}const p=(0,c.z)(l.Z)`
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
`,g=s.memo((function({allowAdd:e=!0,className:t="",defaultValue:n,isDisabled:s,isError:i,label:r,onBlur:l,onChange:c,onClose:d,placeholder:u,searchInput:g,value:f,withLabel:b}){const{theme:x}=(0,o.F)();return(0,a.jsx)(p,{allowAdd:e&&!s,className:`${t} ui--InputTags ${x}Theme`,defaultValue:n,isDisabled:s,isError:i,isMultiple:!0,label:r,onAdd:h,onBlur:l,onChange:c,onClose:d,options:m,placeholder:u,searchInput:g,value:f,withLabel:b})}))},12493:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(21779);const r=(0,a.jsx)("div",{children:" "}),o=i.z.div`
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
`,u=s.memo((function({address:e,buttons:t,children:n,className:l="",defaultName:u,details:m,icon:h,iconInfo:p,isDisabled:g,isEditableName:f,isEditableTags:b,isInline:x,isShortAddr:v=!0,name:A,onChangeName:w,onChangeTags:y,onSaveName:k,onSaveTags:j,tags:N}){const[C,E]=(0,i.O)(),[S,I]=(0,i.O)(),B=(0,s.useCallback)((()=>{k&&k(),E()}),[k,E]);return(0,a.jsxs)(d,{className:`${l} ui--Row ${g?"isDisabled":""} ${x?"isInline":""}`,children:[(0,a.jsxs)("div",{className:"ui--Row-base",children:[h&&(0,a.jsxs)("div",{className:"ui--Row-icon",children:[h,p&&(0,a.jsx)("div",{className:"ui--Row-icon-info",children:p})]}),(0,a.jsxs)("div",{className:"ui--Row-details",children:[(A||u)&&(f&&C?(0,a.jsx)(o.ZP,{autoFocus:!0,defaultValue:A||u,isInPlaceEditor:!0,onBlur:B,onChange:w,onEnter:!0,withLabel:!1}):(0,a.jsx)("div",{className:"ui--Row-name",children:f?(0,a.jsx)(r.Z,{onClick:E,children:A||u}):A||u})),e&&(0,a.jsx)("div",{className:"ui--Row-address "+(v?"shortAddr":""),children:e.toString()}),m,N&&(0,a.jsx)(c.Z,{className:"ui--Row-tags",isEditable:b,isEditing:S,onChange:y,onSave:j,onToggleIsEditing:I,value:N})]}),t&&(0,a.jsx)("div",{className:"ui--Row-buttons",children:t})]}),n&&(0,a.jsx)("div",{className:"ui--Row-children",children:n})]})}))},56245:(e,t,n)=>{n.d(t,{z:()=>a});const a=["finalitytimeout","finalized","inblock","usurped","dropped","invalid","cancelled","error","sent"]},17608:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(52322),s=n(2784),i=n(3663),r=n(21779),o=n(527);let l=0;const c=r.z.div`
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
`,d=s.memo((function({className:e="",color:t="theme",hover:n,label:r,size:d="small"}){const{theme:u}=(0,i.F)(),[m]=(0,s.useState)((()=>`tag-hover-${Date.now()}-${l++}`));return(0,a.jsxs)(c,{className:`${e} ui--Tag ${t}Color ${d}Size ${u}Theme`,color:t||"grey","data-for":n&&m,"data-tip":!!n,children:[r,n&&(0,a.jsx)(o.Z,{text:n,trigger:m})]})}))},53657:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(52322),s=n(2784),i=n(79472),r=n(35220),o=n(21779),l=n(17608),c=n(43151);const d=o.z.div`
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
`,l=s.memo((function({children:e,className:t="",isClickable:n=!1,place:r,text:l,trigger:c}){const[d]=(0,s.useState)("undefined"==typeof document?{}:document.createElement("div"));return(0,s.useEffect)((()=>{const e="undefined"==typeof document?null:document.getElementById("tooltips");return e?.appendChild(d),()=>{e?.removeChild(d)}}),[d]),(0,i.createPortal)((0,a.jsx)(o,{className:`${t} ui--Tooltip`,clickable:n,effect:"solid",id:c,place:r,children:(0,a.jsxs)("div",{className:"tooltipSpacer",children:[l,e]})}),d)}))},54926:(e,t,n)=>{n.d(t,{Z:()=>a});const a={}},94953:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(24991),s=n(42754),i=n(61349),r=n(16039),o=n(2453),l=n(54926);const c={},d=new s.Z;d.addDetector({lookup:()=>{const e=r.X.i18nLang;return e===o.cr?void 0:e},name:"i18nLangDetector"}),a.ZP.use(d).use(i.Db).use(class{type="backend";static type="backend";async read(e,t,n){if(l.Z[e])return n(null,l.Z[e]);c[e]||(c[e]=this.createLoader(e));const[a,s]=await c[e];return n(a,s)}async createLoader(e){try{const t=await fetch(`locales/${e}/translation.json`,{});return t.ok?(l.Z[e]=await t.json(),[null,l.Z[e]]):[`i18n: failed loading ${e}`,t.status>=500&&t.status<600]}catch(e){return[e.message,!1]}}}).init({backend:{},debug:!1,detection:{order:["i18nLangDetector","navigator"]},fallbackLng:!1,interpolation:{escapeValue:!1,prefix:"{{",suffix:"}}"},keySeparator:!1,load:"languageOnly",ns:["apps","apps-config","apps-electron","apps-routing","app-accounts","app-claims","app-contracts","app-council","app-democracy","app-explorer","app-extrinsics","app-generic-asset","app-js","app-parachains","app-poll","app-rpc","app-settings","app-signing","app-society","app-staking","app-staking-legacy","app-storage","app-sudo","app-tech-comm","app-treasury","react-api","react-components","react-hooks","react-params","react-query","react-signer","translation"],nsSeparator:!1,react:{useSuspense:!0},returnEmptyString:!1,returnNull:!1}).catch((e=>console.log("i18n: failure",e))),r.X.on("change",(e=>{(e.i18nLang===o.cr?a.ZP.changeLanguage():a.ZP.changeLanguage(e.i18nLang)).catch(console.error)}));const u=a.ZP},37100:(e,t,n)=>{n.d(t,{J0:()=>Sa,hl:()=>ze,ax:()=>ct,mV:()=>La,N:()=>jt,Kc:()=>Va,Ct:()=>C,RN:()=>Ma,zx:()=>K,Zb:()=>za,Jy:()=>Wa,Mj:()=>Xa,H_:()=>ts,kL:()=>vs,XZ:()=>ws,P0:()=>Es,v:()=>Ss.Z,qi:()=>gn,lK:()=>le,Lt:()=>en.Z,ML:()=>Ds,SV:()=>Rn,Vh:()=>Ps,xH:()=>pe,n0:()=>oi,HS:()=>ci,lm:()=>ui,u5:()=>gi,JO:()=>w.Z,JH:()=>ht,k:()=>Xe,Kd:()=>Ai,II:()=>tn.ZP,rp:()=>Tn,m3:()=>Ni,bm:()=>Ei,H:()=>ca.Z,$q:()=>Vi,eV:()=>$i,UT:()=>Wi,ht:()=>_i,Rn:()=>er.Z,iQ:()=>or,nU:()=>hr,RF:()=>br,R2:()=>kr,__:()=>ge,ob:()=>Cr,jN:()=>fn.Z,NR:()=>H,oy:()=>Mn,Pd:()=>ua,v2:()=>Pt,u_:()=>Xn,EK:()=>Er,r_:()=>Ar,f:()=>Dr,ro:()=>Lr,YV:()=>Mr,GI:()=>Kt,Ex:()=>Ha,ko:()=>zr,iH:()=>ko.r_,K0:()=>ko.K0,CU:()=>ko.CU,lB:()=>ko.lB,YE:()=>X,ak:()=>Rr,$j:()=>W,d4:()=>$r,by:()=>ke,JM:()=>Ee,qG:()=>bn,qb:()=>Qr,Ty:()=>Jr,iA:()=>si,mQ:()=>ro,Vp:()=>At.Z,$G:()=>ia.Z,Kx:()=>lo,ZD:()=>ha,tX:()=>mo,u:()=>k.Z,Zd:()=>fa,cA:()=>we,us:()=>xo,UE:()=>vo,xb:()=>yo,zo:()=>y.z});var a=n(52322),s=n(2784),i=n(29455),r=n(60773);s.memo((function({children:e,className:t="",defaultValue:n,label:o,value:l}){const c=(0,i.J)(),d=(0,r.Y)(l),u=(0,s.useMemo)((()=>function({accountIndex:e}={}){return e?e.toString():null}(d)),[d]);return c?.query.indices?(0,a.jsxs)("div",{className:`${t} ui--AccountIndex`,children:[o||"",(0,a.jsx)("div",{className:"account-index",children:u||n||"-"}),e]}):null}));var o=n(95267),l=n(90778);const c=s.createContext(void 0);var d=n(64021),u=n(48358),m=n(24107),h=n(65417),p=n(38628),g=n(14681),f=n(16737),b=n(33661),x=n(94175),v=n(73477),A=n(3663),w=n(15445),y=n(21779),k=n(527);let j=0;const N=y.z.div`
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
`,C=s.memo((function({className:e="",color:t="normal",hover:n,hoverAction:i,icon:r,info:o,isBlock:l,isSmall:c,onClick:d}){const u=(r?`${r}-`:"")+"badge",{theme:m}=(0,A.F)(),[h]=(0,s.useState)((()=>`${u}-hover-${Date.now()}-${j++}`)),p=n?{"data-for":h,"data-tip":!0}:{},g="highlight"===t,f=(0,s.useMemo)((()=>(0,a.jsxs)("div",{className:"hoverContent",children:[(0,a.jsx)("div",{children:n}),i&&(0,a.jsx)("a",{className:`${t}Color`,onClick:d,children:i})]})),[t,n,i,d]);return(0,a.jsxs)(N,{...p,className:`${e} ui--Badge ${n?"isTooltip":""} ${l?"isBlock":""} ${c?"isSmall":""} ${d?"isClickable":""} ${g?"highlight--bg":""} ${t}Color ${r?"withIcon":""} ${o?"withInfo":""} ${i?"withAction":""} ${m}Theme`,"data-testid":u,onClick:i?void 0:d,children:[(0,a.jsxs)("div",{className:g?"highlight--color-contrast":"",children:[r&&(0,a.jsx)(w.Z,{icon:r}),o,i&&(0,a.jsx)(w.Z,{className:"action-icon",icon:"chevron-right"})]}),n&&(0,a.jsx)(k.Z,{className:"accounts-badge",isClickable:!!i,text:f,trigger:h})]})}));function E(e,t){const n=o.statics.registry.createType("AccountId",(0,d.d)(e.padEnd(32,"\0")));return e=>n.eq(e)?t:null}function S(e,t,n){const a=(0,d.d)(e),s=a.length+4;return e=>{try{const i=(0,u.U)(e)?e:(0,m.c)(e)?e.toU8a():(0,x.m)(e?.toString()||""),r=20===i.length?"AccountId20":"AccountId",l=o.statics.registry.createType(r,i).toU8a();return l.length>=s&&(0,h.S)(a,l.subarray(0,a.length))&&(0,p.S)(l.subarray(s))?`${t} ${(0,g.u)((0,f._)(l.subarray(a.length,s)))}${n?` (${n})`:""}`:null}catch(e){return console.log(e),null}}}const I=[E("modlpy/socie","Society"),E("modlpy/trsry","Treasury"),E("modlpy/xcmch","XCM"),S("modlpy/cfund","Crowdloan"),S("modlpy/npols\0","Pool","Stash"),S("modlpy/npols","Pool","Reward"),S("modlpy/nopls\0","Pool","Stash"),S("modlpy/nopls","Pool","Reward"),S("para","Child"),S("sibl","Sibling")],B=new Map,D=new Map,L=new Map;function P(e="",t,n){let a=null;for(let e=0;null===a&&e<I.length;e++)a=I[e](t);if(a)return[a,!1,!1,!0];const s=t.toString();if(!s)return[e,!1,!1,!1];const[i,,r]=(0,v.s2)(s,null,e),o=(n||"").toString()||D.get(s);return i&&o?(D.set(s,o),[o,!1,!0,!1]):[r,!i,i,!1]}function T(e="",t,n){const[s,,i]=P(e,t,n);return i?(0,a.jsx)("span",{className:"isAddress",children:s}):s}function V(e,t,n){const s=B.get(e);if(s)return s;const[i,r,o,l]=P(n,e,t);return(0,a.jsxs)("span",{className:"via-identity",children:[l&&(0,a.jsx)(C,{color:"green",icon:"archway",isSmall:!0}),(0,a.jsx)("span",{className:"name"+(r||l?" isLocal":o?" isAddress":""),children:i})]})}const M=y.z.span`
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
`,F=s.memo((function({children:e,className:t="",defaultName:n,label:i,onClick:o,override:d,toggle:u,value:m,withSidebar:h}){const{apiIdentity:p}=(0,l.h)(),g=(0,r.Y)(m),[f,x]=(0,s.useState)((()=>V((m||"").toString(),void 0,n))),v=(0,s.useContext)(c);(0,s.useEffect)((()=>{const{accountId:e,accountIndex:t,identity:s,nickname:i}=g||{},r=(e||m||"").toString();s?.parent&&L.set(r,s.parent.toString()),p&&(0,b.m)(p.query.identity?.identityOf)?x((()=>s?.display?function(e,t){const n=t.judgements.filter((([,e])=>!e.isFeePaid)),s=n.some((([,e])=>e.isKnownGood||e.isReasonable)),i=n.some((([,e])=>e.isErroneous||e.isLowQuality)),r=s?t.display:(t.display||"").replace(/[^\x20-\x7E]/g,""),o=t.displayParent&&(s?t.displayParent:t.displayParent.replace(/[^\x20-\x7E]/g,"")),l=(c=(0,a.jsxs)("span",{className:"name"+(s&&!i?" isGood":""),children:[(0,a.jsx)("span",{className:"top",children:o||r}),o&&(0,a.jsx)("span",{className:"sub",children:`/${r||""}`})]}),d=i?"red":s?"green":"gray",u=t.parent?"link":s&&!i?"check":"minus",(0,a.jsxs)("span",{className:"via-identity",children:[(0,a.jsx)(C,{color:d,icon:u,isSmall:!0}),c]}));var c,d,u;return B.set(e,l),l}(r,s):V(r,t))):x(i||T(n,r,t))}),[p,n,g,u,m]);const A=(0,s.useCallback)((()=>x(T(n,(m||"").toString()))),[n,m]),w=(0,s.useCallback)((()=>v&&m&&v([m.toString(),A])),[A,v,m]);return(0,a.jsxs)(M,{className:`${t}  ui--AccountName ${h?"withSidebar":""}`,"data-testid":"account-name",onClick:h?w:o,children:[i||"",d||f,e]})}));var z=n(37198),Z=n(13265),R=n(43151);function $(e,{data:t,hash:n,isText:s,type:i}){return Object.entries(Z.N).map((([r,{chains:o,create:l,homepage:c,isActive:d,paths:u,ui:m}])=>{const h=o[e],p=u[i];return d&&h&&p?(0,a.jsx)("a",{href:l(h,p,t,n),rel:"noopener noreferrer",target:"_blank",title:`${r}, ${c}`,children:s?r:(0,a.jsx)("img",{src:m.logo})},r):null})).filter((e=>!!e))}const q=y.z.div`
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
`,H=s.memo((function({className:e="",data:t,hash:n,isSidebar:i,isSmall:r,isText:o,type:c,withTitle:d}){const{t:u}=(0,R.$)(),{systemChain:m}=(0,l.h)(),h=(0,s.useMemo)((()=>$(m,{data:t,hash:n,isSidebar:i,isText:o,type:c})),[m,t,n,i,o,c]);return h.length||d?(0,a.jsxs)(q,{className:`${e} ui--LinkExternal ${o?"isText":"isLogo"} ${d?"isMain":""} ${r?"isSmall":""} ${i?"isSidebar":""}`,children:[o&&!r&&(0,a.jsx)("div",{children:u("View this externally")}),d&&(0,a.jsx)("h5",{children:u("external links")}),(0,a.jsx)("div",{className:"links",children:h.length?h.map(((e,t)=>(0,a.jsx)("span",{children:e},t))):(0,a.jsx)("div",{children:u("none")})})]}):null})),U=y.z.div`
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
`,W=s.memo((function({className:e="",label:t,noLabel:n,variant:s="app"}){const{t:i}=(0,R.$)();return(0,a.jsxs)(U,{className:`${e} ui--Spinner variant-${s}`,children:[(0,a.jsx)("img",{className:"push"===s?"":"highlight--bg highlight--border",src:"data:image/png;base64,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"}),!n&&s.startsWith("app")&&(0,a.jsx)("div",{className:"text",children:t||i("Retrieving data")})]})})),O=y.z.div`
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
`,Q=s.memo((function({children:e,className:t="",isCentered:n}){return(0,a.jsxs)(O,{className:`${t} ui--Button-Group ${n?"isCentered":""}`,children:[e,(0,a.jsx)("div",{className:"clear"})]})})),G=y.z.button`
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
`,J=s.memo((function({activeOnEnter:e,children:t,className:n="",dataTestId:i="",icon:r,isBasic:o,isBusy:l,isCircular:c,isDisabled:d,isFull:u,isIcon:m,isSelected:h,isToplevel:p,label:g,onClick:f,isReadOnly:b=!f,onMouseEnter:x,onMouseLeave:v,tabIndex:A,withoutLink:y}){const k=(0,s.useCallback)((()=>{!l&&!d&&f&&Promise.resolve(f()).catch(console.error)}),[l,d,f]),j=(0,s.useCallback)((()=>{x&&Promise.resolve(x()).catch(console.error)}),[x]),N=(0,s.useCallback)((()=>{v&&Promise.resolve(v()).catch(console.error)}),[v]),C=(0,s.useCallback)((e=>{l||d||"Enter"!==e.key||f&&Promise.resolve(f()).catch(console.error)}),[l,d,f]);return(0,s.useEffect)((()=>(e&&window.addEventListener("keydown",C,!0),()=>{e&&window.removeEventListener("keydown",C,!0)})),[e,C]),(0,a.jsxs)(G,{className:`${n} ui--Button ${g?"hasLabel":""} ${o?"isBasic":""} ${c?"isCircular":""} ${u?"isFull":""} ${m?"isIcon":""} ${l||d?"isDisabled":""} ${l?"isBusy":""} ${b?"isReadOnly":""}${h?"isSelected":""} ${p?"isToplevel":""} ${y?"withoutLink":""}`,"data-testid":i,onClick:k,onMouseEnter:j,onMouseLeave:N,tabIndex:A,children:[r&&(0,a.jsx)(w.Z,{icon:r}),g,t,l&&(0,a.jsx)(W,{className:"ui--Button-spinner",variant:"cover"})]})}));J.Group=Q;const K=J,Y=y.z.div`
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
`,X=s.memo((function({buttons:e,children:t,className:n="",dataTestId:s="",onClose:i,position:r,sidebarRef:o}){return(0,a.jsxs)(Y,{className:`${n} ui--Sidebar ${r}Position`,"data-testid":s,ref:o,children:[(0,a.jsxs)(K.Group,{className:"ui--Sidebar-buttons",children:[e,(0,a.jsx)(K,{dataTestId:"close-sidebar-button",icon:"times",isBasic:!0,isCircular:!0,onClick:i})]}),t]})}));var _=n(69316),ee=n(69356),te=n(54383),ne=n(58607),ae=n(65874),se=n(82671),ie=n(95292),re=n(92730),oe=n(52107);const le=s.memo((function({accountId:e,className:t="",label:n=""}){const[i,r]=(0,s.useState)("unknown");return(0,s.useEffect)((()=>{const t=(0,v.C9)(e);"unknown"!==t&&r(t)}),[e]),(0,a.jsxs)("div",{className:`${t} ui--CryptoType`,children:[n,i]})}));let ce=0;const de=y.z.div`
  white-space: nowrap;

  .ui--FormatBalance {
    display: inline-block;
  }
`,ue=s.memo((function({className:e="",value:t}){const{t:n}=(0,R.$)(),i=(0,te.C)(),[r]=(0,s.useState)((()=>`${Date.now()}-democracy-locks-${++ce}`)),[{maxBalance:o,sorted:l},c]=(0,s.useState)({maxBalance:ie.nw,sorted:[]});return(0,s.useEffect)((()=>{i&&c((e=>{const s=function(e,t,n=[]){return{maxBalance:(0,oe.x)(...n.map((({balance:e})=>e)).filter((e=>!!e))),sorted:n.map((e=>[e,e.unlockAt&&e.unlockAt.gt(t)?e.unlockAt.sub(t):ie.nw])).sort(((e,t)=>(e[0].referendumId||ie.nw).cmp(t[0].referendumId||ie.nw))).sort(((e,t)=>e[1].cmp(t[1]))).sort(((e,t)=>e[0].isFinished===t[0].isFinished?0:e[0].isFinished?-1:1)).reduce(((t,[{balance:n,isDelegated:s,isFinished:i=!1,referendumId:r,vote:o},l])=>{const c=l.gt(ie.nw),d=r&&o?(0,a.jsxs)("div",{children:["#",r.toString()," ",(0,re.a)(n,{forceUnit:"-"})," ",o.conviction?.toString(),s&&"/d"]}):(0,a.jsx)("div",{children:e("Prior locked voting")}),u=t.length?t[t.length-1]:null;return!u||c||i!==u.isFinished?t.push({details:(0,a.jsx)("div",{className:"faded",children:c?(0,a.jsx)(ae.Z,{label:`${e("{{blocks}} blocks",{replace:{blocks:(0,g.u)(l)}})}, `,value:l}):e(i?"lock expired":"ongoing referendum")}),headers:[d],isCountdown:c,isFinished:i}):u.headers.push(d),t}),[])}}(n,i,t);return e.sorted.length!==s.sorted.length||e.sorted.some(((e,t)=>e.headers.length!==s.sorted[t].headers.length))?s:e}))}),[i,n,t]),l.length?(0,a.jsxs)(de,{className:e,children:[(0,a.jsx)(ne.Z,{labelPost:(0,a.jsx)(w.Z,{icon:"clock",tooltip:r}),value:o}),(0,a.jsx)(k.Z,{trigger:r,children:l.map((({details:e,headers:t},n)=>(0,a.jsxs)("div",{className:"row",children:[t.map(((e,t)=>(0,a.jsx)("div",{children:e},t))),(0,a.jsx)("div",{className:"faded",children:e})]},n)))})]}):null}));var me=n(38894);const he=y.z.div`
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
`,pe=s.memo((function({children:e,className:t="",isHeader:n,isLeft:i,isOpen:r,isPadded:o,onClick:l,renderChildren:c,summary:d,summaryHead:u,summaryMeta:m,summarySub:h,withBreaks:p,withHidden:g}){const[f,b]=(0,me.O)(r,l),x=(0,s.useMemo)((()=>f&&c&&c()),[f,c]),[v,A]=(0,s.useMemo)((()=>function(e){if(!e?.docs.length)return null;const t=e.docs.map((e=>e.toString().trim())),n=t.findIndex((e=>!e.length)),s=(i=(-1===n?t:t.slice(0,n)).join(" ").replace(/#(<weight>| <weight>).*<\/weight>/,"").replace(/\\/g,"").replace(/`/g,""),["[","]"].reduce(((e,t)=>function(e,t){return e.reduce(((e,n)=>n.split(t).reduce(((e,t)=>e.concat(t)),e)),[])}(e,t)),[i]));var i;return[s[0].split(/[.(]/)[0],(0,a.jsxs)(a.Fragment,{children:[s.map(((e,t)=>t%2?(0,a.jsxs)("em",{children:["[",e,"]"]},t):(0,a.jsx)("span",{children:e},t)))," "]})]}(m)||[h,h]),[m,h]),y=(0,s.useMemo)((()=>!!c||!!e&&(!Array.isArray(e)||0!==e.length)),[e,c]),k=(0,s.useMemo)((()=>(0,a.jsx)(w.Z,{color:y?void 0:"transparent",icon:f?"caret-up":"caret-down"})),[y,f]);return(0,a.jsxs)(he,{className:`${t} ui--Expander ${f?"isExpanded":""} ${n?"isHeader":""} ${o?"isPadded":""} ${y?"hasContent":""} ${p?"withBreaks":""}`,children:[(0,a.jsxs)("div",{className:"ui--Expander-summary"+(i?" isLeft":""),onClick:b,children:[i&&k,(0,a.jsxs)("div",{className:"ui--Expander-summary-header",children:[(0,a.jsx)("div",{className:"ui--Expander-summary-title",children:u}),d,A&&(0,a.jsx)("div",{className:"ui--Expander-summary-header-sub",children:f?A:v})]}),!i&&k]}),y&&(f||g)&&(0,a.jsx)("div",{className:"ui--Expander-content",children:e||x})]})})),ge=s.memo((function({className:e="",label:t,withEllipsis:n}){return(0,a.jsx)("label",{className:e,children:n?(0,a.jsx)("div",{className:"withEllipsis",children:t}):t})}));var fe=n(34814),be=n(9118),xe=n(74065),ve=n(86135),Ae=n(48731);const we=s.memo((function({accountId:e,className:t="",extrinsic:n,icon:i,isBasic:r,isBusy:o,isDisabled:l,isIcon:c,isToplevel:d,isUnsigned:u,label:m,onClick:h,onFailed:p,onSendRef:g,onStart:f,onSuccess:x,onUpdate:v,params:A,tooltip:w,tx:y,withSpinner:k,withoutLink:j}){const{t:N}=(0,R.$)(),C=(0,xe.X)(),{queueExtrinsic:E}=(0,ve.L)(),[S,I]=(0,s.useState)(!1),[B,D]=(0,s.useState)(!1);(0,s.useEffect)((()=>{B&&f&&f()}),[B,f]);const L=(0,s.useCallback)((e=>{C.current&&I(!1),p&&p(e)}),[p,I,C]),P=(0,s.useCallback)((e=>{C.current&&I(!1),x&&x(e)}),[x,I,C]),T=(0,s.useCallback)((()=>{C.current&&D(!0)}),[D,C]),V=(0,s.useCallback)((()=>{let t;n?t=Array.isArray(n)?n:[n]:y&&(t=[y(...(0,b.m)(A)?A():A||[])]),(0,Ae.hu)(t?.length,"Expected generated extrinsic passed to TxButton"),C.current&&k&&I(!0),t.forEach((t=>{E({accountId:e?.toString(),extrinsic:t,isUnsigned:u,txFailedCb:k?L:p,txStartCb:T,txSuccessCb:k?P:x,txUpdateCb:v})})),h&&h()}),[L,T,P,e,u,h,p,x,v,A,n,E,I,y,k,C]);return g&&(g.current=V),(0,a.jsx)(K,{className:t,icon:i||"check",isBasic:r,isBusy:o,isDisabled:S||l||!u&&!e||!y&&(Array.isArray(n)?0===n.length:!n),isIcon:c,isToplevel:d,label:m||(c?"":N("Submit")),onClick:V,tooltip:w,withoutLink:j})})),ye={transform:e=>e.isNone?0:e.unwrap().prior.length+1},ke=s.memo((function({className:e="",isPool:t,stakingInfo:n}){const{api:s}=(0,l.h)(),{allAccounts:i}=(0,fe.x)(),{t:r}=(0,R.$)(),o=(0,be.W7)(s.query.staking.slashingSpans,[n?.stashId],ye);return n?.redeemable?.gtn(0)?(0,a.jsx)("div",{className:e,children:(0,a.jsx)(ne.Z,{value:n.redeemable,children:i.includes((n.controllerId||"").toString())?(0,a.jsx)(we,{accountId:n.controllerId,icon:"lock",isIcon:!0,params:t?[n.controllerId,o]:1===s.tx.staking.withdrawUnbonded.meta.args.length?[o]:[],tooltip:r("Withdraw these unbonded funds"),tx:t?s.tx.nominationPools.withdrawUnbonded:s.tx.staking.withdrawUnbonded},"unlock"):(0,a.jsx)("span",{className:"icon-void",children:" "})})}):null}));var je=n(48801),Ne=n.n(je);const Ce=y.z.div`
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
`,Ee=s.memo((function({className:e="",iconPosition:t="left",stakingInfo:n}){const{api:i}=(0,l.h)(),r=(0,be.W7)(i.derive.session.progress),{t:o}=(0,R.$)(),[c,d,u]=(0,s.useMemo)((()=>function(e,t){if(!e?.unlocking||!t)return[[],ie.nw,!1];const n=t.eraProgress.gt(ie.nw)&&t.eraProgress.gt(t.eraLength),a=e.unlocking.filter((({remainingEras:e,value:t})=>t.gt(ie.nw)&&e.gt(ie.nw))).map((e=>[e,e.remainingEras,e.remainingEras.sub(ie.If).imul(t.eraLength).iadd(t.eraLength).isub(n?t.eraProgress.mod(t.eraLength):t.eraProgress)])),s=a.reduce(((e,[{value:t}])=>e.iadd(t)),new(Ne())(0));return[a,s,n]}(n,r)),[r,n]);if(!n||!c.length)return null;const m=`${n.accountId.toString()}-unlocking-trigger`;return(0,a.jsxs)(Ce,{className:e,children:["left"===t&&(0,a.jsx)(w.Z,{className:"left",icon:"clock",tooltip:m}),(0,a.jsx)(ne.Z,{value:d}),(0,a.jsx)(k.Z,{trigger:m,children:c.map((([{value:e},t,n],s)=>(0,a.jsxs)("div",{className:"row",children:[(0,a.jsx)("div",{children:o("Unbonding {{value}}",{replace:{value:(0,re.a)(e,{forceUnit:"-"})}})}),(0,a.jsx)("div",{className:"faded",children:i.consts.babe?.epochDuration?(0,a.jsx)(ae.Z,{label:`${o("{{blocks}} blocks",{replace:{blocks:(0,g.u)(n)}})}, `,value:n}):o("{{eras}} eras remaining",{replace:{eras:(0,g.u)(t)}})}),u&&(0,a.jsx)("div",{className:"faded",children:o("Era is overdue for completion due to current network operating conditions")})]},s)))}),"right"===t&&(0,a.jsx)(w.Z,{className:"right",icon:"clock",tooltip:m})]})})),Se={available:!0,bonded:!0,locked:!0,redeemable:!0,reserved:!0,total:!0,unlocking:!0,vested:!0},Ie={crypto:!0,nonce:!0},Be={unstakeThreshold:!0,validatorPayment:!0};function De(){return(0,a.jsx)("span",{className:"icon-void",children:" "})}function Le(e,t){const n=t.toHuman();try{return e[n]||n}catch{return n}}function Pe({stakingInfo:e,withBalance:t=!0,withValidatorPrefs:n=!1}){if(e)return!0;if(!0===t||n)return!1;if((0,se.K)(t)){if(t.unlocking||t.redeemable)return!1;if(t.bonded)return Array.isArray(t.bonded)}return!0}function Te({address:e,balancesAll:t,withExtended:n},s){const i=!0===n?Ie:n||void 0;return i?(0,a.jsxs)("div",{className:"column",children:[t&&i.nonce&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ge,{label:s("transactions")}),(0,a.jsx)("div",{className:"result",children:(0,g.u)(t.accountNonce)})]}),i.crypto&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ge,{label:s("type")}),(0,a.jsx)(le,{accountId:e,className:"result"})]})]}):null}function Ve({stakingInfo:e,withValidatorPrefs:t=!1},n){const s=!0===t?Be:t;return s&&e?.validatorPrefs?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{}),s.unstakeThreshold&&e.validatorPrefs.unstakeThreshold&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ge,{label:n("unstake threshold")}),(0,a.jsx)("div",{className:"result",children:e.validatorPrefs.unstakeThreshold.toString()})]}),s.validatorPayment&&(e.validatorPrefs.commission||e.validatorPrefs.validatorPayment)&&(e.validatorPrefs.validatorPayment?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ge,{label:n("commission")}),(0,a.jsx)(ne.Z,{className:"result",value:e.validatorPrefs.validatorPayment})]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ge,{label:n("commission")}),(0,a.jsxs)("span",{children:[(e.validatorPrefs.commission.unwrap().toNumber()/1e7).toFixed(2),"%"]})]}))]}):null}function Me(e,t,n,{address:i,balanceDisplay:r,balancesAll:o,bestNumber:l,convictionLocks:c,democracyLocks:d,isAllLocked:u,otherBonded:m,ownBonded:h,stakingInfo:p,votingOf:f,withBalanceToggle:b,withLabel:x}){const v=[],A=o;if(!b&&r.total&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:x?n("total"):""}),(0,a.jsx)(ne.Z,{className:"result "+(o?"":"--tmp"),formatIndex:e,labelPost:(0,a.jsx)(De,{}),value:o?o.freeBalance.add(o.reservedBalance):1})]},0)),o&&r.available&&(A.transferable||A.availableBalance)&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("transferable")}),(0,a.jsx)(ne.Z,{className:"result",formatIndex:e,labelPost:(0,a.jsx)(De,{}),value:A.transferable||A.availableBalance})]},1)),l&&r.vested&&A?.isVesting){const t=A.vesting.filter((({endBlock:e})=>l.lt(e)));v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("vested")}),(0,a.jsx)(ne.Z,{className:"result",formatIndex:e,labelPost:(0,a.jsx)(w.Z,{icon:"info-circle",tooltip:`${i}-vested-trigger`}),value:A.vestedBalance,children:(0,a.jsxs)(k.Z,{trigger:`${i}-vested-trigger`,children:[(0,a.jsxs)("div",{children:[(0,re.a)(A.vestedClaimable,{forceUnit:"-"}),(0,a.jsx)("div",{className:"faded",children:n("available to be unlocked")})]}),t.map((({endBlock:e,locked:t,perBlock:s,vested:i},r)=>(0,a.jsxs)("div",{className:"inner",children:[(0,a.jsxs)("div",{children:[(0,re.a)(i,{forceUnit:"-"}),(0,a.jsx)("div",{className:"faded",children:n("of {{locked}} vested",{replace:{locked:(0,re.a)(t,{forceUnit:"-"})}})})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(ae.Z,{value:e.sub(l)}),(0,a.jsxs)("div",{className:"faded",children:[n("until block")," ",(0,g.u)(e)]})]}),(0,a.jsxs)("div",{children:[(0,re.a)(s),(0,a.jsx)("div",{className:"faded",children:n("per block")})]})]},`item:${r}`)))]})})]},2))}const y=(A?.namedReserves||[]).reduce(((e,t)=>e.concat(...t)),[]),j=!!y&&0!==y.length;if(r.locked&&o&&(u||A.lockedBalance?.gtn(0))&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("locked")}),(0,a.jsx)(ne.Z,{className:"result",formatIndex:e,labelPost:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(w.Z,{icon:"info-circle",tooltip:`${i}-locks-trigger`}),(0,a.jsx)(k.Z,{trigger:`${i}-locks-trigger`,children:A.lockedBreakdown.map((({amount:e,id:s,reasons:i},r)=>(0,a.jsxs)("div",{className:"row",children:[e?.isMax()?n("everything"):(0,re.a)(e,{forceUnit:"-"}),s&&(0,a.jsx)("div",{className:"faded",children:Le(t,s)}),(0,a.jsx)("div",{className:"faded",children:i.toString()})]},r)))})]}),value:u?"all":A.lockedBalance})]},3)),r.reserved&&o?.reservedBalance?.gtn(0)&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("reserved")}),(0,a.jsx)(ne.Z,{className:"result",formatIndex:e,labelPost:j?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(w.Z,{icon:"info-circle",tooltip:`${i}-named-reserves-trigger`}),(0,a.jsx)(k.Z,{trigger:`${i}-named-reserves-trigger`,children:y.map((({amount:e,id:n},s)=>(0,a.jsxs)("div",{children:[(0,re.a)(e,{forceUnit:"-"}),n&&(0,a.jsx)("div",{className:"faded",children:Le(t,n)})]},s)))})]}):(0,a.jsx)(De,{}),value:o.reservedBalance})]},4)),r.bonded&&(h.gtn(0)||0!==m.length)&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("bonded")}),(0,a.jsx)(ne.Z,{className:"result",formatIndex:e,labelPost:(0,a.jsx)(De,{}),value:h,children:0!==m.length&&(0,a.jsxs)(a.Fragment,{children:[" (+",m.map(((t,n)=>(0,a.jsx)(ne.Z,{formatIndex:e,labelPost:(0,a.jsx)(De,{}),value:t},n))),")"]})})]},5)),r.redeemable&&p?.redeemable?.gtn(0)&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("redeemable")}),(0,a.jsx)(ke,{className:"result",stakingInfo:p})]},6)),r.unlocking){if(p?.unlocking&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("unbonding")}),(0,a.jsx)("div",{className:"result",children:(0,a.jsx)(Ee,{iconPosition:"right",stakingInfo:p})})]},7)),d&&0!==d.length)v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("democracy")}),(0,a.jsx)("div",{className:"result",children:(0,a.jsx)(ue,{value:d})})]},8));else if(l&&f&&f.isDirect){const{prior:[e,t]}=f.asDirect;t.gt(ie.nw)&&e.gt(ie.nw)&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("democracy")}),(0,a.jsx)("div",{className:"result",children:(0,a.jsx)(ue,{value:[{balance:t,isFinished:l.gt(e),unlockAt:e}]})})]},8))}if(l&&c?.length){const e=c.reduce(((e,{total:t})=>(0,oe.x)(e,t)),ie.nw);v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("referenda")}),(0,a.jsx)(ne.Z,{className:"result",labelPost:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(w.Z,{icon:"clock",tooltip:`${i}-conviction-locks-trigger`}),(0,a.jsx)(k.Z,{trigger:`${i}-conviction-locks-trigger`,children:c.map((({endBlock:e,locked:t,refId:s,total:i},r)=>(0,a.jsxs)("div",{className:"row",children:[(0,a.jsxs)("div",{className:"nowrap",children:["#",s.toString()," ",(0,re.a)(i,{forceUnit:"-"})," ",t]}),(0,a.jsx)("div",{className:"faded nowrap",children:e.eq(ie.Ew)?n("ongoing referendum"):l.gte(e)?n("lock expired"):(0,a.jsxs)(a.Fragment,{children:[(0,g.u)(e.sub(l))," ",n("blocks"),", ",(0,a.jsx)(ae.Z,{isInline:!0,value:e.sub(l)})]})})]},r)))})]}),value:e})]},9))}}return o&&o.accountNonce&&r.nonce&&v.push((0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:n("transactions")}),(0,a.jsxs)("div",{className:"result",children:[(0,g.u)(o.accountNonce),(0,a.jsx)(De,{})]})]},10)),b?(0,a.jsx)(s.Fragment,{children:(0,a.jsx)(pe,{className:o?"":"isBlurred",summary:(0,a.jsx)(ne.Z,{formatIndex:e,value:o?.freeBalance.add(o.reservedBalance)}),children:0!==v.length&&(0,a.jsx)("div",{className:"body column",children:v})})},e):(0,a.jsx)(s.Fragment,{children:v},e)}function Fe(e,t,n,a){const{address:s,balancesAll:i,convictionLocks:r,democracyLocks:o,stakingInfo:l,votingOf:c,withBalance:d=!0,withBalanceToggle:u=!1,withLabel:m=!1}=e,h=!0===d?Se:d||!1;if(!h)return[null];const[p,g]=function(e,t){let n=[],a=ie.nw;return Array.isArray(t)?(n=t.filter(((e,t)=>0!==t)).filter((e=>e.gt(ie.nw))),a=t[0]):e?.stakingLedger?.active&&e.accountId.eq(e.stashId)&&(a=e.stakingLedger.active.unwrap()),[a,n]}(l,h.bonded),f={address:s,balanceDisplay:h,bestNumber:n,convictionLocks:r,democracyLocks:o,isAllLocked:!!i&&i.lockedBreakdown.some((({amount:e})=>e?.isMax())),otherBonded:g,ownBonded:p,votingOf:c,withBalanceToggle:u,withLabel:m},b=[Me(0,t,a,{...f,balancesAll:i,stakingInfo:l})];return u&&i?.additional.length&&i.additional.forEach(((e,n)=>{b.push(Me(n+1,t,a,{...f,balancesAll:e}))})),b}const ze=(0,ee.withMulti)((0,y.z)((function(e){const{t}=(0,R.$)(),n=(0,te.C)(),{children:i,className:r="",extraInfo:o,withBalanceToggle:l,withHexSessionId:c}=e,d=(0,s.useRef)({democrac:t("via Democracy/Vote"),phrelect:t("via Council/Vote"),pyconvot:t("via Referenda/Vote"),"staking ":t("via Staking/Bond"),"vesting ":t("via Vesting")});return(0,a.jsxs)("div",{className:`${r} ui--AddressInfo ${l?"ui--AddressInfo-expander":""}`,children:[(0,a.jsxs)("div",{className:"column"+(l?" column--expander":""),children:[Fe(e,d.current,n,t),c?.[0]&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ge,{label:t("session keys")}),(0,a.jsx)("div",{className:"result",children:c[0]})]}),c&&c[0]!==c[1]&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ge,{label:t("session next")}),(0,a.jsx)("div",{className:"result",children:c[1]})]}),Ve(e,t),o&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{}),o.map((([e,t],n)=>(0,a.jsxs)(s.Fragment,{children:[(0,a.jsx)(ge,{label:e}),(0,a.jsx)("div",{className:"result",children:t})]},`label:${n}`)))]})]}),Te(e,t),i&&(0,a.jsx)("div",{className:"column",children:i})]})}))`
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
  `,(0,ee.withCalls)(["derive.balances.all",{paramName:"address",propName:"balancesAll",skipIf:function({withBalance:e=!0,withExtended:t=!1}){if(!0===e||!0===t)return!1;if((0,se.K)(e)){if(e.available||e.locked||e.reserved||e.total||e.vested)return!1}else if((0,se.K)(t)&&t.nonce)return!1;return!0}}],["derive.staking.account",{paramName:"address",propName:"stakingInfo",skipIf:Pe}],["derive.democracy.locks",{paramName:"address",propName:"democracyLocks",skipIf:Pe}],["query.democracy.votingOf",{paramName:"address",propName:"votingOf",skipIf:Pe}])),Ze={available:!0,bonded:!0,free:!0,locked:!0,reserved:!0,total:!0},Re=y.z.section`
  .balanceExpander {
    justify-content: flex-start;

    .column {
      width: auto;
      max-width: 18.57rem;

      label {
        text-align: left;
        color: inherit;
      }

      .ui--Expander-content .ui--FormatBalance-value {
        font-size: var(--font-size-small);
      }
    }
  }
`,$e=s.memo((function({address:e,className:t}){const{t:n}=(0,R.$)();return(0,a.jsxs)(Re,{className:t,children:[(0,a.jsx)("div",{className:"ui--AddressMenu-sectionHeader",children:n("balance")}),(0,a.jsx)(ze,{address:e,className:"balanceExpander",withBalance:Ze,withLabel:!0},e)]})}));var qe=n(11677);const He=(0,qe.e)("useRegistrars",(function(e){const{apiIdentity:t}=(0,l.h)(),{allAccounts:n,hasAccounts:a}=(0,fe.x)(),i=(0,be.W7)(!e&&t.query.identity?.registrars);return(0,s.useMemo)((()=>{const e=(i||[]).map(((e,t)=>({address:e.isSome?e.unwrap().account.toString():null,index:t}))).filter((e=>!!e.address));return{isRegistrar:a&&e.some((({address:e})=>n.includes(e))),registrars:e}}),[n,a,i])}));var Ue=n(19008),We=n(28097),Oe=n(74076),Qe=n(9652),Ge=n(51304),Je=n(16039),Ke=n(47025);function Ye(e){return!(!e||!e.toHuman)}const Xe=s.memo((function({className:e="",forceIconType:t,prefix:n,size:i=24,theme:r,value:o}){const{apiEndpoint:c,isEthereum:d,specName:u,systemName:m}=(0,l.h)(),{t:h}=(0,R.$)(),{queueAction:p}=(0,ve.L)(),g=r||function(e,t,n){return"default"===Je.X.icon&&(e?.ui?.identityIcon||(0,Qe.t)(t,n))||Je.X.icon}(c,m,u),f="robohash"===g?Ke.Z:void 0,b=(0,s.useCallback)((e=>p({account:e,action:h("clipboard"),message:h("address copied"),status:"queued"})),[p,h]);return(0,a.jsx)(Ge.ZP,{Custom:f,className:`ui--Identicon-React-Base ${e}`,onCopy:b,prefix:n,size:i,theme:t||(d?"ethereum":g),value:Ye(o)?o.toString():o})}));var _e=n(36609);function et({className:e="",label:t,value:n}){let s;if(Array.isArray(n)){const e=n.filter(((e,t)=>0!==t)),t=e.reduce(((e,t)=>e.add(t)),ie.nw).gtn(0);t&&(s=e.map(((e,t)=>(0,a.jsx)(ne.Z,{value:e},t))))}return(0,a.jsx)(ne.Z,{className:`${e} ui--Balance`,label:t,value:Array.isArray(n)?n[0]:n,children:s&&(0,a.jsxs)("span",{children:[" (+",s,")"]})})}const tt=s.memo((function(e){const{balance:t,className:n="",label:s,params:i}=e;return i?t?(0,a.jsx)(a.Fragment,{children:et({className:n,label:s,value:t})}):(0,a.jsx)(_e.Z,{className:`${n} ui--Balance`,label:s,params:i}):null})),nt={transform:e=>e.unwrapOr(null)},at={transform:e=>e.unwrapOr(null)},st=s.memo((function({children:e,className:t="",label:n,params:s}){const{api:i}=(0,l.h)(),r=(0,be.W7)(i.query.staking?.bonded,[s],nt),o=(0,be.W7)(r&&i.query.staking?.ledger,[r],at);return(0,a.jsx)(ne.Z,{className:t,label:n,value:o?.active,children:e})})),it=s.memo((function(e){const{bonded:t,className:n="",label:s,params:i}=e;return i?t?(0,a.jsx)(a.Fragment,{children:et({className:n,label:s,value:t})}):(0,a.jsx)(st,{className:`${n} ui--Bonded`,label:s,params:i}):null})),rt=s.memo((function({children:e,className:t="",label:n,params:s}){const{api:i}=(0,l.h)(),r=(0,be.W7)(i.derive.council.votesOf,[s]);return r?.stake.gtn(0)?(0,a.jsx)(ne.Z,{className:t,label:n,value:r?.stake,children:e}):null})),ot=s.memo((function({className:e="",label:t,params:n}){return n?(0,a.jsx)(rt,{className:`${e} ui--LockedVote`,label:t,params:n}):null})),lt=y.z.div`
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
`,ct=s.memo((function({balance:e,bonded:t,children:n,className:s="",iconInfo:i,isHighlight:r,isPadded:o=!0,label:l,labelBalance:c,nameExtra:d,onNameClick:u,summary:m,value:h,withAddress:p=!0,withBalance:g=!1,withBonded:f=!1,withLockedVote:b=!1,withName:x=!0,withShrink:v=!1,withSidebar:A=!0}){return h?(0,a.jsxs)(lt,{className:`${s} ui--AddressMini ${r?"isHighlight":""} ${o?"padded":""} ${v?"withShrink":""}`,children:[l&&(0,a.jsx)("label",{className:"ui--AddressMini-label",children:l}),(0,a.jsxs)("span",{className:"ui--AddressMini-icon",children:[(0,a.jsx)(Xe,{value:h}),i&&(0,a.jsx)("div",{className:"ui--AddressMini-icon-info",children:i})]}),(0,a.jsxs)("span",{className:"ui--AddressMini-info",children:[p&&(0,a.jsx)("span",{className:"ui--AddressMini-address",onClick:u,children:x?(0,a.jsx)(F,{value:h,withSidebar:A,children:d}):(0,a.jsx)("span",{className:"shortAddress",children:h.toString()})}),n]}),(0,a.jsxs)("div",{className:"ui--AddressMini-balances",children:[g&&(0,a.jsx)(tt,{balance:e,label:c,params:h}),f&&(0,a.jsx)(it,{bonded:t,label:"",params:h}),b&&(0,a.jsx)(ot,{params:h}),m&&(0,a.jsx)("div",{className:"ui--AddressMini-summary",children:m})]})]}):null})),dt=y.z.div`
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
`,ut=s.memo((function({children:e,className:t="",icon:n,isBig:s,subtitle:i,title:r}){return(0,a.jsxs)(dt,{className:["ui--AvatarItem",t,s&&"big"].join(" "),children:[(0,a.jsx)("div",{className:"ui--AvatarItem-icon",children:n}),(0,a.jsxs)("div",{className:"ui--AvatarItem-details",children:[(0,a.jsx)("div",{className:"ui--AvatarItem-title",children:r}),(0,a.jsx)("div",{className:"ui--AvatarItem-subtitle",children:i})]}),e]})})),mt=y.z.a`
  .ui--Icon {
    margin-right: 0.5em;
  }
`,ht=s.memo((function({className:e="",href:t,icon:n,label:s,onClick:i,rel:r,target:o}){return(0,a.jsxs)(mt,{className:e,href:t,onClick:i,rel:r,target:o,children:[n&&(0,a.jsx)(w.Z,{icon:n}),s]})}));const pt=e=>e.filter((([,e])=>!e.isFeePaid)),gt=e=>e.filter((([,e])=>e.isKnownGood)),ft=e=>e.filter((([,e])=>e.isReasonable)),bt=e=>e.filter((([,e])=>e.isErroneous)),xt=e=>e.filter((([,e])=>e.isLowQuality));const vt=(0,qe.e)("useJudgements",(function(e){const{identity:t}=(0,z.B)(e),{registrars:n}=He(),a=(0,s.useMemo)((()=>function(e){if(!e)return[];const t=function(e){const t=pt(e),n=gt(t),a=ft(t);return{Erroneous:bt(t),"Known good":n,"Low quality":xt(t),Reasonable:a}}(e.judgements),n=[];for(const e in t){const s=e;0!==t[s].length&&n.push({judgementName:s,registrarsIndexes:(a=t[s],a.map((e=>e[0])))})}var a;return n}(t)),[t]);return(0,s.useMemo)((()=>function(e,t){return e.map((({judgementName:e,registrarsIndexes:n})=>({judgementName:e,registrars:n.map((e=>(e=>t.find((t=>t.index===e)))(e.toNumber())))})))}(a,n)),[n,a])}));var At=n(17608);const wt=y.z.div`
  align-items: center;
  color: #8B8B8B;
  var(--font-size-small);
  display: flex;

  & .parent-icon {
    font-size: var(--font-size-percent-small);
    margin-right: 0.3rem;
    margin-left: 0.15rem;
  }
`,yt=s.memo((function({address:e,className:t}){return(0,a.jsxs)(wt,{className:t,"data-testid":"parent",children:[(0,a.jsx)(w.Z,{className:"parent-icon",icon:"code-branch"}),(0,a.jsx)(F,{value:e,withSidebar:!0})]})})),kt=y.z.div`
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
`,jt=s.memo((function({children:e,className:t="",defaultName:n,onClickName:s,overrideName:i,parentAddress:r,toggle:o,value:l,withShortAddress:c=!1,withSidebar:d=!0}){return(0,a.jsxs)(kt,{className:`${t} ui--AddressSmall ${r||c?"withPadding":""}`,children:[(0,a.jsx)("span",{className:"ui--AddressSmall-icon",children:(0,a.jsx)(Xe,{value:l})}),(0,a.jsxs)("span",{className:"ui--AddressSmall-info",children:[r&&(0,a.jsx)("div",{className:"parentName",children:(0,a.jsx)(yt,{address:r})}),(0,a.jsx)(F,{className:"accountName "+(d?"withSidebar":""),defaultName:n,onClick:s,override:i,toggle:o,value:l,withSidebar:d,children:e}),l&&c&&(0,a.jsx)("div",{className:"shortAddress","data-testid":"short-address",children:l.toString()})]})]})})),Nt=y.z.div`
  margin: 0.25rem 0 1rem;
  border-top: 1px solid var(--border-table);

  &:first-child, &:last-child {
    display: none
  }
`,Ct=s.memo((function({className:e=""}){return(0,a.jsx)(Nt,{className:`${e} ui--Menu__Divider`})})),Et=y.z.div`
  color: var(--color-label);
  font-size: var(--font-size-tiny);
  line-height: 0.857rem;
  margin-bottom: 0.3rem;
`,St=s.memo((function({children:e,className:t}){return(0,a.jsx)(Et,{className:t,children:e})})),It=y.z.div`
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
`,Bt=s.memo((function({children:e,className:t="",icon:n,isDisabled:i,label:r,onClick:o}){const l=(0,s.useCallback)((()=>{!i&&o&&Promise.resolve(o()).catch(console.error)}),[i,o]);return(0,a.jsxs)(It,{className:`${t} ui--Menu__Item ${n?"hasIcon":""} ${i?"isDisabled":""}`,onClick:l,children:[n&&(0,a.jsx)(w.Z,{color:"darkGray",icon:n}),r,e]})})),Dt=y.z.div`
  display: flex;
  flex-direction: column;
  min-width: 14.286rem;
  margin: 1rem 0;

  & > *:not(.ui--Menu__Item):not(.ui--Menu__Divider) {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`,Lt=s.memo((function({children:e,className:t=""}){return(0,a.jsx)(Dt,{className:`${t} ui--Menu`,children:e})}));Lt.Divider=Ct,Lt.Item=Bt,Lt.Header=St;const Pt=Lt,Tt=(0,qe.e)("useOutsideClick",(function(e,t){const n=(0,s.useCallback)((n=>{e.length&&!function(e,t){return e.some((e=>e.current&&e.current.contains(t.target)))}(e,n)&&t()}),[e,t]);(0,s.useEffect)((()=>(document.addEventListener("click",n,!0),()=>{document.removeEventListener("click",n,!0)})),[n,t])}));var Vt=n(28316);const Mt=14*.8;function Ft(e,t){return"left"===t?e-Mt:"right"===t?Mt:e/2}function zt(e,t,n,a,s){const{height:i,y:r}=t;return"bottom"===e?a.height-i-r-14>n:s<56?r-(56-s)>n:r>n}function Zt(e,t,n){return"bottom"===t?e/2:-1*(e/2+n+Mt)}function Rt(e,t,n,a){return"bottom"===t?e+n.height-a-14:e<56?56:e}const $t=(0,qe.e)("useScroll",(function(){const[e,t]=(0,s.useState)(window.scrollY),n=(0,s.useCallback)((()=>t(window.scrollY)),[]);return(0,s.useEffect)((()=>(window.addEventListener("scroll",n),()=>{window.removeEventListener("scroll",n)})),[n]),e}));var qt=n(91012);const Ht=(0,qe.e)("useWindowSize",(function(){return(0,s.useContext)(qt.d)})),Ut=(0,qe.e)("useElementPosition",(function(e){const[t,n]=(0,s.useState)(),a=(0,xe.X)(),i=Ht(),r=$t();return(0,s.useEffect)((()=>{if(a.current&&e?.current){const{height:t,width:a,x:s,y:i}=e.current.getBoundingClientRect();n({height:t,width:a,x:s,y:i})}}),[a,e,r,i]),t})),Wt={x:0,y:0},Ot=(0,qe.e)("usePopupWindow",(function(e,t,n){const[a,i]=(0,s.useState)(Wt),[r,o]=(0,s.useState)("top"),l=Ut(e),c=Ut(t),d=$t(),u=Ht();return(0,s.useEffect)((()=>{u&&c&&o(c.y>u.height/2?"top":"bottom")}),[c,u]),(0,s.useEffect)((()=>{l&&c&&i(function(e,t,n,a,s,i){const r=e.x+e.width/2,o=e.y+s+e.height/2;return{x:r-Ft(a.width,t),y:zt(n,e,a.height,i,s)?o+Zt(e.height,n,a.height):Rt(s,n,i,a.height)}}(c,n,r,l,d,u))}),[n,d,c,r,l,u]),(0,s.useMemo)((()=>({pointerStyle:r,renderCoords:a})),[a,r])})),Qt=y.z.div`
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
`,Gt=s.memo((function({children:e,className:t="",position:n,triggerRef:s,windowRef:i}){const{pointerStyle:r,renderCoords:{x:o,y:l}}=Ot(i,s,n);return(0,Vt.createPortal)((0,a.jsx)(Qt,{className:`${t} ${r}Pointer ${n}Position`,"data-testid":"popup-window",ref:i,style:o&&l&&{transform:`translate3d(${o}px, ${l}px, 0)`,zIndex:1e3}||void 0,children:e}),document.body)})),Jt=y.z.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`,Kt=s.memo((function({children:e,className:t="",closeOnScroll:n,isDisabled:i,onCloseAction:r,position:o="left",value:l}){const{themeClassName:c}=(0,A.F)(),[d,u,m]=(0,me.O)(!1),h=(0,s.useRef)(null),p=(0,s.useRef)(null),g=(0,s.useCallback)((()=>m(!1)),[m]),f=(0,s.useMemo)((()=>[h,p]),[h,p]);return Tt(f,g),(0,s.useEffect)((()=>(n&&document.addEventListener("scroll",g,!0),()=>document.removeEventListener("scroll",g,!0))),[n,g,m]),(0,s.useEffect)((()=>{!d&&r&&r()}),[d,r]),(0,a.jsxs)(Jt,{className:`${t} ui--Popup ${c}`,children:[d&&(0,a.jsx)(Gt,{position:o,triggerRef:h,windowRef:p,children:l}),(0,a.jsx)("div",{"data-testid":"popup-open",onClick:u,ref:h,children:e??(0,a.jsx)(K,{className:d?"isOpen":"",icon:"ellipsis-v",isDisabled:i,isReadOnly:!1})})]})})),Yt=s.memo((function({judgement:{judgementName:e,registrars:t}}){const n=(0,s.useMemo)((()=>{return"Erroneous"===(t=e)||"Low quality"===t?"red":"green";var t}),[e]);return(0,a.jsx)(Kt,{closeOnScroll:!0,position:"middle",value:(0,a.jsx)(Pt,{children:t.map((e=>e&&(0,a.jsx)(jt,{value:e.address},e.address)))}),children:(0,a.jsx)(At.Z,{color:n,label:`${t.length} ${e}`,size:"tiny"})})})),Xt=y.z.div`
  margin-top: 0.714rem;

  &:not(.no-judgements) {
    .ui--Tag:hover {
      cursor: pointer;
    }
  }
`,_t=s.memo((function({address:e,className:t=""}){const{t:n}=(0,R.$)(),s=vt(e);return 0===s.length?(0,a.jsx)("div",{className:`${t} no-judgements`,"data-testid":"judgements",children:(0,a.jsx)(At.Z,{color:"yellow",label:n("No judgements"),size:"tiny"},"NoJudgements")}):(0,a.jsx)(Xt,{className:t,"data-testid":"judgements",children:s.map((t=>(0,a.jsx)(Yt,{judgement:t},`${e}${t.judgementName}`)))})}));var en=n(25294),tn=n(33749),nn=n(23729),an=n.n(nn),sn=n(69187),rn=n(99374),on=n(1346),ln=n(17751),cn=n(61162),dn=n(72282),un=n.n(dn),mn=n(54371);const hn=()=>{},pn=y.z.div`
  .copySpan {
    white-space: nowrap;
  }
`,gn=s.memo((function({children:e,className:t="",icon:n="copy",label:i,type:r,value:o}){const{t:l}=(0,R.$)(),{queueAction:c}=(0,ve.L)(),d=(0,s.useCallback)((()=>{c&&c({action:l("clipboard"),message:l("{{type}} copied",{replace:{type:r||l("value")}}),status:"queued"})}),[r,c,l]);return(0,mn.H)(o)?(0,a.jsx)(pn,{className:`${t} ui--CopyButton`,children:(0,a.jsx)(un(),{onCopy:d,text:o,children:(0,a.jsxs)("div",{className:"copyContainer",children:[e,(0,a.jsx)("span",{className:"copySpan",children:(0,a.jsx)(K,{className:"icon-button show-on-hover",icon:n,isDisabled:!o,label:i,onClick:hn})})]})})}):null}));var fn=n(12493);const bn=s.memo((function({children:e,className:t="",copyValue:n,defaultValue:s,isFull:i,isHidden:r,isSmall:o,label:l,value:c,withCopy:d,withLabel:u}){return(0,a.jsxs)(fn.Z,{className:t,isFull:i,isHidden:r,isSmall:o,label:l,withLabel:u,children:[(0,a.jsxs)("div",{className:"ui--Static ui dropdown selection disabled",children:[c||s,e]}),d&&(0,a.jsx)(gn,{value:n||c||s})]})})),xn=y.z.div`
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
`,vn=s.memo((function({address:e,className:t=""}){return(0,a.jsxs)(xn,{className:`${t} ui--KeyPair`,children:[(0,a.jsx)(Xe,{className:"icon",value:e}),(0,a.jsx)("div",{className:"name",children:(0,a.jsx)(F,{value:e})}),(0,a.jsx)("div",{className:"address",children:e})]})}));function An(e,t=!0){const n="ethereum"===sn.Nn.keyring.type?20:32;try{if((0,x.m)(e.key).length>=n)return{...e,text:(0,a.jsx)(vn,{address:e.key||"",isUppercase:t,name:e.name})}}catch{}return null}const wn="options:InputAddress",yn="all",kn=[];function jn(e){try{return(0,v.Hc)(e,!1,"ethereum"===sn.Nn.keyring.type?20:32)||null}catch{}return null}function Nn(e){if(!e)return null;return jn(e)||null}function Cn(e){let t;const n=sn.Nn.getAccount(e);let a;if(n)a=n.meta.name;else{const n=sn.Nn.getAddress(e);n?(a=n.meta.name,t=n.meta.isRecent):t=!0}return An((0,rn.e)(e,a),!t)}function En(){return an().get(wn)||{defaults:{}}}function Sn(e=yn){return En().defaults[e]}function In(e=yn,t){const n=En();n.defaults[e]=t,an().set(wn,n)}function Bn(e){return e.reduce(((e,t,n)=>(e.some((({key:e},a)=>a!==n&&e===t.key))||e.push(t),e)),[])}class Dn extends s.PureComponent{state={};static getDerivedStateFromProps({type:e,value:t},{lastValue:n}){try{return{lastValue:n||Sn(e),value:Array.isArray(t)?t.map((e=>(0,v.Hc)(e))):(0,v.Hc)(t)||void 0}}catch{return null}}render(){const{className:e="",defaultValue:t,hideAddress:n=!1,isDisabled:s=!1,isError:i,isMultiple:r,label:o,labelExtra:l,options:c,optionsAll:d,placeholder:u,type:m=yn,withEllipsis:h,withLabel:p}=this.props;if(!(c&&0!==c.length||d&&0!==Object.keys(d[m]).length||s))return(0,a.jsx)(bn,{className:e,label:o,children:"No accounts are available for selection."});const{lastValue:g,value:f}=this.state,b=this.getLastOptionValue(),x=jn(s||t&&"0x"!==t&&(this.hasValue(t)||"allPlus"===m)?t:this.hasValue(g)?g:b?.value),v=c?Bn(c.map((e=>An(e))).filter((e=>!!e))):s&&x?[Cn(x)].filter((e=>!!e)):x?this.addActual(x):this.getFiltered(),A=r||!(0,on.o)(f)?void 0:x;return(0,a.jsx)(Ln,{className:`${e} ui--InputAddress ${n?"hideAddress":""}`,defaultValue:A,isDisabled:s,isError:i,isMultiple:r,label:o,labelExtra:l,onChange:r?this.onChangeMulti:this.onChange,onSearch:this.onSearch,options:v,placeholder:u,renderLabel:r?this.renderLabel:void 0,value:r&&!f?kn:f,withEllipsis:h,withLabel:p})}addActual(e){const t=this.getFiltered();return this.hasValue(e)?t:t.concat(...[Cn(e)].filter((e=>!!e)))}renderLabel=({value:e})=>{if(e)return(0,v.s2)(e)};getLastOptionValue(){const e=this.getFiltered();return e.length?e[e.length-1]:void 0}hasValue(e){const t=e?.toString();return this.getFiltered().some((({value:e})=>e===t))}getFiltered(){const{filter:e,optionsAll:t,type:n=yn,withExclude:a=!1}=this.props;return t?Bn(t[n]).filter((({value:t})=>!e||!!t&&(a?!e.includes(t):e.includes(t)))):[]}onChange=e=>{const{filter:t,onChange:n,type:a}=this.props;!t&&In(a,e),n&&n(e&&(this.hasValue(e)||"allPlus"===a&&(0,cn.U)(e))?Nn(e):null)};onChangeMulti=e=>{const{onChangeMulti:t}=this.props;t&&t(e.map(Nn).filter((e=>!!e)))};onSearch=(e,t)=>{const{isInput:n=!0}=this.props,a=t.trim(),s=a.toLowerCase(),i=e.filter((e=>!!e.value&&"string"==typeof e.name&&(e.name.toLowerCase?.().includes(s)||e.value.toString().toLowerCase().includes(s))));if(n&&0===i.length){const e=Nn(a);if(e){const t=sn.Nn.saveRecent(e.toString()).option;i.push({key:t.key,name:t.name,value:t.value||void 0})}}return i.filter(((e,t)=>{const n=t===i.length-1,a=i[t+1],s=a?.value;return!((0,ln.F)(e.value)||(0,on.o)(e.value))||!n&&!!s}))}}const Ln=(0,y.z)(en.Z)`
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
`,Pn=(0,ee.withMulti)(Dn,(0,ee.withObservable)(sn.Nn.keyringOption.optionsSubject,{propName:"optionsAll",transform:e=>Object.entries(e).reduce(((e,[t,n])=>(e[t]=n.map((e=>null===e.value?function(e){return(0,a.jsx)(en.Z.Header,{content:e.name},e.key||e.name)}(e):An(e))).filter((e=>!!e)),e)),{})}));Pn.createOption=An,Pn.setLastValue=In;const Tn=Pn,Vn=y.z.article`
  .ui--Icon {
    color: rgba(255, 12, 12, 1);
    margin-right: 0.5rem;
  }
`,Mn=s.memo((function({children:e,className:t="",content:n}){return(0,a.jsxs)(Vn,{className:`${t} mark error`,children:[(0,a.jsx)(w.Z,{icon:"exclamation-triangle"}),n,e]})}));var Fn=n(31383);function zn(e="<unknown>"){return(0,a.jsx)(a.Fragment,{children:e.split("\n").map(((e,t)=>(0,a.jsx)("div",{children:e},t)))})}class Zn extends s.Component{state={error:null,prevTrigger:null};static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps({trigger:e},{prevTrigger:t}){const n=JSON.stringify({trigger:e});return t!==n?{error:null,prevTrigger:n}:null}componentDidCatch(e){const{doThrow:t,onError:n}=this.props;if(n&&n(),t)throw e}render(){const{children:e,error:t,t:n}=this.props,{error:s}=this.state,i=t||s;return i?(0,a.jsxs)("article",{className:"error extraMargin",children:[(0,a.jsx)("p",{children:n("Uncaught error. Something went wrong with the query and rendering of this component. Please supply all the details below when logging an issue, it may help in tracing the cause.")}),(0,a.jsx)("p",{children:i.message}),zn(i.stack)]}):e}}const Rn=(0,R.Z)(Zn),$n=y.z.div`
  background-color: var(--bg-input);
  border-radius: 0 0 4px 4px;

  .ui--Button-Group {
    margin: 1rem 1rem;
  }
`,qn=s.memo((function({children:e,className:t=""}){return(0,a.jsx)($n,{className:`${t} ui--Modal-Actions`,children:(0,a.jsx)(K.Group,{children:e})})})),Hn=y.z.div`
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
`,Un=s.memo((function({align:e="left",children:t,className:n="",hint:s}){return(0,a.jsxs)(Hn,{className:`${n} ui--Modal-Columns ${e}Align`,children:[(0,a.jsx)("div",{className:"ui--Modal-Columns-content",children:t}),s&&(0,a.jsx)("div",{className:"ui--Modal-Columns-hint",children:s})]})})),Wn=y.z.div`
  padding: 1.5rem;
`,On=s.memo((function({children:e,className:t=""}){return(0,a.jsx)(Wn,{className:`${t} ui--Modal-Content`,children:e})})),Qn=y.z.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem 0;
`,Gn=s.memo((function({className:e="",header:t,onClose:n}){return(0,a.jsxs)(Qn,{className:`${e} ui--Modal-Header`,children:[t&&(0,a.jsx)("h1",{children:t}),(0,a.jsx)(K,{dataTestId:"close-modal",icon:"times",onClick:n})]})})),Jn=Fn.vJ`
  body {
    overflow: hidden;
  }
`,Kn=y.z.div`
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
`,Yn=s.memo((function({children:e,className:t="",header:n,onClose:i,size:r="medium",testId:o="modal"}){const{themeClassName:l}=(0,A.F)(),c=(0,s.useCallback)((e=>{"Escape"!==e.key&&27!==e.keyCode||i()}),[i]);return(0,s.useEffect)((()=>(window.addEventListener("keydown",c,!0),()=>{window.removeEventListener("keydown",c,!0)})),[c]),(0,Vt.createPortal)((0,a.jsxs)(Kn,{className:`${t} ui--Modal ${r}Size ${l} `,"data-testid":o,children:[(0,a.jsx)(Jn,{}),(0,a.jsx)("div",{className:"ui--Modal__overlay",onClick:i}),(0,a.jsxs)("div",{className:"ui--Modal__body",children:[(0,a.jsx)(Gn,{header:n,onClose:i}),(0,a.jsx)(Rn,{children:e})]})]}),document.body)}));Yn.Actions=qn,Yn.Columns=Un,Yn.Content=On;const Xn=Yn,_n=[{text:"Unknown",value:0},{text:"Fee paid",value:1},{text:"Reasonable",value:2},{text:"Known good",value:3},{text:"Out of date",value:4},{text:"Low quality",value:5}],ea={transform:e=>{const t=e.isSome?e.unwrap():null;return t?Array.isArray(t)?t[0].info.hash.toHex():t.info.hash.toHex():null}},ta=s.memo((function({address:e,registrars:t,toggleJudgement:n}){const{t:i}=(0,R.$)(),{apiIdentity:r,enableIdentity:o}=(0,l.h)(),c=(0,be.W7)(r.query.identity.identityOf,[e],ea),[d]=(0,s.useState)((()=>t.map((({address:e})=>e)))),[u,m]=(0,s.useState)(null),[h,p]=(0,s.useState)(2),[g,f]=(0,s.useState)(-1);return(0,s.useEffect)((()=>{const e=t.find((({address:e})=>u===e));f(e?e.index:-1)}),[u,t]),(0,a.jsxs)(Xn,{header:i("Provide judgement"),onClose:n,size:"small",children:[(0,a.jsxs)(Xn.Content,{children:[(0,a.jsx)(Tn,{filter:d,label:i("registrar account"),onChange:m,type:"account"}),(0,a.jsx)(tn.ZP,{isDisabled:!0,label:i("registrar index"),value:-1===g?i("invalid/unknown registrar account"):g.toString()}),(0,a.jsx)(en.Z,{label:i("judgement"),onChange:p,options:_n,value:h}),c?(0,a.jsx)(tn.ZP,{defaultValue:c,isDisabled:!0,label:i("identity hash")}):null===c?(0,a.jsx)(Mn,{content:i("No identity associated with account")}):(0,a.jsx)(W,{noLabel:!0})]}),(0,a.jsx)(Xn.Actions,{children:(0,a.jsx)(we,{accountId:u,icon:"check",isDisabled:!o||!c||-1===g,label:i("Judge"),onStart:n,params:4===r.tx.identity.provideJudgement.meta.args.length?[g,e,h,c]:[g,e,h],tx:r.tx.identity.provideJudgement})})]})})),na=s.memo((function(){return(0,a.jsxs)("svg",{fill:"none",height:"40",viewBox:"0 0 40 40",width:"40",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",children:[(0,a.jsx)("circle",{cx:"20",cy:"20",fill:"url(#pattern0)",r:"20"}),(0,a.jsxs)("defs",{children:[(0,a.jsx)("pattern",{height:"1",id:"pattern0",patternContentUnits:"objectBoundingBox",width:"1",children:(0,a.jsx)("use",{transform:"scale(0.00277778)",xlinkHref:"#image0"})}),(0,a.jsx)("image",{height:"360",id:"image0",width:"360",xlinkHref:"data:image/png;base64,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"})]})]})})),aa=s.memo((function({address:e,identity:t}){const{t:n}=(0,R.$)(),{apiIdentity:i}=(0,l.h)(),{isRegistrar:r,registrars:o}=He(),[c,d]=(0,me.O)(),u=(0,Ue.x)(e),m=(0,s.useMemo)((()=>u?.map((e=>(0,a.jsx)(ct,{className:"subs",isPadded:!1,value:e},e.toString())))),[u]);return t&&t.isExistent&&i.query.identity?.identityOf?(0,a.jsxs)("section",{className:"withDivider","data-testid":"identity-section",children:[(0,a.jsxs)("div",{className:"ui--AddressMenu-section ui--AddressMenu-identity",children:[(0,a.jsx)("div",{className:"ui--AddressMenu-sectionHeader",children:n("identity")}),(0,a.jsxs)("div",{children:[(0,a.jsx)(ut,{icon:(0,a.jsx)(na,{}),subtitle:t.legal,title:t.display}),(0,a.jsx)(_t,{address:e}),(0,a.jsxs)("div",{className:"ui--AddressMenu-identityTable",children:[t.parent&&(0,a.jsxs)("div",{className:"tr parent",children:[(0,a.jsx)("div",{className:"th",children:n("parent")}),(0,a.jsx)("div",{className:"td",children:(0,a.jsx)(ct,{className:"parent",isPadded:!1,value:t.parent})})]}),t.email&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("email")}),(0,a.jsx)("div",{className:"td",children:(0,Oe.vq)(t.email)||!t.isKnownGood?t.email:(0,a.jsx)("a",{href:`mailto:${t.email}`,rel:"noopener noreferrer",target:"_blank",children:t.email})})]}),t.web&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("website")}),(0,a.jsx)("div",{className:"td",children:(0,Oe.vq)(t.web)||!t.isKnownGood?t.web:(0,a.jsx)("a",{href:t.web.replace(/^(https?:\/\/)?/g,"https://"),rel:"noopener noreferrer",target:"_blank",children:t.web})})]}),t.twitter&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("twitter")}),(0,a.jsx)("div",{className:"td",children:(0,Oe.vq)(t.twitter)||!t.isKnownGood?t.twitter:(0,a.jsx)("a",{href:t.twitter.startsWith("https://twitter.com/")?t.twitter:`https://twitter.com/${t.twitter}`,rel:"noopener noreferrer",target:"_blank",children:t.twitter})})]}),t.other&&We.n6 in t.other&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("discord")}),(0,a.jsx)("div",{className:"td",children:t.other[We.n6]})]}),t.github&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("github")}),(0,a.jsx)("div",{className:"td",children:t.github})]}),t.matrix&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("matrix")}),(0,a.jsx)("div",{className:"td",children:t.matrix})]}),t.discord&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("discord")}),(0,a.jsx)("div",{className:"td",children:t.discord})]}),t.riot&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("riot")}),(0,a.jsx)("div",{className:"td",children:t.riot})]}),!!u?.length&&(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th top",children:n("subs")}),(0,a.jsx)("div",{className:"td","data-testid":"subs",children:u.length>4?(0,a.jsx)(pe,{summary:u.length,children:m}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"subs-number",children:u.length}),m]})})]})]})]})]}),r&&(0,a.jsx)("div",{className:"ui--AddressMenu-section",children:(0,a.jsx)("div",{className:"ui--AddressMenu-actions",children:(0,a.jsx)("ul",{children:(0,a.jsx)("li",{children:(0,a.jsx)(ht,{icon:"address-card",label:n("Add identity judgment"),onClick:d})})})})}),c&&r&&(0,a.jsx)(ta,{address:e,registrars:o,toggleJudgement:d},"modal-judgement")]}):null})),sa=s.memo((function({isMultisig:e,meta:t}){const{t:n}=(0,R.$)();if(!e||!t)return null;const{threshold:s,who:i}=t;return(0,a.jsxs)("section",{className:"ui--AddressMenu-multisig withDivider",children:[(0,a.jsx)("div",{className:"ui--AddressMenu-sectionHeader",children:n("multisig")}),(0,a.jsxs)("div",{className:"ui--AddressMenu-multisigTable",children:[(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th",children:n("threshold")}),(0,a.jsxs)("div",{className:"td",children:[s,"/",i?.length]})]}),(0,a.jsxs)("div",{className:"tr",children:[(0,a.jsx)("div",{className:"th signatories",children:n("signatories")}),(0,a.jsx)("div",{className:"td",children:i?.map((e=>(0,a.jsx)(ct,{value:e},e)))})]})]})]})}));var ia=n(53657),ra=n(2727),oa=n(67609),la=n(17965),ca=n(44294);const da=y.z.article`
  .ui--Icon {
    color: rgba(255, 196, 12, 1);
    margin-right: 0.5rem;
  }
`,ua=s.memo((function({children:e,className:t="",content:n,withIcon:s=!0}){return(0,a.jsxs)(da,{className:`${t} mark warning`,children:[s&&(0,a.jsx)(w.Z,{icon:"exclamation-triangle"}),n,e]})})),ma=y.z.div`
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
`,ha=s.memo((function({className:e="",isDisabled:t,isRadio:n,label:i,onChange:r,preventDefault:o,value:l}){const c=(0,s.useCallback)((e=>{t||(o&&(e.preventDefault(),e.stopPropagation()),r&&r(!l))}),[t,r,o,l]);return(0,a.jsxs)(ma,{className:`${e} ui--Toggle ${l?"isChecked":""} ${t?"isDisabled":""} ${n?"isRadio":""}`,onClick:c,children:[i&&(0,a.jsx)("label",{children:i}),(0,a.jsx)("div",{className:"ui--Toggle-Slider "+(n?"highlight--before-border":"")})]})}));var pa=n(14081);const ga=(0,y.z)(Xn)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`,fa=s.memo((function({className:e="",onClose:t,recipientId:n,senderId:i}){const{t:r}=(0,R.$)(),{api:o}=(0,l.h)(),[c,d]=(0,s.useState)(ie.nw),[u]=(0,s.useState)(!0),[m,h]=(0,s.useState)(!0),[p,g]=(0,s.useState)(!1),[f,x]=(0,s.useState)(),[[v,A],w]=(0,s.useState)([null,!1]),[y,k]=(0,s.useState)(null),[j,N]=(0,s.useState)(null),[[,C],E]=(0,s.useState)([null,null]),S=(0,be.W7)(o.derive.balances?.all,[i||j]),I=(0,be.W7)(o.query.system.account,[i||j]);(0,s.useEffect)((()=>{const e=i||j,t=n||y;e&&x((0,pa.L)(e)),S&&S.accountId?.eq(e)&&e&&t&&o.call.transactionPaymentApi&&o.tx.balances?(0,la.Y)((async()=>{try{const n=(o.tx.balances.transferAllowDeath||o.tx.balances.transfer)(t,S.transferable||S.availableBalance),{partialFee:a}=await n.paymentInfo(e),s=a.muln(110).div(ie.S8),i=(S.transferable||S.availableBalance).sub(s);w(o.consts.balances&&i.gt(o.consts.balances.existentialDeposit)?[i,!1]:[null,!0])}catch(e){console.error(e)}})):w([null,!1])}),[o,S,n,i,y,j]),(0,s.useEffect)((()=>{(async function(e,t){return[null,t?await(0,ra.fF)(t):null]})(0,n||y).then(E).catch(console.error)}),[n,i,y,j]);const B=!I||(function(e){return!!e.refcount}(I)?I.refcount.isZero():I.consumers.isZero()),D=!m&&S&&S.accountId?.eq(i||j)&&v&&B;return(0,a.jsxs)(ga,{className:"app--accounts-Modal",header:r("Send funds"),onClose:t,size:"large",children:[(0,a.jsx)(Xn.Content,{children:(0,a.jsxs)("div",{className:e,children:[(0,a.jsx)(Xn.Columns,{hint:r("The transferred balance will be subtracted (along with fees) from the sender account."),children:(0,a.jsx)(Tn,{defaultValue:i,isDisabled:!!i,label:r("send from account"),labelExtra:(0,a.jsx)(oa.Z,{label:r("transferable"),params:i||j}),onChange:N,type:"account"})}),(0,a.jsxs)(Xn.Columns,{hint:r("The beneficiary will have access to the transferred fees when the transaction is included in a block."),children:[(0,a.jsx)(Tn,{defaultValue:n,isDisabled:!!n,label:r("send to address"),labelExtra:(0,a.jsx)(oa.Z,{label:r("transferable"),params:n||y}),onChange:k,type:"allPlus"}),C&&(0,a.jsx)(Mn,{content:r("The recipient is associated with a known phishing site on {{url}}",{replace:{url:C}})})]}),(0,a.jsx)(Xn.Columns,{hint:r("If the recipient account is new, the balance needs to be more than the existential deposit. Likewise if the sending account balance drops below the same value, the account will be removed from the state."),children:D&&p?(0,a.jsx)(ca.Z,{autoFocus:!0,defaultValue:v,isDisabled:!0,label:r("transferable minus fees")},v?.toString()):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(ca.Z,{autoFocus:!0,isError:!u,isZeroable:!0,label:r("amount"),maxValue:v,onChange:d}),(0,a.jsx)(ca.Z,{defaultValue:o.consts.balances?.existentialDeposit,isDisabled:!0,label:r("existential deposit")})]})}),(0,a.jsxs)(Xn.Columns,{hint:r("With the keep-alive option set, the account is protected against removal due to low balances."),children:[(0,b.m)(o.tx.balances?.transferKeepAlive)&&(0,a.jsx)(ha,{className:"typeToggle",label:r(m?"Transfer with account keep-alive checks":"Normal transfer without keep-alive checks"),onChange:h,value:m}),D&&(0,a.jsx)(ha,{className:"typeToggle",label:r("Transfer the full account balance, reap the sender"),onChange:g,value:p}),f&&f.isHardware&&(0,a.jsx)(ua,{content:r(`You are using the Ledger ${Je.X.ledgerApp.toUpperCase()} App. If you would like to switch it, please go the "manage ledger app" in the settings.`)}),!m&&!B&&(0,a.jsx)(ua,{content:r("There is an existing reference count on the sender account. As such the account cannot be reaped from the state.")}),A&&(0,a.jsx)(ua,{content:r("The transaction, after application of the transfer fees, will drop the available balance below the existential deposit. As such the transfer will fail. The account needs more free funds to cover the transaction fees.")})]})]})}),(0,a.jsx)(Xn.Actions,{children:(0,a.jsx)(we,{accountId:i||j,icon:"paper-plane",isDisabled:!((p||u&&c)&&(n||y)&&!C),label:r("Make Transfer"),onStart:t,params:D&&p?(0,b.m)(o.tx.balances?.transferAll)?[n||y,!1]:[n||y,v]:[n||y,c],tx:D&&p&&(0,b.m)(o.tx.balances?.transferAll)?o.tx.balances?.transferAll:m?o.tx.balances?.transferKeepAlive:o.tx.balances?.transferAllowDeath||o.tx.balances?.transfer})})]})})),ba=y.z.div`
  width: 100%;

  .ui--Button-Group {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 0;
  }
`,xa=s.memo((function({className:e="",flags:t,isEditing:n,isEditingName:i,onCancel:r,onForgetAddress:o,onSaveName:c,onSaveTags:d,onUpdateName:u,recipientId:m,toggleIsEditingName:h,toggleIsEditingTags:p}){const{t:g}=(0,R.$)(),[f,x]=(0,me.O)(),v=(0,l.h)(),A=(0,s.useCallback)((()=>{o(),u&&u()}),[o,u]),w=(0,s.useCallback)((()=>{t.isEditable&&h(),p()}),[t.isEditable,h,p]),y=(0,s.useCallback)((()=>{c(),u&&u()}),[c,u]),k=(0,s.useCallback)((()=>{i&&(t.isInContacts||t.isOwned)&&(y(),h())}),[i,t.isInContacts,t.isOwned,y,h]),j=(0,s.useCallback)((()=>{n&&(k(),d()),w()}),[n,w,k,d]);return(0,a.jsxs)(ba,{className:`${e} ui--AddressMenu-buttons`,children:[n?(0,a.jsxs)(K.Group,{children:[(0,a.jsx)(K,{icon:"times",label:g("Cancel"),onClick:r}),(0,a.jsx)(K,{icon:"save",label:g("Save"),onClick:j})]}):(0,a.jsxs)(K.Group,{children:[((0,b.m)(v.api.tx.balances?.transferAllowDeath)||(0,b.m)(v.api.tx.balances?.transfer))&&(0,a.jsx)(K,{icon:"paper-plane",isDisabled:n,label:g("Send"),onClick:x}),!t.isOwned&&!t.isInContacts&&(0,a.jsx)(K,{icon:"plus",isDisabled:n,label:g("Save"),onClick:y}),!t.isOwned&&t.isInContacts&&(0,a.jsx)(K,{icon:"ban",isDisabled:n,label:g("Remove"),onClick:A}),(0,a.jsx)(K,{icon:"edit",isDisabled:!t.isEditable,label:g("Edit"),onClick:j})]}),f&&(0,a.jsx)(fa,{onClose:x,recipientId:m},"modal-transfer")]})})),va=s.memo((function({accountIndex:e,defaultValue:t,editingName:n,flags:s,onChange:i,value:r}){const{t:o}=(0,R.$)(),[l,c]=(0,me.O)(),d=()=>{};return(0,a.jsxs)("div",{className:"ui--AddressSection",children:[(0,a.jsx)(Xe,{size:80,value:r}),(0,a.jsxs)("div",{className:"ui--AddressSection__AddressColumn",children:[(0,a.jsx)(F,{override:n?(0,a.jsx)(tn.ZP,{className:"name--input",defaultValue:t,label:"name-input",onChange:i,withLabel:!1}):s.isEditable?t.toUpperCase()||o("<unknown>"):void 0,value:r,withSidebar:!1}),(0,a.jsx)("div",{className:"ui--AddressMenu-addr",children:r}),e&&(0,a.jsxs)("div",{className:"ui--AddressMenu-index",children:[(0,a.jsxs)("label",{children:[o("index"),":"]})," ",e]})]}),(0,a.jsx)("div",{className:"ui--AddressSection__CopyColumn",children:(0,a.jsx)("div",{className:"ui--AddressMenu-copyaddr",children:(0,a.jsx)(un(),{text:r,children:(0,a.jsx)("span",{children:(0,a.jsx)(K.Group,{children:(0,a.jsx)(K,{icon:l?"check":"copy",label:o(l?"Copied":"Copy"),onClick:l?d:c,onMouseLeave:l?c:d})})})})})})]})})),Aa=(0,y.z)(At.Z)`
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
`,wa=s.memo((function({className:e="",color:t,label:n}){return(0,a.jsx)(Aa,{className:`${e} ${"theme"===t?" highlight--color-bg highlight--bg":""}`,color:t,label:n,size:"tiny"})})),ya=y.z.div`
  .ui--Tag {
    margin: 0.2rem 1rem 0.2rem 0.571rem;
  }
`,ka=s.memo((function({className:e="",flags:{isCouncil:t,isDevelopment:n,isExternal:s,isInjected:i,isMultisig:r,isNominator:o,isProxied:l,isSociety:c,isSudo:d,isTechCommittee:u,isValidator:m}}){const{t:h}=(0,R.$)(),p=t||n||s||i||r||l||c||d||u||m||o;return p?(0,a.jsxs)(ya,{className:`${e} ui--AddressMenu-flags`,children:[p&&(0,a.jsx)("h5",{children:h("Flags")}),(0,a.jsxs)("div",{children:[m&&(0,a.jsx)(wa,{color:"theme",label:h("Validator")}),o&&(0,a.jsx)(wa,{color:"theme",label:h("Nominator")}),s&&(r?(0,a.jsx)(wa,{color:"green",label:h("Multisig")}):l?(0,a.jsx)(wa,{color:"grey",label:h("Proxied")}):(0,a.jsx)(wa,{color:"grey",label:h("External")})),i&&(0,a.jsx)(wa,{color:"grey",label:h("Injected")}),n&&(0,a.jsx)(wa,{color:"grey",label:h("Test account")}),t&&(0,a.jsx)(wa,{color:"blue",label:h("Council")}),c&&(0,a.jsx)(wa,{color:"green",label:h("Society")}),u&&(0,a.jsx)(wa,{color:"orange",label:h("Technical committee")}),d&&(0,a.jsx)(wa,{color:"pink",label:h("Sudo key")})]})]}):null})),ja=s.memo((function({accountIndex:e,address:t,isBeingEdited:n,onUpdateName:i,sidebarRef:r}){const{flags:o,isEditing:l,isEditingName:c,isEditingTags:d,name:u,onForgetAddress:m,onSaveName:h,onSaveTags:p,setIsEditingName:g,setIsEditingTags:f,setName:b,setTags:x,tags:v,toggleIsEditingName:A,toggleIsEditingTags:w}=(0,z.B)(t),y=(0,s.useMemo)((()=>[r]),[r]);(0,s.useEffect)((()=>{n(l())}),[n,l]);const k=(0,s.useCallback)((()=>{if(l())try{const e=sn.Nn.getAccount(t)||sn.Nn.getAddress(t);b(e?.meta.name||""),x(e?.meta.tags?e.meta.tags.sort():[]),g(!1),f(!1)}catch{}}),[l,b,x,g,f,t]);return Tt(y,k),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(va,{accountIndex:e,defaultValue:u,editingName:c,flags:o,onChange:b,value:t}),(0,a.jsx)("div",{className:"ui--AddressMenu-tags","data-testid":"sidebar-tags",children:(0,a.jsx)(ia.Z,{isEditable:!0,isEditing:d,onChange:x,value:v,withEditButton:!1,withTitle:!0})}),(0,a.jsx)(ka,{flags:o}),(0,a.jsx)(xa,{flags:o,isEditing:l(),isEditingName:c,onCancel:k,onForgetAddress:m,onSaveName:h,onSaveTags:p,onUpdateName:i,recipientId:t,toggleIsEditingName:A,toggleIsEditingTags:w})]})})),Na=(0,y.z)(X)`
  display: flex;
  flex-direction: column;
  background-color: var(--bg-sidebar);
  max-width: 30.42rem;
  min-width: 30.42rem;
  overflow-y: hidden;
  padding: 0 0 3.286rem;

  input {
    width: auto !important;
  }

  .ui--AddressMenu-header {
    align-items: center;
    background: var(--bg-tabs);
    border-bottom: 1px solid var(--border-table);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.35rem 1rem 1rem 1rem;
  }

  .ui--AddressSection {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;

    .ui--AddressSection__AddressColumn {
      flex: 1;
      margin-left: 1rem;

      .ui--AccountName {
        max-width: 21.5rem;
        overflow: hidden;
        white-space: normal;
      }
    }

    .ui--AddressSection__CopyColumn {
      margin-left: 1rem;

      .ui--AccountName {
        max-width: 10rem;
        overflow: hidden;
      }
    }
  }

  .ui--AddressMenu-addr,
  .ui--AddressMenu-index {
    text-align: left;
    font-size: var(--font-size-small);
  }

  .ui--AddressMenu-addr {
    word-break: break-all;
    width: 24ch;
    margin: 0.571rem 0;
    color: var(--color-label);
  }

  .ui--AddressMenu-copyaddr,
  .ui--AddressMenu-index {
    text-align: left;
    font-size: var(--font-size-small);
  }

  .ui--AddressMenu-copyaaddr {
    word-break: break-all;
    width: 12ch;
    margin: 0.371rem 0;
    color: var(--color-label);
  }


  .ui--AddressMenu-index {
    display: flex;
    flex-direction: row;

    label {
      font-size: var(--font-size-small);
      margin-right: 0.4rem;
      text-transform: capitalize;
    }
  }

  section {
    position: relative;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    .ui--AddressMenu-sectionHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: capitalize;

      margin-bottom: 0.57rem;
      width: 100%;

      color: var(--color-text);
      font-size: 1.143rem;
    }

    &.withDivider {
      padding-top: 1rem;

      ::before {
        position: absolute;
        top: 0;
        left: 0;

        content: '';
        width: 100%;
        height: 1px;
        background-color: var(--border-table);
      }
    }
  }

  .ui--AddressMenu-identity,
  .ui--AddressMenu-multisig {
    .ui--AddressMenu-identityTable,
    .ui--AddressMenu-multisigTable {
      font-size: var(--font-size-small);
      margin-top: 0.6rem;

      .tr {
        padding: 0.25rem 0;
        display: inline-flex;
        align-items: center;
        width: 100%;

        .th {
          text-transform: uppercase;
          color: var(--color-label);
          font-weight: var(--font-weight-normal);
          text-align: left;
          flex-basis: 25%;
          font-size: var(--font-size-tiny);

          &.top {
            align-self: flex-start;
          }
        }

        .td {
          flex: 1;
          overflow: hidden;
          padding-left: 0.6rem;
          text-overflow: ellipsis;
        }
      }

      .ui--AddressMini, .subs-number {
        margin-bottom: 0.4rem;
        padding: 0;
      }

      .subs-number {
        font-size: var(--font-size-base);
        margin-bottom: 0.714rem;
      }
    }

    .parent {
      padding: 0 !important;
    }
  }

  && .column {
    align-items: center;

    .ui--FormatBalance:first-of-type {
      margin-bottom: 0.4rem;
    }

    .ui--FormatBalance {
      line-height: 1rem;
    }
  }

  .ui--AddressMenu-buttons {
    .ui--Button-Group {
      margin-bottom: 0;
    }
  }

  .ui--AddressMenu-tags,
  .ui--AddressMenu-flags {
    margin: 0.75rem 0 0;
    width: 100%;
  }

  .ui--AddressMenu-identityIcon {
    background: ${_.Iv}66;
  }

  .ui--AddressMenu-actions {
    ul {
      list-style-type: none;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 1rem;

      li {
        margin: 0.2rem 0;
      }
    }
  }

  .inline-icon {
    cursor: pointer;
    margin: 0 0 0 0.5rem;
    color: ${_.Iv};
  }

  .name--input {
    .ui.input {
      margin: 0 !important;

      > input {
      }
    }
  }

  &.inEditMode {
    .ui--AddressMenu-flags {
      opacity: 60%;
    }
  }

  .ui--AddressMenu-multisig .th.signatories {
    align-self: flex-start;
  }

  .ui--ScrollSection {
    padding: 1rem;
    overflow: auto;
  }

  .ui--LinkSection {
    border-top: 1px solid var(--border-table);
    padding: 0.5rem 0 0.571rem;
    width: 100%;
    position: absolute;
    bottom: 0;

    span {
      margin: 0 0.5rem;
    }
  }
`,Ca=s.memo((function({address:e,className:t="",dataTestId:n,onClose:i,onUpdateName:r}){const[o,l]=(0,s.useState)(!1),{accountIndex:c,flags:d,identity:u,meta:m}=(0,z.B)(e),h=(0,s.useRef)(null);return(0,a.jsxs)(Na,{className:`${t}${o?" inEditMode":""}`,dataTestId:n,onClose:i,position:"right",sidebarRef:h,children:[(0,a.jsx)("div",{className:"ui--AddressMenu-header","data-testid":"sidebar-address-menu",children:(0,a.jsx)(ja,{accountIndex:c,address:e,isBeingEdited:l,onUpdateName:r,sidebarRef:h})}),(0,a.jsxs)("div",{className:"ui--ScrollSection",children:[(0,a.jsx)($e,{address:e}),(0,a.jsx)(aa,{address:e,identity:u}),(0,a.jsx)(sa,{isMultisig:d.isMultisig,meta:m})]}),(0,a.jsx)("section",{className:"ui--LinkSection",children:(0,a.jsx)(H,{data:e,isSidebar:!0,type:"address"})})]})})),Ea=[null,null],Sa=s.memo((function({children:e}){const[[t,n],i]=(0,s.useState)(Ea),r=(0,s.useCallback)((()=>i([null,null])),[]);return(0,a.jsxs)(c.Provider,{value:i,children:[e,t&&(0,a.jsx)(Ca,{address:t,dataTestId:"account-sidebar",onClose:r,onUpdateName:n})]})}));var Ia=n(16613);const Ba="5".padEnd(48,"x"),Da=(0,y.z)(Ia.Z)`
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
`,La=s.memo((function({buttons:e,children:t,className:n,defaultName:s,fullLength:i=!1,isContract:r=!1,isDisabled:o,isEditableName:l,isInline:c,isValid:d,overlay:u,value:m,withTags:h=!1}){const{accountIndex:p,isNull:g,name:f,onSaveName:b,onSaveTags:x,setName:v,setTags:A,tags:w}=(0,z.B)(m?m.toString():null,r),y=!g&&(d||m||p),k=m?Xe:Ge.ZP,j=m&&y?m:Ba;return(0,a.jsxs)(Da,{address:j,buttons:e,className:n,defaultName:s,icon:(0,a.jsx)(k,{size:32,value:m?m.toString():null}),isDisabled:o,isEditableName:l,isEditableTags:!0,isInline:c,isShortAddr:!i,name:f,onChangeName:v,onChangeTags:A,onSaveName:b,onSaveTags:x,tags:h?w:void 0,children:[t,u]})})),Pa=y.z.div`
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
`,Ta=s.memo((function({address:e,className:t="",filter:n,isHidden:i,noToggle:o,onChange:c,value:d}){const{apiIdentity:u}=(0,l.h)(),m=(0,r.Y)(e),h=(0,s.useMemo)((()=>!m||(0,v.r7)(u,e,m,n,!1)),[e,n,m,u]),p=(0,s.useCallback)((()=>c&&c(!d)),[c,d]);return(0,a.jsxs)(Pa,{className:`${t} ui--AddressToggle ${d||o?"isAye":"isNay"} ${i||!h?"isHidden":""}`,onClick:p,children:[(0,a.jsx)(ct,{className:"ui--AddressToggle-address",value:e,withSidebar:!1}),!o&&(0,a.jsx)("div",{className:"ui--AddressToggle-toggle",children:(0,a.jsx)(ha,{label:"",value:d})})]})})),Va=s.memo((function({className:e="",label:t,params:n}){return n?(0,a.jsx)(oa.Z,{className:`${e} ui--Available`,label:t,params:n}):null})),Ma=s.memo((function(){const{t:e}=(0,R.$)(),{api:t}=(0,l.h)();return(0,b.m)(t.tx.utility.batchAll)?null:(0,a.jsx)(ua,{content:e("This chain does not yet support atomic batch operations. This means that if the transaction gets executed and one of the operations do fail (due to invalid data or lack of available funds) some of the changes made may not be applied.")})}));s.memo((function({className:e="",isDisabled:t,label:n,onClick:s,tabIndex:i}){const{t:r}=(0,R.$)();return(0,a.jsx)(K,{className:e,icon:"times",isDisabled:t,label:n||r("Cancel"),onClick:s,tabIndex:i})}));const Fa=y.z.article`
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
`,za=s.memo((function({children:e,className:t="",isError:n,isSuccess:s,withBottomMargin:i}){return(0,a.jsx)(Fa,{className:`${t} ui--Card ${n&&!s?"error":""} ${!n&&s?"success":""} ${i?"withBottomMargin":""}`,children:e})}));var Za=n(12372);const Ra=s.memo((function({angle:e,type:t}){return(0,a.jsx)("div",{className:`clip ${t}`,children:(0,a.jsx)("div",{className:"highlight--bg",style:{transform:`rotate(${e}deg)`}})})})),$a="3.5rem",qa=y.z.div`
  border-radius: 100%;
  clip-path: circle(50%);
  height: ${$a};
  position: relative;
  width: ${$a};

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
`,Ha=s.memo((function({className:e="",isBlurred:t,isDisabled:n,total:s,value:i}){const r=(0,Za.G)(s||0),o=r.gtn(0)?(0,Za.G)(i||0).muln(36e3).div(r).toNumber()/100:0;if(o<0)return null;const l=360===o?360:o%360;return(0,a.jsxs)(qa,{className:`${e} ui--Progress ${n?"isDisabled":""} ${t?"--tmp":""}`,children:[(0,a.jsx)("div",{className:"background highlight--bg"}),(0,a.jsx)(Ra,{angle:l<=180?l.toFixed(1):"180",type:"first"}),(0,a.jsx)(Ra,{angle:l<=180?"0":(l-180).toFixed(1),type:"second"}),(0,a.jsx)("div",{className:"inner",children:(0,a.jsxs)("div",{children:[Math.floor(100*o/360),"%"]})})]})})),Ua=y.z.article`
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
`,Wa=s.memo((function({children:e,className:t="",label:n,progress:s}){const i=s?.value,r=s?.total,o=s&&!(0,on.o)(i)&&!(0,on.o)(r)&&i.gten(0)&&r.gtn(0)?i.gt(r)?`>${s.isPercent?"100":(0,g.u)(r)}`:s.isPercent?i.mul(ie.S8).div(r).toString():(0,g.u)(i):void 0;if(s&&(0,on.o)(o))return null;const l=s&&s.withTime&&!(0,on.o)(s.total),c=(n??"").toString();return(0,a.jsxs)(Ua,{className:t,"data-testid":`card-summary:${c}`,children:[(0,a.jsxs)(fn.Z,{isSmall:!0,label:n,children:[e,s&&!s.hideValue&&(0,a.jsxs)(a.Fragment,{children:[l&&!e&&(0,a.jsx)(ae.Z,{className:s.isBlurred?"--tmp":"",value:s.total}),(0,a.jsx)("div",{className:l?"isSecondary":"isPrimary",children:!o||(0,on.o)(s.total)?"-":l&&!s.isPercent&&s.value?(0,a.jsx)(ae.Z,{className:(s.isBlurred?"--tmp":"")+" timer",value:s.total.sub(s.value)}):`${o}${s.isPercent?"":"/"}${s.isPercent?"%":(0,g.u)(s.total)}`})]})]}),s&&!s.hideGraph&&(0,a.jsx)(Ha,{...s})]})}));var Oa=n(33318),Qa=n(84522);const Ga=(0,Oa.Rf)((()=>"")),Ja="\n  background: white;\n  border-radius: 50%;\n  box-sizing: border-box;\n  color: #333;\n\n  &.isInline {\n    display: inline-block;\n    height: 24px;\n    margin-right: 0.75rem;\n    vertical-align: middle;\n    width: 24px;\n  }\n",Ka=(0,y.z)(w.Z)`${Ja}`,Ya=y.z.img`${Ja}`,Xa=s.memo((function({className:e="",isInline:t,logo:n,onClick:i,withoutHl:r}){const{apiEndpoint:o}=(0,l.h)(),[c,d,u]=(0,s.useMemo)((()=>{const e=Ga.find((e=>e.info===n)),t=e?.ui.logo||n||o?.ui.logo,a=t||Qa.h,[s,i]=a&&"empty"!==a&&(a.startsWith("data:")||a.startsWith("fa;"))?a.startsWith("fa;")?[!0,a.substring(3)]:[!1,a]:[!1,Qa.h];return[!t||"empty"===n,i,s]}),[o,n]),m=`${e} ui--ChainImg ${c&&!r?"highlight--bg":""} ${t?"isInline":""}`;return u?(0,a.jsx)(Ka,{className:m,icon:d}):(0,a.jsx)(Ya,{alt:"chain logo",className:m,onClick:i,src:d})}));var _a=n(22581);const es=(0,y.z)(ha)`
  text-align: right;
`,ts=s.memo((function({className:e="",genesisHash:t,isDisabled:n,onChange:i}){const{t:r}=(0,R.$)(),{api:o,isDevelopment:c}=(0,l.h)(),d=(0,s.useMemo)((()=>function(e,t){return!!t&&(Object.values(_a.p).find((t=>t.includes(e)))||[e]).includes(t)}(o.genesisHash.toHex(),t)),[o,t]),u=(0,s.useCallback)((e=>i(e?o.genesisHash.toHex():null)),[o,i]);return c?null:(0,a.jsx)(es,{className:e,isDisabled:n,label:r("only this network"),onChange:u,preventDefault:!0,value:d})}));var ns=n(24468),as=n(94858),ss=n(74844),is=n(93738);const rs=y.z.div`
  position: relative;
  display: inline-block;
  padding: 1em 1em 0;
  height: 15vw;
  width: 15vw;
`,os=s.memo((function({children:e,className:t=""}){return(0,a.jsx)(rs,{className:`${t} ui--Chart`,children:e})})),ls=s.memo((function({className:e="",size:t=100,values:n}){const s={colorHover:[],colorNormal:[],data:[],labels:[]};return n.forEach((({colors:[e="#00f",t],label:n,value:a})=>{s.colorNormal.push(e),s.colorHover.push(t||e),s.data.push((0,Za.G)(a).toNumber()),s.labels.push(n)})),(0,a.jsx)(os,{className:`${e} ui--Chart-Doughnut`,children:(0,a.jsx)(is.$I,{data:{datasets:[{backgroundColor:s.colorNormal,data:s.data,hoverBackgroundColor:s.colorHover}],labels:s.labels},height:t,width:t})})}));var cs=n(65968),ds=n(88858);function us(e){return ds.c(e).alpha(.65).rgbString()}const ms=s.memo((function({aspectRatio:e=8,className:t="",max:n=100,showLabels:i=!1,values:r}){const[{chartData:o,chartOptions:l,jsonValues:c},d]=(0,s.useState)({});return(0,s.useEffect)((()=>{const t=JSON.stringify(r);t!==c&&d(function(e,t,n,a,s){return{chartData:t.reduce(((e,{colors:[t="#00f",n],label:a,value:s})=>{const i=e.datasets[0];return i.backgroundColor.push(us(t)),i.hoverBackgroundColor.push(us(n||t)),i.data.push((0,cs.h)(s)?s:(0,Za.G)(s).toNumber()),e.labels.push(a),e}),{datasets:[{backgroundColor:[],data:[],hoverBackgroundColor:[]}],labels:[]}),chartOptions:{aspectRatio:e,plugins:{legend:{display:!1},tooltip:{callbacks:{label:e=>t[e.dataIndex].tooltip||t[e.dataIndex].label}}},scales:{x:s?{beginAtZero:!0,max:a}:{display:!1}}},jsonValues:n}}(e,r,t,n,i))}),[e,c,n,i,r]),o?(0,a.jsx)("div",{className:`${t} ui--Chart-HorizBar`,children:(0,a.jsx)(is.$Q,{data:o,height:null,options:l,width:null})}):null}));var hs=n(33403),ps=n(6485);const gs=["#ff8c00","#008c8c","#8c008c"],fs={animation:{duration:0},elements:{point:{hoverRadius:6,radius:0}},hover:{intersect:!1},interaction:{intersect:!1,mode:"index"},plugins:{crosshair:{line:{color:"#ff8c00",dashPattern:[5,5],width:2},snap:{enabled:!0},sync:{enabled:!0},zoom:{enabled:!1}},legend:{display:!1},tooltip:{intersect:!1}},scales:{x:{ticks:{maxRotation:60,minRotation:60}}}},bs=y.z.div`
  h1.ui--Chart-Header {
    margin-bottom: 0.25rem;
    margin-top: 1rem;
    padding-left: 0.25rem;
  }
`,xs=s.memo((function({className:e="",colors:t,labels:n,legends:i,options:r,title:o,values:l}){const c=(0,s.useMemo)((()=>function(e={}){return(0,hs.Z)({},fs,e,{plugins:(0,hs.Z)({},fs.plugins,e.plugins,{annotation:(0,hs.Z)({},fs.plugins?.annotation,e.plugins?.annotation),crosshair:(0,hs.Z)({},fs.plugins?.crosshair,e.plugins?.crosshair),tooltip:(0,hs.Z)({},fs.plugins?.tooltip,e.plugins?.tooltip)}),scales:(0,hs.Z)({},fs.scales,e.scales,{x:(0,hs.Z)({},fs.scales?.x,e.scales?.x),y:(0,hs.Z)({},fs.scales?.y,e.scales?.y)})})}(r)),[r]),d=(0,s.useMemo)((()=>function(e=[],t,n,a){return a.reduce(((n,a,s)=>{const i=e[s]||us(gs[s]),r=a.map((e=>(0,ps.H)(e)?e.toNumber():e));return n.datasets.push({backgroundColor:i,borderColor:i,cubicInterpolationMode:"default",data:r,fill:!1,hoverBackgroundColor:i,label:t[s],lineTension:.25}),n}),{datasets:[],labels:n})}(t,i,n,l)),[t,n,i,l]);return(0,a.jsxs)(bs,{className:`${e} ui--Chart-Line`,children:[o&&(0,a.jsx)("h1",{className:"ui--Chart-Header",children:o}),(0,a.jsx)(Rn,{children:(0,a.jsx)(is.x1,{data:d,options:c})})]})}));ns.kL.register(ns.uw,ns.f$,ns.jn,ns.od,ns.Dx,ns.u,as.Z,ss.ZP);const vs={Doughnut:ls,HorizBar:ms,Line:xs},As=y.z.div`
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
`,ws=s.memo((function({className:e="",isDisabled:t,label:n,onChange:i,value:r}){const o=(0,s.useCallback)((()=>{!t&&i&&i(!r)}),[t,i,r]);return(0,a.jsxs)(As,{className:`${e} ui--Checkbox ${t?"isDisabled":""}`,onClick:o,children:[(0,a.jsx)(w.Z,{color:r?"normal":"transparent",icon:"check"}),n&&(0,a.jsx)("label",{children:n})]})})),ys="750px",ks="550px",js="\n  display: flex;\n  flex-wrap: wrap;\n\n  &.is50 {\n    > .ui--Column {\n      max-width: 50%;\n      min-width: 50%;\n    }\n  }\n\n  &.is60 {\n    > .ui--Column:first-child {\n      max-width: 60%;\n      min-width: 60%;\n    }\n\n    > .ui--Column:last-child {\n      max-width: 40%;\n      min-width: 40%;\n    }\n  }\n\n  &.is100 {\n    > .ui--Column {\n      max-width: 100%;\n      min-width: 100%;\n    }\n  }\n",Ns=y.z.div`
  &.isReverse {
    flex-direction: row-reverse;
  }

  &.defaultSize {
    @media only screen and (min-width: ${"1025px"}) {
      ${js}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.75rem;
    }
  }

  &.smallSize {
    @media only screen and (min-width: ${ys}) {
      ${js}
    }

    &isPadded > .ui--Column {
      padding: 0 0.5rem;
    }
  }

  &.tinySize {
    @media only screen and (min-width: ${ks}) {
      ${js}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.25rem;
    }
  }

  &.defaultSize, &.smallSize {
    @media only screen and (max-width: ${ys}) {
      &.isPadded > .ui--Column {
        padding: 0 0.5rem;
      }
    }
  }

  &.defaultSize, &.smallSize, &.tinySize {
    @media only screen and (max-width: ${ks}) {
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
`,Cs=s.memo((function({children:e,className:t="",is60:n,is100:s,isPadded:i=!0,isReverse:r,size:o="default"}){return(0,a.jsx)(Ns,{className:`${t} ui--Columar ${s?"is100":n?"is60":"is50"} ${i?"isPadded":""} ${r?"isReverse":""} ${o}Size`,children:e})}));Cs.Column=function({children:e,className:t=""}){return(0,a.jsx)("div",{className:`${t} ui--Column`,children:e})};const Es=Cs;var Ss=n(13731),Is=(n(79472),n(92890));const Bs=y.z.div`
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
`,Ds=s.memo((function({className:e="",code:t,isValid:n,onEdit:i}){const[r]=(0,s.useState)((()=>`flask-${Date.now()}`)),o=(0,s.useRef)(null);return(0,s.useEffect)((()=>{const e=new Is.Z(`#${r}`,{language:"js",lineNumbers:!0});e.updateCode(t),e.editorRoot.addEventListener("keydown",(()=>{e.onUpdate(i)})),o.current=e}),[]),(0,s.useEffect)((()=>{o.current&&o.current.updateCode(t)}),[t]),(0,a.jsx)(Bs,{className:`${e} ui-Editor ${!1===n?"invalid":""}`,id:r})})),Ls=y.z.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid var(--border-table);
  border-radius: 4px;
  cursor: pointer;
`,Ps=s.memo((function({className:e="",expanded:t,onClick:n}){return(0,a.jsx)(Ls,{className:`${e} ui--ExpandButton`,"data-testid":"row-toggle",onClick:n,children:(0,a.jsx)(w.Z,{icon:t?"caret-up":"caret-down"})})}));var Ts=n(27421);const Vs=(0,qe.e)("useWindowColumns",(function(e=3){const t=Ht();return(0,Ts.N)(e>=3&&t.width>=1500?3:e>=2&&t.width>=1050?2:1)})),Ms=s.memo((function({children:e,className:t="",colSpan:n,label:s,labelPost:i,rowSpan:r,value:o,withLoading:l}){return(0,a.jsxs)("td",{className:`${t} ui--Table-Column-Balance number`,colSpan:n,rowSpan:r,children:[o?(0,a.jsx)(ne.Z,{label:s,labelPost:i,value:o}):l&&(0,a.jsx)(ne.Z,{className:"--tmp",value:1}),e]})})),Fs=y.z.td`
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
`,zs=s.memo((function({className:e="",colSpan:t,isExpanded:n,rowSpan:s,toggle:i}){return(0,a.jsx)(Fs,{className:`${e} ui--Table-Column-Expand`,colSpan:t,onClick:i,rowSpan:s,children:(0,a.jsx)("div",{children:(0,a.jsx)(w.Z,{icon:n?"caret-up":"caret-down"})})})})),Zs=y.z.td`
  && {
    box-sizing: content-box;
    cursor: pointer;
    min-width: 1rem;
    padding-right: 0.35rem;
    text-align: right;
    width: 1rem;
  }
`,Rs=s.memo((function({address:e,className:t="",colSpan:n,isFavorite:i,rowSpan:r,toggle:o}){const l=(0,s.useCallback)((()=>o(e)),[e,o]);return(0,a.jsx)(Zs,{className:`${t} ui--Table-Column-Favorite`,colSpan:n,onClick:l,rowSpan:r,children:(0,a.jsx)(w.Z,{color:i?"orange":"gray",icon:"star"})})})),$s=`${7.15.toFixed(3)}ch`,qs=y.z.td`
  && {
    box-sizing: content-box;
    min-width: ${$s};
    text-align: right;
    white-space: nowrap;
    width: ${$s};
`,Hs=s.memo((function({children:e,className:t="",colSpan:n,rowSpan:s,value:i}){return(0,a.jsxs)(qs,{className:`${t} ui--Table-Column-Id`,colSpan:n,rowSpan:s,children:[(0,a.jsx)("h2",{className:"--digits",children:(0,g.u)(i)}),e]})})),Us=s.memo((function({children:e,className:t=""}){return(0,a.jsx)("td",{className:`${t} ui--Table-Column`,children:e})}));Us.Balance=Ms,Us.Expand=zs,Us.Favorite=Rs,Us.Id=Hs;const Ws=Us,Os=s.memo((function({children:e,className:t=""}){return(0,a.jsx)("tr",{className:`${t} ui--Table-Row`,children:e})})),Qs=s.memo((function({children:e,className:t="",empty:n,emptySpinner:s,isEmpty:i,noBodyTag:r}){const o=`${t} ui--Table-Body`;return i?(0,a.jsx)("tbody",{className:o,children:(0,a.jsx)("tr",{children:(0,a.jsx)("td",{colSpan:100,children:(0,mn.H)(n)?(0,a.jsx)("div",{className:"empty",children:n}):n||(0,a.jsx)(W,{label:s})})})}):r?(0,a.jsx)(a.Fragment,{children:e}):(0,a.jsx)("tbody",{className:o,children:e})})),Gs=y.z.tfoot`
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
`,Js=s.memo((function({className:e="",footer:t,isEmpty:n}){return!t||n?null:(0,a.jsx)(Gs,{className:`${e} ui--Table-Foot`,children:t})})),Ks=y.z.thead`
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
`,Ys=s.memo((function({children:e,className:t="",filter:n,header:s,isEmpty:i}){return s?.length?(0,a.jsxs)(Ks,{className:`${t} ui--Table-Head`,children:[n&&(0,a.jsx)("tr",{className:"filter",children:(0,a.jsx)("th",{colSpan:100,children:n})}),(0,a.jsx)("tr",{children:s.filter((e=>!!e)).map((([e,t="default",n=1,s],r)=>(0,a.jsx)("th",{className:t,colSpan:n,onClick:s,children:0===r?(0,a.jsx)("h1",{children:e}):!i&&e&&(0,a.jsx)("label",{children:e})},r)))}),e]}):null})),Xs={2:[0,1],3:[0,1,2]},_s="0.125rem solid var(--bg-page)",ei="0.25rem solid var(--bg-page)",ti="0.5rem",ni=y.z.div`
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
        border-left: ${_s};
      }

      &:last-child {
        border-right: ${_s};
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
          border-top: ${ei};

          &:first-child {
            border-top-left-radius: ${ti};
            border-bottom-left-radius: ${ti};
          }

          &:last-child {
            border-top-right-radius: ${ti};
            border-bottom-right-radius: ${ti};
          }
        }
      }

      &.isExpanded {
        &.isFirst {
          td {
            border-top: ${ei};

            &:first-child {
              border-top-left-radius: ${ti};
            }

            &:last-child {
              border-top-right-radius: ${ti};
            }
          }
        }

        &.isLast {
          td {
            &:first-child {
              border-bottom-left-radius: ${ti};
            }

            &:last-child {
              border-bottom-right-radius: ${ti};
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
          border-top: ${ei};

          &:first-child {
            border-top-left-radius: ${ti};
          }

          &:last-child {
            border-top-right-radius: ${ti};
          }
        }
      }

      &:last-child {
        th {
          padding-top: 1rem;

          &:first-child {
            border-bottom-left-radius: ${ti};
          }

          &:last-child {
            border-bottom-right-radius: ${ti};
          }
        }
      }

      th {
        &:first-child {
          border-left: ${_s};
        }

        &:last-child {
          border-right: ${_s};
        }
      }
    }
  }
`,ai=s.memo((function({children:e,className:t="",empty:n,emptySpinner:s,filter:i,footer:r,header:o,headerChildren:l,isFixed:c,isInline:d,isSplit:u,legend:m,maxColumns:h,noBodyTag:p}){const g=Vs(h),f=Array.isArray(e),b=!e||f&&0===e.length,x=(0,a.jsx)(Ys,{filter:i,header:o,isEmpty:b,children:l});return u&&f&&!b&&1!==g?(0,a.jsxs)(ni,{className:`${t} ui--Table isSplit`,children:[m,(0,a.jsx)("table",{className:"noMargin",children:x}),(0,a.jsx)("div",{className:"ui--Table-Split",children:Xs[g].map((t=>(0,a.jsx)("div",{className:`ui--Table-Split-${g}`,children:(0,a.jsx)("table",{className:"noMargin",children:(0,a.jsx)("tbody",{className:"ui--Table-Body",children:e.filter(((e,n)=>n%g===t))})})},t)))})]}):(0,a.jsxs)(ni,{className:`${t} ui--Table`,children:[m,(0,a.jsxs)("table",{className:`${c&&!b?"isFixed":"isNotFixed"} ${d?"isInline":""}`,children:[x,(0,a.jsx)(Qs,{empty:n,emptySpinner:s,isEmpty:b,noBodyTag:p,children:e}),(0,a.jsx)(Js,{footer:r,isEmpty:b})]})]})}));ai.Column=Ws,ai.Row=Os;const si=ai;function ii(e,t){return(0,a.jsx)("tr",{children:(0,a.jsx)("td",{children:e})},t)}const ri=(0,y.z)(pe)`
  .tableContainer {
    overflow-y: scroll;
    display: block;
    margin: 0 0 0 auto;
    max-height: 13.75rem;
    max-width: 25rem;
    overflow-x: hidden;
  }
`,oi=s.memo((function({children:e,className:t,empty:n,renderChildren:i,summary:r}){const o=(0,s.useMemo)((()=>!(!i&&!e)),[e,i]),l=(0,s.useCallback)((()=>(i||e)&&(0,a.jsx)("div",{className:"tableContainer",children:(0,a.jsx)(si,{empty:n,isInline:!0,children:i?i()?.map(ii):Array.isArray(e)?e.map(ii):(0,a.jsx)("tr",{children:(0,a.jsx)("td",{children:e})})})})),[e,n,i]);return(0,a.jsx)(ri,{className:t,renderChildren:o?l:void 0,summary:r})})),li=y.z.div`
  width: 29.5rem;

  .ui--Input {
    margin: 0;
    height: 3.893rem;
  }
`,ci=s.memo((function({className:e="",filterOn:t,label:n,setFilter:s}){return(0,a.jsx)(li,{className:e,children:(0,a.jsx)(tn.ZP,{autoFocus:!0,isFull:!0,label:n,onChange:s,value:t})})})),di=y.z.div`
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
`,ui=s.memo((function({children:e,className:t}){return(0,a.jsx)(di,{className:t,children:e})}));function mi(e,t){switch(e){case"account":return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("p",{children:t("You are about to remove this account from your list of available accounts. Once completed, should you need to access it again, you will have to re-create the account either via seed or via a backup file.")}),(0,a.jsx)("p",{children:t("This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the account on this browser.")})]});case"address":return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("p",{children:t("You are about to remove this address from your address book. Once completed, should you need to access it again, you will have to re-add the address.")}),(0,a.jsx)("p",{children:t("This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the address on this browser.")})]});case"contract":return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("p",{children:t("You are about to remove this contract from your list of available contracts. Once completed, should you need to access it again, you will have to manually add the contract's address in the Instantiate tab.")}),(0,a.jsx)("p",{children:t("This operation does not remove the history of the contract from the chain, nor any associated funds from its account. The forget operation only limits your access to the contract on this browser.")})]});default:return null}}function hi(e,t){switch(e){case"account":return t("Confirm account removal");case"address":return t("Confirm address removal");case"contract":return t("Confirm contract removal");case"code":return t("Confirm code removal")}}function pi(e,t){const{address:n,mode:s="account"}=e;switch(s){case"account":case"address":case"contract":return(0,a.jsx)(La,{isInline:!0,value:n||"",children:mi(s,t)});default:return null}}const gi=s.memo((function(e){const{t}=(0,R.$)(),{children:n,mode:s="account",onClose:i,onForget:r}=e;return(0,a.jsxs)(Xn,{className:"app--accounts-Modal",header:hi(s,t),onClose:i,children:[(0,a.jsx)(Xn.Content,{children:n||pi(e,t)}),(0,a.jsx)(Xn.Actions,{children:(0,a.jsx)(K,{icon:"trash",label:t("Forget"),onClick:r})})]})}));var fi=n(30875);const bi=[n(49001).Z],xi=y.z.div`
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
`;s.memo((function({className:e="",md:t}){const[n,s]=(0,me.O)();return(0,a.jsxs)(xi,{className:`${e} ui--HelpOverlay`,children:[(0,a.jsx)("div",{className:"help-button",children:(0,a.jsx)(w.Z,{icon:"question-circle",onClick:s})}),(0,a.jsxs)("div",{className:"help-slideout "+(n?"open":"closed"),children:[(0,a.jsx)("div",{className:"help-button",children:(0,a.jsx)(w.Z,{icon:"times",onClick:s})}),(0,a.jsx)(fi.U,{className:"help-content",rehypePlugins:bi,children:t})]})]})}));const vi=(0,y.z)(fn.Z)`
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
`,Ai=s.memo((function({children:e,className:t="",type:n="info"}){return(0,a.jsx)(vi,{children:(0,a.jsx)("div",{className:`${t} ${n}`,children:e})})}));var wi=n(47623);const yi=s.memo((function({address:e,filter:t,isHidden:n,onSelect:i}){const r=(0,s.useCallback)((()=>i(e)),[e,i]);return n?null:(0,a.jsx)(Ta,{address:e,filter:t,noToggle:!0,onChange:r})})),ki=s.memo((function({address:e,filter:t,isHidden:n,onDeselect:i}){const r=(0,s.useCallback)((()=>i(e)),[e,i]);return n?null:(0,a.jsx)(Ta,{address:e,filter:t,noToggle:!0,onChange:r})})),ji=y.z.div`
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
`,Ni=s.memo((function({available:e,availableLabel:t,className:n="",defaultValue:i,maxCount:r,onChange:o,valueLabel:l}){const{t:c}=(0,R.$)(),[d,u]=(0,s.useState)(""),[m,h]=(0,s.useState)([]),p=(0,Ts.N)(d),g=(0,wi.q)();(0,s.useEffect)((()=>{i&&h(i)}),[i]),(0,s.useEffect)((()=>{m&&o(m)}),[o,m]);const f=(0,s.useCallback)((e=>h((t=>function(e,t,n){return!e.includes(t)&&e.length<n?e.concat(t):e}(t,e,r)))),[r]),b=(0,s.useCallback)((e=>h((t=>function(e,t){return e.includes(t)?e.filter((e=>e!==t)):e}(t,e)))),[]);return(0,a.jsxs)(ji,{className:`${n} ui--InputAddressMulti`,children:[(0,a.jsx)(tn.ZP,{autoFocus:!0,className:"ui--InputAddressMulti-Input",isSmall:!0,onChange:u,placeholder:c("filter by name, address, or account index"),value:d,withLabel:!1}),(0,a.jsxs)("div",{className:"ui--InputAddressMulti-columns",children:[(0,a.jsxs)("div",{className:"ui--InputAddressMulti-column",children:[(0,a.jsx)("label",{children:l}),(0,a.jsx)("div",{className:"ui--InputAddressMulti-items",children:m.map((e=>(0,a.jsx)(ki,{address:e,onDeselect:b},e)))})]}),(0,a.jsxs)("div",{className:"ui--InputAddressMulti-column",children:[(0,a.jsx)("label",{children:t}),(0,a.jsx)("div",{className:"ui--InputAddressMulti-items",children:g?e.map((e=>(0,a.jsx)(yi,{address:e,filter:p,isHidden:m?.includes(e),onSelect:f},e))):(0,a.jsx)(W,{})})]})]})]})})),Ci=y.z.div`
  position: relative;

  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: 0.75rem;
    position: absolute;
    top: 1rem;
  }
`,Ei=s.memo((function({autoFocus:e,bytesLength:t,children:n,className:i="",defaultValue:r,forceIconType:o,isDisabled:l,isError:c,isFull:d,label:u,noConvert:m,onChange:h,onEnter:p,onEscape:g,placeholder:f}){const[b,x]=(0,s.useState)(r||null),A=(0,s.useCallback)((e=>{const n=(0,v.Hc)(e,void 0,t)||null,a=m?n?e:null:n;x(a),h&&h(a)}),[t,m,h]);return(0,a.jsxs)(Ci,{className:`${i} ui--InputAddressSimple`,children:[(0,a.jsx)(tn.ZP,{autoFocus:e,defaultValue:r,isDisabled:l,isError:c||!b,isFull:d,label:u,onChange:A,onEnter:p,onEscape:g,placeholder:f,children:n}),(0,a.jsx)(Xe,{className:"ui--InputAddressSimpleIcon",forceIconType:o,size:32,value:b})]})})),Si=y.z.div`
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
`,Ii=s.memo((function({children:e,className:t="",label:n,withLabel:s}){return(0,a.jsx)(Si,{className:t,children:(0,a.jsx)(fn.Z,{label:n,withLabel:s,children:(0,a.jsx)("div",{className:"ui--DropdownLinked ui--row",children:e})})})}));function Bi(e,t){if(!t)return[];const n=e[t];return n&&0!==Object.keys(e[t]).length?Object.keys(e[t]).filter((e=>!e.startsWith("$"))).sort().map((e=>n[e])).map((({description:e,method:n,params:s})=>{const i=s.map((({name:e})=>e)).join(", ");return{className:"ui--DropdownLinked-Item",key:`${t}_${n}`,text:[(0,a.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[n,"(",i,")"]},`${t}_${n}:call`),(0,a.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:e||n},`${t}_${n}:text`)],value:n}})):[]}const Di=s.memo((function({className:e="",defs:t,isError:n,onChange:i,options:r,value:o}){const l=(0,s.useCallback)((e=>t[o.section][e]),[t,o]);return r.length?(0,a.jsx)(en.Z,{className:`${e} ui--DropdownLinked-Items`,isError:n,onChange:i,onSearch:v.xW,options:r,transform:l,value:o.method,withLabel:!1}):null})),Li=s.memo((function({className:e="",defaultValue:t,isError:n,onChange:s,options:i,value:r}){return(0,a.jsx)(en.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:s,onSearch:v.xW,options:i,value:r.section,withLabel:!1})}));function Pi(e){return Object.entries(e).sort((([e],[t])=>e.localeCompare(t)))}const Ti=(0,qe.e)("useRuntime",(function(){const{api:e}=(0,l.h)();return(0,s.useMemo)((()=>function(e){const t={};let n=null;const a=Pi(e.call);for(let e=0,s=a.length;e<s;e++){const[s,i]=a[e],r=Pi(i);for(let e=0,a=r.length;e<a;e++){const[a,{meta:i}]=r[e];i&&(t[s]||(t[s]={},null===n&&(n=i)),t[s][a]=i)}}return[t,n]}(e)),[e])})),Vi=s.memo((function({className:e,label:t,onChange:n,withLabel:i}){const[r,o]=Ti(),[l]=(0,s.useState)((()=>{return e=r,Object.keys(e).filter((e=>!e.startsWith("$"))).sort().filter((t=>0!==Object.keys(e[t]).length)).map((e=>({text:e,value:e})));var e})),[c,d]=(0,s.useState)((()=>Bi(r,o?.section))),[u,m]=(0,s.useState)((()=>o));(0,s.useEffect)((()=>{u&&n&&n(u)}),[n,u]);const h=(0,s.useCallback)((e=>{u!==e&&m((()=>e))}),[u]),p=(0,s.useCallback)((e=>{if(u&&e!==u.section){const t=Bi(r,e);d(t),h(r[e][t[0].value])}}),[h,r,u]);return u?(0,a.jsxs)(Ii,{className:e,label:t,withLabel:i,children:[(0,a.jsx)(Li,{className:"small",onChange:p,options:l,value:u}),(0,a.jsx)(Di,{className:"large",defs:r,onChange:h,options:c,value:u})]}):null}));var Mi=n(44055);function Fi(e,t){const n=e.consts[t];return n&&0!==Object.keys(n).length?Object.keys(n).filter((e=>!e.startsWith("$"))).sort().map((s=>{const i=n[s];return{className:"ui--DropdownLinked-Item",key:`${t}_${s}`,text:[(0,a.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[s,": ",(0,Mi.I)(e.registry.lookup,i.meta.type)]},`${t}_${s}:call`),(0,a.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(i.meta.docs[0]||i.meta.name).toString()},`${t}_${s}:text`)],value:s}})):[]}function zi({value:e}){return t=>({method:t,section:e.section})}const Zi=s.memo((function(e){const{className:t="",isError:n,onChange:s,options:i,value:r}=e;return i.length?(0,a.jsx)(en.Z,{className:`${t} ui--DropdownLinked-Items`,isError:n,onChange:s,onSearch:v.xW,options:i,transform:zi(e),value:r.method,withLabel:!1}):null})),Ri=s.memo((function({className:e="",defaultValue:t,isError:n,onChange:s,options:i,value:{section:r}}){return(0,a.jsx)(en.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:s,onSearch:v.xW,options:i,value:r,withLabel:!1})})),$i=s.memo((function({className:e="",defaultValue:t,label:n,onChange:i,withLabel:r}){const{api:o}=(0,l.h)(),[c,d]=(0,s.useState)((()=>Fi(o,t.section))),[u]=(0,s.useState)((()=>function(e){return Object.keys(e.consts).filter((e=>!e.startsWith("$"))).sort().filter((t=>Object.keys(e.consts[t]).length)).map((e=>({text:e,value:e})))}(o))),[m,h]=(0,s.useState)((()=>function(e,{method:t,section:n}){const a=Object.keys(e.consts)[0],s=Object.keys(e.consts[a])[0],i=e.consts[n]?.[t]?{method:t,section:n}:{method:s,section:a};return{...i,meta:e.consts[i.section][i.method].meta}}(o,t))),p=(0,s.useCallback)((e=>{if(m.section!==e.section||m.method!==e.method){const{method:t,section:n}=e,a={meta:o.consts[n][t].meta,method:t,section:n};h(a),i&&i(a)}}),[o,i,m]),g=(0,s.useCallback)((e=>{if(e!==m.section){const t=Fi(o,e);d(t),p({method:t[0].value,section:e})}}),[p,o,m]);return(0,a.jsxs)(Ii,{className:e,label:n,withLabel:r,children:[(0,a.jsx)(Ri,{className:"small",onChange:g,options:u,value:m}),(0,a.jsx)(Zi,{className:"large",onChange:p,options:c,value:m})]})}));function qi(e,t,n){const s=e.tx[t],i=!n||n(t);return s&&0!==Object.keys(s).length&&i?Object.keys(s).filter((e=>!e.startsWith("$")&&(!n||n(t,e)))).sort().map((e=>{const n=s[e],i=n.meta.args.map((e=>e.name.toString())).join(", ");return{className:"ui--DropdownLinked-Item",key:`${t}_${e}`,text:[(0,a.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[e,"(",i,")"]},`${t}_${e}:call`),(0,a.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(n.meta.docs[0]||e).toString()},`${t}_${e}:text`)],value:e}})):[]}const Hi=s.memo((function({api:e,className:t="",defaultValue:n,isDisabled:i,isError:r,onChange:o,options:l,value:c}){const d=(0,s.useCallback)((t=>e.tx[c.section][t]),[e,c]);return l.length?(0,a.jsx)(en.Z,{className:`${t} ui--DropdownLinked-Items`,defaultValue:n,isDisabled:i,isError:r,onChange:o,onSearch:v.xW,options:l,transform:d,value:c.method,withLabel:!1}):null})),Ui=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:s,onChange:i,options:r,value:o}){return(0,a.jsx)(en.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isDisabled:n,isError:s,onChange:i,onSearch:v.xW,options:r,value:o.section,withLabel:!1})})),Wi=s.memo((function({className:e="",defaultValue:t,filter:n,isDisabled:i,label:r,onChange:o,withLabel:c}){const{api:d}=(0,l.h)(),[u,m]=(0,s.useState)((()=>qi(d,t.section,n))),[h]=(0,s.useState)((()=>function(e,t){return Object.keys(e.tx).filter((e=>!e.startsWith("$")&&(!t||t(e)))).sort().filter((t=>Object.keys(e.tx[t]).length)).map((e=>({text:e,value:e})))}(d,n))),[p,g]=(0,s.useState)((()=>t)),[{defaultMethod:f,defaultSection:b}]=(0,s.useState)((()=>({defaultMethod:t.method,defaultSection:t.section}))),x=(0,s.useCallback)((e=>{p!==e&&(g((()=>e)),o&&o(e))}),[o,p]),v=(0,s.useCallback)((e=>{if(e!==p.section){const t=qi(d,e,n);m(t),x(d.tx[e][t[0].value])}}),[x,d,n,p]);return(0,a.jsxs)(Ii,{className:e,label:r,withLabel:c,children:[(0,a.jsx)(Ui,{className:"small",defaultValue:b,isDisabled:i,onChange:i?void 0:v,options:h,value:p}),(0,a.jsx)(Hi,{api:d,className:"large",defaultValue:f,isDisabled:i,onChange:i?void 0:x,options:u,value:p})]})}));var Oi=n(6574),Qi=n(56623),Gi=n(48533);const Ji="0".charCodeAt(0),Ki="x".charCodeAt(0),Yi=()=>{},Xi=y.z.div`
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
`,_i=s.memo((function({accept:e,className:t="",clearContent:n,isDisabled:i,isError:r=!1,isFull:o,label:l,labelExtra:c,onChange:d,placeholder:u,withEllipsis:m,withLabel:h}){const{t:p}=(0,R.$)(),f=(0,s.createRef)(),[b,x]=(0,s.useState)(),v=(0,s.useCallback)((e=>{e.forEach((e=>{const t=new FileReader;t.onabort=Yi,t.onerror=Yi,t.onload=({target:t})=>{if(t?.result){const n=e.name,a=function(e){const t=new Uint8Array(e);if(t[0]===Ji&&t[1]===Ki){let e=(0,Qi.z)(t);for(;e.endsWith("\n");)e=e.substring(0,e.length-1);if((0,Oe.vq)(e))return(0,Gi.G)(e)}return t}(t.result);d&&d(a,n),f&&x({name:n,size:a.length})}},t.readAsArrayBuffer(e)}))}),[f,d]),{getInputProps:A,getRootProps:w}=(0,Oi.uI)({accept:e?.reduce(((e,t)=>({...e,[t]:[]})),{}),disabled:i,onDrop:v}),y=(0,a.jsxs)(Xi,{...w({className:`${t} ui--InputFile ${r?"error":""}`}),children:[(0,a.jsx)("input",{...A()}),(0,a.jsx)("em",{className:"label",children:!b||n?u||p("click to select or drag and drop the file here"):u||p("{{name}} ({{size}} bytes)",{replace:{name:b.name,size:(0,g.u)(b.size)}})})]});return l?(0,a.jsx)(fn.Z,{isFull:o,label:l,labelExtra:c,withEllipsis:m,withLabel:h,children:y}):y}));var er=n(39764);function tr(e,t,n){const s=t[n];return s&&0!==Object.keys(e.rpc[n]).length?Object.keys(e.rpc[n]).filter((e=>!e.startsWith("$"))).sort().map((e=>s[e])).filter((e=>!!e)).filter((({isSubscription:e})=>!e)).map((({description:e,method:t,params:s})=>{const i=s.map((({name:e})=>e)).join(", ");return{className:"ui--DropdownLinked-Item",key:`${n}_${t}`,text:[(0,a.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[t,"(",i,")"]},`${n}_${t}:call`),(0,a.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:e||t},`${n}_${t}:text`)],value:t}})):[]}var nr=n(13529),ar=n(85617);const sr=(0,qe.e)("useRpcs",(function(){const{api:e}=(0,l.h)();return(0,s.useMemo)((()=>function(e,t,{specName:n}){return Object.entries((0,ar.KM)(e,t,n)).reduce(((e,[t,n])=>(e[t]??=function(e,t){return Object.entries(t).reduce(((t,[n,a])=>(t[n]={isSubscription:!1,jsonrpc:`${e}_${n}`,method:n,section:e,...a},t)),{})}(t,n),e)),{...nr.Z})}(e.registry,e.runtimeChain,e.runtimeVersion)),[e])})),ir=s.memo((function({className:e="",isError:t,onChange:n,options:i,value:r}){const o=sr(),l=(0,s.useCallback)((e=>o[r.section][e]),[o,r]);return i.length?(0,a.jsx)(en.Z,{className:`${e} ui--DropdownLinked-Items`,isError:t,onChange:n,onSearch:v.xW,options:i,transform:l,value:r.method,withLabel:!1}):null})),rr=s.memo((function({className:e="",defaultValue:t,isError:n,onChange:s,options:i,value:r}){return(0,a.jsx)(en.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:s,onSearch:v.xW,options:i,value:r.section,withLabel:!1})})),or=s.memo((function({className:e="",defaultValue:t,label:n,onChange:i,withLabel:r}){const{api:o}=(0,l.h)(),c=sr(),[d,u]=(0,s.useState)((()=>tr(o,c,t.section))),[m]=(0,s.useState)((()=>function(e){return Object.keys(e.rpc).filter((e=>!e.startsWith("$"))).sort().filter((t=>0!==Object.keys(e.rpc[t]).length)).map((e=>({text:e,value:e})))}(o))),[h,p]=(0,s.useState)((()=>t));(0,s.useEffect)((()=>{i&&i(h)}),[i,h]);const g=(0,s.useCallback)((e=>{h!==e&&p((()=>e))}),[h]),f=(0,s.useCallback)((e=>{if(e!==h.section){const t=tr(o,c,e);u(t),g(c[e][t[0].value])}}),[g,o,c,h]);return(0,a.jsxs)(Ii,{className:e,label:n,withLabel:r,children:[(0,a.jsx)(rr,{className:"small",onChange:f,options:m,value:h}),(0,a.jsx)(ir,{className:"large",onChange:g,options:d,value:h})]})}));var lr=n(19729);function cr(e,t){const n=e.query[t];return n&&0!==Object.keys(n).length?Object.keys(n).filter((e=>!e.startsWith("$"))).sort().map((s=>{const{meta:{docs:i,modifier:r,name:o,type:l}}=n[s],c=(0,lr.P)(e.registry,l,r.isOptional);let d="";if(l.isMap){const{hashers:t,key:n}=l.asMap;if(1===t.length)d=(0,Mi.I)(e.registry.lookup,n);else{const t=e.registry.lookup.getSiType(n).def;d=t.isTuple?t.asTuple.map((t=>(0,Mi.I)(e.registry.lookup,t))).join(", "):t.asHistoricMetaCompat.toString()}}return{className:"ui--DropdownLinked-Item",key:`${t}_${s}`,text:[(0,a.jsxs)("div",{className:"ui--DropdownLinked-Item-call",children:[s,"(",d,"): ",c]},`${t}_${s}:call`),(0,a.jsx)("div",{className:"ui--DropdownLinked-Item-text",children:(i[0]||o).toString()},`${t}_${s}:text`)],value:s}})):[]}function dr(e,{value:t}){return function(n){return e.query[t.creator.section]?e.query[t.creator.section][n]:t}}const ur=s.memo((function(e){const{api:t}=(0,l.h)(),{className:n="",isError:s,onChange:i,options:r,value:o}=e;return r.length?(0,a.jsx)(en.Z,{className:`${n} ui--DropdownLinked-Items`,isError:s,onChange:i,onSearch:v.xW,options:r,transform:dr(t,e),value:o.creator.method,withLabel:!1}):null})),mr=s.memo((function({className:e="",defaultValue:t,isError:n,onChange:s,options:i,value:{creator:{section:r}}}){return(0,a.jsx)(en.Z,{className:`${e} ui--DropdownLinked-Sections`,defaultValue:t,isError:n,onChange:s,onSearch:v.xW,options:i,value:r,withLabel:!1})})),hr=s.memo((function({className:e="",defaultValue:t,label:n,onChange:i,withLabel:r}){const{api:o}=(0,l.h)(),[c,d]=(0,s.useState)((()=>cr(o,t.creator.section))),[u]=(0,s.useState)((()=>function(e){return Object.keys(e.query).filter((e=>!e.startsWith("$"))).sort().filter((t=>Object.keys(e.query[t]).length)).map((e=>({text:e,value:e})))}(o))),[m,h]=(0,s.useState)((()=>t)),p=(0,s.useCallback)((e=>{m!==e&&(h((()=>e)),i&&i(e))}),[i,m]),g=(0,s.useCallback)((e=>{if(e!==m.creator.section){const t=cr(o,e);d(t),p(o.query[e][t[0].value])}}),[p,o,m]);return(0,a.jsxs)(Ii,{className:e,label:n,withLabel:r,children:[(0,a.jsx)(mr,{className:"small",onChange:g,options:u,value:m}),(0,a.jsx)(ur,{className:"large",onChange:p,options:c,value:m},m.creator.section)]})}));n(35220);var pr=n(6226),gr=n(88311);const fr=["application/wasm"],br=s.memo((function({onChange:e,...t}){const n=(0,s.useCallback)(((t,n)=>{const a=(0,pr.F)(t);e((0,gr.N)(t),a,n)}),[e]);return(0,a.jsx)(_i,{...t,accept:fr,onChange:n})}));var xr=n(55858);const vr=(0,y.z)(fn.Z)`
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
`,Ar=s.memo((function({children:e,className:t="",isDisabled:n,isError:s,isFull:i,isHidden:r,isMonospace:o,isSmall:l,isTrimmed:c,label:d,labelExtra:u,value:m,withCopy:h=!1,withLabel:p}){return(0,a.jsxs)(vr,{className:`${t} ui--Output`,isFull:i,isHidden:r,isSmall:l,label:d,labelExtra:u,withLabel:p,children:[(0,a.jsxs)("div",{className:`ui--output ui dropdown selection ${s?" error":""}${o?" monospace":""}${n?"isDisabled":""}`,children:[c&&(0,mn.H)(m)&&m.length>512?`${m.slice(0,256)}…${m.slice(-256)}`:m,e]}),h&&(0,a.jsx)(gn,{value:m})]})}));function wr({inner:e=[],name:t="",outer:n=[]},a=[]){if(n.length){const e=new Array(n.length);for(let t=0;t<n.length;t++)e[t]=(0,xr.c)(n[t],void 0,!1);a.push({name:t,value:e.join(" ")})}for(let t=0,n=e.length;t<n;t++)wr(e[t],a);return a}const yr=(0,y.z)(Ar)`
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
`,kr=s.memo((function({className:e,hex:t,inspect:n,label:i}){const{t:r}=(0,R.$)(),{createLink:o}=(0,l.h)(),c=(0,s.useMemo)((()=>n&&wr(n)),[n]),[d,u]=(0,s.useMemo)((()=>{if(t){const e=`/extrinsics/decode/${t}`;return[o(e),`#${e}`]}return[null,null]}),[o,t]);return c?(0,a.jsx)(yr,{className:e,isDisabled:!0,label:i,children:(0,a.jsx)("table",{children:(0,a.jsxs)("tbody",{children:[c.map((({name:e,value:t},n)=>(0,a.jsxs)("tr",{children:[(0,a.jsx)("td",{children:(0,a.jsx)("label",{children:e})}),(0,a.jsx)("td",{children:t})]},n))),d&&(0,a.jsxs)("tr",{className:"isLink",children:[(0,a.jsx)("td",{children:(0,a.jsx)("label",{children:r("link")})}),(0,a.jsx)("td",{children:(0,a.jsx)("a",{href:d,rel:"noreferrer",target:"_blank",children:u})})]},"hex")]})})}):null}));let jr=0;const Nr=y.z.div`
  cursor: help;
  display: inline-block;
  line-height: 1rem;
  margin: 0 0 0 0.25rem;
`,Cr=s.memo((function({className:e="",help:t,icon:n="question-circle"}){const[i]=(0,s.useState)((()=>"label-help-"+ ++jr));return(0,a.jsxs)(Nr,{className:`${e} ui--LabelHelp`,tabIndex:-1,children:[(0,a.jsx)(w.Z,{icon:n,tooltip:i}),(0,a.jsx)(k.Z,{text:t,trigger:i})]})})),Er=s.memo((function({children:e,isActive:t=!0}){const[n,i]=(0,s.useState)((()=>new Array(e.length).fill(!1)));return(0,s.useEffect)((()=>{if(t){const e=n.findIndex((e=>!e));-1!==e&&(0,la.Y)((()=>i(n.map(((t,n)=>n===e||t)))))}}),[t,n]),(0,a.jsx)(a.Fragment,{children:t?n.map(((t,n)=>t&&e[n])):(0,a.jsx)(W,{})})})),Sr=s.memo((function({children:e,className:t="",label:n,params:s}){const{api:i}=(0,l.h)(),r=(0,be.W7)(i.derive.balances?.all,[s]);return(0,a.jsxs)("div",{className:t,children:[n||"",(0,g.u)(r?.accountNonce),e]})}));s.memo((function({className:e="",label:t,params:n}){return n?(0,a.jsx)(Sr,{className:`${e} ui--Nonce`,label:t,params:n.toString()}):null}));var Ir=n(84450);const Br=y.z.div`
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
`,Dr=s.memo((function({className:e,id:t}){const n=(0,Ir.jC)(t),i=(0,s.useMemo)((()=>n.filter((({isDisabled:e,isUnreachable:t})=>!e&&!t))),[n]);if(!n.length)return null;const{text:r,ui:o,value:l}=i.length?i[i.length-1]:n[0];return(0,a.jsxs)(Br,{className:e,children:[(0,a.jsx)(Xa,{isInline:!0,logo:o.logo||"empty",withoutHl:!0}),i.length?(0,a.jsx)("a",{className:"chainAlign",href:`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(l)}`,children:r}):r]})})),Lr=s.memo((function({autoFocus:e,children:t,className:n="",defaultValue:s,isDisabled:i,isError:r,isFull:o,label:l,labelExtra:c,name:d,onChange:u,onEnter:m,onEscape:h,tabIndex:p,value:g,withLabel:f}){return(0,a.jsx)(tn.ZP,{autoFocus:e,className:`${n} ui--Password`,defaultValue:s,isDisabled:i,isError:r,isFull:o,label:l,labelExtra:c,name:d,onChange:u,onEnter:m,onEscape:h,tabIndex:p,type:"password",value:g,withLabel:f,children:t})}));var Pr=n(81679),Tr=n.n(Pr);Tr().config({allowPassphrases:!0,maxLength:128,minLength:8,minPhraseLength:20});const Vr=y.z.div`
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
`,Mr=s.memo((function({className:e="",value:t}){const{t:n}=(0,R.$)(),s={width:100*function(e){const t=Tr().test(e),n=Math.max(0,t.passedTests.length-t.failedTests.length);return t.isPassphrase?7:n}(t)/7+"%"};return(0,a.jsxs)(Vr,{className:e,style:{display:t?"flex":"none"},children:[n("weak"),(0,a.jsx)("div",{className:"ui--Strength-bar",children:(0,a.jsx)("div",{className:"ui--Strength-bar-highlighted",style:s})}),n("strong")]})})),Fr=y.z.div`
  width: 100%;
  .progress-container {
    display: flex;
    height: 1rem;
    background-color: #e0e0e0;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
  }

  .progress-segment {
    position: relative;
    background-color: transparent;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .progress-bar {
    background-color: ${({$color:e})=>e};
    height: 100%;
    transition: width 0.3s ease;
  }

  .marker {
    position: absolute;
    left: 0;
    top: -0.5rem;
    width: 2px;
    height: 1.5rem;
    background-color: #FFFFFF;
  }

  .labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .label {
    text-align: center;
    font-size: 0.875rem;
  }
`,zr=s.memo((function({color:e,sections:t}){const n=t?.reduce(((e,t)=>e+t.total),0);return(0,a.jsxs)(Fr,{$color:e,children:[(0,a.jsx)("div",{className:"progress-container",children:t?.map(((e,t)=>{const s=e.total/n*100,i=e.value/e.total*100;return(0,a.jsxs)("div",{className:"progress-segment",style:{width:`${s}%`},children:[(0,a.jsx)("div",{className:"progress-bar",style:{width:`${i}%`}}),(0,a.jsx)("div",{className:"marker"})]},t)}))}),(0,a.jsx)("div",{className:"labels",children:t.map(((e,n)=>(0,a.jsx)("div",{className:"label",style:{width:100/t.length+"%"},children:e.label},n)))})]})})),Zr=y.z.div`
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
`,Rr=s.memo((function({className:e="",defaultValue:t,label:n,onChange:s,onClick:i,options:r,sortDirection:o}){return(0,a.jsxs)(Zr,{className:`${e} ui--Sort`,children:[(0,a.jsx)(en.Z,{defaultValue:t,label:n,onChange:s,options:r}),(0,a.jsxs)("button",{onClick:i,children:[(0,a.jsx)(w.Z,{className:"arrow up"+("ascending"===o?" isActive":""),color:"gray",icon:"sort-up"}),(0,a.jsx)(w.Z,{className:"arrow down"+("descending"===o?" isActive":""),color:"gray",icon:"sort-down"})]})]})})),$r=s.memo((function({className:e="",stakingInfo:t}){const n=t?.stakingLedger?.active?.unwrap();return n?.gtn(0)?(0,a.jsx)(ne.Z,{className:e,value:n}):null}));var qr=n(56245);function Hr(e){switch(e){case"error":return"ban";case"event":case"eventWarn":return"assistive-listening-systems";case"received":return"telegram-plane";default:return"check"}}function Ur({account:e,action:t,id:n,message:s,removeItem:i,status:r}){return(0,a.jsx)("div",{className:`item ${r}`,children:(0,a.jsx)("div",{className:"wrapper",children:(0,a.jsxs)("div",{className:"container",children:[(0,a.jsx)(w.Z,{icon:"times",onClick:i}),(0,a.jsx)("div",{className:"short",children:(0,a.jsx)(w.Z,{icon:Hr(r)})}),(0,a.jsxs)("div",{className:"desc",children:[(0,a.jsx)("div",{className:"header",children:Array.isArray(t)?t.map(((e,t)=>(0,a.jsx)("div",{children:e},t))):t}),e&&(0,a.jsx)(ct,{value:e}),(0,a.jsx)("div",{className:"status",children:s})]})]})})},n)}function Wr({error:e,extrinsic:t,id:n,removeItem:s,rpc:i,status:r}){let{method:o,section:l}=i;if(t){const e=t.registry.findMetaCall(t.callIndex);"unknown"!==e.section&&(o=e.method,l=e.section)}const c=function(e){switch(e){case"cancelled":return"ban";case"completed":case"inblock":case"finalized":case"sent":return"check";case"dropped":case"invalid":case"usurped":return"arrow-down";case"error":case"finalitytimeout":return"exclamation-triangle";case"queued":return"random";default:return"spinner"}}(r);return(0,a.jsx)("div",{className:`item ${r}`,children:(0,a.jsx)("div",{className:"wrapper",children:(0,a.jsxs)("div",{className:"container",children:[qr.z.includes(r)&&(0,a.jsx)(w.Z,{icon:"times",onClick:s}),(0,a.jsx)("div",{className:"short",children:"spinner"===c?(0,a.jsx)(W,{variant:"push"}):(0,a.jsx)(w.Z,{icon:c})}),(0,a.jsxs)("div",{className:"desc",children:[(0,a.jsxs)("div",{className:"header",children:[l,".",o]}),(0,a.jsx)("div",{className:"status",children:e?e.message||e.toString():r})]})]})})},n)}const Or=y.z.div`
  display: inline-block;
  overflow: hidden;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  transition-property: width;
  transition-duration: 0.75s;
  width: 4.5rem;
  z-index: 1001;

  &:hover {
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
`,Qr=s.memo((function({className:e=""}){const{stqueue:t,txqueue:n}=(0,ve.L)(),[i,r]=(0,s.useState)([]),[o,l]=(0,s.useState)([]);return(0,s.useEffect)((()=>{r(function(e){return(e||[]).filter((({isCompleted:e})=>!e))}(t))}),[t]),(0,s.useEffect)((()=>{l(function(e){return(e||[]).filter((({status:e})=>!["completed","incomplete"].includes(e)))}(n))}),[n]),i.length||o.length?(0,a.jsxs)(Or,{className:`${e} ui--Status`,children:[o.map(Wr),i.map(Ur)]}):null})),Gr=y.z.div`
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
`,Jr=s.memo((function({children:e,className:t="",isSmall:n}){return(0,a.jsx)(Gr,{className:`${t}${n?" isSmall":""}`,children:e})}));var Kr=n(73557),Yr=n(59149);const Xr=y.z.div`
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
`,_r=s.memo((function({className:e="",icon:t,text:n}){return(0,a.jsxs)(Xr,{className:`${e} active-tab`,children:[(0,a.jsx)(w.Z,{icon:t}),(0,a.jsx)("span",{children:n})]})}));var eo=n(39857);const to=(0,y.z)(eo.OL)`
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
`,no=s.memo((function({basePath:e,className:t="",count:n,hasParams:s,index:i,isExact:r,isRoot:o,name:l,text:c}){const d=o?e:`${e}/${l}`,u=r||!s||0===i;return(0,a.jsxs)(to,{className:`${t} ui--Tab`,end:u,to:d,children:[(0,a.jsx)("div",{className:"tabLinkText",children:c}),!!n&&(0,a.jsx)(C,{className:"tabCounter",color:"counter",info:n})]})})),ao=y.z.div`
  height: 100%;
  width: auto;
`,so=s.memo((function({className:e=""}){return(0,a.jsx)(ao,{className:e,children:(0,a.jsx)("svg",{fill:"none",height:"47",viewBox:"0 0 17 65",width:"17",xmlns:"http://www.w3.org/2000/svg",children:(0,a.jsx)("path",{className:"highlight--stroke",d:"M1 1L16 32.5L1 64",stroke:"#D1D1D1"})})})})),io=y.z.header`
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
`,ro=s.memo((function({basePath:e,className:t="",hidden:n,items:i}){const r=(0,Kr.TH)(),{icon:o,text:l}=s.useContext(Yr.m),c=(0,s.useMemo)((()=>i.filter((e=>!(!e||n&&n.includes(e.name))))),[n,i]);return(0,s.useEffect)((()=>function(e,t,n,a){if(t.pathname!==e){const[,,s]=t.pathname.split("/"),i=n.find((e=>e&&e.alias===s));i?window.location.hash=i.isRoot?e:`${e}/${i.name}`:!a||!a.includes(s)&&n.some((e=>e&&!e.isRoot&&e.name===s))||(window.location.hash=e)}}(e,r,i,n)),[e,n,i,r]),(0,a.jsx)(io,{className:`${t} ui--Tabs`,children:(0,a.jsxs)("div",{className:"tabs-container",children:[l&&o&&(0,a.jsx)(_r,{icon:o,text:l}),(0,a.jsx)(so,{}),(0,a.jsx)("ul",{className:"ui--TabsList",children:c.map(((t,n)=>(0,a.jsx)("li",{className:t.isHidden?"--hidden":"",children:(0,s.createElement)(no,{...t,basePath:e,index:n,key:t.name})},n)))})]})})})),oo=(0,y.z)(fn.Z)`
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
`,lo=s.memo((function({children:e,className:t,isError:n,isReadOnly:i,label:r,onChange:o,seed:l,withLabel:c}){const d=(0,s.useCallback)((({target:{value:e}})=>{o&&o(e)}),[o]);return(0,a.jsx)(oo,{className:t,label:r,withLabel:c,children:(0,a.jsxs)("div",{className:"TextAreaWithDropdown",children:[(0,a.jsx)("textarea",{autoCapitalize:"off",autoCorrect:"off",autoFocus:!1,className:n?"ui-textArea-withError":"",onChange:d,readOnly:i,rows:2,spellCheck:!1,value:l}),e]})})})),co=s.memo((function({index:e,isDisabled:t,isSelected:n,onChange:i,text:r,value:o}){const l=(0,s.useCallback)((()=>{!t&&i(e,o)}),[t,e,i,o]);return(0,a.jsx)(K,{icon:n?"check":"circle",isBasic:!0,isDisabled:t,isSelected:n,label:r,onClick:l},r)})),uo=y.z.div`
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
`,mo=s.memo((function({className:e="",onChange:t,options:n,value:i}){const r=(0,s.useMemo)((()=>n.filter((e=>!!e))),[n]);return r.length&&r[0].value?(0,a.jsx)(uo,{className:`${e} ui--ToggleGroup`,children:r.map((({isDisabled:e,text:n,value:s},r)=>(0,a.jsx)(co,{index:r,isDisabled:e,isSelected:i===r,onChange:t,text:n,value:s},r)))}):null})),ho=y.z.div`
  display: flex;
  align-items: center;
`,po=y.z.div`
  position: relative;
`,go=y.z.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`,fo=y.z.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`,bo=y.z.div`
  width: 20px;
  height: 20px;
  background-color: ${e=>e.color};
  margin-right: 10px;
`,xo=s.memo((function({data:e}){const t=2*Math.PI*50,n=e.reduce(((e,t)=>e+t.value),0);let s=0;return n?(0,a.jsxs)(ho,{children:[(0,a.jsx)(po,{children:(0,a.jsxs)("svg",{height:100,viewBox:"0 0 100 100",width:100,children:[(0,a.jsx)("circle",{cx:50,cy:50,fill:"none",r:42.5,stroke:"#f0f0f0",strokeWidth:15}),e.map(((e,i)=>{const r=e.value/n*100,o=r/100*t,l=s/100*t;return s+=r,(0,a.jsx)("circle",{cx:50,cy:50,fill:"none",r:42.5,stroke:e.color,strokeDasharray:`${o} ${t-o}`,strokeDashoffset:-l,strokeWidth:15,transform:"rotate(-90 50 50)",children:(0,a.jsx)("title",{children:`${e.label}: ${r.toFixed(2)}%`})},i)}))]})}),(0,a.jsx)(go,{children:e.map(((e,t)=>(0,a.jsxs)(fo,{children:[(0,a.jsx)(bo,{color:e.color}),(0,a.jsx)("span",{children:`${e.label}: ${(e.value/n*100).toFixed(2)}%`})]},t)))})]}):(0,a.jsx)(a.Fragment,{})})),vo=s.memo((function({className:e="",filter:t,onChange:n}){const{t:s}=(0,R.$)();return(0,a.jsx)(Tn,{className:e,filter:t,label:s("vote with account"),onChange:n,type:"account",withLabel:!0})})),Ao=s.memo((function({children:e,className:t="",isReferenda:n,label:s,params:i}){const{api:r}=(0,l.h)(),o=(0,be.W7)(r.derive.balances?.all,[i]);return(0,a.jsx)(ne.Z,{className:t,label:s,value:n&&r.query.convictionVoting&&o?o.votingBalance.add(o.reservedBalance):o?.votingBalance,children:e})})),wo=["pyconvot","democrac","phrelect"],yo=s.memo((function({accountId:e,autoFocus:t,isReferenda:n,label:i,noDefault:r,onChange:o}){const{t:c}=(0,R.$)(),{api:d}=(0,l.h)(),u=(0,be.W7)(d.derive.balances?.all,[e]),[{defaultValue:m,maxValue:h,selectedId:p,value:g},f]=(0,s.useState)({defaultValue:ie.nw,maxValue:ie.nw,value:ie.nw});(0,s.useEffect)((()=>{u&&u.accountId.eq(e)&&f((t=>t.selectedId!==e?function(e,t,n,a,s,i){const r=a.lockedBreakdown.sort(((e,t)=>t.amount.cmp(e.amount))).sort(((e,t)=>{if(!e.id.eq(t.id))for(let n=0,a=wo.length;n<a;n++){const a=wo[n];if(e.id.eq(a))return-1;if(t.id.eq(a))return 1}return 0})).map((({amount:e})=>e)),o=i&&e.query.convictionVoting?a.votingBalance.add(a.reservedBalance):a.votingBalance;let l=r[0]||a.lockedBalance;if(n)l=ie.nw;else if(l.isZero()){let e=o.sub(s);for(let t=0;t<3;t++)e.gt(s)&&(l=e,e=e.sub(s))}return{defaultValue:l,maxValue:o,selectedId:t,value:l}}(d,e,r,u,d.consts.balances.existentialDeposit,!!n):t))}),[u,e,d,n,r]),(0,s.useEffect)((()=>{o(g)}),[o,g]);const b=(0,s.useCallback)((t=>f((n=>n.selectedId===e&&t&&!t.eq(n.value)?{...n,value:t}:n))),[e]),x=e!==p;return(0,a.jsx)(ca.Z,{autoFocus:t,defaultValue:x?void 0:m,isDisabled:x,isZeroable:!0,label:i||c("vote value"),labelExtra:(0,a.jsx)(Ao,{isReferenda:n,label:(0,a.jsx)("label",{children:c("voting balance")}),params:e}),maxValue:h,onChange:b})}));var ko=n(72152)},21779:(e,t,n)=>{n.d(t,{z:()=>a.zo});var a=n(31383)},37731:(e,t,n)=>{n.d(t,{Z:()=>g,B:()=>c});var a=n(31383);const s=["2000","1900","1800","1700","1600","1500","1400","1300","1200","1100","1000","900","800","700","600","500","400"].map((e=>`\n  .media--${e} {\n    @media only screen and (max-width: ${e}px) {\n      display: none !important;\n    }\n  }\n\n  .media--${e}-noPad {\n    @media only screen and (max-width: ${e}px) {\n      min-width: 0 !important;\n      padding: 0 !important;\n    }\n  }\n`)).join("");var i=n(69316);const r=160,o=[.2126,.7152,.0722],l=[0,2,4],c="#f19135";function d(e){return e||c}function u(e){const t=d(e).replace("#","").toLowerCase();return l.reduce(((e,n,a)=>e+parseInt(t.substring(n,n+2),16)*o[a]),0)}function m(e){return u(e)>r?"rgba(45, 43, 41, 0.875)":"rgba(255, 253, 251, 0.875)"}function h(e){const t=u(e);return t<16?"rgba(255, 255, 255, 0.15)":t<r?"rgba(0, 0, 0, 0.15)":"rgba(255, 255, 255, 0.15)"}function p(e,t){const n=parseInt(e.slice(1,3),16),a=parseInt(e.slice(3,5),16),s=parseInt(e.slice(5,7),16);return t?`rgba(${n}, ${a}, ${s}, ${t})`:`rgb(${n}, ${a}, ${s})`}const g=(0,a.vJ)((({uiHighlight:e})=>`\n  .highlight--all {\n    background: ${d(e)} !important;\n    border-color: ${d(e)} !important;\n    color: ${d(e)} !important;\n  }\n\n  .highlight--before:before {\n    background: ${d(e)} !important;\n  }\n\n  .highlight--before-border:before {\n    border-color: ${d(e)} !important;\n  }\n\n  .highlight--bg {\n    background: ${d(e)} !important;\n  }\n\n  .highlight--bg-contrast {\n    background: ${m(e)};\n  }\n\n  .ui--MenuItem.isActive .ui--Badge {\n    background: ${d(e)};\n    color: ${m(e)} !important;\n  }\n\n  .ui--MenuItem {\n    & .ui--Badge {\n      color: ${u(e)<r?"#fff":"#424242"};\n    }\n\n    &:hover:not(.isActive) .ui--Badge {\n      background: ${u(e)<r?"rgba(255, 255, 255, 0.8)":"#4D4D4D"};\n      color: ${u(e)>r?"#fff":"#424242"};\n    }\n  }\n\n  .ui--Tab .ui--Badge {\n    background: ${d(e)};\n    color: ${u(e)<r?"#fff":"#424242"};\n  }\n\n  .highlight--bg-faint,\n  .highlight--bg-light {\n    background: var(--bg-table);\n    position: relative;\n\n    &:before {\n      background: ${d(e)};\n      bottom: 0;\n      content: ' ';\n      left: 0;\n      position: absolute;\n      right: 0;\n      top: 0;\n      z-index: -1;\n    }\n  }\n\n  .highlight--bg-faint:before {\n    opacity: 0.025;\n  }\n\n  .highlight--bg-light:before {\n    opacity: 0.2;\n  }\n\n  .highlight--border {\n    border-color: ${d(e)} !important;\n  }\n\n  .highlight--color {\n    color: ${d(e)} !important;\n  }\n\n  .highlight--color-contrast {\n    color: ${m(e)};\n  }\n\n  .highlight--fill {\n    fill: ${d(e)} !important;\n  }\n\n  .highlight--gradient {\n    background: linear-gradient(90deg, ${e||c}, transparent);\n  }\n\n  .ui--MenuItem.topLevel:hover,\n  .ui--MenuItem.isActive.topLevel:hover {\n    color: ${m(e)};\n\n    a {\n      background-color: ${h(e)};\n    }\n  }\n\n  .menuItems li:hover .groupHdr {\n    background: ${h(e)};\n    color: ${m(e)};\n  }\n\n  .groupMenu {\n    background: ${d(e)} !important;\n\n    &::before {\n      background: ${h(e)};\n      color:  ${m(e)};\n    }\n    li {\n      color:  ${m(e)};\n    }\n  }\n\n  .highlight--hover-bg:hover {\n    background: ${d(e)} !important;\n  }\n\n  .highlight--hover-color:hover {\n    color: ${d(e)} !important;\n  }\n\n  .highlight--icon {\n    .ui--Icon {\n      color: ${d(e)} !important;\n    }\n  }\n\n  .highlight--shadow {\n    box-shadow: 0 0 1px ${d(e)} !important;\n  }\n\n  .highlight--stroke {\n    stroke: ${d(e)} !important;\n  }\n\n  .ui--Button {\n    &:not(.isDisabled):not(.isIcon):not(.isBasic),\n    &.withoutLink:not(.isDisabled) {\n      .ui--Icon {\n        background: ${d(e)};\n        color: ${m(e)};\n      }\n    }\n\n    &.isBasic:not(.isDisabled):not(.isIcon):not(.isSelected) {\n      &:not(.isReadOnly) {\n        box-shadow: 0 0 1px ${d(e)};\n      }\n\n      .ui--Icon {\n        color: ${d(e)};\n      }\n    }\n\n    &.isSelected {\n      box-shadow: 0 0 1px ${d(e)};\n    }\n\n    &:hover:not(.isDisabled):not(.isReadOnly),\n    &.isSelected {\n      background: ${d(e)};\n      color: ${m(e)};\n      text-shadow: none;\n\n      &:not(.isIcon),\n      &.withoutLink {\n        .ui--Icon {\n          color: inherit;\n        }\n      }\n    }\n  }\n\n  .ui--Table td .ui--Button {\n    &:not(.isDisabled):not(.isIcon):not(.isToplevel),\n    &.withoutLink:not(.isDisabled) {\n      &:hover {\n        .ui--Icon {\n          color: ${m(e)};\n        }\n      }\n\n      .ui--Icon {\n        background: transparent;\n        color: inherit;\n        color: ${d(e)};\n      }\n    }\n  }\n\n  .ui--Popup .ui--Button.isOpen:not(.isDisabled):not(.isReadOnly) {\n    background: ${d(e)} !important;\n    color: ${m(e)} !important;\n\n    .ui--Icon {\n      background: transparent !important;\n      color: ${m(e)} !important;\n    }\n  }\n\n\n  .ui--Menu {\n    .ui--Menu__Item:hover {\n       background: ${p(d(e),".1")};\n    }\n\n    .ui--Toggle.isChecked .ui--Toggle-Slider {\n      background: ${d(e)};\n\n      &::before {\n        border-color: ${d(e)};\n      }\n    }\n  }\n\n  .ui--Sort {\n    .ui--Labelled.ui--Dropdown:hover {\n     .ui.selection.dropdown {\n        border-color: ${d(e)};\n\n       .visible.menu {\n         border: 1px solid ${d(e)};\n        }\n      }\n    }\n\n    button:hover {\n      border-color: ${d(e)};\n    }\n\n    button:hover,\n    .ui--Labelled.ui--Dropdown:hover {\n      &::after {\n        background-color:  ${d(e)};\n      }\n    }\n\n    .arrow.isActive {\n      color:  ${d(e)};\n      opacity: 1;\n    }\n  }\n\n  .theme--dark,\n  .theme--light {\n    .ui--Tabs .active .tabLinkText::after {\n      background: ${d(e)};\n    }\n\n    .ui.primary.button,\n    .ui.buttons .primary.button {\n      background: ${d(e)};\n\n      &.active,\n      &:active,\n      &:focus,\n      &:hover {\n        background-color: ${d(e)};\n      }\n    }\n\n    .ui--Toggle.isChecked {\n      &:not(.isRadio) {\n        .ui--Toggle-Slider {\n          background: ${d(e)} !important;\n\n          &:before {\n            border-color: ${d(e)} !important;\n          }\n        }\n      }\n    }\n  }\n\n  .ui--ExpandButton:hover {\n    border-color: ${d(e)} !important;\n\n    .ui--Icon {\n      color: ${d(e)} !important;\n    }\n  }\n\n  .ui--Tag.themeColor.lightTheme,\n  .ui--InputTags.lightTheme .ui.label {\n    background: ${p(d(e),"0.08")};\n    color: ${u(e)>r?"#424242":d(e)};\n  }\n\n  .ui--Tag.themeColor.darkTheme,\n  .ui--InputTags.darkTheme .ui.label {\n    color: ${u(e)>r?d(e):"#fff"};\n  }\n\n  #root {\n    background: var(--bg-page);\n    color: var(--color-text);\n    font: var(--font-sans);\n    font-weight: var(--font-weight-normal);\n    height: 100%;\n  }\n\n  a {\n    cursor: pointer;\n  }\n\n  article {\n    background: var(--bg-table);\n    border: 1px solid #f2f2f2;\n    border-radius: 0.25rem;\n    box-sizing: border-box;\n    margin: 0.25rem;\n    padding: 1.25rem;\n    position: relative;\n    text-align: left;\n\n    > ul {\n      margin: 0;\n      padding: 0;\n    }\n\n    &.error,\n    &.warning {\n      border-left-width: 0.25rem;\n      font-size: var(--font-size-small);\n      line-height: 1.5;\n      margin-left: 2.25rem;\n      padding: 0.75rem 1rem;\n      position: relative;\n      z-index: 5;\n\n      &:before {\n        border-radius: 0.25rem;\n        bottom: 0;\n        content: ' ';\n        left: 0;\n        position: absolute;\n        right: 0;\n        top: 0;\n        z-index: -1;\n      }\n    }\n\n    &.mark {\n      margin: 0.5rem 0 0.5rem 2.25rem;\n      padding: 0.5rem 1rem !important;\n    }\n\n    &.nomargin {\n      margin-left: 0;\n    }\n\n    &.extraMargin {\n      margin: 2rem auto;\n    }\n\n    &.centered {\n      margin: 1.5rem auto;\n      max-width: 75rem;\n\n      &+.ui--Button-Group {\n        margin-top: 2rem;\n      }\n    }\n\n    &.error {\n      &:before {\n        background: rgba(255, 12, 12, 0.05);\n      }\n\n      border-color: rgba(255, 12, 12, 1);\n    }\n\n    &.padded {\n      padding: 0.75rem 1rem;\n\n      > div {\n        margin: 0.25rem;\n      }\n    }\n\n    &.warning {\n      &:before {\n        background: rgba(255, 196, 12, 0.05);\n      }\n\n      border-color: rgba(255, 196, 12, 1);\n    }\n  }\n\n  body {\n    height: 100%;\n    margin: 0;\n    font: var(--font-sans);\n  }\n\n  br {\n    line-height: 1.5rem;\n  }\n\n  details {\n    cursor: pointer;\n\n    &[open] > summary {\n      white-space: normal;\n\n      br, br + * {\n        display: block;\n      }\n    }\n\n    > summary {\n      text-overflow: ellipsis;\n      overflow: hidden;\n      white-space: nowrap;\n      outline: none;\n\n      br, br + * {\n        display: none;\n      }\n    }\n  }\n\n  h1, h2, h3, h4, h5 {\n    color: var(--color-header);\n    font: var(--font-sans);\n    font-weight: var(--font-weight-header);\n    margin-bottom: 0.25rem;\n  }\n\n\n  h1 {\n    font-size: var(--font-size-h1);\n    text-transform: lowercase;\n\n    em {\n      font-style: normal;\n      text-transform: none;\n    }\n  }\n\n  h2 {\n    font-size: var(--font-size-h2);\n  }\n\n  h3 {\n    font-size: var(--font-size-h3);\n  }\n\n  h4 {\n    font-size: var(--font-size-h4);\n  }\n\n  header {\n    margin-bottom: 1.5rem;\n    text-align: center;\n\n    > article {\n      background: transparent;\n    }\n  }\n\n  html {\n    height: 100%;\n  }\n\n  label {\n    box-sizing: border-box;\n    display: block;\n    font: var(--font-sans);\n  }\n\n  // we treat h5 and label as equivalents\n  label, h5 {\n    color: var(--color-label);\n    font-size: var(--font-size-label);\n    font-style: normal;\n    font-weight: var(--font-weight-label);\n    line-height: 1rem;\n    margin-bottom: 0.25rem !important;\n    text-transform: var(--text-transform-label);\n    vertical-align: middle;\n  }\n\n  button {\n    font-size: var(--font-size-small);\n    font-weight: var(--font-weight-normal);\n  }\n\n  main {\n    > section {\n      margin-bottom: 2em;\n    }\n  }\n\n  /* Add our overrides */\n  \n  .ui.hidden.divider {\n    margin: 0.5rem 0;\n  }\n\n  .ui.dropdown {\n    display: block;\n    min-width: 0;\n    width: 100%;\n  }\n\n  .ui.dropdown,\n  .ui.input {\n    margin: 0.25rem 0;\n  }\n\n  .ui.selection.dropdown,\n  .ui.input > input,\n  .ui.selection.dropdown > input {\n    background: var(--bg-input);\n    border-color: var(--border-input);\n    color: var(--color-text);\n    font: var(--font-sans);\n    font-size: var(--font-size-base);\n\n    &:focus {\n      background: var(--bg-input);\n      color: var(--color-text);\n    }\n  }\n\n  .ui.action.input > .buttons {\n    position: relative;\n  }\n\n  .ui.dropdown {\n    &.disabled {\n      background: transparent;\n      border-style: dashed;\n      opacity: 1;\n\n      .dropdown.icon {\n        opacity: 0;\n      }\n    }\n\n    &.selection.visible {\n      background: var(--bg-input);\n      color: var(--color-text);\n    }\n\n    .menu {\n      background: var(--bg-input);\n      color: var(--color-text);\n\n      > .item {\n        border-color: transparent !important;\n        color: var(--color-text) !important;\n\n        &.header.disabled {\n          margin: 1em 0 0 0;\n          opacity: 1;\n\n          &:hover,\n          &.selected {\n            background: var(--bg-input);\n          }\n        }\n      }\n    }\n\n    > .text {\n      min-height: 1em;\n\n      &:not(.default) {\n        color: var(--color-text) !important;\n      }\n    }\n  }\n\n  .ui.input {\n    width: 100%;\n\n    &.disabled:not(.retain-appearance) {\n      opacity: 1;\n\n      input {\n        background: transparent;\n        border-style: dashed;\n      }\n\n      .ui.buttons {\n        .ui.button {\n          background: transparent;\n        }\n\n        &.primary .ui.button {\n          background-color: #666;\n          border-color: transparent;\n          color: #f9f8f7;\n          opacity: 0.5;\n\n          .dropdown.icon {\n            opacity: 0;\n          }\n        }\n      }\n    }\n\n    &.error input {\n      background-color: var(--bg-input-error);\n      border-color: #e0b4b4;\n    }\n\n    > input {\n      width: 0;\n    }\n  }\n\n  .ui.label {\n    background: transparent;\n    font-weight: var(--font-weight-normal);\n    position: relative;\n    z-index: 1;\n  }\n\n  .ui.page.modals.transition.visible {\n    display: flex !important;\n  }\n\n  .ui.secondary.vertical.menu > .item {\n    margin: 0;\n  }\n\n  .ui[class*="left icon"].input.left.icon > input {\n    padding-left: 4rem !important;\n  }\n\n  .ui[class*="left icon"].input.left.icon > .ui--Icon.big {\n    left: -7px;\n    opacity: 1;\n  }\n\n  /* modals aligned to top, not center */\n  .ui.dimmer {\n    background-color: rgba(96, 96, 96, 0.5);\n    justify-content: flex-start;\n  }\n\n  /* remove the default white background, settings app has it as part of Tab */\n  .ui.segment {\n    background: transparent;\n  }\n\n  ${i.ZP}\n  \n  .ui--grid,\n  .ui--row {\n    width: 100%;\n  }\n\n  .ui--grid,\n  .ui--row {\n    align-items: stretch;\n    display: flex;\n    flex-wrap: nowrap;\n    flex-direction: row;\n    justify-content: flex-start;\n    text-align: left;\n    min-width: 0;\n  }\n\n  .ui--grid > div,\n  .ui--row > div {\n    box-sizing: border-box;\n    min-width: 0;\n  }\n\n  .ui--grid > div:not(.grow):not(.shrink),\n  .ui--row > div:not(.grow):not(.shrink) {\n    width: 100%;\n  }\n\n  .ui--grid > div:not(.shrink),\n  .ui--grid > div.full,\n  .ui--row > div.full {\n    flex: 0 100%;\n  }\n\n  .ui--grid > div.shrink,\n  .ui--row > div.shrink {\n    flex: 0 1 auto;\n  }\n\n  .ui--grid > div.grow,\n  .ui--row > div.grow {\n    flex: 1 1 auto;\n  }\n\n  .ui--grid > div.large,\n  .ui--row > div.large {\n    flex: 0 75%;\n  }\n\n  .ui--grid > div.medium,\n  .ui--row > div.medium {\n    flex: 0 50%;\n  }\n\n  .ui--grid > div.small,\n  .ui--row > div.small {\n    flex: 0 25%;\n  }\n\n  .ui--grid > div.sixty6,\n  .ui--row > div.sixty6 {\n    flex: 0 66.66%;\n  }\n\n  .ui--grid > div.thirty3,\n  .ui--row > div.thirty3 {\n    flex: 0 33.33%;\n  }\n\n  ${s}\n  \n  .ui--output {\n    background: var(--bg-input);\n    border-radius: 4px;\n    border: 1px dashed #eee;\n    box-sizing: border-box;\n    line-height: 1rem;\n    max-height: 25rem;\n    overflow-y: auto;\n    padding: 0.75rem 1rem;\n    position: relative;\n    word-break: break-all;\n\n    &.error {\n      background: var(--bg-input-error);\n      border-color: #e0b4b4;\n    }\n\n    &.monospace {\n      font-family: monospace;\n    }\n  }\n\n  header .ui--Button-Group {\n    text-align: center;\n  }\n\n  .ui.input .ui--Button-Group {\n    margin: 0;\n  }\n\n  button.u.ui--Icon.icon-button {\n    padding-top: 0;\n    padding-right: 0;\n    padding-bottom: 0.3em;\n    padding-left: 0.3em;\n    color: #2e86ab !important;\n    background: none !important;\n  }\n\n  button.ui--Button {\n    font: var(--font-sans);\n  }\n\n  .editable {\n    cursor: pointer;\n  }\n\n  .ui--DropdownLinked.ui--row {\n    .small .ui.selection.dropdown {\n      border-right: none;\n      border-bottom-right-radius: 0;\n      border-top-right-radius: 0;\n      min-width: 5rem;\n    }\n\n    .large .ui.selection.dropdown {\n      border-left: none;\n      border-bottom-left-radius: 0;\n      border-top-left-radius: 0;\n    }\n  }\n\n  .ui--Identicon-React-Base {\n    border: 1px solid var(--border-identicon);\n    border-radius: 50%;\n    display: inline-block;\n    overflow: hidden;\n\n    svg circle:first-child {\n      fill: var(--bg-identicon-circle);\n    }\n  }\n\n  .ui--Input {\n    &.disabled {\n      overflow: hidden;\n\n      input {\n        overflow: hidden;\n        text-overflow: ellipsis;\n        white-space: nowrap;\n      }\n    }\n\n    &.inPlaceEditor {\n      margin: 0 !important;\n\n      input {\n        padding: 0 !important;\n        background: rgba(230, 230, 230, 0.8) !important;\n        border: 0 !important;\n        border-radius: 0 !important;\n        box-shadow: 0 3px 3px rgba(0,0,0,.2);\n      }\n    }\n\n    &.isWarning.ui.input {\n      > input,\n      input:focus {\n        background: #ffffe0;\n        border-color: #eeeeae;\n      }\n    }\n\n    .ui--SiDropdown {\n      width: 6rem;\n      text-align: center;\n    }\n  }\n\n  .ui--Static {\n    min-width: 2rem; /* adjust width from normal dropdown sizing */\n    overflow: hidden;\n    word-break: break-all;\n  }\n\n  .ui--Tooltip {\n    text-align: center;\n    z-index: 1002;\n    max-width: 300px;\n\n\n    &.accounts-badge {\n      background-color: var(--bg-menu) !important;\n      color: var(--color-text) !important;\n      box-shadow: 0 2px 4px 0 rgb(34 36 38 / 12%), 0 2px 10px 0 rgb(34 36 38 / 15%);\n      z-index: 999;\n\n      &.place-top::after {\n        border-top-color: var(--bg-menu) !important;\n      }\n\n      &.place-right::after {\n        border-right-color: var(--bg-menu) !important;\n      }\n\n    a {\n      color: #3BBEFF;\n\n      &.purpleColor {\n        color: #E6007A;\n      }\n    }\n  }\n\n`))},69316:(e,t,n)=>{n.d(t,{Iv:()=>a,ZP:()=>s});const a="#2e86ab",s=`\n  .theme--dark,\n  .theme--light {\n    a:not(.ui--Tab) {\n      color: ${a};\n\n      &:hover,\n      a:visited {\n        color: ${a};\n      }\n    }\n\n    .ui--Button {\n      &.isIcon:not(.isDisabled):not(.withoutLink):not(:hover) {\n        .ui--Icon {\n          color: ${a};\n        }\n      }\n    }\n\n    .ui.modal > .header:not(.ui) {\n      border-bottom-color: #767778;\n    }\n\n    .ui.negative.button,\n    .ui.buttons .negative.button {\n      background: #666 !important;\n    }\n  }\n`},43151:(e,t,n)=>{n.d(t,{$:()=>s,Z:()=>i});var a=n(61349);function s(){return(0,a.$G)("react-components")}function i(e){return(0,a.Zh)(["react-components"])(e)}},14081:(e,t,n)=>{n.d(t,{L:()=>s});var a=n(69187);function s(e,t=null){let n;try{const s=a.Nn.getAddress(e,t);n=s?.meta}catch{}return n||{}}},73477:(e,t,n)=>{n.d(t,{r7:()=>i,xW:()=>r,C9:()=>o,Ly:()=>l.L,s2:()=>c,oX:()=>m,Hc:()=>f});var a=n(69187),s=n(33661);function i(e,t,n,i="",r=!1){let o=!1;const l=i.toLowerCase();if(l||r){if(n){const{accountId:t,accountIndex:a,identity:c,nickname:d}=n,u=!!t&&t.toString().includes(i)||!!a&&a.toString().includes(i);!r&&u?o=!0:(0,s.m)(e.query.identity?.identityOf)?o=!!c&&(!!c.display||!!c.displayParent)&&(u||!!c.display&&c.display.toLowerCase().includes(l)||!!c.displayParent&&c.displayParent.toLowerCase().includes(l)):d&&(o=d.toLowerCase().includes(l))}if(!o){const e=a.Nn.getAddress(t);o=!!e?.meta?.name&&e.meta.name.toLowerCase().includes(l)}}else o=!0;return o}const r=(e,t)=>e.filter((e=>e.value?.toString().toLowerCase().includes(t.toLowerCase())));function o(e){try{const t=e?a.Nn.getPair(e.toString()):null;if(t)return t.meta.isInjected?"injected":t.meta.isHardware?t.meta.hardwareType||"hardware":t.meta.isExternal?t.meta.isMultisig?"multisig":t.meta.isProxied?"proxied":t.meta.isLocal?"chopsticks":"qr":t.type}catch{}return"unknown"}var l=n(14081);function c(e,t=null,n){const a=(0,l.L)(e,t);return a.name?[!1,!1,a.name.toUpperCase()]:n?[!1,!0,n.toUpperCase()]:[!0,!1,e]}var d=n(98083),u=n(95267);function m(e){if(!e)return null;let t;const n=(0,l.L)(e,"contract");try{const e=n.contract&&JSON.parse(n.contract.abi);t=new d.P(e,u.statics.api.registry.getChainProperties())}catch(e){console.error(e)}return t||null}var h=n(74076),p=n(48533),g=n(73493);function f(e,t=!1,n){if(e)try{const s=(0,h.vq)(e)?(0,p.G)(e):a.Nn.decodeAddress(e);if(!t&&32!==s.length&&20!==s.length)throw new Error("AccountIndex values not allowed");if(n&&s.length!==n)throw new Error("Invalid key length");return 20===s.length?(0,g.K)(s):a.Nn.encodeAddress(s)}catch{}}},28097:(e,t,n)=>{n.d(t,{I:()=>s,VU:()=>i,n6:()=>a});const a="Discord";var s;!function(e){e[e.Reservation=0]="Reservation",e[e.Lease=1]="Lease",e[e["Bulk Coretime"]=2]="Bulk Coretime",e[e["On Demand"]=3]="On Demand"}(s||(s={}));const i={Eligible:"eligible",None:"-",Renewed:"renewed"}},11677:(e,t,n)=>{function a(e,t){return(...n)=>{try{return t(...n)}catch(t){throw new Error(`${e}:: ${t.message}:: ${t.stack||"<unknown>"}`)}}}n.d(t,{e:()=>a})},87206:(e,t,n)=>{n.d(t,{E:()=>a});const a=n(2784).createContext({})},68944:(e,t,n)=>{n.d(t,{y:()=>d,u:()=>u});var a=n(52322),s=n(2784),i=n(90778),r=n(74065);const o=60,l=5e3,c=[],d=s.createContext(c);function u({children:e}){const{api:t}=(0,i.h)(),n=(0,s.useCallback)((e=>function(e,t){return 0===t.length?[e]:t.length===o?t.concat(e).slice(-o):t.concat(e)}(function(...e){const t={active:{requests:0,subscriptions:0},total:{bytesRecv:0,bytesSent:0,cached:0,errors:0,requests:0,subscriptions:0,timeout:0}};for(let n=0,a=e.length;n<a;n++){const a=e[n].stats;a&&(t.active.requests+=a.active.requests,t.active.subscriptions+=a.active.subscriptions,t.total.bytesRecv+=a.total.bytesRecv,t.total.bytesSent+=a.total.bytesSent,t.total.cached+=a.total.cached,t.total.errors+=a.total.errors,t.total.requests+=a.total.requests,t.total.subscriptions+=a.total.subscriptions,t.total.timeout+=a.total.timeout)}return{stats:t,when:Date.now()}}(t),e)),[t]),u=function(e,t,n){const[a,i]=(0,s.useState)(t),o=(0,s.useRef)(null),l=(0,r.X)();return(0,s.useEffect)((()=>(function t(){if(o.current=null,l.current){try{i(e)}catch(e){console.error(e)}o.current=setTimeout(t,n)}}(),()=>{o.current&&clearTimeout(o.current)})),[]),a}(n,c,l);return(0,a.jsx)(d.Provider,{value:u,children:e})}},57120:(e,t,n)=>{n.d(t,{U:()=>m,g:()=>h});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(14681);const l=75,c={},d={},u={byAuthor:c,eraPoints:d,lastBlockAuthors:[],lastHeaders:[]},m=s.createContext(u);function h({children:e}){const{api:t,isApiReady:n}=(0,i.h)(),h=(0,r.W7)(n&&t.derive.staking?.currentPoints),[p,g]=(0,s.useState)(u);return(0,s.useEffect)((()=>{t.isReady.then((()=>{let e=[],n=[],a="";t.derive.chain.subscribeNewHeads((t=>{if(t?.number){const s=t.number.unwrap();let i="";t.author&&(i=t.author.toString());const r=(0,o.u)(s);i&&(c[i]=r,r!==a?(a=r,n=[i]):n.push(i)),e=e.filter(((e,t)=>t<l&&e.number.unwrap().lt(s))).reduce(((e,t)=>(e.push(t),e)),[t]).sort(((e,t)=>t.number.unwrap().cmp(e.number.unwrap()))),g({byAuthor:c,eraPoints:d,lastBlockAuthors:n.slice(),lastBlockNumber:a,lastHeader:t,lastHeaders:e})}})).catch(console.error)})).catch(console.error)}),[]),(0,s.useEffect)((()=>{if(h){const e=[...h.individual.entries()].map((([e,t])=>[e.toString(),(0,o.u)(t)])),t=Object.keys(d);t.length!==e.length&&t.forEach((e=>{delete d[e]})),e.forEach((([e,t])=>{d[e]=t}))}}),[h]),(0,a.jsx)(m.Provider,{value:p,children:e})}},44028:(e,t,n)=>{n.d(t,{m:()=>m,w:()=>h});var a=n(52322),s=n(2784),i=n(64021),r=n(11147),o=n(69516),l=n(90778),c=n(9118);const d={eventCount:0,events:[]},u=75,m=s.createContext(d);function h({children:e}){const{api:t,isApiReady:n}=(0,l.h)(),[h,p]=(0,s.useState)(d),g=(0,c.W7)(n&&t.query.system.events),f=(0,s.useRef)({block:null,event:null});return(0,s.useEffect)((()=>{g&&async function(e,t,n,a){const s=n.map(((e,t)=>({indexes:[t],record:e}))).filter((({record:{event:{method:e,section:t}}})=>!("system"===t||["balances","treasury"].includes(t)&&["Deposit","UpdatedInactive","Withdraw"].includes(e)||["transactionPayment"].includes(t)&&["TransactionFeePaid"].includes(e)||["paraInclusion","parasInclusion","inclusion"].includes(t)&&["CandidateBacked","CandidateIncluded"].includes(e)||["relayChainInfo"].includes(t)&&["CurrentBlockNumbers"].includes(e)))).reduce(((e,t)=>{const n=e.find((({record:{event:{method:e,section:n}}})=>t.record.event.section===n&&t.record.event.method===e));return n?n.indexes.push(...t.indexes):e.push(t),e}),[]).reverse(),l=(0,o.R)((0,i.d)((0,r.P)(s)));if(l!==t.event&&s.length){t.event=l;const i=await e.rpc.chain.getHeader(n.createdAtHash),r=i.number.unwrap(),o=i.hash.toHex();o!==t.block&&(t.block=o,a((({events:e})=>({eventCount:n.length,events:[...s.map((({indexes:e,record:t})=>({blockHash:o,blockNumber:r,indexes:e,key:`${r.toNumber()}-${o}-${e.join(".")}`,record:t}))),...e.filter((e=>!e.blockNumber?.eq(r)))].slice(0,u)}))))}else a((({events:e})=>({eventCount:n.length,events:e})))}(t,f.current,g,p).catch(console.error)}),[t,f,g,p]),(0,a.jsx)(m.Provider,{value:h,children:e})}},3773:(e,t,n)=>{n.d(t,{H:()=>h,y:()=>x});var a=n(52322),s=n(2784),i=n(43806),r=n(77984),o=n(69187),l=n(55858),c=n(94175),d=n(90778);const u=()=>!1,m={accounts:{allAccounts:[],allAccountsHex:[],areAccountsLoaded:!1,hasAccounts:!1,isAccount:u},addresses:{allAddresses:[],allAddressesHex:[],areAddressesLoaded:!1,hasAddresses:!1,isAddress:u}},h=s.createContext(m);function p(e,t,n=[]){const a=e?20:32;return t.reduce(((e,t)=>{if(!e.includes(t)&&!n.includes(t))try{(0,c.m)(t).length>=a?e.push(t):console.warn(`Not adding address ${t}, not in correct format for chain (requires publickey from address)`)}catch{console.error(t,a)}return e}),[])}function g(e){return e.map((e=>{try{return(0,l.c)((0,c.m)(e))}catch(t){return console.error(`Unable to convert address ${e} to hex`,t.message),null}})).filter((e=>!!e))}function f(e){return t=>!!t&&e.includes(t.toString())}function b(e,t={},n){const a=p(e,Object.keys(t),n);return{allAddresses:a,allAddressesHex:g(a),areAddressesLoaded:!0,hasAddresses:0!==a.length,isAddress:f(a)}}function x({children:e}){const{isApiReady:t,isEthereum:n}=(0,d.h)(),[l,c]=(0,s.useState)(m);return(0,s.useEffect)((()=>{let e=null;return t&&(e=(0,i.a)([o.Nn.accounts.subject.pipe((0,r.U)((e=>function(e,t={}){const n=p(e,Object.keys(t));return{allAccounts:n,allAccountsHex:g(n),areAccountsLoaded:!0,hasAccounts:0!==n.length,isAccount:f(n)}}(n,e)))),o.Nn.addresses.subject]).pipe((0,r.U)((([e,t])=>({accounts:e,addresses:b(n,t,e.allAccounts)})))).subscribe((e=>c(e)))),()=>{e&&e.unsubscribe()}}),[t,n]),(0,a.jsx)(h.Provider,{value:l,children:e})}},87561:(e,t,n)=>{n.d(t,{l:()=>v,q:()=>y});var a=n(52322),s=n(2784);const i="incomplete execution";function r(e){return e?e.isErr?`error: ${u(e.asErr)}`:null:i}function o({data:[e]}){return r(e)}const l={Executed:function({data:[,e]}){return r(e)}},c={Attempted:function({data:[e]}){return e?e.isIncomplete?`error: ${e.asIncomplete.error.type}`:null:i}},d={allianceMotion:l,council:l,membership:l,multisig:{MultisigExecuted:function({data:[,,,,e]}){return r(e)}},polkadotXcm:c,proxy:{ProxyExecuted:o},sudo:{Sudid:o,SudoAsDone:o},technicalCommittee:l,utility:{BatchInterrupted:function({data:[e,t]}){return`error: ${e.toString()}: ${u(t)}`},DispatchedAs:o},xcmPallet:c};function u(e){let t=e.type;if(e.isModule)try{const n=e.asModule,a=e.registry.findMetaError(n);t=`${a.section}.${a.name}`}catch{}else e.isToken&&(t=`${e.type}.${e.asToken.type}`);return t}var m=n(56245),h=n(73477),p=n(13529);let g=0;const f="extrinsic event",b=7500,x=p.Z.author.submitAndWatchExtrinsic,v=s.createContext({stqueue:[],txqueue:[]});const A=[],w=[];function y({children:e}){const[t,n]=(0,s.useState)(A),[i,r]=(0,s.useState)(w),o=(0,s.useRef)(t),l=(0,s.useRef)(i),c=(0,s.useCallback)((e=>{o.current=e,n(e)}),[]),p=(0,s.useCallback)((e=>{l.current=e,r(e)}),[]),y=(0,s.useCallback)((e=>{const t=++g;p([...l.current,{...e,id:t,removeItem:()=>p([...l.current.map((e=>e.id===t?{...e,status:"completed"}:e))]),rpc:e.rpc||x,status:"queued"}])}),[p]),k=(0,s.useCallback)((e=>{const t=Array.isArray(e)?e:[e];t.length&&c([...o.current,...t.map((e=>{const t=++g,n=()=>c([...o.current.filter((e=>e.id!==t))]);return setTimeout(n,b),{...e,id:t,isCompleted:!1,removeItem:n}}))])}),[c]),j=(0,s.useCallback)((e=>y({...e})),[y]),N=(0,s.useCallback)(((e,t,n)=>{y({accountId:t.address,extrinsic:e.createType("Extrinsic",{method:e.createType("Call",t.method)},{version:t.version}),payload:t,signerCb:n})}),[y]),C=(0,s.useCallback)((e=>y({...e})),[y]),E=(0,s.useCallback)(((e,t,n,a)=>{p([...l.current.map((s=>s.id===e?{...s,error:void 0===a?s.error:a,result:void 0===n?s.result:n,status:"completed"===s.status?s.status:t}:s))]),k(function(e){return function(e){let t=null;const n=e.reduce(((e,t)=>{const n=e.find((({status:e})=>e.action===t.action&&e.status===t.status));return n?n.count++:e.push({count:1,status:t}),e}),[]).map((({count:e,status:t})=>1===e?t:{...t,action:`${t.action} (x${e})`})).filter((e=>e.message!==f||(t?e.action.startsWith("system.ExtrinsicSuccess")?t.action.unshift(e.action):t.action.push(e.action):t={...e,action:[e.action]},!1)));return t?n.concat(t):n}((e?.events||[]).filter((e=>!!e.event&&"democracy"!==e.event.section)).map((e=>{const{event:{data:t,method:n,section:a}}=e;if("system"===a&&"ExtrinsicFailed"===n){const[e]=t;return{action:`${a}.${n}`,message:u(e),status:"error"}}const s=function({event:e}){const{method:t,section:n}=e;return!!d[n]&&!!d[n][t]&&d[n][t](e)}(e);if(s)return{action:`${a}.${n}`,message:s,status:"eventWarn"};if("contracts"===a)if("ContractExecution"===n&&2===t.length){const[e,n]=t;try{const t=(0,h.oX)(e.toString());if(t)return{action:t.decodeEvent(n).event.identifier,message:"contract event",status:"event"}}catch(e){console.error(e)}}else if("Evicted"===n)return{action:`${a}.${n}`,message:"contract evicted",status:"error"};return{action:`${a}.${n}`,message:f,status:"event"}})))}(n)),m.z.includes(t)&&setTimeout((()=>{const t=l.current.find((t=>t.id===e));t&&t.removeItem()}),b)}),[k,p]),S=(0,s.useMemo)((()=>({queueAction:k,queueExtrinsic:j,queuePayload:N,queueRpc:C,queueSetTxStatus:E,stqueue:t,txqueue:i})),[k,j,N,C,E,t,i]);return(0,a.jsx)(v.Provider,{value:S,children:e})}},59149:(e,t,n)=>{n.d(t,{m:()=>a});const a=n(2784).createContext({})},91012:(e,t,n)=>{n.d(t,{A:()=>o,d:()=>r});var a=n(52322),s=n(2784);function i(){return{height:window.innerHeight,width:window.innerWidth}}const r=s.createContext(i());function o({children:e}){const[t,n]=(0,s.useState)((()=>i()));return(0,s.useEffect)((()=>{function e(){n(i())}return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}}),[]),(0,a.jsx)(r.Provider,{value:t,children:e})}},58800:(e,t,n)=>{n.d(t,{F:()=>s});var a=n(2784);const s=(0,n(11677).e)("useAccountId",(function(e=null,t){const[n,s]=(0,a.useState)(e),i=(0,a.useCallback)(((e=null)=>{s(e),t&&t(e)}),[t]);return[n,i]}))},37198:(e,t,n)=>{n.d(t,{B:()=>f});var a=n(2784),s=n(69187),i=n(33661),r=n(74076),o=n(11677),l=n(90778),c=n(9118),d=n(29455);const u=(0,o.e)("useDeriveAccountFlags",(function(e){const t=(0,d.J)();return(0,c.W7)(t?.derive.accounts.flags,[e])}));var m=n(60773),h=n(37146),p=n(38894);const g={isCouncil:!1,isDevelopment:!1,isEditable:!1,isEthereum:!1,isExternal:!1,isFavorite:!1,isHardware:!1,isInContacts:!1,isInjected:!1,isMultisig:!1,isNominator:!1,isOwned:!1,isProxied:!1,isSociety:!1,isSudo:!1,isTechCommittee:!1,isValidator:!1},f=(0,o.e)("useAccountInfo",(function(e,t=!1){const{api:n,apiIdentity:o,apiSystemPeople:d}=(0,l.h)(),{accounts:{isAccount:f},addresses:{isAddress:b}}=(0,h.i)(),x=(0,m.Y)(e),v=u(e),A=(0,c.W7)(n.query.staking?.nominators,[e]),w=(0,c.W7)(n.query.staking?.validators,[e]),[y,k]=(0,a.useState)(void 0),[j,N]=(0,a.useState)([]),[C,E]=(0,a.useState)(""),[S,I]=(0,a.useState)(null),[B,D]=(0,a.useState)(),[L,P]=(0,a.useState)(g),[T,V]=(0,a.useState)(),[M,F,z]=(0,p.O)(),[Z,R,$]=(0,p.O)();(0,a.useEffect)((()=>{w&&P((e=>({...e,isValidator:!w.isEmpty})))}),[w]),(0,a.useEffect)((()=>{A&&P((e=>({...e,isNominator:!A.isEmpty})))}),[A]),(0,a.useEffect)((()=>{v&&P((e=>({...e,...v})))}),[v]),(0,a.useEffect)((()=>{const{accountIndex:e,identity:t,nickname:n}=x||{},a=e?.toString();let s;if(k((e=>e!==a?a:e)),(0,i.m)(o.query.identity?.identityOf)?t?.display&&(s=t.display):n&&(s=n),E(s||""),t){const e=t.judgements.filter((([,e])=>!e.isFeePaid)),n=e.some((([,e])=>e.isKnownGood));D({...t,isExistent:!!t.display,isKnownGood:n,judgements:e,waitCount:t.judgements.length-e.length})}else D(void 0)}),[x,n,d,o]),(0,a.useEffect)((()=>{if(e)try{const t=s.Nn.getAccount(e)||s.Nn.getAddress(e),n=f(e),a=b(e);I(t?.meta.genesisHash||null),P((s=>({...s,isDevelopment:t?.meta.isTesting||!1,isEditable:!(B?.display||!(a||t?.meta.isMultisig||t&&!t.meta.isInjected))||!1,isEthereum:(0,r.vq)(e,160),isExternal:!!t?.meta.isExternal||!1,isHardware:!!t?.meta.isHardware||!1,isInContacts:a,isInjected:!!t?.meta.isInjected||!1,isMultisig:!!t?.meta.isMultisig||!1,isOwned:n,isProxied:!!t?.meta.isProxied||!1}))),V(t?.meta),E(t?.meta.name||""),N(t?.meta.tags?.sort()||[])}catch{}}),[B,f,b,e]);const q=(0,a.useCallback)((()=>{M&&F();const a={name:C,whenEdited:Date.now()};if(t)try{if(e){const t=s.Nn.getAddress(e)?.meta;s.Nn.saveContract(e,{...t,...a})}}catch(e){console.error(e)}else if(e)try{const t=s.Nn.getPair(e);t&&s.Nn.saveAccountMeta(t,a)}catch{s.Nn.getAddress(e)?s.Nn.saveAddress(e,a):s.Nn.saveAddress(e,{genesisHash:n.genesisHash.toHex(),...a})}}),[n,t,M,C,F,e]),H=(0,a.useCallback)((()=>{const n={tags:j,whenEdited:Date.now()};if(t)try{if(e){const t=s.Nn.getAddress(e)?.meta;e&&s.Nn.saveContract(e,{...t,...n})}}catch(e){console.error(e)}else if(e)try{const t=s.Nn.getPair(e);t&&s.Nn.saveAccountMeta(t,n)}catch{s.Nn.saveAddress(e,n)}}),[t,j,e]),U=(0,a.useCallback)((()=>{M&&F(),Z&&R();try{e&&s.Nn.forgetAddress(e)}catch(e){console.error(e)}}),[M,Z,F,R,e]),W=(0,a.useCallback)((t=>{if(e){const n=s.Nn.getPair(e);n&&s.Nn.saveAccountMeta(n,{...n.meta,genesisHash:t}),I(t)}}),[e]),O=(0,a.useCallback)((e=>N(e.sort())),[]),Q=(0,a.useCallback)((()=>M||Z),[M,Z]);return(0,a.useMemo)((()=>({accountIndex:y,flags:L,genesisHash:S,identity:B,isEditing:Q,isEditingName:M,isEditingTags:Z,isNull:!e,meta:T,name:C,onForgetAddress:U,onSaveName:q,onSaveTags:H,onSetGenesisHash:W,setIsEditingName:z,setIsEditingTags:$,setName:E,setTags:O,tags:j,toggleIsEditingName:F,toggleIsEditingTags:R})),[y,L,S,B,Q,M,Z,T,C,U,q,H,W,z,$,E,O,j,F,R,e])}))},34814:(e,t,n)=>{n.d(t,{x:()=>i});var a=n(2784),s=n(3773);const i=(0,n(11677).e)("useAccounts",(function(){return(0,a.useContext)(s.H).accounts}))},81642:(e,t,n)=>{n.d(t,{J:()=>i});var a=n(2784),s=n(3773);const i=(0,n(11677).e)("useAddresses",(function(){return(0,a.useContext)(s.H).addresses}))},90778:(e,t,n)=>{n.d(t,{h:()=>i});var a=n(2784),s=n(87206);const i=(0,n(11677).e)("useApi",(function(){return(0,a.useContext)(s.E)}))},47297:(e,t,n)=>{n.d(t,{m:()=>i});var a=n(2784),s=n(68944);const i=(0,n(11677).e)("useApiStats",(function(){return(0,a.useContext)(s.y)}))},18837:(e,t,n)=>{n.d(t,{J:()=>m});var a=n(2784),s=n(64176),i=n(42582),r=n(76833),o=n(54371),l=n(26912),c=n(11677),d=n(74065);function u(e){return e?.disconnect().catch(console.error),null}const m=(0,c.e)("useApiUrl",(function(e){const t=(0,a.useRef)(null),n=(0,d.X)(),[c,m]=(0,a.useState)(null),h=(0,a.useMemo)((()=>e?(0,o.H)(e)?[e]:(0,l.r)(e.filter((e=>!e.startsWith("light://")))):[]),[e]);return(0,a.useEffect)((()=>()=>{t.current=u(t.current)}),[]),(0,a.useEffect)((()=>{m(null),t.current=u(t.current),h.length&&s.G.create({provider:t.current=new i.U(h),typesBundle:r.UD}).then((e=>n.current&&m(e))).catch(console.error)}),[n,t,h]),c}))},43223:(e,t,n)=>{n.d(t,{g:()=>u});var a=n(2784),s=n(95292),i=n(48801),r=n.n(i),o=n(11677),l=n(90778),c=n(9118),d=n(74065);const u=(0,o.e)("useAvailableSlashes",(function(){const{api:e}=(0,l.h)(),t=(0,c.W7)(e.derive.session?.indexes),n=(0,c.W7)(e.query.staking?.earliestUnappliedSlash),i=(0,d.X)(),[o,u]=(0,a.useState)([]);return(0,a.useEffect)((()=>{let a;const[o,l]=e.query.staking?.earliestUnappliedSlash?[n?.unwrapOr(null),s.nw]:[t?.activeEra,s.If.add(e.consts.staking?.slashDeferDuration||s.S8)];if(i.current&&t&&o){const n=[],c=t.activeEra.add(l);let d=new(r())(o);for(;d.lte(c);)n.push(d),d=d.add(s.If);n.length&&(async()=>{a=await e.query.staking.unappliedSlashes.multi(n,(e=>{i.current&&u(e.map(((e,t)=>[o.addn(t),e])).filter((([,e])=>e.length)))}))})().catch(console.error)}return()=>{a&&a()}}),[e,n,t,i]),o}))},83696:(e,t,n)=>{n.d(t,{r:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useBalancesAll",(function(e){const{api:t}=(0,s.h)();return(0,i.W7)(t.derive.balances?.all,[e])}))},62395:(e,t,n)=>{n.d(t,{P:()=>o});var a=n(11677),s=n(90778),i=n(9118);const r={transform:e=>e.hash.toHex()},o=(0,a.e)("useBestHash",(function(){const{api:e}=(0,s.h)();return(0,i.W7)(e.rpc.chain.subscribeNewHeads,void 0,r)}))},54383:(e,t,n)=>{n.d(t,{C:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useBestNumber",(function(){const{api:e}=(0,s.h)();return(0,i.W7)(e.derive.chain.bestNumber)}))},75387:(e,t,n)=>{n.d(t,{E:()=>i});var a=n(2784),s=n(57120);const i=(0,n(11677).e)("useBlockAuthors",(function(){return(0,a.useContext)(s.U)}))},67405:(e,t,n)=>{n.d(t,{d:()=>i});var a=n(2784),s=n(44028);const i=(0,n(11677).e)("useBlockEvents",(function(){return(0,a.useContext)(s.m)}))},56360:(e,t,n)=>{n.d(t,{n:()=>p});var a=n(2784),s=n(95292),i=n(48801),r=n.n(i),o=n(52107),l=n(11677),c=n(90778),d=n(49255),u=n(9118);const m=s.D_.div(s.um),h=new(r())(6e3),p=(0,l.e)("useBlockInterval",(function(e){const{api:t}=(0,c.h)(),n=e||t,i=(0,u.W7)(n.call.auraApi?.slotDuration&&n.call.auraApi.slotDuration,[]),r=(0,u.W7)(n.call.babeApi?.configuration&&n.call.babeApi.configuration,[],{transform:e=>e?.slotDuration});return(0,a.useMemo)((()=>(i||r)??function(e){return(0,o.N)(d.P,e.consts.babe?.expectedBlockTime||e.consts.difficulty?.targetBlockTime||e.consts.subspace?.expectedBlockTime||(e.consts.timestamp?.minimumPeriod.gte(m)?e.consts.timestamp.minimumPeriod.mul(s.um):e.query.parachainSystem?e.consts.aura?.slotDuration??h.mul(s.um):h))}(n)),[i,r,n])}))},97794:(e,t,n)=>{n.d(t,{A:()=>u,h:()=>m});var a=n(2784),s=n(52107),i=n(95292),r=n(22771),o=n(12372),l=n(11677),c=n(61349),d=n(56360);function u(e,t,n){const a=(0,s.N)(i.Ew,e.mul(t)).toNumber(),o=(0,r.E)(Math.abs(a)),{days:l,hours:c,minutes:d,seconds:u}=o;return[e.toNumber(),`${a<0?"+":""}${[l?l>1?n("{{days}} days",{replace:{days:l}}):n("1 day"):null,c?c>1?n("{{hours}} hrs",{replace:{hours:c}}):n("1 hr"):null,d?d>1?n("{{minutes}} mins",{replace:{minutes:d}}):n("1 min"):null,u?u>1?n("{{seconds}} s",{replace:{seconds:u}}):n("1 s"):null].filter((e=>!!e)).slice(0,2).join(" ")}`,o]}const m=(0,l.e)("useBlockTime",(function(e=i.If,t){const{t:n}=(0,c.$G)("react-hooks"),s=(0,d.n)(t);return(0,a.useMemo)((()=>u(s,(0,o.G)(e),n)),[s,e,n])}))},49255:(e,t,n)=>{n.d(t,{P:()=>c,u:()=>d});var a=n(2784),s=n(48801),i=n.n(s),r=n(12372),o=n(11677),l=n(56360);const c=new(i())(864e5),d=(0,o.e)("useBlocksPerDays",(function(e=1){const t=(0,l.n)();return(0,a.useMemo)((()=>c.mul((0,r.G)(e)).div(t)),[t,e])}))},10807:(e,t,n)=>{n.d(t,{f:()=>i});var a=n(2784),s=n(9118);const i=(0,n(11677).e)("useBrokerConfig",(function(e,t){const n=(0,s.W7)(t&&e?.query.broker.configuration),[i,r]=(0,a.useState)();return(0,a.useEffect)((()=>{n&&n.isSome&&n.toJSON()&&r(function(e){const t=e.unwrap();return{advanceNotice:t.advanceNotice?.toNumber(),contributionTimeout:t.contributionTimeout?.toNumber(),idealBulkProportion:t.idealBulkProportion,interludeLength:t.interludeLength?.toNumber(),leadinLength:t.leadinLength?.toNumber(),limitCoresOffered:t.limitCoresOffered?.isSome?t.limitCoresOffered?.unwrap().toNumber():0,regionLength:t.regionLength?.toNumber(),renewalBump:t.renewalBump}}(n))}),[n]),i}))},62353:(e,t,n)=>{n.d(t,{i:()=>i});var a=n(2784),s=n(9118);const i=(0,n(11677).e)("useBrokerLeases",(function(e,t){const n=(0,s.W7)(t&&e?.query?.broker?.leases),[i,r]=(0,a.useState)();return(0,a.useEffect)((()=>{n&&r(n.map(((e,t)=>({core:t,task:e.task.toString(),until:e.until.toNumber()}))))}),[n]),i}))},61314:(e,t,n)=>{n.d(t,{m:()=>o});var a=n(2784),s=n(9118),i=n(11677),r=n(33388);const o=(0,i.e)("useBrokerReservations",(function(e,t){const n=(0,s.W7)(t&&e?.query.broker.reservations),[i,o]=(0,a.useState)();return(0,a.useEffect)((()=>{n&&o(n.map((e=>({mask:(0,r.Pq)(e[0]?.mask),maskBits:(0,r.Pq)(e[0]?.mask)?.length??0,task:e[0]?.assignment?.isTask?e[0]?.assignment?.asTask.toString():e[0]?.assignment?.isPool?"Pool":""}))))}),[n]),i}))},69953:(e,t,n)=>{n.d(t,{i:()=>l});var a=n(2784),s=n(9118),i=n(11677),r=n(48801),o=n.n(r);const l=(0,i.e)("useBrokerSalesInfo",(function(e,t){const n=(0,s.W7)(t&&e?.query.broker.saleInfo),[i,r]=(0,a.useState)();return(0,a.useEffect)((()=>{n&&n.isSome&&n.toJSON()&&r(function(e){const t=e.unwrap();return{coresOffered:t.coresOffered?.toNumber(),coresSold:t.coresSold?.toNumber(),endPrice:t.endPrice,firstCore:t.firstCore?.toNumber(),idealCoresSold:t.idealCoresSold?.toNumber(),leadinLength:t.leadinLength?.toNumber(),regionBegin:t.regionBegin?.toNumber(),regionEnd:t.regionEnd?.toNumber(),saleStart:t.saleStart?.toNumber(),selloutPrice:t.selloutPrice?.isSome?t.selloutPrice?.unwrap():new(o())(0)}}(n))}),[n]),i}))},71756:(e,t,n)=>{n.d(t,{c:()=>i});var a=n(2784),s=n(9118);const i=(0,n(11677).e)("useBrokerStatus",(function(e,t){const n=(0,s.W7)(t&&e?.query.broker?.status),[i,r]=(0,a.useState)();return(0,a.useEffect)((()=>{if(n&&n.isSome){const e=n.unwrap();r({coreCount:e.coreCount?.toNumber(),lastCommittedTimeslice:e.lastCommittedTimeslice?.toNumber(),lastTimeslice:e.lastTimeslice?.toNumber(),privatePoolSize:e.privatePoolSize?.toNumber(),systemPoolSize:e.systemPoolSize?.toNumber()})}}),[n]),i}))},9118:(e,t,n)=>{n.d(t,{S3:()=>u,SB:()=>d,W7:()=>h,r1:()=>m});var a=n(2784),s=n(1346),i=n(17751),r=n(33661),o=n(17965),l=n(90778),c=n(74065);function d(e){return e}function u(e,t,n){console.error(t.current.error=new Error(`${t.current.type}(${function(e){return!!e&&!(0,s.o)(e.creator)}(n)?`${n.creator.section}.${n.creator.method}`:"..."}):: ${e.message}:: ${e.stack||"<unknown>"}`))}function m(e){e.current.isActive=!1,e.current.subscriber&&(e.current.subscriber.then((e=>(0,r.m)(e)&&e())).catch((t=>u(t,e))),e.current.subscriber=null)}function h(e,t,n){const{api:r}=(0,l.h)(),h=(0,c.X)(),p=(0,a.useRef)({error:null,fn:null,isActive:!1,serialized:null,subscriber:null,type:"useCall"}),[g,f]=(0,a.useState)(n?.defaultValue);return(0,a.useEffect)((()=>()=>m(p)),[]),(0,a.useEffect)((()=>{if(h.current&&e){const[a,l]=function(e,t,{paramMap:n=d}={}){return[JSON.stringify({f:e?.name,p:t}),0!==t.length&&t.some((e=>(0,i.F)(e)||(0,s.o)(e)))?null:n(t)]}(e,t||[],n);!l||e===p.current.fn&&a===p.current.serialized||(p.current.fn=e,p.current.serialized=a,function(e,t,n,a,i,r,{transform:l=d,withParams:c,withParamsTransform:h}={}){const p=i.filter((e=>!(0,s.o)(e)));m(n),(0,o.Y)((()=>{t.current&&(!a||function(e){return!!e.meta?.type?.isMap}(a)&&a.meta.type.asMap.hashers.length!==p.length?n.current.subscriber=null:(n.current.isActive=!0,n.current.subscriber=a(...i,(s=>{if(t.current&&n.current.isActive)try{r(c?[i,l(s,e)]:l(h?[i,s]:s,e))}catch(e){u(e,n,a)}})).catch((e=>u(e,n,a)))))}))}(r,h,p,e,l,f,n))}}),[r,e,n,h,t]),g}},54890:(e,t,n)=>{n.d(t,{L:()=>c});var a=n(2784),s=n(17965),i=n(1346),r=n(90778),o=n(9118),l=n(74065);function c(e,t){const{api:n}=(0,r.h)(),c=(0,l.X)(),d=(0,a.useRef)({error:null,fn:null,isActive:!1,serialized:null,subscriber:null,type:"useCallMulti"}),[u,m]=(0,a.useState)((()=>(0,i.o)(t?.defaultValue)?[]:t?.defaultValue));return(0,a.useEffect)((()=>()=>(0,o.r1)(d)),[]),(0,a.useEffect)((()=>{if(c.current&&e){const a=JSON.stringify(e);a!==d.current.serialized&&(d.current.serialized=a,function(e,t,n,a,i,{transform:r=o.SB}={}){(0,o.r1)(n),(0,s.Y)((()=>{if(t.current){const s=a.map((e=>!(!e||Array.isArray(e)&&!e[0]))),l=a.filter(((e,t)=>s[t]));l.length?(n.current.isActive=!0,n.current.subscriber=e.queryMulti(l,(l=>{if(t.current&&n.current.isActive){let t=-1;try{i(r(a.map(((e,n)=>s[n]?l[++t]:void 0)),e))}catch(e){(0,o.S3)(e,n)}}})).catch((e=>(0,o.S3)(e,n)))):n.current.subscriber=null}}))}(n,c,d,e,m,t))}}),[n,e,t,c]),u}},81190:(e,t,n)=>{n.d(t,{m:()=>r});var a=n(2784),s=n(90778),i=n(33661);const r=(0,n(11677).e)("useCollectiveInstance",(function(e,t){const{api:n}=(0,s.h)();return(0,a.useMemo)((()=>{const a=t||0,s=n.registry.getModuleInstances(n.runtimeVersion.specName.toString(),e),r=s&&a<s.length?s[a]:e;return n.tx[r]&&(0,i.m)(n.tx[r].close)?r:null}),[n,t,e])}))},70563:(e,t,n)=>{n.d(t,{V:()=>d});var a=n(2784),s=n(11677),i=n(34814),r=n(90778),o=n(9118);const l={transform:e=>e.map((e=>e.toString()))},c={transform:e=>e?.toString()||null},d=(0,s.e)("useCollectiveMembers",(function(e){const{api:t}=(0,r.h)(),{allAccounts:n}=(0,i.x)(),s=(0,o.W7)(t.derive[e]?.members,[],l),d=(0,o.W7)(t.derive[e]?.prime,[],c);return(0,a.useMemo)((()=>({isMember:(s||[]).some((e=>n.includes(e))),members:s||[],prime:d})),[n,s,d])}))},69031:(e,t,n)=>{n.d(t,{e:()=>c});var a=n(2784),s=n(90778),i=n(97794),r=n(95292),o=n(48801),l=n.n(o);const c=(0,n(11677).e)("useCoretimeConsts",(function(){const{api:e,apiCoretime:t,isApiReady:n}=(0,s.h)(),[o,c]=(0,a.useState)(),[d]=(0,i.h)(r.If,e),u=t?.consts.aura?.slotDuration,m=t?.consts.broker?.timeslicePeriod;return(0,a.useEffect)((()=>{if(!(n&&d&&u&&m))return;const e=new(l())(u.toString()),t=new(l())(m),a=e.div(new(l())(d)),s=a.gtn(0)?t.div(a):r.nw;c({coretime:{blocksPerTimeslice:s.toNumber(),blocktimeMs:e.toNumber()},relay:{blocksPerTimeslice:t.toNumber(),blocktimeMs:d}})}),[n,d,u,m]),o}))},71566:(e,t,n)=>{n.d(t,{F:()=>C});var a=n(2784),s=n(90778),i=n(71756),r=n(62353),o=n(61314),l=n(69953),c=n(59653),d=n(22955),u=n(10807),m=n(26309),h=n(12298),p=n(9118),g=n(11677),f=n(48801),b=n.n(f);const x={transform:e=>e.map((({args:[e]})=>e))},v=(0,g.e)("useCoreDescriptor",(function(e,t){const n=(0,h.k)(t&&e.query.coretimeAssignmentProvider.coreDescriptors,[],x),s=n?.map(((e,t)=>t));s?.pop();const i=(0,p.W7)(t&&e.query.coretimeAssignmentProvider.coreDescriptors.multi,[s],{withParams:!0}),[r,o]=(0,a.useState)();return(0,a.useEffect)((()=>{i&&o(i[0][0].map(((e,t)=>function(e,t){const n=e?.currentWork.isSome?e.currentWork.unwrap():null,a=e?.queue.isSome?e.queue.unwrap():null,s=n?.assignments||[];return{core:t,info:{currentWork:{assignments:s?.map((e=>({isPool:e[0]?.isPool,isTask:e[0]?.isTask,ratio:e[1]?.ratio.toNumber(),remaining:e[1]?.remaining.toNumber(),task:e[0]?.isTask?e[0]?.asTask.toString():e[0]?.isPool?"Pool":"Idle"}))),endHint:n?.endHint.isSome?n?.endHint?.unwrap().toBn():null,pos:n?.pos.toNumber()||0,step:n?.step.toNumber()||0},queue:{first:a?.first.toBn()||new(b())(0),last:a?.last.toBn()||new(b())(0)}}}}(i[1][t],e))))}),[i]),r}));var A=n(95292),w=n(28097),y=n(33388);const k={transform:e=>e.map((({args:[e]})=>e))},j=(0,g.e)("useBrokerPotentialRenewals",(function(e,t){const n=(0,h.k)(t&&e?.query.broker.potentialRenewals,[],k),s=(0,p.W7)(t&&e?.query.broker.potentialRenewals.multi,[n],{withParams:!0}),[i,r]=(0,a.useState)();return(0,a.useEffect)((()=>{if(!s)return;const e=s[0][0].map(((e,t)=>function(e,t){const n=e.isSome?e.unwrap():null;let a=[],s="";if(!n)return;const i=n?.completion;if(i?.isComplete){const e=i?.asComplete[0];s=e.assignment.isTask?e?.assignment.asTask.toString():e?.assignment.isPool?"Pool":"Idle",a=(0,y.Pq)(e.mask)}else i?.isPartial?(a=(0,y.Pq)(i?.asPartial),s=""):a=[];return{completion:i?.type,core:t?.core.toNumber(),mask:a,maskBits:a?.length,price:n?.price.toBn()||A.nw,task:s,when:t?.when.toNumber()}}(s[1][t],e)));r(e.filter((e=>!!e)))}),[s]),i}));var N=n(69031);const C=(0,g.e)("useCoretimeInformation",(function(e,t){const{apiCoretime:n,isApiReady:h}=(0,s.h)(),[p,g]=(0,a.useState)([]),[f,x]=(0,a.useState)([]),[y,k]=(0,a.useState)(),C=(0,i.c)(n,h),E=(0,r.i)(n,h),S=(0,o.m)(n,h),I=(0,l.i)(n,h),B=(0,c.E)(n,h),D=(0,d.b)(n,h),L=(0,u.f)(n,h),P=j(n,h),T=(0,m.e)(n),V=(0,N.e)();(0,a.useEffect)((()=>{V?.coretime.blocksPerTimeslice&&k(new(b())(V.coretime.blocksPerTimeslice))}),[V]);const M=v(e,t),F=(0,a.useMemo)((()=>M&&[...new Set(M?.map((e=>e.info.currentWork.assignments.map((e=>e.task)))).flat().filter((e=>"Pool"!==e)))]),[M]),z=(0,a.useMemo)((()=>{if(!(I&&L&&C&&y))return!1;const e=new(b())(I?.regionBegin).sub(new(b())(L.regionLength)),t=y.gt(A.nw)?new(b())(L?.interludeLength).div(y):A.nw;return e.add(t).gte(new(b())(C?.lastCommittedTimeslice))}),[C,I,L,y]),Z=(0,a.useMemo)((()=>z&&L&&I?P?.filter((e=>e.when.toString()===I?.regionBegin.toString())):[]),[P,I,L,z]),[R,$]=(0,a.useState)();return(0,a.useEffect)((()=>{if(F?.length&&!f.length){const e=F.map((e=>Number(e))),t=P?.map((e=>Number(e.task)));if(t){const n=[...new Set(e.concat(t))];if(n?.length>e.length)return void x(n.sort(((e,t)=>e-t)))}x(e)}}),[P,F,f]),(0,a.useEffect)((()=>{if(B?.length&&g(B),M?.length&&!B?.length){const e=M?.map((e=>({core:-1,info:e.info.currentWork.assignments.map((e=>({isPool:e.isPool,isTask:e.isTask,mask:[],maskBits:0,task:e.task})))})));g(e)}}),[B,M]),(0,a.useEffect)((()=>{if(!p?.length||!S?.length)return;const e={};f?.forEach((t=>{const n=t.toString(),a=E?.length?E?.find((e=>e.task===n)):void 0,s=S?.find((e=>e.task===n)),i=p?.filter((e=>e.info.task===n)),r=i.map((e=>{const t=D?.filter((e=>e.info.task.toString()===n)),i=((e,t,n)=>n?w.I["On Demand"]:t?w.I.Reservation:e?w.I.Lease:w.I["Bulk Coretime"])(a,s,e?.info.isPool??!1),r=Z?.find((e=>e.task.toString()===n));let o=r?w.VU.Eligible:w.VU.None;const l=i===w.I["Bulk Coretime"]&&!!t?.length;return l&&(o=`Next cycle on core ${t[0].core}`),{chainRenewedCore:l,renewal:r,renewalStatus:o,type:i,workload:e,workplan:t}}));e[t.toString()]={id:t,lease:a,reservation:s,workTaskInfo:r}})),e&&L&&T&&I&&C&&V&&$({chainInfo:e,config:L,constants:V,region:T,salesInfo:I,status:C,taskIds:f})}),[L,V,f,p,Z,I,E,S,T,C,D]),R}))},27421:(e,t,n)=>{n.d(t,{N:()=>r});var a=n(2784),s=n(74065);const i=250;function r(e,t=i){const n=(0,s.X)(),[r,o]=(0,a.useState)(e);return(0,a.useEffect)((()=>{const a=setTimeout((()=>{n.current&&o(e)}),t);return()=>{clearTimeout(a)}}),[t,e,n]),r}},32980:(e,t,n)=>{n.d(t,{W:()=>r});var a=n(90778),s=n(34814),i=n(9118);const r=(0,n(11677).e)("useDelegations",(function(){const{api:e}=(0,a.h)(),{allAccounts:t}=(0,s.x)();return(0,i.W7)(e.query.democracy?.votingOf?.multi,[t])}))},60773:(e,t,n)=>{n.d(t,{Y:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useDeriveAccountInfo",(function(e){const{apiIdentity:t}=(0,s.h)();return(0,i.W7)(t?.derive.accounts.info,[e])}))},39824:(e,t,n)=>{n.d(t,{N:()=>c});var a=n(2784),s=n(33661),i=n(90778),r=n(24305),o=n(80501);function l(e=[],{added:t=[],removed:n=[]}){if(!t.length&&!n.length)return e;const a={};[e,t].forEach((e=>e.forEach((e=>{a[e.toHex()]=e})))),n.forEach((e=>{delete a[e.toHex()]}));const i=Object.entries(a).sort(((e,t)=>(0,s.m)(e[1].cmp)?e[1].cmp(t[1]):e[0].localeCompare(t[0]))).map((([,e])=>e));return i.length!==e.length||i.find(((t,n)=>!t.eq(e[n])))?i:e}function c(e,t,n,s){const{api:c}=(0,i.h)(),[d,u]=(0,a.useState)(),m=(0,o.Wg)(e),{blockHash:h,events:p}=(0,r.b)(m);return(0,a.useEffect)((()=>{n&&u((e=>l(e,{added:n})))}),[n]),(0,a.useEffect)((()=>{h&&u((e=>l(e,t(p,c,s))))}),[s,c,h,p,t]),d}},24305:(e,t,n)=>{n.d(t,{b:()=>u});var a=n(2784),s=n(11677),i=n(90778),r=n(9118),o=n(74065),l=n(80501);const c={blockHash:"",events:[]},d=()=>!0,u=(0,s.e)("useEventTrigger",(function(e,t=d){const{api:n}=(0,i.h)(),[s,u]=(0,a.useState)((()=>c)),m=(0,l.Wg)(e),h=(0,o.X)(),p=(0,r.W7)(n.query.system.events);return(0,a.useEffect)((()=>{if(h.current&&p){const e=p.filter((e=>e.event&&m.some((t=>t&&t.is(e.event)))&&t(e)));e.length&&u({blockHash:p.createdAtHash?.toHex()||"",events:e})}}),[p,t,m,h]),s}))},54131:(e,t,n)=>{n.d(t,{r:()=>l});var a=n(2784),s=n(11677),i=n(23729),r=n.n(i),o=n(90778);const l=(0,s.e)("useFavorites",(function(e){const[t,n]=function(e){const{api:t,isDevelopment:n}=(0,o.h)(),s=(0,a.useMemo)((()=>`${e}:${n?"development":t.genesisHash.toHex()}`),[t,n,e]);return[(0,a.useCallback)((()=>r().get(s)),[s]),(0,a.useCallback)((e=>r().set(s,e)),[s])]}(e),[s,i]=(0,a.useState)((()=>t()||[])),l=(0,a.useCallback)((e=>i((t=>n(t.includes(e)?t.filter((t=>e!==t)):[...t,e])))),[n]);return(0,a.useMemo)((()=>[s,l]),[s,l])}))},93803:(e,t,n)=>{n.d(t,{Y:()=>r});var a=n(2784),s=n(1346);const i=()=>!0;function r(e,t=i){const[n,r]=(0,a.useState)(e),o=(0,a.useMemo)((()=>!!n&&t(n)),[t,n]),l=(0,a.useCallback)((e=>!(0,s.o)(e)&&r(e)),[]);return[n,o,l]}},60864:(e,t,n)=>{n.d(t,{y:()=>r});var a=n(2784),s=n(11677),i=n(74065);const r=(0,s.e)("useIncrement",(function(e=1){const t=(0,i.X)(),[n,s]=(0,a.useState)(e),r=(0,a.useCallback)((()=>{t.current&&s((e=>++e))}),[t]);return[n,r,s]}))},57493:(e,t,n)=>{n.d(t,{V:()=>d});var a=n(2784),s=n(6119),i=n(95292),r=n(11677),o=n(90778),l=n(9118);const c={idealInterest:0,idealStake:0,inflation:0,stakedFraction:0,stakedReturn:0},d=(0,r.e)("useInflation",(function(e){const{api:t}=(0,o.h)(),n=(0,l.W7)(t.query.balances?.totalIssuance),r=(0,l.W7)(t.query.auctions?.auctionCounter),[d,u]=(0,a.useState)(c);return(0,a.useEffect)((()=>{const a=t.query.auctions?r:i.nw;a&&n&&e&&u(function(e,t,n,a){const{auctionAdjust:r,auctionMax:o,falloff:l,maxInflation:c,minInflation:d,stakeTarget:u}=(0,s.S)(e),m=t.isZero()||n.isZero()?0:t.mul(i.uy).div(n).toNumber()/i.uy.toNumber(),h=u-Math.min(o,a.toNumber())*r,p=c/h,g=100*(d+(m<=h?m*(p-d/h):(p*h-d)*Math.pow(2,(h-m)/l)));return{idealInterest:p,idealStake:h,inflation:g,stakedFraction:m,stakedReturn:m?g/m:0}}(t,e,n,a))}),[t,r,n,e]),d}))},83337:(e,t,n)=>{n.d(t,{K:()=>c,g:()=>d});var a=n(2784),s=n(11677);const i=["ipfs","ipns"],r=i.map((e=>`/${e}/`)),o=".ipfs.localhost",l=".ipns.localhost";function c(){const[e]=window.location.href.split("#");return e.includes(o)?function(e){const[,,t]=e.split("/"),n=t.split(":")[0];return{ipfsHash:n.replace(o,""),ipfsPath:n,ipnsChain:null,ipnsDomain:null,isIpfs:!0,isIpns:!1}}(e):e.includes(l)?function(e){const[,,t]=e.split("/"),n=t.split(":")[0],a=n.replace(l,""),s=a.split(".");let i=null,r=null;return s.length>2?(i=s[0],r=s.slice(1).join(".")):r=a,{ipfsHash:null,ipfsPath:n,ipnsChain:i,ipnsDomain:r,isIpfs:!0,isIpns:!0}}(e):function(e){const t=r.some((t=>e.includes(t))),n=e.includes(r[1]),a=e.split("/"),s=a.indexOf(n?i[1]:i[0]);let o=null,l=null,c=null,d=null;if(-1!==s)if(l=a.slice(0,s+1).join("/"),n){const e=a[s+1],t=e.split(".");t.length>2?(c=t[0],d=t.slice(1).join(".")):d=e}else o=a[s+1];return{ipfsHash:o,ipfsPath:l,ipnsChain:c,ipnsDomain:d,isIpfs:t,isIpns:n}}(e)}const d=(0,s.e)("useIpfs",(function(){const[e]=(0,a.useState)((()=>c()));return e}))},62837:(e,t,n)=>{n.d(t,{Y:()=>s});var a=n(2784);const s=(0,n(11677).e)("useIpfsLink",(function(e){return(0,a.useMemo)((()=>e?{ipfsHash:e,ipfsShort:`${e.substring(0,4)}…${e.slice(-4)}`,ipfsUrl:`https://ipfs.io/ipfs/${e}`}:null),[e])}))},74065:(e,t,n)=>{n.d(t,{X:()=>s});var a=n(2784);const s=(0,n(11677).e)("useIsMountedRef",(function(){const e=(0,a.useRef)(!1);return(0,a.useEffect)((()=>(e.current=!0,()=>{e.current=!1})),[]),e}))},37146:(e,t,n)=>{n.d(t,{i:()=>i});var a=n(2784),s=n(3773);const i=(0,n(11677).e)("useKeyring",(function(){return(0,a.useContext)(s.H)}))},45479:(e,t,n)=>{n.d(t,{c:()=>A});var a=n(2784),s=n(17346),i=n(97772),r=n(70392),o=n(7404),l=n(16039),c=n(48731),d=n(11677),u=n(90778);const m={hasLedgerChain:!1,hasWebUsb:!1,isLedgerCapable:!1,isLedgerEnabled:!1},h=!!window.USB,p=Object.keys(r.A).filter((e=>o.Y[e])),g=p.reduce(((e,t)=>[...e,...r.A[t]]),[]);let f,b=null,x=null;function v(e){const t=g.includes(e.genesisHash.toHex()),n=h&&t;return{hasLedgerChain:t,hasWebUsb:h,isLedgerCapable:n,isLedgerEnabled:n&&"none"!==l.X.ledgerConn}}const A=(0,d.e)("useLedger",(function(){const{api:e,isApiReady:t}=(0,u.h)(),n=(0,a.useCallback)((()=>function(e){const t=l.X.get().ledgerConn,n=l.X.get().ledgerApp;if(!b||x!==t||n!==f){const a=e.genesisHash.toHex(),l=p.find((e=>r.A[e].includes(a)));(0,c.hu)(l,`Unable to find a known Ledger config for genesisHash ${a}`),b="generic"===n?new s.T(t,l,o.Y.polkadot):"migration"===n?new s.T(t,l,o.Y[l]):"chainSpecific"===n?new i.P(t,l):new s.T(t,l,o.Y.polkadot),x=t,f=n}return b}(e)),[e]);return(0,a.useMemo)((()=>({...t?v(e):m,getLedger:n})),[e,n,t])}))},51240:(e,t,n)=>{n.d(t,{t:()=>i});var a=n(2784),s=n(11147);function i(e,t,{transform:n}={},i){const[r,o]=(0,a.useState)(),l=(0,a.useRef)(null);return(0,a.useEffect)((()=>{if(e&&t){const a=(0,s.P)({at:i,params:t});a!==l.current&&(l.current=a,(i&&"0"!==i?e.entriesAt(i,...t):e.entries(...t)).then((e=>o(n?n(e):e))).catch(console.error))}}),[i,e,t,n]),r}},12298:(e,t,n)=>{n.d(t,{k:()=>i});var a=n(2784),s=n(11147);function i(e,t,{transform:n}={},i){const[r,o]=(0,a.useState)(),l=(0,a.useRef)(null);return(0,a.useEffect)((()=>{if(e&&t){const a=(0,s.P)({at:i,params:t});a!==l.current&&(l.current=a,(i&&"0"!==i?e.keysAt(i,...t):e.keys(...t)).then((e=>o(n?n(e):e))).catch(console.error))}}),[i,e,t,n]),r}},80501:(e,t,n)=>{n.d(t,{Wg:()=>o});var a=n(2784),s=n(11147);function i(e,t,n=-1){return n++,e!==t&&(!(n<2&&Array.isArray(e)&&Array.isArray(t)&&e.length===t.length)||e.some(((e,a)=>i(e,t[a],n))))}function r(e,t){if(!e.current||i(e.current.value,t)){const n=(0,s.P)({value:t});e.current&&e.current.stringified===n||(e.current={stringified:n,value:t})}return e.current.value}function o(e){const t=(0,a.useRef)(null);return(0,a.useMemo)((()=>r(t,e)),[t,e])}},6688:(e,t,n)=>{n.d(t,{O:()=>i,V:()=>o});var a=n(2784),s=n(74065);function i(e){if(!e)return"";if(e.toLowerCase().startsWith("http"))return e;const t=e.match(/Qm[A-Za-z0-9]{44}(?![A-Za-z0-9])/);if(null!==t)return t[0];const n=e.match(/[a-z0-9]{59}(?![A-Za-z0-9])/);return null!==n?n[0]:""}const r=new Map;function o(e,t){const n=(0,s.X)(),[o,l]=(0,a.useState)(),c=(0,a.useMemo)((()=>{if(e)return e.map((e=>i(e))).filter((e=>!!e))}),[e]);return(0,a.useEffect)((()=>{n.current&&c&&async function(e){const t=new Map,n=e.map((e=>{if(r.has(e))return t.set(e,r.get(e)),Promise.resolve();const n=e.startsWith("http")?e:`https://ipfs.io/ipfs/${e}`;return fetch(n).then((async n=>{const a=n.status>=200&&n.status<300?await n.text():null;r.set(e,a),t.set(e,a)}))}));return await Promise.allSettled(n),t}(c).then((e=>l(function(e,{transform:t}={}){if(!t)return e;for(const[n,a]of e.entries())e.set(n,t(a));return e}(e,t)))).catch((()=>{}))}),[c,t,n]),o}},65121:(e,t,n)=>{n.d(t,{d:()=>r});var a=n(2784),s=n(11677),i=n(38894);const r=(0,s.e)("useModal",(function(e,t,n){const[s,,r]=(0,i.O)(e||!1),o=(0,a.useCallback)((()=>{r(!0),t&&t()}),[t,r]);return{isOpen:s,onClose:(0,a.useCallback)((()=>{r(!1),n&&n()}),[n,r]),onOpen:o}}))},47623:(e,t,n)=>{n.d(t,{q:()=>i});var a=n(2784),s=n(17965);const i=(0,n(11677).e)("useNextTick",(function(){const[e,t]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{(0,s.Y)((()=>t(!0)))}),[]),e}))},6589:(e,t,n)=>{n.d(t,{n:()=>r});var a=n(11677),s=n(93803);function i(e){return e&&e.length>0||!1}const r=(0,a.e)("useNonEmptyString",(function(e=""){return(0,s.Y)(e,i)}))},59118:(e,t,n)=>{n.d(t,{Q:()=>h});var a=n(2784),s=n(95292),i=n(11677),r=n(90778),o=n(9118),l=n(74065),c=n(50417);const d={filteredEras:[],validatorEras:[]},u={isLoadingRewards:!0,rewardCount:0},m={withParams:!0},h=(0,i.e)("useOwnEraRewards",(function(e,t,n){const{api:i}=(0,r.h)(),h=(0,l.X)(),p=(0,c.q)(n),g=(0,o.W7)(i.derive.staking?.erasHistoric),[{filteredEras:f,validatorEras:b},x]=(0,a.useState)(d),[v,A]=(0,a.useState)(u),w=(0,o.W7)(!t?.length&&!!f.length&&p&&i.derive.staking?.stakerRewardsMultiEras,[p,f],m),y=(0,o.W7)(!!b.length&&!!f.length&&i.derive.staking._erasPoints,[f,!1]),k=(0,o.W7)(!!b.length&&!!f.length&&i.derive.staking._erasRewards,[f,!1]);return(0,a.useEffect)((()=>{A({allRewards:null,isLoadingRewards:!0,rewardCount:0})}),[e,t]),(0,a.useEffect)((()=>{if(g&&e){const n=g.slice(-1*e),a=[];0===g.length?(A({allRewards:{},isLoadingRewards:!1,rewardCount:0}),x({filteredEras:n,validatorEras:a})):t?.length&&(t.forEach((({claimedRewardsEras:e,stakingLedger:t,stashId:s})=>{if(t){const i=n.filter((n=>!function(e,t){return(e.legacyClaimedRewards||e.claimedRewards||[]).concat(t?.toArray()||[])}(t,e).some((e=>n.eq(e)))));i.length&&a.push({eras:i,stashId:s})}})),n.length&&!a.length&&A({allRewards:{},isLoadingRewards:!1,rewardCount:0})),x({filteredEras:n,validatorEras:a})}}),[g,e,t]),(0,a.useEffect)((()=>{h.current&&w&&!t&&A(function([[e],t]){const n={};return e.forEach(((e,a)=>{n[e]=t[a].filter((({eraReward:e})=>!e.isZero()))})),{allRewards:n,isLoadingRewards:!1,rewardCount:Object.values(n).filter((e=>0!==e.length)).length}}(w))}),[h,t,w]),(0,a.useEffect)((()=>{h&&y&&k&&t&&A(function(e,t,n,a){const i={};return t.forEach((({eras:t,stashId:r})=>{t.forEach((t=>{const o=n.find((e=>e.era.eq(t))),l=a.find((e=>e.era.eq(t)));if(o?.eraPoints.gt(s.nw)&&o?.validators[r]&&l){const n=o.validators[r].mul(l.eraReward).div(o.eraPoints);if(!n.isZero()){const a=e.createType("Balance",n);i[r]||(i[r]=[]),i[r].push({era:t,eraReward:l.eraReward,isClaimed:!1,isEmpty:!1,isValidator:!0,nominating:[],validators:{[r]:{total:a,value:a}}})}}}))})),{allRewards:i,isLoadingRewards:!1,rewardCount:Object.values(i).filter((e=>0!==e.length)).length}}(i,b,y,k))}),[i,y,k,h,t,b]),v}))},12213:(e,t,n)=>{n.d(t,{w:()=>h});var a=n(2784),s=n(51330),i=n(55858),r=n(11677),o=n(34814),l=n(90778),c=n(74065),d=n(50417);function u(e){return e?e.toString():null}const m={withClaimedRewardsEras:!0,withDestination:!0,withLedger:!0,withNominations:!0,withPrefs:!0},h=(0,r.e)("useOwnStashInfos",(function(){const{api:e}=(0,l.h)(),{allAccounts:t}=(0,o.x)(),n=(0,c.X)(),r=(0,d.y)(),[h,p]=(0,a.useState)();return(0,a.useEffect)((()=>{let t;if(r)if(r.length){const a=r.map((([e])=>e)),s=[[e.derive.staking.accounts,a,m],[e.query.staking.validators.multi,a]];e.combineLatest(s,(([e,t])=>{n.current&&r.length===e.length&&r.length===t.length&&p(r.reduce(((n,[a,s],i)=>({...n,[a]:[s,e[i],t[i]]})),{}))})).then((e=>{t=e})).catch(console.error)}else n.current&&p({});return()=>{t&&t()}}),[e,n,r]),(0,a.useMemo)((()=>r&&h&&r.length===Object.keys(h).length?r.filter((([e])=>h[e])).map((([e])=>function(e,t,[n,{claimedRewardsEras:a,controllerId:r,exposureMeta:o,exposurePaged:l,nextSessionIds:c,nominators:d,rewardDestination:m,sessionIds:h,stakingLedger:p,validatorPrefs:g},f]){const b=!!d?.length,x=!(Array.isArray(f)?f[1].isEmpty:f.isEmpty),v=c instanceof Map?[...c.values()]:c,A=(0,s.e)(...v.map((e=>e.toU8a()))),w=h instanceof Map?[...h.values()]:h,y=(0,s.e)(...w.map((e=>e.toU8a()))),k=u(r);return{claimedRewardsEras:a,controllerId:k,destination:m,exposureMeta:o,exposurePaged:l,hexSessionIdNext:(0,i.c)(A,48),hexSessionIdQueue:(0,i.c)(y.length?y:A,48),isLoading:!1,isOwnController:t.includes(k||""),isOwnStash:n,isStashNominating:b,isStashValidating:x,nominating:d?.map(u),sessionIds:(v.length?v:w).map(u),stakingLedger:p,stashId:e,validatorPrefs:g}}(e,t,h[e]))):void 0),[t,r,h])}))},50417:(e,t,n)=>{n.d(t,{q:()=>c,y:()=>l});var a=n(2784),s=n(11677),i=n(34814),r=n(90778),o=n(9118);const l=(0,s.e)("useOwnStashes",(function(e){const{allAccounts:t}=(0,i.x)(),{api:n}=(0,r.h)(),s=(0,a.useMemo)((()=>t.concat(e||[])),[t,e]),l=(0,o.W7)(0!==s.length&&n.query.staking?.bonded.multi,[s]),c=(0,o.W7)(0!==s.length&&n.query.staking?.ledger.multi,[s]);return(0,a.useMemo)((()=>s.length?l&&c?function(e,t,n){const a=[];return t.forEach(((t,n)=>{t.isSome&&a.push([e[n],!0])})),n.forEach((e=>{if(e.isSome){const t=e.unwrap().stash.toString();!a.some((([e])=>e===t))&&a.push([t,!1])}})),a}(s,l,c):void 0:[]),[s,l,c])})),c=(0,s.e)("useOwnStashIds",(function(e){const t=l(e);return(0,a.useMemo)((()=>t?t.map((([e])=>e)):void 0),[t])}))},36198:(e,t,n)=>{n.d(t,{x:()=>c});var a=n(2784),s=n(26912),i=n(11677),r=n(18837),o=n(74065),l=n(84450);const c=(0,i.e)("useParaApi",(function(e){const t=(0,o.X)(),n=(0,l.jC)(e),[i,c]=(0,a.useState)((()=>({api:null,endpoints:n,urls:[]}))),d=(0,r.J)(i.urls);return(0,a.useEffect)((()=>{t.current&&c({api:null,endpoints:n,urls:(0,s.r)(n.filter((({isDisabled:e,isUnreachable:t})=>!e&&!t)).map((({value:e})=>e)))})}),[n,t]),(0,a.useEffect)((()=>{t.current&&c((({endpoints:e,urls:t})=>({api:d,endpoints:e,urls:t})))}),[d,t]),i}))},84450:(e,t,n)=>{n.d(t,{gW:()=>m,jC:()=>u});var a=n(2784),s=n(33318),i=n(12372),r=n(11677),o=n(90778);const l=(0,s.Rf)(((e,t)=>t?.toString()||e));function c(e,t){const n=(0,i.G)(t).toNumber();return e.filter((({paraId:e})=>e===n))}const d=(0,r.e)("useRelayEndpoints",(function(){const{api:e}=(0,o.h)();return(0,a.useMemo)((()=>{return t=e.genesisHash.toHex(),l.filter((({genesisHashRelay:e})=>t===e));var t}),[e])})),u=(0,r.e)("useParaEndpoints",(function(e){const t=d();return(0,a.useMemo)((()=>c(t,e)),[t,e])})),m=(0,r.e)("useIsParasLinked",(function(e){const t=d();return(0,a.useMemo)((()=>e?e.reduce(((e,n)=>({...e,[n.toString()]:0!==c(t,n).length})),{}):{}),[t,e])}))},31313:(e,t,n)=>{n.d(t,{CH:()=>A,uD:()=>b});var a=n(2784),s=n(90778),i=n(9118),r=n(11677),o=n(37602),l=n(54371),c=n(48358),d=n(55858),u=n(48801),m=n.n(u),h=n(33403),p=n(14681),g=n(95292);function f(e){if(e.query.preimage&&e.query.preimage.preimageFor&&e.query.preimage.preimageFor.creator.meta.type.isMap){const{type:t}=e.registry.lookup.getTypeDef(e.query.preimage.preimageFor.creator.meta.type.asMap.key);if("H256"===t)return"hash";if("(H256,u32)"===t)return"hashAndLen"}return"unknown"}function b(e,t){let n,a;if((0,l.H)(t))n=t;else if((0,c.U)(t))n=t.toHex();else{const s=t;s.isInline?(a=s.asInline.toU8a(!0),n=(0,d.c)(e.registry.hash(a))):t.isLegacy?n=t.asLegacy.hash_.toHex():t.isLookup?n=t.asLookup.hash_.toHex():console.error(`Unhandled FrameSupportPreimagesBounded type ${t.type}`)}return{inlineData:a,paramsStatus:n&&[n],proposalHash:n,resultPreimageHash:n&&{count:0,isCompleted:!1,isHashParam:"hash"===f(e),proposalHash:n,proposalLength:a&&new(m())(a.length),status:null}}}function x(e,t,n){const a=(0,c.U)(n)?n:n.unwrapOr(null),s=e=>(0,h.Z)({},t,{isCompleted:!0,...e});if(!a)return s({proposalWarning:"No preimage bytes found"});try{const t=e.tx(a.toString()),n=e.createType("Call",t.method);if(t.toHex()===a.toString())return s({proposal:n})}catch{}try{const n=e.registry.createType("Call",a),i=n.encodedLength;if(t.proposalLength){const e=t.proposalLength.toNumber();return s({proposal:n,proposalWarning:i!==e?`Decoded call length does not match on-chain stored preimage length (${(0,p.u)(i)} bytes vs ${(0,p.u)(e)} bytes)`:null})}return s({proposal:n,proposalLength:new(m())(i)})}catch(e){console.error(e)}return s({proposalError:"Unable to decode preimage bytes into a valid Call"})}function v(e){return e?{amount:e[1],who:e[0].toString()}:void 0}const A=(0,r.e)("usePreimage",(function(e){const{api:t}=(0,s.h)(),{inlineData:n,paramsStatus:r,resultPreimageHash:l}=(0,a.useMemo)((()=>e?b(t,e):{}),[t,e]),c=(0,i.W7)(!n&&r&&t.query.preimage?.statusFor,r),d=(0,i.W7)(!n&&r&&t.query.preimage?.requestStatusFor,r),u=c?.isSome?c:d,{paramsBytes:m,resultPreimageFor:p}=(0,a.useMemo)((()=>l&&u?function(e,t){const n=(0,h.Z)({},e,{status:t.unwrapOr(null)});if(n.status)if(n.status.isRequested){const e=n.status.asRequested;e instanceof o.W||(n.count=e.count.toNumber(),n.deposit=v(e.maybeTicket?e.maybeTicket.unwrapOr(null):e.deposit.unwrapOr(null)),n.proposalLength=e.maybeLen?e.maybeLen.unwrapOr(g.nw):e.len.unwrapOr(g.nw))}else if(n.status.isUnrequested){const e=n.status.asUnrequested;e instanceof o.W?n.deposit=v(e.unwrapOr(null)):(n.deposit=v(e.ticket||e.deposit),n.proposalLength=e.len)}else console.error(`Unhandled PalletPreimageRequestStatus type: ${n.status.type}`);return{paramsBytes:n.isHashParam?[n.proposalHash]:[[n.proposalHash,n.proposalLength||g.nw]],resultPreimageFor:n}}(l,u):{}),[u,l]),f=(0,i.W7)(m&&t.query.preimage?.preimageFor,m);return(0,a.useMemo)((()=>p?f?x(t,p,f):p:l?n?x(t,l,n):l:void 0),[t,n,f,l,p])}))},19276:(e,t,n)=>{n.d(t,{N:()=>l});var a=n(11677),s=n(34814),i=n(90778),r=n(9118);const o={transform:(e,t)=>3===t.tx.proxy.addProxy.meta.args.length?e:e.map((([e,n])=>[e.map((([e,n])=>t.createType("ProxyDefinition",{delegate:e,proxyType:n}))),n]))},l=(0,a.e)("useProxies",(function(){const{api:e}=(0,i.h)(),{allAccounts:t}=(0,s.x)();return(0,r.W7)(e.query.proxy?.proxies.multi,[t],o)}))},86135:(e,t,n)=>{n.d(t,{L:()=>i});var a=n(2784),s=n(87561);const i=(0,n(11677).e)("useQueue",(function(){return(0,a.useContext)(s.l)}))},26309:(e,t,n)=>{n.d(t,{e:()=>l});var a=n(2784),s=n(12298),i=n(9118),r=n(11677);const o={transform:e=>e.map((({args:[e]})=>e))},l=(0,r.e)("useRegions",(function(e){const t=(0,s.k)(e?.query?.broker.regions,[],o),n=(0,i.W7)(e?.query?.broker.regions.multi,[t],{withParams:!0}),[r,l]=(0,a.useState)();return(0,a.useEffect)((()=>{n&&n[0][0].length>0&&l(n[0][0].map(((e,t)=>{return a=e.core.toNumber(),s=e.begin.toNumber(),i=n[1][t].unwrap().end.toNumber(),r=n[1][t].unwrap().owner.toString(),o=n[1][t].unwrap().paid.toString(),{core:a,end:i,mask:e.mask.toHex(),owner:r,paid:o,start:s};var a,s,i,r,o})))}),[n]),r}))},69250:(e,t,n)=>{n.d(t,{o:()=>o});var a=n(2784),s=n(23729),i=n.n(s),r=n(47538);function o(e,t){const[n,s]=(0,a.useState)((()=>function(e,t){const n=i().get(`flags:${e}`,{});return Object.keys(t).reduce(((e,t)=>((0,r.j)(n[t])&&(e[t]=n[t]),e)),{...t})}(e,t))),[o]=(0,a.useState)((()=>function(e,t){return Object.keys(e).reduce(((e,n)=>(e[n]=(e=>n=>t((t=>({...t,[e]:n}))))(n),e)),{})}(t,s)));return(0,a.useEffect)((()=>{i().set(`flags:${e}`,n)}),[n,e]),[n,o]}},78627:(e,t,n)=>{n.d(t,{_:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useStakingInfo",(function(e){const{api:t}=(0,s.h)();return(0,i.W7)(t.derive.staking?.account,[e])}))},98551:(e,t,n)=>{n.d(t,{t:()=>s});var a=n(2784);const s=(0,n(11677).e)("useStepper",(function(){const[e,t]=(0,a.useState)(1),n=(0,a.useCallback)((()=>t((e=>e+1))),[]),s=(0,a.useCallback)((()=>t((e=>e-1))),[]);return(0,a.useMemo)((()=>[e,n,s,t]),[e,n,s,t])}))},19008:(e,t,n)=>{n.d(t,{x:()=>r});var a=n(11677),s=n(90778),i=n(9118);const r=(0,a.e)("useSubidentities",(function(e){const{apiIdentity:t}=(0,s.h)();return(0,i.W7)(t.query.identity?.subsOf,[e])?.[1]}))},74421:(e,t,n)=>{n.d(t,{p:()=>c});var a=n(2784),s=n(11677),i=n(34814),r=n(90778),o=n(9118);const l={transform:e=>e.toString()},c=(0,s.e)("useSudo",(function(){const{api:e}=(0,r.h)(),{allAccounts:t,hasAccounts:n}=(0,i.x)(),s=(0,o.W7)(n&&e.query.sudo?.key,void 0,l),[c,d]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{d(!!s&&!!t&&t.some((e=>e===s)))}),[t,s]),{allAccounts:t,hasSudoKey:c,sudoKey:s}}))},29455:(e,t,n)=>{n.d(t,{J:()=>r});var a=n(2784),s=n(11677),i=n(90778);const r=(0,s.e)("useSystemApi",(function(){const{api:e,apiRelay:t}=(0,i.h)();return(0,a.useMemo)((()=>t||e),[t,e])}))},41411:(e,t,n)=>{n.d(t,{M:()=>m});var a=n(2784),s=n(33318),i=n(65968),r=n(11677),o=n(90778),l=n(9118);const c={allowTeleport:!1,destinations:[],oneWay:[]},d=(0,s.Rf)(((e,t)=>t?.toString()||e)).filter((e=>!!e.teleport));function u(e,t){return d.filter((n=>(n.genesisHashRelay===e||n.genesisHash===e)&&t(n))).reduce(((e,t)=>(e.some((({genesisHash:e,paraId:n})=>n===t.paraId||e&&e===t.genesisHash))||e.push(t),e)),[]).sort(((e,t)=>e.isRelay===t.isRelay?0:e.isRelay?-1:1))}const m=(0,r.e)("useTeleport",(function(){const{api:e,apiUrl:t,isApiReady:n}=(0,o.h)(),s=(0,l.W7)(n&&e.query.parachainInfo?.parachainId),[r,m]=(0,a.useState)((()=>({...c})));return(0,a.useEffect)((()=>{if(n){const t=e.genesisHash.toHex(),n=d.find((({genesisHash:e})=>e===t));if(n){const e=u(t,(({paraId:e})=>(0,i.h)(e)&&n.teleport.includes(e))),a=u(t,(({paraId:e,teleport:t})=>(0,i.h)(e)&&!t.includes(-1))).map((({paraId:e})=>e||-1));m({allowTeleport:0!==e.length,destinations:e,isRelayTeleport:!0,oneWay:a})}}}),[e,n]),(0,a.useEffect)((()=>{if(s){const e=d.find((({value:e})=>e===t));if(e?.genesisHashRelay){const t=u(e.genesisHashRelay,(({paraId:t})=>e.teleport.includes((0,i.h)(t)?t:-1))),n=u(e.genesisHashRelay,(({paraId:e,teleport:t})=>!t.includes((0,i.h)(e)?e:-1))).map((({paraId:e})=>e||-1));m({allowTeleport:0!==t.length,destinations:t,isParaTeleport:!0,oneWay:n})}}}),[t,s]),r}))},3663:(e,t,n)=>{n.d(t,{F:()=>i});var a=n(2784),s=n(31383);const i=(0,n(11677).e)("useTheme",(function(){const e=(0,a.useContext)(s.Ni);return(0,a.useMemo)((()=>({theme:e?.theme||"light",themeClassName:`theme--${e?.theme||"light"}`})),[e])}))},38894:(e,t,n)=>{n.d(t,{O:()=>r});var a=n(2784),s=n(11677),i=n(74065);const r=(0,s.e)("useToggle",(function(e=!1,t){const n=(0,i.X)(),[s,r]=(0,a.useState)(e),o=(0,a.useCallback)((()=>{n.current&&r((e=>!e))}),[n]),l=(0,a.useCallback)((e=>{n.current&&r(e)}),[n]);return(0,a.useEffect)((()=>t&&t(s)),[s,t]),(0,a.useMemo)((()=>[s,o,l]),[s,o,l])}))},68920:(e,t,n)=>{n.d(t,{_:()=>m});var a=n(2784),s=n(95292),i=n(51330),r=n(48801),o=n.n(r),l=n(11677),c=n(90778),d=n(9118);const u=new Uint8Array(32),m=(0,l.e)("useTreasury",(function(){const{api:e}=(0,c.h)(),[t,n]=(0,a.useState)((()=>({pendingBounties:s.nw,pendingProposals:s.nw,spendPeriod:e.consts.treasury?e.consts.treasury.spendPeriod:s.nw,treasuryAccount:(0,i.e)("modl",e.consts.treasury&&e.consts.treasury.palletId?e.consts.treasury.palletId.toU8a(!0):"py/trsry",u).subarray(0,32)}))),r=(0,d.W7)(e.derive.bounties?.bounties),l=(0,d.W7)(e.derive.treasury.proposals),m=(0,d.W7)(e.derive.balances?.account,[t.treasuryAccount]);return(0,a.useEffect)((()=>{m&&e.consts.treasury&&n((({pendingBounties:t,pendingProposals:n,spendPeriod:a,treasuryAccount:i})=>({burn:m.freeBalance.gt(s.nw)&&!e.consts.treasury.burn.isZero()?e.consts.treasury.burn.mul(m.freeBalance).div(s.uy):s.nw,pendingBounties:t,pendingProposals:n,spendPeriod:a,treasuryAccount:i,value:m.freeBalance.gt(s.nw)?m.freeBalance:void 0})))}),[e,m]),(0,a.useEffect)((()=>{l&&n((e=>({...e,pendingProposals:l.approvals.reduce(((e,{proposal:{value:t}})=>e.iadd(t)),new(o())(0)),totalProposals:l.proposalCount.toNumber()})))}),[l]),(0,a.useEffect)((()=>{r&&n((e=>({...e,pendingBounties:r.reduce(((e,{bounty:{status:t,value:n}})=>e.iadd(t.isApproved?n:s.nw)),new(o())(0))})))}),[r]),t}))},79760:(e,t,n)=>{n.d(t,{b:()=>f});var a=n(2784),s=n(12372),i=n(57826),r=n(95292),o=n(52107),l=n(33661),c=n(17965),d=n(11677),u=n(34814),m=n(90778),h=n(56949);function p(e){return{proofSize:e.proofSize?(0,s.G)((0,i.f)(e.proofSize)?e.proofSize.unwrap():e.proofSize):r.nw,refTime:(0,s.G)((0,i.f)(e.refTime)?e.refTime.unwrap():e.refTime)}}function g(e,t){const n=p(e),a=p(t);return{proofSize:(0,o.x)(r.nw,n.proofSize.sub(a.proofSize)),refTime:(0,o.x)(r.nw,n.refTime.sub(a.refTime))}}const f=(0,d.e)("useTxBatch",(function(e,t){const{api:n}=(0,m.h)(),{allAccounts:s}=(0,u.x)(),[i,d]=(0,a.useState)((()=>Math.floor(t?.max||4))),f=(0,a.useMemo)((()=>function(e){return{baseExtrinsic:e.consts.system.blockWeights?p((0,h.ZQ)(e.consts.system.blockWeights.perClass.normal.baseExtrinsic).v2Weight):null,maxBlock:p((0,h.ZQ)(e.consts.system.blockWeights?e.consts.system.blockWeights.maxBlock:e.consts.system.maximumBlockWeight).v2Weight),maxExtrinsic:e.consts.system.blockWeights&&e.consts.system.blockWeights.perClass.normal.maxExtrinsic.isSome?p((0,h.ZQ)(e.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrap()).v2Weight):null}}(n)),[n]);return(0,a.useEffect)((()=>{e&&e.length&&s[0]&&e[0].hasPaymentInfo&&(0,c.Y)((async()=>{try{const t=await e[0].paymentInfo(s[0]),n=(0,h.ZQ)(t.weight);d((e=>n.v1Weight.isZero()?e:function({v1Weight:e,v2Weight:t},{baseExtrinsic:n,maxBlock:a,maxExtrinsic:s}){let i=0;return n&&s&&(i=Math.floor(.85*function(e,t){const n=p(e),a=p(t),s={proofSize:a.proofSize.isZero()?r.nw:(0,o.x)(r.nw,n.proofSize.mul(r.S8).div(a.proofSize)),refTime:a.refTime.isZero()?r.nw:(0,o.x)(r.nw,n.refTime.mul(r.S8).div(a.refTime))};return(s.proofSize.isZero()?s.refTime.toNumber():(0,o.N)(s.proofSize,s.refTime).toNumber())/100}(g(s,n),g(t,n)))),i||Math.floor(a.refTime.muln(64).div(e).toNumber()/100)}(n,f)))}catch(e){console.error(e)}}))}),[s,n,f,t,e]),(0,a.useMemo)((()=>e&&e.length?function(e,t,n,a="default"){return 1!==n&&(0,l.m)(e.tx.utility?.batch)?t.reduce(((e,t)=>{const a=e[e.length-1];return a.length>=n?e.push([t]):a.push(t),e}),[[]]).map((t=>1===t.length?t[0]:"all"===a&&(0,l.m)(e.tx.utility.batchAll)?e.tx.utility.batchAll(t):"force"===a&&(0,l.m)(e.tx.utility.forceBatch)?e.tx.utility.forceBatch(t):e.tx.utility.batch(t))):t}(n,e,i,t?.type):null),[n,i,t,e])}))},87660:(e,t,n)=>{n.d(t,{I:()=>c});var a=n(2784),s=n(33661),i=n(11677),r=n(90778),o=n(54383);const l={hasFailed:!1,hasPassed:!1,isCloseable:!1,isVoteable:!1,remainingBlocks:null},c=(0,i.e)("useVotingStatus",(function(e,t,n){const{api:i}=(0,r.h)(),c=(0,o.C)();return(0,a.useMemo)((()=>c&&e?function(e,t,n,a,i){const[r]=e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),i)||[i],o=(0,s.m)(e.tx[r]?.close)?r:null;if(!n.end||!o)return{hasFailed:!1,hasPassed:!1,isCloseable:!1,isVoteable:!0,remainingBlocks:null};const l=t.gte(n.end),c=n.threshold.lten(n.ayes.length),d=n.threshold.gtn(Math.abs(a-n.nays.length));return{hasFailed:d,hasPassed:c,isCloseable:4===e.tx[o].close.meta.args.length?l||c||d:l,isVoteable:!l,remainingBlocks:l?null:n.end.sub(t)}}(i,c,e,t,n):l),[i,c,t,n,e])}))},56949:(e,t,n)=>{n.d(t,{TS:()=>u,ZQ:()=>h,h7:()=>p});var a=n(2784),s=n(95292),i=n(33403),r=n(33661),o=n(17965),l=n(11677),c=n(90778),d=n(74065);const u="0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",m={encodedCallLength:0,v1Weight:s.nw,v2Weight:{refTime:s.nw},weight:s.nw};function h(e){if(!e){const e=s.nw;return{v1Weight:e,v2Weight:{proofSize:s.nw,refTime:e}}}if(e.proofSize)return{v1Weight:e.refTime.toBn(),v2Weight:e};if(e.refTime){const t=e.refTime.toBn();return{v1Weight:t,v2Weight:{proofSize:s.nw,refTime:t}}}const t=e.toBn();return{v1Weight:t,v2Weight:{proofSize:s.nw,refTime:t}}}const p=(0,l.e)("useWeight",(function(e){const{api:t}=(0,c.h)(),n=(0,d.X)(),[s,l]=(0,a.useState)((()=>(0,i.Z)({isWeightV2:!(0,r.m)(t.registry.createType("Weight").toBn)},m)));return(0,a.useEffect)((()=>{e&&t.call.transactionPaymentApi?(0,o.Y)((async()=>{try{const{v1Weight:a,v2Weight:s}=h((await t.tx(e).paymentInfo(u)).weight);n.current&&l((t=>(0,i.Z)({},t,{encodedCallLength:e.encodedLength,v1Weight:a,v2Weight:s,weight:t.isWeightV2?s:a})))}catch(e){console.error(e)}})):l((e=>(0,i.Z)({},e,m)))}),[t,e,n]),s}))},59653:(e,t,n)=>{n.d(t,{E:()=>c});var a=n(2784),s=n(12298),i=n(9118),r=n(11677),o=n(33388);const l={transform:e=>e.map((({args:[e]})=>e))},c=(0,r.e)("useWorkloadInfos",(function(e,t){const n=(0,s.k)(t&&e?.query.broker.workload,[],l),r=(0,i.W7)(t&&e?.query.broker.workload.multi,[n],{withParams:!0}),[c,d]=(0,a.useState)();return(0,a.useEffect)((()=>{if(!r?.[0]?.[0])return;const e=r[0][0];var t;d((t=e.map(((e,t)=>function(e,t){const n=(0,o.Pq)(e[0]?.mask),a=e[0].assignment;return{core:t,info:{isPool:a.isPool,isTask:a.isTask,mask:n,maskBits:n.length,task:a.isTask?a.asTask.toString():a.isPool?"Pool":"Idle"}}}(r[1][t],e.toNumber()))))?(Array.isArray(t)?t:[t]).sort(((e,t)=>e.core-t.core)):[])}),[r]),c}))},22955:(e,t,n)=>{n.d(t,{b:()=>c});var a=n(2784),s=n(12298),i=n(9118),r=n(11677),o=n(33388);const l={transform:e=>e.map((({args:[e,t]})=>[e,t]))},c=(0,r.e)("useWorkplanInfos",(function(e,t){const n=(0,s.k)(t&&e?.query.broker.workplan,[],l),r=n?.map((e=>e[0])),c=(0,i.W7)(t&&e?.query.broker.workplan.multi,[r],{withParams:!0}),[d,u]=(0,a.useState)();return(0,a.useEffect)((()=>{if(!c?.[1]||!c[0]?.[0])return;const e=c[0][0];var t;u((t=e.map(((e,t)=>function(e,t,n){const a=(0,o.Pq)(e[0]?.mask),s=e[0].assignment;return{core:t,info:{isPool:s.isPool,isTask:s.isTask,mask:a,maskBits:a.length,task:s.isTask?s.asTask.toString():s.isPool?"Pool":"Idle"},timeslice:n}}(c[1][t].unwrap(),e[1].toNumber(),e[0].toNumber()))))?(Array.isArray(t)?t:[t]).sort(((e,t)=>e.core-t.core)):[])}),[c]),d}))},33388:(e,t,n)=>{function a(e){if(!e)return[];const t=e.toHex().slice(2).split(""),n=[];return t.forEach((e=>{var t;(t=e,parseInt(t,16).toString(2)).split("").forEach((e=>n.push(e)))})),n.filter((e=>"1"===e)),n}n.d(t,{Pq:()=>a})},37245:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(52322),s=n(2784);const i=n(37100).zo.div`
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

  .ui--Param-BTreeMap-buttons {
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
`,r=s.memo((function({children:e,className:t="",withBorder:n,withExpander:s,withPadding:r}){return(0,a.jsx)(i,{className:`${t} ui--Params ${n?"withBorder":""} ${r?"withPadding":""} ${s?"withExpander":""}`,children:e})}))},98988:(e,t,n)=>{n.d(t,{Z:()=>h});var a=n(52322),s=n(2784),i=n(37100),r=n(89176),o=n(58607),l=n(6046),c=n(27113),d=n(48653),u=n(37750);const m=i.zo.div`
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
`,h=s.memo((function({callName:e,children:t,className:n="",labelHash:h,labelSignature:p,mortality:g,onError:f,tip:b,value:x,withBorder:v,withExpander:A,withHash:w,withSignature:y}){const{t:k}=(0,u.$)(),[{hash:j,overrides:N,params:C,signature:E,signatureType:S,values:I},B]=(0,s.useState)({hash:null,params:[],signature:null,signatureType:null,values:[]});return(0,s.useEffect)((()=>{B(function(e,t,n,a){const s=a&&d.xS.includes(a)?d.fQ:void 0,i=e?.meta.args.map((({name:e,type:t})=>({name:e.toString(),type:(0,l.s)(t.toString())}))),r=e?.args.map((e=>({isValid:!0,value:e}))),o=t?e?.hash.toHex():null;let u=null,m=null;if(n&&function(e){return!!e.signature}(e)&&e.isSigned){const t=function(e){return e._raw?.signature?.multiSignature}(e);u=e.signature.toHex(),m=t instanceof c.x?t.type:null}return{hash:o,overrides:s,params:i,signature:u,signatureType:m,values:r}}(x,w,y,e))}),[e,x,w,y]),(0,a.jsx)(m,{className:`${n} ui--Call`,children:(0,a.jsxs)(r.ZP,{isDisabled:!0,onError:f,overrides:N,params:C,registry:x?.registry,values:I,withBorder:v,withExpander:A,children:[t,(0,a.jsxs)("div",{className:"ui--Call--toplevel",children:[j&&(0,a.jsx)(i.qG,{className:"hash",label:h||k("extrinsic hash"),value:j,withCopy:!0}),E&&(0,a.jsx)(i.qG,{className:"hash",label:p||k("signature {{type}}",{replace:{type:S?`(${S})`:""}}),value:E,withCopy:!0}),g&&(0,a.jsx)(i.qG,{className:"mortality",label:k("lifetime"),value:g}),b?.gtn(0)&&(0,a.jsx)(i.qG,{className:"tip",label:k("tip"),value:(0,a.jsx)(o.Z,{value:b})})]})]})})}))},15991:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(52322),s=n(2784),i=n(37100),r=n(98988);const o=s.memo((function({children:e,className:t="",isHeader:n,labelHash:o,labelSignature:l,mortality:c,onError:d,stringId:u,tip:m,value:h,withBorder:p,withHash:g,withSignature:f}){const b=(0,s.useMemo)((()=>h?.callIndex?h.registry.findMetaCall(h.callIndex):null),[h]);if(!b||!h)return null;const{meta:x,method:v,section:A}=b,w=`${A}.${v}`;return(0,a.jsx)("div",{className:`${t} ui--CallExpander`,children:(0,a.jsxs)(i.xH,{isHeader:n,isLeft:!0,summaryHead:(0,a.jsxs)(a.Fragment,{children:[u&&`#${u}: `,w]}),summaryMeta:x,children:[(0,a.jsx)(r.Z,{callName:w,labelHash:o,labelSignature:l,mortality:c,onError:d,tip:m,value:h,withBorder:p,withExpander:!0,withHash:g,withSignature:f}),e]})})}))},98202:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(52322),s=n(2784),i=n(37100),r=n(73477),o=n(89176),l=n(48653),c=n(37750);const d=s.memo((function({children:e,className:t="",eventName:n,value:d,withExpander:u}){const{t:m}=(0,c.$)(),h=d.data.names,p=d.typeDef.map(((e,t)=>({name:h?.[t]||void 0,type:e}))),g=d.data.map((e=>({isValid:!0,value:e}))),f=(0,s.useMemo)((()=>n&&l._o.includes(n)?l.fr:void 0),[n]),b=(0,s.useMemo)((()=>{if("contracts"===d.section&&"ContractExecution"===d.method&&2===d.data.length){const[e,t]=d.data;try{const n=(0,r.oX)(e.toString());if(n){const e=n.decodeEvent(t);return{...e,values:e.args.map((e=>({isValid:!0,value:e})))}}}catch(e){console.error(e)}}return null}),[d]);return(0,a.jsxs)("div",{className:`${t} ui--Event`,children:[e,(0,a.jsx)(o.ZP,{isDisabled:!0,overrides:f,params:p,registry:d.registry,values:g,withExpander:u,children:b&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.II,{isDisabled:!0,label:m("contract event"),value:b.event.identifier}),(0,a.jsx)(o.ZP,{isDisabled:!0,params:b.event.args,registry:d.registry,values:b.values})]})})]})}))},60404:(e,t,n)=>{n.d(t,{Z:()=>y});var a=n(52322),s=n(2784),i=n(37100),r=n(89176),o=n(6046),l=n(33403),c=n(1346),d=n(90778),u=n(54371),m=n(82671);const h=s.memo((function({className:e="",defaultArgs:t,defaultValue:n,isDisabled:i,isError:r,isPrivate:o,label:l,onChange:c,onEnter:d,onEscape:u,withLabel:m}){const h=(0,s.useCallback)((e=>c&&c({isValid:!!e,value:e})),[c]);return(0,a.jsx)(y,{className:e,defaultArgs:t,defaultValue:n,isDisabled:i,isError:r,isPrivate:o,label:l,onChange:h,onEnter:d,onEscape:u,withLabel:m})}));function p(e){return e.map((e=>({isValid:!0,value:e})))}function g(e,t,n){try{return n?.value?(a=n.value,(0,u.H)(a.section)&&(0,u.H)(a.method)?{initialArgs:p(n.value.args),initialValue:e.tx[n.value.section][n.value.method]}:function(e){return(0,m.K)(e.method)&&(0,u.H)(e.method.section)&&(0,u.H)(e.method.method)}(n.value)?{initialArgs:p(n.value.method.args),initialValue:e.tx[n.value.method.section][n.value.method.method]}:{initialValue:n.value}):{initialValue:t}}catch{return{initialValue:t}}var a}const f=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const{api:m,apiDefaultTx:p}=(0,d.h)(),[{initialArgs:f,initialValue:b}]=(0,s.useState)((()=>g(m,p,t)));return(0,a.jsx)(h,{className:e,defaultArgs:f,defaultValue:b,isDisabled:n,isError:i,isPrivate:!1,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u})})),b={Call:f,OpaqueCall:s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const{api:m,apiDefaultTxSudo:p}=(0,d.h)(),[{initialArgs:f,initialValue:b}]=(0,s.useState)((()=>g(m,p,t))),x=(0,s.useCallback)((({isValid:e,value:t})=>{let n=null;e&&t&&(n=t.method.toHex()),o&&o({isValid:e,value:n})}),[o]);return(0,a.jsx)(h,{className:e,defaultArgs:f,defaultValue:b,isDisabled:n,isError:i,isPrivate:!0,label:r,onChange:x,onEnter:l,onEscape:c,withLabel:u})})),Proposal:s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const{api:m,apiDefaultTxSudo:p}=(0,d.h)(),[{initialArgs:f,initialValue:b}]=(0,s.useState)((()=>g(m,p,t))),x=(0,s.useCallback)((({isValid:e,value:t})=>{let n=null;e&&t&&(n=m.createType("Proposal",t)),o&&o({isValid:e,value:n})}),[m,o]);return(0,a.jsx)(h,{className:e,defaultArgs:f,defaultValue:b,isDisabled:n,isError:i,isPrivate:!0,label:r,onChange:x,onEnter:l,onEscape:c,withLabel:u})})),RuntimeCall:f};var x=n(48653);const v=(0,l.Z)({},b,x.fQ);function A({meta:e}){return e.args.map((({name:e,type:t,typeName:n})=>({name:e.toString(),type:{...(0,o.s)(t.toString()),...n.isSome?{typeName:n.unwrap().toString()}:{}}})))}function w(e,t=[]){return{extrinsic:{fn:e,params:A(e)},values:t}}const y=s.memo((function({defaultArgs:e,defaultValue:t,filter:n,isDisabled:o,isError:l,isPrivate:d,label:u,onChange:m,onEnter:h,onError:p,onEscape:g,withLabel:f}){const[{extrinsic:A,values:y},k]=(0,s.useState)((()=>w(t,e)));(0,s.useEffect)((()=>{const e=function(e,t){return t.reduce(((e,t)=>e&&!(0,c.o)(t)&&!(0,c.o)(t.value)&&t.isValid),e.length===t.length)}(A.params,y);let t;if(e)try{t=A.fn(...y.map((({value:e})=>e)))}catch(e){p&&p(e)}else p&&p(null);m(t)}),[A,m,p,y]);const j=(0,s.useMemo)((()=>x.xS.includes(`${A.fn.section}.${A.fn.method}`)?v:b),[A]),N=(0,s.useCallback)((e=>k((t=>e.section===t.extrinsic.fn.section&&e.method===t.extrinsic.fn.method?t:w(e)))),[]),C=(0,s.useCallback)((e=>k((({extrinsic:t})=>({extrinsic:t,values:e})))),[]),{fn:{method:E,section:S},params:I}=A;return(0,a.jsxs)("div",{className:"extrinsics--Extrinsic",children:[(0,a.jsx)(i.UT,{defaultValue:t,filter:n,isDisabled:o,isError:l,isPrivate:d,label:u,onChange:N,withLabel:f}),(0,a.jsx)(r.ZP,{onChange:C,onEnter:h,onEscape:g,overrides:j,params:I,values:y},`${S}.${E}:params`)]})}))},81661:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(52322),s=n(2784),i=n(54371),r=n(1346),o=n(14681),l=n(37750),c=n(15991);const d=s.memo((function({className:e="",idNumber:t,proposal:n}){const{t:s}=(0,l.$)(),d=(0,i.H)(t)||(0,r.o)(t)?t:(0,o.u)(t);return n?(0,a.jsx)("div",{className:`${e} ui--ProposedAction`,children:(0,a.jsx)(c.Z,{isHeader:!0,labelHash:s("preimage"),stringId:d,value:n,withHash:!0})}):(0,a.jsx)("div",{className:`${e} ui--ProposedAction`,children:(0,a.jsxs)("div",{children:[d?`#${d}: `:"",s("No execution details available for this proposal")]})})}))},40943:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(52322),s=n(2784),i=n(44294),r=n(48801),o=n.n(r),l=n(50005);const c=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:r,label:c,onChange:d,onEnter:u,onEscape:m,withLabel:h}){const[p,g]=(0,s.useState)(!1),[f]=(0,s.useState)((()=>new(o())((t||"0").toString()).toString(10))),b=(0,s.useCallback)((e=>{const t=!r&&!!e;d&&d({isValid:t,value:e}),g(t)}),[r,d]);return(0,a.jsx)(l.Z,{className:e,children:(0,a.jsx)(i.Z,{className:"full",defaultValue:f,isDisabled:n,isError:r||!p,label:c,onChange:b,onEnter:u,onEscape:m,withEllipsis:!0,withLabel:h})})}))},50005:(e,t,n)=>{n.d(t,{Z:()=>s});var a=n(52322);const s=n(2784).memo((function({children:e,className:t=""}){return(0,a.jsx)("div",{className:`${t} ui--row --relative`,children:e})}))},44605:(e,t,n)=>{n.d(t,{Z:()=>nt});var a=n(52322),s=n(2784),i=n(6046),r=n(67557),o=n(1346),l=n(23601),c=n(6485),d=n(37100),u=n(69187),m=n(50005),h=n(27113),p=n(82671),g=n(89176);function f(e,t){return(0,i.s)(e.createType(t.type).toRawType()).sub}const b=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:i,isError:r,label:o,onChange:l,overrides:c,registry:u,type:b,withLabel:x}=e,[{options:v,subTypes:A}]=(0,s.useState)((()=>function(e,t){const n=f(e,t).filter((({name:e})=>!!e&&!e.startsWith("__Unused")));return{options:n.map((({name:e})=>({text:e,value:e}))),subTypes:n}}(u,b))),[w,y]=(0,s.useState)((()=>function(e,t,n,a){const s=f(e,t);return n.value instanceof h.x?[{name:n.value.type,type:s[n.value.index]}]:[{name:a[0].name,type:a[0]}]}(u,b,n,A))),[{initialEnum:k,initialParams:j},N]=(0,s.useState)((()=>function(e,t){if(e?.value){if(e.value instanceof h.x)return{initialEnum:e.value.type,initialParams:[{isValid:!0,value:e.value.inner}]};if((0,p.K)(e.value)){const[n,a]=Object.entries(e.value)[0];if(t.some((({value:e})=>e===n)))return{initialEnum:n,initialParams:[{isValid:!0,value:a}]}}}return{initialEnum:t[0]?.value,initialParams:void 0}}(n,v))),C=(0,s.useCallback)((e=>{if(i)return;const t=A.find((({name:t})=>t===e))||null;y(t?[{name:t.name,type:t}]:null),t&&N((e=>t.name===e.initialEnum?e:{initialEnum:e.initialEnum,initialParams:null}))}),[i,A]),E=(0,s.useCallback)((([{isValid:e,value:t}])=>{i||w&&l&&l({isValid:e,value:{[w[0].name||"unknown"]:t}})}),[w,i,l]);return(0,a.jsxs)(m.Z,{className:t,children:[(0,a.jsx)(d.Lt,{className:"full",defaultValue:k,isDisabled:i,isError:r,label:o,onChange:C,options:v,withEllipsis:!0,withLabel:x}),w&&(0,a.jsx)(g.ZP,{isDisabled:i,isError:r,onChange:E,overrides:c,params:w,registry:u,values:j})]})}));function x(e){if(e)try{return u.Nn.decodeAddress(e),!0}catch(e){console.error(e)}return!1}const v=s.memo((function(e){const{className:t="",defaultValue:{value:n},isDisabled:i,isError:r,label:o,onChange:l,type:c,withLabel:u}=e,[h]=(0,s.useState)((()=>n?.toString())),p=(0,s.useCallback)((e=>l&&l({isValid:x(e),value:e})),[l]);return"MultiAddress"!==c.type||i&&n&&"Id"===n.type?(0,a.jsx)(m.Z,{className:t,children:(0,a.jsx)(d.rp,{className:"full",defaultValue:h,isDisabled:i,isError:r,isInput:!0,label:o,onChange:p,placeholder:"5...",type:"allPlus",withEllipsis:!0,withLabel:u})}):(0,a.jsx)(b,{...e})}));var A=n(14681),w=n(12372);const y=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:r,onChange:l,onEnter:c,registry:u,type:h,withLabel:p}){const g=(0,s.useMemo)((()=>/^i\d*$/.test(h.type)),[h]),f=(0,s.useMemo)((()=>n?t instanceof u.createClass("AccountIndex")?t.toString():(0,A.u)(t):(0,w.G)(t||0).toString()),[n,u,t]),b=(0,s.useMemo)((()=>function(e,{type:t}){try{return e.createType(t).bitLength()}catch{return 32}}(u,h)),[u,h]),x=(0,s.useCallback)((e=>l&&l({isValid:!(0,o.o)(e),value:e})),[l]);return(0,a.jsx)(m.Z,{className:e,children:n?(0,a.jsx)(d.II,{className:"full",defaultValue:f,isDisabled:!0,label:r,withEllipsis:!0,withLabel:p}):(0,a.jsx)(d.Rn,{bitLength:b,className:"full",defaultValue:f,isError:i,isSigned:g,isZeroable:!0,label:r,onChange:x,onEnter:c,withLabel:p})})}));var k=n(40943),j=n(68774),N=n(5122);function C(e,t){if(e)try{return t?(0,j.u)(e):(0,N.Y)(e)}catch(e){console.error(e)}return!1}const E=s.memo((function(e){const{bytesLength:t,className:n="",defaultValue:{value:i},isDisabled:r,isError:o,label:l,onChange:c}=e,[u]=(0,s.useState)((()=>i?.toString())),h=(0,s.useCallback)((e=>c&&c({isValid:C(e,20===t),value:e})),[t,c]);return(0,a.jsx)(m.Z,{className:n,children:(0,a.jsx)(d.bm,{bytesLength:t,className:"full",defaultValue:u,forceIconType:20===t?"ethereum":"substrate",isDisabled:r,isError:o,label:l,noConvert:!0,onChange:h,placeholder:20===t?"0x1...":"5..."})})})),S=s.memo((function(e){return(0,a.jsx)(E,{...e,bytesLength:20})})),I=s.memo((function(e){return(0,a.jsx)(E,{...e,bytesLength:32})}));var B=n(47538),D=n(37750);const L=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:r,onChange:o,withLabel:l}){const{t:c}=(0,D.$)(),[u]=(0,s.useState)(t instanceof Boolean?t.valueOf():!!(0,B.j)(t)&&t),h=(0,s.useRef)([{text:c("No"),value:!1},{text:c("Yes"),value:!0}]),p=(0,s.useCallback)((e=>o&&o({isValid:!0,value:e})),[o]);return(0,a.jsx)(m.Z,{className:e,children:(0,a.jsx)(d.Lt,{className:"full",defaultValue:u,isDisabled:n,isError:i,label:r,onChange:p,options:h.current,withEllipsis:!0,withLabel:l})})}));var P=n(74420),T=n(24107),V=n(30590);const M=s.memo((function({children:e,className:t="",isOuter:n,label:s,labelExtra:i,size:r="full",withLabel:o}){return(0,a.jsxs)(m.Z,{className:t,children:[(0,a.jsx)(d.jN,{className:r,isOuter:!0,label:s,labelExtra:i,withEllipsis:!0,withLabel:o,children:!n&&e}),n&&e]})}));const F=(0,n(11677).e)("useParamDefs",(function(e,t){return(0,s.useMemo)((()=>function(e,t){const n=function(e,t){try{return(0,i.s)(e.createType(t.type).toRawType())}catch{return t}}(e,t);return n.sub?(Array.isArray(n.sub)?n.sub:[n.sub]).map((e=>({length:n.length,name:e.name,type:e}))):[]}(e,t)),[e,t])}));function z([{name:e,type:t}],n){return{name:`${n}: ${e||t.type}`,type:t}}function Z(e,t,n){if(t.length===n)return t;const a=[];for(let t=0;t<n;t++)a.push(z(e,t));return a}const R=s.memo((function({className:e="",defaultValue:t,isDisabled:n=!1,label:i,onChange:r,overrides:l,registry:c,type:u,withLabel:m}){const{t:h}=(0,D.$)(),p=function([e,t]){return[{name:"(Key, Value)",type:{info:17,sub:[e.type,t.type],type:`(${e.type.type}, ${t.type.type})`}}]}(F(c,u)),[f,b]=(0,s.useState)((()=>function({isValid:e,value:t}){return e&&(0,T.c)(t)&&t instanceof P.P?[...t.entries()].map((([e,t])=>({isValid:!0,value:[{isValid:!0,value:e},{isValid:!0,value:t}]}))):[]}(t))),[x,v]=(0,s.useState)((()=>f.length)),[A,w]=(0,s.useState)((()=>Z(p,[],x)));(0,s.useEffect)((()=>{p.length&&w((e=>Z(p,e,n?f.length:x)))}),[x,f,n,p]),(0,s.useEffect)((()=>{!n&&p.length&&b((e=>{if(e.length===x)return e;for(;e.length<x;){const t=(0,V.Z)(c,p[0].type);e.push({isValid:!(0,o.o)(t),value:t})}return e.slice(0,x)}))}),[x,t,p,n,c]),(0,s.useEffect)((()=>{const e=new Map;let t=!0;for(const n of f){const[a,s]=n.value;e.has(a)&&(t=!1,console.error("BTreeMap: Duplicate key ",a)),e.set(a,s),t=t&&n.isValid}r&&r({isValid:t,value:e})}),[f,r]);const y=(0,s.useCallback)((()=>v((e=>e+1))),[]),k=(0,s.useCallback)((()=>v((e=>e-1))),[]);return(0,a.jsxs)(M,{className:e,isOuter:!0,label:i,withLabel:m,children:[!n&&(0,a.jsxs)("div",{className:"ui--Param-BTreeMap-buttons",children:[(0,a.jsx)(d.zx,{icon:"plus",label:h("Add item"),onClick:y}),(0,a.jsx)(d.zx,{icon:"minus",isDisabled:0===f.length,label:h("Remove item"),onClick:k})]}),(0,a.jsx)(g.ZP,{isDisabled:n,onChange:b,overrides:l,params:A,registry:c,values:f})]})}));var $=n(88311),q=n(48533),H=n(70676),U=n(64021),W=n(46610),O=n(56623),Q=n(55858),G=n(74076),J=n(94175);const K=()=>!0,Y=(0,d.zo)(m.Z)`
  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: -16px;
    position: absolute;
    top: 8px;
  }
`,X=s.memo((function({asHex:e,children:t,className:n="",defaultValue:{value:i},isDisabled:r,isError:o,label:l,labelExtra:c,length:u=-1,onChange:m,onEnter:h,onEscape:p,size:g="full",validate:f=K,withCopy:b,withLabel:x,withLength:v}){const{t:A}=(0,D.$)(),[w]=(0,s.useState)((()=>{if(i){const e=(0,W.Y)(i);return(0,H._)(e)?(0,O.z)(e):(0,Q.c)(e)}})),[{isAddress:y,isValid:k,lastValue:j},N]=(0,s.useState)((()=>({isAddress:!1,isValid:(0,G.vq)(w)||(0,H._)(w)}))),C=(0,s.useCallback)((t=>{let[n,a,s]=function(e){if("0x"===e)return[!0,!1,new Uint8Array([])];if(e.startsWith("0x"))try{return[!0,!1,(0,q.G)(e)]}catch{return[!1,!1,new Uint8Array([])]}try{return[!0,!0,(0,J.m)(e)]}catch{}return(0,H._)(e)?[!0,!1,(0,U.d)(e)]:["0x"===e,!1,new Uint8Array([])]}(t);n=n&&f(s)&&(-1!==u?s.length===u:0!==s.length||"0x"===t),v&&n&&(s=(0,$.N)(s)),m&&m({isValid:n,value:e?(0,Q.c)(s):s}),N({isAddress:a,isValid:n,lastValue:s})}),[e,u,m,f,v]);return(0,a.jsx)(Y,{className:n,children:(0,a.jsxs)(d.II,{className:g,defaultValue:w,isAction:!!t,isDisabled:r,isError:o||!k,label:l,labelExtra:c,onChange:C,onEnter:h,onEscape:p,placeholder:A("0x prefixed hex, e.g. 0x1234 or ascii data"),type:"text",withEllipsis:!0,withLabel:x,children:[t,b&&(0,a.jsx)(d.qi,{value:w}),y&&(0,a.jsx)(d.k,{className:"ui--InputAddressSimpleIcon",size:32,value:j})]})})})),_=s.memo((function({className:e="",isDisabled:t,isError:n=!1,label:s,labelExtra:i,onChange:r,placeholder:o,withLabel:l}){return(0,a.jsx)(m.Z,{className:e,children:(0,a.jsx)(d.ht,{isDisabled:t,isError:n,label:s,labelExtra:i,onChange:r,placeholder:o,withEllipsis:!0,withLabel:l})})})),ee=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,name:o,onChange:l,onEnter:c,onEscape:u,type:m,withLabel:h,withLength:p=!0}){const{t:g}=(0,D.$)(),[f,b]=(0,s.useState)(!1),[x,v]=(0,s.useState)(!1),A=(0,s.useCallback)((e=>{const t=0!==e.length;l&&l({isValid:t,value:(0,$.N)(e)}),b(t)}),[l]),w=!n&&(0,a.jsx)(d.ZD,{label:g("file upload"),onChange:v,value:x});return(0,a.jsx)("div",{className:`${e} --relative`,children:!n&&x?(0,a.jsx)(_,{isDisabled:n,isError:i||!f,label:r,labelExtra:w,onChange:A,withLabel:h}):(0,a.jsx)(X,{defaultValue:t,isDisabled:n,isError:i,label:r,labelExtra:w,length:-1,name:o,onChange:l,onEnter:c,onEscape:u,type:m,withLabel:h,withLength:p})})}));var te=n(98988),ne=n(83488);const ae=(0,d.zo)(m.Z)`
  pre {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ui--Static {
    margin-bottom: 0 !important;
  }
`,se=s.memo((function({asHex:e,children:t,childrenPre:n,className:i="",defaultValue:r,isOptional:o,label:l}){const{t:c}=(0,D.$)(),u=(0,s.useMemo)((()=>!!r?.value&&(e?r.value.toHex():(0,ne.k)(r.value.toHuman?r.value.toHuman():r.value))),[e,r]);return(0,a.jsxs)(ae,{className:i,children:[n,(0,a.jsx)(d.qG,{className:"full",label:l,value:(0,a.jsx)("pre",{children:u||(o?(0,a.jsx)(a.Fragment,{children:" "}):c("<empty>"))})}),t]})})),ie=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:s,isError:i,label:r,name:o,onChange:l,onEnter:c,onEscape:d,type:u}=e;return s?(0,a.jsx)(se,{...e}):(0,a.jsx)(X,{asHex:!0,className:t,defaultValue:n,isDisabled:s,isError:i,label:r,length:-1,name:o,onChange:l,onEnter:c,onEscape:d,type:u})})),re=s.memo((function(e){const{t}=(0,D.$)(),{className:n="",defaultValue:{value:s},isDisabled:i,label:r,withLabel:o}=e;if(!i)return(0,a.jsx)(ie,{...e});const l=s,{method:c,section:u}=l.registry.findMetaCall(l.callIndex),h=`${u}.${c}`;return(0,a.jsxs)(m.Z,{children:[(0,a.jsx)(d.qG,{className:`${n} full`,label:r,withLabel:o,children:h}),(0,a.jsx)(te.Z,{callName:h,labelHash:t("call hash / {{section}}.{{method}}",{replace:{method:c,section:u}}),value:l,withHash:!0})]})}));var oe=n(67292),le=n(45409);const ce=s.memo((function(e){const t=F(e.registry,e.type),{className:n="",defaultValue:i,isDisabled:r,label:o,onChange:l,overrides:c,withLabel:d}=e,[u]=(0,s.useState)((()=>function({isValid:e,value:t}){return e&&(0,T.c)(t)&&t instanceof le.A?t.toArray().map((e=>({isValid:!0,value:e}))):void 0}(i))),m=(0,s.useCallback)((e=>{r||l&&l({isValid:e.reduce(((e,{isValid:t})=>e&&t),!0),value:t.reduce(((t,{name:n},a)=>(t[n||"unknown"]=e[a].value,t)),{})})}),[r,t,l]);return(0,a.jsxs)("div",{className:"ui--Params-Struct",children:[(0,a.jsx)(M,{className:n,label:o,withLabel:d}),(0,a.jsx)(g.ZP,{isDisabled:r,onChange:m,overrides:c,params:t,registry:e.registry,values:u})]})})),de=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:i,isError:r,label:o,onChange:l,withLabel:c}=e,[u,h]=(0,s.useState)(!1),[p]=(0,s.useState)((()=>i&&n&&(0,T.c)(n.value)?(0,oe.c)(n.value):null)),[g]=(0,s.useState)((()=>i||!n||(0,T.c)(n.value))),f=(0,s.useCallback)((e=>{const t=(0,oe.h)(e),n=!!t;l&&l({isValid:n,value:t}),h(n)}),[l]);return p?(0,a.jsx)(se,{...e,children:(0,a.jsx)(d.II,{className:"full",isDisabled:!0,label:"ipfs",type:"text",value:p,withLabel:c})}):g?(0,a.jsx)(ce,{...e}):(0,a.jsx)(m.Z,{className:t,children:(0,a.jsx)(d.II,{className:"full",isDisabled:i,isError:r||!u,label:o,onChange:f,placeholder:"IPFS compatible CID",type:"text",withLabel:c})})}));var ue=n(6226);const me=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,registry:d,type:u,withLabel:m}){const[h,p]=(0,s.useState)(!1),g=(0,s.useCallback)((e=>{const t=(0,ue.F)(e);o&&o({isValid:t,value:e}),p(t)}),[o]);return n?(0,a.jsx)(ee,{className:e,defaultValue:t,isError:i||!h,label:r,onEnter:l,onEscape:c,registry:d,type:u,withLabel:m}):(0,a.jsx)(_,{className:e,defaultValue:t,isError:i||!h,label:r,onChange:g,withLabel:m})})),he=s.memo((function(e){const{t}=(0,D.$)(),[{details:n,type:i},r]=(0,s.useState)({});return(0,s.useEffect)((()=>{const{value:t}=e.defaultValue||{};if(function(e){return!(!e||!e.isModule&&!e.isToken)}(t))if(t.isModule)try{const e=t.asModule,{docs:n,name:a,section:s}=e.registry.findMetaError(e);return r({details:n.join(", "),type:`${s}.${a}`})}catch(e){console.error(e)}else if(t.isToken)return r({details:t.asToken.type,type:t.type});r({details:null})}),[e.defaultValue]),e.isDisabled&&n?(0,a.jsxs)(se,{...e,children:[(0,a.jsx)(d.II,{className:"full",isDisabled:!0,label:t("type"),value:i}),n&&(0,a.jsx)(d.II,{className:"full",isDisabled:!0,label:t("details"),value:n})]}):(0,a.jsx)(ie,{...e})})),pe=s.memo((function(e){const{defaultValue:t,isDisabled:n,label:i}=e,r=(0,s.useMemo)((()=>{return t&&(e=t.value)&&e.isErr?{isValid:!0,value:t.value.asErr}:null;var e}),[t]);return n?r?(0,a.jsx)(he,{...e,childrenPre:(0,a.jsx)(d.II,{className:"full",isDisabled:!0,label:i,value:"Err"}),defaultValue:r,label:"DispatchError"}):(0,a.jsx)(se,{...e,defaultValue:{isValid:!0,value:"Ok"}}):(0,a.jsx)(ie,{...e})})),ge=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:s,label:i,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withLabel:u}){return(0,a.jsx)(X,{asHex:!0,className:e,defaultValue:t,isDisabled:n,isError:s,label:i,length:20,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withCopy:n,withLabel:u})})),fe=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,name:o,onChange:l,onEnter:c,onEscape:u,registry:m,type:h,withLabel:p}){const{t:g}=(0,D.$)(),[f,b]=(0,s.useState)(!1),[x,v]=(0,s.useState)(null),A=(0,s.useCallback)((e=>{const t=m.hash(e);v((0,Q.c)(t)),l&&l({isValid:!0,value:t})}),[l,m]),w=(0,s.useCallback)((e=>{v(null),b(e)}),[b,v]),y=!n&&(0,a.jsx)(d.ZD,{label:g("hash a file"),onChange:w,value:f});return(0,a.jsx)("div",{className:e,children:!n&&f?(0,a.jsx)(_,{isDisabled:n,isError:i,label:r,labelExtra:y,onChange:A,placeholder:x||void 0,withLabel:p}):(0,a.jsx)(X,{asHex:!0,defaultValue:t,isDisabled:n,isError:i,label:r,labelExtra:y,length:32,name:o,onChange:l,onEnter:c,onEscape:u,type:h,withCopy:n,withLabel:p})})})),be=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:s,label:i,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withLabel:u}){return(0,a.jsx)(X,{asHex:!0,className:e,defaultValue:t,isDisabled:n,isError:s,label:i,length:64,name:r,onChange:o,onEnter:l,onEscape:c,type:d,withCopy:n,withLabel:u})}));var xe=n(51330);function ve(e,t=!1){let n,a=!1;try{n=(0,q.G)(e.toString()),a=t||0!==n.length}catch{n=new Uint8Array([])}return{isValid:a,u8a:(0,$.N)(n)}}const Ae=s.memo((function({className:e="",isDisabled:t,label:n,onChange:i,onEnter:r,withLabel:o}){const[,l]=(0,s.useState)(!1),[c,u]=(0,s.useState)((()=>({isValid:!1,u8a:new Uint8Array([])}))),[h,p]=(0,s.useState)((()=>({isValid:!1,u8a:new Uint8Array([])})));(0,s.useEffect)((()=>{const e=c.isValid&&h.isValid;i&&i({isValid:e,value:(0,xe.e)(c.u8a,h.u8a)}),l(e)}),[c,i,h]);const g=(0,s.useCallback)((e=>u(ve(e))),[]),f=(0,s.useCallback)((e=>p(ve(e,!0))),[]);return(0,a.jsxs)(m.Z,{className:e,children:[(0,a.jsx)(d.II,{className:"medium",isDisabled:t,isError:!c.isValid,label:n,onChange:g,placeholder:"0x...",type:"text",withLabel:o}),(0,a.jsx)(d.II,{className:"medium",isDisabled:t,isError:!h.isValid,onChange:f,onEnter:r,placeholder:"0x...",type:"text",withLabel:o})]})}));var we=n(48731);const ye={info:0,type:"Bytes"},ke=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,registry:d,withLabel:u}){const{t:m}=(0,D.$)(),[h,p]=(0,s.useState)(m("click to select or drag and drop JSON key/value (hex-encoded) file")),g=(0,s.useCallback)((e=>{let t={isValid:!1,value:[]};try{t=function(e){const t=JSON.parse((0,O.z)(e)),n=Object.keys(t);let a=0!==n.length;const s=n.map((e=>{const n=t[e];(0,we.hu)((0,G.vq)(e)&&(0,G.vq)(n),`Non-hex key/value pair found in ${e.toString()} => ${n.toString()}`);const s=ve(e),i=ve(n,!0);return a=a&&s.isValid&&i.isValid,[s.u8a,i.u8a]}));return{isValid:a,value:s}}(e),p(m("{{count}} key/value pairs encoded for submission",{replace:{count:t.value.length}}))}catch(e){console.error("Error converting json k/v",e),p(m("click to select or drag and drop JSON key/value (hex-encoded) file"))}o&&o(t)}),[o,m]);if(n){const n=t.value;return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(M,{className:e,label:r,children:(0,a.jsx)("div",{})}),(0,a.jsx)("div",{className:"ui--Params",children:n.map((([e,t])=>{const n=(0,Q.c)(e.toU8a(!0));return(0,a.jsx)(ee,{defaultValue:{value:t},isDisabled:!0,label:n,name:n,onEnter:l,onEscape:c,registry:d,type:ye},n)}))})]})}return(0,a.jsx)(_,{className:e,isDisabled:n,isError:i,label:r,onChange:g,placeholder:h,withLabel:u})})),je=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,registry:u,type:m,withLabel:h}){const p=(0,s.useCallback)((e=>o&&o(e)),[o]);return n?(0,a.jsx)(d.qG,{className:e,defaultValue:t?.value?t.value.toString():"",isError:i,label:r,withLabel:h}):(0,a.jsx)(y,{className:e,defaultValue:t,isDisabled:n,isError:i,label:r,onChange:p,onEnter:l,onEscape:c,registry:u,type:m,withLabel:h})})),Ne=s.memo((function({onChange:e}){return(0,s.useEffect)((()=>{e&&e({isValid:!0,value:null})}),[e]),null})),Ce=s.memo((function(e){if(!e.isDisabled)return(0,a.jsx)(ie,{...e});const t=e.registry.createType("Call",e.defaultValue.value.toHex());return(0,a.jsx)(re,{...e,defaultValue:{isValid:!0,value:t}})}));var Ee=n(37602),Se=n(48358),Ie=n(37245);const Be={isValid:!0,value:void 0},De=new Uint8Array([1]),Le=s.memo((function({className:e="",defaultValue:t,isDisabled:n,label:i,onChange:r,onEnter:o,onEscape:l,registry:c,type:{sub:u,withOptionActive:m},withLabel:h}){const{t:p}=(0,D.$)(),[g,f]=(0,s.useState)((()=>m||!!(t&&t.value instanceof Ee.W&&t.value.isSome)||!1)),[b]=(0,s.useState)((()=>g||n?t&&(t.value instanceof Ee.W&&t.value.isSome?{isValid:t.isValid,value:t.value.unwrap()}:Be):Be));(0,s.useEffect)((()=>{!g&&r&&r({isValid:!0,value:null})}),[g,r]);const x=(0,s.useCallback)((e=>r&&r(e.isValid&&(0,Se.U)(e.value)&&!m&&g?{isValid:!0,value:(0,xe.e)(De,e.value)}:e)),[g,r,m]);return(0,a.jsxs)("div",{className:`${e} --relative`,children:[(0,a.jsx)(M,{className:"--relative",label:i,labelExtra:!n&&(0,a.jsx)(d.ZD,{label:p("include option"),onChange:f,value:g}),withLabel:h}),(0,a.jsx)(Ie.Z,{children:(0,a.jsx)("div",{className:"ui--Params-Content",children:g?(0,a.jsx)(tt,{defaultValue:b,isDisabled:n||!g,isOptional:!g&&!n,onChange:x,onEnter:o,onEscape:l,registry:c,type:u}):(0,a.jsx)(se,{defaultValue:Be,isOptional:!0,label:"None"})})})]})})),Pe=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const[h,p]=(0,s.useState)(!1),g=(0,s.useCallback)((e=>{const t=0!==e.length;o&&o({isValid:t,value:e}),p(t)}),[o]),f=t?t.toHex?t.toHex():t:"";return(0,a.jsx)(m.Z,{className:e,children:(0,a.jsx)(d.II,{className:"full",defaultValue:f,isDisabled:n,isError:i||!h,label:r,onChange:g,onEnter:l,onEscape:c,placeholder:"Hex data",type:"text",withLabel:u})})})),Te=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:r,onChange:o,onEnter:l,onEscape:c,withLabel:u}){const[h,p]=(0,s.useState)(!1),g=(0,s.useCallback)((e=>{const t=0!==e.length;o&&o({isValid:t,value:e}),p(t)}),[o]),f=(t||"").toString();return(0,a.jsx)(m.Z,{className:e,children:(0,a.jsx)(d.II,{className:"full",defaultValue:f,isDisabled:n,isError:i||!h,label:r,onChange:g,onEnter:l,onEscape:c,placeholder:"<any string>",type:"text",withLabel:u})})}));var Ve=n(71285);const Me=s.memo((function(e){const{className:t="",defaultValue:n,isDisabled:i,label:r,onChange:o,overrides:l,registry:c,type:d,withLabel:u}=e,m=F(c,d),[h]=(0,s.useState)((()=>function({value:e}){return e instanceof Ve.p?e.map((e=>({isValid:!0,value:e}))):e}(n))),p=(0,s.useCallback)((e=>{i||o&&o({isValid:e.reduce(((e,{isValid:t})=>e&&t),!0),value:e.map((({value:e})=>e))})}),[i,o]);return(0,a.jsxs)("div",{className:"ui--Params-Tuple",children:[(0,a.jsx)(M,{className:t,label:r,withLabel:u}),(0,a.jsx)(g.ZP,{isDisabled:i,onChange:p,overrides:l,params:m,registry:c,values:h})]})}));function Fe([{name:e,type:t}],n){return{name:`${n}: ${e||t.type}`,type:t}}function ze(e,t,n){if(t.length===n)return t;const a=[];for(let t=0;t<n;t++)a.push(Fe(e,t));return a}function Ze({value:e}){return e instanceof Set&&(e=[...e.values()]),Array.isArray(e)?e.map((e=>(0,o.o)(e)||(0,o.o)(e.isValid)?{isValid:!(0,o.o)(e),value:e}:e)):[]}const Re=s.memo((function({className:e="",defaultValue:t,isDisabled:n=!1,label:i,onChange:r,overrides:l,registry:c,type:u,withLabel:m}){const{t:h}=(0,D.$)(),p=F(c,u),[f,b]=(0,s.useState)((()=>Ze(t))),[x,v]=(0,s.useState)((()=>f.length)),[A,w]=(0,s.useState)((()=>ze(p,[],x)));(0,s.useEffect)((()=>{p.length&&w((e=>ze(p,e,n?f.length:x)))}),[x,f,n,p]),(0,s.useEffect)((()=>{!n&&p.length&&b((e=>{if(e.length===x)return e;for(;e.length<x;){const t=(0,V.Z)(c,p[0].type);e.push({isValid:!(0,o.o)(t),value:t})}return e.slice(0,x)}))}),[x,t,p,n,c]),(0,s.useEffect)((()=>{r&&r({isValid:f.reduce(((e,{isValid:t})=>e&&t),!0),value:f.map((({value:e})=>e))})}),[f,r]);const y=(0,s.useCallback)((()=>v((e=>e+1))),[]),k=(0,s.useCallback)((()=>v((e=>e-1))),[]);return(0,a.jsxs)(M,{className:e,isOuter:!0,label:i,withLabel:m,children:[!n&&(0,a.jsxs)("div",{className:"ui--Param-Vector-buttons",children:[(0,a.jsx)(d.zx,{icon:"plus",label:h("Add item"),onClick:y}),(0,a.jsx)(d.zx,{icon:"minus",isDisabled:0===f.length,label:h("Remove item"),onClick:k})]}),(0,a.jsx)(g.ZP,{isDisabled:n,onChange:b,overrides:l,params:A,registry:c,values:f})]})}));var $e=n(65581);const qe=s.memo((function({className:e="",defaultValue:t,isDisabled:n=!1,label:i,onChange:r,overrides:l,registry:c,type:d,withLabel:u}){const m=F(c,d),[h]=(0,s.useState)((()=>ze(m,[],m[0].length||1))),[p,f]=(0,s.useState)((()=>function(e){return e.value instanceof $e.$?e.value.map((e=>({isValid:!0,value:e}))):Ze(e)}(t)));return(0,s.useEffect)((()=>{!n&&m.length&&f((e=>{const t=m[0].length||1;if(e.length===t)return e;for(;e.length<t;){const t=(0,V.Z)(c,m[0].type);e.push({isValid:!(0,o.o)(t),value:t})}return e.slice(0,t)}))}),[m,n,c]),(0,s.useEffect)((()=>{r&&r({isValid:p.reduce(((e,{isValid:t})=>e&&t),!0),value:p.map((({value:e})=>e))})}),[p,r]),(0,a.jsx)(M,{className:e,isOuter:!0,label:i,withLabel:u,children:(0,a.jsx)(g.ZP,{isDisabled:n,onChange:f,overrides:l,params:h,registry:c,values:p})})}));var He=n(70447),Ue=n(65968);const We={aye:!0,conviction:0},Oe=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,onChange:r,withLabel:o}){const{t:l}=(0,D.$)(),[u,h]=(0,s.useState)(We);(0,s.useEffect)((()=>{r&&r({isValid:!0,value:u})}),[r,u]);const p=(0,s.useCallback)((e=>h((({conviction:t})=>({aye:e,conviction:t})))),[]),g=(0,s.useCallback)((e=>h((({aye:t})=>({aye:t,conviction:e})))),[]),f=(0,s.useRef)([{text:l("Nay"),value:!1},{text:l("Aye"),value:!0}]),b=(0,s.useRef)([{text:l("None"),value:0},{text:l("Locked1x"),value:1},{text:l("Locked2x"),value:2},{text:l("Locked3x"),value:3},{text:l("Locked4x"),value:4},{text:l("Locked5x"),value:5},{text:l("Locked6x"),value:6}]),x=(0,c.H)(t)?!!(128&t.toNumber()):(0,Ue.h)(t)?!!(128&t):t instanceof He.P?t.isAye:!!t,v=t instanceof He.P?t.conviction.index:0;return(0,a.jsxs)(m.Z,{className:e,children:[(0,a.jsx)(d.Lt,{className:"full",defaultValue:x,isDisabled:n,isError:i,label:l("aye: bool"),onChange:p,options:f.current,withLabel:o}),(0,a.jsx)(d.Lt,{className:"full",defaultValue:v,isDisabled:n,isError:i,label:l("conviction: Conviction"),onChange:g,options:b.current,withLabel:o})]})}));var Qe=n(33661);const Ge=[{text:"Super majority approval",value:0},{text:"Super majority rejection",value:1},{text:"Simple majority",value:2}];Ge.reduce(((e,{text:t,value:n})=>(e[n]=t,e)),{});const Je=s.memo((function({className:e="",defaultValue:{value:t},isDisabled:n,isError:i,label:r,onChange:o,withLabel:l}){const c=(0,s.useCallback)((e=>o&&o({isValid:!0,value:e})),[o]),u=(0,s.useMemo)((()=>(0,Qe.m)(t.toNumber)?t.toNumber():(0,w.G)(t).toNumber()),[t]);return(0,a.jsx)(m.Z,{className:e,children:(0,a.jsx)(d.Lt,{className:"full",defaultValue:u,isDisabled:n,isError:i,label:r,onChange:c,options:Ge,withLabel:l})})})),Ke=["AccountId","AccountId20","AccountId32","AccountIndex","Address","Balance","BalanceOf","Vec<KeyValue>"],Ye=["DispatchError","SpRuntimeDispatchError"],Xe=[{c:v,t:["AccountId","Address","LookupSource","MultiAddress"]},{c:y,t:["AccountIndex","i8","i16","i32","i64","i128","u8","u16","u32","u64","u128","u256"]},{c:k.Z,t:["Amount","Balance","BalanceOf"]},{c:L,t:["bool"]},{c:ee,t:["Bytes","Vec<u8>"]},{c:re,t:["Call","Proposal","RuntimeCall"]},{c:de,t:["PalletAllianceCid"]},{c:me,t:["Code"]},{c:he,t:Ye},{c:pe,t:["DispatchResult","Result<Null, SpRuntimeDispatchError>"]},{c:Pe,t:["Raw","RuntimeSessionKeys","Keys"]},{c:b,t:["Enum"]},{c:fe,t:["Hash","H256"]},{c:ge,t:["H160"]},{c:be,t:["H512"]},{c:Ae,t:["KeyValue"]},{c:ke,t:["Vec<KeyValue>"]},{c:je,t:["Moment","MomentOf"]},{c:Ne,t:["Null"]},{c:Ce,t:["OpaqueCall"]},{c:Le,t:["Option"]},{c:Te,t:["String","Text"]},{c:ce,t:["Struct"]},{c:Me,t:["Tuple"]},{c:R,t:["BTreeMap"]},{c:Re,t:["Vec","BTreeSet"]},{c:qe,t:["VecFixed"]},{c:Oe,t:["Vote"]},{c:Je,t:["VoteThreshold"]},{c:ie,t:["Unknown"]}].reduce(((e,{c:t,t:n})=>(n.forEach((n=>{e[n]=t})),e)),{}),_e=[];function et({displayName:e,info:t,lookupName:n,sub:a,type:s}){if(e&&Ke.includes(e))return e;if(s.endsWith("RuntimeSessionKeys"))return"RuntimeSessionKeys";const i=n||s;switch(t){case l.u.Compact:return a.type;case l.u.Option:return"Option";case l.u.Enum:return"Enum";case l.u.Result:{const[,e]=a;return Ye.includes(e.lookupName||e.type)?"DispatchResult":i}case l.u.Struct:return"Struct";case l.u.BTreeSet:return"BTreeSet";case l.u.BTreeMap:return"BTreeMap";case l.u.Tuple:return Xe[s]===v?s:"Tuple";case l.u.Vec:return"Vec<u8>"===s?"Bytes":["Vec<KeyValue>"].includes(s)?"Vec<KeyValue>":"Vec";case l.u.VecFixed:return"u8"===a.type?s:"VecFixed";default:return i}}const tt=s.memo((function({className:e="",defaultValue:t,isDisabled:n,isError:d,isOptional:u,name:m,onChange:h,onEnter:p,onEscape:g,overrides:f,registry:b,type:x,withLength:v=!0}){const A=(0,s.useMemo)((()=>function(e,t,n={}){if(["AccountId20","AccountId32"].includes(t.type)){const n=`AccountId${e.createType("AccountId").length}`;if(t.type!==n)return"AccountId20"===t.type?S:I}const a=e=>e?n[e]||Xe[e]:null,s=et(t);let r=a(t.lookupName)||a(t.type)||a(s);if(!r){try{const t=e.createType(s),n=(0,i.s)(t.toRawType());if(r=a(n.lookupName||n.type)||a(et(n)),r)return r;if((0,c.H)(t))return y}catch(e){console.error(`params: findComponent: ${e.message}`)}_e.includes(s)||(_e.push(s),console.info(`params: findComponent: No pre-defined component for type ${s} from ${l.u[t.info]}: ${JSON.stringify(t)}`))}return r||ie}(b,x,f)),[b,x,f]),w=(0,s.useMemo)((()=>{const e=(0,r.RH)(b,b.isLookupType(x.lookupName||x.type)?(0,i.s)(b.createType(x.type).toRawType()):x).replace(/"/g,"").replace(/\\/g,"").replace(/:Null/g,"").replace(/:/g,": ").replace(/,/g,", ").replace(/^{_alias: {.*}, /,"{");return`${(0,o.o)(m)?"":`${m}: `}${e}${x.typeName&&!e.includes(x.typeName)?` (${x.typeName})`:""}`}),[m,b,x]);return A?u?(0,a.jsx)(se,{defaultValue:t,isOptional:!0,label:"None"}):(0,a.jsx)(A,{className:`${e} ui--Param`,defaultValue:t,isDisabled:n,isError:d,label:w,name:m,onChange:h,onEnter:p,onEscape:g,overrides:f,registry:b,type:x,withLength:v},`${m||"unknown"}:${w}`):null})),nt=s.memo((function({defaultValue:e,index:t,isDisabled:n,isError:i,name:r,onChange:o,onEnter:l,onEscape:c,overrides:d,registry:u,type:m,withLength:h=!0}){const p=(0,s.useCallback)((e=>o(t,e)),[t,o]);return(0,a.jsx)("div",{className:"ui--Param-composite",children:(0,a.jsx)(tt,{defaultValue:e,isDisabled:n,isError:i,name:r,onChange:p,onEnter:l,onEscape:c,overrides:d,registry:u,type:m,withLength:h},`input:${t}`)})}))},89176:(e,t,n)=>{n.d(t,{ZP:()=>h});var a=n(52322),s=n(2784),i=n(95267),r=n(37100),o=n(11147),l=n(37245),c=n(44605),d=n(37750),u=n(68202);class m extends s.PureComponent{state={params:null};static getDerivedStateFromProps({isDisabled:e,params:t=[],registry:n=i.statics.api.registry,values:a},s){return e||(0,o.P)(s.params)===(0,o.P)(t)?null:{params:t,values:t.reduce(((e,t,s)=>(e.push(a?.[s]?a[s]:(0,u.y)(n,t)),e)),[])}}componentDidMount(){this.componentDidUpdate(null,{})}componentDidUpdate(e,t){const{isDisabled:n}=this.props,{values:a}=this.state;n||(0,o.P)(t.values)===(0,o.P)(a)||this.triggerUpdate()}render(){const{children:e,className:t="",isDisabled:n,isError:s,onEnter:d,onEscape:u,overrides:m,params:h,registry:p=i.statics.api.registry,withBorder:g=!0,withExpander:f,withLength:b=!0}=this.props,{values:x=this.props.values}=this.state;return x?.length?(0,a.jsx)(l.Z,{className:t,withBorder:g,withExpander:f,children:(0,a.jsx)(r.SV,{onError:this.onRenderError,children:(0,a.jsxs)("div",{className:"ui--Params-Content",children:[x&&h?.map((({name:e,type:t},i)=>(0,a.jsx)(c.Z,{defaultValue:x[i],index:i,isDisabled:n,isError:s,name:e,onChange:this.onChangeParam,onEnter:d,onEscape:u,overrides:m,registry:p,type:t,withLength:b},`${e||""}:${t.type.toString()}:${i}:${n?(0,o.P)(x[i]):""}`))),e]})})}):null}onChangeParam=(e,t)=>{const{isDisabled:n}=this.props;if(n)return;const{isValid:a=!1,value:s}=t;this.setState((t=>({values:(t.values||[]).map(((t,n)=>n!==e?t:{isValid:a,value:s}))})),this.triggerUpdate)};triggerUpdate=()=>{const{isDisabled:e,onChange:t}=this.props,{values:n}=this.state;!e&&n&&t&&t(n)};onRenderError=()=>{const{onError:e}=this.props;e&&e()}}const h=(0,d.Z)(m)},30590:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(6046),s=n(23601),i=n(95292),r=n(6485);const o=[];function l(e,t){if(t.info===s.u.Vec)return[l(e,t.sub)];if(t.info===s.u.Tuple)return Array.isArray(t.sub)?t.sub.map((t=>l(e,t))):[];if(t.info===s.u.Struct)return Array.isArray(t.sub)?t.sub.reduce(((t,n)=>(t[n.name||"unknown"]=l(e,n),t)),{}):{};if(t.info===s.u.Enum)return Array.isArray(t.sub)?{[t.sub[0].name||"unknown"]:l(e,t.sub[0])}:{};const n=[s.u.Compact,s.u.Option].includes(t.info)?t.sub.type:t.type;switch(n){case"AccountIndex":case"Balance":case"BalanceOf":case"BlockNumber":case"Compact":case"Gas":case"Index":case"Nonce":case"ParaId":case"PropIndex":case"ProposalIndex":case"ReferendumIndex":case"i8":case"i16":case"i32":case"i64":case"i128":case"u8":case"u16":case"u32":case"u64":case"u128":case"VoteIndex":case"Moment":return i.nw;case"bool":return!1;case"Bytes":case"AccountId":case"AccountId20":case"AccountId32":case"AccountIdOf":case"Address":case"Call":case"CandidateReceipt":case"Digest":case"Header":case"KeyValue":case"LookupSource":case"MisbehaviorReport":case"Proposal":case"RuntimeCall":case"Signature":case"SessionKey":case"StorageKey":case"ValidatorId":return;case"String":case"Text":case"Raw":case"Keys":return"";case"Vote":return-1;case"VoteThreshold":return 0;case"BlockHash":case"CodeHash":case"Hash":case"H256":return e.createType("H256");case"H512":return e.createType("H512");case"H160":return e.createType("H160");case"Extrinsic":return e.createType("Raw");case"Null":return null;default:{let c=null;try{const t=e.createType(n),o=(0,a.s)(t.toRawType());if((0,r.H)(t))return i.nw;if([s.u.Struct].includes(o.info))return;if([s.u.Enum,s.u.Tuple].includes(o.info))return l(e,o)}catch(e){c=e.message}return o.includes(n)||(o.push(n),c&&console.error(`params: initValue: ${c}`),console.info(`params: initValue: No default value for type ${n} from ${JSON.stringify(t)}, using defaults`)),"0x"}}}},48653:(e,t,n)=>{n.d(t,{_o:()=>i,fQ:()=>r,fr:()=>o,xS:()=>s});var a=n(40943);const s=["auctions.bid","balances.forceTransfer","balances.forceUnreserve","balances.setBalance","balances.transfer","balances.transferAllowDeath","balances.transferKeepAlive","bounties.proposeBounty","bounties.proposeCurator","childBounties.addChildBounty","childBounties.proposeCurator","claims.mintClaim","convictionVoting.delegate","convictionVoting.vote","crowdloan.contribute","crowdloan.create","crowdloan.edit","democracy.delegate","democracy.propose","democracy.vote","identity.requestJudgement","identity.setFee","nominationPools.bondExtra","nominationPools.create","nominationPools.createWithPoolId","nominationPools.join","nominationPools.unbond","phragmenElection.vote","society.bid","society.vouch","staking.bond","staking.bondExtra","staking.rebond","staking.unbond","tips.tip","tips.tipNew","treasury.proposeSpend","treasury.spend","vesting.forceVestedTransfer","vesting.vestedTransfer"],i=["auctions.BidAccepted","auctions.ReserveConfiscated","auctions.Reserved","auctions.Unreserved","balances.Deposit","balances.DustLost","balances.Endowed","balances.Transfer","balances.Unreserved","balances.Withdraw","bounties.BountyClaimed","bounties.BountyRejected","claims.Claimed","convictionVoting.Voted","crowdloan.Contributed","crowdloan.Withdrew","democracy.Voted","nominationPools.Bonded","nominationPools.PaidOut","nominationPools.PoolSlashed","nominationPools.Unbonded","nominationPools.UnbondingPoolSlashed","referenda.DecisionDepositPlaced","referenda.DecisionDepositRefunded","referenda.DepositSlashed","referenda.SubmissionDepositRefunded","staking.Bonded","staking.Rewarded","staking.Unbonded","staking.Withdrawn","transactionPayment.TransactionFeePaid","treasury.Deposit"],r={"Compact<u128>":a.Z,u128:a.Z},o=r},37750:(e,t,n)=>{n.d(t,{$:()=>s,Z:()=>i});var a=n(61349);function s(){return(0,a.$G)("react-params")}function i(e){return(0,a.Zh)(["react-params"])(e)}},67292:(e,t,n)=>{n.d(t,{c:()=>r,h:()=>i});var a=n(33990),s=n(55858);function i(e){try{const{code:t,multihash:{code:n,digest:i},version:r}=a.k0.parse(e);return{codec:t,hash:{code:n,digest:(0,s.c)(i)},version:r}}catch(t){return console.error(`fromIpfsCid: ${t.message}::`,e),null}}function r(e){try{const{codec:t,hash_:{code:n,digest:s},version:i}=e,r=s.toU8a(!0),o=a.PP.encodingLength(n.toNumber()),l=a.PP.encodingLength(r.length),c=new Uint8Array(o+l+r.length);return a.PP.encodeTo(n.toNumber(),c,0),a.PP.encodeTo(r.length,c,o),c.set(r,o+l),a.k0.create(i.index,t.toNumber(),a.uR.decode(c)).toString()}catch(t){return console.error(`toIpfsCid: ${t.message}::`,e.toHuman()),null}}},83488:(e,t,n)=>{n.d(t,{Z:()=>g,k:()=>p});var a=n(52322),s=(n(2784),n(37100)),i=n(49754),r=n(37602),o=n(33661),l=n(11147),c=n(17751),d=n(1346),u=n(55858);function m({className:e="",key:t},...n){return{cName:`${e} ui--Param-text`,key:t,values:n}}function h(e){return(0,o.m)(e.toHuman)?e.toHuman():Array.isArray(e)?e.map((e=>h(e))):e.toString()}function p(e){return(0,l.P)(e,2).replace(/,\n/g,"\n").replace(/"/g,"").replace(/\\/g,"").replace(/\],\[/g,"],\n[")}function g(e,t){if((0,c.F)(t)||(0,d.o)(t)){const{cName:e,key:t,values:n}=m({},"<unknown>");return(0,a.jsx)("div",{className:e,children:n},t)}const n=["Bytes","Raw","Option<Keys>","Keys"].includes(e)&&(0,o.m)(t.toU8a)?(0,u.c)(t.toU8a(!0)):"Vec<(ValidatorId,Keys)>"===e?p((l=t,JSON.stringify(l.map((([e,t])=>[e.toString(),t.toHex()]))))):t instanceof i.N?t.isEmpty?"<empty>":t.toString():t instanceof r.W&&t.isNone?"<none>":p(h(t));var l;const{cName:g,key:f,values:b}=m({},n);return(0,a.jsxs)("div",{className:g,children:[b,(0,a.jsx)(s.qi,{value:n})]},f)}},68202:(e,t,n)=>{n.d(t,{y:()=>i});var a=n(1346),s=n(30590);function i(e,t){const n=(0,s.Z)(e,t.type);return{isValid:!(0,a.o)(n),value:n}}},67609:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n,params:s}){const{api:l}=(0,i.h)(),c=(0,r.W7)(l.derive.balances?.all,[s]);return(0,a.jsx)(o.Z,{className:t,label:n,value:c?.transferable||c?.availableBalance,children:e})}))},36609:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n,params:s}){const{api:l}=(0,i.h)(),c=(0,r.W7)(l.derive.balances?.all,[s]);return(0,a.jsx)(o.Z,{className:t,label:n,value:c?.freeBalance,children:e})}))},26839:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(14681);const l=s.memo((function({children:e,className:t="",label:n}){const{api:s}=(0,i.h)(),l=(0,r.W7)(s.derive.chain.bestNumberFinalized);return(0,a.jsxs)("div",{className:`${t} ${l?"":"--tmp"}`,children:[n||"",(0,a.jsx)("span",{className:"--digits",children:(0,o.u)(l||1234)}),e]})}))},95689:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(14681);const l=s.memo((function({children:e,className:t="",isFinalized:n,label:s,withPound:l}){const{api:c,isApiReady:d}=(0,i.h)(),u=(0,r.W7)(d&&(n?c.derive.chain.bestNumberFinalized:c.derive.chain.bestNumber));return(0,a.jsxs)("div",{className:`${t} ${u?"":"--tmp"}`,children:[s||"",l&&"#",(0,a.jsx)("span",{className:"--digits",children:(0,o.u)(u||1234)}),e]})}))},65874:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(21779),r=n(97794);const o=i.z.div`
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
`,h=s.memo((function({children:e,className:t="",value:n}){const[i,r]=(0,s.useState)(l);return(0,s.useEffect)((()=>{const e=c++;return o.set(e,r),()=>{o.delete(e)}}),[]),(0,a.jsxs)(m,{className:`${t} ui--Elapsed --digits`,children:[u(i,n),e]})}))},58607:(e,t,n)=>{n.d(t,{Z:()=>p});var a=n(52322),s=n(2784),i=n(21779),r=n(90778),o=n(92730),l=n(54371),c=n(68256);function d(e,t,n,s="",i=!1,r){return r?(0,a.jsxs)(a.Fragment,{children:[`${e}${i?"":"."}`,!i&&(0,a.jsx)("span",{className:"ui--FormatBalance-postfix",children:`${t||""}`.slice(-4)}),(0,a.jsxs)("span",{className:"ui--FormatBalance-unit",children:[" ",r]}),s]}):(0,a.jsxs)(a.Fragment,{children:[`${e}${i?"":"."}`,!i&&(0,a.jsx)("span",{className:"ui--FormatBalance-postfix",children:`0000${t||""}`.slice(-4)}),(0,a.jsxs)("span",{className:"ui--FormatBalance-unit",children:[" ",n]}),s]})}function u(e,t,n){const[a,s]=e.split("."),[i,r]=s.split(" ");return d(a,i,r,t,n)}function m(e,[t,n],s=!0,i,r,l,c){const[u,m,h]=(0,o.a)(e,{decimals:t,forceUnit:"-",withSi:!1}).split("."),p=r||i&&u.length>=4,g=s?n:"";if(u.length>7){const[n,s]=(0,o.a)(e,{decimals:t,withUnit:!1}).split("."),i=s.substring(0,4),r=s.substring(4);return(0,a.jsxs)(a.Fragment,{children:[n,".",(0,a.jsx)("span",{className:"ui--FormatBalance-postfix",children:i}),(0,a.jsxs)("span",{className:"ui--FormatBalance-unit",children:[r,r?g:` ${g}`]}),l||""]})}return c?d(u,m,g,l,p,h):d(u,m,g,l,p)}const h=i.z.span`
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
`,p=s.memo((function({children:e,className:t="",format:n,formatIndex:i,isShort:o,label:d,labelPost:p,useTicker:g,value:f,valueFormatted:b,withCurrency:x,withSi:v}){const{t:A}=(0,c.$)(),{api:w}=(0,r.h)(),y=(0,s.useMemo)((()=>n||function(e,t=0){const n=e.chainDecimals,a=e.chainTokens;return[t<n.length?n[t]:n[0],t<a.length?a[t]:a[1]]}(w.registry,i)),[w,n,i]);return(0,a.jsxs)(h,{className:`${t} ui--FormatBalance`,children:[d?(0,a.jsxs)(a.Fragment,{children:[d," "]}):"",(0,a.jsx)("span",{className:"ui--FormatBalance-value --digits","data-testid":"balance-summary",children:b?u(b,p,o):f?"all"===f?(0,a.jsxs)(a.Fragment,{children:[A("everything"),p||""]}):m(f,y,x,v,o,p,g):(0,l.H)(p)?`-${p.toString()}`:p}),e]})}))},39082:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(52322),s=n(2784),i=n(90778);const r=s.memo((function({children:e,className:t="",label:n}){const{systemName:s}=(0,i.h)();return(0,a.jsxs)("div",{className:t,children:[n||"",s,e]})}))},52727:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(52322),s=n(2784),i=n(90778);const r=s.memo((function({children:e,className:t="",label:n}){const{systemVersion:s}=(0,i.h)(),r=s.split("-")[0];return(0,a.jsxs)("div",{className:t,children:[n||"",r,e]})}))},99924:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(95292),l=n(65874);const c=s.memo((function({children:e,className:t,isInline:n,label:c,value:d}){const{api:u}=(0,i.h)(),m=(0,r.W7)(u.derive.session.progress),h=(0,s.useMemo)((()=>m&&d&&m.currentIndex.lt(d)?d.sub(m.currentIndex).imul(m.sessionLength).isub(m.sessionProgress):o.nw),[m,d]);return(0,a.jsx)(l.Z,{className:t,isInline:n,label:c,value:h,children:e})}))},67634:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(53598);const l=s.memo((function({children:e,className:t="",label:n,value:l}){const{api:c}=(0,i.h)(),d=(0,r.W7)(!l&&c.query.timestamp?.now),[u,m]=(0,s.useMemo)((()=>[l||d,!(!l&&!d)]),[d,l]);return(0,a.jsxs)("div",{className:`${t} ${m?"":"--tmp"}`,children:[n||"",(0,a.jsx)(o.Z,{value:m?u:Date.now()}),e]})}))},96916:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n}){const{api:s}=(0,i.h)(),l=(0,r.W7)(s.query.balances?.inactiveIssuance);return(0,a.jsxs)("div",{className:t,children:[n||"",(0,a.jsx)(o.Z,{className:l?"":"--tmp",value:l||1,withSi:!0}),e]})}))},79608:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(52322),s=n(2784),i=n(90778),r=n(9118),o=n(58607);const l=s.memo((function({children:e,className:t="",label:n}){const{api:s}=(0,i.h)(),l=(0,r.W7)(s.query.balances?.totalIssuance);return(0,a.jsxs)("div",{className:t,children:[n||"",(0,a.jsx)(o.Z,{className:l?"":"--tmp",value:l||1,withSi:!0}),e]})}))},68256:(e,t,n)=>{n.d(t,{$:()=>s});var a=n(61349);function s(){return(0,a.$G)("react-query")}},4984:(e,t,n)=>{n.d(t,{ZP:()=>xe});var a=n(52322),s=n(2784),i=n(37100),r=n(90778),o=n(86135),l=n(48731),c=n(33661),d=n(4615),u=n(61349);function m(){return(0,u.$G)("react-signer")}var h=n(345),p=n(45479),g=n(38894),f=n(69187),b=n(16039),x=n(17965),v=n(29659),A=n(55858),w=n(33403),y=n(78628),k=n(48834).Buffer;let j=0;class N{#a;#s;#i;#n;#r;constructor(e,t,n,a){this.#a=n,this.#s=a,this.#i=t,this.#n=e.registry,this.#r=e}async getMetadataProof(e){const t=await this.#r.call.metadata.metadataAtVersion(15),{specName:n,specVersion:a}=this.#r.runtimeVersion,s=(0,y.X)(t.toHex(),{base58Prefix:this.#r.consts.system.ss58Prefix.toNumber(),decimals:this.#r.registry.chainDecimals[0],specName:n.toString(),specVersion:a.toNumber(),tokenSymbol:this.#r.registry.chainTokens[0]}),i=(0,A.c)(s.digest()),r=(0,w.Z)({},e,{metadataHash:i,mode:1}),o=this.#n.createType("ExtrinsicPayload",r);return{raw:o,txMetadata:s.getProofForExtrinsicPayload((0,A.c)(o.toU8a(!0)))}}async signPayload(e){const t=b.X.get().ledgerApp;if("migration"===t||"generic"===t){const{address:t}=await this.#i().getAddress(this.#r.consts.system.ss58Prefix.toNumber(),!1,this.#a,this.#s),{raw:n,txMetadata:a}=await this.getMetadataProof(e),s=k.from(a),{signature:i}=await this.#i().signWithMetadata(n.toU8a(!0),this.#a,this.#s,{metadata:s}),r=this.#n.createType("Extrinsic",{method:n.method},{version:4});return r.addSignature(t,i,n.toHex()),{id:++j,signature:i,signedTransaction:r.toHex()}}{const t=this.#n.createType("ExtrinsicPayload",e,{version:e.version}),{signature:n}=await this.#i().sign(t.toU8a(!0),this.#a,this.#s);return{id:++j,signature:n}}}}const C=()=>{},E={accountOffset:0,addressOffset:0,isHardware:!1,isLocal:!1,isMultisig:!1,isProxied:!1,isQr:!1,isUnlockable:!1,threshold:0,who:[]},S={};function I(e){if(!e)return E;let t;try{t=f.Nn.decodeAddress(e)}catch(e){return console.error(e),E}const n=f.Nn.getPair(t),{isExternal:a,isHardware:s,isInjected:i,isLocal:r,isMultisig:o,isProxied:l}=n.meta,c=!a&&!s&&!i;if(c){const e=S[n.address];e&&Date.now()>e&&!n.isLocked&&(n.lock(),S[n.address]=0)}return{accountOffset:n.meta.accountOffset||0,addressOffset:n.meta.addressOffset||0,hardwareType:n.meta.hardwareType,isHardware:!!s,isLocal:!!r,isMultisig:!!o,isProxied:!!l,isQr:!(!a||o||l||s||i||r),isUnlockable:c&&n.isLocked,threshold:n.meta.threshold||0,who:(n.meta.who||[]).map(B)}}function B(e){return f.Nn.encodeAddress(f.Nn.decodeAddress(e))}function D(e,t,{id:n,txFailedCb:a=C,txSuccessCb:s=C,txUpdateCb:i=C},r){return o=>{if(!o?.status)return;const l=o.status.type.toLowerCase();console.log(`${e}: status :: ${JSON.stringify(o)}`),t(n,l,o),i(o),o.status.isFinalized||o.status.isInBlock?o.events.filter((({event:{section:e}})=>"system"===e)).forEach((({event:{method:e}})=>{"ExtrinsicFailed"===e?a(o):"ExtrinsicSuccess"===e&&s(o)})):o.isError&&a(o),o.isCompleted&&r()}}let L=0;class P{#o;#n;constructor(e,t){this.#o=t,this.#n=e}async signPayload(e){return new Promise((t=>{const n=this.#n.createType("ExtrinsicPayload",e,{version:e.version}).sign(this.#o);var a;a=this.#o,Date.now()>(S[a.address]||0)&&!a.isLocked&&a.lock(),t((0,w.Z)({id:++L},n))}))}}var T=n(18608);class V{#n;#l;constructor(e,t){this.#n=e,this.#l=t}async signPayload(e){return new Promise(((t,n)=>{const a=e.method.length>5e3,s=this.#n.createType("ExtrinsicPayload",e,{version:e.version}),i=a?(0,T.b)(s.toU8a(!0)):s.toU8a();this.#l({isQrHashed:a,qrAddress:e.address,qrPayload:i,qrReject:n,qrResolve:t})}))}}var M=n(34814),F=n(74065),z=n(95292);const Z=(0,i.zo)(i.u_.Columns)`
  .errorLabel {
    margin-right: 1rem;
    color: #9f3a38 !important;
  }

  .ui--Toggle {
    bottom: 1.1rem;
  }
`,R=s.memo((function({address:e,className:t,error:n,onChange:r,onEnter:o,tabIndex:l}){const{t:c}=m(),[d,u]=(0,s.useState)(""),[h,p]=(0,s.useState)(!1),g=(0,s.useMemo)((()=>function(e){try{return f.Nn.getPair(e)}catch{return null}}(e)),[e]);return(0,s.useEffect)((()=>{r(d,h)}),[r,h,d]),g&&g.isLocked&&!g.meta.isInjected?(0,a.jsx)(Z,{className:t,hint:c("Unlock the sending account to allow signing of this transaction."),children:(0,a.jsx)(i.ro,{autoFocus:!0,isError:!!n,label:c("unlock account with password"),labelExtra:(0,a.jsx)(i.ZD,{label:c("unlock for {{expiry}} min",{replace:{expiry:15}}),onChange:p,value:h}),onChange:u,onEnter:o,tabIndex:l,value:d})}):null})),$=!0;function q(e){try{const{method:t,section:n}=e.registry.findMetaCall(e.callIndex);return{method:t,section:n}}catch{return{method:"unknown",section:"unknown"}}}function H(e,t,n){const{method:a,section:s}=q(t),i=(t,a)=>!a.some((a=>!H(e,a,n).includes(t))),r=e=>"utility"===s&&(["batch","batchAll"].includes(a)&&i(e,t.args[0])||["asLimitedSub"].includes(a)&&i(e,[t.args[0]]));return n.filter((([n,i,o])=>{if(!e.includes(n)||!i.isZero())return!1;if($)return!0;switch(o.toString()){case"Any":default:return!0;case"Governance":return r(n)||["convictionVoting","council","councilCollective","democracy","elections","electionsPhragmen","fellowshipCollective","fellowshipReferenda","phragmenElection","poll","referenda","society","technicalCommittee","tips","treasury","whitelist"].includes(s);case"IdentityJudgement":return r(n)||"identity"===s&&"provideJudgement"===a;case"NonTransfer":return!("balances"===s||"indices"===s&&"transfer"===a||"vesting"===s&&"vestedTransfer"===a);case"Staking":return r(n)||["fastUnstake","staking"].includes(s);case"SudoBalances":return r(n)||"sudo"===s&&"sudo"===a&&"balances"===q(t.args[0]).section}})).map((([e])=>e))}async function U(e,t,n,a){if((0,c.m)(e.query.proxy?.proxies)){const{isProxied:s}=I(n),[i]=await e.query.proxy.proxies(n),r=3===e.tx.proxy.addProxy.meta.args.length?i.map((({delay:e,delegate:t,proxyType:n})=>[t.toString(),e,n])):i.map((([e,t])=>[e.toString(),z.nw,t])),o=H(t,a,r);if(o.length)return{address:n,isProxied:s,proxies:r,proxiesFilter:o}}return null}const W=s.memo((function({currentItem:e,onChange:t,onEnter:n,passwordError:o,requestAddress:l}){const{t:d}=m(),{api:u}=(0,r.h)(),{allAccounts:h}=(0,M.x)(),p=(0,F.X)(),[g,f]=(0,s.useState)(null),[b,x]=(0,s.useState)(null),[v,A]=(0,s.useState)(!1),[w,y]=(0,s.useState)(!0),[k,j]=(0,s.useState)(null),[N,C]=(0,s.useState)(null),[{isUnlockCached:E,signPassword:S},B]=(0,s.useState)((()=>({isUnlockCached:!1,signPassword:""}))),[D,L]=(0,s.useMemo)((()=>{const e=k&&g||w&&N&&b||l;try{return[e,I(e)]}catch{return[e,{}]}}),[g,b,w,k,N,l]),P=(0,s.useCallback)(((e,t)=>B({isUnlockCached:t,signPassword:e})),[]);return(0,s.useEffect)((()=>{!N&&x(null)}),[N]),(0,s.useEffect)((()=>{C(null),e.extrinsic&&U(u,h,l,e.extrinsic).then((e=>p.current&&C(e))).catch(console.error)}),[h,u,e,p,l]),(0,s.useEffect)((()=>{j(null),e.extrinsic&&I(b||l).isMultisig&&async function(e,t,n,a){const s=e.tx.multisig?"multisig":"utility";if((0,c.m)(e.query[s]?.multisigs)){const i=n||t,{threshold:r,who:o}=I(i),l=(n?e.tx.proxy.proxy(t||"",null,a):a).method.hash,c=(await e.query[s].multisigs(i,l)).unwrapOr(null);return c?{address:i,isMultiCall:c.approvals.length+1>=r,who:o,whoFilter:o.filter((e=>!c.approvals.some((t=>t.eq(e)))))}:{address:i,isMultiCall:!1,who:o,whoFilter:o}}return null}(u,l,b,e.extrinsic).then((e=>{p.current&&(j(e),A(e?.isMultiCall||!1))})).catch(console.error)}),[b,u,e,p,l]),(0,s.useEffect)((()=>{t({isMultiCall:v,isUnlockCached:E,multiRoot:k?k.address:null,proxyRoot:N&&w?N.address:null,signAddress:D,signPassword:S})}),[w,v,E,g,k,t,b,N,D,S]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.u_.Columns,{hint:d("The sending account that will be used to send this transaction. Any applicable fees will be paid by this account."),children:(0,a.jsx)(i.rp,{className:"full",defaultValue:l,isDisabled:!0,isInput:!0,label:d("sending from my account"),withLabel:!0})}),N&&w&&(0,a.jsx)(i.u_.Columns,{hint:d("The proxy is one of the allowed proxies on the account, as set and filtered by the transaction type."),children:(0,a.jsx)(i.rp,{filter:N.proxiesFilter,label:d("proxy account"),onChange:x,type:"account"})}),k&&(0,a.jsx)(i.u_.Columns,{hint:d("The signatory is one of the allowed accounts on the multisig, making a recorded approval for the transaction."),children:(0,a.jsx)(i.rp,{filter:k.whoFilter,label:d("multisig signatory"),onChange:f,type:"account"})}),D&&!e.isUnsigned&&L.isUnlockable&&(0,a.jsx)(R,{address:D,error:o,onChange:P,onEnter:n}),o&&(0,a.jsx)(i.u_.Columns,{children:(0,a.jsx)(i.oy,{content:o})}),N&&(0,a.jsx)(i.u_.Columns,{hint:d("This could either be an approval for the hash or with full call details. The call as last approval triggers execution."),children:(0,a.jsx)(i.ZD,{className:"tipToggle",isDisabled:N.isProxied,label:d(w?"Use a proxy for this call":"Don't use a proxy for this call"),onChange:y,value:w})}),k&&(0,a.jsx)(i.u_.Columns,{hint:d("This could either be an approval for the hash or with full call details. The call as last approval triggers execution."),children:(0,a.jsx)(i.ZD,{className:"tipToggle",label:d(v?"Multisig message with call (for final approval)":"Multisig approval with hash (non-final approval)"),onChange:A,value:v})})]})}));var O=n(74076);const Q=(0,i.zo)(i.P0)`
  .qrDisplay {
    margin: 0 auto;
    max-width: 30rem;

    img {
      border: 1px solid white;
    }
  }
`,G=s.memo((function({address:e,className:t,genesisHash:n,isHashed:r,onSignature:o,payload:l}){const{t:c}=m(),[d,u]=(0,s.useState)(null),h=(0,s.useCallback)((e=>{if((0,O.vq)(e.signature))o(e);else{const t=e.signature;u(c('Non-signature, non-hex data received from QR. Data contains "{{sample}}" instead of a hex-only signature. Please present the correct signature generated from the QR presented for submission.',{replace:{sample:t.length>47?`${t.slice(0,24)}…${t.slice(-22)}`:t}}))}}),[o,c]);return e?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(Q,{className:t,children:[(0,a.jsx)(i.P0.Column,{children:(0,a.jsx)("div",{className:"qrDisplay",children:(0,a.jsx)(i.iH,{address:e,cmd:r?1:2,genesisHash:n,payload:l})})}),(0,a.jsx)(i.P0.Column,{children:(0,a.jsx)("div",{className:"qrDisplay",children:(0,a.jsx)(i.lB,{onScan:h})})})]}),d&&(0,a.jsx)(i.oy,{className:"nomargin",content:d})]}):(0,a.jsx)(i.$j,{label:c("Preparing QR for signing")})}));var J=n(48801),K=n.n(J);const Y=s.memo((function({address:e,onChange:t,signedTx:n}){const{api:o}=(0,r.h)(),[l,c]=(0,s.useState)((()=>new(K())(64))),[d,u]=(0,s.useState)(z.nw),[h,p]=(0,s.useState)(z.nw),{t:g}=m();(0,s.useEffect)((()=>{e&&o.derive.balances.account(e).then((({accountNonce:e})=>{u(e),p(e)})).catch(console.error)}),[e,o]),(0,s.useEffect)((()=>{t({era:l.toNumber(),nonce:d})}),[l,d,t]);const f=(0,s.useCallback)(((e=z.nw)=>c(e)),[]),b=(0,s.useCallback)(((e=z.nw)=>u(e)),[]);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(i.u_.Columns,{hint:g("Override any applicable values for the specific signed output. These will be used to construct and display the signed transaction."),children:[(0,a.jsx)(i.Rn,{isDisabled:!!n,isZeroable:!0,label:g("Nonce"),labelExtra:g("Current account nonce: {{accountNonce}}",{replace:{accountNonce:h}}),onChange:b,value:d}),(0,a.jsx)(i.Rn,{isDisabled:!!n,isZeroable:!0,label:g("Lifetime (# of blocks)"),labelExtra:g("Set to 0 to make transaction immortal"),onChange:f,value:l})]}),!!n&&(0,a.jsx)(i.u_.Columns,{hint:g("The actual fully constructed signed output. This can be used for submission via other channels."),children:(0,a.jsx)(i.r_,{isFull:!0,isTrimmed:!0,label:g("Signed transaction"),value:n,withCopy:!0})})]})})),X=s.memo((function({className:e,onChange:t}){const{t:n}=m(),[r,o]=(0,s.useState)(),[l,c]=(0,s.useState)(!1);return(0,s.useEffect)((()=>{t(l?r:z.nw)}),[t,l,r]),(0,a.jsxs)(i.u_.Columns,{className:e,hint:n("Adding an optional tip to the transaction could allow for higher priority, especially when the chain is busy."),children:[(0,a.jsx)(i.ZD,{className:"tipToggle",label:n(l?"Include an optional tip for faster processing":"Do not include a tip for the block author"),onChange:c,value:l}),l&&(0,a.jsx)(i.H,{isZeroable:!0,label:n("Tip (optional)"),onChange:o})]})}));var _=n(15991),ee=n(9118),te=n(92730);const ne=s.memo((function({accountId:e,className:t="",extrinsic:n,isHeader:o}){const{t:l}=m(),{api:c}=(0,r.h)(),[d,h]=(0,s.useState)(null),p=(0,ee.W7)(c.derive.balances?.all,[e]),g=(0,F.X)();if((0,s.useEffect)((()=>{e&&n&&n.hasPaymentInfo&&(0,x.Y)((async()=>{try{const t=await n.paymentInfo(e);g.current&&h(t)}catch(e){console.error(e)}}))}),[c,e,n,g]),!d||!n)return null;const f=c.consts.balances&&!(c.tx.balances?.transferAllowDeath?.is(n)||c.tx.balances?.transfer?.is(n))&&p?.accountId.eq(e)&&((p.transferable||p.availableBalance).lte(d.partialFee)||p.freeBalance.sub(d.partialFee).lte(c.consts.balances.existentialDeposit));return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.xH,{className:t,isHeader:o,summary:(0,a.jsxs)(u.cC,{i18nKey:"feesForSubmission",children:["Fees of ",(0,a.jsx)("span",{className:"highlight",children:(0,te.a)(d.partialFee,{withSiFull:!0})})," will be applied to the submission"]})}),f&&(0,a.jsx)(i.Pd,{content:l("The account does not have enough free funds (excluding locked/bonded/reserved) available to cover the transaction fees without dropping the balance below the account existential amount.")})]})})),ae=(0,i.zo)(i.u_.Columns)`
  .paymentInfo {
    margin-top: 0.5rem;
  }
`,se=s.memo((function({accountId:e,className:t,currentItem:{extrinsic:n,isUnsigned:s,payload:i},onError:r,tip:o}){const{t:l}=m();return n?(0,a.jsxs)(ae,{className:t,hint:l("The details of the transaction including the type, the description (as available from the chain metadata) as well as any parameters and fee estimations (as available) for the specific type of call."),children:[(0,a.jsx)(_.Z,{isHeader:!0,onError:r,value:n}),!s&&!i&&(0,a.jsx)(ne,{accountId:e,className:"paymentInfo",extrinsic:n,isHeader:!0,tip:o})]}):null})),ie=()=>{},re={innerHash:null,innerTx:null};let oe=0;async function le(e,t,n){const a=await e.query.system.account(n),s={blockHash:e.genesisHash,genesisHash:e.genesisHash,nonce:a.nonce,runtimeVersion:e.runtimeVersion},i=new Uint8Array(64);i.fill(205),i.set([222,173,190,239]),t.signFake(n,s),t.signature.set(i)}async function ce(e,t,{isMultiCall:n,multiRoot:a,proxyRoot:s,signAddress:i}){let r=t.extrinsic;if(s&&(r=e.tx.proxy.proxy(s,null,r)),a){const t=e.tx.multisig?"multisig":"utility",[s,{weight:o}]=await Promise.all([e.query[t].multisigs(a,r.method.hash),r.paymentInfo(a)]);console.log("multisig max weight=",o.toString());const{threshold:l,who:c}=I(a),d=c.filter((e=>e!==i));let u=null;s.isSome&&(u=s.unwrap().when),r=n?5===e.tx[t].asMulti.meta.args.length?e.tx[t].asMulti(l,d,u,r.method.toHex(),o):6===e.tx[t].asMulti.meta.args.length?e.tx[t].asMulti(l,d,u,r.method.toHex(),!1,o):e.tx[t].asMulti(l,d,u,r.method):5===e.tx[t].approveAsMulti.meta.args.length?e.tx[t].approveAsMulti(l,d,u,r.method.hash,o):e.tx[t].approveAsMulti(l,d,u,r.method.hash)}return r}async function de(e,t,n,a,s){const i=f.Nn.getPair(t),{meta:{accountOffset:r,addressOffset:o,isExternal:c,isHardware:d,isInjected:u,isLocal:m,isProxied:p,source:g}}=i;if(d)return["signing",t,{...n,signer:new N(e,a,r||0,o||0)},!1];if(m)return["signing",t,{...n,signer:new P(e.registry,i)},!0];if(c&&!p)return["qr",t,{...n,signer:new V(e.registry,s)},!1];if(u){if(!g)throw new Error(`Unable to find injected source for ${t}`);const e=await(0,h.R0)(g);return(0,l.hu)(e,`Unable to find a signer for ${t}`),["signing",t,{...n,signer:e.signer},!1]}return(0,l.hu)((0,v.Q)(t,i.address),`Unable to retrieve keypair for ${t}`),["signing",t,{...n,signer:new P(e.registry,i)},!1]}function ue(e){try{return I(e)}catch{return{}}}const me=(0,i.zo)(i.u_.Content)`
  .tipToggle {
    width: 100%;
    text-align: right;
  }

  .ui--Checks {
    margin-top: 0.75rem;
  }
`,he=s.memo((function({className:e,currentItem:t,isQueueSubmit:n,queueSize:l,requestAddress:c,setIsQueueSubmit:d}){const{t:u}=m(),{api:h}=(0,r.h)(),{getLedger:v}=(0,p.c)(),{queueSetTxStatus:A}=(0,o.L)(),[w,y]=(0,s.useState)((()=>ue(c))),[k,j]=(0,s.useState)(null),[{isQrHashed:N,qrAddress:C,qrPayload:E,qrResolve:I},B]=(0,s.useState)((()=>({isQrHashed:!1,qrAddress:"",qrPayload:new Uint8Array}))),[L,P]=(0,s.useState)(!1),[T,V]=(0,g.O)(),[M,F]=(0,s.useState)(!0),[z,Z]=(0,s.useState)(null),[R,$]=(0,s.useState)((()=>({isMultiCall:!1,isUnlockCached:!1,multiRoot:null,proxyRoot:null,signAddress:c,signPassword:""}))),[q,H]=(0,s.useState)({}),[U,O]=(0,s.useState)(null),[{innerHash:Q,innerTx:J},K]=(0,s.useState)(re),[_,ee]=(0,s.useState)(),[te]=(0,s.useState)(n);(0,s.useEffect)((()=>{y(ue(R.signAddress)),Z(null)}),[R]),(0,s.useEffect)((()=>{const e=t.extrinsic&&(R.proxyRoot?h.tx.proxy.proxy(R.proxyRoot,null,t.extrinsic):t.extrinsic).method;K(e?{innerHash:e.hash.toHex(),innerTx:R.multiRoot?e.toHex():null}:re)}),[h,t,R]);const ne=(0,s.useCallback)((({signature:e})=>I&&I({id:++oe,signature:e})),[I]),ae=(0,s.useCallback)((async()=>{let e=null;if(R.signAddress)if(w.isUnlockable)e=function({isUnlockCached:e,signAddress:t,signPassword:n}){let a;try{if(!t)throw new Error("Invalid signAddress");a=f.Nn.decodeAddress(t)}catch(e){return console.error(e),"unable to decode address"}const s=f.Nn.getPair(a);try{s.decodePkcs8(n),e&&function(e){S[e.address]=Date.now()+9e5}(s)}catch(e){return console.error(e),e.message}return null}(R);else if(w.isHardware)try{const e=b.X.get().ledgerApp,t=v();if("migration"===e||"generic"===e){const{address:e}=await t.getAddress(h.consts.system.ss58Prefix.toNumber(),!1,w.accountOffset,w.addressOffset);console.log(`Signing with Ledger address ${e}`)}else{const{address:e}=await t.getAddress(!1,w.accountOffset,w.addressOffset);console.log(`Signing with Ledger address ${e}`)}}catch(t){console.error(t);const n=t.message;e=u("Unable to connect to the Ledger, ensure support is enabled in settings and no other app is using it. {{errorMessage}}",{replace:{errorMessage:n}})}return Z(e),!e}),[w,v,R,u,h.consts.system.ss58Prefix]),he=(0,s.useCallback)(((e,t,n)=>{if(n.signAddress&&t.payload){const{id:a,payload:s,signerCb:i=ie}=t,r=f.Nn.getPair(n.signAddress);i(a,{id:a,...h.createType("ExtrinsicPayload",s,{version:s.version}).sign(r)}),e(a,"completed")}}),[h]),pe=(0,s.useCallback)((async(e,t,n)=>{if(n.signAddress){const[a,[s,i,r,o]]=await Promise.all([ce(h,t,n),de(h,n.signAddress,{nonce:-1,tip:_,withSignedTransaction:!0},v,B)]);e(t.id,s),await async function(e,t,n,a,s,i,r){t.txStartCb&&t.txStartCb();try{r?await le(i,n,a):await n.signAsync(a,s),console.info("sending",n.toHex()),e(t.id,"sending");const o=await n.send(D("signAndSend",e,t,(()=>{o()})))}catch(n){console.error("signAndSend: error:",n),e(t.id,"error",{},n),t.txFailedCb&&t.txFailedCb(n)}}(e,t,a,i,r,h,o)}}),[h,v,_]),ge=(0,s.useCallback)((async(e,t,n)=>{if(n.signAddress){const[a,[,s,i,r]]=await Promise.all([ce(h,t,n),de(h,n.signAddress,{...q,tip:_,withSignedTransaction:!0},v,B)]);O(await async function(e,{id:t,txFailedCb:n=ie,txStartCb:a=ie},s,i,r,o,l){a();try{return l?await le(o,s,i):await s.signAsync(i,r),s.toJSON()}catch(a){console.error("signAsync: error:",a),e(t,"error",void 0,a),n(a)}return null}(e,t,a,s,i,h,r))}}),[h,v,q,_]),fe=(0,s.useCallback)((()=>{P(!0),(0,x.Y)((()=>{const e=e=>{console.error(e),P(!1),j(e)};ae().then((n=>{n?M?t.payload?he(A,t,R):pe(A,t,R).catch(e):ge(A,t,R).catch(e):P(!1)})).catch((t=>{e(t)}))}))}),[pe,he,ge,ae,t,M,A,R]),be=(0,s.useMemo)((()=>w.isQr?u("Sign via Qr"):M?w.isLocal?u("Mock Sign and Submit"):u("Sign and Submit"):w.isLocal?u("Mock Sign (no submission)"):u("Sign (no submission)")),[w.isQr,w.isLocal,M,u]),xe=R.signAddress&&l>1&&M&&!(w.isHardware||w.isMultisig||w.isProxied||w.isQr||w.isUnlockable)&&!T;return!L&&xe&&te?(P(!0),setTimeout(fe,1e3),null):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(me,{className:e,children:(0,a.jsx)(i.SV,{error:k,onError:V,children:L&&w.isQr?(0,a.jsx)(G,{address:C,genesisHash:h.genesisHash,isHashed:N,onSignature:ne,payload:E}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(se,{accountId:R.signAddress,currentItem:t,onError:V}),(0,a.jsx)(W,{currentItem:t,onChange:$,onEnter:fe,passwordError:z,requestAddress:c}),!t.payload&&(0,a.jsx)(X,{onChange:ee}),!M&&(0,a.jsx)(Y,{address:R.signAddress,onChange:H,signedTx:U}),M&&!R.isMultiCall&&J&&(0,a.jsx)(i.u_.Columns,{hint:u("The full call data that can be supplied to a final call to multi approvals"),children:(0,a.jsx)(i.r_,{isDisabled:!0,isTrimmed:!0,label:u("multisig call data"),value:J,withCopy:!0})}),M&&Q&&(0,a.jsx)(i.u_.Columns,{hint:u("The call hash as calculated for this transaction"),children:(0,a.jsx)(i.r_,{isDisabled:!0,isTrimmed:!0,label:u("call hash"),value:Q,withCopy:!0})})]})})}),(0,a.jsxs)(i.u_.Actions,{children:[(0,a.jsx)(i.zx,{icon:w.isQr?"qrcode":"sign-in-alt",isBusy:L,isDisabled:!R.signAddress||T,label:be,onClick:fe,tabIndex:2}),(0,a.jsxs)("div",{className:"signToggle",children:[!L&&(0,a.jsx)(i.ZD,{isDisabled:!!t.payload,label:u(M?"Sign and Submit":"Sign (no submission)"),onChange:F,value:M}),xe&&(0,a.jsx)(i.ZD,{label:n?u("Submit {{queueSize}} items",{replace:{queueSize:l}}):u("Submit individual"),onChange:d,value:n})]})]})]})})),pe=s.memo((function({className:e,currentItem:t}){const{t:n}=m(),{queueSetTxStatus:r}=(0,o.L)(),[l,c]=(0,g.O)(),d=(0,s.useCallback)((async()=>{t.extrinsic&&await async function(e,t,n){t.txStartCb&&t.txStartCb();try{const a=await n.send(D("send",e,t,(()=>{a()})))}catch(n){console.error("send: error:",n),e(t.id,"error",{},n),t.txFailedCb&&t.txFailedCb(null)}}(r,t,t.extrinsic)}),[t,r]);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(i.u_.Content,{className:e,children:(0,a.jsx)(i.SV,{onError:c,children:(0,a.jsx)(se,{currentItem:t,onError:c})})}),(0,a.jsx)(i.u_.Actions,{children:(0,a.jsx)(i.zx,{icon:"sign-in-alt",isDisabled:l,label:n("Submit (no signature)"),onClick:d,tabIndex:2})})]})})),ge=()=>{},fe=["queued","qr","signing"];const be=(0,i.zo)(i.u_)`
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
`,xe=s.memo((function({children:e,className:t=""}){const{api:n}=(0,r.h)(),{t:i}=m(),{queueSetTxStatus:u,txqueue:h}=(0,o.L)(),[p,g]=(0,s.useState)(!1),{currentItem:f,isRpc:b,isVisible:x,queueSize:v,requestAddress:A}=(0,s.useMemo)((()=>function(e){const t=e.filter((({status:e})=>fe.includes(e))),n=t[0]||null;let a=!1,s=!1;return n&&("queued"!==n.status||n.extrinsic||n.payload?"signing"!==n.status&&(s=!0):a=!0),{currentItem:n,isRpc:a,isVisible:s,queueSize:t.length,requestAddress:n?.accountId||null}}(h)),[h]);(0,s.useEffect)((()=>{1===v&&g(!1)}),[v]),(0,s.useEffect)((()=>{b&&f&&async function(e,t,{id:n,rpc:a,values:s=[]}){if(a){t(n,"sending");const{error:i,result:r,status:o}=await async function(e,{method:t,section:n},a){try{const s=e.rpc;(0,l.hu)((0,c.m)(s[n]?.[t]),`api.rpc.${n}.${t} does not exist`);const i=await s[n][t](...a);return console.log("submitRpc: result ::",(0,d.a)(i)),{result:i,status:"sent"}}catch(e){return console.error(e),{error:e,status:"error"}}}(e,a,s);t(n,o,r,i)}}(n,u,f).catch(console.error)}),[n,b,f,u]);const w=(0,s.useCallback)((()=>{if(f){const{id:e,signerCb:t=ge,txFailedCb:n=ge}=f;u(e,"cancelled"),t(e,null),n(null)}}),[f,u]);return(0,a.jsxs)(a.Fragment,{children:[e,f&&x&&(0,a.jsx)(be,{className:t,header:(0,a.jsxs)(a.Fragment,{children:[i("Authorize transaction"),1===v?void 0:(0,a.jsxs)(a.Fragment,{children:[" 1/",v]})]}),onClose:w,size:"large",children:f.isUnsigned?(0,a.jsx)(pe,{currentItem:f}):(0,a.jsx)(he,{currentItem:f,isQueueSubmit:p,queueSize:v,requestAddress:A,setIsQueueSubmit:g})},f.id)]})}))}}]);