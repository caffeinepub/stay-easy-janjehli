import { Skeleton } from "@/components/ui/skeleton";
import { Car, MapPin, Phone } from "lucide-react";
import AppHeader from "../components/AppHeader";
import { useGetContactPhone } from "../hooks/useQueries";

const vehicles = [
  {
    name: "Hatchback",
    capacity: "4 Seater",
    example: "Swift / WagonR",
    icon: "🚗",
  },
  { name: "Sedan", capacity: "4 Seater", example: "Dzire / Etios", icon: "🚙" },
  {
    name: "SUV",
    capacity: "6-7 Seater",
    example: "Innova / Ertiga",
    icon: "🚐",
  },
  {
    name: "Tempo Traveller",
    capacity: "12 Seater",
    example: "Force Traveller",
    icon: "🚌",
  },
];

const routes = [
  {
    destination: "Shimla",
    distance: "~110 km",
    time: "3-4 hrs",
    price: "2,500 - 4,500",
  },
  {
    destination: "Mandi City",
    distance: "~25 km",
    time: "45 min",
    price: "600 - 1,000",
  },
  {
    destination: "Kullu / Manali",
    distance: "~130 km",
    time: "4-5 hrs",
    price: "3,000 - 5,500",
  },
  {
    destination: "Chandigarh Airport",
    distance: "~220 km",
    time: "5-6 hrs",
    price: "5,000 - 8,000",
  },
  {
    destination: "Dharamsala",
    distance: "~150 km",
    time: "4-5 hrs",
    price: "3,500 - 6,000",
  },
];

export default function TaxiPage() {
  const { data: phone, isLoading } = useGetContactPhone();
  const displayPhone = phone ?? "+91 98765 43210";

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader subtitle="Taxi Service" />

      <main className="flex-1 bg-secondary px-4 py-6 space-y-5">
        <div className="bg-primary rounded-2xl p-5 flex items-center gap-4 shadow-elevated">
          <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-3xl">
            🚕
          </div>
          <div>
            <h2 className="text-primary-foreground font-bold text-xl font-display">
              Taxi Booking
            </h2>
            <p className="text-primary-foreground/70 text-sm mt-0.5">
              Reliable rides across Himachal Pradesh
            </p>
          </div>
        </div>

        <section>
          <h3 className="text-foreground font-bold text-base mb-3 flex items-center gap-2">
            <Car size={18} className="text-primary" />
            Available Vehicles
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {vehicles.map((v, i) => (
              <div
                key={v.name}
                data-ocid={`taxi.vehicle.item.${i + 1}`}
                className="bg-card rounded-xl border border-border p-3 shadow-card"
              >
                <span className="text-2xl">{v.icon}</span>
                <p className="text-foreground font-bold text-sm mt-1">
                  {v.name}
                </p>
                <p className="text-primary text-xs font-semibold">
                  {v.capacity}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {v.example}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-foreground font-bold text-base mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            Popular Routes
          </h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card divide-y divide-border">
            {routes.map((r, i) => (
              <div
                key={r.destination}
                data-ocid={`taxi.route.item.${i + 1}`}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-foreground font-bold text-sm">
                      {r.destination}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {r.distance} - {r.time}
                    </p>
                  </div>
                  <span className="text-primary font-bold text-sm whitespace-nowrap">
                    Rs. {r.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs mt-2 px-1">
            * Prices vary by vehicle type. Call for exact quote.
          </p>
        </section>

        <a
          data-ocid="taxi.call.button"
          href={isLoading ? undefined : `tel:${displayPhone}`}
          className="flex items-center gap-4 bg-primary rounded-2xl p-4 shadow-elevated"
        >
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
            <Phone size={20} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground/70 text-xs font-medium">
              Call to Book a Taxi
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
