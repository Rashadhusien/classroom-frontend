import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_FILE_SIZE,
} from "@/constants";
import { UploadWidgetValue } from "@/types";
import { CloudinaryWidget } from "@cloudinary/react";
import { UploadCloud, FileText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue) => void;
  disabled?: boolean;
  fileType?: "image" | "document" | "both";
}

const UploadWidget = ({
  value = null,
  onChange,
  disabled,
  fileType = "both",
}: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [fileTypeDetected, setFileTypeDetected] = useState<
    "image" | "document" | null
  >(null);

  useEffect(() => {
    setPreview(value);
    if (value?.url) {
      // Detect file type from URL or public_id
      const isImage =
        /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(value.url) ||
        value.publicId?.includes("image");
      setFileTypeDetected(isImage ? "image" : "document");
    } else {
      setFileTypeDetected(null);
    }
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      // Determine allowed formats based on fileType prop
      let allowedFormats = ["png", "jpg", "jpeg", "webp"]; // default for images
      if (fileType === "document") {
        allowedFormats = [
          "pdf",
          "doc",
          "docx",
          "txt",
          "xls",
          "xlsx",
          "ppt",
          "pptx",
        ];
      } else if (fileType === "both") {
        allowedFormats = [
          "png",
          "jpg",
          "jpeg",
          "webp",
          "pdf",
          "doc",
          "docx",
          "txt",
          "xls",
          "xlsx",
          "ppt",
          "pptx",
        ];
      }

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "classroom",
          maxFileSize: MAX_FILE_SIZE,
          clientAllowedFormats: allowedFormats,
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const mimeType =
              result.info.resource_type === "image"
                ? `image/${result.info.format}`
                : result.info.resource_type === "video"
                ? `video/${result.info.format}`
                : `application/${result.info.format}`;

            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
              sizeBytes: result.info.bytes,
              mimeType: mimeType,
            };
            setPreview(payload);
            onChangeRef.current?.(payload);
          }
        },
      );
      return true;
    };
    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [fileType]);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  const getFileTypeText = () => {
    if (fileType === "image") return "PNG, JPG, WebP up to 3MB";
    if (fileType === "document") return "PDF, DOC, DOCX, TXT up to 3MB";
    return "Images (PNG, JPG, WebP) and Documents (PDF, DOC, DOCX) up to 3MB";
  };

  const getUploadText = () => {
    if (fileType === "image") return "Click to upload image";
    if (fileType === "document") return "Click to upload document";
    return "Click to upload file";
  };

  const renderPreview = () => {
    if (!preview) return null;

    const isImage =
      fileTypeDetected === "image" ||
      /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(preview.url);

    if (isImage) {
      return (
        <div className="upload-preview">
          <div className="relative group">
            <img
              src={preview.url}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  setFileTypeDetected(null);
                  onChangeRef.current?.(null as unknown as UploadWidgetValue);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Image uploaded successfully
          </p>
        </div>
      );
    } else {
      return (
        <div className="upload-preview">
          <div className="relative group">
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <FileText className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {preview.url.split("/").pop() || "Document"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Document uploaded successfully
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    setFileTypeDetected(null);
                    onChangeRef.current?.(null as unknown as UploadWidgetValue);
                  }}
                  className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        renderPreview()
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={openWidget}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <p>{getUploadText()}</p>
            <p>{getFileTypeText()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
