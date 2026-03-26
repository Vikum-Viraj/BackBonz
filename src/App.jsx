import { useState } from 'react'
import SignIn from './auth/SignIn'
import SignUp from './auth/SignUp'
import WearTimer from './components/WearTimer'
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
        <WearTimer user={user} />
      </main>
    </div>
  )
}

export default App
