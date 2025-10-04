import { CheckCircle } from 'lucide-react';

// Progress Bar Component
const ProgressBar = ({ steps, currentStep }) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8'>
    <div className='flex items-center justify-center'>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className='flex items-center flex-1'>
            <div
              className={`
                flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-200
                ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }
              `}
            >
              {isCompleted ? (
                <CheckCircle size={16} className='md:w-5 md:h-5' />
              ) : (
                <Icon size={16} className='md:w-5 md:h-5' />
              )}
            </div>
            <div className='ml-2 md:ml-3 hidden sm:block'>
              <p
                className={`text-xs md:text-sm font-medium ${
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                Step {step.id}
              </p>
              <p
                className={`text-xs ${
                  isActive
                    ? 'text-blue-500'
                    : isCompleted
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ml-2 md:ml-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ProgressBar;
