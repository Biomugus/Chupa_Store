export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  equipment?: string;
  characteristics?: string;
  images: string[];
  slug?: string;
  image?: string;
}

