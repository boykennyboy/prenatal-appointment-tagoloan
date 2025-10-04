import cn from '../../utils/cn.js';

const SelectGroup = ({
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
  options = [],
  children,
  required = false,
  optional = false,
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e);
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
        <select
          name={name}
          value={value ?? name}
          onChange={handleChange}
          className={cn(
            `w-full ${
              icon ? 'pl-10 pr-4' : 'px-2'
            }  py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`,
            className
          )}
          id={id}
          {...props}
        >
          <option value=''>{placeholder}</option>
          {options.length > 0 &&
            options.map((option, index) => (
              <option
                key={index}
                value={option.value}
                style={{ color: '#000000' }}
              >
                {option.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default SelectGroup;
