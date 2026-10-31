// ===== ข้อมูลห้องตามแผนผัง (รูปแบบ "รหัส:ที่นั่ง:ชื่อ" เรียงจากใกล้ศูนย์กลางไปปลายปีก) =====
// W/E/NW/NE = [ฝั่ง a, ฝั่ง b]  (W: a=เหนือ  E: a=ใต้  NW: a=ฝั่งบน-ขวา  NE: a=ฝั่งล่าง-ขวา)
// เครื่องหมาย "-" = ช่องว่าง (ใช้ขยับห้องไปปลายปีก)   fl/fr: ถ้ามี 2 แถวใช้ | คั่น
// va/vb = คอลัมน์ห้องแนวตั้ง (ชั้น 2)   bc = ห้องใหญ่ตรงกลาง (ชั้น 3)   ag = รูปแบบแถวโค้ง
const D={
1:{ag:"stack",arc:"1063::งานอนามัย,1062,1064,1065",W:["1026:50,1025:50,1024:50,1023:50","1017:50,1018:50,1019:50,1020:50"],E:["1044:50,1043:50,1042:50,1041:50","1035:50,1036:50,1037:50,1038:50"],NW:["",""],NE:["SA1::Self Access,SA2::Self Access","1066:50,1067:50,1068:50,1069:50"],
   fl:"1016:50,1015::Sound lab,1014::Sound lab|1011::Control,1012:50,1013:50",fr:"1047:50,1046:50,1045:50|1048::สำนักงาน SC,1049:50,1050:50",bl:"1003:500,1001:500",br:"1058:500,1059:500"},
2:{ag:"two",arc:"2051,2052",W:["2016:50,2015:50,2014:50,2013:50","2007:50,2008:50,2009:50,2010:50"],E:["2034:50,2033:50,2032:50,2031:50","2025:50,2026:50,2027:50,2028:50"],NW:["2050:50,2049:50,2048:50,2047:50","2041:50,2042:50,2043:50,2044:50"],NE:["2062:50,2061:50,2060:50,2059:50","2053:50,2054:50,2055:50,2056:50"],
   fl:"",fr:"",bl:"",br:"",va:"2006:50,2005:50,2004:50",vb:"2001:100,2002:100,2003:100"},
3:{ag:"gap",arc:"3048:200,3049:200,3050:200,3051:200",W:["3017:100,3016:100,3015:100","3010:100,3011:100,3012:100"],E:["3039:100,3038:100,3037:100","3032:100,3033:100,3034:100"],NW:["-,-,3047:50,3046:50","3040:50,3041:50,3042:50,3043:50"],NE:["3059:50,3058:50,3057:50,3056:50","-,-,3052:50,3053:50"],
   fl:"3018:50,3019:50,3020:50",fr:"3029:50,3030:50,3031:50",bl:"3006:300",bc:"3005:300",br:"3004:300"},
4:{ag:"gap",arc:"4036:200,4037:200,4038:200,4039:200",W:["4011:150,4010:50,4009:50","4004:100,4005:100,4006:100"],E:["4030:100,4029:100,4028:100","4023:150,4024:50,4025:50"],NW:["-,-,4035:150","4031:150,4032:150"],NE:["4044:150,4043:150","-,-,4040:150"],
   fl:"",fr:"",bl:"4001:300",br:"4020:300"}};
const SEG={ring:"ทางเดินวงโค้งกลาง",front:"โถงด้านหน้า",W:"ปีกซ้าย",E:"ปีกขวา",NW:"ปีกซ้ายเฉียง",NE:"ปีกขวาเฉียง"};
const SN={C:"บันไดกลาง",W:"บันไดปีกซ้าย",E:"บันไดปีกขวา",NW:"บันไดปีกซ้ายเฉียง",NE:"บันไดปีกขวาเฉียง"};
const M=0.25; // 1 หน่วยแผนที่ = 0.25 เมตร (ประมาณ)
// ===== สร้างกราฟ =====
const R=Math.PI/180,$=id=>document.getElementById(id);
const N={},adj={},ROOMS=[],LN={1:[],2:[],3:[],4:[]};
const add=(id,f,x,y,o)=>{N[id]={id,f,x,y,...o};adj[id]=[]};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const link=(a,b,t="walk",c)=>{c??=dist(N[a],N[b]);adj[a].push({to:b,t,c});adj[b].push({to:a,t,c})};
const lst=s=>(s||"").split(",").map(x=>x.trim()).filter(Boolean);
// ตำแหน่งห้องแถวโค้ง: [มุมกึ่งกลาง, ครึ่งความกว้าง(องศา), รัศมีใน, รัศมีนอก]
const ARC={gap:[[110.5,5.5],[99.5,5.5],[80.5,5.5],[69.5,5.5]],two:[[106,10],[74,10]],stack:[[109,7,214,238],[109,7,188,212],[71,7,214,238],[71,7,188,212]]};
const RA=[...new Set([...Array(25).keys()].map(i=>180-7.5*i).concat(...Object.values(ARC).flat().map(v=>v[0])))].sort((a,b)=>b-a);
const sec=(a1,a2,r1,r2,cx,cy)=>{const q=[];for(let k=0;k<=3;k++){const a=(a2-(a2-a1)*k/3)*R;q.push([400+r2*Math.cos(a)-cx,440-r2*Math.sin(a)-cy])}for(let k=3;k>=0;k--){const a=(a2-(a2-a1)*k/3)*R;q.push([400+r1*Math.cos(a)-cx,440-r1*Math.sin(a)-cy])}return q.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ")};
const WG={W:{o:180,d:[-1,0],ts:100,wc:"ห้องน้ำปีกซ้าย"},NW:{o:135,d:[-.7071,-.7071],ts:16,wc:"ห้องน้ำปีกซ้ายเฉียง"},NE:{o:45,d:[.7071,-.7071],ts:16,wc:"ห้องน้ำปีกขวาเฉียง"},E:{o:0,d:[1,0],ts:100,wc:"ห้องน้ำปีกขวา"}};
function room(f,tok,x,y,w,h,rot,at,poly){
  const [id,seats,name]=tok.split(":"),code=/^\d/.test(id)?"SC"+id:id,rid="m"+code;
  add(rid,f,x,y,{kind:"room",code,seats,name,w,h,rot,poly,seg:"room",short:id});link(rid,at,"room");ROOMS.push(rid);
}
for(let f=1;f<=4;f++){
  const d=D[f];
  RA.forEach(a=>add(`r${f}_${a}`,f,400+170*Math.cos(a*R),440-170*Math.sin(a*R),{kind:"corr",seg:"ring"}));
  for(let i=1;i<RA.length;i++)link(`r${f}_${RA[i-1]}`,`r${f}_${RA[i]}`);
  add(`s${f}_C`,f,400,440,{kind:"stair",seg:"front",sname:SN.C});
  const cl=[[230,`r${f}_180`],[400,`s${f}_C`],[570,`r${f}_0`]];
  {[["wl",316],["ll",352],["lr",448],["wr",484]].forEach(([k,x])=>{add(`q${f}${k}`,f,x,440,{kind:"corr",seg:"front"});cl.push([x,`q${f}${k}`])});
  [["wl","ห้องน้ำกลางซ้าย",316,"wc"],["wr","ห้องน้ำกลางขวา",484,"wc"],["ll","ลิฟต์ซ้าย",352,"lift"],["lr","ลิฟต์ขวา",448,"lift"]].forEach(([k,nm,x,kd])=>{
    const id=`${kd}${f}${k}`,o={seg:"front",code:nm+" ชั้น "+f};
    add(id,f,x,414,kd=="wc"?{...o,kind:"wc",short:"WC"}:{...o,kind:"lift",sname:nm,short:"ลิฟต์"});
    link(id,`q${f}${k}`,kd=="wc"?"room":"walk");ROOMS.push(id)});}
  LN[f].push([230,440,570,440]);
  const arc=lst(d.arc),AG=ARC[d.ag]||[];
  arc.forEach((t,k)=>{const [a,hw,r1=188,r2=238]=AG[k],m=(r1+r2)/2,x=400+m*Math.cos(a*R),y=440-m*Math.sin(a*R);room(f,t,x,y,46,50,0,`r${f}_${a}`,sec(a-hw,a+hw,r1,r2,x,y))});
  for(const k in WG){
    const g=WG[k],o=N[`r${f}_${g.o}`],[dx,dy]=g.d,P=t=>[o.x+dx*t,o.y+dy*t];
    const A=lst(d[k][0]),B=lst(d[k][1]),m=Math.max(A.length,B.length),ns=[];
    let rot=Math.atan2(dy,dx)/R;if(rot>90)rot-=180;if(rot<=-90)rot+=180;
    for(let i=0;i<m;i++){
      const t=30+32*i,[px,py]=P(t),id=`w${f}${k}${i}`;add(id,f,px,py,{kind:"corr",seg:k});ns.push([t,id]);
      if(A[i]&&A[i]!="-")room(f,A[i],px-dy*44,py+dx*44,30,38,rot,id);
      if(B[i]&&B[i]!="-")room(f,B[i],px+dy*44,py-dx*44,30,38,rot,id);
    }
    add(`s${f}_${k}`,f,...P(g.ts),{kind:"stair",seg:k,sname:SN[k]});ns.push([g.ts,`s${f}_${k}`]);
    add(`wc${f}${k}`,f,...P(158),{kind:"wc",seg:k,code:g.wc+" ชั้น "+f,short:"WC"});ns.push([158,`wc${f}${k}`]);ROOMS.push(`wc${f}${k}`);
    ns.sort((p,q)=>p[0]-q[0]);let pv=o.id;ns.forEach(([t,id])=>{link(pv,id);pv=id});LN[f].push([o.x,o.y,...P(158)]);
  }
  const HY=f==1?530:500,H=[400];
  add(`h${f}_400`,f,400,HY,{kind:"corr",seg:"front"});link(`s${f}_C`,`h${f}_400`);
  const hn=x=>{x=Math.round(x);const id=`h${f}_${x}`;if(!N[id]){add(id,f,x,HY,{kind:"corr",seg:"front"});H.push(x)}return id};
  const cn=x=>{x=Math.round(x);let e=cl.find(c=>c[0]==x);if(!e){e=[x,`q${f}u${x}`];add(e[1],f,x,440,{kind:"corr",seg:"front"});cl.push(e)}return e[1]};
  [["fl",-1],["fr",1],["bl",-1],["br",1],["bc",0]].forEach(([key,s])=>{
    const rows=(d[key]||"").split("|"),big=key[0]=="b",two=rows.length>1;
    rows.forEach((str,ri)=>{
      const L=lst(str),n=L.length,w=big?(n>2?60:70):Math.min(two?48:36,150/n);
      const y=big?HY+45:two?(ri?500:466):474,h=big?70:two?(ri?32:30):36,up=two&&ri==0;
      L.forEach((t,k)=>{const x=s==0?400:d.bc&&big?400+s*(w+6)*(s<0?n-k:k+1):s<0?392-(n-1-k)*w-w/2:408+k*w+w/2;room(f,t,x,y,w-1,h,0,up?cn(x):hn(x))});
    });
  });
  [["va",258,1],["vb",392,-1]].forEach(([key,vx,s])=>{
    const L=lst(d[key]);if(!L.length)return;let pv=cn(vx);
    L.forEach((t,k)=>{const y=470+40*k,id=`v${f}_${vx}_${y}`;add(id,f,vx,y,{kind:"corr",seg:"front"});link(pv,id);pv=id;room(f,t,vx+s*34,y,50,38,0,id)});
    LN[f].push([vx,440,vx,470+40*(L.length-1)]);
  });
  cl.sort((a,b)=>a[0]-b[0]);for(let i=1;i<cl.length;i++)link(cl[i-1][1],cl[i][1]);
  H.sort((a,b)=>a-b);for(let i=1;i<H.length;i++)link(`h${f}_${H[i-1]}`,`h${f}_${H[i]}`);
  LN[f].push([H[0],HY,H[H.length-1],HY],[400,440,400,HY]);
}
add("en",1,400,625,{kind:"entry",seg:"front",code:"ทางเข้าอาคาร",short:"ทางเข้า"});link("en","h1_400");ROOMS.push("en");LN[1].push([400,530,400,625]);
for(let f=1;f<4;f++)["C","W","E","NW","NE"].forEach(k=>link(`s${f}_${k}`,`s${f+1}_${k}`,"stairs",40));
for(let f=1;f<4;f++)["ll","lr"].forEach(k=>link(`lift${f}${k}`,`lift${f+1}${k}`,"stairs",40));
// ===== หาเส้นทาง =====
function route(a,b){
  const d={[a]:0},pv={},done=new Set();
  for(;;){let u=null;for(const k in d)if(!done.has(k)&&(u===null||d[k]<d[u]))u=k;
    if(u===null)return null;if(u===b)break;done.add(u);
    for(const e of adj[u]){if(e.t=="stairs"&&N[u].kind=="stair"&&$("lo").checked)continue;const nd=d[u]+e.c;if(d[e.to]===undefined||nd<d[e.to]){d[e.to]=nd;pv[e.to]={from:u,t:e.t}}}}
  const nodes=[b],types=[];let c=b;while(c!==a){types.unshift(pv[c].t);c=pv[c].from;nodes.unshift(c)}
  return {nodes,types};
}
const mm=m=>Math.max(1,Math.round(m*M));
function makeSteps(p){
  const n=p.nodes.map(i=>N[i]),T=p.types,S=[];let i=0;
  while(i<n.length-1){
    const a=n[i];
    if(T[i]=="stairs"){S.push({i,j:i+1,f:a.f,t:`${n[i+1].f>a.f?"ขึ้น":"ลง"}${a.sname} ไปชั้น ${n[i+1].f}`});i++;continue}
    if(T[i]=="room"&&(a.kind=="room"||a.kind=="wc")){S.push({i,j:i+1,f:a.f,t:`ออกจาก${a.kind=="room"?"ห้อง ":""}${a.code} เข้าสู่${SEG[n[i+1].seg]}`});i++;continue}
    let j=i,m=0;
    while(j<n.length-1&&T[j]=="walk"&&n[j+1].seg===a.seg){m+=dist(n[j],n[j+1]);j++}
    const nx=n[j+1],ty=T[j],base=`เดินตาม${SEG[a.seg]}ประมาณ ${mm(m)} เมตร`;let t,end=j;
    if(!nx){t=`${base} ถึง${n[j].code}`}
    else if(ty=="walk"){m+=dist(n[j],nx);end=j+1;t=`เดินตาม${SEG[a.seg]}ประมาณ ${mm(m)} เมตร ไปถึงจุดต่อกับ${SEG[nx.seg]}`}
    else if(ty=="stairs"){t=`${base} ไปที่${n[j].sname}`}
    else{
      m+=dist(n[j],nx);end=j+1;
      const q=j>0&&n[j-1].f==n[j].f?n[j-1]:null;let side="ข้างทาง";
      if(q){const dx=n[j].x-q.x,dy=n[j].y-q.y;side=(dx*(nx.y-n[j].y)-dy*(nx.x-n[j].x))>0?"ขวามือ":"ซ้ายมือ"}
      t=`เดินตาม${SEG[a.seg]}ประมาณ ${mm(m)} เมตร ${nx.kind=="room"?"ห้อง ":""}${nx.code} จะอยู่ทาง${side}`;
    }
    S.push({i,j:end,f:a.f,t});i=nx?end:n.length;
  }
  return S;
}
// ===== หน้าจอ =====
let floor=1,cur=null,STP=[],k=0,st="en",ds="";
const find=v=>{v=v.trim().toUpperCase().replace(/\s/g,"");return ROOMS.map(i=>N[i]).find(r=>{const c=r.code.toUpperCase().replace(/\s/g,"");return c==v||c=="SC"+v||(r.name&&r.name.toUpperCase().replace(/\s/g,"")==v)})};
$("dl").innerHTML=ROOMS.map(i=>`<option value="${N[i].code}">${N[i].name||""}</option>`).join("");
const msg=t=>$("msg").textContent=t;
function draw(){
  const f=floor,s=[`<defs><pattern id="ht" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="var(--line)" stroke-width="2"/></pattern></defs>`,`<path class="hall" d="M230 440A170 170 0 0 1 570 440"/>`];
  LN[f].forEach(l=>s.push(`<line class="hall" x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}"/>`));
  if(f==2)s.push(`<rect x="447" y="462" width="104" height="130" fill="url(#ht)" stroke="var(--line)"><title>พื้นที่ไม่มีห้องตามแผนผัง</title></rect>`);
  Object.values(N).filter(n=>n.f==f).forEach(n=>{
    const c=n.id==ds?"dest":n.id==st?"src":"";
    if(n.kind=="room")s.push(`<g class="rm ${c}" data-id="${n.id}" transform="translate(${n.x} ${n.y}) rotate(${n.rot})"><title>${n.code} ${n.name||""} ${n.seats?n.seats+" ที่นั่ง":""}</title>${n.poly?`<polygon points="${n.poly}" style="fill:${c=="dest"?"var(--route)":c=="src"?"var(--sign)":"var(--room)"};stroke:${c=="dest"?"var(--route)":c=="src"?"var(--sign)":"var(--line)"};cursor:pointer"/>`:`<rect x="${-n.w/2}" y="${-n.h/2}" width="${n.w}" height="${n.h}" rx="3"/>`}<text y="4" font-size="${n.w<30?8.5:11}">${n.short}</text></g>`);
    else if(n.kind=="wc")s.push(`<g class="rm wc ${c}" data-id="${n.id}" transform="translate(${n.x} ${n.y})"><title>${n.code}</title><rect x="-14" y="-10" width="28" height="20" rx="3"/><text y="4">WC</text></g>`);
    else if(n.kind=="lift")s.push(`<g class="rm wc lift ${c}" data-id="${n.id}" transform="translate(${n.x} ${n.y})"><title>${n.code}</title><rect x="-17" y="-10" width="34" height="20" rx="3"/><text y="3.5" font-size="9">ลิฟต์</text></g>`);
    else if(n.kind=="entry")s.push(`<g class="rm ${c}" data-id="en" transform="translate(${n.x} ${n.y})"><rect x="-36" y="-12" width="72" height="24" rx="5"/><text y="4" font-size="11">ทางเข้า</text></g>`);
    else if(n.kind=="stair")s.push(`<g class="st" transform="translate(${n.x} ${n.y})"><rect x="-19" y="-9" width="38" height="18" rx="3"/><text y="3.5">บันได</text></g>`);
  });
  if(cur){
    const pts=a=>a.filter(n=>n.f==f).map(n=>n.x.toFixed(0)+","+n.y.toFixed(0)).join(" ");
    const all=cur.nodes.map(i=>N[i]);
    s.push(`<polyline class="p0" points="${pts(all)}"/>`);
    const q=STP[k];if(q)s.push(`<polyline class="p1" points="${pts(all.slice(q.i,q.j+1))}"/>`);
  }
  $("svg").innerHTML=s.join("");
  const used=new Set(cur?cur.nodes.map(i=>N[i].f):[]);
  $("tabs").innerHTML=[1,2,3,4].map(x=>`<button aria-pressed="${x==f}" data-fl="${x}">ชั้น ${x}${used.has(x)?" ●":""}</button>`).join("");
  document.querySelectorAll("#steps button").forEach(b=>b.classList.toggle("on",+b.dataset.k==k));
  $("prev").disabled=k<=0;$("next").disabled=k>=STP.length-1;
}
function go(){
  const a=find($("from").value),b=find($("to").value);
  cur=null;STP=[];k=0;$("steps").innerHTML="";$("sum").textContent="";
  if(!a||!b){msg("ไม่พบห้องที่พิมพ์ ลองใช้รหัส เช่น SC2050");draw();return}
  st=a.id;ds=b.id;floor=a.f;
  if(a==b){msg("เลือกจุดเริ่มต้นและปลายทางให้ต่างกัน");draw();return}
  cur=route(a.id,b.id);STP=makeSteps(cur);
  let len=0;cur.nodes.forEach((id,i)=>{if(i&&cur.types[i-1]!="stairs")len+=dist(N[cur.nodes[i-1]],N[id])});
  const fl=new Set(cur.nodes.map(i=>N[i].f)).size-1;
  msg(`${b.code}${b.name?" "+b.name:""} อยู่ชั้น ${b.f}${b.seats?" รองรับ "+b.seats+" ที่นั่ง":""}`);
  $("sum").textContent=`ระยะทางประมาณ ${mm(len)} เมตร ใช้เวลาราว ${Math.max(1,Math.round(mm(len)/70+fl*.5))} นาที`;
  $("steps").innerHTML=STP.map((s,i)=>`<li><button data-k="${i}"><span class="n">${i+1}</span><span>${s.t}</span></button></li>`).join("");
  floor=STP[0].f;draw();
}
function setK(i){k=Math.max(0,Math.min(STP.length-1,i));floor=STP[k].f;draw()}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-fl],[data-k],.rm");if(!t)return;
  if(t.dataset.fl){floor=+t.dataset.fl;draw()}
  else if(t.dataset.k!==undefined)setK(+t.dataset.k);
  else if(t.dataset.id&&t.dataset.id!=st){$("to").value=N[t.dataset.id].code;go()}
});
$("prev").onclick=()=>setK(k-1);$("next").onclick=()=>setK(k+1);
["from","to","lo"].forEach(i=>$(i).addEventListener("change",go));
// ===== รับค่าจากลิงก์ เช่น ?from=SC4031&to=SC2050 (ใช้กับ QR Code ตามจุดต่าง ๆ) =====
const qs=new URLSearchParams(location.search);
if(qs.get("from"))$("from").value=qs.get("from");
if(qs.get("to"))$("to").value=qs.get("to");
go();