import {MUSIC_SCENES,musicBarEvents,BAR_BEATS,LOOP_BARS} from './music-score.mjs';
export {MUSIC_SCENES} from './music-score.mjs';
const DEFAULT_VOLUME=.3;
const frequency=n=>440*Math.pow(2,(n-69)/12);

function createGraph(ctx,volume=DEFAULT_VOLUME){
 const master=ctx.createGain(),music=ctx.createGain(),compressor=ctx.createDynamicsCompressor(),tone=ctx.createBiquadFilter();
 master.gain.value=volume;music.gain.value=2.4;tone.type='lowpass';tone.frequency.value=6800;tone.Q.value=.3;
 compressor.threshold.value=-20;compressor.ratio.value=2.5;compressor.knee.value=14;compressor.attack.value=.012;compressor.release.value=.3;
 music.connect(tone);tone.connect(master);master.connect(compressor);compressor.connect(ctx.destination);
 // Short, quiet room reflections, generated locally; no sampled room or music.
 const convolver=ctx.createConvolver(),wet=ctx.createGain(),impulse=ctx.createBuffer(2,Math.floor(ctx.sampleRate*1.1),ctx.sampleRate);
 for(let ch=0;ch<2;ch++){let seed=79+ch*17,last=0;const data=impulse.getChannelData(ch);for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;last=.65*last+.35*(seed/2147483648-1);data[i]=last*Math.pow(1-i/data.length,3.5);}}
 convolver.buffer=impulse;wet.gain.value=.14;music.connect(convolver);convolver.connect(wet);wet.connect(master);
 const noise=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.35),ctx.sampleRate);let seed=137;const data=noise.getChannelData(0);for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}
 const fluteWave=ctx.createPeriodicWave(new Float32Array(7),new Float32Array([0,1,.12,.07,.025,.012,.004]));
 const guitarWave=ctx.createPeriodicWave(new Float32Array(7),new Float32Array([0,1,.34,.15,.07,.03,.008]));
 const bassWave=ctx.createPeriodicWave(new Float32Array(5),new Float32Array([0,1,.42,.12,.03]));
 function bus(){const gain=ctx.createGain();gain.gain.value=1;gain.connect(music);return gain;}
 function voice(event,at,beatSeconds,out){
  const duration=Math.max(.06,event.length*beatSeconds),level=event.velocity,kind=event.voice;
  const amp=ctx.createGain(),filter=ctx.createBiquadFilter(),pan=ctx.createStereoPanner();pan.pan.value=event.pan||0;amp.connect(filter);filter.connect(pan);pan.connect(out);
  const nodes=[amp,filter,pan];let remaining=0;
  const clean=()=>{if(--remaining<=0)nodes.forEach(node=>{try{node.disconnect();}catch{}});};
  const play=(node,end)=>{remaining++;nodes.push(node);node.onended=clean;node.start(at);node.stop(end);};
  filter.type='lowpass';filter.frequency.value=kind==='guitar'?2400:kind==='bass'?1050:kind==='pad'?1300:kind==='flute'?3700:4600;filter.Q.value=.4;
  amp.gain.setValueAtTime(.00001,at);
  const attack=kind==='flute'?.065:kind==='pad'?.35:kind==='brush'?.026:.008;
  amp.gain.linearRampToValueAtTime(Math.max(.00002,level),at+Math.min(attack,duration/3));
  amp.gain.exponentialRampToValueAtTime(Math.max(.00002,level*(kind==='flute'?.74:.38)),at+duration*.48);
  amp.gain.exponentialRampToValueAtTime(.00001,at+duration+.16);
  if(['brush','hat','rim','kick'].includes(kind)){
   if(kind==='kick'||kind==='rim'){
    const osc=ctx.createOscillator();osc.type='sine';osc.frequency.setValueAtTime(kind==='kick'?115:620,at);osc.frequency.exponentialRampToValueAtTime(kind==='kick'?47:260,at+duration);filter.frequency.value=kind==='kick'?250:1600;play(osc,at+duration+.17);osc.connect(amp);
   }else{
    const src=ctx.createBufferSource();src.buffer=noise;filter.type=kind==='hat'?'highpass':'bandpass';filter.frequency.value=kind==='hat'?4800:1700;filter.Q.value=.55;src.connect(amp);play(src,at+duration+.17);
   }return;
  }
  const osc=ctx.createOscillator();osc.frequency.value=frequency(event.note);osc.connect(amp);
  if(kind==='keys'||kind==='vibes'){
   osc.type='sine';const mod=ctx.createOscillator(),index=ctx.createGain();mod.type='sine';mod.frequency.value=frequency(event.note)*(kind==='vibes'?3:2);index.gain.setValueAtTime(frequency(event.note)*.58,at);index.gain.exponentialRampToValueAtTime(Math.max(1,frequency(event.note)*.025),at+.24);mod.connect(index);index.connect(osc.frequency);nodes.push(index);play(mod,at+duration+.18);
  }else if(kind==='flute'){
   osc.setPeriodicWave(fluteWave);const vibrato=ctx.createOscillator(),depth=ctx.createGain();vibrato.frequency.value=4.8;depth.gain.setValueAtTime(0,at);depth.gain.linearRampToValueAtTime(3,at+.22);vibrato.connect(depth);depth.connect(osc.detune);nodes.push(depth);play(vibrato,at+duration+.18);
  }else if(kind==='guitar')osc.setPeriodicWave(guitarWave);
  else if(kind==='bass')osc.setPeriodicWave(bassWave);
  else{osc.type='triangle';osc.detune.value=-3;}
  play(osc,at+duration+.18);
 }
 return {master,music,bus,voice};
}

export function createCafeMusic(){
 const Audio=globalThis.window?.AudioContext||globalThis.window?.webkitAudioContext;if(!Audio)return null;
 const ctx=new Audio(),graph=createGraph(ctx);let currentBus=graph.bus(),mode='street',nextBar=0,nextTime=0,enabled=true,started=false,closed=false,timer=null,volume=DEFAULT_VOLUME;
 const retiring=new Set();
 function schedule(){if(closed||!enabled||ctx.state!=='running')return;while(nextTime<ctx.currentTime+.15){const seconds=60/MUSIC_SCENES[mode].tempo;for(const event of musicBarEvents(mode,nextBar))graph.voice(event,nextTime+event.beat*seconds,seconds,currentBus);nextTime+=BAR_BEATS*seconds;nextBar=(nextBar+1)%LOOP_BARS;}}
 function changeScene(value){
  const next=MUSIC_SCENES[value]?value:'cafe';if(next===mode||closed)return;mode=next;if(!started)return;
  const old=currentBus,t=ctx.currentTime;old.gain.cancelScheduledValues(t);old.gain.setTargetAtTime(.00001,t,.16);
  const cleanup=setTimeout(()=>{old.disconnect();retiring.delete(cleanup);},5000);retiring.add(cleanup);
  currentBus=graph.bus();currentBus.gain.setValueAtTime(.00001,t);currentBus.gain.linearRampToValueAtTime(1,t+.7);nextBar=0;nextTime=t+.06;schedule();
 }
 function wake(){
  if(closed||!enabled||document.hidden)return;
  if(!started){started=true;nextTime=ctx.currentTime+.06;timer=setInterval(schedule,45);}
  graph.master.gain.setTargetAtTime(volume,ctx.currentTime,.07);
  ctx.resume().then(()=>{if(closed||!enabled)return;if(nextTime<ctx.currentTime-.2)nextTime=ctx.currentTime+.06;schedule();}).catch(()=>{});
 }
 const visibility=()=>{if(closed)return;if(document.hidden)ctx.suspend().catch(()=>{});else if(started&&enabled)wake();};document.addEventListener('visibilitychange',visibility);
 return {wake,setScene:changeScene,
  setEnabled(value){if(closed)return;enabled=!!value;if(enabled)wake();else{graph.master.gain.cancelScheduledValues(ctx.currentTime);graph.master.gain.setTargetAtTime(.00001,ctx.currentTime,.025);}},
  setVolume(value){if(closed)return;volume=Math.max(0,Math.min(.45,Number(value)||0));graph.master.gain.setTargetAtTime(enabled?volume:.00001,ctx.currentTime,.06);},
  effect(kind='click'){if(closed||!enabled)return;wake();const notes=kind==='stamp'||kind==='win'?[72,76,79,83]:kind==='serve'?[72,76,79]:kind==='error'?[62,60]:kind==='enter'?[67,71,74]:[79,83];notes.forEach((note,i)=>graph.voice({note,length:.24,velocity:.055,voice:'vibes',pan:0},ctx.currentTime+.015+i*.065,.5,graph.master));},
  get state(){return ctx.state;},
  close(){if(closed)return;closed=true;clearInterval(timer);retiring.forEach(clearTimeout);retiring.clear();document.removeEventListener('visibilitychange',visibility);ctx.close().catch(()=>{});}
 };
}

// Exact instrument renderer for offline QA/listening excerpts, without playback capture.
export async function renderMusicPreview(scene='cafe',{bars=8,sampleRate=44100}={}){
 const Offline=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!Offline)throw new Error('Offline audio is unavailable');
 const chosen=MUSIC_SCENES[scene]?scene:'cafe',count=Math.max(1,Math.min(16,Math.floor(bars))),seconds=60/MUSIC_SCENES[chosen].tempo,duration=count*BAR_BEATS*seconds;
 const ctx=new Offline(2,Math.ceil((duration+2)*sampleRate),sampleRate),graph=createGraph(ctx),bus=graph.bus();
 for(let bar=0;bar<count;bar++)for(const event of musicBarEvents(chosen,bar))graph.voice(event,bar*BAR_BEATS*seconds+event.beat*seconds,seconds,bus);
 graph.master.gain.setValueAtTime(DEFAULT_VOLUME,duration-.5);graph.master.gain.linearRampToValueAtTime(.00001,duration+.5);
 return ctx.startRendering();
}
