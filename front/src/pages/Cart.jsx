import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useAuthStore } from '@/store/authStore.js';
import { cartItemsCheck, updateCartItemsQty, getTotalPrice, cartItemsAddInfo } from '@/utils/cart.js';
import { axiosPost, axiosPut, axiosDelete } from '@/utils/dataFetch.js';

export default function Cart() {
  const navigate = useNavigate();
  const [cartList, setCartList] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const cartItems = useAuthStore((s) => s.cartItems);
  const setCartCount = useAuthStore((s) => s.setCartCount);
  const setIsUpdateFlag = useAuthStore((s) => s.setIsUpdateFlag);
  const userId = useAuthStore((s) => s.userId);
  const setCartListStore = useAuthStore((s) => s.setCartList);

  useEffect(() => {
    const fetchProducts = async () => {
      const list = await axiosPost('/carts/list', {"userId": userId});
      setCartList(list);
      setCartListStore(list);
      setTotalPrice(list[0].total_price);
    };
    fetchProducts();
  }, [isUpdate]);

  const handleUpdateQty = async(cid, type) => {
    const result = await axiosPut("/carts/qty", {cid, type});  //{cid:cid, ..}
    if(result.isUpdate) {
      setIsUpdate(!isUpdate);  //장바구니 리스트 재호출
      setIsUpdateFlag();      //장바구니 카운트 재호출 -> useAuthStore -> Header
    }
  };

  const handleDeleteItem = async(cid) => {
    const result = await axiosDelete("/carts/del", {cid});
    if(result.isDelete) {
      setIsUpdate(!isUpdate);  //장바구니 리스트 재호출
      setIsUpdateFlag();      //장바구니 카운트 재호출 -> useAuthStore -> Header
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-header">장바구니</h2>
      {cartList && cartList.map(item => (
        <div key={item.cid}>
          <div className="cart-item">
            <img src={`images/${item.image}`} alt="product img" />
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