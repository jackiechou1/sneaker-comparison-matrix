import { useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PriceAlert } from "@/hooks/usePriceAlerts";

interface PriceAlertDialogProps {
  sneakerId: number;
  sneakerModel: string;
  currentPrice: number;
  activeAlerts: PriceAlert[];
  onAddAlert: (targetPrice: number) => Promise<PriceAlert>;
  onDeleteAlert: (alertId: string) => void;
  onResetAlert: (alertId: string) => void;
}

export function PriceAlertDialog({
  sneakerId,
  sneakerModel,
  currentPrice,
  activeAlerts,
  onAddAlert,
  onDeleteAlert,
  onResetAlert,
}: PriceAlertDialogProps) {
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (price >= currentPrice) {
      setError(`Target price must be lower than current price ($${currentPrice.toFixed(2)})`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddAlert(price);
      setTargetPrice("");
    } catch (err) {
      setError("Failed to add alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const savingsAmount = currentPrice - (activeAlerts[0]?.targetPrice || currentPrice);
  const savingsPercent = ((savingsAmount / currentPrice) * 100).toFixed(1);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-none border-2 border-border font-mono text-xs hover:bg-accent/20"
        >
          <Bell className="h-4 w-4 mr-1" />
          PRICE ALERT
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none border-2 border-border shadow-hard max-w-md">
        <DialogHeader className="border-b-2 border-border pb-4">
          <DialogTitle className="text-lg font-bold uppercase">
            Price Alert for {sneakerModel}
          </DialogTitle>
          <DialogDescription className="font-mono text-sm mt-2">
            Current Price: <span className="font-bold text-foreground">{formatCurrency(currentPrice)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">
                Active Alerts ({activeAlerts.length})
              </h4>
              <div className="space-y-2">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="border-2 border-border bg-accent/10 p-3 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-bold font-mono">
                        {formatCurrency(alert.targetPrice)}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Save {savingsPercent}% ({formatCurrency(savingsAmount)})
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteAlert(alert.id)}
                      className="rounded-none hover:bg-destructive/20"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Alert Form */}
          <form onSubmit={handleAddAlert} className="space-y-4 border-t-2 border-border pt-4">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
                Target Price *
              </label>
              <div className="flex gap-2">
                <span className="text-sm font-mono text-muted-foreground pt-2">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={targetPrice}
                  onChange={(e) => {
                    setTargetPrice(e.target.value);
                    setError("");
                  }}
                  className="rounded-none border-2 border-border font-mono text-sm flex-1"
                />
              </div>
              {error && (
                <p className="text-xs text-destructive font-mono mt-2">{error}</p>
              )}
              {targetPrice && !error && (
                <p className="text-xs text-muted-foreground font-mono mt-2">
                  You'll save {(((currentPrice - parseFloat(targetPrice)) / currentPrice) * 100).toFixed(1)}% ({formatCurrency(currentPrice - parseFloat(targetPrice))})
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !targetPrice}
              className="w-full rounded-none border-2 border-border bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isSubmitting ? "SETTING ALERT..." : "SET ALERT"}
            </Button>
          </form>

          {/* Info */}
          <div className="bg-muted/10 border border-border/20 p-3 rounded-none text-xs font-mono text-muted-foreground space-y-1">
            <p>✓ You'll receive a browser notification when the price drops</p>
            <p>✓ Alerts are saved locally in your browser</p>
            <p>✓ Keep this tab open to receive notifications</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
