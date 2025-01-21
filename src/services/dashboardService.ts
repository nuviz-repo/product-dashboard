import { supabase } from '@/lib/supabase';
import { Session, ImpressionProduct } from '../types/dashboard';

export const fetchDashboardData = async (dateRange?: { startDate?: string; endDate?: string }) => {
  const query = supabase
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

  if (error) throw error;

  // Transform the data to match our Session type
  const transformedResult = result?.map(session => ({
    id: session.id,
    recording_started_at: session.recording_started_at,
    recording_finished_at: session.recording_finished_at,
    interactions: session.interactions?.map(interaction => ({
      id: interaction.id,
      visualization_flag: interaction.visualization_flag,
      interaction_products: interaction.interaction_products?.map(product => ({
        id: product.id,
        total_time: product.total_time,
        take_away: product.take_away,
        put_back: product.put_back,
        product: {
          sku_name: product.product?.sku_name
        }
      }))
    }))
  })) as Session[];

  return transformedResult;
};

export const fetchImpressions = async (dateRange?: { startDate?: string; endDate?: string }) => {
  const query = supabase
    .from("interaction_products")
    .select(`
      id,
      product:products (
        sku_name
      )
    `)
    .gte('created_at', dateRange?.startDate || '')
    .lte('created_at', dateRange?.endDate || '');

  const { data: impressionsData, error } = await query;

  if (error) throw error;

  // Transform the data to match our ImpressionProduct type
  const transformedImpressions = impressionsData?.map(impression => ({
    id: impression.id,
    product: {
      sku_name: impression.product?.sku_name
    }
  })) as ImpressionProduct[];

  return transformedImpressions;
};