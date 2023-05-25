(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[179],{83902:(e,n,t)=>{"use strict";var i=t(52322),o=t(85168),r=t(23729),s=t.n(r),a=t(47564),l=t(83337),c=t(16039),p=t(48731);const d=function(){const e=o.Z.parse(location.href.split("?")[1]);if(e.rpc){(0,p.hu)(!Array.isArray(e.rpc),"Invalid WS endpoint specified");const n=decodeURIComponent(e.rpc.split("#")[0]);return(0,p.hu)(n.startsWith("ws://")||n.startsWith("wss://")||n.startsWith("light://"),"Non-prefixed ws/wss/light url"),n}const n=(0,a.Rf)((()=>"")),{ipnsChain:t}=(0,l.K)();if(t){const e=n.find((({dnslink:e})=>e===t));if(e)return e.value}const i=s().get("settings")||{},r=n.find((({value:e})=>!!e));return[i.apiUrl,void 0].includes(c.X.apiUrl)?c.X.apiUrl:r?r.value:"ws://127.0.0.1:9944"}();c.X.set({apiUrl:d}),function(e){e.startsWith("light://")?console.log("Light endpoint=",e.replace("light://","")):console.log("WS endpoint=",e)}(d),t(94953);var u=t(2784),m=t(17029),g=t(39857),h=t(82740),x=t(57139),v=t(92302),f=t(87561),y=t(3773),b=t(68944),k=t(57120),w=t(44028),C=t(91012),A=t(56787),j=t(3663),N=t(90778),S=t(4984),I=t(73557),Z=t(4709),$=t(10189);function U(e){return{Component:Z.Z,display:{needsApi:[]},group:"accounts",icon:"users",name:"accounts",text:e("nav.accounts","Accounts",{ns:"apps-routing"}),useCounter:$.Z}}var z=t(28096);function T(e){return{Component:z.Z,display:{needsApi:[]},group:"accounts",icon:"address-card",name:"addresses",text:e("nav.addresses","Address book",{ns:"apps-routing"})}}var R=t(49307),W=t(58370);function q(e){return{Component:R.Z,display:{needsApi:["tx.alliance.joinAlliance"]},group:"governance",icon:"people-group",name:"alliance",text:e("nav.alliance","Alliance",{ns:"apps-routing"}),useCounter:W.Z}}var E=t(25467);function M(e){return{Component:E.Z,display:{needsApi:["tx.assets.setMetadata","tx.assets.transferKeepAlive"]},group:"network",icon:"shopping-basket",name:"assets",text:e("nav.assets","Assets",{ns:"apps-routing"})}}var O=t(9178),P=t(19739);function H(e){return{Component:O.Z,display:{needsApi:[["tx.bounties.proposeBounty","tx.treasury.proposeBounty"]]},group:"governance",icon:"coins",name:"bounties",text:e("nav.bounties","Bounties",{ns:"apps-routing"}),useCounter:P.Z}}var B=t(6742);function D(e){return{Component:B.Z,display:{needsApi:[]},group:"network",icon:"calendar-alt",name:"calendar",text:e("nav.calendar","Event calendar",{ns:"apps-routing"})}}var F=t(75798),L=t(73352);function X(e){return{Component:F.Z,display:{needsAccounts:!0,needsApi:["tx.claims.mintClaim"]},group:"accounts",icon:"star",name:"claims",text:e("nav.claims","Claim Tokens",{ns:"apps-routing"}),useCounter:L.Z}}var J=t(2799);function V(e){return{Component:J.Z,display:{needsApi:["query.collatorSelection.candidacyBond"]},group:"network",icon:"timeline",name:"collators",text:e("nav.collator","Collators",{ns:"apps-routing"})}}var _=t(22516);function G(e){try{return(0,p.k8)(6===e.tx.contracts.instantiateWithCode.meta.args.length,"Invalid args")}catch{return console.warn("Contract interface does not support storageDepositLimit, disabling route"),!1}}function K(e){return{Component:_.Z,display:{needsAccounts:!0,needsApi:["tx.contracts.instantiateWithCode"],needsApiCheck:G},group:"developer",icon:"compress",name:"contracts",text:e("nav.contracts","Contracts",{ns:"apps-routing"})}}var Y=t(18324),Q=t(40740);function ee(e){return{Component:Y.Z,display:{needsApi:["query.council.prime"],needsApiInstances:!0},group:"governance",icon:"building",name:"council",text:e("nav.council","Council",{ns:"apps-routing"}),useCounter:Q.Z}}var ne=t(50472),te=t(61491);function ie(e){try{return e.tx.democracy.vote(1,{Standard:{balance:1,vote:{aye:!0,conviction:1}}}),!0}catch{return console.warn("Unable to create referendum vote transaction, disabling democracy route"),!1}}function oe(e){return{Component:ne.Z,display:{needsApi:["tx.democracy.propose"],needsApiCheck:ie},group:"governance",icon:"calendar-check",name:"democracy",text:e("nav.democracy","Democracy",{ns:"apps-routing"}),useCounter:te.Z}}var re=t(51406);function se(e){return{Component:re.Z,display:{needsApi:[]},group:"network",icon:"braille",name:"explorer",text:e("nav.explorer","Explorer",{ns:"apps-routing"})}}var ae=t(38080);function le(e){return{Component:ae.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"envelope-open-text",name:"extrinsics",text:e("nav.extrinsics","Extrinsics",{ns:"apps-routing"})}}var ce=t(58064),pe=t(16472);function de(e){return{Component:ce.Z,display:{needsAccounts:!0,needsApi:["tx.fellowshipCollective.vote","tx.fellowshipReferenda.submit","consts.fellowshipReferenda.tracks"]},group:"governance",icon:"people-arrows",name:"fellowship",text:e("nav.fellowship","Fellowship",{ns:"apps-routing"}),useCounter:pe.Z}}var ue=t(31043);function me(e){return{Component:ue.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"file",name:"files",text:e("nav.files","Files (IPFS)",{ns:"apps-routing"})}}var ge=t(79865);function he(e){return{Component:ge.Z,display:{needsApi:["tx.gilt.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"gilt",text:e("nav.gilt","Gilt",{ns:"apps-routing"})}}var xe=t(30145);function ve(e){return{Component:xe.Z,display:{needsApi:[]},group:"developer",icon:"code",name:"js",text:e("nav.js","JavaScript",{ns:"apps-routing"})}}var fe=t(51213),ye=t(16743);function be(e){return{Component:fe.Z,display:{needsAccounts:!0,needsApi:["query.membership.members"]},group:"governance",icon:"people-carry",name:"membership",text:e("nav.membership","Membership",{ns:"apps-routing"}),useCounter:ye.Z}}var ke=t(50313);function we(e){return{Component:ke.Z,display:{needsApi:["tx.uniques.create"]},group:"network",icon:"shopping-cart",name:"nfts",text:e("nav.nfts","NFTs",{ns:"apps-routing"})}}var Ce=t(90992);function Ae(e){return{Component:Ce.Z,display:{needsApi:["tx.nis.placeBid","query.proxy.proxies"]},group:"network",icon:"leaf",name:"nis",text:e("nav.nis","Non-interactive Staking",{ns:"apps-routing"})}}var je=t(93242);function Ne(e){return{Component:je.Z,display:{needsApi:[["query.paras.parachains"]]},group:"network",icon:"link",name:"parachains",text:e("nav.parachains","Parachains",{ns:"apps-routing"})}}var Se=t(94349);function Ie(e){return{Component:Se.Z,display:{needsAccounts:!0,needsApi:["tx.poll.vote"]},group:"governance",icon:"podcast",name:"poll",text:e("nav.poll","Token poll",{ns:"apps-routing"})}}var Ze=t(20600);function $e(e){return{Component:Ze.Z,display:{needsAccounts:!0,needsApi:["query.preimage.statusFor","tx.preimage.notePreimage"]},group:"governance",icon:"panorama",name:"preimages",text:e("nav.preimages","Preimages",{ns:"apps-routing"})}}var Ue=t(41857),ze=t(76288);function Te(e){return{Component:Ue.Z,display:{needsAccounts:!0,needsApi:["tx.rankedCollective.vote","tx.rankedPolls.submit"]},group:"governance",icon:"people-arrows",name:"ranked",text:e("nav.ranked","Ranked collective",{ns:"apps-routing"}),useCounter:ze.Z}}var Re=t(89139),We=t(1398);function qe(e){return{Component:Re.Z,display:{needsApi:["tx.referenda.submit","tx.convictionVoting.vote","consts.referenda.tracks"]},group:"governance",icon:"person-booth",name:"referenda",text:e("nav.referenda","Referenda",{ns:"apps-routing"}),useCounter:We.Z}}var Ee=t(6583);function Me(e){return{Component:Ee.Z,display:{needsApi:[]},group:"developer",icon:"network-wired",name:"rpc",text:e("nav.rpc","RPC calls",{ns:"apps-routing"})}}var Oe=t(39117);function Pe(e){return{Component:Oe.Z,display:{needsApi:[]},group:"developer",icon:"arrows-to-circle",name:"runtime",text:e("nav.runtime","Runtime calls",{ns:"apps-routing"})}}var He=t(14673);function Be(e){return{Component:He.Z,display:{needsApi:["query.scheduler.agenda"]},group:"network",icon:"clock",name:"scheduler",text:e("nav.scheduler","Scheduler",{ns:"apps-routing"})}}var De=t(19433),Fe=t(76075);function Le(e){return{Component:De.Z,display:{},group:"settings",icon:"cogs",name:"settings",text:e("nav.settings","Settings",{ns:"apps-routing"}),useCounter:Fe.Z}}var Xe=t(24569);function Je(e){return{Component:Xe.Z,display:{needsAccounts:!0,needsApi:[]},group:"developer",icon:"signature",name:"signing",text:e("nav.signing","Sign and verify",{ns:"apps-routing"})}}var Ve=t(96246),_e=t(58900);function Ge(e){return{Component:Ve.Z,display:{needsAccounts:!0,needsApi:["query.society.pot"]},group:"network",icon:"hand-spock",name:"society",text:e("nav.society","Society",{ns:"apps-routing"}),useCounter:_e.Z}}var Ke=t(16215),Ye=t(56949),Qe=t(19729),en=t(95292);function nn(e){try{const{others:[{value:n,who:t}],own:i,total:o}=e.registry.createType((0,Qe.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:en.If,who:Ye.TS}],own:en.If,total:en.If});(0,p.hu)(o&&i&&n&&t&&o.eq(en.If)&&i.eq(en.If)&&n.eq(en.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(Ye.TS,en.If,{Account:Ye.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(en.If,{Account:Ye.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function tn(e){return{Component:Ke.Z,display:{needsApi:["query.staking.erasStakers","tx.staking.bond"],needsApiCheck:nn},group:"network",icon:"certificate",name:"staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var on=t(97473);function rn(e){try{const{others:[{value:n,who:t}],own:i,total:o}=e.registry.createType((0,Qe.P)(e.registry,e.query.staking.erasStakers.creator.meta.type),{others:[{value:en.If,who:Ye.TS}],own:en.If,total:en.If});(0,p.hu)(o&&i&&n&&t&&o.eq(en.If)&&i.eq(en.If)&&n.eq(en.If),"Needs a known Exposure type")}catch{return console.warn("Unable to create known-shape Exposure type, disabling staking route"),!1}try{if(3===e.tx.staking.bond.meta.args.length)e.tx.staking.bond(Ye.TS,en.If,{Account:Ye.TS});else{if(2!==e.tx.staking.bond.meta.args.length)return!1;e.tx.staking.bond(en.If,{Account:Ye.TS})}}catch{return console.warn("Unable to create staking bond transaction, disabling staking route"),!1}return!0}function sn(e){return{Component:on.Z,display:{isHidden:!0,needsApi:["query.session.validators","query.staking.erasStakers","tx.staking.bond"],needsApiCheck:rn},group:"network",icon:"certificate",name:"test-staking",text:e("nav.staking","Staking",{ns:"apps-routing"})}}var an=t(46717);function ln(e){return{Component:an.Z,display:{needsApi:[]},group:"developer",icon:"database",name:"chainstate",text:e("nav.storage","Chain state",{ns:"apps-routing"})}}var cn=t(54676);function pn(e){return{Component:cn.Z,display:{needsAccounts:!0,needsApi:["tx.sudo.setKey"],needsSudo:!0},group:"developer",icon:"unlock",name:"sudo",text:e("nav.sudo","Sudo",{ns:"apps-routing"})}}var dn=t(75509),un=t(87340);function mn(e){return{Component:dn.Z,display:{needsAccounts:!0,needsApi:["query.technicalCommittee.members"],needsApiInstances:!0},group:"governance",icon:"microchip",name:"techcomm",text:e("nav.tech-comm","Tech. comm.",{ns:"apps-routing"}),useCounter:un.Z}}var gn=t(9847);function hn(e){return{Component:gn.Z,Modal:gn.Z,display:{isHidden:!0,needsAccounts:!0,needsApi:[["tx.xcm.teleportAssets","tx.xcmPallet.teleportAssets","tx.polkadotXcm.teleportAssets","tx.xcm.limitedTeleportAssets","tx.xcmPallet.limitedTeleportAssets","tx.polkadotXcm.limitedTeleportAssets"]],needsTeleport:!0},group:"accounts",icon:"share-square",name:"teleport",text:e("nav.teleport","Teleport",{ns:"apps-routing"})}}function xn(e){return{Component:v.Zd,Modal:v.Zd,display:{isHidden:!1,needsAccounts:!0,needsApi:["tx.balances.transferKeepAlive"]},group:"accounts",icon:"paper-plane",name:"transfer",text:e("nav.transfer","Transfer",{ns:"apps-routing"})}}var vn=t(74425),fn=t(9039);function yn(e){return{Component:vn.Z,display:{needsApi:["tx.treasury.proposeSpend"]},group:"governance",icon:"gem",name:"treasury",text:e("nav.treasury","Treasury",{ns:"apps-routing"}),useCounter:fn.Z}}var bn=t(26822);function kn(e){return{Component:bn.Z,display:{needsApi:[]},group:"developer",icon:"wrench",name:"utilities",text:e("nav.utilities","Utilities",{ns:"apps-routing"})}}var wn=t(7644);function Cn(e){return{Component:wn.Z,display:{needsAccounts:!0,needsApi:["tx.whitelist.removeWhitelistedCall"]},group:"governance",icon:"list-check",name:"whitelist",text:e("nav.whitelist","Whitelist",{ns:"apps-routing"})}}function An(e){return[U(e),T(e),se(e),X(e),Ie(e),xn(e),hn(e),tn(e),sn(e),V(e),qe(e),be(e),q(e),de(e),Te(e),$e(e),Cn(e),oe(e),ee(e),mn(e),yn(e),H(e),Ne(e),M(e),we(e),Ge(e),Ae(e),he(e),Be(e),D(e),K(e),ln(e),le(e),Me(e),Pe(e),Je(e),pn(e),me(e),ve(e),kn(e),Le(e)]}var jn=t(86135),Nn=t(59149),Sn=t(82671),In=t(33661);function Zn(e,n,t){const[i,o,r]=n.split("."),[s]=t&&e.registry.getModuleInstances(e.runtimeVersion.specName.toString(),o)||[o];try{return"consts"===i?(0,Sn.K)(e[i][s][r]):(0,In.m)(e[i][s][r])}catch{return!1}}function $n(e,n,t=!1,i){if(!n)return[];const o=n.filter((n=>!(Array.isArray(n)?n.reduce(((n,i)=>n||Zn(e,i,t)),!1):Zn(e,n,t))));return o.length||!i||i(e)?o:["needsApiCheck"]}var Un=t(61349);function zn(){return(0,Un.$G)("apps")}const Tn=u.memo((function({basePath:e,missingApis:n=[]}){return console.log(`Redirecting from route "${e}" to "/explorer"${n.length?`, missing the following APIs: ${JSON.stringify(n)}`:""}`),(0,i.jsx)(I.Fg,{to:"/explorer"})}));var Rn=t(34814),Wn=t(9118),qn=t(64021),En=t(69516);let Mn;const On=u.memo((function({optionsAll:e}){const{queueAction:n}=(0,jn.L)(),{api:t,isApiReady:o}=(0,N.h)(),{allAccounts:r}=(0,Rn.x)(),{t:s}=zn(),a=(0,Wn.W7)(o&&t.query.system?.events);return(0,u.useEffect)((()=>{const t=function(e,n,t,i){const o=(0,En.R)((0,qn.d)(JSON.stringify(i)));return t&&i&&o!==Mn?(Mn=o,i.map((({event:{data:t,method:i,section:o}})=>{if("balances"===o&&"Transfer"===i){const r=t[1].toString();if(e.includes(r))return{account:r,action:`${o}.${i}`,message:n("transfer received"),status:"event"}}else if("democracy"===o){const e=t[0].toString();return{action:`${o}.${i}`,message:n("update on #{{index}}",{replace:{index:e}}),status:"event"}}return null})).filter((e=>!!e))):null}(r,s,e,a);t&&n(t)}),[r,a,e,n,s]),(0,i.jsx)(v.qb,{})})),Pn={Component:Tn,display:{},group:"settings",icon:"times",isIgnored:!1,name:"unknown",text:"Unknown"},Hn=v.zo.div`
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
`,Bn=u.memo((function({className:e}){const n=(0,I.TH)(),{t}=zn(),{api:o,isApiConnected:r,isApiReady:s,isDevelopment:a}=(0,N.h)(),{queueAction:l}=(0,jn.L)(),{Component:c,display:{needsApi:p,needsApiCheck:d,needsApiInstances:m},icon:g,name:h,text:x}=(0,u.useMemo)((()=>{const e=n.pathname.slice(1)||"";return An(t).find((n=>n&&e.startsWith(n.name)&&(a||!n.display.isDevelopment)))||Pn}),[a,n,t]),f=(0,u.useMemo)((()=>p?s&&r?$n(o,p,m,d):null:[]),[o,r,s,p,d,m]);return(0,i.jsx)(Hn,{className:e,children:f?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(u.Suspense,{fallback:"...",children:(0,i.jsx)(v.SV,{trigger:h,children:(0,i.jsx)(Nn.m.Provider,{value:{icon:g,text:x},children:f.length?(0,i.jsx)(Tn,{basePath:`/${h}`,location:n,missingApis:f,onStatusChange:l}):(0,i.jsx)(c,{basePath:`/${h}`,location:n,onStatusChange:l})})})}),(0,i.jsx)(On,{})]}):(0,i.jsx)("div",{className:"connecting",children:(0,i.jsx)(v.$j,{label:t("Initializing connection")})})})}));var Dn=t(41411),Fn=t(38894),Ln=t(12176),Xn=t(95689),Jn=t(68058),Vn=t(10072),_n=t(70676);const Gn=(0,v.zo)(v.ZD)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,Kn=u.memo((function({apiUrl:e,className:n,label:t,setApiUrl:o,url:r}){const s=(0,u.useCallback)((()=>o(r)),[o,r]);return(0,i.jsx)(Gn,{className:n,isRadio:!0,label:t,onChange:s,value:e===r})})),Yn=v.zo.div`
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
`,Qn=u.memo((function({apiUrl:e,className:n="",setApiUrl:t,value:{isChild:o,isRelay:r,isUnreachable:s,name:a,nameRelay:l,paraId:c,providers:p,ui:d}}){const{t:m}=zn(),g=(0,u.useMemo)((()=>p.some((({url:n})=>n===e))),[e,p]),h=(0,u.useCallback)((()=>{const e=p.filter((({url:e})=>!e.startsWith("light://")));return t(a,e[Math.floor(Math.random()*e.length)].url)}),[a,p,t]),x=(0,u.useCallback)((e=>t(a,e)),[a,t]);return(0,i.jsxs)(Yn,{className:`${n}${g?" isSelected highlight--border":""}${s?" isUnreachable":""}`,children:[(0,i.jsxs)("div",{className:"endpointSection"+(o?" isChild":""),onClick:s?void 0:h,children:[(0,i.jsx)(v.Mj,{className:"endpointIcon",isInline:!0,logo:d.logo||"empty",withoutHl:!0}),(0,i.jsxs)("div",{className:"endpointValue",children:[(0,i.jsx)("div",{children:a}),g&&(r||!!c)&&(0,i.jsx)("div",{className:"endpointExtra",children:r?m("Relay chain"):m(c&&c<1e3?"{{relay}} System":c&&c<2e3?"{{relay}} Common":"{{relay}} Parachain",{replace:{relay:l}})})]})]}),g&&p.map((({name:n,url:t})=>(0,i.jsx)(Kn,{apiUrl:e,label:n,setApiUrl:x,url:t},t)))]})})),et=v.zo.div`
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
`,nt=u.memo((function({affinities:e,apiUrl:n,children:t,className:o="",index:r,isSelected:s,setApiUrl:a,setGroup:l,value:{header:c,isSpaced:p,networks:d}}){const m=(0,u.useCallback)((()=>l(s?-1:r)),[r,s,l]),g=(0,u.useMemo)((()=>d.filter((({isUnreachable:e})=>!e))),[d]);return(0,i.jsxs)(et,{className:`${o}${s?" isSelected":""}`,children:[(0,i.jsxs)("div",{className:"groupHeader"+(p?" isSpaced":""),onClick:m,children:[(0,i.jsx)(v.JO,{icon:s?"caret-up":"caret-down"}),c]}),s&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{className:"groupNetworks",children:g.map(((t,o)=>(0,i.jsx)(Qn,{affinity:e[t.name],apiUrl:n,setApiUrl:a,value:t},o)))}),t]})]})})),tt="network:affinities";function it(e){return e.reduce(((e,n)=>{if(n.isHeader)e.push({header:n.text,isDevelopment:n.isDevelopment,isSpaced:n.isSpaced,networks:[]});else{const t=e[e.length-1],i={isLightClient:n.isLightClient,name:n.textBy,url:n.value};t.networks[t.networks.length-1]&&n.text===t.networks[t.networks.length-1].name?t.networks[t.networks.length-1].providers.push(i):n.isUnreachable||t.networks.push({isChild:n.isChild,isRelay:!!n.genesisHash,name:n.text,nameRelay:n.textRelay,paraId:n.paraId,providers:[i],ui:n.ui})}return e}),[])}function ot(){try{const e=localStorage.getItem(Vn.ie);if(e)return JSON.parse(e)}catch(e){console.error(e)}return[]}function rt(e,n){let t=n.findIndex((({networks:n})=>n.some((({providers:n})=>n.some((({url:n})=>n===e))))));return-1===t&&(t=n.findIndex((({isDevelopment:e})=>e))),{apiUrl:e,groupIndex:t,hasUrlChanged:c.X.get().apiUrl!==e,isUrlValid:(i=e,i.length>=7&&(i.startsWith("ws://")||i.startsWith("wss://")||i.startsWith("light://")))};var i}const st=(0,v.zo)(v.YE)`
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
`,at=u.memo((function({className:e="",offset:n,onClose:t}){const{t:o}=zn(),r=(0,a.Rf)(o),[l,p]=(0,u.useState)((()=>it(r))),[{apiUrl:d,groupIndex:m,hasUrlChanged:g,isUrlValid:h},x]=(0,u.useState)((()=>rt(c.X.get().apiUrl,l))),[f,y]=(0,u.useState)((()=>ot())),[b,k]=(0,u.useState)((()=>function(e){return Object.entries(s().get(tt)||{}).filter((([n,t])=>e.some((({networks:e})=>e.some((({name:e,providers:i})=>e===n&&i.some((({url:e})=>e===t)))))))).reduce(((e,[n,t])=>({...e,[n]:t})),{})}(l))),w=(0,u.useRef)(null),C=(0,u.useMemo)((()=>{let e=!1;return r.some((n=>n.value===d&&(e=!0,!0))),e}),[d,r]),A=(0,u.useMemo)((()=>{let e=!1;return f.some((n=>n===d&&(e=!0,!0))),e}),[d,f]),j=(0,u.useCallback)((e=>x((n=>({...n,groupIndex:e})))),[]),N=(0,u.useCallback)((()=>{if(!A)return;const e=f.filter((e=>e!==d));try{localStorage.setItem(Vn.ie,JSON.stringify(e)),p(it((0,a.Rf)(o))),y(ot())}catch(e){console.error(e)}}),[d,A,f,o]),S=(0,u.useCallback)(((e,n)=>{k((t=>{const i={...t,[e]:n};return s().set(tt,i),i})),x(rt(n,l))}),[l]),I=(0,u.useCallback)((e=>{(0,_n._)(e)||(e=Jn.ZP.toASCII(e)),x(rt(e,l))}),[l]),Z=(0,u.useCallback)((()=>{c.X.set({...c.X.get(),apiUrl:d}),window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(d)}${window.location.hash}`),t()}),[d,t]),$=(0,u.useCallback)((()=>{try{localStorage.setItem(Vn.ie,JSON.stringify([...f,d])),Z()}catch(e){console.error(e)}}),[Z,d,f]),U=(0,u.useMemo)((()=>function(e,n,t){return!e||!n.startsWith("light://")&&!t}(g,d,h)),[g,d,h]);return(0,i.jsx)(st,{button:(0,i.jsx)(v.zx,{icon:"sync",isDisabled:U,label:o("Switch"),onClick:Z}),className:e,offset:n,onClose:t,position:"left",sidebarRef:w,children:l.map(((e,n)=>(0,i.jsx)(nt,{affinities:b,apiUrl:d,index:n,isSelected:m===n,setApiUrl:S,setGroup:j,value:e,children:e.isDevelopment&&(0,i.jsxs)("div",{className:"endpointCustomWrapper",children:[(0,i.jsx)(v.II,{className:"endpointCustom",isError:!h,isFull:!0,label:o("custom endpoint"),onChange:I,value:d}),A?(0,i.jsx)(v.zx,{className:"customButton",icon:"trash-alt",onClick:N}):(0,i.jsx)(v.zx,{className:"customButton",icon:"save",isDisabled:!h||C,onClick:$})]})},n)))})})),lt=v.zo.div`
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
`,ct=u.memo((function({className:e}){const{api:n,isApiReady:t}=(0,N.h)(),o=(0,Wn.W7)(t&&n.rpc.state.subscribeRuntimeVersion),{ipnsChain:r}=(0,l.g)(),[s,a]=(0,Fn.O)(),c=!r;return(0,i.jsxs)(lt,{className:e,children:[(0,i.jsxs)("div",{className:`apps--SideBar-logo-inner${c?" isClickable":""} highlight--color-contrast`,onClick:a,children:[(0,i.jsx)(v.Mj,{}),(0,i.jsxs)("div",{className:"info media--1000",children:[(0,i.jsx)(Ln.Z,{className:"chain"}),o&&(0,i.jsxs)("div",{className:"runtimeVersion",children:[o.specName.toString(),"/",o.specVersion.toNumber()]}),(0,i.jsx)(Xn.Z,{className:"bestNumber",label:"#"})]}),c&&(0,i.jsx)(v.JO,{className:"dropdown",icon:s?"caret-right":"caret-down"})]}),s&&(0,i.jsx)(at,{onClose:a})]})})),pt=()=>0,dt=v.zo.li`
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
`,ut=u.memo((function({className:e="",classNameText:n,isLink:t,isToplevel:o,route:{Modal:r,href:s,icon:a,name:l,text:c,useCounter:p=pt}}){const[d,u]=(0,Fn.O)(),m=p();return(0,i.jsxs)(dt,{className:`${e} ui--MenuItem ${m?"withCounter":""} ${t?"isLink":""} ${o?"topLevel highlight--color-contrast":""}`,children:[(0,i.jsxs)("a",{href:r?void 0:s||`#/${l}`,onClick:r?u:void 0,rel:"noopener noreferrer",target:s?"_blank":void 0,children:[(0,i.jsx)(v.JO,{icon:a}),(0,i.jsx)("span",{className:n,children:c}),!!m&&(0,i.jsx)(v.Ct,{color:"white",info:m})]}),r&&d&&(0,i.jsx)(r,{onClose:u})]})})),mt="rgba(34, 36, 38, 0.12)",gt="5px",ht=v.zo.li`
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
    box-shadow: 0 ${gt} ${gt} -${gt} ${mt}, ${gt} 0 ${gt} -${gt} ${mt}, -${gt} 0 ${gt} -${gt} ${mt};
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
`,xt=u.memo((function({className:e="",isActive:n,name:t,routes:o}){return 1===o.length&&"settings"===o[0].group?(0,i.jsx)(ut,{className:n?"isActive":"",classNameText:"smallHide",isToplevel:!0,route:o[0]}):(0,i.jsxs)(ht,{className:`${e} ${n?"isActive":""}`,children:[(0,i.jsxs)("div",{className:"groupHdr "+(n?"":"highlight--color-contrast"),children:[(0,i.jsx)("span",{className:"smallHide",children:t}),(0,i.jsx)(v.JO,{className:"smallShow",icon:o[0].icon}),(0,i.jsx)(v.JO,{icon:"caret-down"})]}),(0,i.jsx)("ul",{className:"groupMenu",children:o.map((e=>(0,i.jsx)(ut,{route:e},e.name)))})]})}));var vt=t(39082),ft=t(52727);const yt=`apps v${"0.131.5-5-x".replace("-x","")}`,bt=v.zo.div`
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
`,kt=u.memo((function({className:e=""}){const{api:n,isApiReady:t}=(0,N.h)();return(0,i.jsxs)(bt,{className:`${e} media--1400 highlight--color-contrast ui--NodeInfo`,children:[t&&(0,i.jsxs)("div",{className:"node",children:[(0,i.jsx)(vt.Z,{})," ",(0,i.jsx)(ft.Z,{label:"v"})]}),(0,i.jsx)("div",{children:n.libraryInfo.replace("@polkadot/","")}),(0,i.jsx)("div",{children:yt})]})}));const wt=v.zo.div`
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
`,Ct=u.memo((function({className:e=""}){const{t:n}=zn(),{allAccounts:t,hasAccounts:o}=(0,Rn.x)(),r=(0,N.h)(),{allowTeleport:s}=(0,Dn.M)(),a=(0,Wn.W7)(r.isApiReady&&r.api.query.sudo?.key),l=(0,I.TH)(),c=(0,u.useRef)(function(e){return[{href:"https://github.com/polkadot-js/apps",icon:"code-branch",name:"github",text:e("nav.github","GitHub",{ns:"apps-routing"})},{href:"https://wiki.polkadot.network",icon:"book",name:"wiki",text:e("nav.wiki","Wiki",{ns:"apps-routing"})}]}(n)),p=(0,u.useRef)(An(n)),d=(0,u.useRef)({accounts:n("Accounts"),developer:n("Developer"),files:n("Files"),governance:n("Governance"),network:n("Network"),settings:n("Settings")}),m=(0,u.useMemo)((()=>!!a&&t.some((e=>a.eq(e)))),[t,a]),g=(0,u.useMemo)((()=>function(e,n,t,i,o,r){return Object.values(e.reduce(((e,t)=>(e[t.group]?e[t.group].routes.push(t):e[t.group]={name:n[t.group],routes:[t]},e)),{})).map((({name:e,routes:n})=>({name:e,routes:n.filter((({display:e})=>function({api:e,isApiConnected:n,isApiReady:t,isDevelopment:i},o,r,s,{isDevelopment:a,isHidden:l,needsAccounts:c,needsApi:p,needsApiCheck:d,needsApiInstances:u,needsSudo:m,needsTeleport:g}){return!(l||c&&!r||p&&(!t||!n||m&&!s||g&&!o||!i&&a||0!==$n(e,p,u,d).length))}(t,i,o,r,e)))}))).filter((({routes:e})=>e.length))}(p.current,d.current,r,s,o,m)),[s,r,o,m]),h=(0,u.useMemo)((()=>p.current.find((({name:e})=>l.pathname.startsWith(`/${e}`)))||null),[l]);return(0,i.jsx)(wt,{className:`${e}${r.isApiReady&&r.isApiConnected?"":" isLoading"} highlight--bg`,children:(0,i.jsxs)("div",{className:"menuContainer",children:[(0,i.jsxs)("div",{className:"menuSection",children:[(0,i.jsx)(ct,{}),(0,i.jsx)("ul",{className:"menuItems",children:g.map((({name:e,routes:n})=>(0,i.jsx)(xt,{isActive:!!h&&h.group===e.toLowerCase(),name:e,routes:n},e)))})]}),(0,i.jsx)("div",{className:"menuSection media--1200",children:(0,i.jsx)("ul",{className:"menuItems",children:c.current.map((e=>(0,i.jsx)(ut,{isLink:!0,isToplevel:!0,route:e},e.name)))})}),(0,i.jsx)(kt,{className:"media--1400"})]})})})),At=v.zo.div`
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
    bottom: 0.75rem;
    top: auto;
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
`,jt=u.memo((function({children:e,className:n="",icon:t,isBottom:o=!1,isFull:r=!1,type:s}){const[a,l]=(0,Fn.O)();return a?null:(0,i.jsx)(At,{className:`${n} ${"error"===s?"isError":"isInfo"} ${o?"isBottom":"isTop"} ${r?"isFull":"isPartial"}`,children:(0,i.jsxs)("div",{className:"content",children:[(0,i.jsx)(v.JO,{className:"contentIcon",icon:t,size:"2x"}),(0,i.jsx)("div",{className:"contentItem",children:e}),(0,i.jsx)(v.zx,{className:"closeIcon",icon:"times",isBasic:!0,isCircular:!0,onClick:l})]})})})),Nt=c.X.apiType.param,St="json-rpc"===c.X.apiType.type&&"string"==typeof Nt&&Nt.startsWith("ws://"),It="string"==typeof Nt&&Nt.includes("127.0.0.1"),Zt=window.location.protocol.startsWith("https:"),$t=u.memo((function({className:e}){const{t:n}=zn(),{apiError:t,isApiConnected:o,isApiReady:r,isWaitingInjected:s}=(0,N.h)();return t?(0,i.jsx)(jt,{className:e,icon:"globe",type:"error",children:(0,i.jsx)("div",{children:t})}):r?s?(0,i.jsx)(jt,{className:e,icon:"puzzle-piece",type:"info",children:(0,i.jsx)("div",{children:n("Waiting for authorization from the extension. Please open the installed extension and approve or reject access.")})}):o?null:(0,i.jsxs)(jt,{className:e,icon:"globe",type:"error",children:[(0,i.jsx)("div",{children:n("You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.")}),St&&!It&&Zt?(0,i.jsx)("div",{children:n("You are connecting from a secure location to an insecure WebSocket ({{wsUrl}}). Due to browser mixed-content security policies this connection type is not allowed. Change the RPC service to a secure 'wss' endpoint.",{replace:{wsUrl:Nt}})}):void 0]}):(0,i.jsx)(jt,{className:e,icon:"globe",type:"info",children:(0,i.jsx)("div",{children:n(o?"Waiting to complete metadata retrieval from remote endpoint.":"Waiting to establish a connection with the remote endpoint.")})})})),Ut=window.location.host.startsWith("polkadot.js.org"),zt=(0,a.Rf)((()=>"")).map((e=>e.dnslink)).reduce(((e,n)=>(n&&!e.includes(n)&&e.push(n),e)),[]),Tt=u.memo((function({className:e}){const{t:n}=zn(),{systemChain:t}=(0,N.h)(),o=(0,u.useMemo)((()=>{const e=t?.toLowerCase();return e&&zt.includes(e)?`https://${e}.dotapps.io`:"https://dotapps.io"}),[t]);return Ut?(0,i.jsx)(jt,{className:e,icon:"link",isBottom:!0,isFull:!0,type:"info",children:(0,i.jsxs)("div",{children:[n("You are connected to the development instance of the UI. For a fully decentralized experience, you are encouraged to use the IPFS deployed version as the canonical URL: "),(0,i.jsx)("a",{href:o,rel:"noreferrer",target:"_blank",children:o.replace("https://","")})]})}):null})),Rt=u.memo((function(){const{api:e,isApiReady:n}=(0,N.h)(),t=(0,Wn.W7)(n&&e.derive.accounts?.indexes),o=(0,Wn.W7)(n&&e.query.identity?.registrars),r=(0,Wn.W7)(n&&e.query.balances?.totalIssuance),[s,a]=(0,u.useState)(!1);return(0,u.useEffect)((()=>{a(!!t||!!r||!!o)}),[]),(0,i.jsx)("div",{className:`apps--api-warm ${s.toString()}`})})),Wt=v.zo.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map((e=>`\n    .greyAnim-${e} {\n      animation: greyAnim${e} 2s;\n    }\n\n    @keyframes greyAnim${e} {\n      0% { background: #a6a6a6; }\n      50% { background: darkorange; }\n      100% { background: #a6a6a6; }\n    }\n  `)).join("")}
`,qt=u.memo((function({className:e=""}){const{themeClassName:n}=(0,j.F)(),{apiEndpoint:t,isDevelopment:o}=(0,N.h)(),r=(0,u.useMemo)((()=>o?void 0:t?.ui.color),[t,o]);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(A.Z,{uiHighlight:r}),(0,i.jsxs)(Wt,{className:`${e} apps--Wrapper ${n}`,children:[(0,i.jsx)(Ct,{}),(0,i.jsxs)(v.J0,{children:[(0,i.jsx)(S.ZP,{children:(0,i.jsx)(Bn,{})}),(0,i.jsx)($t,{}),(0,i.jsx)(Tt,{}),(0,i.jsx)("div",{id:"portals"})]})]}),(0,i.jsx)(Rt,{})]})}));function Et({uiTheme:e}){const n="dark"===e?"dark":"light";return document&&document.documentElement&&document.documentElement.setAttribute("data-theme",n),"dark"===e?v.$_:v.Wb}const Mt=u.memo((function({isElectron:e,store:n}){const[t,o]=(0,u.useState)((()=>Et(c.X)));return(0,u.useEffect)((()=>{c.X.on("change",(e=>o(Et(e))))}),[]),(0,i.jsx)(u.Suspense,{fallback:"...",children:(0,i.jsx)(h.f6,{theme:t,children:(0,i.jsx)(f.q,{children:(0,i.jsx)(x.ApiCtxRoot,{apiUrl:c.X.apiUrl,isElectron:e,store:n,children:(0,i.jsx)(y.y,{children:(0,i.jsx)(b.u,{children:(0,i.jsx)(k.g,{children:(0,i.jsx)(w.w,{children:(0,i.jsx)(g.UT,{children:(0,i.jsx)(C.A,{children:(0,i.jsx)(qt,{})})})})})})})})})})})})),Ot="root",Pt=document.getElementById(Ot);if(!Pt)throw new Error(`Unable to find element with id '${Ot}'`);(0,m.s)(Pt).render((0,i.jsx)(Mt,{isElectron:!1}))},29038:(e,n,t)=>{var i={".":[57139,9],"./":[57139,9],"./Api":[34777,9],"./Api.tsx":[34777,9],"./hoc":[69356,9],"./hoc/":[69356,9],"./hoc/api":[94356,9],"./hoc/api.tsx":[94356,9],"./hoc/call":[98727,9],"./hoc/call.tsx":[98727,9],"./hoc/callDiv":[3364,9],"./hoc/callDiv.tsx":[3364,9],"./hoc/calls":[5246,9],"./hoc/calls.ts":[5246,9],"./hoc/index":[69356,9],"./hoc/index.ts":[69356,9],"./hoc/multi":[60028,9],"./hoc/multi.ts":[60028,9],"./hoc/observable":[33989,9],"./hoc/observable.tsx":[33989,9],"./hoc/onlyOn":[35475,9],"./hoc/onlyOn.tsx":[35475,9],"./hoc/types":[68570,9,8570],"./hoc/types.ts":[68570,9,8570],"./index":[57139,9],"./index.ts":[57139,9],"./light":[36956,9],"./light.spec":[58705,9,8705],"./light.spec.ts":[58705,9,8705],"./light/":[36956,9],"./light/index":[36956,9],"./light/index.ts":[36956,9],"./light/kusama":[37178,9],"./light/kusama/":[37178,9],"./light/kusama/gm.json":[35409,3,5409],"./light/kusama/index":[37178,9],"./light/kusama/index.ts":[37178,9],"./light/kusama/shiden.json":[69315,3,9315],"./light/kusama/tinkernet.json":[36074,3,6074],"./light/polkadot":[15299,9],"./light/polkadot/":[15299,9],"./light/polkadot/astar.json":[59199,3,9199],"./light/polkadot/index":[15299,9],"./light/polkadot/index.ts":[15299,9],"./statics":[95267,9],"./statics.ts":[95267,9],"./transform/echo":[80522,9],"./transform/echo.ts":[80522,9],"./types":[55903,9,5903],"./types.ts":[55903,9,5903],"./urlTypes":[81369,9],"./urlTypes.ts":[81369,9],"./util":[41186,9],"./util/":[41186,9],"./util/getEnvironment":[68372,9],"./util/getEnvironment.ts":[68372,9],"./util/historic":[77809,9],"./util/historic.ts":[77809,9],"./util/index":[41186,9],"./util/index.ts":[41186,9],"./util/intervalObservable":[71951,9],"./util/intervalObservable.ts":[71951,9],"./util/isEqual":[65345,9],"./util/isEqual.ts":[65345,9],"./util/triggerChange":[74733,9],"./util/triggerChange.ts":[74733,9]};function o(e){if(!t.o(i,e))return Promise.resolve().then((()=>{var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=i[e],o=n[0];return Promise.all(n.slice(2).map(t.e)).then((()=>t.t(o,16|n[1])))}o.keys=()=>Object.keys(i),o.id=29038,e.exports=o},18983:()=>{},33196:()=>{},38087:()=>{},74854:()=>{},66602:()=>{}},e=>{e.O(0,[6677,4668,5744,584,1064,4124,2440,434,9398,9e3,8043,7924,212,2044,2854,5320,9684,2021,738,344,760,6829,5005,9319,2208,136,9768,6641,8402,3108,353,7175,4292,7496,3305,9121,1454,8291,4635,5502,3569,1295,3508,8758,5609,5831,2919,9484,5273,8717,9032,9013,5953,8438,7057,1211,5512,7564,9946,7368,7965,4234],(()=>(83902,e(e.s=83902)))),e.O()}]);