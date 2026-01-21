import {
  ALLOWED_TYPES,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_FILE_SIZE,
} from "@/constants";
import { UploadWidgetValue } from "@/types";
import { CloudinaryWidget } from "cloudinary-react";
import { UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue) => void;
  disabled?: boolean;
}

const UploadWidget = ({
  value = null,
  onChange,
  disabled,
}: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "classroom",
          maxFileSize: MAX_FILE_SIZE,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
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
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
          <img src={preview.url} alt="Preview" />
        </div>
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
            <p>Click to upload photo</p>
            <p>PNG, JPG, WebP up to 3MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
