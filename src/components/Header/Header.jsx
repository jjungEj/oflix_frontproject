import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/header.css";

const Header = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // 유저 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/user/userInfo', {
        method: 'GET',
      });
  
      // 응답 상태 확인
      if (!response.ok) {
        throw new Error('유저 정보 불러오기 실패');
      }
  
      // 응답을 JSON으로 변환
      const data = await response.json();
      console.log("유저 정보:", data);
  
    } catch (error) {
      console.error("유저 정보 불러오기 실패:", error);
    }
  };
  

  /*// 로그아웃 기능
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // 쿠키 포함 요청
      });

      if (response.ok) {
        setUsername(null);
        navigate("/"); // 로그아웃 후 메인 페이지 이동
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };*/

  return (
    <header>
      <div className="header">
        <div className="header_content">
          <div className="contents">
            {/* 로고 */}
            <h1 style={{ cursor: "pointer" }}>
              <a href="/">
                <img src="" alt="OFlixLogo" />
              </a>
              <span>OFlix!</span>
            </h1>

            {/* 로그인 상태에 따라 다른 UI 표시 */}
            <ul className="memberInfo_wrap">
              <li>
                <Link to="/reservation">예매하기</Link>
              </li>
              <li>
                <Link to="/">메인페이지</Link>
              </li>
              {username ? (
                <>
                  <li>
                    <span style={{ fontWeight: "bold", color: "#333" }}>
                      {username} 님
                    </span>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      로그아웃
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">로그인</Link>
                  </li>
                  <li>
                    <Link to="/join">회원가입</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <nav className="nav_menu">
            <ul>
              <li><Link to="/movies">영화</Link></li>
              <li><Link to="/reservation">예매</Link></li>
              <li><Link to="/events">이벤트</Link></li>
              <li><Link to="/offers">할인</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
