import React from 'react'
import Header from '../components/Header/Header'
import PaymentFail from '../components/payment/PaymentFail'

const PaymentsFail = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <PaymentFail />
            </div>
        </>
    )
}

export default PaymentsFail;