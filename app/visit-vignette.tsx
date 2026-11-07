// @ts-nocheck
'use client';
import HandArrow from './hand-arrow';
import {ui,withItalian} from '../lib/locales.mjs';

import { useEffect, useRef } from 'react';
import { drawVisitVignette } from '../lib/handdrawn-scenes.mjs';
import { useSceneCamera, CameraTools } from './scene-camera';
export default function VisitVignette({ view = 'counter', lang = 'en', progress = 0, activity = 0, onBoard }) {
    const camera = useSceneCamera(view === 'table' ? 'table' : 'street');
    const mount = useRef(null), canvas = useRef(null), board = useRef(null), actionAt = useRef(0), data = useRef({ view, progress, activity });
    data.current = { view, progress, activity };
    useEffect(() => { actionAt.current = performance.now(); }, [activity]);
    useEffect(() => { let raf, last = 0, active = true; const g = canvas.current.getContext('2d'); const draw = now => { if (now - last > 95) {
        const anchors = drawVisitVignette(g, { ...data.current, time: now, reaction: data.current.activity > 0 && now - actionAt.current < 1800 });
        if (board.current && anchors.board) {
            const [x, y, w, h] = anchors.board, { scale, x: ox, y: oy } = camera.projection.current;
            Object.assign(board.current.style, { left: ox + x * scale + 'px', top: oy + y * scale + 'px', width: w * scale + 'px', height: h * scale + 'px' });
        }
        last = now;
    } if (active)
        raf = requestAnimationFrame(draw); }; raf = requestAnimationFrame(draw); return () => { active = false; cancelAnimationFrame(raf); }; }, []);
    return <div className={'visit-vignette vignette-' + view} ref={mount} role="group" aria-label={ui(lang, (view === 'counter' ? 'The pixel host behind the blue counter' : 'Your café table and wall noticeboard'), (view === 'counter' ? '蓝色柜台后的像素老板' : '餐桌与墙上布告板'))}><div className="scene-camera" ref={camera.viewport} tabIndex={view === 'table' ? 0 : undefined} aria-label={ui(lang, 'Drag left or right to explore the scene', '左右拖动查看场景')} {...camera.handlers}><div className="scene-world" style={camera.worldStyle}><canvas width="1280" height="840" ref={canvas} style={camera.canvasStyle} aria-hidden="true"/>{onBoard && <button ref={board} className="noticeboard-target" aria-label={ui(lang, 'Wall map', '墙上地图')} onClick={onBoard}><span>{ui(lang, 'Explore the noticeboard', '看看布告板')} <HandArrow/></span></button>}</div></div>{view === 'table' && <CameraTools camera={camera} lang={lang} kind="table"/>}</div>;
}
