import { Axiom } from "@axiomhq/js";
import { env } from "@repo/env/server";

export const axiom = new Axiom({
  token: env.AXIOM_API_TOKEN,
  orgId: env.AXIOM_ORG_ID
});