import React from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, Save, X } from 'lucide-react';

const BusinessForm = ({ 
  business = null, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  submitText = "Save Business"
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: business || {
      name: '',
      industry: '',
      state: 'CA',
      county: 'Kern',
      city: '',
      zipCode: '',
      size: '',
      employeeCount: '',
      annualRevenue: '',
      businessType: ''
    }
  });

  const industries = [
    'Agriculture',
    'Automotive',
    'Construction',
    'Food Service',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Technology',
    'Transportation',
    'Real Estate',
    'Financial Services',
    'Education',
    'Entertainment',
    'Other'
  ];

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'LLC',
    'Corporation',
    'S-Corporation',
    'Non-Profit',
    'Other'
  ];

  const handleFormSubmit = (data) => {
    // Convert string numbers to actual numbers
    const processedData = {
      ...data,
      employeeCount: parseInt(data.employeeCount, 10),
      annualRevenue: parseFloat(data.annualRevenue)
    };
    onSubmit(processedData);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {business ? 'Edit Business' : 'Add New Business'}
        </h2>
        <p className="card-subtitle">
          {business ? 'Update your business information' : 'Enter your business details to get started'}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            {...register('name', { required: 'Business name is required' })}
            className="input-field"
            placeholder="Enter your business name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <select
            {...register('industry', { required: 'Industry is required' })}
            className="select-field"
          >
            <option value="">Select an industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-danger-600">{errors.industry.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              {...register('state', { 
                required: 'State is required',
                pattern: {
                  value: /^[A-Z]{2}$/,
                  message: 'State must be 2 letters (e.g., CA)'
                }
              })}
              className="input-field"
              placeholder="CA"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-danger-600">{errors.state.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              County *
            </label>
            <input
              type="text"
              {...register('county', { required: 'County is required' })}
              className="input-field"
              placeholder="Kern"
            />
            {errors.county && (
              <p className="mt-1 text-sm text-danger-600">{errors.county.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              {...register('city', { required: 'City is required' })}
              className="input-field"
              placeholder="Bakersfield"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-danger-600">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              {...register('zipCode', { 
                required: 'ZIP code is required',
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Please enter a valid ZIP code'
                }
              })}
              className="input-field"
              placeholder="93301"
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-danger-600">{errors.zipCode.message}</p>
            )}
          </div>
        </div>

        {/* Business Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Size *
          </label>
          <select
            {...register('size', { required: 'Business size is required' })}
            className="select-field"
          >
            <option value="">Select business size</option>
            <option value="Small">Small (1-50 employees)</option>
            <option value="Medium">Medium (51-250 employees)</option>
            <option value="Large">Large (250+ employees)</option>
          </select>
          {errors.size && (
            <p className="mt-1 text-sm text-danger-600">{errors.size.message}</p>
          )}
        </div>

        {/* Employee Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Employees *
          </label>
          <input
            type="number"
            {...register('employeeCount', { 
              required: 'Employee count is required',
              min: { value: 1, message: 'Must have at least 1 employee' },
              max: { value: 10000, message: 'Employee count is too high' }
            })}
            className="input-field"
            placeholder="25"
          />
          {errors.employeeCount && (
            <p className="mt-1 text-sm text-danger-600">{errors.employeeCount.message}</p>
          )}
        </div>

        {/* Annual Revenue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              {...register('annualRevenue', { 
                required: 'Annual revenue is required',
                min: { value: 1, message: 'Revenue must be positive' }
              })}
              className="input-field pl-10"
              placeholder="1000000"
            />
          </div>
          {errors.annualRevenue && (
            <p className="mt-1 text-sm text-danger-600">{errors.annualRevenue.message}</p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            {...register('businessType', { required: 'Business type is required' })}
            className="select-field"
          >
            <option value="">Select business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-1 text-sm text-danger-600">{errors.businessType.message}</p>
          )}
        </div>



        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Save className="h-5 w-5 mr-2" />
                {submitText}
              </div>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary px-6 py-3"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BusinessForm;
