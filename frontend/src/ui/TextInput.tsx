import React, { forwardRef } from "react";
import clsx from "clsx";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-[var(--color-muted)]">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          "w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
          error && "border-[var(--color-danger)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
});

TextInput.displayName = "TextInput";
