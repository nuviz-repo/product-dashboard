import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

interface TimeChartProps {
  data: Array<{
    name: string;
    time: number;
  }>;
}

export function TimeChart({ data }: TimeChartProps) {
  // Transform the data to include formatted time
  const formattedData = data.map((item, index) => ({
    ...item,
    time: index + 1, // Convert time to interaction count
    timestamp: format(new Date(item.name), 'HH:mm:ss'), // Format the timestamp
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Interaction Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                label={{ value: 'Time', position: 'bottom' }}
              />
              <YAxis 
                label={{ 
                  value: 'Number of Interactions', 
                  angle: -90, 
                  position: 'insideLeft'
                }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Interactions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}