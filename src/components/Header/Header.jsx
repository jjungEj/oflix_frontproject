import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import './Header.css';

const Header = () => {
    const { isLogin, logout } = useContext(LoginContext);

    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <img src="" alt="logo" className="logo" />
                </Link>
            </div>

            <div className="util">
                {
                    !isLogin ? (
                        <ul>
                            <li><Link to="/">메인페이지</Link></li>
                            <li><Link to="/login">로그인</Link></li>
                            <li><Link to="/join">회원가입</Link></li>
                        </ul>
                    ) : (
                        <ul>
                            <li><Link to="/user">마이페이지</Link></li>
                            <li><button className="link" onClick={logout}>로그아웃</button></li>
                        </ul>
                    )
                }
            </div>
        </header>
    );
};

export default Header;
