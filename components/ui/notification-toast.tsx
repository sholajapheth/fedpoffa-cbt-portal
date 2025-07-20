"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/stores/ui-store";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Semi-robot helper: Get icon for notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

// Semi-robot helper: Get background color for notification type
const getNotificationBgColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    case "error":
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    case "warning":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    case "info":
      return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
    default:
      return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800";
  }
};

interface NotificationToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
  onRemove: (id: string) => void;
}

export const NotificationToast = ({
  id,
  type,
  title,
  message,
  timestamp,
  duration = 5000,
  onRemove,
}: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Semi-robot helper: Auto-dismiss notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRemoving(true);
      setTimeout(() => onRemove(id), 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onRemove]);

  // Semi-robot helper: Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Semi-robot helper: Calculate progress for progress bar
  const progress = Math.max(
    0,
    Math.min(100, ((Date.now() - timestamp) / duration) * 100)
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 shadow-lg transition-all duration-300",
        getNotificationBgColor(type),
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        isRemoving ? "translate-x-full opacity-0" : ""
      )}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-current opacity-20 transition-all duration-100">
        <div
          className="h-full bg-current transition-all duration-100"
          style={{ width: `${100 - progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getNotificationIcon(type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h4>
              {message && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setIsRemoving(true);
                setTimeout(() => onRemove(id), 300);
              }}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useUIStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          {...notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};
