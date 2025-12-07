import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Booklet } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loading-spinner";
import { Grape, Tractor, LandPlot, BookOpen, ArrowRight, Users } from "lucide-react";

export default function HomePage() {
  const [booklets, setBooklets] = useState<Booklet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooklets = async () => {
      try {
        const { data, error } = await supabase
          .from("booklets")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        setBooklets(data as Booklet[] || []);
      } catch (error) {
        console.error("Error fetching booklets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooklets();
  }, []);

  const features = [
    {
      icon: Tractor,
      title: "Equipment Rental",
      description: "Access a wide range of modern farming equipment at competitive daily rates.",
    },
    {
      icon: LandPlot,
      title: "Plot Management",
      description: "Track your plots, monitor income, and optimize your farm operations.",
    },
    {
      icon: Users,
      title: "Farmer Network",
      description: "Join a community of farmers sharing resources and knowledge.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Grape className="h-4 w-4" />
              <span>Farm Equipment & Management Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-balance">
              Grow Your Farm with{" "}
              <span className="text-primary">Modern Equipment</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rent high-quality farming equipment, manage your plots, and track your farm's 
              performance all in one place. Built for modern farmers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Everything You Need to Manage Your Farm
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive tools for modern farming operations.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover border-0 bg-background">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booklets Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Resource Library
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access guides, tips, and resources to help you succeed in farming.
            </p>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : booklets.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No booklets available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {booklets.map((booklet) => (
                <Card key={booklet.id} className="card-hover overflow-hidden">
                  <CardHeader className="p-0">
                    {booklet.photo_path ? (
                      <img
                        src={booklet.photo_path}
                        alt={booklet.title}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-5">
                    <h3 className="font-heading text-lg font-semibold mb-2 line-clamp-1">
                      {booklet.title}
                    </h3>
                    {booklet.preview_text && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {booklet.preview_text}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to={`/booklet/${booklet.id}`}>
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-heading font-bold">
              Ready to Modernize Your Farm?
            </h2>
            <p className="opacity-90">
              Join thousands of farmers who are using FarmRent to streamline their operations.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-background text-primary hover:bg-background/90"
            >
              <Link to="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
