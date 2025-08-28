import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import { businessAPI } from '../services/api';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    industry: '',
    size: '',
    county: '',
    page: 1
  });
  const [pagination, setPagination] = useState({});
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    fetchBusinesses();
    fetchIndustries();
  }, [filters.industry, filters.size, filters.county, filters.page]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await businessAPI.getBusinesses(filters);
      setBusinesses(response.data.businesses);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const response = await businessAPI.getStats();
      if (response.data.topIndustries) {
        setIndustries(response.data.topIndustries);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };



  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

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

  if (loading && businesses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Profiles
            </h1>
            <p className="text-gray-600 text-lg">
              View and manage business profiles and compliance history
            </p>
          </div>

        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Industry Filter */}
          <div className="w-full lg:w-48">
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="select-field"
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry.industry} value={industry.industry}>
                  {industry.industry} ({industry.count})
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="w-full lg:w-48">
            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="select-field"
            >
              <option value="">All Sizes</option>
              <option value="Small">Small (1-50 employees)</option>
              <option value="Medium">Medium (51-250 employees)</option>
              <option value="Large">Large (250+ employees)</option>
            </select>
          </div>

          {/* County Filter */}
          <div className="w-full lg:w-48">
            <select
              value={filters.county}
              onChange={(e) => handleFilterChange('county', e.target.value)}
              className="select-field"
            >
              <option value="">All Counties</option>
              <option value="Kern">Kern County</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(filters.industry || filters.size || filters.county) && (
            <button
              onClick={() => setFilters({ industry: '', size: '', county: '', page: 1 })}
              className="btn-secondary whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {businesses.length} of {pagination.totalCount || 0} businesses
        </p>
      </div>

      {/* Businesses List */}
      <div className="space-y-4">
        {businesses.map((business) => (
          <div key={business.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    <Link 
                      to={`/businesses/${business.id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {business.name}
                    </Link>
                  </h3>
                  <span className={`badge ${getSizeColor(business.size)}`}>
                    {business.size}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Industry:</span>
                    <span className="ml-1">{business.industry}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-1">{business.location.city}, {business.location.county}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Employees:</span>
                    <span className="ml-1">{business.employeeCount}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Revenue:</span>
                    <span className="ml-1">{formatRevenue(business.annualRevenue)}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Added: {formatDate(business.createdAt)}</span>
                  {business.updatedAt !== business.createdAt && (
                    <span className="ml-4">Updated: {formatDate(business.updatedAt)}</span>
                  )}
                </div>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                <Link
                  to={`/businesses/${business.id}`}
                  className="btn-primary text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* No Results */}
      {!loading && businesses.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters to find existing businesses.
          </p>

        </div>
      )}


    </div>
  );
};

export default Businesses;
