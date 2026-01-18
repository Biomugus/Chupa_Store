import styles from './spinner.module.css'

type SpinnerProps = {
  size?: number
  color?: string
}

export default function Spinner({ size = 48, color = '#4F46E5' }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={styles.spinner}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={styles.path}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}
