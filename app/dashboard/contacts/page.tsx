import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import Client from "./client";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

// Replace this placeholder logic with actual contact list fetching and tenant isolation.
export default async function ContactsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const [user] = await db
    .select({ firstName: users.firstName })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return <Client firstName={user?.firstName} />;
}