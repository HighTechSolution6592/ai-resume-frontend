import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import PersonalInfoForm from '../components/ui/ResumeForm/PersonalInfoForm';
import { Resume } from '../types';
import { generateResumeDocx } from '../utils/generateResumeDocx';
import { countries } from '../utils/locationData';
import { FileText, Save, Download, Wand2 } from 'lucide-react';
import { improveSummary, improveResponsibility, addResume } from '../utils/axios';
import { formatMonthYear } from '../utils/cn';

// Define a type for the form data that omits backend fields
type ResumeFormData = Omit<Resume, '_id' | 'userId' | 'type' | 'createdAt' | 'updatedAt'>;

const CreateResume: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState<ResumeFormData>({
    title: "",
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      website: '',
      linkedin: '',
    },
    summary: '',
    description: '',
    workExperience: [
      {
        id: crypto.randomUUID(),
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        country: '',
        state: '',
        city: '',
        description: ''
      },
    ],
    education: [
      {
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        country: '',
        state: '',
        city: '',
        gpa: '',
      },
    ],
    skills: [],
    certifications: [
      {
        id: crypto.randomUUID(),
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
      }
    ]
  });

  const [, setState] = useState('');
  const [, setCity] = useState('');

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Work Experience Handlers
  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          id: crypto.randomUUID(),
          companyName: '',
          position: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          country: '',
          state: '',
          city: '',
          description: ''
        },
      ],
    });
  };

  const removeWorkExperience = (index: number) => {
    if (formData.workExperience.length > 1) {
      setFormData({
        ...formData,
        workExperience: formData.workExperience.filter((_, i) => i !== index),
      });
    } else {
      toast.error('You must have at least one work experience entry');
    }
  };

  const handleWorkExperienceChange = (index: number, field: string, value: any) => {
    const updatedExperiences = [...formData.workExperience];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      workExperience: updatedExperiences,
    });
  };

  // Education Handlers
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          id: crypto.randomUUID(),
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          country: '',
          state: '',
          city: '',
          gpa: '',
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData({
        ...formData,
        education: formData.education.filter((_, i) => i !== index),
      });
    } else {
      toast.error('You must have at least one education entry');
    }
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  // Skills Handler
  const handleSkillsChange = (skillsString: string) => {
    setFormData({
      ...formData,
      skills: skillsString.split('\n').map(skill => skill.trim()),
    });
  };

  // Certification Handlers
  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          id: crypto.randomUUID(),
          name: '',
          issuer: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
        },
      ],
    });
  };

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const handleCertificationChange = (index: number, field: string, value: string) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
  };

  const generateResponsibility = async () => {
    setIsGenerating(true);

    try {
      const responsibilityResult = await improveResponsibility(formData.workExperience);
      const updatedWorkExperience = formData.workExperience.map((exp, idx) => ({
        ...exp,
        description: responsibilityResult[idx] || exp.description,
      }));

      setFormData({
        ...formData,
        workExperience: updatedWorkExperience,
      });
      toast.success('Responsibilities generated successfully!');
      setShowPreview(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate responsibilities');
    } finally {
        setIsGenerating(false);
    }
  };

  // Save resume
  const handleSave = async () => {
    try {
      await addResume(formData);
      toast.success('Resume saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  // Generate resume using AI
  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const summaryResult = await improveSummary(formData.summary, formData.description);
      const improvedSummary = summaryResult.replace(/^"(.*)"$/, '$1');
      setFormData({
        ...formData,
        summary: improvedSummary,
      });
      toast.success('Resume generated successfully!');
      setShowPreview(true);
    } catch (error) {
      console.error(error);
      toast.error('Failed to improve summary');
    } finally {
      setIsGenerating(false);
    }
  };

  // Preview component
  const ResumePreview = () => (
    <div className="bg-white p-10 rounded-2xl shadow-md max-w-2xl mx-auto font-serif" id="resume-preview">
      <div className="text-center pb-6 mb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase text-gray-900">{formData.personalInfo.name}</h1>
        <p className="text-lg text-gray-700 mt-1">{formData.title}</p>
        <div className="text-sm text-gray-600 mt-2">
          <p className='mb-2'>
            {formData.personalInfo.phone} • {formData.personalInfo.city}, {formData.personalInfo.country} • {formData.personalInfo.email}
          </p>
          <p>
            {formData.personalInfo.linkedin}
            {formData.personalInfo.linkedin && formData.personalInfo.website && '  •  '}
            {formData.personalInfo.website}
          </p>
        </div>
      </div>
      {formData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b border-black">Professional Summary</h2>
          <p className="text-gray-800 text-sm leading-relaxed">{formData.summary}</p>
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-black">Experience</h2>
        {formData.workExperience.map((exp) => {
          return (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between">
                <h3 className="text-md font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600">{formatMonthYear(exp.startDate)} - {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate || '')}</span>
              </div>
              <p className="italic text-sm text-gray-700">{exp.companyName} - {exp.city}, {exp.country}</p>
              <p className="text-sm text-gray-800 mt-1 leading-relaxed">{exp.description}</p>
            </div>
          );
        })}
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-black">Education</h2>
        {formData.education.map((edu) => {
          return (
            <div key={edu.id} className="mb-5">
              <div className="flex justify-between">
                <h3 className="text-md font-bold text-gray-900">{edu.degree}</h3>
                <span className="text-sm text-gray-600">{formatMonthYear(edu.startDate)} - {edu.isCurrent ? 'Present' : formatMonthYear(edu.endDate || '')}</span>
              </div>
              <p className="italic text-sm text-gray-700">{edu.institution} - {edu.city}, {edu.country}</p>
              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          );
        })}
      </div>
      {formData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b border-black" >Skills</h2>
          <ul className="list-disc list-inside text-sm text-gray-800 columns-2 gap-x-10">
            {formData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
      {formData.certifications && formData.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 border-b border-black">Certifications</h2>
          <ul className="list-disc list-inside text-sm text-gray-800 columns-2 gap-x-30">
            {formData.certifications.map((cert, index) => (
              <li key={index}>{cert.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Render form steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700">
                Resume Title *
              </label>
              <input
                type="text"
                id="resumeTitle"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g., Software Engineer Resume"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                required
              />
            </div>
            <PersonalInfoForm formData={formData} onChange={handleFormChange} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
            
            {formData.workExperience.map((experience, index) => {
              const countryData = countries.find(c => c.code === experience.country);
              const stateOptions = countryData ? [...new Set(countryData.cities.map(c => c.state))] : [];
              const cityOptions = countryData ? countryData.cities.filter(c => c.state === experience.state).map(c => c.name) : [];
              return (
                <div key={experience.id} className="p-4 border border-gray-200 rounded-md bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">
                      Experience #{index + 1}
                    </h4>
                    {formData.workExperience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(index)}
                        className="text-error-600 hover:text-error-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={experience.companyName}
                        onChange={(e) => handleWorkExperienceChange(index, 'companyName', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Position *
                      </label>
                      <input
                        type="text"
                        value={experience.position}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={experience.startDate ? experience.startDate.slice(0, 10) : ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`current-job-${index}`}
                            checked={experience.isCurrent}
                            onChange={(e) => handleWorkExperienceChange(index, 'isCurrent', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`current-job-${index}`} className="ml-2 text-sm text-gray-700">
                            Current Job
                          </label>
                        </div>
                      </div>
                      <input
                        type="date"
                        value={experience.endDate ? experience.endDate.slice(0, 10) : ''}
                        onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                        disabled={experience.isCurrent}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country *
                      </label>
                      <select
                        id="country"
                        value={experience.country}
                        onChange={(e) => {
                          handleWorkExperienceChange(index, 'country', e.target.value)
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
                        value={experience.state}
                        onChange={(e) => {
                          setState(e.target.value);
                          setCity('');
                          handleWorkExperienceChange(index, 'state', e.target.value)
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
                        value={experience.city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          handleWorkExperienceChange(index, 'city', e.target.value);
                        }}
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

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Responsibility *
                      </label>
                      <textarea
                        value={experience.description}
                        onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={addWorkExperience}
                className="mt-2"
              >
                Add Another Work Experience
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Education</h3>
            
            {formData.education.map((edu, index) => {
              const countryData = countries.find(c => c.code === edu.country);
              const stateOptions = countryData ? [...new Set(countryData.cities.map(c => c.state))] : [];
              const cityOptions = countryData ? countryData.cities.filter(c => c.state === edu.state).map(c => c.name) : [];
              return (
                <div key={edu.id} className="p-4 border border-gray-200 rounded-md bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">
                      Education #{index + 1}
                    </h4>
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-error-600 hover:text-error-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Institution *
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Degree *
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={edu.startDate ? edu.startDate.slice(0, 10) : ''}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`current-education-${index}`}
                            checked={edu.isCurrent}
                            onChange={(e) => handleEducationChange(index, 'isCurrent', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`current-education-${index}`} className="ml-2 text-sm text-gray-700">
                            Current Student
                          </label>
                        </div>
                      </div>
                      <input
                        type="date"
                        value={edu.endDate ? edu.endDate.slice(0, 10) : ''}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        disabled={edu.isCurrent}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                      />
                    </div>
                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country *
                      </label>
                      <select
                        id="country"
                        value={edu.country}
                        onChange={(e) => {
                          handleEducationChange(index, 'country', e.target.value)
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
                        value={edu.state}
                        onChange={(e) => {
                          setState(e.target.value);
                          setCity('');
                          handleEducationChange(index, 'state', e.target.value)
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
                        value={edu.city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          handleEducationChange(index, 'city', e.target.value);
                        }}
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
                      <label className="block text-sm font-medium text-gray-700">
                        GPA
                      </label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={addEducation}
                className="mt-2"
              >
                Add Another Education
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Skills</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter one skill per line (e.g.,<br/>JavaScript<br/>React<br/>Machine Learning)
              </p>
              <textarea
                value={formData.skills.join('\n')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                rows={6}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
              
              {formData.certifications.length > 0 ? (
                formData.certifications.map((cert, index) => (
                  <div key={cert.id} className="p-4 border border-gray-200 rounded-md bg-white mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium">
                        Certification #{index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-error-600 hover:text-error-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Certification Name *
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Issuer *
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Issue Date
                        </label>
                        <input
                          type="date"
                          value={cert.issueDate?.slice(0, 10) || ''}
                          onChange={(e) => handleCertificationChange(index, 'issueDate', e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={cert.expiryDate?.slice(0, 10) || ''}
                          onChange={(e) => handleCertificationChange(index, 'expiryDate', e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Credential ID
                        </label>
                        <input
                          type="text"
                          value={cert.credentialId || ''}
                          onChange={(e) => handleCertificationChange(index, 'credentialId', e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic mt-2">No certifications added yet.</p>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={addCertification}
                className="mt-4"
              >
                Add Certification
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Professional Summary</h3>
            <p className="text-sm text-gray-500">
              Write a brief summary of your professional background and career objectives,
              or let our AI generate one for you based on the information you've provided.
            </p>
            <textarea
              value={formData.summary}
              onChange={(e) => handleFormChange('summary', e.target.value)}
              rows={5}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="e.g., Experienced software engineer with 5+ years in full-stack development..."
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Responsibility</h3>
              <p className="text-sm text-gray-500 mt-1">
                Paste the responsibility you're applying for to help our AI tailor your resume.
              </p>
              <textarea
                value={formData.description}
                onChange={(e) =>handleFormChange('description', e.target.value)}
                rows={8}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="Paste the responsibility here..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Navigation buttons
  const renderNavigationButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
          )}
        </div>

        {
          currentStep == 2 && (
            <Button
              type="button"
              variant='outline'
              onClick={generateResponsibility}
              isLoading={isGenerating}
              disabled={isGenerating}
              icon={<Wand2 className="h-4 w-4" />}
            >
              Generate responsibility with AI
            </Button>
          )
        }
        
        <div className="flex gap-3">
          {currentStep < 5 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={generateResume}
                isLoading={isGenerating}
                disabled={isGenerating}
                icon={<Wand2 className="h-4 w-4" />}
              >
                Generate with AI
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Progress bar
  const renderProgressBar = () => {
    const totalSteps = 5;
    const progress = (currentStep / totalSteps) * 100;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white shadow rounded-lg p-6 md:p-8">
            <div className="flex items-center mb-6">
              <FileText className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Create New Resume</h1>
            </div>
            
            {renderProgressBar()}
            
            <form>
              {renderStep()}
              {renderNavigationButtons()}
            </form>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="bg-white shadow rounded-lg overflow-auto max-h-[calc(100vh-8rem)]">
                <ResumePreview />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => generateResumeDocx(formData)}
                  icon={<Download className="h-4 w-4" />}
                >
                  Download
                </Button>
                <Button
                  onClick={handleSave}
                  icon={<Save className="h-4 w-4" />}
                >
                  Save Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateResume;