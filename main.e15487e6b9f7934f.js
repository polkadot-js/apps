(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{83073:(e,n,t)=>{"use strict";var r=t(52322),i=t(46157),o=t(48834).Buffer;try{3===o.from([1,2,3]).length&&(i.Ur.Buffer=o)}catch{}var s=t(85168),a=t(23729),l=t.n(a),c=t(33318),d=t(83337),p=t(16039),u=t(48731);const m=function(){const e=s.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,u.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,u.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,c.Rf)((()=>"")),{ipnsChain:t}=(0,d.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const r=l().get("settings")||{},i=n.find((({value:e})=>!!e));return[r.apiUrl,void 0].includes(p.X.apiUrl)?p.X.apiUrl:i?i.value:"ws://127.0.0.1:9944"}();p.X.set({apiUrl:m}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(m),t(94953);var g=t(2784),h=t(17029),f=t(39857),x=t(31383),v=t(57139),y=t(87561),b=t(3773),k=t(68944),w=t(57120),C=t(44028),A=t(91012),j=t(13105),N=t(68235),I=t(37731),S=t(3663),Z=t(90778),R=t(54984),$=t(73557),U=t(88122),T=t(10189);function q(e){return{Component:U.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:T.Z}}var z=t(21508);function W(e){return{Component:z.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var E=t(49307),O=t(58370);function M(e){return{Component:E.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:O.Z}}var P=t(18760),B=t(80901);function D(e){return{Component:P.Z,display:{needsApi:["tx.ambassadorCollective.vote","tx.ambassadorReferenda.submit","consts.ambassadorReferenda.tracks"]},group:"governance",icon:"user-friends",name:"ambassador",text:e("nav.ambassador","Ambassador",{ns:"apps-routing"}),useCounter:B.Z}}var F=t(41155);function H(e){return{Component:F.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var L=t(95039),X=t(19739);function J(e){return{Component:L.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:X.Z}}var V=t(61817);function _(e){return{Component:V.Z,display:{needsApi:["query.broker.status"],needsApiInstances:!0},group:"network",icon:"flask",name:"broker",text:e("nav.broker","Coretime Broker",{ns:"app-broker"})}}var G=t(6742);function K(e){return{Component:G.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var Y=t(75798),Q=t(73352),ee=t(31725),ne=t(84195),te=t(48834).Buffer;function re(){try{if(!te.from([1,2,3])?.length)return console.error("ERROR: Unable to construct Buffer object for claims module"),!1;if(!ee.cR||!te.isBuffer((0,ne.Y)(new Uint8Array([1,2,3]))))return console.error("ERROR: Unable to use u8aToBuffer for claims module"),!1}catch{return console.error("ERROR: Fatal error in working with Buffer module"),!1}return!0}function ie(e){return{Component:Y.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"],needsApiCheck:re},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:Q.Z}}var oe=t(2799);function se(e){return{Component:oe.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var ae=t(22516);function le(e){try{return(0,u.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch{return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function ce(e){return{Component:ae.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:le},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var de=t(69558);function pe(e){return{Component:de.Z,display:{needsApi:["query.coretimeAssignmentProvider.coreDescriptors"],needsApiInstances:!0},group:"network",icon:"flask",name:"coretime",text:e("nav.coretime","Coretime",{ns:"apps-routing"})}}var ue=t(18324),me=t(40740);function ge(e){return{Component:ue.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:me.Z}}var he=t(50472),fe=t(61491);function xe(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch{return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function ve(e){return{Component:he.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:xe},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:fe.Z}}var ye=t(51406);function be(e){return{Component:ye.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var ke=t(38080);function we(e){return{Component:ke.Z,display:{needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var Ce=t(58064),Ae=t(16472);function je(e){return{Component:Ce.Z,display:{needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:Ae.Z}}var Ne=t(31043);function Ie(e){return{Component:Ne.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var Se=t(79865);function Ze(e){return{Component:Se.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var Re=t(30145);function $e(e){return{Component:Re.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var Ue=t(51213),Te=t(16743);function qe(e){return{Component:Ue.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:Te.Z}}var ze=t(50313);function We(e){return{Component:ze.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var Ee=t(90992);function Oe(e){return{Component:Ee.Z,display:{needsApi:["tx.nis.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"nis",text:e("nav.nis","Non-interactive Staking",{ns:"apps-routing"})}}var Me=t(93277);function Pe(e){return{Component:Me.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var Be=t(94349);function De(e){return{Component:Be.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var Fe=t(97662);function He(e){return{Component:Fe.Z,display:{needsAccounts:!0,needsApi:["query.preimage.statusFor","tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var Le=t(41857),Xe=t(76288);function Je(e){return{Component:Le.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:Xe.Z}}var Ve=t(89139),_e=t(1398);function Ge(e){return{Component:Ve.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:_e.Z}}var Ke=t(6583);function Ye(e){return{Component:Ke.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var Qe=t(39117);function en(e){return{Component:Qe.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var nn=t(14673);function tn(e){return{Component:nn.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var rn=t(32785),on=t(76075);function sn(e){return{Component:rn.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:on.Z}}var an=t(24569);function ln(e){return{Component:an.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var cn=t(96246),dn=t(58900);function pn(e){return{Component:cn.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:dn.Z}}var un=t(11337),mn=t(56949),gn=t(19729),hn=t(95292);function fn(e){try{const{nominatorCount:n,own:t,pageCount:r,total:i}=e.registry.createType((0,gn.P)(e.registry,e.query.staking.erasStakersOverview.creator.meta.type),{nominatorCount:hn.If,own:hn.If,pageCount:hn.If,total:hn.If});(0,u.hu)(i&&t&&n&&r&&i.eq(hn.If)&&t.eq(hn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(mn.TS,hn.If,{Account:mn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(hn.If,{Account:mn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,gn.P)(e.registry,e.query.staking.claimedRewards.creator.meta.type),[0]);(0,u.hu)(n.eq([0]),"Needs a legacyClaimedRewards array")}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function xn(e){return{Component:un.Z,display:{needsApi:["query.staking.erasStakersOverview","tx.staking.bond"],needsApiCheck:fn},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var vn=t(97473);function yn(e){try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,gn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:hn.If,who:mn.TS}],own:hn.If,total:hn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(hn.If)&&r.eq(hn.If)&&n.eq(hn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(mn.TS,hn.If,{Account:mn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(hn.If,{Account:mn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function bn(e){return{Component:vn.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:yn},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var kn=t(77854);function wn(e){if("function"==typeof e.query.staking.erasStakersOverview)return!1;try{const{others:[{value:n,who:t}],own:r,total:i}=e.registry.createType((0,gn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:hn.If,who:mn.TS}],own:hn.If,total:hn.If});(0,u.hu)(i&&r&&n&&t&&i.eq(hn.If)&&r.eq(hn.If)&&n.eq(hn.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(mn.TS,hn.If,{Account:mn.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(hn.If,{Account:mn.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,gn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{claimedRewards:[1,2,3]});if(n.claimedRewards)(0,u.hu)(n.claimedRewards.eq([1,2,3]),"Needs a claimedRewards array");else{const n=e.registry.createType((0,gn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{legacyClaimedRewards:[1,2,3]});(0,u.hu)(n.legacyClaimedRewards.eq([1,2,3]),"Needs a legacyClaimedRewards array")}}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function Cn(e){return{Component:kn.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:wn},group:"network",icon:"certificate",name:"legacy-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var An=t(46717);function jn(e){return{Component:An.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var Nn=t(54676);function In(e){return{Component:Nn.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var Sn=t(75509),Zn=t(87340);function Rn(e){return{Component:Sn.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:Zn.Z}}var $n=t(9847);function Un(e){return{Component:$n.Z,Modal:$n.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}function Tn(e){return{Component:N.Zd,Modal:N.Zd,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transferKeepAlive"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var qn=t(74425),zn=t(9039);function Wn(e){return{Component:qn.Z,display:{needsApi:["query.treasury.proposals"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:zn.Z}}var En=t(27008);function On(e){return{Component:En.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var Mn=t(7644);function Pn(e){return{Component:Mn.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function Bn(e){return[q(e),W(e),be(e),ie(e),De(e),Tn(e),Un(e),xn(e),bn(e),Cn(e),se(e),_(e),pe(e),Ge(e),qe(e),M(e),D(e),je(e),Je(e),He(e),Pn(e),ve(e),ge(e),Rn(e),Wn(e),J(e),Pe(e),H(e),We(e),pn(e),Oe(e),Ze(e),tn(e),K(e),ce(e),jn(e),we(e),Ye(e),en(e),ln(e),In(e),Ie(e),$e(e),On(e),sn(e)]}var Dn=t(86135),Fn=t(59149),Hn=t(82671),Ln=t(33661);function Xn(e,n,t){const[r,i,o]=n.split("."),[s]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),i)||[i],a=e[r][s]?s:i;try{return"consts"===r?(0,Hn.K)(e[r][a][o]):(0,Ln.m)(e[r][a][o])}catch{return!1}}function Jn(e,n,t=!1,r){if(!n)return[];const i=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,r)=>n||Xn(e,r,t)),!1):Xn(e,n,t))));return i.length||!r||r(e)?i:["needsApiCheck"]}var Vn=t(61349);function _n(){return(0,Vn.$G)("apps")}const Gn=g.memo((function({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,r.jsx)($.Fg,{to:"/explorer"})}));var Kn=t(34814),Yn=t(9118),Qn=t(64021),et=t(69516);let nt;const tt=g.memo((function({optionsAll:e}){const{queueAction:n}=(0,Dn.L)(),{api:t,isApiReady:i}=(0,Z.h)(),{allAccounts:o}=(0,Kn.x)(),{t:s}=_n(),a=(0,Yn.W7)(i&&t.query.system?.events);return(0,g.useEffect)((()=>{const t=function(e,n,t,r){const i=(0,et.R)((0,Qn.d)(JSON.stringify(r)));return t&&r&&i!==nt?(nt=i,r.map((({event:{data:t,method:r,section:i}})=>{if("balances"===i&&"Transfer"===r){const o=t[1].toString();if(e.includes(o))return{account:o,action:`${i}.${r}`,message:n("transfer received"),status:"event"}}else if("democracy"===i){const e=t[0].toString();return{action:`${i}.${r}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(o,s,e,a);t&&n(t)}),[o,a,e,n,s]),(0,r.jsx)(N.qb,{})})),rt={Component:Gn,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"},it=N.zo.div`
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
`,ot=g.memo((function({className:e}){const n=(0,$.TH)(),{t}=_n(),{api:i,isApiConnected:o,isApiReady:s,isDevelopment:a}=(0,Z.h)(),{queueAction:l}=(0,Dn.L)(),{Component:c,display:{needsApi:d,needsApiCheck:p,needsApiInstances:u},icon:m,name:h,text:f}=(0,g.useMemo)((()=>{const e=n.pathname.slice(1)||"";return Bn(t).find((n=>n&&e.startsWith(n.name)&&(a||!n.display.isDevelopment)))||rt}),[a,n,t]),x=(0,g.useMemo)((()=>d?s&&o?Jn(i,d,u,p):null:[]),[i,o,s,d,p,u]);return(0,r.jsx)(it,{className:e,children:x?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(N.SV,{trigger:h,children:(0,r.jsx)(Fn.m.Provider,{value:{icon:m,text:f},children:x.length?(0,r.jsx)(Gn,{basePath:`/${h}`,location:n,missingApis:x,onStatusChange:l}):(0,r.jsx)(c,{basePath:`/${h}`,location:n,onStatusChange:l})})})}),(0,r.jsx)(tt,{})]}):(0,r.jsx)("div",{className:"connecting",children:(0,r.jsx)(N.$j,{label:t("Initializing connection")})})})}));var st=t(41411),at=t(38894),lt=t(12176),ct=t(95689),dt=t(68058),pt=t(10072),ut=t(70676);const mt=(0,N.zo)(N.ZD)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,gt=g.memo((function({apiUrl:e,className:n,label:t,setApiUrl:i,url:o}){const s=(0,g.useCallback)((()=>i(o)),[i,o]);return(0,r.jsx)(mt,{className:n,isRadio:!0,label:t,onChange:s,value:e===o})})),ht=N.zo.div`
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
`,ft=g.memo((function({apiUrl:e,className:n="",setApiUrl:t,value:{isChild:i,isRelay:o,isUnreachable:s,name:a,nameRelay:l,paraId:c,providers:d,ui:p}}){const{t:u}=_n(),m=(0,g.useMemo)((()=>d.some((({url:n})=>n===e))),[e,d]),h=(0,g.useCallback)((()=>{const e=d.filter((({url:e})=>!e.startsWith("light://")));return t(a,e[Math.floor(Math.random()*e.length)].url)}),[a,d,t]),f=(0,g.useCallback)((e=>t(a,e)),[a,t]);return(0,r.jsxs)(ht,{className:`${n}${m?" isSelected highlight--border":""}${s?" isUnreachable":""}`,children:[(0,r.jsxs)("div",{className:"endpointSection"+(i?" isChild":""),onClick:s?void 0:h,children:[(0,r.jsx)(N.Mj,{className:"endpointIcon",isInline:!0,logo:p.logo||"empty",withoutHl:!0}),(0,r.jsxs)("div",{className:"endpointValue",children:[(0,r.jsx)("div",{children:a}),m&&(o||!!c)&&(0,r.jsx)("div",{className:"endpointExtra",children:o?u("Relay chain"):u(c&&c<1e3?"{{relay}} System":c&&c<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:l}})})]})]}),m&&d.map((({name:n,url:t})=>(0,r.jsx)(gt,{apiUrl:e,label:n,setApiUrl:f,url:t},t)))]})})),xt=N.zo.div`
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
`,vt=g.memo((function({affinities:e,apiUrl:n,children:t,className:i="",index:o,isSelected:s,setApiUrl:a,setGroup:l,value:{header:c,isSpaced:d,networks:p}}){const u=(0,g.useCallback)((()=>l(s?-1:o)),[o,s,l]),m=(0,g.useMemo)((()=>p.filter((({isUnreachable:e})=>!e))),[p]);return(0,r.jsxs)(xt,{className:`${i}${s?" isSelected":""}`,children:[(0,r.jsxs)("div",{className:"groupHeader"+(d?" isSpaced":""),onClick:u,children:[(0,r.jsx)(N.JO,{icon:s?"caret-up":"caret-down"}),c]}),s&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("div",{className:"groupNetworks",children:m.map(((t,i)=>(0,r.jsx)(ft,{affinity:e[t.name],apiUrl:n,setApiUrl:a,value:t},i)))}),t]})]})})),yt="network:affinities";function bt(e){return e.reduce(((e,n)=>{if(n.isHeader)e.push({header:n.text,isDevelopment:n.isDevelopment,isSpaced:n.isSpaced,networks:[]});else{const t=e[e.length-1],r={isLightClient:n.isLightClient,name:n.textBy,url:n.value};t.networks[t.networks.length-1]&&n.text===t.networks[t.networks.length-1].name?t.networks[t.networks.length-1].providers.push(r):n.isUnreachable||t.networks.push({isChild:n.isChild,isRelay:!!n.genesisHash,name:n.text,nameRelay:n.textRelay,paraId:n.paraId,providers:[r],ui:n.ui})}return e}),[])}function kt(){try{const e=localStorage.getItem(pt.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function wt(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:p.X.get().apiUrl!==e,isUrlValid:(r=e,r.length>=7&&(r.startsWith("ws://")||r.startsWith("wss://")||r.startsWith("light://")))};var r}const Ct=(0,N.zo)(N.YE)`
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
`,At=g.memo((function({className:e="",offset:n,onClose:t}){const{t:i}=_n(),o=(0,c.Rf)(i),{isLocalFork:s}=(0,Z.h)(),[a,d]=(0,g.useState)((()=>bt(o))),[{apiUrl:u,groupIndex:m,hasUrlChanged:h,isUrlValid:f},x]=(0,g.useState)((()=>wt(p.X.get().apiUrl,a))),[v,y]=(0,g.useState)((()=>kt())),[b,k]=(0,g.useState)((()=>function(e){return Object.entries(l().get(yt)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:r})=>e===n&&r.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(a))),w=(0,g.useRef)(null),C=(0,g.useMemo)((()=>{let e=!1;return o.some((n=>n.value===u&&(e=!0,!0))),e}),[u,o]),A=(0,g.useMemo)((()=>{let e=!1;return v.some((n=>n===u&&(e=!0,!0))),e}),[u,v]),j=(0,g.useCallback)((e=>x((n=>({...n,groupIndex:e})))),[]),I=(0,g.useCallback)((()=>{if(!A)return;const e=v.filter((e=>e!==u));try{localStorage.setItem(pt.ie,JSON.stringify(e)),d(bt((0,c.Rf)(i))),y(kt())}catch(e){console.error(e)}}),[u,A,v,i]),S=(0,g.useCallback)(((e,n)=>{k((t=>{const r={...t,[e]:n};return l().set(yt,r),r})),x(wt(n,a))}),[a]),R=(0,g.useCallback)((e=>{(0,ut._)(e)||(e=dt.ZP.toASCII(e)),x(wt(e,a))}),[a]),$=(0,g.useCallback)((()=>{l().set("localFork",""),p.X.set({...p.X.get(),apiUrl:u}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(u)}${window.location.hash}`),h||window.location.reload(),t()}),[u,t,h]),U=(0,g.useCallback)((()=>{l().set("localFork",u),p.X.set({...p.X.get(),apiUrl:u}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(u)}${window.location.hash}`),h||window.location.reload(),t()}),[u,t,h]),T=(0,g.useCallback)((()=>{try{localStorage.setItem(pt.ie,JSON.stringify([...v,u])),$()}catch(e){console.error(e)}}),[$,u,v]),q=(0,g.useMemo)((()=>function(e,n,t,r){return e?!n.startsWith("light://")&&!t:!r}(h,u,f,s)),[h,u,f,s]),z=(0,g.useMemo)((()=>function(e,n,t,r){return e?!!n.startsWith("light://")||!t:!!r}(h,u,f,s)),[h,u,f,s]);return(0,r.jsx)(Ct,{buttons:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(N.zx,{icon:"code-fork",isDisabled:z,label:i("Fork Locally"),onClick:U,tooltip:"fork-locally-btn"}),(0,r.jsx)(N.zx,{icon:"sync",isDisabled:q,label:i("Switch"),onClick:$})]}),className:e,offset:n,onClose:t,position:"left",sidebarRef:w,children:a.map(((e,n)=>(0,r.jsx)(vt,{affinities:b,apiUrl:u,index:n,isSelected:m===n,setApiUrl:S,setGroup:j,value:e,children:e.isDevelopment&&(0,r.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,r.jsx)(N.II,{className:"endpointCustom",isError:!f,isFull:!0,label:i("custom endpoint"),onChange:R,value:u}),A?(0,r.jsx)(N.zx,{className:"customButton",icon:"trash-alt",onClick:I}):(0,r.jsx)(N.zx,{className:"customButton",icon:"save",isDisabled:!f||C,onClick:T})]})},n)))})})),jt=N.zo.div`
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
`,Nt=g.memo((function({className:e}){const{api:n,isApiReady:t}=(0,Z.h)(),i=(0,Yn.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:o}=(0,d.g)(),[s,a]=(0,at.O)(),l=!o;return(0,r.jsxs)(jt,{className:e,children:[(0,r.jsxs)("div",{className:`apps--SideBar-logo-inner${l?" isClickable":""} highlight--color-contrast`,onClick:a,children:[(0,r.jsx)(N.Mj,{}),(0,r.jsxs)("div",{className:"info media--1000",children:[(0,r.jsx)(lt.Z,{className:"chain"}),i&&(0,r.jsxs)("div",{className:"runtimeVersion",children:[i.specName.toString(),"/",i.specVersion.toNumber()]}),(0,r.jsx)(ct.Z,{className:"bestNumber",label:"#"})]}),l&&(0,r.jsx)(N.JO,{className:"dropdown",icon:s?"caret-right":"caret-down"})]}),s&&(0,r.jsx)(At,{onClose:a})]})})),It=()=>0,St=N.zo.li`
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
`,Zt=g.memo((function({className:e="",classNameText:n,isLink:t,isToplevel:i,route:{Modal:o,href:s,icon:a,name:l,text:c,useCounter:d=It}}){const[p,u]=(0,at.O)(),m=d();return(0,r.jsxs)(St,{className:`${e} ui--MenuItem ${m?"withCounter":""} ${t?"isLink":""} ${i?"topLevel highlight--color-contrast":""}`,children:[(0,r.jsxs)("a",{href:o?void 0:s||`#/${l}`,onClick:o?u:void 0,rel:"noopener noreferrer",target:s?"_blank":void 0,children:[(0,r.jsx)(N.JO,{icon:a}),(0,r.jsx)("span",{className:n,children:c}),!!m&&(0,r.jsx)(N.Ct,{color:"white",info:m})]}),o&&p&&(0,r.jsx)(o,{onClose:u})]})})),Rt="rgba(34, 36, 38, 0.12)",$t="5px",Ut=N.zo.li`
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
    box-shadow: 0 ${$t} ${$t} -${$t} ${Rt}, ${$t} 0 ${$t} -${$t} ${Rt}, -${$t} 0 ${$t} -${$t} ${Rt};
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
`,Tt=g.memo((function({className:e="",isActive:n,name:t,routes:i}){return 1===i.length&&"settings"===i[0].group?(0,r.jsx)(Zt,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:i[0]}):(0,r.jsxs)(Ut,{className:`${e} ${n?"isActive":""}`,children:[(0,r.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,r.jsx)("span",{className:"smallHide",children:t}),(0,r.jsx)(N.JO,{className:"smallShow",icon:i[0].icon}),(0,r.jsx)(N.JO,{icon:"caret-down"})]}),(0,r.jsx)("ul",{className:"groupMenu",children:i.map((e=>(0,r.jsx)(Zt,{route:e},e.name)))})]})}));var qt=t(39082),zt=t(52727);const Wt=`apps v${"0.155.2-6-x".replace("-x","")}`,Et=N.zo.div`
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
`,Ot=g.memo((function({className:e=""}){const{api:n,isApiReady:t}=(0,Z.h)();return(0,r.jsxs)(Et,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,r.jsxs)("div",{className:"node",children:[(0,r.jsx)(qt.Z,{})," ",(0,r.jsx)(zt.Z,{label:"v"})]}),(0,r.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,r.jsx)("div",{children:Wt})]})}));const Mt=N.zo.div`
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
`,Pt=g.memo((function({className:e=""}){const{t:n}=_n(),{allAccounts:t,hasAccounts:i}=(0,Kn.x)(),o=(0,Z.h)(),{allowTeleport:s}=(0,st.M)(),a=(0,Yn.W7)(o.isApiReady&&o.api.query.sudo?.key),l=(0,$.TH)(),c=(0,g.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(n)),d=(0,g.useRef)(Bn(n)),p=(0,g.useRef)({accounts:n("Accounts"),developer:n("Developer"),files:n("Files"),governance:n("Governance"),network:n("Network"),settings:n("Settings")}),u=(0,g.useMemo)((()=>!!a&&t.some((e=>a.eq(e)))),[t,a]),m=(0,g.useMemo)((()=>function(e,n,t,r,i,o){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:r},i,o,s,{isDevelopment:a,isHidden:l,needsAccounts:c,needsApi:d,needsApiCheck:p,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!o||d&&(!t||!n||m&&!s||g&&!i||!r&&a||0!==Jn(e,d,u,p).length))}(t,r,i,o,e)))}))).filter((({routes:e})=>e.length))}(d.current,p.current,o,s,i,u)),[s,o,i,u]),h=(0,g.useMemo)((()=>d.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,r.jsx)(Mt,{className:`${e}${o.isApiReady&&o.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,r.jsxs)("div",{className:"menuContainer",children:[(0,r.jsxs)("div",{className:"menuSection",children:[(0,r.jsx)(Nt,{}),(0,r.jsx)("ul",{className:"menuItems",children:m.map((({name:e,routes:n})=>(0,r.jsx)(Tt,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,r.jsx)("div",{className:"menuSection media--1200",children:(0,r.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,r.jsx)(Zt,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,r.jsx)(Ot,{className:"media--1400"})]})})})),Bt=N.zo.div`
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
`,Dt=g.memo((function({children:e,className:n="",icon:t,isBottom:i=!1,isDev:o,isFull:s=!1,type:a}){const[l,c]=(0,at.O)(),d=(0,g.useCallback)((()=>{o&&localStorage.setItem("dev:notification",(new Date).toString()),c()}),[o,c]);return(0,g.useEffect)((()=>{const e=localStorage.getItem("dev:notification");if(e){const n=new Date(e);n.setMonth(n.getMonth()+1),n.getTime()<=(new Date).getTime()?localStorage.removeItem("dev:notification"):c()}}),[c]),l?null:(0,r.jsx)(Bt,{className:`${n} ${"error"===a?"isError":"isInfo"} ${i?"isBottom":"isTop"} ${s?"isFull":"isPartial"}`,children:(0,r.jsxs)("div",{className:"content",children:[(0,r.jsx)(N.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,r.jsx)("div",{className:"contentItem",children:e}),(0,r.jsx)(N.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:d})]})})})),Ft=window.location.host.startsWith("polkadot.js.org"),Ht=(0,c.Rf)((()=>"")).map((e=>e.dnslink)).reduce(((e,n)=>(n&&!e.includes(n)&&e.push(n),e)),[]),Lt=g.memo((function({className:e}){const{t:n}=_n(),{systemChain:t}=(0,Z.h)(),i=(0,g.useMemo)((()=>{const e=t?.toLowerCase();return e&&Ht.includes(e)?`https://${e}.dotapps.io`:"https://dotapps.io"}),[t]);return Ft?(0,r.jsx)(Dt,{className:e,icon:"link",isBottom:!0,isDev:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("You are connected to the development instance of the UI. For a fully decentralized experience, you are encouraged to use the IPFS deployed version as the canonical URL: "),(0,r.jsx)("a",{href:i,rel:"noreferrer",target:"_blank",children:i.replace("https://","")})]})}):null})),Xt=g.memo((function({className:e}){const{t:n}=_n(),{isLocalFork:t}=(0,Z.h)();return t?(0,r.jsx)(Dt,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,r.jsxs)("div",{children:[n("Local fork powered by "),(0,r.jsx)("a",{href:"https://github.com/AcalaNetwork/chopsticks",rel:"noreferrer",target:"_blank",children:"Chopsticks"}),"."]})}):null})),Jt=N.zo.div`
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
`,Vt=g.memo((function({className:e}){return(0,r.jsxs)(Jt,{className:e,children:[(0,r.jsx)(Xt,{}),(0,r.jsx)(Lt,{})]})})),_t=p.X.apiType.param,Gt="json-rpc"===p.X.apiType.type&&"string"==typeof _t&&_t.startsWith("ws://"),Kt="string"==typeof _t&&_t.includes("127.0.0.1"),Yt=window.location.protocol.startsWith("https:"),Qt=g.memo((function({className:e}){const{t:n}=_n(),{apiError:t,isApiConnected:i,isApiReady:o,isWaitingInjected:s}=(0,Z.h)();return t?(0,r.jsx)(Dt,{className:e,icon:"globe",type:"error",children:(0,r.jsx)("div",{children:t})}):o?s?(0,r.jsx)(Dt,{className:e,icon:"puzzle-piece",type:"info",children:(0,r.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):i?null:(0,r.jsxs)(Dt,{className:e,icon:"globe",type:"error",children:[(0,r.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),Gt&&!Kt&&Yt?(0,r.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:_t}})}):void 0]}):(0,r.jsx)(Dt,{className:e,icon:"globe",type:"info",children:(0,r.jsx)("div",{children:n(i?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})})),er=g.memo((function(){const{api:e,apiIdentity:n,isApiReady:t}=(0,Z.h)(),i=(0,Yn.W7)(t&&e.derive.accounts?.indexes),o=(0,Yn.W7)(t&&n.query.identity?.registrars),s=(0,Yn.W7)(t&&e.query.balances?.totalIssuance),[a,l]=(0,g.useState)(!1);return(0,g.useEffect)((()=>{l(!!i||!!s||!!o)}),[]),(0,r.jsx)("div",{className:`apps--api-warm ${a.toString()}`})})),nr=N.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,tr=g.memo((function({className:e=""}){const{themeClassName:n}=(0,S.F)(),{apiEndpoint:t,isDevelopment:i}=(0,Z.h)(),o=(0,g.useMemo)((()=>i?void 0:t?.ui.color),[t,i]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(I.Z,{uiHighlight:o}),(0,r.jsxs)(nr,{className:`${e} apps--Wrapper ${n}`,children:[(0,r.jsx)(Pt,{}),(0,r.jsxs)(N.J0,{children:[(0,r.jsx)(R.ZP,{children:(0,r.jsx)(ot,{})}),(0,r.jsx)(Qt,{}),(0,r.jsx)(Vt,{}),(0,r.jsx)("div",{id:"portals"})]})]}),(0,r.jsx)(er,{})]})}));function rr({uiTheme:e}){const n="dark"===e?"dark":"light";return document?.documentElement?.setAttribute("data-theme",n),{theme:n}}const ir=g.memo((function({isElectron:e,store:n}){const[t,i]=(0,g.useState)((()=>rr(p.X)));return(0,g.useEffect)((()=>{p.X.on("change",(e=>i(rr(e))))}),[]),(0,r.jsx)(g.Suspense,{fallback:"...",children:(0,r.jsx)(x.f6,{theme:t,children:(0,r.jsx)(y.q,{children:(0,r.jsx)(v.ApiCtxRoot,{apiUrl:p.X.apiUrl,isElectron:e,store:n,children:(0,r.jsx)(b.y,{children:(0,r.jsx)(k.u,{children:(0,r.jsx)(w.g,{children:(0,r.jsx)(C.w,{children:(0,r.jsx)(f.UT,{children:(0,r.jsx)(A.A,{children:(0,r.jsx)(j.U,{children:(0,r.jsx)(tr,{})})})})})})})})})})})})})),or="root",sr=document.getElementById(or);if(!sr)throw new Error(`Unable to find element with id '${or}'`);(0,h.s)(sr).render((0,r.jsx)(ir,{isElectron:!1}))},29038:(e,n,t)=>{var r={".":[57139,9],"./":[57139,9],"./Api":[8188,9],"./Api.tsx":[8188,9],"./hoc":[69356,9],"./hoc/":[69356,9],"./hoc/api":[94356,9],"./hoc/api.tsx":[94356,9],"./hoc/call":[98727,9],"./hoc/call.tsx":[98727,9],"./hoc/callDiv":[3364,9],"./hoc/callDiv.tsx":[3364,9],"./hoc/calls":[5246,9],"./hoc/calls.ts":[5246,9],"./hoc/index":[69356,9],"./hoc/index.ts":[69356,9],"./hoc/multi":[60028,9],"./hoc/multi.ts":[60028,9],"./hoc/observable":[33989,9],"./hoc/observable.tsx":[33989,9],"./hoc/onlyOn":[35475,9],"./hoc/onlyOn.tsx":[35475,9],"./hoc/types":[68570,9,8570],"./hoc/types.ts":[68570,9,8570],"./index":[57139,9],"./index.ts":[57139,9],"./light":[36956,9],"./light.spec":[58705,9,8705],"./light.spec.ts":[58705,9,8705],"./light/":[36956,9],"./light/index":[36956,9],"./light/index.ts":[36956,9],"./light/kusama":[37178,9],"./light/kusama/":[37178,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[37178,9],"./light/kusama/index.ts":[37178,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[15299,9],"./light/polkadot/":[15299,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[15299,9],"./light/polkadot/index.ts":[15299,9],"./light/polkadot/laos.json":[54689,3,4689],"./statics":[95267,9],"./statics.ts":[95267,9],"./transform/echo":[80522,9],"./transform/echo.ts":[80522,9],"./types":[55903,9,5903],"./types.ts":[55903,9,5903],"./urlTypes":[81369,9],"./urlTypes.ts":[81369,9],"./util":[41186,9],"./util/":[41186,9],"./util/getEnvironment":[68372,9],"./util/getEnvironment.ts":[68372,9],"./util/historic":[77809,9],"./util/historic.ts":[77809,9],"./util/index":[41186,9],"./util/index.ts":[41186,9],"./util/intervalObservable":[71951,9],"./util/intervalObservable.ts":[71951,9],"./util/isEqual":[65345,9],"./util/isEqual.ts":[65345,9],"./util/triggerChange":[74733,9],"./util/triggerChange.ts":[74733,9]};function i(e){if(!t.o(r,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=r[e],i=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(i,16|n[1])))}i.keys=()=>Object.keys(r),i.id=29038,e.exports=i},18983:()=>{},33196:()=>{},38087:()=>{},74854:()=>{},66602:()=>{}},e=>{e.O(0,[6677,4668,5744,6489,1064,4124,2440,434,9398,9e3,8043,7924,212,2044,2854,5320,9684,2021,738,344,760,6829,5005,9319,2208,136,8484,893,6641,2685,2871,3108,353,3882,4292,9065,1080,2107,9121,62,1458,1454,8291,4635,5502,3569,6744,8758,7965,6510,3164],(()=>(83073,e(e.s=83073)))),e.O()}]);