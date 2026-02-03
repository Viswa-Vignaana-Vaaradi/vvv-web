"use client";

import DashboardProfile from "./components/dashboard-profile";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default function Dashboard() {
  
  return (
    <>
    <DashboardSidebar />
    <DashboardProfile />
    </>
  );
}
