import { MetricCard } from "@/components/MetricCard";
import { TimeChart } from "@/components/TimeChart";
import { ProductMetrics } from "@/components/ProductMetrics";
import { ProductFilters } from "@/components/ProductFilters";
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

  const [productFilters, setProductFilters] = useState({
    brands: [],
    categories: [],
    skuNames: [],
  });

  const { data, isLoading, error } = useDashboardData(
    {
      startDate: date.from?.toISOString(),
      endDate: date.to?.toISOString(),
    },
    productFilters
  );

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
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold text-white">Product Interaction Dashboard</h1>
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </div>

        <div className="bg-white/90 p-4 rounded-lg shadow">
          <ProductFilters onFiltersChange={setProductFilters} />
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {isLoading ? (
            <Skeleton className="h-[400px] col-span-4" />
          ) : data ? (
            <TimeChart data={data.timelineData} />
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : data ? (
            <ProductMetrics
              impressionCount={data.impressionsCount}
              visualizationCount={data.visualizationCount}
              interactionCount={data.takeAwayCount + data.putBackCount}
              takeAwayCount={data.takeAwayCount}
              putBackCount={data.putBackCount}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Index;