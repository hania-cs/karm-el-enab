import { Equipment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tractor, DollarSign, Package, Sparkles } from "lucide-react";
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
    <Card className={cn("card-hover overflow-hidden group", className)}>
      <CardHeader className="p-0">
        <div className="relative h-52 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-500" />
          
          {equipment.image_url ? (
            <img
              src={equipment.image_url}
              alt={equipment.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
              <Tractor className="h-20 w-20 text-primary/50 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}
          
          {/* Status badge */}
          <div
            className={cn(
              "absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1.5",
              isAvailable
                ? "bg-success/90 text-success-foreground"
                : "bg-destructive/90 text-destructive-foreground"
            )}
          >
            {isAvailable && <Sparkles className="h-3 w-3" />}
            {isAvailable ? "Available" : "Out of Stock"}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <h3 className="font-heading text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {equipment.name}
        </h3>
        {equipment.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>
        )}
        
        {/* Price and availability section */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{equipment.daily_rate}</span>
              <span className="text-xs text-muted-foreground font-medium">/day</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{equipment.quantity_available} left</span>
          </div>
        </div>
      </CardContent>
      
      {showRentButton && (
        <CardFooter className="p-6 pt-0">
          <Button
            onClick={() => onRent?.(equipment)}
            disabled={!isAvailable}
            className="w-full"
            size="lg"
            variant={isAvailable ? "default" : "secondary"}
          >
            {isAvailable ? "Rent This Equipment" : "Not Available"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
