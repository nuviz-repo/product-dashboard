import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductMetricsProps {
  impressionCount: number;
  visualizationCount: number;
  interactionCount: number;
  takeAwayCount: number;
  putBackCount: number;
}

export function ProductMetrics({ impressionCount, visualizationCount, interactionCount, takeAwayCount, putBackCount }: ProductMetricsProps) {
  const total = takeAwayCount + putBackCount + impressionCount + visualizationCount + interactionCount;
  const impressionPercentage = ((impressionCount / total) * 100).toFixed(1);
  const visualizationPercentage = ((visualizationCount / total) * 100).toFixed(1);
  const interactionPercentage = ((interactionCount / total) * 100).toFixed(1);
  const takeAwayPercentage = ((takeAwayCount / total) * 100).toFixed(1);
  const putBackPercentage = ((putBackCount / total) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Interaction Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Impressions Count */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Impressions</span>
            <span className="font-bold">{impressionCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${impressionPercentage}%` }}
            ></div>
          </div>

          {/* Visualization Count */}
          <div className="flex justify-between items-center">
            <span>Visualizations</span>
            <span className="font-bold">{visualizationCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${visualizationPercentage}%` }}
            ></div>
          </div>

          {/* Pick-Ups Count */}
          <div className="flex justify-between items-center">
            <span>Pick Ups</span>
            <span className="font-bold">{interactionCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${interactionPercentage}%` }}
            ></div>
          </div>

          {/* Take Away Count */}
          <div className="flex justify-between items-center">
            <span>Take Away</span>
            <span className="font-bold">{takeAwayCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${takeAwayPercentage}%` }}
            ></div>
          </div>

          {/* Put Back Count */}
          <div className="flex justify-between items-center">
            <span>Put Back</span>
            <span className="font-bold">{putBackCount}</span>
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