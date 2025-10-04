import { ChevronLeft, ChevronRight } from 'lucide-react';

// Enhanced Calendar Component
const CalendarComponent = ({
  currentDate,
  onDateSelect,
  onNavigateMonth,
  appointments,
  getAvailableSlots,
}) => {
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl md:text-2xl font-bold text-gray-900'>
          {currentDate.toLocaleDateString('en-PH', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <div className='flex gap-2'>
          <button
            onClick={() => onNavigateMonth(-1)}
            className='p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200'
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onNavigateMonth(1)}
            className='p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200'
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className='grid grid-cols-7 gap-1 md:gap-2 mb-2'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='p-2 md:p-3 text-center text-sm md:text-base font-semibold text-gray-600 bg-gray-50 rounded-lg'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7 gap-1 md:gap-2'>
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isDisabled =
            !isCurrentMonth || isWeekend(day) || isPastDate(day);
          const dateStr = day.toISOString().split('T')[0];
          const dayAppointments = appointments[dateStr] || [];
          const availableSlots =
            isCurrentMonth && !isDisabled ? getAvailableSlots(day) : [];
          const bookingCount = dayAppointments.length;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && onDateSelect(day)}
              disabled={isDisabled}
              className={`
                p-2 md:p-4 text-sm md:text-base rounded-lg transition-all duration-200 relative 
                min-h-[60px] md:min-h-[80px] flex flex-col items-center justify-center border-2
                ${
                  isDisabled
                    ? 'text-gray-300 cursor-not-allowed border-gray-100 bg-gray-50'
                    : 'hover:bg-blue-50 cursor-pointer hover:scale-105 border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                }
                ${
                  isToday && !isDisabled
                    ? 'bg-blue-100 text-blue-800 font-bold border-blue-400'
                    : ''
                }
                ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
              `}
            >
              <span className='text-base md:text-lg font-semibold mb-1'>
                {day.getDate()}
              </span>

              {/* Booking Count Badge */}
              {!isDisabled && bookingCount > 0 && (
                <div className='bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mb-1'>
                  {bookingCount}
                </div>
              )}

              {/* Status Indicators */}
              {!isDisabled && (
                <div className='flex gap-1'>
                  {availableSlots.length > 0 && (
                    <div className='w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full'></div>
                  )}
                  {bookingCount > 0 && availableSlots.length === 0 && (
                    <div className='w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full'></div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarComponent;
