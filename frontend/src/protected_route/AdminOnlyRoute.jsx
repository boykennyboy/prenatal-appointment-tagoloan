import { Navigate } from 'react-router';
import { useAuthStore } from '../store/AuthStore';

const AdminOnlyRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to={'/'} replace />;
  }

  return children;
};

export default AdminOnlyRoute;
