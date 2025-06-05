import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { File, FileText, Plus, Edit, Download, Trash2, Search, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
// import { mockResumes } from '../utils/mockData';
import { toast } from 'sonner';
import { Resume, CoverLetter } from '../types';
import { getAllResume, getAllCoverLetter, deleteResume, deleteCoverLetter } from '../utils/axios'; // Adjust the import based on your API structure

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Resume[] | CoverLetter[]>();
  const [searchQuery] = useState('');
  const [filter, setFilter] = useState<'resume' | 'coverLetter'>('resume');
  const navigate = useNavigate();

  // const handleDownloadPDF = (doc: Resume) => {
  //   toast.success(`Downloaded ${doc.title} as PDF`);
  // };

  const filteredDocuments = (documents ?? []).filter(doc => {
    let matchesSearch = false;
    if (doc.type === 'resume' && 'title' in doc && typeof doc.title === 'string') {
      matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (doc.type === 'coverLetter') {
      const company = 'companyName' in doc && typeof doc.companyName === 'string' ? doc.companyName : '';
      const job = 'jobTitle' in doc && typeof doc.jobTitle === 'string' ? doc.jobTitle : '';
      matchesSearch =
        company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.toLowerCase().includes(searchQuery.toLowerCase());
    }
    const matchesFilter = doc.type === filter;
    return matchesSearch && matchesFilter;
  });

  useEffect (() => {

    const fetchDocuments = async () => {
      if (filter === 'resume') {
        const result = await getAllResume();
        setDocuments(result);
        return;
      } else {
        const result = await getAllCoverLetter();
        setDocuments(result);
        return;
      }
    };

    fetchDocuments();
  
  }, [filter])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />  
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            <p className="mt-1 text-gray-500">
              Manage your resumes and cover letters in one place.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Link to="/create-resume">
              <Button icon={<FileText className="h-4 w-4" />} onClick={() => setFilter('resume')}>
                Create Resume
              </Button>
            </Link>
            <Link to="/create-cover-letter">
              <Button variant="secondary" icon={<FileCheck className="h-4 w-4" />} onClick={() => setFilter('coverLetter')}>
                Create Cover Letter
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row mb-6 gap-4">
          {/* <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
          <div className="flex gap-2">
            {/* <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button> */}
            <Button
              variant={filter === 'resume' ? 'primary' : 'outline'}
              onClick={() => setFilter('resume')}
            >
              Resumes
            </Button>
            <Button
              variant={filter === 'coverLetter' ? 'primary' : 'outline'}
              onClick={() => setFilter('coverLetter')}
            >
              Cover Letters
            </Button>
          </div>
        </div>

        {/* Document List */}
        {filteredDocuments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc, index) => (
              <DocumentCard
                key={index}
                document={doc}
                onEdit={() => navigate(doc.type === 'resume' ? `/update-resume/${doc._id}` : `/update-coverLetter/${doc._id}`)}
                // onDelete={() => {}}
                // onDownloadPDF={() => handleDownloadPDF(doc)}
                // onDownloadDOCX={() => handleDownloadDOCX(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery ? 'No documents match your search query.' : 'Get started by creating your first document.'}
            </p>
            {/* {!searchQuery && (
              <div className="mt-6 flex justify-center gap-4">
                <Link to="/create-resume">
                  <Button icon={<FileText className="h-4 w-4" />}>
                    Create Resume
                  </Button>
                </Link>
                <Link to="/create-cover-letter">
                  <Button variant="secondary" icon={<FileCheck className="h-4 w-4" />}>
                    Create Cover Letter
                  </Button>
                </Link>
              </div>
            )} */}
          </div>
        )}
      </main>
    </div>
  );
};

const DocumentCard: React.FC<{
  document: Resume | CoverLetter;
  onEdit: () => void;
  // onDelete: () => void;
  // onDownloadPDF: () => void;
  // onDownloadDOCX: () => void;
}> = ({ document, onEdit }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isResume = document.type === 'resume';

    const handleDelete = async (id: string, type: string) => {
    if (!document) return;
    if (type === 'resume') {
      try {
        await deleteResume(id); // Assuming deleteResume is defined in your axios utils
        toast.success('Resume deleted successfully');
        window.location.reload();
        setShowDropdown(false);
      } catch (error) {
        console.error("Error deleting resume:", error);
        toast.error('Failed to delete resume');
        return;
      }
      
    } else if (type === 'coverLetter') {
      try {
        await deleteCoverLetter(id); // Assuming deleteResume is defined in your axios utils
        toast.success('Cover letter deleted successfully');
        setShowDropdown(false);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting resume:", error);
        toast.error('Failed to delete resume');
        return;
      }
      setShowDropdown(false);
      toast.success('Cover Letter deleted successfully');
    }
    
  };

  // const content = document.content as any;

  return (
    <motion.div
      className={`bg-white shadow-sm rounded-lg border overflow-hidden hover:shadow-md transition-shadow flex flex-col ${
        isResume ? 'border-primary-200' : 'border-secondary-200'
      }`}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`rounded-md p-2 ${
              isResume ? 'bg-primary-100' : 'bg-secondary-100'
            }`}>
              {isResume ? (
                <FileText className={`h-6 w-6 ${
                  isResume ? 'text-primary-600' : 'text-secondary-600'
                }`} />
              ) : (
                <FileCheck className="h-6 w-6 text-secondary-600" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 truncate max-w-[200px]">
                {isResume
                  ? (document as Resume).title
                  : ((document as CoverLetter).companyName || (document as CoverLetter).jobTitle || 'Cover Letter')}
              </h3>
              <p className="text-sm text-gray-500">
                Updated {formatDate(document.updatedAt)}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {/* <button
                    onClick={() => {
                      onDownloadPDF();
                      setShowDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
                  </button>
                  <button
                    onClick={() => {
                      onDownloadDOCX();
                      setShowDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download as DOCX
                  </button> */}
                  <button
                    onClick={() => {  handleDelete(document._id, document.type); }}
                    className="flex items-center px-4 py-2 text-sm text-error-600 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          {isResume ? (
            <>
              <h4 className="text-sm font-medium text-gray-700">Position</h4>
              <p className="text-sm text-gray-600">
                {(Array.isArray(document.workExperience) && document.workExperience[0]?.position) || 'Not specified'}
              </p>
              
              <h4 className="mt-3 text-sm font-medium text-gray-700">Skills</h4>
              <div className="mt-1 flex flex-wrap gap-1">
                {Array.isArray(document.skills) && document.skills.slice(0, 3).map((skill: string, index: number) => (
    <span
      key={index}
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
    >
      {skill}
    </span>
  ))}
  {Array.isArray(document.skills) && document.skills.length > 3 && (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      +{document.skills.length - 3} more
    </span>
  )}
              </div>
            </>
          ) : (
            <>
              <h4 className="text-sm font-medium text-gray-700">Company</h4>
              <p className="text-sm text-gray-600">{document.companyName}</p>
              
              <h4 className="mt-3 text-sm font-medium text-gray-700">Position</h4>
              <p className="text-sm text-gray-600">{document.jobTitle}</p>
            </>
          )}
        </div>
      </div>
      
      <div className={`px-6 py-4 border-t mt-auto ${
        isResume ? 'bg-primary-50 border-primary-100' : 'bg-secondary-50 border-secondary-100'
      }`}>
        <button
          onClick={onEdit}
          className={`inline-flex items-center text-sm font-medium ${
            isResume ? 'text-primary-600 hover:text-primary-500' : 'text-secondary-600 hover:text-secondary-500'
          }`}
        >
          <Edit className="mr-1.5 h-4 w-4" />
          Edit {isResume ? 'Resume' : 'Cover Letter'}
        </button>
      </div>
    </motion.div>
  );
};

export default Dashboard;