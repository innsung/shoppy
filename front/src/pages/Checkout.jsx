import { useState, useEffect, Fragment } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { cartItemsAddInfo, getTotalPrice } from '@/utils/cart.js';
import { v4 as uuidv4} from 'uuid';
import { axiosPost } from '@/utils/dataFetch.js';
import QRModal from '../../components/commons/QRModal.jsx';
import {Link} from 'react-router-dom';

export default function Checkout() {
  // const cartList = useAuthStore((s) => s.cartList);
  const [cartList, setCartList] = useState([]);
  const userId = useAuthStore((s) => s.userId);
  const cartCount = useAuthStore((s) => s.cartCount);
  const setCartListStore = useAuthStore((s) => s.setCartList);
  const [qrUrl, setQrUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingPayment,setPendingPayment]=useState(null);
  const [completedPayment,setCompletedPayment]=useState(null);
  const [paymentError,setPaymentError]=useState('');
  const [preparing,setPreparing]=useState(false);
  useEffect(()=>{
    if(!pendingPayment)return;
    let stopped=false,timer;
    const check=async()=>{
      try{
        const result=await axiosPost('/kakao/status',pendingPayment);
        if(stopped)return;
        if(result.state==='approved'){
          setCompletedPayment(result);setPendingPayment(null);setShowModal(false);window.scrollTo(0,0);return;
        }
        if(result.state==='unknown'){
          setPaymentError('결제 승인 결과를 확인하지 못했습니다. 결제 내역을 확인해 주세요.');setShowModal(false);setPendingPayment(null);return;
        }
      }catch(error){
        if(stopped)return;
        if(error.response?.status===404){setPaymentError('결제 정보가 만료되었습니다. 결제를 다시 시작해 주세요.');setPendingPayment(null);setShowModal(false);return;}
      }
      if(!stopped)timer=setTimeout(check,2000);
    };
    check();return()=>{stopped=true;clearTimeout(timer);};
  },[pendingPayment]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [payment, setPayment] = useState('kakao');
  const [receiver, setReceiver] = useState({
    name: '홍길동', phone: '010-1234-1234',
    zipcode: '12345', address1: '서울시 강남구 역삼동',
    address2: '123', memo: '문앞',
  });

    useEffect(() => {
    const fetchProducts = async () => {
      const list = await axiosPost('/carts/list', {"userId": userId});
      setCartList(list);
      setCartListStore(list);
      setTotalPrice(Number(list[0]?.total_price||0));
    };
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const res = await fetch('/data/products.json');
  //     const list = await res.json();
  //     const enriched = cartItemsAddInfo(list, cartItems);
  //     setCartList(enriched);
  //     setTotalPrice(getTotalPrice(list, cartItems));
  //   };
  //   fetchProducts();
  // }, [cartItems]);

  const handlePayment = async() => {
    if(preparing||pendingPayment)return;
    if (!terms || !privacy) {
      alert('필수 약관에 모두 동의해야 결제가 가능합니다.');
      return;
    }
    
    //카카오페이 결제 준비 호출
    //orderId, userId, itemName, quantity, totalAmount
    //orderId - uuid 패키지 설치 및 사용
    try{
      setPreparing(true);setPaymentError('');
      const orderId = uuidv4();    
      const itemName = cartList.length > 1 ? cartList[0].name + '등...' : cartList[0].name; 
      const quantity = cartCount;
      const totalAmount = totalPrice;
      const orderData = { orderId, userId, itemName, quantity, totalAmount };

      const result = await axiosPost('/kakao/ready', orderData);
      const { tid, next_redirect_pc_url,next_redirect_mobile_url,statusToken} = result;
      if(next_redirect_pc_url){
        window.location.assign(next_redirect_pc_url);
        return;
      }
      
      if(tid) {
        setQrUrl(next_redirect_mobile_url);
        setShowModal(true);

        setPendingPayment({orderId,statusToken});
      }
      
    } catch(error) {
      setPaymentError('결제 준비에 실패했습니다. 다시 시도해 주세요.');
    }finally{setPreparing(false);}
  };

  if(completedPayment)return <div className="cart-container" style={{maxWidth:640,margin:'64px auto',padding:40,textAlign:'center',background:'#fff',border:'1px solid #e1e6df',borderRadius:24}}>
    <div style={{fontSize:42,color:'#486b4c'}}>✓</div>
    <h1 style={{fontSize:28,margin:'20px 0'}}>결제가 완료되었습니다</h1>
    <p>카카오페이 테스트 결제가 정상적으로 승인되었습니다.</p>
    <div style={{padding:24,margin:'24px 0',background:'#f7f8f4',borderRadius:12,overflowWrap:'anywhere'}}>
      <p>주문번호: {completedPayment.orderId}</p><p>결제 금액: {Number(completedPayment.amount).toLocaleString('ko-KR')}원</p>
    </div><Link to="/products">쇼핑 계속하기 →</Link>
  </div>;
  return (
    <div className="cart-container">
      <h2 className="cart-header">주문/결제</h2>

      <div className="section">
        <h2 className="section-title">받는사람정보</h2>
        <div className="info-box">
          <div className="info-grid">
            <div className="label">이름</div><div className="value">{receiver.name}</div>
            <div className="label">배송주소</div>
            <div className="value">{receiver.zipcode} / {receiver.address1} {receiver.address2}</div>
            <div className="label">연락처</div><div className="value">{receiver.phone}</div>
            <div className="label">배송 요청사항</div>
            <div className="value phone-input">
              <input type="text" defaultValue={receiver.memo} />
              <button className="btn">변경</button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">주문 상품</h2>
        <div className="info-box">
          <div className="info-grid">
            {cartList && cartList.map(item => (
              <Fragment key={item.cid ?? item.pid}>
                <div className="label">상품명</div>
                <div className="value">
                  <img src={`images/${item.image}`} alt="product" style={{ width: '35px' }} />
                  {item.name}, {item.info}, 수량({item.qty}), 가격({parseInt(item.price).toLocaleString()}원)
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <h2>결제정보</h2>
        <table className="payment-table">
          <tbody>
            <tr><td>총상품가격</td><td className="price">{totalPrice.toLocaleString()}원</td></tr>
            <tr><td>즉시할인</td><td className="discount">-0원</td></tr>
            <tr><td>배송비</td><td className="price">0원</td></tr>
            <tr className="total"><td>총결제금액</td><td className="total-price">{totalPrice.toLocaleString()}원</td></tr>
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>결제 수단</h2>
        <div className="payment-method">
          <label className="radio-label">
            <input type="radio" name="payment" value="kakao" checked={payment === 'kakao'} onChange={e => setPayment(e.target.value)} /> 카카오페이
          </label>
        </div>
        <div className="payment-method">
          <label className="radio-label">
            <input type="radio" name="payment" value="naver" checked={payment === 'naver'} onChange={e => setPayment(e.target.value)} /> 네이버페이
          </label>
        </div>
      </div>

      <div className="terms">
        <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)} />
        <label htmlFor="terms"> 구매조건 확인 및 결제대행 서비스 약관 동의</label><br />
        <input type="checkbox" id="privacy" checked={privacy} onChange={e => setPrivacy(e.target.checked)} />
        <label htmlFor="privacy"> 개인정보 국외 이전 동의</label>
      </div>
      {paymentError&&<p role="alert">{paymentError}</p>}
      {pendingPayment&&<p role="status">휴대폰에서 결제를 완료하면 자동으로 완료 화면으로 이동합니다.</p>}
      <button className="pay-button" disabled={preparing||!!pendingPayment} onClick={handlePayment}>{preparing?'결제 준비 중…':pendingPayment?'결제 결과 확인 중…':'결제하기'}</button>
      {pendingPayment&&!showModal&&<button onClick={()=>setShowModal(true)}>결제 QR 다시 보기</button>}

      { showModal &&
        (
          <QRModal 
            qrUrl = {qrUrl} 
            amount = {totalPrice} 
            onClose = {() => setShowModal(false)}
          />
        )      
      }


    </div>
  );
}
