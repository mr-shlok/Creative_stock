import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import PinDetail from './pages/PinDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="pt-14">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/pin/:id" element={<PinDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;