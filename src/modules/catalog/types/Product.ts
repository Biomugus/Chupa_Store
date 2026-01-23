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

export interface ProductDTO {
  id: string | number;
  title?: string | null;
  price?: string | number | null;
  description?: string | null;
  equipment?: string | null;
  characteristics?: string | null;
  images?: string[];
  slug?: string | null;
  image?: string | null;
}
