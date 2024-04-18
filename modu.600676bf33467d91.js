"use strict";(("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps=("undefined"!=typeof self?self:this).webpackChunk_polkadot_apps||[]).push([[2107],{51304:(e,s,t)=>{t.d(s,{ZP:()=>K});var n=t(23994),r=t(85960),a=t(11968);const i={name:"@polkadot/react-identicon",path:new URL("file:///home/runner/work/apps/apps/node_modules/@polkadot/react-identicon/packageInfo.js").pathname.substring(0,new URL("file:///home/runner/work/apps/apps/node_modules/@polkadot/react-identicon/packageInfo.js").pathname.lastIndexOf("/")+1),type:"esm",version:"3.6.6"};(0,a.E)(i,null,[n.b,r.b]);var o=t(52322),l=t(2784),c=t(72282),u=t(16039),m=t(35545),d=t(48358),p=t(74076),h=t(55858),y=t(73493),f=t(90107),g=t(94175),x=t(7989);const v=l.memo((function({address:e,className:s="",size:t,style:n={}}){const r=(0,l.useCallback)((s=>{s?.appendChild((0,x.y)(e,{isAlternative:!1,size:t}))}),[e,t]);return(0,o.jsx)("div",{className:s,ref:r,style:n})})),k=l.memo((function({className:e="",size:s,style:t={}}){return(0,o.jsx)("svg",{className:e,height:s,style:t,viewBox:"0 0 64 64",width:s})}));var w=t(88617),b=t(31383);const N=b.zo.img((({size:e})=>`\n  display: block;\n  height: ${e}px;\n  width: ${e}px;\n`)),j=l.memo((function({address:e,className:s="",size:t,style:n={}}){const r=(0,l.useMemo)((()=>w(e)),[e]);return(0,o.jsx)(N,{className:s,size:t,src:r,style:n})}));var z=t(56926);const I=l.memo((function({className:e="",publicKey:s,size:t,style:n={}}){const r=(0,l.useMemo)((()=>({__html:z.KT(s.substring(2),t)})),[s,t]);return(0,o.jsx)("div",{className:e,dangerouslySetInnerHTML:r,style:n})}));var A=t(55824);function U({cx:e,cy:s,fill:t,r:n},r){return(0,o.jsx)("circle",{cx:e,cy:s,fill:t,r:n},r)}const C=l.memo((function({address:e,className:s="",isAlternative:t=!1,size:n,style:r={}}){const a=(0,l.useMemo)((()=>(0,A.i)(e,{isAlternative:t})),[e,t]);return(0,o.jsx)("svg",{className:s,height:n,id:e,name:e,style:r,viewBox:"0 0 64 64",width:n,children:a.map(U)})})),S=v,D=64,E={beachball:v,empty:k,ethereum:j,jdenticon:I,polkadot:C,substrate:I};class _ extends l.PureComponent{state={address:"",publicKey:"0x"};static prefix=void 0;static setDefaultPrefix(e){_.prefix=e}static getDerivedStateFromProps({prefix:e=_.prefix,theme:s,value:t},n){if("ethereum"===s)return{address:(0,d.U)(t)?(0,y.K)(t):t||"",publicKey:""};try{const s=(0,d.U)(t)||(0,p.vq)(t)?(0,f.m)(t,e):t||"",r=(0,h.c)((0,g.m)(s,!1,e));return s===n.address?null:{address:s,publicKey:r}}catch{return{address:"",publicKey:"0x"}}}render(){const{address:e}=this.state,s=this.getWrapped(this.state,this.props);return e?(0,o.jsx)(c,{onCopy:this.onCopy,text:e,children:s}):s}getWrapped({address:e,publicKey:s},{Custom:t}){const{className:n="",isAlternative:r,isHighlight:a,size:i=D,style:l={},theme:c=u.X.icon}=this.props,d=e?t||E["default"===c?m.Oi:c]||S:k;return(0,o.jsx)(q,{className:`ui--IdentityIcon  ${n}`,style:l,children:(0,o.jsx)(d,{address:e,className:a?"highlight":"",isAlternative:r,publicKey:s,size:i})},e)}onCopy=()=>{const{onCopy:e}=this.props,{address:s}=this.state;s&&e&&e(s)}}const q=b.zo.div`
  cursor: copy;
  display: inline-block;
  line-height: 0;

  > .container {
    position: relative;

    > div,
    > svg {
      position: relative;
    }

    &.highlight:before {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      box-shadow: 0 0 5px 2px #aaa;
      content: '';
    }
  }
`,K=l.memo((function(e){return(0,o.jsx)(_,{...e})}))},72152:(e,s,t)=>{t.d(s,{r_:()=>j,K0:()=>z,CU:()=>S,lB:()=>D});var n=t(11968);const r={name:"@polkadot/react-qr",path:new URL("file:///home/runner/work/apps/apps/node_modules/@polkadot/react-qr/packageInfo.js").pathname.substring(0,new URL("file:///home/runner/work/apps/apps/node_modules/@polkadot/react-qr/packageInfo.js").pathname.lastIndexOf("/")+1),type:"esm",version:"3.6.6"};(0,n.E)(r,null,[]);var a=t(52322),i=t(2784),o=t(33403),l=t(69516);const c=t(4133);c.stringToBytes=e=>e;var u=t(31383),m=t(51330),d=t(46610),p=t(54371),h=t(94175);const y="secret",f=new Uint8Array([83]),g=new Uint8Array([1]),x=(new Uint8Array([0]),new Uint8Array([1]),new Uint8Array([2]),new Uint8Array([3]),new Uint8Array([0]));function v(e){return new Uint8Array([e>>8,255&e])}function k(e){if(!e)return{height:"auto",width:"100%"};const s=(0,p.H)(e)?e:`${e}px`;return{height:s,width:s}}function w(e){const s=c(0,"M");return s.addData(e,"Byte"),s.make(),s.createDataURL(16,0)}const b=u.zo.div`
  .ui--qr-Display {
    height: 100%;
    width: 100%;

    img,
    svg {
      background: white;
      height: auto !important;
      max-height: 100%;
      max-width: 100%;
      width: auto !important;
    }
  }
`,N=i.memo((function({className:e="",size:s,skipEncoding:t,style:n={},timerDelay:r=2750,value:c}){const[{image:u},d]=(0,i.useState)({frameIdx:0,frames:[],image:null,valueHash:null}),p=(0,i.useRef)({timerDelay:r,timerId:null}),h=(0,i.useMemo)((()=>k(s)),[s]);return(0,i.useEffect)((()=>{const e=()=>d((s=>{if(s.frames.length<=1)return s;let t=s.frameIdx+1;t===s.frames.length&&(t=0,p.current.timerDelay=p.current.timerDelay+500);const n=(0,o.Z)({},s,{frameIdx:t,image:w(s.frames[t])});return p.current.timerId=setTimeout(e,p.current.timerDelay),n}));return p.current.timerId=setTimeout(e,p.current.timerDelay),()=>{p.current.timerId&&clearTimeout(p.current.timerId)}}),[]),(0,i.useEffect)((()=>{d((e=>{const s=(0,l.R)(c);if(s===e.valueHash)return e;const n=t?[c]:function(e){const s=[];let t=0;for(;t<e.length;)s.push(e.subarray(t,t+1024)),t+=1024;return s.map(((e,t)=>(0,m.e)(x,v(s.length),v(t),e)))}(c);return{frameIdx:0,frames:n,image:w(n[0]),valueHash:s}}))}),[t,c]),u?(0,a.jsx)(b,{className:e,style:h,children:(0,a.jsx)("div",{className:"ui--qr-Display",style:n,children:(0,a.jsx)("img",{src:u})})}):null})),j=i.memo((function({address:e,className:s,cmd:t,genesisHash:n,payload:r,size:o,style:l,timerDelay:c}){const u=(0,i.useMemo)((()=>function(e,s,t,n){return(0,m.e)(f,g,new Uint8Array([s]),(0,h.m)(e),(0,d.Y)(t),(0,d.Y)(n))}(e,t,r,n)),[e,t,r,n]);return u?(0,a.jsx)(N,{className:s,size:o,style:l,timerDelay:c,value:u}):null})),z=i.memo((function({className:e,networkSpecs:s,size:t,style:n}){const r=(0,i.useMemo)((()=>function(e){const s=e.length,t=new Uint8Array(s);for(let n=0;n<s;n++)t[n]=e.charCodeAt(n);return t}(JSON.stringify(s))),[s]);return r?(0,a.jsx)(N,{className:e,size:t,skipEncoding:!0,style:n,value:r}):null}));var I=t(53789);const A=e=>{console.error("@polkadot/react-qr:Scan",e.message)},U=u.zo.div`
  .ui--qr-Scan {
    display: inline-block;
    height: 100%;
    transform: matrix(-1, 0, 0, 1, 0, 0);
    width: 100%;

    video {
      margin: 0;
    }
  }
`,C=i.memo((function({className:e="",delay:s=150,onError:t=A,onScan:n,size:r,style:o={}}){const l=(0,i.useMemo)((()=>k(r)),[r]),c=(0,i.useCallback)((e=>t(e)),[t]),u=(0,i.useCallback)((e=>e&&n(e)),[n]);return(0,a.jsx)(U,{className:e,style:l,children:(0,a.jsx)(I,{className:"ui--qr-Scan",delay:s,onError:c,onScan:u,style:o})})})),S=i.memo((function({className:e,isEthereum:s,onError:t,onScan:n,size:r,style:o}){const l=(0,i.useCallback)((e=>{if(e)try{let t,r,a,i;s?([t,r,...i]=e.split(":"),a=null,r=r.substring(0,42)):[t,r,a,...i]=e.split(":");const o=s?"ethereum":"substrate";if(t!==o&&t!==y)throw new Error(`Invalid prefix received, expected '${o} or ${y}' , found '${t}'`);const l=t===o;l&&!s&&(0,h.m)(r),n({content:r,genesisHash:a,isAddress:l,name:i?.length?i.join(":"):void 0})}catch(s){t&&t(s),console.error("@polkadot/react-qr:QrScanAddress",s.message,e)}}),[n,t,s]);return(0,a.jsx)(C,{className:e,onError:t,onScan:l,size:r,style:o})})),D=i.memo((function({className:e,onError:s,onScan:t,size:n,style:r}){const o=(0,i.useCallback)((e=>e&&t({signature:`0x${e}`})),[t]);return(0,a.jsx)(C,{className:e,onError:s,onScan:o,size:n,style:r})}))}}]);