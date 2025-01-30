import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayPeriodData } from '@/hooks/useDashboardData';

interface WeekDataVisualizationProps {
  aggregatedData: {
    pickUps: DayPeriodData;
    takeAways: DayPeriodData;
    putBacks: DayPeriodData;
    impressions: DayPeriodData;
    visualizations: DayPeriodData;
  };
}

const METRICS_MAP = {
  'pickUps': 'Pick-Ups',
  'takeAways': 'Take-Aways',
  'putBacks': 'Put-Backs',
  'impressions': 'Impressions',
  'visualizations': 'Visualizations'
} as const;

const TIME_SLOTS = {
  MORNING: { label: 'Morning (6am-12pm)', color: 'bg-yellow-100 hover:bg-yellow-200' },
  AFTERNOON: { label: 'Afternoon (12pm-6pm)', color: 'bg-orange-100 hover:bg-orange-200' },
  EVENING: { label: 'Evening (6pm-12am)', color: 'bg-blue-100 hover:bg-blue-200' },
} as const;

type MetricKey = keyof typeof METRICS_MAP;
type FormulaType = 'sum' | 'avg' | 'max' | 'min' | 'median';
type TimeSlot = keyof typeof TIME_SLOTS;

const WeekDataVisualization: React.FC<WeekDataVisualizationProps> = ({ aggregatedData }) => {
  const [selectedFormula, setSelectedFormula] = useState<FormulaType>('sum');
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('pickUps');

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getValueForPeriod = (day: string, period: TimeSlot) => {
    const periodData = aggregatedData[selectedMetric]?.[day]?.[period];
    return periodData ? periodData[selectedFormula] : 0;
  };

  const calculatePercentages = (day: string) => {
    const morning = getValueForPeriod(day, 'MORNING');
    const afternoon = getValueForPeriod(day, 'AFTERNOON');
    const evening = getValueForPeriod(day, 'EVENING');
    const total = morning + afternoon + evening;
    
    // Count non-zero values
    const nonZeroCount = [morning, afternoon, evening].filter(v => v > 0).length;
    
    // Case 1: All zeros
    if (nonZeroCount === 0) {
      return {
        morning: { value: 0, percentage: '33.33', show: true },
        afternoon: { value: 0, percentage: '33.33', show: true },
        evening: { value: 0, percentage: '33.33', show: true },
        hasActivity: false
      };
    }
    
    // Case 2: One non-zero value
    if (nonZeroCount === 1) {
      return {
        morning: {
          value: morning,
          percentage: morning > 0 ? '100' : '0',
          show: morning > 0
        },
        afternoon: {
          value: afternoon,
          percentage: afternoon > 0 ? '100' : '0',
          show: afternoon > 0
        },
        evening: {
          value: evening,
          percentage: evening > 0 ? '100' : '0',
          show: evening > 0
        },
        hasActivity: true
      };
    }
    
    // Cases 3 & 4: Two or three non-zero values - use proportional sizes
    return {
      morning: {
        value: morning,
        percentage: morning > 0 ? ((morning / total) * 100).toFixed(1) : '0',
        show: morning > 0
      },
      afternoon: {
        value: afternoon,
        percentage: afternoon > 0 ? ((afternoon / total) * 100).toFixed(1) : '0',
        show: afternoon > 0
      },
      evening: {
        value: evening,
        percentage: evening > 0 ? ((evening / total) * 100).toFixed(1) : '0',
        show: evening > 0
      },
      hasActivity: true
    };
  };

  return (
    <div className="w-full max-w-6xl p-4">
      <div className="flex justify-between items-start mb-8">
        {/* Control Section */}
        <div className="flex gap-4">
          <Select
            value={selectedFormula}
            onValueChange={(value: FormulaType) => setSelectedFormula(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Formula" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">SUM</SelectItem>
              <SelectItem value="avg">AVG</SelectItem>
              <SelectItem value="max">MAX</SelectItem>
              <SelectItem value="min">MIN</SelectItem>
              <SelectItem value="median">MED</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedMetric}
            onValueChange={(value: MetricKey) => setSelectedMetric(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Data Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(METRICS_MAP).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Legend */}
        <div className="flex gap-4 items-center">
          {Object.entries(TIME_SLOTS).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${color.split(' ')[0]} rounded`} />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Week View */}
      <div className="flex gap-2 justify-between">
        {daysOfWeek.map((day, index) => {
          const dayData = calculatePercentages(day);
          const emptyDayClass = !dayData.hasActivity ? 'opacity-50' : '';
          
          return (
            <Card key={day} className={`w-32 ${emptyDayClass}`}>
              <CardContent className="p-2">
                <div className="text-sm font-medium mb-2 text-center">
                  {shortDays[index]}
                </div>
                <div className="h-48 flex flex-col">
                  {/* Evening slot */}
                  {(dayData.evening.show || !dayData.hasActivity) && (
                    <div
                      style={{ height: `${dayData.evening.percentage}%` }}
                      className={`${TIME_SLOTS.EVENING.color} border border-blue-200 flex items-center justify-center transition-all duration-300`}
                    >
                      <span className="text-sm text-gray-600">
                        {Math.round(dayData.evening.value * 100) / 100}
                      </span>
                    </div>
                  )}
                  {/* Afternoon slot */}
                  {(dayData.afternoon.show || !dayData.hasActivity) && (
                    <div
                      style={{ height: `${dayData.afternoon.percentage}%` }}
                      className={`${TIME_SLOTS.AFTERNOON.color} border border-orange-200 flex items-center justify-center transition-all duration-300`}
                    >
                      <span className="text-sm text-gray-600">
                        {Math.round(dayData.afternoon.value * 100) / 100}
                      </span>
                    </div>
                  )}
                  {/* Morning slot */}
                  {(dayData.morning.show || !dayData.hasActivity) && (
                    <div
                      style={{ height: `${dayData.morning.percentage}%` }}
                      className={`${TIME_SLOTS.MORNING.color} border border-yellow-200 flex items-center justify-center transition-all duration-300`}
                    >
                      <span className="text-sm text-gray-600">
                        {Math.round(dayData.morning.value * 100) / 100}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeekDataVisualization;