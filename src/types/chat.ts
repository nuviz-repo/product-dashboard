// src/types/chat.ts
import { ProductInteractionDisplay } from "@/utils/calculateAggregateData";
import { LucideIcon } from 'lucide-react';

export interface TimelineData {
    impressions: ProductInteractionDisplay[];
    visualizations: ProductInteractionDisplay[];
    interactions: ProductInteractionDisplay[];
    takeaways: ProductInteractionDisplay[];
    putbacks: ProductInteractionDisplay[];
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    message: string;
}

export interface ChatModalProps {
    impressions: ProductInteractionDisplay[];
    visualizations: ProductInteractionDisplay[];
    interactions: ProductInteractionDisplay[];
    takeaways: ProductInteractionDisplay[];
    putbacks: ProductInteractionDisplay[];
    defaultOpen?: boolean; // Made optional
}

// New interfaces for the suggestions feature
export interface ChatSuggestion {
    icon: LucideIcon;
    title: string;
    prompt: string;
}

// Extended props interface for the ChatComponent
export interface ChatComponentProps extends ChatModalProps {
    isInline?: boolean;
    className?: string;
}