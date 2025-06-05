import React, { useState, useEffect } from 'react';
import { Resume } from '../../../types';
import { countries, formatLocation } from '../../../utils/locationData';

type ResumeFormData = Omit<Resume, '_id' | 'userId' | 'type' | 'createdAt' | 'updatedAt'>;

interface PersonalInfoFormProps {
  formData: ResumeFormData;
  onChange: (field: string, value: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCity, setSelectedCity] = useState('New York');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange('personalInfo', { ...formData.personalInfo, [name]: value });
  };

  useEffect(() => {
    if (selectedCity && selectedCountry) {
      const formattedLocation = formatLocation(selectedCity, selectedCountry);
      onChange('personalInfo', {
        ...formData.personalInfo,
        location: formattedLocation
      });
    }
  }, [selectedCity, selectedCountry]);

  const selectedCountryData = countries.find(country => country.code === selectedCountry);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.personalInfo.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.personalInfo.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.personalInfo.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country *
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="">Select a city</option>
              {selectedCountryData?.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.personalInfo.linkedin || ''}
            onChange={handleChange}
            placeholder="linkedin.com/in/yourprofile"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Personal Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.personalInfo.website || ''}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;