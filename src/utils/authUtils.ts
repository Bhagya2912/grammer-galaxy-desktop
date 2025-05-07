
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  avatar?: string;
  enrolledCourses?: string[];
  isVerified?: boolean;
  studentId?: string;
  mobileVerified?: boolean;
  emailVerified?: boolean;
  isApproved?: boolean;
  pendingVerification?: {
    email?: string;
    mobile?: string;
  };
  department?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
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
    emailVerified: true,
    mobileVerified: true,
    isApproved: true
  },
  {
    id: '2',
    name: 'Staff User',
    email: 'staff@grammar.gallery',
    role: 'staff',
    avatar: '',
    isVerified: true,
    emailVerified: true,
    mobileVerified: true,
    isApproved: true,
    department: 'Basic Grammar'
  },
  {
    id: '3',
    name: 'Student User',
    email: 'student@grammar.gallery',
    role: 'student',
    avatar: '',
    enrolledCourses: ['1', '3'],
    isVerified: true,
    emailVerified: true,
    mobileVerified: true,
    studentId: 'GG2025001',
    level: 'Intermediate',
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

// Mock courses
export const MOCK_COURSES = [
  { id: '1', name: 'Basic English Grammar', level: 'Beginner', fee: 2999 },
  { id: '2', name: 'Tenses & Sentence Formation', level: 'Beginner', fee: 3499 },
  { id: '3', name: 'Parts of Speech Mastery', level: 'Intermediate', fee: 3999 },
  { id: '4', name: 'Voice & Narration', level: 'Intermediate', fee: 4499 },
  { id: '5', name: 'Punctuation & Capitalization', level: 'Beginner', fee: 2499 },
  { id: '6', name: 'Common Errors in English', level: 'Intermediate', fee: 3999 },
  { id: '7', name: 'Vocabulary Builder', level: 'All Levels', fee: 2999 },
  { id: '8', name: 'Idioms & Phrases', level: 'Advanced', fee: 4999 },
  { id: '9', name: 'Prepositions Made Easy', level: 'Intermediate', fee: 3799 },
  { id: '10', name: 'Advanced Grammar Practice', level: 'Advanced', fee: 5999 }
];

// Stored verification codes (in a real app, these would be in a database with expiry)
const VERIFICATION_CODES: Record<string, {code: string, expiry: number}> = {};

// Generate a random 6-digit code
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock send verification code (email or SMS)
export const sendVerificationCode = async (destination: string, type: 'email' | 'phone'): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const code = generateOTP();
      const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes
      VERIFICATION_CODES[destination] = { code, expiry };
      
      console.log(`MOCK ${type.toUpperCase()} SENT TO ${destination}: Your verification code is ${code}`);
      resolve(code);
    }, 800);
  });
};

// Verify code
export const verifyCode = async (destination: string, code: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const storedData = VERIFICATION_CODES[destination];
      
      if (!storedData) {
        reject(new Error('No verification code found. Please request a new one.'));
        return;
      }
      
      if (Date.now() > storedData.expiry) {
        reject(new Error('Verification code has expired. Please request a new one.'));
        return;
      }
      
      if (storedData.code !== code) {
        reject(new Error('Invalid verification code. Please try again.'));
        return;
      }
      
      // Clear the code after successful verification
      delete VERIFICATION_CODES[destination];
      resolve(true);
    }, 800);
  });
};

// Mock authentication functions (to be replaced with real backend integration)
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (!user) {
        reject(new Error('User not found'));
        return;
      }
      
      if (!user.isVerified) {
        reject(new Error('Please verify your email before logging in'));
        return;
      }

      if (user.role === 'staff' && !user.isApproved) {
        reject(new Error('Your account is pending admin approval'));
        return;
      }
      
      if (password === 'password') {
        // Store in local storage
        localStorage.setItem('grammerGalleryUser', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800); // Simulate network delay
  });
};

export const registerStudent = (
  name: string, 
  email: string, 
  phone: string,
  password: string,
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  selectedCourses: string[]
): Promise<User> => {
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
          emailVerified: false,
          mobileVerified: false,
          studentId,
          level,
          enrolledCourses: [],
          pendingVerification: {
            email: email,
            mobile: phone
          },
          completedTests: []
        };
        
        MOCK_USERS.push(newUser);
        resolve(newUser);
      }
    }, 800); // Simulate network delay
  });
};

export const registerStaff = (
  name: string, 
  email: string,
  phone: string,
  department: string,
  password: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = MOCK_USERS.find(u => u.email === email);
      
      if (existingUser) {
        reject(new Error('User already exists'));
      } else {
        const newUser: User = {
          id: (MOCK_USERS.length + 1).toString(),
          name,
          email,
          role: 'staff',
          avatar: '',
          isVerified: false,
          emailVerified: false,
          mobileVerified: false,
          isApproved: false,
          department,
          pendingVerification: {
            email: email,
            mobile: phone
          }
        };
        
        MOCK_USERS.push(newUser);
        resolve(newUser);
      }
    }, 800); // Simulate network delay
  });
};

export const verifyEmail = (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }
      
      const updatedUser = { 
        ...MOCK_USERS[userIndex], 
        emailVerified: true 
      };
      
      if (updatedUser.mobileVerified) {
        updatedUser.isVerified = true;
      }

      // Remove email from pending verification
      if (updatedUser.pendingVerification) {
        const { email, ...rest } = updatedUser.pendingVerification;
        updatedUser.pendingVerification = rest;
      }
      
      MOCK_USERS[userIndex] = updatedUser;
      resolve(updatedUser);
    }, 500);
  });
};

export const verifyMobile = (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        reject(new Error('User not found'));
        return;
      }
      
      const updatedUser = { 
        ...MOCK_USERS[userIndex], 
        mobileVerified: true 
      };
      
      if (updatedUser.emailVerified) {
        updatedUser.isVerified = true;
      }

      // Remove mobile from pending verification
      if (updatedUser.pendingVerification) {
        const { mobile, ...rest } = updatedUser.pendingVerification;
        updatedUser.pendingVerification = rest;
      }
      
      MOCK_USERS[userIndex] = updatedUser;
      resolve(updatedUser);
    }, 500);
  });
};

export const approveStaff = (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId && u.role === 'staff');
      if (userIndex === -1) {
        reject(new Error('Staff user not found'));
        return;
      }
      
      MOCK_USERS[userIndex].isApproved = true;
      resolve(MOCK_USERS[userIndex]);
    }, 500);
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
