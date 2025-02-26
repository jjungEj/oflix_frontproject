import React from 'react'
import Header from '../components/Header/Header';
import FindIdForm from '../components/Login/FindIdForm';

const FindId = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <FindIdForm />
            </div>
        </>
    )
}

export default FindId;