import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductMetricsProps {
  takeAwayCount: number;
  putBackCount: number;
}

export function ProductMetrics({ takeAwayCount, putBackCount }: ProductMetricsProps) {
  const total = takeAwayCount + putBackCount;
  const takeAwayPercentage = ((takeAwayCount / total) * 100).toFixed(1);
  const putBackPercentage = ((putBackCount / total) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Interaction Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Take Away</span>
            <span className="font-bold">{takeAwayPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${takeAwayPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span>Put Back</span>
            <span className="font-bold">{putBackPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${putBackPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}