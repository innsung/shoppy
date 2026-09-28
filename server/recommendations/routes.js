import express from 'express';
import {randomUUID} from 'node:crypto';
import pool from '../db/connection.js';
import {recommend} from './engine.js';
import {getAll} from '../repository/products.js';
const router=express.Router();
const STYLES=['캐주얼','미니멀','스포티','페미닌','클래식'];
const COLORS=['검정','흰색','회색','분홍','파랑','베이지','빨강','갈색'];
const defaults={styles:['캐주얼'],colors:[],budget:150000};
const parse=v=>typeof v==='string'?JSON.parse(v):v;
router.use(async(req,res,next)=>{
  try{
    let id=req.signedCookies.shoppy_recommendation;
    if(typeof id!=='string'||!/^[\da-f-]{36}$/.test(id)){
      id=randomUUID();res.cookie('shoppy_recommendation',id,{signed:true,httpOnly:true,sameSite:'lax',maxAge:365*24*60*60*1000});
    }
    await pool.execute('INSERT IGNORE INTO recommendation_profiles (id,preferences,feedback) VALUES (?,?,?)',[id,JSON.stringify(defaults),'{}']);
    const [rows]=await pool.execute('SELECT preferences,feedback FROM recommendation_profiles WHERE id=?',[id]);
    req.profileId=id;req.profile={preferences:parse(rows[0].preferences),feedback:parse(rows[0].feedback)};next();
  }catch(e){next(e);}
});
router.get('/profile',(req,res)=>res.json({...req.profile,styles:STYLES,colors:COLORS}));
router.get('/favorites',async(req,res,next)=>{try{
  const products=await getAll();
  res.json({items:products.filter(p=>req.profile.feedback[p.pid]==='like')});
}catch(e){next(e);}});
router.put('/preferences',async(req,res,next)=>{
  try{
    const {styles,colors,budget}=req.body;
    if(!Array.isArray(styles)||!styles.length||styles.length>5||!styles.every(s=>STYLES.includes(s))||!Array.isArray(colors)||colors.length>COLORS.length||!colors.every(c=>COLORS.includes(c))||!Number.isInteger(budget)||budget<1000||budget>1000000)return res.status(400).json({message:'스타일을 선택하고 예산을 1,000~1,000,000원으로 입력해주세요.'});
    const preferences={styles:[...new Set(styles)],colors:[...new Set(colors)],budget};
    await pool.execute('UPDATE recommendation_profiles SET preferences=? WHERE id=?',[JSON.stringify(preferences),req.profileId]);res.json({preferences});
  }catch(e){next(e);}
});
router.post('/feedback',async(req,res,next)=>{
  try{
    const {pid,action}=req.body;
    if(!Number.isInteger(pid)||!['like','dislike','clear'].includes(action))return res.status(400).json({message:'올바른 상품과 피드백을 선택해주세요.'});
    const [items]=await pool.execute('SELECT pid FROM recommendation_tags WHERE pid=?',[pid]);
    if(!items.length)return res.status(404).json({message:'상품을 찾을 수 없습니다.'});
    const path=`$."${pid}"`;
    if(action==='clear')await pool.execute('UPDATE recommendation_profiles SET feedback=JSON_REMOVE(feedback,?) WHERE id=?',[path,req.profileId]);
    else await pool.execute('UPDATE recommendation_profiles SET feedback=JSON_SET(feedback,?,?) WHERE id=?',[path,action,req.profileId]);
    res.json({ok:true});
  }catch(e){next(e);}
});
router.delete('/feedback',async(req,res,next)=>{try{await pool.execute('UPDATE recommendation_profiles SET feedback=? WHERE id=?',['{}',req.profileId]);res.json({ok:true});}catch(e){next(e);}});
router.get('/',async(req,res,next)=>{try{res.json(await recommend(req.profile.preferences,req.profile.feedback));}catch(e){next(e);}});
router.get('/similar/:pid',async(req,res,next)=>{try{
  const pid=Number(req.params.pid);if(!Number.isInteger(pid)||pid<1)return res.status(400).json({message:'올바른 상품 번호가 필요합니다.'});
  res.json(await recommend(req.profile.preferences,req.profile.feedback,pid));
}catch(e){next(e);}});
router.use((err,req,res,next)=>{console.error('Recommendation request failed:',err.message);res.status(err.status||503).json({message:err.status===404?err.message:'추천 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'});});
export default router;
