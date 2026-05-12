type ProgressProps = {
  parentComplete?: boolean;
  studentComplete?: boolean;
};

export function Progress({ parentComplete = false, studentComplete = false }: ProgressProps) {
  const items = [
    ["Parent section complete", parentComplete],
    ["Student section complete", studentComplete],
    ["Emergency kit ready", parentComplete && studentComplete]
  ] as const;

  return (
    <div className="grid gap-2 rounded-md border border-line bg-white/90 p-3 shadow-sm sm:grid-cols-3">
      {items.map(([label, done]) => (
        <div className="flex items-center gap-2 text-sm" key={label}>
          <span className={`h-3 w-3 rounded-full ${done ? "bg-calm" : "bg-line"}`} />
          <span className={done ? "font-semibold text-ink" : "text-gray-500"}>{label}</span>
        </div>
      ))}
    </div>
  );
}
