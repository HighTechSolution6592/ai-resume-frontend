import { create } from 'zustand';
import { Resume, ResumeContent, CoverLetterContent } from '../types';
import { mockResumes } from '../utils/mockData';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

interface State {
  user: User | null;
  isLoading: boolean;
  resumes: Resume[];
  coverLetters: Resume[];
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setResumes: (resumes: Resume[]) => void;
  setCoverLetters: (coverLetters: Resume[]) => void;
  fetchResumes: () => Promise<void>;
  fetchCoverLetters: () => Promise<void>;
  createResume: (title: string, content: ResumeContent) => Promise<string>;
  updateResume: (id: string, title: string, content: ResumeContent) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  createCoverLetter: (title: string, content: CoverLetterContent) => Promise<string>;
  updateCoverLetter: (id: string, title: string, content: CoverLetterContent) => Promise<void>;
  deleteCoverLetter: (id: string) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  user: null,
  isLoading: true,
  resumes: mockResumes.filter(doc => doc.type === 'resume'),
  coverLetters: mockResumes.filter(doc => doc.type === 'coverLetter'),

  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setResumes: (resumes) => set({ resumes }),
  setCoverLetters: (coverLetters) => set({ coverLetters }),

  fetchResumes: async () => {
    // Using mock data for now
    set({ resumes: mockResumes.filter(doc => doc.type === 'resume') });
  },

  fetchCoverLetters: async () => {
    // Using mock data for now
    set({ coverLetters: mockResumes.filter(doc => doc.type === 'coverLetter') });
  },

  createResume: async (title: string, content: ResumeContent) => {
    const newResume: Resume = {
      id: crypto.randomUUID(),
      userId: get().user?.id || 'mock-user',
      title,
      type: 'resume',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({ resumes: [newResume, ...get().resumes] });
    return newResume.id;
  },

  updateResume: async (id: string, title: string, content: ResumeContent) => {
    set({
      resumes: get().resumes.map((resume) =>
        resume.id === id
          ? {
              ...resume,
              title,
              content,
              updatedAt: new Date().toISOString(),
            }
          : resume
      ),
    });
  },

  deleteResume: async (id: string) => {
    set({
      resumes: get().resumes.filter((resume) => resume.id !== id),
    });
  },

  createCoverLetter: async (title: string, content: CoverLetterContent) => {
    const newCoverLetter: Resume = {
      id: crypto.randomUUID(),
      userId: get().user?.id || 'mock-user',
      title,
      type: 'coverLetter',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({ coverLetters: [newCoverLetter, ...get().coverLetters] });
    return newCoverLetter.id;
  },

  updateCoverLetter: async (id: string, title: string, content: CoverLetterContent) => {
    set({
      coverLetters: get().coverLetters.map((letter) =>
        letter.id === id
          ? {
              ...letter,
              title,
              content,
              updatedAt: new Date().toISOString(),
            }
          : letter
      ),
    });
  },

  deleteCoverLetter: async (id: string) => {
    set({
      coverLetters: get().coverLetters.filter((letter) => letter.id !== id),
    });
  },
}));