export interface User {
  id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	isEmailVerified?: boolean;
	registration_method?: "manual" | "google" | "facebook" | "linkedin";
	hasPassword?: boolean;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  type: 'resume' | 'coverLetter';
  createdAt: string;
  updatedAt: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  description: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
}

export interface CoverLetter {
  _id: string;
  recipientName: string;
  companyName: string;
  jobTitle: string;
  description: string;
  experience: string;
  applicationDate: string;
  custiomization: string;
  content: string;
  type: 'coverLetter' | 'resume';
  writingTone: 'professional' | 'friendly' | 'confident';
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  country: string;
  state: string;
  city: string;
  description: string;
  // achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  country: string;
  state: string;
  city: string;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
}