// Original café camera artwork on a 640 × 420 integer grid.
// References inform light/material craft only; all sprites, objects and motion are original.
import {pixelText} from './pixel-art.mjs';
import {pixelPainter} from './pixel-kit.mjs';
import {drawChef} from './chef-art.mjs';
export function drawVisitVignette(g,{view='counter',time=0,progress=0,reaction=false}={}) {
 g.clearRect(0,0,640,420);g.imageSmoothingEnabled=false;
 const {r,line,poly,oval,grain,wood,steam}=pixelPainter(g),frame=Math.floor(time/120);
 const C={edge:'#514239',paper:'#fff0d4',cream:'#f4dfbc',blue:'#345c7e',shadow:'#243c50',tomato:'#ab4e3a',basil:'#4c7252'};
 // Warm plaster has broad quiet areas as well as small, intentionally clustered marks.
 r(0,0,640,420,'#e8cba3');r(0,0,640,9,'#a97953');r(0,9,640,4,'#f4dfb9');
 grain(4,16,632,271,340,['#ddbd93','#efd4ac','#e3c29a'],29);
 r(0,194,640,112,'#bf9b76');
 for(let y=197,row=0;y<306;y+=25,row++)for(let x=-(row%2)*20;x<640;x+=42){
  r(x+1,y+1,40,23,(row+Math.floor(x/42))%3===0?'#e1c7a1':'#ead5b1');r(x+3,y+3,36,1,'#f9e8c9');r(x+3,y+4,1,16,'#f4e0bd');r(x+2,y+22,38,1,'#c6a985');
 }
 wood(0,304,640,116);
 const flag=(x,y,w=24,h=34)=>{poly([[x,y],[x+w,y+1],[x+w-2,y+h],[x+1,y+h-2]],'#614c39');for(let i=0;i<3;i++){r(x+1+i*(w-2)/3,y+1,(w-2)/3,h-3,['#42694e','#ffedcd','#b95842'][i]);r(x+2+i*(w-2)/3,y+3,2,h-7,['#638961','#fff5dc','#d47958'][i]);}r(x,y,w,2,'#ddba89');};
 const pot=(x,y,s=1)=>{
  oval(x-16*s,y+9*s,36*s,6*s,'#76563b');r(x-12*s,y-6*s,27*s,6*s,'#d78253');poly([[x-10*s,y],[x+13*s,y],[x+9*s,y+18*s],[x-6*s,y+18*s]],'#aa5439');r(x-7*s,y+2*s,4*s,12*s,'#d77d4e');r(x+9*s,y+2*s,2*s,10*s,'#8d4633');
  r(x,y-36*s,2*s,30*s,'#456249');for(const [dx,dy,dir]of [[-9,-26,-1],[5,-32,1],[-11,-42,-1],[3,-49,1],[-4,-56,1],[7,-18,1]]){poly([[x,y+dy*s+8*s],[x+dx*s,y+dy*s],[x+(dx+dir*9)*s,y+(dy-1)*s],[x+(dx+dir*6)*s,y+(dy+6)*s]],'#4b7350');line(x+dx*s,y+dy*s+2*s,x,y+dy*s+8*s,'#86a166');}
 };
 const window=(x,y,w,h)=>{
  r(x-7,y-7,w+14,h+17,'#8e654a');wood(x-4,y-4,w+8,5);r(x,y,w,h,'#294955');r(x+6,y+6,w-12,h-12,'#bad2ce');
  r(x+6,y+6,w-12,Math.floor(h*.39),'#d7e1d6');r(x+6,y+32,w-12,4,'#f4ead2');
  for(let i=0;i<5;i++){const bx=x+7+i*(w-14)/5,bh=40+(i*17)%35,by=y+h-7-bh;r(bx,by,30,bh,['#c0a58b','#cbb79a','#9e9e8d','#d8b79a','#b6aa91'][i]);r(bx-2,by,34,3,'#8e806b');for(let row=0;row<4;row++)for(let j=0;j<3;j++){r(bx+4+j*8,by+7+row*14,4,7,'#738e92');r(bx+4+j*8,by+7+row*14,1,7,'#e5d2ac');}}
  r(x+w/2-3,y,6,h,'#526e73');r(x+w/2-2,y,2,h,'#8c9f98');r(x,y+Math.floor(h*.37),w,5,'#5a777c');
  r(x-10,y+h,w+20,7,'#d3b38b');r(x-8,y+h+7,w+16,3,'#8c654a');r(x-8,y+h,w+16,1,'#f5dfb8');
  // Broken reflections, not a single flat opaque window rectangle.
  poly([[x+9,y+8],[x+15,y+8],[x+51,y+h-9],[x+45,y+h-9]],'#f9edd12f');line(x+13,y+15,x+36,y+71,'#eaf0db');line(x+w-21,y+11,x+w-37,y+46,'#eaf0db');
 };
 const cup=(x,y,s=1,foam=true)=>{
  oval(x-5*s,y+12*s,42*s,9*s,'#9c8165');oval(x-5*s,y+10*s,42*s,8*s,'#e4d4b8');oval(x-3*s,y+10*s,36*s,5*s,'#fff0d2');
  r(x+26*s,y-8*s,9*s,14*s,'#e3d2b4');r(x+29*s,y-5*s,3*s,7*s,'#86745f');
  poly([[x,y-11*s],[x+27*s,y-11*s],[x+24*s,y+12*s],[x+5*s,y+12*s]],'#d4c2a8');r(x+3*s,y-8*s,17*s,17*s,'#fff0d5');r(x+5*s,y-8*s,3*s,15*s,'#fff8e5');r(x+22*s,y-7*s,2*s,15*s,'#b49b7e');
  oval(x,y-15*s,28*s,8*s,'#fff1d6');oval(x+3*s,y-13*s,22*s,5*s,'#79523a');if(foam){oval(x+7*s,y-12*s,14*s,4*s,'#ceab72');r(x+11*s,y-12*s,5*s,2*s,'#f4ddb0');r(x+13*s,y-10*s,2*s,2*s,'#f4ddb0');}
 };
 const bread=(x,y,w=53)=>{
  oval(x-2,y+16,w+5,7,'#836548');r(x+3,y+9,w-5,12,'#bf8646');poly([[x,y+9],[x+6,y+2],[x+w-8,y],[x+w,y+6],[x+w-2,y+13],[x+3,y+14]],'#d7a058');r(x+7,y+3,w-18,2,'#efc77f');r(x+3,y+14,w-4,3,'#5e7c44');
  for(let i=0;i<5;i++){r(x+4+i*(w-9)/5,y+13+(i%2),7,3,'#87a45d');r(x+7+i*(w-14)/5,y+17,5,2,'#b85b42');}r(x+4,y+20,w-9,3,'#d7ad6a');r(x+7,y+21,w-15,1,'#f1ce8d');
  for(let i=0;i<4;i++){const xx=x+10+i*(w-20)/4;line(xx,y+4,xx+4,y+9,'#a7733e');line(xx+1,y+4,xx+5,y+9,'#f3d497');}grain(x+7,y+5,w-15,6,13,['#f2d397','#e8bb74'],13);
 };
 const pendant=(x,y)=>{r(x,0,2,y,'#64503d');poly([[x-19,y+8],[x-12,y-1],[x+14,y-1],[x+21,y+8]],'#975238');r(x-17,y+8,36,3,'#d78b51');r(x-12,y+11,26,3,'#ffe6a7');r(x-7,y+14,16,2,'#fff2ca');poly([[x-13,y+16],[x+14,y+16],[x+76,y+164],[x-74,y+164]],'#ffe9b00b');};
 if(view==='counter') {
  // Café daylight and layered shadows give the room depth without a gloomy cast.
  window(32,41,169,141);poly([[39,190],[174,190],[323,300],[132,300]],'#ffe6ad20');
  wood(21,213,197,8);r(22,222,195,3,'#876147');
  for(let i=0;i<5;i++){r(35+i*29,191,17,21,['#6d7c54','#9e6548','#bf975b','#71805c','#c7ab72'][i]);r(35+i*29,187,17,4,'#66533f');r(37+i*29,195,3,10,'#e5cf955c');r(38+i*29,202,11,5,'#eddbb4');}
  pot(189,196,.43);
  // A rail, cloth folds and generic jerseys echo the team's café photos.
  line(238,24,398,24,'#624a37');r(239,25,158,1,'#ead2ab');
  [250,304,358].forEach((x,i)=>{line(x+13,23,x+13,31,'#8a6a4f');poly([[x-7,36],[x+6,29],[x+19,29],[x+33,36],[x+29,49],[x+23,45],[x+23,88],[x+1,88],[x+1,45],[x-3,49]],'#3c4c55');poly([[x-5,36],[x+6,31],[x+19,31],[x+31,36],[x+27,46],[x+21,42],[x+21,86],[x+3,86],[x+3,42],[x-1,46]],['#41728c','#b1c6c6','#354d76'][i]);r(x+5,44,3,38,['#578aa0','#d5e1d6','#486487'][i]);r(x+17,44,2,40,'#2f4e6980');r(x+8,32,9,4,C.paper);r(x+8,58,10,3,'#eee1c0');r(x+8,63,10,1,'#d5d9c1');});
  wood(427,32,181,129);r(431,36,173,121,'#3d3c32');r(435,40,165,113,'#333d35');grain(436,41,163,111,85,['#3a443a','#45483b'],27);
  pixelText(g,'PANINI E CAFFE',444,47,'#f1dfbb');line(443,59,591,59,'#9c9d7b');
  ['ITALIA','COTOLETTA','PICCANTE','PASTA DEL GIORNO','ESPRESSO','CAPPUCCINO'].forEach((name,i)=>{pixelText(g,name,444,68+i*12,i>3?'#d6c8a6':'#e7ddc2');r(568,73+i*12,21,1,'#beb69a');});
  pendant(224,31);pendant(616,44);line(15,16,621,22,'#7a624b');for(let i=0;i<4;i++)flag(89+i*117,17,18,27+(i%2)*4);
  // Original higher-resolution host, with blinking eyes and a serving gesture.
  drawChef(g,253,136,{scale:1.45,frame,pose:reaction?'present':'idle'});
  // Espresso machine: enamel, chrome bands, pressure gauge, switches and cup rail.
  r(451,197,130,83,'#263c45');r(454,201,124,70,'#344c54');r(455,202,122,6,'#96a9a9');r(457,204,116,1,'#e1e1c9');r(458,213,115,23,'#526c72');r(459,214,110,3,'#70888a');r(458,236,116,7,'#172c36');
  oval(462,217,15,14,'#d4d8c6');oval(464,219,11,10,'#f4ead0');line(469,224,472,220,'#aa5b3f');
  for(let i=0;i<5;i++){r(489+i*15,219,6,4,'#a7b8af');r(490+i*15,219,3,1,'#eff0d3');r(489+i*15,228,5,3,i%2?'#d2a357':'#ad684e');}
  r(453,271,129,5,'#a0b4b1');r(455,272,125,1,'#e1e9d7');for(let i=0;i<17;i++)r(459+i*7,266,3,3,'#7b9191');
  for(let i=0;i<4;i++){cup(463+i*28,194,.48,false);}cup(470,259,.58);cup(535,259,.58);steam(477,244,frame);steam(541,244,frame+8);
  r(590,205,25,67,'#6c756c');r(593,208,6,58,'#adb9a9');r(594,245,16,6,'#263c44');r(596,249,4,15,'#9cab9f');r(588,181,29,23,'#8d6d49');r(591,184,21,16,'#4e4132');grain(592,184,19,15,38,['#7a5738','#a98050'],41);r(585,177,35,5,'#394c50');r(587,178,31,1,'#a0b3aa');
  // Countertop and deep-blue front with tiled flutes, contact shadows and trim.
  poly([[16,288],[553,288],[632,320],[73,320]],'#ccbfa5');poly([[16,288],[73,320],[73,411],[16,378]],'#253f57');poly([[73,320],[632,320],[632,411],[73,411]],'#284b6c');r(75,322,555,7,'#3c6587');r(75,333,555,4,'#e3d9be');r(75,337,555,2,'#9d9e8d');
  for(let x=82;x<632;x+=25){r(x,345,21,54,'#2e5373');r(x+2,345,2,54,'#436c87');r(x+21,345,2,54,'#213f5a');r(x+4,346,14,1,'#64849a');}r(74,402,558,6,'#1c3449');r(74,408,558,2,'#a7b7aa');
  // Display trays and distinct foods, clustered pixels instead of identical dots.
  for(let i=0;i<5;i++){const x=78+i*88;poly([[x,281],[x+73,281],[x+82,302],[x+6,302]],'#a9b8ac');poly([[x+3,283],[x+70,283],[x+77,299],[x+8,299]],'#dde0c7');}
  bread(85,273,58);bread(175,272,52);
  for(let i=0;i<8;i++){const x=268+(i%4)*14,y=280+Math.floor(i/4)*9;oval(x,y,13,9,['#ae4e36','#c46a44','#e18b55'][i%3]);r(x+4,y+1,3,2,'#f4ba77');r(x+5,y,2,1,'#537451');}
  for(let i=0;i<14;i++){const x=357+(i%5)*12,y=278+Math.floor(i/5)*7;poly([[x,y+4],[x+3,y],[x+8,y+1],[x+11,y+6],[x+6,y+9]],['#65814c','#87a05d','#a8b875'][i%3]);r(x+3,y+3,5,1,'#b8c783');}
  for(let i=0;i<5;i++){const x=443+i*9;poly([[x,279],[x+6,277],[x+12,285],[x+8,296],[x+2,295]],'#c68b76');r(x+3,281,3,10,'#e0b6a0');r(x+4,286,3,1,'#efcdb4');}
  // Glass has a cool transparent body, thin double edges and broken specular streaks.
  poly([[48,243],[504,243],[561,275],[76,275]],'#d4e0cf1c');poly([[76,275],[561,275],[561,317],[76,317]],'#b5d4cf19');line(48,243,504,243,'#dfe8d6');line(48,245,503,245,'#8da9a7');line(48,243,76,317,'#85a0a0');line(504,243,561,317,'#8fa8a5');line(288,243,316,317,'#adbfaf');line(76,317,561,317,'#e3ead7');line(78,314,559,314,'#8fa99f');
  poly([[96,246],[107,246],[134,307],[128,307]],'#fff0d330');poly([[375,246],[380,246],[403,299],[399,299]],'#fff0d340');
  const tx=104+(reaction?Math.floor(frame/3)%2*3:0);r(tx,345,32,23,'#1b334b55');r(tx-1,342,31,23,'#fff0d0');r(tx+3,346,21,2,'#a77a50');r(tx+3,352,18,1,'#b3a07a');r(tx+3,356,23,1,'#b3a07a');
  for(let i=0;i<7;i++){const px=48+(i*29+frame)%135,py=126+(i*17)%62;r(px,py,1,1,'#fff3cf');}
  return {};
 }
 // The dining camera retains the wireframe's window/table left, board right.
 window(30,30,203,149);poly([[42,190],[215,190],[369,405],[142,405]],'#ffe6ad20');
 r(0,242,640,4,'#8f694d');r(0,246,640,2,'#f1d8ae');
 // Floor tiles recede toward the wall, with darker grout and quiet grain.
 r(0,290,640,130,'#c69a76');for(let row=0;row<6;row++)for(let col=-2;col<17;col++){const x=col*47+row*9,y=290+row*23;poly([[x,y],[x+45,y],[x+54,y+22],[x+9,y+22]],(row+col)%2?'#bd7e5d':'#e5c39b');line(x+1,y+1,x+43,y+1,'#f1d2a8');}
 poly([[61,281],[238,281],[337,420],[135,420]],'#735b4433');
 wood(22,192,222,7);r(25,200,215,4,'#916245');pot(246,221,.65);
 // Burgundy upholstery and the window bench: stitched leather, not one flat rectangle.
 r(65,217,151,21,'#874a3b');r(69,220,143,15,'#a65d45');r(70,220,140,2,'#c67c57');for(let x=80;x<210;x+=24){r(x,224,1,8,'#783c34');r(x+2,224,1,8,'#c17c56');}r(72,237,5,69,'#614f42');r(207,237,5,69,'#614f42');r(78,260,128,4,'#8f6d4e');
 pendant(286,30);pendant(615,48);
 // Cork frame, pins and layered paper edges make the noticeboard a tangible object.
 r(338,52,259,192,'#624c3b35');wood(333,47,262,195);r(338,52,252,185,'#a28253');r(342,56,244,177,'#bb9b65');grain(343,57,242,175,850,['#a88a59','#d2b47b','#b79865'],81);r(335,48,258,2,'#e5c594');r(335,49,2,190,'#cfac78');r(592,50,2,190,'#7d5b3e');
 r(356,72,100,139,'#7e63423d');r(353,68,100,139,'#fff1d4');r(358,73,90,124,'#97bec6');grain(360,74,86,121,60,['#a3c7cc','#89b2bd'],57);
 poly([[387,85],[402,87],[402,106],[413,119],[410,133],[423,143],[419,153],[406,149],[397,136],[386,127],[383,108]],'#b29972');poly([[386,84],[401,86],[401,105],[412,118],[409,132],[422,142],[418,152],[405,148],[396,135],[385,126],[382,107]],'#f3dfb4');poly([[412,153],[426,159],[419,164],[405,160]],'#e7cda2');r(368,183,65,2,'#6b8f96');r(375,190,51,1,'#6b8f96');flag(392,60,18,21);oval(398,65,4,4,'#e8b777');r(399,65,1,1,'#fff0c7');
 [[468,70,'shop'],[523,70,'cup'],[468,139,'football'],[523,139,'street']].forEach(([x,y,type],i)=>{
  r(x+2,y+3,48,58,'#70523839');r(x,y,47,58,'#f9e9c9');r(x+4,y+4,39,40,['#b8cabf','#bfa47c','#839c6c','#c9b28e'][i]);r(x+18,y-3,11,6,'#e0c48b99');r(x+19,y-1,8,2,'#f4dcaa');
  if(type==='shop'){r(x+7,y+10,33,8,'#f8e8c7');r(x+6,y+19,35,6,C.blue);r(x+10,y+26,13,14,'#85b1b4');r(x+26,y+26,11,14,'#354b5b');r(x+11,y+27,1,10,'#e0e5cd');}
  else if(type==='cup')cup(x+11,y+28,.7);
  else if(type==='football'){r(x+6,y+7,35,32,'#668d60');line(x+22,y+9,x+22,y+37,'#d9dfb9');r(x+9,y+22,3,3,'#e8e7ca');r(x+31,y+15,3,3,C.blue);r(x+22,y+25,2,2,'#fff0d1');}
  else{r(x+9,y+11,11,25,'#c78c6b');r(x+25,y+9,13,28,'#9ba49b');for(let n=0;n<3;n++){r(x+11,y+15+n*7,4,4,'#e9dcbb');r(x+28,y+13+n*7,4,4,'#e9dcbb');}}
  r(x+8,y+49,31,1,'#b39b74');r(x+13,y+53,21,1,'#c9b18a');
 });
 pixelText(g,'NOTICEBOARD',375,218,'#6b513b');
 // Hardwood table with a small red/ivory cloth, weight, folds and a proper plate.
 poly([[27,278],[265,266],[324,333],[73,351]],'#805b3e');poly([[29,276],[264,264],[322,330],[74,348]],'#c39460');for(let i=0;i<9;i++)line(36+i*27,277-i,82+i*26,345-i*2,'#a8794d');poly([[74,348],[322,330],[322,342],[74,361]],'#8e6143');line(76,350,320,332,'#ddb17a');
 for(const [x,y]of [[62,319],[99,350],[291,337]]){r(x,y,5,69,'#3c4b4d');r(x+1,y+1,1,65,'#89968a');r(x+5,y+5,2,63,'#665f50');}
 const cp=(u,v)=>[60+185*u+41*v,287-9*u+56*v-6*u*v];for(let row=0;row<6;row++)for(let col=0;col<10;col++)poly([cp(col/10,row/6),cp((col+1)/10,row/6),cp((col+1)/10,(row+1)/6),cp(col/10,(row+1)/6)],(row+col)%2?'#ad5946':'#efdbc0');
 poly([[101,343],[286,328],[287,336],[102,352]],'#a54e3c');line(103,345,284,330,'#d79570');r(118,344,2,7,'#edc9a3');r(249,334,2,6,'#edc9a3');
 oval(112,293,126,35,'#9c8160');oval(112,289,126,34,'#d8c9ae');oval(115,289,120,29,'#fff0d5');oval(124,292,100,23,'#e6d9b9');oval(128,293,92,20,'#f7e6c6');
 const bite=Math.min(3,Math.floor(progress*4));if(bite<3)bread(134,280,77-bite*21);else{r(158,305,3,2,'#b48b4f');r(188,302,4,2,'#d1a96b');r(203,309,2,1,'#bd9354');}
 cup(254,289,.95);steam(264,267,frame);
 // A folded napkin, fork, salt cellar and olive-oil bottle sit within the scene.
 poly([[75,293],[98,290],[111,311],[89,315]],'#f8e8ca');line(78,294,91,312,'#c5b18d');line(84,295,97,311,'#e0c9a5');line(101,287,120,310,'#88978f');line(103,286,120,307,'#d7ddc6');for(let i=0;i<3;i++)line(99+i*3,282,105+i*2,290,'#a5b5a8');
 r(304,251,10,26,'#405d43');r(306,253,3,20,'#87996b');r(306,244,5,8,'#4b5d3f');r(306,241,5,4,'#a78c54');r(303,262,12,8,'#ead8ae');r(306,265,5,1,'#9b7549');
 return {board:[333,47,262,195]};
}
