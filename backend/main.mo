import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Member {
    public func compare(a : Member, b : Member) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  type Member = {
    id : Principal;
    name : Text;
    mobile : Text;
    joiningDate : Time.Time;
    profilePhoto : ?Storage.ExternalBlob;
  };

  type Payment = {
    memberId : Principal;
    amount : Nat;
    paymentDate : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    mobile : Text;
    joiningDate : Time.Time;
    profilePhoto : ?Storage.ExternalBlob;
  };

  let members = Map.empty<Principal, Member>();
  let payments = Map.empty<Principal, [Payment]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Required user profile functions for frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin can view all");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only: Add new member
  public shared ({ caller }) func addMember(name : Text, mobile : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add members");
    };

    let newMember : Member = {
      id = caller;
      name;
      mobile;
      joiningDate = Time.now();
      profilePhoto = null;
    };
    members.add(caller, newMember);
  };

  // Admin-only: Record payment for any member
  public shared ({ caller }) func recordPayment(memberId : Principal, amount : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can record payments");
    };

    let newPayment : Payment = {
      memberId;
      amount;
      paymentDate = Time.now();
    };

    let existingPayments = switch (payments.get(memberId)) {
      case (null) { [] };
      case (?p) { p };
    };
    payments.add(memberId, existingPayments.concat([newPayment]));
  };

  // Users can view their own member data, admin can view any member
  public query ({ caller }) func getMember(memberId : Principal) : async ?Member {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view member data");
    };

    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own member data");
    };

    members.get(memberId);
  };

  // Users can view their own payments, admin can view any member's payments
  public query ({ caller }) func getPayments(memberId : Principal) : async [Payment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payment data");
    };

    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own payment history");
    };

    switch (payments.get(memberId)) {
      case (null) { [] };
      case (?p) { p };
    };
  };

  // Admin-only: View all members
  public query ({ caller }) func getAllMembers() : async [Member] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all members");
    };

    let memberArray = members.values().toArray();
    memberArray.sort();
  };

  // Admin-only: Get summary statistics
  public query ({ caller }) func getSummaryStats() : async {
    totalMembers : Nat;
    totalAmountCollected : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view summary statistics");
    };

    let totalMembers = members.size();
    var totalAmount : Nat = 0;

    for (paymentList in payments.values()) {
      for (payment in paymentList.vals()) {
        totalAmount += payment.amount;
      };
    };

    {
      totalMembers;
      totalAmountCollected = totalAmount;
    };
  };

  // User can view their own balance, admin can view any member's balance
  public query ({ caller }) func getMemberBalance(memberId : Principal) : async {
    totalPaid : Nat;
    paymentCount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance data");
    };

    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own balance");
    };

    let memberPayments = switch (payments.get(memberId)) {
      case (null) { [] };
      case (?p) { p };
    };

    var total : Nat = 0;
    for (payment in memberPayments.vals()) {
      total += payment.amount;
    };

    {
      totalPaid = total;
      paymentCount = memberPayments.size();
    };
  };
};
