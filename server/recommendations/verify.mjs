import assert from 'node:assert/strict';
import pool from '../db/connection.js';
import {rank,MIN_SEMANTIC_SCORE} from './engine.js';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='http://localhost:9000/recommendations';
const ids=[];
function client(){let cookie='';return async(path='',method='GET',body)=>{
  const res=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});
  const set=res.headers.get('set-cookie');if(set){cookie=set.split(';')[0];const value=decodeURIComponent(cookie.split('=').slice(1).join('='));const id=value.slice(2).split('.')[0];if(/^[\da-f-]{36}$/.test(id))ids.push(id);}
  return {status:res.status,data:await res.json()};
};}
try{
  const item={name:'test',price:10000,styles:['캐주얼'],colors:['분홍'],category:'상의'};
  const synthetic=[{...item,pid:1,vector:[1,0]},{...item,pid:2,vector:[0,1]},{...item,pid:3,styles:['클래식'],vector:[1,0]}];
  assert.deepEqual(rank(synthetic,[1,0],{styles:['캐주얼'],colors:['분홍'],budget:30000},{},undefined).map(p=>p.pid),[1]);
  console.log('PASS semantically unrelated and wrong-style candidates rejected without filler');
  const a=client(),b=client();
  assert.equal((await a('/profile')).status,200);
  assert.equal((await a('/preferences','PUT',{styles:['캐주얼'],colors:['분홍'],budget:30000})).status,200);
  assert.equal((await a('/profile')).data.preferences.budget,30000);
  assert.equal((await b('/profile')).data.preferences.budget,150000);
  console.log('PASS saved preferences and separate browser profiles');
  const first=(await a()).data;
  assert.equal(first.totalProducts,28);assert.ok(first.items.length>0);assert.ok(first.items.every(p=>p.price<=30000));
  assert.ok(first.items[0].styles.includes('캐주얼'));assert.ok(first.items[0].colors.includes('분홍'));
  assert.equal(first.items.length,1);assert.equal(first.qualifiedCount,first.items.length);
  assert.ok(first.items.every(p=>p.semanticScore>=MIN_SEMANTIC_SCORE));
  for(const p of first.items){if(p.reasons.some(r=>r.includes('색상')))assert.ok(p.colors.includes('분홍'));}
  console.log('PASS real model results, strict budget and factual reasons');
  const before=first.items.map(p=>[p.pid,p.score]);
  await a('/feedback','POST',{pid:2,action:'like'});
  const liked=(await a()).data;assert.equal(liked.feedbackApplied,true);
  assert.notDeepEqual(liked.items.map(p=>[p.pid,p.score]),before);
  assert.equal((await a('/profile')).data.feedback['2'],'like');
  const favorites=(await a('/favorites')).data.items;
  assert.ok(favorites.some(p=>p.pid===2));assert.ok((await b('/favorites')).data.items.every(p=>p.pid!==2));
  console.log('PASS DB-backed favorites persist and are isolated by browser profile');
  const hidden=liked.items[0].pid;await a('/feedback','POST',{pid:hidden,action:'dislike'});
  assert.ok((await a()).data.items.every(p=>p.pid!==hidden));
  const similar=(await a('/similar/1')).data;
  assert.ok(similar.items.every(p=>p.pid!==1&&p.pid!==hidden&&p.price<=30000));
  console.log('PASS likes affect scoring; hidden and current products excluded');
  assert.equal((await a('/preferences','PUT',{styles:[],colors:[],budget:-1})).status,400);
  assert.equal((await a('/feedback','POST',{pid:'1; DROP TABLE product',action:'like'})).status,400);
  assert.equal((await a('/similar/999999')).status,404);
  await a('/preferences','PUT',{styles:['미니멀'],colors:[],budget:1000});
  assert.equal((await a()).data.items.length,0);
  await a('/feedback','DELETE');assert.deepEqual((await a('/profile')).data.feedback,{});assert.deepEqual((await a('/favorites')).data.items,[]);
  console.log('PASS invalid input, empty result and feedback reset');
  for(const pid of [1,7,8,28]){const r=await fetch(`http://localhost:9000/products/${pid}`);assert.equal(r.status,200);const p=await r.json();assert.ok(p.detailInfo);assert.ok(Array.isArray(p.imgList));}
  console.log('PASS original and demo product detail endpoints');
  const response=await fetch('http://localhost:9000/products');const all=await response.json();
  assert.equal(all.length,28);assert.ok(all.every(p=>Array.isArray(p.styles)&&Array.isArray(p.colors)&&p.category&&typeof p.price==='number'));
  const hashes=await Promise.all(all.map(async p=>createHash('sha256').update(await fs.readFile('../front/public'+p.image)).digest('hex')));
  assert.equal(new Set(hashes).size,28);
  await a('/preferences','PUT',{styles:['미니멀'],colors:[],budget:50000});const minimal=(await a()).data.items;
  await a('/preferences','PUT',{styles:['페미닌'],colors:[],budget:100000});const feminine=(await a()).data.items;
  assert.notEqual(minimal.length,feminine.length);assert.ok(minimal.every(p=>p.styles.includes('미니멀')));assert.ok(feminine.every(p=>p.styles.includes('페미닌')));
  console.log(`PASS 28 unique images, typed catalog fields and variable qualified counts (${minimal.length}, ${feminine.length})`);
}finally{
  for(const id of ids)await pool.execute('DELETE FROM recommendation_profiles WHERE id=?',[id]);
  await pool.end();
}
