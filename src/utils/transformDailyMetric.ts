interface ProductMetrics {
    interactions: number;
    visualizations: number;
    impressions: number;
    take_aways: number;
    put_backs: number;
  }
  
  interface DailyMetric {
    date: string;
    period: string;
    weekDay: string;
    metrics: {
      by_product: {
        [key: string]: ProductMetrics;
      };
      by_category: { [key: string]: any };
      by_brand: { [key: string]: any };
    };
  }
  
  interface PeriodStats {
    count: number;
    sum: number;
    avg: number;
    max: number;
    min: number;
  }
  
  interface DayPeriodData {
    [day: string]: {
      MORNING: PeriodStats;
      AFTERNOON: PeriodStats;
      EVENING: PeriodStats;
    };
  }
  
  interface AggregatedMetrics {
    pickUps: DayPeriodData;
    takeAways: DayPeriodData;
    putBacks: DayPeriodData;
    impressions: DayPeriodData;
    visualizations: DayPeriodData;
  }
  
  interface AggregatedRecord {
    weekDay: string;
    period: string;
    metrics: ProductMetrics;
  }
  
  export const processMetrics = (data: DailyMetric[]): AggregatedMetrics => {
    // Step 1: Aggregate metrics within each record
    const aggregatedRecords = data.map(record => {
      if (!record.metrics.by_product || Object.keys(record.metrics.by_product).length === 0) {
        return null;
      }
  
      const products = Object.values(record.metrics.by_product);
      const aggregated = products.reduce((acc: ProductMetrics, product: ProductMetrics): ProductMetrics => ({
        interactions: acc.interactions + product.interactions,
        visualizations: acc.visualizations + product.visualizations,
        impressions: acc.impressions + product.impressions,
        take_aways: acc.take_aways + product.take_aways,
        put_backs: acc.put_backs + product.put_backs
      }), {
        interactions: 0,
        visualizations: 0,
        impressions: 0,
        take_aways: 0,
        put_backs: 0
      });
  
      return {
        weekDay: record.weekDay,
        period: record.period,
        metrics: aggregated
      };
    }).filter((record): record is AggregatedRecord => record !== null);
  
    // Step 2: Group by weekDay + period
    const groupedData = aggregatedRecords.reduce<{ [key: string]: AggregatedRecord[] }>((acc, record) => {
      const key = `${record.weekDay}_${record.period}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
      return acc;
    }, {});
  
    const calculateStats = (values: number[] | undefined): PeriodStats | null => {
      if (!values || values.length === 0) return null;
      
      const sum = values.reduce((a, b) => a + b, 0);
      return {
        count: values.length,
        sum: sum,
        avg: sum / values.length,
        max: Math.max(...values),
        min: Math.min(...values)
      };
    };
  
    const result: AggregatedMetrics = {
      pickUps: {},
      takeAways: {},
      putBacks: {},
      impressions: {},
      visualizations: {}
    };
  
    // Initialize structure for each day
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;
    const periods = ['MORNING', 'AFTERNOON', 'EVENING'] as const;
  
    days.forEach(day => {
      result.pickUps[day] = {} as any;
      result.takeAways[day] = {} as any;
      result.putBacks[day] = {} as any;
      result.impressions[day] = {} as any;
      result.visualizations[day] = {} as any;
  
      periods.forEach(period => {
        const groupKey = `${day}_${period}`;
        const groupData = groupedData[groupKey] || [];
        
        const stats = {
          pickUps: calculateStats(groupData.map(r => r.metrics.interactions)),
          takeAways: calculateStats(groupData.map(r => r.metrics.take_aways)),
          putBacks: calculateStats(groupData.map(r => r.metrics.put_backs)),
          impressions: calculateStats(groupData.map(r => r.metrics.impressions)),
          visualizations: calculateStats(groupData.map(r => r.metrics.visualizations))
        };
  
        // Ensure each period has a value, even if no data exists
        const defaultStats: PeriodStats = { count: 0, sum: 0, avg: 0, max: 0, min: 0 };
        result.pickUps[day][period] = stats.pickUps || defaultStats;
        result.takeAways[day][period] = stats.takeAways || defaultStats;
        result.putBacks[day][period] = stats.putBacks || defaultStats;
        result.impressions[day][period] = stats.impressions || defaultStats;
        result.visualizations[day][period] = stats.visualizations || defaultStats;
      });
    });
  
    return result;
  };