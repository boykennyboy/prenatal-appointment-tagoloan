import React, { useState } from 'react';
import {
  Baby,
  ChevronLeft,
  ChevronRight,
  Syringe,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import api from '../../../api/axios';
import PrenatalVisitStep from './PrenatalVisitStep';
import ImmunizationStep from './ImmunizationStep';

const UnifiedForm = ({
  formData,
  setFormData,
  onSubmit,
  error,
  setError,
  isSubmitting,
  isEdit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showImmunization, setShowImmunization] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});

  // Capture initial form data when component mounts or when isEdit becomes true
  React.useEffect(() => {
    if (isEdit && Object.keys(initialFormData).length === 0) {
      setInitialFormData({ ...formData });
    }
  }, [isEdit]);

  const steps = showImmunization
    ? [
        { id: 0, title: 'Prenatal Visit/Out Patient', icon: Baby },
        { id: 1, title: 'Immunization', icon: Syringe },
      ]
    : [{ id: 0, title: 'Prenatal Visit/Out Patient', icon: Baby }];

  // Check if there are any validation errors
  const hasValidationErrors = () => {
    return Object.keys(error).some((key) => {
      const errorValue = error[key];
      return Array.isArray(errorValue) ? errorValue.length > 0 : !!errorValue;
    });
  };

  // Get count of validation errors
  const getErrorCount = () => {
    return Object.keys(error).filter((key) => {
      const errorValue = error[key];
      return Array.isArray(errorValue) ? errorValue.length > 0 : !!errorValue;
    }).length;
  };

  const validatePregnancyFields = (name, value, currentFormData) => {
    const numValue = parseInt(value) || 0;
    const gravidity = parseInt(currentFormData.gravidity) || 0;
    let errorMessage = '';

    if (['term', 'preterm', 'post_term'].includes(name)) {
      const term =
        name === 'term' ? numValue : parseInt(currentFormData.term) || 0;
      const preterm =
        name === 'preterm' ? numValue : parseInt(currentFormData.preterm) || 0;
      const postTerm =
        name === 'post_term'
          ? numValue
          : parseInt(currentFormData.post_term) || 0;

      const total = term + preterm + postTerm;
      if (gravidity > 0 && total > gravidity - 1) {
        errorMessage = `Total (${total}) cannot exceed gravidity (${
          gravidity - 1
        }) (gravidity - 1)`;
      }
    }

    if (name === 'living_children') {
      if (gravidity > 0 && numValue > gravidity - 1) {
        errorMessage = `Cannot exceed ${gravidity - 1} (gravidity - 1)`;
      }
    }

    return errorMessage;
  };

  const inputChange = (e) => {
    const { name, value } = e.target;

    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    if (['term', 'preterm', 'post_term', 'living_children'].includes(name)) {
      const newErrors = { ...error };

      // Check term + preterm + post_term total
      const termFields = ['term', 'preterm', 'post_term'];
      let termError = '';

      for (const field of termFields) {
        const fieldError = validatePregnancyFields(
          field,
          newFormData[field],
          newFormData
        );
        if (fieldError) {
          termError = fieldError;
          break; // We only need to check once for the total
        }
      }

      // Check living_children separately
      const livingChildrenError = validatePregnancyFields(
        'living_children',
        newFormData.living_children,
        newFormData
      );

      // Set or clear gravidity error
      if (termError) {
        newErrors.gravidity = [termError];
      } else {
        delete newErrors.gravidity;
      }

      // Set or clear living_children error
      if (livingChildrenError) {
        newErrors.living_children = [livingChildrenError];
      } else {
        delete newErrors.living_children;
      }

      setError(newErrors);
      console.log('Updated errors:', newErrors);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = async (selected) => {
    if (selected) {
      try {
        const res = await api.get(`/api/out-patients/${selected}`);
        const data = res.data.data || res.data;

        if (data) {
          setFormData((prev) => ({
            ...prev,
            pregnancy_tracking_id: selected,
            gravidity: data.gravidity,
            aog: data.aog,
          }));

          // Clear any existing pregnancy-related validation errors when patient changes
          setError((prev) => {
            const newErrors = { ...prev };
            delete newErrors.term;
            delete newErrors.preterm;
            delete newErrors.post_term;
            delete newErrors.living_children;
            return newErrors;
          });

          if (data.pregnancy_status === 'third_trimester') {
            setShowImmunization(true);
          } else {
            setShowImmunization(false);
            if (currentStep === 1) setCurrentStep(0);
          }
        }
      } catch (error) {
        console.log('Error ', error);
      }
    } else {
      setShowImmunization(false);
      if (currentStep === 1) setCurrentStep(0);
    }
  };

  const handle_change = (e) => {
    const { name, value } = e.target;

    if (!value) {
      setFormData((prev) => ({
        ...prev,
        pr: value,
        fht: '',
      }));
    } else if (value < 110 || value > 160) {
      setFormData((prev) => ({
        ...prev,
        pr: value,
        fht: 'Abnormal',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        pr: value,
        fht: 'Normal',
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    onSubmit(e, showImmunization, setShowImmunization);
    setCurrentStep(0);
  };

  return (
    <div className='min-h-screen w-full'>
      <div className='w-full mx-auto'>
        <div className='bg-white'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Prenatal Care Form
          </h1>
          <p className='text-gray-600'>
            Complete all sections for comprehensive patient care
          </p>
        </div>

        <div className='bg-white py-4'>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <div className='flex flex-col items-center flex-1'>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep === index
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110 shadow-lg'
                          : currentStep > index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {currentStep > index ? (
                        <CheckCircle className='h-6 w-6' />
                      ) : (
                        <Icon className='h-6 w-6' />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-medium ${
                        currentStep === index
                          ? 'text-purple-600'
                          : currentStep > index
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                        currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error Summary Banner */}
        {hasValidationErrors() && (
          <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-4'>
            <div className='flex items-center'>
              <AlertCircle className='h-5 w-5 text-red-500 mr-2' />
              <div>
                <p className='text-sm font-medium text-red-800'>
                  {getErrorCount()} validation{' '}
                  {getErrorCount() === 1 ? 'error' : 'errors'} found
                </p>
                <p className='text-xs text-red-700 mt-1'>
                  Please fix the errors below before submitting the form
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='bg-white p-6 min-h-[500px]'>
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
              {steps[currentStep].title}
            </h2>
            <div className='h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full'></div>
          </div>

          <div className='animate-fadeIn'>
            {currentStep === 0 && (
              <PrenatalVisitStep
                formData={formData}
                error={error}
                inputChange={inputChange}
                handleChange={handleChange}
                handle_change={handle_change}
                handleDateChange={handleDateChange}
                isEdit={isEdit}
                initialFormData={initialFormData}
                setFormData={setFormData}
              />
            )}
            {currentStep === 1 && (
              <ImmunizationStep
                formData={formData}
                handleInputChange={inputChange}
                error={error}
                isEdit={isEdit}
                initialFormData={initialFormData}
              />
            )}
          </div>
        </div>

        <div className='bg-white rounded-b-2xl p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <button
              type='button'
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 shadow-md'
              }`}
            >
              <ChevronLeft className='h-5 w-5' />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type='button'
                onClick={handleNext}
                className='flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg'
              >
                Next
                <ChevronRight className='h-5 w-5' />
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSubmit}
                disabled={isSubmitting || hasValidationErrors()}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transform transition-all duration-200 shadow-lg ${
                  isSubmitting || hasValidationErrors()
                    ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Submitting...</span>
                  </div>
                ) : hasValidationErrors() ? (
                  <div className='flex items-center justify-center gap-2'>
                    <AlertCircle className='h-5 w-5' />
                    <span>Fix Errors to Submit</span>
                  </div>
                ) : (
                  'Submit Form'
                )}
              </button>
            )}
          </div>

          <div className='mt-4'>
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>Progress</span>
              <span>
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500'
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UnifiedForm;
