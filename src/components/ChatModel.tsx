import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// TypeScript interfaces (if you're using TS)
/*
interface DataProps {
  impressions: Array<{ date: string; value: number }>;
  visualizations: Array<{ date: string; value: number }>;
  interactions: Array<{ date: string; value: number }>;
  takeaways: Array<{ date: string; value: number }>;
  putbacks: Array<{ date: string; value: number }>;
}
*/

const ChatModal = ({ 
  impressions, 
  visualizations, 
  interactions, 
  takeaways, 
  putbacks 
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize chat when modal opens
  const handleModalOpen = (open) => {
    if (open && messages.length === 0) {
      initializeChat();
    }
  };

  // Function to initialize chat with data context
  const initializeChat = async () => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",  // Using Opus for complex data analysis
          messages: [{
            role: "system",
            content: `You are a data analysis assistant. You have access to the following data arrays:
              - Product Impressions: ${JSON.stringify(impressions)}
              - Product Visualizations: ${JSON.stringify(visualizations)}
              - Product Interactions: ${JSON.stringify(interactions)}
              - Product Take Backs: ${JSON.stringify(takeaways)}
              - Product Put Aways: ${JSON.stringify(putbacks)}
              
              Analyze this data to provide insights about product performance, trends, and patterns.
              Focus on providing clear, actionable insights and use specific numbers when relevant.`
          }, {
            role: "assistant",
            content: "Hello! I'm ready to help analyze your product data. What would you like to know about your metrics?"
          }]
        })
      });

      const data = await response.json();
      setMessages([{
        role: 'assistant',
        content: data.content
      }]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm ready to analyze your product data. What would you like to know?"
      }]);
    }
  };

  // Function to send message to Claude API
  const sendMessage = async (userMessage) => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          messages: [
            {
              role: "system",
              content: `You are analyzing product metrics data with the following arrays:
                - Impressions: ${JSON.stringify(impressions)}
                - Visualizations: ${JSON.stringify(visualizations)}
                - Interactions: ${JSON.stringify(interactions)}
                - Take Backs: ${JSON.stringify(takeaways)}
                - Put Aways: ${JSON.stringify(putbacks)}`
            },
            ...messages,
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'I apologize, but I encountered an error analyzing the data. Please try again.';
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setIsLoading(true);

      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      // Get AI response
      const aiResponse = await sendMessage(userMessage);
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleModalOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Product Analytics Assistant</DialogTitle>
        </DialogHeader>
        
        {/* Chat Messages */}
        <div className="flex flex-col space-y-4 h-[400px] overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your product metrics..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white p-2 rounded-lg transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;