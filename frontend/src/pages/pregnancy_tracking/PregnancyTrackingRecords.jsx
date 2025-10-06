import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { pdf } from '@react-pdf/renderer';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { pregnancy_tracking_columns } from '../../utils/columns';
import { useAuthStore } from '../../store/authStore.js';
import PregnancyTrackingPDF from '../../components/interfaces/pdf/PregnancyTrackingPDF.jsx';
import { useFormSubmit } from '../../utils/functions.jsx';
import DatePicker from '../../components/ui/DatePicker.jsx';
import InputGroup from '../../components/ui/InputGroup.jsx';
import { Map, User, Weight } from 'lucide-react';
import SelectGroup from '../../components/ui/SelectGroup.jsx';
import FormModal from '../../components/ui/FormModal.jsx';
import api from '../../api/axios.js';

const PregnancyTrackingRecords = () => {
  const navigate = useNavigate();
  const dataTableRef = useRef();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const pregnancyStatus = searchParams.get('pregnancy_status');

  const [isOpen, setIsOpen] = useState(false);
  const [pregnancyTrackingId, setPregnancyTrackingId] = useState(0);
  const [formData, setFormData] = useState({
    date_delivery: '',
    outcome_sex: '',
    outcome_weight: '',
    place_of_delivery: '',
    phic: 0,
  });

  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const closeModal = () => {
    setIsOpen(false);

    setError({});
    setPregnancyTrackingId(0);
    setFormData(outPatientFormData);
  };

  const handleEdit = (row) => {
    if (user.role_id !== 2) {
      setPregnancyTrackingId(row.id);
      setFormData((prev) => ({
        ...prev,
        date_delivery: row.date_delivery,
        outcome_sex: row.outcome_sex,
        outcome_weight: row.outcome_weight,
        place_of_delivery: row.place_of_delivery,
        phic: row.phic,
      }));
      setIsOpen(true);
    } else {
      navigate('create', { state: { row } });
    }
  };

  const handleAdd = () => {
    navigate('create');
  };

  const onSubmit = (e) => {
    handleSubmit({
      e,
      isEdit: true,
      url: `/api/edit/pregnancy-trackings/${pregnancyTrackingId}`,
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setError({});
        setPregnancyTrackingId(0);
        setIsOpen(false);
        setFormData({
          date_delivery: '',
          outcome_sex: '',
          outcome_weight: '',
          place_of_delivery: '',
          phic: 0,
        });
      },
    });
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelDownload = async (row) => {
    const blob = await pdf(
      <PregnancyTrackingPDF formData={row} patientType={''} />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    // ✅ Trigger browser download
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'pregnancy-tracking.pdf'; // filename
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const columns = pregnancy_tracking_columns;

  return (
    <Container title={'Pregnancy Tracking'}>
      <DataTable
        title='Pregnancy Tracking'
        apiEndpoint='/api/pregnancy-trackings'
        columns={columns}
        onEdit={handleEdit}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={10}
        onAdd={user.role_id !== 3 ? handleAdd : ''}
        onDownload={handelDownload}
        addButton={user.role_id !== 3 ? 'Create Pregnancy Tracking' : ''}
        hasSortByCategory
        hasSortByStatus
        hasAdvanceFilter
        checkExists
        pregnancyStatus={pregnancyStatus}
        ref={dataTableRef}
      />

      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={true}
          title={'Pregnancy Tracking'}
        >
          <form onSubmit={onSubmit}>
            <div className='flex flex-col bg-gray-50 rounded-lg sm:w-auto mb-2'>
              {/* Visit Date */}
              <div className='w-full  p-4 rounded-lg space-y-2 '>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <DatePicker
                      hasLabel
                      label='Date Delivery'
                      value={formData.date_delivery}
                      setFormData={setFormData}
                      id='date_delivery'
                      name='date_delivery'
                    />
                    {error.date_delivery && (
                      <p className='error mt-1'>{error.date_delivery[0]}</p>
                    )}
                  </div>
                  <div className='flex-1'>
                    <InputGroup
                      name='place_of_delivery'
                      id='place_of_delivery'
                      value={formData.place_of_delivery}
                      onChange={inputChange}
                      placeholder='Enter place of delivery'
                      icon={<Map className='h-5 w-5 text-gray-400' />}
                      hasLabel
                      label='Place of Delivery'
                    />
                    {error.place_of_delivery && (
                      <p className='error mt-1'>{error.place_of_delivery[0]}</p>
                    )}
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <SelectGroup
                      options={[
                        {
                          name: 'Male',
                          value: 'male',
                        },
                        {
                          name: 'Female',
                          value: 'female',
                        },
                      ]}
                      placeholder='Select Gender'
                      value={formData.outcome_sex}
                      onChange={inputChange}
                      id='outcome_sex'
                      name='outcome_sex'
                      label='Outcome Sex'
                      hasLabel
                    />
                    {error.outcome_sex && (
                      <p className='error mt-1'>{error.outcome_sex[0]}</p>
                    )}
                  </div>

                  <div className='flex-1'>
                    <InputGroup
                      type='number'
                      step='0.1'
                      name='outcome_weight'
                      id='outcome_weight'
                      value={formData.outcome_weight}
                      onChange={inputChange}
                      placeholder='Enter weight'
                      icon={<Weight className='h-5 w-5 text-gray-400' />}
                      hasLabel
                      label='Weight (kg)'
                    />
                    {error.outcome_weight && (
                      <p className='error mt-1'>{error.outcome_weight[0]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vital Signs Section */}
              <div className='bg-gray-50 p-4 rounded-lg w-full mb-4'>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='-mt-5'>
                    <SelectGroup
                      options={[
                        {
                          name: 'Yes',
                          value: 1,
                        },
                        {
                          name: 'No',
                          value: 0,
                        },
                      ]}
                      placeholder='Has PhilHealth?'
                      value={formData.phic}
                      onChange={inputChange}
                      id='phic'
                      name='phic'
                      label='Has PhilHealth?'
                      hasLabel
                    />
                    {error.phic && (
                      <p className='error mt-1'>{error.phic[0]}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg 
              ${
                isSubmitting
                  ? 'from-purple-300 to-pink-300 cursor-not-allowed'
                  : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isSubmitting ? 'Updating ...' : 'Update Pregnancy Tracking'}
            </button>
          </form>
        </FormModal>
      )}
    </Container>
  );
};

export default PregnancyTrackingRecords;
