// @ts-nocheck
'use client';
import HandArrow from './hand-arrow';
import {ui,withItalian} from '../lib/locales.mjs';

import KeepsakeReceipt from './keepsake-receipt';
import {MobileOptionalPanel} from './mobile-interface';
import { usePlayClock } from './use-play-clock';
import { useEffect, useReducer, useRef, useState } from 'react';
import { initialService, reduceService, serviceReason, serviceWon, SERVICE_DAYS, SERVICE_DISHES, SERVICE_PACKS, SERVICE_TARGET } from '../lib/service-state.mjs';
const text = withItalian({
    en: {
        eyebrow: 'A LITTLE TURN BEHIND THE COUNTER', title: 'The counter is yours.', intro: 'Three short days. A little stock, a little strategy, and a warm welcome.',
        fictional: 'Fictional café simulation · not a prediction of Italia Uno’s business', exit: 'Leave the counter', day: 'Day', cash: 'Till', stock: 'Pantry', panino: 'Panino kits', coffee: 'Coffee portions', guests: 'Guests served', upgrade: 'Your one upgrade', noUpgrade: 'Original little counter', tokens: 'tokens',
        planTitle: 'Before the doors open', plan: 'Today’s order board', forecast: 'All orders are visible in advance. Two guests queue at a time.', buying: 'Stock the little pantry', buyPanino: '3 panino kits', buyCoffee: '4 coffee portions',
        stockHint: 'One kit abstracts bread and fillings for any game panino. Stock carries into the next day. Pantry limit: 12 of each.', reserved: '2 tokens are reserved for closing costs each day. You cannot spend that reserve.',
        upgradeTitle: 'One little improvement', upgradeHint: 'Optional. Choose at most one for the whole three-day run. It stays with you.',
        counter: 'Ready-to-use prep counter', counterDetail: 'Preparing a panino costs no patience. Serving still uses one action.',
        grinder: 'A better little grinder', grinderDetail: 'Every espresso served earns one extra token.',
        seats: 'A comfortable waiting corner', seatsDetail: 'Each arriving guest has 3 extra patience.',
        owned: 'Installed', choose: 'Install', open: 'Open for the day', rulesTitle: 'How a shift works',
        rule1: 'Select a ticket, prepare its dish, then serve it. Choosing a ticket or dish is free.',
        rule2: 'Prepare, serve, clean, restock and discard each cost 1 patience for waiting guests. No real-time countdown.',
        rule3: 'Clean after 2 servings. Serve with at least 4 patience left for a 1-token tip.',
        rule4: 'Aim for 11 of 15 guests served and at least 35 tokens at the end. You can close a day at any time.',
        queue: 'At the counter', customer: 'Guest', patience: 'patience', selected: 'Selected ticket', ticket: 'Select ticket', prepare: 'Prepare', serve: 'Serve', clean: 'Wipe the counter', cleanCost: '1 action · resets the 2-serving limit',
        station: 'Your worktop', stationClean: 'Freshly wiped', stationUsed: 'One serving · room for one more', stationDirty: 'Counter full · wipe before preparing', ready: 'Ready to serve', empty: 'Choose a ticket, then prepare its dish.', chooseDish: 'Or choose a dish', noTime: 'selection uses no patience', turn: 'action', turns: 'patience used',
        prepareCost: '1 pantry unit · 1 action', prepareFree: '1 pantry unit · no patience cost', serveCost: '1 action · earn the ticket price + any tip',
        restock: 'A little top-up', restockHint: 'During service, emergency stock is dearer and uses 1 action. Buying before opening is cheaper.',
        restockPanino: '+1 panino kit · 3 tokens · 1 action', restockCoffee: '+1 coffee portion · 2 tokens · 1 action',
        discard: 'Discard prepared dish', discardCost: '1 action · stock is not returned', closeDay: 'Close this day', closeHint: 'Unserved guests will count as missed; 2 closing-cost tokens will be deducted.',
        closeConfirm: 'Close the doors now?', closeCount: 'guest(s) still to serve today.', keepOpen: 'Keep serving', confirmClose: 'Close & see receipt',
        waiting: 'Next in the queue', upcoming: 'Still to arrive', served: 'served', missed: 'missed', dailyTitle: 'A little day, on a receipt.', opening: 'Opening till', purchases: 'Stock & improvements', sales: 'Food & coffee sales', tips: 'Tips & grinder bonus', overhead: 'Closing costs', closing: 'Closing till', dayReview: 'Day complete', nextDay: 'Set up the next day', finalReview: 'See my three-day review',
        finalTitle: 'Three days, one little café.', winTitle: 'A lovely little service.', learningTitle: 'Every little shift teaches you something.', winText: 'You kept the pantry, the queue and the welcome in balance.', learningText: 'Stock before opening, read the next tickets and keep the worktop clear. A fresh run is always waiting.',
        target: 'Your aim', targetText: '11 / 15 guests + 35 tokens', finalGuests: 'Guests welcomed', totalLost: 'Guests who could not be served', finalCash: 'Tokens left in the till',
        reviewNote: 'These are fictional game results, not customer reviews or an assessment of the real owner.', replay: 'Play a fresh three days', realTitle: 'How does the real owner do it?', realText: 'You’ve tried the little game. Why not drop by Italia Uno and see the real café in action?', address: '91 Charlotte Street · Fitzrovia · London W1T 4PX', visit: 'Find the real café', return: 'Back to exploring', continue: 'Keep playing', leaveTitle: 'From the little game to the real café.', leaveText: 'There is more to running a café than a few clicks. Why not come and see how the real owner brings it all together?', leaveNote: 'Leaving ends this practice run. Your visit stamps and notebook are kept.',
        abstract: 'All tokens, stock units, patience, tips and targets are invented game rules. This is not a real order, price list, staff story or business forecast.',
        reasons: { 'cash-reserved': 'Not enough tokens after reserving 2 for closing costs.', 'pantry-full': 'The pantry holds at most 12 of each item.', 'one-upgrade': 'You already chose your one improvement.', 'dish-ready': 'Serve or discard the dish already on the worktop.', 'clean-first': 'The worktop has had 2 servings. Wipe it first.', 'no-stock': 'No stock for this dish. Top up or choose another ticket.', 'prepare-first': 'Prepare a dish first.', 'choose-customer': 'Select a waiting guest.', 'wrong-dish': 'This guest ordered something else. Select the matching ticket.', 'already-clean': 'The counter is already clean.', 'no-dish': 'There is no dish to discard.' },
        feedback: { welcome: 'Your starter pantry has 2 panino kits and 2 coffee portions. Read today’s orders before you buy.', buy: 'Pantry restocked', upgrade: 'Improvement installed', open: 'Doors open. Choose a guest’s ticket to begin.', prepare: 'Prepared', serve: 'Served', clean: 'Counter wiped. The worktop is clear.', restock: 'Emergency top-up bought', discard: 'Prepared dish discarded. Its stock is not returned.', wait: 'The queue moved on.', close: 'Doors closed. Every unserved ticket is included in the receipt.', next: 'A fresh little start.' }, departed: 'guest(s) ran out of patience and left.', cashChange: 'Till', stockChange: 'Pantry', earned: 'earned', tip: 'tip / bonus',
    },
    zh: {
        eyebrow: '在柜台后，体验一小段经营', title: '现在，柜台交给你。', intro: '三个短短的营业日。安排库存，照顾队伍，留住一份热情。',
        fictional: '虚构经营小游戏 · 不预测 Italia Uno 的真实生意', exit: '离开柜台', day: '第', cash: '收银台', stock: '小储藏柜', panino: '帕尼尼食材包', coffee: '咖啡份数', guests: '已招待顾客', upgrade: '你的小升级', noUpgrade: '原来的小柜台', tokens: '枚代币',
        planTitle: '开门之前，先安排一下', plan: '今天的订单预告', forecast: '当天全部订单提前可见，同时最多两位顾客排队。', buying: '补充小小储藏柜', buyPanino: '3 份帕尼尼食材包', buyCoffee: '4 份咖啡原料',
        stockHint: '一份食材包抽象代表任意游戏帕尼尼的面包和馅料。库存可以带到下一天，每类最多 12 份。', reserved: '每天预留 2 枚代币用于收店支出，这部分不能花掉。',
        upgradeTitle: '给小店一点改善', upgradeHint: '可选：三天内最多安装一种，之后一直保留。', counter: '提前备好的操作台', counterDetail: '制作帕尼尼不消耗顾客耐心；上餐仍消耗 1 次行动。', grinder: '更好的小磨豆机', grinderDetail: '每卖出一杯 Espresso，额外获得 1 枚代币。', seats: '舒服一点的等候角', seatsDetail: '每位新来的顾客增加 3 点耐心。', owned: '已安装', choose: '安装', open: '开门营业', rulesTitle: '这一班怎么玩',
        rule1: '选择一张顾客订单，制作，再上餐。选择订单和菜品不消耗耐心。', rule2: '制作、上餐、清洁、补货、丢弃，各让等待中的顾客减少 1 点耐心。没有真实时间倒计时。', rule3: '每上餐 2 次要清洁操作台。顾客耐心至少为 4 时上餐，可获得 1 枚小费代币。', rule4: '三天目标：招待至少 15 位中的 11 位，并留下至少 35 枚代币。你随时可以收店。',
        queue: '柜台前的顾客', customer: '顾客', patience: '耐心', selected: '已选订单', ticket: '选择订单', prepare: '制作', serve: '上餐', clean: '擦一擦柜台', cleanCost: '1 次行动 · 清空上餐次数', station: '你的操作台', stationClean: '刚擦干净', stationUsed: '已上餐 1 次 · 还能再做一次', stationDirty: '操作台待清洁 · 擦好后才能制作', ready: '可以上餐了', empty: '先选一张订单，再制作对应菜品。', chooseDish: '也可以选择菜品', noTime: '选择不消耗耐心', turn: '次行动', turns: '点耐心已使用', prepareCost: '1 份库存 · 1 次行动', prepareFree: '1 份库存 · 不消耗耐心', serveCost: '1 次行动 · 获得菜品代币和可能的小费', restock: '临时补一点', restockHint: '营业中临时补货更贵，每次消耗 1 次行动。开门前买好更划算。', restockPanino: '+1 份帕尼尼食材包 · 3 枚代币 · 1 次行动', restockCoffee: '+1 份咖啡原料 · 2 枚代币 · 1 次行动', discard: '丢弃做好的菜品', discardCost: '1 次行动 · 不退还食材', closeDay: '今天先收店', closeHint: '未上餐的顾客计入错过人数，收店扣除 2 枚代币。', closeConfirm: '现在关门收店吗？', closeCount: '位顾客今天还没有招待。', keepOpen: '继续营业', confirmClose: '收店并查看小票', waiting: '接下来这位', upcoming: '尚未到店', served: '已招待', missed: '已错过', dailyTitle: '小小一天，记在小票上。', opening: '开门时的代币', purchases: '食材和升级支出', sales: '菜品与咖啡收入', tips: '小费和磨豆机奖励', overhead: '收店支出', closing: '收店后的代币', dayReview: '今天营业结束', nextDay: '准备下一天', finalReview: '查看三天的经营回顾', finalTitle: '三个营业日，一家小店。', winTitle: '小小柜台，招待得真好。', learningTitle: '每次营业，都能学到一点。', winText: '你平衡了库存、排队和招待的节奏。', learningText: '开门前备好食材，看看后面的订单，保持操作台干净。随时可以重新试一班。', target: '经营目标', targetText: '招待 11 / 15 位顾客，留下 35 枚代币', finalGuests: '已招待顾客', totalLost: '未能招待的顾客', finalCash: '收银台剩余代币', reviewNote: '这些只是虚构游戏结果，不是顾客评价，也不是对真实店主的评判。', replay: '重新体验三个营业日', realTitle: '真正的老板，是怎么经营的？', realText: '你已经在小游戏里试过了。为什么不来 Italia Uno，看看真实的小店如何运转？', address: '91 Charlotte Street · 菲茨罗维亚 · 伦敦 W1T 4PX', visit: '找到真实的小店', return: '继续逛逛小店', continue: '继续游戏', leaveTitle: '从小游戏，走进真实的小店。', leaveText: '经营一家咖啡馆，远远不止点几下。为什么不来看看，真正的老板是如何把这一切安排好的？', leaveNote: '离开会结束这次经营练习。你的探店印章和笔记会保留。', abstract: '代币、库存单位、耐心、小费和目标均为虚构游戏规则，不代表真实订单、价格、员工故事或经营预测。',
        reasons: { 'cash-reserved': '预留 2 枚收店代币后，剩余代币不够。', 'pantry-full': '每种原料最多存放 12 份。', 'one-upgrade': '这次游戏已经安装过一种升级。', 'dish-ready': '先上餐，或丢弃操作台上做好的菜品。', 'clean-first': '已上餐 2 次，请先擦干净操作台。', 'no-stock': '这道菜没有库存。临时补货，或选择另一张订单。', 'prepare-first': '请先制作一道菜。', 'choose-customer': '请选择一位还在等候的顾客。', 'wrong-dish': '这位顾客点的是别的菜，请选择对应订单。', 'already-clean': '柜台已经很干净了。', 'no-dish': '操作台上没有需要丢弃的菜品。' },
        feedback: { welcome: '你有 2 份帕尼尼食材包、2 份咖啡原料。买东西前，先看看今天的订单。', buy: '已补充库存', upgrade: '已安装小升级', open: '开门啦！选择一张顾客订单，开始招待吧。', prepare: '已做好', serve: '已上餐', clean: '已擦好柜台，操作台空出来了。', restock: '已购买临时补货', discard: '已丢弃做好的菜品，不退还食材。', wait: '队伍继续向前。', close: '已收店。所有未上餐的订单都计入了小票。', next: '新的一天，重新安排。' }, departed: '位顾客耐心用尽，离开了队伍。', cashChange: '收银台', stockChange: '库存', earned: '获得', tip: '小费／奖励',
    }
});
const mapURL = 'https://www.google.com/maps/search/?api=1&query=Italia+Uno+91+Charlotte+Street+London+W1T+4PX';
function DishSprite({ dish, large = false }) { return <span className={`shift-food ${dish === 'espresso' ? 'shift-food-coffee' : 'shift-food-panino'} ${large ? 'shift-food-large' : ''}`} aria-hidden="true"><i /><b /><em /></span>; }
function LittleGuest({ variant = 0, chef = false }) { return <span className={`shift-guest shift-guest-${variant % 4} ${chef ? 'shift-chef' : ''}`} aria-hidden="true"><i className="shift-guest-hair"/><i className="shift-guest-face"/><i className="shift-guest-body"/><i className="shift-guest-legs"/>{chef && <i className="shift-guest-apron"/>}</span>; }
function ShiftActionButton({ state, act, copy, action, children, detail, primary = false }) {
    const why = copy.reasons[serviceReason(state, action)] || '';
    return <div className="shift-action-wrap"><button className={primary ? 'shift-button shift-primary' : 'shift-button'} disabled={!!why} onClick={() => act(action)}>{children}<small>{detail}</small></button>{why && <span className="shift-disabled-reason">{why}</span>}</div>;
}
function ShiftPrompt({ title, onClose, children, exit = false }) {
    const ref = useRef(null);
    useEffect(() => {
        const previous = document.activeElement;
        ref.current?.querySelector('input,button')?.focus({ preventScroll: true });
        const handle = e => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose();
            }
            if (e.key === 'Tab') {
                const els = [...ref.current.querySelectorAll('a[href],button:not(:disabled),input,textarea,select')].filter(x => x.getClientRects().length);
                const first = els[0], last = els.at(-1);
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
                else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
                e.stopPropagation();
            }
        };
        document.addEventListener('keydown', handle, true);
        return () => { document.removeEventListener('keydown', handle, true); previous?.focus?.(); };
    }, []);
    return <div className={'shift-confirm ' + (exit ? 'shift-exit-confirm' : '')} role="dialog" aria-modal="true" aria-label={title} ref={ref}><div>{children}</div></div>;
}
export default function ServiceShift({ lang = 'en', onExit = () => { }, onSound, onPhaseChange, name = '', onNameChange, onSnapshot }) {
    const c = text[lang] || text.en;
    const [s, dispatch] = useReducer(reduceService, undefined, initialService);
    const surface = useRef(null);
    const [ownerSeconds, setOwnerSeconds] = useState(0);
    useEffect(() => { onSnapshot?.({ service: s, seconds: ownerSeconds }); }, [s, ownerSeconds]);
    const leaveWithReceipt = () => onExit({ service: s, seconds: ownerSeconds });
    useEffect(() => { onPhaseChange?.(s.phase); const sheet = surface.current?.closest('.sheet'); if (sheet)
        sheet.scrollTop = 0; }, [s.phase, s.day]);
    const [ticket, setTicket] = useState(null), [closePrompt, setClosePrompt] = useState(false), [exitPrompt, setExitPrompt] = useState(false);
    usePlayClock(['prep', 'trade'].includes(s.phase) && !exitPrompt, seconds => setOwnerSeconds(n => n + seconds));
    const day = SERVICE_DAYS[s.day - 1];
    useEffect(() => { if (!s.queue.some(g => g.id === ticket)) {
        const first = s.queue[0];
        setTicket(first?.id || null);
        if (first)
            dispatch({ type: 'SELECT_DISH', dish: first.dish });
    } }, [s.queue, ticket]);
    const target = s.queue.find(g => g.id === ticket) || s.queue[0];
    const act = a => { if (serviceReason(s, a)) {
        onSound?.('error');
        return;
    } dispatch(a); onSound?.(a.type === 'SERVE' ? 'serve' : a.type === 'NEXT' && s.day === 3 ? 'win' : 'select'); };
    const reason = a => c.reasons[serviceReason(s, a)] || '';
    const upgradeName = id => id ? c[id] : c.noUpgrade;
    const pantryName = id => c[id];
    const price = id => SERVICE_DISHES[id].price;
    const chooseTicket = g => { setTicket(g.id); act({ type: 'SELECT_DISH', dish: g.dish }); };
    function Feedback() {
        const e = s.event;
        let title = c.feedback[e.kind] || '';
        if (e.dish)
            title += ` ${SERVICE_DISHES[e.dish]?.name || ''}`;
        if (e.kind === 'buy' || e.kind === 'restock')
            title += ` · ${e.units} ${pantryName(e.item)}`;
        if (e.kind === 'upgrade')
            title += ` · ${upgradeName(e.id)}`;
        return <div className={`shift-feedback ${e.departures ? 'shift-feedback-alert' : ''}`} role="status" aria-live="polite" key={s.serial}>
      <strong>{title}</strong>
      {e.kind === 'serve' && <span>+{e.income} {c.tokens} · {e.tip} {c.tip}</span>}
      {e.before && e.after && <span>{c.cashChange} {e.before.cash} → {e.after.cash}{e.item ? ` · ${pantryName(e.item)} ${e.before.stock[e.item]} → ${e.after.stock[e.item]}` : ''}{e.turns !== undefined ? ` · ${e.turns} ${c.turn}` : ''}</span>}
      {e.departures > 0 && <strong>! {e.departures} {c.departed}</strong>}
    </div>;
    }
    return <section className={'shift-game phase-' + s.phase} aria-label={c.title} ref={surface}>
    <header className="shift-header"><div><p className="shift-eyebrow">{c.eyebrow}</p><h2>{s.phase === 'review' ? c.finalTitle : c.title}</h2><p>{c.intro}</p></div><button className="shift-text-button" onClick={() => { setExitPrompt(true); onSound?.('select'); }}>{c.exit} <HandArrow/></button></header>
    <p className="shift-fictional">{c.fictional}</p>
    <div className="shift-stats"><div><small>{c.day} {s.day} / 3</small><strong>{s.phase === 'prep' ? '08:30' : s.phase === 'trade' ? '12:30' : '17:00'}</strong></div><div><small>{c.cash}</small><strong><span className="shift-coin" aria-hidden="true"/>{s.cash}</strong></div><div><small>{c.panino}</small><strong>{s.stock.panino}</strong></div><div><small>{c.coffee}</small><strong>{s.stock.coffee}</strong></div><div><small>{c.guests}</small><strong>{s.totals.served} / 15</strong></div></div>
    {s.phase === 'prep' && <div className="shift-prep">
      <div className="shift-order-forecast"><div><h3>{c.plan}</h3><p>{c.forecast}</p></div><div className="shift-forecast-dishes">{day.orders.map((d, i) => <span key={i}><DishSprite dish={d}/><b>{SERVICE_DISHES[d].name}</b></span>)}</div></div>
      <div className="shift-prep-grid"><section className="shift-panel"><p className="shift-eyebrow">{c.planTitle}</p><h3>{c.buying}</h3><div className="shift-buy-grid"><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'BUY', item: 'panino' }} detail={`−6 ${c.tokens}`}>{c.buyPanino}</ShiftActionButton><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'BUY', item: 'coffee' }} detail={`−4 ${c.tokens}`}>{c.buyCoffee}</ShiftActionButton></div><p>{c.stockHint}</p><p className="shift-rule-note">{c.reserved}</p></section><section className="shift-panel shift-rules"><h3>{c.rulesTitle}</h3><ol><li>{c.rule1}</li><li>{c.rule2}</li><li>{c.rule3}</li><li>{c.rule4}</li></ol></section></div>
      <section className="shift-upgrades"><div><h3>{c.upgradeTitle}</h3><p>{c.upgradeHint}</p></div><MobileOptionalPanel title={c.upgradeTitle} description={c.upgradeHint}><div className="shift-upgrade-grid">{['counter', 'grinder', 'seats'].map((id, i) => { const why = reason({ type: 'UPGRADE', id }); return <div className={`shift-upgrade-card ${s.upgrade === id ? 'shift-upgrade-owned' : ''}`} key={id}><div className={`shift-upgrade-sprite shift-upgrade-${id}`} aria-hidden="true"><i /><b /></div><h4>{c[id]}</h4><p>{c[`${id}Detail`]}</p><button className="shift-button" disabled={!!why} onClick={() => act({ type: 'UPGRADE', id })}>{s.upgrade === id ? c.owned : `${c.choose} · 10 ${c.tokens}`}</button>{why && s.upgrade !== id && <span className="shift-disabled-reason">{why}</span>}</div>; })}</div></MobileOptionalPanel></section>
      <Feedback /><button className="shift-button shift-primary shift-open" onClick={() => act({ type: 'OPEN' })}>{c.open} →</button>
    </div>}
    {s.phase === 'trade' && <div className="shift-service">
      <div className="shift-service-heading"><div><p className="shift-eyebrow">{c.day} {s.day} · {s.daily.served} {c.served} · {s.daily.lost} {c.missed}</p><h3>{c.queue}</h3></div><span className="shift-upgrade-tag">{upgradeName(s.upgrade)}</span></div>
      <div className="shift-queue">{s.queue.map((g, i) => <button key={g.id} onClick={() => chooseTicket(g)} className={`shift-ticket ${target?.id === g.id ? 'shift-ticket-selected' : ''}`} aria-pressed={target?.id === g.id}><LittleGuest variant={g.number + s.day}/><div className="shift-ticket-content"><small>{c.customer} {g.number} · {target?.id === g.id ? c.selected : c.ticket}</small><strong>{SERVICE_DISHES[g.dish].name}</strong><span>{price(g.dish)} {c.tokens} + {c.tip}</span><div className="shift-patience" role="meter" aria-label={c.patience} aria-valuemin={0} aria-valuemax={g.max} aria-valuenow={g.patience}><i style={{ width: `${g.patience / g.max * 100}%` }}/></div><small>{c.patience}: {g.patience} / {g.max}</small></div><DishSprite dish={g.dish}/></button>)}</div>
      <div className="shift-next-orders"><span>{c.upcoming}: </span>{day.orders.slice(s.nextCustomer).map((d, i) => <b key={i}>{SERVICE_DISHES[d].name}</b>)}{s.nextCustomer >= day.orders.length && <span>—</span>}</div>
      <div className="shift-station"><div className="shift-counter-picture" aria-hidden="true"><div className="shift-espresso-machine"><i /><b /><em /></div><LittleGuest chef variant={1}/><div className={`shift-board ${s.prepared ? 'shift-board-ready' : ''}`}>{s.prepared ? <DishSprite dish={s.prepared} large/> : <span className="shift-chopping-lines"/>}</div><span className="shift-counter-front">ITALIA UNO</span>{s.dirt > 0 && <span className="shift-crumbs"><i /><i /><i /></span>}</div><div className="shift-station-info"><small>{c.station}</small><h3>{s.prepared ? `${SERVICE_DISHES[s.prepared].name} · ${c.ready}` : c.empty}</h3><p className={s.dirt >= 2 ? 'shift-station-warning' : ''}>{s.dirt >= 2 ? `! ${c.stationDirty}` : s.dirt === 1 ? c.stationUsed : c.stationClean}</p><span className="shift-serving-dots" aria-label={`${s.dirt} / 2`}><i className={s.dirt > 0 ? 'used' : ''}/><i className={s.dirt > 1 ? 'used' : ''}/></span></div></div>
      <div className="shift-dish-choices"><p>{c.chooseDish}<small>{c.noTime}</small></p><div>{Object.entries(SERVICE_DISHES).map(([id, d]) => <button key={id} className={s.selectedDish === id ? 'shift-dish-selected' : ''} aria-pressed={s.selectedDish === id} onClick={() => act({ type: 'SELECT_DISH', dish: id })}><DishSprite dish={id}/><span>{d.name}<small>{s.stock[d.pantry]} {c.stock}</small></span></button>)}</div></div>
      <div className="shift-main-actions"><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'PREPARE' }} primary detail={s.upgrade === 'counter' && s.selectedDish !== 'espresso' ? c.prepareFree : c.prepareCost}>{c.prepare} {SERVICE_DISHES[s.selectedDish].name}</ShiftActionButton><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'SERVE', orderId: target?.id }} primary detail={c.serveCost}>{c.serve} · {target ? `${c.customer} ${target.number}` : '—'}</ShiftActionButton><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'CLEAN' }} detail={c.cleanCost}>{c.clean}</ShiftActionButton></div>
      <Feedback />
      <details className="shift-restock"><summary>{c.restock} +</summary><p>{c.restockHint}</p><div className="shift-topups"><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'RESTOCK', item: 'panino' }} detail={c.restockPanino}>{c.panino}</ShiftActionButton><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'RESTOCK', item: 'coffee' }} detail={c.restockCoffee}>{c.coffee}</ShiftActionButton><ShiftActionButton state={s} act={act} copy={c} action={{ type: 'DISCARD' }} detail={c.discardCost}>{c.discard}</ShiftActionButton></div></details>
      <div className="shift-close-row"><p>{c.closeHint}</p><button className="shift-text-button" onClick={() => setClosePrompt(true)}>{c.closeDay} →</button></div>
    </div>}
    {s.phase === 'summary' && <div className="shift-day-summary"><div className="shift-receipt"><div className="shift-receipt-flowers" aria-hidden="true">* * *</div><p className="shift-eyebrow">ITALIA UNO · {c.day} {s.day}</p><h3>{c.dailyTitle}</h3><div className="shift-receipt-result"><strong>{s.daily.served} / {day.orders.length}</strong><span>{c.served} · {s.daily.lost} {c.missed}</span></div><dl>{[['opening', s.daily.opening], ['purchases', -s.daily.spent], ['sales', s.daily.sales], ['tips', s.daily.tips], ['overhead', -2], ['closing', s.cash]].map(([label, value]) => <div key={label}><dt>{c[label]}</dt><dd>{value > 0 && ['sales', 'tips'].includes(label) ? '+' : ''}{value}</dd></div>)}</dl><p>{c.panino}: {s.stock.panino} · {c.coffee}: {s.stock.coffee}</p><p className="shift-receipt-footer">{c.dayReview}</p></div><button className="shift-button shift-primary shift-open" onClick={() => act({ type: 'NEXT' })}>{s.day === 3 ? c.finalReview : c.nextDay} →</button></div>}
    {s.phase === 'review' && <div className="shift-final"><KeepsakeReceipt kind="owner" lang={lang} service={s} seconds={ownerSeconds} name={name} onNameChange={onNameChange} onSound={onSound}/><div className="shift-button-row"><button className="shift-button" onClick={leaveWithReceipt}>{c.return} →</button><button className="shift-button" onClick={() => { dispatch({ type: 'RESET' }); setOwnerSeconds(0); setTicket(null); onSound?.('select'); }}>{c.replay}</button></div></div>}
    <p className="shift-abstract">{c.abstract}</p>
    {closePrompt && s.phase === 'trade' && <ShiftPrompt title={c.closeConfirm} onClose={() => setClosePrompt(false)}><h3>{c.closeConfirm}</h3><p>{day.orders.length - s.daily.served - s.daily.lost} {c.closeCount}</p><p>{c.closeHint}</p><div className="shift-button-row"><button autoFocus className="shift-button shift-primary" onClick={() => setClosePrompt(false)}>{c.keepOpen}</button><button className="shift-button" onClick={() => { setClosePrompt(false); act({ type: 'CLOSE' }); }}>{c.confirmClose}</button></div></ShiftPrompt>}
    {exitPrompt && <ShiftPrompt title={c.leaveTitle} onClose={() => setExitPrompt(false)} exit><KeepsakeReceipt kind="owner" lang={lang} service={s} seconds={ownerSeconds} name={name} onNameChange={onNameChange} onSound={onSound}/><button className="outlined-button" onClick={leaveWithReceipt}>{c.return} →</button><p>{c.leaveNote}</p><button autoFocus className="shift-button" onClick={() => setExitPrompt(false)}>{c.continue}</button></ShiftPrompt>}
  </section>;
}
