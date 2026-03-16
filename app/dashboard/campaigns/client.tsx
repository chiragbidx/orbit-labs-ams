"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as DialogHeaderUI,
  DialogTitle,
  DialogFooter as DialogFooterUI,
  DialogClose,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { createCampaignAction, updateCampaignAction, deleteCampaignAction, getCampaignsAction } from "./actions";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  contentHtml: string;
  contentText?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  firstName?: string;
};

const STATUS_OPTIONS = ["draft", "scheduled", "sending", "sent", "failed"];

export default function Client({ firstName }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [noti, setNoti] = useState<{ status: string; message: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Campaign | null>(null);

  // Form state for dialogs
  const [form, setForm] = useState({
    name: "",
    subject: "",
    fromName: "",
    fromEmail: "",
    contentHtml: "",
    contentText: "",
    status: "draft",
  });

  const resetForm = () => setForm({
    name: "",
    subject: "",
    fromName: "",
    fromEmail: "",
    contentHtml: "",
    contentText: "",
    status: "draft",
  });

  const openAddDialog = () => {
    resetForm();
    setEditData(null);
    setDialogOpen(true);
  };

  const openEditDialog = (c: Campaign) => {
    setForm({
      name: c.name,
      subject: c.subject,
      fromName: c.fromName,
      fromEmail: c.fromEmail,
      contentHtml: c.contentHtml,
      contentText: c.contentText ?? "",
      status: c.status,
    });
    setEditData(c);
    setDialogOpen(true);
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const result = await getCampaignsAction();
      setCampaigns(result.rows || []);
    } catch {
      setNoti({ status: "error", message: "Could not fetch campaigns." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("subject", form.subject);
    formData.append("fromName", form.fromName);
    formData.append("fromEmail", form.fromEmail);
    formData.append("contentHtml", form.contentHtml);
    formData.append("contentText", form.contentText || "");
    formData.append("status", form.status);

    if (editData) {
      formData.append("id", editData.id);
      result = await updateCampaignAction(formData);
    } else {
      result = await createCampaignAction(formData);
    }

    setNoti(result);
    if (result.status === "success") {
      setDialogOpen(false);
      await fetchCampaigns();
    }
  };

  const handleDelete = async (c: Campaign) => {
    if (!window.confirm("Delete this campaign? This cannot be undone.")) return;
    const formData = new FormData();
    formData.append("id", c.id);
    const result = await deleteCampaignAction(formData);
    setNoti(result);
    if (result.status === "success") await fetchCampaigns();
  };

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
          <div className="flex justify-between items-center">
            <Button variant="default" onClick={openAddDialog}>
              Add Campaign
            </Button>
            {/* (Future) Search/Filter */}
          </div>
          <div className="mt-6">
            {noti && (
              <div
                className={`mb-4 px-4 py-2 rounded ${
                  noti.status === "success"
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {noti.message}
              </div>
            )}
            {loading ? (
              <p className="text-muted-foreground text-center">
                Loading campaigns...
              </p>
            ) : campaigns.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No campaigns yet, {firstName || "there"}!
              </p>
            ) : (
              <CampaignTable
                campaigns={campaigns}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <AddEditCampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        setForm={setForm}
        isEditing={!!editData}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}

function CampaignTable({
  campaigns,
  onEdit,
  onDelete,
}: {
  campaigns: Campaign[];
  onEdit: (c: Campaign) => void;
  onDelete: (c: Campaign) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.name}</TableCell>
            <TableCell>{c.subject}</TableCell>
            <TableCell>
              <StatusBadge status={c.status} />
            </TableCell>
            <TableCell>
              {new Date(c.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(c)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => onDelete(c)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color =
    status === "sent"
      ? "bg-emerald-200 text-emerald-900"
      : status === "scheduled"
      ? "bg-blue-200 text-blue-900"
      : status === "sending"
      ? "bg-purple-200 text-purple-900"
      : status === "failed"
      ? "bg-red-200 text-red-900"
      : "bg-gray-100 text-gray-800";
  return (
    <span
      className={`${color} px-3 py-1 rounded-full font-medium text-xs border`}
    >
      {status[0]?.toUpperCase() + status.slice(1)}
    </span>
  );
}

function AddEditCampaignDialog({
  open,
  onOpenChange,
  form,
  setForm,
  isEditing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  form: {
    name: string;
    subject: string;
    fromName: string;
    fromEmail: string;
    contentHtml: string;
    contentText: string;
    status: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      subject: string;
      fromName: string;
      fromEmail: string;
      contentHtml: string;
      contentText: string;
      status: string;
    }>
  >;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <DialogHeaderUI>
            <DialogTitle>
              {isEditing ? "Edit Campaign" : "Add Campaign"}
            </DialogTitle>
          </DialogHeaderUI>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Campaign name"
            required
          />
          <Input
            value={form.subject}
            onChange={(e) =>
              setForm((f) => ({ ...f, subject: e.target.value }))
            }
            placeholder="Subject"
            required
          />
          <Input
            value={form.fromName}
            onChange={(e) =>
              setForm((f) => ({ ...f, fromName: e.target.value }))
            }
            placeholder="From name"
            required
          />
          <Input
            value={form.fromEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, fromEmail: e.target.value }))
            }
            placeholder="From email"
            type="email"
            required
          />
          <Textarea
            value={form.contentHtml}
            onChange={(e) =>
              setForm((f) => ({ ...f, contentHtml: e.target.value }))
            }
            placeholder="HTML email content"
            rows={8}
            required
          />
          <Textarea
            value={form.contentText}
            onChange={(e) =>
              setForm((f) => ({ ...f, contentText: e.target.value }))
            }
            placeholder="(Optional) Plain text version"
            rows={3}
          />
          <label className="block text-sm font-medium mt-2">Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value }))
            }
            className="w-full rounded-md border p-2"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option value={opt} key={opt}>
                {opt[0].toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          <DialogFooterUI>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              {isEditing ? "Save Changes" : "Add Campaign"}
            </Button>
          </DialogFooterUI>
        </form>
      </DialogContent>
    </Dialog>
  );
}