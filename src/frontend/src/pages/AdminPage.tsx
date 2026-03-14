import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  LogIn,
  Phone,
  Settings,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Room } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetContactPhone,
  useGetRooms,
  useIsCallerAdmin,
  useIsStripeConfigured,
  useSetStripeConfiguration,
  useUpdateContactPhone,
  useUpdateRoom,
} from "../hooks/useQueries";

interface RoomEditCardProps {
  room: Room;
}

function RoomEditCard({ room }: RoomEditCardProps) {
  const [name, setName] = useState(room.name);
  const [description, setDescription] = useState(room.description);
  const [price, setPrice] = useState(room.pricePerNight.toString());
  const updateRoom = useUpdateRoom();

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) {
      toast.error("Name and price are required");
      return;
    }
    const priceNum = Number.parseInt(price, 10);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    try {
      await updateRoom.mutateAsync({
        id: room.id,
        name: name.trim(),
        description: description.trim(),
        price: BigInt(priceNum),
      });
      toast.success(`"${name}" updated successfully!`);
    } catch {
      toast.error("Failed to update room. Please try again.");
    }
  };

  return (
    <div
      data-ocid="admin.room.card"
      className="bg-card rounded-xl border border-border p-4 space-y-3 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold text-xs">
            R{room.id.toString()}
          </span>
        </div>
        <span className="font-semibold text-foreground text-sm">
          {room.name}
        </span>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Room Name
        </Label>
        <Input
          data-ocid="admin.room.input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 text-sm"
          placeholder="Room name"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Description
        </Label>
        <Textarea
          data-ocid="admin.room.textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm resize-none"
          rows={3}
          placeholder="Room description"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Price per Night (₹)
        </Label>
        <Input
          data-ocid="admin.room.price.input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          min="1"
          className="h-10 text-sm"
          placeholder="e.g. 1200"
        />
      </div>

      <Button
        data-ocid="admin.room.save_button"
        onClick={handleSave}
        disabled={updateRoom.isPending}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
      >
        {updateRoom.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save Room"
        )}
      </Button>
    </div>
  );
}

function PaymentSettingsSection() {
  const { data: isConfigured, isLoading: configLoading } =
    useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("IN");

  const handleSave = async () => {
    if (!secretKey.trim()) {
      toast.error("Please enter a Stripe Secret Key");
      return;
    }
    const allowedCountries = countries
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    try {
      await setConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries,
      });
      setSecretKey("");
      toast.success("Payment settings saved!");
    } catch {
      toast.error("Failed to save payment settings.");
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-foreground font-bold text-base flex items-center gap-2">
        <CreditCard size={16} className="text-primary" />
        Payment Settings (Stripe)
      </h2>
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        {/* Status badge */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Status:</span>
          {configLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : isConfigured ? (
            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <CheckCircle2 size={14} /> Configured
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500 font-semibold">
              <XCircle size={14} /> Not Configured
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Stripe Secret Key
          </Label>
          <Input
            data-ocid="admin.stripe_key.input"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="sk_live_..."
            className="h-10 text-sm font-mono"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            Get your key from{" "}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noreferrer"
              className="underline text-primary"
            >
              Stripe Dashboard
            </a>
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Allowed Countries (comma-separated)
          </Label>
          <Input
            data-ocid="admin.stripe_countries.input"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            placeholder="IN, US, GB"
            className="h-10 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Use ISO country codes, e.g. IN for India
          </p>
        </div>

        <Button
          data-ocid="admin.stripe_save.button"
          onClick={handleSave}
          disabled={setConfig.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
        >
          {setConfig.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Payment Settings"
          )}
        </Button>
      </div>
    </section>
  );
}

interface AdminPageProps {
  onBack: () => void;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const { login, isLoggingIn, identity, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const {
    data: isAdmin,
    isLoading: adminLoading,
    isError: adminError,
  } = useIsCallerAdmin();
  const { data: rooms, isLoading: roomsLoading } = useGetRooms();
  const { data: contactPhone, isLoading: phoneLoading } = useGetContactPhone();

  const [newPhone, setNewPhone] = useState("");
  const updatePhone = useUpdateContactPhone();

  const handlePhoneSave = async () => {
    const phone = newPhone.trim();
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }
    try {
      await updatePhone.mutateAsync(phone);
      setNewPhone("");
      toast.success("Contact number updated!");
    } catch {
      toast.error("Failed to update phone number.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-primary px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="admin.back.button"
          onClick={onBack}
          className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Settings size={18} className="text-primary-foreground" />
          <span className="text-primary-foreground font-bold text-lg">
            Admin Panel
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-5">
        {/* Not logged in */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center justify-center py-16 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LogIn size={28} className="text-primary" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="font-bold text-foreground text-xl">Admin Login</h2>
              <p className="text-muted-foreground text-sm">
                Login to manage rooms, rates &amp; contact info
              </p>
            </div>
            <Button
              data-ocid="admin.login.primary_button"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
          </div>
        )}

        {/* Logged in but not admin or error */}
        {isLoggedIn && !adminLoading && (isAdmin === false || adminError) && (
          <div
            data-ocid="admin.error_state"
            className="flex flex-col items-center justify-center py-16 space-y-3 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <Settings size={28} className="text-destructive" />
            </div>
            <h2 className="font-bold text-foreground text-xl">Access Denied</h2>
            <p className="text-muted-foreground text-sm">
              Your account does not have admin privileges.
            </p>
            <Button variant="outline" onClick={onBack} className="mt-2">
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clear();
              }}
              className="mt-2"
              data-ocid="admin.logout.button"
            >
              Try Different Account
            </Button>
          </div>
        )}

        {/* Loading admin check */}
        {isLoggedIn && adminLoading && (
          <div data-ocid="admin.loading_state" className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        )}

        {/* Admin content */}
        {isLoggedIn && !adminLoading && isAdmin && (
          <>
            {/* Contact Phone Section */}
            <section className="space-y-3">
              <h2 className="text-foreground font-bold text-base flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                Contact Phone Number
              </h2>
              <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Current:</span>
                  {phoneLoading ? (
                    <Skeleton className="h-4 w-36" />
                  ) : (
                    <span className="font-bold text-foreground">
                      {contactPhone}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    New Phone Number
                  </Label>
                  <Input
                    data-ocid="admin.phone.input"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +91 99999 88888"
                    type="tel"
                    className="h-10 text-sm"
                  />
                </div>
                <Button
                  data-ocid="admin.phone.save_button"
                  onClick={handlePhoneSave}
                  disabled={updatePhone.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
                >
                  {updatePhone.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Update Phone Number"
                  )}
                </Button>
              </div>
            </section>

            {/* Payment Settings Section */}
            <PaymentSettingsSection />

            {/* Rooms Section */}
            <section className="space-y-3">
              <h2 className="text-foreground font-bold text-base">
                Edit Rooms
              </h2>
              {roomsLoading ? (
                <div
                  data-ocid="admin.rooms.loading_state"
                  className="space-y-3"
                >
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-48 w-full rounded-xl" />
                </div>
              ) : rooms && rooms.length > 0 ? (
                rooms.map((room) => (
                  <RoomEditCard key={room.id.toString()} room={room} />
                ))
              ) : (
                <div
                  data-ocid="admin.rooms.empty_state"
                  className="bg-card rounded-xl border border-border p-6 text-center"
                >
                  <p className="text-muted-foreground text-sm">
                    No rooms found.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
