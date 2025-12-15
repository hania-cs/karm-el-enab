import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Grape, Tractor, LandPlot, ArrowRight, Users, CheckCircle2, Star, Leaf } from "lucide-react";
import heroImage from "/image.png";

export default function HomePage() {

  const features = [
    {
      icon: Tractor,
      title: "Equipment Rental",
      description: "Access a wide range of modern farming equipment at competitive daily rates. From tractors to harvesters, we've got you covered.",
      highlights: ["100+ Equipment Types", "Daily & Weekly Rates", "Delivery Available"],
    },
    {
      icon: LandPlot,
      title: "Plot Management",
      description: "Track your plots, monitor income, and optimize your farm operations with our intuitive dashboard and analytics.",
      highlights: ["Real-time Tracking", "Income Reports", "Crop Planning"],
    },
    {
      icon: Users,
      title: "Farmer Network",
      description: "Join a community of over 10,000 farmers sharing resources, knowledge, and best practices across the region.",
      highlights: ["Expert Advice", "Resource Sharing", "Local Events"],
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Farmers" },
    { value: "500+", label: "Equipment Available" },
    { value: "50,000", label: "Acres Managed" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const testimonials = [
    {
      quote: "FarmRent has transformed how we manage our 200-acre vineyard. The equipment rental system alone has saved us thousands.",
      author: "Maria Santos",
      role: "Vineyard Owner",
      rating: 5,
    },
    {
      quote: "Finally, a platform that understands the needs of modern farmers. The plot management tools are exceptional.",
      author: "João Silva",
      role: "Crop Farmer",
      rating: 5,
    },
    {
      quote: "The community aspect is what sets FarmRent apart. I've learned so much from fellow farmers here.",
      author: "Ana Ferreira",
      role: "Organic Farmer",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beautiful farmland at golden hour with modern equipment"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-sm font-semibold shadow-lg animate-fade-in">
                <Grape className="h-4 w-4" />
                <span>Farm Equipment & Management Platform</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight text-background leading-[1.1] animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Grow Your Farm with{" "}
                <span className="text-primary">Modern Equipment</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-background/90 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Rent high-quality farming equipment, manage your plots, and track your farm's 
                performance all in one place. Built by farmers, for farmers.
              </p>
              
      

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Button
                  size="xl"
                  asChild
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Link to="/register" className="gap-2">
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  asChild
                  className="border border-white text-white hover:bg-white hover:text-primary"
                >
                  <Link to="/login">Sign In to Dashboard</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2 text-background/80">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-background/80">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2 text-background/80">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              {stats.map((stat, index) => (
                <div key={stat.label} className="stat-card" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <p className="text-3xl xl:text-4xl font-heading font-bold text-background">{stat.value}</p>
                  <p className="text-background/70 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden py-12 bg-primary">
        <div className="container grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <p className="text-2xl font-heading font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Leaf className="h-4 w-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-6">
              Everything You Need to <span className="text-primary">Manage Your Farm</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive tools for modern farming operations.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-medium">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-2xl font-heading font-bold">{feature.title}</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold">Trusted by Farmers</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.author} className="border-0 shadow-soft">
                <CardContent className="pt-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="italic">"{t.quote}"</p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">{t.author}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container space-y-6">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold">Ready to Modernize Your Farm?</h2>
          <p className="text-xl opacity-90">Start your free trial today.</p>
          <div className="flex justify-center gap-4">
            <Button size="xl" variant="secondary" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button size="xl" variant="hero-outline" asChild>
              <Link to="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
