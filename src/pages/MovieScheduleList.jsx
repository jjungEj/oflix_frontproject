import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/css/MovieScheduleList.css";

const getSchedulesByTheater = async (theaterHallId) => {
  const response = await axios.get("api/schedules/theater", {
    params: { theaterHallId },
  });
  return response.data;
};

const MovieScheduleList = ({ theaterHallId }) => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (theaterHallId) {

      getSchedulesByTheater(theaterHallId)
        .then((response) => {
          console.log("Fetched schedules:", response);
          setSchedules(response);
        })
        .catch((err) => console.error("Error fetching schedules:", err));
    }
  }, [theaterHallId]);

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.title]) {
      acc[schedule.title] = [];
    }
    acc[schedule.title].push(schedule);
    return acc;
  }, {});

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