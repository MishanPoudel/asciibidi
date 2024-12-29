"use client";
import React, { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { AsciiDisplay } from "@/components/AsciiDisplay";
import { InfoForm } from "@/components/InfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [asciiArt, setAsciiArt] = useState("");
  const [formData, setFormData] = useState({ signature: "" });
  const [customFields, setCustomFields] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [invert, setInvert] = useState(false);
  const { toast } = useToast();

  const handleImageRemove = () => {
    setAsciiArt("");
    setCurrentImage(null);
    toast({
      title: "Image removed",
      description: "The image has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-white uppercase">
          Asciibidi
        </h1>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <Card className="bg-neutral-800 text-white border-neutral-700">
              <CardHeader>
                <CardTitle>ASCII Generator</CardTitle>
              </CardHeader>
              <CardContent>
                {!currentImage ? (
                  <ImageUploader
                    setAsciiArt={setAsciiArt}
                    setCurrentImage={setCurrentImage}
                    toast={toast}
                  />
                ) : (
                  <AsciiDisplay
                    asciiArt={asciiArt}
                    formData={formData}
                    customFields={customFields}
                    currentImage={currentImage}
                    onRemoveImage={handleImageRemove}
                    invert={invert}
                    setInvert={setInvert}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-neutral-800 text-white border-neutral-700">
              <CardHeader>
                <CardTitle>Custom Information</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoForm
                  formData={formData}
                  setFormData={setFormData}
                  customFields={customFields}
                  setCustomFields={setCustomFields}
                  toast={toast}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
