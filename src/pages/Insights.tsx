import React from 'react';
import ChatComponent from '@/components/ChatComponent';
import { useDashboard } from '@/contexts/DashboardContext';
import { useNavigate } from 'react-router-dom';

const Insights = () => {
  const { dashboardState: { timelineData } } = useDashboard();
  const navigate = useNavigate();

  if (!timelineData) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please select filters in the dashboard first to analyze your data
              </p>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
                >
                  Go to Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-32px)] p-8">
      <div className="flex-none">
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-lg mb-4">
          Chat with our AI assistant to analyze your product metrics and get detailed insights.
        </p>
      </div>
      <div className="flex-1 min-h-0"> {/* This ensures the chat container doesn't overflow */}
        <ChatComponent
          impressions={timelineData.impressionsTimeline}
          visualizations={timelineData.visualizationsTimeline}
          interactions={timelineData.pickUpTimeline}
          takeaways={timelineData.takeAwayTimeline}
          putbacks={timelineData.putBackTimeline}
          isInline={true}
          className="h-full flex flex-col" 
          defaultOpen={false}        
        />
      </div>
    </div>
  );
};

export default Insights;