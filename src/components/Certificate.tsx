
import React from 'react';
import { format } from 'date-fns';

interface CertificateProps {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  score?: number;
  grade?: string;
  testName?: string;
  studentId: string;
  type: 'enrollment' | 'completion';
}

const Certificate: React.FC<CertificateProps> = ({
  studentName,
  courseTitle,
  completionDate,
  score,
  grade,
  testName,
  studentId,
  type,
}) => {
  const formattedDate = format(new Date(completionDate), 'MMMM d, yyyy');
  
  return (
    <div className="certificate-container w-[800px] h-[600px] bg-white border-8 border-double border-brand-blue/40 p-8 mx-auto my-8 relative overflow-hidden">
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="text-9xl font-serif font-bold text-brand-blue">GG</div>
      </div>
      
      {/* Certificate header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-brand-blue">Grammer's Gallery</h1>
        <div className="h-1 w-32 bg-brand-teal mx-auto my-4"></div>
        <h2 className="text-2xl text-gray-600">
          {type === 'enrollment' ? 'Certificate of Enrollment' : 'Certificate of Completion'}
        </h2>
      </div>
      
      {/* Certificate content */}
      <div className="text-center mb-12">
        <p className="text-lg mb-4">This is to certify that</p>
        <h3 className="text-3xl font-serif font-bold text-gray-800 mb-4">{studentName}</h3>
        <p className="text-lg mb-6">
          {type === 'enrollment' 
            ? `has successfully enrolled in the course` 
            : `has successfully completed the ${testName || 'course'}`}
        </p>
        <h3 className="text-2xl font-serif font-bold text-brand-teal mb-6">
          "{courseTitle}"
        </h3>
        
        {type === 'completion' && score !== undefined && grade && (
          <div className="flex justify-center items-center space-x-12 mb-6">
            <div>
              <span className="block text-gray-600">Score</span>
              <span className="text-xl font-bold">{score}%</span>
            </div>
            <div>
              <span className="block text-gray-600">Grade</span>
              <span className="text-xl font-bold">{grade}</span>
            </div>
          </div>
        )}
        
        <p className="text-lg">
          Student ID: <span className="font-medium">{studentId}</span>
        </p>
        <p className="text-lg">
          {type === 'enrollment' ? 'Enrollment Date' : 'Completion Date'}: <span className="font-medium">{formattedDate}</span>
        </p>
      </div>
      
      {/* Certificate footer */}
      <div className="flex justify-between items-end mt-16">
        <div className="text-center w-48">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-serif text-gray-600">Administrator</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-contain bg-center bg-no-repeat mb-2" 
            style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
          <p className="text-sm text-gray-500">Official Seal</p>
        </div>
        
        <div className="text-center w-48">
          <div className="border-t border-gray-400 pt-2">
            <p className="font-serif text-gray-600">Instructor</p>
          </div>
        </div>
      </div>
      
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .certificate-container, .certificate-container * {
              visibility: visible;
            }
            .certificate-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              border: none;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Certificate;
