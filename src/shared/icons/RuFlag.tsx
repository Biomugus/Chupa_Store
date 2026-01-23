export function RuFlag({ width = 44, height = 24 }: { width?: number; height?: number }) {
  const ratio = width / 24;

  return (
    <svg
      width={width}
      height={height ?? 16 * ratio}
      viewBox="0 0 24 16"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <rect width="24" height="16" rx="2" fill="#ffffff" />
      <rect y="5.3333" width="24" height="5.3333" fill="#0039A6" />
      <rect y="10.6667" width="24" height="5.3333" fill="#D52B1E" />
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="15"
        rx="1.5"
        ry="1.5"
        fill="none"
        stroke="rgba(0,0,0,0.18)"
      />
    </svg>
  );
}
