// Session management utilities for frontend
import { authAPI } from './api';

export interface UserSession {
  sessionId: string;
  createdAt: string;
  lastUsed: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: string;
  isCurrent: boolean;
}

class SessionManager {
  private refreshPromise: Promise<boolean> | null = null;
  private isRefreshing = false;

  /**
   * Automatically refresh access token when needed
   */
  async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this._performRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }
  private async _performRefresh(): Promise<boolean> {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseURL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Access token refreshed successfully');
          return true;
        }
      }

      console.log('❌ Token refresh failed');
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Get all user sessions
   */
  async getUserSessions(): Promise<UserSession[]> {
    try {
      const response = await authAPI.getUserSessions();
      if (response.success) {
        return response.sessions;
      }
      return [];
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      return [];
    }
  }

  /**
   * Invalidate a specific session
   */
  async invalidateSession(sessionId: string): Promise<boolean> {
    try {
      const response = await authAPI.invalidateSession(sessionId);
      return response.success;
    } catch (error) {
      console.error('Failed to invalidate session:', error);
      return false;
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAllDevices(): Promise<boolean> {
    try {
      const response = await authAPI.logoutAllDevices();
      if (response.success) {
        // Clear local storage and cookies
        this.clearLocalAuth();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to logout from all devices:', error);
      return false;
    }
  }

  /**
   * Clear local authentication data
   */
  clearLocalAuth(): void {
    localStorage.removeItem('user');
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Remove auto features setup, not needed anymore
