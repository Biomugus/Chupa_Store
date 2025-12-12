import styles from './Icon.module.css';

export function LogoMark({ ready, className = '' }: { ready: boolean; className?: string }) {
  return (
    <span className={`${styles.iconWrapper} ${className}`} data-loaded={ready}>
      <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className={styles.logoSvg}>
        <title>Логотип Chupa Store</title>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M16 50 28 12c.3-1 1.4-1.6 2.4-1.3l5.5 1.6c1 .3 1.6 1.4 1.3 2.4L25 53.8c-.3 1-1.4 1.6-2.4 1.3l-5.5-1.6c-1-.3-1.6-1.4-1.3-2.4Z" />
          <path d="M19 44 45 18M26 49l26-26" />
          <path d="m41 44 7.5 7.5c.6.6 1.7.6 2.4 0l2.8-2.8c.6-.6.6-1.7 0-2.4L46 38M41 44l-6-6M37 33l6 6" />
          <path d="M37 24h10c1 0 1.8.8 1.8 1.8v3.4c0 1-.8 1.8-1.8 1.8h-4.2" />
        </g>
      </svg>
      <span className={styles.iconSkeleton} aria-hidden="true" />
    </span>
  );
}
