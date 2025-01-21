import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export const useDashboardData = (dateRange?: DateRange) => {
  const fetchMetrics = async () => {
    // Query sessions filtered by date range and join with interactions and interaction_products
    const { data: result, error } = await supabase
      .from('sessions')
      .select(`
        id,
        interactions (
          id,
          interaction_products (
            id,
            total_time,
            take_away,
            put_back
          )
        )
      `)
      .gte('recording_started_at', dateRange?.startDate || '')
      .lte('recording_finished_at', dateRange?.endDate || '');

    if (error) throw error;

    // Calculate metrics from the joined data
    const totalTime = result?.reduce((acc, session) => {
      const sessionTime = session.interactions?.reduce((interactionAcc, interaction) => {
        const interactionTime = interaction.interaction_products?.reduce((productAcc, product) => {
          return productAcc + (product.total_time || 0);
        }, 0) || 0;
        return interactionAcc + interactionTime;
      }, 0) || 0;
      return acc + sessionTime;
    }, 0) || 0;

    // Calculate other metrics
    const interactions = result?.flatMap(session => session.interactions || []) || [];
    const interactionProducts = interactions.flatMap(interaction => interaction.interaction_products || []);
    
    const totalInteractions = interactions.length;
    const takeAwayCount = interactionProducts.filter(ip => ip.take_away).length;
    const putBackCount = interactionProducts.filter(ip => ip.put_back).length;
    
    const timelineData = interactions.map((interaction, index) => ({
      name: `Interaction ${index + 1}`,
      time: interaction.interaction_products?.reduce((acc, product) => acc + (product.total_time || 0), 0) || 0,
    }));

    const impressionRate = totalInteractions > 0 
      ? Math.round((interactionProducts.length / totalInteractions) * 100)
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