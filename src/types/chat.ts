import { ProductInteractionDisplay } from "@/utils/calculateAggregateData";

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
}