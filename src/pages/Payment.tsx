
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MOCK_COURSES } from '@/utils/authUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

// Mock function to simulate payment processing
const processPayment = async (): Promise<{ success: boolean; transactionId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TXN${Math.floor(Math.random() * 1000000)}`
      });
    }, 2000);
  });
};

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<typeof MOCK_COURSES>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, applicationData } = location.state || {};

  useEffect(() => {
    // Verify that we have necessary data from previous steps
    if (!userId || !applicationData) {
      navigate('/registration');
      return;
    }

    // In a real app, fetch the user's selected courses from the server
    // For now, we'll use mock data
    setSelectedCourses([MOCK_COURSES[0], MOCK_COURSES[2]]);
  }, [userId, applicationData, navigate]);

  const calculateTotal = () => {
    return selectedCourses.reduce((sum, course) => sum + course.fee, 0);
  };

  const handlePayment = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      
      const result = await processPayment();
      
      if (result.success) {
        toast({
          title: "Payment successful",
          description: `Transaction ID: ${result.transactionId}. You now have full access to your courses!`,
        });
        
        // In a real app, update the user's status in the backend
        // For now, just navigate to the dashboard
        navigate('/dashboard');
      } else {
        setError('Payment failed. Please try again or contact support.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Complete Payment</h1>
          <p className="text-muted-foreground">Make payment to finalize your enrollment</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Review your course selection and complete payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <h3 className="font-medium">Selected Courses:</h3>
              {selectedCourses.map((course) => (
                <div key={course.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.level}</p>
                  </div>
                  <p className="font-medium">₹{course.fee.toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
            
            <div className="bg-muted p-4 rounded-md border">
              <h3 className="font-medium mb-2">Payment Methods</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="radio" id="upi" name="paymentMethod" defaultChecked />
                  <label htmlFor="upi">UPI (Google Pay/PhonePe)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="card" name="paymentMethod" />
                  <label htmlFor="card">Credit/Debit Card</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="netbanking" name="paymentMethod" />
                  <label htmlFor="netbanking">Net Banking</label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button 
              onClick={handlePayment} 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${calculateTotal().toLocaleString()}`}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              By completing this payment, you agree to our terms and conditions.
              Your payment details are securely processed.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
