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
          <CardTitle>Send a Campaign</CardTitle>
          <CardDescription>
            Create, preview, and deliver emails to your best audience using InboxPilot's flexible campaign engine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 flex flex-col items-center">
            <p className="mb-4 text-muted-foreground">
              No campaigns yet, {firstName || "there"}!
            </p>
            <Button variant="default">Create Campaign</Button>
          </div>
        </CardContent>
      </Card>
      <section>
        {/* Future: List of all campaigns, status, schedule actions */}
      </section>
    </div>
  );
}