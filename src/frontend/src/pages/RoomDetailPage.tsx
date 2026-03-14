import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Car,
  CheckCircle,
  Coffee,
  MessageCircle,
  Mountain,
  Phone,
  Snowflake,
  Tv,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Room } from "../backend.d";
import AppHeader from "../components/AppHeader";
import {
  useGetContactPhone,
  useGetRoomById,
  useSubmitBooking,
} from "../hooks/useQueries";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi size={16} />,
  WiFi: <Wifi size={16} />,
  Parking: <Car size={16} />,
  "Mountain View": <Mountain size={16} />,
  TV: <Tv size={16} />,
  "Tea/Coffee": <Coffee size={16} />,
  AC: <Snowflake size={16} />,
};

const SAMPLE_ROOMS: Record<string, Room> = {
  "1": {
    id: BigInt(1),
    name: "Himalayan Deluxe Room",
    description:
      "Spacious room with stunning panoramic views of the Shikari Devi mountain range. Wake up to misty mornings and serene mountain landscapes.",
    pricePerNight: BigInt(800),
    amenities: ["Wi-Fi", "Mountain View", "TV", "Tea/Coffee"],
    available: true,
  },
  "2": {
    id: BigInt(2),
    name: "Valley View Suite",
    description:
      "Premium suite overlooking the lush green valley with premium furnishings and private seating area.",
    pricePerNight: BigInt(1200),
    amenities: ["Wi-Fi", "Mountain View", "AC", "TV", "Parking"],
    available: true,
  },
  "3": {
    id: BigInt(3),
    name: "Budget Cozy Room",
    description:
      "Comfortable and affordable room perfect for solo travelers and backpackers exploring the valley.",
    pricePerNight: BigInt(500),
    amenities: ["Wi-Fi", "TV"],
    available: true,
  },
};

interface BookingFormProps {
  roomId: bigint;
  onSuccess: () => void;
}

function BookingForm({ roomId, onSuccess }: BookingFormProps) {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const { mutateAsync, isPending } = useSubmitBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !phone || !checkIn || !checkOut) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await mutateAsync({ roomId, guestName, phone, checkIn, checkOut });
      toast.success("Booking confirmed! We will contact you shortly.");
      onSuccess();
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <form
      data-ocid="booking.modal"
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
    >
      <div className="space-y-1.5">
        <Label
          htmlFor="guestName"
          className="text-foreground font-semibold text-sm"
        >
          Guest Name
        </Label>
        <Input
          data-ocid="booking.input"
          id="guestName"
          placeholder="Your full name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="h-11 border-border focus-visible:ring-primary"
        />
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="phone"
          className="text-foreground font-semibold text-sm"
        >
          Phone Number
        </Label>
        <Input
          data-ocid="booking.phone.input"
          id="phone"
          placeholder="+91 XXXXX XXXXX"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 border-border focus-visible:ring-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="checkIn"
            className="text-foreground font-semibold text-sm"
          >
            Check-in
          </Label>
          <Input
            data-ocid="booking.checkin.input"
            id="checkIn"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="h-11 border-border focus-visible:ring-primary"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="checkOut"
            className="text-foreground font-semibold text-sm"
          >
            Check-out
          </Label>
          <Input
            data-ocid="booking.checkout.input"
            id="checkOut"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="h-11 border-border focus-visible:ring-primary"
          />
        </div>
      </div>
      <Button
        data-ocid="booking.submit_button"
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base rounded-xl"
      >
        {isPending ? "Submitting..." : "Confirm Booking"}
      </Button>
    </form>
  );
}

interface RoomDetailPageProps {
  roomId: bigint;
  onBack: () => void;
}

export default function RoomDetailPage({
  roomId,
  onBack,
}: RoomDetailPageProps) {
  const { data: fetchedRoom, isLoading } = useGetRoomById(roomId);
  const { data: contactPhone, isLoading: phoneLoading } = useGetContactPhone();
  const [showForm, setShowForm] = useState(false);
  const [booked, setBooked] = useState(false);

  const room = fetchedRoom ?? SAMPLE_ROOMS[roomId.toString()];
  const displayPhone = contactPhone ?? "+91 98765 43210";
  const waNumber = displayPhone.replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />

      {/* Back bar */}
      <div className="bg-primary px-3 py-2">
        <button
          type="button"
          data-ocid="detail.back.button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Rooms</span>
        </button>
      </div>

      <main className="flex-1 bg-secondary px-4 py-5 space-y-5">
        {isLoading ? (
          <div data-ocid="detail.loading_state" className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : room ? (
          <>
            {/* Room name + price */}
            <div className="bg-card rounded-xl shadow-card p-4 border border-border">
              <h2 className="text-foreground font-bold text-xl font-display mb-2">
                {room.name}
              </h2>
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-xl px-4 py-2 flex items-baseline gap-1">
                  <span className="text-primary-foreground font-bold text-2xl">
                    ₹{room.pricePerNight.toString()}
                  </span>
                  <span className="text-primary-foreground/80 text-sm">
                    / Night
                  </span>
                </div>
                {room.available ? (
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    <CheckCircle size={14} /> Available
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Not Available
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-card rounded-xl shadow-card p-4 border border-border">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-3 opacity-70">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-2 text-foreground text-sm"
                  >
                    <span className="text-primary">
                      {AMENITY_ICONS[a] ?? <Mountain size={16} />}
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              {phoneLoading ? (
                <Skeleton className="h-12 rounded-xl" />
              ) : (
                <a
                  data-ocid="detail.call.button"
                  href={`tel:${displayPhone}`}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-12 text-sm transition-colors"
                >
                  <Phone size={16} />
                  Call Now
                </a>
              )}
              {phoneLoading ? (
                <Skeleton className="h-12 rounded-xl" />
              ) : (
                <a
                  data-ocid="detail.whatsapp.button"
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-12 text-sm transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              )}
            </div>

            {/* Booking section */}
            {booked ? (
              <div
                data-ocid="booking.success_state"
                className="bg-green-50 border border-green-200 rounded-xl p-5 text-center"
              >
                <CheckCircle
                  size={36}
                  className="text-green-600 mx-auto mb-2"
                />
                <h3 className="font-bold text-green-800 text-lg">
                  Booking Confirmed!
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  We will contact you shortly to confirm your stay.
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
                {!showForm ? (
                  <Button
                    data-ocid="booking.open_modal_button"
                    onClick={() => setShowForm(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-base rounded-none"
                    disabled={!room.available}
                  >
                    Submit Booking Request
                  </Button>
                ) : (
                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-base mb-1">
                      Book Your Stay
                    </h3>
                    <p className="text-muted-foreground text-xs mb-4">
                      Fill in your details and we'll confirm your booking.
                    </p>
                    <BookingForm
                      roomId={room.id}
                      onSuccess={() => setBooked(true)}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div
            data-ocid="detail.error_state"
            className="text-center py-10 text-muted-foreground"
          >
            Room not found.
          </div>
        )}
      </main>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
