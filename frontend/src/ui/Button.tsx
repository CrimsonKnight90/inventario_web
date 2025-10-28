import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  block?: boolean;
};

export function Button({ variant = "primary", size = "md", block = false, className, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-2.5 text-lg",
  }[size];

  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    outline: "border border-gray-300 text-[var(--color-text)] hover:bg-gray-50",
    danger: "bg-[var(--color-danger)] text-white hover:brightness-95",
    ghost: "text-[var(--color-text)] hover:bg-gray-100",
  }[variant];

  return (
    <button
      className={clsx(base, sizes, variants, block && "w-full", className)}
      {...props}
    />
  );
}
