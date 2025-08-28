import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { regulationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const RegulationDetail = () => {
  const { id } = useParams();
  const [regulation, setRegulation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRegulationDetails = useCallback(async () => {
    try {
      const response = await regulationsAPI.getRegulation(id);
      setRegulation(response.data);
    } catch (error) {
      console.error('Error fetching regulation details:', error);
      toast.error('Failed to fetch regulation details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRegulationDetails();
  }, [fetchRegulationDetails]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Health & Safety': return 'badge-danger';
      case 'Environmental': return 'badge-warning';
      case 'Labor & Employment': return 'badge-primary';
      case 'Taxation': return 'badge-success';
      case 'Workplace Safety': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getJurisdictionIcon = (jurisdiction) => {
    switch (jurisdiction) {
      case 'Federal': return '🇺🇸';
      case 'California': return '🌉';
      case 'Kern County': return '🏛️';
      case 'Bakersfield': return '🏙️';
      default: return '📍';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!regulation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Regulation Not Found</h2>
        <p className="text-gray-600 mb-6">The regulation you're looking for doesn't exist.</p>
        <Link to="/regulations" className="btn-primary">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Regulations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/regulations" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Regulations
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {regulation.title}
              </h1>
              <span className={`badge ${getCategoryColor(regulation.category)}`}>
                {regulation.category}
              </span>
            </div>
            <p className="text-gray-600 text-lg max-w-4xl">
              {regulation.description}
            </p>
          </div>
          

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Regulation Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                <span className={`badge ${getCategoryColor(regulation.category)}`}>
                  {regulation.category}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Jurisdiction</label>
                <div className="flex items-center">
                  <span className="mr-2">{getJurisdictionIcon(regulation.jurisdiction)}</span>
                  <span className="text-gray-900">{regulation.jurisdiction}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Authority</label>
                <p className="text-gray-900">{regulation.authority}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Effective Date</label>
                <p className="text-gray-900">{formatDate(regulation.effectiveDate)}</p>
              </div>
              
              {regulation.complianceDeadline && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Compliance Deadline</label>
                  <p className="text-gray-900 font-medium">{formatDate(regulation.complianceDeadline)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          {regulation.requirements && regulation.requirements.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Compliance Requirements</h2>
                <p className="card-subtitle">
                  What you need to do to comply with this regulation
                </p>
              </div>
              <div className="space-y-4">
                {regulation.requirements.map((requirement, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-2">
                          {requirement.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Frequency:</span> {requirement.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Documentation:</span> {requirement.documentation}
                          </div>
                          {requirement.deadline && (
                            <div className="md:col-span-2">
                              <span className="font-medium">Deadline:</span> {requirement.deadline}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Penalties */}
          {regulation.penalties && regulation.penalties.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Penalties for Non-Compliance</h2>
                <p className="card-subtitle">
                  Consequences of failing to comply with this regulation
                </p>
              </div>
              <div className="space-y-4">
                {regulation.penalties.map((penalty, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-warning-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-900">{penalty.type}</span>
                          {penalty.amount > 0 && (
                            <span className="text-lg font-bold text-danger-600">
                              ${penalty.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{penalty.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exemptions */}
          {regulation.exemptions && regulation.exemptions.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Exemptions</h2>
                <p className="card-subtitle">
                  Situations where this regulation may not apply
                </p>
              </div>
              <div className="space-y-3">
                {regulation.exemptions.map((exemption, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2 mr-3"></div>
                    <p className="text-gray-700">{exemption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applicability */}
          {regulation.appliesTo && regulation.appliesTo.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Who This Applies To</h2>
              </div>
              <div className="space-y-3">
                {regulation.appliesTo.map((applies, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
                    <p className="text-gray-700">{applies}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Info</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className={`badge ${getCategoryColor(regulation.category)}`}>
                  {regulation.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Jurisdiction</span>
                <div className="flex items-center">
                  <span className="mr-1">{getJurisdictionIcon(regulation.jurisdiction)}</span>
                  <span className="font-medium">{regulation.jurisdiction}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Effective Date</span>
                <span className="font-medium">{formatDate(regulation.effectiveDate)}</span>
              </div>
              
              {regulation.complianceDeadline && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Deadline</span>
                  <span className="font-medium text-warning-600">
                    {formatDate(regulation.complianceDeadline)}
                  </span>
                </div>
              )}
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
                  <p className="text-sm font-medium text-gray-900">Regulation Effective</p>
                  <p className="text-xs text-gray-500">{formatDate(regulation.effectiveDate)}</p>
                </div>
              </div>
              
              {regulation.complianceDeadline && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Compliance Deadline</p>
                    <p className="text-xs text-gray-500">{formatDate(regulation.complianceDeadline)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>



          {/* Related Links */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Related Links</h3>
            </div>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.kerncounty.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary-600 hover:text-primary-700"
              >
                Kern County Government
              </a>
              <a
                href="https://www.ca.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary-600 hover:text-primary-700"
              >
                California State Government
              </a>
              <a
                href="https://www.usa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary-600 hover:text-primary-700"
              >
                Federal Government
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationDetail;
