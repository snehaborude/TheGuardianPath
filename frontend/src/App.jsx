import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, User, Globe } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import PhishingModule from './pages/PhishingModule';
import RedFlagDetector from './pages/RedFlagDetector';
import SecurePasswordModule from './pages/SecurePasswordModule';
import DigitalIdModule from './pages/DigitalIdModule';
import Footer from './components/Footer';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function MainApp() {
  const { t, toggleLanguage, lang } = useLanguage();

  return (
    <Router>
      <div className="app-container">
        
        {/* Beautiful Deep Navy Navbar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 3rem',
          background: '#0F172A', /* Deep Slate/Navy */
          borderBottom: '4px solid #3B82F6', /* Vibrant Blue Accent */
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}>
          <Link to="/" style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', 
            fontSize: '2.5rem', fontWeight: '800', color: '#FFFFFF', textDecoration: 'none' 
          }}>
            <ShieldCheck size={48} color="#60A5FA" />
            <span>The Guardian Path</span>
          </Link>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button 
              onClick={toggleLanguage}
              title="Change Language"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '12px',
                color: '#FFFFFF', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer'
              }}
            >
              <Globe size={24} /> {lang === 'en' ? 'मराठी' : 'English'}
            </button>
            <Link to="/" style={{ 
              fontSize: '1.4rem', fontWeight: 'bold', color: '#FFFFFF', textDecoration: 'none',
              padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              {t('dashboard')}
            </Link>
            <div style={{
              background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyItems: 'center'
            }}>
              <User size={28} color="#FFFFFF" />
            </div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/module/phishing" element={<PhishingModule />} />
            <Route path="/module/redflags" element={<RedFlagDetector />} />
            <Route path="/module/secure-pin" element={<SecurePasswordModule />} />
            <Route path="/module/digital-id" element={<DigitalIdModule />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
