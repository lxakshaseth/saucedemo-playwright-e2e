import { ProductData } from '@/types/index.ts';

export function logAllProductData(products: ProductData[]) {
      
  for (const [index, product] of products.entries()) {
    console.log(`Product number ${index + 1}:`);
    console.log(`Name: ${product.name}`);
    console.log(`Description: ${product.description}`);
    console.log(`Price: ${product.price}`);
    console.log('---');
  }
}