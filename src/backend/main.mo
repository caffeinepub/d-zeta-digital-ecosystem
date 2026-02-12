import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Random "mo:core/Random";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type QueuePosition = {
    position : Nat;
    totalOrders : Nat;
    estimatedWaitTime : Time.Time;
  };

  public type QueueSummary = {
    totalOrders : Nat;
    estimatedWaitTime : Time.Time;
  };

  public type DeliveryZone = {
    zoneId : Text;
    name : Text;
    description : Text;
  };

  public type Artifact = {
    id : Text;
    title : Text;
    story : Text;
    audioUrl : ?Text;
  };

  public type District = {
    id : Text;
    name : Text;
    featuredProduct : Text;
    farmerPhotoUrl : Text;
    description : Text;
  };

  public type SocialImpactMetric = {
    id : Text;
    name : Text;
    value : Float;
  };

  public type BookingRequest = {
    id : Nat;
    dateTime : Text;
    zone : Text;
    status : BookingStatus;
    notes : Text;
  };

  public type PackageAddOn = {
    id : Text;
    name : Text;
  };

  public type PackageRequest = {
    packageId : Text;
    addOnIds : [Text];
    notes : Text;
  };

  public type Membership = {
    id : Nat;
    identityNumber : ?Text;
    name : Text;
    isVip : Bool;
    photoUrl : ?Text;
    isVerified : Bool;
  };

  public type LoyaltyTransaction = {
    id : Nat;
    points : Nat;
    description : Text;
    isRedemption : Bool;
    timestamp : Time.Time;
  };

  public type BookingStatus = {
    #Confirmed;
    #Canceled;
    #Completed;
    #RequestedAccess;
    #Default;
    #Denied;
    #Rescheduled;
    #Reservation;
    #Expired;
    #Waitlist;
    #CheckedIn;
    #NoShow;
  };

  public type Order = {
    id : Nat;
    customer : Principal;
    status : OrderStatus;
    deliverTo : ?Text;
    timestamp : Time.Time;
  };

  public type BookingRequestDto = {
    dateTime : Text;
    zone : Text;
    notes : Text;
  };

  public type OriginMapDistrict = {
    id : Text;
    name : Text;
    featuredProduct : Text;
    farmerPhotoUrl : Text;
    description : Text;
  };

  public type LoyaltyProfile = {
    transactions : List.List<LoyaltyTransaction>;
    pointsBalance : Nat;
  };

  public type ArtifactContent = {
    id : Text;
    title : Text;
    story : Text;
    audioUrl : ?Text;
  };

  public type LoyaltyReward = {
    id : Text;
    name : Text;
    pointsCost : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  let impactMetrics = Map.empty<Text, SocialImpactMetric>();
  let artifacts = Map.empty<Text, ArtifactContent>();
  let districtMap = Map.empty<Text, OriginMapDistrict>();
  let availablePackages = Map.empty<Text, Text>();
  let packageAddOns = Map.empty<Text, PackageAddOn>();
  let loyaltyRewards = Map.empty<Text, LoyaltyReward>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let deliveryZones = Map.empty<Text, DeliveryZone>();
  var nextOrderId = 0;
  var nextMembershipId = 0;
  var nextBookingId = 0;

  let bookings = Map.empty<Principal, List.List<BookingRequest>>();
  let memberships = Map.empty<Principal, Membership>();
  let loyalty = Map.empty<Principal, LoyaltyProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Parcel {
    public func compare(parcel1 : Parcel, parcel2 : Parcel) : Order.Order {
      if (parcel1.id < parcel2.id) { return #less };
      if (parcel1.id > parcel2.id) { return #greater };
      #equal;
    };
  };

  public type Parcel = {
    id : Nat;
    recipient : Principal;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  public type OrderStatus = {
    #Paid;
    #Preparing;
    #Completed;
    #Ready;
    #Delivering;
    #Cancelled;
    #Confirmed;
    #Default;
    #Reserved;
  };

  var nextParcelId = 0;
  var parcels = Map.empty<Nat, Parcel>();

  public type Reward = {
    id : Nat;
    name : Text;
    description : Text;
    pointsRequired : Nat;
    available : Bool;
  };

  public type Space = {
    id : Nat;
    name : Text;
    description : Text;
    capacity : Nat;
    available : Bool;
  };

  public type Notification = {
    id : Nat;
    message : Text;
    timestamp : Time.Time;
    read : Bool;
  };

  public type Subscription = {
    id : Nat;
    userId : Principal;
    service : Text;
    active : Bool;
  };

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // NEW: Kitchen Queue Summary available to all users
  public query ({ caller }) func getKitchenQueueSummary() : async QueueSummary {
    { totalOrders = orders.size(); estimatedWaitTime = Time.now() + 3_000_000_000 * orders.size() };
  };

  // Order Management
  public query ({ caller }) func getOrderQueuePosition(orderId : Nat) : async QueuePosition {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order queue");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.customer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };

        let queue = orders.values().toArray();
        switch (queue.findIndex(func(q) { q.id == orderId })) {
          case (null) { Runtime.trap("Order not found in queue") };
          case (?position) {
            let newPosition = position + 1;
            let totalOrders = queue.size();
            let estimatedWaitTime = Time.now() + 3_000_000_000 * Int.abs(totalOrders - newPosition + 1);
            {
              position = newPosition;
              totalOrders;
              estimatedWaitTime;
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getClientOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let clientOrders = orders.values().toArray();
    clientOrders.filter<Order>(func(order) { order.customer == caller });
  };

  public shared ({ caller }) func createOrder(deliverTo : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let orderId = nextOrderId;
    let newOrder : Order = {
      id = orderId;
      customer = caller;
      status = #Paid;
      deliverTo;
      timestamp = Time.now();
    };
    orders.add(orderId, newOrder);
    nextOrderId += 1;
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          id = order.id;
          customer = order.customer;
          status;
          deliverTo = order.deliverTo;
          timestamp = order.timestamp;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Delivery Zones (Public read, Admin write)
  public query ({ caller }) func getDeliveryZones() : async [DeliveryZone] {
    deliveryZones.values().toArray();
  };

  public shared ({ caller }) func createDeliveryZone(zone : DeliveryZone) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create zones");
    };

    if (deliveryZones.containsKey(zone.zoneId)) {
      Runtime.trap("Zone already exists");
    };
    deliveryZones.add(zone.zoneId, zone);
  };

  public shared ({ caller }) func updateDeliveryZone(zone : DeliveryZone) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update zones");
    };
    deliveryZones.add(zone.zoneId, zone);
  };

  // Artifacts (Public read, Admin write)
  public query ({ caller }) func getArtifactById(id : Text) : async Artifact {
    switch (artifacts.get(id)) {
      case (null) { Runtime.trap("Artifact not found") };
      case (?artifact) { artifact };
    };
  };

  public query ({ caller }) func getAllArtifacts() : async [ArtifactContent] {
    artifacts.values().toArray();
  };

  public shared ({ caller }) func createArtifact(artifact : ArtifactContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create artifacts");
    };
    artifacts.add(artifact.id, artifact);
  };

  public shared ({ caller }) func updateArtifact(artifact : ArtifactContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update artifacts");
    };
    artifacts.add(artifact.id, artifact);
  };

  // Origin Map Districts (Public read, Admin write)
  public query ({ caller }) func getOriginMapForDistrict(districtId : Text) : async OriginMapDistrict {
    switch (districtMap.get(districtId)) {
      case (null) { Runtime.trap("District not found") };
      case (?district) { district };
    };
  };

  public query ({ caller }) func getAllDistricts() : async [OriginMapDistrict] {
    districtMap.values().toArray();
  };

  public shared ({ caller }) func createDistrict(district : OriginMapDistrict) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create districts");
    };
    districtMap.add(district.id, district);
  };

  public shared ({ caller }) func updateDistrict(district : OriginMapDistrict) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update districts");
    };
    districtMap.add(district.id, district);
  };

  // Social Impact Metrics (Public read, Admin write)
  public query ({ caller }) func getCurrentMetrics() : async [SocialImpactMetric] {
    impactMetrics.values().toArray();
  };

  public shared ({ caller }) func updateMetric(metric : SocialImpactMetric) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update metrics");
    };
    impactMetrics.add(metric.id, metric);
  };

  // Space Booking (User creates, Admin manages)
  public shared ({ caller }) func requestBooking(request : BookingRequestDto) : async BookingStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request bookings");
    };

    let booking = {
      id = nextBookingId;
      dateTime = request.dateTime;
      zone = request.zone;
      status = #RequestedAccess;
      notes = request.notes;
    };

    switch (bookings.get(caller)) {
      case (null) {
        let newBookings = List.empty<BookingRequest>();
        newBookings.add(booking);
        bookings.add(caller, newBookings);
      };
      case (?existingBookings) {
        existingBookings.add(booking);
      };
    };

    nextBookingId += 1;
    #RequestedAccess;
  };

  public query ({ caller }) func getCallerBookings() : async [BookingRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };

    switch (bookings.get(caller)) {
      case (null) { [] };
      case (?callerBookings) { callerBookings.toArray() };
    };
  };

  public query ({ caller }) func getAllBookings() : async [(Principal, [BookingRequest])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };

    bookings.entries().toArray().map<(Principal, List.List<BookingRequest>), (Principal, [BookingRequest])>(
      func(entry) { (entry.0, entry.1.toArray()) }
    );
  };

  public shared ({ caller }) func updateBookingStatus(user : Principal, bookingId : Nat, status : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookings.get(user)) {
      case (null) { Runtime.trap("No bookings found for user") };
      case (?userBookings) {
        let bookingsArray = userBookings.toArray();
        let updatedBookings = bookingsArray.map(
          func(booking) {
            if (booking.id == bookingId) {
              {
                id = booking.id;
                dateTime = booking.dateTime;
                zone = booking.zone;
                status;
                notes = booking.notes;
              };
            } else {
              booking;
            };
          }
        );
        let newList = List.fromArray<BookingRequest>(updatedBookings);
        bookings.add(user, newList);
      };
    };
  };

  // Packages (Public read, Admin write)
  public query ({ caller }) func getAvailablePackages() : async [Text] {
    availablePackages.values().toArray();
  };

  public shared ({ caller }) func addPackage(packageId : Text, packageName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add packages");
    };
    availablePackages.add(packageId, packageName);
  };

  public query ({ caller }) func getPackageAddOns() : async [PackageAddOn] {
    packageAddOns.values().toArray();
  };

  public shared ({ caller }) func addPackageAddOn(addOn : PackageAddOn) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add package add-ons");
    };
    packageAddOns.add(addOn.id, addOn);
  };

  // Membership (User creates, Admin verifies)
  public shared ({ caller }) func createMembership(name : Text, identityNumber : ?Text, photoUrl : ?Text) : async {
    existing : ?Membership;
    id : ?Nat;
    identityNumber : ?Text;
    isVip : ?Bool;
    name : ?Text;
    photoUrl : ?Text;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create memberships");
    };

    switch (memberships.get(caller)) {
      case (null) {
        let newMembership : Membership = {
          id = nextMembershipId;
          identityNumber;
          name;
          isVip = false;
          photoUrl;
          isVerified = false;
        };
        memberships.add(caller, newMembership);
        nextMembershipId += 1;
      };
      case (?existingMembership) {
        Runtime.trap("Membership already exists for caller");
      };
    };
    {
      existing = memberships.get(caller);
      id = if (memberships.containsKey(caller)) { ?nextMembershipId } else { null };
      identityNumber;
      isVip = if (memberships.containsKey(caller)) { ?false } else { null };
      name = ?name;
      photoUrl;
    };
  };

  public query ({ caller }) func getCallerMembership() : async ?Membership {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view memberships");
    };
    memberships.get(caller);
  };

  public query ({ caller }) func getAllMemberships() : async [(Principal, Membership)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all memberships");
    };
    memberships.entries().toArray();
  };

  public shared ({ caller }) func verifyMembership(user : Principal, isVerified : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify memberships");
    };

    switch (memberships.get(user)) {
      case (null) { Runtime.trap("Membership not found") };
      case (?membership) {
        let updatedMembership = {
          id = membership.id;
          identityNumber = membership.identityNumber;
          name = membership.name;
          isVip = membership.isVip;
          photoUrl = membership.photoUrl;
          isVerified;
        };
        memberships.add(user, updatedMembership);
      };
    };
  };

  // Loyalty Points (User earns/redeems, Admin awards)
  public shared ({ caller }) func awardLoyaltyPoints(points : Nat, description : Text) : async {
    current : {
      transactions : [LoyaltyTransaction];
      pointsBalance : Nat;
    };
    newBalance : Text;
    points : ?Nat;
    transactions : ?[LoyaltyTransaction];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can receive loyalty points");
    };

    let loyaltyProfile = switch (loyalty.get(caller)) {
      case (null) {
        let newProfile : LoyaltyProfile = {
          pointsBalance = 0;
          transactions = List.empty<LoyaltyTransaction>();
        };
        loyalty.add(caller, newProfile);
        newProfile;
      };
      case (?existing) { existing };
    };

    let newTransaction : LoyaltyTransaction = {
      id = loyaltyProfile.transactions.size() + 1;
      points;
      description;
      isRedemption = false;
      timestamp = Time.now();
    };

    loyaltyProfile.transactions.add(newTransaction);
    let updatedProfile : LoyaltyProfile = {
      transactions = loyaltyProfile.transactions;
      pointsBalance = loyaltyProfile.pointsBalance + points;
    };

    loyalty.add(caller, updatedProfile);

    {
      current = {
        transactions = updatedProfile.transactions.toArray();
        pointsBalance = updatedProfile.pointsBalance;
      };
      newBalance = updatedProfile.pointsBalance.toText();
      points = ?updatedProfile.pointsBalance;
      transactions = ?updatedProfile.transactions.toArray();
    };
  };

  public shared ({ caller }) func redeemLoyaltyPoints(rewardId : Text, pointsCost : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem loyalty points");
    };

    let loyaltyProfile = switch (loyalty.get(caller)) {
      case (null) { Runtime.trap("No loyalty profile found") };
      case (?existing) { existing };
    };

    if (loyaltyProfile.pointsBalance < pointsCost) {
      Runtime.trap("Insufficient points");
    };

    let newTransaction : LoyaltyTransaction = {
      id = loyaltyProfile.transactions.size() + 1;
      points = pointsCost;
      description = "Redeemed reward: " # rewardId;
      isRedemption = true;
      timestamp = Time.now();
    };

    loyaltyProfile.transactions.add(newTransaction);
    let updatedProfile : LoyaltyProfile = {
      transactions = loyaltyProfile.transactions;
      pointsBalance = loyaltyProfile.pointsBalance - pointsCost;
    };

    loyalty.add(caller, updatedProfile);
  };

  public query ({ caller }) func getCurrentLoyaltyPoints() : async (Nat, { transactions : [LoyaltyTransaction]; pointsBalance : Nat }) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loyalty points");
    };

    switch (loyalty.get(caller)) {
      case (null) { (0, { pointsBalance = 0; transactions = [] }) };
      case (?profile) {
        (
          profile.pointsBalance,
          {
            transactions = profile.transactions.toArray();
            pointsBalance = profile.pointsBalance;
          }
        );
      };
    };
  };

  public query ({ caller }) func getLoyaltyRewards() : async [LoyaltyReward] {
    loyaltyRewards.values().toArray();
  };

  public shared ({ caller }) func addLoyaltyReward(reward : LoyaltyReward) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add loyalty rewards");
    };
    loyaltyRewards.add(reward.id, reward);
  };

  // Admin Dashboard Functions
  public query ({ caller }) func getAdminOrdersQueue() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders queue");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getAdminAnalytics() : async {
    totalOrders : Nat;
    totalUsers : Nat;
    totalBookings : Nat;
    totalMembers : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };
    {
      totalOrders = orders.size();
      totalUsers = userProfiles.size();
      totalBookings = bookings.size();
      totalMembers = memberships.size();
    };
  };
};
