// @ts-nocheck
'use client';
import {ui,withItalian} from '../lib/locales.mjs';

import PixelHost from './pixel-host';
export function CafePages({ lang, phase, active, onRoom, onResume, onReceipt }) {
    const zh = lang === 'zh', receipt = ['checkout', 'goodbye', 'complete'].includes(phase);
    const items = [
        withItalian({ key: 'room', en: 'Café interior', zh: '店内探索', enabled: true, click: onRoom }),
        withItalian({ key: 'ordering', en: 'Order counter', zh: '点单柜台', enabled: phase === 'ordering', click: onResume }),
        withItalian({ key: 'eating', en: 'My table', zh: '餐桌用餐', enabled: phase === 'eating', click: onResume }),
        withItalian({ key: 'receipt', en: 'Receipt', zh: '结账小票', enabled: receipt, click: onReceipt })
    ];
    return <nav className="cafe-pages" aria-label={ui(lang, 'Café pages', '独立交互页面')}>{items.map((item, i) => item.enabled ? <button key={item.key} className={active === item.key ? 'current' : ''} aria-current={active === item.key ? 'page' : undefined} onClick={item.click}><small>{String(i + 1).padStart(2, '0')}</small><span>{ui(lang, item.en, item.zh)}</span></button> : <span className="cafe-page-later" key={item.key}><small>{String(i + 1).padStart(2, '0')}</small><span>{ui(lang, item.en, item.zh)}</span></span>)}</nav>;
}
export function RoomGuide({ lang, phase, onResume, onPause }) {
    const zh = lang === 'zh', resume = ui(lang, { ordering: 'Back to my order', eating: 'Back to my table', checkout: 'Continue to checkout', goodbye: 'Continue to say ciao' }, { ordering: '继续我的点单', eating: '回到我的餐桌', checkout: '继续结账', goodbye: '继续与老板道别' });
    return <section className="dialogue room-guide" aria-label={ui(lang, 'Café interior guide', '店内探索向导')}><div className="customer-host-art" aria-hidden="true"><PixelHost /></div><div className="dialogue-copy"><div className="speaker-label">{ui(lang, 'CAFÉ INTERIOR · LOOK AROUND', '店内探索 · 自由看看')}</div><h2>{ui(lang, 'A little café, full of discoveries.', '店里的小细节，都还在这里。')}</h2><p>{ui(lang, 'Explore the menu, coffee corner, football wall, map or the boss. Your order and progress are saved.', '看看菜单、咖啡角、足球墙、地图或老板。你的订单与探店进度会保留。')}</p></div><div className="dialogue-actions"><button className="primary" onClick={onResume}>{resume[phase] || (ui(lang, 'Continue my visit', '继续探店'))} →</button><button className="quiet" onClick={onPause}>{ui(lang, 'Back to the street', '回到店外')}</button></div></section>;
}
