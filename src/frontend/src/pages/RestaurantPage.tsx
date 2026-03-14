import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Utensils } from "lucide-react";
import type { MenuItem } from "../backend.d";
import AppHeader from "../components/AppHeader";
import { useGetContactPhone, useGetMenuItems } from "../hooks/useQueries";

const CATEGORY_CONFIG: Record<string, { emoji: string; label: string }> = {
  Meals: { emoji: "🍛", label: "Meals" },
  Snacks: { emoji: "🍿", label: "Snacks" },
  Drinks: { emoji: "☕", label: "Drinks" },
};

const CATEGORY_ORDER = ["Meals", "Snacks", "Drinks"];

export default function RestaurantPage() {
  const { data: phone, isLoading: phoneLoading } = useGetContactPhone();
  const { data: menuItems, isLoading: menuLoading } = useGetMenuItems();
  const displayPhone = phone ?? "+91 98765 43210";

  // Group items by category
  const grouped: Record<string, MenuItem[]> = {};
  if (menuItems) {
    for (const item of menuItems) {
      const cat = item.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
  }

  const categories = CATEGORY_ORDER.filter(
    (c) => grouped[c] && grouped[c].length > 0,
  );
  // Add any categories not in the predefined order
  for (const cat of Object.keys(grouped)) {
    if (!categories.includes(cat)) categories.push(cat);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader subtitle="Restaurant" />

      <main className="flex-1 bg-secondary px-4 py-6 space-y-5">
        <div className="bg-primary rounded-2xl p-5 flex items-center gap-4 shadow-elevated">
          <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-3xl">
            🍽️
          </div>
          <div>
            <h2 className="text-primary-foreground font-bold text-xl font-display">
              Stay Easy Restaurant
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-0.5">
              Home-style Himachali &amp; North Indian food
            </p>
          </div>
        </div>

        {menuLoading ? (
          <div data-ocid="restaurant.menu.loading_state" className="space-y-4">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : categories.length > 0 ? (
          categories.map((cat, si) => {
            const config = CATEGORY_CONFIG[cat] ?? { emoji: "🍽️", label: cat };
            const items = grouped[cat];
            return (
              <section key={cat} data-ocid={`restaurant.menu.panel.${si + 1}`}>
                <h3 className="text-foreground font-bold text-base mb-3">
                  {config.emoji} {config.label}
                </h3>
                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card divide-y divide-border">
                  {items.map((item, ii) => (
                    <div
                      key={item.id.toString()}
                      data-ocid={`restaurant.menu.item.${si * 20 + ii + 1}`}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <p className="text-foreground text-sm font-medium">
                        {item.name}
                      </p>
                      <span className="text-primary font-bold text-sm whitespace-nowrap">
                        ₹{item.price.toString()}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div
            data-ocid="restaurant.menu.empty_state"
            className="bg-card rounded-xl border border-border p-8 text-center"
          >
            <p className="text-muted-foreground text-sm">
              Menu coming soon. Call us to know today's specials!
            </p>
          </div>
        )}

        <a
          data-ocid="restaurant.call.button"
          href={phoneLoading ? undefined : `tel:${displayPhone}`}
          className="flex items-center gap-4 bg-primary rounded-2xl p-4 shadow-elevated"
        >
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
            <Phone size={20} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground/70 text-xs font-medium">
              Call to Order Food
            </p>
            {phoneLoading ? (
              <Skeleton className="h-6 w-40 mt-1 bg-white/30" />
            ) : (
              <p className="text-primary-foreground font-bold text-lg">
                {displayPhone}
              </p>
            )}
          </div>
        </a>

        <div className="bg-card rounded-xl border border-border p-4 shadow-card flex items-center gap-3">
          <Utensils size={20} className="text-primary flex-shrink-0" />
          <p className="text-muted-foreground text-sm">
            Room service available. Call us to order food at your room anytime.
          </p>
        </div>
      </main>

      <div className="bottom-nav-spacer" />

      <footer className="bg-secondary border-t border-border px-4 py-3 text-center">
        <p className="text-muted-foreground text-[11px]">
          {"© "}
          {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary font-medium"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
