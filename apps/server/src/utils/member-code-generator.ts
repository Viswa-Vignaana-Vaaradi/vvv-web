import { db } from "@repo/db";

export default async function generateMemberCode(role: string) {
    const roleResult = await db.query.roles.findFirst({
        where: (roles, { eq }) => eq(roles.name, role),
    });

    if (!roleResult) {
        throw new Error("Invalid role");
    };

    const roleName = roleResult.name.toLowerCase();
    const prefix = roleName === "patron" ? 'PAT' : roleName === 'volunteer' ? 'VOL' : roleName.toUpperCase();
    const digitCount = 6; // It will now look like PAT000001 or VOL000001

    const lastMembership = await db.query.memberships.findFirst({
        where: (memberships, { eq }) => eq(memberships.roleName, roleResult.name),
        orderBy: (memberships, { desc }) => [desc(memberships.joinedAt)]
    });

    let nextNumber = 1;
    if (lastMembership?.memberCode) {
        // Strip everything that isn't a number using Regex [^0-9]
        const lastNumStr = lastMembership.memberCode.replace(/[^0-9]/g, '');
        const lastNum = parseInt(lastNumStr, 10);
        
        // Ensure we successfully parsed a number before incrementing
        if (!isNaN(lastNum)) {
            nextNumber = lastNum + 1;
        }
    }

    return `${prefix}${String(nextNumber).padStart(digitCount, '0')}`;
}