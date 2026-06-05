import React, { useEffect, useState } from 'react';

export default function NotificationToast({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onDismiss 
}) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      // Only auto-dismiss if duration is set (not for persistent messages like loading)
      if (duration && type !== 'loading') {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onDismiss) onDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [message, duration, type, onDismiss]);

  if (!isVisible || !message) return null;

  // Define styles based on message type
  const typeStyles = {
    success: {
      bg: 'bg-green-900/20',
      border: 'border-green-600',
      text: 'text-green-300',
      icon: '✓'
    },
    error: {
      bg: 'bg-red-900/20',
      border: 'border-red-600',
      text: 'text-red-300',
      icon: '✕'
    },
    warning: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-600',
      text: 'text-yellow-300',
      icon: '⚠'
    },
    loading: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-600',
      text: 'text-blue-300',
      icon: null
    },
    info: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-600',
      text: 'text-blue-300',
      icon: 'ℹ'
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className={`fixed top-4 right-4 max-w-sm z-50 animate-slideIn`}>
      <div 
        className={`${style.bg} border ${style.border} rounded-lg p-4 shadow-lg backdrop-blur-sm`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {type === 'loading' ? (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className={`${style.text} text-lg font-bold`}>
                {style.icon}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className={`${style.text} text-sm font-medium leading-relaxed`}>
              {message}
            </p>
          </div>
          {type !== 'loading' && (
            <button
              onClick={() => {
                setIsVisible(false);
                if (onDismiss) onDismiss();
              }}
              className={`${style.text} hover:opacity-75 transition-opacity flex-shrink-0 text-lg`}
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}