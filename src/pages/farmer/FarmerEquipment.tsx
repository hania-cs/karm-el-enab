import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Equipment } from "@/types";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { RentalForm } from "@/components/equipment/RentalForm";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Search, Tractor } from "lucide-react";

export default function FarmerEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [rentalFormOpen, setRentalFormOpen] = useState(false);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .order("name");

      if (error) throw error;
      setEquipment(data as Equipment[] || []);
      setFilteredEquipment(data as Equipment[] || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    const filtered = equipment.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEquipment(filtered);
  }, [searchQuery, equipment]);

  const handleRent = (item: Equipment) => {
    setSelectedEquipment(item);
    setRentalFormOpen(true);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Equipment</h1>
          <p className="text-muted-foreground mt-1">
            Browse and rent farming equipment for your needs.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredEquipment.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <Tractor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-semibold mb-2">No Equipment Found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try a different search term." : "No equipment available at this time."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onRent={handleRent}
            />
          ))}
        </div>
      )}

      <RentalForm
        equipment={selectedEquipment}
        open={rentalFormOpen}
        onClose={() => setRentalFormOpen(false)}
        onSuccess={fetchEquipment}
      />
    </div>
  );
}
