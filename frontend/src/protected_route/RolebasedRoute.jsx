import { Navigate } from 'react-router';
import { useAuthStore } from '../store/authStore.js';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to='/' replace />; // not logged in → login
  }

  if (!allowedRoles.includes(user.role_id)) {
    return <Navigate to='/admin/dashboard' replace />; // not allowed
  }

  return children;
};

export default RoleBasedRoute;
