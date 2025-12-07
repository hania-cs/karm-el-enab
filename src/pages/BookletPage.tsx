import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Booklet } from "@/types";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function BookletPage() {
  const { id } = useParams<{ id: string }>();
  const [booklet, setBooklet] = useState<Booklet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooklet = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("booklets")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        setBooklet(data as Booklet | null);
      } catch (error) {
        console.error("Error fetching booklet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooklet();
  }, [id]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!booklet) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Booklet Not Found</h1>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <article className="space-y-8">
        {booklet.photo_path && (
          <div className="rounded-xl overflow-hidden">
            <img
              src={booklet.photo_path}
              alt={booklet.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">
            {booklet.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(booklet.created_at), "MMMM d, yyyy")}</span>
          </div>
        </header>

        {booklet.content_text && (
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap">{booklet.content_text}</p>
          </div>
        )}
      </article>
    </div>
  );
}
