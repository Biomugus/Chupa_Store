import { Product } from '../types/Product';

export const mapProductDTO = (dto: any): Product => ({
  id: String(dto?.id ?? ''),
  title: dto?.title ?? 'Untitled',
  price: Number(dto?.price ?? 0),
  description: dto?.description ?? '',
  images: Array.isArray(dto?.images) ? dto.images : [],
  slug: dto?.slug,
  image: dto?.image,
});
