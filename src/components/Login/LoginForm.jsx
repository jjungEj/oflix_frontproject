import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const loginProcess = async (username, password) => {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

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
