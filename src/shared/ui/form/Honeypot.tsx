// src/shared/ui/form/Honeypot.tsx

import styles from './form.module.css';

type HoneypotProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Honeypot: скрыто от людей (не через display:none/hidden, чтобы
 * менее продвинутые боты не пропускали поле по атрибуту), реальные
 * пользователи никогда его не заполняют и не видят.
 */
export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
