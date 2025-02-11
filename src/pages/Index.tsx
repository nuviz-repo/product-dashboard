import { ProductMetrics } from "@/components/ProductMetrics";
import ProductFilters from "@/components/ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import WeekDataVisualization from "@/components/WeekDataVisualization";
import { Accordion } from "@/components/ui/accordion";
import TimelineSection, { TIMELINE_SECTIONS } from "@/components/TimelineSection";
import { useDashboard } from "@/contexts/DashboardContext";
import { useProcessedDashboardData } from "@/hooks/useDashboardData"
import { InfoIcon } from "lucide-react";

const Index = () => {
  const { 
    dashboardState: { date, selectedSkuNames },
    setDate,
    setSelectedSkuNames,
    setTimelineData
  } = useDashboard();

  const { data, isLoading, error } = useProcessedDashboardData({
    startDate: date.from?.toISOString(),
    endDate: date.to?.toISOString(),
  }, selectedSkuNames)

  // Update timeline data in context whenever it changes
  useEffect(() => {
    if (data?.timelineData) {
      setTimelineData(data.timelineData);
    }
  }, [data?.timelineData, setTimelineData]);
  
  // State to track open accordion sections
  const [openSections, setOpenSections] = useState<string[]>(
    ["product-interaction"] // Initially the first one is open
  );

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
      className="min-h-screen bg-[#dedfda] p-8 pt-0" 
      // style={{ border: `2px solid #070707` }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="sticky top-0 z-50 bg-[#dedfda] border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-4 space-y-1">
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
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-start gap-2">
                <InfoIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  The data and information presented pertain to AMPM network stores under Contract #003. For more details about the contract and the respective stores, please contact the administrator.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-[400px] md:col-span-4" />
              <Skeleton className="h-[400px] md:col-span-8" />
            </>
          ) : data ? (
            <>
              <div className="md:col-span-4">
                <ProductMetrics
                  impressionCount={data.pipelineData.impressionsCount}
                  visualizationCount={data.pipelineData.visualizationsCount}
                  interactionCount={data.pipelineData.interactionsCount}
                  takeAwayCount={data.pipelineData.takeAwayCount}
                  putBackCount={data.pipelineData.putBackCount}
                />
              </div>
              <div className="md:col-span-8">
                <Accordion 
                  type="multiple" 
                  className="space-y-2"
                  value={openSections}
                  onValueChange={setOpenSections}
                >
                  {TIMELINE_SECTIONS.map((section) => (
                    <TimelineSection
                      key={section.id}
                      value={section.id}
                      title={section.title}
                      tooltip={section.tooltip}
                      data={data.timelineData[section.dataKey]}
                      timeRange={timeRange}
                      isLoading={isLoading}
                    />
                  ))}
                </Accordion>
              </div>
            </>
          ) : null}
        </div>

        {data && (
          <div className="w-full">
            <WeekDataVisualization aggregatedData={data.aggregatedData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;