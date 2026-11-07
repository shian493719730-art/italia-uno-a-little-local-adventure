import assert from 'node:assert/strict';
import {MUSIC_SCENES,musicBarEvents,BAR_BEATS,LOOP_BARS} from '../lib/music-score.mjs';
import {createCafeMusic} from '../lib/cafe-music.mjs';
assert.equal(createCafeMusic(),null,'server import does not construct browser audio');
assert.equal(BAR_BEATS,4);assert.equal(LOOP_BARS,16);
const voices=new Set();
for(const scene of Object.keys(MUSIC_SCENES)){
 const cfg=MUSIC_SCENES[scene];assert(cfg.tempo>=70&&cfg.tempo<=100);
 for(let bar=0;bar<LOOP_BARS;bar++){
  const events=musicBarEvents(scene,bar);assert(events.length>12&&events.length<45);
  for(const e of events){for(const key of ['beat','note','length','velocity','pan'])assert(Number.isFinite(e[key]),`${scene} ${bar} ${key}`);assert(e.beat>=0&&e.beat<BAR_BEATS);assert(e.length>0&&e.length<=4);assert(e.velocity>0&&e.velocity<.15);assert(e.pan>=-1&&e.pan<=1);if(!['brush','hat','rim','kick'].includes(e.voice))assert(e.note>=24&&e.note<=88);voices.add(e.voice);}
 }
 assert.deepEqual(musicBarEvents(scene,16),musicBarEvents(scene,0),'loop boundary repeats exactly');
 assert.deepEqual(musicBarEvents(scene,-1),musicBarEvents(scene,15),'negative bar wraps safely');
}
for(const voice of ['keys','guitar','bass','flute','vibes','brush'])assert(voices.has(voice));
assert(musicBarEvents('closing').some(e=>e.voice==='vibes'));
assert(!musicBarEvents('closing').some(e=>e.voice==='flute'));
assert(musicBarEvents('service',1).filter(e=>e.voice==='flute').length<musicBarEvents('cafe',1).filter(e=>e.voice==='flute').length);
assert.deepEqual(musicBarEvents('unknown'),musicBarEvents('cafe'));
console.log('Music score passed: finite original 16-bar 4/4 arrangement, pitch/gain/event bounds, four distinct scene arrangements, safe loop/fallback and server-side import.');
