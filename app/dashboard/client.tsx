"use client";

import { DashboardContent } from "@/components/dashboard/dashboard-content";

type ClientProps = {
  greeting: string;
  firstName: string;
  brand?: string;
};

export default function Client({ greeting, firstName, brand = "InboxPilot" }: ClientProps) {
  return (
    <DashboardContent
      greeting={greeting}
      firstName={firstName}
      brand={brand}
    />
  );
}