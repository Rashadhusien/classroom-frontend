import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Building, Users, Loader2, BookOpen } from "lucide-react";
import { useList } from "@refinedev/core";

const DepartmentHeilight = () => {
  const { query: departmentQuery } = useList({
    resource: "departments",
    meta: {
      include: {
        subjects: true,
        _count: {
          select: {
            subjects: true,
          },
        },
      },
    },
  });

  const departments = departmentQuery.data?.data || [];

  // Generate color based on department id for consistency
  const getDepartmentColor = (id: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-yellow-500",
      "bg-cyan-500",
    ];
    return colors[id % colors.length];
  };

  if (departmentQuery.isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading departments...</p>
        </div>
      </section>
    );
  }

  if (departmentQuery.error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-destructive">
            Error loading departments. Please try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Explore Our Departments
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Discover diverse academic departments offering comprehensive
            programs taught by expert faculty members.
          </p>
        </div>

        {/* Horizontally Scrollable Department Cards */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {departments.map((dept) => (
            <Card
              key={dept.id}
              className="shrink-0 w-80 group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`mx-auto w-16 h-16 ${getDepartmentColor(
                    Number(dept.id),
                  )} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Building className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {dept.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  {dept.code}
                </p>
              </CardHeader>

              <CardContent className="text-center pt-0 flex-1  flex flex-col justify-between">
                {" "}
                <CardDescription className="text-muted-foreground mb-6">
                  {dept.description ||
                    "Explore courses and subjects in this department."}
                </CardDescription>
                <div>
                  {/* Department Stats */}
                  <div className="grid grid-cols-2 gap-4 ">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <BookOpen className="w-4 h-4 fill-current" />
                        <span className="text-2xl font-bold text-primary">
                          {dept._count?.subjects || dept.totalSubjects || 0}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Subjects
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 fill-current" />
                        <span className="text-2xl font-bold text-primary">
                          {dept.totalSubjects || 0}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active Classes
                      </div>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-6">
                    <Link
                      to={`/departments/${dept.id}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Explore {dept.code}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Departments Button */}
        <div className="text-center mt-8">
          <Button asChild size="lg" className="px-8">
            <Link to="/departments" className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              View All Departments
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DepartmentHeilight;
