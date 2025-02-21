import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const isRequestSent = useRef(false); 
  const [okPaymentId, setOkPaymentId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resultCode = params.get('resultCode');
    const paymentId = params.get('paymentId');
    const encodedReservation = params.get('reservation');

    if (resultCode === 'Success') {
      console.log('Payment successful:', { paymentId });
      alert('결제가 성공적으로 완료되었습니다.');
      setOkPaymentId(paymentId);
      const sendPaymentResult = async () => {
        if (isRequestSent.current) return; 
        isRequestSent.current = true; 

        try {
          const reservationData = encodedReservation ? 
            JSON.parse(decodeURIComponent(encodedReservation)) : null;
          
          const paymentInfo = {
            paymentId: paymentId,
            resultCode: resultCode,
            movieTitle: reservationData?.movieTitle,
            scheduleId: reservationData?.scheduleId,
            tickets: reservationData?.tickets || [],
            totalAmount: reservationData?.totalAmount,
            paymentMethod: 'naver'
          };

          console.log('Sending to server:', paymentInfo);

          await fetch('http://localhost:8080/api/payment/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentInfo)
          });

        } catch (error) {
          console.error('Error sending payment result:', error);
          alert('결제 정보 저장 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
      };

      sendPaymentResult();
    } else {
      alert('결제 처리 중 오류가 발생했습니다.');
      navigate('/payment/fail');
    }
  }, [navigate, location]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToReservations = () => {
    navigate('/mypage/reservations');
  };

  if (isLoading) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-content">
          <p>결제 정보를 처리중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-content">
        <div className="success-icon">✓</div>
        <h1>결제가 완료되었습니다!</h1>
        <p>예매가 성공적으로 완료되었습니다.</p>
        {okPaymentId && (
          <div className="payment-info">
            <p>결제 번호: { okPaymentId }</p>
          </div>
        )}
        <div className="success-buttons">
          <button onClick={handleGoToReservations} className="primary-button">
            예매 내역 확인
          </button>
          <button onClick={handleGoHome} className="secondary-button">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
