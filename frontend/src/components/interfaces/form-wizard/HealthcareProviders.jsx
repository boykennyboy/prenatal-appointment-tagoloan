import api from '../../../api/axios';
import { useAuthStore } from '../../../store/authStore.js';
import SelectReact from '../../ui/SelectReact';

const HealthcareProviders = ({ formData, setFormData, error }) => {
  const { user } = useAuthStore();
  const handleChangeName = async (value) => {
    setFormData((prev) => ({
      ...prev,
      midwife_id: value,
    }));

    const params = {
      midwife_id: value,
      nurse_id: formData.nurse_id,
    };

    const response = await api.get('/api/midwife-and-nurse-name', {
      params,
    });

    const data = response.data?.data || response.data;

    if (data) {
      setFormData((prev) => ({
        ...prev,
        midwife_name: data.midwife_name,
        nurse_name: data.nurse_name,
      }));
    }
  };

  const handleChangeBarangay = async (value) => {
    setFormData((prev) => ({
      ...prev,
      barangay_center_id: value,
      nurse_id: 0,
      midwife_id: 0,
    }));

    const response = await api.get(`/api/barangay-centers/${value}`);

    const data = response.data;

    setFormData((prev) => ({
      ...prev,
      barangay_health_station: data.health_station,
    }));
  };
  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-900'>Healthcare Providers</h4>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='w-full'>
          <SelectReact
            label='Barangay Health Station'
            id='barangay_center_id'
            name='barangay_center_id'
            endpoint='/api/barangay-centers'
            placeholder='Choose a health station'
            formData={formData}
            setFormData={setFormData}
            labelKey='health_station'
            onChange={(value) => handleChangeBarangay(value)}
            isClearable={user.role_id !== 2}
            isMenuOpen={user.role_id === 2 ? false : undefined}
            isSearchable={user.role_id !== 2}
          />
          {error.barangay_center_id && (
            <p className='error mt-1'>{error.barangay_center_id[0]}</p>
          )}
        </div>
        <div className='w-full'>
          <SelectReact
            label='HRH In-charge'
            id='nurse_id'
            name='nurse_id'
            endpoint={`/api/nurses/barangay-centers/${formData.barangay_center_id}`}
            placeholder='Choose a nurse'
            formData={formData}
            setFormData={setFormData}
            labelKey='fullname'
            disabled={!formData.barangay_center_id}
          />
          {error.nurse_id && <p className='error mt-1'>{error.nurse_id[0]}</p>}
        </div>
        <div className='w-full'>
          <SelectReact
            label='Midwife'
            id='midwife_id'
            name='midwife_id'
            endpoint={`/api/midwives/barangay-centers/${formData.barangay_center_id}`}
            placeholder='Choose a midwife'
            formData={formData}
            setFormData={setFormData}
            labelKey='fullname'
            onChange={(value) => handleChangeName(value)}
            disabled={!formData.barangay_center_id}
          />
          {error.midwife_id && (
            <p className='error mt-1'>{error.midwife_id[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthcareProviders;
