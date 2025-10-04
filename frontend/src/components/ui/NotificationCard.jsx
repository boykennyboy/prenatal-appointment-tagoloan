import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Mail,
  MailOpen,
  Trash2,
} from 'lucide-react';

const NotificationCard = ({
  notification,
  isExpanded,
  onToggleExpand,
  onMarkAsRead,
  onDelete,
  loading,
  formatTimeAgo,
}) => {
  return (
    <div
      onClick={onToggleExpand}
      className={`bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
        !notification.is_read
          ? 'border-blue-200 bg-blue-50/30'
          : 'border-gray-200'
      }`}
    >
      {/* Main notification content */}
      <div className='p-4'>
        <div className='flex items-start gap-3'>
          {/* Status indicator */}
          <div className='flex-shrink-0 mt-1'>
            {notification.is_read ? (
              <MailOpen size={20} className='text-gray-400' />
            ) : (
              <Mail size={20} className='text-blue-600' />
            )}
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h3
                    className={`font-semibold truncate ${
                      !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {notification.title}
                  </h3>
                  {!notification.is_read && (
                    <span className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></span>
                  )}
                </div>

                <p
                  className={`text-gray-600 mb-2 ${
                    isExpanded ? '' : 'text-sm'
                  }`}
                >
                  {notification.message.length > 100 && !isExpanded
                    ? `${notification.message.slice(0, 100)}...`
                    : notification.message}
                </p>

                <div className='flex items-center gap-4 text-xs text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <Clock size={12} />
                    {formatTimeAgo(notification.created_at)}
                  </div>
                  {notification.read_at && (
                    <div className='text-green-600'>
                      Read {formatTimeAgo(notification.read_at)}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-2 flex-shrink-0'>
                {notification.message.length > 100 && (
                  <button
                    onClick={onToggleExpand}
                    className='p-1 text-gray-400 rounded-xs hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200'
                  >
                    {isExpanded ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </button>
                )}

                {!notification.is_read && (
                  <button
                    onClick={onMarkAsRead}
                    disabled={loading}
                    className='p-1 text-blue-600 rounded-xs hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 disabled:opacity-50'
                    title='Mark as read'
                  >
                    <Check size={20} />
                  </button>
                )}

                <button
                  onClick={onDelete}
                  disabled={loading}
                  className='p-1 text-red-500 rounded-xs hover:bg-red-100 hover:text-red-700 transition-colors duration-200 disabled:opacity-50'
                  title='Delete notification'
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {/* {isExpanded && notification.message.length > 100 && (
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='bg-gray-50 rounded-lg p-4'>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {notification.message}
              </p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default NotificationCard;
