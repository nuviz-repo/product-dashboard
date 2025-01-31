import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  getInteractionProducts,
  getVisualizationProducts,
  getImpressionProducts,
} from '@/services/api';
import aggregateTimelineDataByDayPeriod from '@/utils/calculateAggregateData';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface PeriodStats {
  count: number;
  sum: number;
  avg: number;
  max: number;
  min: number;
  median: number;
  products: {
    [key: string]: {
      count: number;
      sum: number;
      avg: number;
      max: number;
      min: number;
      median: number;
    };
  };
}

export interface DayPeriodData {
  [day: string]: {
    MORNING: PeriodStats;
    AFTERNOON: PeriodStats;
    EVENING: PeriodStats;
  };
}

export const useDashboardData = (dateRange?: DateRange, selectedSkuNames?: string[]) => {
  const fetchMetrics = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) {
      return null;
    }

    const request = {
      start_date: format(new Date(dateRange.startDate), 'yyyy-MM-dd'),
      end_date: format(new Date(dateRange.endDate), 'yyyy-MM-dd'),
      sku_names: selectedSkuNames || []
    };

    const [interactions, visualizations, impressions] = await Promise.all([
      getInteractionProducts(request),
      getVisualizationProducts(request),
      getImpressionProducts(request)
    ]);

    // Get pipeline data
    const takeAwaysCount = interactions.filter(interaction => interaction.take_away).length;
    const pipelineData = {
      impressionsCount: impressions.length + interactions.length, // All interactions are considered impression
      visualizationsCount: visualizations.length,
      interactionsCount: interactions.length,
      takeAwayCount: takeAwaysCount,
      putBackCount: interactions.length - takeAwaysCount
    };

    // Process timeline data
    const timelineData = {
      pickUpTimeline: interactions.map(interaction => ({
        interaction_time: interaction.recording_started_at,
        product: interaction.sku_name,
        interactions: interaction.total_time
      })),
      takeAwayTimeline: interactions.filter(i => i.take_away).map(interaction => ({
        interaction_time: interaction.recording_started_at,
        product: interaction.sku_name,
        interactions: 1
      })),
      putBackTimeline: interactions.filter(i => !i.take_away).map(interaction => ({
        interaction_time: interaction.recording_started_at,
        product: interaction.sku_name,
        interactions: 1
      })),
      impressionsTimeline: impressions.map(impression => ({
        interaction_time: impression.recording_started_at,
        product: impression.sku_name,
        interactions: impression.impressions
      })),
      visualizationsTimeline: visualizations.map(visualization => ({
        interaction_time: visualization.recording_started_at,
        product: visualization.sku_name,
        interactions: visualization.total_time
      }))
    };

    // Aggregate data by day and period
    const aggregatedData = {
      pickUps: aggregateTimelineDataByDayPeriod(timelineData.pickUpTimeline),
      takeAways: aggregateTimelineDataByDayPeriod(timelineData.takeAwayTimeline),
      putBacks: aggregateTimelineDataByDayPeriod(timelineData.putBackTimeline),
      impressions: aggregateTimelineDataByDayPeriod(timelineData.impressionsTimeline),
      visualizations: aggregateTimelineDataByDayPeriod(timelineData.visualizationsTimeline)
    };

    console.log(aggregatedData)

    return {
      pipelineData,
      timelineData,
      aggregatedData
    };
  };

  return useQuery({
    queryKey: ['dashboardData', dateRange, selectedSkuNames],
    queryFn: fetchMetrics,
    enabled: !!dateRange?.startDate && !!dateRange?.endDate
  });
};
