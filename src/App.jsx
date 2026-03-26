import { useState } from 'react'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const { user, loading, logout } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>
  }

  if (!user) {
    return isSignUp ? 
      <SignUp 
        onSignUpSuccess={() => setIsSignUp(false)}
        onToggleForm={() => setIsSignUp(false)}
      /> : 
      <SignIn 
        onSignInSuccess={() => {}}
        onToggleForm={() => setIsSignUp(true)}
      />
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>BackBonz</h1>
        <div className="user-section">
          <span className="user-email">{user.email}</span>
          <button onClick={logout} className="logout-btn">Sign Out</button>
        </div>
      </nav>
      <main className="main-content">
        <h2>Welcome, {user.email}!</h2>
        <p>You are successfully logged in to BackBonz.</p>
      </main>
    </div>
  )
}

export default App
