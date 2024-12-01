import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';  // Firebase auth import

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Listen to the Firebase auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);  // User is authenticated
      } else {
        setAuthenticated(false);  // User is not authenticated
      }
      setLoading(false);  // Finish loading once authentication state is checked
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // You can show a loading spinner here
  }

  if (!authenticated) {
    return <Navigate to="/login" />;  // Redirect to login if not authenticated
  }

  return children;  // Render the protected component if authenticated
};

export default ProtectedRoute;
