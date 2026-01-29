// src/modules/catalog/components/CatalogLayout/CatalogLayout.tsx

import styles from './catalogLayout.module.css';

type CatalogLayoutProps = {
  sidebar: React.ReactNode;
  quickFilters?: React.ReactNode;
  children: React.ReactNode;
};

function CatalogLayout({ sidebar, quickFilters, children }: CatalogLayoutProps) {
  return (
    <div className={styles.container}>
      {quickFilters && <div className={styles.heroPreview}>{quickFilters}</div>}
      <div className={styles.content}>
        <aside className={styles.sidebar}>{sidebar}</aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

export default CatalogLayout;
