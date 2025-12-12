import styles from './Icon.module.css';

export function CartIcon({ ready, className = '' }: { ready: boolean; className?: string }) {
  return (
    <span className={`${styles.iconWrapper} ${className}`} data-loaded={ready} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={styles.cartSvg} role="img" aria-hidden="true">
        <title>Корзина</title>
        <path
          fill="currentColor"
          d="M6.2 4.5c.1-.8.7-1.5 1.5-1.5h8.6c.8 0 1.4.7 1.5 1.5l.5 3.5H5.7l.5-3.5Zm-1 5h13.6c.9 0 1.5.9 1.3 1.7l-1.2 6.3c-.1.7-.7 1.2-1.3 1.2H6.4c-.7 0-1.3-.5-1.4-1.2l-1.2-6.3c-.2-.8.4-1.7 1.4-1.7Z"
        />
      </svg>
      <span className={styles.iconSkeleton} aria-hidden="true" />
    </span>
  );
}
