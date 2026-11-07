// Integer-raster tools, shared by the original café artwork. No borrowed sprites.
export function pixelPainter(g) {
  const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const line=(x,y,a,b,c)=>{
    x=Math.round(x);y=Math.round(y);a=Math.round(a);b=Math.round(b);
    const dx=Math.abs(a-x),dy=-Math.abs(b-y),sx=x<a?1:-1,sy=y<b?1:-1;let err=dx+dy;
    for(let n=0;n<2400;n++){r(x,y,1,1,c);if(x===a&&y===b)break;const e=2*err;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}}
  };
  const poly=(pts,c)=>{
    const low=Math.ceil(Math.min(...pts.map(p=>p[1]))),high=Math.ceil(Math.max(...pts.map(p=>p[1])));
    for(let y=low;y<high;y++){const xs=[];for(let i=0,j=pts.length-1;i<pts.length;j=i++){
      const a=pts[i],b=pts[j];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));
    }xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)r(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,c);}
  };
  const oval=(x,y,w,h,c)=>{for(let yy=0;yy<h;yy++){const a=Math.sqrt(Math.max(0,1-((yy+.5-h/2)/(h/2))**2))*w/2;r(x+w/2-a,y+yy,a*2,1,c);}};
  const grain=(x,y,w,h,n,colors,seed=7)=>{let v=seed>>>0;const rnd=()=>{v=(Math.imul(v,1664525)+1013904223)>>>0;return v/4294967296;};for(let i=0;i<n;i++){const px=x+Math.floor(rnd()*w),py=y+Math.floor(rnd()*h),len=1+Math.floor(rnd()*3);r(px,py,Math.min(len,x+w-px),1,colors[i%colors.length]);}};
  const wood=(x,y,w,h)=>{r(x,y,w,h,'#b48659');for(let yy=y+3;yy<y+h;yy+=7){line(x+2,yy,x+w-3,yy,'#9b6c48');line(x+2,yy+1,x+w-3,yy+1,'#c89a69');}grain(x,y,w,h,Math.ceil(w*h/55),['#d2aa78','#a77a53'],45);};
  const steam=(x,y,frame,color='#fff2d6')=>{for(let i=0;i<3;i++){const n=(frame+i*9)%30;const dx=Math.round(Math.sin(n*.22+i)*3);r(x+i*5+dx,y-n,1+(n<15?1:0),3,color);}};
  return {r,line,poly,oval,grain,wood,steam};
}
