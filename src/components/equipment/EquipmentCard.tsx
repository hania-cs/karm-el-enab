import { Equipment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tractor, DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentCardProps {
  equipment: Equipment;
  onRent?: (equipment: Equipment) => void;
  showRentButton?: boolean;
  className?: string;
}

export function EquipmentCard({
  equipment,
  onRent,
  showRentButton = true,
  className,
}: EquipmentCardProps) {
  const isAvailable = equipment.quantity_available > 0;

  return (
    <Card className={cn("card-hover overflow-hidden", className)}>
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          {equipment.image_url ? (
            <img
              src={equipment.image_url}
              alt={equipment.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Tractor className="h-16 w-16 text-primary/40" />
          )}
          <div
            className={cn(
              "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold",
              isAvailable
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isAvailable ? "Available" : "Out of Stock"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        <h3 className="font-heading text-lg font-semibold line-clamp-1">
          {equipment.name}
        </h3>
        {equipment.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {equipment.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>{equipment.daily_rate}</span>
            <span className="text-xs text-muted-foreground font-normal">/day</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Package className="h-4 w-4" />
            <span>{equipment.quantity_available} available</span>
          </div>
        </div>
      </CardContent>
      {showRentButton && (
        <CardFooter className="p-5 pt-0">
          <Button
            onClick={() => onRent?.(equipment)}
            disabled={!isAvailable}
            className="w-full"
          >
            {isAvailable ? "Rent Now" : "Not Available"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
