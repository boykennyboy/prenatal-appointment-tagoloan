// AppointmentForm.jsx
import { useEffect, useRef, useState } from 'react';
import {
  Calendar as CalendarIcon,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import PatientInfoForm from './PatientInfoForm';
import ReviewSummary from './ReviewSummary';
import { useFormSubmit } from '../../../utils/functions';
import ProgressBar from './ProgressBar';
import api from '../../../api/axios';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const AppointmentForm = ({ row = null, type = null }) => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editType, setEditType] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const abortControllerRef = useRef(null);

  const [formData, setFormData] = useState({
    pregnancy_tracking_id: '',
    appointment_date: null,
    priority: 'low',
    visit_count: 1,
    note: '',
    doctor_id: '',
    fullname: '',
  });

  const steps = [
    { id: 1, title: 'Select Date', icon: CalendarIcon },
    { id: 2, title: 'Patient Info', icon: User },
    { id: 3, title: 'Review & Book', icon: CheckCircle },
  ];

  const priorities = {
    high: {
      label: 'High Priority',
      color: 'bg-red-100 text-red-800 border-red-200',
      value: 1,
    },
    low: {
      label: 'Low Priority',
      color: 'bg-green-100 text-green-800 border-green-200',
      value: 3,
    },
  };

  const { handleSubmit, setError, error } = useFormSubmit();

  const onSubmit = (e) => {
    handleSubmit({
      e,
      showToastError: true,
      isEdit,
      url: isEdit ? `/api/appointments/${appointmentId}` : '/api/appointments',
      formData,
      onSuccess: (record) => {},
      onReset: () => {
        resetForm();
        setError({});
        if (isEdit) {
          setAppointmentId(0);
          setIsEdit(false);
          setEditType(null);
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      pregnancy_tracking_id: '',
      appointment_date: null,
      priority: 'low',
      visit_count: 1,
      note: '',
      doctor_id: '',
      fullname: '',
    });
    setCurrentStep(1);
  };

  useEffect(() => {
    if (!row && !type) return;

    setAppointmentId(row.id);
    setIsEdit(true);
    setEditType(type);
    setFormData({
      pregnancy_tracking_id: row.pregnancy_tracking_id,
      appointment_date: row.appointment_date,
      priority: row.priority,
      status: row.status,
      visit_count: row.visit_count,
      note: row.notes ?? '',
      doctor_id: row.doctor_id ?? '',
      fullname: row.fullname ?? '',
    });
    if (type !== 'reschedule') setCurrentStep(2);
  }, [row, type]);

  const isMobile = useIsMobile();

  return (
    <>
      <div className='sticky top-26 z-10 -mx-4 px-4 sm:mx-0 sm:px-0'>
        <ProgressBar steps={steps} currentStep={currentStep} />
      </div>

      <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
        {/* Step 1: Date Selection with FullCalendar */}
        {currentStep === 1 && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Select Your Preferred Date
              </h2>
              <p className='text-gray-600'>
                Choose an available date for your appointment
              </p>
            </div>

            {/* <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              selectable={true}
              events={appointments}
              height='auto'
              headerToolbar={{
                left: 'dayGridMonth',
                center: 'title',
                right: 'prev,next today',
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' }, // e.g., September 2025
                },
              }}
              datesSet={(info) => {
                const start = info.startStr;
                const end = info.endStr;
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                }
                const controller = new AbortController();
                abortControllerRef.current = controller;

                api
                  .get(
                    `/api/available-appointments?start=${start}&end=${end}`,
                    {
                      signal: controller.signal, // 👈 Pass signal here
                    }
                  )
                  .then((res) => {
                    const data = res.data;

                    const events = Object.entries(data).map(([date, info]) => ({
                      title: info.is_fully_booked
                        ? 'Fully Booked'
                        : `${info.remaining_slots} slots left`,
                      start: date,
                      color: info.is_fully_booked ? 'red' : 'green',
                    }));

                    setAppointments(events);
                  })
                  .catch((err) => {
                    if (err.name === 'CanceledError') {
                      console.log('Previous request canceled');
                    } else {
                      console.error('Error fetching availability:', err);
                    }
                  });
              }}
              dateClick={(info) => {
                const date = new Date(info.dateStr);
                const today = new Date();

                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);

                if (date.getDay() === 0 || date.getDay() === 6) {
                  alert('Booking is not allowed on weekends.');
                  return;
                }

                if (date < today) {
                  alert('You cannot book in the past.');
                  return;
                }

                const eventForDate = appointments.find(
                  (e) =>
                    new Date(e.start).toDateString() === date.toDateString()
                );

                if (
                  eventForDate &&
                  eventForDate.title.includes('Fully Booked')
                ) {
                  const proceed = window.confirm(
                    'This date is fully booked. Proceed only if the patient is on their second or subsequent visit.'
                  );

                  if (!proceed) {
                    return; // user clicked Cancel
                  }
                }

                setSelectedDate(date);
                setFormData({
                  ...formData,
                  appointment_date: info.dateStr,
                });
                setCurrentStep(2);
              }}
              eventClick={(info) => {
                const date = new Date(info.event.startStr); // ✅ correct for eventClick
                const today = new Date();

                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);

                if (info.event.title.includes('Fully Booked')) {
                  const proceed = window.confirm(
                    'This date is fully booked. Proceed only if the patient is on their second or subsequent visit.'
                  );

                  if (!proceed) {
                    return;
                  }
                }

                if (date.getDay() === 0 || date.getDay() === 6) {
                  alert('Booking is not allowed on weekends.');
                  return;
                }

                if (date < today) {
                  alert('You cannot book in the past.');
                  return;
                }

                setSelectedDate(date);
                setFormData({
                  ...formData,
                  appointment_date: info.event.startStr,
                });
                setCurrentStep(2);
              }}
            /> */}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              selectable={true}
              events={appointments}
              height='auto'
              weekends={!isMobile} // Hide weekends on mobile
              headerToolbar={{
                left: 'dayGridMonth',
                center: 'title',
                right: 'prev,next today',
              }}
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' },
                },
              }}
              // ... rest of your props remain the same
              eventContent={(eventInfo) => {
                const event = eventInfo.event;
                const doctors = event.extendedProps.doctors || [];

                return (
                  <div className='fc-event-content-wrapper p-1 sm:p-2 overflow-hidden'>
                    <div className='fc-event-title text-xs sm:text-sm font-semibold leading-tight mb-1 truncate'>
                      {event.title}
                    </div>
                    {doctors.length > 0 && (
                      <div className='fc-event-doctors text-white/90'>
                        <div className='text-xs font-medium mb-0.5 hidden sm:block'>
                          Doctors:
                        </div>
                        <div className='text-xs sm:text-xs font-medium mb-0.5 sm:hidden'>
                          Dr:
                        </div>
                        <div className='space-y-0.5'>
                          {doctors.map((doctor, index) => (
                            <div
                              key={doctor.id}
                              className='text-xs leading-tight'
                            >
                              <span className='hidden sm:inline'>• </span>
                              <span className='truncate block sm:inline'>
                                <span className='sm:hidden'>
                                  {doctor.name.split(' ')[0]}
                                </span>
                                <span className='hidden sm:inline'>
                                  {doctor.name}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
              datesSet={(info) => {
                const start = new Date(info.startStr).toLocaleDateString(
                  'en-CA'
                );
                const end = new Date(info.endStr).toLocaleDateString('en-CA');

                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                }
                const controller = new AbortController();
                abortControllerRef.current = controller;

                api
                  .get(
                    `/api/available-appointments?start=${start}&end=${end}`,
                    {
                      signal: controller.signal,
                    }
                  )
                  .then((res) => {
                    const data = res.data;

                    const events = Object.entries(data).map(([date, info]) => {
                      let title = info.is_fully_booked
                        ? 'Fully Booked'
                        : `${info.remaining_slots} slots left`;

                      if (info.doctors && info.doctors.length > 0) {
                        title += ` (${info.doctors.length} doctor${
                          info.doctors.length > 1 ? 's' : ''
                        })`;
                      }

                      return {
                        title: title,
                        start: date,
                        color: info.is_fully_booked ? 'red' : 'green',
                        extendedProps: {
                          doctors: info.doctors || [],
                          remaining_slots: info.remaining_slots,
                          is_fully_booked: info.is_fully_booked,
                        },
                      };
                    });

                    setAppointments(events);
                  })
                  .catch((err) => {
                    if (err.name === 'CanceledError') {
                      console.log('Previous request canceled');
                    } else {
                      console.error('Error fetching availability:', err);
                    }
                  });
              }}
              dateClick={(info) => {
                const date = new Date(info.dateStr);
                const today = new Date();

                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);

                if (date.getDay() === 0 || date.getDay() === 6) {
                  alert('Booking is not allowed on weekends.');
                  return;
                }

                if (date < today) {
                  alert('You cannot book in the past.');
                  return;
                }

                const eventForDate = appointments.find(
                  (e) =>
                    new Date(e.start).toDateString() === date.toDateString()
                );

                if (
                  eventForDate &&
                  eventForDate.title.includes('Fully Booked')
                ) {
                  const proceed = window.confirm(
                    'This date is fully booked. Proceed only if the patient is on their second or subsequent visit.'
                  );

                  if (!proceed) {
                    return;
                  }
                }

                const doctorIds =
                  eventForDate?.extendedProps?.doctors.map((doc) => doc.id) ||
                  [];

                setSelectedDate(date);
                setFormData({
                  ...formData,
                  appointment_date: info.dateStr,
                  doctor_id: doctorIds[0],
                });
                setCurrentStep(2);
              }}
              eventClick={(info) => {
                const date = new Date(info.event.startStr);
                const today = new Date();

                const doctor_id = info.event.extendedProps.doctors[0].id;

                today.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);

                if (info.event.title.includes('Fully Booked')) {
                  const proceed = window.confirm(
                    'This date is fully booked. Proceed only if the patient is on their second or subsequent visit.'
                  );

                  if (!proceed) {
                    return;
                  }
                }

                if (date.getDay() === 0 || date.getDay() === 6) {
                  alert('Booking is not allowed on weekends.');
                  return;
                }

                if (date < today) {
                  alert('You cannot book in the past.');
                  return;
                }

                setSelectedDate(date);
                setFormData({
                  ...formData,
                  appointment_date: info.event.startStr,
                  doctor_id: doctor_id,
                });
                setCurrentStep(2);
              }}
            />
          </div>
        )}

        {/* Step 2: Patient Information */}
        {currentStep === 2 && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Patient Information
              </h2>
              <p className='text-gray-600'>Please provide your details</p>
            </div>

            <PatientInfoForm
              formData={formData}
              setFormData={setFormData}
              priorities={priorities}
              error={error}
            />

            <div className='flex justify-between mt-8 max-w-xl mx-auto'>
              <button
                onClick={() => setCurrentStep(1)}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!formData.pregnancy_tracking_id}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirmation */}
        {currentStep === 3 && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Review Your Appointment
              </h2>
              <p className='text-gray-600'>
                Please confirm your appointment details
              </p>
            </div>

            <ReviewSummary
              selectedDate={selectedDate}
              formData={formData}
              priorities={priorities}
            />

            <div className='flex justify-between gap-4 max-w-md mx-auto'>
              <button
                onClick={() => setCurrentStep(2)}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={onSubmit}
                className='flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium'
              >
                <CheckCircle size={16} /> Confirm Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentForm;
