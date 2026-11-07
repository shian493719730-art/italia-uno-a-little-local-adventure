// @ts-nocheck
'use client';
import {ui,withItalian} from '../lib/locales.mjs';

import { useEffect, useRef } from 'react';
import { drawCafe } from '../lib/handdrawn-scenes.mjs';
import { useSceneCamera, CameraTools } from './scene-camera';
export default function CafeScene({ inside, avatar, onHotspot, onEnter, labels, served, action, mealProgress = 0, dining = false, lang = 'en' }) {
    const camera = useSceneCamera(inside ? 'room' : 'street');
    const mount = useRef(null), canvas = useRef(null), refs = useRef({}), data = useRef({ inside, avatar, served, action, mealProgress, dining });
    data.current = { inside, avatar, served, action, mealProgress, dining };
    useEffect(() => { const c = canvas.current, g = c.getContext('2d', { alpha: true }); let raf, last = 0, active = true; const render = now => { if (now - last > 90) {
        const anchors = drawCafe(g, { ...data.current, time: now });
        const { scale, x, y, worldWidth, worldHeight } = camera.projection.current;
        for (const [id, pos] of Object.entries(anchors)) {
            const b = refs.current[id];
            if (b) {
                b.style.left = Math.max(b.offsetWidth / 2 + 6, Math.min(worldWidth - b.offsetWidth / 2 - 6, x + pos[0] * scale)) + 'px';
                b.style.top = Math.max(b.offsetHeight / 2 + 8, Math.min(worldHeight - b.offsetHeight / 2 - 8, y + pos[1] * scale)) + 'px';
            }
        }
        last = now;
    } if (active)
        raf = requestAnimationFrame(render); }; raf = requestAnimationFrame(render); return () => { active = false; cancelAnimationFrame(raf); }; }, []);
    return <div className="cafe-world pixel-world" role="group" aria-label={labels.scene}>
 <div className="scene-camera" ref={camera.viewport} tabIndex={0} aria-label={ui(lang, 'Explore the scene; drag or use left and right arrow keys', '探索场景；可左右拖动或使用方向键')} {...camera.handlers}><div className="scene-world" ref={mount} style={camera.worldStyle}>
 <canvas ref={canvas} width="1280" height="840" style={camera.canvasStyle} aria-hidden="true"/>
 {!inside && <button ref={b => refs.current.welcome = b} className="hotspot h-welcome" onClick={onEnter} aria-label={labels.enter}><b>Ciao!</b><span>{labels.enter} →</span></button>}
 {inside && Object.entries(labels.hotspots).map(([id, label]) => <button key={id} ref={b => refs.current[id] = b} className={'hotspot h-' + id} aria-label={label} title={label} onClick={() => onHotspot(id)}><i className={'px-icon icon-' + id} aria-hidden="true"/><b>{label}</b></button>)}
 </div></div><CameraTools camera={camera} lang={lang} kind={inside ? 'room' : 'street'}/></div>;
}
