import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Smartphone, Mail, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import VoiceButton from '../components/VoiceButton';
import { useLanguage } from '../context/LanguageContext';

// Dynamically import the generated text scenarios
import modulesData from '../data/modulesData.json';

const quizDataRaw = modulesData.redflags;

export default function RedFlagDetector() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { markScenarioComplete, completedScenarios } = useProgress();

  const [selectedQuizIndex, setSelectedQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const isFinished = (completedScenarios['redflags'] || []);
    const firstUnfinished = quizDataRaw.findIndex((_, i) => !isFinished.includes(i));
    if (firstUnfinished !== -1) {
      setSelectedQuizIndex(firstUnfinished);
    }
  }, []);

  const currentQuiz = quizDataRaw[selectedQuizIndex];
  const completedCount = (completedScenarios['redflags'] || []).length;
  const isFinishedCurrent = (completedScenarios['redflags'] || []).includes(selectedQuizIndex);

  React.useEffect(() => {
    if (score > 0) {
      markScenarioComplete('redflags', selectedQuizIndex);
    }
  }, [score, selectedQuizIndex, markScenarioComplete]);

  const handleSelect = (option) => {
    if (isAnswerRevealed) return; // Prevent clicking again
    setSelectedAnswer(option);
    setIsAnswerRevealed(true);

    if (option.isCorrect) {
      setScore(1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setScore(0);
    if (selectedQuizIndex < quizDataRaw.length - 1) {
      setSelectedQuizIndex(prev => prev + 1);
    } else {
      navigate('/');
    }
  };

  const handlePrevQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setScore(0);
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

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center' }}>
          The "Red Flag" Quiz
          <VoiceButton text="The Red Flag Quiz" />
        </h1>
      </div>

      <div className="glass-panel" style={{ border: '4px solid var(--accent-primary)', marginBottom: '3rem' }}>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
          {currentQuiz.type === 'sms' ? <Smartphone size={40} className="text-primary"/> : <Mail size={40} className="text-warning"/>}
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              {currentQuiz?.scenario?.[lang]}
              <VoiceButton text={currentQuiz?.scenario?.[lang] || ''} />
            </h2>
            <div style={{ 
              background: currentQuiz.type === 'sms' ? '#DCF8C6' : '#F1F5F9', // Whatsapp green for SMS
              padding: '2rem',
              borderRadius: '16px',
              border: '2px solid #CBD5E1',
              fontSize: '1.8rem',
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              "{currentQuiz?.message?.[lang]}"
              <VoiceButton text={currentQuiz?.message?.[lang] || ''} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '4px solid #E2E8F0', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertTriangle size={32} /> {currentQuiz?.question?.[lang]}
            <VoiceButton text={currentQuiz?.question?.[lang] || ''} />
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {currentQuiz.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={isAnswerRevealed}
                style={{
                  background: isAnswerRevealed 
                    ? (option.isCorrect ? '#D1FAE5' : (selectedAnswer?.id === option.id ? '#FEE2E2' : '#F8FAFC'))
                    : (selectedAnswer?.id === option.id ? '#DBEAFE' : '#FFFFFF'),
                  border: isAnswerRevealed
                    ? (option.isCorrect ? '4px solid var(--accent-success)' : (selectedAnswer?.id === option.id ? '4px solid var(--accent-danger)' : '4px solid #E2E8F0'))
                    : '4px solid #CBD5E1',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  padding: '2rem',
                  fontSize: '1.6rem',
                  color: '#000',
                  opacity: isAnswerRevealed && !option.isCorrect && selectedAnswer?.id !== option.id ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                 {isAnswerRevealed && option.isCorrect && <CheckCircle size={32} className="text-success" />}
                 {isAnswerRevealed && !option.isCorrect && selectedAnswer?.id === option.id && <XCircle size={32} className="text-danger" />}
                 {option?.text?.[lang]}
                 <VoiceButton text={option?.text?.[lang] || ''} />
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isAnswerRevealed && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                background: selectedAnswer.isCorrect ? '#D1FAE5' : '#FEE2E2',
                border: selectedAnswer.isCorrect ? '4px solid var(--accent-success)' : '4px solid var(--accent-danger)',
                padding: '2rem',
                borderRadius: '16px'
              }}>
                <h4 style={{ fontSize: '2rem', marginBottom: '1rem', color: selectedAnswer.isCorrect ? 'var(--accent-success-hover)' : 'var(--accent-danger-hover)' }}>
                  {selectedAnswer.isCorrect ? "You Got It Right! 🎉" : "Not Quite. Let's learn why:"}
                </h4>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0, color: '#000', display: 'flex', alignItems: 'center' }}>
                  {currentQuiz?.options?.find(opt => opt.isCorrect)?.explanation?.[lang]}
                  <VoiceButton text={currentQuiz?.options?.find(opt => opt.isCorrect)?.explanation?.[lang] || ''} />
                </p>

                <button 
                  className="btn-primary" 
                  style={{ marginTop: '2rem', padding: '1.5rem 3rem', fontSize: '1.5rem' }}
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
