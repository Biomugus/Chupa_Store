import styles from './header/Header.module.css'

type MenuToggleProps = {
  isOpen: boolean
  onToggle: () => void
  ariaControls: string
}

export function MenuToggle({ isOpen, onToggle, ariaControls }: MenuToggleProps) {
  return (
    <button
      type="button"
      className={styles.menuToggle}
      aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      onClick={onToggle}
    >
      <span className={styles.menuBar} />
      <span className={styles.menuBar} />
      <span className={styles.menuBar} />
    </button>
  )
}
