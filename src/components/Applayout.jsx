import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigator from './footer/Navigator'
import Header from "./header/Header"
import Footer from './footer/Footer'


function Applayout() {
    return (
        <div>
            <Header />

            <Outlet />
            <Navigator />

            <Footer />

        </div>
    )
}

export default Applayout
