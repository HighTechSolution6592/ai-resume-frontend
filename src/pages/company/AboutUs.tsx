import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { FileText } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About ResumePilot</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to help job seekers create professional, ATS-friendly resumes that get them noticed by employers.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2023, ResumePilot was born from a simple observation: creating a professional resume shouldn't be complicated. Our team of career experts and technologists came together to build a platform that makes resume creation intuitive and effective.
            </p>
            <p className="text-gray-600">
              Today, we help thousands of job seekers create winning resumes, cover letters, and CVs that showcase their unique value to potential employers.
            </p>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Team collaboration"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform with the latest technology and best practices.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Focus</h3>
              <p className="text-gray-600">
                Every feature we build is designed with our users' success in mind.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                We maintain the highest standards in everything we do.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Join Our Team</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for helping people succeed in their careers.
          </p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
            Go to home
          </a>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;