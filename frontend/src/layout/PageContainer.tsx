// src/layout/PageContainer.tsx

import { PropsWithChildren } from "react";

type Props = {
  title?: string;
  actions?: React.ReactNode;
};

export const PageContainer = ({ title, actions, children }: PropsWithChildren<Props>) => {
  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{title}</h1>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="bg-white shadow rounded p-4">{children}</div>
    </div>
  );
};
