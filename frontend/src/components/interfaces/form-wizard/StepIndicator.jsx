import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, error }) => {
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
      </div>
    </div>
  );
};

export default StepIndicator;
