import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

const InfoCell = ({ value }) => {
  const [open, setOpen] = useState(false);

  if (!value) return <span className='text-gray-400 italic'>N/A</span>;

  const changesCount = Object.keys(value.new || {}).length;

  // Only calculate modified count if old data exists
  const modifiedCount = value.old
    ? Object.keys(value.new || {}).filter(
        (key) => value.old?.[key] !== value.new?.[key]
      ).length
    : 0;

  const hasOldData = Boolean(value.old);

  return (
    <div className='text-xs'>
      <button
        className='group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200'
        onClick={() => setOpen(!open)}
      >
        <div
          className={`transition-transform duration-200 ${
            open ? 'rotate-0' : '-rotate-90'
          }`}
        >
          <ChevronDown size={14} className='text-blue-600' />
        </div>

        <div className='flex items-center gap-2'>
          {open ? (
            <EyeOff size={14} className='text-blue-600' />
          ) : (
            <Eye size={14} className='text-blue-600' />
          )}
          <span className='text-blue-600 font-medium group-hover:text-blue-700'>
            {hasOldData ? 'View Changes' : 'View Data'}
          </span>
        </div>

        <div className='flex items-center gap-1 text-xs'>
          <span className='bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium'>
            {changesCount}
          </span>
          {hasOldData && modifiedCount > 0 && (
            <span className='bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium'>
              {modifiedCount} modified
            </span>
          )}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-sm'>
          {/* Header - conditional columns based on whether old data exists */}
          <div
            className={`grid ${
              hasOldData ? 'grid-cols-3' : 'grid-cols-2'
            } gap-4 px-4 py-3 bg-gray-100 border-b border-gray-200 rounded-t-lg`}
          >
            <span className='font-semibold text-gray-700 text-xs uppercase tracking-wide'>
              Field
            </span>
            {hasOldData && (
              <span className='font-semibold text-gray-700 text-xs uppercase tracking-wide'>
                Previous
              </span>
            )}
            <span className='font-semibold text-gray-700 text-xs uppercase tracking-wide'>
              {hasOldData ? 'Current' : 'Value'}
            </span>
          </div>

          {/* Content */}
          <div className='max-h-40 overflow-auto'>
            {Object.keys(value.new || {}).map((key, index) => {
              const oldVal = value.old?.[key];
              const newVal = value.new?.[key];
              const changed = hasOldData && oldVal !== newVal;
              const isLast = index === Object.keys(value.new || {}).length - 1;

              return (
                <div
                  key={key}
                  className={`grid ${
                    hasOldData ? 'grid-cols-3' : 'grid-cols-2'
                  } gap-4 px-4 py-3 hover:bg-white/50 transition-colors duration-150 ${
                    !isLast ? 'border-b border-gray-150' : ''
                  } ${changed ? 'bg-yellow-50/30' : ''}`}
                >
                  <div className='flex items-center'>
                    <span className='font-medium text-gray-800 text-xs'>
                      {key
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {changed && (
                      <div className='ml-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse'></div>
                    )}
                  </div>

                  {hasOldData && (
                    <div className='flex items-center'>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          changed
                            ? 'bg-red-50 text-red-600 line-through border border-red-200'
                            : 'text-gray-600 bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {oldVal ?? (
                          <span className='italic text-gray-400'>empty</span>
                        )}
                      </span>
                    </div>
                  )}

                  <div className='flex items-center'>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        changed
                          ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                          : 'text-gray-600 bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {newVal ?? (
                        <span className='italic text-gray-400'>empty</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer with summary */}
          {changesCount > 3 && (
            <div className='px-4 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg'>
              <div className='text-xs text-gray-500 text-center'>
                Showing {Math.min(changesCount, 10)} of {changesCount} fields
                {hasOldData &&
                  modifiedCount > 0 &&
                  ` • ${modifiedCount} modified`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCell;
