import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-light text-bg font-bold",
  secondary:
    "bg-surface hover:bg-border text-text-main font-bold border border-border",
  outline:
    "bg-transparent hover:bg-surface text-primary font-bold border border-primary",
};

export default function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = `py-3 px-8 rounded-lg text-lg transition-colors ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={base}>
        {children}
      </a>
    );
  }

  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
}
