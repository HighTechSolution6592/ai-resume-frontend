export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  type: 'resume';
  createdAt: string;
  updatedAt: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
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
  type: 'coverLetter';
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
  location?: string;
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
  location?: string;
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