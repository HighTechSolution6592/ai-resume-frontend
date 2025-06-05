import { Resume } from '../types';

export const mockResumes: Resume[] = [
  {
    id: '1',
    userId: '123456',
    title: 'Software Engineer Resume',
    type: 'resume',
    createdAt: '2023-10-15T14:30:00Z',
    updatedAt: '2023-10-20T09:15:00Z',
      content: {
        title: 'Software Engineer Resume',
        description: 'Resume for an experienced software engineer specializing in full-stack development.',
        personalInfo: {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '(555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/janedoe'
        },
        summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.',
        workExperience: [
          {
            id: 'exp1',
            companyName: 'Tech Solutions Inc.',
            position: 'Senior Software Engineer',
            startDate: '2021-03-01',
            isCurrent: true,
            location: 'San Francisco, CA',
            description: 'Lead developer for customer-facing web applications'
            // achievements: [
            //   'Increased application performance by 40% through code optimization',
            //   'Led a team of 5 developers to deliver a major project on time and under budget',
            //   'Implemented CI/CD pipeline reducing deployment time by 60%'
            // ]
          }
        ],
        education: [
          {
            id: 'edu1',
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            startDate: '2014-09-01',
            endDate: '2018-05-30',
            location: 'Berkeley, CA',
            gpa: '3.8'
          }
        ],
        skills: [
          'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'
        ],
        certifications: []
      }
  },
  {
    id: '2',
    userId: '123456',
    title: 'Frontend Developer Cover Letter',
    type: 'coverLetter',
    createdAt: '2023-11-10T10:20:00Z',
    updatedAt: '2023-11-10T10:20:00Z',
    content: {
      recipientName: 'Sarah Johnson',
      companyName: 'Tech Innovators Inc.',
      jobTitle: 'Senior Frontend Developer',
      content: 'Dear Ms. Johnson,\n\nI am writing to express my strong interest in the Senior Frontend Developer position at Tech Innovators Inc...',
      tone: 'professional'
    }
  },
  {
    id: '3',
    userId: '123456',
    title: 'Product Manager Resume',
    type: 'resume',
    createdAt: '2023-09-10T11:20:00Z',
    updatedAt: '2023-10-18T15:45:00Z',
    content: {
      title: 'Product Manager Resume',
      description: 'Resume for a strategic product manager with SaaS and software engineering background.',
      personalInfo: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/janedoe'
      },
      summary: 'Strategic product manager with expertise in SaaS products and a background in software engineering.',
      workExperience: [
        {
          id: 'exp1',
          companyName: 'SaaS Platform Inc.',
          position: 'Senior Product Manager',
          startDate: '2020-02-01',
          isCurrent: true,
          location: 'San Francisco, CA',
          description: 'Lead product strategy for B2B SaaS platform',
          // achievements: [
          //   'Grew monthly active users by 65% in 12 months',
          //   'Reduced customer churn by 30% through feature improvements'
          // ]
        }
      ],
      education: [
        {
          id: 'edu1',
          institution: 'Stanford University',
          degree: 'Master of Business Administration',
          fieldOfStudy: 'Product Management',
          startDate: '2016-09-01',
          endDate: '2018-05-30',
          location: 'Stanford, CA',
          gpa: '3.9'
        }
      ],
      skills: [
        'Product Strategy', 'User Research', 'Data Analysis', 'Agile/Scrum'
      ],
      certifications: []
    }
  }
];