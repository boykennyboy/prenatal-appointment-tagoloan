import { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchOptions } from '../../utils/functions';

const SelectReact = ({
  label,
  id,
  name,
  endpoint,
  placeholder,
  formData,
  setFormData,
  valueKey = 'id',
  labelKey = 'name',
  disabled = false,
  isClearable = true,
  isMenuOpen = undefined,
  isSearchable = true,
  required = false,
  optional = false,
  onChange,
  inputChange,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      if (!disabled) {
        const opts = await fetchOptions(endpoint, valueKey, labelKey);
        setOptions(opts);
      } else {
        setOptions([]);
      }
    };
    loadOptions();
  }, [endpoint, valueKey, labelKey, disabled]);

  const handleChange = (selected) => {
    if (onChange) {
      onChange(selected ? selected.value : 0);
    } else if (inputChange) {
      inputChange(
        selected ? selected.value : 0,
        selected ? selected.label : ''
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selected ? selected.value : 0,
      }));
    }
  };

  const currentValue = options.find((item) => item.value === formData[name]);

  return (
    <div className='flex flex-col gap-2 w-full'>
      <label className='text-gray-700' htmlFor={id}>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
        {optional && <span className='text-gray-400 ml-1'>(optional)</span>}
      </label>
      <Select
        inputId={id}
        name={name}
        options={options}
        className='text-sm'
        classNamePrefix='react-select'
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        isClearable={isClearable}
        isDisabled={disabled}
        menuIsOpen={isMenuOpen}
        isSearchable={isSearchable}
      />
    </div>
  );
};

export default SelectReact;
