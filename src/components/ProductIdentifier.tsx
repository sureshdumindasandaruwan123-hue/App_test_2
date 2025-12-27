import { useState } from 'react';
import { ImageIcon, FileText, MapPin, Loader2 } from 'lucide-react';
import { ProductDetails, ShopResult } from '../App';
import { searchProduct } from '../services/productService';
import { findNearbyShops } from '../services/locationService';

interface ProductIdentifierProps {
  onProductIdentified: (details: ProductDetails) => void;
  onSearchStart: () => void;
  onSearchComplete: (results: ShopResult[]) => void;
}

export default function ProductIdentifier({
  onProductIdentified,
  onSearchStart,
  onSearchComplete,
}: ProductIdentifierProps) {
  const [inputMode, setInputMode] = useState<'image' | 'text'>('image');
  const [textInput, setTextInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Please enter your location');
      return;
    }

    if (inputMode === 'image' && !imagePreview) {
      setError('Please upload an image');
      return;
    }

    if (inputMode === 'text' && !textInput.trim()) {
      setError('Please enter product details');
      return;
    }

    setError(null);
    setIsProcessing(true);
    onSearchStart();

    try {
      const productDetails = await searchProduct(
        inputMode === 'image' ? imagePreview! : textInput,
        inputMode
      );

      onProductIdentified(productDetails);

      const shops = await findNearbyShops(productDetails, location);
      onSearchComplete(shops);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onSearchComplete([]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Identification</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setInputMode('image')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            inputMode === 'image'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          Upload Image
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            inputMode === 'text'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          Enter Text
        </button>
      </div>

      {inputMode === 'image' ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload product image</p>
                <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe the product... (e.g., 'Nike Air Max 270 shoes, size 10, black color')"
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Your Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or address"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleSearch}
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Searching...
          </>
        ) : (
          'Find Nearby Shops'
        )}
      </button>
    </div>
  );
}
