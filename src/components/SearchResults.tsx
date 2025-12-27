import { Phone, MapPin, Package, Loader2 } from 'lucide-react';
import { ProductDetails, ShopResult } from '../App';

interface SearchResultsProps {
  productDetails: ProductDetails | null;
  shopResults: ShopResult[];
  isSearching: boolean;
}

export default function SearchResults({
  productDetails,
  shopResults,
  isSearching,
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Searching for nearby shops...</p>
      </div>
    );
  }

  if (!productDetails && shopResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No results yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Upload an image or enter product details to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Search Results</h2>

      {productDetails && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Product Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium text-gray-700 w-24">Name:</span>
              <span className="text-gray-900">{productDetails.name}</span>
            </div>
            {productDetails.brand && (
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Brand:</span>
                <span className="text-gray-900">{productDetails.brand}</span>
              </div>
            )}
            {productDetails.model && (
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Model:</span>
                <span className="text-gray-900">{productDetails.model}</span>
              </div>
            )}
            {productDetails.category && (
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Category:</span>
                <span className="text-gray-900">{productDetails.category}</span>
              </div>
            )}
            {productDetails.size && (
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Size:</span>
                <span className="text-gray-900">{productDetails.size}</span>
              </div>
            )}
            {productDetails.color && (
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Color:</span>
                <span className="text-gray-900">{productDetails.color}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {shopResults.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Nearby Shops ({shopResults.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {shopResults.map((shop, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <h4 className="font-semibold text-gray-800 mb-2">{shop.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${shop.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {shop.phone}
                    </a>
                  </div>
                  {shop.address && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{shop.address}</span>
                    </div>
                  )}
                  {shop.distance && (
                    <div className="text-xs text-gray-500 mt-2">
                      Distance: {shop.distance}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        productDetails && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              No shops found for this product in your area. Try a different location or
              product.
            </p>
          </div>
        )
      )}
    </div>
  );
}
