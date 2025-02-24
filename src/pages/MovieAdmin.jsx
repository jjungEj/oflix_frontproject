import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/MovieAdmin.css"; // 기존 CSS 사용

function MovieAdmin() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("title");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies?page=${page}&size=10`);
      const data = await response.json();
      setMovies(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("영화 목록을 가져오는 중 오류 발생:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/search/${filter}/${search}?page=0&size=10`
      );
      const data = await response.json();
      setMovies(data.content);
      setTotalPages(data.totalPages);
      setPage(0);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  const deleteMovie = async (id) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("삭제되었습니다.");
        fetchMovies(); // 삭제 후 목록 갱신
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      {/* 검색 및 등록 */}
      <div className="search-container">
        <select onChange={(e) => setFilter(e.target.value)} className="select-box">
          <option value="title">제목</option>
          <option value="actors">배우</option>
          <option value="director">감독</option>
        </select>
        <input
          type="text"
          placeholder="검색어 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">검색</button>
        <button onClick={() => navigate("/movies/create")} className="register-button">영화 등록</button>
      </div>

      {/* 영화 목록 테이블 */}
      <table className="movie-table">
        <thead>
          <tr>
            <th>장르</th>
            <th>제목</th>
            <th>개봉일</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.genre1}, {movie.genre2}</td>
              <td>{movie.title}</td>
              <td>{movie.releaseDate}</td>
              <td>
                <button className="edit-button" onClick={() => navigate(`/movies/update/${movie.id}`)}>수정</button>
              </td>
              <td>
                <button 
                  className="delete-button"
                  onClick={() => deleteMovie(movie.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))} 
          disabled={page === 0}
        >
          이전
        </button>
        <span>{page + 1} / {totalPages}</span>
        <button 
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} 
          disabled={page >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default MovieAdmin;
