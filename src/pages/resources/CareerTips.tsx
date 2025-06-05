import React from 'react';
import Navbar from '../../components/layout/Navbar';

const CareerTips: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Career Tips</h1>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Career growth"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Building Your Personal Brand</h2>
              <p className="text-gray-600 mb-4">Learn how to create and maintain a strong personal brand that sets you apart in your industry.</p>
              {/* <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Read more →</a> */}
            </div>
          </article>

          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Networking"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Networking Strategies</h2>
              <p className="text-gray-600 mb-4">Discover effective networking techniques to build meaningful professional relationships.</p>
              {/* <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Read more →</a> */}
            </div>
          </article>

          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Skill development"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Skill Development</h2>
              <p className="text-gray-600 mb-4">Stay competitive by learning which skills are in demand and how to acquire them.</p>
              {/* <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Read more →</a> */}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default CareerTips;