import { Product, ProductDTO } from '../types/Product';

export const mapProductDTO = (dto: ProductDTO): Product => ({
  id: String(dto.id ?? ''),
  title: dto.title ?? 'Untitled',
  price: Number(dto.price ?? 0),
  description: dto.description ?? '',
  equipment: dto.equipment ?? undefined,
  characteristics: dto.characteristics ?? undefined,
  images: Array.isArray(dto.images) ? dto.images.map(String) : [],
  slug: dto.slug ?? undefined,
  image: dto.image ?? undefined,
});
