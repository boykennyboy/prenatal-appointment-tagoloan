import { Navigate } from 'react-router';
import { useAuthStore } from '../store/authStore.js';

const AdminOnlyRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to={'/'} replace />;
  }

  return children;
};

export default AdminOnlyRoute;
