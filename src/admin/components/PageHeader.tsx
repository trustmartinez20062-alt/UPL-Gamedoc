import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function PageHeader({ icon: Icon, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "hsl(175 80% 50% / 0.12)",
            border: "1px solid hsl(175 80% 50% / 0.25)",
          }}
        >
          <Icon size={22} style={{ color: "hsl(175 80% 50%)" }} />
        </div>
        <div>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "Orbitron, sans-serif", color: "hsl(210 20% 92%)" }}
          >
            {title}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "hsl(215 15% 55%)" }}>
            {description}
          </p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
