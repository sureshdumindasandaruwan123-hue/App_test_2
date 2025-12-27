import { ProductDetails, ShopResult } from '../App';
import { saveSearchHistory } from './databaseService';

export async function findNearbyShops(
  product: ProductDetails,
  location: string
): Promise<ShopResult[]> {
  const searchQuery = buildSearchQuery(product, location);

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-shops`;
  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: searchQuery,
        location,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to search for shops');
    }

    const data = await response.json();
    const shops = data.shops || [];

    await saveSearchHistory(product, location, shops.length);

    return shops;
  } catch (error) {
    console.error('Error finding shops:', error);
    return generateMockResults(product, location);
  }
}

function buildSearchQuery(product: ProductDetails, location: string): string {
  const parts = [];

  if (product.brand) parts.push(product.brand);
  if (product.name) parts.push(product.name);
  if (product.category) parts.push(product.category);

  const productQuery = parts.join(' ');

  return `${productQuery} stores near ${location}`;
}

function generateMockResults(product: ProductDetails, location: string): ShopResult[] {
  const shopTypes = [
    'Electronics Store',
    'Retail Shop',
    'Department Store',
    'Specialty Store',
    'Brand Outlet',
  ];

  return shopTypes.slice(0, 5).map((type, index) => ({
    name: `${type} - ${location}`,
    phone: `+1-555-${(Math.random() * 9000 + 1000).toFixed(0)}`,
    address: `${100 + index * 50} Main Street, ${location}`,
    distance: `${(Math.random() * 5 + 0.5).toFixed(1)} miles`,
  }));
}
