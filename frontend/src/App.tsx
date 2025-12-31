import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    )
}

function LandingPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
                    CineMatch
                </h1>
                <p className="text-xl text-gray-300 max-w-md">
                    Intelligent movie discovery powered by AI
                </p>
                <div className="flex gap-4 justify-center mt-8">
                    <Link
                        to="/signup"
                        className="px-8 py-3 gradient-primary rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-3 glass-effect rounded-full text-white font-semibold hover:bg-white/20 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default App
