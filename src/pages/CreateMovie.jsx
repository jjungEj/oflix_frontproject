import React, { useState } from "react";
import "../components/css/createMovie.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header/Header.jsx";

const CreateMovie = () => {
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
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMainPosterChange = (e) => {
    setMainPoster(e.target.files[0]);
  };

  const handleStillCutsChange = (e) => {
    setStillCuts(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    const movieJson = JSON.stringify(formData);
    const movieBlob = new Blob([movieJson], { type: "application/json" });
    data.append("movie", movieBlob);

    if (mainPoster) {
      data.append("main", mainPoster);
    }

    if (stillCuts.length > 0) {
      stillCuts.forEach((file) => {
        data.append("still", file);
      });
    }

    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        window.alert("영화를 등록했습니다!");

        setFormData({
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
        setMainPoster(null);
        setStillCuts([]);

        navigate("/movieAdmin");
      } else {
        window.alert("다시 등록해주세요.");
      }
    } catch (error) {
      window.alert("오류 발생: " + error.message);
    }
  };

  return (
      <div>
        <div>
          <Header />
        </div>



        <div className="movieRegisterContainer">
          <h1>영화 등록</h1>

          {message && <div className="message">{message}</div>}

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
              <label>상영시간(분)</label>
              <input type="text" name="runTime" value={formData.runTime} onChange={handleChange} />
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
              <label>줄거리</label>
              <textarea name="synopsis" value={formData.synopsis} onChange={handleChange} className="synopsis-textArea"></textarea>
            </div>

            <div className="formGroup">
              <label>장르1</label>
              <select name="genre1" value={formData.genre1} onChange={handleChange}>
                <option value="">장르 선택</option>
                <option value="FANTASY">판타지</option>
                <option value="ACTION">액션</option>
                <option value="SF">SF</option>
                <option value="CRIME">범죄</option>
                <option value="COMEDY">코미디</option>
                <option value="DRAMA">드라마</option>
                <option value="HORROR">공포</option>
                <option value="THRILLER">스릴러</option>
                <option value="FAMILY">가족</option>
                <option value="MYSTERY">미스터리</option>
                <option value="ROMANCE">로맨스</option>
                <option value="MUSIC">음악</option>
              </select>
            </div>

            <div className="formGroup">
              <label>장르2</label>
              <select name="genre2" value={formData.genre2} onChange={handleChange}>
                <option value="">장르 선택</option>
                <option value="FANTASY">판타지</option>
                <option value="ACTION">액션</option>
                <option value="SF">SF</option>
                <option value="CRIME">범죄</option>
                <option value="COMEDY">코미디</option>
                <option value="DRAMA">드라마</option>
                <option value="HORROR">공포</option>
                <option value="THRILLER">스릴러</option>
                <option value="FAMILY">가족</option>
                <option value="MYSTERY">미스터리</option>
                <option value="ROMANCE">로맨스</option>
                <option value="MUSIC">음악</option>
              </select>
            </div>

            <div className="formGroup">
              <label>국가</label>
              <select name="nation" value={formData.nation} onChange={handleChange}>
                <option value="">국가 선택</option>
                <option value="KOREA">한국</option>
                <option value="USA">미국</option>
                <option value="FOREIGN">해외</option>
              </select>
            </div>

            <div className="formGroup">
              <label>영화관람가</label>
              <select name="viewAge" value={formData.viewAge} onChange={handleChange}>
                <option value="">관람가 선택</option>
                <option value="ALL">전체이용가</option>
                <option value="AGE12">12세 이용가</option>
                <option value="AGE15">15세 이용가</option>
                <option value="AGE19">19세 이용가</option>
              </select>
            </div>

            <div className="formGroup">
              <label>메인 포스터</label>
              <input type="file" onChange={handleMainPosterChange} accept="image/*" />
              {mainPoster && <p>선택한 파일: {mainPoster.name}</p>}
            </div>

            <div className="formGroup">
              <label>스틸컷</label>
              <input type="file" multiple onChange={handleStillCutsChange} accept="image/*" />
              {stillCuts.length > 0 && (
                  <ul>
                    {stillCuts.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                  </ul>
              )}
            </div>

            <div className="buttonGroup">
              <Link to='/movieAdmin'>
                <button type="button" className="resetButton">취소</button>
              </Link>
              <button type="submit">등록</button> {/* 영화 등록 성공하면 관리페이지로 이동 추가 */}
            </div>
          </form>
        </div>


      </div>
  );
};

export default CreateMovie;