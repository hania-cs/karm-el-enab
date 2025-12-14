import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Equipment } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CreditCardForm } from "./CreditCardForm";

const rentalSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

interface RentalFormProps {
  equipment: Equipment | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RentalForm({
  equipment,
  open,
  onClose,
  onSuccess,
}: RentalFormProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(rentalSchema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch("quantity");
  const days =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const totalCost = equipment
    ? days * equipment.daily_rate * (quantity || 1)
    : 0;

  const onSubmit = async (data: { quantity: number }) => {
    if (!equipment || !user || !startDate || !endDate) return;

    if (data.quantity > equipment.quantity_available) {
      toast.error(`Only ${equipment.quantity_available} units available`);
      return;
    }

    if (!isCardValid) {
      toast.error("Please fill in all payment information correctly");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const { error } = await supabase.from("rentals").insert({
        user_id: user.id,
        equipment_id: equipment.id,
        quantity: data.quantity,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        total_cost: totalCost,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Rental Request Submitted – Pending Admin Approval");

      reset();
      setStartDate(undefined);
      setEndDate(undefined);
      setIsCardValid(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit rental request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setStartDate(undefined);
    setEndDate(undefined);
    setIsCardValid(false);
    onClose();
  };

  if (!equipment) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Rent Equipment"
      description={`Request to rent ${equipment.name}`}
      size="lg"
    >
      {/* SCROLL CONTAINER */}
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Equipment Info */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold">{equipment.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {equipment.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ${equipment.daily_rate}
                </p>
                <p className="text-xs text-muted-foreground">per day</p>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={equipment.quantity_available}
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">
                {errors.quantity.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {equipment.quantity_available} units available
            </p>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Summary */}
          {days > 0 && (
            <div className="p-5 rounded-xl border">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-primary">
                ${totalCost.toFixed(2)}
              </p>
            </div>
          )}

          {/* Payment */}
          <CreditCardForm onValidChange={setIsCardValid} />

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !startDate || !endDate || !isCardValid
              }
              className="flex-[2]"
            >
              {isSubmitting ? "Processing..." : "Submit Rental Request"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
