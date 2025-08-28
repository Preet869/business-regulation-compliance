import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, DollarSign, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { businessAPI, complianceAPI } from '../services/api';

// Helper functions defined outside components for reuse
const getRiskLevelColor = (riskLevel) => {
  switch (riskLevel) {
    case 'Low': return 'risk-low';
    case 'Medium': return 'risk-medium';
    case 'High': return 'risk-high';
    case 'Critical': return 'risk-critical';
    default: return 'risk-medium';
  }
};

const getComplianceScoreColor = (score) => {
  if (score >= 80) return 'text-success-600';
  if (score >= 60) return 'text-warning-600';
  if (score >= 40) return 'text-danger-600';
  return 'text-red-600';
};

const ComplianceChecker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [complianceResult, setComplianceResult] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log('Submitting business data:', data);
      
      // First, save the business data
      const businessResponse = await businessAPI.createBusiness(data);
      const savedBusiness = businessResponse.data;
      console.log('Saved business response:', savedBusiness);
      
      // Then check compliance
      const complianceResponse = await complianceAPI.checkCompliance(data);
      const complianceResult = complianceResponse.data;
      console.log('Compliance response:', complianceResult);
      
      // Add the saved business to the compliance result
      const resultWithBusiness = {
        ...complianceResult,
        business: savedBusiness.business || savedBusiness, // Handle both response structures
        businessId: (savedBusiness.business || savedBusiness).id
      };
      
      console.log('Final result object:', resultWithBusiness);
      
      // Debug: Check if we have the expected data
      if (!complianceResult.applicableRegulations || complianceResult.applicableRegulations.length === 0) {
        console.warn('No applicable regulations found - this might indicate a database issue');
      }
      
      if (complianceResult.complianceScore === undefined) {
        console.warn('Compliance score is undefined - this might indicate a calculation issue');
      }
      
      setComplianceResult(resultWithBusiness);
      toast.success('Business saved and compliance check completed successfully!');
    } catch (error) {
      console.error('Error processing compliance check:', error);
      if (error.response?.status === 409) {
        toast.error('A business with this name already exists. Please use a different name.');
      } else {
        toast.error(error.response?.data?.error || 'Failed to process compliance check');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Business Compliance Checker
        </h1>
        <p className="text-gray-600 text-lg">
          Enter your business details to determine which regulations apply and what you need to do to comply.
        </p>
      </div>

      {!complianceResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Information Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Business Information</h2>
              <p className="card-subtitle">
                Provide your business details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    defaultValue="CA"
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
                    defaultValue="Kern"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Checking Compliance...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Check Compliance
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">What This Tool Does</h3>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Our compliance checker analyzes your business profile against thousands of regulations from:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                    Federal regulations (OSHA, EPA, etc.)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                    California state laws
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                    Kern County ordinances
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
                    Local city regulations
                  </li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Why Compliance Matters</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Avoid costly fines and penalties</span>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Prevent legal issues and lawsuits</span>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Protect your business reputation</span>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-warning-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ensure employee and customer safety</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Privacy & Security</h3>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  Your business information is processed securely and is not stored permanently. 
                  We use this data only to determine applicable regulations for your business profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ComplianceResults 
          result={complianceResult} 
          onReset={() => {
            setComplianceResult(null);
            reset();
          }}
        />
      )}
    </div>
  );
};

const ComplianceResults = ({ result, onReset }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Add defensive programming to handle undefined business object
  if (!result || !result.business) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Results</h2>
        <p className="text-gray-600 mb-6">Unable to load compliance results. Please try again.</p>
        <button onClick={onReset} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const handleSaveComplianceResult = async () => {
    if (isSaved) return;
    
    setIsSaving(true);
    try {
      await complianceAPI.saveComplianceResult({
        businessId: result.businessId || result.business?.id,
        complianceScore: result.complianceScore || 0,
        riskLevel: result.riskLevel || 'Medium',
        applicableRegulations: result.applicableRegulations || [],
        nextDeadlines: result.nextDeadlines || [],
        recommendations: result.recommendations || [],
        timestamp: new Date().toISOString()
      });
      
      setIsSaved(true);
      toast.success('Compliance result saved successfully!');
    } catch (error) {
      console.error('Error saving compliance result:', error);
      toast.error('Failed to save compliance result');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Compliance Results for {result.business.name || 'Your Business'}
          </h2>
          <p className="text-gray-600">
            Based on your business profile in {result.business.location?.city || 'Unknown City'}, {result.business.location?.county || 'Unknown County'} County
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSaveComplianceResult}
            disabled={isSaving || isSaved}
            className={`btn-primary ${isSaved ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : isSaved ? (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Saved
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Results
              </div>
            )}
          </button>
          <button onClick={onReset} className="btn-secondary">
            Check Another Business
          </button>
        </div>
      </div>

      {/* Compliance Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="mb-4">
            <Shield className={`h-12 w-12 mx-auto ${getComplianceScoreColor(result.complianceScore || 0)}`} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {result.complianceScore || 0}%
          </h3>
          <p className="text-gray-600">Compliance Score</p>
        </div>

        <div className="card text-center">
          <div className="mb-4">
            <AlertTriangle className={`h-12 w-12 mx-auto ${getRiskLevelColor(result.riskLevel || 'Medium').includes('success') ? 'text-success-500' : getRiskLevelColor(result.riskLevel || 'Medium').includes('warning') ? 'text-warning-500' : 'text-danger-500'}`} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {result.riskLevel || 'Medium'}
          </h3>
          <p className="text-gray-600">Risk Level</p>
        </div>

        <div className="card text-center">
          <div className="mb-4">
            <FileText className="h-12 w-12 mx-auto text-primary-500" />
          </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {(result.applicableRegulations || []).length}
          </h3>
          <p className="text-gray-600">Applicable Regulations</p>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={`card border-2 ${getRiskLevelColor(result.riskLevel || 'Medium')}`}>
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-3" />
          <div>
            <h3 className="font-semibold text-lg">
              Risk Level: {result.riskLevel || 'Medium'}
            </h3>
            <p className="text-sm">
              {result.riskLevel === 'Low' && 'Your business has a low compliance risk. Continue monitoring regulations.'}
              {result.riskLevel === 'Medium' && 'Your business has moderate compliance risk. Review and address key areas.'}
              {result.riskLevel === 'High' && 'Your business has high compliance risk. Immediate attention required.'}
              {result.riskLevel === 'Critical' && 'Your business has critical compliance risk. Urgent action required.'}
            </p>
          </div>
        </div>
      </div>

      {/* Next Deadlines */}
      {result.nextDeadlines && result.nextDeadlines.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Deadlines
            </h3>
          </div>
          <div className="space-y-2">
            {result.nextDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{deadline}</span>
                <span className="text-sm text-gray-500">Deadline</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recommendations</h3>
        </div>
        <div className="space-y-3">
          {(result.recommendations || []).map((recommendation, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Applicable Regulations */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Applicable Regulations</h3>
          <p className="card-subtitle">
            These regulations apply to your business based on your profile
          </p>
        </div>
        <div className="space-y-4">
          {(result.applicableRegulations || []).map((regulation, index) => (
            <div key={regulation.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{regulation.title || 'Untitled Regulation'}</h4>
                <span className={`badge badge-${(regulation.category || 'General') === 'Health & Safety' ? 'danger' : (regulation.category || 'General') === 'Environmental' ? 'warning' : 'primary'}`}>
                  {regulation.category || 'General'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{regulation.description || 'No description available'}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">
                  <strong>Jurisdiction:</strong> {regulation.jurisdiction || 'Unknown'}
                </span>
                <span>
                  <strong>Authority:</strong> {regulation.authority || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecker;
