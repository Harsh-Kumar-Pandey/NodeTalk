import { useState, useCallback, useRef } from 'react';

export function useNotification() {
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  const serverTimeoutRef = useRef(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (serverTimeoutRef.current) clearTimeout(serverTimeoutRef.current);
  }, []);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    setNotification({ message, type });

    if (duration) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  }, []);

  // For API calls - shows loading then auto-switches to timeout message after 30 seconds
  const showApiLoadingWithTimeout = useCallback((loadingMessage = 'Loading...', timeoutMessage = 'Server is taking time, please keep calm...', timeoutMs = 4000) => {
    clearNotification();
    setNotification({ message: loadingMessage, type: 'loading' });

    if (serverTimeoutRef.current) clearTimeout(serverTimeoutRef.current);
    serverTimeoutRef.current = setTimeout(() => {
      setNotification({ message: timeoutMessage, type: 'warning' });
    }, timeoutMs);
  }, [clearNotification]);

  const showSuccess = useCallback((message = 'Success!', duration = 5000) => {
    clearNotification();
    showNotification(message, 'success', duration);
  }, [showNotification, clearNotification]);

  const showError = useCallback((message = 'An error occurred', duration = 5000) => {
    clearNotification();
    showNotification(message, 'error', duration);
  }, [showNotification, clearNotification]);

  const showWarning = useCallback((message = 'Warning', duration = 5000) => {
    clearNotification();
    showNotification(message, 'warning', duration);
  }, [showNotification, clearNotification]);

  const hideNotification = useCallback(() => {
    clearNotification();
  }, [clearNotification]);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showApiLoadingWithTimeout,
    clearNotification: hideNotification
  };
}