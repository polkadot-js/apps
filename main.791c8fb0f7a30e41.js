(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{51605:(e,n,t)=>{var i={"./ksmcc3.js":[64456,4456],"./polkadot.js":[64358,4358],"./rococo_v2_2.js":[34398,4398],"./westend2.js":[61860,1860]};function r(e){if(!t.o(i,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=i[e],r=n[0];return t.e(n[1]).then((()=>t(r)))}r.keys=()=>Object.keys(i),r.id=51605,e.exports=r},43673:(e,n,t)=>{"use strict";var i=t(52322),r=t(85168),o=t(23729),s=t.n(o),a=t(47564),l=t(83337),c=t(16039),p=t(48731);const d=function(){const e=r.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,p.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,p.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,a.Rf)((()=>"")),{ipnsChain:t}=(0,l.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const i=s().get("settings")||{},o=n.find((({value:e})=>!!e));return[i.apiUrl,void 0].includes(c.X.apiUrl)?c.X.apiUrl:o?o.value:"ws://127.0.0.1:9944"}();c.X.set({apiUrl:d}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(d),t(94953);var u=t(2784),m=t(17029),g=t(26643),h=t(82740),x=t(57139),v=t(87561),f=t(3773),y=t(68944),b=t(57120),k=t(44028),w=t(91012),C=t(66425),j=t(21779),A=t(37731),N=t(3663),S=t(90778),I=t(4984),Z=t(61349);function $(){return(0,Z.$G)("apps")}var U=t(24732),z=t(38894);const R=U.zo.div`
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
`,T=u.memo((function({children:e,className:n="",icon:t,type:r}){const[o,s]=(0,z.O)();return o?null:(0,i.jsx)(R,{className:`${n} ${"error"===r?"isError":"isInfo"}`,children:(0,i.jsxs)("div",{className:"content",children:[(0,i.jsx)(U.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,i.jsx)("div",{className:"contentItem",children:e}),(0,i.jsx)(U.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:s})]})})})),W=c.X.apiType.param,E="json-rpc"===c.X.apiType.type&&"string"==typeof W&&W.startsWith("ws://"),q="string"==typeof W&&W.includes("127.0.0.1"),O=window.location.protocol.startsWith("https:"),M=u.memo((function({className:e}){const{t:n}=$(),{apiError:t,isApiConnected:r,isApiReady:o,isWaitingInjected:s}=(0,S.h)();return t?(0,i.jsx)(T,{className:e,icon:"globe",type:"error",children:(0,i.jsx)("div",{children:t})}):o?s?(0,i.jsx)(T,{className:e,icon:"puzzle-piece",type:"info",children:(0,i.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):r?null:(0,i.jsxs)(T,{className:e,icon:"globe",type:"error",children:[(0,i.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),E&&!q&&O?(0,i.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:W}})}):void 0]}):(0,i.jsx)(T,{className:e,icon:"globe",type:"info",children:(0,i.jsx)("div",{children:n(r?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})}));var P=t(7267),D=t(75994),H=t(10189);function L(e){return{Component:D.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:H.Z}}var B=t(28096);function X(e){return{Component:B.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var _=t(49307),F=t(58370);function J(e){return{Component:_.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:F.Z}}var V=t(25467);function G(e){return{Component:V.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var K=t(9178),Y=t(19739);function Q(e){return{Component:K.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:Y.Z}}var ee=t(6742);function ne(e){return{Component:ee.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var te=t(75798),ie=t(73352);function re(e){return{Component:te.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"]},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:ie.Z}}var oe=t(2799);function se(e){return{Component:oe.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var ae=t(22516);function le(e){try{return(0,p.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch(e){return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function ce(e){return{Component:ae.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:le},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var pe=t(18324),de=t(40740);function ue(e){return{Component:pe.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:de.Z}}var me=t(50472),ge=t(61491);function he(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch(e){return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function xe(e){return{Component:me.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:he},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:ge.Z}}var ve=t(51406);function fe(e){return{Component:ve.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var ye=t(38080);function be(e){return{Component:ye.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var ke=t(58064),we=t(16472);function Ce(e){return{Component:ke.Z,display:{needsAccounts:!0,needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:we.Z}}var je=t(31043);function Ae(e){return{Component:je.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var Ne=t(79865);function Se(e){return{Component:Ne.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var Ie=t(30145);function Ze(e){return{Component:Ie.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var $e=t(51213),Ue=t(16743);function ze(e){return{Component:$e.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:Ue.Z}}var Re=t(50313);function Te(e){return{Component:Re.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var We=t(93242);function Ee(e){return{Component:We.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var qe=t(94349);function Oe(e){return{Component:qe.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var Me=t(20600);function Pe(e){return{Component:Me.Z,display:{needsAccounts:!0,needsApi:["tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var De=t(41857),He=t(76288);function Le(e){return{Component:De.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:He.Z}}var Be=t(89139),Xe=t(1398);function _e(e){return{Component:Be.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:Xe.Z}}var Fe=t(6583);function Je(e){return{Component:Fe.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var Ve=t(39117);function Ge(e){return{Component:Ve.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var Ke=t(14673);function Ye(e){return{Component:Ke.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var Qe=t(19433),en=t(76075);function nn(e){return{Component:Qe.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:en.Z}}var tn=t(24569);function rn(e){return{Component:tn.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var on=t(96246),sn=t(58900);function an(e){return{Component:on.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:sn.Z}}var ln=t(37457),cn=t(56949),pn=t(12782),dn=t(95292);function un(e){try{const{others:[{value:n,who:t}],own:i,total:r}=e.registry.createType((0,pn.PL)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:dn.If,who:cn.TS}],own:dn.If,total:dn.If});(0,p.hu)(r&&i&&n&&t&&r.eq(dn.If)&&i.eq(dn.If)&&n.eq(dn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{e.tx.staking.bond(cn.TS,dn.If,{Account:cn.TS})}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function mn(e){return{Component:ln.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:un},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var gn=t(97473);function hn(e){try{const{others:[{value:n,who:t}],own:i,total:r}=e.registry.createType((0,pn.PL)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:dn.If,who:cn.TS}],own:dn.If,total:dn.If});(0,p.hu)(r&&i&&n&&t&&r.eq(dn.If)&&i.eq(dn.If)&&n.eq(dn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{e.tx.staking.bond(cn.TS,dn.If,{Account:cn.TS})}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function xn(e){return{Component:gn.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:hn},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var vn=t(46717);function fn(e){return{Component:vn.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var yn=t(54676);function bn(e){return{Component:yn.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var kn=t(75509),wn=t(87340);function Cn(e){return{Component:kn.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:wn.Z}}var jn=t(9847);function An(e){return{Component:jn.Z,Modal:jn.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}var Nn=t(14868);function Sn(e){return{Component:Nn.Z,Modal:Nn.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transfer"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var In=t(27613),Zn=t(9039);function $n(e){return{Component:In.Z,display:{needsApi:["tx.treasury.proposeSpend"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:Zn.Z}}var Un=t(26822);function zn(e){return{Component:Un.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var Rn=t(7644);function Tn(e){return{Component:Rn.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function Wn(e){return[L(e),X(e),fe(e),re(e),Oe(e),Sn(e),An(e),mn(e),xn(e),se(e),_e(e),ze(e),J(e),Ce(e),Le(e),Pe(e),Tn(e),xe(e),ue(e),Cn(e),$n(e),Q(e),Ee(e),Se(e),G(e),Te(e),an(e),Ye(e),ne(e),ce(e),fn(e),be(e),Je(e),Ge(e),rn(e),bn(e),Ae(e),Ze(e),zn(e),nn(e)]}var En=t(86135),qn=t(82671),On=t(33661);function Mn(e,n,t){const[i,r,o]=n.split("."),[s]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),r)||[r];try{return"consts"===i?(0,qn.K)(e[i][s][o]):(0,On.m)(e[i][s][o])}catch(e){return!1}}function Pn(e,n,t=!1,i){if(!n)return[];const r=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,i)=>n||Mn(e,i,t)),!1):Mn(e,n,t))));return r.length||!i||i(e)?r:["needsApiCheck"]}const Dn=u.memo((function({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,i.jsx)(P.l_,{to:"/explorer"})}));var Hn=t(34814),Ln=t(9118),Bn=t(64021),Xn=t(69516);let _n;const Fn=u.memo((function({optionsAll:e}){const{queueAction:n}=(0,En.L)(),{api:t,isApiReady:r}=(0,S.h)(),{allAccounts:o}=(0,Hn.x)(),{t:s}=$(),a=(0,Ln.W7)(r&&t.query.system?.events);return(0,u.useEffect)((()=>{const t=function(e,n,t,i){const r=(0,Xn.R)((0,Bn.d)(JSON.stringify(i)));return t&&i&&r!==_n?(_n=r,i.map((({event:{data:t,method:i,section:r}})=>{if("balances"===r&&"Transfer"===i){const o=t[1].toString();if(e.includes(o))return{account:o,action:`${r}.${i}`,message:n("transfer received"),status:"event"}}else if("democracy"===r){const e=t[0].toString();return{action:`${r}.${i}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(o,s,e,a);t&&n(t)}),[o,a,e,n,s]),(0,i.jsx)(U.qb,{})})),Jn={Component:Dn,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"},Vn=U.zo.div`
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
`,Gn=u.memo((function({className:e}){const n=(0,P.TH)(),{t}=$(),{api:r,isApiConnected:o,isApiReady:s,isDevelopment:a}=(0,S.h)(),{queueAction:l}=(0,En.L)(),{Component:c,display:{needsApi:p,needsApiCheck:d,needsApiInstances:m},icon:g,name:h,text:x}=(0,u.useMemo)((()=>{const e=n.pathname.slice(1)||"";return Wn(t).find((n=>n&&e.startsWith(n.name)&&(a||!n.display.isDevelopment)))||Jn}),[a,n,t]),v=(0,u.useMemo)((()=>p?s&&o?Pn(r,p,m,d):null:[]),[r,o,s,p,d,m]);return(0,i.jsx)(Vn,{className:e,children:v?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(u.Suspense,{fallback:"...",children:(0,i.jsx)(U.SV,{trigger:h,children:(0,i.jsx)(U.mO.Provider,{value:{icon:g,text:x},children:v.length?(0,i.jsx)(Dn,{basePath:`/${h}`,location:n,missingApis:v,onStatusChange:l}):(0,i.jsx)(c,{basePath:`/${h}`,location:n,onStatusChange:l})})})}),(0,i.jsx)(Fn,{})]}):(0,i.jsx)("div",{className:"connecting",children:(0,i.jsx)(U.$j,{label:t("Initializing connection")})})})}));var Kn=t(41411),Yn=t(12176),Qn=t(95689),et=t(68058),nt=t(10072),tt=t(70676);const it=(0,U.zo)(U.ZD)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,rt=u.memo((function({apiUrl:e,className:n,label:t,setApiUrl:r,url:o}){const s=(0,u.useCallback)((()=>r(o)),[r,o]);return(0,i.jsx)(it,{className:n,isRadio:!0,label:t,onChange:s,value:e===o})})),ot=U.zo.div`
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
`,st=u.memo((function({apiUrl:e,className:n="",setApiUrl:t,value:{isChild:r,isRelay:o,isUnreachable:s,name:a,nameRelay:l,paraId:c,providers:p,ui:d}}){const{t:m}=$(),g=(0,u.useMemo)((()=>p.some((({url:n})=>n===e))),[e,p]),h=(0,u.useCallback)((()=>{const e=p.filter((({url:e})=>!e.startsWith("light://")));return t(a,e[Math.floor(Math.random()*e.length)].url)}),[a,p,t]),x=(0,u.useCallback)((e=>t(a,e)),[a,t]);return(0,i.jsxs)(ot,{className:`${n}${g?" isSelected highlight--border":""}${s?" isUnreachable":""}`,children:[(0,i.jsxs)("div",{className:"endpointSection"+(r?" isChild":""),onClick:s?void 0:h,children:[(0,i.jsx)(U.Mj,{className:"endpointIcon",isInline:!0,logo:d.logo||"empty",withoutHl:!0}),(0,i.jsxs)("div",{className:"endpointValue",children:[(0,i.jsx)("div",{children:a}),g&&(o||!!c)&&(0,i.jsx)("div",{className:"endpointExtra",children:o?m("Relay chain"):m(c&&c<1e3?"{{relay}} System":c&&c<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:l}})})]})]}),g&&p.map((({name:n,url:t})=>(0,i.jsx)(rt,{apiUrl:e,label:n,setApiUrl:x,url:t},t)))]})})),at=U.zo.div`
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
`,lt=u.memo((function({affinities:e,apiUrl:n,children:t,className:r="",index:o,isSelected:s,setApiUrl:a,setGroup:l,value:{header:c,isSpaced:p,networks:d}}){const m=(0,u.useCallback)((()=>l(s?-1:o)),[o,s,l]),g=(0,u.useMemo)((()=>d.filter((({isUnreachable:e})=>!e))),[d]);return(0,i.jsxs)(at,{className:`${r}${s?" isSelected":""}`,children:[(0,i.jsxs)("div",{className:"groupHeader"+(p?" isSpaced":""),onClick:m,children:[(0,i.jsx)(U.JO,{icon:s?"caret-up":"caret-down"}),c]}),s&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{className:"groupNetworks",children:g.map(((t,r)=>(0,i.jsx)(st,{affinity:e[t.name],apiUrl:n,setApiUrl:a,value:t},r)))}),t]})]})})),ct="network:affinities";function pt(e){return e.reduce(((e,n)=>{if(n.isHeader)e.push({header:n.text,isDevelopment:n.isDevelopment,isSpaced:n.isSpaced,networks:[]});else{const t=e[e.length-1],i={isLightClient:n.isLightClient,name:n.textBy,url:n.value};t.networks[t.networks.length-1]&&n.text===t.networks[t.networks.length-1].name?t.networks[t.networks.length-1].providers.push(i):n.isUnreachable||t.networks.push({isChild:n.isChild,isRelay:!!n.genesisHash,name:n.text,nameRelay:n.textRelay,paraId:n.paraId,providers:[i],ui:n.ui})}return e}),[])}function dt(){try{const e=localStorage.getItem(nt.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function ut(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:c.X.get().apiUrl!==e,isUrlValid:(i=e,i.length>=7&&(i.startsWith("ws://")||i.startsWith("wss://")||i.startsWith("light://")))};var i}const mt=(0,U.zo)(U.YE)`
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
`,gt=u.memo((function({className:e="",offset:n,onClose:t}){const{t:r}=$(),o=(0,a.Rf)(r),[l,p]=(0,u.useState)((()=>pt(o))),[{apiUrl:d,groupIndex:m,hasUrlChanged:g,isUrlValid:h},x]=(0,u.useState)((()=>ut(c.X.get().apiUrl,l))),[v,f]=(0,u.useState)((()=>dt())),[y,b]=(0,u.useState)((()=>function(e){return Object.entries(s().get(ct)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:i})=>e===n&&i.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(l))),k=(0,u.useRef)(null),w=(0,u.useMemo)((()=>{let e=!1;return o.some((n=>n.value===d&&(e=!0,!0))),e}),[d,o]),C=(0,u.useMemo)((()=>{let e=!1;return v.some((n=>n===d&&(e=!0,!0))),e}),[d,v]),j=(0,u.useCallback)((e=>x((n=>({...n,groupIndex:e})))),[]),A=(0,u.useCallback)((()=>{if(!C)return;const e=v.filter((e=>e!==d));try{localStorage.setItem(nt.ie,JSON.stringify(e)),p(pt((0,a.Rf)(r))),f(dt())}catch(e){console.error(e)}}),[d,C,v,r]),N=(0,u.useCallback)(((e,n)=>{b((t=>{const i={...t,[e]:n};return s().set(ct,i),i})),x(ut(n,l))}),[l]),S=(0,u.useCallback)((e=>{(0,tt._)(e)||(e=et.ZP.toASCII(e)),x(ut(e,l))}),[l]),I=(0,u.useCallback)((()=>{c.X.set({...c.X.get(),apiUrl:d}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(d)}${window.location.hash}`),t()}),[d,t]),Z=(0,u.useCallback)((()=>{try{localStorage.setItem(nt.ie,JSON.stringify([...v,d])),I()}catch(e){console.error(e)}}),[I,d,v]),z=(0,u.useMemo)((()=>function(e,n,t){return!e||!n.startsWith("light://")&&!t}(g,d,h)),[g,d,h]);return(0,i.jsx)(mt,{button:(0,i.jsx)(U.zx,{icon:"sync",isDisabled:z,label:r("Switch"),onClick:I}),className:e,offset:n,onClose:t,position:"left",sidebarRef:k,children:l.map(((e,n)=>(0,i.jsx)(lt,{affinities:y,apiUrl:d,index:n,isSelected:m===n,setApiUrl:N,setGroup:j,value:e,children:e.isDevelopment&&(0,i.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,i.jsx)(U.II,{className:"endpointCustom",isError:!h,isFull:!0,label:r("custom endpoint"),onChange:S,value:d}),C?(0,i.jsx)(U.zx,{className:"customButton",icon:"trash-alt",onClick:A}):(0,i.jsx)(U.zx,{className:"customButton",icon:"save",isDisabled:!h||w,onClick:Z})]})},n)))})})),ht=U.zo.div`
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
`,xt=u.memo((function({className:e}){const{api:n,isApiReady:t}=(0,S.h)(),r=(0,Ln.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:o}=(0,l.g)(),[s,a]=(0,z.O)(),c=!o;return(0,i.jsxs)(ht,{className:e,children:[(0,i.jsxs)("div",{className:`apps--SideBar-logo-inner${c?" isClickable":""} highlight--color-contrast`,onClick:a,children:[(0,i.jsx)(U.Mj,{}),(0,i.jsxs)("div",{className:"info media--1000",children:[(0,i.jsx)(Yn.Z,{className:"chain"}),r&&(0,i.jsxs)("div",{className:"runtimeVersion",children:[r.specName.toString(),"/",r.specVersion.toNumber()]}),(0,i.jsx)(Qn.Z,{className:"bestNumber",label:"#"})]}),c&&(0,i.jsx)(U.JO,{className:"dropdown",icon:s?"caret-right":"caret-down"})]}),s&&(0,i.jsx)(gt,{onClose:a})]})})),vt=()=>0,ft=U.zo.li`
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
`,yt=u.memo((function({className:e="",classNameText:n,isLink:t,isToplevel:r,route:{Modal:o,href:s,icon:a,name:l,text:c,useCounter:p=vt}}){const[d,u]=(0,z.O)(),m=p();return(0,i.jsxs)(ft,{className:`${e} ui--MenuItem ${m?"withCounter":""} ${t?"isLink":""} ${r?"topLevel highlight--color-contrast":""}`,children:[(0,i.jsxs)("a",{href:o?void 0:s||`#/${l}`,onClick:o?u:void 0,rel:"noopener noreferrer",target:s?"_blank":void 0,children:[(0,i.jsx)(U.JO,{icon:a}),(0,i.jsx)("span",{className:n,children:c}),!!m&&(0,i.jsx)(U.Ct,{color:"white",info:m})]}),o&&d&&(0,i.jsx)(o,{onClose:u})]})})),bt="rgba(34, 36, 38, 0.12)",kt="5px",wt=U.zo.li`
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
    box-shadow: 0 ${kt} ${kt} -${kt} ${bt}, ${kt} 0 ${kt} -${kt} ${bt}, -${kt} 0 ${kt} -${kt} ${bt};
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
`,Ct=u.memo((function({className:e="",isActive:n,name:t,routes:r}){return 1===r.length&&"settings"===r[0].group?(0,i.jsx)(yt,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:r[0]}):(0,i.jsxs)(wt,{className:`${e} ${n?"isActive":""}`,children:[(0,i.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,i.jsx)("span",{className:"smallHide",children:t}),(0,i.jsx)(U.JO,{className:"smallShow",icon:r[0].icon}),(0,i.jsx)(U.JO,{icon:"caret-down"})]}),(0,i.jsx)("ul",{className:"groupMenu",children:r.map((e=>(0,i.jsx)(yt,{route:e},e.name)))})]})}));var jt=t(39082),At=t(52727);const Nt=`apps v${"0.124.2-120-x".replace("-x","")}`,St=U.zo.div`
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
`,It=u.memo((function({className:e=""}){const{api:n,isApiReady:t}=(0,S.h)();return(0,i.jsxs)(St,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,i.jsxs)("div",{className:"node",children:[(0,i.jsx)(jt.Z,{})," ",(0,i.jsx)(At.Z,{label:"v"})]}),(0,i.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,i.jsx)("div",{children:Nt})]})}));const Zt=U.zo.div`
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
`,$t=u.memo((function({className:e=""}){const{t:n}=$(),{allAccounts:t,hasAccounts:r}=(0,Hn.x)(),o=(0,S.h)(),{allowTeleport:s}=(0,Kn.M)(),a=(0,Ln.W7)(o.isApiReady&&o.api.query.sudo?.key),l=(0,P.TH)(),c=(0,u.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(n)),p=(0,u.useRef)(Wn(n)),d=(0,u.useRef)({accounts:n("Accounts"),developer:n("Developer"),files:n("Files"),governance:n("Governance"),network:n("Network"),settings:n("Settings")}),m=(0,u.useMemo)((()=>!!a&&t.some((e=>a.eq(e)))),[t,a]),g=(0,u.useMemo)((()=>function(e,n,t,i,r,o){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:i},r,o,s,{isDevelopment:a,isHidden:l,needsAccounts:c,needsApi:p,needsApiCheck:d,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!o||p&&(!t||!n||m&&!s||g&&!r||!i&&a||0!==Pn(e,p,u,d).length))}(t,i,r,o,e)))}))).filter((({routes:e})=>e.length))}(p.current,d.current,o,s,r,m)),[s,o,r,m]),h=(0,u.useMemo)((()=>p.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,i.jsx)(Zt,{className:`${e}${o.isApiReady&&o.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,i.jsxs)("div",{className:"menuContainer",children:[(0,i.jsxs)("div",{className:"menuSection",children:[(0,i.jsx)(xt,{}),(0,i.jsx)("ul",{className:"menuItems",children:g.map((({name:e,routes:n})=>(0,i.jsx)(Ct,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,i.jsx)("div",{className:"menuSection media--1200",children:(0,i.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,i.jsx)(yt,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,i.jsx)(It,{className:"media--1400"})]})})})),Ut=u.memo((function(){const{api:e,isApiReady:n}=(0,S.h)(),t=(0,Ln.W7)(n&&e.derive.accounts?.indexes),r=(0,Ln.W7)(n&&e.query.identity?.registrars),o=(0,Ln.W7)(n&&e.query.balances?.totalIssuance),[s,a]=(0,u.useState)(!1);return(0,u.useEffect)((()=>{a(!!t||!!o||!!r)}),[]),(0,i.jsx)("div",{className:`apps--api-warm ${s.toString()}`})})),zt=j.z.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,Rt=u.memo((function({className:e=""}){const{themeClassName:n}=(0,N.F)(),{apiEndpoint:t,isDevelopment:r}=(0,S.h)(),o=(0,u.useMemo)((()=>r?void 0:t?.ui.color),[t,r]);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(A.Z,{uiHighlight:o}),(0,i.jsxs)(zt,{className:`${e} apps--Wrapper ${n}`,children:[(0,i.jsx)($t,{}),(0,i.jsxs)(C.Z,{children:[(0,i.jsx)(I.Z,{children:(0,i.jsx)(Gn,{})}),(0,i.jsx)(M,{}),(0,i.jsx)("div",{id:"portals"})]})]}),(0,i.jsx)(Ut,{})]})})),Tt={theme:"dark"},Wt={theme:"light"};function Et({uiTheme:e}){const n="dark"===e?"dark":"light";return document&&document.documentElement&&document.documentElement.setAttribute("data-theme",n),"dark"===e?Tt:Wt}const qt=u.memo((function({isElectron:e,store:n}){const[t,r]=(0,u.useState)((()=>Et(c.X)));return(0,u.useEffect)((()=>{c.X.on("change",(e=>r(Et(e))))}),[]),(0,i.jsx)(u.Suspense,{fallback:"...",children:(0,i.jsx)(h.f6,{theme:t,children:(0,i.jsx)(v.q,{children:(0,i.jsx)(x.ApiCtxRoot,{apiUrl:c.X.apiUrl,isElectron:e,store:n,children:(0,i.jsx)(f.y,{children:(0,i.jsx)(y.u,{children:(0,i.jsx)(b.g,{children:(0,i.jsx)(k.w,{children:(0,i.jsx)(g.UT,{children:(0,i.jsx)(w.A,{children:(0,i.jsx)(Rt,{})})})})})})})})})})})})),Ot="root",Mt=document.getElementById(Ot);if(!Mt)throw new Error(`Unable to find element with id '${Ot}'`);(0,m.s)(Mt).render((0,i.jsx)(qt,{isElectron:!1}))},29038:(e,n,t)=>{var i={".":[57139,9],"./":[57139,9],"./Api":[34777,9],"./Api.tsx":[34777,9],"./hoc":[69356,9],"./hoc/":[69356,9],"./hoc/api":[94356,9],"./hoc/api.tsx":[94356,9],"./hoc/call":[98727,9],"./hoc/call.tsx":[98727,9],"./hoc/callDiv":[3364,9],"./hoc/callDiv.tsx":[3364,9],"./hoc/calls":[5246,9],"./hoc/calls.ts":[5246,9],"./hoc/index":[69356,9],"./hoc/index.ts":[69356,9],"./hoc/multi":[60028,9],"./hoc/multi.ts":[60028,9],"./hoc/observable":[33989,9],"./hoc/observable.tsx":[33989,9],"./hoc/onlyOn":[35475,9],"./hoc/onlyOn.tsx":[35475,9],"./hoc/types":[68570,9,8570],"./hoc/types.ts":[68570,9,8570],"./index":[57139,9],"./index.ts":[57139,9],"./light":[36956,9],"./light.spec":[58705,9,8705],"./light.spec.ts":[58705,9,8705],"./light/":[36956,9],"./light/index":[36956,9],"./light/index.ts":[36956,9],"./light/kusama":[37178,9],"./light/kusama/":[37178,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[37178,9],"./light/kusama/index.ts":[37178,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[15299,9],"./light/polkadot/":[15299,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[15299,9],"./light/polkadot/index.ts":[15299,9],"./transform/echo":[80522,9],"./transform/echo.ts":[80522,9],"./typeRegistry":[23802,9],"./typeRegistry.ts":[23802,9],"./types":[55903,9,5903],"./types.ts":[55903,9,5903],"./urlTypes":[81369,9],"./urlTypes.ts":[81369,9],"./util":[41186,9],"./util/":[41186,9],"./util/getEnvironment":[68372,9],"./util/getEnvironment.ts":[68372,9],"./util/historic":[77809,9],"./util/historic.ts":[77809,9],"./util/index":[41186,9],"./util/index.ts":[41186,9],"./util/intervalObservable":[71951,9],"./util/intervalObservable.ts":[71951,9],"./util/isEqual":[65345,9],"./util/isEqual.ts":[65345,9],"./util/triggerChange":[74733,9],"./util/triggerChange.ts":[74733,9]};function r(e){if(!t.o(i,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=i[e],r=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(r,16|n[1])))}r.keys=()=>Object.keys(i),r.id=29038,e.exports=r},69314:()=>{},18983:()=>{},33196:()=>{},38087:()=>{},74854:()=>{},66602:()=>{},85338:()=>{}},e=>{e.O(0,[6677,4668,5744,584,1064,4124,2440,434,9398,9e3,8043,7924,212,2044,2854,5320,9684,2021,738,344,760,6829,5005,9319,2208,136,9768,6641,3990,3803,2871,3108,353,7175,4292,7496,3305,9121,1454,8291,4635,5502,3569,1295,3508,8758,5609,5831,7324,9355,5273,8717,9032,9013,5953,8438,7057,1211,5512,7564,9946,7368,7965,4234],(()=>(43673,e(e.s=43673)))),e.O()}]);