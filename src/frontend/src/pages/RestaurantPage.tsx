import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Phone, Utensils } from "lucide-react";
import AppHeader from "../components/AppHeader";
import { useGetContactPhone } from "../hooks/useQueries";

const menu = [
  {
    category: "Breakfast",
    emoji: "🌅",
    time: "7:00 AM - 10:30 AM",
    items: [
      { name: "Parantha with Curd & Pickle", price: "Rs. 80" },
      { name: "Poori Sabzi", price: "Rs. 70" },
      { name: "Omelette Bread", price: "Rs. 60" },
      { name: "Masala Chai", price: "Rs. 20" },
    ],
  },
  {
    category: "Lunch & Dinner",
    emoji: "🍛",
    time: "12:00 PM - 3:00 PM & 7:00 PM - 10:00 PM",
    items: [
      { name: "Dal Fry + Rice + Roti", price: "Rs. 150" },
      { name: "Rajma Chawal", price: "Rs. 140" },
      { name: "Veg Thali (Full)", price: "Rs. 200" },
      { name: "Chicken Curry + Rice", price: "Rs. 250" },
      { name: "Paneer Butter Masala", price: "Rs. 220" },
    ],
  },
  {
    category: "Snacks & Beverages",
    emoji: "☕",
    time: "Anytime",
    items: [
      { name: "Maggi Noodles", price: "Rs. 60" },
      { name: "Bread Pakora", price: "Rs. 50" },
      { name: "Samosa (2 pcs)", price: "Rs. 30" },
      { name: "Cold Drink / Juice", price: "Rs. 40" },
      { name: "Lassi", price: "Rs. 50" },
    ],
  },
];

export default function RestaurantPage() {
  const { data: phone, isLoading } = useGetContactPhone();
  const displayPhone = phone ?? "+91 98765 43210";

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
              Home-style Himachali & North Indian food
            </p>
          </div>
        </div>

        {menu.map((section, si) => (
          <section
            key={section.category}
            data-ocid={`restaurant.menu.panel.${si + 1}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground font-bold text-base">
                {section.emoji} {section.category}
              </h3>
              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock size={12} />
                {section.time}
              </span>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card divide-y divide-border">
              {section.items.map((item, ii) => (
                <div
                  key={item.name}
                  data-ocid={`restaurant.menu.item.${si * 10 + ii + 1}`}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <p className="text-foreground text-sm font-medium">
                    {item.name}
                  </p>
                  <span className="text-primary font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <a
          data-ocid="restaurant.call.button"
          href={isLoading ? undefined : `tel:${displayPhone}`}
          className="flex items-center gap-4 bg-primary rounded-2xl p-4 shadow-elevated"
        >
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
            <Phone size={20} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground/70 text-xs font-medium">
              Call to Order Food
            </p>
            {isLoading ? (
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
