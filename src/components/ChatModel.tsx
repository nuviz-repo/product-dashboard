import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chatService } from '../services/chatService';
import { ChatModalProps, Message, TimelineData } from "@/types/chat";

const ChatModal: React.FC<ChatModalProps> = ({ 
  impressions, 
  visualizations, 
  interactions, 
  takeaways, 
  putbacks
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const timelineData: TimelineData = {
    impressions,
    visualizations,
    interactions,
    takeaways,
    putbacks
  };

  const handleModalOpen = async (open: boolean) => {
    setIsOpen(open);
    if (open && messages.length === 0) {
      try {
        setIsLoading(true);
        const initialMessage = await chatService.initialize(timelineData);
        setMessages([{ role: 'assistant', content: initialMessage }]);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm ready to analyze your product data. What would you like to know?"
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setIsLoading(true);

      try {
        // Add user message immediately
        const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(updatedMessages);

        // Get AI response
        const aiResponse = await chatService.sendMessage(
          userMessage,
          timelineData,
          updatedMessages
        );
        
        // Add AI response
        setMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages([
          ...messages,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpen}>
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