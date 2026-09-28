import {useEffect,useState} from 'react';
import ProductTile from '@/components/product/ProductTile.jsx';
import { Link } from 'react-router-dom';
import {axiosGet} from '@/utils/dataFetch.js';

export default function Home() {
  const [products,setProducts]=useState([]),[error,setError]=useState(false);
  useEffect(()=>{let active=true;axiosGet('/products').then(p=>{if(active)setProducts(p);}).catch(()=>{if(active)setError(true);});return()=>{active=false;};},[]);
  const featured=[8,20,24,26].map(id=>products.find(p=>p.pid===id)).filter(Boolean);
  return (
    <div className="home-page">
      <section className="shop-hero"><div className="hero-copy"><span className="rec-eyebrow">EVERYDAY, YOUR WAY</span><h1>취향이 되는<br/>작은 발견.</h1><p>매일 입고 싶은 옷부터 오래 곁에 둘 소품까지.<br/>지금의 나에게 어울리는 것들을 만나보세요.</p><div className="hero-links"><Link className="shop-button" to="/products">컬렉션 둘러보기 <span>↗</span></Link><Link to="/recommendations">내 취향으로 추천받기 →</Link></div><span className="hero-caption">A considered collection for your everyday.</span></div><div className="hero-visual"><div className="hero-circle"/><img className="hero-shirt" src="/images/catalog/dummyjson-83.webp" alt="블루 블랙 체크 셔츠"/><img className="hero-bag" src="/images/catalog/dummyjson-175.webp" alt="화이트 백팩"/><div className="hero-label"><span>THE DAILY EDIT</span><strong>가볍게, 나답게.</strong></div></div></section>
      <section className="home-section"><div className="section-heading"><div><span className="rec-eyebrow">CURATED SELECTION</span><h2>오늘의 셀렉션</h2></div><Link to="/products">전체 상품 보기 ↗</Link></div><p className="section-description">서로 다른 무드, 하나의 일상. 먼저 만나볼 네 가지 아이템.</p>{error?<p role="alert">상품을 불러오지 못했습니다. 새로고침 후 다시 확인해주세요.</p>:!featured.length?<p role="status">컬렉션을 불러오는 중…</p>:<div className="rec-grid">{featured.map(p=><ProductTile key={p.pid} product={p}/>)}</div>}</section>
      <section className="home-discovery"><div><span className="rec-eyebrow">MADE FOR YOUR TASTE</span><h2>찾는 시간을 줄이고,<br/>좋아하는 것을 더 많이.</h2><p>스타일과 예산을 알려주면 AI가 당신의 취향에 가까운 상품을 골라드려요.</p></div><Link className="shop-button" to="/recommendations">나만의 추천 만나보기 ↗</Link></section>
      <section className="home-section home-categories"><div className="section-heading"><h2>어디부터 둘러볼까요?</h2></div><div>{['상의','원피스','가방','신발'].map((name,i)=><Link key={name} to={`/products?category=${encodeURIComponent(name)}`}><small>0{i+1}</small><strong>{name}</strong><span>↗</span></Link>)}</div></section>
    </div>
  );
}
