import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Box, Text, Button} from "@chakra-ui/react";
import "../css/Movie/movieDetailForm.css";
import Header from "../Header/Header.jsx";

function MovieDetailForm() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  const [stillCuts, setStillCuts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const navigateReserv = () => {
    navigate("/reservation")
  }

  const viewAgeMapping = {
    ALL: "전체 이용가",
    AGE12: "12세 이용가",
    AGE15: "15세 이용가",
    AGE19: "19세 이용가",
  };

  const nationMapping = {
    KOREA : "한국",
    USA : "미국",
    FOREIGN : "해외",
  };

  const genreMapping = {
    FANTASY : "판타지",
    ACTION : "액션",
    SF : "SF",
    CRIME : "범죄",
    COMEDY : "코미디",
    DRAMA : "드라마",
    HORROR : "공포",
    THRILLER : "스릴러",
    FAMILY : "가족",
    MYSTERY : "미스터리",
    ROMANCE : "로맨스",
    MUSIC : "음악",
  };

  const changeDate=(release) => {
    const data = String(release).replaceAll(",", ".");
    return data;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stillCuts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stillCuts.length) % stillCuts.length);
  };

  const fetchMovie = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      if (!response.ok) {
        throw new Error("영화를 찾을 수 없습니다.");
      }
      const data = await response.json();
      setMovie(data);

      if (data.images && Array.isArray(data.images)) {
        const filteredCuts = data.images.filter((img) => img.imageType === "STILL");
        setStillCuts(filteredCuts);
      }

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  if (error) return <Text color="red" textAlign="center">{error}</Text>;
  if (!movie) return <Text textAlign="center">로딩 중...</Text>;

  const today = new Date();
  const isComingSoon = new Date(movie.releaseDate) > new Date() ? true :false ;

  return (
      <Box >
        <div>
          <Header />
        </div>

        <div className="container">
          <div className="movieInfo">
            <div className="moviePoster">
              <img
                  src={movie.images?.find(img => img.imageType === "MAIN")?.imagePath}
                  alt={movie.title}
                  className="movie-poster-image"
              />
            </div>

            <div className="movieDetail">
              <div className="movieDetail_title">
                <h1 className="title">{movie.title}</h1>
              </div>
              <p className="movieMeta">
                {changeDate(movie.releaseDate)} 개봉 | {movie.runTime}분 |  {viewAgeMapping[movie.viewAge] || "등급 정보 없음"} | {nationMapping[movie.nation]}
              </p>
              <p className="metaDetail"><strong>감독 </strong> {movie.director}</p>
              <p className="metaDetail"><strong>출연 </strong> {movie.actors}</p>
              <p className="metaDetail"><strong>장르 </strong> {genreMapping[movie.genre1]}, {genreMapping[movie.genre2]}</p>
              <div className="button">
                <Button colorPalette={isComingSoon ? "gray" : "red"} disabled={isComingSoon} size="xl" onClick={navigateReserv}>{isComingSoon ? "상영 예정" : "예매하기"}</Button>
              </div>
            </div>
          </div>

          <hr className="hr" />

          <div className="movieSynopsis">
            <h2 className="synopTitle">상세 정보</h2>
            <p className="synopsis">{movie.synopsis}</p>
          </div>

          <div className="movieSynopsis">
            <br />
            <div className="movie-detail-container">
              <div className="slider-container">
                <button className="slider-button" onClick={prevSlide}>
                  &#9664;
                </button>

                <div className="slide">
                  {stillCuts.length > 0 && (
                      <img
                          src={stillCuts[currentIndex].imagePath}
                          alt={`스틸컷 ${currentIndex + 1}`}
                          className="slide-image"
                      />
                  )}
                </div>

                <button className="slider-button" onClick={nextSlide}>
                  &#9654;
                </button>
              </div>

              <div className="slider-indicator">
                {currentIndex + 1} / {stillCuts.length}
              </div>
            </div>
          </div>

        </div>
      </Box>
  );
}

export default MovieDetailForm;