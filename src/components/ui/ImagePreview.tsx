"use client";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  aspectRatio?: string;
  className?: string;
  rounded?: boolean;
}

export function ImagePreview({
  src,
  alt = "",
  aspectRatio = "aspect-[3/4]",
  className = "",
  rounded = false,
}: ImagePreviewProps) {
  return (
    <div
      className={`
        overflow-hidden ${aspectRatio} ${rounded ? "rounded-full" : "rounded-xl"}
        ${className}
      `}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
