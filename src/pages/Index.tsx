import { MetricCard } from "@/components/MetricCard";
import { TimeChart } from "@/components/TimeChart";
import { ProductMetrics } from "@/components/ProductMetrics";

// Mock data - replace with real data later
const mockData = {
  totalTime: 150,
  impressionRate: 85,
  takeAwayCount: 75,
  putBackCount: 25,
  timelineData: [
    { name: "00:00", time: 0 },
    { name: "00:05", time: 20 },
    { name: "00:10", time: 40 },
    { name: "00:15", time: 30 },
    { name: "00:20", time: 50 },
  ],
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#243949] to-[#517fa4] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Product Interaction Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Interaction Time"
            value={`${mockData.totalTime}s`}
            className="bg-white/90"
          />
          <MetricCard
            title="Impression Rate"
            value={`${mockData.impressionRate}%`}
            className="bg-white/90"
          />
          <MetricCard
            title="Total Interactions"
            value={mockData.takeAwayCount + mockData.putBackCount}
            className="bg-white/90"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TimeChart data={mockData.timelineData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductMetrics
            takeAwayCount={mockData.takeAwayCount}
            putBackCount={mockData.putBackCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;