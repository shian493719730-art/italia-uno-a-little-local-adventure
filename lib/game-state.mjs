import {freshMemory,remember} from './visit-memory.mjs';
import {initialCustomer,reduceCustomer} from './customer-state.mjs';
export const RECIPES={italia:['ham','mozzarella','salad'],campagnolo:['aubergine','tomato','artichoke'],barese:['tuna','mozzarella','salad']};
export const initial=()=>({version:1,screen:'outside',stamps:[],selected:null,ingredients:[],made:false,avatar:'blue',note:'',memory:freshMemory(),customer:initialCustomer()});
export function validSave(s){return s?.version===1&&['outside','inside'].includes(s.screen)&&Array.isArray(s.stamps)&&s.stamps.every(x=>['character','flavour','neighbourhood'].includes(x))&&Array.isArray(s.ingredients)&&s.ingredients.every(x=>Object.values(RECIPES).flat().includes(x))&&['blue','red','green'].includes(s.avatar)&&typeof s.note==='string'&&s.note.length<=160&&(s.selected===null||Object.keys(RECIPES).includes(s.selected));}
export function ready(s){return !!s.selected&&RECIPES[s.selected].length===s.ingredients.length&&RECIPES[s.selected].every(x=>s.ingredients.includes(x));}
export function complete(s){return ['character','flavour','neighbourhood'].every(x=>s.stamps.includes(x));}
const stamp=(s,id)=>s.stamps.includes(id)?s:{...s,stamps:[...s.stamps,id]};
export function reduce(s,a){
 switch(a.type){
 case 'ENTER':return s.screen==='inside'?s:{...s,screen:'inside'};
 case 'OUTSIDE':return {...s,screen:'outside'};
 case 'AVATAR':return ['blue','red','green'].includes(a.value)?{...s,avatar:a.value}:s;
 case 'NOTE':return {...s,note:String(a.value).slice(0,160)};
 case 'RESET':return initial();
 case 'NICKNAME':return {...s,memory:remember(s.memory,'name',a.value)};
 }
 if(s.screen!=='inside')return s;
 switch(a.type){
 case 'VISIT_TICK':return {...s,memory:remember(s.memory,'time',null,a.seconds)};
 case 'CUSTOMER':return {...s,customer:reduceCustomer(s.customer||initialCustomer(),a.action)};
 case 'OPEN_DETAIL':return {...s,memory:remember(s.memory,'open',a.id)};
 case 'DISCOVER':return ['football','coffee'].includes(a.id)?stamp(s,'character'):s;
 case 'SELECT':return RECIPES[a.id]?{...s,selected:a.id,ingredients:[],made:false}:s;
 case 'INGREDIENT':return !s.made&&s.selected&&Object.values(RECIPES).flat().includes(a.id)?{...s,ingredients:s.ingredients.includes(a.id)?s.ingredients.filter(x=>x!==a.id):[...s.ingredients,a.id]}:s;
 case 'MAKE':return !s.made&&ready(s)?stamp({...s,made:true,memory:remember(s.memory,'make',s.selected)},'flavour'):s;
 case 'PIN':return stamp(s,'neighbourhood');
 default:return s;
 }
}
