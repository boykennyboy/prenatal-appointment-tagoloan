import { Link } from 'react-router';

const LinkCards = ({ icon: Icon, title, description, linkTo, iconColor }) => {
  return (
    <Link
      to={linkTo}
      className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100`}
    >
      <div className='flex items-center mb-4'>
        <div className={`${iconColor} p-3 rounded-lg mr-4`}>
          <Icon size={28} className='text-white' />
        </div>
        <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
      </div>
      <p className='text-gray-600 leading-relaxed'>{description}</p>
      <div className='mt-4 flex items-center text-blue-600 font-medium'>
        <span>View Reports</span>
        <svg
          className='ml-2 w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5l7 7-7 7'
          />
        </svg>
      </div>
    </Link>
  );
};

export default LinkCards;
