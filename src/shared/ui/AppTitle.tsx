export interface AppTitleProps {
  title: string;
  subtitle: string;
  dragRegion?: boolean;
  className?: string;
}

export function AppTitle({ title, subtitle, dragRegion, className }: AppTitleProps) {
  return (
    <div
      className={["ds-app-title", className].filter(Boolean).join(" ")}
      data-tauri-drag-region={dragRegion ? true : undefined}
    >
      <span className="ds-app-title__mark">{title}</span>
      <span className="ds-app-title__subtitle">{subtitle}</span>
    </div>
  );
}
