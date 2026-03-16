"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { contacts, contactLists, teams, teamMembers } from "@/lib/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

// Zod schemas
export const contactSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  firstName: z.string().max(100).optional().or(z.literal("")),
  lastName: z.string().max(100).optional().or(z.literal("")),
  listId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "unsubscribed", "bounced"]).default("active"),
  optIn: z.boolean().optional().default(true),
  customFields: z.record(z.string(), z.string()).optional(),
});

// Types for contact data
export type Contact = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  listId?: string | null;
  tags?: string[];
  status: string;
  optIn: boolean;
  customFields?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

type ActionResult =
  | { status: "success"; message?: string }
  | { status: "error"; message?: string };

// Enforces tenant isolation for all mutations and reads
async function getTeamIdBySession() {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const member = await db.query.teamMembers.findFirst({
    where: (m) => eq(m.userId, session.userId),
  });
  if (!member) throw new Error("No team membership found.");
  return member.teamId;
}

// CREATE CONTACT
export async function createContactAction(formData: FormData): Promise<ActionResult> {
  try {
    const input = {
      email: formData.get("email")?.toString() ?? "",
      firstName: formData.get("firstName")?.toString() ?? "",
      lastName: formData.get("lastName")?.toString() ?? "",
      listId: formData.get("listId")?.toString() || undefined,
      status: formData.get("status")?.toString() as "active" | "unsubscribed" | "bounced",
      optIn: formData.get("optIn") === "on" || formData.get("optIn") === "true",
      tags: (formData.getAll("tags[]") as string[]) ?? [],
    };
    const parsed = contactSchema.parse(input);
    const teamId = await getTeamIdBySession();

    // Email uniqueness check per team
    const existing = await db.query.contacts.findFirst({
      where: (c) => and(eq(c.teamId, teamId), ilike(c.email, parsed.email)),
    });
    if (existing) {
      return { status: "error", message: "A contact with that email already exists." };
    }

    await db.insert(contacts).values({
      email: parsed.email,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      listId: parsed.listId || null,
      status: parsed.status,
      optIn: parsed.optIn,
      tags: parsed.tags ?? [],
      customFields: parsed.customFields ?? {},
      teamId,
    });

    revalidatePath("/dashboard/contacts");
    return { status: "success", message: "Contact added!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not add contact." };
  }
}

// UPDATE CONTACT
export async function updateContactAction(formData: FormData): Promise<ActionResult> {
  try {
    const id = formData.get("id")?.toString() || "";
    const input = {
      email: formData.get("email")?.toString() ?? "",
      firstName: formData.get("firstName")?.toString() ?? "",
      lastName: formData.get("lastName")?.toString() ?? "",
      listId: formData.get("listId")?.toString() || undefined,
      status: formData.get("status")?.toString() as "active" | "unsubscribed" | "bounced",
      optIn: formData.get("optIn") === "on" || formData.get("optIn") === "true",
      tags: (formData.getAll("tags[]") as string[]) ?? [],
    };
    const parsed = contactSchema.parse(input);
    const teamId = await getTeamIdBySession();

    // Uniqueness check except self
    const exists = await db.query.contacts.findFirst({
      where: (c) =>
        and(
          eq(c.teamId, teamId),
          ilike(c.email, parsed.email),
          c.id !== id
        ),
    });
    if (exists) {
      return { status: "error", message: "That email is already in use for another contact." };
    }

    await db
      .update(contacts)
      .set({
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        listId: parsed.listId || null,
        status: parsed.status,
        optIn: parsed.optIn,
        tags: parsed.tags ?? [],
        customFields: parsed.customFields ?? {},
      })
      .where(and(eq(contacts.id, id), eq(contacts.teamId, teamId)));

    revalidatePath("/dashboard/contacts");
    return { status: "success", message: "Contact updated!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not update contact." };
  }
}

// DELETE CONTACT
export async function deleteContactAction(formData: FormData): Promise<ActionResult> {
  try {
    const id = formData.get("id")?.toString() || "";
    const teamId = await getTeamIdBySession();

    await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.teamId, teamId)));

    revalidatePath("/dashboard/contacts");
    return { status: "success", message: "Contact deleted." };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not delete contact." };
  }
}

// OPT-OUT (UNSUBSCRIBE)
export async function optOutContactAction(formData: FormData): Promise<ActionResult> {
  try {
    const id = formData.get("id")?.toString() || "";
    const teamId = await getTeamIdBySession();

    await db
      .update(contacts)
      .set({ status: "unsubscribed", optIn: false })
      .where(and(eq(contacts.id, id), eq(contacts.teamId, teamId)));

    revalidatePath("/dashboard/contacts");
    return { status: "success", message: "Contact unsubscribed." };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not unsubscribe contact." };
  }
}

// FETCH CONTACTS (with search/filter/pagination)
export type GetContactsOptions = {
  search?: string;
  status?: string;
  listId?: string;
  page?: number;
  pageSize?: number;
};
export async function getContactsAction(opts: GetContactsOptions = {}) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const member = await db.query.teamMembers.findFirst({
    where: (m) => eq(m.userId, session.userId),
  });
  if (!member) throw new Error("No team membership found.");
  const teamId = member.teamId;
  const { search, status, listId, page = 1, pageSize = 15 } = opts;

  const where = [
    eq(contacts.teamId, teamId),
    search
      ? or(ilike(contacts.email, `%${search}%`), ilike(contacts.firstName, `%${search}%`), ilike(contacts.lastName, `%${search}%`))
      : undefined,
    status ? eq(contacts.status, status) : undefined,
    listId ? eq(contacts.listId, listId) : undefined,
  ].filter(Boolean);

  const total = await db.query.contacts.count({ where: (c) => and(...where) });
  const rows = await db
    .select()
    .from(contacts)
    .where(and(...where))
    .orderBy(contacts.createdAt)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    total,
    rows,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}