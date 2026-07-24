CREATE TABLE "matrimonial_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"looking_for" text NOT NULL,
	"full_name" text NOT NULL,
	"age" integer NOT NULL,
	"dob" text,
	"height" text,
	"gotra_subcaste" text,
	"qualification" text NOT NULL,
	"occupation" text NOT NULL,
	"monthly_income" text,
	"current_city_district" text NOT NULL,
	"native_place" text,
	"father_name" text,
	"father_occupation" text,
	"family_type" text,
	"partner_expectations" text,
	"guardian_name" text NOT NULL,
	"guardian_phone" text NOT NULL,
	"guardian_email" text,
	"photo_url" text,
	"status" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"existing_membership_id" text,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"occupation" text NOT NULL,
	"membership_type" text NOT NULL,
	"duration_years" text,
	"payment_method" text NOT NULL,
	"payment_reference" text,
	"receipt_photo_url" text,
	"status" text NOT NULL,
	"assigned_member_id" text,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"subscribed_at" text NOT NULL,
	"source" text
);
--> statement-breakpoint
CREATE TABLE "volunteer_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"interests" text NOT NULL,
	"availability" text NOT NULL,
	"notes" text,
	"status" text NOT NULL,
	"created_at" text NOT NULL
);
