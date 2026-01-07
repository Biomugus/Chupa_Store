export const endpoints = {
  catalog: '/api/catalog',
  product: (id: string) => `/api/product/${id}`,
  cart: '/api/cart',
  constructor: '/api/constructor',
};
