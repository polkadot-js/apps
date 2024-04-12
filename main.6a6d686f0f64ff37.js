(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{76062:(e,n,t)=>{"use strict";var i=t(52322),r=t(46157),o=t(48834).Buffer;try{3===o.from([1,2,3]).length&&(r.Ur.Buffer=o)}catch{}var s=t(85168),a=t(23729),l=t.n(a),c=t(72489),d=t(83337),p=t(16039),u=t(48731);const m=function(){const e=s.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,u.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,u.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,c.Rf)((()=>"")),{ipnsChain:t}=(0,d.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const i=l().get("settings")||{},r=n.find((({value:e})=>!!e));return[i.apiUrl,void 0].includes(p.X.apiUrl)?p.X.apiUrl:r?r.value:"ws://127.0.0.1:9944"}();p.X.set({apiUrl:m}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(m),t(94953);var g=t(2784),h=t(17029),x=t(39857),f=t(31383),v=t(57139),y=t(87561),b=t(3773),k=t(68944),w=t(57120),C=t(44028),j=t(91012),A=t(64348),N=t(37731),S=t(3663),I=t(90778),Z=t(4984),$=t(73557),R=t(69350),U=t(10189);function z(e){return{Component:R.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:U.Z}}var T=t(28096);function q(e){return{Component:T.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var W=t(49307),E=t(58370);function M(e){return{Component:W.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:E.Z}}var O=t(39559);function B(e){return{Component:O.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var P=t(95039),F=t(19739);function D(e){return{Component:P.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:F.Z}}var H=t(6742);function L(e){return{Component:H.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var X=t(75798),J=t(73352),V=t(31725),_=t(84195),G=t(48834).Buffer;function K(){try{if(!G.from([1,2,3])?.length)return console.error("ERROR: Unable to construct Buffer object for claims module"),!1;if(!V.cR||!G.isBuffer((0,_.Y)(new Uint8Array([1,2,3]))))return console.error("ERROR: Unable to use u8aToBuffer for claims module"),!1}catch{return console.error("ERROR: Fatal error in working with Buffer module"),!1}return!0}function Y(e){return{Component:X.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"],needsApiCheck:K},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:J.Z}}var Q=t(2799);function ee(e){return{Component:Q.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var ne=t(22516);function te(e){try{return(0,u.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch{return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function ie(e){return{Component:ne.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:te},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var re=t(18324),oe=t(40740);function se(e){return{Component:re.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:oe.Z}}var ae=t(50472),le=t(61491);function ce(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch{return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function de(e){return{Component:ae.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:ce},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:le.Z}}var pe=t(51406);function ue(e){return{Component:pe.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var me=t(38080);function ge(e){return{Component:me.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var he=t(58064),xe=t(16472);function fe(e){return{Component:he.Z,display:{needsAccounts:!0,needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:xe.Z}}var ve=t(31043);function ye(e){return{Component:ve.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var be=t(79865);function ke(e){return{Component:be.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var we=t(30145);function Ce(e){return{Component:we.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var je=t(51213),Ae=t(16743);function Ne(e){return{Component:je.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:Ae.Z}}var Se=t(50313);function Ie(e){return{Component:Se.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var Ze=t(90992);function $e(e){return{Component:Ze.Z,display:{needsApi:["tx.nis.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"nis",text:e("nav.nis","Non-interactive Staking",{ns:"apps-routing"})}}var Re=t(93242);function Ue(e){return{Component:Re.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var ze=t(94349);function Te(e){return{Component:ze.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var qe=t(20600);function We(e){return{Component:qe.Z,display:{needsAccounts:!0,needsApi:["query.preimage.statusFor","tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var Ee=t(41857),Me=t(76288);function Oe(e){return{Component:Ee.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:Me.Z}}var Be=t(89139),Pe=t(1398);function Fe(e){return{Component:Be.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:Pe.Z}}var De=t(6583);function He(e){return{Component:De.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var Le=t(39117);function Xe(e){return{Component:Le.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var Je=t(14673);function Ve(e){return{Component:Je.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var _e=t(19433),Ge=t(76075);function Ke(e){return{Component:_e.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:Ge.Z}}var Ye=t(24569);function Qe(e){return{Component:Ye.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var en=t(96246),nn=t(58900);function tn(e){return{Component:en.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:nn.Z}}var rn=t(16215),on=t(56949),sn=t(19729),an=t(95292);function ln(e){try{const{others:[{value:n,who:t}],own:i,total:r}=e.registry.createType((0,sn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:an.If,who:on.TS}],own:an.If,total:an.If});(0,u.hu)(r&&i&&n&&t&&r.eq(an.If)&&i.eq(an.If)&&n.eq(an.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(on.TS,an.If,{Account:on.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(an.If,{Account:on.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}try{const n=e.registry.createType((0,sn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{claimedRewards:[1,2,3]});if(n.claimedRewards)(0,u.hu)(n.claimedRewards.eq([1,2,3]),"Needs a claimedRewards array");else{const n=e.registry.createType((0,sn.P)(e.registry,e.query.staking.ledger.creator.meta.type),{legacyClaimedRewards:[1,2,3]});(0,u.hu)(n.legacyClaimedRewards.eq([1,2,3]),"Needs a legacyClaimedRewards array")}}catch{return console.warn("No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route"),!1}return!0}function cn(e){return{Component:rn.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:ln},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var dn=t(97473);function pn(e){try{const{others:[{value:n,who:t}],own:i,total:r}=e.registry.createType((0,sn.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:an.If,who:on.TS}],own:an.If,total:an.If});(0,u.hu)(r&&i&&n&&t&&r.eq(an.If)&&i.eq(an.If)&&n.eq(an.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(on.TS,an.If,{Account:on.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(an.If,{Account:on.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function un(e){return{Component:dn.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:pn},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var mn=t(46717);function gn(e){return{Component:mn.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var hn=t(54676);function xn(e){return{Component:hn.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var fn=t(75509),vn=t(87340);function yn(e){return{Component:fn.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:vn.Z}}var bn=t(9847);function kn(e){return{Component:bn.Z,Modal:bn.Z,display:{isHidden:!1,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}function wn(e){return{Component:A.Zd,Modal:A.Zd,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transferKeepAlive"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var Cn=t(74425),jn=t(9039);function An(e){return{Component:Cn.Z,display:{needsApi:["tx.treasury.proposeSpend"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:jn.Z}}var Nn=t(27008);function Sn(e){return{Component:Nn.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var In=t(7644);function Zn(e){return{Component:In.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function $n(e){return[z(e),q(e),ue(e),Y(e),Te(e),wn(e),kn(e),cn(e),un(e),ee(e),Fe(e),Ne(e),M(e),fe(e),Oe(e),We(e),Zn(e),de(e),se(e),yn(e),An(e),D(e),Ue(e),B(e),Ie(e),tn(e),$e(e),ke(e),Ve(e),L(e),ie(e),gn(e),ge(e),He(e),Xe(e),Qe(e),xn(e),ye(e),Ce(e),Sn(e),Ke(e)]}var Rn=t(86135),Un=t(59149),zn=t(82671),Tn=t(33661);function qn(e,n,t){const[i,r,o]=n.split("."),[s]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),r)||[r];try{return"consts"===i?(0,zn.K)(e[i][s][o]):(0,Tn.m)(e[i][s][o])}catch{return!1}}function Wn(e,n,t=!1,i){if(!n)return[];const r=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,i)=>n||qn(e,i,t)),!1):qn(e,n,t))));return r.length||!i||i(e)?r:["needsApiCheck"]}var En=t(61349);function Mn(){return(0,En.$G)("apps")}const On=g.memo((function({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,i.jsx)($.Fg,{to:"/explorer"})}));var Bn=t(34814),Pn=t(9118),Fn=t(64021),Dn=t(69516);let Hn;const Ln=g.memo((function({optionsAll:e}){const{queueAction:n}=(0,Rn.L)(),{api:t,isApiReady:r}=(0,I.h)(),{allAccounts:o}=(0,Bn.x)(),{t:s}=Mn(),a=(0,Pn.W7)(r&&t.query.system?.events);return(0,g.useEffect)((()=>{const t=function(e,n,t,i){const r=(0,Dn.R)((0,Fn.d)(JSON.stringify(i)));return t&&i&&r!==Hn?(Hn=r,i.map((({event:{data:t,method:i,section:r}})=>{if("balances"===r&&"Transfer"===i){const o=t[1].toString();if(e.includes(o))return{account:o,action:`${r}.${i}`,message:n("transfer received"),status:"event"}}else if("democracy"===r){const e=t[0].toString();return{action:`${r}.${i}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(o,s,e,a);t&&n(t)}),[o,a,e,n,s]),(0,i.jsx)(A.qb,{})})),Xn={Component:On,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"},Jn=A.zo.div`
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
`,Vn=g.memo((function({className:e}){const n=(0,$.TH)(),{t}=Mn(),{api:r,isApiConnected:o,isApiReady:s,isDevelopment:a}=(0,I.h)(),{queueAction:l}=(0,Rn.L)(),{Component:c,display:{needsApi:d,needsApiCheck:p,needsApiInstances:u},icon:m,name:h,text:x}=(0,g.useMemo)((()=>{const e=n.pathname.slice(1)||"";return $n(t).find((n=>n&&e.startsWith(n.name)&&(a||!n.display.isDevelopment)))||Xn}),[a,n,t]),f=(0,g.useMemo)((()=>d?s&&o?Wn(r,d,u,p):null:[]),[r,o,s,d,p,u]);return(0,i.jsx)(Jn,{className:e,children:f?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(g.Suspense,{fallback:"...",children:(0,i.jsx)(A.SV,{trigger:h,children:(0,i.jsx)(Un.m.Provider,{value:{icon:m,text:x},children:f.length?(0,i.jsx)(On,{basePath:`/${h}`,location:n,missingApis:f,onStatusChange:l}):(0,i.jsx)(c,{basePath:`/${h}`,location:n,onStatusChange:l})})})}),(0,i.jsx)(Ln,{})]}):(0,i.jsx)("div",{className:"connecting",children:(0,i.jsx)(A.$j,{label:t("Initializing connection")})})})}));var _n=t(41411),Gn=t(38894),Kn=t(12176),Yn=t(95689),Qn=t(68058),et=t(10072),nt=t(70676);const tt=(0,A.zo)(A.ZD)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,it=g.memo((function({apiUrl:e,className:n,label:t,setApiUrl:r,url:o}){const s=(0,g.useCallback)((()=>r(o)),[r,o]);return(0,i.jsx)(tt,{className:n,isRadio:!0,label:t,onChange:s,value:e===o})})),rt=A.zo.div`
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
`,ot=g.memo((function({apiUrl:e,className:n="",setApiUrl:t,value:{isChild:r,isRelay:o,isUnreachable:s,name:a,nameRelay:l,paraId:c,providers:d,ui:p}}){const{t:u}=Mn(),m=(0,g.useMemo)((()=>d.some((({url:n})=>n===e))),[e,d]),h=(0,g.useCallback)((()=>{const e=d.filter((({url:e})=>!e.startsWith("light://")));return t(a,e[Math.floor(Math.random()*e.length)].url)}),[a,d,t]),x=(0,g.useCallback)((e=>t(a,e)),[a,t]);return(0,i.jsxs)(rt,{className:`${n}${m?" isSelected highlight--border":""}${s?" isUnreachable":""}`,children:[(0,i.jsxs)("div",{className:"endpointSection"+(r?" isChild":""),onClick:s?void 0:h,children:[(0,i.jsx)(A.Mj,{className:"endpointIcon",isInline:!0,logo:p.logo||"empty",withoutHl:!0}),(0,i.jsxs)("div",{className:"endpointValue",children:[(0,i.jsx)("div",{children:a}),m&&(o||!!c)&&(0,i.jsx)("div",{className:"endpointExtra",children:o?u("Relay chain"):u(c&&c<1e3?"{{relay}} System":c&&c<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:l}})})]})]}),m&&d.map((({name:n,url:t})=>(0,i.jsx)(it,{apiUrl:e,label:n,setApiUrl:x,url:t},t)))]})})),st=A.zo.div`
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
`,at=g.memo((function({affinities:e,apiUrl:n,children:t,className:r="",index:o,isSelected:s,setApiUrl:a,setGroup:l,value:{header:c,isSpaced:d,networks:p}}){const u=(0,g.useCallback)((()=>l(s?-1:o)),[o,s,l]),m=(0,g.useMemo)((()=>p.filter((({isUnreachable:e})=>!e))),[p]);return(0,i.jsxs)(st,{className:`${r}${s?" isSelected":""}`,children:[(0,i.jsxs)("div",{className:"groupHeader"+(d?" isSpaced":""),onClick:u,children:[(0,i.jsx)(A.JO,{icon:s?"caret-up":"caret-down"}),c]}),s&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{className:"groupNetworks",children:m.map(((t,r)=>(0,i.jsx)(ot,{affinity:e[t.name],apiUrl:n,setApiUrl:a,value:t},r)))}),t]})]})})),lt="network:affinities";function ct(e){return e.reduce(((e,n)=>{if(n.isHeader)e.push({header:n.text,isDevelopment:n.isDevelopment,isSpaced:n.isSpaced,networks:[]});else{const t=e[e.length-1],i={isLightClient:n.isLightClient,name:n.textBy,url:n.value};t.networks[t.networks.length-1]&&n.text===t.networks[t.networks.length-1].name?t.networks[t.networks.length-1].providers.push(i):n.isUnreachable||t.networks.push({isChild:n.isChild,isRelay:!!n.genesisHash,name:n.text,nameRelay:n.textRelay,paraId:n.paraId,providers:[i],ui:n.ui})}return e}),[])}function dt(){try{const e=localStorage.getItem(et.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function pt(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:p.X.get().apiUrl!==e,isUrlValid:(i=e,i.length>=7&&(i.startsWith("ws://")||i.startsWith("wss://")||i.startsWith("light://")))};var i}const ut=(0,A.zo)(A.YE)`
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
`,mt=g.memo((function({className:e="",offset:n,onClose:t}){const{t:r}=Mn(),o=(0,c.Rf)(r),{isLocalFork:s}=(0,I.h)(),[a,d]=(0,g.useState)((()=>ct(o))),[{apiUrl:u,groupIndex:m,hasUrlChanged:h,isUrlValid:x},f]=(0,g.useState)((()=>pt(p.X.get().apiUrl,a))),[v,y]=(0,g.useState)((()=>dt())),[b,k]=(0,g.useState)((()=>function(e){return Object.entries(l().get(lt)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:i})=>e===n&&i.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(a))),w=(0,g.useRef)(null),C=(0,g.useMemo)((()=>{let e=!1;return o.some((n=>n.value===u&&(e=!0,!0))),e}),[u,o]),j=(0,g.useMemo)((()=>{let e=!1;return v.some((n=>n===u&&(e=!0,!0))),e}),[u,v]),N=(0,g.useCallback)((e=>f((n=>({...n,groupIndex:e})))),[]),S=(0,g.useCallback)((()=>{if(!j)return;const e=v.filter((e=>e!==u));try{localStorage.setItem(et.ie,JSON.stringify(e)),d(ct((0,c.Rf)(r))),y(dt())}catch(e){console.error(e)}}),[u,j,v,r]),Z=(0,g.useCallback)(((e,n)=>{k((t=>{const i={...t,[e]:n};return l().set(lt,i),i})),f(pt(n,a))}),[a]),$=(0,g.useCallback)((e=>{(0,nt._)(e)||(e=Qn.ZP.toASCII(e)),f(pt(e,a))}),[a]),R=(0,g.useCallback)((()=>{l().set("localFork",""),p.X.set({...p.X.get(),apiUrl:u}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(u)}${window.location.hash}`),h||window.location.reload(),t()}),[u,t,h]),U=(0,g.useCallback)((()=>{l().set("localFork",u),p.X.set({...p.X.get(),apiUrl:u}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(u)}${window.location.hash}`),h||window.location.reload(),t()}),[u,t,h]),z=(0,g.useCallback)((()=>{try{localStorage.setItem(et.ie,JSON.stringify([...v,u])),R()}catch(e){console.error(e)}}),[R,u,v]),T=(0,g.useMemo)((()=>function(e,n,t,i){return e?!n.startsWith("light://")&&!t:!i}(h,u,x,s)),[h,u,x,s]),q=(0,g.useMemo)((()=>function(e,n,t,i){return e?!!n.startsWith("light://")||!t:!!i}(h,u,x,s)),[h,u,x,s]);return(0,i.jsx)(ut,{buttons:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(A.zx,{icon:"code-fork",isDisabled:q,label:r("Fork Locally"),onClick:U,tooltip:"fork-locally-btn"}),(0,i.jsx)(A.zx,{icon:"sync",isDisabled:T,label:r("Switch"),onClick:R})]}),className:e,offset:n,onClose:t,position:"left",sidebarRef:w,children:a.map(((e,n)=>(0,i.jsx)(at,{affinities:b,apiUrl:u,index:n,isSelected:m===n,setApiUrl:Z,setGroup:N,value:e,children:e.isDevelopment&&(0,i.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,i.jsx)(A.II,{className:"endpointCustom",isError:!x,isFull:!0,label:r("custom endpoint"),onChange:$,value:u}),j?(0,i.jsx)(A.zx,{className:"customButton",icon:"trash-alt",onClick:S}):(0,i.jsx)(A.zx,{className:"customButton",icon:"save",isDisabled:!x||C,onClick:z})]})},n)))})})),gt=A.zo.div`
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
`,ht=g.memo((function({className:e}){const{api:n,isApiReady:t}=(0,I.h)(),r=(0,Pn.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:o}=(0,d.g)(),[s,a]=(0,Gn.O)(),l=!o;return(0,i.jsxs)(gt,{className:e,children:[(0,i.jsxs)("div",{className:`apps--SideBar-logo-inner${l?" isClickable":""} highlight--color-contrast`,onClick:a,children:[(0,i.jsx)(A.Mj,{}),(0,i.jsxs)("div",{className:"info media--1000",children:[(0,i.jsx)(Kn.Z,{className:"chain"}),r&&(0,i.jsxs)("div",{className:"runtimeVersion",children:[r.specName.toString(),"/",r.specVersion.toNumber()]}),(0,i.jsx)(Yn.Z,{className:"bestNumber",label:"#"})]}),l&&(0,i.jsx)(A.JO,{className:"dropdown",icon:s?"caret-right":"caret-down"})]}),s&&(0,i.jsx)(mt,{onClose:a})]})})),xt=()=>0,ft=A.zo.li`
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
`,vt=g.memo((function({className:e="",classNameText:n,isLink:t,isToplevel:r,route:{Modal:o,href:s,icon:a,name:l,text:c,useCounter:d=xt}}){const[p,u]=(0,Gn.O)(),m=d();return(0,i.jsxs)(ft,{className:`${e} ui--MenuItem ${m?"withCounter":""} ${t?"isLink":""} ${r?"topLevel highlight--color-contrast":""}`,children:[(0,i.jsxs)("a",{href:o?void 0:s||`#/${l}`,onClick:o?u:void 0,rel:"noopener noreferrer",target:s?"_blank":void 0,children:[(0,i.jsx)(A.JO,{icon:a}),(0,i.jsx)("span",{className:n,children:c}),!!m&&(0,i.jsx)(A.Ct,{color:"white",info:m})]}),o&&p&&(0,i.jsx)(o,{onClose:u})]})})),yt="rgba(34, 36, 38, 0.12)",bt="5px",kt=A.zo.li`
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
    box-shadow: 0 ${bt} ${bt} -${bt} ${yt}, ${bt} 0 ${bt} -${bt} ${yt}, -${bt} 0 ${bt} -${bt} ${yt};
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
`,wt=g.memo((function({className:e="",isActive:n,name:t,routes:r}){return 1===r.length&&"settings"===r[0].group?(0,i.jsx)(vt,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:r[0]}):(0,i.jsxs)(kt,{className:`${e} ${n?"isActive":""}`,children:[(0,i.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,i.jsx)("span",{className:"smallHide",children:t}),(0,i.jsx)(A.JO,{className:"smallShow",icon:r[0].icon}),(0,i.jsx)(A.JO,{icon:"caret-down"})]}),(0,i.jsx)("ul",{className:"groupMenu",children:r.map((e=>(0,i.jsx)(vt,{route:e},e.name)))})]})}));var Ct=t(39082),jt=t(52727);const At=`apps v${"0.135.2-48-x".replace("-x","")}`,Nt=A.zo.div`
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
`,St=g.memo((function({className:e=""}){const{api:n,isApiReady:t}=(0,I.h)();return(0,i.jsxs)(Nt,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,i.jsxs)("div",{className:"node",children:[(0,i.jsx)(Ct.Z,{})," ",(0,i.jsx)(jt.Z,{label:"v"})]}),(0,i.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,i.jsx)("div",{children:At})]})}));const It=A.zo.div`
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
`,Zt=g.memo((function({className:e=""}){const{t:n}=Mn(),{allAccounts:t,hasAccounts:r}=(0,Bn.x)(),o=(0,I.h)(),{allowTeleport:s}=(0,_n.M)(),a=(0,Pn.W7)(o.isApiReady&&o.api.query.sudo?.key),l=(0,$.TH)(),c=(0,g.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(n)),d=(0,g.useRef)($n(n)),p=(0,g.useRef)({accounts:n("Accounts"),developer:n("Developer"),files:n("Files"),governance:n("Governance"),network:n("Network"),settings:n("Settings")}),u=(0,g.useMemo)((()=>!!a&&t.some((e=>a.eq(e)))),[t,a]),m=(0,g.useMemo)((()=>function(e,n,t,i,r,o){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:i},r,o,s,{isDevelopment:a,isHidden:l,needsAccounts:c,needsApi:d,needsApiCheck:p,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!o||d&&(!t||!n||m&&!s||g&&!r||!i&&a||0!==Wn(e,d,u,p).length))}(t,i,r,o,e)))}))).filter((({routes:e})=>e.length))}(d.current,p.current,o,s,r,u)),[s,o,r,u]),h=(0,g.useMemo)((()=>d.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,i.jsx)(It,{className:`${e}${o.isApiReady&&o.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,i.jsxs)("div",{className:"menuContainer",children:[(0,i.jsxs)("div",{className:"menuSection",children:[(0,i.jsx)(ht,{}),(0,i.jsx)("ul",{className:"menuItems",children:m.map((({name:e,routes:n})=>(0,i.jsx)(wt,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,i.jsx)("div",{className:"menuSection media--1200",children:(0,i.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,i.jsx)(vt,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,i.jsx)(St,{className:"media--1400"})]})})})),$t=A.zo.div`
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
`,Rt=g.memo((function({children:e,className:n="",icon:t,isBottom:r=!1,isFull:o=!1,type:s}){const[a,l]=(0,Gn.O)();return a?null:(0,i.jsx)($t,{className:`${n} ${"error"===s?"isError":"isInfo"} ${r?"isBottom":"isTop"} ${o?"isFull":"isPartial"}`,children:(0,i.jsxs)("div",{className:"content",children:[(0,i.jsx)(A.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,i.jsx)("div",{className:"contentItem",children:e}),(0,i.jsx)(A.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:l})]})})})),Ut=window.location.host.startsWith("polkadot.js.org"),zt=(0,c.Rf)((()=>"")).map((e=>e.dnslink)).reduce(((e,n)=>(n&&!e.includes(n)&&e.push(n),e)),[]),Tt=g.memo((function({className:e}){const{t:n}=Mn(),{systemChain:t}=(0,I.h)(),r=(0,g.useMemo)((()=>{const e=t?.toLowerCase();return e&&zt.includes(e)?`https://${e}.dotapps.io`:"https://dotapps.io"}),[t]);return Ut?(0,i.jsx)(Rt,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,i.jsxs)("div",{children:[n("You are connected to the development instance of the UI. For a fully decentralized experience, you are encouraged to use the IPFS deployed version as the canonical URL: "),(0,i.jsx)("a",{href:r,rel:"noreferrer",target:"_blank",children:r.replace("https://","")})]})}):null})),qt=g.memo((function({className:e}){const{t:n}=Mn(),{isLocalFork:t}=(0,I.h)();return t?(0,i.jsx)(Rt,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,i.jsxs)("div",{children:[n("Local fork powered by "),(0,i.jsx)("a",{href:"https://github.com/AcalaNetwork/chopsticks",rel:"noreferrer",target:"_blank",children:"Chopsticks"}),"."]})}):null})),Wt=A.zo.div`
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
`,Et=g.memo((function({className:e}){return(0,i.jsxs)(Wt,{className:e,children:[(0,i.jsx)(qt,{}),(0,i.jsx)(Tt,{})]})})),Mt=p.X.apiType.param,Ot="json-rpc"===p.X.apiType.type&&"string"==typeof Mt&&Mt.startsWith("ws://"),Bt="string"==typeof Mt&&Mt.includes("127.0.0.1"),Pt=window.location.protocol.startsWith("https:"),Ft=g.memo((function({className:e}){const{t:n}=Mn(),{apiError:t,isApiConnected:r,isApiReady:o,isWaitingInjected:s}=(0,I.h)();return t?(0,i.jsx)(Rt,{className:e,icon:"globe",type:"error",children:(0,i.jsx)("div",{children:t})}):o?s?(0,i.jsx)(Rt,{className:e,icon:"puzzle-piece",type:"info",children:(0,i.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):r?null:(0,i.jsxs)(Rt,{className:e,icon:"globe",type:"error",children:[(0,i.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),Ot&&!Bt&&Pt?(0,i.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:Mt}})}):void 0]}):(0,i.jsx)(Rt,{className:e,icon:"globe",type:"info",children:(0,i.jsx)("div",{children:n(r?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})})),Dt=g.memo((function(){const{api:e,isApiReady:n}=(0,I.h)(),t=(0,Pn.W7)(n&&e.derive.accounts?.indexes),r=(0,Pn.W7)(n&&e.query.identity?.registrars),o=(0,Pn.W7)(n&&e.query.balances?.totalIssuance),[s,a]=(0,g.useState)(!1);return(0,g.useEffect)((()=>{a(!!t||!!o||!!r)}),[]),(0,i.jsx)("div",{className:`apps--api-warm ${s.toString()}`})})),Ht=A.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,Lt=g.memo((function({className:e=""}){const{themeClassName:n}=(0,S.F)(),{apiEndpoint:t,isDevelopment:r}=(0,I.h)(),o=(0,g.useMemo)((()=>r?void 0:t?.ui.color),[t,r]);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(N.Z,{uiHighlight:o}),(0,i.jsxs)(Ht,{className:`${e} apps--Wrapper ${n}`,children:[(0,i.jsx)(Zt,{}),(0,i.jsxs)(A.J0,{children:[(0,i.jsx)(Z.ZP,{children:(0,i.jsx)(Vn,{})}),(0,i.jsx)(Ft,{}),(0,i.jsx)(Et,{}),(0,i.jsx)("div",{id:"portals"})]})]}),(0,i.jsx)(Dt,{})]})}));function Xt({uiTheme:e}){const n="dark"===e?"dark":"light";return document?.documentElement?.setAttribute("data-theme",n),{theme:n}}const Jt=g.memo((function({isElectron:e,store:n}){const[t,r]=(0,g.useState)((()=>Xt(p.X)));return(0,g.useEffect)((()=>{p.X.on("change",(e=>r(Xt(e))))}),[]),(0,i.jsx)(g.Suspense,{fallback:"...",children:(0,i.jsx)(f.f6,{theme:t,children:(0,i.jsx)(y.q,{children:(0,i.jsx)(v.ApiCtxRoot,{apiUrl:p.X.apiUrl,isElectron:e,store:n,children:(0,i.jsx)(b.y,{children:(0,i.jsx)(k.u,{children:(0,i.jsx)(w.g,{children:(0,i.jsx)(C.w,{children:(0,i.jsx)(x.UT,{children:(0,i.jsx)(j.A,{children:(0,i.jsx)(Lt,{})})})})})})})})})})})})),Vt="root",_t=document.getElementById(Vt);if(!_t)throw new Error(`Unable to find element with id '${Vt}'`);(0,h.s)(_t).render((0,i.jsx)(Jt,{isElectron:!1}))},29038:(e,n,t)=>{var i={".":[57139,9],"./":[57139,9],"./Api":[34777,9],"./Api.tsx":[34777,9],"./hoc":[69356,9],"./hoc/":[69356,9],"./hoc/api":[94356,9],"./hoc/api.tsx":[94356,9],"./hoc/call":[98727,9],"./hoc/call.tsx":[98727,9],"./hoc/callDiv":[3364,9],"./hoc/callDiv.tsx":[3364,9],"./hoc/calls":[5246,9],"./hoc/calls.ts":[5246,9],"./hoc/index":[69356,9],"./hoc/index.ts":[69356,9],"./hoc/multi":[60028,9],"./hoc/multi.ts":[60028,9],"./hoc/observable":[33989,9],"./hoc/observable.tsx":[33989,9],"./hoc/onlyOn":[35475,9],"./hoc/onlyOn.tsx":[35475,9],"./hoc/types":[68570,9,8570],"./hoc/types.ts":[68570,9,8570],"./index":[57139,9],"./index.ts":[57139,9],"./light":[36956,9],"./light.spec":[58705,9,8705],"./light.spec.ts":[58705,9,8705],"./light/":[36956,9],"./light/index":[36956,9],"./light/index.ts":[36956,9],"./light/kusama":[37178,9],"./light/kusama/":[37178,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[37178,9],"./light/kusama/index.ts":[37178,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[15299,9],"./light/polkadot/":[15299,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[15299,9],"./light/polkadot/index.ts":[15299,9],"./statics":[95267,9],"./statics.ts":[95267,9],"./transform/echo":[80522,9],"./transform/echo.ts":[80522,9],"./types":[55903,9,5903],"./types.ts":[55903,9,5903],"./urlTypes":[81369,9],"./urlTypes.ts":[81369,9],"./util":[41186,9],"./util/":[41186,9],"./util/getEnvironment":[68372,9],"./util/getEnvironment.ts":[68372,9],"./util/historic":[77809,9],"./util/historic.ts":[77809,9],"./util/index":[41186,9],"./util/index.ts":[41186,9],"./util/intervalObservable":[71951,9],"./util/intervalObservable.ts":[71951,9],"./util/isEqual":[65345,9],"./util/isEqual.ts":[65345,9],"./util/triggerChange":[74733,9],"./util/triggerChange.ts":[74733,9]};function r(e){if(!t.o(i,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=i[e],r=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(r,16|n[1])))}r.keys=()=>Object.keys(i),r.id=29038,e.exports=r},18983:()=>{},33196:()=>{},38087:()=>{},74854:()=>{},66602:()=>{}},e=>{e.O(0,[6677,4668,5744,1843,1064,4124,2440,434,9398,9e3,8043,7924,212,2044,2854,5320,9684,2021,738,344,760,6829,5005,9319,2208,136,9768,6641,2685,2871,3108,353,3882,4292,9065,3305,2107,9121,62,6954,1454,8291,4635,5502,3569,6744,5178,8758,5609,9946],(()=>(76062,e(e.s=76062)))),e.O()}]);