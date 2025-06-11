import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      // Error is already handled by AuthContext with toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsEmailSent(false);
    setEmail('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FileText className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!isEmailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4"
                >
                  {isLoading ? 'Sending Instructions...' : 'Send Reset Instructions'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Check your email</h3>
              <p className="mt-2 text-sm text-gray-500">
                We've sent password reset instructions to {email}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={handleTryAgain}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;