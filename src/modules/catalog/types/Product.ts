export interface Product {
  id: string;
  title: string;
  price: number;
  content: {
    description: string;
    characteristics: string;
    compatibility: string;
  };
  images: string[];
  slug: string;
  image?: string;
}
