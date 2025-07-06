import { Navigate } from 'react-router-dom';

// Auth guard component to check if user is authenticated and has the correct role
const RequireAuth = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') ||'{}');
  
  // If user is not authenticated, redirect to login
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific role is required and user doesn't have it, redirect to their dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}-dashboard`} replace />;
  }
  
  // User is authenticated and has correct role, render the protected component
  return children;
};

export default RequireAuth;
