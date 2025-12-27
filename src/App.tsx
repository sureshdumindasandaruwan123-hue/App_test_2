import { useState } from 'react';
import ProductIdentifier from './components/ProductIdentifier';
import SearchResults from './components/SearchResults';
import { SearchIcon } from 'lucide-react';

export interface ProductDetails {
  name: string;
  brand?: string;
  model?: string;
  size?: string;
  color?: string;
  category?: string;
}

export interface ShopResult {
  name: string;
  phone: string;
  address?: string;
  distance?: string;
}

function App() {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [shopResults, setShopResults] = useState<ShopResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <SearchIcon className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">ShopFinder AI</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Identify products from images or text and find nearby stores instantly
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ProductIdentifier
              onProductIdentified={setProductDetails}
              onSearchStart={() => setIsSearching(true)}
              onSearchComplete={(results) => {
                setShopResults(results);
                setIsSearching(false);
              }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <SearchResults
              productDetails={productDetails}
              shopResults={shopResults}
              isSearching={isSearching}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
