import type { DetailChoice, DetailField } from "@/lib/types";

export function Field({
  label,
  value,
  onChange,
  required = false,
  textarea = false,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
}) {
  const className =
    "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-base outline-none focus:border-calm focus:ring-2 focus:ring-teal-100";

  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      {textarea ? (
        <textarea className={`${className} min-h-28`} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
      ) : (
        <input className={className} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} value={value} />
      )}
    </label>
  );
}

export function DetailChoiceField({
  label,
  value,
  noneLabel,
  onChange
}: {
  label: string;
  value: DetailField;
  noneLabel: string;
  onChange: (value: DetailField) => void;
}) {
  const options: Array<[DetailChoice, string]> = [
    ["none", noneLabel],
    ["not_sure", "不确定 / Not sure"],
    ["details", "补充说明 / Add details"]
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-2 grid gap-2">
        {options.map(([choice, text]) => (
          <label className="flex items-center gap-3 rounded-md border border-line bg-white p-3" key={choice}>
            <input
              checked={value.choice === choice}
              className="h-5 w-5 accent-calm"
              onChange={() => onChange({ ...value, choice })}
              type="radio"
            />
            <span>{text}</span>
          </label>
        ))}
      </div>
      {value.choice === "details" ? (
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-line bg-white px-4 py-3 outline-none focus:border-calm focus:ring-2 focus:ring-teal-100"
          onChange={(event) => onChange({ ...value, details: event.target.value })}
          placeholder="请填写英文或中文细节 / Add details"
          value={value.details ?? ""}
        />
      ) : null}
    </div>
  );
}
