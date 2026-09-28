import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {recommendationApi as api} from '@/utils/recommendationApi.js';
import {useFavoriteStore} from '@/store/favoriteStore.js';
import '@/styles/recommendations.css';

const money=n=>Number(n).toLocaleString('ko-KR');
const errorText=e=>e.response?.data?.message||'연결을 확인하고 다시 시도해주세요.';

function Cards({items,busy,onFeedback}){
  return <div className="rec-grid">{items.map(p=><article className="rec-card" key={p.pid}>
    <Link className="rec-image" to={`/products/${p.pid}`}><img src={p.image} alt={p.name} loading="lazy"/>{p.sample&&<span>시연용 샘플</span>}</Link>
    <div className="rec-card-body"><small>{p.category} · {p.styles.join(' / ')}</small>
      <Link className="rec-product-name" to={`/products/${p.pid}`}>{p.name}</Link><strong>{money(p.price)}원</strong>
      <ul className="rec-reasons">{p.reasons.map(r=><li key={r}>{r}</li>)}</ul>
      <div className="rec-actions"><button disabled={busy} aria-pressed={p.feedback==='like'} onClick={()=>onFeedback(p.pid,p.feedback==='like'?'clear':'like')}>{p.feedback==='like'?'♥ 좋아요 취소':'♡ 좋아요'}</button><button disabled={busy} aria-pressed={p.feedback==='dislike'} onClick={()=>onFeedback(p.pid,p.feedback==='dislike'?'clear':'dislike')}>{p.feedback==='dislike'?'관심 없음 취소':'관심 없음'}</button></div>
    </div>
  </article>)}</div>;
}

export default function Recommendations({similarId}){
  const setFavoriteCount=useFavoriteStore(s=>s.setCount);
  const [profile,setProfile]=useState(null),[draft,setDraft]=useState(null),[result,setResult]=useState(null);
  const [busy,setBusy]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[revision,setRevision]=useState(0);
  const [saving,setSaving]=useState(false);
  useEffect(()=>{if(profile)setFavoriteCount(Object.values(profile.feedback).filter(value=>value==='like').length);},[profile,setFavoriteCount]);
  useEffect(()=>{
    let active=true;const controller=new AbortController();
    setBusy(true);setError('');setResult(null);
    (async()=>{
      try{
        const {data:p}=await api.get('/profile',{signal:controller.signal});
        if(!active)return;setProfile(p);setDraft(p.preferences);
        const {data:r}=await api.get(similarId?`/similar/${similarId}`:'/',{signal:controller.signal});
        if(active)setResult(r);
      }catch(e){if(active&&!axios.isCancel(e))setError(errorText(e));}
      finally{if(active)setBusy(false);}
    })();
    return()=>{active=false;controller.abort();};
  },[similarId,revision]);
  const toggle=(key,value)=>setDraft(d=>({...d,[key]:d[key].includes(value)?d[key].filter(x=>x!==value):[...d[key],value]}));
  async function refresh(){const {data:p}=await api.get('/profile');setProfile(p);const {data:r}=await api.get(similarId?`/similar/${similarId}`:'/');setResult(r);}
  async function save(e){e.preventDefault();setBusy(true);setError('');setNotice('');
    try{await api.put('/preferences',draft);await refresh();setNotice('취향을 저장하고 추천을 업데이트했습니다.');}
    catch(e){setError(errorText(e));setResult(null);}finally{setBusy(false);}
  }
  async function feedback(pid,action){setSaving(true);setError('');setNotice('');
    try{await api.post('/feedback',{pid,action});
      setProfile(p=>{const feedback={...p.feedback};if(action==='clear')delete feedback[pid];else feedback[pid]=action;return {...p,feedback};});
      setResult(r=>({...r,items:r.items.map(p=>p.pid===pid?{...p,feedback:action==='clear'?null:action}:p)}));
      setNotice('저장했습니다. 현재 목록은 유지되며, 새로고침(F5)하면 추천에 반영됩니다.');}
    catch(e){setError(errorText(e));}finally{setSaving(false);}
  }
  async function reset(){setSaving(true);setError('');try{await api.delete('/feedback');setProfile(p=>({...p,feedback:{}}));setResult(r=>({...r,items:r.items.map(p=>({...p,feedback:null}))}));setNotice('기록을 초기화했습니다. 새로고침(F5)하면 추천에 반영됩니다.');}catch(e){setError(errorText(e));}finally{setSaving(false);}}
  const likes=Object.values(profile?.feedback||{}).filter(x=>x==='like').length;
  const hidden=Object.values(profile?.feedback||{}).filter(x=>x==='dislike').length;
  return <section className={`rec-shell ${similarId?'rec-similar':''}`} aria-label={similarId?'비슷한 상품 추천':'맞춤 상품 추천'} aria-busy={busy}>
    <div className="rec-heading"><div><span className="rec-eyebrow">SHOPPY · FOR YOU</span><h2>{similarId?'함께 둘러볼 비슷한 상품':'내 취향에 가까운 발견'}</h2><p>{similarId?'현재 상품과 유사한 상품을 내 예산 안에서 골랐어요.':'좋아하는 스타일과 예산을 알려주세요. AI가 어울리는 상품을 찾아드려요.'}</p></div><span className="rec-ai-badge">AI 추천</span></div>
    {!similarId&&draft&&<form className="rec-preferences" onSubmit={save}>
      <fieldset disabled={busy||saving}><legend>01 좋아하는 스타일 <small>여러 개 선택 가능</small></legend><div className="rec-chips">{profile.styles.map(s=><button key={s} type="button" aria-pressed={draft.styles.includes(s)} onClick={()=>toggle('styles',s)}>{s}</button>)}</div></fieldset>
      <fieldset disabled={busy||saving}><legend>02 선호하는 색상 <small>선택하지 않으면 전체</small></legend><div className="rec-chips">{profile.colors.map(c=><button key={c} type="button" aria-pressed={draft.colors.includes(c)} onClick={()=>toggle('colors',c)}>{c}</button>)}</div></fieldset>
      <div className="rec-budget"><label htmlFor="rec-budget">03 상품당 최대 예산</label><div><input id="rec-budget" type="number" min="1000" max="1000000" step="1000" required disabled={busy||saving} value={draft.budget} onChange={e=>setDraft(d=>({...d,budget:Number(e.target.value)}))}/><span>원</span></div><button className="rec-submit" disabled={busy||saving||!draft.styles.length}>취향 저장하고 추천받기</button></div>
      <p className="rec-storage">선택한 스타일·색상에 해당하고 예산 안에 있는 상품 중, 유사도 기준을 통과한 상품만 추천합니다. 취향은 이 브라우저 기준으로 저장됩니다.</p>
    </form>}
    {error&&<div className="rec-alert" role="alert">{error} <button disabled={busy} onClick={()=>setRevision(v=>v+1)}>다시 시도</button></div>}
    <p className="rec-notice" role="status">{busy?'취향에 맞는 상품을 고르고 있어요…':saving?'저장 중…':notice}</p>
    {result&&<><div className="rec-results-heading"><div><h3>{similarId?'비슷한 상품':'당신을 위한 추천'} <span>{result.items.length}</span></h3><p>{result.feedbackApplied?'좋아요한 상품의 취향을 함께 반영했어요.':'스타일과 상품 설명의 유사도를 바탕으로 골랐어요.'}</p></div>{!similarId&&<div className="rec-feedback-summary"><Link to="/favorites">좋아요한 상품 {likes} →</Link><span>관심 없음 {hidden}</span><button disabled={busy||saving||(!likes&&!hidden)} onClick={reset}>피드백 초기화</button></div>}</div>
      <p className="rec-quality-note">{similarId?`비슷한 카테고리와 유사도 기준을 통과한 ${result.qualifiedCount}개 중 최대 4개를 보여드려요.`:`전체 ${result.totalProducts}개 중 취향과 유사도 기준을 통과한 ${result.qualifiedCount}개예요. 관련 없는 상품으로 개수를 채우지 않아요.`}</p>
      {result.items.length?<Cards items={result.items} busy={busy||saving} onFeedback={feedback}/>:<div className="rec-empty"><h3>추천 기준에 맞는 상품이 없어요.</h3><p>스타일·색상 선택을 넓히거나, 예산 또는 관심 없음 기록을 조정해보세요.</p>{similarId&&<Link to="/recommendations">취향과 예산 변경하기 →</Link>}</div>}
    </>}
    {similarId&&<Link className="rec-more" to="/recommendations">내 취향으로 더 찾아보기 →</Link>}
  </section>;
}
