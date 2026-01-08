import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { PriceAlertsPanel } from "@/components/PriceAlertsPanel";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";

export default function PriceAlerts() {
  const [, setLocation] = useLocation();
  const { alerts, deleteAlert, resetAlert } = usePriceAlerts();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b-2 border-border bg-background sticky top-0 z-10">
        <div className="container py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none hover:bg-accent"
            onClick={() => setLocation("/")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">
              Price Alerts
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Monitor sneaker prices and get notified
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <PriceAlertsPanel
          alerts={alerts}
          onDeleteAlert={deleteAlert}
          onResetAlert={resetAlert}
        />
      </main>
    </div>
  );
}
