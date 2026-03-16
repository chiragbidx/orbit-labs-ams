"use server";

import { db } from "@/lib/db/client";
import { templates, teamMembers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

// CREATE TEMPLATE
export async function createTemplateAction(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const name = formData.get("name")?.toString() ?? "";
    const subject = formData.get("subject")?.toString() ?? "";
    const contentHtml = formData.get("contentHtml")?.toString() || "";
    const contentText = formData.get("contentText")?.toString() || "";
    // variables (optional JSON, handled as string)
    const variables = formData.get("variables")?.toString();
    const createdBy = session.userId;

    if (!name || !contentHtml)
      return { status: "error", message: "Missing required fields." };

    await db.insert(templates).values({
      name,
      subject,
      contentHtml,
      contentText,
      variables: variables ? JSON.parse(variables) : {},
      createdBy,
      teamId,
    });

    return { status: "success", message: "Template created!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not create template." };
  }
}

// UPDATE TEMPLATE
export async function updateTemplateAction(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const id = formData.get("id")?.toString() || "";
    const name = formData.get("name")?.toString() ?? "";
    const subject = formData.get("subject")?.toString() ?? "";
    const contentHtml = formData.get("contentHtml")?.toString() || "";
    const contentText = formData.get("contentText")?.toString() || "";
    const variables = formData.get("variables")?.toString();

    if (!id || !name || !contentHtml)
      return { status: "error", message: "Missing required fields." };

    await db
      .update(templates)
      .set({
        name,
        subject,
        contentHtml,
        contentText,
        variables: variables ? JSON.parse(variables) : {},
      })
      .where(and(eq(templates.id, id), eq(templates.teamId, teamId)));

    return { status: "success", message: "Template updated!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not update template." };
  }
}

// DELETE TEMPLATE
export async function deleteTemplateAction(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const id = formData.get("id")?.toString() || "";
    if (!id) return { status: "error", message: "Missing template id." };

    await db.delete(templates).where(and(eq(templates.id, id), eq(templates.teamId, teamId)));

    return { status: "success", message: "Template deleted." };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not delete template." };
  }
}

// FETCH TEMPLATES
export async function getTemplatesAction() {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = await getTeamIdBySession();

  const rows = await db
    .select()
    .from(templates)
    .where(eq(templates.teamId, teamId))
    .orderBy(templates.createdAt);

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