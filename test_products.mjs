import { products } from './src/data/products.ts';

console.log('Total products available:', products.length);
console.log('\nProducts list:');
products.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} - ${product.price} - Image: ${product.image}`);
});