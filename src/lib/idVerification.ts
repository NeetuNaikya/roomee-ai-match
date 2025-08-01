// DigiLocker Aadhaar Verification
import axios from 'axios';

export async function getDigilockerAuthUrl() {
  const res = await axios.get('http://localhost:5000/api/digilocker/auth-url');
  return res.data.url;
}

export async function handleDigilockerCallback(code: string) {
  const res = await axios.get(`http://localhost:5000/api/digilocker/callback?code=${code}`);
  return res.data.aadhaar;
}
import { v4 as uuidv4 } from 'uuid';

export interface IDDocument {
  id: string;
  userId: string;
  documentType: 'aadhar' | 'passport' | 'voter_id' | 'driving_license';
  documentNumber: string;
  fullName: string;
  gender: 'female' | 'male' | 'other';
  dateOfBirth: string;
  isVerified: boolean;
  verificationDate?: string;
  extractedData: any;
}

export interface OCRResult {
  documentType: string;
  extractedText: string;
  confidence: number;
  gender?: 'female' | 'male' | 'other';
  name?: string;
  documentNumber?: string;
  dateOfBirth?: string;
}

// Simulated OCR service - In production, use Google Vision API or similar
export const performOCR = async (file: File): Promise<OCRResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        // Simulate OCR processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock OCR results - In production, this would be actual OCR
        const mockResults: OCRResult[] = [
          {
            documentType: 'aadhar',
            extractedText: 'GOVERNMENT OF INDIA\nAadhar\nPriya Sharma\nFEMALE\n1234 5678 9012',
            confidence: 0.95,
            gender: 'female',
            name: 'Priya Sharma',
            documentNumber: '1234 5678 9012',
            dateOfBirth: '15/03/1998'
          },
          {
            documentType: 'passport',
            extractedText: 'REPUBLIC OF INDIA\nPASSPORT\nSarah Chen\nF\nA1234567',
            confidence: 0.92,
            gender: 'female',
            name: 'Sarah Chen',
            documentNumber: 'A1234567',
            dateOfBirth: '22/07/1999'
          }
        ];
        
        // Return a random mock result for demo
        const result = mockResults[Math.floor(Math.random() * mockResults.length)];
        resolve(result);
      } catch (error) {
        reject(new Error('OCR processing failed'));
      }
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};

export const verifyGovernmentID = async (
  file: File,
  userId: string
): Promise<IDDocument> => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum 5MB allowed.');
    }
    
    // Perform OCR
    const ocrResult = await performOCR(file);
    
    // Verify gender is female
    if (ocrResult.gender !== 'female') {
      throw new Error('This platform is exclusively for women. Gender verification failed.');
    }
    
    // Verify document authenticity (confidence threshold)
    if (ocrResult.confidence < 0.8) {
      throw new Error('Document verification failed. Please upload a clear, authentic government ID.');
    }
    
    // Create verified ID document record
    // Verify gender is female
    if (ocrResult.gender !== 'female') {
      throw new Error('This platform is exclusively for women. Gender verification failed.');
    }
    // Aadhaar-specific checks
    if (ocrResult.documentType === 'aadhar') {
      // Check Aadhaar number format (12 digits)
      const aadhaarNum = (ocrResult.documentNumber || '').replace(/\s/g, '');
      const isAadhaarValid = /^\d{12}$/.test(aadhaarNum);
      if (!isAadhaarValid) {
        throw new Error('Invalid Aadhaar number format.');
      }
      // Require DOB
      if (!ocrResult.dateOfBirth) {
        throw new Error('Aadhaar card must contain date of birth.');
      }
      // Require address (simulate by checking extractedText contains "Address" or similar)
      if (!ocrResult.extractedText || !/address|Add|Addr|House|Street|Dist|Pin/i.test(ocrResult.extractedText)) {
        throw new Error('Aadhaar card must contain address.');
      }
      // Check for authenticity (confidence and name)
      if (!ocrResult.name || ocrResult.confidence < 0.8) {
        throw new Error('Aadhaar authenticity check failed. Please upload a clear, original Aadhaar card.');
      }
    } else {
      // Other document authenticity (confidence threshold)
      if (ocrResult.confidence < 0.8) {
        throw new Error('Document verification failed. Please upload a clear, authentic government ID.');
      }
    }
    // Create verified ID document record
    const idDocument: IDDocument = {
      id: uuidv4(),
      userId,
      documentType: ocrResult.documentType as any,
      documentNumber: ocrResult.documentNumber || '',
      fullName: ocrResult.name || '',
      gender: ocrResult.gender,
      dateOfBirth: ocrResult.dateOfBirth || '',
      isVerified: true,
      verificationDate: new Date().toISOString(),
      extractedData: ocrResult
    };
    return idDocument;
  } catch (error) {
    throw error;
  }
}