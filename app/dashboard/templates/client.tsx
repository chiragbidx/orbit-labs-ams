"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@/components/ui/card";

type Props = {
  firstName?: string;
};

export default function Client({ firstName }: Props) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Design and reuse stunning email templates for rapid, consistent campaign creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 flex flex-col items-center">
            <p className="mb-4 text-muted-foreground">
              No templates yet, {firstName || "there"}!
            </p>
            <Button variant="default">Create Template</Button>
          </div>
        </CardContent>
      </Card>
      <section>
        {/* Future: List of templates, quick preview and edit actions */}
      </section>
    </div>
  );
}