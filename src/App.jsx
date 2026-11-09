import { useState } from 'react'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

function App() {
  const [currentView, setCurrentView] = useState('login')

  return (
    <div>
      {currentView === 'login' ? (
        <Login
          onNavigate={(view) => setCurrentView(view)}
        />
      ) : (
        <Register
          onNavigate={(view) => setCurrentView(view)}
        />
      )}
    </div>
  )
}

export default App
