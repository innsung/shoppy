import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PayResult() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const orderId = sp.get('orderId');
  const errorCode = sp.get('error_code');
  const errorMessage = sp.get('error_message');

  return (
    <div style={{ padding: '3rem' }}>
      <h2>결제 결과 페이지</h2>
      <p><b>주문번호:</b> {orderId ?? '(없음)'}</p>
      {orderId ? (
        <p style={{ color: 'green' }}>✅ 결제가 정상적으로 완료되었습니다!</p>
      ) : (
        <>
          <p style={{ color: 'red' }}>❌ 결제에 실패했거나 승인 토큰이 없습니다.</p>
          {errorCode && <p><b>error_code:</b> {errorCode}</p>}
          {errorMessage && <p><b>error_message:</b> {errorMessage}</p>}
        </>
      )}
      <div style={{ padding: '1rem' }}>
        <button onClick={() => navigate('/')}>홈으로 이동</button>
      </div>
    </div>
  );
}
