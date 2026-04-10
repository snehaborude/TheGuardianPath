import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Verified, ShieldAlert, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import VoiceButton from '../components/VoiceButton';
import { useLanguage } from '../context/LanguageContext';
import modulesData from '../data/modulesData.json';

const quizDataRaw = modulesData.digitalid;

export default function DigitalIdModule() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { markScenarioComplete, completedScenarios } = useProgress();

  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // set initial quiz index to the first uncompleted scenario
  useEffect(() => {
    const isFinished = (completedScenarios['digitalid'] || []);
    const firstUnfinished = quizDataRaw.findIndex((_, i) => !isFinished.includes(i));
    if (firstUnfinished !== -1) {
      setSelectedQuizIndex(firstUnfinished);
    }
  }, []);

  const currentQuiz = quizDataRaw[selectedQuizIndex];
  const completedCount = (completedScenarios['digitalid'] || []).length;
  const isFinishedCurrent = (completedScenarios['digitalid'] || []).includes(selectedQuizIndex);

  const handleGuess = (guess) => {
    if (showResult) return;
    const chosenOption = currentQuiz.options.find(opt => opt.id === guess);
    setFeedback({
      isCorrect: chosenOption.isCorrect,
      message: chosenOption.explanation
    });
    setShowResult(true);
    markScenarioComplete('digitalid', selectedQuizIndex);
  };

  const handleNextQuiz = () => {
    setFeedback(null);
    setShowResult(false);
    if (selectedQuizIndex < quizDataRaw.length - 1) {
      setSelectedQuizIndex(prev => prev + 1);
    } else {
      navigate('/');
    }
  };
  
  const handlePrevQuiz = () => {
    setFeedback(null);
    setShowResult(false);
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

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', background: '#F8FAFC' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', borderBottom: '3px solid #E2E8F0', paddingBottom: '2rem' }}>
          <div style={{ background: '#DBEAFE', padding: '1.5rem', borderRadius: '50%' }}>
            <FileText size={48} color="#1D4ED8" />
          </div>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              {currentQuiz?.question?.[lang]} <VoiceButton text={currentQuiz?.question?.[lang] || ''} />
            </h2>
            <p style={{ fontSize: '1.4rem', color: '#475569', fontWeight: 'bold' }}>
              {currentQuiz?.scenario?.[lang]}
              <VoiceButton text={currentQuiz?.scenario?.[lang] || ''} />
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
           <button 
             onClick={() => handleGuess('safe')}
             disabled={showResult}
             className="btn-success"
             style={{ flex: 1, padding: '2rem', fontSize: '1.8rem', justifyContent: 'center', cursor: showResult ? 'not-allowed' : 'pointer' }}
           >
             <Verified size={32} /> Safe to Share
           </button>
           <button 
             onClick={() => handleGuess('unsafe')}
             disabled={showResult}
             className="btn-danger"
             style={{ flex: 1, padding: '2rem', fontSize: '1.8rem', justifyContent: 'center', cursor: showResult ? 'not-allowed' : 'pointer' }}
           >
             <ShieldAlert size={32} /> Unsafe Upload
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
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '2.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: feedback.isCorrect ? '#047857' : '#B91C1C' }}>
                  {feedback.isCorrect ? <CheckCircle size={36} /> : <ShieldAlert size={36} />}
                  {feedback.isCorrect ? 'Excellent Judgment!' : 'Warning!'}
                </h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {feedback?.message?.[lang]}
                  <VoiceButton text={feedback?.message?.[lang] || ''} />
                </p>

                <button 
                  className="btn-primary" 
                  style={{ marginTop: '2rem', padding: '1.5rem 3rem', fontSize: '1.5rem', margin: '2rem auto 0 auto' }}
                  onClick={handleNextQuiz}
                >
                  {selectedQuizIndex < quizDataRaw.length - 1 ? 'Next Scenario ➔' : 'Return to Home'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
