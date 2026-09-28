import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiHeart} from 'react-icons/fi';
import {recommendationApi as api} from '@/utils/recommendationApi.js';
import ProductTile from '@/components/product/ProductTile.jsx';
import {useFavoriteStore} from '@/store/favoriteStore.js';
export default function Favorites(){
  const setFavoriteCount=useFavoriteStore(s=>s.setCount);
  const [items,setItems]=useState([]),[busy,setBusy]=useState(true),[error,setError]=useState(''),[saving,setSaving]=useState(null),[retry,setRetry]=useState(0);
  useEffect(()=>{let active=true;setBusy(true);setError('');api.get('/favorites').then(({data})=>{if(active){setItems(data.items);setFavoriteCount(data.items.length);}}).catch(()=>{if(active)setError('좋아요한 상품을 불러오지 못했습니다.');}).finally(()=>{if(active)setBusy(false);});return()=>{active=false;};},[retry,setFavoriteCount]);
  async function remove(pid){setSaving(pid);setError('');try{await api.post('/feedback',{pid,action:'clear'});const remaining=items.filter(p=>p.pid!==pid);setItems(remaining);setFavoriteCount(remaining.length);}catch{setError('저장하지 못했습니다. 다시 시도해주세요.');}finally{setSaving(null);}}
  return <section className="rec-shell" aria-label="좋아요한 상품"><div className="rec-heading"><div><span className="rec-eyebrow">YOUR PERSONAL EDIT</span><h2>마음에 담은 것들</h2><p>좋아요한 상품을 한곳에서 다시 만나보세요.</p></div><FiHeart className="favorites-heart"/></div>
    <p className="favorites-note">같은 브라우저에서 저장한 좋아요를 다시 볼 수 있어요. 추천 조건과 관계없이 모두 모아두었습니다.</p>
    {error&&<div className="rec-alert" role="alert">{error} <button onClick={()=>setRetry(n=>n+1)}>다시 시도</button></div>}
    {busy?<p role="status">불러오는 중…</p>:<><div className="rec-results-heading"><h3>좋아요한 상품 <span>{items.length}</span></h3><Link to="/recommendations">새로운 취향 발견하기 →</Link></div>{items.length?<div className="rec-grid">{items.map(p=><ProductTile key={p.pid} product={p}><button className="favorite-remove" disabled={saving!==null} onClick={()=>remove(p.pid)}><FiHeart fill="currentColor"/> {saving===p.pid?'저장 중…':'좋아요 취소'}</button></ProductTile>)}</div>:<div className="rec-empty"><FiHeart size={30}/><h3>아직 마음에 담은 상품이 없어요.</h3><p>AI 추천에서 마음에 드는 상품에 좋아요를 눌러보세요.</p><Link className="shop-button" to="/recommendations">추천 상품 둘러보기</Link></div>}</>}
  </section>;
}
