import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import AppHeader from "../components/AppHeader";
import { useGetContactPhone } from "../hooks/useQueries";

export default function ContactPage() {
  const { data: phone, isLoading } = useGetContactPhone();
  const displayPhone = phone ?? "+91 98765 43210";
  const waNumber = displayPhone.replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader subtitle="Contact Us" />

      <main className="flex-1 bg-secondary px-4 py-6 space-y-4">
        {/* Logo hero */}
        <div className="bg-primary rounded-2xl p-6 flex flex-col items-center shadow-elevated">
          <img
            src="/assets/uploads/IMG-20260314-WA0050-1.jpg"
            alt="Stay Easy Logo"
            className="w-24 h-24 rounded-full object-cover bg-white/10 mb-3"
          />
          <h2 className="text-primary-foreground font-bold text-2xl font-display">
            Stay Easy
          </h2>
        </div>

        {/* Contact details */}
        <div className="bg-card rounded-xl shadow-card border border-border divide-y divide-border overflow-hidden">
          <a
            data-ocid="contact.call.button"
            href={isLoading ? undefined : `tel:${displayPhone}`}
            className="flex items-center gap-4 p-4 hover:bg-secondary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Phone</p>
              {isLoading ? (
                <Skeleton className="h-5 w-36 mt-1" />
              ) : (
                <p className="text-foreground font-bold text-base">
                  {displayPhone}
                </p>
              )}
            </div>
          </a>

          <a
            data-ocid="contact.whatsapp.button"
            href={isLoading ? undefined : `https://wa.me/${waNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-4 hover:bg-secondary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <MessageCircle size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                WhatsApp
              </p>
              {isLoading ? (
                <Skeleton className="h-5 w-36 mt-1" />
              ) : (
                <p className="text-foreground font-bold text-base">
                  {displayPhone}
                </p>
              )}
            </div>
          </a>

          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Address
              </p>
              <p className="text-foreground font-semibold text-sm leading-snug">
                Mandi District
              </p>
              <p className="text-muted-foreground text-xs">
                Himachal Pradesh, India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Clock size={18} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Check-in / Check-out
              </p>
              <p className="text-foreground font-semibold text-sm">
                12:00 PM / 11:00 AM
              </p>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <div className="bg-primary/5 h-32 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={28} className="text-primary mx-auto mb-1" />
              <p className="text-sm font-semibold text-foreground">
                Himachal Pradesh
              </p>
              <p className="text-xs text-muted-foreground">
                2,150m • Mandi District
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="bottom-nav-spacer" />

      <footer className="bg-secondary border-t border-border px-4 py-3 text-center">
        <p className="text-muted-foreground text-[11px]">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
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
