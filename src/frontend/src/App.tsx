import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
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

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedRoomId, setSelectedRoomId] = useState<bigint | null>(null);

  const navigateTo = (p: Page, roomId?: bigint) => {
    setPage(p);
    if (roomId !== undefined) setSelectedRoomId(roomId);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-muted flex justify-center">
        <div className="app-container">
          {page === "home" && (
            <HomePage
              onViewRoom={(id) => navigateTo("detail", id)}
              onAdminClick={() => navigateTo("admin")}
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
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
