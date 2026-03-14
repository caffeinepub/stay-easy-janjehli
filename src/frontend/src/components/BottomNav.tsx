import { Car, Home, Phone, Utensils } from "lucide-react";
import type { Page } from "../App";

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const tabs: Array<{
  page: Page;
  label: string;
  makeIcon: () => React.ReactNode;
  isActive: (p: Page) => boolean;
}> = [
  {
    page: "home",
    label: "Rooms",
    makeIcon: () => <Home size={20} />,
    isActive: (p) => p === "home" || p === "detail",
  },
  {
    page: "taxi",
    label: "Taxi",
    makeIcon: () => <Car size={20} />,
    isActive: (p) => p === "taxi",
  },
  {
    page: "restaurant",
    label: "Food",
    makeIcon: () => <Utensils size={20} />,
    isActive: (p) => p === "restaurant",
  },
  {
    page: "contact",
    label: "Contact",
    makeIcon: () => <Phone size={20} />,
    isActive: (p) => p === "contact",
  },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-primary shadow-elevated z-50">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.page}
            type="button"
            data-ocid={`nav.${tab.page}.link`}
            onClick={() => onNavigate(tab.page)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-all ${
              tab.isActive(currentPage)
                ? "text-accent"
                : "text-primary-foreground/70"
            }`}
          >
            {tab.makeIcon()}
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
