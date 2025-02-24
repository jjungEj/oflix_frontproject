import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";

const User = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const username = "현재_로그인_한_유저의_아이디"; // 예: 로그인한 유저의 username을 가져옵니다.
            
            try {
                const response = await fetch(`/api/user/${username}`, {
                    method: "GET",
                    credentials: "include", // 쿠키 포함 요청
                });

                if (!response.ok) {
                    throw new Error("유저 정보 불러오기 실패");
                }

                const data = await response.json();
                setUser(data); // 유저 정보 상태 저장
            } catch (error) {
                console.error("유저 정보 불러오기 실패:", error);
                setUser(null);
                navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
            }
        };

        fetchUserInfo();
    }, [navigate]);

    return (
        <>
            <Header />
            <div className="container">
                <h1>User</h1>
                <hr />
                {user ? (
                    <div>
                        <h2>유저 페이지</h2>
                        <p>사용자명: {user.username}</p>
                        <p>닉네임: {user.nickname}</p>
                        <p>전화번호: {user.phoneNumber}</p>
                        <p>생년월일: {user.birthDate}</p> {/* 생년월일 출력 */}
                        <p>권한: {user.role}</p>
                    </div>
                ) : (
                    <p>유저 정보를 불러오는 중...</p>
                )}
            </div>
        </>
    );
};

export default User;