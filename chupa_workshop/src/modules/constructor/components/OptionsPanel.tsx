type OptionsPanelProps = {
  options: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

export default function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  const entries = Object.entries(options);

  if (!entries.length) {
    return <div>No options yet</div>;
  }

  return (
    <div>
      {entries.map(([key, value]) => (
        <label key={key}>
          {key}
          <input value={value} onChange={(event) => onChange(key, event.target.value)} />
        </label>
      ))}
    </div>
  );
}
