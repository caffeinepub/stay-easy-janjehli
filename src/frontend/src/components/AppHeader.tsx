import { Settings } from "lucide-react";

interface AppHeaderProps {
  subtitle?: string;
  onAdminClick?: () => void;
}

export default function AppHeader({ subtitle, onAdminClick }: AppHeaderProps) {
  return (
    <header className="relative bg-primary overflow-hidden">
      {/* Gold accent line at very top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,oklch(0.55_0.18_27/0.5),transparent_60%)]" />

      <div className="relative px-4 py-2 flex items-center gap-3">
        <img
          src="/assets/generated/stay-easy-logo-premium-transparent.dim_500x250.png"
          alt="Stay Easy Logo"
          className="h-14 w-auto max-w-[140px] object-contain drop-shadow-sm"
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
      {/* Bottom shadow gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />
    </header>
  );
}
