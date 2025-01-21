import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData, fetchImpressions } from '../services/dashboardService';
import { calculateDashboardMetrics } from '../utils/dashboardCalculations';
import { DateRange, Session, ImpressionProduct } from '../types/dashboard';

export const useDashboardData = (dateRange?: DateRange, selectedSkuNames?: string[]) => {
  const fetchMetrics = async () => {
    const result = await fetchDashboardData(dateRange);
    const impressionsData = await fetchImpressions(dateRange);

    // Filter results if SKU names are selected
    let filteredResult = result as Session[];
    let filteredImpressions = impressionsData || [];

    if (selectedSkuNames && selectedSkuNames.length > 0) {
      filteredResult = result?.filter(session => 
        session.interactions?.some(interaction =>
          interaction.interaction_products?.some(product =>
            selectedSkuNames.includes(product.product?.sku_name)
          )
        )
      ) || [];

      filteredImpressions = impressionsData?.filter(impression =>
        selectedSkuNames.includes(impression.product?.sku_name)
      ) || [];
    }

    return calculateDashboardMetrics(filteredResult, filteredImpressions);
  };

  return useQuery({
    queryKey: ['dashboardData', dateRange, selectedSkuNames],
    queryFn: fetchMetrics,
  });
};