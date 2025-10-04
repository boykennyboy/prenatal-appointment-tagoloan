import { User, UserCheck } from 'lucide-react';
import SelectReact from '../../ui/SelectReact';
import NewPatientBasicInfo from './NewPatientBasicInfo';

const PatientTypeCard = ({
  type,
  title,
  description,
  icon,
  patientType,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-6 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
      patientType === type
        ? 'border-purple-500 bg-purple-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
  >
    <div className='flex items-center space-x-4'>
      <div
        className={`p-3 rounded-full ${
          patientType === type
            ? 'bg-purple-500 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className='font-medium text-gray-900'>{title}</h3>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
    </div>
  </div>
);

const PatientTypeStep = ({
  patientType,
  setPatientType,
  formData,
  setFormData,
  inputChange,
  isEdit,
  error,
}) => {
  const onClick = (value) => {
    setPatientType(value);
    setFormData((prev) => ({ ...prev, patient_type: value }));
  };
  return (
    <div className='space-y-6'>
      {!isEdit && (
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Choose Patient Type
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <PatientTypeCard
              type='existing'
              title='Existing Patient'
              description='Select from registered patients'
              icon={<UserCheck className='h-6 w-6' />}
              patientType={patientType}
              onClick={() => onClick('existing')}
            />
            <PatientTypeCard
              type='new'
              title='New Patient'
              description='Register a new patient'
              icon={<User className='h-6 w-6' />}
              patientType={patientType}
              onClick={() => onClick('new')}
            />
          </div>
        </div>
      )}

      {patientType === 'existing' && (
        <div className='mt-6'>
          <SelectReact
            label='Select Patient'
            id='patient_id'
            name='patient_id'
            endpoint='/api/patients'
            placeholder='Choose a patient'
            formData={formData}
            setFormData={setFormData}
            labelKey='fullname'
          />
          {error.patient_it && (
            <p className='error mt-1'>{error.patient_id[0]}</p>
          )}
        </div>
      )}

      {(patientType === 'new' || patientType === 'edit') && (
        <NewPatientBasicInfo
          formData={formData}
          inputChange={inputChange}
          error={error}
          setFormData={setFormData}
        />
      )}
    </div>
  );
};

export default PatientTypeStep;
