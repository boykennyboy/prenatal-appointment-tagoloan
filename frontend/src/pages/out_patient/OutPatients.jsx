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
  prenatal_outpatient_immunization_edit_form_data,
  prenatal_outpatient_immunization_form_data,
} from '../../utils/formDefault';
import OutPatientPDF from '../../components/interfaces/pdf/OutPatientPDF';
import { pdf } from '@react-pdf/renderer';
import UnifiedForm from '../../components/forms/unified_form/UnifiedForm.jsx';
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
    setFormData(prenatal_outpatient_immunization_edit_form_data(row));
    // setFormData(outPatientEditFormData(row));

    setIsOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setIsOpen(true);
  };

  // const onSubmit = (e) => {
  //   handleSubmit({
  //     e,
  //     isEdit,
  //     url: isEdit ? `/api/out-patients/${outPatientId}` : '/api/out-patients',
  //     formData,
  //     onSuccess: () => dataTableRef.current?.fetchData(),
  //     onReset: () => {
  //       setFormData(outPatientFormData);
  //       setError({});
  //       setIsOpen(false);
  //       if (isEdit) {
  //         setOutPatientId(0);
  //         setIsEdit(false);
  //       }
  //     },
  //   });
  // };

  const onSubmit = (e, showImmunization, setShowImmunization) => {
    e.preventDefault();

    // Prepare the data to send
    let dataToSend = { ...formData };

    // // If patient is NOT in third trimester, remove all immunization fields
    if (!showImmunization) {
      const {
        tetanus_first_given,
        tetanus_second_given,
        tetanus_third_given,
        tetanus_fourth_given,
        tetanus_fifth_given,
        tetanus_first_comeback,
        tetanus_second_comeback,
        tetanus_third_comeback,
        tetanus_fourth_comeback,
        tetanus_fifth_comeback,
        covid_first_given,
        covid_second_given,
        covid_booster_given,
        covid_first_comeback,
        covid_second_comeback,
        covid_booster_comeback,
        other_vaccine_name,
        other_first_given,
        other_second_given,
        other_third_given,
        other_fourth_given,
        other_fifth_given,
        other_first_comeback,
        other_second_comeback,
        other_third_comeback,
        other_fourth_comeback,
        other_fifth_comeback,
        ...prenatalDataOnly
      } = dataToSend;

      dataToSend = prenatalDataOnly;
    }

    handleSubmit({
      e,
      isEdit,
      url: `/api/unified-form/update/${outPatientId}`,
      formData: dataToSend,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData(prenatal_outpatient_immunization_form_data);
        setError({});
        setShowImmunization(false);
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
    try {
      const blob = await pdf(<OutPatientPDF formData={row} />).toBlob();

      // Create a proper blob with correct MIME type
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);

      // Open in new tab
      window.open(url, '_blank');

      // Don't revoke - let it persist
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  // const handelDownload = async (row) => {
  //   const blob = await pdf(<OutPatientPDF formData={row} />).toBlob();

  //   const url = URL.createObjectURL(blob);

  //   // ✅ Trigger browser download
  //   // const link = document.createElement('a');
  //   // link.href = url;
  //   // link.download = 'pregnancy-tracking.pdf'; // filename
  //   // document.body.appendChild(link);
  //   // link.click();
  //   // document.body.removeChild(link);

  //   window.open(url, '_blank');

  //   setTimeout(() => URL.revokeObjectURL(url), 1000);
  // };

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
        // onAdd={handleAdd}
        // addButton={user.role_id !== 2 ? 'Add Out Patient' : ''}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={isEdit}
          title={'Out Patient'}
          className={'sm:max-w-6xl'}
        >
          {/* <OutPatientsForm
            onSubmit={onSubmit}
            inputChange={inputChange}
            formData={formData}
            setFormData={setFormData}
            error={error}
            isSubmitting={isSubmitting}
            isEdit={isEdit}
          /> */}

          <UnifiedForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
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
