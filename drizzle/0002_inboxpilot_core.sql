-- Migration for InboxPilot: contacts, contact_lists, campaigns, templates, analytics, campaign_events

CREATE TABLE IF NOT EXISTS "contact_lists" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "team_id" TEXT NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "team_id" TEXT NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
  "list_id" TEXT REFERENCES "contact_lists" ("id") ON DELETE SET NULL,
  "email" TEXT NOT NULL,
  "first_name" TEXT,
  "last_name" TEXT,
  "tags" JSONB DEFAULT '[]'::jsonb,
  "status" TEXT NOT NULL DEFAULT 'active',
  "opt_in" BOOLEAN NOT NULL DEFAULT TRUE,
  "custom_fields" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "contacts_email_team_idx" UNIQUE ("email", "team_id")
);

CREATE TABLE IF NOT EXISTS "campaigns" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "team_id" TEXT NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "from_name" TEXT NOT NULL,
  "from_email" TEXT NOT NULL,
  "reply_to_email" TEXT,
  "content_html" TEXT NOT NULL,
  "content_text" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "scheduled_at" TIMESTAMPTZ,
  "sent_at" TIMESTAMPTZ,
  "analytics_id" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "templates" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "team_id" TEXT NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "subject" TEXT,
  "content_html" TEXT NOT NULL,
  "content_text" TEXT,
  "variables" JSONB,
  "created_by" TEXT NOT NULL REFERENCES "users" ("id") ON DELETE SET NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "analytics" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "campaign_id" TEXT NOT NULL REFERENCES "campaigns" ("id") ON DELETE CASCADE,
  "team_id" TEXT NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
  "aggregate" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "campaign_events" (
  "id" TEXT PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "campaign_id" TEXT NOT NULL REFERENCES "campaigns" ("id") ON DELETE CASCADE,
  "team_id" TEXT NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
  "contact_id" TEXT NOT NULL REFERENCES "contacts" ("id") ON DELETE CASCADE,
  "event_type" TEXT NOT NULL,
  "meta" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for email + team unique constraint on contacts
CREATE UNIQUE INDEX IF NOT EXISTS "contacts_email_team_idx" ON "contacts" ("email", "team_id");