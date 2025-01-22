import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface Product {
  sku_name: string;
}

interface InteractionProduct {
  id: number;
  total_time: number;
  take_away: boolean;
  put_back: boolean;
  product: Product;
}

interface Interaction {
  id: number;
  visualization_flag: boolean;
  interaction_products: InteractionProduct[];
}

interface Session {
  id: number;
  recording_started_at: string;
  recording_finished_at: string;
  interactions: Interaction[];
}

interface ProductInteractionDisplay {
  interaction_time: string,
  product: string,
  interactions: number
}

export const useDashboardData = (dateRange?: DateRange, selectedSkuNames?: string[]) => {
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

    let productsInteractionDisplay = await supabase.rpc('get_interaction_data', {
      sku_names: selectedSkuNames,
      start_date: dateRange.startDate,
      end_date: dateRange.endDate
    });

    let products = productsInteractionDisplay.data as unknown as ProductInteractionDisplay[]

    const { data: result, error } = await query;

    // For impressions, we'll use the interaction_products table instead
    let impressions = await supabase
      .from("impressions")
      .select()
      .gte('recording_started_at', dateRange?.startDate || '')
      .lte('recording_finished_at', dateRange?.endDate || '');

    // Filter results if SKU names are selected
    let filteredResult = result as unknown as Session[];

    if (selectedSkuNames && selectedSkuNames.length > 0) {
      filteredResult = (result as unknown as Session[])?.filter(session => 
        session.interactions?.some(interaction =>
          interaction.interaction_products?.some(product =>
            selectedSkuNames.includes(product.product?.sku_name)
          )
        )
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

    const impressionsCount = impressions.data.reduce((sum, {impressions_count}) => sum + impressions_count, 0)

    return {
      totalTime,
      impressionsCount,
      visualizationCount,
      takeAwayCount,
      putBackCount,
      timelineData,
      products
    };
  };

  return useQuery({
    queryKey: ['dashboardData', dateRange, selectedSkuNames],
    queryFn: fetchMetrics,
  });
};