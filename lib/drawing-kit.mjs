// Original pen-and-pastel tools: stable imperfections, not frame-to-frame noise.
export const INK='#0b2b6c', PAPER='#f3e7cf', PALE='#e6d5b7', WASH='#c1c9d5';
const papers=new Map();
export function sketch(g) {
 const jitter=(x,y,n=0)=>Math.sin(x*1.73+y*2.19+n*4.13)*.65;
 const line=(a,b,width=1,color=INK)=>{
  g.save();g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.moveTo(...a);const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
  g.quadraticCurveTo(mx+jitter(mx,my),my+jitter(my,mx),...b);g.stroke();g.restore();
 };
 const poly=(pts,fill=null,width=1,color=INK)=>{
  g.save();g.beginPath();const first=pts[0];g.moveTo(...first);for(let i=1;i<=pts.length;i++){const a=pts[i-1],b=pts[i%pts.length],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;g.quadraticCurveTo(mx+jitter(mx,my)*.65,my+jitter(my,mx)*.65,...b);}g.closePath();
  if(fill){g.fillStyle=fill;g.fill();}if(width){g.strokeStyle=color;g.lineWidth=width;g.lineJoin='round';g.stroke();}
  g.restore();
 };
 const rect=(x,y,w,h,fill=null,width=1,color=INK)=>poly([[x+jitter(x,y),y],[x+w,y+jitter(y,x)],[x+w+jitter(x,w),y+h],[x,y+h+jitter(h,y)]],fill,width,color);
 const oval=(x,y,rx,ry,fill=null,width=1,color=INK,rot=0)=>{
  g.save();g.beginPath();g.ellipse(x,y,rx,ry,rot,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(width){g.strokeStyle=color;g.lineWidth=width;g.stroke();}g.restore();
 };
 const text=(str,x,y,size=12,color=INK,angle=0,align='left')=>{
  g.save();g.translate(x,y);g.rotate(angle);g.fillStyle=color;g.font=`400 ${size>=24?size*1.12:size}px ${size<9?"'Avenir Next', sans-serif":"'IU Brush', cursive"}`;g.textAlign=align;g.fillText(str,0,0);g.restore();
 };
 const hatch=(pts,gap=5,color='#0b2b6c26')=>{
  g.save();g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.clip();
  const x=pts.map(p=>p[0]),y=pts.map(p=>p[1]),minX=Math.min(...x),maxX=Math.max(...x),minY=Math.min(...y),maxY=Math.max(...y);
  for(let z=minX-(maxY-minY);z<maxX;z+=gap)line([z,minY],[z+maxY-minY,maxY],.45,color);g.restore();
 };
 const steam=(x,y,frame)=>{g.save();g.strokeStyle='#0b2b6c52';g.lineWidth=.8;for(let i=0;i<3;i++){let lift=(frame+i*7)%22;g.beginPath();g.moveTo(x+i*4,y-lift/4);g.bezierCurveTo(x-4+i*4,y-7-lift/4,x+5+i*4,y-11-lift/4,x+i*4,y-18-lift/4);g.stroke();}g.restore();};
 return {line,poly,rect,oval,text,hatch,steam};
}
export function beginDrawing(g) {
 const ratio=g.canvas.width/640;g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,640,420);g.imageSmoothingEnabled=true;
 if(!papers.has('paper')){const c=document.createElement('canvas');c.width=640;c.height=420;const p=c.getContext('2d');p.fillStyle=PAPER;p.fillRect(0,0,640,420);let n=8123;for(let i=0;i<11000;i++){n=(n*1664525+1013904223)>>>0;const x=(n>>>9)%640;n=(n*1664525+1013904223)>>>0;const y=(n>>>11)%420;p.fillStyle=i%3?'#6b503b09':'#fffaf337';p.fillRect(x,y,i%5===0?1.8:.7,.7);}papers.set('paper',c);}
 return sketch(g);
}
export function finishDrawing(g) {
 if(!papers.has('grain')){const c=document.createElement('canvas');c.width=640;c.height=420;const p=c.getContext('2d');let n=5041;for(let i=0;i<33000;i++){n=(n*1664525+1013904223)>>>0;const x=(n>>>9)%640;n=(n*1664525+1013904223)>>>0;const y=(n>>>11)%420;p.fillStyle=i%4?'#5448370d':'#fff9e938';p.fillRect(x,y,i%7===0?1.6:.7,.7);}papers.set('grain',c);}
 g.save();g.globalCompositeOperation='source-atop';g.drawImage(papers.get('grain'),0,0);g.restore();
}
