import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Analytics from './components/Analytics';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Newsletter from './components/Newsletter';
import Login from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import UserDetails from './components/UserDetails';
import ProtectedRoute from './components/ProtectedRoute';
import QuestionAndAnswer from './components/QuestionAndAnswer'; 

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/dashboard' && 
       location.pathname !== '/users' && 
       location.pathname !== '/user-details' && 
       location.pathname !== '/create-qa' && <Navbar />}
      <Routes>
        <Route path="/" element={<><Hero /><Analytics /><Newsletter /><Footer /></>} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-details" 
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-qa" 
          element={
            <ProtectedRoute>
              <QuestionAndAnswer />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}
    >
      <App />
    </Router>
  );
}

export default AppWrapper;
