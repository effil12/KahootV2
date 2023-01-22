import React from 'react'
import { Link } from 'react-router-dom'
import AdminCSS from './css/admin.module.css'

export default function AdminSignUp() {
  return (
    <>
      <h1>Sign Up</h1>
      <form action="/admin/signup" method='POST'>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id='name' name='name' required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id='email' name='email' required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id='password' name='password' required />
        </div>
        <input type="submit" value="Sign Up" />
      </form>
      <Link to='/admin/login'>Login</Link>
    </>
  )
}
