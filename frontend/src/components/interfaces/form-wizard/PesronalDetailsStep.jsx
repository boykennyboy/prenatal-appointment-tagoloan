import React from 'react';
import { User, MapPin, Calendar, Heart, Phone, Church } from 'lucide-react';
import SelectGroup from '../../ui/SelectGroup';
import InputGroup from '../../ui/InputGroup';
import ContactPersonInfo from './ContactPersonInfo';
import AddressInformation from './AddressInformation';
import DateInput from '../../ui/DateInput';

const PersonalDetailsStep = ({
  patientType,
  formData,
  setFormData,
  inputChange,
  error,
}) => {
  const religion_options = [
    { name: 'Roman Catholic' },
    { name: 'Born Again Christian' },
    { name: 'Baptist' },
    { name: 'Seventh-day Adventist' },
    { name: 'Jehovah’s Witnesses' },
    { name: 'Iglesia ni Cristo' },
    { name: 'Islam' },
    { name: 'Philippine Independent Church' },
    { name: 'Latter-day Saints' },
    { name: 'Buddhism' },
    { name: 'Taoism' },
    { name: 'Hinduism' },
    { name: 'Judaism' },
    { name: 'Baháʼí Faith' },
    { name: 'Sikhism' },
    { name: 'Indigenous Philippine Folk Religions' },
  ];

  const statusOptions = [
    { name: 'Single', value: 'single' },
    { name: 'Married', value: 'married' },
    { name: 'Widowed', value: 'widowed' },
    { name: 'Legally Separated', value: 'legally separated' },
    { name: 'Annulled', value: 'anulled' },
  ];

  if (patientType === 'existing') {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>
          Patient selected. Continue to health information.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-900'>Personal Details</h3>

      <div className='flex flex-col gap-6'>
        {/* Row 1: Sex & Civil Status */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='w-full'>
            <SelectGroup
              name='status'
              value={formData.status}
              onChange={inputChange}
              placeholder='Select Status'
              options={statusOptions}
              id='status'
              icon={<User className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Status'
            />
            {error.status && <p className='error mt-1'>{error.status[0]}</p>}
          </div>
          <div className='w-full'>
            <SelectGroup
              name='religion'
              value={formData.religion}
              onChange={inputChange}
              placeholder='Select Religion'
              options={religion_options}
              id='religion'
              icon={<Church className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Religion'
            />
            {error.religion && (
              <p className='error mt-1'>{error.religion[0]}</p>
            )}
          </div>
        </div>
        <div className='w-full'>
          <InputGroup
            type='text'
            name='birth_place'
            value={formData.birth_place}
            onChange={inputChange}
            placeholder='Birth place'
            icon={<MapPin className='h-5 w-5 text-gray-400' />}
            id='birth_place'
            hasLabel
            label='Birth Place'
          />
          {error.birth_place && (
            <p className='error mt-1'>{error.birth_place[0]}</p>
          )}
        </div>

        {/* Contact Person Information */}
        <ContactPersonInfo
          formData={formData}
          inputChange={inputChange}
          error={error}
        />

        {/* Address Information */}
        <AddressInformation
          formData={formData}
          setFormData={setFormData}
          error={error}
        />
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
