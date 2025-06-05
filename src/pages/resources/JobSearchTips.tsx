import React from 'react';
import Navbar from '../../components/layout/Navbar';

const JobSearchTips: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Search Tips</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Optimize Your Job Search</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Use industry-specific job boards
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Set up job alerts
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Follow companies on LinkedIn
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Network with industry professionals
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Strategy</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Tailor your resume for each role
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Write compelling cover letters
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Follow up on applications
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Track your applications
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Branding</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Update your LinkedIn profile
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Create an online portfolio
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Engage in professional communities
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">✓</span>
                Share industry insights
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSearchTips;