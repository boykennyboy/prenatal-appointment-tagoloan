import { Building, Hospital, Landmark, MapPin } from 'lucide-react';
import InputGroup from '../../ui/InputGroup';

const HealthcareFacilities = ({ formData, inputChange, error }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='bemoc'
          value={formData.bemoc}
          onChange={inputChange}
          placeholder='Birthing center'
          icon={<Hospital className='h-5 w-5 text-gray-400' />}
          id='bemoc'
          hasLabel
          label='BEMOC'
        />
        {error.bemoc && <p className='error mt-1'>{error.bemoc[0]}</p>}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='bemoc_address'
          value={formData.bemoc_address}
          onChange={inputChange}
          placeholder='BEMOC address'
          icon={<MapPin className='h-5 w-5 text-gray-400' />}
          id='bemoc_address'
          hasLabel
          label='BEMOC Address'
        />
        {error.bemoc_address && (
          <p className='error mt-1'>{error.bemoc_address[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='cemoc'
          value={formData.cemoc}
          onChange={inputChange}
          placeholder='CEMOC'
          icon={<Building className='h-5 w-5 text-gray-400' />}
          id='cemoc'
          hasLabel
          label='CEMOC'
        />
        {error.cemoc && <p className='error mt-1'>{error.cemoc[0]}</p>}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='cemoc_address'
          value={formData.cemoc_address}
          onChange={inputChange}
          placeholder='CEMOC address'
          icon={<MapPin className='h-5 w-5 text-gray-400' />}
          id='cemoc_address'
          hasLabel
          label='CEMOC Address'
        />
        {error.cemoc_address && (
          <p className='error mt-1'>{error.cemoc_address[0]}</p>
        )}
      </div>
      <div className='w-full col-span-1 sm:col-span-2'>
        <InputGroup
          type='text'
          name='referral_unit'
          value={formData.referral_unit}
          onChange={inputChange}
          placeholder='Referral unit'
          icon={<Landmark className='h-5 w-5 text-gray-400' />}
          id='referral_unit'
          hasLabel
          label='Referral Unit'
        />
        {error.referral_unit && (
          <p className='error mt-1'>{error.referral_unit[0]}</p>
        )}
      </div>
    </div>
  );
};

export default HealthcareFacilities;
