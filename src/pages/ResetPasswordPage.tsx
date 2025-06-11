import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import { toast } from 'sonner';
import { authAPI } from '../utils/api';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pw: string) => {
    return pw.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authAPI.resetPassword(token, password);
      if (response.success) {
        setSuccess(true);
        toast.success('Password reset successfully! You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <FileText className="h-10 w-10 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
          <p className="mb-4">Your password has been reset. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <div className="flex justify-center mb-4">
          <FileText className="h-10 w-10 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">Enter your new password below.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="mt-1 block w-full border rounded px-3 py-2"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
