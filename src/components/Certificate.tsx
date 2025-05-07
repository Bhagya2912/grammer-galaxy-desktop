
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CertificateProps {
  type: 'enrollment' | 'completion';
  studentName: string;
  studentId: string;
  courseName: string;
  date: string;
  grade?: string;
  score?: number;
}

const Certificate = ({ 
  type, 
  studentName, 
  studentId, 
  courseName, 
  date, 
  grade, 
  score 
}: CertificateProps) => {
  
  const printCertificate = () => {
    window.print();
  };
  
  return (
    <div className="p-8 bg-white max-w-4xl mx-auto print:p-0">
      <Card className="border-4 border-brand-teal print:border-2">
        <CardHeader className="text-center border-b border-gray-200 bg-muted/30">
          <div className="flex justify-center mb-4">
            {type === 'enrollment' ? (
              <BookOpen className="h-16 w-16 text-brand-blue" />
            ) : (
              <Award className="h-16 w-16 text-brand-teal" />
            )}
          </div>
          <CardTitle className="text-3xl font-serif mb-2">
            Grammer's Gallery
          </CardTitle>
          <div className="text-xl font-medium text-brand-blue">
            {type === 'enrollment' ? 'Certificate of Enrollment' : 'Certificate of Completion'}
          </div>
        </CardHeader>
        
        <CardContent className="py-8 px-6 text-center space-y-6">
          <div className="mb-8">
            <p className="text-lg">This is to certify that</p>
            <h2 className="text-3xl font-serif font-bold my-3">{studentName}</h2>
            <p className="text-lg">Student ID: <span className="font-medium">{studentId}</span></p>
          </div>
          
          {type === 'enrollment' ? (
            <p className="text-lg">
              has successfully enrolled in the course
              <span className="block text-2xl font-serif font-bold my-3">{courseName}</span>
              on <span className="font-medium">{date}</span>
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-lg">
                has successfully completed the course
                <span className="block text-2xl font-serif font-bold my-3">{courseName}</span>
              </p>
              
              <div className="flex justify-center gap-8 my-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="text-3xl font-bold text-brand-blue">{grade}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-3xl font-bold text-brand-teal">{score}%</p>
                </div>
              </div>
              
              <p className="text-lg">Completed on <span className="font-medium">{date}</span></p>
            </div>
          )}
          
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            <div className="text-left">
              <div className="font-medium">Prof. Johnson</div>
              <div className="text-sm text-muted-foreground">Course Director</div>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Verified Certificate</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 flex justify-end print:hidden">
        <Button onClick={printCertificate} className="gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print Certificate
        </Button>
      </div>
      
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
