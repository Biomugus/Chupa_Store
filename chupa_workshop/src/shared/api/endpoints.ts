export const endpoints = {
  catalog: {
    list: '/api/catalog',
    product: (id: string) => `/api/catalog/${id}`,
  },
  cart: '/api/cart',
  constructor: '/api/constructor',
};

export const ordersEndpoint = {
  create: () => '/api/orders',
}

