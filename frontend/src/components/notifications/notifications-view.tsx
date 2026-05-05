"use client";

import type * as React from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/shared/page-heading";
import { BackendNotice } from "@/components/shared/backend-notice";
import { ResourceSkeleton } from "@/components/shared/resource-skeleton";
import { useNotifications } from "@/hooks/use-resources";
import { formatDateTime } from "@/lib/utils";

export function NotificationsView() {
  const { data, isLoading, isError, refetch } = useNotifications();

  return (
    <>
      <PageHeading
        title="Notificacoes"
        description="Acompanhe disparos de email e push gerados por admissao, escala e eventos administrativos."
      />
      {isError ? <BackendNotice onRetry={() => refetch()} /> : isLoading ? <ResourceSkeleton /> : data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((notification) => {
            const Icon = notification.channel === "Email" ? Mail : Smartphone;
            return (
              <Card key={notification.id} className="bg-card/86 backdrop-blur-xl">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md bg-secondary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={statusVariant(notification.status)}>{notification.status}</Badge>
                  </div>
                  <CardTitle>{notification.title}</CardTitle>
                  <CardDescription>{notification.channel} para {notification.audience}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Criado em {formatDateTime(notification.createdAt)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : <EmptyState icon={Bell} title="Sem notificacoes" description="Novos envios aparecerao nesta tela." />}
    </>
  );
}

function statusVariant(status: string): React.ComponentProps<typeof Badge>["variant"] {
  if (status === "Sent") return "success";
  if (status === "Failed") return "destructive";
  return "warning";
}
