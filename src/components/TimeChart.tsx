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
    interaction_time: string; // ISO 8601 or another time format
    product: string;
    interactions: number;
  }>;
  timeRange: { start: string; end: string }; // Define the time range for dynamic scaling
}

export function TimeChart({ data, timeRange }: TimeChartProps) {
  // Parse the time range
  const startTime = new Date(timeRange.start).getTime();
  const endTime = new Date(timeRange.end).getTime();

  // Transform data for recharts
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
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Interaction Time Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={groupedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(value) => value} />
              {/* <XAxis
                dataKey="timestamp"
                domain={[startTime, endTime]}
                type="number"
                tickFormatter={(tick) =>
                  new Date(tick).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              /> */}
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
                  name={product}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
