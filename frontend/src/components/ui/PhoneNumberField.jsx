import { useState } from 'react';
import cn from '../../utils/cn';

export default function PhoneNumberField({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  icon = null,
  hasLabel = false,
  hasChildren = false,
  required = false,
  optional = false,
  children,
  ...props
}) {
  const [phone, setPhone] = useState(value || '');

  const formatPHNumber = (input) => {
    // Remove all non-digits
    let digits = input.replace(/\D/g, '');

    // Remove leading 0 or 63 to normalize
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (digits.startsWith('63')) digits = digits.slice(2);

    // Limit to max 10 digits (standard PH mobile)
    digits = digits.slice(0, 10);

    // Format as 9XX XXX XXXX
    if (digits.length <= 3) return `${digits}`;
    if (digits.length <= 6) return `${digits.slice(0, 3)}${digits.slice(3)}`;
    return `${digits.slice(0, 3)}${digits.slice(3, 6)}${digits.slice(6)}`;
  };

  const handleChange = (e) => {
    const formatted = formatPHNumber(e.target.value);
    setPhone(formatted);
    onChange && onChange(e, `63${formatted}`); // pass value back to parent form
  };

  return (
    <div className='flex flex-col gap-2 mt-4 w-full'>
      {hasLabel && (
        <label className='text-gray-700' htmlFor={id}>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
          {optional && <span className='text-gray-400 ml-1'>(optional)</span>}
        </label>
      )}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          {icon && icon}
        </div>
        <input
          type={type}
          name={name}
          value={phone}
          onChange={handleChange}
          className={cn(
            'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all',
            className
          )}
          placeholder={placeholder}
          id={id}
          {...props}
        />
        {children}
      </div>
    </div>
  );
}
