import assert from 'node:assert/strict';
import { initialService, reduceService as r, serviceReason, serviceWon, SERVICE_DAYS, SERVICE_DISHES, SERVICE_PACKS } from '../lib/service-state.mjs';

let checks = 0;
const check = (truth, label) => { assert.ok(truth, label); checks++; };
let s = initialService();
check(s.cash === 18 && s.stock.panino === 2 && s.stock.coffee === 2, 'opening resources');
check(r(s, { type: 'SERVE', orderId: 'day1-guest1' }) === s, 'cannot serve before opening');
check(r(s, { type: 'BUY', item: 'missing' }) === s, 'unknown stock is rejected');
const original = JSON.stringify(s);
const bought = r(s, { type: 'BUY', item: 'panino' });
check(bought.cash === 12 && bought.stock.panino === 5, 'prep purchase costs and quantities');
check(JSON.stringify(s) === original, 'reducer does not mutate previous state');
let capped = s;
for(let i=0;i<10;i++) capped = r(capped, {type:'BUY',item:'coffee'});
check(capped.cash >= 2 && capped.stock.coffee <= 12, 'cannot overspend reserved cash or overflow pantry');
let upgraded = r(s,{type:'UPGRADE',id:'counter'});
check(upgraded.cash === 8 && upgraded.upgrade === 'counter', 'upgrade applies once');
check(r(upgraded,{type:'UPGRADE',id:'grinder'}) === upgraded, 'cannot stack upgrades');
s = r(s,{type:'OPEN'});
check(s.phase === 'trade' && s.queue.length === 2, 'opening creates bounded initial queue');
check(r(s,{type:'OPEN'}) === s, 'repeated opening is inert');
const first = s.queue[0];
s = r(s,{type:'PREPARE'});
check(s.prepared === 'espresso' && s.stock.coffee === 1 && s.queue[0].patience === first.patience-1, 'prepare consumes stock and patience');
check(r(s,{type:'PREPARE'}) === s, 'repeated preparation cannot consume again');
check(r(s,{type:'SERVE',orderId:s.queue[1].id}) === s, 'wrong dish cannot be served');
const served = r(s,{type:'SERVE',orderId:first.id});
check(served.totals.served === 1 && served.cash === 22 && !served.prepared, 'correct serving earns exactly once');
check(r(served,{type:'SERVE',orderId:first.id}) === served, 'replayed serving is inert');
const empty = {...served,stock:{panino:0,coffee:0}};
check(serviceReason(empty,{type:'PREPARE'}) === 'no-stock' && r(empty,{type:'PREPARE'}) === empty, 'out of stock is explained and inert');
check(serviceReason({...empty,cash:2},{type:'RESTOCK',item:'coffee'}) === 'cash-reserved', 'emergency restock cannot spend overhead reserve');
const restocked = r(empty,{type:'RESTOCK',item:'coffee'});
check(restocked.stock.coffee === 1 && restocked.cash === empty.cash-2 && restocked.daily.turns === empty.daily.turns+1,'emergency restock has explicit cash and patience cost');
const dirty = {...served,dirt:2};
check(serviceReason(dirty,{type:'PREPARE'}) === 'clean-first','dirty station blocks cooking');
const clean = r(dirty,{type:'CLEAN'});
check(clean.dirt===0 && r(clean,{type:'CLEAN'})===clean,'cleaning once resets station; repeated cleaning is inert');
let abandoned = r(initialService(),{type:'OPEN'});
for(let i=0;i<100 && abandoned.phase==='trade';i++) abandoned=r(abandoned,{type:'WAIT'});
check(abandoned.phase==='summary' && abandoned.daily.lost===4 && abandoned.totals.served===0,'inaction eventually loses finite queue, without a deadlock');
check(abandoned.cash===16 && r(abandoned,{type:'CLOSE'})===abandoned,'summary charges overhead once');
let closed = r(r(initialService(),{type:'OPEN'}),{type:'CLOSE'});
check(closed.receipts[0].lost===4 && closed.queue.length===0,'early close accounts for all waiting and future guests');
const next = r(closed,{type:'NEXT'});
check(next.day===2 && next.phase==='prep' && r(next,{type:'NEXT'})===next,'next day cannot be repeated to skip ahead');
// A transparent win path: buy only needed packs before opening, serve the oldest order.
let win = initialService();
for(let day=1;day<=3;day++) {
  const plan=SERVICE_DAYS[day-1];
  for(const item of ['panino','coffee']) {
    const need=plan.orders.filter(d=>SERVICE_DISHES[d].pantry===item).length;
    while(win.stock[item]<need) {
      const before=win; win=r(win,{type:'BUY',item});
      check(win!==before,`day ${day} stock is affordable`);
    }
  }
  win=r(win,{type:'OPEN'});
  let actions=0;
  while(win.phase==='trade' && actions++<60) {
    if(win.dirt>=2) win=r(win,{type:'CLEAN'});
    if(win.phase!=='trade') break;
    const target=win.queue[0];
    win=r(win,{type:'SELECT_DISH',dish:target.dish});
    win=r(win,{type:'PREPARE'});
    check(win.prepared===target.dish,`day ${day} order can be prepared`);
    win=r(win,{type:'SERVE',orderId:target.id});
  }
  check(win.phase==='summary' && win.daily.served===plan.orders.length,`day ${day} all guests served`);
  const receipt=win.receipts.at(-1);
  check(receipt.opening-receipt.spent+receipt.sales+receipt.tips-receipt.overhead===receipt.closing,`day ${day} receipt reconciles`);
  win=r(win,{type:'NEXT'});
}
check(win.phase==='review' && win.totals.served===15 && serviceWon(win),'three-day success is reachable');
check(r(win,{type:'CLOSE'})===win && r(win,{type:'SERVE',orderId:'day3-guest6'})===win,'finished game cannot be farmed');
check(JSON.stringify(r(win,{type:'RESET'}))===JSON.stringify(initialService()),'reset clears the full shift');
// Each available upgrade has a visible, distinct mechanical effect.
let fast=r(r(initialService(),{type:'UPGRADE',id:'counter'}),{type:'OPEN'});
fast=r(fast,{type:'SELECT_DISH',dish:'italia'});const beforeFast=fast.queue[0].patience;
fast=r(fast,{type:'PREPARE'});check(fast.queue[0].patience===beforeFast,'counter upgrade makes panino preparation free of patience cost');
let seats=r(r(initialService(),{type:'UPGRADE',id:'seats'}),{type:'OPEN'});
check(seats.queue[0].patience===13,'seats upgrade adds three patience to arrivals');
let grinder=r(r(initialService(),{type:'UPGRADE',id:'grinder'}),{type:'OPEN'});
const gid=grinder.queue[0].id;grinder=r(r(grinder,{type:'PREPARE'}),{type:'SERVE',orderId:gid});
check(grinder.daily.tips===2,'grinder upgrade earns one extra espresso token');
console.log(`Service game: ${checks} checks passed; win path served ${win.totals.served}/15 with ${win.cash} tokens.`);
