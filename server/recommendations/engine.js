import {pipeline,env} from '@huggingface/transformers';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import pool from '../db/connection.js';

export const MODEL='Xenova/paraphrase-multilingual-MiniLM-L12-v2';
// Conservative demo policy, not an empirically calibrated accuracy threshold.
export const MIN_SEMANTIC_SCORE=0.50;
export const MIN_SIMILAR_SCORE=0.65;
env.cacheDir='./.cache/models';
let extractorPromise, catalogPromise, catalogKey;
const queries=new Map();
function extractor(){return extractorPromise ??= pipeline('feature-extraction',MODEL,{dtype:'q8'}).catch(e=>{extractorPromise=null;throw e;});}
export async function embed(texts){const model=await extractor(); return (await model(texts,{pooling:'mean',normalize:true})).tolist();}
const parse=v=>typeof v==='string'?JSON.parse(v):v;
export const cosine=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
export function normalize(v){const length=Math.hypot(...v);return v.map(x=>length?x/length:0);}
export async function catalog(){
  const [rows]=await pool.query(`SELECT p.pid,p.name,p.price,p.image,t.styles,t.colors,t.category,t.season,t.description,t.sample_key FROM product p JOIN recommendation_tags t ON t.pid=p.pid ORDER BY p.pid`);
  const products=rows.map(p=>({...p,price:Number(p.price),image:`/images/${p.image}`,styles:parse(p.styles),colors:parse(p.colors),sample:!!p.sample_key}));
  const texts=products.map(p=>`${p.styles.join(' ')} 스타일의 ${p.colors.join(' ')} 색상 ${p.category}. ${p.description.split('.')[0]}. ${p.season}.`);
  const key=createHash('sha256').update(JSON.stringify([MODEL,'mean-normalized-q8-v1',products.map(p=>p.pid),texts])).digest('hex');
  if(key!==catalogKey || !catalogPromise){
    catalogKey=key;
    catalogPromise=(async()=>{
      const file=`./.cache/catalog-${key}.json`;
      let vectors;
      try{vectors=JSON.parse(await fs.readFile(file,'utf8'));}catch{
        vectors=[];
        for(let i=0;i<texts.length;i+=8)vectors.push(...await embed(texts.slice(i,i+8)));
        await fs.mkdir('./.cache',{recursive:true});await fs.writeFile(file,JSON.stringify(vectors));
      }
      return vectors;
    })().catch(e=>{catalogPromise=null;throw e;});
  }
  const vectors=await catalogPromise;
  return products.map((p,i)=>({...p,vector:vectors[i]}));
}
async function queryVector(preferences){
  const text=`${preferences.styles.join(' ')} 스타일의 ${preferences.colors.join(' ')} 색상 옷을 선호합니다.`;
  if(!queries.has(text)){
    if(queries.size>=100)queries.delete(queries.keys().next().value);
    queries.set(text,embed([text]).then(v=>v[0]).catch(e=>{queries.delete(text);throw e;}));
  }return queries.get(text);
}
export function rank(products,vector,preferences,feedback,excludeId){
  const source=excludeId?products.find(p=>p.pid===excludeId):null;
  return products.filter(p=>p.pid!==excludeId&&p.price<=preferences.budget&&feedback[p.pid]!=='dislike')
    .filter(p=>source
      ? p.category===source.category&&p.styles.some(s=>source.styles.includes(s))
      : p.styles.some(s=>preferences.styles.includes(s))&&(!preferences.colors.length||p.colors.some(c=>preferences.colors.includes(c))))
    .map(p=>{
      const reasons=[];
      const styles=p.styles.filter(x=>preferences.styles.includes(x));
      const colors=p.colors.filter(x=>preferences.colors.includes(x));
      if(styles.length)reasons.push(`${styles.join('·')} 스타일 일치`);
      if(colors.length)reasons.push(`선호 색상 ${colors.join('·')} 일치`);
      reasons.push(`예산 ${preferences.budget.toLocaleString('ko-KR')}원 이내`);
      const {vector:v,sample_key,...product}=p;
      const semanticScore=cosine(vector,v);
      const styleMatch=styles.length/preferences.styles.length;
      const colorMatch=preferences.colors.length?colors.length/preferences.colors.length:0;
      const score=excludeId?semanticScore:0.7*semanticScore+(preferences.colors.length?0.2:0.3)*styleMatch+0.1*colorMatch;
      return {...product,score,semanticScore,reasons,feedback:feedback[p.pid]||null};
    }).filter(p=>p.semanticScore>=(source?MIN_SIMILAR_SCORE:MIN_SEMANTIC_SCORE))
    .sort((a,b)=>b.score-a.score||a.pid-b.pid);
}
export async function recommend(preferences,feedback={},similarId){
  const products=await catalog();
  let vector;
  if(similarId){
    const source=products.find(p=>p.pid===similarId);
    if(!source){const e=new Error('상품을 찾을 수 없습니다.');e.status=404;throw e;}
    vector=source.vector;
  }else{
    vector=await queryVector(preferences);
    const liked=products.filter(p=>feedback[p.pid]==='like');
    if(liked.length){const mean=normalize(vector.map((_,i)=>liked.reduce((s,p)=>s+p.vector[i],0)/liked.length));vector=normalize(vector.map((v,i)=>0.65*v+0.35*mean[i]));}
  }
  const qualified=rank(products,vector,preferences,feedback,similarId);
  return {items:similarId?qualified.slice(0,4):qualified,qualifiedCount:qualified.length,totalProducts:products.length,model:MODEL,feedbackApplied:!similarId&&Object.values(feedback).includes('like')};
}
