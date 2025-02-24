import React from 'react'
import LoginForm from '../components/Login/LoginForm'
import Header from '../components/Header/Header';

const Login = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <LoginForm />
            </div>
        </>
    )
}

export default Login;
