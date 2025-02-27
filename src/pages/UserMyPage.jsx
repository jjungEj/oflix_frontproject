import React from 'react'
import UserMyPageForm from '../components/User/UserMyPageForm'
import Header from '../components/Header/Header';

const UserMyPage = () => {
    return (
        <>
            <Header />
            <div>
                <UserMyPageForm />
            </div>
        </>
    )
}

export default UserMyPage;
