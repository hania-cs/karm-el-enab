import { SupportChat } from "@/components/support/SupportChat";

export default function AdminSupport() {
  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Support Tickets</h1>
        <p className="text-muted-foreground mt-1">
          Manage farmer requests and communications.
        </p>
      </div>

      <SupportChat isAdmin={true} />
    </div>
  );
}
