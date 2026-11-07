import assert from 'node:assert/strict';
import {initial,reduce,RECIPES} from '../lib/game-state.mjs';
import {hydrateVisit,normaliseMemory,cleanName} from '../lib/visit-memory.mjs';
import {makeReceipt,receiptSVG,playDuration} from '../lib/receipt.mjs';
import {initialService,reduceService as r,SERVICE_DAYS,SERVICE_DISHES} from '../lib/service-state.mjs';

// Old saved visits retain stamps but do not invent a click or a duration.
const legacy=initial();delete legacy.memory;legacy.stamps=['character'];
assert.deepEqual(hydrateVisit(legacy).memory,initial().memory);
assert.deepEqual(hydrateVisit(legacy).stamps,['character']);
assert.deepEqual(normaliseMemory({seconds:-1,opened:{unknown:2,menu:3},madeRecipes:{italia:NaN}}),{name:'',seconds:0,opened:{menu:3},madeRecipes:{}});
assert.equal(cleanName('a\n\u0000b'),'ab');assert.equal(Array.from(cleanName('花'.repeat(40))).length,24);

let s=reduce(initial(),{type:'NICKNAME',value:'111'});
s=reduce(s,{type:'OPEN_DETAIL',id:'menu'});assert.deepEqual(s.memory.opened,{});
s=reduce(s,{type:'ENTER'});
for(const id of ['menu','menu','coffee','unknown'])s=reduce(s,{type:'OPEN_DETAIL',id});
assert.deepEqual(s.memory.opened,{menu:2,coffee:1});
s=reduce(s,{type:'VISIT_TICK',seconds:60});s=reduce(s,{type:'VISIT_TICK',seconds:8});
s=reduce(s,{type:'VISIT_TICK',seconds:-1});assert.equal(s.memory.seconds,68);
assert.equal(playDuration(68),'1m 08s');assert.equal(playDuration(68,'zh'),'1 分 8 秒');assert.equal(playDuration(0),'0s');
s=reduce(s,{type:'SELECT',id:'italia'});
s=reduce(s,{type:'MAKE'});assert.deepEqual(s.memory.madeRecipes,{});
for(const id of RECIPES.italia)s=reduce(s,{type:'INGREDIENT',id});
s=reduce(s,{type:'MAKE'});s=reduce(s,{type:'MAKE'});
assert.deepEqual(s.memory.madeRecipes,{italia:1});
const card=makeReceipt({visit:s});
assert.equal(card.greeting,'Ciao, 111!');assert.equal(card.duration,'1m 08s');
assert(card.rows.some(([key,value])=>key==='Browsed the blackboard menu'&&value==='× 2'));
assert(card.rows.some(([key,value])=>key==='Made a virtual Italia'&&value==='× 1'));
assert(!card.rows.some(([key])=>key.includes('football')||key.includes('Pinned')));
assert.match(card.message,/real Italia Uno/);assert.match(card.address,/91 Charlotte Street/);
assert.equal(makeReceipt({visit:hydrateVisit(legacy)}).duration,'0s');
assert.equal(makeReceipt({visit:initial()}).name,'neighbour');
assert.equal(makeReceipt({visit:initial(),lang:'zh'}).name,'新邻居');
assert.deepEqual(reduce(s,{type:'RESET'}).memory,initial().memory);
assert.deepEqual(hydrateVisit(JSON.parse(JSON.stringify(s))).memory,s.memory);

let owner=initialService();owner=r(owner,{type:'OPEN'});owner=r(owner,{type:'PREPARE'});
const guest=owner.queue[0].id;owner=r(owner,{type:'SERVE',orderId:guest});
owner=r(owner,{type:'SERVE',orderId:guest});assert.equal(owner.memories.servedDishes.espresso,1);
owner=r(owner,{type:'CLEAN'});owner=r(owner,{type:'CLEAN'});assert.equal(owner.memories.cleans,1);
const early=makeReceipt({kind:'owner',service:owner,name:'111',seconds:12});
assert(early.rows.some(([k,v])=>k==='Guests welcomed'&&v==='1'));
assert(early.rows.some(([k,v])=>k==='Served Espresso'&&v==='× 1'));
assert(!early.rows.some(([k])=>k==='Aim result'));
let win=initialService();
for(const plan of SERVICE_DAYS){
 for(const item of ['panino','coffee']){const need=plan.orders.filter(d=>SERVICE_DISHES[d].pantry===item).length;while(win.stock[item]<need)win=r(win,{type:'BUY',item});}
 win=r(win,{type:'OPEN'});
 while(win.phase==='trade'){
  if(win.dirt>=2)win=r(win,{type:'CLEAN'});
  if(win.phase!=='trade')break;
  const target=win.queue[0];win=r(win,{type:'SELECT_DISH',dish:target.dish});win=r(win,{type:'PREPARE'});win=r(win,{type:'SERVE',orderId:target.id});
 }
 win=r(win,{type:'NEXT'});
}
assert.deepEqual(win.memories.servedDishes,{espresso:6,italia:4,campagnolo:3,barese:2});
assert.equal(win.memories.cleans,5);assert.equal(win.cash,73);
const result=makeReceipt({kind:'owner',service:win,seconds:100});
assert(result.rows.some(([k,v])=>k==='Aim result'&&v==='MET'));
assert(result.rows.some(([k,v])=>k==='Game tokens left'&&v==='73'));
assert.deepEqual(r(win,{type:'RESET'}).memories,initialService().memories);

const malicious='<script>&"\'HELLO';
const svg=receiptSVG(makeReceipt({visit:s,name:malicious}));
assert(!svg.includes('<script>'));assert(svg.includes('&lt;script&gt;&amp;&quot;&apos;HELLO'));
assert.match(svg,/YOUR LITTLE VISIT RECEIPT/);assert.match(svg,/× 2/);
const cjk=receiptSVG(makeReceipt({visit:s,lang:'zh',name:'长'.repeat(24)}));
assert(cjk.includes('你在像素小店里'));assert(cjk.includes('xmlns="http://www.w3.org/2000/svg"'));
console.log('Receipt checks passed: actual journal, legacy saves, duration, nickname, both roles, replay guards, exact owner totals, reset and safe SVG.');
