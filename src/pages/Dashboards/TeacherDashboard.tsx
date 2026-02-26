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
  Users,
  PlayCircle,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { User, EnrollmentRow } from "@/types";

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

type LectureItem = {
  id: number;
  title: string;
  order: number;
  isPublished: boolean;
  classId: number;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  totalContents?: string;
  videoCount?: string;
  imageCount?: string;
  documentCount?: string;
  class?: {
    id: number;
    name: string;
    subject?: {
      name: string;
    };
  };
};

const roleColors = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7"];

const Dashboard = () => {
  const Link = useLink();
  const { data: currentUser } = useGetIdentity<User>();

  const { query: classesQuery } = useList<ClassListItem>({
    resource: "classes",
    pagination: { mode: "off" },
  });

  console.log("Current user:", currentUser);
  console.log("Classes query result:", classesQuery.data);

  const { query: enrollmentsQuery } = useList<EnrollmentRow>({
    resource: "enrollments",
    pagination: { mode: "off" },
  });

  const { query: lecturesQuery } = useList<LectureItem>({
    resource: `lectures/teacher/${currentUser?.id}`,
    pagination: { mode: "off" },
  });

  const classes = useMemo(() => {
    const allClasses = classesQuery.data?.data ?? [];
    console.log("All classes:", allClasses);
    const teacherClasses = allClasses.filter(
      (cls) => cls.teacherId === currentUser?.id,
    );
    console.log("Teacher classes:", teacherClasses);
    return teacherClasses;
  }, [classesQuery.data?.data, currentUser?.id]);
  const enrollments = useMemo(() => {
    const allEnrollments = enrollmentsQuery.data?.data ?? [];
    console.log("All enrollments:", allEnrollments);
    const teacherEnrollments = allEnrollments.filter(
      (enrollment) => enrollment.class.teacherId === currentUser?.id,
    );
    console.log("Teacher enrollments:", teacherEnrollments);
    return teacherEnrollments;
  }, [enrollmentsQuery.data?.data, currentUser?.id]);

  const lectures = useMemo(() => {
    const allLectures = lecturesQuery.data?.data ?? [];
    console.log("Teacher lectures from new endpoint:", allLectures);
    return allLectures;
  }, [lecturesQuery.data?.data]);

  // Filter lectures to only include those from teacher's classes
  const teacherLectures = useMemo(() => {
    // The new endpoint already returns only teacher's lectures, so we can use them directly
    console.log("Teacher lectures from new endpoint:", lectures);
    return lectures;
  }, [lectures]);

  // Get unique departments from teacher's classes
  const teacherDepartments = useMemo(() => {
    const departments = new Map<string, { name: string; classCount: number }>();
    classes.forEach((cls) => {
      const deptName = cls.subject?.department?.name || "Unassigned";
      const existing = departments.get(deptName) || {
        name: deptName,
        classCount: 0,
      };
      existing.classCount++;
      departments.set(deptName, existing);
    });
    return Array.from(departments.values());
  }, [classes]);

  // Get unique subjects from teacher's classes
  const teacherSubjects = useMemo(() => {
    const subjects = new Map<
      string,
      { name: string; classCount: number; lectureCount: number }
    >();
    classes.forEach((cls) => {
      const subjectName = cls.subject?.name || "Unassigned";
      const existing = subjects.get(subjectName) || {
        name: subjectName,
        classCount: 0,
        lectureCount: 0,
      };
      existing.classCount++;
      subjects.set(subjectName, existing);
    });

    teacherLectures.forEach((lecture) => {
      const subjectName = lecture.class?.subject?.name || "Unassigned";
      const existing = subjects.get(subjectName) || {
        name: subjectName,
        classCount: 0,
        lectureCount: 0,
      };
      existing.lectureCount++;
      subjects.set(subjectName, existing);
    });

    return Array.from(subjects.values());
  }, [classes, teacherLectures]);

  const topClasses = useMemo(() => {
    return [...classes]
      .sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0))
      .slice(0, 5);
  }, [classes]);

  const newestLectures = useMemo(() => {
    return [...teacherLectures]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [teacherLectures]);

  // Get unique students from enrollments
  const uniqueStudents = useMemo(() => {
    const studentMap = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        image?: string;
        enrolledClasses: Array<{
          className: string;
          classId: number;
          subjectName: string;
        }>;
      }
    >();

    enrollments.forEach((enrollment) => {
      const student = enrollment.student;
      if (!studentMap.has(student.id)) {
        studentMap.set(student.id, {
          id: student.id,
          name: student.name,
          email: student.email,
          image: student.image || undefined,
          enrolledClasses: [],
        });
      }

      const studentData = studentMap.get(student.id)!;
      studentData.enrolledClasses.push({
        className: enrollment.class.name,
        classId: enrollment.class.id,
        subjectName: enrollment.subject.name,
      });
    });

    return Array.from(studentMap.values());
  }, [enrollments]);

  const publishedLectures = teacherLectures.filter((l) => l.isPublished).length;
  const totalStudents = enrollments.length;

  const kpis = [
    {
      label: "My Classes",
      value: classes.length,
      icon: Layers,
      accent: "text-blue-600",
    },
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      accent: "text-emerald-600",
    },
    {
      label: "My Lectures",
      value: teacherLectures.length,
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
      value: teacherDepartments.length,
      icon: Building2,
      accent: "text-cyan-600",
    },
    {
      label: "Subjects",
      value: teacherSubjects.length,
      icon: BookOpen,
      accent: "text-rose-600",
    },
  ];

  const departmentData = teacherDepartments.map((dept) => ({
    departmentName: dept.name,
    totalClasses: dept.classCount,
  }));

  const subjectData = teacherSubjects.map((subject) => ({
    subjectName: subject.name,
    totalClasses: subject.classCount,
    totalLectures: subject.lectureCount,
  }));

  console.log(currentUser?.id);
  console.log(lectures);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">
          Welcome <span className="text-primary">{currentUser?.name}</span> 👋
        </h1>
        <p className="text-muted-foreground">
          Overview of your classes, students, and teaching activity.
        </p>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Your Teaching Overview</CardTitle>
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
            <CardTitle>Lecture Publication Status</CardTitle>
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
                        value: teacherLectures.length - publishedLectures,
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
                Draft · {teacherLectures.length - publishedLectures}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Teaching Insights</CardTitle>
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
            <CardTitle>Your Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {classes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No classes assigned yet.
              </p>
            )}
            {topClasses.map((item: ClassListItem, index: number) => (
              <Link
                key={item.id}
                to={`/classes/show/${item.id}`}
                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.subject?.name ?? "No subject"} ·{" "}
                      {item.totalEnrollments || 0} students
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {item.totalEnrollments || 0} students
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Lectures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teacherLectures.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No lectures created yet.
              </p>
            )}
            {newestLectures.map((lecture: LectureItem, index: number) => (
              <Link
                key={lecture.id}
                to={`/lectures/show/${lecture.id}`}
                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{lecture.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lecture.class?.name ?? "No class"} ·{" "}
                      {lecture.totalContents || 0} contents
                    </p>
                  </div>
                </div>
                <Badge variant={lecture.isPublished ? "default" : "secondary"}>
                  {lecture.isPublished ? "Published" : "Draft"}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {uniqueStudents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No students enrolled in your classes yet.
            </p>
          )}
          {uniqueStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-3 hover:border-primary/40 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                {student.image ? (
                  <img
                    src={student.image}
                    alt={student.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.email}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {student.enrolledClasses.map((cls, index) => (
                      <Badge
                        key={`${cls.classId}-${index}`}
                        variant="outline"
                        className="text-xs"
                      >
                        {cls.className}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary">
                  {student.enrolledClasses.length}{" "}
                  {student.enrolledClasses.length === 1 ? "class" : "classes"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
};

export default Dashboard;
