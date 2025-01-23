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

interface TimeChartProps {
  data: Array<{
    interaction_time: string;
    product: string;
    interactions: number;
  }>;
  timeRange: { start: string; end: string };
}

export function TimeChart({ data, timeRange }: TimeChartProps) {
  const startTime = new Date(timeRange.start).getTime();
  const endTime = new Date(timeRange.end).getTime();

  const groupedData = data.reduce((acc, entry) => {
    const timeEntry = acc.find((item) => item.timestamp === entry.interaction_time);
    if (!timeEntry) {
      acc.push({ timestamp: entry.interaction_time, [entry.product]: entry.interactions });
    } else {
      timeEntry[entry.product] = entry.interactions;
    }
    return acc;
  }, [] as Array<{ timestamp: string; [key: string]: number | string }>);

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="text-secondary font-nikkei text-secondary-text">Interaction By Product Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={groupedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => 
                new Date(value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                `Time: ${new Date(label).toLocaleString()}`
              }
            />
            <Legend />
            {Array.from(
              new Set(data.map((entry) => entry.product))
            ).map((product) => (
              <Line
                key={product}
                type="monotone"
                dataKey={product}
                stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}