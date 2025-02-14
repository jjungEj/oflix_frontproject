import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider'; // Context 가져오기


const LoginForm = () => {
    const { loginSetting } = useContext(LoginContext); // 로그인 상태 설정 함수
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 Hook

    const loginProcess = async (username, password) => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const authorizationHeader = response.headers.get('Authorization');
            if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            localStorage.setItem('access', token);
            }



            console.log("Response:" , response);
            console.log("ResponseH:" , response.headers);
            console.log("ResponseT:" , response.type);
            console.log("ResponseS:" , response.status);

            const responseBody = await response.text(); // ✅ 응답을 직접 텍스트로 확인
            console.log("Response Body:", responseBody);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '로그인 실패');
            }

            return await response.json();
        } catch (error) {
            setErrorMessage(error.message);
            throw error;
        }
    };

    const onLogin = async (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        try {
            const data = await loginProcess(username, password);
            
            navigate('/'); // 로그인 성공 후 홈으로 이동
        } catch (error) {
            console.error('로그인 에러:', error);
        }
    };

    return (
        <div className="form">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={onLogin}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        name="username"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        name="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="btn btn--form btn-login">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
