import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import PropTypes from 'prop-types';

const ConfettiSuccess = ({ isActive, message, onComplete }) => {
  useEffect(() => {
    if (isActive) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;
      
      const runConfetti = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#553c9a', '#805ad5', '#d53f8c']
        });
        
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#553c9a', '#805ad5', '#d53f8c']
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };
      
      runConfetti();
      
      // Auto-close after duration
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration + 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <svg 
            className="w-16 h-16 mx-auto text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Success!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        
        <button
          onClick={onComplete}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

ConfettiSuccess.propTypes = {
  isActive: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired
};

export default ConfettiSuccess; 