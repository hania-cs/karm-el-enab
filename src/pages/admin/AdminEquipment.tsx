import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Equipment } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Tractor } from "lucide-react";

export default function AdminEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    daily_rate: "",
    quantity_available: "",
    image_url: "",
  });

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .order("name");

      if (error) throw error;
      setEquipment(data as Equipment[] || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      daily_rate: "",
      quantity_available: "",
      image_url: "",
    });
    setEditingEquipment(null);
  };

  const handleAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    setForm({
      name: item.name,
      description: item.description || "",
      daily_rate: item.daily_rate.toString(),
      quantity_available: item.quantity_available.toString(),
      image_url: item.image_url || "",
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
      const { error } = await supabase
        .from("equipment")
        .delete()
        .eq("id", deletingId);

      if (error) throw error;
      toast.success("Equipment deleted successfully");
      fetchEquipment();
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Failed to delete equipment");
    } finally {
      setIsSubmitting(false);
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.daily_rate || !form.quantity_available) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        daily_rate: parseFloat(form.daily_rate),
        quantity_available: parseInt(form.quantity_available),
        image_url: form.image_url.trim() || null,
      };

      if (editingEquipment) {
        const { error } = await supabase
          .from("equipment")
          .update(data)
          .eq("id", editingEquipment.id);

        if (error) throw error;
        toast.success("Equipment updated successfully");
      } else {
        const { error } = await supabase.from("equipment").insert(data);
        if (error) throw error;
        toast.success("Equipment added successfully");
      }

      setModalOpen(false);
      resetForm();
      fetchEquipment();
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast.error("Failed to save equipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Equipment,
    },
    {
      header: "Description",
      accessorKey: (row: Equipment) => (
        <span className="line-clamp-1">{row.description || "N/A"}</span>
      ),
    },
    {
      header: "Daily Rate",
      accessorKey: (row: Equipment) => `$${row.daily_rate}`,
    },
    {
      header: "Available",
      accessorKey: "quantity_available" as keyof Equipment,
    },
    {
      header: "Actions",
      accessorKey: (row: Equipment) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
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
          <h1 className="text-3xl font-heading font-bold">Equipment Management</h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, and manage rental equipment.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <Tractor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Equipment</h3>
          <p className="text-muted-foreground mb-4">
            Add your first piece of equipment to get started.
          </p>
          <Button onClick={handleAdd}>Add Equipment</Button>
        </div>
      ) : (
        <DataTable columns={columns} data={equipment} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingEquipment ? "Edit Equipment" : "Add Equipment"}
        description={editingEquipment ? "Update equipment details" : "Add new equipment to the rental catalog"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tractor Model X"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="High-performance tractor suitable for large fields..."
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="daily_rate">Daily Rate ($) *</Label>
              <Input
                id="daily_rate"
                type="number"
                min="0"
                step="0.01"
                value={form.daily_rate}
                onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
                placeholder="50.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Available *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity_available}
                onChange={(e) => setForm({ ...form, quantity_available: e.target.value })}
                placeholder="5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingEquipment ? "Save Changes" : "Add Equipment"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Equipment"
        description="Are you sure you want to delete this equipment? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isSubmitting}
      />
    </div>
  );
}
