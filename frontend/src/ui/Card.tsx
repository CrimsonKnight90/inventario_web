type CardProps = React.PropsWithChildren<{
  title?: string;
  footer?: React.ReactNode;
}>;

export function Card({ title, footer, children }: CardProps) {
  return (
    <div className="bg-[var(--color-surface)] rounded-lg shadow p-6">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      {children}
      {footer && <div className="pt-4 mt-4 border-t">{footer}</div>}
    </div>
  );
}
