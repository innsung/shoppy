import {useEffect,useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {axiosPost} from '@/utils/dataFetch.js';
import '@/styles/payment-result.css';
export default function PayResult(){
 const [params]=useSearchParams();
 const [result,setResult]=useState(null);
 const [error,setError]=useState('');
 const orderId=params.get('orderId'),statusToken=params.get('token');
 useEffect(()=>{let active=true;
  if(!orderId||!statusToken){setError('결제 정보를 확인할 수 없습니다.');return;}
  axiosPost('/kakao/status',{orderId,statusToken}).then(data=>{if(active){if(data.state==='approved')setResult(data);else setError('완료된 결제 내역을 확인할 수 없습니다.');}}).catch(()=>{if(active)setError('결제 정보를 불러오지 못했습니다. 서버가 재시작되었다면 결제 정보를 다시 조회할 수 없습니다.');});
  return()=>{active=false;};
 },[orderId,statusToken]);
 return <section className="payment-result">
  <nav className="payment-steps" aria-label="결제 진행 단계"><span>01 장바구니</span><span>›</span><span>02 주문·결제</span><span>›</span><strong>03 결제 결과</strong></nav>
  <div className="payment-result-card">
   <div className="payment-result-icon">{result?'✓':error?'!':'…'}</div>
   <h1>{result?'결제가 완료되었습니다!':error?'결제 정보 확인': '결제 내역을 확인하고 있습니다'}</h1>
   <p>{result?'Shoppy를 이용해 주셔서 감사합니다.':error||'잠시만 기다려 주세요.'}</p>
   {result&&<dl><div><dt>상품명</dt><dd>{result.itemName}</dd></div><div><dt>결제 금액</dt><dd>{Number(result.amount).toLocaleString('ko-KR')}원</dd></div><div><dt>결제 일시</dt><dd>{new Date(result.approvedAt).toLocaleString('ko-KR')}</dd></div><div><dt>주문번호</dt><dd>{result.orderId}</dd></div></dl>}
   {result&&<p className="payment-test-note">카카오페이 테스트 결제</p>}
   <div className="payment-result-actions"><Link to="/">홈으로</Link><Link to="/products">쇼핑 계속하기</Link></div>
  </div>
 </section>;
}
