import { MetricCard } from "@/components/MetricCard";
import { TimeChart } from "@/components/TimeChart";
import { ProductMetrics } from "@/components/ProductMetrics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data, isLoading, error } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#243949] to-[#517fa4] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading dashboard data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#243949] to-[#517fa4] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Product Interaction Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Interaction Time"
                value={`${data.totalTime}s`}
                className="bg-white/90"
              />
              <MetricCard
                title="Impression Rate"
                value={`${data.impressionRate}%`}
                className="bg-white/90"
              />
              <MetricCard
                title="Total Interactions"
                value={data.takeAwayCount + data.putBackCount}
                className="bg-white/90"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isLoading ? (
            <Skeleton className="h-[400px] col-span-4" />
          ) : (
            <TimeChart data={data.timelineData} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <ProductMetrics
              takeAwayCount={data.takeAwayCount}
              putBackCount={data.putBackCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;