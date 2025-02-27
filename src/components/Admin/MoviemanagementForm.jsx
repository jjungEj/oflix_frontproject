import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MovieAdmin.css";
import { Button, Input } from "@chakra-ui/react";

function MoviemanagementForm() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("title");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [search, page]);

  const fetchMovies = async () => {
    try {
      let url = `/api/movies?page=${page}&size=10`;

      if (search) {
        url = `/api/movies/search/${filter}/${encodeURIComponent(search)}?page=${page}&size=10`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setMovies(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("영화 목록을 가져오는 중 오류 발생:", error);
    }
  };

  const handleSearch = () => {
    setPage(0); // 검색 시 첫 페이지로 초기화
    fetchMovies();
  };

  const deleteMovie = async (id) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/movies/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("삭제되었습니다.");
        fetchMovies();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR").format(date);
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
        <Input
          type="text"
          placeholder="검색어 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outline"
          size="md"
          width="200px"
          focusBorderColor="blue.500"
          borderRadius="md"
        />
        <Button onClick={handleSearch}>검색</Button>
        <Button onClick={() => navigate("/movies")}>영화 목록 미리보기</Button>
        <Button onClick={() => navigate("/movies/create")}>영화 등록</Button>
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
            <tr key={movie.movieId}>
              <td>{movie.genre1}, {movie.genre2}</td>
              <td className="clickable-title" onClick={() => navigate(`/movie/${movie.movieId}`)}>
                {movie.title}
              </td>
              <td>{formatDate(movie.releaseDate)}</td>
              <td>
                <Button onClick={() => navigate(`/movies/update/${movie.movieId}`)}>수정</Button>
              </td>
              <td>
                <Button onClick={() => deleteMovie(movie.movieId)}>삭제</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={i === page ? "active-page" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

export default MoviemanagementForm;
