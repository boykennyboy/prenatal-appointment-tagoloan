import { FileText, Hospital } from 'lucide-react';
import SelectReact from '../../ui/SelectReact';
import InputGroup from '../../ui/InputGroup';

// Patient Information Form Component
const PatientInfoForm = ({ formData, setFormData, priorities, error }) => (
  <div className='max-w-xl mx-auto space-y-6'>
    <div>
      <SelectReact
        label='Select Patient'
        id='pregnancy_tracking_id'
        name='pregnancy_tracking_id'
        endpoint={`/api/filter/pregnancy-trakings`}
        placeholder='Choose a patient from pregnancy tracking'
        formData={formData}
        setFormData={setFormData}
        inputChange={(value, fullname) => {
          setFormData((prev) => ({
            ...prev,
            pregnancy_tracking_id: value,
            fullname: fullname,
          }));
        }}
        labelKey='fullname'
      />
      {error.pregnancy_tracking_id && (
        <p className='error mt-1'>{error.pregnancy_tracking_id[0]}</p>
      )}
    </div>

    <div>
      <InputGroup
        type='number'
        name='visit_count'
        value={formData.visit_count}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            visit_count: e.target.value,
          }))
        }
        placeholder='Visit Count'
        icon={<Hospital className='h-5 w-5 text-gray-400' />}
        id='visit_count'
        hasLabel
        label='Visit Count'
        min={1}
      />
      {error.visit_count && (
        <p className='error mt-1'>{error.visit_count[0]}</p>
      )}
    </div>

    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Priority Level
      </label>
      <div className='flex flex-col sm:flex-row items-center gap-4'>
        {Object.entries(priorities).map(([key, value]) => (
          <label
            key={key}
            className='w-full flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
          >
            <input
              type='radio'
              name='priority'
              value={key}
              checked={formData.priority === key}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value,
                })
              }
              className='mr-3 text-blue-600'
            />
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${value.color}`}
            >
              {value.label}
            </span>
          </label>
        ))}
      </div>
      {error.priority && <p className='error mt-1'>{error.priority[0]}</p>}
    </div>

    <div>
      <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
        <FileText size={16} />
        Additional Notes (Optional)
      </label>
      <textarea
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        rows='4'
        className='w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all'
        placeholder='Any additional information or special requests'
      />
    </div>
  </div>
);

export default PatientInfoForm;
