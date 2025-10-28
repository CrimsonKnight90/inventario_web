type AlertProps = {
  variant?: "info" | "success" | "warning" | "danger";
  children: React.ReactNode;
};

export function Alert({ variant = "info", children }: AlertProps) {
  const palette = {
    info: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    success: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    warning: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    danger: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  }[variant];

  return (
    <div className={`p-3 rounded border ${palette.bg} ${palette.text} ${palette.border}`}>
      {children}
    </div>
  );
}
