"use server";

import { db } from "@/lib/db/client";
import { contacts, teamMembers } from "@/lib/db/schema";
import { and, eq, ilike } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

// Only async server actions exported – move types/zod outside this file!

export async function createContactAction(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const email = formData.get("email")?.toString() ?? "";
    const firstName = formData.get("firstName")?.toString() ?? "";
    const lastName = formData.get("lastName")?.toString() ?? "";
    const status = formData.get("status")?.toString() as "active" | "unsubscribed" | "bounced";
    const optIn = formData.get("optIn") === "on" || formData.get("optIn") === "true";
    // Enforce minimal validation here
    if (!email.includes("@")) return { status: "error", message: "Invalid email." };

    const existing = await db
      .select()
      .from(contacts)
      .where(and(eq(contacts.teamId, teamId), ilike(contacts.email, email)))
      .limit(1);
    if (existing[0]) {
      return { status: "error", message: "A contact with that email already exists." };
    }

    await db.insert(contacts).values({
      email,
      firstName,
      lastName,
      status,
      optIn,
      teamId,
    });

    return { status: "success", message: "Contact added!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not add contact." };
  }
}

export async function updateContactAction(formData: FormData) {
  try {
    const id = formData.get("id")?.toString() || "";
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const email = formData.get("email")?.toString() ?? "";
    const firstName = formData.get("firstName")?.toString() ?? "";
    const lastName = formData.get("lastName")?.toString() ?? "";
    const status = formData.get("status")?.toString() as "active" | "unsubscribed" | "bounced";
    const optIn = formData.get("optIn") === "on" || formData.get("optIn") === "true";

    const exists = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.teamId, teamId),
          ilike(contacts.email, email),
          eq(contacts.id, id) === false // not self
        )
      )
      .limit(1);
    if (exists[0]) {
      return { status: "error", message: "That email is already in use for another contact." };
    }

    await db
      .update(contacts)
      .set({
        email,
        firstName,
        lastName,
        status,
        optIn,
      })
      .where(and(eq(contacts.id, id), eq(contacts.teamId, teamId)));

    return { status: "success", message: "Contact updated!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not update contact." };
  }
}

export async function deleteContactAction(formData: FormData) {
  try {
    const id = formData.get("id")?.toString() || "";
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.teamId, teamId)));

    return { status: "success", message: "Contact deleted." };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not delete contact." };
  }
}

export async function optOutContactAction(formData: FormData) {
  try {
    const id = formData.get("id")?.toString() || "";
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    await db
      .update(contacts)
      .set({ status: "unsubscribed", optIn: false })
      .where(and(eq(contacts.id, id), eq(contacts.teamId, teamId)));

    return { status: "success", message: "Contact unsubscribed." };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not unsubscribe contact." };
  }
}

export async function getContactsAction() {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = await getTeamIdBySession();

  const rows = await db
    .select()
    .from(contacts)
    .where(eq(contacts.teamId, teamId))
    .orderBy(contacts.createdAt);

  return {
    rows,
    total: rows.length,
    page: 1,
    pageSize: 15,
    totalPages: 1,
  };
}

// Shared tenant
async function getTeamIdBySession() {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamRows = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);
  const member = teamRows[0];
  if (!member) throw new Error("No team membership found.");
  return member.teamId;
}