// src/services/chatService.ts
import { ChatResponse, Message, TimelineData } from "@/types/chat";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export const chatService = {
    initialize: async (message: string, data: TimelineData): Promise<string> => {
        try {
            const response = await fetch(`${API_URL}/chat/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message,
                    data 
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
        data: TimelineData, 
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