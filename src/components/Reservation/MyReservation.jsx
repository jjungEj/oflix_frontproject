import React, { useEffect, useState } from "react";

const formatDate = (dateArray) => {

    if (!dateArray || dateArray.length < 6) return "유효하지 않은 시간"; // 데이터가 부족한 경우 처리

    // 월이 0부터 시작하므로 3은 2로 변환
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
  
    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`; 
  };

const MyReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [reservationToCancel, setReservationToCancel] = useState(null); // 

    const fetchReservationInfo = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/myReservation", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("예매 정보 불러오기 실패");
            }

            const reservationInfo = await response.json();
            setReservations(reservationInfo);


        } catch (error) {
            console.error("예매 정보 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelReservation = async () => {
        if (!reservationToCancel) return;

        try {
            setIsLoading(true);
            
            const response = await fetch(`/api/cancelReservation/${reservationToCancel.id}`, {
                method: "DELETE",  
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("예매 취소 실패");
            }

            setReservations((prevReservations) =>
                prevReservations.filter((reservation) => reservation.id !== reservationToCancel.id)
            );
            setIsModalOpen(false); 
        } catch (error) {
            console.error("예매 취소 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (reservation) => {
        setReservationToCancel(reservation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setReservationToCancel(null);
    };

    useEffect(() => {
        fetchReservationInfo();
    }, []);

    return (
        <>
          <div className="myReservation_container">
            <header className="reservation_header">
              <h1>예매내역</h1>
            </header>
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : reservations.length > 0 ? (
                    <div className="myReservation-grid">
                        {reservations.map((reservation, index) => (
                            <div key={index} className="reservation-card">
                                <h3 className="myReservation-title">{reservation.title}</h3>
                                <p><strong>영화관:</strong> {reservation.cinemaName}</p>
                                <p><strong>상영관:</strong> {reservation.theaterHall}</p>
                                <p><strong>좌석 번호:</strong> {reservation.seatNumber}</p>
                                <p><strong>결제 상태:</strong> {reservation.status}</p>
                                 <p><strong>시작 시간:</strong> {formatDate(reservation.startTime)}</p>
                                 <p><strong>종료 시간:</strong> {formatDate(reservation.endTime)}</p>

                                <button
                                    onClick={() => openModal(reservation)}
                                    className="cancel-button"
                                >
                                    예매 취소
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>예매된 내역이 없습니다.</p>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>예매 취소 확인</h3>
                        <p>정말 예매를 취소하시겠습니까?</p>
                        <button onClick={cancelReservation}>예</button>
                        <button onClick={closeModal}>아니요</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyReservation;
