
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

// Application form validation schema
const applicationSchema = z.object({
  address: z.string().min(10, { message: "Please provide your complete address" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  pincode: z.string().min(5, { message: "Please provide a valid postal/zip code" }),
  education: z.string().min(5, { message: "Education details are required" }),
  guardianName: z.string().min(2, { message: "Guardian name is required" }),
  guardianContact: z.string().min(10, { message: "Valid guardian contact is required" }),
  idProof: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const ApplicationForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    // Verify that we have a userId from the registration process
    if (!userId) {
      navigate('/registration');
    }
  }, [userId, navigate]);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      education: '',
      guardianName: '',
      guardianContact: '',
      idProof: '',
    },
  });

  const onSubmit = async (values: ApplicationFormValues) => {
    try {
      setError(null);
      setIsSubmitting(true);
      
      // In a real application, this would send the data to your backend
      console.log('Application data:', values);
      console.log('User ID:', userId);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully. Proceed to payment to complete enrollment.",
      });
      
      // Redirect to payment page
      navigate('/payment', { state: { userId, applicationData: values } });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Student Application Form</h1>
          <p className="text-muted-foreground">Complete your student profile to proceed with enrollment</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>Please provide your personal and educational details</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your complete residential address"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State/Province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal/ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal/ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Educational Background</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your educational qualifications, institutions attended, etc."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian/Parent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name of parent or guardian" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guardianContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guardian/Parent Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number or email" {...field} />
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
                      <FormLabel>Upload ID Proof (Optional)</FormLabel>
                      <FormControl>
                        <Input type="file" className="cursor-pointer" onChange={(e) => {
                          const fileName = e.target.files?.[0]?.name || '';
                          field.onChange(fileName);
                        }} />
                      </FormControl>
                      <FormDescription>
                        Upload a scanned copy of your ID (passport, driver's license, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              By submitting this application, you confirm that all information provided is accurate. 
              After submission, you will be redirected to complete the payment process.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationForm;
