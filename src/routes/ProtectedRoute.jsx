import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import ScrollToTopButton from '../components/ScrollToTopButton';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace/>;
  }

  // If user exists, render child routes
  return (
    <>
      <Outlet />
      <ScrollToTopButton />
    </>
  )
};

export default ProtectedRoute;
