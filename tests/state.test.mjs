import assert from 'node:assert/strict';
import {initial,reduce,ready,complete,validSave,RECIPES} from '../lib/game-state.mjs';
let s=initial();assert(validSave(s));assert(!complete(s));assert.equal(reduce(s,{type:'MAKE'}),s);assert.equal(reduce(s,{type:'PIN'}),s);
s=reduce(s,{type:'ENTER'});s=reduce(s,{type:'DISCOVER',id:'football'});assert.equal(s.stamps.length,1);assert.equal(reduce(s,{type:'DISCOVER',id:'coffee'}).stamps.length,1);
for(const id of Object.keys(RECIPES)){let t=reduce(s,{type:'SELECT',id});t=reduce(t,{type:'INGREDIENT',id:'mozzarella'});assert(!ready(t));assert.equal(reduce(t,{type:'MAKE'}),t);t=reduce(t,{type:'SELECT',id});for(const ingredient of RECIPES[id])t=reduce(t,{type:'INGREDIENT',id:ingredient});assert(ready(t));t=reduce(t,{type:'MAKE'});assert(t.made);assert(t.stamps.includes('flavour'));assert.equal(reduce(t,{type:'MAKE'}),t);s=t;}
s=reduce(s,{type:'PIN'});assert(complete(s));assert.equal(s.stamps.length,3);assert.equal(reduce(s,{type:'PIN'}),s);const saved=JSON.parse(JSON.stringify(s));assert(validSave(saved));assert(complete(saved));s=reduce(s,{type:'NOTE',value:'a'.repeat(200)});assert.equal(s.note.length,160);assert.deepEqual(reduce(s,{type:'RESET'}),initial());assert(!validSave({version:1,stamps:['invented']}));
console.log('Pass: three recipes; wrong/incomplete recipe guard; unique stamps; completion, persistence, note limit and reset.');
