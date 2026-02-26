// import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@radix-ui/react-select";
import { Search, BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { EnrollmentRow } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const EnrollmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];
  const enrollmentColumns = useMemo<ColumnDef<EnrollmentRow>[]>(
    () => [
      {
        id: "studentName",
        accessorKey: "student.name",
        size: 150,
        header: () => <p className="column-title ml-2">Student</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "studentEmail",
        accessorKey: "student.email",
        size: 200,
        header: () => <p className="column-title">Email</p>,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      {
        id: "className",
        accessorKey: "class.name",
        size: 200,
        header: () => <p className="column-title">Class</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "subjectName",
        accessorKey: "subject.name",
        size: 180,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      {
        id: "departmentName",
        accessorKey: "department.name",
        size: 180,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "teacherName",
        accessorKey: "teacher.name",
        size: 180,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      {
        id: "classStatus",
        accessorKey: "class.status",
        size: 100,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "details",
        size: 150,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <ShowButton
              resource="enrollments"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/lectures?classId=${row.original.classId}`)
              }
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Lectures
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );
  const enrollmentsTable = useTable({
    columns: enrollmentColumns,
    refineCoreProps: {
      resource: "enrollments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        // Compose refine filters from the current UI selections.
        permanent: [...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Enrollments</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments?.map((department) => (
                  <SelectItem
                    key={department.id}
                    value={department.id.toString()}
                  >
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            {/* {currentUser?.role !== "student" && (
              <CreateButton resource="subjects" />
            )} */}
          </div>
        </div>
      </div>

      <DataTable table={enrollmentsTable} />
    </ListView>
  );
};

export default EnrollmentsList;
