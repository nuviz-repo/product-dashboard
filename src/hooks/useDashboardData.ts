import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useDashboardData = () => {
  const fetchMetrics = async () => {
    // First, fetch interactions
    const { data: interactions, error: interactionsError } = await supabase
      .from('interactions')
      .select('*');

    if (interactionsError) throw interactionsError;

    // Then, fetch product interactions separately
    const { data: productInteractions, error: productInteractionsError } = await supabase
      .from('product_interactions')
      .select('*');

    if (productInteractionsError) throw productInteractionsError;

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
    
    const takeAwayCount = productInteractions?.filter(pi => pi.take_away).length || 0;
    const putBackCount = productInteractions?.filter(pi => pi.put_back).length || 0;
    
    const timelineData = interactions.map((interaction, index) => ({
      name: `Interaction ${index + 1}`,
      time: interaction.visualization?.total_time || 0,
    }));

    const impressionRate = totalInteractions > 0 
      ? Math.round((productInteractions?.length || 0 / totalInteractions) * 100)
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
    queryKey: ['dashboardData'],
    queryFn: fetchMetrics,
  });
};