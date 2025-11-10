import { Heart, Calendar } from 'lucide-react';
import HealthcareFacilities from './HealthcareFacilities';
import HealthcareProviders from './HealthcareProviders';
import InputGroup from '../../ui/InputGroup';
import DatePicker from '../../ui/DatePicker';
import { pickerOptions } from '../../../utils/columns';
import { useState } from 'react';

const HealthInformationStep = ({
  formData,
  setFormData,
  inputChange,
  error,
}) => {
  const [focusedField, setFocusedField] = useState('');

  const explanations = {
    gravidity:
      'Gravidity: The total number of times a woman has been pregnant, including the current one',
    parity:
      'Parity: The number of times a woman has given birth (either live or stillborn) after 20 weeks of pregnancy.',
    abortion:
      'Abortion: The total number of pregnancies (miscarriages or induced abortions) that ended before 20 weeks of pregnancy.',
  };

  const handle_change = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedRiskCodes = [...(prev.risk_codes || [])];

      // If value > 3 → add "D" risk code if not already present
      if (value > 3) {
        const hasD = updatedRiskCodes.some((r) => r.risk_code === 'D');
        if (!hasD) {
          updatedRiskCodes.push({
            risk_code: 'D',
            date_detected: '',
            risk_status: '',
            auto: true,
          });
        }
      } else {
        // If value <= 3 → remove "D" risk code if it exists
        updatedRiskCodes = updatedRiskCodes.filter((r) => r.risk_code !== 'D');
      }

      return {
        ...prev,
        [name]: value,
        risk_codes: updatedRiskCodes,
      };
    });
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-900'>Health Information</h3>

      {/* Basic Health Info */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {['gravidity', 'parity', 'abortion'].map((field) => (
          <div key={field} className='w-full'>
            <InputGroup
              type='number'
              name={field}
              value={formData[field]}
              onChange={field === 'gravidity' ? handle_change : inputChange}
              onFocus={() => setFocusedField(field)}
              onBlur={() => setFocusedField('')}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              icon={<Heart className='h-5 w-5 text-gray-400' />}
              id={field}
              hasLabel
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              min={0}
            />
            {error[field] && <p className='error mt-1'>{error[field][0]}</p>}

            {/* Show explanation only when focused */}
            {focusedField === field && (
              <p className='text-sm text-blue-500 mt-1.5 italic'>
                {explanations[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='w-full'>
          <DatePicker
            options={pickerOptions}
            name='lmp'
            id='lmp'
            value={formData.lmp}
            onChange={(e) => {
              const lmp = e.target.value;
              const [y, m, d] = lmp.split('-').map(Number);
              const date = new Date(y, m - 1, d);
              date.setMonth(date.getMonth() + 9);

              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const edc = `${year}-${month}-${day}`;

              setFormData((prev) => ({
                ...prev,
                lmp,
                edc,
              }));
            }}
            placeholder='Last Menstrual Period'
            hasLabel
            label='Last Menstrual Period (LMP)'
          />
          {error.lmp && <p className='error mt-1'>{error.lmp[0]}</p>}
        </div>
        <div className='w-full'>
          <DatePicker
            options={pickerOptions}
            name='edc'
            id='edc'
            value={formData.edc}
            onChange={inputChange}
            placeholder='Expected Date of Confinement'
            hasLabel
            label='Expected Date of Confinement (EDC)'
            mode='single'
            disabled={true}
          />
          {error.edc && <p className='error mt-1'>{error.edc[0]}</p>}
        </div>
      </div>

      {/* Healthcare Facilities */}
      <HealthcareFacilities
        formData={formData}
        inputChange={inputChange}
        error={error}
      />

      {/* Healthcare Providers */}
      <HealthcareProviders
        formData={formData}
        setFormData={setFormData}
        error={error}
      />
    </div>
  );
};

export default HealthInformationStep;
