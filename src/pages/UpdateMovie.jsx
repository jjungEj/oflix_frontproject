import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../components/css/createMovie.css";
import Header from "../components/Header/Header.jsx";

const UpdateMovie = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    director: "",
    actors: "",
    synopsis: "",
    runTime: "",
    categoryId: "",
    nation: "",
    viewAge: "",
    genre1: "",
    genre2: "",
    movieStatus: "",
  });

  const [mainPoster, setMainPoster] = useState(null);
  const [stillCuts, setStillCuts] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/movies/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData((prevData) => ({
            ...prevData,
            title: data.title,
            releaseDate: data.releaseDate,
            director: data.director,
            actors: data.actors,
            synopsis: data.synopsis,
            runTime: data.runTime,
            categoryId: data.categoryId,
            nation: data.nation,
            viewAge: data.viewAge,
            genre1: data.genre1,
            genre2: data.genre2,
            movieStatus: data.movieStatus,
          }));
          setExistingImages(data.images || []);
        } else {
          window.alert("영화 정보를 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        window.alert("오류 발생: " + error.message);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMainPosterChange = (e) => {
    setMainPoster(e.target.files[0]);
  };

  const handleStillCutsChange = (e) => {
    setStillCuts(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("제출 전 formData:", formData);
    const today = new Date().toISOString().split("T")[0];

    if (
      (formData.movieStatus === "NOW_SHOWING" && formData.releaseDate > today) ||
      (formData.movieStatus === "COMING_SOON" && formData.releaseDate <= today)
    ) {
      window.alert("개봉일과 영화 상태가 일치하지 않습니다. 다시 확인해주세요!");
      return;
    }

    const data = new FormData();
    const movieJson = JSON.stringify(formData);
    data.append("requestMovieDto", new Blob([movieJson], { type: "application/json" }));

    if (mainPoster) data.append("main", mainPoster);
    stillCuts.forEach((file) => data.append("still", file));

    try {
      const response = await fetch(`http://localhost:8080/api/movies/${movieId}`, {
        method: "PUT",
        body: data,
      });

      if (response.ok) {
        window.alert("영화 정보가 수정되었습니다!");
        navigate("/admin/moviemanagement");
      } else {
        window.alert("다시 작성해주세요!");
      }
    } catch (error) {
      window.alert("오류 발생: " + error.message);
    }
  };

  return (
    <div>
      <Header />

      <div className="movieRegisterContainer">
        <h1>영화 수정</h1>

        <form onSubmit={handleSubmit} className="movie-form" encType="multipart/form-data">
          <div className="formGroup">
            <label>제목</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </div>

          <div className="formGroup">
            <label>감독</label>
            <input type="text" name="director" value={formData.director} onChange={handleChange} />
          </div>

          <div className="formGroup">
            <label>출연진</label>
            <input type="text" name="actors" value={formData.actors} onChange={handleChange} />
          </div>

          <div className="formGroup">
            <label>개봉일</label>
            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} />
          </div>

          <div className="formGroup">
            <label>영화 상태</label>
            <select name="movieStatus" value={formData.movieStatus} onChange={handleChange}>
              <option value="">상태 선택</option>
              <option value="NOW_SHOWING">현재상영작</option>
              <option value="COMING_SOON">상영예정작</option>
            </select>
          </div>

          <div className="formGroup">
            <label>메인포스터 업로드</label>
            <input type="file" onChange={handleMainPosterChange} accept="image/*" />
            {mainPoster && <p>선택한 파일: {mainPoster.name}</p>}
          </div>

          <div className="formGroup">
            <label>스틸컷 업로드</label>
            <input type="file" multiple onChange={handleStillCutsChange} accept="image/*" />
            {stillCuts.length > 0 && (
              <ul>
                {stillCuts.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="formGroup">
            <label>기존 이미지</label>
            <div className="existingImage">
              {existingImages.map((img, index) => (
                <img key={index} src={img.imagePath} alt={`기존 이미지 ${index + 1}`} />
              ))}
            </div>
          </div>

          <div className="buttonGroup">
            <Link to="/admin/moviemanagement">
              <button type="button" className="resetButton">취소</button>
            </Link>
            <button type="submit">영화 정보 수정</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMovie;
