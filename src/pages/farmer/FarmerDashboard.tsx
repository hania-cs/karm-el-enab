import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/ui/stat-card";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { LandPlot, ClipboardList, Tractor, ArrowRight } from "lucide-react";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    plots: 0,
    rentals: 0,
    pendingRentals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const [plotsRes, rentalsRes] = await Promise.all([
          supabase.from("plots").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("rentals").select("id, status", { count: "exact" }).eq("user_id", user.id),
        ]);

        const pendingRentals = rentalsRes.data?.filter((r) => r.status === "pending").length || 0;

        setStats({
          plots: plotsRes.count || 0,
          rentals: rentalsRes.count || 0,
          pendingRentals,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your farm operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Plots"
          value={stats.plots}
          icon={LandPlot}
          variant="primary"
          description="Your registered farm plots"
        />
        <StatCard
          title="Total Rentals"
          value={stats.rentals}
          icon={ClipboardList}
          variant="default"
          description="All time equipment rentals"
        />
        <StatCard
          title="Pending Rentals"
          value={stats.pendingRentals}
          icon={Tractor}
          variant="accent"
          description="Awaiting approval"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-xl border bg-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Tractor className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold">Rent Equipment</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Browse our catalog of farming equipment available for rental.
          </p>
          <Button asChild>
            <Link to="/farmer/equipment" className="gap-2">
              View Equipment <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="p-6 rounded-xl border bg-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <LandPlot className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-heading font-semibold">My Plots</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            View and manage your registered farm plots and income data.
          </p>
          <Button variant="outline" asChild>
            <Link to="/farmer/plots" className="gap-2">
              View Plots <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
