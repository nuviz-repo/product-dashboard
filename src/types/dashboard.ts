export interface Product {
  sku_name: string;
}

export interface InteractionProduct {
  id: number;
  total_time: number;
  take_away: boolean;
  put_back: boolean;
  product: Product;
}

export interface Interaction {
  id: number;
  visualization_flag: boolean;
  interaction_products: InteractionProduct[];
}

export interface Session {
  id: number;
  recording_started_at: string;
  recording_finished_at: string;
  interactions: Interaction[];
}

export interface ImpressionProduct {
  id: number;
  product: Product;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface DashboardMetrics {
  totalTime: number;
  impressionsCount: number;
  visualizationCount: number;
  takeAwayCount: number;
  putBackCount: number;
  timelineData: Array<{ name: string; time: number }>;
}