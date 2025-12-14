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
      <section className="relative overflow-hidden gradient-hero py-24 lg:py-40">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold shadow-sm border border-primary/20 animate-fade-in">
              <Grape className="h-4 w-4" />
              <span>Farm Equipment & Management Platform</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-balance animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Grow Your Farm with{" "}
              <span className="text-primary relative">
                Modern Equipment
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 8 Q50 0 100 8" stroke="currentColor" strokeWidth="3" fill="none"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Rent high-quality farming equipment, manage your plots, and track your farm's 
              performance all in one place. Built for modern farmers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button size="xl" asChild>
                <Link to="/register" className="gap-2">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/login">Sign In to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Everything You Need to Manage Your Farm
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive tools for modern farming operations.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="card-hover border-0 bg-background shadow-lg group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
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
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-grape-red-dark text-primary-foreground relative overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold">
              Ready to Modernize Your Farm?
            </h2>
            <p className="text-xl opacity-90 max-w-xl mx-auto">
              Join thousands of farmers who are using FarmRent to streamline their operations and increase productivity.
            </p>
            <Button
              size="xl"
              variant="secondary"
              asChild
              className="bg-background text-primary hover:bg-background/90 shadow-xl"
            >
              <Link to="/register" className="gap-2">
                Create Free Account <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-background/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-background/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </section>
    </div>
  );
}
