import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";
import Runtime "mo:core/Runtime";

import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Room = {
    id : Nat;
    name : Text;
    description : Text;
    pricePerNight : Nat;
    amenities : [Text];
    available : Bool;
  };

  type Booking = {
    id : Nat;
    roomId : Nat;
    guestName : Text;
    phone : Text;
    checkIn : Text;
    checkOut : Text;
    createdAt : Int;
  };

  type TaxiOption = {
    id : Nat;
    route : Text;
    price : Nat;
    description : Text;
  };

  type MenuItem = {
    id : Nat;
    name : Text;
    price : Nat;
    category : Text;
  };

  type ContactInfo = {
    phoneNumber : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let defaultContact : ContactInfo = { phoneNumber = "+91 99999 88888" };
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  var nextRoomId = 4;
  var nextBookingId = 1;
  var nextTaxiId = 4;
  var nextMenuId = 6;
  var stripeSecretKey : ?Text = null;
  var stripeAllowedCountries : [Text] = [];

  let rooms = Map.empty<Nat, Room>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let taxiOptions = Map.empty<Nat, TaxiOption>();
  let menuItems = Map.empty<Nat, MenuItem>();

  // Seed rooms
  let sampleRooms = [
    { id = 1; name = "Himalayan Retreat"; description = "Cozy room with mountain view and all basic amenities."; pricePerNight = 800; amenities = ["Free Wi-Fi", "Parking Available", "Mountain View", "Hot Water"]; available = true },
    { id = 2; name = "Apple Valley Homestay"; description = "Spacious homestay in apple orchard with fresh air."; pricePerNight = 1200; amenities = ["Room Service", "Parking Available", "Mountain View", "Hot Water"]; available = true },
    { id = 3; name = "Mountain View Cottage"; description = "Traditional cottage with stunning panoramic views."; pricePerNight = 600; amenities = ["Free Wi-Fi", "Parking Available", "Hot Water"]; available = true },
  ];
  sampleRooms.forEach(func(room) { rooms.add(room.id, room) });

  // Seed taxi options
  let sampleTaxi = [
    { id = 1; route = "Village to Town"; price = 200; description = "Local village to nearest town" },
    { id = 2; route = "Airport Pickup"; price = 1500; description = "Pick up from nearest airport" },
    { id = 3; route = "Sightseeing Day Tour"; price = 2000; description = "Full day sightseeing in the area" },
  ];
  sampleTaxi.forEach(func(t) { taxiOptions.add(t.id, t) });

  // Seed menu items
  let sampleMenu = [
    { id = 1; name = "Dal Rice"; price = 80; category = "Meals" },
    { id = 2; name = "Paratha"; price = 40; category = "Snacks" },
    { id = 3; name = "Tea"; price = 20; category = "Drinks" },
    { id = 4; name = "Maggi"; price = 60; category = "Snacks" },
    { id = 5; name = "Rajma Chawal"; price = 100; category = "Meals" },
  ];
  sampleMenu.forEach(func(m) { menuItems.add(m.id, m) });

  var contactInfo : ContactInfo = defaultContact;

  func requireAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
  };

  // HTTP transform for outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Stripe
  public query func isStripeConfigured() : async Bool {
    switch (stripeSecretKey) { case (null) { false }; case (_) { true } };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    requireAdmin(caller);
    stripeSecretKey := ?config.secretKey;
    stripeAllowedCountries := config.allowedCountries;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeSecretKey) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?key) { { secretKey = key; allowedCountries = stripeAllowedCountries } };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  // User Profiles
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // Rooms
  public query func getRooms() : async [Room] {
    rooms.values().toArray();
  };

  public query func getRoomById(id : Nat) : async Room {
    switch (rooms.get(id)) {
      case (null) { Runtime.trap("Room not found") };
      case (?room) { room };
    };
  };

  public shared ({ caller }) func addRoom(name : Text, description : Text, pricePerNight : Nat, amenities : [Text]) : async Nat {
    requireAdmin(caller);
    let id = nextRoomId;
    rooms.add(id, { id; name; description; pricePerNight; amenities; available = true });
    nextRoomId += 1;
    id;
  };

  public shared ({ caller }) func updateRoom(id : Nat, name : Text, description : Text, price : Nat) : async () {
    requireAdmin(caller);
    switch (rooms.get(id)) {
      case (null) { Runtime.trap("Room not found") };
      case (?room) {
        rooms.add(id, { id = room.id; name; description; pricePerNight = price; amenities = room.amenities; available = room.available });
      };
    };
  };

  public shared ({ caller }) func deleteRoom(id : Nat) : async () {
    requireAdmin(caller);
    ignore rooms.remove(id);
  };

  // Taxi
  public query func getTaxiOptions() : async [TaxiOption] {
    taxiOptions.values().toArray();
  };

  public shared ({ caller }) func addTaxiOption(route : Text, price : Nat, description : Text) : async Nat {
    requireAdmin(caller);
    let id = nextTaxiId;
    taxiOptions.add(id, { id; route; price; description });
    nextTaxiId += 1;
    id;
  };

  public shared ({ caller }) func updateTaxiOption(id : Nat, route : Text, price : Nat, description : Text) : async () {
    requireAdmin(caller);
    switch (taxiOptions.get(id)) {
      case (null) { Runtime.trap("Taxi option not found") };
      case (_) {
        taxiOptions.add(id, { id; route; price; description });
      };
    };
  };

  public shared ({ caller }) func deleteTaxiOption(id : Nat) : async () {
    requireAdmin(caller);
    ignore taxiOptions.remove(id);
  };

  // Restaurant Menu
  public query func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  public shared ({ caller }) func addMenuItem(name : Text, price : Nat, category : Text) : async Nat {
    requireAdmin(caller);
    let id = nextMenuId;
    menuItems.add(id, { id; name; price; category });
    nextMenuId += 1;
    id;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, name : Text, price : Nat, category : Text) : async () {
    requireAdmin(caller);
    switch (menuItems.get(id)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (_) {
        menuItems.add(id, { id; name; price; category });
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async () {
    requireAdmin(caller);
    ignore menuItems.remove(id);
  };

  // Bookings
  public shared func submitBooking(roomId : Nat, guestName : Text, phone : Text, checkIn : Text, checkOut : Text, createdAt : Int) : async Nat {
    switch (rooms.get(roomId)) {
      case (null) { Runtime.trap("Room not found") };
      case (?_) {
        let booking : Booking = { id = nextBookingId; roomId; guestName; phone; checkIn; checkOut; createdAt };
        bookings.add(nextBookingId, booking);
        let id = nextBookingId;
        nextBookingId += 1;
        id;
      };
    };
  };

  public query ({ caller }) func getBookings() : async [Booking] {
    requireAdmin(caller);
    bookings.values().toArray();
  };

  // Contact
  public query func getContactPhone() : async Text {
    contactInfo.phoneNumber;
  };

  public shared ({ caller }) func updateContactPhone(phoneNumber : Text) : async () {
    requireAdmin(caller);
    contactInfo := { contactInfo with phoneNumber };
  };
};
