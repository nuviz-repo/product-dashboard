import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    getTimelineData,
    getDailyMetrics,
  } from '@/services/api';
import { processMetrics } from '@/utils/transformDailyMetric';
import { DateRange, ProcessedTimelineData, ProcessedTimelinePoint, TimelineDataPoint } from '@/types/api';

// Keeping the same interval calculation logic
const TARGET_DATA_POINTS = 150;
const INTERVAL_SCALES = [
  { maxHours: 24, minutes: 5 },    // < 24 hours: 5-minute intervals
  { maxHours: 72, minutes: 30 },   // 1-3 days: 30-minute intervals
  { maxHours: 168, minutes: 120 }, // 3-7 days: 2-hour intervals
  { maxHours: 336, minutes: 360 }, // 7-14 days: 6-hour intervals
  { maxHours: Infinity, minutes: 720 } // > 14 days: 12-hour intervals
];

function roundToNearestInterval(minutes: number): number {
  const commonIntervals = [5, 15, 30, 60, 120, 240, 360, 720, 1440];
  return commonIntervals.reduce((prev, curr) => {
    return Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev;
  });
}

function calculateDynamicInterval(startDate: Date, endDate: Date): number {
  const rangeDurationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  
  // Calculate ideal interval based on target data points
  const idealIntervalMinutes = (rangeDurationHours * 60) / TARGET_DATA_POINTS;
  
  // Find the base interval from our scale
  const baseInterval = INTERVAL_SCALES.find(scale => rangeDurationHours <= scale.maxHours)?.minutes || 720;
  
  // Round to nearest logical interval
  const roundedInterval = roundToNearestInterval(idealIntervalMinutes);
  
  // Use the larger of the two to ensure we don't have too many points
  return Math.max(roundedInterval, baseInterval);
}

export const useProcessedDashboardData = (dateRange?: DateRange, selectedSkuNames?: string[]) => {
  const fetchMetrics = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) {
      return null;
    }

    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const interval = calculateDynamicInterval(startDate, endDate);

    const timelineRequest = {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      interval,
      sku_names: selectedSkuNames || []
    };

    const dailyMetricsRequest = {
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      sku_names: selectedSkuNames || []
    }

    const [timelineData, dailyMetricsData] = await Promise.all([
        getTimelineData(timelineRequest), getDailyMetrics(dailyMetricsRequest)
    ]);

    // Calculate pipeline data from daily metrics
    const pipelineData = dailyMetricsData.reduce((acc, metric) => {
      Object.values(metric.metrics.by_product).forEach(productMetrics => {
        acc.impressionsCount += productMetrics.impressionsCount + productMetrics.impressionsCount;
        acc.visualizationsCount += productMetrics.visualizationsCount + productMetrics.impressionsCount;
        acc.interactionsCount += productMetrics.interactionsCount;
        acc.takeAwayCount += productMetrics.take_aways;
        acc.putBackCount += productMetrics.put_backs;
      });
      return acc;
    }, {
      impressionsCount: 0,
      visualizationsCount: 0,
      interactionsCount: 0,
      takeAwayCount: 0,
      putBackCount: 0
    });

    const transformTimelineData = (data: TimelineDataPoint[]): ProcessedTimelinePoint[] => {
        return data.map(dataPoint => {
          const transformedPoint: ProcessedTimelinePoint = {
            timestamp: dataPoint.timestamp
          };
          // Add each product value to the root of the object
          Object.entries(dataPoint.values).forEach(([key, value]) => {
            transformedPoint[key] = value;
          });
          return transformedPoint;
        });
    };
  
    const processedTimelineData: ProcessedTimelineData = {
        pickUpTimeline: transformTimelineData(timelineData.pickupTimeline),
        takeAwayTimeline: transformTimelineData(timelineData.takeawayTimeline),
        putBackTimeline: transformTimelineData(timelineData.putbackTimeline),
        impressionsTimeline: transformTimelineData(timelineData.impressionsTimeline),
        visualizationsTimeline: transformTimelineData(timelineData.visualizationTimeline)
    };

    return {
      pipelineData,
      timelineData: processedTimelineData,
      aggregatedData: processMetrics(dailyMetricsData)
    };
  };

  return useQuery({
    queryKey: ['processedDashboardData', dateRange, selectedSkuNames],
    queryFn: fetchMetrics,
    enabled: !!dateRange?.startDate && !!dateRange?.endDate
  });
};
