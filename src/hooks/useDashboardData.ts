import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export const useDashboardData = (dateRange?: DateRange, selectedSkuNames?: string[]) => {
  console.log("DEBUG dateRange: ", dateRange)
  console.log("DEBUG selectedSkuNames: ", selectedSkuNames)

  const fetchMetrics = async () => {
    let query = supabase
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
            put_back,
            product:products (
              sku_name
            )
          )
        )
      `)
      .gte('recording_started_at', dateRange?.startDate || '')
      .lte('recording_finished_at', dateRange?.endDate || '');

    const { data: result, error } = await query;

    let impressionsQuery = supabase
      .from("impressions")
      .select(`
        *,
        product:products (
          sku_name
        )
      `)
      .gte('recording_started_at', dateRange?.startDate || '')
      .lte('recording_finished_at', dateRange?.endDate || '');

    const impressions = await impressionsQuery;

    if (error) throw error;

    console.log('Query result:', result);

    // Filter results if SKU names are selected
    let filteredResult = result;
    let filteredImpressions = impressions.data;

    if (selectedSkuNames && selectedSkuNames.length > 0) {
      filteredResult = result?.filter(session => 
        session.interactions?.some(interaction =>
          interaction.interaction_products?.some(product =>
            selectedSkuNames.includes(product.product?.sku_name)
          )
        )
      ) || [];

      filteredImpressions = impressions.data?.filter(impression =>
        selectedSkuNames.includes(impression.product?.sku_name)
      ) || [];
    }

    // Calculate metrics from the filtered data
    const totalTime = filteredResult?.reduce((acc, session) => {
      const sessionTime = session.interactions?.reduce((interactionAcc, interaction) => {
        const interactionTime = interaction.interaction_products?.reduce((productAcc, product) => {
          if (!selectedSkuNames?.length || selectedSkuNames.includes(product.product?.sku_name)) {
            return productAcc + (product.total_time || 0);
          }
          return productAcc;
        }, 0) || 0;
        return interactionAcc + interactionTime;
      }, 0) || 0;
      return acc + sessionTime;
    }, 0) || 0;

    console.log('Calculated total time:', totalTime);

    // Calculate other metrics with SKU filtering
    const interactions = filteredResult?.flatMap(session => session.interactions || []) || [];
    const interactionProducts = interactions.flatMap(interaction => 
      (interaction.interaction_products || []).filter(product => 
        !selectedSkuNames?.length || selectedSkuNames.includes(product.product?.sku_name)
      )
    );
    
    const visualizationCount = interactions.filter(i => i.visualization_flag).length;
    const takeAwayCount = interactionProducts.filter(ip => ip.take_away).length;
    const putBackCount = interactionProducts.filter(ip => ip.put_back).length;
    
    const timelineData = interactions.map((interaction, index) => ({
      name: `Interaction ${index + 1}`,
      time: interaction.interaction_products?.reduce((acc, product) => {
        if (!selectedSkuNames?.length || selectedSkuNames.includes(product.product?.sku_name)) {
          return acc + (product.total_time || 0);
        }
        return acc;
      }, 0) || 0,
    }));

    const impressionsCount = filteredImpressions.reduce((sum, {impressions_count}) => sum + impressions_count, 0);

    console.log("Impressions Count", impressionsCount);

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
    queryKey: ['dashboardData', dateRange, selectedSkuNames],
    queryFn: fetchMetrics,
  });
};