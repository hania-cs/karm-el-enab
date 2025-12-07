import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Booklet } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default function AdminBooklets() {
  const [booklets, setBooklets] = useState<Booklet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingBooklet, setEditingBooklet] = useState<Booklet | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    preview_text: "",
    content_text: "",
    photo_path: "",
  });

  const fetchBooklets = async () => {
    try {
      const { data, error } = await supabase
        .from("booklets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBooklets(data as Booklet[] || []);
    } catch (error) {
      console.error("Error fetching booklets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooklets();
  }, []);

  const resetForm = () => {
    setForm({ title: "", preview_text: "", content_text: "", photo_path: "" });
    setEditingBooklet(null);
  };

  const handleAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (booklet: Booklet) => {
    setEditingBooklet(booklet);
    setForm({
      title: booklet.title,
      preview_text: booklet.preview_text || "",
      content_text: booklet.content_text || "",
      photo_path: booklet.photo_path || "",
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("booklets").delete().eq("id", deletingId);
      if (error) throw error;
      toast.success("Booklet deleted successfully");
      fetchBooklets();
    } catch (error) {
      console.error("Error deleting booklet:", error);
      toast.error("Failed to delete booklet");
    } finally {
      setIsSubmitting(false);
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.title) {
      toast.error("Please provide a title");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        title: form.title.trim(),
        preview_text: form.preview_text.trim() || null,
        content_text: form.content_text.trim() || null,
        photo_path: form.photo_path.trim() || null,
      };

      if (editingBooklet) {
        const { error } = await supabase.from("booklets").update(data).eq("id", editingBooklet.id);
        if (error) throw error;
        toast.success("Booklet updated successfully");
      } else {
        const { error } = await supabase.from("booklets").insert(data);
        if (error) throw error;
        toast.success("Booklet added successfully");
      }

      setModalOpen(false);
      resetForm();
      fetchBooklets();
    } catch (error) {
      console.error("Error saving booklet:", error);
      toast.error("Failed to save booklet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Title",
      accessorKey: "title" as keyof Booklet,
    },
    {
      header: "Preview",
      accessorKey: (row: Booklet) => (
        <span className="line-clamp-1">{row.preview_text || "N/A"}</span>
      ),
    },
    {
      header: "Created",
      accessorKey: (row: Booklet) => format(new Date(row.created_at), "MMM d, yyyy"),
    },
    {
      header: "Actions",
      accessorKey: (row: Booklet) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Booklet Management</h1>
          <p className="text-muted-foreground mt-1">Manage resource guides and articles.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Booklet
        </Button>
      </div>

      {booklets.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Booklets</h3>
          <p className="text-muted-foreground mb-4">Add your first booklet to get started.</p>
          <Button onClick={handleAdd}>Add Booklet</Button>
        </div>
      ) : (
        <DataTable columns={columns} data={booklets} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingBooklet ? "Edit Booklet" : "Add Booklet"}
        size="xl"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Getting Started with Modern Farming"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preview">Preview Text</Label>
            <Textarea
              id="preview"
              value={form.preview_text}
              onChange={(e) => setForm({ ...form, preview_text: e.target.value })}
              placeholder="A brief summary of the content..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={form.content_text}
              onChange={(e) => setForm({ ...form, content_text: e.target.value })}
              placeholder="Full article content..."
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              value={form.photo_path}
              onChange={(e) => setForm({ ...form, photo_path: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingBooklet ? "Save Changes" : "Add Booklet"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Booklet"
        description="Are you sure you want to delete this booklet? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isSubmitting}
      />
    </div>
  );
}
