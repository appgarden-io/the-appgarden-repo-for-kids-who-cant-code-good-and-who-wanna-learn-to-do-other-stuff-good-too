import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HealthResponse {
  status: string;
}

async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Open Sidebar
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>This is a sidebar panel.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <h1 className="font-bold text-4xl">Home</h1>
      {isLoading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-destructive">Error: {error.message}</p>}
      {data && (
        <p className="text-muted-foreground">API Status: {data.status}</p>
      )}
    </div>
  );
}
