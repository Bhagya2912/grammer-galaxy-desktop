
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerStaff, sendVerificationCode, verifyCode } from '@/utils/authUtils';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import OTPVerification from '@/components/OTPVerification';
import { useToast } from '@/components/ui/use-toast';

// Staff registration form validation schema
const staffRegistrationSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  department: z.string().min(2, { message: "Department is required" }),
  qualifications: z.string().min(10, { message: "Please provide your qualifications" }),
  idProof: z.string().optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type StaffRegistrationFormValues = z.infer<typeof staffRegistrationSchema>;

const StaffRegistration = () => {
  const [error, setError] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [verificationStep, setVerificationStep] = useState<'none' | 'email' | 'mobile'>('none');
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<StaffRegistrationFormValues>({
    resolver: zodResolver(staffRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      qualifications: '',
      idProof: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: StaffRegistrationFormValues) => {
    try {
      setError(null);
      const fullName = `${values.firstName} ${values.lastName}`;
      
      // Register the staff user
      const user = await registerStaff(
        fullName,
        values.email,
        values.phoneNumber,
        values.department,
        values.password
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
        description: "Your account is now pending admin approval. You will receive an email once approved.",
      });
      
      // Redirect to login page with message
      navigate('/auth', { state: { message: 'Registration complete. Your account is pending admin approval.' } });
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
          <h1 className="text-3xl font-serif font-bold">Staff Registration</h1>
          <p className="text-muted-foreground">Join Grammer's Gallery as a teaching staff</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Staff Registration</CardTitle>
            <CardDescription>Fill in your details to create a staff account</CardDescription>
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
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department/Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Basic Grammar, Advanced Writing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualifications</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your educational background and teaching experience"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload ID Proof/Certification</FormLabel>
                      <FormControl>
                        <Input type="file" className="cursor-pointer" onChange={(e) => {
                          const fileName = e.target.files?.[0]?.name || '';
                          field.onChange(fileName);
                        }} />
                      </FormControl>
                      <FormDescription>
                        Upload a scanned copy of your ID or certification
                      </FormDescription>
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
          </CardFooter>
        </Card>
        
        <p className="text-center text-muted-foreground text-sm mt-4">
          © 2025 Grammer's Gallery. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default StaffRegistration;

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
