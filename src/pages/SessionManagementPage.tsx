import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Trash2, Monitor, Smartphone, Globe, Shield, Clock, MapPin } from 'lucide-react';
import { sessionManager, UserSession } from '../utils/sessionManager';
import { toast } from 'sonner';

const SessionManagementPage: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTerminating, setIsTerminating] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const userSessions = await sessionManager.getUserSessions();
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      setIsTerminating(sessionId);
      const success = await sessionManager.invalidateSession(sessionId);
      
      if (success) {
        toast.success('Session terminated successfully');
        // Wait a short moment to ensure backend updates are reflected
        setTimeout(() => {
          loadSessions();
        }, 400);
      } else {
        toast.error('Failed to terminate session');
      }
    } catch (error) {
      console.error('Failed to terminate session:', error);
      toast.error('Failed to terminate session');
    } finally {
      setIsTerminating(null);
    }
  };

  const terminateAllSessions = async () => {
    try {
      setIsLoading(true);
      const success = await sessionManager.logoutAllDevices();
      
      if (success) {
        toast.success('Logged out from all devices successfully');
        // This will redirect to login page as all sessions are invalidated
        window.location.href = '/login';
      } else {
        toast.error('Failed to logout from all devices');
      }
    } catch (error) {
      console.error('Failed to logout from all devices:', error);
      toast.error('Failed to logout from all devices');
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getBrowserName = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera')) return 'Opera';
    return 'Unknown Browser';
  };

  const getLocationFromIP = (ipAddress: string) => {
    // In a real app, you might use a geolocation service
    // For now, just show the IP
    return ipAddress;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Active Sessions</h1>
            <p className="text-gray-600 mt-2">
              Manage your active sessions and security settings
            </p>
          </div>          <Button
            variant="danger"
            onClick={terminateAllSessions}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Logout All Devices
          </Button>
        </div>

        {/* Security Info */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Security Notice</h3>
                <p className="text-sm text-amber-700 mt-1">
                  If you see any sessions you don't recognize, terminate them immediately and change your password.
                  Sessions automatically expire after 7 days of inactivity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Statistics */}
        {sessions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Session Statistics</CardTitle>
              <CardDescription>Overview of your account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{sessions.length}</div>
                  <div className="text-sm text-gray-600">Active Sessions</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {sessions.filter(s => s.isCurrent).length}
                  </div>
                  <div className="text-sm text-gray-600">Current Session</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {new Set(sessions.map(s => s.ipAddress)).size}
                  </div>
                  <div className="text-sm text-gray-600">Unique Locations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Sessions</h3>
                  <p className="text-gray-600">You don't have any active sessions.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.sessionId} className={session.isCurrent ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-gray-500">
                        {getDeviceIcon(session.userAgent)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {getBrowserName(session.userAgent)}
                          </h3>
                          {session.isCurrent && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Current Session
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{getLocationFromIP(session.ipAddress)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last active: {getTimeAgo(session.lastUsed)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>Created: {formatDate(session.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Expires: {formatDate(session.expiresAt)}</p>
                          <p className="font-mono">Session ID: {session.sessionId.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!session.isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => terminateSession(session.sessionId)}
                          disabled={isTerminating === session.sessionId}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          {isTerminating === session.sessionId ? 'Terminating...' : 'Terminate'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionManagementPage;
