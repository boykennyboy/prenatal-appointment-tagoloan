import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, error, formData }) => {
  const showDiscontinuedWarning =
    currentStep === 3 &&
    formData?.patient_type === 'existing' &&
    formData?.record_status === 'discontinued';

  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between mb-4'>
        {steps.map((step, index) => (
          <div key={step.number} className='flex items-center'>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm ${
                Object.keys(error).length > 0
                  ? 'bg-red-500 border-red-500 text-white'
                  : currentStep === step.number
                  ? 'bg-purple-500 border-purple-500 text-white'
                  : currentStep > step.number
                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > step.number ? (
                <Check className='h-5 w-5' />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block w-32 h-0.5 ml-4 ${
                  Object.keys(error).length > 0
                    ? 'bg-red-500'
                    : currentStep > step.number
                    ? 'bg-purple-500'
                    : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className='text-center'>
        <h2 className='text-xl font-semibold text-gray-900'>
          {steps[currentStep - 1].title}
        </h2>
        <p className='text-gray-600'>{steps[currentStep - 1].description}</p>

        {showDiscontinuedWarning && (
          <div className='mt-3 mx-auto max-w-2xl'>
            <div className='flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
              <AlertTriangle className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-amber-800 text-left'>
                <span className='font-semibold'>Important:</span> This patient
                has a discontinued record. Please conduct a thorough interview
                to gather updated health information before proceeding.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepIndicator;
