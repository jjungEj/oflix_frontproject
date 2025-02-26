import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/header.css";

const Header = () => {
  const [role, setRole] = useState(null); // 권한 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/user/userInfo", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("유저 정보 불러오기 실패");
        }

        const data = await response.json();
        setRole(data.role);
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
        setRole(null);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      setRole(null);
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="header">
      <div className="header_content">
        <div className="header_content_contents">
          <h1 className="header_logo">
            <Link to="/" className="header_logo_link">
              <img src="" alt="OFlixLogo" className="header_logo_image" />
            </Link>
            <span className="header_logo_text">OFlix!</span>
          </h1>

          <ul className="member_info_wrap">
            <li className="member_info_item">
              <Link to="/" className="member_info_link">메인페이지</Link>
            </li>

            {/* 로그인 상태에 따른 UI 변경 */}
            {role === "ROLE_ADMIN" ? (
              <>
                <li className="member_info_item">
                  <Link to="/admin" className="member_info_link">어드민 페이지</Link>
                </li>
                <li className="member_info_item">
                  <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                </li>
              </>
            ) : role === "ROLE_USER" ? (
              <>
                <li className="member_info_item">
                  <Link to="/mypage" className="member_info_link">마이페이지</Link>
                </li>
                <li className="member_info_item">
                  <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                </li>
              </>
            ) : (
              <>
                <li className="member_info_item">
                  <Link to="/login" className="member_info_link">로그인</Link>
                </li>
                <li className="member_info_item">
                  <Link to="/join" className="member_info_link">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* 네비게이션 메뉴 (사용자 권한에 따라 다르게 표시) */}
        <nav className="nav_menu">
          <ul className="nav_menu_list">
            {role === "ROLE_ADMIN" ? (
              <>
                <li className="nav_menu_item">
                  <Link to="/admin/usermanagement" className="nav_menu_link">회원 관리</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/admin/moviemanagement" className="nav_menu_link">영화 관리</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/admin/theaters" className="nav_menu_link">극장 관리</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/admin/events" className="nav_menu_link">이벤트 관리</Link>
                </li>
              </>
            ) : role === "ROLE_USER" ? (
              <>
                <li className="nav_menu_item">
                  <Link to="/movies" className="nav_menu_link">영화</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/reservation" className="nav_menu_link">예매</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/theaters" className="nav_menu_link">극장</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/events" className="nav_menu_link">이벤트</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav_menu_item">
                  <Link to="/movies" className="nav_menu_link">영화</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/reservation" className="nav_menu_link">예매</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/theaters" className="nav_menu_link">극장</Link>
                </li>
                <li className="nav_menu_item">
                  <Link to="/events" className="nav_menu_link">이벤트</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;