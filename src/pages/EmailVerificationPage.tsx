import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { authAPI } from '../utils/api';
import { toast } from 'sonner';
import Button from '../components/ui/Button';

const EmailVerificationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const location = useLocation();  const [isVerifying, setIsVerifying] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  // Get email from navigation state (when coming from signup)
  const stateEmail = location.state?.email;
  const fromSignup = location.state?.fromSignup;
  const fromProtectedRoute = location.state?.fromProtectedRoute;
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else if (!fromSignup && !fromProtectedRoute) {
      setError('Invalid verification link');
      setIsVerifying(false);
    } else {
      // Coming from signup or protected route, just show instructions
      setIsVerifying(false);
    }
  }, [token, fromSignup, fromProtectedRoute]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await authAPI.verifyEmail(verificationToken);
      if (response.success) {
        setIsVerified(true);
        toast.success('Email verified successfully!');
        // Update user in localStorage if they're logged in
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          userData.isEmailVerified = true;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        setError(response.message || 'Email verification failed');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      const message = error.response?.data?.message || 'Email verification failed';
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!stateEmail) return;
    
    setIsResending(true);
    try {
      await authAPI.resendVerificationEmail(stateEmail);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      const message = error.response?.data?.message || 'Failed to resend verification email';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FileText className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">          <div className="text-center">
            {isVerifying ? (
              <div>
                <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Verifying your email...
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Please wait while we verify your email address.
                </p>
              </div>
            ) : (fromSignup || fromProtectedRoute) && !error ? (
              <div>
                <Mail className="mx-auto h-12 w-12 text-primary-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Check your email
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  We've sent a verification link to <strong>{stateEmail}</strong>. 
                  Click the link in the email to verify your account.
                </p>                <div className="mt-6 space-y-3">
                  <Link to="/login">
                    <Button fullWidth>
                      Go to Sign In
                    </Button>
                  </Link>
                  <Button
                    onClick={resendVerificationEmail}
                    variant="outline"
                    fullWidth
                    disabled={isResending}
                  >
                    {isResending ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Didn't receive the email? Check your spam folder or contact support.
                  </p>
                </div>
              </div>
            ) : isVerified ? (
              <div>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Email verified successfully!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your email address has been verified. You can now access all features of ResumePilot.
                </p>
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    fullWidth
                  >
                    Go to Dashboard
                  </Button>
                  <Link
                    to="/login"
                    className="block w-full text-center text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Sign in to your account
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Verification failed
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {error || 'We couldn\'t verify your email address. The link may be invalid or expired.'}
                </p>
                <div className="mt-6 space-y-3">
                  <Link to="/signup">
                    <Button fullWidth>
                      Create a new account
                    </Button>
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full text-center text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Sign in to your account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
