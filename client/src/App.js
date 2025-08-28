import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Shield, Building2, FileText, Home } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ComplianceChecker from './pages/ComplianceChecker';
import Regulations from './pages/Regulations';
import Businesses from './pages/Businesses';
import BusinessDetail from './pages/BusinessDetail';
import RegulationDetail from './pages/RegulationDetail';


const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Compliance Checker', href: '/compliance', icon: Shield },
  { name: 'Regulations', href: '/regulations', icon: FileText },
  { name: 'Businesses', href: '/businesses', icon: Building2 },

];

function App() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar navigation={navigation} />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compliance" element={<ComplianceChecker />} />
            <Route path="/regulations" element={<Regulations />} />
            <Route path="/regulations/:id" element={<RegulationDetail />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/businesses/:id" element={<BusinessDetail />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
