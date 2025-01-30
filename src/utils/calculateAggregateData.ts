interface ProductInteractionDisplay {
    interaction_time: string;
    product: string;
    interactions: number;
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
  
interface DayStats {
    MORNING: PeriodStats;
    AFTERNOON: PeriodStats;
    EVENING: PeriodStats;
}
  
export interface DayPeriodData {
    [day: string]: {
      MORNING: PeriodStats;
      AFTERNOON: PeriodStats;
      EVENING: PeriodStats;
    };
}

export default function aggregateTimelineDataByDayPeriod(timelineData: ProductInteractionDisplay[]): DayPeriodData {
    // First, group by week, day, and period
    const weeklyData = new Map(); // week -> day -> period -> values
  
    timelineData.forEach(entry => {
      const date = new Date(entry.interaction_time);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      const hour = date.getHours();
      const timeSlot = hour >= 18 ? 'EVENING' : hour >= 12 ? 'AFTERNOON' : 'MORNING';
  
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, new Map());
      }
      const weekData = weeklyData.get(weekKey);
  
      if (!weekData.has(dayOfWeek)) {
        weekData.set(dayOfWeek, new Map());
      }
      const dayData = weekData.get(dayOfWeek);
  
      if (!dayData.has(timeSlot)) {
        dayData.set(timeSlot, {
          total: 0,
          byProduct: new Map()
        });
      }
      const slotData = dayData.get(timeSlot);
  
      // Sum interactions for this week/day/period
      slotData.total += entry.interactions;
  
      // Track by product
      if (!slotData.byProduct.has(entry.product)) {
        slotData.byProduct.set(entry.product, 0);
      }
      slotData.byProduct.set(
        entry.product, 
        slotData.byProduct.get(entry.product) + entry.interactions
      );
    });
  
    // Calculate statistics across weeks
    const finalStats: DayPeriodData = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = ['MORNING', 'AFTERNOON', 'EVENING'] as const;
  
    days.forEach(day => {
      finalStats[day] = {} as DayStats;
      
      periods.forEach(period => {
        // Collect all weekly values for this day/period
        const weeklyValues: number[] = [];
        const productValues = new Map<string, number[]>();
  
        weeklyData.forEach((weekData) => {
          const dayData = weekData.get(day);
          if (dayData && dayData.has(period)) {
            const slotData = dayData.get(period);
            weeklyValues.push(slotData.total);
  
            // Collect product values across weeks
            slotData.byProduct.forEach((value, product) => {
              if (!productValues.has(product)) {
                productValues.set(product, []);
              }
              productValues.get(product)!.push(value);
            });
          }
        });
  
        // Calculate statistics for this day/period
        finalStats[day][period] = weeklyValues.length > 0 ? {
          count: weeklyValues.length,
          sum: weeklyValues.reduce((a, b) => a + b, 0),
          avg: weeklyValues.reduce((a, b) => a + b, 0) / weeklyValues.length,
          max: Math.max(...weeklyValues),
          min: Math.min(...weeklyValues),
          median: calculateMedian(weeklyValues),
          products: {}
        } : {
          count: 0,
          sum: 0,
          avg: 0,
          max: 0,
          min: 0,
          median: 0,
          products: {}
        };
  
        // Calculate product statistics
        productValues.forEach((values, product) => {
          finalStats[day][period].products[product] = {
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            max: Math.max(...values),
            min: Math.min(...values),
            median: calculateMedian(values)
          };
        });
      });
    });
  
    return finalStats;
  }
  
  function calculateMedian(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? 
      sorted[middle] : 
      (sorted[middle - 1] + sorted[middle]) / 2;
  }