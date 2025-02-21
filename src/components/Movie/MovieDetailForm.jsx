import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Button} from "@chakra-ui/react";
import "../css/Movie/MovieDetailForm.css";

function MovieDetailForm() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  const viewAgeMapping = {
    ALL: "전체 이용가",
    AGE12: "12세 이용가",
    AGE15: "15세 이용가",
    AGE19: "19세 이용가",
  };

  const nationMapping = {
    KOREA : "한국",
    USE : "미국",
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

  const ifComingSoon = (date) =>{
    const release = new Date(date);
    const today = new Date();
    return release   > today;
  }

  const changeDate=(release) => {
    const data = String(release).replaceAll(",", ".");
    return data;
  }

  //이미지 슬라이드 해보기기
  const imageSlide = () => {
    const [image, setImage] = useState(0);



  }

  const fetchMovie = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${movieId}`);
      if (!response.ok) {
        throw new Error("영화를 찾을 수 없습니다.");
      }
      const data = await response.json();
      setMovie(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  if (error) return <Text color="red" textAlign="center">{error}</Text>;
  if (!movie) return <Text textAlign="center">로딩 중...</Text>;

  return (
    <Box className="container">
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
          <p className="metaDetail"><strong>배우 </strong> {movie.actors}</p>
          <p className="metaDetail"><strong>장르 </strong> {genreMapping[movie.genre1]}, {genreMapping[movie.genre2]}</p>
          <div className="button">
          <Button colorPalette={ifComingSoon(movie.releaseDate) ? "gray" : "red"} disabled={ifComingSoon(movie.releaseDate)} size="xl">{ifComingSoon(movie.releaseDate) ? "상영 예정" : "예매하기"}</Button>
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
        <br />
        <div className="stillcut">
        {movie.images?.filter(img => img.imageType === "STILL").map(image => (
          <img key={image.imageId} className="gallery-image" src={image.imagePath} alt={image.imageName} />
        ))}
      </div>
      </div>
    </Box>
  );
}

export default MovieDetailForm;
