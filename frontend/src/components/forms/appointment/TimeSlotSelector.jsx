import { AlertCircle } from 'lucide-react';

// Time Slot Selection Component
const TimeSlotSelector = ({ date, availableSlots, onSlotSelect }) => (
  <div className='max-w-4xl mx-auto'>
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto'>
      {availableSlots.map((slot, index) => (
        <button
          key={index}
          onClick={() => onSlotSelect(slot)}
          className='p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center hover:scale-105 hover:shadow-md bg-white'
        >
          <div className='font-semibold text-gray-900 text-sm md:text-base'>
            {slot.start}
          </div>
          <div className='text-xs md:text-sm text-gray-500'>{slot.end}</div>
        </button>
      ))}
    </div>

    {availableSlots.length === 0 && (
      <div className='text-center py-12 text-gray-500'>
        <AlertCircle className='mx-auto mb-4' size={48} />
        <h3 className='text-lg font-medium mb-2'>No Available Slots</h3>
        <p>Please select a different date</p>
      </div>
    )}
  </div>
);

export default TimeSlotSelector;
