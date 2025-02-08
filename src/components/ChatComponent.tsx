import React, { useState } from 'react';
import { MessageCircle, Send, TrendingUp, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chatService } from '../services/chatService';
import { ChatModalProps, Message, TimelineData, ChatComponentProps } from "@/types/chat";

const INITIAL_SUGGESTIONS = [
  {
    icon: TrendingUp,
    title: "Analyze Product Performance",
    prompt: "Can you analyze the product performance trends and highlight any significant patterns or insights from the data?"
  },
  {
    icon: Search,
    title: "Identify Key Metrics",
    prompt: "What are the key metrics and what do they tell us about customer behavior and product engagement?"
  }
];

const ChatComponent: React.FC<ChatComponentProps> = ({ 
  impressions, 
  visualizations, 
  interactions, 
  takeaways, 
  putbacks,
  defaultOpen = false,
  isInline = false,
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const timelineData = {
    impressions,
    visualizations,
    interactions,
    takeaways,
    putbacks
  };

  const handleSuggestionClick = async (prompt: string) => {
    setIsLoading(true);
    try {
      // Add user message immediately
      const userMessage: Message = { 
        role: 'user' as const, 
        content: prompt 
      };
      setMessages([userMessage]);

      // Get AI response through initialize
      const aiResponse = await chatService.initialize(prompt, timelineData);
      setMessages([
        userMessage,
        { role: 'assistant' as const, content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error with suggestion:', error);
      setMessages([
        { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setIsLoading(true);

      try {
        if (messages.length === 0) {
          // First message - use initialize
          const aiResponse = await chatService.initialize(userMessage, timelineData);
          const newMessages: Message[] = [
            { role: 'user' as const, content: userMessage },
            { role: 'assistant' as const, content: aiResponse }
          ];
          setMessages(newMessages);
        } else {
          // Subsequent messages - use sendMessage
          const updatedMessages: Message[] = [
            ...messages, 
            { role: 'user' as const, content: userMessage }
          ];
          setMessages(updatedMessages);

          const aiResponse = await chatService.sendMessage(
            userMessage,
            timelineData,
            updatedMessages
          );
          
          setMessages([
            ...updatedMessages, 
            { role: 'assistant' as const, content: aiResponse }
          ]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages([
          ...messages,
          { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const SuggestionsView = () => (
    <div className="flex flex-col space-y-4 p-4">
      {INITIAL_SUGGESTIONS.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion.prompt)}
          className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          disabled={isLoading}
        >
          <suggestion.icon className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium">{suggestion.title}</h3>
            <p className="text-sm text-gray-600">{suggestion.prompt}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const ChatContent = () => (
    <>
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <SuggestionsView />
        ) : (
          <div className="flex flex-col space-y-4 p-4">
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
                  } whitespace-pre-line`}
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
        )}
      </div>

      <div className="flex-none border-t bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2 p-4">
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
      </div>
    </>
  );

  if (isInline) {
    return (
      <div className={`flex flex-col border rounded-lg bg-white shadow-lg ${className}`}>
        <div className="flex-none p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Product Analytics Assistant</h2>
        </div>
        <ChatContent />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Product Analytics Assistant</DialogTitle>
        </DialogHeader>
        <ChatContent />
      </DialogContent>
    </Dialog>
  );
};

export default ChatComponent;