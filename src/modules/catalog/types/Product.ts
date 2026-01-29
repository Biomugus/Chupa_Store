export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  characteristics: string;
  compatibility: string;
  images: string[];
  slug: string;
  image?: string;
}

export interface ProductDTO {
  id: string | number;
  title?: string | null;
  price?: string | number | null;
  description?: string | null;
  characteristics?: string | null;
  compatibility?: string | null;
  images?: string[];
  slug?: string | null;
  image?: string | null;
}
