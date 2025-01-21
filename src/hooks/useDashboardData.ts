import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface ProductFilters {
  brands?: string[];
  categories?: string[];
  skuNames?: string[];
}

interface Product {
  sku_name: string;
  brand: string;
  category: string;
}

interface InteractionProduct {
  id: string;
  total_time: number;
  take_away: boolean;
  put_back: boolean;
  product: Product;
}

interface Interaction {
  id: string;
  interaction_products: InteractionProduct[];
}

interface Session {
  id: string;
  recording_started_at: string;
  recording_finished_at: string;
  interactions: Interaction[];
}

export const useDashboardData = (dateRange?: DateRange, productFilters?: ProductFilters) => {
  const fetchMetrics = async () => {
    let query = supabase
      .from('sessions')
      .select(`
        id,
        recording_started_at,
        recording_finished_at,
        interactions (
          id,
          interaction_products (
            id,
            total_time,
            take_away,
            put_back,
            product:products (
              sku_name,
              brand,
              category
            )
          )
        )
      `)
      .gte('recording_started_at', dateRange?.startDate || '')
      .lte('recording_finished_at', dateRange?.endDate || '');

    const { data: result, error } = await query;

    if (error) throw error;

    console.log('Query result:', result);

    // Filter interactions based on product filters
    const filteredResult = (result as Session[] || []).map(session => ({
      ...session,
      interactions: session.interactions?.map(interaction => ({
        ...interaction,
        interaction_products: interaction.interaction_products?.filter(ip => {
          const product = ip.product;
          return (
            (!productFilters?.brands?.length || productFilters.brands.includes(product.brand)) &&
            (!productFilters?.categories?.length || productFilters.categories.includes(product.category)) &&
            (!productFilters?.skuNames?.length || productFilters.skuNames.includes(product.sku_name))
          );
        })
      }))
    }));

    // Calculate metrics from the filtered data
    const totalTime = filteredResult.reduce((acc, session) => {
      const sessionTime = session.interactions?.reduce((interactionAcc, interaction) => {
        const interactionTime = interaction.interaction_products?.reduce((productAcc, product) => {
          return productAcc + (product.total_time || 0);
        }, 0) || 0;
        return interactionAcc + interactionTime;
      }, 0) || 0;
      return acc + sessionTime;
    }, 0);

    console.log('Calculated total time:', totalTime);

    // Calculate other metrics
    const interactions = filteredResult.flatMap(session => session.interactions || []);
    const interactionProducts = interactions.flatMap(interaction => interaction.interaction_products || []);
    
    const takeAwayCount = interactionProducts.filter(ip => ip.take_away).length;
    const putBackCount = interactionProducts.filter(ip => ip.put_back).length;
    
    const timelineData = interactions.map((interaction, index) => ({
      name: `Interaction ${index + 1}`,
      time: interaction.interaction_products?.reduce((acc, product) => acc + (product.total_time || 0), 0) || 0,
    }));

    const { data: impressions } = await supabase
      .from("impressions")
      .select()
      .gte('recording_started_at', dateRange?.startDate || '')
      .lte('recording_finished_at', dateRange?.endDate || '');

    const impressionsCount = impressions?.reduce((sum, {impressions_count}) => sum + impressions_count, 0) || 0;

    console.log('Final metrics:', {
      totalTime,
      impressionsCount,
      takeAwayCount,
      putBackCount,
      timelineData
    });

    return {
      totalTime,
      impressionsCount,
      visualizationCount: interactions.length,
      takeAwayCount,
      putBackCount,
      timelineData,
    };
  };

  return useQuery({
    queryKey: ['dashboardData', dateRange, productFilters],
    queryFn: fetchMetrics,
  });
};