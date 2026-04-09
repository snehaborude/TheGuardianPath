import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Smartphone, Mail, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const quizData = [
  {
    id: 1,
    type: 'sms',
    icon: <Smartphone size={40} className="text-primary" />,
    scenario: "You receive a text message on your phone from an unknown number.",
    message: "USPS: Your package cannot be delivered due to wrong address. Please click here to update your info and pay the $1.20 redelivery fee: http://usps-package-update-alerts.com",
    question: "What is the biggest 'Red Flag' that shows this is a scam?",
    options: [
      { id: 'a', text: "The post office never makes mistakes.", isCorrect: false },
      { id: 'b', text: "The link address is very long and weird.", isCorrect: true, explanation: "Correct! The link doesn't go to the real 'USPS.com'. Scammers make fake websites that look real to steal your credit card." },
      { id: 'c', text: "It is asking for too little money.", isCorrect: false }
    ]
  },
  {
    id: 2,
    type: 'email',
    icon: <Mail size={40} className="text-warning" />,
    scenario: "You get an email that claims to be from the IRS (Tax Office).",
    message: "FINAL WARNING: You owe $850 in back taxes. If you do not pay immediately using Apple Gift Cards, the local police will come to arrest you in 2 hours.",
    question: "Why is this email definitely a scam?",
    options: [
      { id: 'a', text: "The government does not accept gift cards as payment.", isCorrect: true, explanation: "Correct! The IRS or police will never ask you to pay fines with gift cards. They also do not send threatening emails to arrest you." },
      { id: 'b', text: "The amount ($850) is too low.", isCorrect: false },
      { id: 'c', text: "The email doesn't have a picture.", isCorrect: false }
    ]
  },
  {
    id: 3,
    type: 'sms',
    icon: <Smartphone size={40} className="text-danger" />,
    scenario: "A text message claims your bank account is locked.",
    message: "Wells Fargo Alert: Suspicious activity detected. Your account is LOCKED. Reply with your PIN number to unlock it immediately.",
    question: "What is the scammer trying to do here?",
    options: [
      { id: 'a', text: "They are trying to help you secure your account.", isCorrect: false },
      { id: 'b', text: "They want you to type back in capital letters.", isCorrect: false },
      { id: 'c', text: "They want you to give away your secret PIN.", isCorrect: true, explanation: "Correct! A real bank will NEVER text or call you to ask for your PIN or password. If you ever get a message like this, call the bank directly using the number on the back of your card." }
    ]
  }
];

export default function RedFlagDetector() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = quizData[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= quizData.length;

  const handleSelect = (option) => {
    if (isAnswerRevealed) return; // Prevent clicking again
    setSelectedAnswer(option);
    setIsAnswerRevealed(true);

    if (option.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  if (isFinished) {
    return (
      <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', background: '#F8FAFC' }}>
          <CheckCircle size={100} className="text-success" style={{ margin: '0 auto 2rem auto' }} />
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--accent-success)' }}>Quiz Complete!</h2>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>You got {score} out of {quizData.length} correct.</p>
          <p style={{ fontSize: '1.6rem', marginBottom: '3rem' }}>
            Remember: if a message creates panic, asks for personal info, or tells you to click a strange link, it is a Red Flag!
          </p>
          <button className="btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.8rem' }} onClick={() => navigate('/')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem', paddingBottom: '3rem' }}>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={24} /> Go Back Home
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>The "Red Flag" Quiz</h1>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: '#E2E8F0', padding: '0.5rem 1rem', borderRadius: '12px' }}>
          Question {currentQuestionIndex + 1} of {quizData.length}
        </div>
      </div>

      <div className="glass-panel" style={{ border: '4px solid var(--accent-primary)', marginBottom: '3rem' }}>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
          {currentQuiz.icon}
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{currentQuiz.scenario}</h2>
            <div style={{ 
              background: currentQuiz.type === 'sms' ? '#DCF8C6' : '#F1F5F9', // Whatsapp green for SMS
              padding: '2rem',
              borderRadius: '16px',
              border: '2px solid #CBD5E1',
              fontSize: '1.8rem',
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              "{currentQuiz.message}"
            </div>
          </div>
        </div>

        <div style={{ borderTop: '4px solid #E2E8F0', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertTriangle size={32} /> {currentQuiz.question}
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
                 {option.text}
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
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0, color: '#000' }}>
                  {currentQuiz.options.find(opt => opt.isCorrect).explanation.replace('Correct! ', '')}
                </p>

                <button 
                  className="btn-primary" 
                  style={{ marginTop: '2rem', padding: '1.5rem 3rem', fontSize: '1.5rem' }}
                  onClick={handleNext}
                >
                  Go to Next Question
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
