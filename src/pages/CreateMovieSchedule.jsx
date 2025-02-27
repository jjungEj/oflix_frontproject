import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/CreateMovieSchedule.css"; // CSS 파일 추가
import Header from "../components/Header/Header.jsx"

const CreateMovieSchedule = () => {
    const navigate = useNavigate();

    const [cinemaId, setCinemaId] = useState(""); // ✅ cinemaId 상태 추가
    const [cinemas, setCinemas] = useState([]);
    const [theaterHalls, setTheaterHalls] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState("");
    const [selectedTheaterHall, setSelectedTheaterHall] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");
    const [startTime, setStartTime] = useState("");

    // ✅ 영화관 목록 가져오기
    useEffect(() => {
        fetch("http://localhost:8080/api/Allcinemas")
            .then(response => response.json())
            .then(data => setCinemas(data))
            .catch(error => console.error("영화관 데이터를 불러오는 중 오류 발생:", error));
    }, []);

    // ✅ 선택된 영화관에 따른 상영관 목록 가져오기
    useEffect(() => {
        if (cinemaId) {
            fetch(`http://localhost:8080/api/theaterHall/cinema/${cinemaId}`)
                .then(response => response.json())
                .then(data => setTheaterHalls(data))
                .catch(error => console.error("상영관 데이터를 불러오는 중 오류 발생:", error));
        }
    }, [cinemaId]);

    // ✅ 영화 목록 가져오기
    useEffect(() => {
        fetch("http://localhost:8080/api/AllMovies")
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error("영화 데이터를 불러오는 중 오류 발생:", error));
    }, []);

    // ✅ 영화 스케줄 등록 요청
    const handleSubmit = async (event) => {
        event.preventDefault();

        const scheduleData = {
            theaterHallId: selectedTheaterHall,
            movieId: selectedMovie,
            startTime: startTime
        };

        try {
            const response = await fetch("http://localhost:8080/api/schedules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(scheduleData)
            });

            if (response.ok) {
                alert("영화 스케줄이 성공적으로 등록되었습니다!");
                navigate("/movieScheduleManagement"); // 등록 후 스케줄 관리 페이지로 이동
            } else {
                alert("영화 스케줄 등록에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("영화 스케줄 등록 중 오류 발생:", error);
            alert("오류 발생: " + error.message);
        }
    };

    return (
        <div>
            <Header />
            <div className="schedule-form-container">
                <h1 className="scheduleH1">영화 스케줄 등록</h1>
                <form onSubmit={handleSubmit} className="schedule-form">
                    
                    {/* 영화관 선택 */}
                    <div className="form-group">
                        <label>영화관 선택</label>
                        <select onChange={(e) => setCinemaId(e.target.value)} required>
                            <option value="">영화관을 선택하세요</option>
                            {cinemas.map((cinema) => (
                                <option key={cinema.id} value={cinema.id}>
                                    {cinema.name} ({cinema.location})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 상영관 선택 */}
                    <div className="form-group">
                        <label>상영관 선택</label>
                        <select value={selectedTheaterHall} onChange={(e) => setSelectedTheaterHall(e.target.value)} required>
                            <option value="">상영관을 선택하세요</option>
                            {theaterHalls.map((hall) => (
                                <option key={hall.id} value={hall.id}>
                                    {hall.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 영화 선택 */}
                    <div className="form-group">
                        <label>영화 선택</label>
                        <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)} required>
                            <option value="">영화를 선택하세요</option>
                            {movies.map((movie) => (
                                <option key={movie.movieId} value={movie.movieId}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 상영 시작 시간 선택 */}
                    <div className="form-group">
                        <label>상영 시작 시간</label>
                        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    </div>

                    {/* 등록 버튼 */}
                    <div className="form-group">
                        <button type="submit" className="submit-button">스케줄 등록</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMovieSchedule;
