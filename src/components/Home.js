import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeCSS from './css/home.module.css'

export default function Home() {
  return (
    <div className={HomeCSS.container}>
        <div className="buttons">
            <Link to='/admin/signup'><Button>Admin</Button></Link>
            <Link><Button>Player</Button></Link>
        </div>
    </div>
  )
}
