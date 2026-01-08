import { Bell, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceAlert } from "@/hooks/usePriceAlerts";
import sneakersData from "../data/sneakers.json";

interface PriceAlertsPanelProps {
  alerts: PriceAlert[];
  onDeleteAlert: (alertId: string) => void;
  onResetAlert: (alertId: string) => void;
}

export function PriceAlertsPanel({
  alerts,
  onDeleteAlert,
  onResetAlert,
}: PriceAlertsPanelProps) {
  const activeAlerts = alerts.filter((a) => !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSneakerBrand = (sneakerId: number) => {
    const sneaker = sneakersData.find((s) => s.id === sneakerId);
    return sneaker?.brand || "Unknown";
  };

  const AlertRow = ({ alert, isTriggered }: { alert: PriceAlert; isTriggered: boolean }) => {
    const savings = alert.currentPrice - alert.targetPrice;
    const savingsPercent = ((savings / alert.currentPrice) * 100).toFixed(1);

    return (
      <div
        className={`border-2 border-border p-4 flex justify-between items-start gap-4 ${
          isTriggered ? "bg-green-50/30" : "hover:bg-accent/10"
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="font-bold text-sm truncate">{alert.sneakerModel}</div>
            <Badge className="rounded-none text-xs border-none bg-primary/10 text-primary font-mono">
              {getSneakerBrand(alert.sneakerId)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-2">
            <div>
              <span className="text-muted-foreground">Target:</span>
              <div className="font-bold text-foreground">
                {formatCurrency(alert.targetPrice)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Current:</span>
              <div className="font-bold text-foreground">
                {formatCurrency(alert.currentPrice)}
              </div>
            </div>
          </div>

          {isTriggered && alert.triggeredAt && (
            <div className="text-xs text-green-600 font-mono font-bold">
              ✓ Triggered on {formatDate(alert.triggeredAt)}
            </div>
          )}

          <div className="text-xs text-muted-foreground font-mono mt-2">
            Created {formatDate(alert.createdAt)}
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {isTriggered && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResetAlert(alert.id)}
              className="rounded-none border-border hover:bg-primary/10"
              title="Reset alert to monitor again"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteAlert(alert.id)}
            className="rounded-none border-border hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  };

  if (alerts.length === 0) {
    return (
      <div className="border-2 border-border bg-muted/10 p-6 text-center space-y-3">
        <Bell className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
        <p className="text-sm font-mono text-muted-foreground">
          No price alerts set yet. Click the PRICE ALERT button on any sneaker to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-border bg-muted/10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-6 w-6 text-secondary" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Price Alerts</h2>
        </div>
        <p className="text-sm font-mono text-muted-foreground">
          Monitor your favorite sneakers and get notified when prices drop
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-2 border-border bg-muted/30">
          <TabsTrigger
            value="active"
            className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            ACTIVE ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger
            value="triggered"
            className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            TRIGGERED ({triggeredAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-4">
          {activeAlerts.length === 0 ? (
            <div className="border-2 border-border bg-muted/10 p-6 text-center">
              <p className="text-sm font-mono text-muted-foreground">
                No active alerts. Set one to start monitoring prices!
              </p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} isTriggered={false} />
            ))
          )}
        </TabsContent>

        <TabsContent value="triggered" className="space-y-3 mt-4">
          {triggeredAlerts.length === 0 ? (
            <div className="border-2 border-border bg-muted/10 p-6 text-center">
              <p className="text-sm font-mono text-muted-foreground">
                No triggered alerts yet. Keep monitoring!
              </p>
            </div>
          ) : (
            triggeredAlerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} isTriggered={true} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-border pt-6">
          <div className="border-2 border-border bg-card p-4">
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">
              Total Alerts
            </div>
            <div className="text-3xl font-bold font-mono text-primary">
              {alerts.length}
            </div>
          </div>

          <div className="border-2 border-border bg-card p-4">
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">
              Active Monitoring
            </div>
            <div className="text-3xl font-bold font-mono text-secondary">
              {activeAlerts.length}
            </div>
          </div>

          <div className="border-2 border-border bg-card p-4">
            <div className="text-xs font-bold uppercase text-muted-foreground mb-2">
              Price Drops Detected
            </div>
            <div className="text-3xl font-bold font-mono text-green-600">
              {triggeredAlerts.length}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-accent/20 border-2 border-border p-4 rounded-none space-y-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-xs font-mono text-foreground/80">
            <p className="font-bold mb-1">How Price Alerts Work:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Set a target price for any sneaker</li>
              <li>• We'll monitor the resale price continuously</li>
              <li>• You'll get a browser notification when the price drops to your target</li>
              <li>• Keep this tab open to receive notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
