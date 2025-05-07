
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  avatar?: string;
  enrolledCourses?: string[];
  isVerified?: boolean;
  studentId?: string;
  completedTests?: {
    id: string;
    courseName: string;
    testName: string;
    score: number;
    grade: string;
    completionDate: string;
  }[];
}

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@grammar.gallery',
    role: 'admin',
    avatar: '',
    isVerified: true,
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@grammar.gallery',
    role: 'staff',
    avatar: '',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Student User',
    email: 'student@grammar.gallery',
    role: 'student',
    avatar: '',
    enrolledCourses: ['1', '3'],
    isVerified: true,
    studentId: 'GG2025001',
    completedTests: [
      {
        id: '1',
        courseName: 'English Grammar Basics',
        testName: 'Fundamentals of Grammar Quiz',
        score: 85,
        grade: 'A',
        completionDate: '2025-05-01',
      }
    ]
  }
];

// Mock authentication functions (to be replaced with real backend integration)
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (user && password === 'password') {
        // Store in local storage
        localStorage.setItem('grammerGalleryUser', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800); // Simulate network delay
  });
};

export const registerUser = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = MOCK_USERS.find(u => u.email === email);
      
      if (existingUser) {
        reject(new Error('User already exists'));
      } else {
        const studentIdCounter = MOCK_USERS.filter(u => u.role === 'student').length + 1;
        const studentId = `GG2025${String(studentIdCounter).padStart(3, '0')}`;
        
        const newUser: User = {
          id: (MOCK_USERS.length + 1).toString(),
          name,
          email,
          role: 'student',
          avatar: '',
          isVerified: false,
          studentId,
          enrolledCourses: [],
          completedTests: []
        };
        
        MOCK_USERS.push(newUser);
        
        // Store in local storage
        localStorage.setItem('grammerGalleryUser', JSON.stringify(newUser));
        resolve(newUser);
      }
    }, 800); // Simulate network delay
  });
};

export const logoutUser = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('grammerGalleryUser');
      resolve();
    }, 300);
  });
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('grammerGalleryUser');
  return userJson ? JSON.parse(userJson) : null;
};
