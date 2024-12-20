import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' && e.newValue === null) {
        // Only redirect if we're on a protected route
        window.location.replace('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isAuthenticated) {
    // Redirect to home if not authenticated, preserving the intended destination
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;