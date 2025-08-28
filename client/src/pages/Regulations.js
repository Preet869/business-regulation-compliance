import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Calendar, Building, AlertTriangle } from 'lucide-react';
import { regulationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Regulations = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    jurisdiction: '',
    search: '',
    page: 1
  });
  const [pagination, setPagination] = useState({});

  const fetchCategories = async () => {
    try {
      const response = await regulationsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchJurisdictions = async () => {
    try {
      const response = await regulationsAPI.getJurisdictions();
      setJurisdictions(response.data);
    } catch (error) {
      console.error('Error fetching jurisdictions:', error);
    }
  };

  const fetchRegulations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await regulationsAPI.getRegulations(filters);
      setRegulations(response.data.regulations);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching regulations:', error);
      toast.error('Failed to fetch regulations');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
    fetchJurisdictions();
  }, []);

  useEffect(() => {
    fetchRegulations();
  }, [filters.category, filters.jurisdiction, filters.search, filters.page, fetchRegulations]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRegulations();
  };

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

  if (loading && regulations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Business Regulations
        </h1>
        <p className="text-gray-600 text-lg">
          Browse and search through regulations that may apply to your business
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search regulations by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </form>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="select-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Jurisdiction Filter */}
          <div className="w-full lg:w-48">
            <select
              value={filters.jurisdiction}
              onChange={(e) => handleFilterChange('jurisdiction', e.target.value)}
              className="select-field"
            >
              <option value="">All Jurisdictions</option>
              {jurisdictions.map((jur) => (
                <option key={jur.jurisdiction} value={jur.jurisdiction}>
                  {jur.jurisdiction} ({jur.count})
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(filters.category || filters.jurisdiction || filters.search) && (
            <button
              onClick={() => setFilters({ category: '', jurisdiction: '', search: '', page: 1 })}
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
          Showing {regulations.length} of {pagination.totalCount || 0} regulations
        </p>
      </div>

      {/* Regulations List */}
      <div className="space-y-4">
        {regulations.map((regulation) => (
          <div key={regulation.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link 
                      to={`/regulations/${regulation.id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {regulation.title}
                    </Link>
                  </h3>
                  <span className={`badge ${getCategoryColor(regulation.category)}`}>
                    {regulation.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {regulation.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">{getJurisdictionIcon(regulation.jurisdiction)}</span>
                    {regulation.jurisdiction}
                  </div>
                  
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {regulation.authority}
                  </div>
                  
                  {regulation.effectiveDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Effective: {new Date(regulation.effectiveDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  {regulation.complianceDeadline && (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Deadline: {new Date(regulation.complianceDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                <Link
                  to={`/regulations/${regulation.id}`}
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
      {!loading && regulations.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No regulations found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find relevant regulations.
          </p>
        </div>
      )}
    </div>
  );
};

export default Regulations;
