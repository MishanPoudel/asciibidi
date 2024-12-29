import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const blockChars = [" ", "░", "▒", "▓", "█"];

export const ImageUploader = ({ setAsciiArt, setCurrentImage, toast }) => {
  const canvasRef = useRef(null);

  const convertToBlockASCII = (imageData, width, height, inverted) => {
    const { data } = imageData;
    const asciiArt = [];
    const blocks = inverted ? blockChars.reverse() : blockChars;

    for (let y = 0; y < height; y++) {
      let line = "";
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        const grayscale = Math.round(
          (data[offset] + data[offset + 1] + data[offset + 2]) / 3
        );
        const charIndex = Math.floor((grayscale / 256) * blocks.length);
        line += blocks[charIndex];
      }
      asciiArt.push(line);
    }
    return asciiArt.join("\n");
  };

  const processImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const width = 50;
        const height = 25;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Store the canvas context and image data in a ref for later use
        canvasRef.current = {
          ctx,
          imageData: ctx.getImageData(0, 0, width, height),
          width,
          height,
        };

        try {
          const imageData = canvasRef.current.imageData;
          const ascii = convertToBlockASCII(imageData, width, height, false);
          setAsciiArt(ascii);
          setCurrentImage(file);
          toast({
            title: "Image uploaded",
            description: "Your image has been converted to ASCII art.",
          });
        } catch (error) {
          console.error("Error processing image:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to process image. Please try again.",
          });
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <Label
        htmlFor="image-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <Upload className="h-16 w-16 text-neutral-500 mb-4" />
        <span className="text-lg font-medium">Drop an image here</span>
        <span className="text-sm text-neutral-400 mt-2">or</span>
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => document.getElementById("image-upload").click()}
        >
          Choose file
        </Button>
      </Label>
    </div>
  );
};
