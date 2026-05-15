import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useAuthStore } from '@/store/authStore.js';
import { cartItemsCheck, updateCartItemsQty, getTotalPrice, cartItemsAddInfo } from '@/utils/cart.js';

export default function Cart() {
  const navigate = useNavigate();
  const [cartList, setCartList] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const cartItems = useAuthStore((s) => s.cartItems);
  const setCartCount = useAuthStore((s) => s.setCartCount);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/data/products.json');
      const list = await res.json();
      setProducts(list);
      const enriched = cartItemsAddInfo(list, cartItems);
      setCartList(enriched);
      setTotalPrice(getTotalPrice(list, cartItems));
    };
    fetchProducts();
  }, [cartItems]);

  const handleUpdateQty = (cid, type) => {
    const updated = updateCartItemsQty(cartItems, cid, type);
    useAuthStore.getState().setCartItems(updated);
    setCartCount(updated.reduce((sum, i) => sum + i.qty, 0));
  };

  const handleDeleteItem = (cid) => {
    const updated = cartItems.filter(item => item.cid !== cid);
    useAuthStore.getState().setCartItems(updated);
    setCartCount(updated.reduce((sum, i) => sum + i.qty, 0));
  };

  return (
    <div className="cart-container">
      <h2 className="cart-header">장바구니</h2>
      {cartList && cartList.map(item => (
        <div key={item.cid}>
          <div className="cart-item">
            <img src={item.image} alt="product img" />
            <div className="cart-item-details">
              <p className="cart-item-title">{item.name}</p>
              <p className="cart-item-title">{item.size}</p>
              <p className="cart-item-price">{parseInt(item.price).toLocaleString()}원</p>
            </div>
            <div className="cart-quantity">
              <button type="button" onClick={() => item.qty > 1 && handleUpdateQty(item.cid, '-')}>-</button>
              <input type="text" value={item.qty} readOnly />
              <button type="button" onClick={() => handleUpdateQty(item.cid, '+')}>+</button>
            </div>
            <button className="cart-remove" onClick={() => handleDeleteItem(item.cid)}>
              <RiDeleteBin6Line />
            </button>
          </div>
        </div>
      ))}

      {cartList && cartList.length > 0 ? (
        <>
          <div className="cart-summary">
            <h3>주문 예상 금액</h3>
            <div className="cart-summary-sub">
              <p className="cart-total"><label>총 상품 가격 : </label><span>{totalPrice.toLocaleString()}원</span></p>
              <p className="cart-total"><label>총 할인 가격 : </label><span>0원</span></p>
              <p className="cart-total"><label>총 배송비 : </label><span>0원</span></p>
            </div>
            <p className="cart-total2"><label>총 금액 : </label><span>{Number(totalPrice).toLocaleString()}원</span></p>
          </div>
          <div className="cart-actions">
            <button type="button" onClick={() => navigate('/checkout')}>주문하기</button>
          </div>
        </>
      ) : (
        <div>
          <p>장바구니에 담은 상품이 없습니다. &nbsp;&nbsp;&nbsp;&nbsp;
            <Link href="/products">상품보러가기</Link>
          </p>
          <img src="/images/cart.jpg" style={{ width: '50%', marginTop: '20px' }} alt="empty cart" />
        </div>
      )}
    </div>
  );
}
