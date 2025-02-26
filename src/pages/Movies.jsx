import React, { useState, useEffect } from 'react';
import '../components/css/movies.css';
import Header from '../components/Header/Header';

function Movies() {
    const [selectedTab, setSelectedTab] = useState('now');
    const [nowMovies, setNowMovies] = useState([]);
    const [comingMovies, setComingMovies] = useState([]);
    const [sortOption, setSortOption] = useState('latest');

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
    
            setNowMovies(moviesWithReleaseDate.filter(movie => movie.movieStatus === MOVIE_STATUS.NOW_SHOWING));
            setComingMovies(moviesWithReleaseDate.filter(movie => movie.movieStatus === MOVIE_STATUS.COMING_SOON));
    
        } catch (error) {
            console.error("영화 목록을 가져오는 중 오류 발생:", error);
        }
    };

    
    useEffect(() => {
        fetchAllMovies();
    }, []);

    
    const sortMovies = (movies) => {
        let sortedMovies = [...movies];

        if (sortOption === 'alphabetical') {
            sortedMovies.sort((a, b) => a.title.localeCompare(b.title, 'ko-KR'));
        } else if (sortOption === 'latest') {
            sortedMovies.sort((a, b) => b.releaseDate - a.releaseDate);
        }

        return sortedMovies;
    };

    
    const getSortedMovies = () => {
        return selectedTab === 'now' ? sortMovies(nowMovies) : sortMovies(comingMovies);
    };

    const sortedMovies = getSortedMovies();

    return (
        <>
        <Header />
        <div className="movie-page">
            <div className="tab-buttons-container">
                <div className="tab-buttons">
                    <button className={selectedTab === 'now' ? 'active' : ''} onClick={() => setSelectedTab('now')}>
                        현재 상영작
                    </button>
                    <button className={selectedTab === 'coming' ? 'active' : ''} onClick={() => setSelectedTab('coming')}>
                        상영 예정작
                    </button>
                </div>
                <div className="sort-buttons">
                    <button onClick={() => setSortOption('latest')}>최신순</button>
                    <button onClick={() => setSortOption('alphabetical')}>가나다순</button>
                </div>
            </div>
            <div className="movie-list">
                <div className="movie-grid">
                    {sortedMovies.map((movie) => (
                        <div className="movie-card" key={movie.movieId}>
                            <img src={movie.images?.find(img => img.imageType === "MAIN")?.thumbnailPath || "https://via.placeholder.com/200"} alt={movie.title} />
                            <div className="overlay">
                                {selectedTab === 'now' && <a href={`/reservation`}>예매하기</a>}
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
    );
}

export default Movies;
