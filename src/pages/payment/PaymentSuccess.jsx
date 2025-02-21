// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
//
// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//
//   useEffect(() => {
//     // URL 파라미터 파싱
//     const params = new URLSearchParams(location.search);
//     const resultCode = params.get('resultCode');
//     const paymentId = params.get('paymentId');
//
//     if (resultCode === 'Success') {
//       // 결제 성공 처리
//       console.log('Payment successful:', { paymentId });
//       alert('결제가 성공적으로 완료되었습니다.');
//
//       // TODO: 백엔드에 결제 성공 정보 전송
//       // const sendPaymentResult = async () => {
//       //   try {
//       //     await fetch('payment/complete', {
//       //       method: 'POST',
//       //       headers: { 'Content-Type': 'application/json' },
//       //       body: JSON.stringify({ paymentId, resultCode })
//       //     });
//       //   } catch (error) {
//       //     console.error('Error sending payment result:', error);
//       //   }
//       // };
//       // sendPaymentResult();
//     } else {
//       alert('결제 처리 중 오류가 발생했습니다.');
//     }
//
//     // 3초 후 홈으로 리다이렉트
//     setTimeout(() => {
//       navigate('/');
//     }, 3000);
//   }, [navigate, location]);
//
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '100vh'
//     }}>
//       <h2>결제 처리 중...</h2>
//       <p>잠시만 기다려주세요. 곧 메인 페이지로 이동합니다.</p>
//     </div>
//   );
// };
//
// export default PaymentSuccess;
