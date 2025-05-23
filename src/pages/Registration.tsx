
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MOCK_COURSES, registerStudent, sendVerificationCode, verifyCode } from '@/utils/authUtils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OTPVerification from '@/components/OTPVerification';
import { useToast } from '@/components/ui/use-toast';

// Registration form validation schema
const registrationSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Please select your level",
  }),
  courseIds: z.array(z.string()).refine(value => value.length > 0, {
    message: "Please select at least one course",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const Registration = () => {
  const [error, setError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [verificationStep, setVerificationStep] = useState<'none' | 'email' | 'mobile'>('none');
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
      courseIds: [],
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    try {
      setError(null);
      const fullName = `${values.firstName} ${values.lastName}`;
      
      // Register the student
      const user = await registerStudent(
        fullName,
        values.email,
        values.phoneNumber,
        values.password,
        values.level,
        values.courseIds
      );
      
      setRegisteredUser(user);
      
      // Send email verification code
      await sendVerificationCode(values.email, 'email');
      setVerificationStep('email');
      
      toast({
        title: "Registration successful",
        description: "Please verify your email to continue",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleEmailVerify = async (otp: string) => {
    if (!registeredUser) return;
    
    try {
      await verifyCode(registeredUser.email, otp);
      await verifyEmail(registeredUser.id);
      
      toast({
        title: "Email verified",
        description: "Now please verify your mobile number",
      });
      
      // Send mobile verification code
      await sendVerificationCode(registeredUser.pendingVerification.mobile, 'phone');
      setVerificationStep('mobile');
    } catch (error) {
      throw error;
    }
  };

  const handleMobileVerify = async (otp: string) => {
    if (!registeredUser) return;
    
    try {
      await verifyCode(registeredUser.pendingVerification.mobile, otp);
      await verifyMobile(registeredUser.id);
      
      toast({
        title: "Mobile verified",
        description: "Your account is verified. Please complete your application form and payment to access courses.",
      });
      
      // Redirect to application form page
      navigate('/application-form', { state: { userId: registeredUser.id } });
    } catch (error) {
      throw error;
    }
  };

  const handleEmailResend = async () => {
    if (!registeredUser) return;
    await sendVerificationCode(registeredUser.email, 'email');
  };

  const handleMobileResend = async () => {
    if (!registeredUser) return;
    await sendVerificationCode(registeredUser.pendingVerification.mobile, 'phone');
  };

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(current => {
      const updated = current.includes(courseId)
        ? current.filter(id => id !== courseId)
        : [...current, courseId];
      
      form.setValue("courseIds", updated);
      return updated;
    });
  };

  // Show appropriate verification step
  if (verificationStep === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <OTPVerification
          destination={registeredUser.email}
          type="email"
          onVerify={handleEmailVerify}
          onResend={handleEmailResend}
          onCancel={() => setVerificationStep('none')}
        />
      </div>
    );
  }

  if (verificationStep === 'mobile') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <OTPVerification
          destination={registeredUser.pendingVerification.mobile}
          type="phone"
          onVerify={handleMobileVerify}
          onResend={handleMobileResend}
          onCancel={() => setVerificationStep('email')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Student Registration</h1>
          <p className="text-muted-foreground">Create an account to start learning at Grammer's Gallery</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Registration</CardTitle>
            <CardDescription>Fill in your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        You will need to verify this email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>
                        You will need to verify this phone number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your English Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="courseIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Select Courses</FormLabel>
                        <FormDescription>
                          Choose one or more courses you'd like to enroll in
                        </FormDescription>
                      </div>
                      {MOCK_COURSES.map((course) => (
                        <FormItem
                          key={course.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={selectedCourses.includes(course.id)}
                              onCheckedChange={() => handleCourseToggle(course.id)}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              {course.name} <span className="text-muted-foreground text-sm">({course.level})</span>
                            </FormLabel>
                            <FormDescription>
                              ₹{course.fee}
                            </FormDescription>
                          </div>
                        </FormItem>
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must contain at least 8 characters, including uppercase, lowercase, and numbers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Register</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <div className="text-sm text-muted-foreground text-center w-full">
              <p>Already have an account? <Button variant="link" onClick={() => navigate('/auth')} className="p-0 h-auto">Login</Button></p>
            </div>
            <div className="text-sm text-muted-foreground text-center w-full">
              <p>Are you staff? <Button variant="link" onClick={() => navigate('/staff-registration')} className="p-0 h-auto">Staff Registration</Button></p>
            </div>
          </CardFooter>
        </Card>
        
        <p className="text-center text-muted-foreground text-sm mt-4">
          © 2025 Grammer's Gallery. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Registration;

function verifyEmail(id: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

function verifyMobile(id: string): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}
