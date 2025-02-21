// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function PaymentSuccess() {
//   const [paymentInfo, setPaymentInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const processPayment = async () => {
//       try {
//         // URL 파라미터에서 결제 정보 가져오기
//         const urlParams = new URLSearchParams(window.location.search);
//         const paymentResult = urlParams.get('resultCode');
//         const paymentId = urlParams.get('paymentId');

//         if (paymentResult === 'Success' && paymentId) {
//           // 결제 정보를 상태에 저장
//           setPaymentInfo({
//             resultCode: paymentResult,
//             paymentId: paymentId
//             // movieId: selectedMovie?.id,
//             // movieTitle: selectedMovie?.title,
//             // seats: selectedSeats,
//             // tickets: selectedTickets,
//             // totalAmount: calculateTotalPrice(),
//             // paymentMethod: 'naver'
//           });

//           // 백엔드 서버로 결제 정보 전송
//           const response = await fetch('http://localhost:8080/api/payment/complete', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               setPaymentInfo
//             })
//           });

//           if (!response.ok) {
//             throw new Error('결제 정보 저장 중 오류가 발생했습니다.');
//           }

//           const data = await response.json();
//           console.log('결제 정보가 정상적으로 저장되었습니다.', data);
//         } else {
//           throw new Error('결제가 정상적으로 처리되지 않았습니다.');
//         }
//       } catch (error) {
//         alert(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     processPayment();
//   }, []);

  // // 홈으로 이동
  // const handleGoHome = () => {
  //   navigate('/');
  // };

  // // 예매 내역으로 이동
  // const handleGoToReservations = () => {
  //   navigate('/mypage/reservations');
  // };

  // if (isLoading) {
  //   return (
  //     <div className="payment-success-container">
  //       <div className="payment-success-content">
  //         <p>결제 정보를 처리중입니다...</p>
  //       </div>
  //     </div>
  //   );
  // }

//   return (
//     <div className="payment-success-container">
//       <div className="payment-success-content">
//         <div className="success-icon">✓</div>
//         <h1>결제가 완료되었습니다!</h1>
//         <p>예매가 성공적으로 완료되었습니다.</p>
//         {paymentInfo && (
//           <div className="payment-info">
//             <p>결제 번호: {paymentInfo.paymentId}</p>
//           </div>
//         )}
//         <div className="success-buttons">
//           <button onClick={handleGoToReservations} className="primary-button">
//             예매 내역 확인
//           </button>
//           <button onClick={handleGoHome} className="secondary-button">
//             홈으로 돌아가기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
