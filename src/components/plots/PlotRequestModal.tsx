import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const plotRequestSchema = z.object({
  plotName: z.string().min(1, "Plot name is required").max(100),
  area: z.coerce.number().min(0.01, "Area must be greater than 0"),
  notes: z.string().max(500).optional(),
});

type PlotRequestForm = z.infer<typeof plotRequestSchema>;

interface PlotRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PlotRequestModal({ open, onClose, onSuccess }: PlotRequestModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlotRequestForm>({
    resolver: zodResolver(plotRequestSchema),
    defaultValues: {
      plotName: "",
      area: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: PlotRequestForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("plot_requests").insert({
        user_id: user.id,
        requested_plot_name: data.plotName,
        requested_area: data.area,
        notes: data.notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your plot request has been submitted for review.",
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting plot request:", error);
      toast({
        title: "Error",
        description: "Failed to submit plot request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Request New Plot">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="plotName">Plot Name</Label>
          <Input
            id="plotName"
            placeholder="Enter plot name"
            {...register("plotName")}
          />
          {errors.plotName && (
            <p className="text-sm text-destructive">{errors.plotName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Area (acres)</Label>
          <Input
            id="area"
            type="number"
            step="0.01"
            placeholder="Enter area in acres"
            {...register("area")}
          />
          {errors.area && (
            <p className="text-sm text-destructive">{errors.area.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information..."
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-sm text-destructive">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
