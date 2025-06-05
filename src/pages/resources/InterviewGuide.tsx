import React from 'react';
import Navbar from '../../components/layout/Navbar';

const InterviewGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Interview Guide</h1>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Before the Interview</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">1</span>
                Research the company thoroughly
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">2</span>
                Review common interview questions
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">3</span>
                Prepare your STAR stories
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">4</span>
                Choose appropriate attire
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">During the Interview</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">1</span>
                Make a strong first impression
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">2</span>
                Use the STAR method for responses
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">3</span>
                Ask thoughtful questions
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">4</span>
                Show enthusiasm and interest
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Interview Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Behavioral Questions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Tell me about a time you faced a challenge at work</li>
                <li>• Describe a project you're proud of</li>
                <li>• How do you handle conflict with coworkers?</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Technical Questions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• What programming languages do you know?</li>
                <li>• Describe your development process</li>
                <li>• How do you stay updated with technology?</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewGuide;