"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: "success" | "error";
};

let addToast: ((toast: Omit<Toast, "id">) => void) | undefined;

export function toast(toastInput: Omit<Toast, "id">) {
  addToast?.(toastInput);
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    addToast = (toastInput) => {
      const id = Date.now();
      setToasts((current) => [...current, { id, ...toastInput }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
      }, 3200);
    };
    return () => {
      addToast = undefined;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((toastItem) => {
        const Icon = toastItem.variant === "error" ? XCircle : CheckCircle2;
        return (
          <div key={toastItem.id} className="rounded-lg border bg-card p-4 shadow-enterprise">
            <div className="flex gap-3">
              <Icon
                className={cn("mt-0.5 h-5 w-5", toastItem.variant === "error" ? "text-destructive" : "text-success")}
              />
              <div>
                <p className="text-sm font-semibold">{toastItem.title}</p>
                {toastItem.description ? <p className="mt-1 text-sm text-muted-foreground">{toastItem.description}</p> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
