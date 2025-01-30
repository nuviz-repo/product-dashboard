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
import smoothData, { TimeChartProps } from '@/utils/smoothTimelineData';


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

export function TimeChart({ data, timeRange, title }: TimeChartProps) {
  const rangeHours = useMemo(() => {
    const start = new Date(timeRange.start);
    const end = new Date(timeRange.end);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, [timeRange]);

  const smoothedData = useMemo(
    () => smoothData(data, timeRange), 
    [data, timeRange]
  );
  
  const products = useMemo(
    () => [...new Set(data.map(entry => entry.product))], 
    [data]
  );

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-secondary text-sm">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={smoothedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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