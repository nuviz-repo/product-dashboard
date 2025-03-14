import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle, Send, TrendingUp, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chatService } from '../services/chatService';
import { Message, ChatComponentProps, TimelineDataForChat, BaseTimelineDataPerMetric } from "@/types/chat";
import { TIMELINE_SECTIONS } from './TimelineSection';
import { useDashboard } from '@/contexts/DashboardContext';

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

const impressionSectionData = TIMELINE_SECTIONS.filter(section => section.id == "product-impressions")
const interactionSectionData = TIMELINE_SECTIONS.filter(section => section.id == "product-interaction")
const visualizationSectionData = TIMELINE_SECTIONS.filter(section => section.id == "product-visualization")
const takeawaySectionData = TIMELINE_SECTIONS.filter(section => section.id == "product-takeaway")
const putbackSectionData = TIMELINE_SECTIONS.filter(section => section.id == "product-putback")

const ChatComponent: React.FC<ChatComponentProps> = ({ 
  impressions, 
  visualizations, 
  interactions, 
  takeaways, 
  putbacks,
  dailyMetric,
  defaultOpen = false,
  isInline = false,
  className = '',
}) => {
  const { dashboardState: { chatMessages }, setChatMessages } = useDashboard();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const saveScrollPosition = () => {
    if (chatContainerRef.current) {
      scrollPosition.current = chatContainerRef.current.scrollTop;
    }
  };

  const restoreScrollPosition = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = scrollPosition.current;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [])

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  const timelineData: TimelineDataForChat = {
    impressions: {
      name: impressionSectionData[0].title,
      description: impressionSectionData[0].tooltip,
      data: impressions
    } as BaseTimelineDataPerMetric,
    visualizations: {
      name: visualizationSectionData[0].title,
      description: visualizationSectionData[0].tooltip,
      data: visualizations
    } as BaseTimelineDataPerMetric,
    interactions: {
      name: interactionSectionData[0].title,
      description: interactionSectionData[0].tooltip,
      data: interactions
    } as BaseTimelineDataPerMetric,
    takeaways: {
      name: takeawaySectionData[0].title,
      description: takeawaySectionData[0].tooltip,
      data: takeaways
    } as BaseTimelineDataPerMetric,
    putbacks: {
      name: putbackSectionData[0].title,
      description: putbackSectionData[0].tooltip,
      data: putbacks
    } as BaseTimelineDataPerMetric
  };

  // Function to auto-resize textarea based on content
  const autoResizeTextarea = useCallback(() => {
    if (inputRef.current) {
      // Remember scroll position
      const scrollTop = inputRef.current.scrollTop;
      
      // Reset height to auto to get the correct scrollHeight
      inputRef.current.style.height = 'auto';
      
      // Calculate new height (capped at 150px max height)
      const newHeight = Math.min(inputRef.current.scrollHeight, 150);
      
      // Set the new height
      inputRef.current.style.height = `${newHeight}px`;
      
      // Restore scroll position
      inputRef.current.scrollTop = scrollTop;
      
      // Check if we've reached max height
      return newHeight >= 150;
    }
    return false;
  }, []);

  // Function to scroll textarea to cursor position
  const scrollTextareaToPosition = useCallback((position: number) => {
    if (!inputRef.current) return;
    
    // Create a dummy div with the same styling as the textarea
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.height = 'auto';
    div.style.width = inputRef.current.clientWidth + 'px';
    div.style.fontSize = window.getComputedStyle(inputRef.current).fontSize;
    div.style.padding = window.getComputedStyle(inputRef.current).padding;
    div.style.lineHeight = window.getComputedStyle(inputRef.current).lineHeight;
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordBreak = 'break-word';
    div.style.overflowWrap = 'break-word';
    
    // Get text up to the cursor
    const text = inputRef.current.value.substring(0, position);
    div.textContent = text;
    
    // Append the div to the body to calculate its height
    document.body.appendChild(div);
    const cursorTop = div.offsetHeight;
    document.body.removeChild(div);
    
    // Calculate if cursor is out of view
    const scrollTop = inputRef.current.scrollTop;
    const textareaHeight = inputRef.current.clientHeight;
    
    // If cursor is below view, scroll down
    if (cursorTop > scrollTop + textareaHeight - 20) { // 20px padding
      inputRef.current.scrollTop = cursorTop - textareaHeight + 20;
    }
    // If cursor is above view, scroll up
    else if (cursorTop < scrollTop) {
      inputRef.current.scrollTop = cursorTop;
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const cursorPosition = e.target.selectionStart;
    
    // Save chat scroll position
    saveScrollPosition();
    
    setInput(e.target.value);
    
    // Use requestAnimationFrame to ensure DOM update happens before handling cursor
    requestAnimationFrame(() => {
      if (inputRef.current && cursorPosition !== null) {
        // Set cursor position
        inputRef.current.selectionStart = cursorPosition;
        inputRef.current.selectionEnd = cursorPosition;
        inputRef.current.focus();
        
        // First resize the textarea (auto-resize happens in the effect, but we need it here too for immediate feedback)
        const isAtMaxHeight = autoResizeTextarea();
        
        // Only scroll to cursor if we're at max height
        if (isAtMaxHeight) {
          scrollTextareaToPosition(cursorPosition);
        }
      }
      
      // Restore chat container scroll position
      restoreScrollPosition();
    });
  }, [restoreScrollPosition, scrollTextareaToPosition, autoResizeTextarea]);

  const handleSuggestionClick = async (prompt: string) => {
    setIsLoading(true);
    try {
      const userMessage: Message = { 
        role: 'user' as const, 
        content: prompt 
      };
      setChatMessages([userMessage]);

      const aiResponse = await chatService.initialize(prompt, timelineData, dailyMetric);
      setChatMessages([
        userMessage,
        { role: 'assistant' as const, content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error with suggestion:', error);
      setChatMessages([
        { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    saveScrollPosition();
    
    // Add new line on Command+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      
      const cursorPosition = e.currentTarget.selectionStart;
      const newValue = input.substring(0, cursorPosition) + '\n' + input.substring(cursorPosition);
      
      setInput(newValue);
      
      // Position cursor after the newly inserted line break
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const newCursorPosition = cursorPosition + 1;
          inputRef.current.selectionStart = newCursorPosition;
          inputRef.current.selectionEnd = newCursorPosition;
          inputRef.current.focus();
          
          // First resize the textarea
          const isAtMaxHeight = autoResizeTextarea();
          
          // Only scroll to cursor if we're at max height
          if (isAtMaxHeight) {
            scrollTextareaToPosition(newCursorPosition);
          }
        }
        restoreScrollPosition();
      });
    }
  }, [input, restoreScrollPosition, scrollTextareaToPosition, autoResizeTextarea]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setIsLoading(true);
      saveScrollPosition();

      try {
        if (chatMessages.length === 0) {
          const aiResponse = await chatService.initialize(userMessage, timelineData, dailyMetric);
          const newMessages: Message[] = [
            { role: 'user' as const, content: userMessage },
            { role: 'assistant' as const, content: aiResponse }
          ];
          setChatMessages(newMessages);
        } else {
          const updatedMessages: Message[] = [
            ...chatMessages, 
            { role: 'user' as const, content: userMessage }
          ];
          setChatMessages(updatedMessages);

          const aiResponse = await chatService.sendMessage(
            userMessage,
            timelineData,
            dailyMetric,
            updatedMessages
          );
          
          setChatMessages([
            ...updatedMessages, 
            { role: 'assistant' as const, content: aiResponse }
          ]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setChatMessages([
          ...chatMessages,
          { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }
        ]);
      } finally {
        setIsLoading(false);
        setTimeout(scrollToBottom, 0);
      }
    }
  }, [input, isLoading, chatMessages, timelineData, dailyMetric, setChatMessages, scrollToBottom]);

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
      <div 
        className="flex-1 overflow-y-auto" 
        ref={chatContainerRef}
        onScroll={() => saveScrollPosition()}
      >
        {chatMessages.length === 0 ? (
          <SuggestionsView />
        ) : (
          <div className="flex flex-col space-y-4 p-4">
            {chatMessages.map((message, index) => (
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
          <textarea
            rows={1}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your product metrics... (Cmd+Enter for new line)"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
            style={{ minHeight: '40px', maxHeight: '150px' }}
            disabled={isLoading}
            autoFocus
            ref={inputRef}
            onKeyDown={handleKeyDown}
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
      <div className={`flex flex-col border rounded-md bg-white shadow-lg overflow-hidden ${className}`}>
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