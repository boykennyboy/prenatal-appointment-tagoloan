import { MapPinHouse } from 'lucide-react';
import api from '../../../api/axios';
import InputGroup from '../../ui/InputGroup';
import SelectAddressReact from '../../ui/SelectAddressReact';

const AddressInformation = ({ formData, setFormData, error }) => {
  const handleChangeAddress = async (value) => {
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      barangay: value,
    }));

    const params = {
      barangay_id: value,
      municipality_id: formData.municipality,
      province_id: formData.province,
      region_id: formData.region,
    };
    const response = await api.get('/api/address-name', { params });

    const data = response.data?.data || response.data;

    if (data) {
      setFormData((prev) => ({
        ...prev,
        barangay_name: data.barangay_name,
        municipality_name: data.municipality_name,
        province_name: data.province_name,
        region_name: data.region_name,
      }));
    }
  };
  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-900'>Address Information</h4>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='col-span-2'>
          <InputGroup
            type='text'
            name='zone'
            value={formData.zone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                zone: e.target.value,
              }))
            }
            placeholder='Zone'
            icon={<MapPinHouse className='h-5 w-5 text-gray-400' />}
            id='zone'
            hasLabel
            label='Zone/Purok'
          />
          {error.zone && <p className='error mt-1'>{error.zone[0]}</p>}
        </div>
        <div className='w-full'>
          <SelectAddressReact
            label='Region'
            id='region'
            name='region'
            endpoint='/api/select-address/regions'
            placeholder='Choose a region'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                region: value,
                province: 0,
                municipality: 0,
                barangay: 0,
              }))
            }
          />
          {error.region && <p className='error mt-1'>{error.region[0]}</p>}
        </div>
        <div className='w-full'>
          <SelectAddressReact
            label='Province'
            id='province'
            name='province'
            endpoint={`/api/select-address/provinces/${formData.region}`}
            placeholder='Choose a province'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                province: value,
                municipality: 0,
                barangay: 0,
              }))
            }
            disabled={!formData.region}
          />
          {error.province && <p className='error mt-1'>{error.province[0]}</p>}
        </div>

        <div className='w-full'>
          <SelectAddressReact
            label='Municipality'
            id='municipality'
            name='municipality'
            endpoint={`/api/select-address/municipalities/${formData.province}`}
            placeholder='Choose a municipality'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                municipality: value,
                barangay: 0,
              }))
            }
            disabled={!formData.province}
          />
          {error.municipality && (
            <p className='error mt-1'>{error.municipality[0]}</p>
          )}
        </div>

        <div className='w-full'>
          <SelectAddressReact
            label='Barangay'
            id='barangay'
            name='barangay'
            endpoint={`/api/select-address/barangays/${formData.municipality}`}
            placeholder='Choose a barangay'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) => handleChangeAddress(value)}
            disabled={!formData.municipality}
          />
          {error.barangay && <p className='error mt-1'>{error.barangay[0]}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
