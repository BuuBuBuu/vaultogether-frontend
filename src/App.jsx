// Import the necessary components from react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import your LoginForm component
import LoginForm from './components/auth/LoginForm'
import DashboardPage from './pages/DashboardPage'
import RegisterForm from './components/auth/RegisterForm'
import VaultPage from './pages/VaultPage'
import AuthProvider from './store/AuthContext'
import VaultMembersPage from './pages/VaultMembersPage'
import PasswordGeneratorPage from './pages/PasswordGeneratorPage'

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vault/:id" element={<VaultPage />} />
        <Route path="/vault/:id/members" element={<VaultMembersPage />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
