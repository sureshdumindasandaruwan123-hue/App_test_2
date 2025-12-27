import { ProductDetails } from '../App';

export async function searchProduct(
  input: string,
  mode: 'image' | 'text'
): Promise<ProductDetails> {
  if (mode === 'text') {
    return parseTextInput(input);
  } else {
    return await identifyProductFromImage(input);
  }
}

function parseTextInput(text: string): ProductDetails {
  const lowerText = text.toLowerCase();

  const brandPatterns = [
    'nike', 'adidas', 'samsung', 'apple', 'sony', 'lg', 'dell',
    'hp', 'lenovo', 'asus', 'microsoft', 'google', 'amazon',
    'puma', 'reebok', 'under armour', 'new balance', 'vans'
  ];

  const brand = brandPatterns.find(b => lowerText.includes(b));

  const sizeMatch = text.match(/size\s*:?\s*(\w+)/i) ||
                    text.match(/\b(xs|s|m|l|xl|xxl|\d+(\.\d+)?)\b/i);
  const size = sizeMatch ? sizeMatch[1] : undefined;

  const colorPatterns = [
    'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange',
    'pink', 'purple', 'gray', 'grey', 'brown', 'silver', 'gold'
  ];
  const color = colorPatterns.find(c => lowerText.includes(c));

  const categoryPatterns = [
    { keywords: ['shoe', 'sneaker', 'boot', 'sandal'], category: 'Footwear' },
    { keywords: ['phone', 'smartphone', 'mobile'], category: 'Electronics - Smartphones' },
    { keywords: ['laptop', 'computer', 'notebook'], category: 'Electronics - Computers' },
    { keywords: ['tv', 'television'], category: 'Electronics - TV' },
    { keywords: ['shirt', 'tshirt', 't-shirt', 'blouse'], category: 'Clothing - Tops' },
    { keywords: ['pant', 'jeans', 'trouser'], category: 'Clothing - Bottoms' },
    { keywords: ['watch'], category: 'Accessories - Watches' },
    { keywords: ['bag', 'backpack', 'purse'], category: 'Accessories - Bags' },
  ];

  const categoryMatch = categoryPatterns.find(pattern =>
    pattern.keywords.some(keyword => lowerText.includes(keyword))
  );
  const category = categoryMatch?.category;

  const words = text.split(/\s+/);
  const name = words.slice(0, 5).join(' ');

  return {
    name: name || text,
    brand: brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : undefined,
    size,
    color: color ? color.charAt(0).toUpperCase() + color.slice(1) : undefined,
    category,
  };
}

async function identifyProductFromImage(imageData: string): Promise<ProductDetails> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Product from Image',
        brand: 'Generic Brand',
        category: 'General',
      });
    }, 1000);
  });
}
