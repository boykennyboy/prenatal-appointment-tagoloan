import { X } from 'lucide-react';
import cn from '../../utils/cn';

const FormModal = ({ children, closeModal, isEdit, title, className }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center p-0 sm:p-4 justify-center h-screen'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300'
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div
        className={cn(
          `relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xl mx-4 duration-300 border border-white/20 ${className}`
        )}
      >
        <div className='relative bg-white rounded-3xl px-2 py-5 sm:p-8 max-h-[90vh] overflow-y-auto'>
          {/* Header */}
          <div className='flex items-center px-4 justify-between mb-6'>
            <div className='flex items-center gap-3'>
              <h1 className='text-xl sm:text-2xl font-semibold'>
                {isEdit ? `Edit ${title}` : `Add ${title}`}
              </h1>
            </div>

            <button
              onClick={closeModal}
              className='w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200 group'
            >
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>

          {/* Form */}
          <div className='space-y-6'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
