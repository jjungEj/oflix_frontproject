import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/css/MovieScheduleList.css";

const API_BASE_URL = "http://localhost:8080/api";

// ✅ 특정 극장의 상영 일정 가져오기
const getSchedulesByTheater = async (theaterHallId) => {
  const response = await axios.get(`${API_BASE_URL}/schedules/theater`, {
    params: { theaterHallId }, // ✅ 날짜 없이 극장 ID만 전달
  });
  return response.data;
};

const MovieScheduleList = ({ theaterHallId }) => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (theaterHallId) {
      console.log(`🔍 Fetching schedules for Theater: ${theaterHallId}`);

      getSchedulesByTheater(theaterHallId)
        .then((response) => {
          console.log("📢 Fetched schedules:", response);
          setSchedules(response);
        })
        .catch((err) => console.error("Error fetching schedules:", err));
    }
  }, [theaterHallId]); // ✅ 극장 ID 변경 시 새 데이터 요청

  // ✅ 영화별로 일정 그룹화
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.title]) {
      acc[schedule.title] = [];
    }
    acc[schedule.title].push(schedule);
    return acc;
  }, {});

  // ✅ 예매 페이지 이동 함수
  const handleReservation = (scheduleId) => {
    navigate(`/reservation?scheduleId=${scheduleId}`);
  };

  return (
    <div className="schedule-container">
      <h2 className="schedule-title">상영 시간표</h2>
      {Object.entries(groupedSchedules).map(
        ([title, movieSchedules], index) => (
          <div key={`${title}-${index}`} className="movie-container">
            <h2 className="movie-title">{title}</h2>
            {movieSchedules.map((scheduleGroup, idx) => (
              <div
                key={`${scheduleGroup.theaterHallName}-${idx}`}
                className="schedule-block"
              >
                <p className="theater-info">
                  {scheduleGroup.theaterHallName} | 총{" "}
                  {scheduleGroup.totalSeats}석
                </p>
                <div className="schedule-grid">
                  {movieSchedules
                    .filter(
                      (s) => s.theaterHallName === scheduleGroup.theaterHallName
                    )
                    .map((schedule) => (
                      <button
                        key={
                          schedule.scheduleId ||
                          `${schedule.startTime}-${schedule.theaterHallName}`
                        }
                        className="schedule-item"
                        onClick={() => handleReservation(schedule.scheduleId)}
                      >
                        <div className="time">
                          {new Date(schedule.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="seats">
                          {schedule.remainingSeats.length}석
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MovieScheduleList;
