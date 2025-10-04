import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationButtons = ({
  currentStep,
  totalSteps,
  patientType,
  isSubmitted,
  isSubmitting,
  isEdit,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  if (isSubmitted) return null;

  const isNextDisabled = currentStep === 1 && !patientType;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className='flex justify-between'>
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center px-6 py-2 border border-gray-300 rounded-md font-medium ${
          currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <ChevronLeft className='h-4 w-4 mr-2' />
        Back
      </button>

      <button
        onClick={isLastStep ? onSubmit : onNext}
        disabled={isNextDisabled || isSubmitting}
        className={`flex items-center px-6 py-2 rounded-md font-medium ${
          isNextDisabled || isSubmitting
            ? 'bg-purple-300 text-white cursor-not-allowed'
            : 'bg-purple-500 text-white hover:bg-purple-600'
        }`}
      >
        {isLastStep
          ? isSubmitting
            ? isEdit
              ? 'Updating ...'
              : 'Submitting ...'
            : isEdit
            ? 'Update'
            : 'Submit'
          : 'Next'}
        {!isLastStep && <ChevronRight className='h-4 w-4 ml-2' />}
      </button>
    </div>
  );
};

export default NavigationButtons;
