// services/mongoService.ts
const API_URL = 'http://localhost:8000';

interface DateRangeRequest {
  start_date: string;
  end_date: string;
  sku_names: string[];
}

export interface InteractionProduct {
  sku_id: string;
  sku_name: string;
  sku_brand: string;
  sku_category: string;
  sku_package: string | null;
  recording_started_at: string;
  total_time: number;
  put_back: boolean;
  take_away: boolean;
}

export interface VisualizationProduct {
  sku_id: string;
  sku_name: string;
  sku_brand: string;
  sku_category: string;
  sku_package: string | null;
  recording_started_at: string;
  total_time: number;
}

export interface ImpressionProduct {
  sku_id: string;
  sku_name: string;
  sku_brand: string;
  sku_category: string;
  sku_package: string | null;
  recording_started_at: string;
  impressions: number;
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getBrandsByCategories(categories: string[]): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/products/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export async function getSkuNamesByFilters(categories: string[], brands: string[]): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/products/skuNames`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories, brands })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching SKU names:', error);
    return [];
  }
}

export async function getInteractionProducts(dateRange: DateRangeRequest): Promise<InteractionProduct[]> {
  try {
    const response = await fetch(`${API_URL}/interactions/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dateRange)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching interaction products:', error);
    return [];
  }
}

export async function getVisualizationProducts(dateRange: DateRangeRequest): Promise<VisualizationProduct[]> {
  try {
    const response = await fetch(`${API_URL}/visualizations/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dateRange)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching visualization products:', error);
    return [];
  }
}

export async function getImpressionProducts(dateRange: DateRangeRequest): Promise<ImpressionProduct[]> {
  try {
    const response = await fetch(`${API_URL}/impressions/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dateRange)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching impression products:', error);
    return [];
  }
}