import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiShoppingBag,FiHeart,FiUser } from 'react-icons/fi';
import Brand from './Brand.jsx';
import { useAuthStore } from '@/store/authStore.js';
import {useFavoriteStore} from '@/store/favoriteStore.js';
import { axiosPost } from '../../utils/dataFetch.js';

export default function Header() {
  const favoriteCount=useFavoriteStore(s=>s.count);
  const refreshFavorites=useFavoriteStore(s=>s.refresh);
  useEffect(()=>{refreshFavorites();},[refreshFavorites]);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const userId = useAuthStore((s) => s.userId);
  const role = useAuthStore((s) => s.role);
  const isLogin = useAuthStore((s) => s.isLogin);
  const authChecked = useAuthStore((s) => s.authChecked);
  const cartCount = useAuthStore((s) => s.cartCount);
  const initCartCount = useAuthStore((s) => s.initCartCount);
  const isUpdateFlag = useAuthStore((s) => s.isUpdateFlag);

  useEffect(()=>{
    const fetchData = async() => {
      if(!isLogin) return;

      try {const result = await axiosPost('/carts/count', {"userId": userId});
      result.count ? initCartCount(parseInt(result.count)) : initCartCount(0);}catch{initCartCount(0);}
    }    
    fetchData();
  }, [isLogin, isUpdateFlag]);


  // const handleLogout = () => {
  //   logout();
  //   alert('로그아웃 되었습니다');
  //   navigate('/');
  // };

  const handleLogout = async () => {
    await axiosPost("/member/logout"); // ← 서버에 쿠키 삭제 요청
    useFavoriteStore.getState().setCount(0);
    logout(); // ← Zustand 상태 초기화
    alert("로그아웃 되었습니다");
    navigate("/");
};

  return (
    <div className="header-outer">
      <div className="header">
        <Brand />
        <nav className="main-nav" aria-label="메인 메뉴"><NavLink to="/" end>홈</NavLink><NavLink to="/products">전체 상품</NavLink><NavLink to="/recommendations">AI 추천 <span className="nav-dot"/></NavLink></nav>
        <nav className="user-nav" aria-label="내 쇼핑"><NavLink to="/favorites" aria-label={`좋아요한 상품 ${favoriteCount}개`}><FiHeart/><span>좋아요</span>{favoriteCount>0&&<b>{favoriteCount}</b>}</NavLink><Link to="/cart" aria-label={`장바구니 ${cartCount}개`}><FiShoppingBag/><span>장바구니</span>{cartCount>0&&<b>{cartCount}</b>}</Link>
          {authChecked&&(isLogin?<button onClick={handleLogout}>로그아웃</button>:<Link to="/login" aria-label="로그인"><FiUser/><span>로그인</span></Link>)}
        </nav>
      </div>
    </div>
  );
}
