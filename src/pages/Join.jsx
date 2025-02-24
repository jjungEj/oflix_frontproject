
import React from 'react'
import JoinForm from '../components/Join/JoinForm'
import Header from '../components/Header/Header';

const Join = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <JoinForm />
            </div>
        </>
    )
}

export default Join;