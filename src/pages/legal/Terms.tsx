import React from 'react';
import Navbar from '../../components/layout/Navbar';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing and using ResumePilot, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on ResumePilot for personal, non-commercial transitory viewing only.
              </p>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by ResumePilot at any time.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>You must be at least 18 years old to use this service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to accept responsibility for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Service Description</h2>
            <p className="text-gray-600">
              ResumePilot provides tools and services for creating, editing, and managing resumes, CVs, and cover letters. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Some features of ResumePilot require payment. By subscribing to a paid plan, you agree to pay all fees in accordance with the pricing and payment terms presented to you for the service.
              </p>
              <p>
                All fees are exclusive of taxes, which we will charge as applicable. We may change our fees at any time with notice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600">
              The service and its original content, features, and functionality are owned by ResumePilot and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600">
              In no event shall ResumePilot be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date of these terms.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: March 15, 2024
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-600">
              For any questions about these Terms, please contact us at:<br />
              Email: legal@resumepilot.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;