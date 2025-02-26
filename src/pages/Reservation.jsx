
import React from 'react'
import Reservation from '../components/Reservation/Reservation'
import Header from '../components/Header/Header'

const Reservations = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <Reservation />
            </div>
        </>
    )
}

export default Reservations;