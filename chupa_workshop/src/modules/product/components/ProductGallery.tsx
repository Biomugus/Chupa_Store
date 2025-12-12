type ProductGalleryProps = {
  images: string[];
};

export default function ProductGallery({ images }: ProductGalleryProps) {
  if (!images?.length) {
    return <div>No images yet</div>;
  }

  return (
    <div>
      {images.map((src, index) => (
        <img key={src ?? index} src={src} alt="Product" />
      ))}
    </div>
  );
}

