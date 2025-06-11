import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance with base configuration
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	withCredentials: true, // Include cookies in requests
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add JWT as Bearer token from localStorage
api.interceptors.request.use(
	(config) => {
		const user = localStorage.getItem("user");
		if (user) {
			const parsed = JSON.parse(user);
			if (parsed.token) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${parsed.token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			Cookies.remove("token");
			localStorage.removeItem("user");
		}
		return Promise.reject(error);
	}
);

// Auth API functions
export const authAPI = {
	register: async (userData: {
		name: string;
		email: string;
		password: string;
	}) => {
		const response = await api.post("/auth/register", userData);
		return response.data;
	},

	login: async (credentials: { email: string; password: string }) => {
		const response = await api.post("/auth/login", credentials);
		return response.data;
	},

	logout: async () => {
		const response = await api.post("/auth/logout");
		Cookies.remove("token");
		localStorage.removeItem("user");
		return response.data;
	},

	getCurrentUser: async () => {
		const response = await api.get("/auth/me");
		return response.data;
	},

	forgotPassword: async (email: string) => {
		const response = await api.post("/auth/forgot-password", { email });
		return response.data;
	},

	resetPassword: async (token: string, password: string) => {
		const response = await api.post("/auth/reset-password", {
			token,
			password,
		});
		return response.data;
	},
	verifyEmail: async (token: string) => {
		const response = await api.get(`/auth/verify-email/${token}`);
		return response.data;
	},

	resendVerificationEmail: async (email: string) => {
		const response = await api.post("/auth/resend-verification", { email });
		return response.data;
	},

	// Session management endpoints
	refreshToken: async () => {
		const response = await api.post("/auth/refresh-token");
		return response.data;
	},

	getUserSessions: async () => {
		const response = await api.get("/auth/sessions");
		return response.data;
	},

	invalidateSession: async (sessionId: string) => {
		const response = await api.delete(`/auth/sessions/${sessionId}`);
		return response.data;
	},

	logoutAllDevices: async () => {
		const response = await api.post("/auth/logout-all");
		return response.data;
	},

	// Debug auth endpoint
	debugAuth: async () => {
		const response = await api.get("/auth/debug");
		return response.data;
	},
};

// Resume API functions
export const resumeAPI = {
	getResumes: async () => {
		const response = await api.get("/resume");
		return response.data;
	},

	getResume: async (id: string) => {
		const response = await api.get(`/resume/${id}`);
		return response.data;
	},

	createResume: async (resumeData: any) => {
		const response = await api.post("/resume/new", resumeData);
		return response.data;
	},

	updateResume: async (id: string, resumeData: any) => {
		const response = await api.put(`/resume/${id}`, resumeData);
		return response.data;
	},

	deleteResume: async (id: string) => {
		const response = await api.delete(`/resume/${id}`);
		return response.data;
	},

	improveSummary: async (summary: string, description: string) => {
		const response = await api.post("/resume/improve-summary", {
			summary,
			description,
		});
		return response.data;
	},
};

// Legacy export for backward compatibility
export const improveSummary = resumeAPI.improveSummary;
export const addResume = resumeAPI.createResume;

export default api;
