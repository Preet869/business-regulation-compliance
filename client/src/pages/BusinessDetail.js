import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { businessAPI, complianceAPI } from '../services/api';
import toast from 'react-hot-toast';

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [complianceHistory, setComplianceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinessDetails = useCallback(async () => {
    try {
      const response = await businessAPI.getBusiness(id);
      setBusiness(response.data);
    } catch (error) {
      console.error('Error fetching business details:', error);
      toast.error('Failed to fetch business details');
    }
  }, [id]);

  const fetchComplianceHistory = useCallback(async () => {
    try {
      const response = await complianceAPI.getComplianceHistory(id);
      setComplianceHistory(response.data);
    } catch (error) {
      console.error('Error fetching compliance history:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBusinessDetails();
    fetchComplianceHistory();
  }, [fetchBusinessDetails, fetchComplianceHistory]);

  const getSizeColor = (size) => {
    switch (size) {
      case 'Small': return 'badge-success';
      case 'Medium': return 'badge-warning';
      case 'Large': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const formatRevenue = (revenue) => {
    if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`;
    } else if (revenue >= 1000) {
      return `$${(revenue / 1000).toFixed(0)}K`;
    }
    return `$${revenue.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'risk-low';
      case 'Medium': return 'risk-medium';
      case 'High': return 'risk-high';
      case 'Critical': return 'risk-critical';
      default: return 'risk-medium';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h2>
        <p className="text-gray-600 mb-6">The business you're looking for doesn't exist.</p>
        <Link to="/businesses" className="btn-primary">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Businesses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/businesses" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Businesses
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {business.name}
            </h1>
            <p className="text-gray-600 text-lg">
              Business Profile & Compliance History
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Business Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                <p className="text-gray-900 font-medium">{business.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Industry</label>
                <p className="text-gray-900">{business.industry}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Business Type</label>
                <p className="text-gray-900">{business.businessType}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Business Size</label>
                <span className={`badge ${getSizeColor(business.size)}`}>
                  {business.size}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Employee Count</label>
                <p className="text-gray-900">{business.employeeCount} employees</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Annual Revenue</label>
                <p className="text-gray-900 font-medium">{formatRevenue(business.annualRevenue)}</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                <p className="text-gray-900">{business.location.state}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">County</label>
                <p className="text-gray-900">{business.location.county}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <p className="text-gray-900">{business.location.city}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ZIP Code</label>
                <p className="text-gray-900">{business.location.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Compliance History */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Compliance History</h2>
              <p className="card-subtitle">
                Recent compliance checks and results
              </p>
            </div>
            
            {complianceHistory && complianceHistory.compliance ? (
              <div className="space-y-6">
                {/* Compliance Summary */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`badge ${getRiskLevelColor(complianceHistory.compliance.risk_level)}`}>
                        {complianceHistory.compliance.risk_level} Risk
                      </span>
                      <span className="text-sm text-gray-500">
                        Score: {complianceHistory.compliance.compliance_score}%
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(complianceHistory.compliance.created_at)}
                    </span>
                  </div>
                  
                  {/* Applicable Regulations Count */}
                  {complianceHistory.regulations && complianceHistory.regulations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        <strong>{complianceHistory.regulations.length} Applicable Regulations</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Detailed Regulations */}
                {complianceHistory.regulations && complianceHistory.regulations.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Applicable Regulations</h4>
                    {complianceHistory.regulations.map((regulation) => (
                      <div key={regulation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">{regulation.title}</h5>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="badge badge-secondary text-xs">{regulation.category}</span>
                            <span className="text-xs text-gray-500">{regulation.jurisdiction}</span>
                          </div>
                          <p className="text-sm text-gray-600">{regulation.description}</p>
                        </div>
                        
                        {/* Requirements */}
                        {regulation.requirements && regulation.requirements.length > 0 && (
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h6>
                            <ul className="space-y-1">
                              {regulation.requirements.map((req, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-start">
                                  <span className="text-primary-500 mr-2">•</span>
                                  <span>{req.description} <span className="text-gray-500">({req.frequency})</span></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Penalties */}
                        {regulation.penalties && regulation.penalties.length > 0 && (
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">Penalties:</h6>
                            <ul className="space-y-1">
                              {regulation.penalties.map((penalty, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-start">
                                  <span className="text-red-500 mr-2">⚠</span>
                                  <span>{penalty.type}: ${penalty.amount} - {penalty.description}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Authority */}
                        <div className="text-xs text-gray-500">
                          <strong>Authority:</strong> {regulation.authority}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance History</h3>
                <p className="text-gray-600 mb-4">
                  This business hasn't been checked for compliance yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Business Size</span>
                <span className={`badge ${getSizeColor(business.size)}`}>
                  {business.size}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Employees</span>
                <span className="font-medium">{business.employeeCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-medium">{formatRevenue(business.annualRevenue)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{business.location.city}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Created</p>
                  <p className="text-xs text-gray-500">{formatDate(business.createdAt)}</p>
                </div>
              </div>
              
              {business.updatedAt !== business.createdAt && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">{formatDate(business.updatedAt)}</p>
                  </div>
                </div>
              )}
              
              {complianceHistory.length > 0 && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Compliance Check</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(complianceHistory[0].created_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
