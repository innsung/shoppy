import {Link} from 'react-router-dom';
export default function ProductTile({product:p,children}){return <article className="rec-card">
  <Link className="rec-image" to={`/products/${p.pid}`}><img src={p.image} alt={p.name} loading="lazy"/>{!!p.sample&&<span>시연용 샘플</span>}</Link>
  <div className="rec-card-body"><small>{p.category} · {p.styles?.join(' / ')}</small><Link className="rec-product-name" to={`/products/${p.pid}`}>{p.name}</Link><strong>{Number(p.price).toLocaleString('ko-KR')}원</strong>{children}</div>
</article>;}
