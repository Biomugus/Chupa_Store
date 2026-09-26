// src/modules/contacts/ui/CopyButton.tsx

'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import styles from './contactChannels.module.css';

const COPIED_RESET_MS = 2000;

type CopyButtonProps = {
  value: string;
  /** Что копируем — для aria-label, например «номер телефона». */
  label: string;
};

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard API недоступен (http, старый браузер) — значение и так видно на экране.
    }
  };

  const Icon = copied ? Check : Copy;

  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={handleCopy}
      aria-label={`Скопировать ${label}`}
    >
      <Icon className={styles.copyIcon} aria-hidden="true" />
      <span className={styles.copyText} aria-live="polite">
        {copied ? 'Скопировано' : 'Копировать'}
      </span>
    </button>
  );
}
