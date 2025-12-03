// Import the necessary components from react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Import your LoginForm component
import LoginForm from './components/auth/LoginForm'
import DashboardPage from './pages/DashboardPage'
import RegisterForm from './components/auth/RegisterForm'

function App() {
  return (
    // TODO: Set up the Router
    // 1. Wrap everything in <BrowserRouter>
    // 2. Inside that, create a <Routes> container
    // 3. Define your individual <Route>s

    // Example structure:
    // <BrowserRouter>
    //   <Routes>
    //     {/* Route for the root path "/" should show LoginForm */}
    //     {/* <Route path="/" element={<LoginForm />} /> */}
    //   </Routes>
    // </BrowserRouter>

    // Remove this placeholder text when you are ready
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
