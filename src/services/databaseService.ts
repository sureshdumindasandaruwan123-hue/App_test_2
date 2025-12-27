import { createClient } from '@supabase/supabase-js';
import { ProductDetails } from '../App';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveSearchHistory(
  product: ProductDetails,
  location: string,
  resultsCount: number
): Promise<void> {
  try {
    const { error } = await supabase.from('search_history').insert({
      product_name: product.name,
      product_brand: product.brand,
      product_category: product.category,
      location,
      results_count: resultsCount,
      searched_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error saving search history:', error);
    }
  } catch (err) {
    console.error('Database error:', err);
  }
}

export async function getRecentSearches(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching search history:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Database error:', err);
    return [];
  }
}
