// src/contexts/DashboardContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import { DailyMetric } from '@/types/api';
import { Message } from '@/types/chat';

interface TimelineData {
  impressionsTimeline: any[];
  visualizationsTimeline: any[];
  pickUpTimeline: any[];
  takeAwayTimeline: any[];
  putBackTimeline: any[];
}

interface DashboardState {
  date: {
    from: Date;
    to?: Date;
  };
  selectedSkuNames: string[];
  timelineData: TimelineData | null;
  dailyMetricData: DailyMetric[] | null;
  chatMessages: Message[];
}

interface DashboardContextType {
  dashboardState: DashboardState;
  setDate: (date: { from: Date; to?: Date }) => void;
  setSelectedSkuNames: (skuNames: string[]) => void;
  setTimelineData: (data: TimelineData) => void;
  setDailyMetricData: (dailyMetricData: DailyMetric[]) => void;
  setChatMessages: (messages: Message[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    date: {
      from: new Date("2025-01-27T00:00:00"),
      to: new Date("2025-02-03T00:00:00"),
    },
    selectedSkuNames: [],
    timelineData: null,
    dailyMetricData: null,
    chatMessages: [], // Initialize empty chat messages
  });

  const setDate = useCallback((date: { from: Date; to?: Date }) => {
    setDashboardState(prev => ({ ...prev, date }));
  }, []);

  const setSelectedSkuNames = useCallback((skuNames: string[]) => {
    setDashboardState(prev => ({ ...prev, selectedSkuNames: skuNames }));
  }, []);

  const setTimelineData = useCallback((data: TimelineData) => {
    setDashboardState(prev => ({ ...prev, timelineData: data }));
  }, []);

  const setDailyMetricData = useCallback((dailyMetricData: DailyMetric[]) => {
    setDashboardState(prev => ({...prev, dailyMetricData: dailyMetricData}));
  }, []);

  const setChatMessages = useCallback((messages: Message[]) => {
    setDashboardState(prev => ({ ...prev, chatMessages: messages }));
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboardState,
        setDate,
        setSelectedSkuNames,
        setTimelineData,
        setDailyMetricData,
        setChatMessages
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};