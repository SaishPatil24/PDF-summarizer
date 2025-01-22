import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Chat } from './components/Chat';
import { FileText } from 'lucide-react';
import type { ChatState } from './types';

function App() {
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const handleFileSelect = (text: string) => {
    setPdfContent(text);
    setChatState(prev => ({
      ...prev,
      messages: [
        {
          role: 'assistant',
          content: 'PDF loaded successfully! Feel free to ask me any questions about its contents.'
        }
      ]
    }));
  };

  const handleSendMessage = async (message: string) => {
    if (!pdfContent) return;

    setChatState(prev => ({
      ...prev,
      isLoading: true,
      messages: [...prev.messages, { role: 'user', content: message }]
    }));

    try {
      // Here you would typically make an API call to your AI service
      // For now, we'll just echo back a response
      const response = "I've received your question about the PDF. Please note that this is a demo response. In a production environment, this would be connected to an AI service to provide real answers about the PDF content.";

      setChatState(prev => ({
        isLoading: false,
        messages: [...prev.messages, { role: 'assistant', content: response }]
      }));
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatState(prev => ({
        isLoading: false,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error processing your request.'
          }
        ]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-blue-500 text-white flex items-center space-x-2">
          <FileText className="w-6 h-6" />
          <h1 className="text-xl font-bold">PDF AI Chat Assistant</h1>
        </div>
        
        <div className="p-6">
          {!pdfContent ? (
            <FileUpload onFileSelect={handleFileSelect} />
          ) : (
            <div className="h-[600px]">
              <Chat
                messages={chatState.messages}
                onSendMessage={handleSendMessage}
                isLoading={chatState.isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;