import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldAlert, Lock, ChevronRight, ChevronLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import VoiceButton from '../components/VoiceButton';
import { useLanguage } from '../context/LanguageContext';

export default function SecurePasswordModule() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { markScenarioComplete, completedScenarios } = useProgress();

  const totalScenarios = 20;
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const isFinished = (completedScenarios['securepin'] || []);
    let firstUnfinished = 0;
    for (let i = 0; i < totalScenarios; i++) {
       if (!isFinished.includes(i)) {
          firstUnfinished = i;
          break;
       }
    }
    if (isFinished.length >= 20) {
       setSelectedQuizIndex(19);
    } else {
       setSelectedQuizIndex(firstUnfinished);
    }
  }, [completedScenarios]);

  const completedCount = (completedScenarios['securepin'] || []).length;
  const isFinishedCurrent = (completedScenarios['securepin'] || []).includes(selectedQuizIndex);

  const evaluatePassword = () => {
    const hasUpper = /[A-Z]/.test(inputPassword);
    const hasLower = /[a-z]/.test(inputPassword);
    const hasSymbol = /[@!#$%^&*<>]/.test(inputPassword);
    const hasAtSymbol = /[@]/.test(inputPassword);
    const hasNumbers = /[0-9]/.test(inputPassword);
    const hasLength = inputPassword.length >= 8;

    let isSecure = false;
    let explanation = "";

    if (!hasLength) {
      isSecure = false;
      explanation = "Weak Password! Your password must be at least 8 characters long to be secure against brute-force attacks.";
    } else if (hasUpper && hasLower && hasAtSymbol) {
      isSecure = true;
      explanation = "Excellent Password! You included uppercase, lowercase, and an '@' symbol. This is extremely secure!";
    } else if (hasUpper && hasLower && hasSymbol) {
      isSecure = true;
      explanation = "Great job! A strong password with mixed case and symbols.";
    } else if (!hasUpper && !hasLower && hasNumbers) {
      isSecure = false;
      explanation = "Weak Password! Numbers-only passwords are easy for computers to crack in seconds. Add letters and symbols.";
    } else if (!hasUpper) {
      isSecure = false;
      explanation = "Weak Password! You are missing an uppercase letter. Mixing uppercase and lowercase makes it much harder to guess.";
    } else if (!hasSymbol) {
      isSecure = false;
      explanation = "Weak Password! Add a special symbol like '@' to make it an excellent password.";
    } else {
      isSecure = false;
      explanation = "Weak Password! Make sure you use a mix of uppercase, lowercase, and special characters.";
    }

    if (isSecure) {
      markScenarioComplete('securepin', selectedQuizIndex);
    }

    setFeedback({ isCorrect: isSecure, message: explanation });
    setShowResult(true);
  };

  const handleTryAgain = () => {
    setInputPassword("");
    setShowResult(false);
    setFeedback(null);
  };

  const handleNextQuiz = () => {
    setFeedback(null);
    setShowResult(false);
    setInputPassword("");
    if (selectedQuizIndex < totalScenarios - 1) {
      setSelectedQuizIndex(prev => prev + 1);
    } else {
      navigate('/');
    }
  };

  const handlePrevQuiz = () => {
    setFeedback(null);
    setShowResult(false);
    setInputPassword("");
    if (selectedQuizIndex > 0) {
      setSelectedQuizIndex(prev => prev - 1);
    }
  };

  // Safe checks for live UI feedback
  const hasUpper = /[A-Z]/.test(inputPassword);
  const hasLower = /[a-z]/.test(inputPassword);
  const hasSpecificSymbol = /[@]/.test(inputPassword);
  const hasValidLength = inputPassword.length >= 8;

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem', paddingBottom: '3rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={24} /> {t('goBack')}
        </button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: completedCount === 20 ? '#D1FAE5' : '#DBEAFE', padding: '0.5rem 1.5rem', borderRadius: '20px', color: completedCount === 20 ? '#047857' : '#1D4ED8', fontWeight: 'bold', fontSize: '1.4rem' }}>
          {completedCount} / {totalScenarios} Scenarios Completed
          {completedCount === 20 && <span>🏆 MASTERED</span>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 1rem' }}>
        <button 
          className="btn-secondary" 
          onClick={handlePrevQuiz} 
          disabled={selectedQuizIndex === 0}
          style={{ opacity: selectedQuizIndex === 0 ? 0.5 : 1 }}
        >
          <ChevronLeft size={24} /> Previous
        </button>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: '#E2E8F0', padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Scenario {selectedQuizIndex + 1}
          {isFinishedCurrent && <CheckCircle size={20} color="#059669" />}
        </div>
        <button 
          className="btn-secondary" 
          onClick={handleNextQuiz}
          disabled={selectedQuizIndex === totalScenarios - 1}
          style={{ opacity: selectedQuizIndex === totalScenarios - 1 ? 0.5 : 1 }}
        >
          Next <ChevronRight size={24} />
        </button>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', background: '#F8FAFC', padding: '4rem 2rem', borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'inline-flex', background: '#DBEAFE', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <ShieldCheck size={60} color="#1D4ED8" />
        </div>
        
        <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: '#0F172A' }}>
          Create a Strong Password
          <VoiceButton text="Create a Strong Password" />
        </h2>
        <p style={{ fontSize: '1.5rem', marginBottom: '3rem', color: '#475569', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          A secure password defends your account from hackers. To achieve an excellent rating, try including an uppercase letter, a lowercase letter, and the @ symbol!
        </p>

        {/* Beautiful Password Input Card */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '3rem', 
          maxWidth: '500px', 
          margin: '0 auto 2rem auto',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
          border: '1px solid #E2E8F0'
        }}>
          
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <input 
              type={showPassword ? "text" : "password"}
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Type your password..."
              disabled={showResult}
              style={{
                width: '100%',
                padding: '1.5rem 4rem 1.5rem 1.5rem',
                fontSize: '1.8rem',
                border: '3px solid #CBD5E1',
                borderRadius: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                background: showResult ? '#F1F5F9' : 'white',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.3rem', color: hasValidLength ? '#059669' : '#64748B', fontWeight: hasValidLength ? 'bold' : 'normal' }}>
              <CheckCircle size={20} color={hasValidLength ? "#059669" : "#CBD5E1"} /> At least 8 characters long
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.3rem', color: hasUpper ? '#059669' : '#64748B', fontWeight: hasUpper ? 'bold' : 'normal' }}>
              <CheckCircle size={20} color={hasUpper ? "#059669" : "#CBD5E1"} /> Contains Uppercase Letter (A-Z)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.3rem', color: hasLower ? '#059669' : '#64748B', fontWeight: hasLower ? 'bold' : 'normal' }}>
              <CheckCircle size={20} color={hasLower ? "#059669" : "#CBD5E1"} /> Contains Lowercase Letter (a-z)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.3rem', color: hasSpecificSymbol ? '#059669' : '#64748B', fontWeight: hasSpecificSymbol ? 'bold' : 'normal' }}>
              <CheckCircle size={20} color={hasSpecificSymbol ? "#059669" : "#CBD5E1"} /> Contains the '@' Symbol
            </div>
          </div>

          <button 
            onClick={evaluatePassword}
            disabled={showResult || inputPassword.length === 0}
            style={{ 
              width: '100%', 
              padding: '1.5rem', 
              background: '#2563EB', 
              color: 'white', 
              border: 'none', 
              borderRadius: '16px', 
              fontWeight: 'bold', 
              fontSize: '1.6rem', 
              cursor: (showResult || inputPassword.length === 0) ? 'not-allowed' : 'pointer', 
              opacity: (showResult || inputPassword.length === 0) ? 0.5 : 1,
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.8rem'
            }}
          >
            <Lock size={24} /> Evaluate Strength
          </button>
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                background: feedback.isCorrect ? '#D1FAE5' : '#FEE2E2',
                border: feedback.isCorrect ? '4px solid #059669' : '4px solid #DC2626',
                padding: '2.5rem',
                borderRadius: '20px',
                marginTop: '1rem',
                maxWidth: '600px',
                margin: '0 auto',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: feedback.isCorrect ? '#047857' : '#B91C1C' }}>
                  {feedback.isCorrect ? <CheckCircle size={36} /> : <ShieldAlert size={36} />}
                  {feedback.isCorrect ? 'Outstanding!' : 'Alert!'}
                </h3>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#000', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
                  {feedback?.message}
                </p>

                {feedback.isCorrect ? (
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: '1rem', padding: '1.2rem 3.5rem', fontSize: '1.5rem', borderRadius: '12px', background: '#059669', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={handleNextQuiz}
                  >
                    {selectedQuizIndex < totalScenarios - 1 ? 'Next Scenario ➔' : 'Complete Module'}
                  </button>
                ) : (
                  <button 
                    className="btn-danger" 
                    style={{ marginTop: '1rem', padding: '1.2rem 3.5rem', fontSize: '1.5rem', borderRadius: '12px', background: '#DC2626', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={handleTryAgain}
                  >
                    Try A Stronger Password ↺
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
