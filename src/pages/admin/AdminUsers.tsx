import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserCheck, Edit, Users } from "lucide-react";
import { format } from "date-fns";

interface UserWithRole extends User {
  user_roles: UserRole[];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", farm_name: "" });

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map((profile) => ({
        ...profile,
        user_roles: (roles || []).filter((r) => r.user_id === profile.id),
      }));

      setUsers(usersWithRoles as UserWithRole[]);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", userId);

      if (error) throw error;
      toast.success("User approved successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const handleEdit = (user: UserWithRole) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      farm_name: user.farm_name || "",
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: editForm.name,
          farm_name: editForm.farm_name,
        })
        .eq("id", editingUser.id);

      if (error) throw error;
      toast.success("User updated successfully");
      setEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof UserWithRole,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof UserWithRole,
    },
    {
      header: "Farm Name",
      accessorKey: (row: UserWithRole) => row.farm_name || "N/A",
    },
    {
      header: "Role",
      accessorKey: (row: UserWithRole) => (
        <span className="capitalize">
          {row.user_roles?.[0]?.role || "farmer"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: (row: UserWithRole) => (
        <StatusBadge
          status={row.is_approved ? "Approved" : "Pending"}
          variant={row.is_approved ? "success" : "warning"}
        />
      ),
    },
    {
      header: "Created",
      accessorKey: (row: UserWithRole) => format(new Date(row.created_at), "MMM d, yyyy"),
    },
    {
      header: "Actions",
      accessorKey: (row: UserWithRole) => (
        <div className="flex items-center gap-2">
          {!row.is_approved && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row.id);
              }}
              className="gap-1"
            >
              <UserCheck className="h-3 w-3" />
              Approve
            </Button>
          )}
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
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage farmer accounts and approvals.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Users</h3>
          <p className="text-muted-foreground">
            No users have registered yet.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit User"
        description="Update user information"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              value={editForm.email}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-farm">Farm Name</Label>
            <Input
              id="edit-farm"
              value={editForm.farm_name}
              onChange={(e) => setEditForm({ ...editForm, farm_name: e.target.value })}
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
