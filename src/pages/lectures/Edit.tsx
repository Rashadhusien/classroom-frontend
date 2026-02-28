import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useShow,
  useList,
  useCreate,
  useDelete,
  useBack,
} from "@refinedev/core";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import UploadWidget from "@/components/upload-widget";
import {
  ArrowLeft,
  Plus,
  Upload,
  FileText,
  Image,
  PlayCircle,
  Trash2,
} from "lucide-react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Lecture {
  id: number;
  title: string;
  description: string;
  classId: number;
}

interface LectureContent {
  id: number;
  lectureId: number;
  type: "video" | "image" | "document";
  title: string;
  url: string;
  order: number;
  mimeType?: string;
  sizeBytes?: number;
  cldPubId?: string;
}

const contentSchema = z.object({
  type: z.enum(["video", "image", "document"]),
  title: z.string().min(1, "Title is required"),
  url: z.string().optional(),
  file: z.any().optional(),
  fileCldPubId: z.string().optional(),
  fileSize: z.number().optional(),
  fileMimeType: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

const LecturesManageContent = () => {
  const back = useBack();
  const { id: lectureId } = useParams();
  const { confirmDelete } = useDeleteConfirmation();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: "document",
      title: "",
      url: "",
      file: "",
      fileCldPubId: "",
      fileSize: 0,
      fileMimeType: "",
    },
  });

  const uploadType = form.watch("type");
  const filePublicId = form.watch("fileCldPubId");

  const { query: lectureQuery } = useShow<Lecture>({
    resource: "lectures",
    id: lectureId,
  });

  const { query: contentsQuery } = useList<LectureContent>({
    resource: "lecture-content",
    filters: [{ field: "lectureId", operator: "eq", value: lectureId }],
    sorters: [{ field: "order", order: "asc" }],
  });

  const refetch = contentsQuery.refetch;

  const { mutate: createContent } = useCreate();
  const { mutate: deleteContent } = useDelete();

  const lecture = lectureQuery?.data?.data;
  const contents = contentsQuery?.data?.data || [];
  console.log(lecture, contents);

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "document":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const onSubmit = (values: ContentFormValues) => {
    if (!lectureId) return;

    let finalUrl = values.url;

    // For image and document types, use the uploaded file URL
    if (
      (values.type === "image" || values.type === "document") &&
      values.file
    ) {
      finalUrl = values.file;
    }

    // For video type, URL is required
    if (values.type === "video" && !values.url) {
      form.setError("url", { message: "Video URL is required" });
      return;
    }

    // For image and document types, file is required
    if (
      (values.type === "image" || values.type === "document") &&
      !values.file
    ) {
      form.setError("file", { message: "File upload is required" });
      return;
    }

    createContent(
      {
        resource: "lecture-content",
        values: {
          lectureId: Number(lectureId),
          type: values.type,
          title: values.title,
          url: finalUrl,
          order: contents.length, // Add to end
          sizeBytes: values.fileSize,
          mimeType: values.fileMimeType,
          cldPubId: values.fileCldPubId,
        },
      },
      {
        onSuccess: () => {
          form.reset();
          refetch();
        },
      },
    );
  };

  const handleDeleteContent = (contentId: number) => {
    confirmDelete({
      title: "Delete Content",
      description:
        "Are you sure you want to delete this content? This action cannot be undone.",
      onConfirm: () => {
        deleteContent(
          {
            resource: "lecture-content",
            id: contentId,
          },
          {
            onSuccess: () => {
              console.log("Content deleted successfully");
              refetch();
            },
            onError: (error) => {
              console.error("Delete error:", error);
              // Check if item was actually deleted despite the error
              // Some APIs return error status even when deletion succeeds
              setTimeout(() => {
                refetch();
              }, 1000);
            },
          },
        );
      },
      onCancel: () => {
        console.log("Delete cancelled by user");
      },
    });
  };

  if (!lecture) {
    return (
      <ListView>
        <Breadcrumb />
        <div className="text-center py-8">
          <p>Loading lecture information...</p>
        </div>
      </ListView>
    );
  }

  return (
    <ListView>
      <Breadcrumb />

      <div className="mb-6">
        <Button variant="outline" onClick={back} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lecture
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Content Form */}
        <Card className="lg:col-span-1 m-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear URL and file when type changes
                          form.setValue("url", "");
                          form.setValue("file", "");
                          form.setValue("fileCldPubId", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-4 h-4" />
                              Video
                            </div>
                          </SelectItem>
                          <SelectItem value="image">
                            <div className="flex items-center gap-2">
                              <Image className="w-4 h-4" />
                              Image
                            </div>
                          </SelectItem>
                          <SelectItem value="document">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Document
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter content title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {uploadType === "video" ? (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter video URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {uploadType === "image" ? "Image" : "Document"} File
                        </FormLabel>
                        <FormControl>
                          <UploadWidget
                            value={
                              field.value
                                ? {
                                    url: field.value,
                                    publicId: filePublicId ?? "",
                                  }
                                : null
                            }
                            onChange={(file) => {
                              if (file) {
                                field.onChange(file.url);
                                form.setValue("fileCldPubId", file.publicId, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                form.setValue("fileSize", file.sizeBytes || 0, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                form.setValue(
                                  "fileMimeType",
                                  file.mimeType || "",
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                              } else {
                                field.onChange("");
                                form.setValue("fileCldPubId", "", {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                form.setValue("fileSize", 0, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                form.setValue("fileMimeType", "", {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {form.formState.isSubmitting ? "Adding..." : "Add Content"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Content List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Content Items ({contents.length})</span>
              <Badge variant="outline">{lecture.title}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No content added yet</p>
                <p className="text-sm">
                  Add your first content item using the form
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {contents.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                  >
                    <div className="p-2 bg-muted rounded">
                      {getContentIcon(content.type)}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium">{content.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="capitalize">
                          {content.type}
                        </Badge>
                        {content.sizeBytes && (
                          <span>{Math.round(content.sizeBytes / 1024)} KB</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(content.url, "_blank")}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContent(content.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ListView>
  );
};

export default LecturesManageContent;
