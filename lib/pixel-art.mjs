import {drawChef} from './chef-art.mjs';
import {drawStreet} from './street-scene.mjs';
// Original deterministic pixel assets. Every shape is drawn on a fixed 640×420 grid.
const GLYPHS={A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01110'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['11111','00100','00100','00100','00100','00100','11111'],J:['00111','00010','00010','00010','10010','10010','01100'],K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','11001','10101','10011','10011','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],W:['10001','10001','10001','10101','10101','10101','01010'],X:['10001','10001','01010','00100','01010','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],0:['01110','10011','10101','10101','11001','10001','01110'],1:['00100','01100','00100','00100','00100','00100','01110'],2:['01110','10001','00001','00010','00100','01000','11111'],3:['11110','00001','00001','01110','00001','00001','11110'],4:['00010','00110','01010','10010','11111','00010','00010'],5:['11111','10000','10000','11110','00001','00001','11110'],6:['01110','10000','10000','11110','10001','10001','01110'],7:['11111','00001','00010','00100','01000','01000','01000'],8:['01110','10001','10001','01110','10001','10001','01110'],9:['01110','10001','10001','01111','00001','00001','01110'],'.':['0','0','0','0','0','1','1'],'-':['0','0','0','111','0','0','0'],':':['0','1','1','0','1','1','0'],'/':['00001','00010','00100','00100','01000','10000','10000']};
export function pixelText(g,text,x,y,color='#f8f0e4',s=1){g.fillStyle=color;let cursor=Math.round(x);for(const c of text.toUpperCase()){const p=GLYPHS[c];if(p)p.forEach((r,iy)=>[...r].forEach((b,ix)=>{if(b==='1')g.fillRect(cursor+ix*s,Math.round(y)+iy*s,s,s);}));cursor+=6*s;}}
// World characters share a ground/foot anchor. Height is in native scene pixels,
// independent of the responsive camera and of the dialogue portrait size.
export function pixelPerson(g,x,y,{coat='#3d698d',boss=false,frame=0,scale=1,height,wave=false}={}){
 if(boss){const k=(height??scale*19)/128;drawChef(g,x-48*k,y-126*k,{scale:k,frame,pose:wave?'wave':'idle'});return;}
 scale=height?height/15:scale;
 const pattern=['   HHHHH   ','  HHHHHHH  ','  HTTTTTH  ','  TETTETT  ','   TTTTT   ','    TT     ','  CCCCCC   ',' CCCACCCC  ',' CCAAAACC  ',' TCAAAACT  ','  CAAAAC   ','  CCCCCC   ','   PP PP   ','   PP PP   ','  SSS SSS  '];
 const colors={H:boss?'#75634a':'#4b4547',T:'#d6b48f',E:'#283c45',C:boss?'#f5ebde':coat,A:boss?'#aa4d38':coat,P:'#394d61',S:'#293d48'};
 const bob=Math.floor(frame/12)%2;
 pattern.forEach((r,iy)=>[...r].forEach((c,ix)=>{if(colors[c]){g.fillStyle=colors[c];g.fillRect(Math.round(x)+(ix-5)*scale,Math.round(y)+(iy-15)*scale+(iy<12?bob:0),scale,scale);}}));
 if(boss&&wave){const lift=Math.floor(frame/6)%2;g.fillStyle='#fff3e2';g.fillRect(x+4*scale,y-(10+lift)*scale,3*scale,2*scale);g.fillStyle='#d6b48f';g.fillRect(x+6*scale,y-(12+lift)*scale,2*scale,3*scale);}
 if(boss){g.fillStyle='#b65343';g.fillRect(x-2*scale,y-10*scale,4*scale,2*scale);g.fillStyle='#faf3e9';g.fillRect(x-4*scale,y-17*scale,8*scale,2*scale);g.fillRect(x-3*scale,y-19*scale,6*scale,2*scale);}
}
const boardCache=new Map();
function boardTexture(board){if(boardCache.has(board.t))return boardCache.get(board.t);const c=document.createElement('canvas');c.width=72;c.height=72;const g=c.getContext('2d');g.fillStyle='#47372c';g.fillRect(0,0,72,72);pixelText(g,board.t,3,4,'#efe1cf');g.fillStyle='#9d7962';g.fillRect(3,14,66,1);board.names.forEach((name,i)=>{let x=4;const y=19+i*5.8;for(const ch of name.slice(0,16)){const glyph=GLYPHS[ch];if(glyph)[0,2,3,5,6].forEach((row,ry)=>[0,2,4].forEach((col,rx)=>{if(glyph[row][col]==='1'){g.fillStyle='#d3bca6';g.fillRect(x+rx,Math.round(y)+ry,1,1);}}));x+=4;}});boardCache.set(board.t,c);return c;}
export function drawCafe(g,{inside=false,avatar='blue',served=false,time=0,action='',mealProgress=0,dining=false}={}){
 const C={ink:'#354951',cream:'#efe1ce',wall:'#dbc8b6',tile:'#d8c3af',olive:'#bb9674',blue:'#244a75',lightBlue:'#65839b',wood:'#a68052',red:'#ad5544',white:'#f8eee1'};
 g.clearRect(0,0,640,420);g.imageSmoothingEnabled=false;
 const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(x0,y0,x1,y1,c)=>{g.fillStyle=c;x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let e=dx+dy;for(let n=0;n<2000;n++){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}};
 // Scanline rasterisation prevents smooth polygon edges: every edge is a real pixel step.
 const poly=(pts,c,stroke=null)=>{const ys=pts.map(p=>p[1]);g.fillStyle=c;for(let y=Math.ceil(Math.min(...ys));y<Math.max(...ys);y++){const xs=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)g.fillRect(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1);}if(stroke)pts.forEach((p,i)=>line(...p,...pts[(i+1)%pts.length],stroke));};
 const frame=Math.floor(time/100),steam=(x,y)=>{for(let i=0;i<3;i++){const dy=(frame*2+i*7)%22;const dx=Math.floor(Math.sin((dy+i)*.35)*2);r(x+i*4+dx,y-dy,2,3,'#f8f0e4');}};
 if(!inside)return drawStreet(g,{time,avatar},{text:pixelText,person:pixelPerson});
 const p=(x,z,y=0)=>[Math.round(284+(x-z)*25),Math.round(154+(x+z)*12.5-y*29)];
 const q=(coords,c,stroke)=>poly(coords.map(v=>p(...v)),c,stroke);
 const cube=(x,z,y,w,d,h,top,front,right)=>{
  q([[x,z,y+h],[x+w,z,y+h],[x+w,z+d,y+h],[x,z+d,y+h]],top,C.ink);
  q([[x,z+d,y],[x+w,z+d,y],[x+w,z+d,y+h],[x,z+d,y+h]],front,C.ink);
  q([[x+w,z,y],[x+w,z+d,y],[x+w,z+d,y+h],[x+w,z,y+h]],right,C.ink);
 };
 const wall=(face,u,y,w,h,c)=>face==='back'?q([[u,0,y],[u+w,0,y],[u+w,0,y+h],[u,0,y+h]],c):q([[0,u,y],[0,u+w,y],[0,u+w,y+h],[0,u,y+h]],c);
 const wt=(str,face,u,y,s=.034,c='#f2e7d8')=>{for(const ch of str){const glyph=GLYPHS[ch];if(glyph)glyph.forEach((row,iy)=>[...row].forEach((b,ix)=>{if(b==='1')wall(face,u+ix*s,y-iy*s,s*1.1,s*1.1,c);}));u+=s*6;}};
 const cup=(x,z,y)=>{const a=p(x,z,y);r(a[0]-3,a[1]-5,7,5,'#f7ecde');r(a[0]-2,a[1]-6,5,2,'#695139');r(a[0]+4,a[1]-4,2,3,'#f7ecde');r(a[0]-4,a[1],10,1,'#c8ab90');};
 const table=(x,z)=>{for(const dx of [0,1.6])for(const dz of [0,1]){const a=p(x+dx,z+dz,0),b=p(x+dx,z+dz,1.05);line(...a,...b,'#47372c');line(a[0]+1,a[1],b[0]+1,b[1],'#47372c');}cube(x-.08,z-.08,1.06,1.76,1.16,.11,'#d6c0ab','#bf9d7d','#9a7660');cup(x+.55,z+.5,1.28);};
 const chair=(x,z,back=true)=>{cube(x,z,.58,.7,.65,.08,'#c6a78b','#bb9674','#8e6d59');for(const dx of [0,.7])for(const dz of [0,.65]){const a=p(x+dx,z+dz,0),b=p(x+dx,z+dz,.6);line(...a,...b,'#4e3c31');}if(back){wall('back',0,0,0,0,'transparent');const a=p(x,z,1.26),b=p(x+.7,z,1.26),c=p(x+.7,z,.86),d=p(x,z,.86);poly([a,b,c,d],'#c5a68a',C.ink);for(const dx of [0,.7])line(...p(x+dx,z,.58),...p(x+dx,z,1.3),C.ink);}};
 q([[.1,.1,-.2],[11.5,.1,-.2],[11.5,8.5,-.2],[.1,8.5,-.2]],'#c2a183');
 cube(0,0,-.2,11,8,.22,'#d2baa3','#bc9876','#997660');
 for(let x=0;x<11;x++)for(let z=0;z<8;z++){q([[x,z,.04],[x+1,z,.04],[x+1,z+1,.04],[x,z+1,.04]],(x+z)%2?'#bd7b5c':'#f6e7cf');const a=p(x+.2,z+.3,.04);r(a[0],a[1],2,1,(x+z)%2?'#ca8c6b':'#e6ceb0');}
 // Two cutaway walls, glazed tiles, wood edging and electrical conduit.
 q([[0,0,0],[0,8,0],[0,8,4.5],[0,0,4.5]],'#f6e7cf');q([[0,0,0],[11,0,0],[11,0,4.5],[0,0,4.5]],'#edddc8');
 q([[0,0,4.5],[0,8,4.5],[.12,8,4.58],[.12,0,4.58]],'#c2a183');q([[0,0,4.5],[11,0,4.5],[11,0,4.6],[0,0,4.6]],'#c8ab90');
 for(let x=0;x<11;x++){wall('back',x,.1,.98,1.78,x%2?'#d9c5b2':'#ddcbba');for(let y=.1;y<1.8;y+=.42)line(...p(x,0,y),...p(x+1,0,y),'#ccb097');}wall('back',0,1.9,11,.07,'#ba9573');
 const boards=[{x:.3,t:'PANINI',names:['ITALIA','CAMPAGNOLO','COTOLETTA','PESCATORE','PICCANTE','BONDOLA','BARESE','PUGLIA','VENEZIANO']},{x:3.45,t:'HOT FOOD',names:['LASAGNE','PASTA DEL GIORNO','PARMIGIANA','ARANCINI','LARGE SALADS','BASIC ROLLS','DOLCI']},{x:6.62,t:'BREAKFASTS',names:['SCRAMBLED EGGS','ITALIAN BREAKFAST','VEGETARIAN','HOT DRINKS','ESPRESSO','CAPPUCCINO','TEA']}];
 boards.forEach(b=>{wall('back',b.x,2.05,2.95,2.2,'#826d47');const a=p(b.x+.08,0,4.16),right=p(b.x+2.87,0,4.16),bottom=p(b.x+.08,0,2.12);g.save();g.setTransform((right[0]-a[0])/72,(right[1]-a[1])/72,0,(bottom[1]-a[1])/72,a[0],a[1]);g.imageSmoothingEnabled=false;g.drawImage(boardTexture(b),0,0);g.restore();});
 // Football screens with tiny moving players and white pitch lines.
 const television=(face,u,y,w,h)=>{wall(face,u,y,w,h,'#334950');wall(face,u+.07,y+.07,w-.14,h-.14,'#689361');for(let i=0;i<4;i++)wall(face,u+.13+i*(w-.26)/4,y+.13,(w-.26)/8,h-.26,'#719d68');wall(face,u+w/2,y+.13,.024,h-.26,'#d9c4b1');for(let i=0;i<5;i++)wall(face,u+.2+(i*.31+(frame%16)*.012)%(w-.4),y+.2+(i*.19)%(h-.4),.055,.09,i%2?'#ebdac3':'#315c82');wall(face,u+.18,y+h-.2,.35,.05,'#ebdac3');};
 television('back',9.9,3,1.02,.9);television('left',1,3.3,1.25,.9);
 // Jerseys, collars, stripes and scarves. Generic graphics, no invented club marks.
 const shirt=(face,u,y,c,stripes=false)=>{wall(face,u,y,.63,.88,c);wall(face,u-.17,y+.55,.19,.33,c);wall(face,u+.61,y+.55,.19,.33,c);wall(face,u+.21,y+.77,.2,.08,'#e9dcca');if(stripes)for(let i=0;i<3;i++)wall(face,u+.1+i*.19,y+.03,.065,.69,'#efe1cf');wall(face,u+.17,y+.36,.32,.055,'#efe2d0');};
 [2.7,3.8,4.9,6].forEach((u,i)=>shirt('left',u,3.25,['#33728e','#c3a385','#324e76','#b35943'][i],i%2===1));
 for(let i=0;i<3;i++)shirt('back',1.3+i*2.7,4.18,['#4a849e','#d5b968','#56859e'][i],i===0);
 wall('left',6.9,2.77,.22,1.5,'#345b7b');wall('left',7.2,2.77,.19,1.5,'#ebdac4');wt('UNO','left',7.23,3.6,.025,'#355575');
 const clock=p(0,5.85,3.57);r(clock[0]-6,clock[1]-9,13,16,'#304a63');r(clock[0]-4,clock[1]-7,9,12,'#f1e7d9');line(clock[0],clock[1]-5,clock[0],clock[1]+1,'#40525b');line(clock[0],clock[1],clock[0]+3,clock[1]+2,'#40525b');
 // An adult is about twice a folding chair's height. Paint the host before
 // service furniture so the till/counter occlude him, rather than floating over it.
 const boss=p(8.9,1.15,0);
 poly([[boss[0]-14,boss[1]-2],[boss[0]+5,boss[1]-6],[boss[0]+20,boss[1]+1],[boss[0]+1,boss[1]+5]],'#69544033');
 pixelPerson(g,...boss,{boss:true,frame,height:76});
 // Long blue food display, steel rims, cold ingredient trays and stacks of plates.
 cube(.55,1.6,0,7.75,1.2,1.15,'#d7c2ae','#234d77','#1e3e65');
 q([[.55,2.81,.16],[8.3,2.81,.16],[8.3,2.81,.23],[.55,2.81,.23]],'#ceb49b');q([[.55,2.81,.91],[8.3,2.81,.91],[8.3,2.81,1.03],[.55,2.81,1.03]],'#ede0ce');
 for(let i=0;i<7;i++){const x=.65+i*.72;cube(x,1.73,1.18,.62,.85,.06,'#ebd9c2','#c7a98d','#9a7761');q([[x+.06,1.8,1.25],[x+.55,1.8,1.25],[x+.55,2.48,1.25],[x+.06,2.48,1.25]],['#b86d58','#9ca85f','#d4b676','#c3a385','#c5a885','#8eaa76','#b87e5f'][i]);for(let j=0;j<5;j++){const a=p(x+.12+(j%2)*.23,1.88+j*.12,1.28);r(a[0],a[1],3,2,['#d39173','#bac181','#ecd3b0','#d6c0ab','#e2bd8d','#a8bd80','#d89673'][i]);}}
 q([[.5,2.83,1.24],[5.85,2.83,1.24],[5.85,2.83,2.0],[.5,2.83,2]],'rgba(185,212,195,.16)','#d0b8a0');q([[.5,1.58,2],[5.85,1.58,2],[5.85,2.83,2],[.5,2.83,2]],'rgba(218,228,204,.10)','#d0b8a0');
 for(const x of [.5,3.17,5.85])line(...p(x,2.83,1.2),...p(x,2.83,2),'#deccbb');line(...p(.5,2.83,2),...p(5.85,2.83,2),'#f3e8da');
 // Coffee equipment: dark machine, portafilters, cup rail and grinder hopper.
 cube(6,1.72,1.19,1.54,.82,.76,'#c6a88c','#4a392e','#3c2e25');cube(6.02,2.5,1.25,1.5,.25,.09,'#d7c2ae','#c2a183','#8f6e5a');
 for(const x of [6.25,6.95]){cup(x,2.63,1.45);const a=p(x,2.56,1.83);r(a[0]-1,a[1],3,6,'#d9c5b2');r(a[0]-2,a[1]+5,7,2,'#293f46');}for(let i=0;i<5;i++)cup(6.15+i*.25,1.97,2.12);
 cube(7.78,1.81,1.2,.5,.56,.44,'#d6c0ab','#c6a88c','#8b6b57');cube(7.76,1.8,1.68,.53,.55,.44,'#4e3c31','#69573b','#4d3b30');cube(7.71,1.76,2.13,.62,.63,.06,'#4c3b30','#4c3b30','#273e43');
 const coffeePoint=p(6.6,2.48,2.25);steam(coffeePoint[0],coffeePoint[1]);
 // Glass-fronted drinks fridge with separately drawn bottles, shelves and handle.
 cube(9.7,.2,0,1.05,.75,2.77,'#eedecb','#efe0ce','#ceb49c');q([[9.79,.96,.3],[10.66,.96,.3],[10.66,.96,2.53],[9.79,.96,2.53]],'#775c4b');
 for(let row=0;row<5;row++){for(let j=0;j<4;j++){const a=p(9.88+j*.19,.98,.45+row*.4);r(a[0],a[1]-7,3,8,['#bb9775','#ba8354','#d4c27c','#87aa73'][j]);r(a[0]+1,a[1]-9,1,2,'#ead8c0');}line(...p(9.8,.98,.33+row*.4),...p(10.65,.98,.33+row*.4),'#d1b9a2');}line(...p(10.6,.99,.9),...p(10.6,.99,1.65),'#f1e4d4');
 // Snack packets on wall shelf, tills, little price-card holders and condiment bottles.
 cube(.03,4.95,1.56,.4,2.25,.09,'#b39665','#917d55','#765a4a');for(let i=0;i<8;i++){cube(.08,5.01+i*.27,1.65,.22,.2,.39,['#c3a461','#b25f48','#dac7b4','#446e89'][i%4],'#a98e58','#8f6e59');}
 cube(8.58,1.98,.88,.65,.6,.31,'#d0b7a0','#896955','#6c5344');cube(8.6,2,1.22,.57,.38,.35,'#d4bea8','#6a5243','#cfb69e');const cash=p(8.83,2.4,1.45);r(cash[0]-4,cash[1]-3,8,5,'#846552');
 for(let i=0;i<3;i++)cube(8.64+i*.19,1.62,1.12,.12,.12,.35,'#caae94',['#957345','#967d4c','#a35643'][i],'#705746');
 // Square tables and the café's slender folding chairs.
 chair(3.55,4.22);chair(4.58,6.57);table(3.3,5.05);chair(7.35,4.18);chair(8.45,6.55);table(7.1,5.02);
 if(served){const a=p(4.15,5.6,1.29);r(a[0]-13,a[1]+2,28,7,'#eddfcc');r(a[0]-11,a[1]+7,24,2,'#c09f80');const bite=dining?Math.min(3,Math.floor(mealProgress*4)):0;if(bite<3){const w=18-bite*5;r(a[0]-8,a[1]-5,w,3,'#b7874c');r(a[0]-9,a[1]+1,w+2,2,'#788c4e');r(a[0]-8,a[1]+4,w,2,'#e4c082');}else{r(a[0]-4,a[1]+3,2,1,'#bd9a63');r(a[0]+4,a[1]+4,2,1,'#bd9a63');}if(dining){r(a[0]+16,a[1]-5,6,8,'#f3e6d4');r(a[0]+22,a[1]-3,2,4,'#d5bfaa');r(a[0]+17,a[1]-6,4,2,'#66513e');r(a[0]+17,a[1]-12-frame%4,1,3,'#d2baa4');}}
 // Italian flag bunting and warm string-light cable, drawn last as an overhead layer.
 line(...p(.2,2.25,4.6),...p(8.8,.65,4.6),'#7e614f');for(let i=0;i<4;i++){const x=.5+i*2.2,z=2.2-i*.35;for(let j=0;j<3;j++)q([[x+j*.18,z,3.65],[x+(j+1)*.18,z,3.65],[x+(j+1)*.18,z,4.48],[x+j*.18,z,4.48]],['#377a59','#efe3d3','#b75243'][j]);const a=p(x+.8,z,4.57);r(a[0],a[1],2,3,frame%28<14?'#efcd73':'#d5b46a');}
 // Neighbourhood board is an explicitly fictional game prop.
 wall('left',7.25,1.31,.64,.74,'#8f7b56');wall('left',7.31,1.39,.52,.57,'#dbc7b5');const map=p(0,7.5,1.72);r(map[0]-1,map[1]-1,3,3,'#b56547');
 const anchors={menu:p(4.85,0,3.15),football:p(0,4.25,3.4),coffee:p(7.2,2.85,2.15),map:p(0,7.5,1.92),boss:[boss[0]+40,boss[1]-20]};
 if(action){const at=anchors[action]||anchors.boss;for(let i=0;i<3;i++){const a=(frame+i*5)%18;r(at[0]-10+i*8,at[1]-a-5,2,2,'#d5a448');}}
 return anchors;
}
