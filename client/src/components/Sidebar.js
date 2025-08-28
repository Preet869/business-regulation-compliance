import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

const Sidebar = ({ navigation }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen flex flex-col">
      <nav className="mt-4 px-4 flex-1">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={clsx(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={clsx(
                    'mr-3 h-5 w-5 transition-colors duration-200',
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Help Section with Phone Number - Moved up */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="p-3 text-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Need Help?</h3>
          <p className="text-xs text-gray-600 mb-2">Contact Kern County Business Services</p>
        </div>
        <div className="px-3 pb-3">
          <div className="bg-white p-2 rounded-lg border-2 border-primary-300 text-center">
            <span className="text-primary-600 font-bold text-base">(661) 868-3000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
