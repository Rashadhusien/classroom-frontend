import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreate, useList } from "@refinedev/core";
import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Class {
  id: number;
  name: string;
  subject: {
    name: string;
    code: string;
  };
}

const LecturesCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: classId || "",
    order: 0,
    isPublished: true,
  });

  const { mutate } = useCreate();
  const { query: classesQuery } = useList<Class>({
    resource: "classes",
    pagination: { pageSize: 100 },
  });

  const classes = classesQuery?.data?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form data before submit:", formData);

    if (!formData.title || !formData.classId) {
      console.log(
        "Validation failed - title:",
        formData.title,
        "classId:",
        formData.classId,
      );
      return;
    }

    const submitData = {
      ...formData,
      classId: Number(formData.classId),
      order: Number(formData.order),
    };

    console.log("Submitting data:", submitData);

    mutate(
      {
        resource: "lectures",
        values: submitData,
      },
      {
        onError: (error) => {
          console.error("Failed to create lecture:", error);
        },
      },
    );
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean | number,
  ) => {
    console.log(`Updating ${field}:`, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ProtectedRoute resource="lectures" action="create">
      <CreateView>
        <Breadcrumb />

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/lectures")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lectures
          </Button>
        </div>

        <Card className="">
          <CardHeader>
            <CardTitle>Create New Lecture</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Class Selection */}
              <div className="space-y-2">
                <Label htmlFor="classId">Class *</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => {
                    console.log("Select value changed:", value);
                    handleInputChange("classId", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name} - {cls.subject?.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter lecture title"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter lecture description"
                  rows={4}
                />
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    handleInputChange("order", parseInt(e.target.value) || 0)
                  }
                  placeholder="Lecture order (leave blank for auto-assign)"
                />
                <p className="text-sm text-muted-foreground">
                  Leave as 0 to automatically place at the end
                </p>
              </div>

              {/* Published Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPublished", checked)
                  }
                />
                <Label htmlFor="isPublished">Publish immediately</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Unpublished lectures won't be visible to students
              </p>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/lectures")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.title || !formData.classId}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Lecture
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </CreateView>
    </ProtectedRoute>
  );
};

export default LecturesCreate;
