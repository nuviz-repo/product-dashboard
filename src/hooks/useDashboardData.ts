import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useDashboardData = () => {
  const fetchMetrics = async () => {
    const { data: interactions, error: interactionsError } = await supabase
      .from('interactions')
      .select(`
        *,
        product_interactions (*)
      `);

    if (interactionsError) throw interactionsError;

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
    
    const productInteractions = interactions.flatMap(i => i.product_interactions || []);
    const takeAwayCount = productInteractions.filter(pi => pi.take_away).length;
    const putBackCount = productInteractions.filter(pi => pi.put_back).length;
    
    const timelineData = interactions.map((interaction, index) => ({
      name: `Interaction ${index + 1}`,
      time: interaction.visualization?.total_time || 0,
    }));

    const impressionRate = totalInteractions > 0 
      ? Math.round((productInteractions.length / totalInteractions) * 100)
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