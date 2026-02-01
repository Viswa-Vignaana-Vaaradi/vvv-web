import { headers } from "next/headers";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

export default async function DashboardPage() {

  return (
    <div>
      <Dashboard />
    </div>
  );
}
