import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  PlayCircle,
  BookOpen,
  FileText,
  Image,
  Plus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { useNavigate, useSearchParams } from "react-router";
import { useGetIdentity, useShow } from "@refinedev/core";
import { ClassDetails } from "@/types";

interface Lecture {
  id: number;
  title: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  classId: number;
  createdAt: string;
  updatedAt: string;
  totalContents: number;
  videoCount: number;
  imageCount: number;
  documentCount: number;
}

const LecturesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");

  const { data: currentUser } = useGetIdentity<{ role: string }>();

  const { query: classQuery } = useShow<ClassDetails>({
    resource: "classes",
    id: Number(classId),
  });

  const classDetails = classQuery?.data?.data;

  const searchFilters = searchQuery
    ? [
        {
          field: "title",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  // Add classId filter if present
  const permanentFilters = classId
    ? [
        ...searchFilters,
        { field: "classId", operator: "eq" as const, value: Number(classId) },
      ]
    : searchFilters;

  const lectureColumns = useMemo<ColumnDef<Lecture>[]>(
    () => [
      {
        id: "order",
        accessorKey: "order",
        size: 60,
        header: () => <p className="column-title">#</p>,
        cell: ({ getValue }) => (
          <span className="font-medium text-muted-foreground">
            {getValue<number>() + 1}
          </span>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        size: 300,
        header: () => <p className="column-title">Title</p>,
        cell: ({ getValue, row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{getValue<string>()}</span>
            {row.original.description && (
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {row.original.description}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "contents",
        size: 200,
        header: () => <p className="column-title">Contents</p>,
        cell: ({ row }) => {
          const { totalContents, videoCount, imageCount, documentCount } =
            row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{totalContents} items</span>
              <div className="flex gap-1">
                {videoCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <PlayCircle className="w-3 h-3 mr-1" />
                    {videoCount}
                  </Badge>
                )}
                {imageCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <Image className="w-3 h-3 mr-1" />
                    {imageCount}
                  </Badge>
                )}
                {documentCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    {documentCount}
                  </Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "isPublished",
        size: 100,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "default" : "secondary"}>
            {getValue() ? "Published" : "Draft"}
          </Badge>
        ),
      },
      {
        id: "actions",
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <ShowButton
              resource="lectures"
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
                navigate(`/dashboard/classes/show/${row.original.classId}`)
              }
            >
              Class
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  const lecturesTable = useTable({
    columns: lectureColumns,
    refineCoreProps: {
      resource: "lectures",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: permanentFilters,
      },
      sorters: {
        initial: [
          {
            field: "order",
            order: "asc",
          },
        ],
      },
    },
  });

  // If no classId is provided, show a message to select a class
  if (!classId) {
    return (
      <ListView>
        <Breadcrumb />

        <h1 className="page-title">All Lectures</h1>

        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Select a Class First</h3>
            <p className="text-muted-foreground mb-4">
              Please select a class to view its lectures, or create a new
              lecture for a specific class.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate("/dashboard/classes")}>
                Browse Classes
              </Button>
              {currentUser?.role !== "student" && (
                <Button
                  onClick={() => navigate("/dashboard/lectures/create")}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Lecture
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </ListView>
    );
  }

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">
        {classDetails ? (
          <span>
            Lectures of:{" "}
            <span className="font-semibold text-primary">
              {classDetails.name}
            </span>
          </span>
        ) : (
          "Lectures"
        )}
      </h1>

      <div className="intro-row">
        <p>Access your course lectures and learning materials.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search lectures..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {currentUser?.role !== "student" && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() =>
                  navigate(`/dashboard/lectures/create?classId=${classId}`)
                }
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Lecture
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Available Lectures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={lecturesTable} />
        </CardContent>
      </Card>
    </ListView>
  );
};

export default LecturesList;
