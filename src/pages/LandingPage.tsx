import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { FileText, FileCheck, CheckCircle, BarChart, Github, Linkedin, Facebook, Calendar, PenTool } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ResumePilot</span>
            </div>
            {/* <nav className="hidden md:flex space-x-8">
              <Link to="/resumes" className="text-gray-600 hover:text-gray-900">Resumes</Link>
              <Link to="/cover-letters" className="text-gray-600 hover:text-gray-900">Cover Letters</Link>
              <Link to="/cvs" className="text-gray-600 hover:text-gray-900">CVs</Link>
              <Link to="/resources" className="text-gray-600 hover:text-gray-900">Resources</Link>
            </nav> */}
            <div>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="mr-4">
                    <Button 
                      variant="outline" 
                      size="md"
                      className="border-white text-primary-700 hover:bg-white/10"
                    >Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
                
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 space-y-6">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Optimize Your Resume <br />
                with <span className="text-yellow-300">AI-Powered</span><br/>Intelligence
              </motion.h1>
              <motion.p 
                className="text-xl text-white/90 max-w-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Creating job-winning resumes that perfectly match your target posotions using our advanced AI assistant.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link to="/login">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary-600 hover:bg-gray-100"
                  >
                    Start Optimizing
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    <Link to="/about" className="text-white hover:text-white">About Us</Link>
                  </Button>
                </a>
              </motion.div>
            </div>
            <motion.div 
              className="mt-10 lg:mt-0 lg:w-1/2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <img 
                src="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Resume optimization illustration" 
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose ResumePilot?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform helps you create professional documents that stand out.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={<PenTool className="h-8 w-8 text-primary-600" />}
              title="AI-Powered Writing"
              description="Our advanced AI helps you write compelling content tailored to your industry and role."
            />
            <FeatureCard 
              icon={<CheckCircle className="h-8 w-8 text-primary-600" />}
              title="ATS-Friendly Templates"
              description="Our templates are designed to pass Applicant Tracking Systems with flying colors."
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-primary-600" />}
              title="Quick & Easy"
              description="Create professional documents in minutes with our streamlined process."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-primary-400" />
                <span className="ml-2 text-lg font-bold">ResumePilot</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Your trusted partner in career advancement.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Products</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/resumes" className="text-gray-400 hover:text-white">Resumes</Link></li>
                <li><Link to="/cover-letters" className="text-gray-400 hover:text-white">Cover Letters</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/resources/career-tips" className="text-gray-400 hover:text-white">Career Tips</Link></li>
                <li><Link to="/resources/interview-guide" className="text-gray-400 hover:text-white">Interview Guide</Link></li>
                <li><Link to="/resources/job-search-tips" className="text-gray-400 hover:text-white">Job Search Tips</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} ResumePilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div 
    className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
  >
    <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default LandingPage;