(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{83073:(e,n,t)=>{"use strict";var r=t(52322),i=t(46157),o=t(48834).Buffer;try{3===o.from([1,2,3]).length&&(i.Ur.Buffer=o)}catch{}var s=t(85168),a=t(23729),l=t.n(a),c=t(33318),d=t(83337),p=t(16039),u=t(48731);const m=function(){const e=s.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,u.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,u.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,c.Rf)((()=>"")),{ipnsChain:t}=(0,d.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const r=l().get("settings")||{},i=n.find((({value:e})=>!!e));return[r.apiUrl,void 0].includes(p.X.apiUrl)?p.X.apiUrl:i?i.value:"ws://127.0.0.1:9944"}();p.X.set({apiUrl:m}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(m),t(94953);var g=t(2784),h=t(17029),f=t(39857),x=t(31383),v=t(57139),y=t(87561),b=t(3773),k=t(68944),w=t(57120),C=t(44028),A=t(91012),j=t(37100),N=t(37731),I=t(3663),S=t(90778),Z=t(4984),R=t(73557),$=t(73501),U=t(10189);function q(e){return{Component:$.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:U.Z}}var T=t(28096);function z(e){return{Component:T.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var E=t(49307),W=t(58370);function O(e){return{Component:E.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:W.Z}}var P=t(18760),M=t(80901);function B(e){return{Component:P.Z,display:{needsApi:["tx.ambassadorCollective.vote","tx.ambassadorReferenda.submit","consts.ambassadorReferenda.tracks"]},group:"governance",icon:"user-friends",name:"ambassador",text:e("nav.ambassador","Ambassador",{ns:"apps-routing"}),useCounter:M.Z}}var F=t(39559);function D(e){return{Component:F.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var H=t(95039),L=t(19739);function X(e){return{Component:H.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:L.Z}}var J=t(39372);function V(e){return{Component:J.Z,display:{needsApi:["query.broker.status"],needsApiInstances:!0},group:"network",icon:"flask",name:"broker",text:e("nav.broker","Coretime Broker (Experimental)",{ns:"app-broker"})}}var _=t(6742);function G(e){return{Component:_.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var K=t(75798),Y=t(73352),Q=t(31725),ee=t(84195),ne=t(48834).Buffer;function te(){try{if(!ne.from([1,2,3])?.length)return console.error("ERROR: Unable to construct Buffer object for claims module"),!1;if(!Q.cR||!ne.isBuffer((0,ee.Y)(new Uint8Array([1,2,3]))))return console.error("ERROR: Unable to use u8aToBuffer for claims module"),!1}catch{return console.error("ERROR: Fatal error in working with Buffer module"),!1}return!0}function re(e){return{Component:K.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"],needsApiCheck:te},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:Y.Z}}var ie=t(2799);function oe(e){return{Component:ie.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var se=t(22516);function ae(e){try{return(0,u.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch{return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function le(e){return{Component:se.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:ae},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var ce=t(6748);function de(e){return{Component:ce.Z,display:{needsApi:["query.coretimeAssignmentProvider.coreDescriptors"],needsApiInstances:!0},group:"network",icon:"flask",name:"coretime",text:e("nav.coretime","Coretime (Experimental)",{ns:"apps-routing"})}}var pe=t(18324),ue=t(40740);function me(e){return{Component:pe.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:ue.Z}}var ge=t(50472),he=t(61491);function fe(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch{return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function xe(e){return{Component:ge.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:fe},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:he.Z}}var ve=t(51406);function ye(e){return{Component:ve.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var be=t(38080);function ke(e){return{Component:be.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var we=t(58064),Ce=t(16472);function Ae(e){return{Component:we.Z,display:{needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:Ce.Z}}var je=t(31043);function Ne(e){return{Component:je.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var Ie=t(79865);function Se(e){return{Component:Ie.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var Ze=t(30145);function Re(e){return{Component:Ze.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var $e=t(51213),Ue=t(16743);function qe(e){return{Component:$e.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:Ue.Z}}var Te=t(50313);function ze(e){return{Component:Te.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var Ee=t(90992);function We(e){return{Component:Ee.Z,display:{needsApi:["tx.nis.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"nis",text:e("nav.nis","Non-interactive Staking",{ns:"apps-routing"})}}var Oe=t(93242);function Pe(e){return{Component:Oe.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var Me=t(94349);function Be(e){return{Component:Me.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var Fe=t(20600);function De(e){return{Component:Fe.Z,display:{needsAccounts:!0,needsApi:["query.preimage.statusFor","tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var He=t(41857),Le=t(76288);function Xe(e){return{Component:He.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:Le.Z}}var Je=t(89139),Ve=t(1398);function _e(e){return{Component:Je.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:Ve.Z}}var Ge=t(6583);function Ke(e){return{Component:Ge.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var Ye=t(39117);function Qe(e){return{Component:Ye.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var en=t(14673);function nn(e){return{Component:en.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var tn=t(32785),rn=t(76075);function on(e){return{Component:tn.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:rn.Z}}var sn=t(24569);function an(e){return{Component:sn.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var ln=t(96246),cn=t(58900);function dn(e){return{Component:ln.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:cn.Z}}var pn=t(11337),un=t(56949),mn=t(19729),gn=t(95292);function hn(e){try{const{nominatorCount:n,own:t,pageCount:r,total:i}=e.registry.createType((0,mn.P)(e.registry,e.query.staking.erasStakersOverview.creator.meta.type),{nominatorCount:gn.If,own:gn.If,pageCount:gn.If,total:gn.If});(0,u.hu)(i&&t&&n&&r&&i.eq(gn.If)&&t.eq(gn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(un.TS,gn.If,{Account:un.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(gn.If,{Account:un.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,mn.P)(e.registry,e.query.staking.claimedRewards.creator.meta.type),[0]);(0,u.hu)(n.eq([0]),"Needs a legacyClaimedRewards array")}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function fn(e){return{Component:pn.Z,display:{needsApi:["query.staking.erasStakersOverview","tx.staking.bond"],needsApiCheck:hn},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var xn=t(97473);function vn(e){try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,mn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:gn.If,who:un.TS}],own:gn.If,total:gn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(gn.If)&&r.eq(gn.If)&&n.eq(gn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(un.TS,gn.If,{Account:un.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(gn.If,{Account:un.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function yn(e){return{Component:xn.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:vn},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var bn=t(77854);function kn(e){if("function"==typeof e.query.staking.erasStakersOverview)return!1;try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,mn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:gn.If,who:un.TS}],own:gn.If,total:gn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(gn.If)&&r.eq(gn.If)&&n.eq(gn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(un.TS,gn.If,{Account:un.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(gn.If,{Account:un.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,mn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{claimedRewards:[1,2,3]});if(n.claimedRewards)(0,u.hu)(n.claimedRewards.eq([1,2,3]),"Needs a claimedRewards array");else{const n=e.registry.createType((0,mn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{legacyClaimedRewards:[1,2,3]});(0,u.hu)(n.legacyClaimedRewards.eq([1,2,3]),"Needs a legacyClaimedRewards array")}}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function wn(e){return{Component:bn.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:kn},group:"network",icon:"certificate",name:"legacy-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var Cn=t(46717);function An(e){return{Component:Cn.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var jn=t(54676);function Nn(e){return{Component:jn.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var In=t(75509),Sn=t(87340);function Zn(e){return{Component:In.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:Sn.Z}}var Rn=t(9847);function $n(e){return{Component:Rn.Z,Modal:Rn.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}function Un(e){return{Component:j.Zd,Modal:j.Zd,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transferKeepAlive"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var qn=t(74425),Tn=t(9039);function zn(e){return{Component:qn.Z,display:{needsApi:["query.treasury.proposals"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:Tn.Z}}var En=t(27008);function Wn(e){return{Component:En.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var On=t(7644);function Pn(e){return{Component:On.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function Mn(e){return[q(e),z(e),ye(e),re(e),Be(e),Un(e),$n(e),fn(e),yn(e),wn(e),oe(e),V(e),de(e),_e(e),qe(e),O(e),B(e),Ae(e),Xe(e),De(e),Pn(e),xe(e),me(e),Zn(e),zn(e),X(e),Pe(e),D(e),ze(e),dn(e),We(e),Se(e),nn(e),G(e),le(e),An(e),ke(e),Ke(e),Qe(e),an(e),Nn(e),Ne(e),Re(e),Wn(e),on(e)]}var Bn=t(86135),Fn=t(59149),Dn=t(82671),Hn=t(33661);function Ln(e,n,t){const[r,i,o]=n.split("."),[s]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),i)||[i],a=e[r][s]?s:i;try{return"consts"===r?(0,Dn.K)(e[r][a][o]):(0,Hn.m)(e[r][a][o])}catch{return!1}}function Xn(e,n,t=!1,r){if(!n)return[];const i=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,r)=>n||Ln(e,r,t)),!1):Ln(e,n,t))));return i.length||!r||r(e)?i:["needsApiCheck"]}var Jn=t(61349);function Vn(){return(0,Jn.$G)("apps")}const _n=g.memo((function({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,r.jsx)(R.Fg,{to:"/explorer"})}));var Gn=t(34814),Kn=t(9118),Yn=t(64021),Qn=t(69516);let et;const nt=g.memo((function({optionsAll:e}){const{queueAction:n}=(0,Bn.L)(),{api:t,isApiReady:i}=(0,S.h)(),{allAccounts:o}=(0,Gn.x)(),{t:s}=Vn(),a=(0,Kn.W7)(i&&t.query.system?.events);return(0,g.useEffect)((()=>{const t=function(e,n,t,r){const i=(0,Qn.R)((0,Yn.d)(JSON.stringify(r)));return t&&r&&i!==et?(et=i,r.map((({event:{data:t,method:r,section:i}})=>{if("balances"===i&&"Transfer"===r){const o=t[1].toString();if(e.includes(o))return{account:o,action:`${i}.${r}`,message:n("transfer received"),status:"event"}}else if("democracy"===i){const e=t[0].toString();return{action:`${i}.${r}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(o,s,e,a);t&&n(t)}),[o,a,e,n,s]),(0,r.jsx)(j.qb,{})})),tt={Component:_n,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"},rt=j.zo.div`
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
`,it=g.memo((function({className:e}){const n=(0,R.TH)(),{t}=Vn(),{api:i,isApiConnected:o,isApiReady:s,isDevelopment:a}=(0,S.h)(),{queueAction:l}=(0,Bn.L)(),{Component:c,display:{needsApi:d,needsApiCheck:p,needsApiInstances:u},icon:m,name:h,text:f}=(0,g.useMemo)((()=>{const e=n.pathname.slice(1)||"";return Mn(t).find((n=>n&&e.startsWith(n.name)&&(a||!n.display.isDevelopment)))||tt}),[a,n,t]),x=(0,g.useMemo)((()=>d?s&&o?Xn(i,d,u,p):null:[]),[i,o,s,d,p,u]);return(0,r.jsx)(rt,{className:e,children:x?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(j.SV,{trigger:h,children:(0,r.jsx)(Fn.m.Provider,{value:{icon:m,text:f},children:x.length?(0,r.jsx)(_n,{basePath:`/${h}`,location:n,missingApis:x,onStatusChange:l}):(0,r.jsx)(c,{basePath:`/${h}`,location:n,onStatusChange:l})})})}),(0,r.jsx)(nt,{})]}):(0,r.jsx)("div",{className:"connecting",children:(0,r.jsx)(j.$j,{label:t("Initializing connection")})})})}));var ot=t(41411),st=t(38894),at=t(12176),lt=t(95689),ct=t(68058),dt=t(10072),pt=t(70676);const ut=(0,j.zo)(j.ZD)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,mt=g.memo((function({apiUrl:e,className:n,label:t,setApiUrl:i,url:o}){const s=(0,g.useCallback)((()=>i(o)),[i,o]);return(0,r.jsx)(ut,{className:n,isRadio:!0,label:t,onChange:s,value:e===o})})),gt=j.zo.div`
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
`,ht=g.memo((function({apiUrl:e,className:n="",setApiUrl:t,value:{isChild:i,isRelay:o,isUnreachable:s,name:a,nameRelay:l,paraId:c,providers:d,ui:p}}){const{t:u}=Vn(),m=(0,g.useMemo)((()=>d.some((({url:n})=>n===e))),[e,d]),h=(0,g.useCallback)((()=>{const e=d.filter((({url:e})=>!e.startsWith("light://")));return t(a,e[Math.floor(Math.random()*e.length)].url)}),[a,d,t]),f=(0,g.useCallback)((e=>t(a,e)),[a,t]);return(0,r.jsxs)(gt,{className:`${n}${m?" isSelected highlight--border":""}${s?" isUnreachable":""}`,children:[(0,r.jsxs)("div",{className:"endpointSection"+(i?" isChild":""),onClick:s?void 0:h,children:[(0,r.jsx)(j.Mj,{className:"endpointIcon",isInline:!0,logo:p.logo||"empty",withoutHl:!0}),(0,r.jsxs)("div",{className:"endpointValue",children:[(0,r.jsx)("div",{children:a}),m&&(o||!!c)&&(0,r.jsx)("div",{className:"endpointExtra",children:o?u("Relay chain"):u(c&&c<1e3?"{{relay}} System":c&&c<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:l}})})]})]}),m&&d.map((({name:n,url:t})=>(0,r.jsx)(mt,{apiUrl:e,label:n,setApiUrl:f,url:t},t)))]})})),ft=j.zo.div`
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
`,xt=g.memo((function({affinities:e,apiUrl:n,children:t,className:i="",index:o,isSelected:s,setApiUrl:a,setGroup:l,value:{header:c,isSpaced:d,networks:p}}){const u=(0,g.useCallback)((()=>l(s?-1:o)),[o,s,l]),m=(0,g.useMemo)((()=>p.filter((({isUnreachable:e})=>!e))),[p]);return(0,r.jsxs)(ft,{className:`${i}${s?" isSelected":""}`,children:[(0,r.jsxs)("div",{className:"groupHeader"+(d?" isSpaced":""),onClick:u,children:[(0,r.jsx)(j.JO,{icon:s?"caret-up":"caret-down"}),c]}),s&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"groupNetworks",children:m.map(((t,i)=>(0,r.jsx)(ht,{affinity:e[t.name],apiUrl:n,setApiUrl:a,value:t},i)))}),t]})]})})),vt="network:affinities";function yt(e){return e.reduce(((e,n)=>{if(n.isHeader)e.push({header:n.text,isDevelopment:n.isDevelopment,isSpaced:n.isSpaced,networks:[]});else{const t=e[e.length-1],r={isLightClient:n.isLightClient,name:n.textBy,url:n.value};t.networks[t.networks.length-1]&&n.text===t.networks[t.networks.length-1].name?t.networks[t.networks.length-1].providers.push(r):n.isUnreachable||t.networks.push({isChild:n.isChild,isRelay:!!n.genesisHash,name:n.text,nameRelay:n.textRelay,paraId:n.paraId,providers:[r],ui:n.ui})}return e}),[])}function bt(){try{const e=localStorage.getItem(dt.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function kt(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:p.X.get().apiUrl!==e,isUrlValid:(r=e,r.length>=7&&(r.startsWith("ws://")||r.startsWith("wss://")||r.startsWith("light://")))};var r}const wt=(0,j.zo)(j.YE)`
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
`,Ct=g.memo((function({className:e="",offset:n,onClose:t}){const{t:i}=Vn(),o=(0,c.Rf)(i),{isLocalFork:s}=(0,S.h)(),[a,d]=(0,g.useState)((()=>yt(o))),[{apiUrl:u,groupIndex:m,hasUrlChanged:h,isUrlValid:f},x]=(0,g.useState)((()=>kt(p.X.get().apiUrl,a))),[v,y]=(0,g.useState)((()=>bt())),[b,k]=(0,g.useState)((()=>function(e){return Object.entries(l().get(vt)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:r})=>e===n&&r.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(a))),w=(0,g.useRef)(null),C=(0,g.useMemo)((()=>{let e=!1;return o.some((n=>n.value===u&&(e=!0,!0))),e}),[u,o]),A=(0,g.useMemo)((()=>{let e=!1;return v.some((n=>n===u&&(e=!0,!0))),e}),[u,v]),N=(0,g.useCallback)((e=>x((n=>({...n,groupIndex:e})))),[]),I=(0,g.useCallback)((()=>{if(!A)return;const e=v.filter((e=>e!==u));try{localStorage.setItem(dt.ie,JSON.stringify(e)),d(yt((0,c.Rf)(i))),y(bt())}catch(e){console.error(e)}}),[u,A,v,i]),Z=(0,g.useCallback)(((e,n)=>{k((t=>{const r={...t,[e]:n};return l().set(vt,r),r})),x(kt(n,a))}),[a]),R=(0,g.useCallback)((e=>{(0,pt._)(e)||(e=ct.ZP.toASCII(e)),x(kt(e,a))}),[a]),$=(0,g.useCallback)((()=>{l().set("localFork",""),p.X.set({...p.X.get(),apiUrl:u}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(u)}${window.location.hash}`),h||window.location.reload(),t()}),[u,t,h]),U=(0,g.useCallback)((()=>{l().set("localFork",u),p.X.set({...p.X.get(),apiUrl:u}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(u)}${window.location.hash}`),h||window.location.reload(),t()}),[u,t,h]),q=(0,g.useCallback)((()=>{try{localStorage.setItem(dt.ie,JSON.stringify([...v,u])),$()}catch(e){console.error(e)}}),[$,u,v]),T=(0,g.useMemo)((()=>function(e,n,t,r){return e?!n.startsWith("light://")&&!t:!r}(h,u,f,s)),[h,u,f,s]),z=(0,g.useMemo)((()=>function(e,n,t,r){return e?!!n.startsWith("light://")||!t:!!r}(h,u,f,s)),[h,u,f,s]);return(0,r.jsx)(wt,{buttons:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(j.zx,{icon:"code-fork",isDisabled:z,label:i("Fork Locally"),onClick:U,tooltip:"fork-locally-btn"}),(0,r.jsx)(j.zx,{icon:"sync",isDisabled:T,label:i("Switch"),onClick:$})]}),className:e,offset:n,onClose:t,position:"left",sidebarRef:w,children:a.map(((e,n)=>(0,r.jsx)(xt,{affinities:b,apiUrl:u,index:n,isSelected:m===n,setApiUrl:Z,setGroup:N,value:e,children:e.isDevelopment&&(0,r.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,r.jsx)(j.II,{className:"endpointCustom",isError:!f,isFull:!0,label:i("custom endpoint"),onChange:R,value:u}),A?(0,r.jsx)(j.zx,{className:"customButton",icon:"trash-alt",onClick:I}):(0,r.jsx)(j.zx,{className:"customButton",icon:"save",isDisabled:!f||C,onClick:q})]})},n)))})})),At=j.zo.div`
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
`,jt=g.memo((function({className:e}){const{api:n,isApiReady:t}=(0,S.h)(),i=(0,Kn.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:o}=(0,d.g)(),[s,a]=(0,st.O)(),l=!o;return(0,r.jsxs)(At,{className:e,children:[(0,r.jsxs)("div",{className:`apps--SideBar-logo-inner${l?" isClickable":""} highlight--color-contrast`,onClick:a,children:[(0,r.jsx)(j.Mj,{}),(0,r.jsxs)("div",{className:"info media--1000",children:[(0,r.jsx)(at.Z,{className:"chain"}),i&&(0,r.jsxs)("div",{className:"runtimeVersion",children:[i.specName.toString(),"/",i.specVersion.toNumber()]}),(0,r.jsx)(lt.Z,{className:"bestNumber",label:"#"})]}),l&&(0,r.jsx)(j.JO,{className:"dropdown",icon:s?"caret-right":"caret-down"})]}),s&&(0,r.jsx)(Ct,{onClose:a})]})})),Nt=()=>0,It=j.zo.li`
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
`,St=g.memo((function({className:e="",classNameText:n,isLink:t,isToplevel:i,route:{Modal:o,href:s,icon:a,name:l,text:c,useCounter:d=Nt}}){const[p,u]=(0,st.O)(),m=d();return(0,r.jsxs)(It,{className:`${e} ui--MenuItem ${m?"withCounter":""} ${t?"isLink":""} ${i?"topLevel highlight--color-contrast":""}`,children:[(0,r.jsxs)("a",{href:o?void 0:s||`#/${l}`,onClick:o?u:void 0,rel:"noopener noreferrer",target:s?"_blank":void 0,children:[(0,r.jsx)(j.JO,{icon:a}),(0,r.jsx)("span",{className:n,children:c}),!!m&&(0,r.jsx)(j.Ct,{color:"white",info:m})]}),o&&p&&(0,r.jsx)(o,{onClose:u})]})})),Zt="rgba(34, 36, 38, 0.12)",Rt="5px",$t=j.zo.li`
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
    box-shadow: 0 ${Rt} ${Rt} -${Rt} ${Zt}, ${Rt} 0 ${Rt} -${Rt} ${Zt}, -${Rt} 0 ${Rt} -${Rt} ${Zt};
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
`,Ut=g.memo((function({className:e="",isActive:n,name:t,routes:i}){return 1===i.length&&"settings"===i[0].group?(0,r.jsx)(St,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:i[0]}):(0,r.jsxs)($t,{className:`${e} ${n?"isActive":""}`,children:[(0,r.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,r.jsx)("span",{className:"smallHide",children:t}),(0,r.jsx)(j.JO,{className:"smallShow",icon:i[0].icon}),(0,r.jsx)(j.JO,{icon:"caret-down"})]}),(0,r.jsx)("ul",{className:"groupMenu",children:i.map((e=>(0,r.jsx)(St,{route:e},e.name)))})]})}));var qt=t(39082),Tt=t(52727);const zt=`apps v${"0.147.2-10-x".replace("-x","")}`,Et=j.zo.div`
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
`,Wt=g.memo((function({className:e=""}){const{api:n,isApiReady:t}=(0,S.h)();return(0,r.jsxs)(Et,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,r.jsxs)("div",{className:"node",children:[(0,r.jsx)(qt.Z,{})," ",(0,r.jsx)(Tt.Z,{label:"v"})]}),(0,r.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,r.jsx)("div",{children:zt})]})}));const Ot=j.zo.div`
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
`,Pt=g.memo((function({className:e=""}){const{t:n}=Vn(),{allAccounts:t,hasAccounts:i}=(0,Gn.x)(),o=(0,S.h)(),{allowTeleport:s}=(0,ot.M)(),a=(0,Kn.W7)(o.isApiReady&&o.api.query.sudo?.key),l=(0,R.TH)(),c=(0,g.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(n)),d=(0,g.useRef)(Mn(n)),p=(0,g.useRef)({accounts:n("Accounts"),developer:n("Developer"),files:n("Files"),governance:n("Governance"),network:n("Network"),settings:n("Settings")}),u=(0,g.useMemo)((()=>!!a&&t.some((e=>a.eq(e)))),[t,a]),m=(0,g.useMemo)((()=>function(e,n,t,r,i,o){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:r},i,o,s,{isDevelopment:a,isHidden:l,needsAccounts:c,needsApi:d,needsApiCheck:p,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!o||d&&(!t||!n||m&&!s||g&&!i||!r&&a||0!==Xn(e,d,u,p).length))}(t,r,i,o,e)))}))).filter((({routes:e})=>e.length))}(d.current,p.current,o,s,i,u)),[s,o,i,u]),h=(0,g.useMemo)((()=>d.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,r.jsx)(Ot,{className:`${e}${o.isApiReady&&o.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,r.jsxs)("div",{className:"menuContainer",children:[(0,r.jsxs)("div",{className:"menuSection",children:[(0,r.jsx)(jt,{}),(0,r.jsx)("ul",{className:"menuItems",children:m.map((({name:e,routes:n})=>(0,r.jsx)(Ut,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,r.jsx)("div",{className:"menuSection media--1200",children:(0,r.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,r.jsx)(St,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,r.jsx)(Wt,{className:"media--1400"})]})})})),Mt=j.zo.div`
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
`,Bt=g.memo((function({children:e,className:n="",icon:t,isBottom:i=!1,isFull:o=!1,type:s}){const[a,l]=(0,st.O)();return a?null:(0,r.jsx)(Mt,{className:`${n} ${"error"===s?"isError":"isInfo"} ${i?"isBottom":"isTop"} ${o?"isFull":"isPartial"}`,children:(0,r.jsxs)("div",{className:"content",children:[(0,r.jsx)(j.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,r.jsx)("div",{className:"contentItem",children:e}),(0,r.jsx)(j.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:l})]})})})),Ft=window.location.host.startsWith("polkadot.js.org"),Dt=(0,c.Rf)((()=>"")).map((e=>e.dnslink)).reduce(((e,n)=>(n&&!e.includes(n)&&e.push(n),e)),[]),Ht=g.memo((function({className:e}){const{t:n}=Vn(),{systemChain:t}=(0,S.h)(),i=(0,g.useMemo)((()=>{const e=t?.toLowerCase();return e&&Dt.includes(e)?`https://${e}.dotapps.io`:"https://dotapps.io"}),[t]);return Ft?(0,r.jsx)(Bt,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("You are connected to the development instance of the UI. For a fully decentralized experience, you are encouraged to use the IPFS deployed version as the canonical URL: "),(0,r.jsx)("a",{href:i,rel:"noreferrer",target:"_blank",children:i.replace("https://","")})]})}):null})),Lt=g.memo((function({className:e}){const{t:n}=Vn(),{isLocalFork:t}=(0,S.h)();return t?(0,r.jsx)(Bt,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("Local fork powered by "),(0,r.jsx)("a",{href:"https://github.com/AcalaNetwork/chopsticks",rel:"noreferrer",target:"_blank",children:"Chopsticks"}),"."]})}):null})),Xt=j.zo.div`
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
`,Jt=g.memo((function({className:e}){return(0,r.jsxs)(Xt,{className:e,children:[(0,r.jsx)(Lt,{}),(0,r.jsx)(Ht,{})]})})),Vt=p.X.apiType.param,_t="json-rpc"===p.X.apiType.type&&"string"==typeof Vt&&Vt.startsWith("ws://"),Gt="string"==typeof Vt&&Vt.includes("127.0.0.1"),Kt=window.location.protocol.startsWith("https:"),Yt=g.memo((function({className:e}){const{t:n}=Vn(),{apiError:t,isApiConnected:i,isApiReady:o,isWaitingInjected:s}=(0,S.h)();return t?(0,r.jsx)(Bt,{className:e,icon:"globe",type:"error",children:(0,r.jsx)("div",{children:t})}):o?s?(0,r.jsx)(Bt,{className:e,icon:"puzzle-piece",type:"info",children:(0,r.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):i?null:(0,r.jsxs)(Bt,{className:e,icon:"globe",type:"error",children:[(0,r.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),_t&&!Gt&&Kt?(0,r.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:Vt}})}):void 0]}):(0,r.jsx)(Bt,{className:e,icon:"globe",type:"info",children:(0,r.jsx)("div",{children:n(i?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})})),Qt=g.memo((function(){const{api:e,apiIdentity:n,isApiReady:t}=(0,S.h)(),i=(0,Kn.W7)(t&&e.derive.accounts?.indexes),o=(0,Kn.W7)(t&&n.query.identity?.registrars),s=(0,Kn.W7)(t&&e.query.balances?.totalIssuance),[a,l]=(0,g.useState)(!1);return(0,g.useEffect)((()=>{l(!!i||!!s||!!o)}),[]),(0,r.jsx)("div",{className:`apps--api-warm ${a.toString()}`})})),er=j.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,nr=g.memo((function({className:e=""}){const{themeClassName:n}=(0,I.F)(),{apiEndpoint:t,isDevelopment:i}=(0,S.h)(),o=(0,g.useMemo)((()=>i?void 0:t?.ui.color),[t,i]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(N.Z,{uiHighlight:o}),(0,r.jsxs)(er,{className:`${e} apps--Wrapper ${n}`,children:[(0,r.jsx)(Pt,{}),(0,r.jsxs)(j.J0,{children:[(0,r.jsx)(Z.ZP,{children:(0,r.jsx)(it,{})}),(0,r.jsx)(Yt,{}),(0,r.jsx)(Jt,{}),(0,r.jsx)("div",{id:"portals"})]})]}),(0,r.jsx)(Qt,{})]})}));function tr({uiTheme:e}){const n="dark"===e?"dark":"light";return document?.documentElement?.setAttribute("data-theme",n),{theme:n}}const rr=g.memo((function({isElectron:e,store:n}){const[t,i]=(0,g.useState)((()=>tr(p.X)));return(0,g.useEffect)((()=>{p.X.on("change",(e=>i(tr(e))))}),[]),(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(x.f6,{theme:t,children:(0,r.jsx)(y.q,{children:(0,r.jsx)(v.ApiCtxRoot,{apiUrl:p.X.apiUrl,isElectron:e,store:n,children:(0,r.jsx)(b.y,{children:(0,r.jsx)(k.u,{children:(0,r.jsx)(w.g,{children:(0,r.jsx)(C.w,{children:(0,r.jsx)(f.UT,{children:(0,r.jsx)(A.A,{children:(0,r.jsx)(nr,{})})})})})})})})})})})})),ir="root",or=document.getElementById(ir);if(!or)throw new Error(`Unable to find element with id '${ir}'`);(0,h.s)(or).render((0,r.jsx)(rr,{isElectron:!1}))},29038:(e,n,t)=>{var r={".":[57139,9],"./":[57139,9],"./Api":[8188,9],"./Api.tsx":[8188,9],"./hoc":[69356,9],"./hoc/":[69356,9],"./hoc/api":[94356,9],"./hoc/api.tsx":[94356,9],"./hoc/call":[98727,9],"./hoc/call.tsx":[98727,9],"./hoc/callDiv":[3364,9],"./hoc/callDiv.tsx":[3364,9],"./hoc/calls":[5246,9],"./hoc/calls.ts":[5246,9],"./hoc/index":[69356,9],"./hoc/index.ts":[69356,9],"./hoc/multi":[60028,9],"./hoc/multi.ts":[60028,9],"./hoc/observable":[33989,9],"./hoc/observable.tsx":[33989,9],"./hoc/onlyOn":[35475,9],"./hoc/onlyOn.tsx":[35475,9],"./hoc/types":[68570,9,8570],"./hoc/types.ts":[68570,9,8570],"./index":[57139,9],"./index.ts":[57139,9],"./light":[36956,9],"./light.spec":[58705,9,8705],"./light.spec.ts":[58705,9,8705],"./light/":[36956,9],"./light/index":[36956,9],"./light/index.ts":[36956,9],"./light/kusama":[37178,9],"./light/kusama/":[37178,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[37178,9],"./light/kusama/index.ts":[37178,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[15299,9],"./light/polkadot/":[15299,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[15299,9],"./light/polkadot/index.ts":[15299,9],"./statics":[95267,9],"./statics.ts":[95267,9],"./transform/echo":[80522,9],"./transform/echo.ts":[80522,9],"./types":[55903,9,5903],"./types.ts":[55903,9,5903],"./urlTypes":[81369,9],"./urlTypes.ts":[81369,9],"./util":[41186,9],"./util/":[41186,9],"./util/getEnvironment":[68372,9],"./util/getEnvironment.ts":[68372,9],"./util/historic":[77809,9],"./util/historic.ts":[77809,9],"./util/index":[41186,9],"./util/index.ts":[41186,9],"./util/intervalObservable":[71951,9],"./util/intervalObservable.ts":[71951,9],"./util/isEqual":[65345,9],"./util/isEqual.ts":[65345,9],"./util/triggerChange":[74733,9],"./util/triggerChange.ts":[74733,9]};function i(e){if(!t.o(r,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=r[e],i=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(i,16|n[1])))}i.keys=()=>Object.keys(r),i.id=29038,e.exports=i},18983:()=>{},33196:()=>{},38087:()=>{},74854:()=>{},66602:()=>{}},e=>{e.O(0,[6677,4668,5744,5839,1064,4124,2440,434,9398,9e3,8043,7924,212,2044,2854,5320,9684,2021,738,344,760,6829,5005,9319,2208,136,8484,893,6641,2685,2871,3108,353,3882,4292,9065,1080,2107,9121,62,1458,1454,8291,4635,5502,3569,6744,8758,7965,6510,3164],(()=>(83073,e(e.s=83073)))),e.O()}]);