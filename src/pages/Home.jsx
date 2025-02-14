import React from 'react'
import LoginContextConsumer from '../contexts/LoginContextConsumer'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            
            <div className='container'>
                <h1>Home</h1>
                <hr/>
                <h2>메인 페이지</h2>
                <LoginContextConsumer />
                
            </div>
        </>
    )
}

export default Home;