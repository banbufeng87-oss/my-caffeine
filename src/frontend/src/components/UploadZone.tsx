import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, ImagePlus, RefreshCw, Trash2, Upload } from "lucide-react";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

interface UploadZoneProps {
  previewUrl: string | null;
  fileName: string | null;
  error: string | null;
  onFile: (file: File) => void;
  onRemove: () => void;
}

export function UploadZone({
  previewUrl,
  fileName,
  error,
  onFile,
  onRemove,
}: UploadZoneProps) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="sr-only"
        data-ocid="upload.gallery_input"
        onChange={handleChange}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        data-ocid="upload.camera_input"
        onChange={handleChange}
      />

      {previewUrl ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-3">
          <img
            src={previewUrl}
            alt="已上传的原图预览"
            className="size-16 shrink-0 rounded-lg border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              原图已就绪，可继续设置参数
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="upload.reselect_button"
              className="rounded-full"
              onClick={() => galleryRef.current?.click()}
            >
              <RefreshCw className="size-3.5" />
              重新选择
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="移除图片"
              data-ocid="upload.remove_button"
              className="rounded-full text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          data-ocid="upload.dropzone"
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-smooth",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30",
          )}
        >
          <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <ImagePlus className="size-6" />
          </span>
          <div>
            <p className="text-sm font-semibold">把图片拖到这里</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              支持 JPG、PNG、WebP 等常见图片格式
            </p>
          </div>
          <div className="flex w-full gap-2">
            <Button
              type="button"
              data-ocid="upload.gallery_button"
              className="h-11 flex-1 rounded-full"
              onClick={() => galleryRef.current?.click()}
            >
              <Upload className="size-4" />
              从相册选择
            </Button>
            <Button
              type="button"
              variant="outline"
              data-ocid="upload.camera_button"
              className="h-11 flex-1 rounded-full"
              onClick={() => cameraRef.current?.click()}
            >
              <Camera className="size-4" />
              拍照
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          data-ocid="upload.error_state"
          className="mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
