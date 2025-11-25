import { Syringe, AlertCircle } from 'lucide-react';
import DatePicker from '../../ui/DatePicker';
import { pickerNoWeekendsOptions } from '../../../utils/columns';
import InputGroup from '../../ui/InputGroup';
import { useState } from 'react';

const ImmunizationStep = ({
  formData = {},
  handleInputChange = () => {},
  error = {},
  isEdit = false,
  initialFormData = {}
}) => {
  const [activeTab, setActiveTab] = useState('tetanus');

  const tabs = [
    { id: 'tetanus', label: 'Tetanus Vaccine', icon: '💉' },
    { id: 'covid', label: 'COVID-19 Vaccine', icon: '🦠' },
    { id: 'other', label: 'Other Vaccines', icon: '🏥' },
  ];

  const doses = ['first', 'second', 'third', 'fourth', 'fifth'];

  // Helper component to show previous value
  const PreviousValue = ({ fieldName }) => {
    if (
      !isEdit ||
      !initialFormData[fieldName] ||
      initialFormData[fieldName] === formData[fieldName]
    ) {
      return null;
    }
    return (
      <div className='flex items-center gap-1 mt-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded'>
        <AlertCircle className='h-3 w-3' />
        <span>Previous: {initialFormData[fieldName]}</span>
      </div>
    );
  };

  // Helper to render a section for any vaccine
  const VaccineSection = ({ vaccine, doseList }) => (
    <div className='space-y-6'>
      {/* Given Dates */}
      <div>
        <h4 className='text-md font-semibold text-gray-700 mb-3'>
          Given Dates
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {doseList.map((dose, index) => {
            const labelSuffix = ['st', 'nd', 'rd'][index] || 'th';
            const fieldName = `${vaccine}_${dose}_given`;
            return (
              <div key={`given-${dose}`}>
                <DatePicker
                  options={pickerNoWeekendsOptions}
                  label={`${index + 1}${labelSuffix} Dose Given`}
                  name={fieldName}
                  id={fieldName}
                  value={formData?.[fieldName] || ''}
                  onChange={handleInputChange}
                  hasLabel
                />
                {error?.[fieldName] && (
                  <p className='error mt-1'>{error[fieldName][0]}</p>
                )}
                <PreviousValue fieldName={fieldName} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Comeback Dates */}
      <div>
        <h4 className='text-md font-semibold text-gray-700 mb-3'>
          Comeback Dates
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {doseList.map((dose, index) => {
            const labelSuffix = ['st', 'nd', 'rd'][index] || 'th';
            const fieldName = `${vaccine}_${dose}_comeback`;
            return (
              <div key={`comeback-${dose}`}>
                <DatePicker
                  options={pickerNoWeekendsOptions}
                  label={`${index + 1}${labelSuffix} Dose Comeback`}
                  name={fieldName}
                  id={fieldName}
                  value={formData?.[fieldName] || ''}
                  onChange={handleInputChange}
                  hasLabel
                />
                {error?.[fieldName] && (
                  <p className='error mt-1'>{error[fieldName][0]}</p>
                )}
                <PreviousValue fieldName={fieldName} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const TetanusForm = () => (
    <VaccineSection vaccine='tetanus' doseList={doses} />
  );

  const CovidForm = () => (
    <VaccineSection vaccine='covid' doseList={['first', 'second', 'booster']} />
  );

  const OtherForm = () => (
    <div className='space-y-6'>
      <div>
        <InputGroup
          label='Vaccine Name'
          name='other_vaccine_name'
          value={formData?.other_vaccine_name || ''}
          placeholder='Enter vaccine name'
          id='other_vaccine_name'
          onChange={handleInputChange}
          icon={<Syringe className='h-5 w-5 text-gray-400' />}
          hasLabel
        />
        {error?.other_vaccine_name && (
          <p className='error mt-1'>{error.other_vaccine_name[0]}</p>
        )}
        <PreviousValue fieldName='other_vaccine_name' />
      </div>

      <VaccineSection vaccine='other' doseList={doses} />
    </div>
  );

  return (
    <div className='space-y-4'>
      {/* Tabs Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='flex gap-4'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span className='hidden sm:inline'>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        {activeTab === 'tetanus' && <TetanusForm />}
        {activeTab === 'covid' && <CovidForm />}
        {activeTab === 'other' && <OtherForm />}
      </div>
    </div>
  );
};

export default ImmunizationStep;
