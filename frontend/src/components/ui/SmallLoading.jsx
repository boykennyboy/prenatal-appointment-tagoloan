import { RefreshCw } from 'lucide-react';

const SmallLoading = ({ height }) => {
  return (
    <div className={`flex items-center justify-center ${height ? height : ''}`}>
      <RefreshCw className='w-6 h-6 text-blue-600 animate-spin mr-2' />
      <span className='text-gray-500'>Loading...</span>
    </div>
  );
};

export default SmallLoading;
