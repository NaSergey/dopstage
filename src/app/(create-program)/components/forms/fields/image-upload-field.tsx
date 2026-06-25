"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { EditImageIcon, SelectFileIcon } from "@/shared/ui/icons";

interface ImageUploadFieldProps {
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  label: string;
  recommendations: React.ReactNode;
  shape?: "square" | "rectangle";
  buttonLabel?: string;
  ariaLabel: string;
}

export function ImageUploadField({
  preview,
  onChange,
  onRemove,
  label,
  recommendations,
  shape = "square",
  buttonLabel = "Select file",
  ariaLabel,
}: ImageUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const containerClasses = shape === "square" ? "h-16 w-16" : "h-16 w-32";
  const imageSizes = shape === "square" ? "64px" : "128px";

  const handleButtonClick = () => {
    if (preview && onRemove) {
      onRemove();
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-50 mb-2">
        {label}
      </label>
      <div className="flex items-start gap-6">
        {preview ? (
          <div className={`relative ${containerClasses}`}>
            <Image
              src={preview}
              alt="Selected preview"
              fill
              sizes={imageSizes}
              className=" object-cover cursor-pointer"
              onClick={() => inputRef.current?.click()}
            />
            <div
              className="absolute bottom-0 right-0 h-6 w-6 bg-zinc-950 flex items-center justify-center cursor-pointer"
              onClick={() => inputRef.current?.click()}
              role="button"
              aria-label={`Change ${label}`}
            >
              <EditImageIcon className="w-6 h-6 text-zinc-500" />
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="frame-gray"
            className="w-[192px]"
            onClick={handleButtonClick}
            aria-label={ariaLabel}
          >
            <SelectFileIcon />
            <span className="pl-2">{buttonLabel}</span>
          </Button>
        )}
        <div className="text-sm text-zinc-500 leading-5 -mt-1">
          {recommendations}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}
