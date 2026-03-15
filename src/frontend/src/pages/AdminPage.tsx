import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  CreditCard,
  ImagePlus,
  Loader2,
  LogIn,
  Phone,
  Plus,
  Settings,
  ShieldAlert,
  Trash2,
  Utensils,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem, Room, TaxiOption } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddMenuItem,
  useAddRoom,
  useAddTaxiOption,
  useDeleteMenuItem,
  useDeleteRoom,
  useDeleteTaxiOption,
  useGetContactPhone,
  useGetMenuItems,
  useGetRooms,
  useGetTaxiOptions,
  useIsCallerAdmin,
  useIsStripeConfigured,
  useSetStripeConfiguration,
  useUpdateContactPhone,
  useUpdateMenuItem,
  useUpdateRoom,
  useUpdateTaxiOption,
} from "../hooks/useQueries";
import { useUploadFile } from "../hooks/useUploadFile";

// ── Room Management ──────────────────────────────────────────────────────────

function RoomCard({ room, index }: { room: Room; index: number }) {
  const [name, setName] = useState(room.name);
  const [description, setDescription] = useState(room.description);
  const [price, setPrice] = useState(room.pricePerNight.toString());
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    room.photoUrl ?? null,
  );
  const { uploadFile, uploadProgress, setUploadProgress } = useUploadFile();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setPhotoUrl(url);
      toast.success("Photo uploaded!");
    } catch {
      setUploadProgress(null);
      toast.error("Photo upload failed");
    }
  };

  const handleSave = async () => {
    const p = Number.parseInt(price, 10);
    if (!name.trim() || Number.isNaN(p) || p <= 0) {
      toast.error("Please enter valid name and price");
      return;
    }
    try {
      await updateRoom.mutateAsync({
        id: room.id,
        name: name.trim(),
        description: description.trim(),
        price: BigInt(p),
        photoUrl,
      });
      toast.success("Room updated!");
    } catch {
      toast.error("Failed to update room");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${room.name}"?`)) return;
    try {
      await deleteRoom.mutateAsync(room.id);
      toast.success("Room deleted!");
    } catch {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div
      data-ocid={`admin.room.item.${index}`}
      className="bg-card border border-border rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Room #{room.id.toString()}
        </span>
        <Button
          data-ocid={`admin.room.delete_button.${index}`}
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleteRoom.isPending}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
        >
          {deleteRoom.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <div>
          <Label className="text-xs text-muted-foreground">Room Name</Label>
          <Input
            data-ocid={`admin.room.input.${index}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Textarea
            data-ocid={`admin.room.textarea.${index}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="text-sm resize-none mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">
            Price per Night (₹)
          </Label>
          <Input
            data-ocid={`admin.room.price.input.${index}`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="1"
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Room Photo</Label>
        <label className="mt-1 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-primary/30 rounded-lg p-3 cursor-pointer hover:border-primary/60 transition-colors">
          <input
            data-ocid={`admin.room.upload_button.${index}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          {uploadProgress !== null ? (
            <div className="w-full">
              <div className="text-xs text-center text-muted-foreground mb-1">
                Uploading {uploadProgress}%
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : photoUrl ? (
            <img
              src={photoUrl}
              alt="Room"
              className="max-h-24 w-full object-cover rounded-lg"
            />
          ) : (
            <>
              <ImagePlus className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Upload Photo
              </span>
            </>
          )}
        </label>
      </div>
      <Button
        data-ocid={`admin.room.save_button.${index}`}
        onClick={handleSave}
        disabled={updateRoom.isPending}
        className="w-full h-9 text-sm font-semibold"
      >
        {updateRoom.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}

function AddRoomForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { uploadFile, uploadProgress, setUploadProgress } = useUploadFile();
  const addRoom = useAddRoom();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setPhotoUrl(url);
      toast.success("Photo uploaded!");
    } catch {
      setUploadProgress(null);
      toast.error("Photo upload failed");
    }
  };

  const handleAdd = async () => {
    const p = Number.parseInt(price, 10);
    if (!name.trim() || Number.isNaN(p) || p <= 0) {
      toast.error("Name and valid price are required");
      return;
    }
    try {
      await addRoom.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        pricePerNight: BigInt(p),
        amenities: amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        photoUrl,
      });
      setName("");
      setDescription("");
      setPrice("");
      setAmenities("");
      setPhotoUrl(null);
      toast.success("Room added!");
    } catch {
      toast.error("Failed to add room");
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
      <p className="text-sm font-bold text-primary flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add New Room
      </p>
      <div className="space-y-2">
        <div>
          <Label className="text-xs text-muted-foreground">Room Name *</Label>
          <Input
            data-ocid="admin.room.add.input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Deluxe Mountain View"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Textarea
            data-ocid="admin.room.add.textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="text-sm resize-none mt-1"
            placeholder="Describe the room..."
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">
            Price per Night (₹) *
          </Label>
          <Input
            data-ocid="admin.room.add.price.input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="1"
            placeholder="e.g. 1500"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">
            Amenities (comma separated)
          </Label>
          <Input
            data-ocid="admin.room.add.amenities.input"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            placeholder="WiFi, AC, TV, Geyser"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Room Photo</Label>
          <label className="mt-1 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-primary/30 rounded-lg p-3 cursor-pointer hover:border-primary/60 transition-colors">
            <input
              data-ocid="admin.room.add.upload_button"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            {uploadProgress !== null ? (
              <div className="w-full">
                <div className="text-xs text-center text-muted-foreground mb-1">
                  Uploading {uploadProgress}%
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : photoUrl ? (
              <img
                src={photoUrl}
                alt="Room"
                className="max-h-24 w-full object-cover rounded-lg"
              />
            ) : (
              <>
                <ImagePlus className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Upload Photo
                </span>
              </>
            )}
          </label>
        </div>
      </div>
      <Button
        data-ocid="admin.room.add.submit_button"
        onClick={handleAdd}
        disabled={addRoom.isPending}
        className="w-full h-9 text-sm font-semibold"
      >
        {addRoom.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Room"
        )}
      </Button>
    </div>
  );
}

// ── Taxi Management ──────────────────────────────────────────────────────────

function TaxiCard({ option, index }: { option: TaxiOption; index: number }) {
  const [route, setRoute] = useState(option.route);
  const [price, setPrice] = useState(option.price.toString());
  const [description, setDescription] = useState(option.description);
  const updateTaxi = useUpdateTaxiOption();
  const deleteTaxi = useDeleteTaxiOption();

  const handleSave = async () => {
    const p = Number.parseInt(price, 10);
    if (!route.trim() || Number.isNaN(p) || p <= 0) {
      toast.error("Please enter valid route and price");
      return;
    }
    try {
      await updateTaxi.mutateAsync({
        id: option.id,
        route: route.trim(),
        price: BigInt(p),
        description: description.trim(),
      });
      toast.success("Taxi option updated!");
    } catch {
      toast.error("Failed to update taxi option");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${option.route}"?`)) return;
    try {
      await deleteTaxi.mutateAsync(option.id);
      toast.success("Taxi option deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div
      data-ocid={`admin.taxi.item.${index}`}
      className="bg-card border border-border rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Route #{option.id.toString()}
        </span>
        <Button
          data-ocid={`admin.taxi.delete_button.${index}`}
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleteTaxi.isPending}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
        >
          {deleteTaxi.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <div>
          <Label className="text-xs text-muted-foreground">Route Name</Label>
          <Input
            data-ocid={`admin.taxi.route.input.${index}`}
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Price (₹)</Label>
          <Input
            data-ocid={`admin.taxi.price.input.${index}`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Input
            data-ocid={`admin.taxi.description.input.${index}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>
      <Button
        data-ocid={`admin.taxi.save_button.${index}`}
        onClick={handleSave}
        disabled={updateTaxi.isPending}
        className="w-full h-9 text-sm font-semibold"
      >
        {updateTaxi.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}

function AddTaxiForm() {
  const [route, setRoute] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const addTaxi = useAddTaxiOption();

  const handleAdd = async () => {
    const p = Number.parseInt(price, 10);
    if (!route.trim() || Number.isNaN(p) || p < 0) {
      toast.error("Route and valid price are required");
      return;
    }
    try {
      await addTaxi.mutateAsync({
        route: route.trim(),
        price: BigInt(p),
        description: description.trim(),
      });
      setRoute("");
      setPrice("");
      setDescription("");
      toast.success("Taxi option added!");
    } catch {
      toast.error("Failed to add taxi option");
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
      <p className="text-sm font-bold text-primary flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add New Route
      </p>
      <div className="space-y-2">
        <div>
          <Label className="text-xs text-muted-foreground">Route Name *</Label>
          <Input
            data-ocid="admin.taxi.add.route.input"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="e.g. Mandi to Shimla"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Price (₹) *</Label>
          <Input
            data-ocid="admin.taxi.add.price.input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            placeholder="e.g. 2500"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Input
            data-ocid="admin.taxi.add.description.input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. ~110 km, 3-4 hrs"
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>
      <Button
        data-ocid="admin.taxi.add.submit_button"
        onClick={handleAdd}
        disabled={addTaxi.isPending}
        className="w-full h-9 text-sm font-semibold"
      >
        {addTaxi.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Route"
        )}
      </Button>
    </div>
  );
}

// ── Restaurant Menu Management ────────────────────────────────────────────────

function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [category, setCategory] = useState(item.category);
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();

  const handleSave = async () => {
    const p = Number.parseInt(price, 10);
    if (!name.trim() || Number.isNaN(p) || p < 0) {
      toast.error("Please enter valid name and price");
      return;
    }
    try {
      await updateItem.mutateAsync({
        id: item.id,
        name: name.trim(),
        price: BigInt(p),
        category,
      });
      toast.success("Menu item updated!");
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteItem.mutateAsync(item.id);
      toast.success("Item deleted!");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div
      data-ocid={`admin.menu.item.${index}`}
      className="bg-card border border-border rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Item #{item.id.toString()}
        </span>
        <Button
          data-ocid={`admin.menu.delete_button.${index}`}
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleteItem.isPending}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
        >
          {deleteItem.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-2">
        <div>
          <Label className="text-xs text-muted-foreground">Item Name</Label>
          <Input
            data-ocid={`admin.menu.name.input.${index}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Price (₹)</Label>
          <Input
            data-ocid={`admin.menu.price.input.${index}`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              data-ocid={`admin.menu.category.select.${index}`}
              className="h-9 text-sm mt-1"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Meals">Meals</SelectItem>
              <SelectItem value="Snacks">Snacks</SelectItem>
              <SelectItem value="Drinks">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        data-ocid={`admin.menu.save_button.${index}`}
        onClick={handleSave}
        disabled={updateItem.isPending}
        className="w-full h-9 text-sm font-semibold"
      >
        {updateItem.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}

function AddMenuItemForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Meals");
  const addItem = useAddMenuItem();

  const handleAdd = async () => {
    const p = Number.parseInt(price, 10);
    if (!name.trim() || Number.isNaN(p) || p < 0) {
      toast.error("Name and valid price are required");
      return;
    }
    try {
      await addItem.mutateAsync({
        name: name.trim(),
        price: BigInt(p),
        category,
      });
      setName("");
      setPrice("");
      toast.success("Menu item added!");
    } catch {
      toast.error("Failed to add item");
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
      <p className="text-sm font-bold text-primary flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add New Item
      </p>
      <div className="space-y-2">
        <div>
          <Label className="text-xs text-muted-foreground">Item Name *</Label>
          <Input
            data-ocid="admin.menu.add.name.input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dal Makhani"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Price (₹) *</Label>
          <Input
            data-ocid="admin.menu.add.price.input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            placeholder="e.g. 150"
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              data-ocid="admin.menu.add.category.select"
              className="h-9 text-sm mt-1"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Meals">Meals</SelectItem>
              <SelectItem value="Snacks">Snacks</SelectItem>
              <SelectItem value="Drinks">Drinks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        data-ocid="admin.menu.add.submit_button"
        onClick={handleAdd}
        disabled={addItem.isPending}
        className="w-full h-9 text-sm font-semibold"
      >
        {addItem.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Item"
        )}
      </Button>
    </div>
  );
}

// ── Payment Settings ──────────────────────────────────────────────────────────

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
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Status:</span>
        {configLoading ? (
          <Skeleton className="h-4 w-24" />
        ) : isConfigured ? (
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <CheckCircle2 size={14} /> Configured
          </span>
        ) : (
          <span className="flex items-center gap-1 text-destructive font-semibold">
            <XCircle size={14} /> Not Configured
          </span>
        )}
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">
          Stripe Secret Key
        </Label>
        <Input
          data-ocid="admin.stripe_key.input"
          type="password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="sk_live_..."
          className="h-9 text-sm font-mono mt-1"
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground mt-1">
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
      <div>
        <Label className="text-xs text-muted-foreground">
          Allowed Countries (comma separated)
        </Label>
        <Input
          data-ocid="admin.stripe_countries.input"
          value={countries}
          onChange={(e) => setCountries(e.target.value)}
          placeholder="IN, US, GB"
          className="h-9 text-sm mt-1"
        />
      </div>
      <Button
        data-ocid="admin.stripe_save.button"
        onClick={handleSave}
        disabled={setConfig.isPending}
        className="w-full h-9 text-sm font-semibold"
      >
        {setConfig.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Payment Settings"
        )}
      </Button>
    </div>
  );
}

// ── Main AdminPage ────────────────────────────────────────────────────────────

interface AdminPageProps {
  onBack: () => void;
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const { login, isLoggingIn, identity, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: rooms, isLoading: roomsLoading } = useGetRooms();
  const { data: taxiOptions, isLoading: taxiLoading } = useGetTaxiOptions();
  const { data: menuItems, isLoading: menuLoading } = useGetMenuItems();
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
      <header className="bg-primary px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
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
        {isLoggedIn && (
          <button
            type="button"
            onClick={() => clear()}
            className="text-primary-foreground/70 text-xs hover:text-primary-foreground"
          >
            Logout
          </button>
        )}
      </header>

      <main className="flex-1 px-4 py-6 space-y-4 max-w-2xl mx-auto w-full">
        {/* Not logged in */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LogIn size={36} className="text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-2xl">
                Admin Login
              </h2>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                Login with Internet Identity to manage rooms, taxi routes,
                restaurant menu, and settings.
              </p>
            </div>
            <Button
              data-ocid="admin.login.primary_button"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 h-13 text-base rounded-xl"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
          </div>
        )}

        {/* Checking admin status */}
        {isLoggedIn && adminLoading && (
          <div data-ocid="admin.loading_state" className="space-y-3 pt-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        )}

        {/* Not admin */}
        {isLoggedIn && !adminLoading && !isAdmin && (
          <div
            data-ocid="admin.error_state"
            className="flex flex-col items-center justify-center py-20 space-y-4 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <ShieldAlert size={36} className="text-destructive" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-2xl">
                Access Denied
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Your account does not have admin privileges.
              </p>
            </div>
            <Button
              data-ocid="admin.logout.button"
              variant="outline"
              onClick={() => clear()}
              className="font-semibold"
            >
              Try Different Account
            </Button>
            <Button variant="ghost" onClick={onBack}>
              Go Back
            </Button>
          </div>
        )}

        {/* Admin panel */}
        {isLoggedIn && !adminLoading && isAdmin && (
          <Accordion
            type="multiple"
            defaultValue={["phone"]}
            className="space-y-3"
          >
            {/* Contact Phone */}
            <AccordionItem
              value="phone"
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <AccordionTrigger
                data-ocid="admin.phone.panel"
                className="px-4 py-3 hover:no-underline font-bold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  Contact Phone Number
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <div className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                  <span className="text-muted-foreground">Current:</span>
                  {phoneLoading ? (
                    <Skeleton className="h-4 w-36" />
                  ) : (
                    <span className="font-bold text-foreground">
                      {contactPhone}
                    </span>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    New Phone Number
                  </Label>
                  <Input
                    data-ocid="admin.phone.input"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +91 99999 88888"
                    type="tel"
                    className="h-9 text-sm mt-1"
                  />
                </div>
                <Button
                  data-ocid="admin.phone.save_button"
                  onClick={handlePhoneSave}
                  disabled={updatePhone.isPending}
                  className="w-full h-9 text-sm font-semibold"
                >
                  {updatePhone.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Phone Number"
                  )}
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Rooms */}
            <AccordionItem
              value="rooms"
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <AccordionTrigger
                data-ocid="admin.rooms.panel"
                className="px-4 py-3 hover:no-underline font-bold text-foreground"
              >
                <span className="flex items-center gap-2">
                  🛏️ Rooms Management
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <AddRoomForm />
                {roomsLoading ? (
                  <div
                    data-ocid="admin.rooms.loading_state"
                    className="space-y-3"
                  >
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                  </div>
                ) : rooms && rooms.length > 0 ? (
                  rooms.map((room, i) => (
                    <RoomCard
                      key={room.id.toString()}
                      room={room}
                      index={i + 1}
                    />
                  ))
                ) : (
                  <div
                    data-ocid="admin.rooms.empty_state"
                    className="text-center py-6 text-muted-foreground text-sm"
                  >
                    No rooms yet. Add your first room above.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Taxi */}
            <AccordionItem
              value="taxi"
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <AccordionTrigger
                data-ocid="admin.taxi.panel"
                className="px-4 py-3 hover:no-underline font-bold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Car size={16} className="text-primary" />
                  Taxi Management
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <AddTaxiForm />
                {taxiLoading ? (
                  <div
                    data-ocid="admin.taxi.loading_state"
                    className="space-y-3"
                  >
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </div>
                ) : taxiOptions && taxiOptions.length > 0 ? (
                  taxiOptions.map((opt, i) => (
                    <TaxiCard
                      key={opt.id.toString()}
                      option={opt}
                      index={i + 1}
                    />
                  ))
                ) : (
                  <div
                    data-ocid="admin.taxi.empty_state"
                    className="text-center py-6 text-muted-foreground text-sm"
                  >
                    No taxi routes yet. Add your first route above.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Restaurant Menu */}
            <AccordionItem
              value="menu"
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <AccordionTrigger
                data-ocid="admin.menu.panel"
                className="px-4 py-3 hover:no-underline font-bold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Utensils size={16} className="text-primary" />
                  Restaurant Menu
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <AddMenuItemForm />
                {menuLoading ? (
                  <div
                    data-ocid="admin.menu.loading_state"
                    className="space-y-3"
                  >
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </div>
                ) : menuItems && menuItems.length > 0 ? (
                  menuItems.map((item, i) => (
                    <MenuItemCard
                      key={item.id.toString()}
                      item={item}
                      index={i + 1}
                    />
                  ))
                ) : (
                  <div
                    data-ocid="admin.menu.empty_state"
                    className="text-center py-6 text-muted-foreground text-sm"
                  >
                    No menu items yet. Add your first item above.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Payment Settings */}
            <AccordionItem
              value="payment"
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <AccordionTrigger
                data-ocid="admin.payment.panel"
                className="px-4 py-3 hover:no-underline font-bold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <CreditCard size={16} className="text-primary" />
                  Payment Settings (Stripe)
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <PaymentSettingsSection />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </main>
    </div>
  );
}
