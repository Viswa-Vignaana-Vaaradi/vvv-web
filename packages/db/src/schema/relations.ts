import { relations } from "drizzle-orm";
import { educationalQualificationOptions, interestedAreasOptions, involvementAreasOptions, memberships, professionOptions, volunteerDetails, volunteerInterestedAreas, volunteerInvolvementAreas } from "./core-schema";

export const volunteerDetailsRelations = relations(
  volunteerDetails,
  ({ one, many }) => ({
    membership: one(memberships, {
      fields: [volunteerDetails.membershipId],
      references: [memberships.id],
    }),
    educationalQualification: one(educationalQualificationOptions, {
      fields: [volunteerDetails.educationalQualificationId],
      references: [educationalQualificationOptions.id],
    }),
    profession: one(professionOptions, {
      fields: [volunteerDetails.professionId],
      references: [professionOptions.id],
    }),
    volunteerInvolvementAreas: many(volunteerInvolvementAreas),
    volunteerInterestedAreas: many(volunteerInterestedAreas),
  }),
);

export const volunteerInvolvementAreasRelations = relations(
  volunteerInvolvementAreas,
  ({ one }) => ({
    volunteerDetail: one(volunteerDetails, {
      fields: [volunteerInvolvementAreas.volunteerDetailId],
      references: [volunteerDetails.id],
    }),
    involvementArea: one(involvementAreasOptions, {
      fields: [volunteerInvolvementAreas.involvementAreaId],
      references: [involvementAreasOptions.id],
    }),
  }),
);

export const volunteerInterestedAreasRelations = relations(
  volunteerInterestedAreas,
  ({ one }) => ({
    volunteerDetail: one(volunteerDetails, {
      fields: [volunteerInterestedAreas.volunteerDetailId],
      references: [volunteerDetails.id],
    }),
    interestedArea: one(interestedAreasOptions, {
      fields: [volunteerInterestedAreas.interestedAreaId],
      references: [interestedAreasOptions.id],
    }),
  }),
);