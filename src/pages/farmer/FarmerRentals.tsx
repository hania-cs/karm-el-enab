import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Rental, Equipment } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageLoader } from "@/components/ui/loading-spinner";
import { ClipboardList } from "lucide-react";
import { format } from "date-fns";

interface RentalWithEquipment extends Rental {
  equipment: Equipment;
}

export default function FarmerRentals() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<RentalWithEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("rentals")
          .select("*, equipment(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRentals(data as RentalWithEquipment[] || []);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();
  }, [user]);

  const columns = [
    {
      header: "Equipment",
      accessorKey: (row: RentalWithEquipment) => row.equipment?.name || "N/A",
    },
    {
      header: "Quantity",
      accessorKey: "quantity" as keyof RentalWithEquipment,
    },
    {
      header: "Start Date",
      accessorKey: (row: RentalWithEquipment) => format(new Date(row.start_date), "MMM d, yyyy"),
    },
    {
      header: "End Date",
      accessorKey: (row: RentalWithEquipment) => format(new Date(row.end_date), "MMM d, yyyy"),
    },
    {
      header: "Total Cost",
      accessorKey: (row: RentalWithEquipment) => row.total_cost ? `$${row.total_cost.toFixed(2)}` : "N/A",
    },
    {
      header: "Status",
      accessorKey: (row: RentalWithEquipment) => <StatusBadge status={row.status} />,
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">My Rentals</h1>
        <p className="text-muted-foreground mt-1">
          Track your equipment rental history and status.
        </p>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Rentals Yet</h3>
          <p className="text-muted-foreground">
            Visit the equipment page to rent your first piece of equipment.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={rentals} />
      )}
    </div>
  );
}
