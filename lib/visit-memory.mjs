import {normaliseCustomer} from './customer-state.mjs';
// Local-only visit journal; records actual UI events, never inferred clicks.
export const DETAIL_IDS=['menu','coffee','football','map','boss','notebook','story-map'];
export const RECIPE_IDS=['italia','campagnolo','barese'];
export const cleanName=value=>Array.from(String(value??'').replace(/[\u0000-\u001f\u007f-\u009f]/g,'')).slice(0,24).join('');
const count=value=>Number.isSafeInteger(value)&&value>=0?Math.min(value,999999):0;
export const freshMemory=()=>({name:'',seconds:0,opened:{},madeRecipes:{}});
export function normaliseMemory(value){const m=value&&typeof value==='object'?value:{};return {name:cleanName(m.name),seconds:count(m.seconds),opened:Object.fromEntries(DETAIL_IDS.filter(k=>count(m.opened?.[k])).map(k=>[k,count(m.opened[k])])),madeRecipes:Object.fromEntries(RECIPE_IDS.filter(k=>count(m.madeRecipes?.[k])).map(k=>[k,count(m.madeRecipes[k])]))};}
export const hydrateVisit=s=>({...s,memory:normaliseMemory(s.memory),customer:normaliseCustomer(s.customer)});
export function remember(memory,kind,id,amount=1){const m=normaliseMemory(memory);if(kind==='name')return {...m,name:cleanName(id)};if(kind==='time')return Number.isInteger(amount)&&amount>0&&amount<=60?{...m,seconds:count(m.seconds+amount)}:m;const key=kind==='open'?'opened':kind==='make'?'madeRecipes':null;const allowed=kind==='open'?DETAIL_IDS:RECIPE_IDS;if(!key||!allowed.includes(id))return m;return {...m,[key]:{...m[key],[id]:count((m[key][id]||0)+1)}};}
