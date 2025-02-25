import React from 'react';
import Header from '../components/Header/Header';
import UsermanagementForm from '../components/Admin/UsermanagementForm';

const Usermanagement = () => {
    return (
        <>
            <Header />
            <div className='container'>
            <UsermanagementForm />
            </div>
        </>
    )
}

export default Usermanagement;