// Original café lounge score. The reference is a mood/genre brief, not a melody source.
export const MUSIC_SCENES=Object.freeze({
 street:{tempo:86,keys:.88,guitar:.82,lead:.65,brush:.38,bass:.9,pad:.45},
 cafe:{tempo:80,keys:1,guitar:.65,lead:.55,brush:.26,bass:.84,pad:.36},
 service:{tempo:96,keys:.82,guitar:.9,lead:.42,brush:.55,bass:1,pad:.12},
 closing:{tempo:74,keys:1,guitar:.58,lead:.38,brush:.16,bass:.7,pad:.6}
});
export const BAR_BEATS=4,LOOP_BARS=16;
// Close-voiced sevenths/ninths and a gentle minor-subdominant colour.
const harmony=[
 {root:36,chord:[52,55,59,62]}, {root:33,chord:[52,55,59,60]},
 {root:38,chord:[53,57,60,64]}, {root:31,chord:[53,57,59,64]},
 {root:36,chord:[52,55,59,62]}, {root:33,chord:[52,55,59,60]},
 {root:38,chord:[53,57,60,64]}, {root:31,chord:[53,57,59,64]},
 {root:29,chord:[52,57,60,67]}, {root:29,chord:[53,56,60,62]},
 {root:28,chord:[52,55,59,62]}, {root:33,chord:[55,59,61,64]},
 {root:38,chord:[53,57,60,64]}, {root:31,chord:[53,57,59,64]},
 {root:36,chord:[52,57,62,67]}, {root:31,chord:[53,57,59,64]}
];
// [beat, MIDI note, length in beats]. Rests and answers leave room for dialogue.
const melody=[
 [[.5,76,.6],[1.5,79,.35],[2.25,74,.65],[3.25,71,.45]],
 [[.25,72,.85],[2,76,.5],[3,71,.7]],
 [[.5,77,.75],[1.75,76,.35],[2.5,72,1]],
 [[.5,74,.55],[1.5,71,.55],[2.5,69,.75]],
 [[.25,67,.55],[1.25,71,.4],[2,76,.9],[3.25,74,.45]],
 [[.5,72,.75],[2,71,.4],[2.75,76,.7]],
 [[.25,74,.6],[1.25,77,.55],[2.5,76,.6]],
 [[.5,71,.65],[1.75,69,.45],[2.75,67,.75]],
 [[.25,76,.65],[1.5,81,.55],[2.5,79,.9]],
 [[.5,80,.75],[1.75,77,.55],[3,74,.65]],
 [[.25,79,.65],[1.5,76,.55],[2.75,74,.65]],
 [[.5,73,.65],[1.75,71,.4],[2.5,76,.9]],
 [[.25,77,.6],[1.5,74,.5],[2.5,72,.9]],
 [[.5,71,.5],[1.5,69,.55],[2.75,74,.65]],
 [[.25,76,.65],[1.5,74,.4],[2.25,72,1.5]],
 [[2,71,.4],[2.75,74,.5],[3.5,67,.35]]
];
export function musicBarEvents(scene='cafe',bar=0){
 const cfg=MUSIC_SCENES[scene]||MUSIC_SCENES.cafe,index=((Math.floor(bar)%LOOP_BARS)+LOOP_BARS)%LOOP_BARS,h=harmony[index],events=[];
 const add=(beat,note,length,velocity,voice,pan=0)=>events.push({beat,note,length,velocity,voice,pan});
 // Piano answers the guitar; no continuous high-register arpeggio.
 for(const [beat,strength]of [[.15,.92],[2.65,.65]])h.chord.forEach((note,i)=>add(beat+i*.011,note,1.45,.029*cfg.keys*strength,'keys',-.22));
 const strums=scene==='closing'?[1.5,3.5]:[.75,1.75,3.25];
 for(const beat of strums)h.chord.slice(0,3).forEach((note,i)=>add(beat+i*.019,note+.0,.9,.021*cfg.guitar,'guitar',.3));
 add(0,h.root,1.5,.11*cfg.bass,'bass',0);add(2,h.root+7,1.15,.08*cfg.bass,'bass',0);
 if(index%2===1&&scene!=='closing')add(3.5,harmony[(index+1)%16].root-1,.4,.046*cfg.bass,'bass',0);
 melody[index].forEach(([beat,note,length],i)=>{
  if(scene==='service'&&index%4===1&&i>1)return;
  const voice=scene==='closing'?'vibes':'flute';
  add(beat+(i%2?.025:0),scene==='closing'?note-12:note,length,.039*cfg.lead,voice,.08);
 });
 for(const beat of [1,3]){add(beat,0,.26,.023*cfg.brush,'brush',.14);add(beat,0,.1,.025*cfg.brush,'rim',-.22);}
 for(const beat of [0,2])add(beat,0,.2,.018*cfg.brush,'kick',0);
 const hats=scene==='service'?[.5,1.5,2.5,3.5]:[.5,2.5];for(const beat of hats)add(beat,0,.1,.008*cfg.brush,'hat',.4);
 if(index%4===0)h.chord.slice(0,3).forEach(note=>add(0,note,3.8,.006*cfg.pad,'pad',-.4));
 return events.sort((a,b)=>a.beat-b.beat);
}
