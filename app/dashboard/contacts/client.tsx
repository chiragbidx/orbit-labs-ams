"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { useEffect, useState } from "react";
import { createContactAction, updateContactAction, deleteContactAction, optOutContactAction, getContactsAction, Contact } from "./actions";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  status: z.enum(["active", "unsubscribed", "bounced"]).default("active"),
  optIn: z.boolean().optional().default(true),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type Props = {
  firstName?: string;
};

export default function Client({ firstName }: Props) {
  // Table state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Contact | null>(null);

  // Notification state
  const [noti, setNoti] = useState<{ status: string; message: string } | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getContactsAction();
      setContacts(result.rows);
    } catch (e: any) {
      setError(e.message || "Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Form
  const formMethods = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      status: "active",
      optIn: true,
    },
  });

  const openAddDialog = () => {
    setEditData(null);
    formMethods.reset({ email: "", firstName: "", lastName: "", status: "active", optIn: true });
    setDialogOpen(true);
  };
  const openEditDialog = (contact: Contact) => {
    setEditData(contact);
    formMethods.reset({
      email: contact.email,
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      status: contact.status as any,
      optIn: contact.optIn,
    });
    setDialogOpen(true);
  };

  const handleFormSubmit = async (values: ContactFormValues) => {
    let result;
    if (editData) {
      const form = new FormData();
      form.append("id", editData.id);
      form.append("email", values.email);
      form.append("firstName", values.firstName || "");
      form.append("lastName", values.lastName || "");
      form.append("status", values.status);
      form.append("optIn", values.optIn ? "true" : "false");
      result = await updateContactAction(form);
    } else {
      const form = new FormData();
      form.append("email", values.email);
      form.append("firstName", values.firstName || "");
      form.append("lastName", values.lastName || "");
      form.append("status", values.status);
      form.append("optIn", values.optIn ? "true" : "false");
      result = await createContactAction(form);
    }
    if (result.status === "success") {
      setDialogOpen(false);
      setNoti(result);
      await fetchContacts();
    } else {
      setNoti(result);
    }
  };

  const handleDelete = async (contact: Contact) => {
    if (!window.confirm("Delete this contact? This cannot be undone.")) return;
    const form = new FormData();
    form.append("id", contact.id);
    const result = await deleteContactAction(form);
    setNoti(result);
    if (result.status === "success") await fetchContacts();
  };

  const handleOptOut = async (contact: Contact) => {
    const form = new FormData();
    form.append("id", contact.id);
    const result = await optOutContactAction(form);
    setNoti(result);
    if (result.status === "success") await fetchContacts();
  };

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
          <div className="flex justify-between items-center">
            <div>
              <Button variant="default" onClick={openAddDialog}>
                Add Contact
              </Button>
            </div>
            {/* (Future) CSV Import/Export */}
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
              <p className="text-muted-foreground text-center">Loading contacts...</p>
            ) : error ? (
              <p className="text-destructive text-center">{error}</p>
            ) : contacts.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No contacts yet, {firstName || "there"}!
              </p>
            ) : (
              <ContactTable
                contacts={contacts}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onOptOut={handleOptOut}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <AddEditContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formMethods={formMethods}
        onSubmit={handleFormSubmit}
        isEditing={!!editData}
      />
    </div>
  );
}

function ContactTable({
  contacts,
  onEdit,
  onDelete,
  onOptOut,
}: {
  contacts: Contact[];
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
  onOptOut: (c: Contact) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>First name</TableHead>
          <TableHead>Last name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Opt-In</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.email}</TableCell>
            <TableCell>{c.firstName}</TableCell>
            <TableCell>{c.lastName}</TableCell>
            <TableCell>
              <span
                className={
                  c.status === "active"
                    ? "text-emerald-700 font-medium"
                    : c.status === "unsubscribed"
                    ? "text-yellow-700 font-medium"
                    : "text-red-700 font-medium"
                }
              >
                {c.status}
              </span>
            </TableCell>
            <TableCell>
              {c.optIn ? (
                <span className="text-primary font-semibold">Yes</span>
              ) : (
                <span className="text-muted-foreground">No</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="outline" onClick={() => onEdit(c)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive ml-1"
                onClick={() => onDelete(c)}
              >
                Delete
              </Button>
              {c.status === "active" ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="ml-1"
                  onClick={() => onOptOut(c)}
                >
                  Unsub
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AddEditContactDialog({
  open,
  onOpenChange,
  formMethods,
  onSubmit,
  isEditing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  formMethods: ReturnType<typeof useForm<ContactFormValues>>;
  onSubmit: (values: ContactFormValues) => Promise<void>;
  isEditing: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogContent>
        <FormProvider {...formMethods}>
          <form
            className="grid gap-4"
            onSubmit={formMethods.handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <DialogHeaderUI>
              <DialogTitle>
                {isEditing ? "Edit Contact" : "Add Contact"}
              </DialogTitle>
            </DialogHeaderUI>
            <div>
              <Input
                {...formMethods.register("email")}
                placeholder="Email"
                type="email"
                autoFocus
              />
              {formMethods.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {formMethods.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...formMethods.register("firstName")}
                placeholder="First name"
              />
              {formMethods.formState.errors.firstName && (
                <p className="text-xs text-destructive">
                  {formMethods.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...formMethods.register("lastName")}
                placeholder="Last name"
              />
              {formMethods.formState.errors.lastName && (
                <p className="text-xs text-destructive">
                  {formMethods.formState.errors.lastName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs mb-2">Status</label>
              <select
                {...formMethods.register("status")}
                className="w-full rounded-md border p-1"
              >
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
              {formMethods.formState.errors.status && (
                <p className="text-xs text-destructive">
                  {formMethods.formState.errors.status.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 mb-1">
              <input
                type="checkbox"
                {...formMethods.register("optIn")}
                className="mr-2"
                id="optInCheck"
                defaultChecked
              />
              <label htmlFor="optInCheck" className="text-sm">
                Opt-In to receive emails
              </label>
            </div>
            <DialogFooterUI>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                {isEditing ? "Save Changes" : "Add Contact"}
              </Button>
            </DialogFooterUI>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}