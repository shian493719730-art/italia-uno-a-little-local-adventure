/** Original, bounded café service game. All prices are fictional game tokens. */
export const SERVICE_DISHES = Object.freeze({
  espresso: { name: 'Espresso', pantry: 'coffee', price: 3 },
  italia: { name: 'Italia', pantry: 'panino', price: 6 },
  campagnolo: { name: 'Campagnolo', pantry: 'panino', price: 6 },
  barese: { name: 'Barese', pantry: 'panino', price: 6 },
});
export const SERVICE_DAYS = Object.freeze([
  { name: 'First light', orders: ['espresso', 'italia', 'campagnolo', 'espresso'], patience: 10 },
  { name: 'The lunch regulars', orders: ['barese', 'espresso', 'italia', 'campagnolo', 'espresso'], patience: 8 },
  { name: 'A busy little corner', orders: ['espresso', 'italia', 'barese', 'campagnolo', 'espresso', 'italia'], patience: 7 },
]);
export const SERVICE_UPGRADES = Object.freeze({
  counter: { cost: 10 }, grinder: { cost: 10 }, seats: { cost: 10 },
});
export const SERVICE_PACKS = Object.freeze({
  panino: { units: 3, cost: 6 }, coffee: { units: 4, cost: 4 },
});
export const SERVICE_TARGET = Object.freeze({ served: 11, cash: 35, total: 15 });
const freshDay = cash => ({ opening: cash, spent: 0, sales: 0, tips: 0, served: 0, lost: 0, turns: 0 });
export function initialService() {
  return { version: 1, phase: 'prep', day: 1, cash: 18, stock: { panino: 2, coffee: 2 }, upgrade: null,
    queue: [], nextCustomer: 0, selectedDish: 'espresso', prepared: null, dirt: 0,
    totals: { served: 0, lost: 0, sales: 0, tips: 0, spent: 0 },
    memories:{servedDishes:{},cleans:0},
    daily: freshDay(18), receipts: [], event: { kind: 'welcome' }, serial: 0 };
}
export const serviceWon = s => s.totals.served >= SERVICE_TARGET.served && s.cash >= SERVICE_TARGET.cash;
export function serviceReason(s, action) {
  const phase = s.phase;
  const inTrade = phase === 'trade';
  if (action.type === 'RESET') return '';
  if (action.type === 'NEXT') return phase === 'summary' ? '' : 'not-summary';
  if (action.type === 'SELECT_DISH') return inTrade && SERVICE_DISHES[action.dish] ? '' : 'not-trading';
  if (action.type === 'BUY') {
    if (phase !== 'prep') return 'not-prep';
    const pack = SERVICE_PACKS[action.item];
    if (!pack) return 'unknown-item';
    if (s.stock[action.item] + pack.units > 12) return 'pantry-full';
    if (s.cash - pack.cost < 2) return 'cash-reserved';
    return '';
  }
  if (action.type === 'UPGRADE') {
    if (phase !== 'prep') return 'not-prep';
    if (s.upgrade) return 'one-upgrade';
    if (!SERVICE_UPGRADES[action.id]) return 'unknown-item';
    if (s.cash - SERVICE_UPGRADES[action.id].cost < 2) return 'cash-reserved';
    return '';
  }
  if (action.type === 'OPEN') return phase === 'prep' ? '' : 'already-open';
  if (!inTrade) return 'not-trading';
  if (action.type === 'PREPARE') {
    if (s.prepared) return 'dish-ready';
    if (s.dirt >= 2) return 'clean-first';
    const dish = SERVICE_DISHES[s.selectedDish];
    if (!dish || s.stock[dish.pantry] < 1) return 'no-stock';
    return '';
  }
  if (action.type === 'SERVE') {
    if (!s.prepared) return 'prepare-first';
    const order = s.queue.find(x => x.id === action.orderId);
    if (!order) return 'choose-customer';
    return order.dish === s.prepared ? '' : 'wrong-dish';
  }
  if (action.type === 'CLEAN') return s.dirt ? '' : 'already-clean';
  if (action.type === 'RESTOCK') {
    if (!['panino', 'coffee'].includes(action.item)) return 'unknown-item';
    if (s.stock[action.item] >= 12) return 'pantry-full';
    if (s.cash - (action.item === 'panino' ? 3 : 2) < 2) return 'cash-reserved';
    return '';
  }
  if (action.type === 'DISCARD') return s.prepared ? '' : 'no-dish';
  if (action.type === 'WAIT' || action.type === 'CLOSE') return '';
  return 'unknown-action';
}
function announce(s, event) { return { ...s, serial: s.serial + 1, event }; }
function populate(s) {
  const day = SERVICE_DAYS[s.day - 1];
  const queue = [...s.queue];
  let nextCustomer = s.nextCustomer;
  while (queue.length < 2 && nextCustomer < day.orders.length) {
    const index = nextCustomer++;
    const max = day.patience + (s.upgrade === 'seats' ? 3 : 0);
    queue.push({ id: `day${s.day}-guest${index + 1}`, number: index + 1,
      dish: day.orders[index], patience: max, max });
  }
  return { ...s, queue, nextCustomer };
}
function endDay(s) {
  const remaining = SERVICE_DAYS[s.day - 1].orders.length - s.nextCustomer + s.queue.length;
  const lost = s.daily.lost + remaining;
  const cash = s.cash - 2;
  const receipt = { ...s.daily, day: s.day, lost, overhead: 2, closing: cash, leftover: { ...s.stock } };
  return { ...s, phase: 'summary', cash, queue: [], prepared: null,
    daily: { ...s.daily, lost }, totals: { ...s.totals, lost: s.totals.lost + remaining },
    receipts: [...s.receipts, receipt] };
}
function tick(s, cost = 1) {
  const waiting = s.queue.map(x => ({ ...x, patience: x.patience - cost }));
  const departures = waiting.filter(x => x.patience <= 0).length;
  s = { ...s, queue: waiting.filter(x => x.patience > 0),
    daily: { ...s.daily, lost: s.daily.lost + departures, turns: s.daily.turns + cost },
    totals: { ...s.totals, lost: s.totals.lost + departures } };
  s = populate(s);
  // An idle action is never required to reach a day summary.
  if (!s.queue.length) s = endDay(s);
  return { s, departures };
}
export function reduceService(s, action) {
  if (!s || action.type === 'RESET') return initialService();
  if (serviceReason(s, action)) return s;
  const before = { cash: s.cash, stock: { ...s.stock }, dirt: s.dirt };
  let event = { kind: action.type.toLowerCase(), before };
  switch (action.type) {
    case 'SELECT_DISH': return s.selectedDish === action.dish ? s : { ...s, selectedDish: action.dish };
    case 'BUY': {
      const p = SERVICE_PACKS[action.item];
      s = { ...s, cash: s.cash - p.cost, stock: { ...s.stock, [action.item]: s.stock[action.item] + p.units },
        daily: { ...s.daily, spent: s.daily.spent + p.cost }, totals: { ...s.totals, spent: s.totals.spent + p.cost } };
      event = { ...event, item: action.item, units: p.units, cost: p.cost }; break;
    }
    case 'UPGRADE': {
      const cost = SERVICE_UPGRADES[action.id].cost;
      s = { ...s, cash: s.cash - cost, upgrade: action.id,
        daily: { ...s.daily, spent: s.daily.spent + cost }, totals: { ...s.totals, spent: s.totals.spent + cost } };
      event = { ...event, id: action.id, cost }; break;
    }
    case 'OPEN': s = populate({ ...s, phase: 'trade' }); break;
    case 'PREPARE': {
      const d = SERVICE_DISHES[s.selectedDish], free = s.upgrade === 'counter' && d.pantry === 'panino';
      s = { ...s, stock: { ...s.stock, [d.pantry]: s.stock[d.pantry] - 1 }, prepared: s.selectedDish };
      const t = tick(s, free ? 0 : 1); s = t.s;
      event = { ...event, dish: s.selectedDish, item: d.pantry, turns: free ? 0 : 1, departures: t.departures }; break;
    }
    case 'SERVE': {
      const guest = s.queue.find(x => x.id === action.orderId), dish = SERVICE_DISHES[guest.dish];
      const tip = (guest.patience >= 4 ? 1 : 0) + (s.upgrade === 'grinder' && guest.dish === 'espresso' ? 1 : 0);
      const income = dish.price + tip;
      s = { ...s, cash: s.cash + income, prepared: null, dirt: s.dirt + 1,
        queue: s.queue.filter(x => x.id !== guest.id),
        memories:{...s.memories,servedDishes:{...s.memories.servedDishes,[guest.dish]:(s.memories.servedDishes[guest.dish]||0)+1}},
        daily: { ...s.daily, served: s.daily.served + 1, sales: s.daily.sales + dish.price, tips: s.daily.tips + tip },
        totals: { ...s.totals, served: s.totals.served + 1, sales: s.totals.sales + dish.price, tips: s.totals.tips + tip } };
      const t = tick(s); s = t.s;
      event = { ...event, dish: guest.dish, income, tip, turns: 1, departures: t.departures }; break;
    }
    case 'CLEAN': { s = { ...s, dirt: 0,memories:{...s.memories,cleans:s.memories.cleans+1} }; const t = tick(s); s = t.s; event = { ...event, turns: 1, departures: t.departures }; break; }
    case 'RESTOCK': {
      const cost = action.item === 'panino' ? 3 : 2;
      s = { ...s, cash: s.cash - cost, stock: { ...s.stock, [action.item]: s.stock[action.item] + 1 },
        daily: { ...s.daily, spent: s.daily.spent + cost }, totals: { ...s.totals, spent: s.totals.spent + cost } };
      const t = tick(s); s = t.s;
      event = { ...event, item: action.item, units: 1, cost, turns: 1, departures: t.departures }; break;
    }
    case 'DISCARD': { const dish = s.prepared; s = { ...s, prepared: null }; const t = tick(s); s = t.s; event = { ...event, dish, turns: 1, departures: t.departures }; break; }
    case 'WAIT': { const t = tick(s); s = t.s; event = { ...event, turns: 1, departures: t.departures }; break; }
    case 'CLOSE': s = endDay(s); break;
    case 'NEXT':
      s = s.day === 3 ? { ...s, phase: 'review' } : { ...s, day: s.day + 1, phase: 'prep', dirt: 0,
        queue: [], nextCustomer: 0, prepared: null, daily: freshDay(s.cash) }; break;
  }
  return announce(s, { ...event, after: { cash: s.cash, stock: { ...s.stock }, dirt: s.dirt } });
}
