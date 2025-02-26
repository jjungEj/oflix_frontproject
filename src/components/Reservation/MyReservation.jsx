import React, { useEffect, useState } from "react";

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
                <h2>내 예매 내역</h2>

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
