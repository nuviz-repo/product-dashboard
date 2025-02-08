export interface DateRange {
    startDate?: string;
    endDate?: string;
  }
  
export interface TimelineDataPoint {
      timestamp: string;
      values: { [key: string]: number };
  }
  
export interface TimelineResponse {
    pickupTimeline: TimelineDataPoint[];
    impressionsTimeline: TimelineDataPoint[];
    visualizationTimeline: TimelineDataPoint[];
    putbackTimeline: TimelineDataPoint[];
    takeawayTimeline: TimelineDataPoint[];
  }
  
export interface ProcessedTimelinePoint {
      timestamp: string;
      [key: string]: string | number;
  }
    
export interface ProcessedTimelineData {
      pickUpTimeline: ProcessedTimelinePoint[];
      takeAwayTimeline: ProcessedTimelinePoint[];
      putBackTimeline: ProcessedTimelinePoint[];
      impressionsTimeline: ProcessedTimelinePoint[];
      visualizationsTimeline: ProcessedTimelinePoint[];
  }
  
export interface DailyMetric {
    date: string;
    period: string;
    metrics: {
      by_product: {
        [key: string]: {
          interactions: number;
          visualizations: number;
          impressions: number;
          take_aways: number;
          put_backs: number;
        };
      };
      by_category: { [key: string]: any };
      by_brand: { [key: string]: any };
    };
  }

export interface DayPeriodData {
  [day: string]: {
    MORNING: PeriodStats;
    AFTERNOON: PeriodStats;
    EVENING: PeriodStats;
  };
}

interface PeriodStats {
    count: number;
    sum: number;
    avg: number;
    max: number;
    min: number;
}