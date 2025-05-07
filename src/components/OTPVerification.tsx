
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OTPVerificationProps {
  destination: string;
  type: 'email' | 'phone';
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onCancel: () => void;
}

const OTPVerification = ({ destination, type, onVerify, onResend, onCancel }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: number;
    if (countdown > 0 && !canResend) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => window.clearTimeout(timer);
  }, [countdown, canResend]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onVerify(otp);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      await onResend();
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend code. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verification Required</CardTitle>
        <CardDescription>
          Please enter the 6-digit code sent to your {type === 'email' ? 'email' : 'phone'}: {destination}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex gap-2 w-full">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={otp.length !== 6 || isSubmitting} className="flex-1">
            Verify
          </Button>
        </div>
        <div className="text-center w-full">
          <Button
            variant="link"
            onClick={handleResend}
            disabled={!canResend}
            className="text-sm"
          >
            {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OTPVerification;
