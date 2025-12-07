import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/ui/stat-card";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Users, Tractor, ClipboardList, LandPlot, UserCheck, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingUsers: 0,
    totalUsers: 0,
    equipmentCount: 0,
    pendingRentals: 0,
    totalPlots: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, equipmentRes, rentalsRes, plotsRes] = await Promise.all([
          supabase.from("profiles").select("id, is_approved", { count: "exact" }),
          supabase.from("equipment").select("id", { count: "exact" }),
          supabase.from("rentals").select("id, status", { count: "exact" }),
          supabase.from("plots").select("id", { count: "exact" }),
        ]);

        const pendingUsers = usersRes.data?.filter((u) => !u.is_approved).length || 0;
        const pendingRentals = rentalsRes.data?.filter((r) => r.status === "pending").length || 0;

        setStats({
          pendingUsers,
          totalUsers: usersRes.count || 0,
          equipmentCount: equipmentRes.count || 0,
          pendingRentals,
          totalPlots: plotsRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your farm management system.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Pending Approvals"
          value={stats.pendingUsers}
          icon={Clock}
          variant="accent"
          description="Users awaiting approval"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          variant="default"
          description="Registered farmers & admins"
        />
        <StatCard
          title="Equipment"
          value={stats.equipmentCount}
          icon={Tractor}
          variant="primary"
          description="Available for rental"
        />
        <StatCard
          title="Pending Rentals"
          value={stats.pendingRentals}
          icon={ClipboardList}
          variant="accent"
          description="Awaiting your approval"
        />
        <StatCard
          title="Total Plots"
          value={stats.totalPlots}
          icon={LandPlot}
          variant="success"
          description="Registered farm plots"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-xl border bg-card">
          <h3 className="font-heading font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Review User Approvals</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingUsers} users pending
                </p>
              </div>
            </a>
            <a
              href="/admin/rentals"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Review Rental Requests</p>
                <p className="text-sm text-muted-foreground">
                  {stats.pendingRentals} rentals pending
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-card">
          <h3 className="font-heading font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database Status</span>
              <span className="flex items-center gap-2 text-success text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-success" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Equipment</span>
              <span className="font-medium">{stats.equipmentCount} items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Approval Rate</span>
              <span className="font-medium">
                {stats.totalUsers > 0
                  ? Math.round(((stats.totalUsers - stats.pendingUsers) / stats.totalUsers) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
