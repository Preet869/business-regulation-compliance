import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Building2 } from 'lucide-react';
import { businessAPI, regulationsAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [businessStats, regulationStats] = await Promise.all([
          businessAPI.getStats(),
          regulationsAPI.getRegulations()
        ]);
        
        // Extract the data we need from the API responses
        const businessData = businessStats.data; // businessStats.data contains the actual response
        const regulationData = regulationStats.data; // regulationStats.data contains the actual response
        
        console.log('Dashboard - Business Stats:', businessData);
        console.log('Dashboard - Regulation Stats:', regulationData);
        
        // Create stats object with the actual API response structure
        setStats({
          business: businessData || { overview: { total_businesses: 0 } }, // This already has the overview, topIndustries, topLocations
          regulation: {
            overview: {
              total_regulations: regulationData?.regulations?.length || 0,
              total_categories: new Set((regulationData?.regulations || []).map(r => r.category || 'Unknown')).size,
              total_jurisdictions: new Set((regulationData?.regulations || []).map(r => r.jurisdiction || 'Unknown')).size
            }
          }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats on error to prevent crashes
        setStats({
          business: { overview: { total_businesses: 0 } },
          regulation: { overview: { total_regulations: 0, total_categories: 0, total_jurisdictions: 0 } }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Check Compliance',
      description: 'Enter business details to determine applicable regulations',
      icon: Shield,
      href: '/compliance',
      color: 'bg-primary-500',
      textColor: 'text-primary-500'
    },
    {
      title: 'Browse Regulations',
      description: 'Search and explore regulations by category or jurisdiction',
      icon: FileText,
      href: '/regulations',
      color: 'bg-success-500',
      textColor: 'text-success-500'
    },
    {
      title: 'Manage Businesses',
      description: 'View and manage business profiles and compliance history',
      icon: Building2,
      href: '/businesses',
      color: 'bg-warning-500',
      textColor: 'text-warning-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto max-h-full">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Welcome to Business Regulation Compliance
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Navigate the complex world of business regulations with confidence. 
          Our comprehensive system helps you understand what rules apply to your business 
          and what you need to do to comply.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="card hover:shadow-lg transition-shadow duration-200 group p-6"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${action.color} mr-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {action.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
