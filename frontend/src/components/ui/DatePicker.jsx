import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

const DatePicker = ({
  options,
  value,
  formData,
  setFormData,
  onChange,
  name,
  id,
  label,
  hasLabel = false,
  placeholder = 'Select Date',
  disabled = false,
  mode = 'single',
  disable_weekends = false,
  dateFormat = 'Y-m-d',
  enableTime = false,
  noCalendar = false,
  className,
}) => {
  const [range, setRange] = useState([]);
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        if (pickerRef.current.flatpickr) {
          pickerRef.current.flatpickr.close;
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (selectedDates, dateStr, instance) => {
    if (onChange) {
      if (!options && selectedDates.length > 1) {
        onChange(selectedDates);
      } else {
        onChange({
          target: {
            name: name,
            value: dateStr,
          },
        });
      }
    } else {
      if (selectedDates.length > 1) {
        setRange(selectedDates);
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: dateStr,
        }));
      }
    }
  };

  let picker_options = {
    mode: mode,
    altInput: true,
    altFormat: 'M j, Y',
    dateFormat: dateFormat,
    // Mobile-friendly options - CRITICAL FOR MOBILE
    appendTo: document.body, // Append to body to avoid overflow issues
    static: false, // Allow dynamic positioning
    position: 'auto', // Auto-position based on available space
    disableMobile: false, // Enable mobile mode
    clickOpens: true, // Ensure clicking opens the calendar
    allowInput: false, // Prevent manual input to avoid conflicts
  };

  if (disable_weekends) {
    picker_options.disable = [
      (date) => date.getDay() === 0 || date.getDay() === 6,
    ];
  }

  if (enableTime && noCalendar) {
    picker_options.enableTime = true;
    picker_options.noCalendar = true;
    picker_options.altFormat = 'H:i';
  }

  if (options) {
    picker_options = { ...picker_options, ...options };
  }

  // Merge with custom options if provided

  return (
    <div className='flex flex-col gap-2 mt-4 w-full'>
      {hasLabel && (
        <label className='text-gray-700 font-medium' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='relative' ref={pickerRef}>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-0'>
          <Calendar className='h-5 w-5 text-gray-400' />
        </div>
        <Flatpickr
          value={value || formData?.[name] || ''}
          id={id}
          name={name}
          onChange={handleChange}
          options={picker_options}
          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
          } ${className || ''}`}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default DatePicker;
