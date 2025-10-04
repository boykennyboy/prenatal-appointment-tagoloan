import { useEffect, useState } from 'react';
import { ShieldAlert, Info, ChevronDown, ChevronUp } from 'lucide-react';
import InputGroup from '../../ui/InputGroup';
import DatePicker from '../../ui/DatePicker';
import SelectGroup from '../../ui/SelectGroup';

const RiskCodes = ({ formData, setFormData, error }) => {
  const [showLegend, setShowLegend] = useState(false);

  // Initialize risk_codes array if it doesn't exist
  useEffect(() => {
    if (!formData.risk_codes || formData.risk_codes.length === 0) {
      setFormData((prev) => ({
        ...prev,
        risk_codes: [{ risk_code: '', date_detected: '', risk_status: '' }],
      }));
    }
  }, []);

  const risks = formData.risk_codes || [];

  const handleChange = (index, field, value) => {
    const updated = [...risks];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      risk_codes: updated,
    }));
  };

  const addRisk = () => {
    setFormData((prev) => ({
      ...prev,
      risk_codes: [
        ...(prev.risk_codes || []),
        { risk_code: '', date_detected: '', risk_status: '' },
      ],
    }));
  };

  const removeRisk = (index) => {
    setFormData((prev) => ({
      ...prev,
      risk_codes: (prev.risk_codes || []).filter((_, i) => i !== index),
    }));
  };

  const riskCodeLegend = {
    A: 'an age less than 18 years old',
    B: 'an age more than 35 years old',
    C: 'being less than 145 cm (4\'9") tall',
    D: 'having fourth or more baby or so called grand multi',
    E: 'having one or more of the ff: (a) a previous caesarean section (b) 3 consecutive miscarriages or still-born baby (c) postpartum hemorrhage',
    F: 'having one or more of the ff: (1) Tuberculosis (2) Heart Disease (3) Diabetes (4) Bronchial Asthma (5) Goiter',
  };

  const risk_code_options = [
    {
      name: 'A = an age less than 18 years old',
    },
    {
      name: 'B = an age more than 35 years old',
    },
    {
      name: 'C = being less than 145 cm (4\'9") tall',
    },
    {
      name: 'D = having fourth or more baby or so called grand multi',
    },
    {
      name: 'E (a) = a previous caesarean section',
    },
    {
      name: 'E (b) = 3 consecutive miscarriages or still-born baby',
    },
    {
      name: 'E (c) = postpartum hemorrhage',
    },
    {
      name: 'F (1) = Tuberculosis',
    },
    {
      name: 'F (2) = Heart Disease',
    },
    {
      name: 'F (3) = Diabetes',
    },
    {
      name: 'F (4) = Bronchial Asthma',
    },
    {
      name: 'F (5) = Goiter',
    },
  ];

  return (
    <div className='space-y-4'>
      {/* Legend Toggle */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <button
          type='button'
          onClick={() => setShowLegend(!showLegend)}
          className='flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium'
        >
          <Info className='h-5 w-5' />
          Risk Code Legend
          {showLegend ? (
            <ChevronUp className='h-4 w-4' />
          ) : (
            <ChevronDown className='h-4 w-4' />
          )}
        </button>

        {showLegend && (
          <div className='mt-4 space-y-4'>
            <div>
              <h4 className='font-semibold text-gray-800 mb-2'>Risk Codes:</h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
                {Object.entries(riskCodeLegend).map(([code, description]) => (
                  <div key={code} className='flex gap-2'>
                    <span className='font-mono font-bold text-blue-600 min-w-[20px]'>
                      {code} =
                    </span>
                    <span className='text-gray-700'>{description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Code Input Fields */}
      {risks.map((risk, index) => (
        <div key={index} className='flex gap-4 items-center rounded-lg'>
          <div className='w-full'>
            <SelectGroup
              hasLabel
              label={'Select Risk Code'}
              value={risk.risk_code || ''}
              options={risk_code_options}
              onChange={(e) => handleChange(index, 'risk_code', e.target.value)}
              placeholder='Select Risk Code'
            />

            {error?.[`risk_codes.${index}.risk_code`] && (
              <p className='text-red-500 text-sm mt-1'>
                {error[`risk_codes.${index}.risk_code`][0]}
              </p>
            )}
          </div>
          <div className='w-full'>
            <DatePicker
              hasLabel
              label={'Date Detected'}
              value={risk.date_detected || ''}
              onChange={(e) =>
                handleChange(index, 'date_detected', e.target.value)
              }
            />
            {error?.[`risk_codes.${index}.date_detected`] && (
              <p className='text-red-500 text-sm mt-1'>
                {error[`risk_codes.${index}.date_detected`][0]}
              </p>
            )}
          </div>
          {risks.length > 1 && (
            <button
              type='button'
              onClick={() => removeRisk(index)}
              className='text-red-500 hover:text-red-700 px-2 py-1'
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type='button'
        onClick={addRisk}
        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
      >
        + Add Another Risk
      </button>
    </div>
  );
};

export default RiskCodes;
