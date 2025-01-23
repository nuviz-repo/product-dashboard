import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductMetricsProps {
  impressionCount: number;
  visualizationCount: number;
  interactionCount: number;
  takeAwayCount: number;
  putBackCount: number;
}

export function ProductMetrics({
  impressionCount,
  visualizationCount,
  interactionCount,
  takeAwayCount,
  putBackCount,
}: ProductMetricsProps) {
  const total = takeAwayCount + putBackCount + impressionCount + visualizationCount + interactionCount;

  const metrics = [
    {
      label: "Impressions",
      value: impressionCount,
      color: "bg-[#1e1841]",
      percentage: ((impressionCount / total) * 100).toFixed(1)
    },
    {
      label: "Visualizations",
      value: visualizationCount,
      color: "bg-[#31368e]",
      percentage: ((visualizationCount / total) * 100).toFixed(1)
    },
    {
      label: "Pick Ups",
      value: interactionCount,
      color: "bg-[#5f6fff]",
      percentage: ((interactionCount / total) * 100).toFixed(1)
    },
    {
      label: "Take Away",
      value: takeAwayCount,
      color: "bg-[#343dea]",
      percentage: ((takeAwayCount / total) * 100).toFixed(1)
    },
    {
      label: "Put Back",
      value: putBackCount,
      color: "bg-[#8cc0c7]",
      percentage: ((putBackCount / total) * 100).toFixed(1)
    }
  ];

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="text-secondary font-nikkei text-secondary-text">Product Interaction Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{metric.label}</span>
              <span className="font-medium">{metric.value}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${metric.color}`}
                style={{ width: `${metric.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}