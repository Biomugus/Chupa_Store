import { useEffect, useState } from 'react';

import { getConstructorConfig } from '../api/getConstructorConfig';
import { ConstructorConfig } from '../types/ConstructorConfig';

export function useConstructor() {
  const [config, setConfig] = useState<ConstructorConfig | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getConstructorConfig()
      .then((data) => {
        if (mounted) setConfig(data);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const updateOption = (key: string, value: string) => {
    setConfig((prev) =>
      prev ? { ...prev, options: { ...prev.options, [key]: value } } : prev,
    );
  };

  return { config, loading, updateOption };
}

