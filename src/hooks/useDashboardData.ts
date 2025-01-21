import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export const useDashboardData = (dateRange?: DateRange) => {
  console.log("DEBUG dateRange: ", dateRange)

  const fetchMetrics = async () => {
    // Query sessions filtered by date range and join with interactions and interaction_products
    // const data = await supabase.from("sessions").select().eq("id", "1eec97ff-9bfa-4541-982e-2ed2f2d54adf")
    // console.log("New Query", data)


    const { data: result, error } = await supabase
      .from('sessions')
      .select(`
        id,
        recording_started_at,
        recording_finished_at,
        interactions (
          id,
          visualization_flag,
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

    const impressions = await supabase
      .from("impressions")
      .select()
      .gte('recording_started_at', dateRange?.startDate || '')
      .lte('recording_finished_at', dateRange?.endDate || '');

    if (error) throw error;

    console.log('Query result:', result); // Debug log to see the data structure

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

    console.log('Calculated total time:', totalTime); // Debug log for total time calculation

    // Calculate other metrics
    const interactions = result?.flatMap(session => session.interactions || []) || [];
    const interactionProducts = interactions.flatMap(interaction => interaction.interaction_products || []);
    
    const visualizationCount = interactions.filter(i => i.visualization_flag).length;
    const takeAwayCount = interactionProducts.filter(ip => ip.take_away).length;
    const putBackCount = interactionProducts.filter(ip => ip.put_back).length;
    
    const timelineData = interactions.map((interaction, index) => ({
      name: `Interaction ${index + 1}`,
      time: interaction.interaction_products?.reduce((acc, product) => acc + (product.total_time || 0), 0) || 0,
    }));

    const impressionsCount = impressions.data.reduce((sum, {impressions_count}) => sum + impressions_count, 0)

    console.log("Impressions Count", impressionsCount)

    return {
      totalTime,
      impressionsCount,
      visualizationCount,
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