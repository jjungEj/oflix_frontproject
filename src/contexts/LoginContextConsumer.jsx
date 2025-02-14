import React, { useContext } from 'react';
import { LoginContext } from './LoginContextProvider';

const LoginContextConsumer = () => {
    // 로그인 여부, 로그아웃 함수
    const { isLogin, logout } = useContext(LoginContext);

    return (
        <div>
            <h3>로그인 여부 : {isLogin ? "로그인" : "로그아웃"}</h3>
            
        </div>
    );
};

export default LoginContextConsumer;