import { Settings } from "lucide-react";

interface AppHeaderProps {
  subtitle?: string;
  onAdminClick?: () => void;
}

export default function AppHeader({ subtitle, onAdminClick }: AppHeaderProps) {
  return (
    <header className="relative bg-primary overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,oklch(0.55_0.18_27/0.5),transparent_60%)]" />

      <div className="relative px-4 py-3 flex items-center gap-3">
        <img
          src="/assets/generated/stay-easy-logo-premium-transparent.dim_600x200.png"
          alt="Stay Easy Logo"
          className="h-16 w-auto max-w-[220px] object-contain drop-shadow-md"
        />
        {subtitle && (
          <p className="text-accent text-xs font-semibold flex-1 truncate">
            {subtitle}
          </p>
        )}
        {!subtitle && <div className="flex-1" />}
        {onAdminClick && (
          <button
            type="button"
            data-ocid="header.admin.button"
            onClick={onAdminClick}
            className="opacity-40 hover:opacity-75 transition-opacity p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Admin settings"
          >
            <Settings size={16} className="text-primary-foreground" />
          </button>
        )}
      </div>
    </header>
  );
}
