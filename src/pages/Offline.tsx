import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Offline() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full card-shadow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading">You're Offline</CardTitle>
          <CardDescription>
            It looks like you've lost your internet connection. Some features may be limited.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-heading font-semibold mb-2">Cached Data Available</h3>
            <p className="text-sm text-muted-foreground">
              You can still view previously loaded content while offline.
            </p>
          </div>
          
          <Button onClick={handleRetry} className="w-full touch-friendly">
            Retry Connection
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Data will sync automatically when connection is restored
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
