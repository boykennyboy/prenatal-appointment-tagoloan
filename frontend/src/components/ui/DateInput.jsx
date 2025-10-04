import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import cn from '../../utils/cn';

const DateInput = ({
  label,
  id,
  name,
  placeholder = 'Select a date',
  value,
  onChange,
  hasLabel = false,
  className = '',
  selectsRange = false,
  startDate = null,
  endDate = null,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    right: 'auto',
  });
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Handle both single date and date range
  const selectedDate =
    !selectsRange && value
      ? (() => {
          const [year, month, day] = value.split('-').map(Number);
          return new Date(year, month - 1, day);
        })()
      : null;

  const selectedStartDate =
    selectsRange && startDate ? new Date(startDate) : null;
  const selectedEndDate = selectsRange && endDate ? new Date(endDate) : null;

  // Calculate optimal dropdown position
  const calculateDropdownPosition = () => {
    if (!inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 400; // Approximate dropdown height
    const dropdownWidth = 320; // 80 * 4 = 320px (w-80)

    let top = inputRect.bottom + window.scrollY + 4; // 4px gap
    let left = inputRect.left + window.scrollX;
    let right = 'auto';

    // Check if dropdown would go below viewport
    if (inputRect.bottom + dropdownHeight > viewportHeight) {
      // Position above input instead
      top = inputRect.top + window.scrollY - dropdownHeight - 4;
    }

    // Check if dropdown would go beyond right edge
    if (inputRect.left + dropdownWidth > viewportWidth) {
      // Align to right edge of input
      left = 'auto';
      right = viewportWidth - inputRect.right - window.scrollX;
    }

    // Check if dropdown would go beyond left edge
    if (left < 0) {
      left = 8; // 8px margin from edge
    }

    setDropdownPosition({ top, left, right });
  };

  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();

      // Recalculate on window resize or scroll
      const handleResize = () => calculateDropdownPosition();
      const handleScroll = () => calculateDropdownPosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;

    if (selectsRange) {
      // Handle date range selection
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // Start new range
        onChange([new Date(date), null]);
      } else if (selectedStartDate && !selectedEndDate) {
        // Complete the range
        if (date >= selectedStartDate) {
          onChange([selectedStartDate, new Date(date)]);
          setIsOpen(false);
          setViewMode('days');
        } else {
          // If selected date is before start date, make it the new start date
          onChange([new Date(date), null]);
        }
      }
    } else {
      // Handle single date selection
      onChange({
        target: { name, value: formatted },
      });
      setIsOpen(false);
      setViewMode('days');
    }
  };

  const handleMonthSelect = (month) => {
    const newDate = new Date(currentDate.getFullYear(), month, 1);
    setCurrentDate(newDate);
    setViewMode('days');
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(year, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    setViewMode('months');
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const navigateDecade = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction * 10);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Manila',
    });
  };

  const formatDisplayValue = () => {
    if (selectsRange) {
      if (selectedStartDate && selectedEndDate) {
        return `${formatDisplayDate(selectedStartDate)} - ${formatDisplayDate(
          selectedEndDate
        )}`;
      } else if (selectedStartDate) {
        return `${formatDisplayDate(selectedStartDate)} - ...`;
      }
      return '';
    } else {
      return selectedDate ? formatDisplayDate(selectedDate) : '';
    }
  };

  const isDateInRange = (date) => {
    if (!selectsRange || !selectedStartDate) return false;
    if (!selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateRangeStart = (date) => {
    if (!selectsRange || !selectedStartDate) return false;
    return date.getTime() === selectedStartDate.getTime();
  };

  const isDateRangeEnd = (date) => {
    if (!selectsRange || !selectedEndDate) return false;
    return date.getTime() === selectedEndDate.getTime();
  };

  const getYearRange = () => {
    const currentYear = currentDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const years = [];
    for (let i = startYear; i < startYear + 12; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className='relative flex flex-col gap-2 mt-4 w-full'>
      {hasLabel && (
        <label className='text-gray-700' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='relative'>
        <div className='relative' ref={inputRef}>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Calendar className='text-gray-400 w-5 h-5' />
          </div>
          <input
            id={id}
            type='text'
            readOnly
            value={formatDisplayValue()}
            placeholder={placeholder}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              `w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer ${className}`
            )}
            {...props}
          />
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className='fixed z-[9999] w-80 bg-white border border-gray-200 rounded-lg shadow-lg'
            style={{
              top: `${dropdownPosition.top}px`,
              left:
                dropdownPosition.left !== 'auto'
                  ? `${dropdownPosition.left}px`
                  : 'auto',
              right:
                dropdownPosition.right !== 'auto'
                  ? `${dropdownPosition.right}px`
                  : 'auto',
            }}
          >
            <div className='p-4'>
              {/* Header */}
              <div className='flex items-center justify-between mb-4'>
                <button
                  onClick={() => {
                    if (viewMode === 'days') navigateMonth(-1);
                    else if (viewMode === 'months') navigateYear(-1);
                    else navigateDecade(-1);
                  }}
                  className='p-1 hover:bg-gray-100 rounded'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>

                <div className='flex gap-2'>
                  {viewMode === 'days' && (
                    <>
                      <button
                        onClick={() => setViewMode('months')}
                        className='px-3 py-1 hover:bg-gray-100 rounded font-medium'
                      >
                        {months[currentDate.getMonth()]}
                      </button>
                      <button
                        onClick={() => setViewMode('years')}
                        className='px-3 py-1 hover:bg-gray-100 rounded font-medium'
                      >
                        {currentDate.getFullYear()}
                      </button>
                    </>
                  )}
                  {viewMode === 'months' && (
                    <button
                      onClick={() => setViewMode('years')}
                      className='px-3 py-1 hover:bg-gray-100 rounded font-medium'
                    >
                      {currentDate.getFullYear()}
                    </button>
                  )}
                  {viewMode === 'years' && (
                    <span className='px-3 py-1 font-medium'>
                      {Math.floor(currentDate.getFullYear() / 10) * 10} -{' '}
                      {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (viewMode === 'days') navigateMonth(1);
                    else if (viewMode === 'months') navigateYear(1);
                    else navigateDecade(1);
                  }}
                  className='p-1 hover:bg-gray-100 rounded'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>

              {/* Days View */}
              {viewMode === 'days' && (
                <>
                  <div className='grid grid-cols-7 gap-1 mb-2'>
                    {weekdays.map((day) => (
                      <div
                        key={day}
                        className='p-2 text-center text-sm font-medium text-gray-500'
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className='grid grid-cols-7 gap-1'>
                    {getDaysInMonth(currentDate).map((day, index) => {
                      const isCurrentMonth =
                        day.getMonth() === currentDate.getMonth();
                      const isSelected =
                        !selectsRange &&
                        selectedDate &&
                        day.getDate() === selectedDate.getDate() &&
                        day.getMonth() === selectedDate.getMonth() &&
                        day.getFullYear() === selectedDate.getFullYear();
                      const isToday =
                        new Date().toDateString() === day.toDateString();
                      const inRange = selectsRange && isDateInRange(day);
                      const isRangeStart =
                        selectsRange && isDateRangeStart(day);
                      const isRangeEnd = selectsRange && isDateRangeEnd(day);
                      const isRangeSelected = isRangeStart || isRangeEnd;

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(day)}
                          className={`p-2 text-sm transition-colors relative ${
                            !isCurrentMonth ? 'text-gray-300' : 'text-gray-700'
                          } ${
                            isSelected
                              ? 'bg-purple-500 text-white hover:bg-purple-600 rounded'
                              : ''
                          } ${
                            isRangeSelected
                              ? 'bg-purple-500 text-white hover:bg-purple-600'
                              : ''
                          } ${
                            inRange && !isRangeSelected
                              ? 'bg-purple-100 text-purple-700'
                              : ''
                          } ${
                            isToday && !isSelected && !isRangeSelected
                              ? 'bg-purple-50 text-purple-700 font-semibold'
                              : ''
                          } ${
                            !isSelected && !isRangeSelected && !inRange
                              ? 'hover:bg-gray-100 rounded'
                              : ''
                          } ${
                            isRangeStart && !isRangeEnd
                              ? 'rounded-l rounded-r-none'
                              : ''
                          } ${
                            isRangeEnd && !isRangeStart
                              ? 'rounded-r rounded-l-none'
                              : ''
                          } ${isRangeStart && isRangeEnd ? 'rounded' : ''}`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Months View */}
              {viewMode === 'months' && (
                <div className='grid grid-cols-3 gap-2'>
                  {months.map((month, index) => {
                    const isSelected =
                      selectedDate &&
                      index === selectedDate.getMonth() &&
                      currentDate.getFullYear() === selectedDate.getFullYear();
                    const isCurrent = index === currentDate.getMonth();

                    return (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`p-3 text-sm rounded hover:bg-purple-50 transition-colors ${
                          isSelected
                            ? 'bg-purple-500 text-white hover:bg-purple-600'
                            : 'text-gray-700'
                        } ${
                          isCurrent && !isSelected
                            ? 'bg-purple-100 text-purple-700'
                            : ''
                        }`}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Years View */}
              {viewMode === 'years' && (
                <div className='grid grid-cols-3 gap-2'>
                  {getYearRange().map((year) => {
                    const isSelected =
                      selectedDate && year === selectedDate.getFullYear();
                    const isCurrent = year === currentDate.getFullYear();

                    return (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`p-3 text-sm rounded hover:bg-purple-50 transition-colors ${
                          isSelected
                            ? 'bg-purple-500 text-white hover:bg-purple-600'
                            : 'text-gray-700'
                        } ${
                          isCurrent && !isSelected
                            ? 'bg-purple-100 text-purple-700'
                            : ''
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateInput;
