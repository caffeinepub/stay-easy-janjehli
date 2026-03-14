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

  type ContactInfo = {
    phoneNumber : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let defaultContact : ContactInfo = { phoneNumber = "+919998887777" };
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  var nextRoomId = 4;
  var nextBookingId = 1;
  var stripeSecretKey : ?Text = null;
  var stripeAllowedCountries : [Text] = [];

  let rooms = Map.empty<Nat, Room>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let sampleRooms = [
    {
      id = 1;
      name = "Himalayan Retreat";
      description = "Cozy room with mountain view.";
      pricePerNight = 800;
      amenities = ["Free Wi-Fi", "Parking Available", "Mountain View", "Hot Water"];
      available = true;
    },
    {
      id = 2;
      name = "Apple Valley Homestay";
      description = "Spacious homestay in apple orchard.";
      pricePerNight = 1200;
      amenities = ["Room Service", "Parking Available", "Mountain View", "Hot Water"];
      available = true;
    },
    {
      id = 3;
      name = "Mountain View Cottage";
      description = "Traditional cottage with stunning views.";
      pricePerNight = 600;
      amenities = ["Free Wi-Fi", "Parking Available", "Hot Water"];
      available = true;
    },
  ];

  sampleRooms.forEach(func(room) { rooms.add(room.id, room) });

  var contactInfo : ContactInfo = defaultContact;

  // Transform for HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Stripe
  public query func isStripeConfigured() : async Bool {
    switch (stripeSecretKey) { case (null) { false }; case (_) { true } };
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update Stripe configuration");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
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

  public shared ({ caller }) func updateRoom(id : Nat, name : Text, description : Text, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized");
    };
    switch (rooms.get(id)) {
      case (null) { Runtime.trap("Room not found") };
      case (?room) {
        rooms.add(id, { id = room.id; name; description; pricePerNight = price; amenities = room.amenities; available = room.available });
      };
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized");
    };
    bookings.values().toArray();
  };

  // Contact
  public query func getContactPhone() : async Text {
    contactInfo.phoneNumber;
  };

  public shared ({ caller }) func updateContactPhone(phoneNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized");
    };
    contactInfo := { contactInfo with phoneNumber };
  };
};
