import type { ImgHTMLAttributes } from "react";

import { useEffect, useRef, useState } from "react";

import { ImageBrokenIcon } from "@phosphor-icons/react";

interface Props
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  fallback?: React.ReactNode;
  fallbackMessage?: string;
  showLoadingSkeleton?: boolean;
  onLoadSuccess?: () => void;
  onLoadError?: () => void;
}

export function Image({
  src,
  alt,
  width,
  height,
  fallback,
  fallbackMessage,
  className,
  showLoadingSkeleton = true,
  onLoadSuccess,
  onLoadError,
  ...props
}: Props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) {
      return;
    }

    const handleLoad = () => {
      setLoading(false);
      onLoadSuccess?.();
    };

    const handleError = () => {
      setLoading(false);
      setError(true);
      onLoadError?.();
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [onLoadSuccess, onLoadError]);

  if (error) {
    return fallback || <ImageFallback message={fallbackMessage} />;
  }

  return (
    <>
      {loading && showLoadingSkeleton && (
        <div className="h-full w-full animate-pulse bg-muted" />
      )}
      <img
        alt={alt}
        className={className}
        height={height}
        ref={imgRef}
        src={src}
        style={loading ? { display: "none" } : undefined}
        width={width}
        {...props}
      />
    </>
  );
}

interface ImageFallbackProps {
  message?: string;
}

function ImageFallback({
  message = "Failed to load image",
}: ImageFallbackProps) {
  return (
    <div className="grid h-full w-full place-items-center bg-background">
      <div className="flex items-center gap-1 text-muted-foreground">
        <ImageBrokenIcon />
        <span>{message}</span>
      </div>
    </div>
  );
}
