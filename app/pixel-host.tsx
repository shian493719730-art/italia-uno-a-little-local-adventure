// @ts-nocheck
'use client';
import {useEffect,useRef} from 'react';
import {drawChef} from '../lib/chef-art.mjs';
export default function PixelHost({wave=false}) {
  const ref=useRef(null);
  useEffect(()=>{let raf,last=0,active=true;const g=ref.current.getContext('2d');const draw=t=>{if(t-last>120){g.clearRect(0,0,96,102);drawChef(g,0,0,{frame:Math.floor(t/120),pose:wave?'wave':'idle'});last=t;}if(active)raf=requestAnimationFrame(draw);};raf=requestAnimationFrame(draw);return()=>{active=false;cancelAnimationFrame(raf);};},[wave]);
  return <canvas className="pixel-host-portrait" ref={ref} width="96" height="102" aria-hidden="true"/>;
}
