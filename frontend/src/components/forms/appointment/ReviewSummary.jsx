// Review Summary Component
const ReviewSummary = ({ formData, priorities, selectedDate }) => (
  <div className='max-w-md mx-auto'>
    <div className='bg-gray-50 rounded-xl p-6 space-y-4 mb-8'>
      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Date:</span>
        <span className='text-gray-900'>
          {selectedDate?.toLocaleDateString('en-PH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Time:</span>
        <span className='text-gray-900'>Automatic based on priority.</span>
      </div> */}

      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Patient Name:</span>
        <span className='text-gray-900'>{formData.fullname}</span>
      </div>

      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Visit Count:</span>
        <span className='text-gray-900'>{formData.visit_count}</span>
      </div>

      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Priority:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            priorities[formData.priority].color
          }`}
        >
          {priorities[formData.priority].label}
        </span>
      </div>

      {formData.note && (
        <div>
          <span className='font-medium text-gray-700 block mb-2'>Notes:</span>
          <p className='text-gray-900 text-sm bg-white p-3 rounded-lg border'>
            {formData.note}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default ReviewSummary;
