import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true)

  const handleSwitchToRegister = () => setShowLogin(false)
  const handleSwitchToLogin = () => setShowLogin(true)

  return (
    <>
      {showLogin ? (
        <Login onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <Register onSwitchToLogin={handleSwitchToLogin} />
      )}
    </>
  )
}

export default AuthPage
