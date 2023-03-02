(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{51605:(e,n,t)=>{var i={"./ksmcc3.js":[64456,4456],"./polkadot.js":[64358,4358],"./rococo_v2_2.js":[29442,4398],"./westend2.js":[61860,1860]};function r(e){if(!t.o(i,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=i[e],r=n[0];return t.e(n[1]).then((()=>t(r)))}r.keys=()=>Object.keys(i),r.id=51605,e.exports=r},37627:(e,n,t)=>{"use strict";var i=t(85168),r=t(23729),o=t.n(r),s=t(43212),a=t(3679),l=t(16039),c=t(48731);const p=function(){const e=i.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,c.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,c.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,s.Rf)((()=>"")),{ipnsChain:t}=(0,a.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const r=o().get("settings")||{},p=n.find((({value:e})=>!!e));return[r.apiUrl,void 0].includes(l.X.apiUrl)?l.X.apiUrl:p?p.value:"ws://127.0.0.1:9944"}();l.X.set({apiUrl:p}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(p),t(49668);var d=t(2784),u=t(17029),m=t(47933),g=t(82740),h=t(9921),x=t(85584),v=t(48720),f=t(83780),y=t(62463),b=t(58939),k=t(53197),w=t(91295),C=t(14028),j=t(75688),A=t(70681),N=t(92529),S=t(72339),I=t(61349);function Z(){return(0,I.$G)("apps")}var $=t(61397),U=t(7840),z=t(52322);function R({children:e,className:n="",icon:t,type:i}){const[r,o]=(0,U.O)();return r?null:(0,z.jsx)(T,{className:`${n} ${"error"===i?"isError":"isInfo"}`,children:(0,z.jsxs)("div",{className:"content",children:[(0,z.jsx)($.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,z.jsx)("div",{className:"contentItem",children:e}),(0,z.jsx)($.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:o})]})})}const T=$.zo.div`
  background: var(--bg-menu);
  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-left-width: 0.25rem;
  line-height: 1.5em;
  padding: 0 1rem;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  max-width: 42rem;
  width: 42rem;
  z-index: 500;

  &:before {
    border-radius: 0.25rem;
    bottom: 0;
    content: ' ';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  &.isError {
    &:before {
      background: rgba(255, 12, 12, 0.05);
    }

    border-color: rgba(255, 12, 12, 1);
  }

  &.isInfo {
    &:before {
      background: rgba(255, 196, 12, 0.05);
    }

    border-color: rgba(255, 196, 12, 1);
  }

  .content {
    align-items: center;
    display: flex;
    margin: 0 auto;
    max-width: 50rem;
    padding: 1em 3rem 1rem 0.5rem;
    position: relative;

    .contentIcon {
      flex: 0;
    }

    .contentItem {
      flex: 1;
      padding: 0 1rem;

      > div+div {
        margin-top: 0.5rem;
      }
    }
  }

  .closeIcon {
    cursor: pointer;
    position: absolute;
    right: 0em;
    top: 0.75rem;
  }
`,W=d.memo(R),E=l.X.apiType.param,q="json-rpc"===l.X.apiType.type&&"string"==typeof E&&E.startsWith("ws://"),O="string"==typeof E&&E.includes("127.0.0.1"),M=window.location.protocol.startsWith("https:");function P({className:e}){const{t:n}=Z(),{apiError:t,isApiConnected:i,isApiReady:r,isWaitingInjected:o}=(0,N.h)();return t?(0,z.jsx)(W,{className:e,icon:"globe",type:"error",children:(0,z.jsx)("div",{children:t})}):r?o?(0,z.jsx)(W,{className:e,icon:"puzzle-piece",type:"info",children:(0,z.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):i?null:(0,z.jsxs)(W,{className:e,icon:"globe",type:"error",children:[(0,z.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),q&&!O&&M?(0,z.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:E}})}):void 0]}):(0,z.jsx)(W,{className:e,icon:"globe",type:"info",children:(0,z.jsx)("div",{children:n(i?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})}const D=d.memo(P);var H=t(7267),L=t(5004),B=t(35281);function X(e){return{Component:L.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:B.Z}}var _=t(90948);function F(e){return{Component:_.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var J=t(78025),V=t(99296);function G(e){return{Component:J.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:V.Z}}var K=t(78565);function Y(e){return{Component:K.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var Q=t(77324),ee=t(21804);function ne(e){return{Component:Q.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:ee.Z}}var te=t(79293);function ie(e){return{Component:te.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var re=t(49227),oe=t(24552);function se(e){return{Component:re.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"]},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:oe.Z}}var ae=t(93417);function le(e){return{Component:ae.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var ce=t(23072);function pe(e){try{return(0,c.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch(e){return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function de(e){return{Component:ce.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:pe},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var ue=t(12650),me=t(46737);function ge(e){return{Component:ue.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:me.Z}}var he=t(1920),xe=t(49824);function ve(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch(e){return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function fe(e){return{Component:he.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:ve},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:xe.Z}}var ye=t(35121);function be(e){return{Component:ye.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var ke=t(29569);function we(e){return{Component:ke.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var Ce=t(24299),je=t(46742);function Ae(e){return{Component:Ce.Z,display:{needsAccounts:!0,needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:je.Z}}var Ne=t(64159);function Se(e){return{Component:Ne.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var Ie=t(51340);function Ze(e){return{Component:Ie.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var $e=t(23713);function Ue(e){return{Component:$e.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var ze=t(30420),Re=t(39221);function Te(e){return{Component:ze.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:Re.Z}}var We=t(52345);function Ee(e){return{Component:We.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var qe=t(12387);function Oe(e){return{Component:qe.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var Me=t(57957);function Pe(e){return{Component:Me.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var De=t(66179);function He(e){return{Component:De.Z,display:{needsAccounts:!0,needsApi:["tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var Le=t(49043),Be=t(94908);function Xe(e){return{Component:Le.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:Be.Z}}var _e=t(16934),Fe=t(7720);function Je(e){return{Component:_e.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:Fe.Z}}var Ve=t(70249);function Ge(e){return{Component:Ve.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var Ke=t(13104);function Ye(e){return{Component:Ke.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var Qe=t(59191);function en(e){return{Component:Qe.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var nn=t(50264),tn=t(35365);function rn(e){return{Component:nn.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:tn.Z}}var on=t(87143);function sn(e){return{Component:on.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var an=t(64624),ln=t(90036);function cn(e){return{Component:an.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:ln.Z}}var pn=t(41570),dn=t(25943),un=t(12782),mn=t(95292);function gn(e){try{const{others:[{value:n,who:t}],own:i,total:r}=e.registry.createType((0,un.PL)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:mn.If,who:dn.TS}],own:mn.If,total:mn.If});(0,c.hu)(r&&i&&n&&t&&r.eq(mn.If)&&i.eq(mn.If)&&n.eq(mn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{e.tx.staking.bond(dn.TS,mn.If,{Account:dn.TS})}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function hn(e){return{Component:pn.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:gn},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var xn=t(40030);function vn(e){try{const{others:[{value:n,who:t}],own:i,total:r}=e.registry.createType((0,un.PL)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:mn.If,who:dn.TS}],own:mn.If,total:mn.If});(0,c.hu)(r&&i&&n&&t&&r.eq(mn.If)&&i.eq(mn.If)&&n.eq(mn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{e.tx.staking.bond(dn.TS,mn.If,{Account:dn.TS})}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function fn(e){return{Component:xn.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:vn},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var yn=t(10063);function bn(e){return{Component:yn.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var kn=t(96067);function wn(e){return{Component:kn.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var Cn=t(1052),jn=t(79006);function An(e){return{Component:Cn.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:jn.Z}}var Nn=t(21077);function Sn(e){return{Component:Nn.Z,Modal:Nn.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}var In=t(50332);function Zn(e){return{Component:In.Z,Modal:In.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transfer"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var $n=t(15814),Un=t(53009);function zn(e){return{Component:$n.Z,display:{needsApi:["tx.treasury.proposeSpend"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:Un.Z}}var Rn=t(39177);function Tn(e){return{Component:Rn.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var Wn=t(85435);function En(e){return{Component:Wn.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function qn(e){return[X(e),F(e),be(e),se(e),Pe(e),Zn(e),Sn(e),hn(e),fn(e),le(e),Je(e),Te(e),G(e),Ae(e),Xe(e),He(e),En(e),fe(e),ge(e),An(e),zn(e),ne(e),Oe(e),Ze(e),Y(e),Ee(e),cn(e),en(e),ie(e),de(e),bn(e),we(e),Ge(e),Ye(e),sn(e),wn(e),Se(e),Ue(e),Tn(e),rn(e)]}var On=t(54782),Mn=t(82671),Pn=t(33661);function Dn(e,n,t){const[i,r,o]=n.split("."),[s]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),r)||[r];try{return"consts"===i?(0,Mn.K)(e[i][s][o]):(0,Pn.m)(e[i][s][o])}catch(e){return!1}}function Hn(e,n,t=!1,i){if(!n)return[];const r=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,i)=>n||Dn(e,i,t)),!1):Dn(e,n,t))));return r.length||!i||i(e)?r:["needsApiCheck"]}function Ln({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,z.jsx)(H.l_,{to:"/explorer"})}const Bn=d.memo(Ln);var Xn=t(13328),_n=t(36856),Fn=t(64021),Jn=t(69516);let Vn;function Gn({optionsAll:e}){var n;const{queueAction:t}=(0,On.L)(),{api:i,isApiReady:r}=(0,N.h)(),{allAccounts:o}=(0,Xn.x)(),{t:s}=Z(),a=(0,_n.W7)(r&&(null==(n=i.query.system)?void 0:n.events));return(0,d.useEffect)((()=>{const n=function(e,n,t,i){const r=(0,Jn.R)((0,Fn.d)(JSON.stringify(i)));return t&&i&&r!==Vn?(Vn=r,i.map((({event:{data:t,method:i,section:r}})=>{if("balances"===r&&"Transfer"===i){const o=t[1].toString();if(e.includes(o))return{account:o,action:`${r}.${i}`,message:n("transfer received"),status:"event"}}else if("democracy"===r){const e=t[0].toString();return{action:`${r}.${i}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(o,s,e,a);n&&t(n)}),[o,a,e,t,s]),(0,z.jsx)($.qb,{})}const Kn=d.memo(Gn),Yn={Component:Bn,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"};function Qn({className:e}){const n=(0,H.TH)(),{t}=Z(),{api:i,isApiConnected:r,isApiReady:o,isDevelopment:s}=(0,N.h)(),{queueAction:a}=(0,On.L)(),{Component:l,display:{needsApi:c,needsApiCheck:p,needsApiInstances:u},icon:m,name:g,text:h}=(0,d.useMemo)((()=>{const e=n.pathname.slice(1)||"";return qn(t).find((n=>n&&e.startsWith(n.name)&&(s||!n.display.isDevelopment)))||Yn}),[s,n,t]),x=(0,d.useMemo)((()=>c?o&&r?Hn(i,c,u,p):null:[]),[i,r,o,c,p,u]);return(0,z.jsx)(et,{className:e,children:x?(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(d.Suspense,{fallback:"...",children:(0,z.jsx)($.SV,{trigger:g,children:(0,z.jsx)($.mO.Provider,{value:{icon:m,text:h},children:x.length?(0,z.jsx)(Bn,{basePath:`/${g}`,location:n,missingApis:x,onStatusChange:a}):(0,z.jsx)(l,{basePath:`/${g}`,location:n,onStatusChange:a})})})}),(0,z.jsx)(Kn,{})]}):(0,z.jsx)("div",{className:"connecting",children:(0,z.jsx)($.$j,{label:t("Initializing connection")})})})}const et=$.zo.div`
  flex-grow: 1;
  overflow: hidden auto;
  padding: 0 0 1rem 0;
  position: relative;
  width: 100%;

  .connecting {
    padding: 3.5rem 0;
  }

  & main > *:not(header):not(.hasOwnMaxWidth) {
    max-width: var(--width-full);
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    padding: 0 1.5rem;

    @media only screen and (max-width: 1100px) {
      padding: 0 1rem;
    }

    @media only screen and (max-width: 800px) {
      padding: 0 0.75rem;
    }
  }
`,nt=d.memo(Qn);var tt=t(36546),it=t(38434),rt=t(92698),ot=t(68058),st=t(82302),at=t(70676);function lt({apiUrl:e,className:n,label:t,setApiUrl:i,url:r}){const o=(0,d.useCallback)((()=>i(r)),[i,r]);return(0,z.jsx)(ct,{className:n,isRadio:!0,label:t,onChange:o,value:e===r})}const ct=(0,$.zo)($.ZD)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,pt=d.memo(lt);function dt({apiUrl:e,className:n="",setApiUrl:t,value:{isChild:i,isRelay:r,isUnreachable:o,name:s,nameRelay:a,paraId:l,providers:c,ui:p}}){const{t:u}=Z(),m=(0,d.useMemo)((()=>c.some((({url:n})=>n===e))),[e,c]),g=(0,d.useCallback)((()=>{const e=c.filter((({url:e})=>!e.startsWith("light://")));return t(s,e[Math.floor(Math.random()*e.length)].url)}),[s,c,t]),h=(0,d.useCallback)((e=>t(s,e)),[s,t]);return(0,z.jsxs)(ut,{className:`${n}${m?" isSelected highlight--border":""}${o?" isUnreachable":""}`,children:[(0,z.jsxs)("div",{className:"endpointSection"+(i?" isChild":""),onClick:o?void 0:g,children:[(0,z.jsx)($.Mj,{className:"endpointIcon",isInline:!0,logo:p.logo||"empty",withoutHl:!0}),(0,z.jsxs)("div",{className:"endpointValue",children:[(0,z.jsx)("div",{children:s}),m&&(r||!!l)&&(0,z.jsx)("div",{className:"endpointExtra",children:r?u("Relay chain"):u(l&&l<1e3?"{{relay}} System":l&&l<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:a}})})]})]}),m&&c.map((({name:n,url:t})=>(0,z.jsx)(pt,{apiUrl:e,label:n,setApiUrl:h,url:t},t)))]})}const ut=$.zo.div`
  border-left: 0.25rem solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  margin: 0 0 0.25rem 0;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  position: relative;

  &.isUnreachable {
    opacity: var(--opacity-light);
  }

  &.isSelected,
  &:hover {
    background: var(--bg-table);
  }

  .endpointSection {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    position: relative;

    &+.ui--Toggle {
      margin-top: 1rem;
    }

    &.isChild .endpointIcon {
      margin-left: 1.25rem;
    }

    &+.endpointProvider {
      margin-top: -0.125rem;
    }

    .endpointValue {
      .endpointExtra {
        font-size: var(--font-size-small);
        opacity: var(--opacity-light);
      }
    }
  }

  // we jiggle our labels somewhat...
  label {
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
    text-transform: none;
  }
`,mt=d.memo(dt);function gt({affinities:e,apiUrl:n,children:t,className:i="",index:r,isSelected:o,setApiUrl:s,setGroup:a,value:{header:l,isSpaced:c,networks:p}}){const u=(0,d.useCallback)((()=>a(o?-1:r)),[r,o,a]),m=(0,d.useMemo)((()=>p.filter((({isUnreachable:e})=>!e))),[p]);return(0,z.jsxs)(ht,{className:`${i}${o?" isSelected":""}`,children:[(0,z.jsxs)("div",{className:"groupHeader"+(c?" isSpaced":""),onClick:u,children:[(0,z.jsx)($.JO,{icon:o?"caret-up":"caret-down"}),l]}),o&&(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)("div",{className:"groupNetworks",children:m.map(((t,i)=>(0,z.jsx)(mt,{affinity:e[t.name],apiUrl:n,setApiUrl:s,value:t},i)))}),t]})]})}const ht=$.zo.div`
  .groupHeader {
    border-radius: 0.25rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.75rem 1rem;
    position: relative;
    text-transform: uppercase;

    &:hover {
      background: var(--bg-table);
    }

    &.isSpaced {
      margin-top: 0.75rem;
    }

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .groupNetworks {
    padding: 0.25rem 0 0.5rem 1rem;
  }
`,xt=d.memo(gt),vt="network:affinities";function ft(e){return e.reduce(((e,n)=>{if(n.isHeader)e.push({header:n.text,isDevelopment:n.isDevelopment,isSpaced:n.isSpaced,networks:[]});else{const t=e[e.length-1],i={isLightClient:n.isLightClient,name:n.textBy,url:n.value};t.networks[t.networks.length-1]&&n.text===t.networks[t.networks.length-1].name?t.networks[t.networks.length-1].providers.push(i):n.isUnreachable||t.networks.push({isChild:n.isChild,isRelay:!!n.genesisHash,name:n.text,nameRelay:n.textRelay,paraId:n.paraId,providers:[i],ui:n.ui})}return e}),[])}function yt(){try{const e=localStorage.getItem(st.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function bt(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:l.X.get().apiUrl!==e,isUrlValid:(i=e,i.length>=7&&(i.startsWith("ws://")||i.startsWith("wss://")||i.startsWith("light://")))};var i}function kt({className:e="",offset:n,onClose:t}){const{t:i}=Z(),r=(0,s.Rf)(i),[a,c]=(0,d.useState)((()=>ft(r))),[{apiUrl:p,groupIndex:u,hasUrlChanged:m,isUrlValid:g},h]=(0,d.useState)((()=>bt(l.X.get().apiUrl,a))),[x,v]=(0,d.useState)((()=>yt())),[f,y]=(0,d.useState)((()=>function(e){return Object.entries(o().get(vt)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:i})=>e===n&&i.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(a))),b=(0,d.useRef)(null),k=(0,d.useMemo)((()=>{let e=!1;return r.some((n=>n.value===p&&(e=!0,!0))),e}),[p,r]),w=(0,d.useMemo)((()=>{let e=!1;return x.some((n=>n===p&&(e=!0,!0))),e}),[p,x]),C=(0,d.useCallback)((e=>h((n=>({...n,groupIndex:e})))),[]),j=(0,d.useCallback)((()=>{if(!w)return;const e=x.filter((e=>e!==p));try{localStorage.setItem(st.ie,JSON.stringify(e)),c(ft((0,s.Rf)(i))),v(yt())}catch(e){console.error(e)}}),[p,w,x,i]),A=(0,d.useCallback)(((e,n)=>{y((t=>{const i={...t,[e]:n};return o().set(vt,i),i})),h(bt(n,a))}),[a]),N=(0,d.useCallback)((e=>{(0,at._)(e)||(e=ot.ZP.toASCII(e)),h(bt(e,a))}),[a]),S=(0,d.useCallback)((()=>{l.X.set({...l.X.get(),apiUrl:p}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(p)}${window.location.hash}`),t()}),[p,t]),I=(0,d.useCallback)((()=>{try{localStorage.setItem(st.ie,JSON.stringify([...x,p])),S()}catch(e){console.error(e)}}),[S,p,x]),U=(0,d.useMemo)((()=>function(e,n,t){return!e||!n.startsWith("light://")&&!t}(m,p,g)),[m,p,g]);return(0,z.jsx)(wt,{button:(0,z.jsx)($.zx,{icon:"sync",isDisabled:U,label:i("Switch"),onClick:S}),className:e,offset:n,onClose:t,position:"left",sidebarRef:b,children:a.map(((e,n)=>(0,z.jsx)(xt,{affinities:f,apiUrl:p,index:n,isSelected:u===n,setApiUrl:A,setGroup:C,value:e,children:e.isDevelopment&&(0,z.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,z.jsx)($.II,{className:"endpointCustom",isError:!g,isFull:!0,label:i("custom endpoint"),onChange:N,value:p}),w?(0,z.jsx)($.zx,{className:"customButton",icon:"trash-alt",onClick:j}):(0,z.jsx)($.zx,{className:"customButton",icon:"save",isDisabled:!g||k,onClick:I})]})},n)))})}const wt=(0,$.zo)($.YE)`
  color: var(--color-text);
  padding-top: 3.5rem;

  .customButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .endpointCustom {
    input {
      padding-right: 4rem;
    }
  }

  .endpointCustomWrapper {
    position: relative;
  }
`,Ct=d.memo(kt);function jt({className:e}){const{api:n,isApiReady:t}=(0,N.h)(),i=(0,_n.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:r}=(0,a.g)(),[o,s]=(0,U.O)(),l=!r;return(0,z.jsxs)(At,{className:e,children:[(0,z.jsxs)("div",{className:`apps--SideBar-logo-inner${l?" isClickable":""} highlight--color-contrast`,onClick:s,children:[(0,z.jsx)($.Mj,{}),(0,z.jsxs)("div",{className:"info media--1000",children:[(0,z.jsx)(it.Z,{className:"chain"}),i&&(0,z.jsxs)("div",{className:"runtimeVersion",children:[i.specName.toString(),"/",i.specVersion.toNumber()]}),(0,z.jsx)(rt.Z,{className:"bestNumber",label:"#"})]}),l&&(0,z.jsx)($.JO,{className:"dropdown",icon:o?"caret-right":"caret-down"})]}),o&&(0,z.jsx)(Ct,{onClose:s})]})}const At=$.zo.div`
  box-sizing: border-box;
  padding: 0.5rem 1rem 0.5rem 0;
  margin: 0;

  .apps--SideBar-logo-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.isClickable {
      cursor: pointer;
    }

    .ui--ChainImg {
      height: 3rem;
      margin-right: 0.5rem;
      width: 3rem;
    }

    .ui--Icon.dropdown,
    > div.info {
      text-align: right;
      vertical-align: middle;
    }

    .ui--Icon.dropdown {
      flex: 0;
      margin: 0;
      width: 1rem;
    }

    .info {
      flex: 1;
      font-size: var(--font-size-tiny);
      line-height: 1.2;
      padding-right: 0.5rem;
      text-align: right;

      .chain {
        font-size: var(--font-size-small);
        max-width: 16rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .runtimeVersion {
        letter-spacing: -0.01em;
      }
    }
  }
`,Nt=d.memo(jt),St=()=>0;function It({className:e="",classNameText:n,isLink:t,isToplevel:i,route:{Modal:r,href:o,icon:s,name:a,text:l,useCounter:c=St}}){const[p,d]=(0,U.O)(),u=c();return(0,z.jsxs)(Zt,{className:`${e} ui--MenuItem ${u?"withCounter":""} ${t?"isLink":""} ${i?"topLevel highlight--color-contrast":""}`,children:[(0,z.jsxs)("a",{href:r?void 0:o||`#/${a}`,onClick:r?d:void 0,rel:"noopener noreferrer",target:o?"_blank":void 0,children:[(0,z.jsx)($.JO,{icon:s}),(0,z.jsx)("span",{className:n,children:l}),!!u&&(0,z.jsx)($.Ct,{color:"white",info:u})]}),r&&p&&(0,z.jsx)(r,{onClose:d})]})}const Zt=$.zo.li`
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  &.topLevel {
    font-weight: var(--font-weight-normal);
    line-height: 1.214rem;
    border-radius: 0.15rem;

    a {
      padding: 0.857rem 0.857em 0.857rem 1rem;
      line-height: 1.214rem;
      border-radius: 0.25rem;
    }

    &.isActive.highlight--color-contrast {
      font-weight: var(--font-weight-normal);
      color: var(--color-text);

      a {
        background-color: var(--bg-tabs);
      }
    }

    &.isActive {
      border-radius: 0.15rem 0.15rem 0 0;

      a {
        padding: 0.857rem 1.429rem 0.857rem;
        cursor: default;
      }

      &&.withCounter a {
        padding-right: 3.2rem;
      }
    }

    .ui--Badge {
      top: 0.7rem;
    }
  }

  &&.withCounter a {
    padding-right: 3.2rem;
  }

  a {
    color: inherit !important;
    display: block;
    padding: 0.5rem 1.15rem 0.57rem;
    text-decoration: none;
    line-height: 1.5rem;
  }

  .ui--Badge {
    position: absolute;
    right: 0.5rem;
  }

  .ui--Icon {
    margin-right: 0.5rem;
  }
`,$t=d.memo(It),Ut="rgba(34, 36, 38, 0.12)",zt="5px";function Rt({className:e="",isActive:n,name:t,routes:i}){return 1===i.length&&"settings"===i[0].group?(0,z.jsx)($t,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:i[0]}):(0,z.jsxs)(Tt,{className:`${e} ${n?"isActive":""}`,children:[(0,z.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,z.jsx)("span",{className:"smallHide",children:t}),(0,z.jsx)($.JO,{className:"smallShow",icon:i[0].icon}),(0,z.jsx)($.JO,{icon:"caret-down"})]}),(0,z.jsx)("ul",{className:"groupMenu",children:i.map((e=>(0,z.jsx)($t,{route:e},e.name)))})]})}const Tt=$.zo.li`
  cursor: pointer;
  position: relative;

  .groupHdr {
    border-radius: 0.25rem;
    padding: 0.857rem 1.375rem;
    font-weight: var(--font-weight-normal);
    line-height: 1.214rem;

    > .ui--Icon {
      margin-left: 0.75rem;
    }
  }

  &.isActive .groupHdr {
    background-color: var(--bg-tabs);
    font-weight: var(--font-weight-normal);
    margin-bottom: 0;
  }

  .groupMenu {
    border-radius: 0.25rem;
    box-shadow: 0 ${zt} ${zt} -${zt} ${Ut}, ${zt} 0 ${zt} -${zt} ${Ut}, -${zt} 0 ${zt} -${zt} ${Ut};
    display: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 2.9rem;
    z-index: 250;

    > li {
      z-index: 1;

      a {
        padding-right: 4rem;
      }
    }

    &::before {
      bottom: 0;
      content: ' ';
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      z-index: -1;
    }
  }

  &:hover {
    .groupHdr {
      box-shadow: 0px 4px 37px rgba(0, 0, 0, 0.08);
      padding-bottom: 2rem;
      margin-bottom: -2rem;
    }

    .groupMenu {
      display: block;

      > li:hover {
        background: var(--bg-menu-hover);
      }
    }
  }
`,Wt=d.memo(Rt);var Et=t(88795),qt=t(44364);const Ot=`apps v${"0.124.2-109-x".replace("-x","")}`;function Mt({className:e=""}){const{api:n,isApiReady:t}=(0,N.h)();return(0,z.jsxs)(Pt,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,z.jsxs)("div",{className:"node",children:[(0,z.jsx)(Et.Z,{})," ",(0,z.jsx)(qt.Z,{label:"v"})]}),(0,z.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,z.jsx)("div",{children:Ot})]})}const Pt=$.zo.div`
  background: transparent;
  font-size: var(--font-size-tiny);
  line-height: 1.2;
  padding: 0 0 0 1rem;
  text-align: right;

  > div {
    margin-bottom: -0.125em;

    > div {
      display: inline-block;
    }
  }
`,Dt=d.memo(Mt);function Ht({className:e=""}){var n;const{t}=Z(),{allAccounts:i,hasAccounts:r}=(0,Xn.x)(),o=(0,N.h)(),{allowTeleport:s}=(0,tt.M)(),a=(0,_n.W7)(o.isApiReady&&(null==(n=o.api.query.sudo)?void 0:n.key)),l=(0,H.TH)(),c=(0,d.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(t)),p=(0,d.useRef)(qn(t)),u=(0,d.useRef)({accounts:t("Accounts"),developer:t("Developer"),files:t("Files"),governance:t("Governance"),network:t("Network"),settings:t("Settings")}),m=(0,d.useMemo)((()=>!!a&&i.some((e=>a.eq(e)))),[i,a]),g=(0,d.useMemo)((()=>function(e,n,t,i,r,o){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:i},r,o,s,{isDevelopment:a,isHidden:l,needsAccounts:c,needsApi:p,needsApiCheck:d,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!o||p&&(!t||!n||m&&!s||g&&!r||!i&&a||0!==Hn(e,p,u,d).length))}(t,i,r,o,e)))}))).filter((({routes:e})=>e.length))}(p.current,u.current,o,s,r,m)),[s,o,r,m]),h=(0,d.useMemo)((()=>p.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,z.jsx)(Lt,{className:`${e}${o.isApiReady&&o.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,z.jsxs)("div",{className:"menuContainer",children:[(0,z.jsxs)("div",{className:"menuSection",children:[(0,z.jsx)(Nt,{}),(0,z.jsx)("ul",{className:"menuItems",children:g.map((({name:e,routes:n})=>(0,z.jsx)(Wt,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,z.jsx)("div",{className:"menuSection media--1200",children:(0,z.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,z.jsx)($t,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,z.jsx)(Dt,{className:"media--1400"})]})})}const Lt=$.zo.div`
  width: 100%;
  padding: 0;
  z-index: 220;
  position: relative;

  .smallShow {
    display: none;
  }

  & .menuContainer {
    flex-direction: row;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 0 1.5rem;
    width: 100%;
    max-width: var(--width-full);
    margin: 0 auto;
  }

  &.isLoading {
    background: #999 !important;

    .menuActive {
      background: var(--bg-page);
    }

    &:before {
      filter: grayscale(1);
    }

    .menuItems {
      filter: grayscale(1);
    }
  }

  .menuSection {
    align-items: center;
    display: flex;
  }

  .menuActive {
    background: var(--bg-tabs);
    border-bottom: none;
    border-radius: 0.25rem 0.25rem 0 0;
    color: var(--color-text);
    padding: 1rem 1.5rem;
    margin: 0 1rem -1px;
    z-index: 1;

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .menuItems {
    flex: 1 1;
    list-style: none;
    margin: 0 1rem 0 0;
    padding: 0;

    > li {
      display: inline-block;
    }

    > li + li {
      margin-left: 0.375rem
    }
  }

  .ui--NodeInfo {
    align-self: center;
  }

  @media only screen and (max-width: 800px) {
    .groupHdr {
      padding: 0.857rem 0.75rem;
    }

    .smallShow {
      display: initial;
    }

    .smallHide {
      display: none;
    }

    .menuItems {
      margin-right: 0;

      > li + li {
        margin-left: 0.25rem;
      }
    }
  }
`,Bt=d.memo(Ht);function Xt(){var e,n,t;const{api:i,isApiReady:r}=(0,N.h)(),o=(0,_n.W7)(r&&(null==(e=i.derive.accounts)?void 0:e.indexes)),s=(0,_n.W7)(r&&(null==(n=i.query.identity)?void 0:n.registrars)),a=(0,_n.W7)(r&&(null==(t=i.query.balances)?void 0:t.totalIssuance)),[l,c]=(0,d.useState)(!1);return(0,d.useEffect)((()=>{c(!!o||!!a||!!s)}),[]),(0,z.jsx)("div",{className:`apps--api-warm ${l.toString()}`})}const _t=d.memo(Xt);function Ft({className:e=""}){const{themeClassName:n}=(0,A.F)(),{apiEndpoint:t,isDevelopment:i}=(0,N.h)(),r=(0,d.useMemo)((()=>i||null==t?void 0:t.ui.color),[t,i]);return(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(j.Z,{uiHighlight:r}),(0,z.jsxs)(Jt,{className:`${e} apps--Wrapper ${n}`,children:[(0,z.jsx)(Bt,{}),(0,z.jsxs)(w.Z,{children:[(0,z.jsx)(S.Z,{children:(0,z.jsx)(nt,{})}),(0,z.jsx)(D,{}),(0,z.jsx)("div",{id:"portals"})]})]}),(0,z.jsx)(_t,{})]})}const Jt=C.z.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,Vt=d.memo(Ft),Gt={theme:"dark"},Kt={theme:"light"};function Yt({uiTheme:e}){const n="dark"===e?"dark":"light";return document&&document.documentElement&&document.documentElement.setAttribute("data-theme",n),"dark"===e?Gt:Kt}function Qt({isElectron:e,store:n}){const[t,i]=(0,d.useState)((()=>Yt(l.X)));return(0,d.useEffect)((()=>{l.X.on("change",(e=>i(Yt(e))))}),[]),(0,z.jsx)(d.Suspense,{fallback:"...",children:(0,z.jsx)(g.f6,{theme:t,children:(0,z.jsx)(x.q,{children:(0,z.jsx)(h.ApiCtxRoot,{apiUrl:l.X.apiUrl,isElectron:e,store:n,children:(0,z.jsx)(v.y,{children:(0,z.jsx)(f.u,{children:(0,z.jsx)(y.g,{children:(0,z.jsx)(b.w,{children:(0,z.jsx)(m.UT,{children:(0,z.jsx)(k.A,{children:(0,z.jsx)(Vt,{})})})})})})})})})})})}const ei=d.memo(Qt),ni="root",ti=document.getElementById(ni);if(!ti)throw new Error(`Unable to find element with id '${ni}'`);(0,u.s)(ti).render((0,z.jsx)(ei,{isElectron:!1}))},29038:(e,n,t)=>{var i={".":[9921,9],"./":[9921,9],"./Api":[19910,9],"./Api.tsx":[19910,9],"./hoc":[79136,9],"./hoc/":[79136,9],"./hoc/api":[17366,9],"./hoc/api.tsx":[17366,9],"./hoc/call":[26869,9],"./hoc/call.tsx":[26869,9],"./hoc/callDiv":[11944,9],"./hoc/callDiv.tsx":[11944,9],"./hoc/calls":[56281,9],"./hoc/calls.ts":[56281,9],"./hoc/index":[79136,9],"./hoc/index.ts":[79136,9],"./hoc/multi":[55215,9],"./hoc/multi.ts":[55215,9],"./hoc/observable":[33546,9],"./hoc/observable.tsx":[33546,9],"./hoc/onlyOn":[96725,9],"./hoc/onlyOn.tsx":[96725,9],"./hoc/types":[95283,9,5283],"./hoc/types.ts":[95283,9,5283],"./index":[9921,9],"./index.ts":[9921,9],"./light":[95003,9],"./light.spec":[59099,9,9099],"./light.spec.ts":[59099,9,9099],"./light/":[95003,9],"./light/index":[95003,9],"./light/index.ts":[95003,9],"./light/kusama":[88137,9],"./light/kusama/":[88137,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[88137,9],"./light/kusama/index.ts":[88137,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[81023,9],"./light/polkadot/":[81023,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[81023,9],"./light/polkadot/index.ts":[81023,9],"./transform/echo":[86484,9],"./transform/echo.ts":[86484,9],"./typeRegistry":[48963,9],"./typeRegistry.ts":[48963,9],"./types":[49132,9,9132],"./types.ts":[49132,9,9132],"./urlTypes":[58321,9],"./urlTypes.ts":[58321,9],"./util":[90298,9],"./util/":[90298,9],"./util/getEnvironment":[424,9],"./util/getEnvironment.ts":[424,9],"./util/historic":[78968,9],"./util/historic.ts":[78968,9],"./util/index":[90298,9],"./util/index.ts":[90298,9],"./util/intervalObservable":[54142,9],"./util/intervalObservable.ts":[54142,9],"./util/isEqual":[6815,9],"./util/isEqual.ts":[6815,9],"./util/triggerChange":[88593,9],"./util/triggerChange.ts":[88593,9]};function r(e){if(!t.o(i,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=i[e],r=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(r,16|n[1])))}r.keys=()=>Object.keys(i),r.id=29038,e.exports=r},69314:()=>{},18983:()=>{},33196:()=>{},74364:()=>{},74854:()=>{},66602:()=>{},85338:()=>{}},e=>{var n=n=>e(e.s=n);e.O(0,[6677,4668,5744,4188,1064,4124,1981,434,9398,4969,1832,7924,212,2044,9888,6693,9684,1358,8461,760,6829,5005,8872,2693,2208,136,8484,893,6641,8110,353,2276,4292,7496,3305,9121,8291,4635,5502,3569,1295,3508,8758,5609,3026,4269,587,3890,3343,1169,1299,5260,2191,8568,8107,1883,3254,4776,8671,1112,5396,7965,6510],(()=>(n(10025),n(37627)))),e.O()}]);