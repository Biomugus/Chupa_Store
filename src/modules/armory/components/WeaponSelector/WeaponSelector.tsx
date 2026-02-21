'use client';

// src/modules/armory/components/WeaponSelector/WeaponSelector.tsx

import { updateUserPlatform } from '@/modules/armory/api/updateUserPlatform';
import { WeaponPlatform } from '@/modules/armory/types/armoryTypes';
import { useMemo, useState, useTransition } from 'react';
import styles from './weaponSelector.module.css';

interface WeaponSelectorProps {
  platforms: WeaponPlatform[];
  selectedPlatformId: string | null;
}

type GroupKey = string;

export function WeaponSelector({ platforms, selectedPlatformId }: WeaponSelectorProps) {
  const [selected, setSelected] = useState(selectedPlatformId);
  const [activeGroup, setActiveGroup] = useState<GroupKey | null>(null);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const groups = useMemo(() => {
    const map = new Map<GroupKey, WeaponPlatform[]>();
    for (const p of platforms) {
      const group = p.platform_group;
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(p);
    }
    return map;
  }, [platforms]);

  const groupKeys = useMemo(() => Array.from(groups.keys()), [groups]);

  const visiblePlatforms = activeGroup ? (groups.get(activeGroup) ?? []) : platforms;

  const handleSelect = (platformId: string) => {
    const newId = platformId === selected ? null : platformId;
    setSelected(newId);
    setStatusMessage(null);

    startTransition(async () => {
      const result = await updateUserPlatform(newId);
      if (result.error) {
        setSelected(selected);
        setStatusMessage({ type: 'error', text: result.error });
      } else {
        setStatusMessage({ type: 'success', text: result.success ?? 'Сохранено' });
      }
    });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Выберите платформу</h3>

      <div className={styles.groupTabs}>
        <button
          type="button"
          className={`${styles.groupTab} ${activeGroup === null ? styles.groupTabActive : ''}`}
          onClick={() => setActiveGroup(null)}
        >
          Все
        </button>
        {groupKeys.map((group) => (
          <button
            key={group}
            type="button"
            className={`${styles.groupTab} ${activeGroup === group ? styles.groupTabActive : ''}`}
            onClick={() => setActiveGroup(group)}
          >
            {group}
          </button>
        ))}
      </div>

      <div className={`${styles.platformGrid} ${isPending ? styles.savingOverlay : ''}`}>
        {visiblePlatforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            className={`${styles.platformCard} ${
              selected === platform.id ? styles.platformCardSelected : ''
            }`}
            onClick={() => handleSelect(platform.id)}
            disabled={isPending}
          >
            {platform.name}
          </button>
        ))}
      </div>

      {statusMessage && (
        <p
          className={`${styles.statusMessage} ${
            statusMessage.type === 'success' ? styles.statusSuccess : styles.statusError
          }`}
        >
          {statusMessage.text}
        </p>
      )}
    </div>
  );
}
