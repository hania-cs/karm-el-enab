import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Rental, Equipment, User } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, CheckCircle, ClipboardList } from "lucide-react";
import { format } from "date-fns";

interface RentalWithDetails extends Rental {
  equipment: Equipment;
  profiles: User;
}

export default function AdminRentals() {
  const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      const { data: rentalsData, error: rentalsError } = await supabase
        .from("rentals")
        .select("*, equipment(*)")
        .order("created_at", { ascending: false });

      if (rentalsError) throw rentalsError;

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const rentalsWithDetails = (rentalsData || []).map((rental) => ({
        ...rental,
        profiles: (profiles || []).find((p) => p.id === rental.user_id) || null,
      }));

      setRentals(rentalsWithDetails as RentalWithDetails[]);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected" | "completed") => {
    try {
      const { error } = await supabase
        .from("rentals")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Rental ${status} successfully`);
      fetchRentals();
    } catch (error) {
      console.error("Error updating rental:", error);
      toast.error("Failed to update rental");
    }
  };

  const columns = [
    {
      header: "Farmer",
      accessorKey: (row: RentalWithDetails) => row.profiles?.name || "N/A",
    },
    {
      header: "Equipment",
      accessorKey: (row: RentalWithDetails) => row.equipment?.name || "N/A",
    },
    {
      header: "Qty",
      accessorKey: "quantity" as keyof RentalWithDetails,
    },
    {
      header: "Dates",
      accessorKey: (row: RentalWithDetails) => (
        <span className="text-sm">
          {format(new Date(row.start_date), "MMM d")} - {format(new Date(row.end_date), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      header: "Cost",
      accessorKey: (row: RentalWithDetails) => row.total_cost ? `$${row.total_cost.toFixed(2)}` : "N/A",
    },
    {
      header: "Status",
      accessorKey: (row: RentalWithDetails) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessorKey: (row: RentalWithDetails) => (
        <div className="flex items-center gap-1">
          {row.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(row.id, "approved");
                }}
                className="gap-1 h-7 px-2"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(row.id, "rejected");
                }}
                className="gap-1 h-7 px-2 text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}
          {row.status === "approved" && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(row.id, "completed");
              }}
              className="gap-1 h-7 px-2"
            >
              <CheckCircle className="h-3 w-3" />
              Complete
            </Button>
          )}
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
        <h1 className="text-3xl font-heading font-bold">Rental Management</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage equipment rental requests.
        </p>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Rentals</h3>
          <p className="text-muted-foreground">
            No rental requests have been submitted yet.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={rentals} />
      )}
    </div>
  );
}
