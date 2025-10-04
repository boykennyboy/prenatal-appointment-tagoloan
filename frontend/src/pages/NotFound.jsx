import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className='w-dvw h-dvh flex justify-center items-center bg-gray-200'>
      <div className='flex flex-col items-center gap-3 w-auto h-auto'>
        <h3 className='text-gray-500 text-3xl font-extrabold'>- 404 -</h3>
        <h1 className='text-gray-700 text-6xl font-extrabold'>
          Oops! We can't find that page.
        </h1>
        <p className='text-gray-500 text-lg'>
          Please check the URL or try navigating from our homepage.
        </p>
        <Link
          to={'/'}
          className='primary-btn bg-gradient-to-r from-purple-600 to-pink-600 py-3 px-4 rounded-lg'
        >
          Go back to homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
