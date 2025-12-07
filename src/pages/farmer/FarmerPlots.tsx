import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plot } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageLoader } from "@/components/ui/loading-spinner";
import { LandPlot } from "lucide-react";

export default function FarmerPlots() {
  const { user } = useAuth();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlots = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("plots")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPlots(data as Plot[] || []);
      } catch (error) {
        console.error("Error fetching plots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlots();
  }, [user]);

  const columns = [
    {
      header: "Plot Name",
      accessorKey: "plot_name" as keyof Plot,
    },
    {
      header: "Area (acres)",
      accessorKey: (row: Plot) => row.area.toFixed(2),
    },
    {
      header: "Last Year Income",
      accessorKey: (row: Plot) => `$${row.income_last_year.toLocaleString()}`,
    },
    {
      header: "Status",
      accessorKey: (row: Plot) => <StatusBadge status={row.income_status} />,
    },
  ];

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">My Plots</h1>
        <p className="text-muted-foreground mt-1">
          View your registered farm plots and their performance.
        </p>
      </div>

      {plots.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <LandPlot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Plots Yet</h3>
          <p className="text-muted-foreground">
            Contact your administrator to add plots to your account.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={plots} />
      )}
    </div>
  );
}
