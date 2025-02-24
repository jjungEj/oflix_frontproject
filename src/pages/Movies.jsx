import React, { useState, useEffect } from 'react';
import '../components/css/movies.css';

function Movies() {
    const [selectedTab, setSelectedTab] = useState('now');
    const [nowMovies, setNowMovies] = useState([]);
    const [comingMovies, setComingMovies] = useState([]);
    const [sortOption, setSortOption] = useState('latest'); 
    const MOVIE_STATUS = {
        NOW_SHOWING: 'NOW_SHOWING',
        COMING_SOON: 'COMING_SOON',
    };

    useEffect(() => {
        fetch('/api/movies')
            .then(response => response.json())
            .then(data => {
                if (data && data.content && Array.isArray(data.content)) {
                    
                    const moviesWithReleaseDate = data.content.map(movie => ({
                        ...movie,
                        releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : new Date(), 
                    }));
                    setNowMovies(moviesWithReleaseDate.filter(movie => movie.movieStatus === MOVIE_STATUS.NOW_SHOWING));
                    setComingMovies(moviesWithReleaseDate.filter(movie => movie.movieStatus === MOVIE_STATUS.COMING_SOON));
                } else {
                    console.error("API 응답 데이터 형식이 잘못되었습니다.");
                    setNowMovies([]);
                    setComingMovies([]);
                }
            })
            .catch(error => {
                console.error("API 호출에 실패했습니다.", error);
                setNowMovies([]);
                setComingMovies([]);
            });
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
        if (selectedTab === 'now') {
            return sortMovies(nowMovies);
        } else {
            return sortMovies(comingMovies);
        }
    };

    const sortedMovies = getSortedMovies();

    return (
        <div className="movie-page">
             <div className="tab-buttons-container">
                <div className="tab-buttons">
                    <button
                        className={selectedTab === 'now' ? 'active' : ''}
                        onClick={() => setSelectedTab('now')}
                    >
                        현재 상영작
                    </button>
                    <button
                        className={selectedTab === 'coming' ? 'active' : ''}
                        onClick={() => setSelectedTab('coming')}
                    >
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
                            <img src={movie.images?.find(img => img.imageType === "MAIN")?.thumbnailPath || "https://via.placeholder.com/200"} />
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
    );
}

export default Movies;
