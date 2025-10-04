// import React, { useEffect, useRef, useState } from 'react';
// import {
//   User,
//   Phone,
//   MapPin,
//   Calendar,
//   Heart,
//   UserCheck,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   Hospital,
//   Building,
//   Landmark,
// } from 'lucide-react';
// import SelectReact from './ui/SelectReact';
// import InputGroup from './ui/InputGroup';
// import SelectAddressReact from './ui/SelectAddressReact';
// import { useFormSubmit } from '../utils/functions';
// import SelectGroup from './ui/SelectGroup';
// import PregnancyReviewInterface from './interfaces/form-wizard/PregnancyTrackingReviewIternface';

// const FormWizards = ({ row }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [patientType, setPatientType] = useState('');
//   const [pregnancyTrackingId, setPregnancyTrackingId] = useState(0);
//   const [isEdit, setIsEdit] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const printRef = useRef();
//   const [formData, setFormData] = useState({
//     // Patient fields
//     firstname: '',
//     lastname: '',
//     middlename: '',
//     age: '',
//     sex: '',
//     status: '',
//     birth_date: '',
//     birth_place: '',
//     religion: '',
//     contact: '',
//     contact_person_name: '',
//     contact_person_number: '',
//     contact_person_relationship: '',
//     region: 0,
//     province: 0,
//     municipality: 0,
//     barangay: 0,
//     // Tracking fields
//     barangay_center_id: 0,
//     barangay_worker_id: 0,
//     midwife_id: 0,
//     gravidity: 0,
//     parity: 0,
//     lmp: '',
//     edc: '',
//     birthing_center: '',
//     birthing_center_address: '',
//     referral_center: '',
//     referral_center_address: '',
//     barangay_health_station: '',
//     rural_health_unit: '',
//     // Existing patient
//     patient_id: 0,
//   });

//   const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

//   const onSubmit = (e) => {
//     handleSubmit({
//       e,
//       isEdit,
//       url: isEdit
//         ? `/api/pregnancy-trackings/${pregnancyTrackingId}`
//         : '/api/pregnancy-trackings',
//       formData,
//       onSuccess: () => console.log('sumitted'),
//       onReset: () => {
//         setFormData({
//           firstname: '',
//           lastname: '',
//           middlename: '',
//           age: '',
//           sex: '',
//           status: '',
//           birth_date: '',
//           birth_place: '',
//           religion: '',
//           contact: '',
//           contact_person_name: '',
//           contact_person_number: '',
//           contact_person_relationship: '',
//           region: 0,
//           province: 0,
//           municipality: 0,
//           barangay: 0,
//           // Tracking fields
//           barangay_center_id: 0,
//           barangay_worker_id: 0,
//           midwife_id: 0,
//           gravidity: 0,
//           parity: 0,
//           lmp: '',
//           edc: '',
//           birthing_center: '',
//           birthing_center_address: '',
//           referral_center: '',
//           referral_center_address: '',
//           barangay_health_station: '',
//           rural_health_unit: '',
//           // Existing patient
//           patient_id: 0,
//           patient_type: '',
//         });
//         setError({});
//         if (isEdit) {
//           setPregnancyTrackingId(0);
//           setIsEdit(false);
//         }
//       },
//     });
//   };

//   const steps = [
//     {
//       number: 1,
//       title: 'Patient Information',
//       description: 'Basic patient details',
//     },
//     {
//       number: 2,
//       title: 'Personal Details',
//       description: 'Contact and address information',
//     },
//     {
//       number: 3,
//       title: 'Health Information',
//       description: 'Medical and tracking details',
//     },
//     {
//       number: 4,
//       title: 'Review & Submit',
//       description:
//         'Please review all information before submitting your pregnancy tracking record',
//     },
//   ];

//   const handlePrint = () => {
//     const printContent = printRef.current;
//     const printWindow = window.open('', '_blank');

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>National Safe Motherhood Program - Pregnancy Tracking</title>
//           <style>
//             @media print {
//               @page {
//                 size: landscape;
//                 margin: 0.5in;
//               }
//             }
//             body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 10px;
//               font-size: 11px;
//               background: white;
//               line-height: 1.2;
//             }
//             .form-container {
//               width: 100%;
//               max-width: none;
//             }
//             .header {
//               text-align: center;
//               margin-bottom: 15px;
//             }
//             .header h1 {
//               font-size: 14px;
//               font-weight: bold;
//               margin: 0 0 2px 0;
//             }
//             .header h2 {
//               font-size: 12px;
//               font-weight: bold;
//               margin: 0 0 15px 0;
//             }
//             .info-section {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 15px;
//               font-size: 10px;
//             }
//             .info-left, .info-right {
//               width: 48%;
//             }
//             .info-row {
//               display: flex;
//               margin-bottom: 4px;
//               align-items: center;
//             }
//             .info-label {
//               font-weight: normal;
//               margin-right: 5px;
//               min-width: 80px;
//             }
//             .info-value {
//               border-bottom: 1px solid black;
//               flex: 1;
//               padding: 0 3px;
//               min-height: 14px;
//             }
//             .main-table {
//               width: 100%;
//               border-collapse: collapse;
//               border: 2px solid black;
//               font-size: 9px;
//             }
//             .main-table th,
//             .main-table td {
//               border: 1px solid black;
//               padding: 2px;
//               text-align: center;
//               vertical-align: middle;
//             }
//             .main-table th {
//               background-color: #f0f0f0;
//               font-weight: bold;
//               font-size: 8px;
//               line-height: 1.1;
//             }
//             .main-table .name-cell {
//               text-align: left;
//               padding-left: 5px;
//             }
//             .no-cell { width: 25px; }
//             .name-cell { width: 100px; }
//             .age-cell { width: 30px; }
//             .gravidity-cell { width: 40px; }
//             .parity-cell { width: 40px; }
//             .delivery-date-header { width: 90px; }
//             .delivery-subcell { width: 30px; font-size: 7px; }
//             .checkup-header { width: 280px; }
//             .checkup-subcell { width: 70px; font-size: 7px; line-height: 1.0; }
//             .pregnancy-outcome-header { width: 200px; }
//             .outcome-subcell { width: 50px; font-size: 7px; line-height: 1.0; }
//             .prenatal-header { width: 120px; }
//             .prenatal-subcell { width: 60px; font-size: 7px; line-height: 1.0; }

//             .data-row {
//               height: 25px;
//             }
//             .empty-row {
//               height: 22px;
//             }
//             .bottom-section {
//               display: flex;
//               justify-content: space-between;
//               margin-top: 15px;
//               font-size: 10px;
//             }
//             .bottom-left, .bottom-right {
//               width: 48%;
//             }
//             .multi-line {
//               white-space: pre-line;
//               line-height: 1.0;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="form-container">
//             <!-- Header -->
//             <div class="header">
//               <h1>National Safe Motherhood Program</h1>
//               <h2>PREGNANCY TRACKING</h2>
//             </div>

//             <!-- Top Information Section -->
//             <div class="info-section">
//               <div class="info-left">
//                 <div class="info-row">
//                   <span class="info-label">Year:</span>
//                   <span class="info-value">${new Date().getFullYear()}</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Region:</span>
//                   <span class="info-value">${formData.region || ''}</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Province:</span>
//                   <span class="info-value">${formData.province || ''}</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Municipality:</span>
//                   <span class="info-value">${formData.municipality || ''}</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Barangay:</span>
//                   <span class="info-value">${formData.barangay || ''}</span>
//                 </div>
//               </div>
//               <div class="info-right">
//                 <div class="info-row">
//                   <span class="info-label">Birthing Center:</span>
//                   <span class="info-value">${
//                     formData.birthing_center || ''
//                   }</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Address:</span>
//                   <span class="info-value">${
//                     formData.birthing_center_address || ''
//                   }</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Referral Center:</span>
//                   <span class="info-value">${
//                     formData.referral_center || ''
//                   }</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Address:</span>
//                   <span class="info-value">${
//                     formData.referral_center_address || ''
//                   }</span>
//                 </div>
//               </div>
//             </div>

//             <!-- Main Table -->
//             <table class="main-table">
//               <!-- Header Row -->
//               <thead>
//                 <tr>
//                   <th rowspan="2" class="no-cell">No.</th>
//                   <th rowspan="2" class="name-cell">Name</th>
//                   <th rowspan="2" class="age-cell">Age</th>
//                   <th rowspan="2" class="gravidity-cell">Gravidity</th>
//                   <th rowspan="2" class="parity-cell">Parity</th>
//                   <th colspan="3" class="delivery-date-header">Expected Date of<br>Delivery</th>
//                   <th colspan="4" class="checkup-header">Antenatal Care Check-Ups</th>
//                   <th colspan="4" class="pregnancy-outcome-header">Pregnancy<br>Outcome</th>
//                   <th colspan="2" class="prenatal-header">Mother and Child<br>Prenatal Check-up</th>
//                 </tr>
//                 <tr>
//                   <th class="delivery-subcell">Month</th>
//                   <th class="delivery-subcell">Day</th>
//                   <th class="delivery-subcell">Year</th>
//                   <th class="checkup-subcell">1st visit<br>Date</th>
//                   <th class="checkup-subcell">2nd visit<br>Date</th>
//                   <th class="checkup-subcell">3rd visit<br>Date</th>
//                   <th class="checkup-subcell">4th visit<br>or more<br>Date</th>
//                   <th class="outcome-subcell">Live Birth</th>
//                   <th class="outcome-subcell">Preterm Birth</th>
//                   <th class="outcome-subcell">Stillbirth</th>
//                   <th class="outcome-subcell">Abortion</th>
//                   <th class="prenatal-subcell">Day of Discharge/<br>24 hours after birth</th>
//                   <th class="prenatal-subcell">Within 7 days after birth</th>
//                 </tr>
//               </thead>

//               <!-- Data Rows -->
//               <tbody>
//                 <!-- First row with data -->
//                 <tr class="data-row">
//                   <td>1</td>
//                   <td class="name-cell">${
//                     patientType === 'new'
//                       ? `${formData.firstname || ''} ${
//                           formData.middlename || ''
//                         } ${formData.lastname || ''}`.trim()
//                       : 'Selected Patient'
//                   }</td>
//                   <td>${formData.age || ''}</td>
//                   <td>${formData.gravidity || ''}</td>
//                   <td>${formData.parity || ''}</td>
//                   ${(() => {
//                     if (formData.edc) {
//                       const date = new Date(formData.edc);
//                       const month = date.getMonth() + 1;
//                       const day = date.getDate();
//                       const year = date.getFullYear();
//                       return `
//                         <td>${month}</td>
//                         <td>${day}</td>
//                         <td>${year}</td>
//                       `;
//                     }
//                     return `
//                       <td></td>
//                       <td></td>
//                       <td></td>
//                     `;
//                   })()}
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>

//                 <!-- Empty rows -->
//                 ${[...Array(9)]
//                   .map(
//                     (_, index) => `
//                 <tr class="empty-row">
//                   <td>${index + 2}</td>
//                   <td class="name-cell"></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//                 `
//                   )
//                   .join('')}
//               </tbody>
//             </table>

//             <!-- Bottom Information -->
//             <div class="bottom-section">
//               <div class="bottom-left">
//                 <div class="info-row">
//                   <span class="info-label">Name of BHW:</span>
//                   <span class="info-value">${
//                     formData.barangay_worker_id || ''
//                   }</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Name of Midwife:</span>
//                   <span class="info-value">${formData.midwife_id || ''}</span>
//                 </div>
//               </div>
//               <div class="bottom-right">
//                 <div class="info-row">
//                   <span class="info-label">Barangay Health Station:</span>
//                   <span class="info-value">${
//                     formData.barangay_health_station || ''
//                   }</span>
//                 </div>
//                 <div class="info-row">
//                   <span class="info-label">Rural Health Unit:</span>
//                   <span class="info-value">${
//                     formData.rural_health_unit || ''
//                   }</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();

//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 250);
//   };
//   //   const handlePrint = () => {
//   //     const printContent = printRef.current;
//   //     const printWindow = window.open('', '_blank');

//   //     printWindow.document.write(`
//   //       <!DOCTYPE html>
//   //       <html>
//   //         <head>
//   //           <title>National Safe Motherhood Program - Pregnancy Tracking</title>
//   //           <style>
//   //             @media print {
//   //               @page {
//   //                 size: landscape;
//   //                 margin: 0.5in;
//   //               }
//   //             }
//   //             body {
//   //               font-family: Arial, sans-serif;
//   //               margin: 0;
//   //               padding: 20px;
//   //               font-size: 12px;
//   //               background: white;
//   //             }
//   //             .form-container {
//   //               max-width: 100%;
//   //               margin: 0 auto;
//   //             }
//   //             .header {
//   //               text-align: center;
//   //               margin-bottom: 20px;
//   //             }
//   //             .header h1 {
//   //               font-size: 16px;
//   //               font-weight: bold;
//   //               margin: 0;
//   //             }
//   //             .header h2 {
//   //               font-size: 14px;
//   //               font-weight: bold;
//   //               margin: 5px 0;
//   //             }
//   //             .info-section {
//   //               display: grid;
//   //               grid-template-columns: 1fr 1fr;
//   //               gap: 40px;
//   //               margin-bottom: 20px;
//   //               font-size: 11px;
//   //             }
//   //             .info-row {
//   //               display: flex;
//   //               margin-bottom: 8px;
//   //             }
//   //             .info-label {
//   //               min-width: 80px;
//   //               font-weight: normal;
//   //             }
//   //             .info-value {
//   //               border-bottom: 1px solid black;
//   //               flex: 1;
//   //               padding: 0 5px;
//   //             }
//   //             .table-container {
//   //               border: 2px solid black;
//   //               width: 100%;
//   //             }
//   //             .table-header {
//   //               display: grid;
//   //               grid-template-columns: 40px 120px 40px 60px 50px 120px 160px 80px 80px;
//   //               background-color: #f5f5f5;
//   //             }
//   //             .table-subheader {
//   //               display: grid;
//   //               grid-template-columns: 40px 120px 40px 60px 50px 120px 160px 80px 80px;
//   //               background-color: #f9f9f9;
//   //               border-top: 1px solid black;
//   //               font-size: 9px;
//   //             }
//   //             .table-row {
//   //               display: grid;
//   //               grid-template-columns: 40px 120px 40px 60px 50px 120px 160px 80px 80px;
//   //               border-top: 1px solid black;
//   //               min-height: 30px;
//   //             }
//   //             .table-cell {
//   //               border-right: 1px solid black;
//   //               padding: 4px;
//   //               text-align: center;
//   //               font-size: 10px;
//   //               display: flex;
//   //               align-items: center;
//   //               justify-content: center;
//   //               word-wrap: break-word;
//   //             }
//   //             .table-cell:last-child {
//   //               border-right: none;
//   //             }
//   //             .table-cell.text-left {
//   //               justify-content: flex-start;
//   //               text-align: left;
//   //             }
//   //             .checkup-grid {
//   //               display: grid;
//   //               grid-template-columns: 1fr 1fr 1fr 1fr;
//   //               height: 100%;
//   //             }
//   //             .checkup-cell {
//   //               border-right: 1px solid black;
//   //               padding: 2px;
//   //               font-size: 8px;
//   //               display: flex;
//   //               align-items: center;
//   //               justify-content: center;
//   //             }
//   //             .checkup-cell:last-child {
//   //               border-right: none;
//   //             }
//   //             .bottom-section {
//   //               display: grid;
//   //               grid-template-columns: 1fr 1fr;
//   //               gap: 40px;
//   //               margin-top: 20px;
//   //               font-size: 11px;
//   //             }
//   //             .multi-line-header {
//   //               display: flex;
//   //               flex-direction: column;
//   //               justify-content: center;
//   //             }
//   //           </style>
//   //         </head>
//   //         <body>
//   //           ${printContent.outerHTML}
//   //         </body>
//   //       </html>
//   //     `);

//   //     printWindow.document.close();
//   //     printWindow.focus();

//   //     setTimeout(() => {
//   //       printWindow.print();
//   //       printWindow.close();
//   //     }, 250);
//   //   };

//   useEffect(() => {
//     if (row) {
//       setIsEdit(true);
//       setPregnancyTrackingId(row.id);
//       setPatientType('existing');
//       setFormData({
//         firstname: row.firstname,
//         lastname: row.lastname,
//         middlename: row.middlename,
//         age: row.age,
//         sex: row.sex,
//         status: row.status,
//         birth_date: row.birth_date,
//         birth_place: row.birth_place,
//         religion: row.religion,
//         contact: row.contact,
//         contact_person_name: row.contact_person_name,
//         contact_person_number: row.contact_person_number,
//         contact_person_relationship: row.contact_person_relationship,
//         region: row.region,
//         province: row.province,
//         municipality: row.municipality,
//         barangay: row.barangay,
//         // Tracking fields
//         barangay_center_id: row.barangay_center_id,
//         barangay_worker_id: row.barangay_worker_id,
//         midwife_id: row.midwife_id,
//         gravidity: row.gravidity,
//         parity: row.parity,
//         lmp: row.lmp,
//         edc: row.edc,
//         birthing_center: row.birthing_center,
//         birthing_center_address: row.birthing_center_address,
//         referral_center: row.referral_center,
//         referral_center_address: row.referral_center_address,
//         barangay_health_station: row.barangay_health_station,
//         rural_health_unit: row.rural_health_unit,
//         // Existing patient
//         patient_id: row.patient_id,
//       });
//     }
//   }, [row]);

//   const inputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const nextStep = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const statusOptions = [
//     {
//       name: 'Single',
//       value: 'single',
//     },
//     {
//       name: 'Married',
//       value: 'married',
//     },

//     {
//       name: 'Widowed',
//       value: 'widowed',
//     },
//     {
//       name: 'Legally Separated',
//       value: 'legally separated',
//     },
//     {
//       name: 'Anulled',
//       value: 'anulled',
//     },
//   ];

//   const sexOptions = [
//     {
//       name: 'Male',
//       value: 'male',
//     },
//     {
//       name: 'Female',
//       value: 'female',
//     },
//   ];

//   const PatientTypeCard = ({ type, title, description, icon }) => (
//     <div
//       onClick={() => setPatientType(type)}
//       className={`cursor-pointer p-6 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
//         patientType === type
//           ? 'border-purple-500 bg-purple-50'
//           : 'border-gray-200 bg-white hover:border-gray-300'
//       }`}
//     >
//       <div className='flex items-center space-x-4'>
//         <div
//           className={`p-3 rounded-full ${
//             patientType === type
//               ? 'bg-purple-500 text-white'
//               : 'bg-gray-100 text-gray-600'
//           }`}
//         >
//           {icon}
//         </div>
//         <div>
//           <h3 className='font-medium text-gray-900'>{title}</h3>
//           <p className='text-sm text-gray-500'>{description}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className='space-y-6'>
//             <div>
//               <h3 className='text-lg font-medium text-gray-900 mb-4'>
//                 Choose Patient Type
//               </h3>
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                 <PatientTypeCard
//                   type='existing'
//                   title='Existing Patient'
//                   description='Select from registered patients'
//                   icon={<UserCheck className='h-6 w-6' />}
//                 />
//                 <PatientTypeCard
//                   type='new'
//                   title='New Patient'
//                   description='Register a new patient'
//                   icon={<User className='h-6 w-6' />}
//                 />
//               </div>
//             </div>

//             {patientType === 'existing' && (
//               <div className='mt-6'>
//                 <SelectReact
//                   label='Select Patient'
//                   id='patient_id'
//                   name='patient_id'
//                   endpoint='/api/patients'
//                   placeholder='Choose a patient'
//                   formData={formData}
//                   setFormData={setFormData}
//                   labelKey='fullname'
//                 />
//               </div>
//             )}

//             {patientType === 'new' && (
//               <div className='flex flex-col gap-6'>
//                 {/* Row 1: Fname, Lname, Mname */}
//                 <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//                   <InputGroup
//                     type='text'
//                     name='firstname'
//                     value={formData.firstname}
//                     onChange={inputChange}
//                     placeholder='First name'
//                     icon={<User className='h-5 w-5 text-gray-400' />}
//                     id='firstname'
//                     hasLabel
//                     label='First Name'
//                   />
//                   <InputGroup
//                     type='text'
//                     name='lastname'
//                     value={formData.lastname}
//                     onChange={inputChange}
//                     placeholder='Last name'
//                     icon={<User className='h-5 w-5 text-gray-400' />}
//                     id='lastname'
//                     hasLabel
//                     label='Last Name'
//                   />
//                   <InputGroup
//                     type='text'
//                     name='middlename'
//                     value={formData.middlename}
//                     onChange={inputChange}
//                     placeholder='Middle name'
//                     icon={<User className='h-5 w-5 text-gray-400' />}
//                     id='middlename'
//                     hasLabel
//                     label='Middle Name'
//                   />
//                 </div>

//                 {/* Row 2: Age, Contact */}
//                 <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//                   <InputGroup
//                     type='number'
//                     name='age'
//                     value={formData.age}
//                     onChange={inputChange}
//                     placeholder='Age'
//                     icon={<Calendar className='h-5 w-5 text-gray-400' />}
//                     id='age'
//                     hasLabel
//                     label='Age'
//                   />
//                   <InputGroup
//                     type='text'
//                     name='contact'
//                     value={formData.contact}
//                     onChange={inputChange}
//                     placeholder='Contact Number'
//                     icon={<Phone className='h-5 w-5 text-gray-400' />}
//                     id='contact'
//                     hasLabel
//                     label='Contact Number'
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       case 2:
//         return patientType === 'new' ? (
//           <div className='space-y-6'>
//             <h3 className='text-lg font-medium text-gray-900'>
//               Personal Details
//             </h3>
//             <div className='flex flex-col gap-6'>
//               {/* Row 1: Sex & Civil Status */}
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//                 <SelectGroup
//                   name='sex'
//                   value={formData.sex}
//                   onChange={inputChange}
//                   placeholder='Select Sex'
//                   options={sexOptions}
//                   id={'sex'}
//                   icon={<User className='h-5 w-5 text-gray-400' />}
//                   hasLabel
//                   label={'Sex'}
//                 />
//                 <SelectGroup
//                   name='status'
//                   value={formData.status}
//                   onChange={inputChange}
//                   placeholder='Select Status'
//                   options={statusOptions}
//                   id={'status'}
//                   icon={<User className='h-5 w-5 text-gray-400' />}
//                   hasLabel
//                   label={'Status'}
//                 />
//               </div>

//               {/* Row 2: Birth Place (full width) */}
//               <div>
//                 <InputGroup
//                   type='text'
//                   name='birth_place'
//                   value={formData.birth_place}
//                   onChange={inputChange}
//                   placeholder='Birth place'
//                   icon={<MapPin className='h-5 w-5 text-gray-400' />}
//                   id='birth_place'
//                   hasLabel
//                   label='Birth Place'
//                 />
//               </div>

//               {/* Row 3: Birth Date & Religion */}
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//                 <InputGroup
//                   type='date'
//                   name='birth_date'
//                   value={formData.birth_date}
//                   onChange={inputChange}
//                   placeholder='Birth date'
//                   icon={<Calendar className='h-5 w-5 text-gray-400' />}
//                   id='birth_date'
//                   hasLabel
//                   label='Birth Date'
//                 />
//                 <InputGroup
//                   type='text'
//                   name='religion'
//                   value={formData.religion}
//                   onChange={inputChange}
//                   placeholder='Religion'
//                   icon={<Heart className='h-5 w-5 text-gray-400' />}
//                   id='religion'
//                   hasLabel
//                   label='Religion'
//                 />
//               </div>

//               {/* Row 4: Contact Person Name, Number, Relationship */}
//               <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//                 <InputGroup
//                   type='text'
//                   name='contact_person_name'
//                   value={formData.contact_person_name}
//                   onChange={inputChange}
//                   placeholder='Contact Person Name'
//                   icon={<User className='h-5 w-5 text-gray-400' />}
//                   id='contact_person_name'
//                   hasLabel
//                   label='Contact Person Name'
//                 />
//                 <InputGroup
//                   type='text'
//                   name='contact_person_number'
//                   value={formData.contact_person_number}
//                   onChange={inputChange}
//                   placeholder='Contact Person Number'
//                   icon={<Phone className='h-5 w-5 text-gray-400' />}
//                   id='contact_person_number'
//                   hasLabel
//                   label='Contact Person Number'
//                 />
//                 <InputGroup
//                   type='text'
//                   name='contact_person_relationship'
//                   value={formData.contact_person_relationship}
//                   onChange={inputChange}
//                   placeholder='Relationship'
//                   icon={<User className='h-5 w-5 text-gray-400' />}
//                   id='contact_person_relationship'
//                   hasLabel
//                   label='Contact Person Relationship'
//                 />
//               </div>
//             </div>

//             <div className='space-y-4'>
//               <h4 className='font-medium text-gray-900'>Address Information</h4>
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                 <SelectAddressReact
//                   label='Region'
//                   id='region'
//                   name='region'
//                   endpoint='/api/select-address/regions'
//                   placeholder='Choose a region'
//                   formData={formData}
//                   setFormData={setFormData}
//                   onChange={(value) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       region: value,
//                       province: 0,
//                       municipality: 0,
//                       barangay: 0,
//                     }))
//                   }
//                 />
//                 <SelectAddressReact
//                   label='Province'
//                   id='province'
//                   name='province'
//                   endpoint={`/api/select-address/provinces/${formData.region}`}
//                   placeholder='Choose a province'
//                   formData={formData}
//                   setFormData={setFormData}
//                   onChange={(value) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       province: value,
//                       municipality: 0,
//                       barangay: 0,
//                     }))
//                   }
//                   disabled={!formData.region}
//                 />
//                 <SelectAddressReact
//                   label='Municipality'
//                   id='municipality'
//                   name='municipality'
//                   endpoint={`/api/select-address/municipalities/${formData.province}`}
//                   placeholder='Choose a municipality'
//                   formData={formData}
//                   setFormData={setFormData}
//                   onChange={(value) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       municipality: value,
//                       barangay: 0,
//                     }))
//                   }
//                   disabled={!formData.province}
//                 />
//                 <SelectAddressReact
//                   label='Barangay'
//                   id='barangay'
//                   name='barangay'
//                   endpoint={`/api/select-address/barangays/${formData.municipality}`}
//                   placeholder='Choose a barangay'
//                   formData={formData}
//                   setFormData={setFormData}
//                   disabled={!formData.municipality}
//                 />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className='text-center py-8'>
//             <p className='text-gray-500'>
//               Patient selected. Continue to health information.
//             </p>
//           </div>
//         );

//       case 3:
//         return (
//           <div className='space-y-6'>
//             <h3 className='text-lg font-medium text-gray-900'>
//               Health Information
//             </h3>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//               <InputGroup
//                 type='number'
//                 name='gravidity'
//                 value={formData.gravidity}
//                 onChange={inputChange}
//                 placeholder='Gravidity'
//                 icon={<Heart className='h-5 w-5 text-gray-400' />}
//                 id='gravidity'
//                 hasLabel
//                 label='Gravidity'
//               />
//               <InputGroup
//                 type='number'
//                 name='parity'
//                 value={formData.parity}
//                 onChange={inputChange}
//                 placeholder='Parity'
//                 icon={<Heart className='h-5 w-5 text-gray-400' />}
//                 id='parity'
//                 hasLabel
//                 label='Parity'
//               />
//               <InputGroup
//                 type='date'
//                 name='lmp'
//                 value={formData.lmp}
//                 onChange={inputChange}
//                 placeholder='Last Menstrual Period'
//                 icon={<Calendar className='h-5 w-5 text-gray-400' />}
//                 id='lmp'
//                 hasLabel
//                 label='Last Menstrual Period (LMP)'
//               />
//               <InputGroup
//                 type='date'
//                 name='edc'
//                 value={formData.edc}
//                 onChange={inputChange}
//                 placeholder='Expected Date of Confinement'
//                 icon={<Calendar className='h-5 w-5 text-gray-400' />}
//                 id='edc'
//                 hasLabel
//                 label='Expected Date of Confinement (EDC)'
//               />
//               <InputGroup
//                 type='text'
//                 name='birthing_center'
//                 value={formData.birthing_center}
//                 onChange={inputChange}
//                 placeholder='Birthing center'
//                 icon={<Hospital className='h-5 w-5 text-gray-400' />}
//                 id='birthing_center'
//                 hasLabel
//                 label='Birthing Center'
//               />
//               <InputGroup
//                 type='text'
//                 name='birthing_center_address'
//                 value={formData.birthing_center_address}
//                 onChange={inputChange}
//                 placeholder='Birthing center address'
//                 icon={<MapPin className='h-5 w-5 text-gray-400' />}
//                 id='birthing_center_address'
//                 hasLabel
//                 label='Birthing Center Address'
//               />
//               <InputGroup
//                 type='text'
//                 name='referral_center'
//                 value={formData.referral_center}
//                 onChange={inputChange}
//                 placeholder='Referral center'
//                 icon={<Building className='h-5 w-5 text-gray-400' />}
//                 id='referral_center'
//                 hasLabel
//                 label='Referral Center'
//               />
//               <InputGroup
//                 type='text'
//                 name='referral_center_address'
//                 value={formData.referral_center_address}
//                 onChange={inputChange}
//                 placeholder='Referral center address'
//                 icon={<MapPin className='h-5 w-5 text-gray-400' />}
//                 id='referral_center_address'
//                 hasLabel
//                 label='Referral Center Address'
//               />
//               <InputGroup
//                 type='text'
//                 name='barangay_health_station'
//                 value={formData.barangay_health_station}
//                 onChange={inputChange}
//                 placeholder='Barangay health station'
//                 icon={<Hospital className='h-5 w-5 text-gray-400' />}
//                 id='barangay_health_station'
//                 hasLabel
//                 label='Barangay Health Station'
//               />
//               <InputGroup
//                 type='text'
//                 name='rural_health_unit'
//                 value={formData.rural_health_unit}
//                 onChange={inputChange}
//                 placeholder='Rural health unit'
//                 icon={<Landmark className='h-5 w-5 text-gray-400' />}
//                 id='rural_health_unit'
//                 hasLabel
//                 label='Rural Health Unit'
//               />
//             </div>
//             <div className='space-y-4'>
//               <h4 className='font-medium text-gray-900'>
//                 Healthcare Providers
//               </h4>
//               <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                 <SelectReact
//                   label='Barangay Health Station'
//                   id='barangay_center_id'
//                   name='barangay_center_id'
//                   endpoint='/api/barangay-centers'
//                   placeholder='Choose a health station'
//                   formData={formData}
//                   setFormData={setFormData}
//                   labelKey='health_station'
//                   onChange={(value) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       barangay_center_id: value,
//                       barangay_worker_id: 0,
//                       midwife_id: 0,
//                     }))
//                   }
//                 />
//                 <SelectReact
//                   label='Barangay Worker'
//                   id='barangay_worker_id'
//                   name='barangay_worker_id'
//                   endpoint={`/api/barangay-workers/barangay-centers/${formData.barangay_center_id}`}
//                   placeholder='Choose a worker'
//                   formData={formData}
//                   setFormData={setFormData}
//                   labelKey='fullname'
//                   disabled={!formData.barangay_center_id}
//                 />
//                 <SelectReact
//                   label='Midwife'
//                   id='midwife_id'
//                   name='midwife_id'
//                   endpoint={`/api/midwives/barangay-centers/${formData.barangay_center_id}`}
//                   placeholder='Choose a midwife'
//                   formData={formData}
//                   setFormData={setFormData}
//                   labelKey='fullname'
//                   disabled={!formData.barangay_center_id}
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         return <PregnancyReviewInterface />;

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className='w-full mx-auto p-4'>
//       {/* Progress Steps */}
//       <div className='mb-8'>
//         <div className='flex items-center justify-between mb-4'>
//           {steps.map((step, index) => (
//             <div key={step.number} className='flex items-center'>
//               <div
//                 className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm ${
//                   currentStep === step.number
//                     ? 'bg-purple-500 border-purple-500 text-white'
//                     : currentStep > step.number
//                     ? 'bg-purple-100 border-purple-500 text-purple-700'
//                     : 'bg-white border-gray-300 text-gray-500'
//                 }`}
//               >
//                 {currentStep > step.number ? (
//                   <Check className='h-5 w-5' />
//                 ) : (
//                   step.number
//                 )}
//               </div>
//               {index < steps.length - 1 && (
//                 <div
//                   className={`hidden md:block w-32 h-0.5 ml-4 ${
//                     currentStep > step.number ? 'bg-purple-500' : 'bg-gray-300'
//                   }`}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className='text-center'>
//           <h2 className='text-xl font-semibold text-gray-900'>
//             {steps[currentStep - 1].title}
//           </h2>
//           <p className='text-gray-600'>{steps[currentStep - 1].description}</p>
//         </div>
//       </div>

//       {/* Form Content */}
//       <div className='bg-white border border-gray-200 rounded-lg p-6 mb-6'>
//         {renderStepContent()}
//       </div>

//       {/* Navigation Buttons */}
//       {!isSubmitted && (
//         <div className='flex justify-between'>
//           <button
//             onClick={prevStep}
//             disabled={currentStep === 1}
//             className={`flex items-center px-6 py-2 border border-gray-300 rounded-md font-medium ${
//               currentStep === 1
//                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 : 'bg-white text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             <ChevronLeft className='h-4 w-4 mr-2' />
//             Back
//           </button>

//           <button
//             onClick={currentStep === steps.length ? handlePrint : nextStep}
//             disabled={(currentStep === 1 && !patientType) || isSubmitted}
//             className={`flex items-center px-6 py-2 rounded-md font-medium ${
//               (currentStep === 1 && !patientType) || isSubmitted
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-purple-500 text-white hover:bg-purple-600'
//             }`}
//           >
//             {isSubmitted
//               ? 'Submitted'
//               : currentStep === steps.length
//               ? 'Submit'
//               : 'Next'}
//             {currentStep !== steps.length && !isSubmitted && (
//               <ChevronRight className='h-4 w-4 ml-2' />
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FormWizards;
