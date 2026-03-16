"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  greeting: string;
  firstName: string;
  brand?: string;
};

export function DashboardContent({ greeting, firstName, brand = "InboxPilot" }: Props) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {greeting}, {firstName}! 🚀
          </CardTitle>
          <CardDescription>
            Welcome to {brand}. Ready to send your next campaign?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <QuickStat label="Contacts" value="0" />
            <QuickStat label="Campaigns" value="0" />
            <QuickStat label="Templates" value="0" />
            <QuickStat label="Open Rate" value="–" />
            <QuickStat label="Unsubscribes" value="–" />
          </div>
        </CardContent>
      </Card>
      <section className="grid gap-8 md:grid-cols-2">
        {/* Empty states for now, ready for feature wiring */}
        <Card className="h-full bg-muted/60 dark:bg-card flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Start by importing contacts</CardTitle>
            <CardDescription>
              Build your audience with custom lists, then target them in future campaigns.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="h-full bg-muted/60 dark:bg-card flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Launch a new campaign</CardTitle>
            <CardDescription>
              Design beautiful emails or reuse a branded template — then send, schedule, and track instantly.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}

// Simple stat card component (can be replaced with real queries later)
function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5 p-4 rounded-lg bg-white/80 dark:bg-card/30 shadow border min-w-[120px]">
      <div className="text-xs uppercase text-muted-foreground tracking-wide">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}