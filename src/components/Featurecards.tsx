import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Featurecards = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Join Instantly Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Join Instantly
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 ">
              <CardDescription className="text-muted-foreground mb-6">
                Use an invite code to instantly join any class. Quick access to
                learning materials and community.
              </CardDescription>
              <Button asChild className="w-full" variant="outline">
                <Link
                  to="/dashboard/enrollments/join"
                  className="flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Join with Code
                </Link>
              </Button>
            </CardContent>
          </Card>
          {/* Browse Classes Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Browse Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <CardDescription className="text-muted-foreground mb-6">
                Explore our comprehensive catalog of courses across various
                subjects. Find the perfect class.
              </CardDescription>
              <Button asChild className="w-full">
                <Link
                  to="/dashboard/classes"
                  className="flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse All Classes
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Watch Lectures Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Watch Lectures
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <CardDescription className="text-muted-foreground mb-6">
                Access recorded lectures and video content anytime, anywhere.
                Learn at your own place
              </CardDescription>
              <Button asChild className="w-full" variant="outline">
                <Link
                  to="/dashboard/lectures"
                  className="flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Watch Now
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Download Materials Card */}
          {/* <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Download Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <CardDescription className="text-muted-foreground mb-6">
                Get course materials, notes, and resources for offline study.
                Download PDFs, presentations, and supplementary content.
              </CardDescription>
              <Button asChild className="w-full" variant="outline">
                <Link
                  to="/dashboard/materials"
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Get Materials
                </Link>
              </Button>
            </CardContent>
          </Card> */}
        </div>

        {/* Additional Stats Section */}
        {/* <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <div className="text-muted-foreground">Active Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Expert Instructors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">25K+</div>
            <div className="text-muted-foreground">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Video Lectures</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Featurecards;
