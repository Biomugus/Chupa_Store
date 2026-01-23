export interface CartItem {
  id: string;
  productId?: string;
  title: string;
  price: number;
  quantity: number;
  characteristics?: string;
  image: string;
}
