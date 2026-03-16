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
          <CardTitle>Manage Your Contacts & Lists</CardTitle>
          <CardDescription>
            Organize, import, tag, and segment your audience for maximum campaign results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 flex flex-col items-center">
            <p className="mb-4 text-muted-foreground">
              No contacts yet, {firstName || "there"}!
            </p>
            <Button variant="default">Import Contacts (CSV)</Button>
          </div>
        </CardContent>
      </Card>
      <section>
        {/* Future: List of existing contacts and bulk/batch actions */}
      </section>
    </div>
  );
}