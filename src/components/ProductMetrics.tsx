import { Card, CardContent } from "@/components/ui/card";

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

  const visualizationConversion = impressionCount ? ((visualizationCount / impressionCount) * 100).toFixed(1) : '0.0';
  const pickUpConversion = visualizationCount ? ((interactionCount / visualizationCount) * 100).toFixed(1) : '0.0';
  const takeAwayConversion = interactionCount ? ((takeAwayCount / interactionCount) * 100).toFixed(1) : '0.0';
  const putBackConversion = interactionCount ? ((putBackCount / interactionCount) * 100).toFixed(1) : '0.0';

  const metrics = [
    {
      mainLabel: "Impressions",
      secondaryLabel: "",
      value: impressionCount,
      color: "bg-indigo-950",
      percentage: ((impressionCount / total) * 100).toFixed(1)
    },
    {
      mainLabel: "Visualizations",
      secondaryLabel: `CTR: ${visualizationConversion}%`,
      value: visualizationCount,
      color: "bg-indigo-900",
      percentage: ((visualizationCount / total) * 100).toFixed(1)
    },
    {
      mainLabel: "Pick Ups",
      secondaryLabel: `Rate: ${pickUpConversion}%`,
      value: interactionCount,
      color: "bg-blue-500",
      percentage: ((interactionCount / total) * 100).toFixed(1)
    },
    {
      mainLabel: "Take Away",
      secondaryLabel: `Rate: ${takeAwayConversion}%`,
      value: takeAwayCount,
      color: "bg-blue-600",
      percentage: ((takeAwayCount / total) * 100).toFixed(1)
    },
    {
      mainLabel: "Put Back",
      secondaryLabel: `Rate: ${putBackConversion}%`,
      value: putBackCount,
      color: "bg-cyan-400",
      percentage: ((putBackCount / total) * 100).toFixed(1)
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium font-nikkei hover:bg-white/50 px-4 py-2 rounded-lg mb-2">
        Product Interaction Funnel (# interactions)
      </h2>
      <Card className="p-4">
        <CardContent className="space-y-3">
          {metrics.map((metric) => (
            <div key={metric.mainLabel} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>
                  {metric.mainLabel}
                  {metric.secondaryLabel && (
                    <>
                      <span className="font-normal">; </span>
                      <span className="italic text-[13px]">{metric.secondaryLabel}</span>
                    </>
                  )}
                </span>
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
    </div>
  );
}