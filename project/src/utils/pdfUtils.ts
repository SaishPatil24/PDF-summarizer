import * as pdfjsLib from 'pdfjs-dist';
import PDFWorker from 'pdfjs-dist/build/pdf.worker.min?url';

// Use the bundled worker instead of CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      // Disable worker termination to handle large files
      disableAutoFetch: false,
      disableStream: false,
      rangeChunkSize: 65536, // 64KB chunks for efficient streaming
    }).promise;

    let fullText = '';
    const totalPages = pdf.numPages;

    // Process pages in chunks to avoid memory issues
    const CHUNK_SIZE = 10;
    for (let i = 0; i < totalPages; i += CHUNK_SIZE) {
      const pagePromises = [];
      const end = Math.min(i + CHUNK_SIZE, totalPages);
      
      for (let pageNum = i + 1; pageNum <= end; pageNum++) {
        pagePromises.push(processPage(pdf, pageNum));
      }
      
      const pageTexts = await Promise.all(pagePromises);
      fullText += pageTexts.join('\n');
    }

    return fullText;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF. The file might be corrupted or password protected.');
  }
}

async function processPage(pdf: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<string> {
  try {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    return pageText;
  } catch (error) {
    console.error(`Error processing page ${pageNum}:`, error);
    return `[Error processing page ${pageNum}]`;
  }
}