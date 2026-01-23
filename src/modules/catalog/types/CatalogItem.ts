export interface CatalogItem {
  id: string;
  title: string;
  price: number;
  slug: string;
  image?: string;
  images?: string[];
  description?: string;
  equipment?: string;
  characteristics?: string;
}
