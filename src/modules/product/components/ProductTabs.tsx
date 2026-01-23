type ProductTabsProps = {
  description: string;
};

export default function ProductTabs({ description }: ProductTabsProps) {
  return (
    <section>
      <div>Details</div>
      <p>{description || 'No description yet'}</p>
    </section>
  );
}
