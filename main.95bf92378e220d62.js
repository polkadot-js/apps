(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{69794:(e,n,t)=>{"use strict";var r=t(52322),i=t(46157),o=t(48834).Buffer;try{3===o.from([1,2,3]).length&&(i.Ur.Buffer=o)}catch{}var a=t(85168),s=t(23729),l=t.n(s),c=t(33318),d=t(83337),p=t(16039),u=t(48731);const m=function(){const e=a.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,u.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,u.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,c.Rf)((()=>"")),{ipnsChain:t}=(0,d.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const r=l().get("settings")||{},i=n.find((({value:e})=>!!e));return[r.apiUrl,void 0].includes(p.X.apiUrl)?p.X.apiUrl:i?i.value:"ws://127.0.0.1:9944"}();p.X.set({apiUrl:m}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(m),t(94953);var g=t(2784),h=t(17029),f=t(39857),x=t(31383),v=t(57139),y=t(87561),k=t(3773),b=t(68944),w=t(57120),C=t(44028),j=t(91012),A=t(13105),I=t(68235),N=t(37731),S=t(3663),R=t(61349);function $(){return(0,R.$G)("apps")}var Z=t(38894);const U=I.zo.div`
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
`,F=g.memo((function({children:e,className:n="",icon:t,isBottom:i=!1,isDev:o,isFull:a=!1,type:s}){const[l,c]=(0,Z.O)(),d=(0,g.useCallback)((()=>{o&&localStorage.setItem("dev:notification",(new Date).toString()),c()}),[o,c]);return(0,g.useEffect)((()=>{const e=localStorage.getItem("dev:notification");if(e){const n=new Date(e);n.setMonth(n.getMonth()+1),n.getTime()<=(new Date).getTime()?localStorage.removeItem("dev:notification"):c()}}),[c]),l?null:(0,r.jsx)(U,{className:`${n} ${"error"===s?"isError":"isInfo"} ${i?"isBottom":"isTop"} ${a?"isFull":"isPartial"}`,children:(0,r.jsxs)("div",{className:"content",children:[(0,r.jsx)(I.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,r.jsx)("div",{className:"contentItem",children:e}),(0,r.jsx)(I.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:d})]})})})),T=I.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .connecting {
    padding-block: calc(3.5rem + 56px);
  }

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,q=()=>{const{themeClassName:e}=(0,S.F)(),{t:n}=$();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(N.Z,{}),(0,r.jsxs)(T,{className:` apps--Wrapper ${e}`,children:[(0,r.jsx)(F,{icon:"globe",type:"info",children:(0,r.jsx)("div",{children:n("Waiting to establish a connection with the remote endpoint.")})}),(0,r.jsx)("div",{className:"connecting",children:(0,r.jsx)(I.$j,{label:"Initializing connection"})}),(0,r.jsx)("div",{id:"portals"})]})]})};var z=t(90778),E=t(54984),W=t(73557),O=t(88122),M=t(10189);function P(e){return{Component:O.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:M.Z}}var B=t(21508);function D(e){return{Component:B.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var H=t(49307),L=t(58370);function J(e){return{Component:H.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:L.Z}}var X=t(18760),V=t(80901);function _(e){return{Component:X.Z,display:{needsApi:["tx.ambassadorCollective.vote","tx.ambassadorReferenda.submit","consts.ambassadorReferenda.tracks"]},group:"governance",icon:"user-friends",name:"ambassador",text:e("nav.ambassador","Ambassador",{ns:"apps-routing"}),useCounter:V.Z}}var G=t(41155);function K(e){return{Component:G.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var Y=t(95039),Q=t(19739);function ee(e){return{Component:Y.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:Q.Z}}var ne=t(61817);function te(e){return{Component:ne.Z,display:{needsApi:["query.broker.status"],needsApiInstances:!0},group:"network",icon:"flask",name:"broker",text:e("nav.broker","Coretime Broker",{ns:"app-broker"})}}var re=t(6742);function ie(e){return{Component:re.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var oe=t(75798),ae=t(73352),se=t(31725),le=t(84195),ce=t(48834).Buffer;function de(){try{if(!ce.from([1,2,3])?.length)return console.error("ERROR: Unable to construct Buffer object for claims module"),!1;if(!se.cR||!ce.isBuffer((0,le.Y)(new Uint8Array([1,2,3]))))return console.error("ERROR: Unable to use u8aToBuffer for claims module"),!1}catch{return console.error("ERROR: Fatal error in working with Buffer module"),!1}return!0}function pe(e){return{Component:oe.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"],needsApiCheck:de},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:ae.Z}}var ue=t(2799);function me(e){return{Component:ue.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var ge=t(22516);function he(e){try{return(0,u.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch{return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function fe(e){return{Component:ge.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:he},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var xe=t(69558);function ve(e){return{Component:xe.Z,display:{needsApi:["query.coretimeAssignmentProvider.coreDescriptors"],needsApiInstances:!0},group:"network",icon:"flask",name:"coretime",text:e("nav.coretime","Coretime",{ns:"apps-routing"})}}var ye=t(18324),ke=t(40740);function be(e){return{Component:ye.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:ke.Z}}var we=t(50472),Ce=t(61491);function je(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch{return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function Ae(e){return{Component:we.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:je},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:Ce.Z}}var Ie=t(51406);function Ne(e){return{Component:Ie.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var Se=t(38080);function Re(e){return{Component:Se.Z,display:{needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var $e=t(58064),Ze=t(16472);function Ue(e){return{Component:$e.Z,display:{needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:Ze.Z}}var Fe=t(31043);function Te(e){return{Component:Fe.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var qe=t(79865);function ze(e){return{Component:qe.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var Ee=t(30145);function We(e){return{Component:Ee.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var Oe=t(51213),Me=t(16743);function Pe(e){return{Component:Oe.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:Me.Z}}var Be=t(50313);function De(e){return{Component:Be.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var He=t(90992);function Le(e){return{Component:He.Z,display:{needsApi:["tx.nis.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"nis",text:e("nav.nis","Non-interactive Staking",{ns:"apps-routing"})}}var Je=t(93277);function Xe(e){return{Component:Je.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var Ve=t(94349);function _e(e){return{Component:Ve.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var Ge=t(97662);function Ke(e){return{Component:Ge.Z,display:{needsAccounts:!0,needsApi:["query.preimage.statusFor","tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var Ye=t(41857),Qe=t(76288);function en(e){return{Component:Ye.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:Qe.Z}}var nn=t(89139),tn=t(1398);function rn(e){return{Component:nn.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:tn.Z}}var on=t(6583);function an(e){return{Component:on.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var sn=t(39117);function ln(e){return{Component:sn.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var cn=t(14673);function dn(e){return{Component:cn.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var pn=t(92403),un=t(76075);function mn(e){return{Component:pn.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:un.Z}}var gn=t(24569);function hn(e){return{Component:gn.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var fn=t(96246),xn=t(58900);function vn(e){return{Component:fn.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:xn.Z}}var yn=t(40073),kn=t(56949),bn=t(19729),wn=t(95292);function Cn(e){try{if(e.query.stakingAhClient||e.tx.stakingRcClient)return!1;const{nominatorCount:n,own:t,pageCount:r,total:i}=e.registry.createType((0,bn.P)(e.registry,e.query.staking.erasStakersOverview.creator.meta.type),{nominatorCount:wn.If,own:wn.If,pageCount:wn.If,total:wn.If});(0,u.hu)(i&&t&&n&&r&&i.eq(wn.If)&&t.eq(wn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(kn.TS,wn.If,{Account:kn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(wn.If,{Account:kn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,bn.P)(e.registry,e.query.staking.claimedRewards.creator.meta.type),[0]);(0,u.hu)(n.eq([0]),"Needs a legacyClaimedRewards array")}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function jn(e){return{Component:yn.Z,display:{needsApi:["query.staking.erasStakersOverview","tx.staking.bond"],needsApiCheck:Cn},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var An=t(33e3);function In(e){try{return!!(e.tx.stakingAhClient||e.tx.staking&&e.tx.stakingRcClient)}catch{return!1}}function Nn(e){return{Component:An.Z,display:{needsApi:[],needsApiCheck:In},group:"network",icon:"certificate",name:"staking-async",text:e("nav.staking-async","Staking Async",{ns:"apps-routing"})}}var Sn=t(97473);function Rn(e){try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,bn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:wn.If,who:kn.TS}],own:wn.If,total:wn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(wn.If)&&r.eq(wn.If)&&n.eq(wn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(kn.TS,wn.If,{Account:kn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(wn.If,{Account:kn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function $n(e){return{Component:Sn.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:Rn},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var Zn=t(77854);function Un(e){if("function"==typeof e.query.staking.erasStakersOverview)return!1;try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,bn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:wn.If,who:kn.TS}],own:wn.If,total:wn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(wn.If)&&r.eq(wn.If)&&n.eq(wn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(kn.TS,wn.If,{Account:kn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(wn.If,{Account:kn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,bn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{claimedRewards:[1,2,3]});if(n.claimedRewards)(0,u.hu)(n.claimedRewards.eq([1,2,3]),"Needs a claimedRewards array");else{const n=e.registry.createType((0,bn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{legacyClaimedRewards:[1,2,3]});(0,u.hu)(n.legacyClaimedRewards.eq([1,2,3]),"Needs a legacyClaimedRewards array")}}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function Fn(e){return{Component:Zn.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:Un},group:"network",icon:"certificate",name:"legacy-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var Tn=t(46717);function qn(e){return{Component:Tn.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var zn=t(54676);function En(e){return{Component:zn.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var Wn=t(75509),On=t(87340);function Mn(e){return{Component:Wn.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:On.Z}}var Pn=t(9847);function Bn(e){return{Component:Pn.Z,Modal:Pn.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}function Dn(e){return{Component:I.Zd,Modal:I.Zd,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transferKeepAlive"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var Hn=t(74425),Ln=t(9039);function Jn(e){return{Component:Hn.Z,display:{needsApi:["query.treasury.proposals"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:Ln.Z}}var Xn=t(27008);function Vn(e){return{Component:Xn.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var _n=t(7644);function Gn(e){return{Component:_n.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function Kn(e){return[P(e),D(e),Ne(e),pe(e),_e(e),Dn(e),Bn(e),Nn(e),jn(e),$n(e),Fn(e),me(e),te(e),ve(e),rn(e),Pe(e),J(e),_(e),Ue(e),en(e),Ke(e),Gn(e),Ae(e),be(e),Mn(e),Jn(e),ee(e),Xe(e),K(e),De(e),vn(e),Le(e),ze(e),dn(e),ie(e),fe(e),qn(e),Re(e),an(e),ln(e),hn(e),En(e),Te(e),We(e),Vn(e),mn(e)]}var Yn=t(86135),Qn=t(59149),et=t(82671),nt=t(33661);function tt(e,n,t){const[r,i,o]=n.split("."),[a]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),i)||[i],s=e[r][a]?a:i;try{return"consts"===r?(0,et.K)(e[r][s][o]):(0,nt.m)(e[r][s][o])}catch{return!1}}function rt(e,n,t=!1,r){if(!n)return[];const i=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,r)=>n||tt(e,r,t)),!1):tt(e,n,t))));return i.length||!r||r(e)?i:["needsApiCheck"]}const it=g.memo((function({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,r.jsx)(W.Fg,{to:"/explorer"})}));var ot=t(34814),at=t(9118),st=t(64021),lt=t(69516);let ct;const dt=g.memo((function({optionsAll:e}){const{queueAction:n}=(0,Yn.L)(),{api:t,isApiReady:i}=(0,z.h)(),{allAccounts:o}=(0,ot.x)(),{t:a}=$(),s=(0,at.W7)(i&&t.query.system?.events);return(0,g.useEffect)((()=>{const t=function(e,n,t,r){const i=(0,lt.R)((0,st.d)(JSON.stringify(r)));return t&&r&&i!==ct?(ct=i,r.map((({event:{data:t,method:r,section:i}})=>{if("balances"===i&&"Transfer"===r){const o=t[1].toString();if(e.includes(o))return{account:o,action:`${i}.${r}`,message:n("transfer received"),status:"event"}}else if("democracy"===i){const e=t[0].toString();return{action:`${i}.${r}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(o,a,e,s);t&&n(t)}),[o,s,e,n,a]),(0,r.jsx)(I.qb,{})})),pt={Component:it,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"},ut=I.zo.div`
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
`,mt=g.memo((function({className:e}){const n=(0,W.TH)(),{t}=$(),{api:i,isApiConnected:o,isApiReady:a,isDevelopment:s}=(0,z.h)(),{queueAction:l}=(0,Yn.L)(),{Component:c,display:{needsApi:d,needsApiCheck:p,needsApiInstances:u},icon:m,name:h,text:f}=(0,g.useMemo)((()=>{const e=n.pathname.slice(1)||"";return Kn(t).find((n=>n&&e.startsWith(n.name)&&(s||!n.display.isDevelopment)))||pt}),[s,n,t]),x=(0,g.useMemo)((()=>d?a&&o?rt(i,d,u,p):null:[]),[i,o,a,d,p,u]);return(0,r.jsx)(ut,{className:e,children:x?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(I.SV,{trigger:h,children:(0,r.jsx)(Qn.m.Provider,{value:{icon:m,text:f},children:x.length?(0,r.jsx)(it,{basePath:`/${h}`,location:n,missingApis:x,onStatusChange:l}):(0,r.jsx)(c,{basePath:`/${h}`,location:n,onStatusChange:l})})})}),(0,r.jsx)(dt,{})]}):(0,r.jsx)("div",{className:"connecting",children:(0,r.jsx)(I.$j,{label:t("Initializing connection")})})})}));var gt=t(41411),ht=t(12176),ft=t(95689),xt=t(68058),vt=t(10072),yt=t(70676);const kt=I.zo.div`
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
`,bt=g.memo((function({apiUrl:e,className:n="",isFavorite:t,setApiUrl:i,toggleFavoriteChain:o,value:{isChild:a,isRelay:s,isUnreachable:l,name:c,nameRelay:d,paraId:p,providers:u,ui:m}}){const{t:h}=$(),f=(0,g.useMemo)((()=>u.some((({url:n})=>n===e))),[e,u]),x=(0,g.useMemo)((()=>u.map((({name:e,url:n})=>({text:e,value:n})))),[u]),v=(0,g.useCallback)((()=>{const e=u.filter((({url:e})=>!e.startsWith("light://")));if(0!==e.length)return i(c,e[Math.floor(Math.random()*e.length)].url);alert("No WebSocket (wss://) provider available")}),[c,u,i]),y=(0,g.useCallback)((e=>i(c,e)),[c,i]),k=(0,g.useCallback)((e=>{e.preventDefault(),e.stopPropagation(),o({chainName:c,paraId:p,relay:d})}),[c,p,d,o]);return(0,r.jsxs)(kt,{className:`${n}${f?" isSelected highlight--border":""}${l?" isUnreachable":""}`,children:[(0,r.jsxs)("div",{className:"markFavoriteSection"+(a?" isChild":""),onClick:l?void 0:v,children:[(0,r.jsxs)("div",{className:"endpointSection",children:[(0,r.jsx)(I.Mj,{className:"endpointIcon",isInline:!0,logo:m.logo||"empty",withoutHl:!0}),(0,r.jsxs)("div",{className:"endpointValue",children:[(0,r.jsx)("div",{children:c}),f&&(s||!!p)&&(0,r.jsx)("div",{className:"endpointExtra",children:s?h("Relay chain"):h(p&&p<1e3?"{{relay}} System":p&&p<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:d}})})]})]}),(0,r.jsx)(I.JO,{className:t?"isFavorite":"",icon:"star",onClick:k})]}),f&&(0,r.jsx)(I.Lt,{className:"isSmall",onChange:y,options:x,value:e,withLabel:!1})]})})),wt="polkadot-app-favorite-chains",Ct=(0,c.Rf)(((e,n)=>n?.toString()||e)),jt=()=>{try{const e=localStorage.getItem(wt);if(!e)return{};const n=JSON.parse(e);if("object"!=typeof n||null===n||Array.isArray(n))throw new Error("Invalid favorite chains format");const t={};for(const[e,r]of Object.entries(n)){if(!Array.isArray(r))throw new Error(`Invalid value for key "${e}": not an array`);if(!r.every((e=>"object"==typeof e&&null!==e&&"string"==typeof e.relay&&"number"==typeof e.paraId)))throw new Error(`Invalid entries under key "${e}"`);if(Ct.find((n=>n.text===e))){const n=r.filter((e=>"Unknown"===e.relay||!!Ct.find((n=>n.text===e.relay))));n.length>0&&(t[e]=n)}}return localStorage.setItem(wt,JSON.stringify(t)),t}catch(e){return console.error("Failed to parse favorite chains:",e),localStorage.removeItem(wt),{}}},At=(e,n)=>{try{const t=n.chainName,r={paraId:n.paraId??-1,relay:n.relay??"Unknown"},i=e[t];return!!Array.isArray(i)&&i.some((e=>e.relay===r.relay&&e.paraId===r.paraId))}catch(e){return console.error("Failed to check favorite chain:",e),!1}},It=I.zo.div`
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
`,Nt=g.memo((function({affinities:e,apiUrl:n,children:t,className:i="",favoriteChains:o,highlightColor:a,index:s,isSelected:l,setApiUrl:c,setGroup:d,toggleFavoriteChain:p,value:{header:u,isSpaced:m,networks:h}}){const f=(0,g.useCallback)((()=>d(l?-1:s)),[s,l,d]),x=(0,g.useMemo)((()=>u?.toString().includes("Favorite")),[u]),v=(0,g.useMemo)((()=>h.filter((({isUnreachable:e})=>!e))),[h]);return x&&0===Object.keys(o).length?(0,r.jsx)(r.Fragment,{}):(0,r.jsxs)(It,{className:`${i}${l?" isSelected":""}`,highlightColor:a,children:[(0,r.jsxs)("div",{className:`groupHeader${m?" isSpaced":""}${x?" isFavoriteHeader":""}`,onClick:f,children:[(0,r.jsx)(I.JO,{icon:l?"caret-up":"caret-down"}),u]}),l&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"groupNetworks",children:v.map(((t,i)=>(0,r.jsx)(bt,{affinity:e[t.name],apiUrl:n,isFavorite:At(o,{chainName:t.name,paraId:t.paraId,relay:t.nameRelay}),setApiUrl:c,toggleFavoriteChain:p,value:t},i)))}),t]})]})})),St="network:affinities";function Rt(e){const n=jt();let t=-1;const r=e.reduce(((e,r)=>{if(r.isHeader){const n="string"==typeof r.text&&r.text.includes("Favorite chains");e.push({header:r.text,isDevelopment:r.isDevelopment,isSpaced:r.isSpaced,networks:[]}),n&&(t=e.length-1)}else{const i=e[e.length-1],o={isLightClient:r.isLightClient,name:r.textBy,url:r.value};if(At(n,{chainName:r.text?.toString()??"",paraId:r.paraId,relay:r.textRelay?.toString()})&&-1!==t&&!r.isUnreachable){const n=e[t],i=n.networks[n.networks.length-1];i&&i.name===r.text&&i.nameRelay===r.textRelay&&i.paraId===r.paraId?i.providers.push(o):n.networks.push({isChild:r.isChild,isRelay:!!r.genesisHash,name:r.text,nameRelay:r.textRelay,paraId:r.paraId,providers:[o],ui:r.ui})}i.networks[i.networks.length-1]&&r.text===i.networks[i.networks.length-1].name?i.networks[i.networks.length-1].providers.push(o):r.isUnreachable||i.networks.push({isChild:r.isChild,isRelay:!!r.genesisHash,name:r.text,nameRelay:r.textRelay,paraId:r.paraId,providers:[o],ui:r.ui})}return e}),[]);return r.forEach((e=>{e.networks.length>=2&&e.networks[0].isRelay&&e.header?.toString().includes("parachains")&&([e.networks[0],e.networks[1]]=[e.networks[1],e.networks[0]])})),r}function $t(){try{const e=localStorage.getItem(vt.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function Zt(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:p.X.get().apiUrl!==e,isUrlValid:(r=e,r.length>=7&&(r.startsWith("ws://")||r.startsWith("wss://")||r.startsWith("light://")))};var r}const Ut=(0,I.zo)(I.YE)`
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
`,Ft=g.memo((function({className:e="",offset:n,onClose:t}){const{t:i}=$(),o=(0,c.Rf)(i),{apiEndpoint:a,isLocalFork:s}=(0,z.h)(),[d,u]=(0,g.useState)((()=>jt())),[m,h]=(0,g.useState)((()=>Rt(o))),[{apiUrl:f,groupIndex:x,hasUrlChanged:v,isUrlValid:y},k]=(0,g.useState)((()=>Zt(p.X.get().apiUrl,m))),[b,w]=(0,g.useState)((()=>$t())),[C,j]=(0,g.useState)((()=>function(e){return Object.entries(l().get(St)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:r})=>e===n&&r.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(m))),A=(0,g.useRef)(null),S=(0,g.useMemo)((()=>{let e=!1;return o.some((n=>n.value===f&&(e=!0,!0))),e}),[f,o]),R=(0,g.useMemo)((()=>{let e=!1;return b.some((n=>n===f&&(e=!0,!0))),e}),[f,b]),Z=(0,g.useCallback)((e=>k((n=>({...n,groupIndex:e})))),[]),U=(0,g.useCallback)((e=>{(e=>{try{const n=e.chainName,t={paraId:e.paraId??-1,relay:e.relay??"Unknown"},r=jt(),i=r[n]??[];let o;o=i.some((e=>e.relay===t.relay&&e.paraId===t.paraId))?i.filter((e=>e.relay!==t.relay||e.paraId!==t.paraId)):[...i,t];const a={...r};0===o.length?delete a[n]:a[n]=o,localStorage.setItem(wt,JSON.stringify(a))}catch{}})(e),u(jt()),h(Rt((0,c.Rf)(i)))}),[i]),F=(0,g.useCallback)((()=>{if(!R)return;const e=b.filter((e=>e!==f));try{localStorage.setItem(vt.ie,JSON.stringify(e)),h(Rt((0,c.Rf)(i))),w($t())}catch(e){console.error(e)}}),[f,R,b,i]),T=(0,g.useCallback)(((e,n)=>{j((t=>{const r={...t,[e]:n};return l().set(St,r),r})),k((e=>({...Zt(n,m),groupIndex:e.groupIndex})))}),[m]),q=(0,g.useCallback)((e=>{(0,yt._)(e)||(e=xt.ZP.toASCII(e)),k((n=>({...Zt(e,m),groupIndex:n.groupIndex})))}),[m]),E=(0,g.useCallback)((()=>{l().set("localFork",""),p.X.set({...p.X.get(),apiUrl:f}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(f)}${window.location.hash}`),v||window.location.reload(),t()}),[f,t,v]),W=(0,g.useCallback)((()=>{l().set("localFork",f),p.X.set({...p.X.get(),apiUrl:f}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(f)}${window.location.hash}`),v||window.location.reload(),t()}),[f,t,v]),O=(0,g.useCallback)((()=>{try{localStorage.setItem(vt.ie,JSON.stringify([...b,f])),E()}catch(e){console.error(e)}}),[E,f,b]),M=(0,g.useMemo)((()=>function(e,n,t,r){return e?!n.startsWith("light://")&&!t:!r}(v,f,y,s)),[v,f,y,s]),P=(0,g.useMemo)((()=>function(e,n,t,r){return e?!!n.startsWith("light://")||!t:!!r}(v,f,y,s)),[v,f,y,s]);return(0,r.jsx)(Ut,{buttons:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(I.zx,{icon:"code-fork",isDisabled:P,label:i("Fork Locally"),onClick:W,tooltip:"fork-locally-btn"}),(0,r.jsx)(I.zx,{icon:"sync",isDisabled:M,label:i("Switch"),onClick:E})]}),className:e,offset:n,onClose:t,position:"left",sidebarRef:A,children:m.map(((e,n)=>(0,r.jsx)(Nt,{affinities:C,apiUrl:f,favoriteChains:d,highlightColor:a?.ui.color||N.B,index:n,isSelected:x===n,setApiUrl:T,setGroup:Z,toggleFavoriteChain:U,value:e,children:e.isDevelopment&&(0,r.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,r.jsx)(I.II,{className:"endpointCustom",isError:!y,isFull:!0,label:i("custom endpoint"),onChange:q,value:f}),R?(0,r.jsx)(I.zx,{className:"customButton",icon:"trash-alt",onClick:F}):(0,r.jsx)(I.zx,{className:"customButton",icon:"save",isDisabled:!y||S,onClick:O})]})},n)))})})),Tt=I.zo.div`
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
`,qt=g.memo((function({className:e}){const{api:n,isApiReady:t}=(0,z.h)(),i=(0,at.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:o}=(0,d.g)(),[a,s]=(0,Z.O)(),l=!o;return(0,r.jsxs)(Tt,{className:e,children:[(0,r.jsxs)("div",{className:`apps--SideBar-logo-inner${l?" isClickable":""} highlight--color-contrast`,onClick:s,children:[(0,r.jsx)(I.Mj,{}),(0,r.jsxs)("div",{className:"info media--1000",children:[(0,r.jsx)(ht.Z,{className:"chain"}),i&&(0,r.jsxs)("div",{className:"runtimeVersion",children:[i.specName.toString(),"/",i.specVersion.toNumber()]}),(0,r.jsx)(ft.Z,{className:"bestNumber",label:"#"})]}),l&&(0,r.jsx)(I.JO,{className:"dropdown",icon:a?"caret-right":"caret-down"})]}),a&&(0,r.jsx)(Ft,{onClose:s})]})})),zt=()=>0,Et=I.zo.li`
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
`,Wt=g.memo((function({className:e="",classNameText:n,isLink:t,isToplevel:i,route:{Modal:o,href:a,icon:s,name:l,text:c,useCounter:d=zt}}){const[p,u]=(0,Z.O)(),m=d();return(0,r.jsxs)(Et,{className:`${e} ui--MenuItem ${m?"withCounter":""} ${t?"isLink":""} ${i?"topLevel highlight--color-contrast":""}`,children:[(0,r.jsxs)("a",{href:o?void 0:a||`#/${l}`,onClick:o?u:void 0,rel:"noopener noreferrer",target:a?"_blank":void 0,children:[(0,r.jsx)(I.JO,{icon:s}),(0,r.jsx)("span",{className:n,children:c}),!!m&&(0,r.jsx)(I.Ct,{color:"white",info:m})]}),o&&p&&(0,r.jsx)(o,{onClose:u})]})})),Ot="rgba(34, 36, 38, 0.12)",Mt="5px",Pt=I.zo.li`
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
    box-shadow: 0 ${Mt} ${Mt} -${Mt} ${Ot}, ${Mt} 0 ${Mt} -${Mt} ${Ot}, -${Mt} 0 ${Mt} -${Mt} ${Ot};
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
`,Bt=g.memo((function({className:e="",isActive:n,name:t,routes:i}){return 1===i.length&&"settings"===i[0].group?(0,r.jsx)(Wt,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:i[0]}):(0,r.jsxs)(Pt,{className:`${e} ${n?"isActive":""}`,children:[(0,r.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,r.jsx)("span",{className:"smallHide",children:t}),(0,r.jsx)(I.JO,{className:"smallShow",icon:i[0].icon}),(0,r.jsx)(I.JO,{icon:"caret-down"})]}),(0,r.jsx)("ul",{className:"groupMenu",children:i.map((e=>(0,r.jsx)(Wt,{route:e},e.name)))})]})}));var Dt=t(54194),Ht=t(39082),Lt=t(52727);const Jt=`apps v${Dt.b.version.replace("-x","")}`,Xt=I.zo.div`
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
`,Vt=g.memo((function({className:e=""}){const{api:n,isApiReady:t}=(0,z.h)();return(0,r.jsxs)(Xt,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,r.jsxs)("div",{className:"node",children:[(0,r.jsx)(Ht.Z,{})," ",(0,r.jsx)(Lt.Z,{label:"v"})]}),(0,r.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,r.jsx)("div",{children:Jt})]})}));const _t=I.zo.div`
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
`,Gt=g.memo((function({className:e=""}){const{t:n}=$(),{allAccounts:t,hasAccounts:i}=(0,ot.x)(),o=(0,z.h)(),{allowTeleport:a}=(0,gt.M)(),s=(0,at.W7)(o.isApiReady&&o.api.query.sudo?.key),l=(0,W.TH)(),c=(0,g.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(n)),d=(0,g.useRef)(Kn(n)),p=(0,g.useRef)({accounts:n("Accounts"),developer:n("Developer"),files:n("Files"),governance:n("Governance"),network:n("Network"),settings:n("Settings")}),u=(0,g.useMemo)((()=>!!s&&t.some((e=>s.eq(e)))),[t,s]),m=(0,g.useMemo)((()=>function(e,n,t,r,i,o){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:r},i,o,a,{isDevelopment:s,isHidden:l,needsAccounts:c,needsApi:d,needsApiCheck:p,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!o||d&&(!t||!n||m&&!a||g&&!i||!r&&s||0!==rt(e,d,u,p).length))}(t,r,i,o,e)))}))).filter((({routes:e})=>e.length))}(d.current,p.current,o,a,i,u)),[a,o,i,u]),h=(0,g.useMemo)((()=>d.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,r.jsx)(_t,{className:`${e}${o.isApiReady&&o.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,r.jsxs)("div",{className:"menuContainer",children:[(0,r.jsxs)("div",{className:"menuSection",children:[(0,r.jsx)(qt,{}),(0,r.jsx)("ul",{className:"menuItems",children:m.map((({name:e,routes:n})=>(0,r.jsx)(Bt,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,r.jsx)("div",{className:"menuSection media--1200",children:(0,r.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,r.jsx)(Wt,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,r.jsx)(Vt,{className:"media--1400"})]})})})),Kt=window.location.host.startsWith("polkadot.js.org"),Yt=(0,c.Rf)((()=>"")).map((e=>e.dnslink)).reduce(((e,n)=>(n&&!e.includes(n)&&e.push(n),e)),[]),Qt=g.memo((function({className:e}){const{t:n}=$(),{systemChain:t}=(0,z.h)(),i=(0,g.useMemo)((()=>{const e=t?.toLowerCase();return e&&Yt.includes(e)?`https://${e}.dotapps.io`:"https://dotapps.io"}),[t]);return Kt?(0,r.jsx)(F,{className:e,icon:"link",isBottom:!0,isDev:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("You are connected to the development instance of the UI. For a fully decentralized experience, you are encouraged to use the IPFS deployed version as the canonical URL: "),(0,r.jsx)("a",{href:i,rel:"noreferrer",target:"_blank",children:i.replace("https://","")})]})}):null})),er=g.memo((function({className:e}){const{t:n}=$(),{isLocalFork:t}=(0,z.h)();return t?(0,r.jsx)(F,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("Local fork powered by "),(0,r.jsx)("a",{href:"https://github.com/AcalaNetwork/chopsticks",rel:"noreferrer",target:"_blank",children:"Chopsticks"}),"."]})}):null})),nr=I.zo.div`
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
`,tr=g.memo((function({className:e}){return(0,r.jsxs)(nr,{className:e,children:[(0,r.jsx)(er,{}),(0,r.jsx)(Qt,{})]})})),rr=p.X.apiType.param,ir="json-rpc"===p.X.apiType.type&&"string"==typeof rr&&rr.startsWith("ws://"),or="string"==typeof rr&&rr.includes("127.0.0.1"),ar=window.location.protocol.startsWith("https:"),sr=g.memo((function({className:e}){const{t:n}=$(),{apiError:t,isApiConnected:i,isApiReady:o,isWaitingInjected:a}=(0,z.h)();return t?(0,r.jsx)(F,{className:e,icon:"globe",type:"error",children:(0,r.jsx)("div",{children:t})}):o?a?(0,r.jsx)(F,{className:e,icon:"puzzle-piece",type:"info",children:(0,r.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):i?null:(0,r.jsxs)(F,{className:e,icon:"globe",type:"error",children:[(0,r.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),ir&&!or&&ar?(0,r.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:rr}})}):void 0]}):(0,r.jsx)(F,{className:e,icon:"globe",type:"info",children:(0,r.jsx)("div",{children:n(i?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})})),lr=g.memo((function(){const{api:e,apiIdentity:n,isApiReady:t}=(0,z.h)(),i=(0,at.W7)(t&&e.derive.accounts?.indexes),o=(0,at.W7)(t&&n.query.identity?.registrars),a=(0,at.W7)(t&&e.query.balances?.totalIssuance),[s,l]=(0,g.useState)(!1);return(0,g.useEffect)((()=>{l(!!i||!!a||!!o)}),[]),(0,r.jsx)("div",{className:`apps--api-warm ${s.toString()}`})})),cr=I.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,dr=g.memo((function({className:e=""}){const{themeClassName:n}=(0,S.F)(),{apiEndpoint:t,isDevelopment:i}=(0,z.h)(),o=(0,g.useMemo)((()=>i?void 0:t?.ui.color),[t,i]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(N.Z,{uiHighlight:o}),(0,r.jsxs)(cr,{className:`${e} apps--Wrapper ${n}`,children:[(0,r.jsx)(Gt,{}),(0,r.jsxs)(I.J0,{children:[(0,r.jsx)(E.ZP,{children:(0,r.jsx)(mt,{})}),(0,r.jsx)(sr,{}),(0,r.jsx)(tr,{}),(0,r.jsx)("div",{id:"portals"})]})]}),(0,r.jsx)(lr,{})]})}));function pr({uiTheme:e}){const n="dark"===e?"dark":"light";return document?.documentElement?.setAttribute("data-theme",n),{theme:n}}const ur=g.memo((function({isElectron:e,store:n}){const[t,i]=(0,g.useState)((()=>pr(p.X)));return(0,g.useEffect)((()=>{p.X.on("change",(e=>i(pr(e))))}),[]),(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(x.f6,{theme:t,children:(0,r.jsx)(y.q,{children:(0,r.jsx)(v.ApiCtxRoot,{apiUrl:p.X.apiUrl,beforeApiInit:(0,r.jsx)(q,{}),isElectron:e,store:n,children:(0,r.jsx)(k.y,{children:(0,r.jsx)(b.u,{children:(0,r.jsx)(w.g,{children:(0,r.jsx)(C.w,{children:(0,r.jsx)(f.UT,{children:(0,r.jsx)(j.A,{children:(0,r.jsx)(A.U,{children:(0,r.jsx)(dr,{})})})})})})})})})})})})})),mr="root",gr=document.getElementById(mr);if(!gr)throw new Error(`Unable to find element with id '${mr}'`);(0,h.s)(gr).render((0,r.jsx)(ur,{isElectron:!1}))},29038:(e,n,t)=>{var r={".":[57139,9],"./":[57139,9],"./Api":[8188,9],"./Api.tsx":[8188,9],"./hoc":[69356,9],"./hoc/":[69356,9],"./hoc/api":[94356,9],"./hoc/api.tsx":[94356,9],"./hoc/call":[98727,9],"./hoc/call.tsx":[98727,9],"./hoc/callDiv":[3364,9],"./hoc/callDiv.tsx":[3364,9],"./hoc/calls":[5246,9],"./hoc/calls.ts":[5246,9],"./hoc/index":[69356,9],"./hoc/index.ts":[69356,9],"./hoc/multi":[60028,9],"./hoc/multi.ts":[60028,9],"./hoc/observable":[33989,9],"./hoc/observable.tsx":[33989,9],"./hoc/onlyOn":[35475,9],"./hoc/onlyOn.tsx":[35475,9],"./hoc/types":[68570,9,8570],"./hoc/types.ts":[68570,9,8570],"./index":[57139,9],"./index.ts":[57139,9],"./light":[36956,9],"./light.spec":[58705,9,8705],"./light.spec.ts":[58705,9,8705],"./light/":[36956,9],"./light/index":[36956,9],"./light/index.ts":[36956,9],"./light/kusama":[37178,9],"./light/kusama/":[37178,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[37178,9],"./light/kusama/index.ts":[37178,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[15299,9],"./light/polkadot/":[15299,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[15299,9],"./light/polkadot/index.ts":[15299,9],"./light/polkadot/laos.json":[54689,3,4689],"./statics":[95267,9],"./statics.ts":[95267,9],"./transform/echo":[80522,9],"./transform/echo.ts":[80522,9],"./types":[55903,9,5903],"./types.ts":[55903,9,5903],"./urlTypes":[81369,9],"./urlTypes.ts":[81369,9],"./util":[41186,9],"./util/":[41186,9],"./util/getEnvironment":[68372,9],"./util/getEnvironment.ts":[68372,9],"./util/historic":[77809,9],"./util/historic.ts":[77809,9],"./util/index":[41186,9],"./util/index.ts":[41186,9],"./util/intervalObservable":[71951,9],"./util/intervalObservable.ts":[71951,9],"./util/isEqual":[65345,9],"./util/isEqual.ts":[65345,9],"./util/triggerChange":[74733,9],"./util/triggerChange.ts":[74733,9]};function i(e){if(!t.o(r,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=r[e],i=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(i,16|n[1])))}i.keys=()=>Object.keys(r),i.id=29038,e.exports=i},18983:()=>{},33196:()=>{},38087:()=>{},74854:()=>{},66602:()=>{}},e=>{e.O(0,[6677,4668,6105,6489,1064,4124,2440,434,9398,9e3,8043,7924,212,2044,2854,5320,9684,2021,738,344,760,6829,5005,9319,2208,136,8484,893,6641,2685,2871,3108,353,3882,4292,9065,1080,2107,9121,62,1458,1454,8291,4635,5502,3569,6744,8758,7965,6510,3164],(()=>(69794,e(e.s=69794)))),e.O()}]);