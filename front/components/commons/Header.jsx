import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { GiShoppingCart } from 'react-icons/gi';
import { useAuthStore } from '@/store/authStore.js';

export default function Header() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const userId = useAuthStore((s) => s.userId);
  const role = useAuthStore((s) => s.role);
  const isLogin = useAuthStore((s) => s.isLogin);
  const authChecked = useAuthStore((s) => s.authChecked);
  const cartCount = useAuthStore((s) => s.cartCount);

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다');
    navigate('/');
  };

  return (
    <div className="header-outer">
      <div className="header">
        <Link to="/" className="header-left">
          <FiShoppingBag />
          <span> 👗👠🛍👓 Shoppy </span>
        </Link>
        <nav className="header-right">
          {isLogin && <span>[{userId}::{role}]</span>}
          <Link to="/products">Products</Link>
          <Link to="/cart" className="header-icons-cart-link">
            <GiShoppingCart className="header-icons" />
            <span className="header-icons-cart">{cartCount}</span>
          </Link>
          {authChecked && !isLogin && (
            <Link to="/login"><button type="button">Login</button></Link>
          )}
          {authChecked && isLogin && (
            <button type="button" onClick={handleLogout}>Logout</button>
          )}
          {!isLogin && (
            <Link to="/signup"><button type="button">Signup</button></Link>
          )}
          <Link to="/support"><button type="button">Support</button></Link>
        </nav>
      </div>
    </div>
  );
}
