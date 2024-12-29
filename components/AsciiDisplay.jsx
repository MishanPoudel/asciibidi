import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCcw } from "lucide-react";

const blockChars = [" ", "░", "▒", "▓", "█"];
const invertedBlockChars = [...blockChars].reverse();

export const AsciiDisplay = ({
  asciiArt,
  formData,
  customFields,
  currentImage,
  onRemoveImage,
}) => {
  const [isInverted, setIsInverted] = useState(false);

  // Memoize inverted ASCII to avoid recalculating on each render
  const invertedAsciiArt = useMemo(() => {
    if (!asciiArt) return "";
    const chars = isInverted ? invertedBlockChars : blockChars;
    const asciiLines = asciiArt.split("\n");
    const invertedLines = asciiLines.map((line) =>
      line
        .split("")
        .map((char) => chars[blockChars.indexOf(char)] || char)
        .join("")
    );
    return invertedLines.join("\n");
  }, [asciiArt, isInverted]);

  const getCombinedDisplay = () => {
    if (!asciiArt) return "";

    const asciiLines = asciiArt.split("\n");
    const infoLines = customFields.map(
      (field) => `${field}: ${formData[field]}`
    );

    // Ensure info lines don't exceed ASCII art height
    const trimmedInfoLines = infoLines.slice(0, asciiLines.length);

    // Combine ASCII art with info, adding tabs between
    const combinedLines = asciiLines.map((asciiLine, index) => {
      const infoLine = trimmedInfoLines[index] || "";
      return `${asciiLine}${infoLine ? "\t" + infoLine : ""}`;
    });

    // Add signature at the bottom if present
    if (formData.signature) {
      combinedLines.push(formData.signature);
    }

    return combinedLines.join("\n");
  };

  const downloadImage = () => {
    const displayText = isInverted ? invertedAsciiArt : getCombinedDisplay();
    const lines = displayText.split("\n");

    // Create a temporary pre element to measure text dimensions
    const tempPre = document.createElement("pre");
    tempPre.style.font = "15px monospace";
    tempPre.style.position = "absolute";
    tempPre.style.left = "-9999px";
    tempPre.textContent = displayText;
    document.body.appendChild(tempPre);

    // Get actual text dimensions
    const textWidth = tempPre.offsetWidth;
    const textHeight = tempPre.offsetHeight;
    document.body.removeChild(tempPre);

    // Create canvas with proper dimensions
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Add padding
    const padding = 20;
    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;

    // Create a glow effect
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#00FF00");
    gradient.addColorStop(1, "#007700");

    // Set background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set glow text properties
    ctx.font = "15px monospace";
    ctx.fillStyle = gradient;
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 8;
    ctx.textBaseline = "top";

    // Draw text line by line with glow
    const lineHeight = 18; // Approximate line height for 15px monospace
    lines.forEach((line, index) => {
      ctx.fillText(line, padding, padding + index * lineHeight);
    });

    // Apply retro scanlines
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 2);
    }

    // Download the image
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg");
    link.download = "meow.png";
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-400">
          Current image: {currentImage?.name}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveImage}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
          <Button
            size="sm"
            onClick={downloadImage}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <pre className="font-mono text-sm text-green-500 whitespace-pre bg-black p-4 rounded-md">
        {isInverted ? invertedAsciiArt : getCombinedDisplay()}
      </pre>
      <Button onClick={() => setIsInverted(!isInverted)}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        {isInverted ? "Revert to Normal" : "Invert Brightness"}
      </Button>
    </div>
  );
};
