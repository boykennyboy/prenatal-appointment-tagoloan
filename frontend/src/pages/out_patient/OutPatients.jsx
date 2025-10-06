import { useRef, useState } from 'react';
import DataTable from '../../components/ui/Datatable';
import Container from '../../components/ui/Container';
import { out_patient_column } from '../../utils/columns';
import FormModal from '../../components/ui/FormModal';
import { useFormSubmit } from '../../utils/functions';
import { useAuthStore } from '../../store/authStore.js';
import OutPatientsForm from '../../components/forms/outpatients/OutPatientsForm';
import {
  outPatientEditFormData,
  outPatientFormData,
} from '../../utils/formDefault';
import OutPatientPDF from '../../components/interfaces/pdf/OutPatientPDF';
import { pdf } from '@react-pdf/renderer';
const OutPatients = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(outPatientFormData);
  const [outPatientId, setOutPatientId] = useState(0);
  const dataTableRef = useRef();
  const { user } = useAuthStore();
  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit) {
      setOutPatientId(0);
      setIsEdit(false);
    }

    setError({});
    setFormData(outPatientFormData);
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setOutPatientId(row.id);
    setFormData(outPatientEditFormData(row));

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
      url: isEdit ? `/api/out-patients/${outPatientId}` : '/api/out-patients',
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData(outPatientFormData);
        setError({});
        setIsOpen(false);
        if (isEdit) {
          setOutPatientId(0);
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

  const handelDownload = async (row) => {
    const blob = await pdf(<OutPatientPDF formData={row} />).toBlob();

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

  const columns = out_patient_column;

  return (
    <Container title={'Out Patients'}>
      <DataTable
        title='Out Patients'
        apiEndpoint='/api/out-patients'
        columns={columns}
        onEdit={handleEdit}
        onDownload={handelDownload}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={10}
        onAdd={handleAdd}
        addButton={user.role_id !== 2 ? 'Add Out Patient' : ''}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={isEdit}
          title={'Out Patient'}
          className={'sm:max-w-6xl'}
        >
          <OutPatientsForm
            onSubmit={onSubmit}
            inputChange={inputChange}
            formData={formData}
            setFormData={setFormData}
            error={error}
            isSubmitting={isSubmitting}
            isEdit={isEdit}
          />
        </FormModal>
      )}
    </Container>
  );
};

export default OutPatients;
