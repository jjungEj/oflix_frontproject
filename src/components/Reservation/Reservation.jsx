import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const PAYMENT_METHODS = [
  { id: 'naver', name: '네이버페이', icon: '네이버페이_아이콘_URL' },
  { id: 'kakao', name: '카카오페이', icon: '카카오페이_아이콘_URL' },
  { id: 'card', name: '신용카드', icon: '신용카드_아이콘_URL' },
];

export default function Reservation() {
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState({});
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeatInfo, setSelectedSeatInfo] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const TICKET_TYPES = [
    { id: 'adult', name: '일반', price: 13000 },
    { id: 'youth', name: '청소년', price: 10000 },
    { id: 'child', name: '어린이', price: 7000 },
  ];

  const fetchUserInfo = async () => {
    try {
        const response = await fetch("/api/user/userInfo", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("유저 정보 불러오기 실패");
        }

        const data = await response.json();
        setUser(data.username); 

        if (!data.username) {
          navigate("/login");
        }
    } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
        navigate("/login");
    }
  }
  
  const createScheduleObject = (schedule) => ({
    id: schedule.scheduleId,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    remainingSeats: schedule.remainingSeats,
    totalSeats: schedule.totalSeats,
    poster: schedule.poster
  });

  const createCinemaObject = (schedule) => ({
    id: schedule.cinemaId,
    name: schedule.cinemaName,
    location: schedule.cinemaLocation,
    movies: []
  });

  const processSchedules = (schedules) => {
    
    const groupedByCinema = schedules.reduce((cinemas, schedule) => {
      if (!cinemas[schedule.cinemaId]) {
        cinemas[schedule.cinemaId] = createCinemaObject(schedule);
      }
      return cinemas;
    }, {});

    schedules.forEach(schedule => {
      const cinema = groupedByCinema[schedule.cinemaId];
      const movieIndex = cinema.movies.findIndex(m => m.title === schedule.title);

      if (movieIndex === -1) {
        cinema.movies.push({
          id: schedule.scheduleId,
          title: schedule.title,
          poster: schedule.posterUrl,
          schedules: [createScheduleObject(schedule)]
        });
      } else {
        const existingSchedules = cinema.movies[movieIndex].schedules;
        const scheduleExists = existingSchedules.some(
          s => s.id === schedule.scheduleId
        );

        if (!scheduleExists) {
          existingSchedules.push(createScheduleObject(schedule));
        }
      }
    });

    return groupedByCinema;
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsDataFetching(true);
      try {
        const response = await fetch("/api/schedules");
        const data = await response.json();
        console.log("data : ", data);
        if (!Array.isArray(data)) {
          throw new Error('Invalid API response format');
        }

        const processedData = processSchedules(data);
        setCinemas(Object.values(processedData));
      } catch (error) {
        console.error("Error fetching schedules:", error.message);
      } finally {
        setIsDataFetching(false);
      }
    };

    fetchSchedules();
    fetchUserInfo();
  }, []);

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const generateSeatLabel = (seatNumber) => {
        seatNumber = seatNumber + 1;
        return seatNumber.toString();
  };

  const handleSeatClick = (seatIndex) => {
    const seatLabel = generateSeatLabel(seatIndex);
  
    setSelectedSeatInfo({
      label: seatLabel,
      index: seatIndex,
      ticketType: null
    });
setSelectedSeats([...selectedSeats, seatIndex]);
    setShowPopup(true);
  };

  const handleTicketTypeSelect = (ticketType) => {
    setSelectedTickets([...selectedTickets, {
      seatIndex: selectedSeatInfo.index,
      seatLabel: selectedSeatInfo.label,
      ticketType: ticketType
    }]);
    setShowPopup(false);
  };

  const handlePopupClose = () => {
    
    setSelectedSeats(selectedSeats.filter(seatIndex => seatIndex !== selectedSeatInfo.index));
    setShowPopup(false);
  };

  const calculateTotalPrice = () => {
    return selectedTickets.reduce((sum, ticket) => sum + ticket.ticketType.price, 0);
  };

  useEffect(() => {
    if (document.getElementById('naver-pay-sdk')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'naver-pay-sdk';
    script.src = 'https://nsp.pay.naver.com/sdk/js/naverpay.min.js';
    script.async = true;

    script.onload = () => {
      if (window.Naver) {
        window.oPay = window.Naver.Pay.create({
          mode: "development",
          clientId: "HN3GGCMDdTgGUfl0kFCo",
          chainId: "S3pWdDdoa3VQR0h"
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById('naver-pay-sdk');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

  const handleNaverPayment = () => {
    try {
      const totalAmount = calculateTotalPrice();
      
      const reservationData = {
        movieId: selectedMovie?.id,
        movieTitle: selectedMovie?.title,
        scheduleId: selectedTime,
        seats: selectedSeats,
        tickets: selectedTickets,
        totalAmount: totalAmount,
        username: user
      };
      
      const encodedData = encodeURIComponent(JSON.stringify(reservationData));
      
      if (!window.oPay) {
        console.error('네이버페이가 초기화되지 않았습니다.');
        return;
      }

      const merchantPayKey = `OFLIX_${Date.now()}`;

      window.oPay.open({
        merchantPayKey: merchantPayKey,
        productName: selectedMovie ? `${selectedMovie.title} 영화티켓` : "영화티켓",
        productCount: String(selectedSeats.length),
        totalPayAmount: String(totalAmount),
        taxScopeAmount: String(totalAmount),
        taxExScopeAmount: "0",
        returnUrl: `/payment/success?reservation=${encodedData}`,
        onAuthorize: function(response) {
          console.log('Payment authorized:', response);
          if (response.resultCode !== 'Success') {
            alert('결제에 실패했습니다.');
          }
        }
      });
    } catch (error) {
      console.error('네이버페이 결제 처리 중 오류:', error);
    }
  };

  const handlePaymentClick = () => {
    if (!selectedPaymentMethod) {
      alert("결제 수단을 선택해주세요.");
      return;
    }

    if (selectedPaymentMethod === 'naver') {
      handleNaverPayment();
    } else {
      alert("지원하지 않는 결제 수단입니다.");
    }
  };

  return (
    <div className="reservation_container">
      <header className="reservation_header">
        <h1>예매하기</h1>
      </header>
      <div className="menu">
        <div className={currentStep === 1 ? "active" : ""}>상영시간</div>
        <div className={currentStep === 2 ? "active" : ""}>인원/좌석</div>
        <div className={currentStep === 3 ? "active" : ""}>결제하기</div>
      </div>

      {isDataFetching ? (
        <div className="loading-container">
          <p>데이터를 불러오는 중입니다...</p>
    </div>
      ) : currentStep === 1 ? (
        <>
          <div className="content">
            <div className="section">
              <h2>{selectedCinema ? selectedCinema.name : "영화관"}</h2>
              <ul>
                {cinemas.map((cinema) => (
                  <li
                    key={cinema.id}
                    className={selectedCinema?.id === cinema.id ? "selected" : ""}
                    onClick={() => {
                      setSelectedCinema(cinema);
                      setSelectedMovie(null);
                      setSelectedTime(null);
                    }}
                  >
                    {cinema.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="section">
              <h2>{selectedMovie ? selectedMovie.title : "영화"}</h2>
              <ul>
                {!selectedCinema ? (
                  <p className="placeholder">영화관을 선택해주세요.</p>
                ) : (
                  selectedCinema.movies && selectedCinema.movies.map((movie) => (
                    <li
                      key={movie.id}
                      className={selectedMovie?.id === movie.id ? "selected" : ""}
                      onClick={() => {
                        setSelectedMovie(movie);
                        setSelectedTime(null);
                      }}
                    >
                      {movie.title}
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="section">
              <h2>{selectedTime ? formatTime(selectedMovie.schedules.find(s => s.id === selectedTime)?.startTime) : "시간"}</h2>
              {selectedMovie ? (
                <ul>
                  {selectedMovie.schedules.map((schedule) => (
                    <li
                      key={schedule.id}
                      className={selectedTime === schedule.id ? "selected" : ""}
                      onClick={() => setSelectedTime(schedule.id)}
                    >
                      {formatTime(schedule.startTime)}
                      <span className="theater-info">
                                                ({schedule.remainingSeats.length}석 남음)
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="placeholder">영화를 선택해주세요.</p>
              )}
            </div>
          </div>
          <div className="button-container">
            <button 
              className="reserve-button" 
              disabled={!selectedTime}
              onClick={handleNextStep}
            >
              예매하기
            </button>
          </div>
        </>
      ) : currentStep === 2 ? (
        <div className="content">
          <div className="seat-selection-container">
            {}
            <div className="left-section">
          <div className="booking-summary">
            <h2>예매 정보</h2>
            <div className="summary-details">
                  <div className="summary-item">
                    <span className="label">영화</span>
                    <span className="value">{selectedMovie?.title}</span>
          </div>
          <div className="summary-item">
            <span className="label">극장</span>
                    <span className="value">{selectedCinema?.name}</span>
            </div>
                          <div className="summary-item">
                <span className="label">일시</span>
                  <span className="value">
                      {selectedTime ? new Date(selectedMovie?.schedules.find(s => s.id === selectedTime)?.startTime).toLocaleDateString() : ""} {" "}
                      {selectedTime ? formatTime(selectedMovie?.schedules.find(s => s.id === selectedTime)?.startTime) : ""}
                    </span>
                  </div>
                </div>
              </div>
            
              <div className="seat-section">
                <h2>좌석 선택</h2>
                <div className="screen">SCREEN</div>
            <div className="seats-grid">
              {selectedMovie?.schedules.find(s => s.id === selectedTime)?.remainingSeats && 
                Array.from({ length: selectedMovie.schedules.find(s => s.id === selectedTime).totalSeats}).map((_, index) => {
                  const seatNumber = (index + 1).toString();
                  const schedule = selectedMovie?.schedules.find(s => s.id === selectedTime);
                  const isAvailable = schedule?.remainingSeats?.some(
                          seat => seat.seatNumber === seatNumber && seat.isAvailable
                        );
                const isSelected = selectedSeats.includes(index);

                return (
                  <div
                    key={index + 1}
                    className={`seat ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => isAvailable && !isSelected && handleSeatClick(index)}
                  >
                    {seatNumber}
                  </div>
                );
              })}
            </div>
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat-sample available"></div>
                <span>선택 가능</span>
              </div>
              <div className="legend-item">
                <div className="seat-sample unavailable"></div>
                <span>선택 불가</span>
              </div>
              <div className="legend-item">
                <div className="seat-sample selected"></div>
                <span>선택된 좌석</span>
              </div>
            </div>
            </div>
            </div>

            {}
            <div className="right-section">
              <div className="selected-tickets-info">
                <h2>선택된 좌석 정보</h2>
                {selectedTickets.length === 0 ? (
                  <>
                    <p className="no-tickets">선택된 좌석이 없습니다.</p>
                    <div className="action-buttons">
                      <button 
                        className="long-back-button"
                        onClick={() => setCurrentStep(1)}
                      >
                        이전단계
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedTickets.map((ticket, index) => (
                      <div key={index} className="ticket-info">
                        <div className="ticket-details">
                          <span className="seat-number">좌석 {ticket.seatLabel}</span>
                          <span className="ticket-type">{ticket.ticketType.name}</span>
                          <span className="ticket-price">{ticket.ticketType.price.toLocaleString()}원</span>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => {
                            setSelectedTickets(selectedTickets.filter((_, i) => i !== index));
                            setSelectedSeats(selectedSeats.filter(seatIndex => seatIndex !== ticket.seatIndex));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="total-price">
                      <span>총 결제금액</span>
                      <span className="price">
                        {selectedTickets.reduce((sum, ticket) => sum + ticket.ticketType.price, 0).toLocaleString()}원
                      </span>
                    </div>
                    <div className="action-buttons">
                      <button 
                        className="payment-button"
                        onClick={() => setCurrentStep(3)}
                        disabled={selectedTickets.length === 0}
                      >
                        결제하기
                      </button>
                      <button 
                        className="long-back-button"
                        onClick={() => setCurrentStep(1)}
                      >
                        이전단계
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="selected-movie-poster">
                <img src={selectedMovie?.poster} alt={selectedMovie?.title} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="payment-container">
          <div className="payment-content">
            <div className="payment-left">
              <div className="movie-info">
                <img src={selectedMovie?.poster} alt={selectedMovie?.title} className="movie-poster" />
                <div className="movie-details">
                  <h3>{selectedMovie?.title}</h3>
                  <p>{selectedCinema?.name}</p>
                  <p>
                    {selectedTime ? new Date(selectedMovie?.schedules.find(s => s.id === selectedTime)?.startTime).toLocaleDateString() : ""} {" "}
                    {selectedTime ? formatTime(selectedMovie?.schedules.find(s => s.id === selectedTime)?.startTime) : ""}
                  </p>
                  <p>선택좌석: {selectedTickets.map(ticket => ticket.seatLabel).join(', ')}</p>
                </div>
              </div>

              <div className="payment-methods">
                <h3>결제수단 선택</h3>
                <div className="payment-options">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      className={`payment-method-button ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="payment-right">
              <div className="payment-summary">
                <h3>결제 금액</h3>
                <div className="price-details">
                  {selectedTickets.map((ticket, index) => (
                    <div key={index} className="price-item">
                      <span>{ticket.ticketType.name}</span>
                      <span>{ticket.ticketType.price.toLocaleString()}원</span>
                    </div>
                  ))}
                  <div className="total-price">
                    <span>총 결제금액</span>
                    <span>{selectedTickets.reduce((sum, ticket) => sum + ticket.ticketType.price, 0).toLocaleString()}원</span>
                  </div>
                </div>
                <div className="payment-buttons">
                  <button 
                    className="short-back-button"
                    onClick={() => setCurrentStep(2)}
                  >
                    이전으로
                  </button>
                  <button 
                    className="confirm-payment-button"
                    onClick={handlePaymentClick}
                    disabled={!selectedPaymentMethod}
                  >
                    결제하기
                  </button>
                </div>
              </div>
            </div>
          </div>
              </div>
            )}
      {}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>좌석 {selectedSeatInfo?.label}</h3>
            <div className="ticket-type-list">
              {TICKET_TYPES.map(type => (
                <button
                  key={type.id}
                  className="ticket-type-button"
                  onClick={() => handleTicketTypeSelect(type)}
                >
                  <span className="ticket-type-name">{type.name}</span>
                  <span className="ticket-type-price">{type.price.toLocaleString()}원</span>
                </button>
              ))}
            </div> 
            <button 
              className="popup-close"
              onClick={handlePopupClose}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
