import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SearchRequest {
  query: string;
  location: string;
}

interface ShopResult {
  name: string;
  phone: string;
  address?: string;
  distance?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { query, location }: SearchRequest = await req.json();

    const searchQuery = `${query} phone number address`;

    const tavilyApiKey = Deno.env.get('TAVILY_API_KEY');
    if (!tavilyApiKey) {
      return new Response(
        JSON.stringify({ error: 'Search service not configured', shops: [] }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: searchQuery,
        search_depth: 'basic',
        max_results: 10,
      }),
    });

    if (!tavilyResponse.ok) {
      throw new Error('Search API request failed');
    }

    const searchData = await tavilyResponse.json();
    const shops: ShopResult[] = [];

    if (searchData.results && Array.isArray(searchData.results)) {
      for (const result of searchData.results.slice(0, 8)) {
        const phoneMatch = result.content?.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : 'Contact for details';

        shops.push({
          name: result.title || 'Local Store',
          phone: phone,
          address: extractAddress(result.content || result.url),
        });
      }
    }

    return new Response(
      JSON.stringify({ shops }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in search-shops function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        shops: [],
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function extractAddress(text: string): string {
  const addressPattern = /\d+\s+[A-Za-z\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct)[^\n,.]*/i;
  const match = text.match(addressPattern);
  return match ? match[0].trim() : '';
}