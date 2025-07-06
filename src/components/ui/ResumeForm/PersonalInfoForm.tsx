import React from 'react';
import { Resume } from '../../../types';
import { countries } from '../../../utils/locationData';

type ResumeFormData = Omit<Resume, '_id' | 'userId' | 'type' | 'createdAt' | 'updatedAt'>;

interface PersonalInfoFormProps {
  formData: ResumeFormData;
  onChange: (field: string, value: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, onChange }) => {
  // Use only formData.personalInfo for values and updates
  const country = formData.personalInfo.country || '';
  const state = formData.personalInfo.state || '';
  const city = formData.personalInfo.city || '';

  const countryData = countries.find(c => c.code === country);
  const stateOptions = countryData
    ? [...new Set(countryData.cities.map(c => c.state))]
    : [];

  const cityOptions = countryData
    ? countryData.cities.filter(c => c.state === state).map(c => c.name)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange('personalInfo', { ...formData.personalInfo, [name]: value });
  };

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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
          />
        </div>
        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country *
          </label>
          <select
            id="country"
            value={country}
            onChange={e => {
              onChange('personalInfo', {
                ...formData.personalInfo,
                country: e.target.value,
                state: '',
                city: ''
              });
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
          >
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State/Province *
          </label>
          <select
            id="state"
            value={state}
            onChange={e => {
              onChange('personalInfo', {
                ...formData.personalInfo,
                state: e.target.value,
                city: ''
              });
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            disabled={!stateOptions.length}
          >
            <option value="">Select a state</option>
            {stateOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <select
            id="city"
            value={city}
            onChange={e => onChange('personalInfo', { ...formData.personalInfo, city: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
            disabled={!cityOptions.length}
          >
            <option value="">Select a city</option>
            {cityOptions.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
