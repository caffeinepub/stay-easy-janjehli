import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import TaxiPage from "./pages/TaxiPage";

const queryClient = new QueryClient();

export type Page =
  | "home"
  | "detail"
  | "contact"
  | "taxi"
  | "restaurant"
  | "admin";

function AppContent() {
  const [page, setPage] = useState<Page>("home");
  const [selectedRoomId, setSelectedRoomId] = useState<bigint | null>(null);

  const navigateTo = (p: Page, roomId?: bigint) => {
    setPage(p);
    if (roomId !== undefined) setSelectedRoomId(roomId);
  };

  const handleNavigate = (tab: string) => {
    if (tab === "rooms" || tab === "home") navigateTo("home");
    else if (tab === "taxi") navigateTo("taxi");
    else if (tab === "restaurant") navigateTo("restaurant");
    else if (tab === "contact") navigateTo("contact");
  };

  return (
    <div className="min-h-screen bg-muted flex justify-center">
      <div className="app-container">
        {page === "home" && (
          <HomePage
            onViewRoom={(id) => navigateTo("detail", id)}
            onAdminClick={() => navigateTo("admin")}
            onNavigate={handleNavigate}
          />
        )}
        {page === "detail" && selectedRoomId !== null && (
          <RoomDetailPage
            roomId={selectedRoomId}
            onBack={() => navigateTo("home")}
          />
        )}
        {page === "contact" && <ContactPage />}
        {page === "taxi" && <TaxiPage />}
        {page === "restaurant" && <RestaurantPage />}
        {page === "admin" && <AdminPage onBack={() => navigateTo("home")} />}
        {page !== "admin" && (
          <BottomNav currentPage={page} onNavigate={(p) => navigateTo(p)} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <InternetIdentityProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <Toaster position="top-center" />
      </QueryClientProvider>
    </InternetIdentityProvider>
  );
}
