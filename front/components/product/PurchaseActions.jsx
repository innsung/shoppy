import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiGiftThin } from 'react-icons/pi';
import { useAuthStore } from '@/store/authStore.js';
import { cartItemsCheck } from '@/utils/cart.js';

export default function PurchaseActions({ pid }) {
  const navigate = useNavigate();
  const [size, setSize] = useState('XS');
  const [showCartPopup, setShowCartPopup] = useState(false);
  const isLogin = useAuthStore((s) => s.isLogin);
  const cartItems = useAuthStore((s) => s.cartItems); //[{pid:3, size:M, qty:5}]

  const handleAddCart = () => {
    const cartItem = { pid: String(pid), size, qty: 1 };

    //cartItems = [{pid:3, size:M, qty:5}]
    //cartItem = {pid:3, size:M, qty:1}
    const updated = cartItemsCheck(cartItems, cartItem);
    useAuthStore.getState().setCartItems(updated);
    setShowCartPopup(true);
  };

  return (
    <>
      <li className="flex">
        <button className="product-detail-button size">사이즈</button>
        <select className="product-detail-select2" onChange={(e) => setSize(e.target.value)}>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </li>
      <li className="flex" style={{ position: 'relative' }}>
        {showCartPopup && (
          <div className="cart-popup">
            <p>상품을 장바구니에 담았습니다.</p>
            <strong>장바구니로 이동하시겠습니까?</strong>
            <div className="cart-popup-buttons">
              <button type="button" onClick={() => setShowCartPopup(false)}>쇼핑 계속하기</button>
              <button type="button" onClick={() => navigate('/cart')}>장바구니 가기</button>
            </div>
          </div>
        )}
        <button type="button" className="product-detail-button order">바로 구매</button>
        <button type="button" className="product-detail-button cart"
          onClick={() => isLogin ? handleAddCart() : navigate('/login')}>
          쇼핑백 담기
        </button>
        <div type="button" className="gift">
          <PiGiftThin />
          <div className="gift-span">선물하기</div>
        </div>
      </li>
    </>
  );
}
