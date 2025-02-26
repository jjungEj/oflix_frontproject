import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MovieAdmin.css"; 
import { Button, Input} from '@chakra-ui/react';
function MoviemanagementForm() {
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
      const response = await fetch(`/api/movies?page=${page}&size=10`);
      const data = await response.json();
      setMovies(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("영화 목록을 가져오는 중 오류 발생:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/movies/search/${filter}/${encodeURIComponent(search)}?page=0&size=10`);
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
      const response = await fetch(`/api/movies/${id}`, {method: "DELETE",});

      if (response.ok) {
        alert("삭제되었습니다.");
        fetchMovies(); // 삭제 후 목록 갱신
        } else {
          const errorText = await response.text();
            if (errorText.includes("스케줄에 등록된 영화는 삭제할 수 없습니다")) {
              alert("스케줄에 등록된 영화는 삭제할 수 없습니다.");
            } else {
              alert("삭제에 실패했습니다.");
            }
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

  /** 페이지네이션 버튼 생성 */
  const renderPaginationButtons = () => {
    const maxPagesToShow = 9; // 최대 표시할 페이지 버튼 수
    const half = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(0, page - half);
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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
        <Button 
          onClick={handleSearch}
          bg="white" 
          color="black" 
          border="1px solid gray" 
          _hover={{ bg: "gray.200" }}
        >
          검색
        </Button>
        <Button 
          onClick={() => navigate("/movies/create")}
          bg="white" 
          color="black" 
          border="1px solid gray" 
          _hover={{ bg: "gray.200" }}
        >
          영화 등록
        </Button>
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
              <td>
                {movie.genre1}, {movie.genre2}
              </td>
              <td 
                className="clickable-title"
                onClick={() => navigate(`/movie/${movie.movieId}`)}
              >{movie.title}</td>
              <td>{formatDate(movie.releaseDate)}</td>
              <td>
                <Button 
                  onClick={() => navigate(`/movies/update/${movie.movieId}`)}
                  bg="white" 
                  color="black" 
                  border="1px solid gray" 
                  _hover={{ bg: "gray.200" }}
                  >
                  수정
                </Button>
              </td>
              <td>
                <Button 
                  onClick={() => deleteMovie(movie.movieId)}
                  bg="white" 
                  color="black" 
                  border="1px solid gray" 
                  _hover={{ bg: "gray.200" }}
                  >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        {/* 이전 버튼 */}
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          {"<"}
        </button>

        {/* 페이지 숫자 버튼 */}
        {renderPaginationButtons().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={pageNum === page ? "active-page" : ""}
          >
            {pageNum + 1}
          </button>
        ))}

        {/* 다음 버튼 */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MoviemanagementForm;