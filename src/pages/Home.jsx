import React, { useEffect, useState } from "react";
import "../components/css/Home.css";
import Header from '../components/Header/Header';

const Home = () => {
    const [nowMovies, setNowMovies] = useState([]);
    const [comingMovies, setComingMovies] = useState([]);

    const MOVIE_STATUS = {
        NOW_SHOWING: 'NOW_SHOWING',
        COMING_SOON: 'COMING_SOON',
    };

    const fetchAllMovies = async () => {
        let allMovies = [];
        let page = 0;
        let totalPages = 1;
    
        try {
            while (page < totalPages) {
                const response = await fetch(`/api/movies?page=${page}&size=10`);
                const data = await response.json();
    
                if (data && data.content) {
                    allMovies = [...allMovies, ...data.content];  
                    totalPages = data.totalPages;  
                    page++;  
                } else {
                    console.error("API 응답 데이터 형식이 잘못되었습니다.");
                    break;
                }
            }
    
            const moviesWithReleaseDate = allMovies.map(movie => ({
                ...movie,
                releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : new Date(),
            }));

            // 현재 상영작 최신순 정렬 후 5개 선택
            setNowMovies(moviesWithReleaseDate
                .filter(movie => movie.movieStatus === MOVIE_STATUS.NOW_SHOWING)
                .sort((a, b) => b.releaseDate - a.releaseDate)
                .slice(0, 5)
            );

            // 상영 예정작 최신순 정렬 후 5개 선택
            setComingMovies(moviesWithReleaseDate
                .filter(movie => movie.movieStatus === MOVIE_STATUS.COMING_SOON)
                .sort((a, b) => b.releaseDate - a.releaseDate)
                .slice(0, 5)
            );
    
        } catch (error) {
            console.error("영화 목록을 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchAllMovies();
    }, []);
    return (
        <>
            <Header />
            
            <div className="movie-page">
            {/* 현재 상영작 Top 5 */}
            <div className="movie-list">
                <h2 style={{ fontWeight: "bold" }}>현재 상영작 top 5</h2>
                <div className="movie-grid">
                    {nowMovies.map((movie) => (
                        <div className="movie-card" key={movie.movieId}>
                        <img src={movie.images?.find(img => img.imageType === "MAIN")?.thumbnailPath || "https://via.placeholder.com/200"} alt={movie.title} />
                        <div className="overlay">
                            <a href={`/reservation`}>예매하기</a>
                            <a href={`/movie/${movie.movieId}`}>상세정보</a>
                        </div>
                        <h2>{movie.title}</h2>
                        <h1>{movie.runTime}분</h1>
                    </div>
                    ))}
                </div>
            </div>

            {/* 상영 예정작 Top 5 */}
            <div className="movie-list">
                <h2 style={{ fontWeight: "bold" }}>상영 예정작 top 5</h2>
                <div className="movie-grid">
                    {comingMovies.map((movie) => (
                        <div className="movie-card" key={movie.movieId}>
                            <img src={movie.images?.find(img => img.imageType === "MAIN")?.thumbnailPath || "https://via.placeholder.com/200"} alt={movie.title} />
                            <div className="overlay">
                                <a href={`/reservation`}>예매하기</a>
                                <a href={`/movie/${movie.movieId}`}>상세정보</a>
                            </div>
                            <h2>{movie.title}</h2>
                            <h1>{movie.runTime}분</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
                
                
           
        </>
    )
}

export default Home;
