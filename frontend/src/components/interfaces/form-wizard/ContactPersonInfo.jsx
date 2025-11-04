import { Phone, User } from 'lucide-react';
import InputGroup from '../../ui/InputGroup';
import PhoneNumberField from '../../ui/PhoneNumberField';
import SelectGroup from '../../ui/SelectGroup';

const ContactPersonInfo = ({ formData, inputChange, error }) => {
  const relationship_options = [
    { name: 'Father', value: 'father' },
    { name: 'Mother', value: 'mother' },
    { name: 'Sibling', value: 'sibling' },
    { name: 'Guardian', value: 'guardian' },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='contact_person_name'
          value={formData.contact_person_name}
          onChange={inputChange}
          placeholder='Contact Person Name'
          icon={<User className='h-5 w-5 text-gray-400' />}
          id='contact_person_name'
          hasLabel
          label='Contact Person Name'
        />
        {error.contact_person_name && (
          <p className='error mt-1'>{error.contact_person_name[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <PhoneNumberField
          type='text'
          name='contact_person_number'
          value={formData.contact_person_number}
          onChange={inputChange}
          placeholder='Contact Person Number'
          icon={<Phone className='h-5 w-5 text-gray-400' />}
          id='contact_person_number'
          hasLabel
          label='Contact Person Number'
        />
        {error.contact_person_number && (
          <p className='error mt-1'>{error.contact_person_number[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <SelectGroup
          name='contact_person_relationship'
          value={formData.contact_person_relationship}
          onChange={inputChange}
          options={relationship_options}
          placeholder='Relationship'
          icon={<User className='h-5 w-5 text-gray-400' />}
          id='contact_person_relationship'
          hasLabel
          label='Contact Person Relationship'
        />
        {error.contact_person_relationship && (
          <p className='error mt-1'>{error.contact_person_relationship[0]}</p>
        )}
      </div>
    </div>
  );
};

export default ContactPersonInfo;
