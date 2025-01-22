import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (text: string) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setProgress('Processing PDF...');

      const { extractTextFromPDF } = await import('../utils/pdfUtils');
      const text = await extractTextFromPDF(file);
      
      onFileSelect(text);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert(error instanceof Error ? error.message : 'Error processing PDF. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
          isProcessing ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isProcessing ? (
            <>
              <Loader2 className="w-8 h-8 mb-2 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">{progress}</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF files only (no size limit)</p>
            </>
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </label>
    </div>
  );
}