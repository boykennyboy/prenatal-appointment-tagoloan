import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const Card = ({
  title = 'Total Appointments',
  value = '199',
  icon: IconComponent = User,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  path = '',
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className={`group bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow ${
        path ? 'cursor-pointer' : ''
      }`}
    >
      <div className='flex items-center'>
        <div className={`p-2 sm:p-3 ${iconBgColor} rounded-lg flex-shrink-0`}>
          <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
        </div>
        <div className='ml-3 sm:ml-4 min-w-0 flex-1'>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 truncate'>
            {value}
          </p>
          <p className='text-xs sm:text-sm text-gray-500 mt-1 leading-tight'>
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
