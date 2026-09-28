
import {Link} from 'react-router-dom';
import Brand from './Brand.jsx';
export default function Footer(){return <footer className="shop-footer"><div><Brand/><p>나에게 어울리는 것들을 발견하는 시간.</p></div><nav aria-label="하단 메뉴"><Link to="/products">전체 상품</Link><Link to="/recommendations">AI 추천</Link><Link to="/favorites">좋아요한 상품</Link><Link to="/support">고객지원</Link></nav><small>© {new Date().getFullYear()} Shoppy · Personal project</small></footer>;}
