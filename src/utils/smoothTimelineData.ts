export interface TimeChartProps {
    data: Array<{
      interaction_time: string;
      product: string;
      interactions: number;
    }>;
    timeRange: {
      start: string;
      end: string;
    };
    intervalMinutes?: number;
    title?: string;
  }

// Constants for interval calculation
const TARGET_DATA_POINTS = 150;
const INTERVAL_SCALES = [
  { maxHours: 24, minutes: 5 },    // < 24 hours: 5-minute intervals
  { maxHours: 72, minutes: 30 },   // 1-3 days: 30-minute intervals
  { maxHours: 168, minutes: 120 }, // 3-7 days: 2-hour intervals
  { maxHours: 336, minutes: 360 }, // 7-14 days: 6-hour intervals
  { maxHours: Infinity, minutes: 720 } // > 14 days: 12-hour intervals
];

// Helper function to round to nearest interval
function roundToNearestInterval(minutes: number): number {
  const commonIntervals = [5, 15, 30, 60, 120, 240, 360, 720, 1440];
  return commonIntervals.reduce((prev, curr) => {
    return Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev;
  });
}

function calculateDynamicInterval(timeRange: TimeChartProps['timeRange']): number {
  const start = new Date(timeRange.start);
  const end = new Date(timeRange.end);
  const rangeDurationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  
  // Calculate ideal interval based on target data points
  const idealIntervalMinutes = (rangeDurationHours * 60) / TARGET_DATA_POINTS;
  
  // Find the base interval from our scale
  const baseInterval = INTERVAL_SCALES.find(scale => rangeDurationHours <= scale.maxHours)?.minutes || 720;
  
  // Round to nearest logical interval
  const roundedInterval = roundToNearestInterval(idealIntervalMinutes);
  
  // Use the larger of the two to ensure we don't have too many points
  const finalInterval = Math.max(roundedInterval, baseInterval);
  
  return finalInterval;
}

export default function smoothData(data: TimeChartProps['data'], timeRange: TimeChartProps['timeRange']) {
  const intervalMinutes = calculateDynamicInterval(timeRange);
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // Group data by interval and product
  const groupedData = data.reduce((acc, entry) => {
    const timestamp = new Date(entry.interaction_time).getTime();
    const intervalStart = Math.floor(timestamp / intervalMs) * intervalMs;
    const key = `${intervalStart}-${entry.product}`;
    
    if (!acc[key]) {
      acc[key] = {
        timestamp: new Date(intervalStart).toISOString(),
        product: entry.product,
        interactions: 0
      };
    }
    acc[key].interactions += entry.interactions;
    return acc;
  }, {} as Record<string, { timestamp: string; product: string; interactions: number; }>);

  // Convert to array and reorganize for Recharts
  const timeIntervals = [...new Set(Object.values(groupedData).map(d => d.timestamp))].sort();
  const products = [...new Set(data.map(d => d.product))];
  
  return timeIntervals.map(timestamp => {
    const point = { timestamp };
    products.forEach(product => {
      const key = `${new Date(timestamp).getTime()}-${product}`;
      point[product] = groupedData[key]?.interactions || 0;
    });
    return point;
  });
}