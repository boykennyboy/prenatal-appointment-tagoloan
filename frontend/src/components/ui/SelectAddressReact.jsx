import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Select from 'react-select';
import { fetchOptions } from '../../utils/functions';

// Session-based cache that clears when page reloads
const getSessionCache = () => {
  if (!window.sessionStorage) return new Map();

  try {
    const cached = sessionStorage.getItem('select_options_cache');
    return cached ? new Map(JSON.parse(cached)) : new Map();
  } catch {
    return new Map();
  }
};

const setSessionCache = (cache) => {
  if (!window.sessionStorage) return;

  try {
    sessionStorage.setItem('select_options_cache', JSON.stringify([...cache]));
  } catch {
    // Ignore storage errors
  }
};

const SelectAddressReact = ({
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
  onChange,
  isEdit = false,
  showSkeletonOnEdit = false,
  required = false,
  optional = false,
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const abortControllerRef = useRef(null);

  // Use session storage for caching (clears on page reload)
  const cacheKey = useMemo(() => endpoint, [endpoint]);

  const loadOptions = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (disabled) {
      setOptions([]);
      setHasLoadedOnce(false);
      return;
    }

    // Check session cache first
    const cache = getSessionCache();
    if (cache.has(cacheKey)) {
      const cachedOptions = cache.get(cacheKey);
      setOptions(cachedOptions);
      setHasLoadedOnce(true);
      return;
    }

    // Only show loading on first load during edit
    const shouldShowLoading = isEdit && showSkeletonOnEdit && !hasLoadedOnce;
    setIsLoading(shouldShowLoading);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const opts = await fetchOptions(endpoint, valueKey, labelKey);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setOptions(opts);
      setHasLoadedOnce(true);

      // Cache in session storage
      const cache = getSessionCache();
      cache.set(cacheKey, opts);
      setSessionCache(cache);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching options:', error);
        setOptions([]);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [
    endpoint,
    valueKey,
    labelKey,
    disabled,
    isEdit,
    showSkeletonOnEdit,
    hasLoadedOnce,
    cacheKey,
  ]);

  useEffect(() => {
    loadOptions();

    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadOptions]);

  const handleChange = useCallback(
    (selected) => {
      if (onChange) {
        onChange(selected ? selected.value : 0);
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: selected ? selected.value : 0,
        }));
      }
    },
    [onChange, setFormData, name]
  );

  // Memoize the current value calculation
  const currentValue = useMemo(() => {
    return options.find((item) => item.value === formData[name]) || null;
  }, [options, formData, name]);

  return (
    <div className='flex flex-col gap-2 w-full'>
      <label className='text-gray-700' htmlFor={id}>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
        {optional && <span className='text-gray-400 ml-1'>(optional)</span>}
      </label>
      {isLoading ? (
        <div className='animate-pulse'>
          <div className='h-10 bg-gray-200 rounded-md'></div>
        </div>
      ) : (
        <Select
          inputId={id}
          name={name}
          options={options}
          className='text-sm'
          classNamePrefix='react-select'
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          isClearable
          isDisabled={disabled}
        />
      )}
    </div>
  );
};

export default SelectAddressReact;
