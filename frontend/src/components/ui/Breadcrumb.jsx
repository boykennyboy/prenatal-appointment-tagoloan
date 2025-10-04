import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const Breadcrumb = ({ items }) => {
  return (
    <>
      <nav className='text-sm text-gray-600 mb-4'>
        <ol className='flex items-center space-x-2'>
          {items.map((item, index) => (
            <li key={index} className='flex items-center'>
              {item.to ? (
                <Link
                  to={item.to}
                  className='text-gray-500 hover:text-gray-700'
                >
                  {item.label}
                </Link>
              ) : (
                <span className='text-gray-800'>{item.label}</span>
              )}

              {index < items.length - 1 && (
                <span className='mx-1'>
                  <ChevronRight className='w-4 h-4 text-gray-400 mx-1' />
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
