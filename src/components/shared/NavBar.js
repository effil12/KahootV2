import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function NavBar() {
    return (
        <>
            <nav className="nav">
                <Link to="/" >Kahoot V2</Link>
                <ul>
                    <li>
                        <Link to="/profile" >Profile</Link>
                    </li>
                </ul>
            </nav>
        </>

       /* 
         <Outlet />
        */
    )
}
