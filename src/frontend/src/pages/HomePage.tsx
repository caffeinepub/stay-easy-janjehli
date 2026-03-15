import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  Coffee,
  Mountain,
  Phone,
  Snowflake,
  Star,
  Tv,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import type { Room } from "../backend.d";
import AppHeader from "../components/AppHeader";
import { useGetRooms } from "../hooks/useQueries";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi size={11} />,
  WiFi: <Wifi size={11} />,
  Parking: <Car size={11} />,
  "Mountain View": <Mountain size={11} />,
  TV: <Tv size={11} />,
  "Tea/Coffee": <Coffee size={11} />,
  AC: <Snowflake size={11} />,
};

const ROOM_GRADIENTS = [
  "from-[oklch(0.40_0.22_27)] via-[oklch(0.52_0.20_30)] to-[oklch(0.62_0.15_45)]",
  "from-[oklch(0.28_0.12_270)] via-[oklch(0.42_0.18_27)] to-[oklch(0.55_0.16_35)]",
  "from-[oklch(0.35_0.18_27)] via-[oklch(0.45_0.16_40)] to-[oklch(0.70_0.12_80)]",
];

const SAMPLE_ROOMS: Room[] = [
  {
    id: BigInt(1),
    name: "Himalayan Deluxe Room",
    description: "Spacious room with stunning views of the Shikari Devi range.",
    pricePerNight: BigInt(800),
    amenities: ["Wi-Fi", "Mountain View", "TV", "Tea/Coffee"],
    available: true,
    photoUrl: null,
  },
  {
    id: BigInt(2),
    name: "Valley View Suite",
    description:
      "Premium suite overlooking the lush green valley with private seating area.",
    pricePerNight: BigInt(1200),
    amenities: ["Wi-Fi", "Mountain View", "AC", "TV", "Parking"],
    available: true,
    photoUrl: null,
  },
  {
    id: BigInt(3),
    name: "Budget Cozy Room",
    description: "Comfortable and affordable room perfect for solo travelers.",
    pricePerNight: BigInt(500),
    amenities: ["Wi-Fi", "TV"],
    available: true,
    photoUrl: null,
  },
];

const SERVICES = [
  {
    icon: <Mountain size={26} />,
    label: "Rooms",
    sub: "3 available",
    gradient: "from-[oklch(0.42_0.22_27)] to-[oklch(0.30_0.18_27)]",
    ocid: "services.rooms.button",
  },
  {
    icon: <Car size={26} />,
    label: "Taxi",
    sub: "Book a ride",
    gradient: "from-[oklch(0.32_0.08_250)] to-[oklch(0.22_0.06_260)]",
    ocid: "services.taxi.button",
  },
  {
    icon: <UtensilsCrossed size={26} />,
    label: "Restaurant",
    sub: "Local cuisine",
    gradient: "from-[oklch(0.45_0.14_55)] to-[oklch(0.35_0.12_50)]",
    ocid: "services.restaurant.button",
  },
  {
    icon: <Phone size={26} />,
    label: "Contact",
    sub: "Get in touch",
    gradient: "from-[oklch(0.38_0.08_145)] to-[oklch(0.28_0.06_150)]",
    ocid: "services.contact.button",
  },
];

interface HomePageProps {
  onViewRoom: (id: bigint) => void;
  onAdminClick?: () => void;
  onNavigate?: (tab: string) => void;
}

function MountainSilhouette() {
  return (
    <svg
      viewBox="0 0 430 80"
      className="w-full block"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Far mountains */}
      <path
        d="M0,80 L0,55 L60,20 L100,40 L150,5 L200,35 L240,15 L280,38 L330,8 L380,30 L430,18 L430,80 Z"
        fill="oklch(0.38 0.18 27 / 0.45)"
      />
      {/* Mid mountains */}
      <path
        d="M0,80 L0,65 L50,42 L90,58 L140,30 L185,52 L230,28 L270,50 L310,35 L360,55 L400,38 L430,50 L430,80 Z"
        fill="oklch(0.32 0.16 27 / 0.65)"
      />
      {/* Near mountains */}
      <path
        d="M0,80 L0,72 L40,60 L80,70 L120,52 L165,68 L205,48 L250,65 L295,50 L340,66 L385,55 L430,62 L430,80 Z"
        fill="oklch(0.26 0.14 27 / 0.80)"
      />
    </svg>
  );
}

function RoomCard({
  room,
  index,
  onView,
}: {
  room: Room;
  index: number;
  onView: () => void;
}) {
  const gradient = ROOM_GRADIENTS[(index - 1) % ROOM_GRADIENTS.length];
  const stars = index === 2 ? 5 : index === 1 ? 4 : 3;

  return (
    <motion.div
      data-ocid={`rooms.item.${index}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index - 1) * 0.1 }}
      className="bg-card rounded-2xl shadow-elevated overflow-hidden border border-border/50"
    >
      {/* Banner - photo or gradient */}
      <div
        className={`relative h-28 overflow-hidden ${room.photoUrl ? "" : `bg-gradient-to-br ${gradient}`}`}
      >
        {room.photoUrl && (
          <img
            src={room.photoUrl}
            alt={room.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {room.photoUrl && <div className="absolute inset-0 bg-black/30" />}
        {/* Decorative circles */}
        {!room.photoUrl && (
          <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/5" />
        )}
        {!room.photoUrl && (
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
        )}
        <div className="absolute top-2 right-3 flex gap-0.5">
          {stars >= 1 && (
            <Star key="s1" size={10} className="text-accent fill-accent" />
          )}
          {stars >= 2 && (
            <Star key="s2" size={10} className="text-accent fill-accent" />
          )}
          {stars >= 3 && (
            <Star key="s3" size={10} className="text-accent fill-accent" />
          )}
          {stars >= 4 && (
            <Star key="s4" size={10} className="text-accent fill-accent" />
          )}
          {stars >= 5 && (
            <Star key="s5" size={10} className="text-accent fill-accent" />
          )}
        </div>
        <div className="absolute inset-0 flex items-end px-4 pb-3">
          <div className="flex-1">
            <h3 className="font-display font-bold text-white text-lg leading-tight drop-shadow-sm">
              {room.name}
            </h3>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white/20">
            <span className="text-accent font-bold text-lg leading-none">
              ₹{room.pricePerNight.toString()}
            </span>
            <p className="text-white/70 text-[10px] mt-0.5">/ night</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
          {room.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 4).map((a) => (
            <Badge
              key={a}
              variant="secondary"
              className="text-[10px] px-2 py-1 gap-1 font-medium bg-secondary/80 text-secondary-foreground"
            >
              {AMENITY_ICONS[a] ?? null}
              {a}
            </Badge>
          ))}
          {room.amenities.length > 4 && (
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-1 text-muted-foreground"
            >
              +{room.amenities.length - 4} more
            </Badge>
          )}
        </div>

        <Button
          data-ocid={`rooms.item.button.${index}`}
          onClick={onView}
          className="w-full h-10 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all active:scale-[0.98]"
          disabled={!room.available}
        >
          {room.available ? "View Details & Book" : "Not Available"}
        </Button>
      </div>
    </motion.div>
  );
}

export default function HomePage({
  onViewRoom,
  onAdminClick,
  onNavigate,
}: HomePageProps) {
  const { data: rooms, isLoading } = useGetRooms();
  const displayRooms = rooms && rooms.length > 0 ? rooms : SAMPLE_ROOMS;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader onAdminClick={onAdminClick} />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        aria-label="Hero"
        style={{
          backgroundImage: "url('/assets/uploads/IMG_20260315_034739-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative px-5 pt-6 pb-0">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-4"
          >
            <Mountain size={12} className="text-accent" />
            <span className="text-white/90 text-xs font-medium">
              Himachal Pradesh • 2,150m
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-display font-bold text-4xl text-white leading-tight mb-2"
          >
            Welcome to <span className="text-accent">Stay Easy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm leading-relaxed mb-5 max-w-[280px]"
          >
            Experience the serenity of the Himalayas with comfort, style, and
            warm hospitality.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <Button
              data-ocid="hero.primary_button"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm px-6 h-11 rounded-full shadow-lg shadow-black/20 transition-all active:scale-[0.97]"
              onClick={() => {
                document
                  .getElementById("rooms-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Rooms
            </Button>
          </motion.div>

          {/* Mountain silhouette at the bottom of hero */}
          <MountainSilhouette />
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="px-4 py-5 bg-secondary" aria-label="Our Services">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Our Services
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map((svc, i) => (
            <motion.button
              key={svc.label}
              data-ocid={svc.ocid}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.(svc.label.toLowerCase())}
              className={`relative bg-gradient-to-br ${svc.gradient} rounded-2xl p-4 text-left overflow-hidden shadow-card group`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/5 -translate-y-6 translate-x-6" />
              <div className="relative">
                <span className="text-white/90 block mb-2">{svc.icon}</span>
                <p className="text-white font-bold text-base leading-tight">
                  {svc.label}
                </p>
                <p className="text-white/60 text-[11px] mt-0.5">{svc.sub}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Room listings ── */}
      <main
        id="rooms-section"
        className="flex-1 px-4 pb-6 bg-secondary"
        aria-label="Available Rooms"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-border" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Available Rooms
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>

        {isLoading ? (
          <div data-ocid="rooms.loading_state" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayRooms.map((room, idx) => (
              <RoomCard
                key={room.id.toString()}
                room={room}
                index={idx + 1}
                onView={() => onViewRoom(room.id)}
              />
            ))}
          </div>
        )}
      </main>

      <div className="bottom-nav-spacer" />

      <footer className="bg-secondary border-t border-border px-4 py-4 text-center">
        <p className="text-muted-foreground text-[11px]">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary font-semibold"
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
