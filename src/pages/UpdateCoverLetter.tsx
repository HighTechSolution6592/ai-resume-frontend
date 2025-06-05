import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import { FileText, Wand2, Download } from 'lucide-react';
import { generateCoverLetter as generateCoverLetterApi, updateCoverLetter } from '../utils/axios';
import { CoverLetter } from '../types';
import { useParams } from 'react-router-dom';
import { getCoverLetter } from '../utils/axios';
import { generateCoverLetterDocx } from '../utils/generateCoverLetterDocx';

const UpdateCoverLetter: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>();
  const [showPreview, setShowPreview] = useState(true);
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState({
    recipientName: 'David Ken',
    companyName: 'Google',
    jobTitle: 'Senior software developer',
    description: 'I want to work at Google as a senior software developer. I have 5 years of experience in software development, specializing in web applications.',
    experience: '5 years of experience in software development, specializing in web applications. I have worked with various technologies including React, Node.js, and Python.',
    customization: 'emphasize my experience with React and Node.js, and how it aligns with the job requirements.',
    writingTone: 'professional', // professional, friendly, confident
    applicantName: 'Roman',
  });

  useEffect(() => {
    // If an ID is provided, fetch the existing resume data
    if (id) {
    const fetchResume = async () => {
        try {
        const response = await getCoverLetter(id);
        setFormData(response);
        setGeneratedContent(response.content);
        } catch (error) {
        toast.error('Failed to fetch resume data');
        }
    };
    fetchResume();
    }
}, []);

  const generateCoverLetter = async () => {
      setIsGenerating(true);
  
      try {
        // const response = await addResume(formData, resumeTitle, jobDescription);
        const result = await generateCoverLetterApi(formData);
        setGeneratedContent(result);
        toast.success('Cover letter generated successfully!');
        setShowPreview(true);
      } catch (error) {
        console.error(error);
        toast.error('Failed to generate cover letter.');
      } finally {
          setIsGenerating(false);
      }
      
  };

  const handleSave = async () => {
    try {
        if (!id) {
          toast.error('Resume ID is missing');
          return;
        }
        await updateCoverLetter(id, formData, generatedContent);
        toast.success('Resume Updated successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to save resume');
      }
    
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Cover Letter</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
                    Recipient's Name
                  </label>
                  <input
                    type="text"
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="e.g., Mr. John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="e.g., Acme Corporation"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Paste the job description to help our AI tailor your cover letter.
                  </p>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="Paste the job description here..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="relevantExperience" className="block text-sm font-medium text-gray-700">
                    Relevant Experience
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Describe your relevant experience and achievements for this role.
                  </p>
                  <textarea
                    id="relevantExperience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="e.g., 5 years of experience in software development, led team of 6 developers..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Applicant Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="e.g., Acme Corporation"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                    Writing Tone
                  </label>
                  <select
                    id="tone"
                    value={formData.writingTone}
                    onChange={(e) => setFormData({ ...formData, writingTone: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="confident">Confident</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customization" className="block text-sm font-medium text-gray-700">
                    Additional Customization
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Any specific points you'd like to emphasize or include?
                  </p>
                  <textarea
                    id="customization"
                    value={formData.customization}
                    onChange={(e) => setFormData({ ...formData, customization: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="e.g., Emphasize leadership skills, mention specific project..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={generateCoverLetter}
                    isLoading={isGenerating}
                    disabled={isGenerating}
                    icon={<Wand2 className="h-4 w-4" />}
                  >
                    Generate with AI
                  </Button>
                </div>
              </form>
            </div>

            {/* Preview Section */}
            <div className="border-t pt-6 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Cover Letter</h2>
              {generatedContent ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                    {generatedContent}
                  </pre>
                  <div className="mt-4 flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => generateCoverLetterDocx(generatedContent)}
                      icon={<Download className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => { handleSave(); }}
                    >
                      Save Cover Letter
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Fill out the form and click "Generate with AI" to create your cover letter
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateCoverLetter;