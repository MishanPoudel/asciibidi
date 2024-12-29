import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const InfoForm = ({
  formData,
  setFormData,
  customFields,
  setCustomFields,
  toast,
}) => {
  const [newFieldName, setNewFieldName] = React.useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddField = () => {
    if (newFieldName) {
      if (customFields.includes(newFieldName)) {
        toast({
          variant: "destructive",
          title: "Field already exists",
          description: "Please use a different field name.",
        });
        return;
      }

      setCustomFields((prev) => [...prev, newFieldName]);
      setFormData((prev) => ({ ...prev, [newFieldName]: "" }));
      setNewFieldName("");
      toast({
        title: "Field added",
        description: `New field "${newFieldName}" has been added.`,
      });
    }
  };

  const handleRemoveField = (fieldName) => {
    setCustomFields((prev) => prev.filter((field) => field !== fieldName));
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[fieldName];
      return newData;
    });
    toast({
      title: "Field removed",
      description: `Field "${fieldName}" has been removed.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="signature">Signature</Label>
        <Input
          id="signature"
          name="signature"
          value={formData.signature}
          onChange={handleInputChange}
          className="bg-neutral-700"
          placeholder="Enter your signature"
        />
      </div>

      {customFields.map((field) => (
        <div key={field} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={field}>{field}</Label>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveField(field)}
              className="h-6 w-6 text-red-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Input
            id={field}
            name={field}
            value={formData[field] || ""}
            onChange={handleInputChange}
            className="bg-neutral-700"
            placeholder={`Enter ${field}`}
          />
        </div>
      ))}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-neutral-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Field</AlertDialogTitle>
          </AlertDialogHeader>
          <Input
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Enter field name"
            className="bg-neutral-700"
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAddField}>Add</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
