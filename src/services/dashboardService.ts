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

  return result as Session[];
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

  return impressionsData as unknown as ImpressionProduct[];
};