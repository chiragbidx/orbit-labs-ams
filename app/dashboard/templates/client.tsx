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
import { useEffect, useState } from "react";
import { createTemplateAction, updateTemplateAction, deleteTemplateAction, getTemplatesAction } from "./actions";

type Template = {
  id: string;
  name: string;
  subject: string;
  contentHtml: string;
  contentText?: string;
  variables?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  firstName?: string;
};

export default function Client({ firstName }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [noti, setNoti] = useState<{ status: string; message: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Template | null>(null);

  // Form state for dialogs
  const [form, setForm] = useState({
    name: "",
    subject: "",
    contentHtml: "",
    contentText: "",
    variables: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      subject: "",
      contentHtml: "",
      contentText: "",
      variables: "",
    });

  const openAddDialog = () => {
    resetForm();
    setEditData(null);
    setDialogOpen(true);
  };

  const openEditDialog = (t: Template) => {
    setForm({
      name: t.name,
      subject: t.subject || "",
      contentHtml: t.contentHtml,
      contentText: t.contentText ?? "",
      variables: t.variables ? JSON.stringify(t.variables, null, 2) : "",
    });
    setEditData(t);
    setDialogOpen(true);
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const result = await getTemplatesAction();
      setTemplates(result.rows || []);
    } catch {
      setNoti({ status: "error", message: "Could not fetch templates." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
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
    formData.append("contentHtml", form.contentHtml);
    formData.append("contentText", form.contentText || "");
    formData.append("variables", form.variables);

    try {
      if (form.variables) {
        JSON.parse(form.variables); // quick syntax check
      }
    } catch {
      setNoti({ status: "error", message: "Variables field must be valid JSON." });
      return;
    }

    if (editData) {
      formData.append("id", editData.id);
      result = await updateTemplateAction(formData);
    } else {
      result = await createTemplateAction(formData);
    }

    setNoti(result);
    if (result.status === "success") {
      setDialogOpen(false);
      await fetchTemplates();
    }
  };

  const handleDelete = async (t: Template) => {
    if (!window.confirm("Delete this template? This cannot be undone.")) return;
    const formData = new FormData();
    formData.append("id", t.id);
    const result = await deleteTemplateAction(formData);
    setNoti(result);
    if (result.status === "success") await fetchTemplates();
  };

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
          <div className="flex justify-between items-center">
            <Button variant="default" onClick={openAddDialog}>
              Add Template
            </Button>
            {/* (Future) Search/Filter could go here */}
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
                Loading templates...
              </p>
            ) : templates.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No templates yet, {firstName || "there"}!
              </p>
            ) : (
              <TemplateTable
                templates={templates}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <AddEditTemplateDialog
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

function TemplateTable({
  templates,
  onEdit,
  onDelete,
}: {
  templates: Template[];
  onEdit: (t: Template) => void;
  onDelete: (t: Template) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.name}</TableCell>
            <TableCell>{t.subject}</TableCell>
            <TableCell>
              {new Date(t.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(t)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => onDelete(t)}
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

function AddEditTemplateDialog({
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
    contentHtml: string;
    contentText: string;
    variables: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      subject: string;
      contentHtml: string;
      contentText: string;
      variables: string;
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
              {isEditing ? "Edit Template" : "Add Template"}
            </DialogTitle>
          </DialogHeaderUI>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Template name"
            required
          />
          <Input
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            placeholder="Subject"
          />
          <Textarea
            value={form.contentHtml}
            onChange={(e) =>
              setForm((f) => ({ ...f, contentHtml: e.target.value }))
            }
            placeholder="HTML email body"
            rows={6}
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
          <Textarea
            value={form.variables}
            onChange={(e) =>
              setForm((f) => ({ ...f, variables: e.target.value }))
            }
            placeholder='(Optional) Variables as JSON, e.g. {"first_name": "John"}'
            rows={2}
          />
          <DialogFooterUI>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="default">
              {isEditing ? "Save Changes" : "Add Template"}
            </Button>
          </DialogFooterUI>
        </form>
      </DialogContent>
    </Dialog>
  );
}