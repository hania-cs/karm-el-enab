import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plot, User } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Trash2, LandPlot } from "lucide-react";

interface PlotWithUser extends Plot {
  profiles: User;
}

export default function AdminPlots() {
  const [plots, setPlots] = useState<PlotWithUser[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<PlotWithUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    plot_name: "",
    user_id: "",
    area: "",
    income_last_year: "",
    income_status: "Fair" as "Good" | "Fair" | "Poor",
  });

  const fetchData = async () => {
    try {
      const [plotsRes, usersRes] = await Promise.all([
        supabase.from("plots").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*"),
      ]);

      if (plotsRes.error) throw plotsRes.error;
      if (usersRes.error) throw usersRes.error;

      const allUsers = usersRes.data as User[] || [];
      const plotsWithUsers = (plotsRes.data || []).map((plot) => ({
        ...plot,
        profiles: allUsers.find((u) => u.id === plot.user_id) || null,
      }));

      setPlots(plotsWithUsers as PlotWithUser[]);
      setUsers(allUsers.filter((u) => u.is_approved));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      plot_name: "",
      user_id: "",
      area: "",
      income_last_year: "",
      income_status: "Fair",
    });
    setEditingPlot(null);
  };

  const handleAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (plot: PlotWithUser) => {
    setEditingPlot(plot);
    setForm({
      plot_name: plot.plot_name,
      user_id: plot.user_id,
      area: plot.area.toString(),
      income_last_year: plot.income_last_year.toString(),
      income_status: plot.income_status,
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
      const { error } = await supabase.from("plots").delete().eq("id", deletingId);
      if (error) throw error;
      toast.success("Plot deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting plot:", error);
      toast.error("Failed to delete plot");
    } finally {
      setIsSubmitting(false);
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.plot_name || !form.user_id || !form.area) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        plot_name: form.plot_name.trim(),
        user_id: form.user_id,
        area: parseFloat(form.area),
        income_last_year: parseFloat(form.income_last_year) || 0,
        income_status: form.income_status,
      };

      if (editingPlot) {
        const { error } = await supabase.from("plots").update(data).eq("id", editingPlot.id);
        if (error) throw error;
        toast.success("Plot updated successfully");
      } else {
        const { error } = await supabase.from("plots").insert(data);
        if (error) throw error;
        toast.success("Plot added successfully");
      }

      setModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving plot:", error);
      toast.error("Failed to save plot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Plot Name",
      accessorKey: "plot_name" as keyof PlotWithUser,
    },
    {
      header: "Farmer",
      accessorKey: (row: PlotWithUser) => row.profiles?.name || "N/A",
    },
    {
      header: "Area (acres)",
      accessorKey: (row: PlotWithUser) => row.area.toFixed(2),
    },
    {
      header: "Last Year Income",
      accessorKey: (row: PlotWithUser) => `$${row.income_last_year.toLocaleString()}`,
    },
    {
      header: "Status",
      accessorKey: (row: PlotWithUser) => <StatusBadge status={row.income_status} />,
    },
    {
      header: "Actions",
      accessorKey: (row: PlotWithUser) => (
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
          <h1 className="text-3xl font-heading font-bold">Plot Management</h1>
          <p className="text-muted-foreground mt-1">Manage farm plots and assignments.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Plot
        </Button>
      </div>

      {plots.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <LandPlot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Plots</h3>
          <p className="text-muted-foreground mb-4">Add your first plot to get started.</p>
          <Button onClick={handleAdd}>Add Plot</Button>
        </div>
      ) : (
        <DataTable columns={columns} data={plots} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingPlot ? "Edit Plot" : "Add Plot"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plot_name">Plot Name *</Label>
            <Input
              id="plot_name"
              value={form.plot_name}
              onChange={(e) => setForm({ ...form, plot_name: e.target.value })}
              placeholder="North Field A"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_id">Assign to Farmer *</Label>
            <Select value={form.user_id} onValueChange={(value) => setForm({ ...form, user_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a farmer" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} {user.farm_name ? `(${user.farm_name})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">Area (acres) *</Label>
              <Input
                id="area"
                type="number"
                min="0"
                step="0.01"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="10.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income">Last Year Income ($)</Label>
              <Input
                id="income"
                type="number"
                min="0"
                value={form.income_last_year}
                onChange={(e) => setForm({ ...form, income_last_year: e.target.value })}
                placeholder="25000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Income Status</Label>
            <Select value={form.income_status} onValueChange={(value) => setForm({ ...form, income_status: value as "Good" | "Fair" | "Poor" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingPlot ? "Save Changes" : "Add Plot"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Plot"
        description="Are you sure you want to delete this plot? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isSubmitting}
      />
    </div>
  );
}
