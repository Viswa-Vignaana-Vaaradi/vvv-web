import generateMemberCode from "../utils/member-code-generator";
import { auth } from "@repo/auth";
import { db } from "@repo/db";
import { memberships, professionOptions, userLocation, volunteerDetails, volunteerInterestedAreas, volunteerInvolvementAreas } from "@repo/db/schema/core-schema";
import Elysia, { t } from "elysia";

const SuccessResponse = t.Object({
  success: t.Literal(true),
  message: t.String(),
  memberCode: t.String(),
  membershipDetails: t.Object({
    id: t.Number(),
    userId: t.String(),
    roleName: t.String(),
    memberCode: t.String(),
    joinedAt: t.Date(),
  }),
  wantsToContribute: t.Boolean(),
});

const APIErrorResponse = t.Object({
  success: t.Literal(false),
  error: t.String(),
});

export const VolunteerForm = new Elysia({ prefix: "/volunteer/submit" })
    .macro({
        auth: {
            async resolve({ status, set, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers,
                });
            
                if (!session) {
                    set.status = 401;
                    return {
                        error: "Unauthorized",
                        user: null
                    };
                }
            
                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })
    .post("/", async({ body, set, query }) => {
        const { userId } = query;

        const existingMembership = await db.query.memberships.findFirst({
            where: (m, { eq }) =>  eq(m.userId, userId),
        });

        if (existingMembership) {
            set.status = 400;
            return {
                success: false,
                error: `User is already registered as ${existingMembership.roleName}`
            };
        }

        try {
            const result = await db.transaction(async (tx) => {

                const professionName = body.profession === "Other" ? body.otherProfession : body.profession;
                let professionRecord = await tx.query.professionOptions.findFirst({
                    where: (opts, { eq }) => eq(opts.name, professionName)
                });

                if (!professionRecord) {
                    const [newP] = await tx.insert(professionOptions).values({ name: professionName }).returning();
                    professionRecord = newP;
                }

                const involvementRecords = body.involvement.length > 0 
                    ? await tx.query.involvementAreasOptions.findMany({
                        where: (opts, { inArray }) => inArray(opts.name, body.involvement)
                    })
                    : [];

                const interestRecords = body.areaOfInterest.length > 0
                    ? await tx.query.interestedAreasOptions.findMany({
                        where: (opts, { inArray }) => inArray(opts.name, body.areaOfInterest)
                    })
                : [];

                const memberCode = await generateMemberCode('VOLUNTEER');

                const [newMembership] = await tx.insert(memberships).values({
                    userId: userId,
                    roleName: 'VOLUNTEER',
                    memberCode: memberCode,
                    joinedAt: new Date(),
                }).returning();

                if (!newMembership) {
                    throw new Error("Failed to create membership.");
                }

                const [details] = await tx.insert(volunteerDetails).values({
                    fullName: body.fullName,
                    membershipId: newMembership!.id,
                    age: body.age,
                    gender: body.gender,
                    contactNumber: String(body.contactNumber),
                    bloodGroup: body.bloodGroup,
                    collegeName: body.profession === "Student" ? body.collegeName : null,
                    professionId: professionRecord?.id,
                    education: body.education
                }).returning();

                if (!details) {
                   throw new Error("Failed to create volunteer details.");
                }

                if (involvementRecords.length > 0) {
                    await tx.insert(volunteerInvolvementAreas).values(
                        involvementRecords.map(r => ({
                            volunteerDetailId: details!.id,
                            involvementAreaId: r.id
                        }))
                    );
                }

                if (interestRecords.length > 0) {
                    await tx.insert(volunteerInterestedAreas).values(
                        interestRecords.map(r => ({
                            volunteerDetailId: details!.id,
                            interestedAreaId: r.id
                        }))
                    );
                }

                await tx.insert(userLocation).values({
                    userId,
                    city: body.city,
                    state: body.state,
                    coords: { x: 0, y: 0 }
                }).onConflictDoUpdate({
                    target: userLocation.userId,
                    set: { city: body.city, state: body.state, updatedAt: new Date() }
                });

                return {
                    memberCode: newMembership.memberCode,
                    membershipDetails: newMembership,
                    wantsToContribute: body.contribute === "yes",
                };
            });

            set.status = 201;
            return {
                success: true,
                message: "Registration successful!",
                memberCode: result.memberCode,
                membershipDetails: result.membershipDetails,
                wantsToContribute: result.wantsToContribute,
            };
        } catch(error: any) {
            if (error.code === '23505') {
                set.status = 409;
                return { success: false, error: "Error in generating member code. Please try again." };
            }
            console.error("Volunteer form submission error:", error);
            set.status = 500;
            return { success: false, error: error.message || "Internal Server Error during registration." };
        }
    }, {
        auth: true,
        query: t.Object({
            userId: t.String(),
        }),
        body: t.Object({
            fullName: t.String(),
            age: t.Number(),
            profession: t.String(),
            collegeName: t.String(),
            otherProfession: t.String(),
            gender: t.String(),
            contactNumber: t.String(),
            bloodGroup: t.String(),
            city: t.String(),
            state: t.String(),
            education: t.String(),
            involvement: t.Array(t.String()),
            areaOfInterest: t.Array(t.String()),
            contribute: t.String(),
            termsAccepted: t.Boolean()
        }),
        response: {
            201: SuccessResponse,
            400: APIErrorResponse,
            401: APIErrorResponse,
            409: APIErrorResponse,
            500: APIErrorResponse,
        },
    });