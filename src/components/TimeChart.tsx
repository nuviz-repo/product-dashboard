import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import generateColor from '@/utils/colorTimeline';
import { TimelineDataPoint } from '@/types/timelineData';

interface TimeChartProps {
  data: Array<TimelineDataPoint>;
  timeRange: {
    start: string;
    end: string;
  };
  intervalMinutes?: number;
  title?: string;
}

function formatXAxisTick(timeStr: string, rangeHours: number): string {
  const date = new Date(timeStr);
  
  if (rangeHours <= 24) {
    // For ranges <= 24 hours, show hour:minute
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (rangeHours <= 72) {
    // For ranges <= 3 days, show day and hour
    return date.toLocaleString([], { 
      day: 'numeric',
      hour: '2-digit',
    });
  } else {
    // For longer ranges, show month/day
    return date.toLocaleString([], { 
      month: 'short',
      day: 'numeric'
    });
  }
}

function normalizeTimelineData(data: TimelineDataPoint[], products: Set<string>): TimelineDataPoint[] {
  if (data.length === 0) return [];

  // Normalize each data point to include all products
  return data.map(dataPoint => {
    const normalizedPoint: TimelineDataPoint = {
      timestamp: dataPoint.timestamp
    };

    // Add each product with its value or 0 if missing
    products.forEach(product => {
      normalizedPoint[product] = dataPoint[product] || 0;
    });

    return normalizedPoint;
  });
}

export function TimeChart({ data, timeRange, title }: TimeChartProps) {
  const rangeHours = useMemo(() => {
    const start = new Date(timeRange.start);
    const end = new Date(timeRange.end);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, [timeRange]);

  let productsSet = new Set<string>();
  data.forEach(dataPoint => {
    Object.keys(dataPoint).forEach(key => {
      if (key !== 'timestamp') {
        productsSet.add(key);
      }
    });
  });

  const products = Array.from(productsSet.values())
  const smoothedData = normalizeTimelineData(data, productsSet)

  return (
    <Card className="w-full">
      <CardContent className="h-[250px] p-4 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={smoothedData}
            margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => formatXAxisTick(value, rangeHours)}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip
              labelFormatter={(label) => `Time: ${new Date(label).toLocaleString()}`}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {products.map((product) => (
              <Line
                key={product}
                type="monotone"
                dataKey={product}
                stroke={generateColor(product)}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TimeChart;