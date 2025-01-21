import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export const useDashboardData = (dateRange?: DateRange) => {
  const fetchMetrics = async () => {
    // First, fetch sessions filtered by date range
    const sessionsQuery = supabase
      .from('sessions')
      .select('id');

    if (dateRange?.startDate) {
      sessionsQuery.gte('recording_started_at', dateRange.startDate);
    }
    if (dateRange?.endDate) {
      sessionsQuery.lte('recording_finished_at', dateRange.endDate);
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery;

    if (sessionsError) throw sessionsError;

    // Get session IDs for filtering other tables
    const sessionIds = sessions?.map(session => session.id) || [];

    // Fetch interactions filtered by session IDs
    const { data: interactions, error: interactionsError } = await supabase
      .from('interactions')
      .select('*')
      .in('session_id', sessionIds);

    if (interactionsError) throw interactionsError;

    // Fetch interaction products filtered by the filtered interactions
    const interactionIds = interactions?.map(interaction => interaction.id) || [];
    const { data: interactionProducts, error: interactionProductsError } = await supabase
      .from('interaction_products')
      .select('*')
      .in('interaction_id', interactionIds);

    if (interactionProductsError) throw interactionProductsError;

    // Ensure we have data before calculating metrics
    if (!interactions || interactions.length === 0) {
      return {
        totalTime: 0,
        impressionRate: 0,
        takeAwayCount: 0,
        putBackCount: 0,
        timelineData: [],
      };
    }

    const totalInteractions = interactions.length;
    const totalTime = interactions.reduce((acc, curr) => acc + (curr.visualization?.total_time || 0), 0);
    
    const takeAwayCount = interactionProducts?.filter(pi => pi.take_away).length || 0;
    const putBackCount = interactionProducts?.filter(pi => pi.put_back).length || 0;
    
    const timelineData = interactions.map((interaction, index) => ({
      name: `Interaction ${index + 1}`,
      time: interaction.visualization?.total_time || 0,
    }));

    const impressionRate = totalInteractions > 0 
      ? Math.round((interactionProducts?.length || 0 / totalInteractions) * 100)
      : 0;

    return {
      totalTime,
      impressionRate,
      takeAwayCount,
      putBackCount,
      timelineData,
    };
  };

  return useQuery({
    queryKey: ['dashboardData', dateRange],
    queryFn: fetchMetrics,
  });
};