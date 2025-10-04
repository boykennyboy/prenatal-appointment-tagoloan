import { Navigate } from 'react-router';
import { useAuthStore } from '../store/AuthStore';

const GuestOnlyRoute = ({ children }) => {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to={'/admin/dashboard'} replace />;
  }

  return children;
};

export default GuestOnlyRoute;
