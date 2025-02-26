import React from 'react'
import Header from '../components/Header/Header'
import PaymentCancel from '../components/payment/PaymentCancel'

const PaymentsCencel = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <PaymentCancel />
            </div>
        </>
    )
}

export default PaymentsCencel;