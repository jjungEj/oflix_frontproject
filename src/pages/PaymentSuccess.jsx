import React from 'react'
import Header from '../components/Header/Header'
import PaymentSuccess from '../components/payment/PaymentSuccess'

const PaymentsSuccess = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <PaymentSuccess />
            </div>
        </>
    )
}

export default PaymentsSuccess;