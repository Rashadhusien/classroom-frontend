import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Register",
      description:
        "Create your account and set up your profile to get started on your learning journey.",
      icon: UserPlus,
      color: "bg-blue-500",
      link: "/register",
      linkText: "Sign Up Now",
    },
    {
      id: 2,
      title: "Join",
      description:
        "Browse departments and join classes using invite codes or explore available courses.",
      icon: Users,
      color: "bg-green-500",
      link: "/dashboard/classes",
      linkText: "Browse Classes",
    },
    {
      id: 3,
      title: "Learn",
      description:
        "Access lectures, download materials, and engage with your learning community.",
      icon: BookOpen,
      color: "bg-purple-500",
      link: "/dashboard/enrollments",
      linkText: "My Classes",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started with our classroom management system in three simple
            steps. From registration to learning, we make education accessible
            and engaging.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 z-10">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>

                {/* Step Card */}
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 pt-8">
                  <CardContent className="text-center p-6">
                    {/* Icon */}
                    <div
                      className={`mx-auto w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mb-6`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Action Button */}
                    <Button asChild className="w-full group">
                      <Link
                        to={step.link}
                        className="flex items-center justify-center gap-2"
                      >
                        {step.linkText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-md bg-background">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Start Learning?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of students already learning with our platform.
                Get access to quality education and expert instructors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="px-8">
                  <Link to="/register" className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Get Started Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8">
                  <Link
                    to="/dashboard/classes"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    Explore Classes
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
