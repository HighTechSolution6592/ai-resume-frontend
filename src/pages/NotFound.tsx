import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <FileQuestion className="h-24 w-24 text-primary-500 mx-auto" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">Page not found</h1>
        <p className="mt-3 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-10">
          <Link to="/">
            <Button size="lg">
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;