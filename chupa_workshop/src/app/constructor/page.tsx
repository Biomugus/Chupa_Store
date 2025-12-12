import ConstructorCanvas from '@/modules/constructor/components/ConstructorCanvas';
import OptionsPanel from '@/modules/constructor/components/OptionsPanel';
import { useConstructor } from '@/modules/constructor/hooks/useConstructor';

export default function ConstructorPage() {
  const { config, loading, updateOption } = useConstructor();

  if (loading) {
    return <div>Loading constructor...</div>;
  }

  if (!config) {
    return <div>No constructor config</div>;
  }

  return (
    <section>
      <ConstructorCanvas layers={config.layers} />
      <OptionsPanel options={config.options} onChange={updateOption} />
    </section>
  );
}

