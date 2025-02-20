import { useState, useEffect } from "react";

export default function Reservation() {
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2025-02-04");
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeatInfo, setSelectedSeatInfo] = useState(null);

  useEffect(() => {
    fetch("/api/schedules")
      .then((response) => response.json())
      .then((response) => {
        console.log("API Response:", response);

        // 응답이 배열인지 확인
        if (!Array.isArray(response)) {
          throw new Error('Invalid API response format');
        }

        // Process the schedules to organize by cinema
        const cinemasData = response.reduce((acc, schedule) => {
          const cinemaId = schedule.cinemaId;
          if (!acc[cinemaId]) {
            acc[cinemaId] = {
              id: cinemaId,
              name: schedule.cinemaName,
              location: schedule.cinemaLocation,
              movies: []
            };
          }

          // 영화 정보 처리
          const movie = acc[cinemaId].movies.find(m => m.title === schedule.title);
          if (movie) {
            movie.schedules.push({
              id: schedule.scheduleId,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              remainingSeats: schedule.remainingSeats
            });
          } else {
            acc[cinemaId].movies.push({
              id: schedule.scheduleId, // 또는 별도의 movieId가 필요할 수 있음
              title: schedule.title,
              poster: schedule.posterUrl,
              schedules: [{
                id: schedule.scheduleId,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                remainingSeats: schedule.remainingSeats
              }]
            });
          }

          return acc;
        }, {});

        setCinemas(Object.values(cinemasData));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching schedules:", error.message);
        setIsLoading(false);
      });
  }, []);

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const generateSeatLabel = (index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 10));
    const col = (index % 10) + 1;
    return `${row}${col}`;
  };

  const handleSeatClick = (seatIndex) => {
    const seatLabel = generateSeatLabel(seatIndex);
    setSelectedSeatInfo({
      label: seatLabel,
      index: seatIndex
    });
    setShowPopup(true);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>예매하기</h1>
      </header>
      <div className="menu">
        <div className={currentStep === 1 ? "active" : ""}>상영시간</div>
        <div className={currentStep === 2 ? "active" : ""}>인원/좌석</div>
        <div>결제하기</div>
      </div>

      {isLoading ? (
        <div>로딩 중...</div>
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
                    onClick={() => setSelectedCinema(cinema)}
                  >
                    {cinema.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="section">
              <h2>{selectedMovie ? selectedMovie.title : "영화"}</h2>
              <ul>
                {selectedCinema && selectedCinema.movies && selectedCinema.movies.map((movie) => (
                  <li
                    key={movie.id}
                    className={selectedMovie?.id === movie.id ? "selected" : ""}
                    onClick={() => setSelectedMovie(movie)}
                  >
                    {movie.title}
                  </li>
                ))}
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
                        ({schedule.remainingSeats}석 남음)
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
      ) : (
        <div className="content">
          <h2>인원/좌석 선택</h2>
          <div className="ticket-category">
            <span>일반 1</span>
            <span>청소년 1</span>
            <span>어린이 1</span>
            <span>우대 1</span>
          </div>
          <div className="booking-summary">
            <p>선택하신 영화: {selectedMovie?.title}</p>
            <p>극장: {selectedCinema?.name}</p>
            <p>날짜: {selectedTime ? new Date(selectedMovie?.schedules.find(s => s.id === selectedTime)?.startTime).toLocaleDateString() : ''}</p>
            <p>시간: {selectedTime ? formatTime(selectedMovie?.schedules.find(s => s.id === selectedTime)?.startTime) : ''}</p>
            <p>잔여좌석: {selectedMovie?.schedules.find(s => s.id === selectedTime)?.remainingSeats}석</p>
          </div>
          <div className="seat-selection">
            <div className="navigation-buttons">
              <button 
                className="back-button"
                onClick={() => {
                  setSelectedTime(null);
                  setSelectedSeats([]);
                  setCurrentStep(1);
                }}
              >
                ← 상영시간 선택으로 돌아가기
              </button>
            </div>
            {showPopup && (
              <div className="seat-popup">
                <div className="popup-content">
                  <h3>좌석 {selectedSeatInfo.label}</h3>
                  <p>이 좌석을 선택하시겠습니까?</p>
                  <div className="popup-buttons">
                    <button onClick={() => {
                      setSelectedSeats([...selectedSeats, selectedSeatInfo.index]);
                      setShowPopup(false);
                    }}>확인</button>
                    <button onClick={() => setShowPopup(false)}>취소</button>
                  </div>
                </div>
              </div>
            )}
            <div className="seats-grid">
              {Array.from({ length: 80 }).map((_, index) => {
                const isAvailable = index < (selectedMovie?.schedules.find(s => s.id === selectedTime)?.remainingSeats || 0);
                const isSelected = selectedSeats.includes(index);
                return (
                  <div
                    key={index}
                    className={`seat ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => isAvailable && !isSelected && handleSeatClick(index)}
                  >
                    {generateSeatLabel(index)}
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
            <div className="selected-movie-poster">
              <img src={selectedMovie?.poster} alt={selectedMovie?.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
