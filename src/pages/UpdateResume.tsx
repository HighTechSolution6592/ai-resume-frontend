import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import PersonalInfoForm from '../components/ui/ResumeForm/PersonalInfoForm';
import { Resume } from '../types';
import { useParams } from 'react-router-dom';
import { generateResumeDocx } from '../utils/generateResumeDocx';
type ResumeFormData = Omit<Resume, '_id' | 'userId' | 'type' | 'createdAt' | 'updatedAt'>;
import { FileText, Save, Download, Wand2 } from 'lucide-react';
import { improveSummary, updateResume, getResume } from '../utils/axios';
import { formatMonthYear } from '../utils/cn';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { saveAs } from 'file-saver';
// import { generateResumePdf } from '../utils/generatePdf';

const UpdateResume: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ResumeFormData>({
    title: "",
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
    },
    summary: 'I have 5 years of experience in software development, specializing in full-stack web applications. I am proficient in JavaScript, React, Node.js, and have a strong background in Agile methodologies.',
    description: 'I hope to be hired in software dev team of Sysmic',
    workExperience: [
      {
        id: crypto.randomUUID(),
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        location: '',
        description: ''
        // achievements: [''],
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
        location: '',
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

  useEffect(() => {
    // If an ID is provided, fetch the existing resume data
    if (id) {
      const fetchResume = async () => {
        try {
          const response = await getResume(id);
          setFormData(response);
        } catch (error) {
          toast.error('Failed to fetch resume data');
        }
      };
      fetchResume();
    }
  }, []);

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
          location: '',
          description: '',
          // achievements: [''],
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
          location: '',
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

  // Update resume
  const handleUpdate = async () => {
    try {
      if (!id) {
        toast.error('Resume ID is missing');
        return;
      }
      await updateResume(id, formData);
      toast.success('Resume Updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  // // Download resume
  // const handleDownload = async (type: string) => {
  //   const resumeElement = document.querySelector('#resume-preview') as HTMLElement;

  //   if (!resumeElement) return;

  //   if (type === 'pdf') {
  //     const canvas = await html2canvas(resumeElement, {
  //       scale: 2,
  //       useCORS: true
  //     });
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save('resume.pdf');
  //   } else if (type === 'doc') {
  //     const html = `<!DOCTYPE html>
  //       <html>
  //       <head>
  //         <meta charset="UTF-8">
  //         <style>
  //           body { font-family: serif; padding: 2rem; }
  //         </style>
  //       </head>
  //       <body>
  //         ${resumeElement.innerHTML}
  //       </body>
  //       </html>`;

  //     const blob = new Blob([html], {
  //       type: 'application/msword'
  //     });

  //     saveAs(blob, 'resume.doc');
  //   }
  // };

  // Generate resume using AI
  const generateResume = async () => {
    setIsGenerating(true);

    try {
      // const response = await addResume(formData, resumeTitle, jobDescription);
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
          <p className='mb-2'>{formData.personalInfo.phone}  •  {formData.personalInfo.location}  •  {formData.personalInfo.email}</p>
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
        {formData.workExperience.map((exp) => (
          <div key={exp.id} className="mb-5">
            <div className="flex justify-between">
              <h3 className="text-md font-bold text-gray-900">{exp.position}</h3>
              <span className="text-sm text-gray-600">{formatMonthYear(exp.startDate)} - {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate || '')}</span>
            </div>
            <p className="italic text-sm text-gray-700">{exp.companyName} - {exp.location}</p>
            <p className="text-sm text-gray-800 mt-1 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-black">Education</h2>
        {formData.education.map((edu) => (
          <div key={edu.id} className="mb-5">
            <div className="flex justify-between">
              <h3 className="text-md font-bold text-gray-900">{edu.degree}</h3>
              <span className="text-sm text-gray-600">{formatMonthYear(edu.startDate)} - {edu.isCurrent ? 'Present' : formatMonthYear(edu.endDate || '')}</span>
            </div>
            <p className="italic text-sm text-gray-700">{edu.institution} - {edu.location}</p>
            {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
          </div>
        ))}
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
            
            {formData.workExperience.map((experience, index) => (
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
                      value={experience.startDate}
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
                      value={experience.endDate || ''}
                      onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                      disabled={experience.isCurrent}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      value={experience.location || ''}
                      onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                      placeholder="City, State"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Job Description *
                    </label>
                    <textarea
                      value={experience.description}
                      onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  {/* <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Key Achievements
                    </label>
                    <p className="text-sm text-gray-500">Enter one achievement per line</p>
                    <textarea
                      value={experience.achievements.join('\n')}
                      onChange={(e) => {
                        const achievements = e.target.value.split('\n').filter(item => item.trim() !== '');
                        handleWorkExperienceChange(index, 'achievements', achievements.length ? achievements : ['']);
                      }}
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    />
                  </div> */}
                </div>
              </div>
            ))}
            
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
            
            {formData.education.map((edu, index) => (
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
                      value={edu.startDate}
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
                      value={edu.endDate || ''}
                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                      disabled={edu.isCurrent}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      value={edu.location || ''}
                      onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                      placeholder="City, State"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    />
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
            ))}
            
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
                placeholder="e.g.\nJavaScript\nReact\nMachine Learning"
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
                          value={cert.issueDate || ''}
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
                          value={cert.expiryDate || ''}
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
              <h3 className="text-lg font-medium text-gray-900">Job Description</h3>
              <p className="text-sm text-gray-500 mt-1">
                Paste the job description you're applying for to help our AI tailor your resume.
              </p>
              <textarea
                value={formData.description}
                onChange={(e) =>handleFormChange('description', e.target.value)}
                rows={8}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="Paste the job description here..."
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
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
                {/* <Button
                  variant="outline"
                  onClick={() => generateResumePdf(formData)}
                  icon={<Download className="h-4 w-4" />}
                >
                  Download PDF
                </Button> */}
                <Button
                  onClick={handleUpdate}
                  icon={<Save className="h-4 w-4" />}
                >
                  Update Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UpdateResume;
