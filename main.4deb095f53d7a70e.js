(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{69794:(e,n,t)=>{"use strict";var r=t(52322),i=t(46157),o=t(48834).Buffer;try{3===o.from([1,2,3]).length&&(i.Ur.Buffer=o)}catch{}var a=t(85168),s=t(23729),l=t.n(s),c=t(33318),d=t(83337),p=t(16039),u=t(48731);const m=function(){const e=a.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,u.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,u.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,c.Rf)((()=>"")),{ipnsChain:t}=(0,d.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const r=l().get("settings")||{},i=n.find((({value:e})=>!!e));return[r.apiUrl,void 0].includes(p.X.apiUrl)?p.X.apiUrl:i?i.value:"ws://127.0.0.1:9944"}();p.X.set({apiUrl:m}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(m),t(94953);var g=t(2784),h=t(17029),f=t(39857),x=t(31383),v=t(57139),y=t(87561),k=t(3773),b=t(68944),w=t(57120),C=t(44028),j=t(91012),A=t(13105),I=t(4952),N=t(68235),S=t(37731),R=t(3663),$=t(61349);function Z(){return(0,$.$G)("apps")}var U=t(38894);const F=N.zo.div`
  background: var(--bg-menu);
  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-left-width: 0.25rem;
  line-height: 1.5em;
  padding: 0 1rem;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  z-index: 500;

  &.isBottom {
    position: static;
    z-index: 0;
  }

  &.isFull {
    left: 0.75rem;
  }

  &.isPartial {
    max-width: 42rem;
    width: 42rem;

    .content {
      max-width: 50rem;
    }
  }

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
`,T=g.memo((function({children:e,className:n="",icon:t,isBottom:i=!1,isDev:o,isFull:a=!1,type:s}){const[l,c]=(0,U.O)(),d=(0,g.useCallback)((()=>{o&&localStorage.setItem("dev:notification",(new Date).toString()),c()}),[o,c]);return(0,g.useEffect)((()=>{const e=localStorage.getItem("dev:notification");if(e){const n=new Date(e);n.setMonth(n.getMonth()+1),n.getTime()<=(new Date).getTime()?localStorage.removeItem("dev:notification"):c()}}),[c]),l?null:(0,r.jsx)(F,{className:`${n} ${"error"===s?"isError":"isInfo"} ${i?"isBottom":"isTop"} ${a?"isFull":"isPartial"}`,children:(0,r.jsxs)("div",{className:"content",children:[(0,r.jsx)(N.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,r.jsx)("div",{className:"contentItem",children:e}),(0,r.jsx)(N.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:d})]})})})),q=N.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .connecting {
    padding-block: calc(3.5rem + 56px);
  }

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,z=()=>{const{themeClassName:e}=(0,R.F)(),{t:n}=Z();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(S.Z,{}),(0,r.jsxs)(q,{className:` apps--Wrapper ${e}`,children:[(0,r.jsx)(T,{icon:"globe",type:"info",children:(0,r.jsx)("div",{children:n("Waiting to establish a connection with the remote endpoint.")})}),(0,r.jsx)("div",{className:"connecting",children:(0,r.jsx)(N.$j,{label:"Initializing connection"})}),(0,r.jsx)("div",{id:"portals"})]})]})};var E=t(90778),W=t(54984),O=t(73557),M=t(76655),P=t(10189);function B(e){return{Component:M.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:P.Z}}var D=t(21508);function H(e){return{Component:D.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var L=t(49307),J=t(58370);function X(e){return{Component:L.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:J.Z}}var V=t(18760),_=t(80901);function G(e){return{Component:V.Z,display:{needsApi:["tx.ambassadorCollective.vote","tx.ambassadorReferenda.submit","consts.ambassadorReferenda.tracks"]},group:"governance",icon:"user-friends",name:"ambassador",text:e("nav.ambassador","Ambassador",{ns:"apps-routing"}),useCounter:_.Z}}var K=t(41155);function Y(e){return{Component:K.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var Q=t(95039),ee=t(19739);function ne(e){return{Component:Q.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:ee.Z}}var te=t(61817);function re(e){return{Component:te.Z,display:{needsApi:["query.broker.status"],needsApiInstances:!0},group:"network",icon:"flask",name:"broker",text:e("nav.broker","Coretime Broker",{ns:"app-broker"})}}var ie=t(6742);function oe(e){return{Component:ie.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var ae=t(75798),se=t(73352),le=t(31725),ce=t(84195),de=t(48834).Buffer;function pe(){try{if(!de.from([1,2,3])?.length)return console.error("ERROR: Unable to construct Buffer object for claims module"),!1;if(!le.cR||!de.isBuffer((0,ce.Y)(new Uint8Array([1,2,3]))))return console.error("ERROR: Unable to use u8aToBuffer for claims module"),!1}catch{return console.error("ERROR: Fatal error in working with Buffer module"),!1}return!0}function ue(e){return{Component:ae.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"],needsApiCheck:pe},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:se.Z}}var me=t(2799);function ge(e){return{Component:me.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var he=t(22516);function fe(e){try{return(0,u.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch{return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function xe(e){return{Component:he.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:fe},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var ve=t(69558);function ye(e){return{Component:ve.Z,display:{needsApi:["query.coretimeAssignmentProvider.coreDescriptors"],needsApiInstances:!0},group:"network",icon:"flask",name:"coretime",text:e("nav.coretime","Coretime",{ns:"apps-routing"})}}var ke=t(18324),be=t(40740);function we(e){return{Component:ke.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:be.Z}}var Ce=t(50472),je=t(61491);function Ae(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch{return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function Ie(e){return{Component:Ce.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:Ae},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:je.Z}}var Ne=t(51406);function Se(e){return{Component:Ne.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var Re=t(38080);function $e(e){return{Component:Re.Z,display:{needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var Ze=t(58064),Ue=t(16472);function Fe(e){return{Component:Ze.Z,display:{needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:Ue.Z}}var Te=t(31043);function qe(e){return{Component:Te.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var ze=t(79865);function Ee(e){return{Component:ze.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var We=t(30145);function Oe(e){return{Component:We.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var Me=t(51213),Pe=t(16743);function Be(e){return{Component:Me.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:Pe.Z}}var De=t(50313);function He(e){return{Component:De.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var Le=t(90992);function Je(e){return{Component:Le.Z,display:{needsApi:["tx.nis.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"nis",text:e("nav.nis","Non-interactive Staking",{ns:"apps-routing"})}}var Xe=t(3714);function Ve(e){return{Component:Xe.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var _e=t(94349);function Ge(e){return{Component:_e.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var Ke=t(97662);function Ye(e){return{Component:Ke.Z,display:{needsAccounts:!0,needsApi:["query.preimage.statusFor","tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var Qe=t(41857),en=t(76288);function nn(e){return{Component:Qe.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:en.Z}}var tn=t(89139),rn=t(1398);function on(e){return{Component:tn.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:rn.Z}}var an=t(6583);function sn(e){return{Component:an.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var ln=t(39117);function cn(e){return{Component:ln.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var dn=t(14673);function pn(e){return{Component:dn.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var un=t(92403),mn=t(76075);function gn(e){return{Component:un.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:mn.Z}}var hn=t(24569);function fn(e){return{Component:hn.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var xn=t(96246),vn=t(58900);function yn(e){return{Component:xn.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:vn.Z}}var kn=t(66776),bn=t(56949),wn=t(19729),Cn=t(95292);function jn(e){try{if(e.query.stakingAhClient||e.tx.stakingRcClient)return!1;const{nominatorCount:n,own:t,pageCount:r,total:i}=e.registry.createType((0,wn.P)(e.registry,e.query.staking.erasStakersOverview.creator.meta.type),{nominatorCount:Cn.If,own:Cn.If,pageCount:Cn.If,total:Cn.If});(0,u.hu)(i&&t&&n&&r&&i.eq(Cn.If)&&t.eq(Cn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(bn.TS,Cn.If,{Account:bn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(Cn.If,{Account:bn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,wn.P)(e.registry,e.query.staking.claimedRewards.creator.meta.type),[0]);(0,u.hu)(n.eq([0]),"Needs a legacyClaimedRewards array")}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function An(e){return{Component:kn.Z,display:{needsApi:["query.staking.erasStakersOverview","tx.staking.bond"],needsApiCheck:jn},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var In=t(87905);function Nn(e){try{return!!(e.tx.stakingAhClient||e.tx.staking&&e.tx.stakingRcClient)}catch{return!1}}function Sn(e){return{Component:In.Z,display:{needsApi:[],needsApiCheck:Nn},group:"network",icon:"certificate",name:"staking-async",text:e("nav.staking-async","Staking Async",{ns:"apps-routing"})}}var Rn=t(97473);function $n(e){try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,wn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:Cn.If,who:bn.TS}],own:Cn.If,total:Cn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(Cn.If)&&r.eq(Cn.If)&&n.eq(Cn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(bn.TS,Cn.If,{Account:bn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(Cn.If,{Account:bn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function Zn(e){return{Component:Rn.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:$n},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var Un=t(77854);function Fn(e){if("function"==typeof e.query.staking.erasStakersOverview)return!1;try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,wn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:Cn.If,who:bn.TS}],own:Cn.If,total:Cn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(Cn.If)&&r.eq(Cn.If)&&n.eq(Cn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(bn.TS,Cn.If,{Account:bn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(Cn.If,{Account:bn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,wn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{claimedRewards:[1,2,3]});if(n.claimedRewards)(0,u.hu)(n.claimedRewards.eq([1,2,3]),"Needs a claimedRewards array");else{const n=e.registry.createType((0,wn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{legacyClaimedRewards:[1,2,3]});(0,u.hu)(n.legacyClaimedRewards.eq([1,2,3]),"Needs a legacyClaimedRewards array")}}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function Tn(e){return{Component:Un.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:Fn},group:"network",icon:"certificate",name:"legacy-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var qn=t(46717);function zn(e){return{Component:qn.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var En=t(54676);function Wn(e){return{Component:En.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var On=t(75509),Mn=t(87340);function Pn(e){return{Component:On.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:Mn.Z}}var Bn=t(9847);function Dn(e){return{Component:Bn.Z,Modal:Bn.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}function Hn(e){return{Component:N.Zd,Modal:N.Zd,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transferKeepAlive"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var Ln=t(74425),Jn=t(9039);function Xn(e){return{Component:Ln.Z,display:{needsApi:["query.treasury.proposals"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:Jn.Z}}var Vn=t(27008);function _n(e){return{Component:Vn.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var Gn=t(7644);function Kn(e){return{Component:Gn.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function Yn(e){return[B(e),H(e),Se(e),ue(e),Ge(e),Hn(e),Dn(e),Sn(e),An(e),Zn(e),Tn(e),ge(e),re(e),ye(e),on(e),Be(e),X(e),G(e),Fe(e),nn(e),Ye(e),Kn(e),Ie(e),we(e),Pn(e),Xn(e),ne(e),Ve(e),Y(e),He(e),yn(e),Je(e),Ee(e),pn(e),oe(e),xe(e),zn(e),$e(e),sn(e),cn(e),fn(e),Wn(e),qe(e),Oe(e),_n(e),gn(e)]}var Qn=t(86135),et=t(59149),nt=t(82671),tt=t(33661);function rt(e,n,t){const[r,i,o]=n.split("."),[a]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),i)||[i],s=e[r][a]?a:i;try{return"consts"===r?(0,nt.K)(e[r][s][o]):(0,tt.m)(e[r][s][o])}catch{return!1}}function it(e,n,t=!1,r){if(!n)return[];const i=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,r)=>n||rt(e,r,t)),!1):rt(e,n,t))));return i.length||!r||r(e)?i:["needsApiCheck"]}const ot=g.memo((function({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,r.jsx)(O.Fg,{to:"/explorer"})}));var at=t(34814),st=t(9118),lt=t(64021),ct=t(69516);let dt;const pt=g.memo((function({optionsAll:e}){const{queueAction:n}=(0,Qn.L)(),{api:t,isApiReady:i}=(0,E.h)(),{allAccounts:o}=(0,at.x)(),{t:a}=Z(),s=(0,st.W7)(i&&t.query.system?.events);return(0,g.useEffect)((()=>{const t=function(e,n,t,r){const i=(0,ct.R)((0,lt.d)(JSON.stringify(r)));return t&&r&&i!==dt?(dt=i,r.map((({event:{data:t,method:r,section:i}})=>{if("balances"===i&&"Transfer"===r){const o=t[1].toString();if(e.includes(o))return{account:o,action:`${i}.${r}`,message:n("transfer received"),status:"event"}}else if("democracy"===i){const e=t[0].toString();return{action:`${i}.${r}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(o,a,e,s);t&&n(t)}),[o,s,e,n,a]),(0,r.jsx)(N.qb,{})})),ut={Component:ot,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"},mt=N.zo.div`
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
`,gt=g.memo((function({className:e}){const n=(0,O.TH)(),{t}=Z(),{api:i,isApiConnected:o,isApiReady:a,isDevelopment:s}=(0,E.h)(),{queueAction:l}=(0,Qn.L)(),{Component:c,display:{needsApi:d,needsApiCheck:p,needsApiInstances:u},icon:m,name:h,text:f}=(0,g.useMemo)((()=>{const e=n.pathname.slice(1)||"";return Yn(t).find((n=>n&&e.startsWith(n.name)&&(s||!n.display.isDevelopment)))||ut}),[s,n,t]),x=(0,g.useMemo)((()=>d?a&&o?it(i,d,u,p):null:[]),[i,o,a,d,p,u]);return(0,r.jsx)(mt,{className:e,children:x?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(N.SV,{trigger:h,children:(0,r.jsx)(et.m.Provider,{value:{icon:m,text:f},children:x.length?(0,r.jsx)(ot,{basePath:`/${h}`,location:n,missingApis:x,onStatusChange:l}):(0,r.jsx)(c,{basePath:`/${h}`,location:n,onStatusChange:l})})})}),(0,r.jsx)(pt,{})]}):(0,r.jsx)("div",{className:"connecting",children:(0,r.jsx)(N.$j,{label:t("Initializing connection")})})})}));var ht=t(41411),ft=t(12176),xt=t(95689),vt=t(68058),yt=t(10072),kt=t(70676);const bt=N.zo.div`
  border-left: 0.25rem solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  margin: 0 0 0.25rem 0;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  position: relative;

  &.isUnreachable {
    opacity: var(--opacity-light);
  }

  &.isSelected {
    .markFavoriteSection {
      gap: 1rem;
      padding-bottom: 1rem;
    }
  }

  .markFavoriteSection {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    &:hover .ui--Icon {
      opacity: 0.5;
    }

    .ui--Icon {
      scale: 1.1;
      opacity: 0;
      transition: color 0.2s ease;

      &:hover {
        opacity: 0.5;
        stroke: darkorange;
        color: darkorange;
      }

      &.isFavorite {
        opacity: 1;
        stroke: darkorange;
        color: darkorange;
      }
    }
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
`,wt=g.memo((function({apiUrl:e,className:n="",isFavorite:t,setApiUrl:i,toggleFavoriteChain:o,value:{isChild:a,isRelay:s,isUnreachable:l,name:c,nameRelay:d,paraId:p,providers:u,ui:m}}){const{t:h}=Z(),f=(0,g.useMemo)((()=>u.some((({url:n})=>n===e))),[e,u]),x=(0,g.useMemo)((()=>u.map((({name:e,url:n})=>({text:e,value:n})))),[u]),v=(0,g.useCallback)((()=>{const e=u.filter((({url:e})=>!e.startsWith("light://")));if(0!==e.length)return i(c,e[Math.floor(Math.random()*e.length)].url);alert("No WebSocket (wss://) provider available")}),[c,u,i]),y=(0,g.useCallback)((e=>i(c,e)),[c,i]),k=(0,g.useCallback)((e=>{e.preventDefault(),e.stopPropagation(),o({chainName:c,paraId:p,relay:d})}),[c,p,d,o]);return(0,r.jsxs)(bt,{className:`${n}${f?" isSelected highlight--border":""}${l?" isUnreachable":""}`,children:[(0,r.jsxs)("div",{className:"markFavoriteSection"+(a?" isChild":""),onClick:l?void 0:v,children:[(0,r.jsxs)("div",{className:"endpointSection",children:[(0,r.jsx)(N.Mj,{className:"endpointIcon",isInline:!0,logo:m.logo||"empty",withoutHl:!0}),(0,r.jsxs)("div",{className:"endpointValue",children:[(0,r.jsx)("div",{children:c}),f&&(s||!!p)&&(0,r.jsx)("div",{className:"endpointExtra",children:s?h("Relay chain"):h(p&&p<1e3?"{{relay}} System":p&&p<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:d}})})]})]}),(0,r.jsx)(N.JO,{className:t?"isFavorite":"",icon:"star",onClick:k})]}),f&&(0,r.jsx)(N.Lt,{className:"isSmall",onChange:y,options:x,value:e,withLabel:!1})]})})),Ct="polkadot-app-favorite-chains",jt=(0,c.Rf)(((e,n)=>n?.toString()||e)),At=()=>{try{const e=localStorage.getItem(Ct);if(!e)return{};const n=JSON.parse(e);if("object"!=typeof n||null===n||Array.isArray(n))throw new Error("Invalid favorite chains format");const t={};for(const[e,r]of Object.entries(n)){if(!Array.isArray(r))throw new Error(`Invalid value for key "${e}": not an array`);if(!r.every((e=>"object"==typeof e&&null!==e&&"string"==typeof e.relay&&"number"==typeof e.paraId)))throw new Error(`Invalid entries under key "${e}"`);if(jt.find((n=>n.text===e))){const n=r.filter((e=>"Unknown"===e.relay||!!jt.find((n=>n.text===e.relay))));n.length>0&&(t[e]=n)}}return localStorage.setItem(Ct,JSON.stringify(t)),t}catch(e){return console.error("Failed to parse favorite chains:",e),localStorage.removeItem(Ct),{}}},It=(e,n)=>{try{const t=n.chainName,r={paraId:n.paraId??-1,relay:n.relay??"Unknown"},i=e[t];return!!Array.isArray(i)&&i.some((e=>e.relay===r.relay&&e.paraId===r.paraId))}catch(e){return console.error("Failed to check favorite chain:",e),!1}},Nt=N.zo.div`
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

    &.isFavoriteHeader {
      &:hover {
        background: linear-gradient(
          135deg,
          ${e=>e.highlightColor}f2 0%,
          ${e=>e.highlightColor}99 100%
        );
        color: ${e=>function(e){if("string"!=typeof e)return"#000000";let n=e.replace("#","").trim();if(3===n.length&&(n=n.split("").map((e=>e+e)).join("")),6!==n.length||/[^0-9a-f]/i.test(n))return"#000000";try{const e=parseInt(n.substring(0,2),16);return(.299*e+.587*parseInt(n.substring(2,4),16)+.114*parseInt(n.substring(4,6),16))/255>.5?"#000000":"#FFFFFF"}catch{return"#000000"}}(e.highlightColor)};
      }

      &::after {
        content: '⭐';
        margin-left: 8px;
        font-size: 16px;
      }
    }
  }

  .groupNetworks {
    padding: 0.25rem 0 0.5rem 1rem;
  }
`,St=g.memo((function({affinities:e,apiUrl:n,children:t,className:i="",favoriteChains:o,highlightColor:a,index:s,isSelected:l,setApiUrl:c,setGroup:d,toggleFavoriteChain:p,value:{header:u,isSpaced:m,networks:h}}){const f=(0,g.useCallback)((()=>d(l?-1:s)),[s,l,d]),x=(0,g.useMemo)((()=>u?.toString().includes("Favorite")),[u]),v=(0,g.useMemo)((()=>h.filter((({isUnreachable:e})=>!e))),[h]);return x&&0===Object.keys(o).length?(0,r.jsx)(r.Fragment,{}):(0,r.jsxs)(Nt,{className:`${i}${l?" isSelected":""}`,highlightColor:a,children:[(0,r.jsxs)("div",{className:`groupHeader${m?" isSpaced":""}${x?" isFavoriteHeader":""}`,onClick:f,children:[(0,r.jsx)(N.JO,{icon:l?"caret-up":"caret-down"}),u]}),l&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"groupNetworks",children:v.map(((t,i)=>(0,r.jsx)(wt,{affinity:e[t.name],apiUrl:n,isFavorite:It(o,{chainName:t.name,paraId:t.paraId,relay:t.nameRelay}),setApiUrl:c,toggleFavoriteChain:p,value:t},i)))}),t]})]})})),Rt="network:affinities";function $t(e){const n=At();let t=-1;const r=e.reduce(((e,r)=>{if(r.isHeader){const n="string"==typeof r.text&&r.text.includes("Favorite chains");e.push({header:r.text,isDevelopment:r.isDevelopment,isSpaced:r.isSpaced,networks:[]}),n&&(t=e.length-1)}else{const i=e[e.length-1],o={isLightClient:r.isLightClient,name:r.textBy,url:r.value};if(It(n,{chainName:r.text?.toString()??"",paraId:r.paraId,relay:r.textRelay?.toString()})&&-1!==t&&!r.isUnreachable){const n=e[t],i=n.networks[n.networks.length-1];i&&i.name===r.text&&i.nameRelay===r.textRelay&&i.paraId===r.paraId?i.providers.push(o):n.networks.push({isChild:r.isChild,isRelay:!!r.genesisHash,name:r.text,nameRelay:r.textRelay,paraId:r.paraId,providers:[o],ui:r.ui})}i.networks[i.networks.length-1]&&r.text===i.networks[i.networks.length-1].name?i.networks[i.networks.length-1].providers.push(o):r.isUnreachable||i.networks.push({isChild:r.isChild,isRelay:!!r.genesisHash,name:r.text,nameRelay:r.textRelay,paraId:r.paraId,providers:[o],ui:r.ui})}return e}),[]);return r.forEach((e=>{e.networks.length>=2&&e.networks[0].isRelay&&e.header?.toString().includes("parachains")&&([e.networks[0],e.networks[1]]=[e.networks[1],e.networks[0]])})),r}function Zt(){try{const e=localStorage.getItem(yt.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function Ut(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:p.X.get().apiUrl!==e,isUrlValid:(r=e,r.length>=7&&(r.startsWith("ws://")||r.startsWith("wss://")||r.startsWith("light://")))};var r}const Ft=(0,N.zo)(N.YE)`
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
`,Tt=g.memo((function({className:e="",offset:n,onClose:t}){const{t:i}=Z(),o=(0,c.Rf)(i),{apiEndpoint:a,isLocalFork:s}=(0,E.h)(),[d,u]=(0,g.useState)((()=>At())),[m,h]=(0,g.useState)((()=>$t(o))),[{apiUrl:f,groupIndex:x,hasUrlChanged:v,isUrlValid:y},k]=(0,g.useState)((()=>Ut(p.X.get().apiUrl,m))),[b,w]=(0,g.useState)((()=>Zt())),[C,j]=(0,g.useState)((()=>function(e){return Object.entries(l().get(Rt)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:r})=>e===n&&r.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(m))),A=(0,g.useRef)(null),I=(0,g.useMemo)((()=>{let e=!1;return o.some((n=>n.value===f&&(e=!0,!0))),e}),[f,o]),R=(0,g.useMemo)((()=>{let e=!1;return b.some((n=>n===f&&(e=!0,!0))),e}),[f,b]),$=(0,g.useCallback)((e=>k((n=>({...n,groupIndex:e})))),[]),U=(0,g.useCallback)((e=>{(e=>{try{const n=e.chainName,t={paraId:e.paraId??-1,relay:e.relay??"Unknown"},r=At(),i=r[n]??[];let o;o=i.some((e=>e.relay===t.relay&&e.paraId===t.paraId))?i.filter((e=>e.relay!==t.relay||e.paraId!==t.paraId)):[...i,t];const a={...r};0===o.length?delete a[n]:a[n]=o,localStorage.setItem(Ct,JSON.stringify(a))}catch{}})(e),u(At()),h($t((0,c.Rf)(i)))}),[i]),F=(0,g.useCallback)((()=>{if(!R)return;const e=b.filter((e=>e!==f));try{localStorage.setItem(yt.ie,JSON.stringify(e)),h($t((0,c.Rf)(i))),w(Zt())}catch(e){console.error(e)}}),[f,R,b,i]),T=(0,g.useCallback)(((e,n)=>{j((t=>{const r={...t,[e]:n};return l().set(Rt,r),r})),k((e=>({...Ut(n,m),groupIndex:e.groupIndex})))}),[m]),q=(0,g.useCallback)((e=>{(0,kt._)(e)||(e=vt.ZP.toASCII(e)),k((n=>({...Ut(e,m),groupIndex:n.groupIndex})))}),[m]),z=(0,g.useCallback)((()=>{l().set("localFork",""),p.X.set({...p.X.get(),apiUrl:f}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(f)}${window.location.hash}`),v||window.location.reload(),t()}),[f,t,v]),W=(0,g.useCallback)((()=>{l().set("localFork",f),p.X.set({...p.X.get(),apiUrl:f}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(f)}${window.location.hash}`),v||window.location.reload(),t()}),[f,t,v]),O=(0,g.useCallback)((()=>{try{localStorage.setItem(yt.ie,JSON.stringify([...b,f])),z()}catch(e){console.error(e)}}),[z,f,b]),M=(0,g.useMemo)((()=>function(e,n,t,r){return e?!n.startsWith("light://")&&!t:!r}(v,f,y,s)),[v,f,y,s]),P=(0,g.useMemo)((()=>function(e,n,t,r){return e?!!n.startsWith("light://")||!t:!!r}(v,f,y,s)),[v,f,y,s]);return(0,r.jsx)(Ft,{buttons:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(N.zx,{icon:"code-fork",isDisabled:P,label:i("Fork Locally"),onClick:W,tooltip:"fork-locally-btn"}),(0,r.jsx)(N.zx,{icon:"sync",isDisabled:M,label:i("Switch"),onClick:z})]}),className:e,offset:n,onClose:t,position:"left",sidebarRef:A,children:m.map(((e,n)=>(0,r.jsx)(St,{affinities:C,apiUrl:f,favoriteChains:d,highlightColor:a?.ui.color||S.B,index:n,isSelected:x===n,setApiUrl:T,setGroup:$,toggleFavoriteChain:U,value:e,children:e.isDevelopment&&(0,r.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,r.jsx)(N.II,{className:"endpointCustom",isError:!y,isFull:!0,label:i("custom endpoint"),onChange:q,value:f}),R?(0,r.jsx)(N.zx,{className:"customButton",icon:"trash-alt",onClick:F}):(0,r.jsx)(N.zx,{className:"customButton",icon:"save",isDisabled:!y||I,onClick:O})]})},n)))})})),qt=N.zo.div`
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
`,zt=g.memo((function({className:e}){const{api:n,isApiReady:t}=(0,E.h)(),i=(0,st.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:o}=(0,d.g)(),[a,s]=(0,U.O)(),l=!o;return(0,r.jsxs)(qt,{className:e,children:[(0,r.jsxs)("div",{className:`apps--SideBar-logo-inner${l?" isClickable":""} highlight--color-contrast`,onClick:s,children:[(0,r.jsx)(N.Mj,{}),(0,r.jsxs)("div",{className:"info media--1000",children:[(0,r.jsx)(ft.Z,{className:"chain"}),i&&(0,r.jsxs)("div",{className:"runtimeVersion",children:[i.specName.toString(),"/",i.specVersion.toNumber()]}),(0,r.jsx)(xt.Z,{className:"bestNumber",label:"#"})]}),l&&(0,r.jsx)(N.JO,{className:"dropdown",icon:a?"caret-right":"caret-down"})]}),a&&(0,r.jsx)(Tt,{onClose:s})]})})),Et=()=>0,Wt=N.zo.li`
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
`,Ot=g.memo((function({className:e="",classNameText:n,isLink:t,isToplevel:i,route:{Modal:o,href:a,icon:s,name:l,text:c,useCounter:d=Et}}){const[p,u]=(0,U.O)(),m=d();return(0,r.jsxs)(Wt,{className:`${e} ui--MenuItem ${m?"withCounter":""} ${t?"isLink":""} ${i?"topLevel highlight--color-contrast":""}`,children:[(0,r.jsxs)("a",{href:o?void 0:a||`#/${l}`,onClick:o?u:void 0,rel:"noopener noreferrer",target:a?"_blank":void 0,children:[(0,r.jsx)(N.JO,{icon:s}),(0,r.jsx)("span",{className:n,children:c}),!!m&&(0,r.jsx)(N.Ct,{color:"white",info:m})]}),o&&p&&(0,r.jsx)(o,{onClose:u})]})})),Mt="rgba(34, 36, 38, 0.12)",Pt="5px",Bt=N.zo.li`
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
    box-shadow: 0 ${Pt} ${Pt} -${Pt} ${Mt}, ${Pt} 0 ${Pt} -${Pt} ${Mt}, -${Pt} 0 ${Pt} -${Pt} ${Mt};
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
`,Dt=g.memo((function({className:e="",isActive:n,name:t,routes:i}){return 1===i.length&&"settings"===i[0].group?(0,r.jsx)(Ot,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:i[0]}):(0,r.jsxs)(Bt,{className:`${e} ${n?"isActive":""}`,children:[(0,r.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,r.jsx)("span",{className:"smallHide",children:t}),(0,r.jsx)(N.JO,{className:"smallShow",icon:i[0].icon}),(0,r.jsx)(N.JO,{icon:"caret-down"})]}),(0,r.jsx)("ul",{className:"groupMenu",children:i.map((e=>(0,r.jsx)(Ot,{route:e},e.name)))})]})}));var Ht=t(54194),Lt=t(39082),Jt=t(52727);const Xt=`apps v${Ht.b.version.replace("-x","")}`,Vt=N.zo.div`
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
`,_t=g.memo((function({className:e=""}){const{api:n,isApiReady:t}=(0,E.h)();return(0,r.jsxs)(Vt,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,r.jsxs)("div",{className:"node",children:[(0,r.jsx)(Lt.Z,{})," ",(0,r.jsx)(Jt.Z,{label:"v"})]}),(0,r.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,r.jsx)("div",{children:Xt})]})}));const Gt=N.zo.div`
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
`,Kt=g.memo((function({className:e=""}){const{t:n}=Z(),{allAccounts:t,hasAccounts:i}=(0,at.x)(),o=(0,E.h)(),{allowTeleport:a}=(0,ht.M)(),s=(0,st.W7)(o.isApiReady&&o.api.query.sudo?.key),l=(0,O.TH)(),c=(0,g.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(n)),d=(0,g.useRef)(Yn(n)),p=(0,g.useRef)({accounts:n("Accounts"),developer:n("Developer"),files:n("Files"),governance:n("Governance"),network:n("Network"),settings:n("Settings")}),u=(0,g.useMemo)((()=>!!s&&t.some((e=>s.eq(e)))),[t,s]),m=(0,g.useMemo)((()=>function(e,n,t,r,i,o){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:r},i,o,a,{isDevelopment:s,isHidden:l,needsAccounts:c,needsApi:d,needsApiCheck:p,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!o||d&&(!t||!n||m&&!a||g&&!i||!r&&s||0!==it(e,d,u,p).length))}(t,r,i,o,e)))}))).filter((({routes:e})=>e.length))}(d.current,p.current,o,a,i,u)),[a,o,i,u]),h=(0,g.useMemo)((()=>d.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,r.jsx)(Gt,{className:`${e}${o.isApiReady&&o.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,r.jsxs)("div",{className:"menuContainer",children:[(0,r.jsxs)("div",{className:"menuSection",children:[(0,r.jsx)(zt,{}),(0,r.jsx)("ul",{className:"menuItems",children:m.map((({name:e,routes:n})=>(0,r.jsx)(Dt,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,r.jsx)("div",{className:"menuSection media--1200",children:(0,r.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,r.jsx)(Ot,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,r.jsx)(_t,{className:"media--1400"})]})})})),Yt=window.location.host.startsWith("polkadot.js.org"),Qt=(0,c.Rf)((()=>"")).map((e=>e.dnslink)).reduce(((e,n)=>(n&&!e.includes(n)&&e.push(n),e)),[]),er=g.memo((function({className:e}){const{t:n}=Z(),{systemChain:t}=(0,E.h)(),i=(0,g.useMemo)((()=>{const e=t?.toLowerCase();return e&&Qt.includes(e)?`https://${e}.dotapps.io`:"https://dotapps.io"}),[t]);return Yt?(0,r.jsx)(T,{className:e,icon:"link",isBottom:!0,isDev:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("You are connected to the development instance of the UI. For a fully decentralized experience, you are encouraged to use the IPFS deployed version as the canonical URL: "),(0,r.jsx)("a",{href:i,rel:"noreferrer",target:"_blank",children:i.replace("https://","")})]})}):null})),nr=g.memo((function({className:e}){const{t:n}=Z(),{isLocalFork:t}=(0,E.h)();return t?(0,r.jsx)(T,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("Local fork powered by "),(0,r.jsx)("a",{href:"https://github.com/AcalaNetwork/chopsticks",rel:"noreferrer",target:"_blank",children:"Chopsticks"}),"."]})}):null})),tr=N.zo.div`
  position: fixed;
  bottom: 0.75rem;
  right: 0.75rem;
  left: 0.75rem;
  top: auto;
  padding: 1rem;
  z-index: 500;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;;
  div.isInfo:before {
    content: none;
  }
`,rr=g.memo((function({className:e}){return(0,r.jsxs)(tr,{className:e,children:[(0,r.jsx)(nr,{}),(0,r.jsx)(er,{})]})})),ir=p.X.apiType.param,or="json-rpc"===p.X.apiType.type&&"string"==typeof ir&&ir.startsWith("ws://"),ar="string"==typeof ir&&ir.includes("127.0.0.1"),sr=window.location.protocol.startsWith("https:"),lr=g.memo((function({className:e}){const{t:n}=Z(),{apiError:t,isApiConnected:i,isApiReady:o,isWaitingInjected:a}=(0,E.h)();return t?(0,r.jsx)(T,{className:e,icon:"globe",type:"error",children:(0,r.jsx)("div",{children:t})}):o?a?(0,r.jsx)(T,{className:e,icon:"puzzle-piece",type:"info",children:(0,r.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):i?null:(0,r.jsxs)(T,{className:e,icon:"globe",type:"error",children:[(0,r.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),or&&!ar&&sr?(0,r.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:ir}})}):void 0]}):(0,r.jsx)(T,{className:e,icon:"globe",type:"info",children:(0,r.jsx)("div",{children:n(i?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})})),cr=g.memo((function(){const{api:e,apiIdentity:n,isApiReady:t}=(0,E.h)(),i=(0,st.W7)(t&&e.derive.accounts?.indexes),o=(0,st.W7)(t&&n.query.identity?.registrars),a=(0,st.W7)(t&&e.query.balances?.totalIssuance),[s,l]=(0,g.useState)(!1);return(0,g.useEffect)((()=>{l(!!i||!!a||!!o)}),[]),(0,r.jsx)("div",{className:`apps--api-warm ${s.toString()}`})})),dr=N.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,pr=g.memo((function({className:e=""}){const{themeClassName:n}=(0,R.F)(),{apiEndpoint:t,isDevelopment:i}=(0,E.h)(),o=(0,g.useMemo)((()=>i?void 0:t?.ui.color),[t,i]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(S.Z,{uiHighlight:o}),(0,r.jsxs)(dr,{className:`${e} apps--Wrapper ${n}`,children:[(0,r.jsx)(Kt,{}),(0,r.jsxs)(N.J0,{children:[(0,r.jsx)(W.ZP,{children:(0,r.jsx)(gt,{})}),(0,r.jsx)(lr,{}),(0,r.jsx)(rr,{}),(0,r.jsx)("div",{id:"portals"})]})]}),(0,r.jsx)(cr,{})]})}));function ur({uiTheme:e}){const n="dark"===e?"dark":"light";return document?.documentElement?.setAttribute("data-theme",n),{theme:n}}const mr=g.memo((function({isElectron:e,store:n}){const[t,i]=(0,g.useState)((()=>ur(p.X)));return(0,g.useEffect)((()=>{p.X.on("change",(e=>i(ur(e))))}),[]),(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(x.f6,{theme:t,children:(0,r.jsx)(y.q,{children:(0,r.jsx)(v.ApiCtxRoot,{apiUrl:p.X.apiUrl,beforeApiInit:(0,r.jsx)(z,{}),isElectron:e,store:n,children:(0,r.jsx)(k.y,{children:(0,r.jsx)(b.u,{children:(0,r.jsx)(w.g,{children:(0,r.jsx)(C.w,{children:(0,r.jsx)(f.UT,{children:(0,r.jsx)(j.A,{children:(0,r.jsx)(A.U,{children:(0,r.jsx)(I.W_,{children:(0,r.jsx)(pr,{})})})})})})})})})})})})})})),gr="root",hr=document.getElementById(gr);if(!hr)throw new Error(`Unable to find element with id '${gr}'`);(0,h.s)(hr).render((0,r.jsx)(mr,{isElectron:!1}))},29038:(e,n,t)=>{var r={".":[57139,9],"./":[57139,9],"./Api":[8188,9],"./Api.tsx":[8188,9],"./hoc":[69356,9],"./hoc/":[69356,9],"./hoc/api":[94356,9],"./hoc/api.tsx":[94356,9],"./hoc/call":[98727,9],"./hoc/call.tsx":[98727,9],"./hoc/callDiv":[3364,9],"./hoc/callDiv.tsx":[3364,9],"./hoc/calls":[5246,9],"./hoc/calls.ts":[5246,9],"./hoc/index":[69356,9],"./hoc/index.ts":[69356,9],"./hoc/multi":[60028,9],"./hoc/multi.ts":[60028,9],"./hoc/observable":[33989,9],"./hoc/observable.tsx":[33989,9],"./hoc/onlyOn":[35475,9],"./hoc/onlyOn.tsx":[35475,9],"./hoc/types":[68570,9,8570],"./hoc/types.ts":[68570,9,8570],"./index":[57139,9],"./index.ts":[57139,9],"./light":[36956,9],"./light.spec":[58705,9,8705],"./light.spec.ts":[58705,9,8705],"./light/":[36956,9],"./light/index":[36956,9],"./light/index.ts":[36956,9],"./light/kusama":[37178,9],"./light/kusama/":[37178,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[37178,9],"./light/kusama/index.ts":[37178,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[15299,9],"./light/polkadot/":[15299,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[15299,9],"./light/polkadot/index.ts":[15299,9],"./light/polkadot/laos.json":[54689,3,4689],"./statics":[95267,9],"./statics.ts":[95267,9],"./transform/echo":[80522,9],"./transform/echo.ts":[80522,9],"./types":[55903,9,5903],"./types.ts":[55903,9,5903],"./urlTypes":[81369,9],"./urlTypes.ts":[81369,9],"./util":[41186,9],"./util/":[41186,9],"./util/getEnvironment":[68372,9],"./util/getEnvironment.ts":[68372,9],"./util/historic":[77809,9],"./util/historic.ts":[77809,9],"./util/index":[41186,9],"./util/index.ts":[41186,9],"./util/intervalObservable":[71951,9],"./util/intervalObservable.ts":[71951,9],"./util/isEqual":[65345,9],"./util/isEqual.ts":[65345,9],"./util/triggerChange":[74733,9],"./util/triggerChange.ts":[74733,9]};function i(e){if(!t.o(r,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=r[e],i=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(i,16|n[1])))}i.keys=()=>Object.keys(r),i.id=29038,e.exports=i},18983:()=>{},33196:()=>{},38087:()=>{},74854:()=>{},66602:()=>{}},e=>{e.O(0,[6677,4668,6105,6489,1064,4124,2440,434,9398,9e3,8043,7924,212,2044,2854,5320,9684,2021,738,344,760,6829,5005,9319,2208,136,8484,893,6641,2685,2871,3108,353,3882,4292,9065,1080,2107,9121,62,1458,1454,8291,4635,5502,3569,6744,8758,7965,6510,3164],(()=>(69794,e(e.s=69794)))),e.O()}]);