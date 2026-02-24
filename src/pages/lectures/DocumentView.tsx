import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useShow } from "@refinedev/core";
import { BookOpen, FileText, Image, PlayCircle } from "lucide-react";
import { useParams } from "react-router";
import ReactPlayer from "react-player";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/utils";
const DocumentView = () => {
  const { id: documentId } = useParams();

  const { query: documentQuery } = useShow({
    resource: "lecture-content",
    id: documentId,
  });
  const { isLoading, isError } = documentQuery;
  const content = documentQuery.data?.data;
  const isVideo = content?.type === "video";
  const isImage = content?.type === "image";
  const isDocument = content?.type === "document";

  if (isLoading || isError || !content) {
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

  return (
    <ShowView>
      <ShowViewHeader title="Document View" />

      <Separator />

      {/* Lecture Contents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lecture Contents</h2>
        {content ? (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-start gap-3 flex-1">
                  <div className="flex items-center justify-center gap-2">
                    <div className="p-2 bg-muted rounded-lg">
                      {getContentIcon(content.type)}
                    </div>
                    <h3 className="font-semibold mb-1">{content.title}</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground ">
                      <Badge variant="secondary" className="capitalize">
                        {content.type}
                      </Badge>
                      {content.sizeBytes && (
                        <span>{formatFileSize(content.sizeBytes)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    {/* Content Preview */}
                    {isVideo && (
                      <div className="mt-3 overflow-auto rounded-lg w-full">
                        <ReactPlayer
                          src={content.url}
                          controls
                          width="100%"
                          height="100%"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            aspectRatio: "16/9",
                            borderRadius: "8px",
                          }}
                          onError={(error) => {
                            console.error("ReactPlayer error:", error);
                            console.error("Video URL:", content.url);
                          }}
                          onReady={() => {
                            console.log("ReactPlayer ready for:", content.url);
                          }}
                        />
                      </div>
                    )}

                    {isImage && (
                      <div className="mt-3 overflow-auto rounded-lg w-full">
                        <img
                          src={content.url}
                          alt={content.title}
                          className="w-full rounded-lg"
                          style={{
                            height: "auto",
                            aspectRatio: "auto",
                            borderRadius: "8px",
                          }}
                          loading="lazy"
                        />
                      </div>
                    )}

                    {isDocument && (
                      <div className="mt-3 w-full">
                        <div className="rounded-lg border bg-background overflow-hidden shadow-sm">
                          <DocViewer
                            documents={[{ uri: content.url }]}
                            pluginRenderers={DocViewerRenderers}
                            config={{
                              header: {
                                disableHeader: false,
                                disableFileName: false,
                                retainURLParams: false,
                              },
                              csvDelimiter: ",",
                              pdfVerticalScrollByDefault: true,
                              pdfZoom: {
                                defaultZoom: 3.0,
                                zoomJump: 0.3,
                              },
                            }}
                            className="w-full h-auto min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
                            style={{
                              maxHeight: "80vh",
                              width: "100%",
                              height: "auto",
                              overflow: "auto",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                No Content Available
              </h3>
              <p className="text-muted-foreground">
                This lecture doesn't have any content yet. Check back later or
                contact your instructor.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ShowView>
  );
};

export default DocumentView;
