import { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash,
} from 'lucide-react';
import NotificationCard from '../../components/ui/NotificationCard';
import Container from '../../components/ui/Container';
import useNotificationStore from '../../store/notificationStore.js';
import api from '../../api/axios.js';
import SmallLoading from '../../components/ui/SmallLoading.jsx';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);

  const {
    unread_count,
    read_count,
    fetchUnreadCount,
    mark_as_read,
    mark_all_read,
    delete_notification,
    delete_all_read,
  } = useNotificationStore();

  const fetchNotifications = async () => {
    setLoading(true);
    fetchUnreadCount();
    try {
      const params = {
        page: currentPage,
        per_page: perPage,
        search: debouncedSearchTerm,
        filter: filter,
      };

      const res = await api.get('/api/notifications', { params });

      const data = res.data;

      if (data) {
        setNotifications(data.data.data);
        setTotalPages(data.meta?.last_page ?? data.last_page);
        setTotalRecords(data.meta?.total ?? data.total);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [debouncedSearchTerm, filter, currentPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];

    const createPageButton = (page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-3 py-2 mx-1 rounded-md text-sm font-medium transition-colors ${
          page === currentPage
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        }`}
      >
        {page}
      </button>
    );

    const addEllipsis = (key) => (
      <span key={key} className='px-2 text-gray-500'>
        ...
      </span>
    );

    // Handle edge cases first
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(createPageButton(i));
      }
      return pages;
    }

    // For pages 1, 2, 3: show 1 2 3 ... 13 14
    if (currentPage <= 3) {
      pages.push(createPageButton(1));
      pages.push(createPageButton(2));
      pages.push(createPageButton(3));
      pages.push(addEllipsis('ellipsis-end'));
      pages.push(createPageButton(totalPages - 1));
      pages.push(createPageButton(totalPages));
    }
    // For pages near the end (12, 13, 14): show 1 2 ... 12 13 14
    else if (currentPage >= totalPages - 2) {
      pages.push(createPageButton(1));
      pages.push(createPageButton(2));
      pages.push(addEllipsis('ellipsis-start'));
      pages.push(createPageButton(totalPages - 2));
      pages.push(createPageButton(totalPages - 1));
      pages.push(createPageButton(totalPages));
    }
    // For middle pages: show 1 2 ... current-1 current current+1 ... 13 14
    else {
      pages.push(createPageButton(1));
      pages.push(createPageButton(2));
      pages.push(addEllipsis('ellipsis-start'));
      pages.push(createPageButton(currentPage - 1));
      pages.push(createPageButton(currentPage));
      pages.push(createPageButton(currentPage + 1));
      pages.push(addEllipsis('ellipsis-end'));
      pages.push(createPageButton(totalPages - 1));
      pages.push(createPageButton(totalPages));
    }

    return pages;
  };

  const toggleExpanded = (notificationId) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(notificationId)) {
      newExpanded.delete(notificationId);
    } else {
      newExpanded.add(notificationId);
    }
    setExpandedNotifications(newExpanded);
  };

  const runAndRefresh = async (action, ...args) => {
    await action(...args);
    fetchNotifications();
  };

  // Usage
  const markAsRead = (id) => runAndRefresh(mark_as_read, id);
  const markAllAsRead = () => runAndRefresh(mark_all_read);
  const deleteNotification = (id) => runAndRefresh(delete_notification, id);
  const deleteAllRead = () => runAndRefresh(delete_all_read);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <Container title={'Notifications'}>
      <div className='max-w-7xl mx-auto p-6 min-h-screen'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Bell size={28} className='text-blue-600' />
                {unread_count > 0 && (
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                    {unread_count}
                  </span>
                )}
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Notifications
                </h1>
                <p className='text-sm text-gray-500'>
                  {unread_count > 0
                    ? `${unread_count} unread notifications`
                    : 'All caught up!'}
                </p>
              </div>
            </div>

            {unread_count > 0 && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50'
                >
                  <CheckCheck size={16} />
                  Mark All Read
                </button>
                {read_count > 0 && (
                  <button
                    onClick={deleteAllRead}
                    disabled={loading}
                    className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50'
                  >
                    <Trash size={16} />
                    Delete All Read
                  </button>
                )}
              </div>
            )}

            {unread_count === 0 && read_count > 0 && (
              <button
                onClick={deleteAllRead}
                disabled={loading}
                className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50'
              >
                <Trash size={16} />
                Delete All Read
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search
                size={16}
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              />
              <input
                type='text'
                placeholder='Search notifications...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
              />
            </div>

            <div className='flex gap-2'>
              {['all', 'unread', 'read'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => {
                    setFilter(filterType);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className='space-y-3'>
          {loading ? (
            <SmallLoading />
          ) : notifications.length === 0 ? (
            <div className='bg-white rounded-lg border border-gray-200 p-8 text-center'>
              <Bell size={48} className='mx-auto text-gray-300 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No notifications found
              </h3>
              <p className='text-gray-500'>
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isExpanded={expandedNotifications.has(notification.id)}
                onToggleExpand={() => toggleExpanded(notification.id)}
                onMarkAsRead={() => markAsRead(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
                loading={loading}
                formatTimeAgo={formatTimeAgo}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='text-sm text-gray-700'>
                Showing {(currentPage - 1) * perPage + 1} to{' '}
                {Math.min(currentPage * perPage, totalRecords)} of{' '}
                {totalRecords} results
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
                {renderPagination()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Notifications;
