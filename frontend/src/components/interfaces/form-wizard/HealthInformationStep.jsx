import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import HealthcareFacilities from './HealthcareFacilities';
import HealthcareProviders from './HealthcareProviders';
import InputGroup from '../../ui/InputGroup';
import DateInput from '../../ui/DateInput';
import DatePicker from '../../ui/DatePicker';
import { pickerOptions } from '../../../utils/columns';

const HealthInformationStep = ({
  formData,
  setFormData,
  inputChange,
  error,
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-900'>Health Information</h3>

      {/* Basic Health Info */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='w-full'>
          <InputGroup
            type='number'
            name='gravidity'
            value={formData.gravidity}
            onChange={inputChange}
            placeholder='Gravidity'
            icon={<Heart className='h-5 w-5 text-gray-400' />}
            id='gravidity'
            hasLabel
            label='Gravidity'
            min={0}
          />
          {error.gravidity && (
            <p className='error mt-1'>{error.gravidity[0]}</p>
          )}
        </div>
        <div className='w-full'>
          <InputGroup
            type='number'
            name='parity'
            value={formData.parity}
            onChange={inputChange}
            placeholder='Parity'
            icon={<Heart className='h-5 w-5 text-gray-400' />}
            id='parity'
            hasLabel
            label='Parity'
            min={0}
          />
          {error.parity && <p className='error mt-1'>{error.parity[0]}</p>}
        </div>
        <div className='w-full'>
          <InputGroup
            type='number'
            name='abortion'
            value={formData.abortion}
            onChange={inputChange}
            placeholder='Abortion'
            icon={<Heart className='h-5 w-5 text-gray-400' />}
            id='abortion'
            hasLabel
            label='Abortion'
            min={0}
          />
          {error.abortion && <p className='error mt-1'>{error.abortion[0]}</p>}
        </div>
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
