import generateMemberCode from "../utils/member-code-generator";
import { auth } from "@repo/auth";
import { db } from "@repo/db";
import { memberships, patronDetails, patronInterestedAreas, patronInvolvementAreas, professionOptions } from "@repo/db/schema/core-schema";
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
    joinedAt: t.Date().nullable(),
  }),
  frequency: t.String(),
  amount: t.String(),
  otherAmount: t.String(),
});

const APIErrorResponse = t.Object({
  success: t.Literal(false),
  error: t.String(),
});

export const PatronForm = new Elysia({ prefix: "/patron/submit" })
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

                const memberCode = await generateMemberCode('PATRON');

                const [newMembership] = await tx.insert(memberships).values({
                    userId: userId,
                    roleName: 'PATRON',
                    memberCode: memberCode,
                    joinedAt: new Date(),
                }).returning();

                if (!newMembership) {
                    throw new Error("Failed to create membership.");
                }

                const [details] = await tx.insert(patronDetails).values({
                    fullName: body.fullName,
                    dob: body.dob,
                    membershipId: newMembership.id,
                    contactNumber: body.contactNumber,
                    professionId: professionRecord?.id,
                }).returning();

                if (!details) {
                   throw new Error("Failed to patron details.");
                }

                if (involvementRecords.length > 0) {
                    await tx.insert(patronInvolvementAreas).values(
                        involvementRecords.map(r => ({
                            patronDetailId: details!.id,
                            involvementAreaId: r.id
                        }))
                    );
                }
                
                if (interestRecords.length > 0) {
                    await tx.insert(patronInterestedAreas).values(
                        interestRecords.map(r => ({
                            patronDetailId: details!.id,
                            interestedAreaId: r.id
                        }))
                    );
                }

                return {
                    memberCode: newMembership.memberCode,
                    membershipDetails: newMembership,
                    frequency: body.frequency,
                    amount: body.amount,
                    otherAmount: body.otherAmount
                };
            });

            set.status = 201;
            return {
                success: true,
                message: "Registration successful!",
                memberCode: result.memberCode,
                membershipDetails: result.membershipDetails,
                frequency: result.frequency,
                amount: result.amount,
                otherAmount: result.otherAmount,
            };
        } catch (error: any) {
            if (error.code === '23505') {
                set.status = 409;
                return { success: false, error: "Error in generating member code. Please try again." };
            }
            console.error("Patron form submission error:", error);
            set.status = 500;
            return { error: error.message || "Internal Server Error" };
        }
    }, {
        query: t.Object({
            userId: t.String(),
        }),
        body: t.Object({
            fullName: t.String(),
            dob: t.Date(),
            profession: t.String(),
            collegeName: t.String(),
            otherProfession: t.String(),
            contactNumber: t.String(),
            involvement: t.Array(t.String()),
            areaOfInterest: t.Array(t.String()),
            frequency: t.String(),
            amount: t.String(),
            otherAmount: t.String(),
            termsAccepted: t.Boolean()
        }),
        response: {
            201: SuccessResponse,
            400: APIErrorResponse,
            401: APIErrorResponse,
            409: APIErrorResponse,
            500: APIErrorResponse,
        },
    })