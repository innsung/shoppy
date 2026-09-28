import {useEffect,useMemo,useRef,useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {axiosGet} from '@/utils/dataFetch.js';
import '@/styles/recommendations.css';

export default function Products(){
  const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
  const [params,setParams]=useSearchParams();
  const category=params.get('category')||'전체',sort=params.get('sort')||'default';
  const search=params.get('q')||'';
  const [searchDraft,setSearchDraft]=useState(search);
  const composing=useRef(false);
  useEffect(()=>setSearchDraft(search),[search]);
  useEffect(()=>{let active=true;setLoading(true);setError('');axiosGet('/products').then(data=>{if(active)setProducts(data);}).catch(()=>{if(active)setError('상품을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[attempt]);
  const categories=['전체',...new Set(products.map(p=>p.category))];
  const filtered=useMemo(()=>{
    const list=products.filter(p=>(category==='전체'||p.category===category)&&`${p.name} ${p.category} ${p.styles.join(' ')} ${p.colors.join(' ')}`.toLowerCase().includes(searchDraft.trim().toLowerCase()));
    if(sort==='low')list.sort((a,b)=>a.price-b.price||a.pid-b.pid);
    if(sort==='high')list.sort((a,b)=>b.price-a.price||a.pid-b.pid);
    return list;
  },[products,category,sort,searchDraft]);
  function update(key,value){const next=new URLSearchParams(params);if(value&&value!=='전체'&&value!=='default')next.set(key,value);else next.delete(key);setParams(next,{replace:true});}
  return <section className="rec-shell products-shell" aria-label="전체 상품">
    <div className="rec-heading"><div><span className="rec-eyebrow">SHOPPY · COLLECTION</span><h2>취향을 발견하는 쇼핑</h2><p>카테고리별로 둘러보고, 마음에 드는 상품을 찾아보세요.</p></div><Link className="rec-ai-badge products-ai-link" to="/recommendations">AI 추천받기 →</Link></div>
    <div className="products-filters"><div className="rec-chips" role="group" aria-label="상품 카테고리">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>update('category',c)}>{c} <span>{c==='전체'?products.length:products.filter(p=>p.category===c).length}</span></button>)}</div>
      <div className="products-tools"><form className="catalog-search" role="search" onSubmit={e=>{e.preventDefault();if(!composing.current)update('q',searchDraft.trim());}}><label htmlFor="catalog-search">상품 검색</label><div><input id="catalog-search" type="search" value={searchDraft} placeholder="어떤 상품을 찾으세요?" onChange={e=>setSearchDraft(e.target.value)} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={e=>{composing.current=false;setSearchDraft(e.currentTarget.value);}} onKeyDown={e=>{if(e.key==='Enter'&&(composing.current||e.nativeEvent.isComposing||e.keyCode===229))e.preventDefault();}}/><button type="submit">검색</button></div></form><label>정렬<select value={sort} onChange={e=>update('sort',e.target.value)}><option value="default">기본순</option><option value="low">낮은 가격순</option><option value="high">높은 가격순</option></select></label></div>
    </div>
    {loading?<p role="status" className="rec-notice">상품을 불러오고 있어요…</p>:error?<div className="rec-alert" role="alert">{error} <button onClick={()=>setAttempt(n=>n+1)}>다시 시도</button></div>:<>
      <div className="rec-results-heading"><h3>{category==='전체'?'전체 상품':category} <span>{filtered.length}</span></h3><p role="status">{filtered.length}개의 상품</p></div>
      {filtered.length?<div className="rec-grid">{filtered.map(p=><article className="rec-card" key={p.pid}>
        <Link className="rec-image" to={`/products/${p.pid}`}><img src={p.image} alt={p.name} loading="lazy"/>{!!p.sample&&<span>시연용 샘플</span>}</Link>
        <div className="rec-card-body"><small>{p.category} · {p.styles.join(' / ')}</small><Link className="rec-product-name" to={`/products/${p.pid}`}>{p.name}</Link><strong>{Number(p.price).toLocaleString('ko-KR')}원</strong><div className="products-tags">{p.colors.map(c=><span key={c}>{c}</span>)}</div><Link className="products-detail-link" to={`/products/${p.pid}`}>상품 자세히 보기 →</Link></div>
      </article>)}</div>:<div className="rec-empty"><h3>검색 결과가 없어요.</h3><p>다른 검색어나 카테고리를 선택해주세요.</p><button onClick={()=>setParams({})}>전체 상품 보기</button></div>}
    </>}
  </section>;
}
