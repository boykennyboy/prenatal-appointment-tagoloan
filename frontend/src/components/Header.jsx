import { Bell, Calendar, UserRound, Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../store/AuthStore.js';
import useNotificationStore from '../store/notificationStore.js';
import NotificationCard from './ui/NotificationCard';
import SmallLoading from './ui/SmallLoading';
import api from '../api/axios.js';

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const [openNotification, setOpenNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const { unread_count, delete_notification, mark_as_read } =
    useNotificationStore();

  // Refs for click outside functionality
  const notificationRef = useRef(null);
  const bellRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/limited-notifications');
      const data = res.data;

      if (data) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }
    };

    if (openNotification) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openNotification]);

  const toggleExpanded = (id) => {
    setExpandedNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const runAndRefresh = async (action, ...args) => {
    await action(...args);
    fetchNotifications();
  };

  const markAsRead = (id) => runAndRefresh(mark_as_read, id);
  const deleteNotification = (id) => runAndRefresh(delete_notification, id);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const handleBellClick = () => {
    const newState = !openNotification;
    setOpenNotification(newState);
    if (newState) {
      fetchNotifications(); // only runs when opening
    }
  };

  return (
    <header
      className={`w-full sticky top-3 z-40 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-white/70 shadow-md rounded-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className='w-full flex justify-between items-center px-2 sm:px-5 py-4 sm:py-6'>
        {/* Left side */}
        <div className='flex items-center gap-4'>
          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='px-3 py-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-colors sm:hidden'
          >
            <Menu className='h-6 w-6' />
          </button>

          {/* Welcome text */}
          <h1 className='text-lg sm:text-2xl font-bold text-black'>
            <span className='hidden sm:inline'>Welcome back {user.name}</span>
          </h1>
        </div>

        {/* Right side */}
        <div className='flex gap-4 sm:gap-6 items-center'>
          {/* Appointment button */}
          {user.role_id !== 2 && (
            <>
              <Link
                to='appointments/create'
                className='group hidden md:flex items-center gap-2 py-2 px-3 
                  bg-purple-600 hover:bg-purple-500 text-white rounded-md 
                  cursor-pointer transition-colors shadow-md'
              >
                <Calendar className='h-4 w-4' />
                <span className='font-semibold tracking-wide text-sm'>
                  Make Appointment
                </span>
              </Link>
              <Link
                to='appointments/create'
                className='md:hidden p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md cursor-pointer transition-colors shadow-md'
              >
                <Calendar className='h-5 w-5' />
              </Link>
            </>
          )}

          {/* Notifications */}
          {user.role_id !== 2 && (
            <div className='relative'>
              {unread_count > 0 && (
                <span className='absolute w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white -top-2 sm:-top-3 -right-1 sm:-right-2 z-10'>
                  {unread_count}
                </span>
              )}
              <Bell
                ref={bellRef}
                onClick={handleBellClick}
                className='h-8 w-8 sm:h-10 sm:w-10 p-1.5 sm:p-2 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition-colors'
              />
              {openNotification && (
                <div
                  ref={notificationRef}
                  className='absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50'
                >
                  {/* Header */}
                  <div className='flex items-center justify-between p-4 border-b border-gray-100'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Notifications
                    </h3>
                    <button
                      onClick={() => setOpenNotification(false)}
                      className='text-gray-400 hover:text-gray-600 transition-colors'
                    >
                      <X className='h-5 w-5' />
                    </button>
                  </div>

                  {loading ? (
                    <div className='p-4'>
                      <SmallLoading />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className='text-center py-6'>
                      <Bell size={36} className='mx-auto text-gray-300 mb-2' />
                      <p className='text-gray-500'>No notifications</p>
                    </div>
                  ) : (
                    <>
                      {/* Notifications List */}
                      <div className='max-h-80 overflow-y-auto p-4 space-y-3'>
                        {notifications.map((n) => (
                          <NotificationCard
                            key={n.id}
                            notification={n}
                            isExpanded={expandedNotifications.has(n.id)}
                            onToggleExpand={() => toggleExpanded(n.id)}
                            onMarkAsRead={() => markAsRead(n.id)}
                            onDelete={() => deleteNotification(n.id)}
                            loading={loading}
                            formatTimeAgo={formatTimeAgo}
                          />
                        ))}
                      </div>

                      {/* Footer */}
                      <div className='p-4 border-t border-gray-100'>
                        <Link
                          to={'/admin/notifications'}
                          onClick={() => setOpenNotification(false)}
                          className='block w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-md transition-colors'
                        >
                          View All Notifications
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          <div className='flex items-center gap-2 py-2 px-2 sm:px-3 bg-white rounded-md shadow-md'>
            <UserRound className='h-5 w-5 sm:h-6 sm:w-6' />
            <span className='capitalize font-semibold text-sm hidden sm:inline'>
              {user.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
