"use server";

import { db } from "@/lib/db/client";
import { campaigns, teamMembers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

// CREATE CAMPAIGN
export async function createCampaignAction(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const name = formData.get("name")?.toString() ?? "";
    const subject = formData.get("subject")?.toString() ?? "";
    const fromName = formData.get("fromName")?.toString() ?? "";
    const fromEmail = formData.get("fromEmail")?.toString() ?? "";
    const contentHtml = formData.get("contentHtml")?.toString() || "";
    const contentText = formData.get("contentText")?.toString() || "";
    const status = formData.get("status")?.toString() as "draft" | "scheduled" | "sending" | "sent" | "failed";

    if (!name || !subject || !fromName || !fromEmail || !contentHtml)
      return { status: "error", message: "Missing required fields." };

    await db.insert(campaigns).values({
      name,
      subject,
      fromName,
      fromEmail,
      contentHtml,
      contentText,
      teamId,
      status: status || "draft",
    });

    return { status: "success", message: "Campaign created!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not create campaign." };
  }
}

// UPDATE CAMPAIGN
export async function updateCampaignAction(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const id = formData.get("id")?.toString() || "";
    const name = formData.get("name")?.toString() ?? "";
    const subject = formData.get("subject")?.toString() ?? "";
    const fromName = formData.get("fromName")?.toString() ?? "";
    const fromEmail = formData.get("fromEmail")?.toString() ?? "";
    const contentHtml = formData.get("contentHtml")?.toString() || "";
    const contentText = formData.get("contentText")?.toString() || "";
    const status = formData.get("status")?.toString() as "draft" | "scheduled" | "sending" | "sent" | "failed";

    if (!id || !name || !subject || !fromName || !fromEmail || !contentHtml)
      return { status: "error", message: "Missing required fields." };

    await db
      .update(campaigns)
      .set({
        name,
        subject,
        fromName,
        fromEmail,
        contentHtml,
        contentText,
        status: status || "draft",
      })
      .where(and(eq(campaigns.id, id), eq(campaigns.teamId, teamId)));

    return { status: "success", message: "Campaign updated!" };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not update campaign." };
  }
}

// DELETE CAMPAIGN
export async function deleteCampaignAction(formData: FormData) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error("Not authenticated");
    const teamId = await getTeamIdBySession();

    const id = formData.get("id")?.toString() || "";
    if (!id) return { status: "error", message: "Missing campaign id." };

    await db.delete(campaigns).where(and(eq(campaigns.id, id), eq(campaigns.teamId, teamId)));

    return { status: "success", message: "Campaign deleted." };
  } catch (e: any) {
    return { status: "error", message: e.message || "Could not delete campaign." };
  }
}

// FETCH CAMPAIGNS
export async function getCampaignsAction() {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const teamId = await getTeamIdBySession();

  const rows = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.teamId, teamId))
    .orderBy(campaigns.createdAt);

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