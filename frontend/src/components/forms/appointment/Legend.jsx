// Legend Component
const Legend = () => (
  <div className='mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
    <h4 className='font-medium text-gray-900 mb-3'>Legend:</h4>
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
        <span>Available slots</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
        <span>Fully booked</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
        <span>Today</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-gray-300 rounded-full'></div>
        <span>Unavailable</span>
      </div>
    </div>
  </div>
);

export default Legend;
