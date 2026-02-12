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
  boolean,
  numeric,
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

export const involvementAreasOptions = pgTable('involvement_areas_options', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  purpose: varchar('purpose', { length: 100 }).notNull(),
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

export const patronDetails = pgTable('patron_details', {
  id: serial('id').primaryKey(),
  dob: integer('dob').notNull(),
  membershipId: integer('membership_id')
    .references(() => memberships.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  address: text('address'),
  contactNumber: integer("contact_number").notNull(),
  professionId: integer('profession_id').references(() => professionOptions.id, { onDelete: 'set null' }),
});

export const patronInvolvementAreas = pgTable('patron_involvement_areas', {
  patronDetailId: integer('patron_detail_id').references(() => patronDetails.id, { onDelete: 'cascade' }).notNull(),
  involvementAreaId: integer('involvement_area_id').references(() => involvementAreasOptions.id, { onDelete: 'cascade' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.patronDetailId, t.involvementAreaId] }),
  }),
);

export const patronInterestedAreas = pgTable('patron_interested_areas', {
  patronDetailId: integer('patron_detail_id').references(() => patronDetails.id, { onDelete: 'cascade' }).notNull(),
  interestedAreaId: integer('interested_area_id').references(() => interestedAreasOptions.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.patronDetailId, t.interestedAreaId] }),
  }),
);

export const contributionFrequencyOptions = pgTable('contribution_frequency_options', {
  id: serial('id').primaryKey(),
  frequency: text("frequency").notNull()
});

export const contributionAmountOptions = pgTable("contribution_amount_options", {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull()
});

export const patronContributions = pgTable('patron_contributions', {
  id: serial('id').primaryKey(),
  patronDetailId: integer('patron_detail_id')
    .references(() => patronDetails.id, { onDelete: 'cascade' })
    .notNull()
    .unique(), // Assuming a patron has one primary contribution setup
  frequencyId: integer('frequency_id')
    .references(() => contributionFrequencyOptions.id, { onDelete: 'restrict' })
    .notNull(),
  amountId: integer('amount_id')
    .references(() => contributionAmountOptions.id, { onDelete: 'restrict' })
    .notNull(),
  startDate: timestamp('start_date').defaultNow(),
  nextContributionDate: timestamp('next_contribution_date'),
  isActive: boolean('is_active').default(true),
  customAmount: numeric('custom_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// export const patronDetailsRelations = relations(patronDetails, ({ one }) => ({
//   membership: one(memberships, {
//     fields: [patronDetails.membershipId],
//     references: [memberships.id],
//   }),
// }));