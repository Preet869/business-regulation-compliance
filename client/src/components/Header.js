import React from 'react';
import { Shield, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">
                  Business Regulation Compliance
                </h1>
                <p className="text-sm text-gray-500">
                  Kern County, California
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="https://www.kerncounty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Kern County
            </a>
            <a
              href="https://www.ca.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              California
            </a>
            <a
              href="https://www.usa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Federal
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
