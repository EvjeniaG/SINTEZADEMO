import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import Edukimi from './pages/Edukimi'
import Raport from './pages/Raport'
import Auth from './pages/Auth'
import UserManagement from './pages/UserManagement'
import Profile from './pages/Profile'
import ScrollToTop from './components/ScrollToTop'
import withRoleAccess from './components/auth/withRoleAccess'
import { ROUTE_ACCESS } from './types/auth'

// Protected Components
const ProtectedDashboard = withRoleAccess(Dashboard, ROUTE_ACCESS['/dashboard'])
const ProtectedEdukimi = withRoleAccess(Edukimi, ROUTE_ACCESS['/edukimi'])
const ProtectedRaport = withRoleAccess(Raport, ROUTE_ACCESS['/raport'])
const ProtectedUserManagement = withRoleAccess(UserManagement, ROUTE_ACCESS['/perdoruesit'])
const ProtectedProfile = withRoleAccess(Profile, ROUTE_ACCESS['/profile'])

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Duke ngarkuar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <ScrollToTop />
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/edukimi" element={<ProtectedEdukimi />} />
          <Route path="/raport" element={<ProtectedRaport />} />
          <Route path="/perdoruesit" element={<ProtectedUserManagement />} />
          <Route path="/profile" element={<ProtectedProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App 