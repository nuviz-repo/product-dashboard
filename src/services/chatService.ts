// src/services/chatService.ts
import { DailyMetric } from "@/types/api";
import { ChatResponse, Message, TimelineData, TimelineDataForChat } from "@/types/chat";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

// const API_URL = import.meta.env.VITE_API_URL || 'https://chat-api.nuviz.com.br/api';

export const chatService = {
    initialize: async (message: string, data: TimelineDataForChat, dailyMetric: DailyMetric[]): Promise<string> => {
        try {
            const response = await fetch(`${API_URL}/chat/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message,
                    data,
                    daily_metric_data: dailyMetric
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const result: ChatResponse = await response.json();
            return result.message;
        } catch (error) {
            console.error('Error initializing chat:', error);
            throw error;
        }
    },

    sendMessage: async (
        message: string, 
        data: TimelineDataForChat,
        dailyMetric: DailyMetric[],
        conversation: Message[]
    ): Promise<string> => {
        try {
            const response = await fetch(`${API_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    data,
                    daily_metric_data: dailyMetric,
                    conversation
                })
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const result: ChatResponse = await response.json();
            return result.message;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
};