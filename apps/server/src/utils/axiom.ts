import { Axiom } from "@axiomhq/js";
import { env } from "@repo/env/server";

export const axiom = new Axiom({
  token: env.AXIOM_API_TOKEN,
});