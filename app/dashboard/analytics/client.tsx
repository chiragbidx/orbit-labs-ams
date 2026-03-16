"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  firstName?: string;
};

export default function Client({ firstName }: Props) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Analytics</CardTitle>
          <CardDescription>
            See aggregate and per-campaign results across opens, clicks, bounces, and unsubscribes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 flex flex-col items-center">
            <p className="mb-4 text-muted-foreground">
              No analytics yet, {firstName || "there"}!
            </p>
            <Button variant="default">Export Analytics (CSV)</Button>
          </div>
        </CardContent>
      </Card>
      <section>
        {/* Future: Analytics table or charts, CSV export and filter controls */}
      </section>
    </div>
  );
}