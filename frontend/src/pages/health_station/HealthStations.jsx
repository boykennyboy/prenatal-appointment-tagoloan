import React, { useRef, useState } from 'react';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { useFormSubmit } from '../../utils/functions';
import { Building, Hospital } from 'lucide-react';
import InputGroup from '../../components/ui/InputGroup';
import FormModal from '../../components/ui/FormModal';
import SelectAddressReact from '../../components/ui/SelectAddressReact';
import { barangay_center_columns } from '../../utils/columns';

const HealthStations = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    health_station: '',
    rural_health_unit: '',
    region: 0,
    province: 0,
    municipality: 0,
    barangay: 0,
  });
  const [stationId, setstationId] = useState(0);
  const dataTableRef = useRef();

  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit) {
      setstationId(0);
      setIsEdit(false);
    }

    setError({});
    setFormData({
      health_station: '',
      rural_health_unit: '',
      region: 0,
      province: 0,
      municipality: 0,
      barangay: 0,
    });
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setstationId(row.id);
    console.log('rows: ', row);
    setFormData({
      health_station: row.health_station,
      rural_health_unit: row.rural_health_unit,
      region: row.region,
      province: row.province,
      municipality: row.municipality,
      barangay: row.barangay,
    });

    setIsOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setIsOpen(true);
  };

  const onSubmit = (e) => {
    handleSubmit({
      e,
      isEdit,
      url: isEdit
        ? `/api/barangay-centers/${stationId}`
        : '/api/barangay-centers',
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData({
          health_station: '',
          rural_health_unit: '',
          region: 0,
          province: 0,
          municipality: 0,
          barangay: 0,
        });
        setError({});
        setIsOpen(false);
        if (isEdit) {
          setstationId(0);
          setIsEdit(false);
        }
      },
    });
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = barangay_center_columns;

  return (
    <Container title={'Health Station Managemnet'}>
      <DataTable
        title='Health Station Managemnet'
        apiEndpoint='/api/barangay-centers'
        columns={columns}
        onEdit={handleEdit}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={10}
        onAdd={handleAdd}
        addButton={'Add Health Station'}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={isEdit}
          title={'Health Station'}
        >
          <form onSubmit={onSubmit}>
            <div className='space-y-6 sm:w-auto'>
              <div className='flex justify-between gap-2 -mt-2'>
                <div className='w-full'>
                  <InputGroup
                    type='text'
                    name='health_station'
                    value={formData.health_station}
                    onChange={inputChange}
                    placeholder='health_station'
                    icon={<Hospital className='h-5 w-5 text-gray-400' />}
                    id={'health_station'}
                    hasLabel
                    label={'Health Station'}
                  />
                  {error.health_station && (
                    <p className='error mt-1'>{error.health_station[0]}</p>
                  )}
                </div>
                <div className='w-full'>
                  <InputGroup
                    type='text'
                    name='rural_health_unit'
                    value={formData.rural_health_unit}
                    onChange={inputChange}
                    placeholder='rural_health_unit'
                    icon={<Building className='h-5 w-5 text-gray-400' />}
                    id={'rural_health_unit'}
                    hasLabel
                    label={'Rural Health Unit'}
                  />
                  {error.rural_health_unit && (
                    <p className='error mt-1'>{error.rural_health_unit[0]}</p>
                  )}
                </div>
              </div>

              <div className='flex justify-between gap-2 -mt-2'>
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
                    showSkeletonOnEdit={true}
                    isEdit={isEdit}
                  />
                  {error.region && (
                    <p className='error -mt-4'>{error.region[0]}</p>
                  )}
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
                    disabled={!formData.region}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        province: value,
                        municipality: 0,
                        barangay: 0,
                      }))
                    }
                    showSkeletonOnEdit={true}
                    isEdit={isEdit}
                  />
                  {error.province && (
                    <p className='error -mt-4'>{error.province[0]}</p>
                  )}
                </div>
              </div>
              <div className='flex justify-between gap-2 -mt-2'>
                <div className='w-full'>
                  <SelectAddressReact
                    label='Municipality'
                    id='municipality'
                    name='municipality'
                    endpoint={`/api/select-address/municipalities/${formData.province}`}
                    placeholder='Choose a municipality'
                    formData={formData}
                    setFormData={setFormData}
                    disabled={!formData.province}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        municipality: value,
                        barangay: 0,
                      }))
                    }
                    isEdit={isEdit}
                  />
                  {error.municipality && (
                    <p className='error -mt-4'>{error.municipality[0]}</p>
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
                    disabled={!formData.municipality}
                    isEdit={isEdit}
                  />
                  {error.barangay && (
                    <p className='error -mt-4'>{error.barangay[0]}</p>
                  )}
                </div>
              </div>

              {/* Login Button */}
              <button
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg 
                ${
                  isSubmitting
                    ? 'from-purple-300 to-pink-300 cursor-not-allowed'
                    : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isSubmitting
                  ? isEdit
                    ? 'Updating ...'
                    : 'Creating ...'
                  : isEdit
                  ? 'Update'
                  : 'Create'}
              </button>
            </div>
          </form>
        </FormModal>
      )}
    </Container>
  );
};

export default HealthStations;
