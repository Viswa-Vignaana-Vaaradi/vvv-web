import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  primaryKey,
  text,
  geometry,
  index,
} from 'drizzle-orm/pg-core';
import { user } from './auth';


export const roles = pgTable('roles', {
  id: serial('id'),
  name: varchar('name', { length: 50 }).notNull().primaryKey(),
});

export const memberships = pgTable('memberships', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  roleName: varchar('role_name').references(() => roles.name, { onDelete: 'restrict' }).notNull(),
  memberCode: varchar('member_code', { length: 20 }).unique().notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
});

export const professionOptions = pgTable('profession_options', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
});

export const educationalQualificationOptions = pgTable('educational_qualification_options', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
});

export const involvementAreasOptions = pgTable('involvement_areas_options', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
});

export const interestedAreasOptions = pgTable('interested_areas_options', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
});

export const volunteerDetails = pgTable('volunteer_details', {
  id: serial('id').primaryKey(),
  membershipId: integer('membership_id').references(() => memberships.id, { onDelete: 'cascade' }).unique().notNull(),
  age: integer('age'),
  gender: varchar('gender', { length: 10 }),
  contactNumber: varchar('contact_number', { length: 15 }),
  bloodGroup: varchar('blood_group', { length: 5 }),
  collegeName: varchar('college_name', { length: 40 }),
  educationalQualificationId: integer('educational_qualification_id').references(() => educationalQualificationOptions.id, { onDelete: 'set null' }),
  professionId: integer('profession_id').references(() => professionOptions.id, { onDelete: 'set null' }),
});

export const volunteerInvolvementAreas = pgTable('volunteer_involvement_areas', {
  volunteerDetailId: integer('volunteer_detail_id').references(() => volunteerDetails.id, { onDelete: 'cascade' }).notNull(),
  involvementAreaId: integer('involvement_area_id').references(() => involvementAreasOptions.id, { onDelete: 'cascade' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.volunteerDetailId, t.involvementAreaId] }),
  }),
);

export const volunteerInterestedAreas = pgTable('volunteer_interested_areas', {
  volunteerDetailId: integer('volunteer_detail_id').references(() => volunteerDetails.id, { onDelete: 'cascade' }).notNull(),
  interestedAreaId: integer('interested_area_id').references(() => interestedAreasOptions.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.volunteerDetailId, t.interestedAreaId] }),
  }),
);

export const userLocation = pgTable("user_location", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  coords: geometry("coords", { type: "point", mode: "xy", srid: 4326 }).notNull(),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("spatial_index").using("gist", table.coords)
]);

// export const patronDetails = pgTable('patron_details', {
//   id: serial('id').primaryKey(),
//   membershipId: integer('membership_id')
//     .references(() => memberships.id, { onDelete: 'cascade' })
//     .notNull()
//     .unique(), // Assuming one patron details per membership
//   address: text('address'),
//   companyName: varchar('company_name', { length: 100 }),
//   gstNumber: varchar('gst_number', { length: 20 }),
// });

// export const patronDetailsRelations = relations(patronDetails, ({ one }) => ({
//   membership: one(memberships, {
//     fields: [patronDetails.membershipId],
//     references: [memberships.id],
//   }),
// }));