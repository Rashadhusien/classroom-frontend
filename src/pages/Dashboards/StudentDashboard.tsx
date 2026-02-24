import { useMemo } from "react";
import { useLink, useList, useGetIdentity } from "@refinedev/core";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  Building2,
  Layers,
  PlayCircle,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { User, EnrollmentRow, Lecture } from "@/types";

type ClassListItem = {
  id: number;
  name: string;
  createdAt?: string;
  subject?: {
    name: string;
    department?: {
      name: string;
    };
  };
  teacher?: {
    name: string;
  };
  teacherId?: string;
  totalEnrollments?: number;
  totalLectures?: number;
};

const roleColors = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7"];

const Dashboard = () => {
  const Link = useLink();
  const { data: currentUser } = useGetIdentity<User>();

  const { query: enrollmentsQuery } = useList<EnrollmentRow>({
    resource: "enrollments",
    pagination: { mode: "off" },
  });

  const { query: lecturesQuery } = useList<Lecture>({
    resource: `lectures/student/${currentUser?.id}`,
    pagination: { mode: "off" },
  });

  const enrollments = useMemo(() => {
    const allEnrollments = enrollmentsQuery.data?.data ?? [];
    const studentEnrollments = allEnrollments.filter(
      (enrollment) => enrollment.student.id === currentUser?.id,
    );
    return studentEnrollments;
  }, [enrollmentsQuery.data?.data, currentUser?.id]);

  const enrolledClasses = useMemo(() => {
    return enrollments.map((enrollment) => enrollment.class);
  }, [enrollments]);

  const studentLectures = useMemo(() => {
    return lecturesQuery.data?.data ?? [];
  }, [lecturesQuery.data?.data]);

  // Get unique departments from student's enrolled classes
  const studentDepartments = useMemo(() => {
    const departments = new Map<string, { name: string; classCount: number }>();
    enrollments.forEach((enrollment) => {
      const deptName = enrollment.department.name || "Unassigned";
      const existing = departments.get(deptName) || {
        name: deptName,
        classCount: 0,
      };
      existing.classCount++;
      departments.set(deptName, existing);
    });
    return Array.from(departments.values());
  }, [enrollments]);

  // Get unique subjects from student's enrolled classes
  const studentSubjects = useMemo(() => {
    const subjects = new Map<
      string,
      { name: string; classCount: number; lectureCount: number }
    >();
    enrollments.forEach((enrollment) => {
      const subjectName = enrollment.subject.name || "Unassigned";
      const existing = subjects.get(subjectName) || {
        name: subjectName,
        classCount: 0,
        lectureCount: 0,
      };
      existing.classCount++;
      subjects.set(subjectName, existing);
    });

    studentLectures.forEach((lecture) => {
      const enrollment = enrollments.find((e) => e.classId === lecture.classId);
      if (enrollment) {
        const subjectName = enrollment.subject.name || "Unassigned";
        const existing = subjects.get(subjectName) || {
          name: subjectName,
          classCount: 0,
          lectureCount: 0,
        };
        existing.lectureCount++;
        subjects.set(subjectName, existing);
      }
    });

    return Array.from(subjects.values());
  }, [enrollments, studentLectures]);

  const newestClasses = useMemo(() => {
    return [...enrolledClasses]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [enrolledClasses]);

  const newestLectures = useMemo(() => {
    return [...studentLectures]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [studentLectures]);

  const publishedLectures = studentLectures.filter((l) => l.isPublished).length;
  const totalTeachers = new Set(enrollments.map((e) => e.teacher.id)).size;

  const kpis = [
    {
      label: "Enrolled Classes",
      value: enrolledClasses.length,
      icon: Layers,
      accent: "text-blue-600",
    },
    {
      label: "My Teachers",
      value: totalTeachers,
      icon: Users,
      accent: "text-emerald-600",
    },
    {
      label: "Available Lectures",
      value: studentLectures.length,
      icon: PlayCircle,
      accent: "text-purple-600",
    },
    {
      label: "Published",
      value: publishedLectures,
      icon: TrendingUp,
      accent: "text-amber-600",
    },
    {
      label: "Departments",
      value: studentDepartments.length,
      icon: Building2,
      accent: "text-cyan-600",
    },
    {
      label: "Subjects",
      value: studentSubjects.length,
      icon: BookOpen,
      accent: "text-rose-600",
    },
  ];

  const departmentData = studentDepartments.map((dept) => ({
    departmentName: dept.name,
    totalClasses: dept.classCount,
  }));

  const subjectData = studentSubjects.map((subject) => ({
    subjectName: subject.name,
    totalClasses: subject.classCount,
    totalLectures: subject.lectureCount,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">
          Welcome <span className="text-primary">{currentUser?.name}</span> 👋
        </h1>
        <p className="text-muted-foreground">
          Overview of your enrolled classes, teachers, and learning progress.
        </p>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Your Learning Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {kpi.label}
                  </p>
                  <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                </div>
                <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Classes by Department</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="totalClasses"
                    nameKey="departmentName"
                    data={departmentData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`${entry.departmentName}-${index}`}
                        fill={roleColors[index % roleColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {departmentData.map((entry, index) => (
                <span
                  key={entry.departmentName}
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: roleColors[index % roleColors.length],
                    }}
                  />
                  {entry.departmentName} · {entry.totalClasses}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Lecture Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Published", value: publishedLectures },
                      {
                        name: "Draft",
                        value: studentLectures.length - publishedLectures,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#f97316" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Published · {publishedLectures}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Draft · {studentLectures.length - publishedLectures}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Classes per Department
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <XAxis dataKey="departmentName" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="totalClasses"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Lectures per Subject
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <XAxis dataKey="subjectName" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="totalLectures"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>My Enrolled Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enrolledClasses.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No classes enrolled yet.
              </p>
            )}
            {newestClasses.map((item: ClassListItem, index: number) => {
              const enrollment = enrollments.find((e) => e.classId === item.id);
              return (
                <Link
                  key={item.id}
                  to={`/dashboard/classes/show/${item.id}`}
                  className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment?.subject.name ?? "No subject"} ·{" "}
                        {enrollment?.teacher.name ?? "No teacher"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {item.totalLectures || 0} lectures
                  </Badge>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Lectures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentLectures.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No lectures available yet.
              </p>
            )}
            {newestLectures.map((lecture: Lecture, index: number) => {
              const enrollment = enrollments.find(
                (e) => e.classId === lecture.classId,
              );
              return (
                <Link
                  key={lecture.id}
                  to={`/dashboard/lectures/show/${lecture.id}`}
                  className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{lecture.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {enrollment?.class.name ?? "No class"} ·{" "}
                        {lecture.totalContents || 0} contents
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={lecture.isPublished ? "default" : "secondary"}
                  >
                    {lecture.isPublished ? "Published" : "Draft"}
                  </Badge>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>My Teachers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enrollments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No teachers assigned yet.
            </p>
          )}
          {Array.from(new Set(enrollments.map((e) => e.teacher.id))).map(
            (teacherId) => {
              const teacherEnrollments = enrollments.filter(
                (e) => e.teacher.id === teacherId,
              );
              const teacher = teacherEnrollments[0].teacher;
              return (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-3 hover:border-primary/40 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {teacher.image ? (
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {teacher.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {teacher.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {teacherEnrollments.map((enrollment, index) => (
                          <Badge
                            key={`${enrollment.classId}-${index}`}
                            variant="outline"
                            className="text-xs"
                          >
                            {enrollment.class.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {teacherEnrollments.length}{" "}
                      {teacherEnrollments.length === 1 ? "class" : "classes"}
                    </Badge>
                  </div>
                </div>
              );
            },
          )}
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
};

export default Dashboard;
