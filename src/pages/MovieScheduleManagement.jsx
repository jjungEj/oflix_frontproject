import React, { useEffect, useState } from "react";
import "../components/css/MovieScheduleManagement.css"
import Header from "../components/Header/Header.jsx"
import { Button} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

const MovieScheduleManagement = () => {
    const navigate = useNavigate();
    const [cinemas, setCinemas] = useState([]); // 영화관 목록
    const [cinemaId, setCinemaId] = useState(""); // 선택된 영화관 ID
    const [schedules, setSchedules] = useState([]); // 선택된 영화관의 영화 스케줄 목록

    // 영화관 목록 가져오기
    const fetchCinemas = async () => {
        try {
            const response = await fetch("/api/Allcinemas");
            const data = await response.json();
            setCinemas(data);
            if (data.length > 0) {
                setCinemaId(data[0].id); // 첫 번째 영화관을 기본 선택
            }
        } catch (error) {
            console.error("영화관 목록을 불러오는 중 오류 발생:", error);
        }
    };

    // 선택된 영화관의 스케줄 가져오기
    const fetchSchedules = async (cinemaId) => {
        try {
            const response = await fetch(`/api/schedule/${cinemaId}`);
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error("영화 스케줄을 불러오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchCinemas();
    }, []);

    useEffect(() => {
        if (cinemaId) {
            fetchSchedules(cinemaId); // cinemaId가 변경되면 스케줄을 새로 불러옴
        }
    }, [cinemaId]);

    // 영화관 선택 변경 시 실행
    const handleCinemaChange = (e) => {
        setCinemaId(e.target.value); // 선택된 영화관 ID 업데이트
    };

    // 스케줄 삭제
    const deleteSchedule = async (scheduleId) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;
    
        try {
          const response = await fetch(`/api/schedule/${scheduleId}`, {method: "DELETE",});
    
          if (response.ok) {
            alert("삭제되었습니다.");
            fetchSchedules(cinemaId); // 삭제 후 목록 갱신
            } else {
              const errorText = await response.text();
                if (errorText.includes("스케줄에 등록된 영화는 삭제할 수 없습니다")) {
                  alert("스케줄에 등록된 영화는 삭제할 수 없습니다.");
                } else {
                  alert("이미 예매된 영화는 삭제할 수 없습니다.");
                }
              }
        } catch (error) {
          console.error("삭제 중 오류 발생:", error);
          alert("삭제 중 오류가 발생했습니다.");
        }
      };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        };
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    };
    
    const handleNavigate = () => {
        navigate("/createMovieSchedule"); // "/movies" 경로로 이동
    };


    return (
        <div>
            <Header />

            <div className="container">

                <div>
                
                <div className="select-container">
                    <label htmlFor="cinemaSelect">영화관 선택</label>
                    <select onChange={handleCinemaChange} value={cinemaId} required>
                        {cinemas.map((cinema) => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="schedule-button" onClick={handleNavigate}>
                    <Button> 영화 스케줄 등록 </Button>
                </div>

                </div>

                {/* 영화 스케줄 테이블 */}
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>영화 제목</th>
                            <th>상영관</th>
                            <th>시작 시간</th>
                            <th>종료 시간</th>
                            <th>총 좌석</th>
                            <th>잔여 좌석</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length > 0 ? (
                            schedules.map((schedule) => (
                                <tr key={schedule.scheduleId}> {/* scheduleId를 key로 사용 */}
                                    <td>{schedule.title}</td>
                                    <td>{schedule.theaterHall}</td>
                                    <td>{formatDate(schedule.startTime)}</td>
                                    <td>{formatDate(schedule.endTime)}</td>
                                    <td>{schedule.totalSeats}</td> {/* 총 좌석 */}
                                    <td>{schedule.remainingSeats ? schedule.remainingSeats.length : 0}</td> {/* 잔여 좌석 */}
                                    <td>
                                        <button className="delete-btn" onClick={() => deleteSchedule(schedule.scheduleId)}>
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">해당 영화관에 등록된 스케줄이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    );
};

export default MovieScheduleManagement;
