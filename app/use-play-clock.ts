'use client';
import {useEffect,useRef} from 'react';
// Counts visible play time only. No background timers added to a greeting card.
export function usePlayClock(enabled:boolean,onSeconds:(seconds:number)=>void){
 const callback=useRef(onSeconds);callback.current=onSeconds;
 useEffect(()=>{if(!enabled)return;let last=performance.now(),remainder=0,visible=document.visibilityState==='visible';
  const flush=()=>{const now=performance.now();if(visible){remainder+=now-last;const seconds=Math.floor(remainder/1000);if(seconds>0){remainder-=seconds*1000;callback.current(Math.min(seconds,60));}}last=now;};
  const visibility=()=>{flush();visible=document.visibilityState==='visible';last=performance.now();};
  const timer=setInterval(flush,1000);document.addEventListener('visibilitychange',visibility);
  return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility);flush();};
 },[enabled]);
}
