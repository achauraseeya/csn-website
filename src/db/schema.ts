import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const matrimonialProfiles = pgTable('matrimonial_profiles', {
  id: text('id').primaryKey(),
  lookingFor: text('looking_for').notNull(),
  fullName: text('full_name').notNull(),
  age: integer('age').notNull(),
  dob: text('dob'),
  height: text('height'),
  gotraSubcaste: text('gotra_subcaste'),
  qualification: text('qualification').notNull(),
  occupation: text('occupation').notNull(),
  monthlyIncome: text('monthly_income'),
  currentCityDistrict: text('current_city_district').notNull(),
  nativePlace: text('native_place'),
  fatherName: text('father_name'),
  fatherOccupation: text('father_occupation'),
  familyType: text('family_type'),
  partnerExpectations: text('partner_expectations'),
  guardianName: text('guardian_name').notNull(),
  guardianPhone: text('guardian_phone').notNull(),
  guardianEmail: text('guardian_email'),
  photoUrl: text('photo_url'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const volunteerApplications = pgTable('volunteer_applications', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  interests: text('interests').notNull(),
  availability: text('availability').notNull(),
  notes: text('notes'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
});

export const membershipApplications = pgTable('membership_applications', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  existingMembershipId: text('existing_membership_id'),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  occupation: text('occupation').notNull(),
  membershipType: text('membership_type').notNull(),
  durationYears: text('duration_years'),
  paymentMethod: text('payment_method').notNull(),
  paymentReference: text('payment_reference'),
  receiptPhotoUrl: text('receipt_photo_url'),
  status: text('status').notNull(),
  assignedMemberId: text('assigned_member_id'),
  createdAt: text('created_at').notNull(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  subscribedAt: text('subscribed_at').notNull(),
  source: text('source'),
});
