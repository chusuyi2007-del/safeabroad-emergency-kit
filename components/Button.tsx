import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

const variants = {
  primary: "bg-calm text-white border-calm hover:bg-teal-800",
  secondary: "bg-white text-ink border-line hover:border-calm",
  danger: "bg-white text-red-700 border-red-200 hover:border-red-500"
};

export function Button({
  children,
  href,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false
}: ButtonProps) {
  const className = `inline-flex min-h-12 w-full items-center justify-center rounded-md border px-5 py-3 text-center text-base font-semibold transition sm:w-auto ${
    variants[variant]
  } ${disabled ? "pointer-events-none opacity-50" : ""}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
