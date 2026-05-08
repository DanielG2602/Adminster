"use client";

import { Bell, BriefcaseBusiness, Building2, CalendarClock, ClipboardList, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BackendNotice } from "@/components/shared/backend-notice";
import { useDashboardMetrics, useAuditLogs, useNotifications } from "@/hooks/use-resources";
import { formatDateTime } from "@/lib/utils";

const metricConfig = [
  { key: "employees", label: "Funcionarios", icon: Users },
  { key: "departments", label: "Departamentos", icon: Building2 },
  { key: "positions", label: "Cargos", icon: BriefcaseBusiness },
  { key: "activeSchedules", label: "Escalas ativas", icon: CalendarClock },
  { key: "notificationsQueued", label: "Notificacoes na fila", icon: Bell },
  { key: "auditEventsToday", label: "Eventos hoje", icon: ClipboardList }
] as const;

export function DashboardView() {
  const metrics = useDashboardMetrics();
  const audit = useAuditLogs();
  const notifications = useNotifications();
  const backendUnavailable = metrics.isError || audit.isError || notifications.isError;

  if (backendUnavailable) {
    return (
      <BackendNotice
        onRetry={() => {
          metrics.refetch();
          audit.refetch();
          notifications.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricConfig.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.key} className="bg-card/86 backdrop-blur-xl">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {metrics.isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <p className="text-3xl font-semibold">{metrics.data?.[item.key] ?? 0}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-card/86 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Ultimos eventos de auditoria emitidos pela plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(audit.data ?? []).slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div>
                  <p className="text-sm font-semibold">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/86 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Fila de comunicacao</CardTitle>
            <CardDescription>Email e push com status operacional.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(notifications.data ?? []).map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.channel} para {item.audience}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
