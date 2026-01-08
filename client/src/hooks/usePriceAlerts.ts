import { useState, useEffect, useCallback } from "react";

const ALERTS_STORAGE_KEY = "sneaker-matrix-price-alerts";

export interface PriceAlert {
  id: string;
  sneakerId: number;
  sneakerModel: string;
  targetPrice: number;
  currentPrice: number;
  createdAt: number;
  triggered: boolean;
  triggeredAt?: number;
}

/**
 * 管理价格提醒
 */
export function usePriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  // 初始化：加载提醒和请求通知权限
  useEffect(() => {
    // 加载提醒
    const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse alerts from localStorage:", error);
      }
    }

    // 检查通知权限
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    setIsLoaded(true);
  }, []);

  // 保存提醒到localStorage
  const saveAlerts = useCallback((updatedAlerts: PriceAlert[]) => {
    setAlerts(updatedAlerts);
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
  }, []);

  // 请求通知权限
  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      setNotificationPermission("granted");
      return true;
    }

    if (Notification.permission !== "denied") {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        return permission === "granted";
      } catch (error) {
        console.error("Failed to request notification permission:", error);
        return false;
      }
    }

    return false;
  }, []);

  // 添加价格提醒
  const addAlert = useCallback(
    async (sneakerId: number, sneakerModel: string, targetPrice: number, currentPrice: number) => {
      // 请求通知权限
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        console.warn("Notification permission not granted");
      }

      const newAlert: PriceAlert = {
        id: `alert-${Date.now()}-${Math.random()}`,
        sneakerId,
        sneakerModel,
        targetPrice,
        currentPrice,
        createdAt: Date.now(),
        triggered: false,
      };

      const updatedAlerts = [...alerts, newAlert];
      saveAlerts(updatedAlerts);
      return newAlert;
    },
    [alerts, saveAlerts, requestNotificationPermission]
  );

  // 删除提醒
  const deleteAlert = useCallback(
    (alertId: string) => {
      const updatedAlerts = alerts.filter((a) => a.id !== alertId);
      saveAlerts(updatedAlerts);
    },
    [alerts, saveAlerts]
  );

  // 检查价格并触发通知
  const checkAndTriggerAlerts = useCallback(
    (sneakerId: number, currentPrice: number) => {
      const updatedAlerts = alerts.map((alert) => {
        if (
          alert.sneakerId === sneakerId &&
          !alert.triggered &&
          currentPrice <= alert.targetPrice
        ) {
          // 触发通知
          if (notificationPermission === "granted") {
            new Notification(`Price Alert: ${alert.sneakerModel}`, {
              body: `The price has dropped to $${currentPrice.toFixed(2)}! Your target was $${alert.targetPrice.toFixed(2)}.`,
              icon: "/favicon.ico",
              tag: `price-alert-${alert.id}`,
            });
          }

          return {
            ...alert,
            triggered: true,
            triggeredAt: Date.now(),
            currentPrice,
          };
        }
        return alert;
      });

      if (JSON.stringify(updatedAlerts) !== JSON.stringify(alerts)) {
        saveAlerts(updatedAlerts);
      }
    },
    [alerts, notificationPermission, saveAlerts]
  );

  // 重置提醒（用于再次监控同一鞋款）
  const resetAlert = useCallback(
    (alertId: string) => {
      const updatedAlerts = alerts.map((a) =>
        a.id === alertId ? { ...a, triggered: false, triggeredAt: undefined } : a
      );
      saveAlerts(updatedAlerts);
    },
    [alerts, saveAlerts]
  );

  // 获取特定鞋款的活跃提醒
  const getActiveAlerts = useCallback(
    (sneakerId: number) => {
      return alerts.filter((a) => a.sneakerId === sneakerId && !a.triggered);
    },
    [alerts]
  );

  // 获取已触发的提醒
  const getTriggeredAlerts = useCallback(() => {
    return alerts.filter((a) => a.triggered);
  }, [alerts]);

  // 获取所有活跃提醒
  const getAllActiveAlerts = useCallback(() => {
    return alerts.filter((a) => !a.triggered);
  }, [alerts]);

  return {
    alerts,
    addAlert,
    deleteAlert,
    checkAndTriggerAlerts,
    resetAlert,
    getActiveAlerts,
    getTriggeredAlerts,
    getAllActiveAlerts,
    notificationPermission,
    requestNotificationPermission,
    isLoaded,
  };
}
