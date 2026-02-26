import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useShow } from "@refinedev/core";
import { useNavigate } from "react-router";
import {
  PlayCircle,
  FileText,
  Image,
  ArrowLeft,
  BookOpen,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Lecture, LectureContent } from "@/types";
import { formatFileSize } from "@/lib/utils";

const LectureShow = () => {
  const { query } = useShow<Lecture>({ resource: "lectures" });
  const navigate = useNavigate();

  const lecture = query.data?.data;

  console.log(lecture);

  const { isLoading, isError } = query;
  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleDownload = (url: string, title: string) => {
    try {
      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = title;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const lectureContentColumns = useMemo<ColumnDef<LectureContent>[]>(
    () => [
      {
        id: "order",
        accessorKey: "order",
        size: 50,
        header: () => <p className="column-title">Order</p>,
        cell: ({ getValue }) => (
          <span className="text-sm">#{getValue<number>() + 1}</span>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        size: 300,
        header: () => <p className="column-title">Title</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback>
                {getContentIcon(row.original.type)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate font-medium">{row.original.title}</span>
            </div>
          </div>
        ),
      },
      {
        id: "type",
        accessorKey: "type",
        size: 100,
        header: () => <p className="column-title">Type</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="capitalize">
            {getValue<string>()}
          </Badge>
        ),
      },
      {
        id: "size",
        accessorKey: "sizeBytes",
        size: 120,
        header: () => <p className="column-title">Size</p>,
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {formatFileSize(getValue<number | null>())}
          </span>
        ),
      },

      {
        id: "actions",
        size: 200,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/lectures/document/${row.original.id}`)}
            >
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleDownload(row.original.url, row.original.title)
              }
            >
              Download
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  const lectureContentTable = useTable<LectureContent>({
    columns: lectureContentColumns,
    refineCoreProps: {
      resource: "lecture-content",
      filters: {
        permanent: [{ field: "lectureId", operator: "eq", value: lecture?.id }],
      },
      sorters: {
        initial: [{ field: "order", order: "asc" }],
        mode: "server",
      },
      pagination: {
        pageSize: 10,
        mode: "server",
      },
    },
  });

  if (isLoading || isError || !lecture) {
    return (
      <ShowView className="lecture-view lecture-show">
        <ShowViewHeader resource="lectures" title="Lecture Details" />

        <p className="state-message">
          {isLoading
            ? "Loading lecture..."
            : isError
            ? "Failed to load lecture."
            : "Lecture not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="lecture-view lecture-show">
      <ShowViewHeader resource="lectures" title={lecture.title} />

      {/* Lecture Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5" />
                {lecture.title}
              </CardTitle>
              {lecture.description && (
                <p className="text-muted-foreground">{lecture.description}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant={lecture.isPublished ? "default" : "secondary"}>
                {lecture.isPublished ? "Published" : "Draft"}
              </Badge>
              <Badge variant="outline">Lecture #{lecture.order + 1}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Total Contents: {lecture.totalContents}</span>
            {lecture.videoCount > 0 && (
              <span className="flex items-center gap-1">
                <PlayCircle className="w-4 h-4" />
                {lecture.videoCount} videos
              </span>
            )}
            {lecture.imageCount > 0 && (
              <span className="flex items-center gap-1">
                <Image className="w-4 h-4" />
                {lecture.imageCount} images
              </span>
            )}
            {lecture.documentCount > 0 && (
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {lecture.documentCount} documents
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="mb-6" />

      {lecture?.id && <DataTable table={lectureContentTable} />}
    </ShowView>
  );
};

export default LectureShow;
