import {
  User,
  MapPin,
  Calendar,
  Heart,
  Building2,
  Phone,
  FileText,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import PregnancyTrackingPDF from '../pdf/PregnancyTrackingPDF';

const PregnancyReviewInterface = ({
  pregnancyTrackingData,
  formData,
  savedFormData,
  isSubmitted = false,
  handleNewRecord,
  patientType,
}) => {
  const InfoCard = ({ title, icon: Icon, children, className = '' }) => (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className='flex items-center mb-4'>
        <Icon className='h-5 w-5 text-blue-600 mr-2' />
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
      </div>
      {children}
    </div>
  );

  const savedData = Object.keys(savedFormData || {}).length
    ? savedFormData
    : formData;

  const dummyData = {
    firstname: 'Maria',
    lastname: 'Santos',
    middlename: 'Cruz',
    age: '28',
    sex: 'Female',
    status: 'Married',
    birth_date: '1995-06-15',
    birth_place: 'Manila',
    religion: 'Catholic',
    contact: '09123456789',
    contact_person_name: 'Juan Santos',
    contact_person_relationship: 'Husband',
    region: 'Region X',
    province: 'Misamis Oriental',
    municipality: 'Iligan City',
    barangay: 'Poblacion',
    barangay_worker_id: 'BHW001',
    midwife_id: 'MW001',
    gravidity: '2',
    parity: '1',
    lmp: '2024-01-15',
    edc: '2024-10-22',
    birthing_center: 'Iligan City Birthing Center',
    birthing_center_address: '123 Health St., Iligan City',
    referral_center: 'Iligan Medical Center',
    referral_center_address: '456 Medical Ave., Iligan City',
    barangay_health_station: 'Poblacion Health Station',
    rural_health_unit: 'Iligan RHU',
  };

  const InfoRow = ({ label, value, className = '' }) => (
    <div
      className={`flex justify-between py-2 border-b border-gray-100 last:border-b-0 ${className}`}
    >
      <span className='text-sm text-gray-600 font-medium'>{label}:</span>
      <span className='text-sm capitalize text-gray-900 font-semibold'>
        {value ? value : value === 0 ? 0 : 'Not specified'}
      </span>
    </div>
  );

  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // If birthday hasn't happened yet this year, subtract 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFullName = () => {
    const parts = [
      savedData.firstname,
      savedData.middlename,
      savedData.lastname,
    ].filter(Boolean);
    return parts.join(' ') || 'Not specified';
  };

  const handlePrintPDF = async () => {
    if (!pregnancyTrackingData) return toast.error('No data to print');

    const blob = await pdf(
      <PregnancyTrackingPDF
        formData={pregnancyTrackingData}
        patientType={patientType}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    // ✅ Trigger browser download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pregnancy-tracking.pdf'; // filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // optional: also open in new tab for preview
    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Personal Information */}
        <InfoCard title='Personal Information' icon={User}>
          <div className='space-y-0'>
            <InfoRow label='Full Name' value={getFullName()} />
            <InfoRow label='Age' value={calculateAge(savedData.birth_date)} />
            <InfoRow label='Sex' value={savedData.sex} />
            <InfoRow label='Civil Status' value={savedData.status} />
            <InfoRow
              label='Birth Date'
              value={formatDate(savedData.birth_date)}
            />
            <InfoRow label='Birth Place' value={savedData.birth_place} />
            <InfoRow label='Religion' value={savedData.religion} />
          </div>
        </InfoCard>

        {/* Contact Information */}
        <InfoCard title='Contact Information' icon={Phone}>
          <div className='space-y-0'>
            <InfoRow
              label='Contact Number'
              value={savedData.contact_person_number}
            />
            <InfoRow
              label='Emergency Contact'
              value={savedData.contact_person_name}
            />
            <InfoRow
              label='Relationship'
              value={savedData.contact_person_relationship}
            />
          </div>
        </InfoCard>

        {/* Location Information */}
        <InfoCard title='Location Information' icon={MapPin}>
          <div className='space-y-0'>
            <InfoRow label='Region' value={savedData.region_name} />
            <InfoRow label='Province' value={savedData.province_name} />
            <InfoRow label='Municipality' value={savedData.municipality_name} />
            <InfoRow label='Barangay' value={savedData.barangay_name} />
            <InfoRow label='Zone/Purok' value={savedData.zone} />
          </div>
        </InfoCard>

        {/* Medical Information */}
        <InfoCard title='Medical Information' icon={Heart}>
          <div className='space-y-0'>
            <InfoRow label='Gravidity' value={savedData.gravidity} />
            <InfoRow label='Parity' value={savedData.parity} />
            <InfoRow label='Abortion' value={savedData.abortion ?? 0} />
            <InfoRow
              label='Last Menstrual Period'
              value={formatDate(savedData.lmp)}
            />
            <InfoRow
              label='Expected Date of Delivery'
              value={formatDate(savedData.edc)}
            />
          </div>
        </InfoCard>

        {/* Healthcare Facilities */}
        <InfoCard
          title='Healthcare Facilities'
          icon={Building2}
          className='lg:col-span-2'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-0'>
              <InfoRow label='BEMOC' value={savedData.bemoc} />
              <InfoRow
                label='Birthing Center Address'
                value={savedData.bemoc_address}
              />
              <InfoRow
                label='Barangay Health Station'
                value={savedData.barangay_health_station}
              />
            </div>
            <div className='space-y-0'>
              <InfoRow label='CEMOC' value={savedData.cemoc} />
              <InfoRow label='CEMOC Address' value={savedData.cemoc_address} />
              <InfoRow label='Referral Unit' value={savedData.referral_unit} />
            </div>
          </div>
        </InfoCard>

        {/* Healthcare Workers */}
        <InfoCard
          title='Healthcare Workers'
          icon={FileText}
          className='lg:col-span-2'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <InfoRow label='HRH In-chrage' value={savedData.nurse_name} />
            <InfoRow label='Midwife' value={savedData.midwife_name} />
          </div>
        </InfoCard>
      </div>

      {/* Action Buttons */}
      {isSubmitted ? (
        <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
          {/* Action buttons */}
          <div className='flex gap-4 mt-4'>
            <button
              onClick={handlePrintPDF}
              className='flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold'
            >
              <Printer className='h-5 w-5 mr-2' />
              Download PDF (Landscape)
            </button>
            <button
              onClick={() => handleNewRecord()}
              className='flex items-center justify-center px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold'
            >
              <RotateCcw className='h-5 w-5 mr-2' />
              Create New Record
            </button>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='bg-emerald-50 border border-emerald-200 rounded-lg p-6'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <Heart className='h-5 w-5 text-emerald-600' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-emerald-800'>
                  Ready to Submit
                </h3>
                <p className='mt-1 text-sm text-emerald-700'>
                  Please review all information above carefully. Once submitted,
                  a new pregnancy tracking record will be created and you'll be
                  able to print it as a PDF document.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PregnancyReviewInterface;
