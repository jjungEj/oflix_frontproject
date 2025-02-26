
import React from 'react'
import MyReservation from '../components/Reservation/MyReservation'
import Header from '../components/Header/Header'


const MyReservations = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <MyReservation />
            </div>
        </>
    )
}

export default MyReservations;