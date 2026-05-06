import clsx from "clsx";
import { ReactNode } from "react";

interface PanelProps {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  noPad?: boolean;
}

export default function Panel({
  title,
  right,
  children,
  className,
  bodyClassName,
  noPad,
}: PanelProps) {
  return (
    <section className={clsx("panel flex flex-col", className)}>
      {title && (
        <header className="panel-header">
          <h3 className="panel-title">{title}</h3>
          {right && <div className="flex items-center gap-2">{right}</div>}
        </header>
      )}
      <div className={clsx("flex-1", !noPad && "p-4", bodyClassName)}>{children}</div>
    </section>
  );
}
