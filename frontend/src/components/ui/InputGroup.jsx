import cn from '../../utils/cn.js';

const InputGroup = ({
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
  noNumbers = false,
  required = false,
  optional = false,
  children,
  ...props
}) => {
  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (noNumbers) {
      inputValue = inputValue.replace(/[^a-zA-Z.\- ]/g, '');
    }

    // Call parent onChange with cleaned value
    onChange({
      target: {
        name: e.target.name,
        value: inputValue,
      },
    });
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
          value={value}
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
};

export default InputGroup;
