import { MetricCard } from "@/components/MetricCard";
import { TimeChart } from "@/components/TimeChart";
import { ProductMetrics } from "@/components/ProductMetrics";
import ProductFilters  from "@/components/ProductFilters";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { addDays } from "date-fns";

const Index = () => {
  const [date, setDate] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const [selectedSkuNames, setSelectedSkuNames] = useState<string[]>([]);

  const { data, isLoading, error } = useDashboardData({
    startDate: date.from?.toISOString(),
    endDate: date.to?.toISOString(),
  }, selectedSkuNames);

  if (error) {
    return (
      <div className="min-h-screen bg-[#dedfda] p-8" style={{ border: `2px solid #070707` }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading dashboard data
          </div>
        </div>
      </div>
    );
  }

  const timeRange = {
    start: date.from?.toISOString(),
    end: date.to?.toISOString(),
  };
  
  return (
    <div 
      className="min-h-screen bg-[#dedfda] p-8" 
      style={{ border: `2px solid #070707` }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 
            className="text-[56px] font-bold" 
            style={{ 
              fontFamily: "'Pivot Grotesk Regular', sans-serif", 
              color: '#343dea' 
            }}
          >
            nuviz
          </h1>
          <div className="flex items-center gap-4">
            <ProductFilters onSkuNamesChange={setSelectedSkuNames} />
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : data ? (
            <>
              <MetricCard
                title="Total Interaction Time"
                value={`${data.totalTime}s`}
                className="bg-white/90"
              />
              <MetricCard
                title="Impressions Count"
                value={`${data.impressionsCount}`}
                className="bg-white/90"
              />
              <MetricCard
                title="Total Interactions"
                value={data.takeAwayCount + data.putBackCount}
                className="bg-white/90"
              />
            </>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[400px] md:col-span-8" />
              <Skeleton className="h-[400px] md:col-span-4" />
            </>
          ) : data ? (
            <>
              <div className="md:col-span-8">
                <TimeChart data={data?.products} timeRange={timeRange} />
              </div>
              <div className="md:col-span-4">
                <ProductMetrics
                  impressionCount={data.impressionsCount}
                  visualizationCount={data.visualizationCount}
                  interactionCount={data.takeAwayCount + data.putBackCount}
                  takeAwayCount={data.takeAwayCount}
                  putBackCount={data.putBackCount}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Index;