import { useEffect, useState } from 'react';
import { ShieldAlert, Info, ChevronDown, ChevronUp } from 'lucide-react';
import InputGroup from '../../ui/InputGroup';
import DatePicker from '../../ui/DatePicker';
import SelectGroup from '../../ui/SelectGroup';
import { pickerOptions } from '../../../utils/columns';

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
      value: 'A',
      name: 'A = an age less than 18 years old',
    },
    {
      value: 'B',
      name: 'B = an age more than 35 years old',
    },
    {
      value: 'C',
      name: 'C = being less than 145 cm (4\'9") tall',
    },
    {
      value: 'D',
      name: 'D = having fourth or more baby or so called grand multi',
    },
    {
      value: 'E (a)',
      name: 'E (a) = a previous caesarean section',
    },
    {
      value: 'E (b)',
      name: 'E (b) = 3 consecutive miscarriages or still-born baby',
    },
    {
      value: 'E (c)',
      name: 'E (c) = postpartum hemorrhage',
    },
    {
      value: 'F (1)',
      name: 'F (1) = Tuberculosis',
    },
    {
      value: 'F (2)',
      name: 'F (2) = Heart Disease',
    },
    {
      value: 'F (3)',
      name: 'F (3) = Diabetes',
    },
    {
      value: 'F (4)',
      name: 'F (4) = Bronchial Asthma',
    },
    {
      value: 'F (5)',
      name: 'F (5) = Goiter',
    },
  ];

  // 🧠 Helper function
  const getRiskCodeOptions = (risk_code_options, risks, index, formData) => {
    // Compute age from birth_date
    const birthDate = formData?.birth_date
      ? new Date(formData.birth_date)
      : null;
    const today = new Date();
    const age = birthDate
      ? today.getFullYear() -
        birthDate.getFullYear() -
        (today <
        new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          ? 1
          : 0)
      : null;

    return risk_code_options.filter((opt) => {
      const selectedCodes = risks
        .filter((_, i) => i !== index)
        .map((r) => r.risk_code);

      // A-B exclusivity
      if (selectedCodes.includes('A') && opt.value === 'B') return false;
      if (selectedCodes.includes('B') && opt.value === 'A') return false;

      // Hide duplicates
      if (selectedCodes.includes(opt.value)) return false;

      // Hide A if age is >= 18 (A is for age < 18)
      if (age !== null && age >= 18 && opt.value === 'A') {
        return false;
      }

      // Hide B if age is <= 35 (B is for age > 35)
      if (age !== null && age <= 35 && opt.value === 'B') {
        return false;
      }

      // Hide D if gravidity is less than 4
      if (formData.gravidity < 4 && opt.value === 'D') {
        return false;
      }

      return true;
    });
  };

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
          <div className='mt-4'>
            <h4 className='font-semibold text-gray-800 mb-2'>Risk Codes:</h4>
            <div className='overflow-x-auto'>
              <table className='min-w-full border border-gray-300'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800'>
                      Code
                    </th>
                    <th className='border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800'>
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(riskCodeLegend).map(([code, description]) => (
                    <tr key={code} className='hover:bg-gray-50'>
                      <td className='border border-gray-300 px-4 py-2 font-mono font-bold text-blue-600'>
                        {code}
                      </td>
                      <td className='border border-gray-300 px-4 py-2 text-gray-700'>
                        {description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Risk Code Input Fields */}
      {risks.map((risk, index) => (
        <div key={index} className='flex gap-4 items-center rounded-lg'>
          <div className='w-full'>
            {/* <SelectGroup
              hasLabel
              label={'Select Risk Code'}
              value={risk.risk_code || ''}
              options={risk_code_options}
              onChange={(e) => handleChange(index, 'risk_code', e.target.value)}
              placeholder='Select Risk Code'
            /> */}

            <SelectGroup
              hasLabel
              label={'Select Risk Code'}
              value={risk.risk_code || ''}
              options={getRiskCodeOptions(
                risk_code_options,
                risks,
                index,
                formData
              )}
              onChange={(e) => handleChange(index, 'risk_code', e.target.value)}
              placeholder='Select Risk Code'
              disabled={risk.auto}
            />

            {error?.[`risk_codes.${index}.risk_code`] && (
              <p className='text-red-500 text-sm mt-1'>
                {error[`risk_codes.${index}.risk_code`][0]}
              </p>
            )}
          </div>
          <div className='w-full'>
            <DatePicker
              options={pickerOptions}
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
          {risks.length > 1 && !risk.auto && (
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
