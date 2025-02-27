import React from 'react'
import Header from '../components/Header/Header';

import ResetPasswordForm from '../components/Login/ResetPasswordForm';

const ResetPassword = () => {
    return (
        <>
            <Header />
            <div>
                <ResetPasswordForm />
            </div>
        </>
    )
}

export default ResetPassword;