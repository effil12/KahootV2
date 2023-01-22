import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const formReference = useRef()
  const [msg, setMsg] = useState("")

  function postForm(e) {
    e.preventDefault()
    console.log(formReference.current)
    const formData = new FormData(formReference.current)
    console.log(formData)
  
    fetch("http://localhost:8080/admin/login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': "multipart/form-data"
      }
    }).then(response => {
      console.log(response)
      if (response.ok) {
        return response.text()
      }
    }).then(data => {
      console.log(data)
      // set the msg in a p element
    })
  }
  return (
    <>
      <h1>Log In</h1>
      <form ref={formReference} onSubmit={postForm}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label> 
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/admin/signup">Sign Up</Link>
    </>
  )
}

