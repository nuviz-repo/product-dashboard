import { Session, ImpressionProduct, DashboardMetrics } from '../types/dashboard';

export const calculateDashboardMetrics = (
  filteredResult: Session[],
  filteredImpressions: ImpressionProduct[]
): DashboardMetrics => {
  const totalTime = filteredResult?.reduce((acc, session) => {
    const sessionTime = session.interactions?.reduce((interactionAcc, interaction) => {
      const interactionTime = interaction.interaction_products?.reduce((productAcc, product) => {
        return productAcc + (product.total_time || 0);
      }, 0) || 0;
      return interactionAcc + interactionTime;
    }, 0) || 0;
    return acc + sessionTime;
  }, 0) || 0;

  const interactions = filteredResult?.flatMap(session => session.interactions || []) || [];
  const interactionProducts = interactions.flatMap(interaction => interaction.interaction_products || []);
  
  const visualizationCount = interactions.filter(i => i.visualization_flag).length;
  const takeAwayCount = interactionProducts.filter(ip => ip.take_away).length;
  const putBackCount = interactionProducts.filter(ip => ip.put_back).length;
  
  const timelineData = interactions.map((interaction, index) => ({
    name: `Interaction ${index + 1}`,
    time: interaction.interaction_products?.reduce((acc, product) => acc + (product.total_time || 0), 0) || 0,
  }));

  return {
    totalTime,
    impressionsCount: filteredImpressions.length,
    visualizationCount,
    takeAwayCount,
    putBackCount,
    timelineData,
  };
};