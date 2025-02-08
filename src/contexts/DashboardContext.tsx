// src/contexts/DashboardContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { addDays } from 'date-fns';

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
}

interface DashboardContextType {
  dashboardState: DashboardState;
  setDate: (date: { from: Date; to?: Date }) => void;
  setSelectedSkuNames: (skuNames: string[]) => void;
  setTimelineData: (data: TimelineData) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    date: {
      from: new Date(),
      to: addDays(new Date(), 1),
    },
    selectedSkuNames: [],
    timelineData: null,
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

  return (
    <DashboardContext.Provider
      value={{
        dashboardState,
        setDate,
        setSelectedSkuNames,
        setTimelineData,
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