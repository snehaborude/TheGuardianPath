import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceButton from '../components/VoiceButton';
import modulesData from '../data/modulesData.json';

const quizDataRaw = modulesData.phishing;

export default function PhishingModule() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { markScenarioComplete, completedScenarios } = useProgress();

  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [foundStatus, setFoundStatus] = useState({});
  const [activeInfo, setActiveInfo] = useState(null);

  useEffect(() => {
    const isFinished = (completedScenarios['phishing'] || []);
    const firstUnfinished = quizDataRaw.findIndex((_, i) => !isFinished.includes(i));
    if (firstUnfinished !== -1) {
      setSelectedQuizIndex(firstUnfinished);
    }
  }, []);

  const currentQuiz = quizDataRaw[selectedQuizIndex];
  const risks = currentQuiz ? currentQuiz.risks : [];
  const completedCount = (completedScenarios['phishing'] || []).length;
  const isFinishedCurrent = (completedScenarios['phishing'] || []).includes(selectedQuizIndex);

  const handleRiskClick = (id) => {
    setFoundStatus(prev => ({ ...prev, [id]: true }));
    const risk = risks.find(r => r.id === id);
    setActiveInfo(risk);
    setTimeout(() => {
      document.getElementById('learning-insights')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const foundCount = Object.values(foundStatus).filter(Boolean).length;
  const isComplete = risks.length > 0 && foundCount === risks.length;

  React.useEffect(() => {
    if (isComplete) {
      markScenarioComplete('phishing', selectedQuizIndex);
    }
  }, [isComplete, selectedQuizIndex, markScenarioComplete]);

  const handleNextQuiz = () => {
    setFoundStatus({});
    setActiveInfo(null);
    if (selectedQuizIndex < quizDataRaw.length - 1) {
      setSelectedQuizIndex(prev => prev + 1);
    } else {
      navigate('/');
    }
  };

  const handlePrevQuiz = () => {
    setFoundStatus({});
    setActiveInfo(null);
    if (selectedQuizIndex > 0) {
      setSelectedQuizIndex(prev => prev - 1);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem', paddingBottom: '3rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={24} /> {t('goBack')}
        </button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: completedCount === 20 ? '#D1FAE5' : '#DBEAFE', padding: '0.5rem 1.5rem', borderRadius: '20px', color: completedCount === 20 ? '#047857' : '#1D4ED8', fontWeight: 'bold', fontSize: '1.4rem' }}>
          {completedCount} / 20 Scenarios Completed
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
          disabled={selectedQuizIndex === quizDataRaw.length - 1}
          style={{ opacity: selectedQuizIndex === quizDataRaw.length - 1 ? 0.5 : 1 }}
        >
          Next <ChevronRight size={24} />
        </button>
      </div>

      <div className="glass-panel" style={{ marginBottom: '3rem', border: '4px solid var(--accent-warning)', background: '#FEF3C7' }}>
        <h2 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#B45309' }}>
          <AlertTriangle size={40} /> {t('instructionsTitle')}
          <VoiceButton text={t('instructionsTitle')} />
        </h2>
        <p style={{ fontSize: '1.5rem', color: '#000', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {t('instructionsDesc')}
          <VoiceButton text={t('instructionsDesc')} />
        </p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(foundCount / risks.length) * 100}%` }}></div>
        </div>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
          You have found: {foundCount} out of {risks.length} mistakes
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Email Simulator */}
        <div className="sandbox-environment">
          <div className="sandbox-header">
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{t('inbox')}</span>
          </div>
          
          <div className="sandbox-content">
            <div className="mock-email">
              <div className="mock-email-header">
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Subject: {currentQuiz?.subject?.[lang]}
                  <VoiceButton text={currentQuiz?.subject?.[lang] || ''} />
                </div>
                <div style={{ fontSize: '1.4rem', color: '#000', marginBottom: '1rem' }}>
                  <strong>From: </strong> Security Support &lt;
                  <span 
                    className={`clickable-risk ${foundStatus['sender'] ? 'identified' : ''}`}
                    onClick={() => handleRiskClick('sender')}
                  >
                    {risks.find(r => r.id === 'sender')?.text}
                  </span>&gt;
                  <VoiceButton text={`From Security Support ${risks.find(r => r.id === 'sender')?.text}`} />
                </div>
                <div style={{ fontSize: '1.2rem', color: '#555' }}>Sent Today at 10:23 AM</div>
              </div>

              <div style={{ lineHeight: '1.8' }}>
                <p style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span 
                    className={`clickable-risk ${foundStatus['greeting'] ? 'identified' : ''}`}
                    onClick={() => handleRiskClick('greeting')}
                  >
                    {risks.find(r => r.id === 'greeting')?.text?.[lang]}
                  </span>
                  <VoiceButton text={risks.find(r => r.id === 'greeting')?.text?.[lang]} />
                </p>
                
                <p style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {currentQuiz?.body?.[lang]}
                  <VoiceButton text={currentQuiz?.body?.[lang] || ''} />
                </p>

                <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '2rem' }}>
                  <span 
                    className={`clickable-risk ${foundStatus['link'] ? 'identified' : ''}`}
                    onClick={() => handleRiskClick('link')}
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#1D4ED8', 
                      color: 'white', 
                      padding: '1.5rem 3rem', 
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '1.8rem',
                      border: '4px dashed white',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    {risks.find(r => r.id === 'link')?.text?.[lang]}
                    <VoiceButton text={risks.find(r => r.id === 'link')?.text?.[lang] || ''} />
                  </span>
                </div>

                <p style={{ color: '#555', fontSize: '1.2rem' }}>
                  Thank you,<br/>
                  The Security Department
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div id="learning-insights" className="glass-panel" style={{ background: '#F8FAFC' }}>
          {isComplete ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <CheckCircle size={80} className="text-success" style={{ margin: '0 auto 1.5rem auto' }} />
              <h3 style={{ fontSize: '3rem', color: 'var(--accent-success)', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                {t('greatJob')} <VoiceButton text={t('greatJob')} />
              </h3>
              <p style={{ fontSize: '1.6rem', fontWeight: '500', marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                {t('greatJobDesc')} <VoiceButton text={t('greatJobDesc')} />
              </p>
              <button 
                className="btn-success" 
                style={{ width: '100%', maxWidth: '400px' }} 
                onClick={handleNextQuiz}
              >
                {selectedQuizIndex < quizDataRaw.length - 1 ? 'Next Scenario ➔' : 'Return to Home'}
              </button>
            </motion.div>
          ) : (
            <div>
              <h3 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '4px solid #CBD5E1', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <Info size={36} className="text-primary" /> {t('whatFound')} <VoiceButton text={t('whatFound')} />
              </h3>
              
              {activeInfo ? (
                <motion.div key={activeInfo.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#D1FAE5', padding: '1.5rem', borderRadius: '12px', border: '4px solid var(--accent-success)' }}>
                  <h4 style={{ color: 'var(--accent-success-hover)', fontSize: '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {t('correct')} <VoiceButton text={t('correct')} />
                  </h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#000', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {activeInfo?.explanation?.[lang]}
                    <VoiceButton text={activeInfo?.explanation?.[lang] || ''} />
                  </p>
                </motion.div>
              ) : (
                <p style={{ fontSize: '1.5rem', color: '#555', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {t('clickMistakesInfo')} <VoiceButton text={t('clickMistakesInfo')} />
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
