import {pixelPainter} from './pixel-kit.mjs';
// Original 640 × 420 pixel street. Blue shopfront follows the supplied photos;
// neighbouring architecture, pavement props and welcoming host are game scenery.
export function drawStreet(g, {time = 0}, {text, person}) {
  const frame = Math.floor(time / 120);
  const detail=pixelPainter(g);
  const r = (x,y,w,h,c) => {g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const line = (x,y,a,b,c) => {
    x=Math.round(x);y=Math.round(y);a=Math.round(a);b=Math.round(b);
    const dx=Math.abs(a-x),dy=-Math.abs(b-y),sx=x<a?1:-1,sy=y<b?1:-1;let err=dx+dy;
    for(let n=0;n<1500;n++){r(x,y,1,1,c);if(x===a&&y===b)break;const e=2*err;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}}
  };
  const poly = (pts,c) => {
    for(let y=Math.ceil(Math.min(...pts.map(p=>p[1])));y<Math.max(...pts.map(p=>p[1]));y++){
      const xs=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){
        const a=pts[i],b=pts[j];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));
      }xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)r(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,c);
    }
  };
  const ring=(x,y,radius,c)=>{let a=radius,b=0,err=0;while(a>=b){for(const [dx,dy]of [[a,b],[b,a],[-b,a],[-a,b],[-a,-b],[-b,-a],[b,-a],[a,-b]])r(x+dx,y+dy,1,1,c);b++;if(err<=0)err+=2*b+1;if(err>0){a--;err-=2*a+1;}}};
  const brick=(x,y,w,h,tones)=>{
    r(x,y,w,h,tones[0]);
    for(let yy=y+3,row=0;yy<y+h;yy+=9,row++)for(let xx=x-(row%2)*16;xx<x+w;xx+=33){
      const a=Math.max(x,xx),end=Math.min(x+w,xx+30),tone=(row+Math.floor(xx/33)+30)%tones.length;
      r(a,yy,end-a,7,tones[tone]);r(a+1,yy,Math.max(0,end-a-2),1,tones[(tone+2)%tones.length]);
      if(end-a>5){r(end-2,yy+5,2,1,'#77574324');detail.grain(a+1,yy+1,end-a-2,5,5,[tones[(tone+1)%tones.length],tones[(tone+3)%tones.length]],row*173+Math.floor(a)*11);}
    }
  };
  const sash=(x,y,w=47,h=65)=>{
    r(x-4,y-4,w+8,h+8,'#9c7c65');r(x-2,y-2,w+4,h+4,'#f7ead5');r(x+3,y+3,w-6,h-6,'#527586');
    r(x+5,y+5,w/2-8,h-10,'#a5c5cb');r(x+w/2+2,y+5,w/2-8,h-10,'#d4e1df');
    r(x+w/2-2,y+2,3,h-4,'#f9f2e5');r(x+2,y+h*.48,w-4,3,'#f9f2e5');
    r(x-7,y+h+3,w+14,5,'#d7b99b');r(x-5,y-9,w+10,5,'#efdbc0');
    line(x+6,y+8,x+15,y+28,'#e7eeeb');
    r(x+3,y+3,w-6,2,'#344c53');r(x+3,y+5,2,h-8,'#47616c');r(x+w-5,y+5,2,h-8,'#76918f');
    r(x+6,y+6,3,h-13,'#e6e1cb44');r(x+w-14,y+8,5,h-17,'#e8e4ca2b');
    r(x-5,y+h+6,w+10,1,'#8e6c53');

  };
  const planter=(x,y,s=1)=>{
    r(x-12*s,y-13*s,24*s,4*s,'#c96a48');r(x-10*s,y-9*s,20*s,17*s,'#ad573e');r(x-7*s,y-8*s,14*s,2*s,'#dd8e62');
    r(x-1*s,y-40*s,2*s,27*s,'#395b43');
    [[-8,-35,10,5],[1,-41,10,5],[-10,-27,10,5],[1,-24,11,5],[-5,-44,7,6]].forEach(a=>r(x+a[0]*s,y+a[1]*s,a[2]*s,a[3]*s,'#4e7955'));
    r(x-7*s,y-35*s,4*s,2*s,'#8fa665');r(x+4*s,y-41*s,4*s,2*s,'#a9b671');
    for(let j=0;j<7;j++){const dx=(j%3-1)*7*s,dy=(-21-Math.floor(j/3)*8)*s;poly([[x+dx,y+dy],[x+dx-5*s,y+dy-4*s],[x+dx-8*s,y+dy-1*s],[x+dx-3*s,y+dy+3*s]],j%2?'#42674c':'#75915b');}
    r(x-8*s,y-5*s,3*s,13*s,'#e09a67');r(x+8*s,y+2*s,2*s,9*s,'#8c4735');

  };

  // Entire frame is a lived-in London street, rather than a floating shop model.
  r(0,0,640,420,'#d9e7e5');r(0,15,640,72,'#e8ede7');r(0,61,640,54,'#f7ecda');
  r(17,24,72,4,'#fcf5e7');r(30,20,41,4,'#fcf5e7');r(529,15,69,4,'#fcf5e7');
  brick(0,54,107,291,['#c89272','#bd8063','#d7a68a','#bb8369']);
  brick(519,22,121,323,['#d3b39a','#bd987e','#e0c4a8','#cda78b']);
  r(0,88,109,7,'#efd9bd');r(0,96,108,3,'#a87355');r(519,65,121,8,'#f3dfc2');r(519,74,121,3,'#ab856e');
  sash(17,114,58,77);sash(550,92,53,71);sash(550,193,53,69);
  r(0,222,104,124,'#8f5346');r(7,233,82,96,'#537b85');r(11,238,34,84,'#a4c8c6');r(50,238,34,84,'#bad4cb');r(45,235,5,94,'#f3dfc0');
  for(let x=-12;x<111;x+=24){poly([[x,210],[x+17,210],[x+27,228],[x+6,228]],'#f6e7d1');poly([[x+17,210],[x+24,210],[x+33,228],[x+27,228]],'#b75b48');}
  r(0,228,108,7,'#f9ebd7');r(0,337,105,12,'#9d7965');
  r(530,282,110,63,'#556e71');r(536,288,104,48,'#355260');r(543,294,17,36,'#c6d4c4');r(567,294,24,36,'#cbd9d0');r(599,294,34,36,'#94b4b7');

  // Warm brown brick, white fascia and the real café's distinctive blue awning.
  brick(106,5,392,340,['#a47d5e','#b98e6c','#997255','#c39875']);
  poly([[498,5],[521,21],[521,356],[498,348]],'#805f4f');
  r(101,20,400,6,'#dec5a5');r(104,27,396,3,'#8a674e');
  sash(146,45,56,72);sash(386,45,56,72);
  // Upper-window flower boxes: basil, red flowers, tiny highlights.
  for(const x of [143,383]){r(x,118,66,8,'#b35b43');for(let i=0;i<9;i++){r(x+3+i*7,112+(i%3),5,6,'#4d7150');if(i%2===0){r(x+4+i*7,109+(i%3),3,3,'#dc8e70');r(x+5+i*7,108+(i%3),1,1,'#f5c9a2');}}}
  r(101,137,402,50,'#9c7357');r(104,133,396,49,'#fff6e8');r(108,136,388,2,'#fffdf3');
  text(g,'ITALIA UNO',171,143,'#294d79',3);text(g,'91',113,145,'#9e4935');text(g,'91',478,145,'#9e4935');text(g,'020 7637 5326',242,170,'#4b6172');
  r(105,184,394,165,'#f1dbbe');r(116,201,372,144,'#263f4d');
  [[121,108],[235,108]].forEach(([x,w])=>{
    r(x,220,w,120,'#e5b67c');r(x+3,224,w-6,112,'#815a41');r(x+7,228,w-14,30,'#eec58d');
    r(x+8,260,w-16,6,'#c89663');r(x+9,268,w-18,45,'#c4a278');
    for(let i=0;i<5;i++){r(x+9+i*18,291,12,24,['#bc6c4e','#e4bd74','#71845d','#d49662','#efe0b7'][i]);r(x+11+i*18,288,8,4,'#f4e4bf');}
    r(x+9,234,28,20,'#403e35');for(let j=0;j<3;j++)r(x+13,238+j*5,20-j*3,1,'#e9d9b7');
    r(x+64,315,29,19,'#a34e3c');text(g,'UNO',x+69,321,'#fff0d5');
    line(x+53,226,x+29,319,'#eadfbb');line(x+57,226,x+33,319,'#adbcc0');r(x,337,w,5,'#2f5577');
  });
  // Recessed, open doorway, illuminated from within.
  r(351,219,132,124,'#253b43');r(358,226,76,112,'#ba8b5b');r(362,229,70,6,'#f8d49a');
  r(367,240,58,3,'#e5bf85');r(367,251,37,3,'#dca870');r(366,274,58,64,'#66513f');
  r(437,226,34,111,'#9ab6b7');r(442,232,24,100,'#d2dcd1');r(437,226,4,111,'#315978');r(471,219,10,124,'#2e5577');r(443,277,3,19,'#f8ddb0');
  r(112,344,380,7,'#c5a98c');r(108,351,392,4,'#e5caae');
  poly([[106,184],[499,184],[520,211],[92,211]],'#3d6391');poly([[92,211],[520,211],[520,234],[92,234]],'#254d7c');
  line(96,187,500,187,'#7e99b3');line(93,212,519,212,'#a1b9c3');r(95,231,422,3,'#e4d9c1');
  text(g,'SANDWICH BAR',111,219,'#fff1d8');text(g,'EAT IN OR TAKE AWAY',359,219,'#fff1d8');
  // Blue canvas folds, stitched edge and light catching the awning lip.
  for(let i=0;i<14;i++){const ax=113+i*28;line(ax,186,ax+12,210,'#55789b');line(ax+1,187,ax+13,210,'#335984');r(ax+3,215,1,15,'#365d85');}
  r(96,232,419,1,'#f0dfbd');r(98,233,415,2,'#183b60');
  // Slender lamps inside the warm shop windows, with clipped bands of daylight.
  for(const x of [175,289]){r(x,236,1,9,'#806046');poly([[x-6,246],[x+7,246],[x+3,241],[x-3,241]],'#b27a4c');r(x-4,246,9,2,'#ffe2a5');}
  for(let wi=0;wi<2;wi++){const x=121+wi*114;r(x+3,336,102,1,'#b9c9bd');for(let k=0;k<5;k++){r(x+8+k*18,307,12,5,'#e5c997');r(x+9+k*18,309,10,2,'#93a477');}line(x+49,252,x+37,303,'#fff1cf88');}
  // Door mouldings, warm brass and a small wall conduit provide a real sense of scale.
  r(476,237,2,100,'#729299');r(443,278,2,17,'#e9bd75');r(443,277,3,2,'#fff0c5');
  r(486,30,3,103,'#765c4b');r(485,32,1,98,'#c09876');r(484,72,6,2,'#78604e');r(484,113,6,2,'#78604e');
    // Italian tricolour is an accent, never a green wash across the whole room.
  r(453,147,6,11,'#47734e');r(459,147,6,11,'#fff4dd');r(465,147,6,11,'#b64e3a');

  // Full-width stone pavement, kerb and a slim strip of the road.
  r(0,355,640,52,'#d6bda0');for(let y=357,row=0;y<405;y+=12,row++){
    r(0,y,640,1,'#b19a85');for(let x=-(row%2)*26;x<640;x+=53){r(x,y,1,11,'#b39a84');r(x+3,y+2,46,1,'#e7d1b4');}
  }
  detail.grain(0,357,640,47,430,['#e2caaa','#bea184','#cfb494'],71);
  r(0,406,640,6,'#ead7bb');r(0,412,640,8,'#7d7b7a');for(let x=12;x<640;x+=68)r(x,414,34,2,'#e7d5b8');
  poly([[108,354],[500,354],[533,380],[141,380]],'#ba9e83');
  // Folding chairs and a small outdoor coffee table, from the photo references.
  [[177,333],[263,345]].forEach(([x,y])=>{r(x,y-25,23,17,'#ae634e');r(x+2,y-23,19,12,'#cd8c6e');r(x,y,24,4,'#9b5b46');line(x,y-26,x,y+29,'#4b5260');line(x+23,y-26,x+23,y+28,'#4b5260');line(x,y+3,x+21,y+28,'#4b5260');line(x+23,y+3,x+2,y+28,'#4b5260');});
  poly([[197,313],[252,313],[266,326],[210,326]],'#e4c29a');r(209,325,58,3,'#a97c57');line(212,329,212,369,'#4e5360');line(262,329,262,368,'#4e5360');
  r(230,311,9,9,'#fff7e8');r(239,314,3,4,'#fff7e8');r(228,321,15,2,'#bf9d79');r(232,311,5,1,'#76523c');
  for(let i=0;i<3;i++){const n=(frame+i*6)%19;r(231+i*3+Math.round(Math.sin(n*.4)),308-n,1,3,'#f8e8cb');}
  // A chalk A-board and a little pavement garden make the frontage welcoming.
  poly([[308,302],[341,302],[348,362],[301,362]],'#a97650');poly([[312,307],[337,307],[342,350],[306,350]],'#384c43');
  text(g,'CAFFE',311,315,'#f8ead1');text(g,'PANINI',308,327,'#f8ead1');r(316,339,16,2,'#d69c68');r(303,362,3,5,'#825a43');r(343,362,3,5,'#825a43');
  planter(83,351,1.1);planter(506,351,.9);
  // Bicycle and street lantern; no invented neighbouring shop names.
  ring(548,375,13,'#455662');ring(592,375,13,'#455662');ring(548,375,11,'#b2b9b4');ring(592,375,11,'#b2b9b4');
  line(548,375,560,353,'#a64e3b');line(560,353,576,375,'#a64e3b');line(548,375,576,375,'#a64e3b');line(560,353,582,353,'#a64e3b');line(582,353,592,375,'#a64e3b');line(576,375,582,353,'#a64e3b');line(560,353,558,347,'#48545a');r(551,345,14,3,'#48545a');line(582,353,584,343,'#48545a');line(584,343,592,342,'#48545a');
  detail.oval(598,111,38,39,'#ffde9e1c');
  r(615,144,4,216,'#555359');r(608,359,18,6,'#555359');r(609,142,17,5,'#6f5d51');r(611,120,13,22,'#eec78e');r(609,117,17,4,'#5a5151');poly([[607,117],[617,109],[627,117]],'#65564f');r(612,123,3,14,'#fff0c5');r(619,123,3,14,'#dbad70');
  // Fictional pixel host: white chef's hat, tomato scarf, welcoming hand movement.
  // Door opening 112px, chair 55px: a 102px host belongs to this street scale.
  r(390,360,55,5,'#a48770');person(g,418,360,{boss:true,frame,height:102,wave:true});
  r(368,235,33,13,frame%20<10?'#f2cc83':'#e7bb77');text(g,'OPEN',372,238,'#75503a');
  // A tiny drifting bird and window glints keep the street alive.
  const birdX=530+(frame%100);line(birdX,14,birdX+3,12,'#8e9e9c');line(birdX+3,12,birdX+6,14,'#8e9e9c');
  return {welcome:[339,255]};
}
