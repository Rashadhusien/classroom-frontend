import React from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Please contact your administrator if you think this is a mistake.
            </p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
