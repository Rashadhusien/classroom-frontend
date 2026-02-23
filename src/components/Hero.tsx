import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { BookOpen, Key } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-background py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Discover Your Next
          <span className="text-primary block">Learning Adventure</span>
        </h1>

        {/* Subtext */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Join thousands of students in expert-led classes. From coding to
          creative arts, find the perfect course to advance your skills and
          achieve your goals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link to="/dashboard/classes" className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Browse Classes
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link
              to="/dashboard/enrollments/join"
              className="flex items-center gap-2"
            >
              <Key className="w-5 h-5" />
              Join with Code
            </Link>
          </Button>
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Expert Instructors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Courses Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
