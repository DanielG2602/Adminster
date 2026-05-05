"use client";

import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeading } from "@/components/shared/page-heading";
import { BackendNotice } from "@/components/shared/backend-notice";
import { ResourceSkeleton } from "@/components/shared/resource-skeleton";
import { useAuditLogs } from "@/hooks/use-resources";
import { formatDateTime } from "@/lib/utils";

export function AuditView() {
  const { data, isLoading, isError, refetch } = useAuditLogs();

  return (
    <>
      <PageHeading
        title="Auditoria"
        description="Rastreabilidade de alteracoes sensiveis para funcionarios, cargos, departamentos e permissoes."
      />
      {isError ? <BackendNotice onRetry={() => refetch()} /> : isLoading ? <ResourceSkeleton /> : (
        <Card className="bg-card/86 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Historico de alteracoes</CardTitle>
            <CardDescription>Eventos ordenados por data de criacao.</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.length ? (
              <Table>
                <TableHeader><TableRow><TableHead>Evento</TableHead><TableHead>Entidade</TableHead><TableHead>Responsavel</TableHead><TableHead>Data</TableHead><TableHead>Resumo</TableHead></TableRow></TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell><Badge variant="outline">{item.action}</Badge></TableCell>
                      <TableCell>{item.entity}</TableCell>
                      <TableCell>{item.performedBy}</TableCell>
                      <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                      <TableCell className="min-w-64">{item.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <EmptyState icon={ClipboardList} title="Sem eventos" description="As alteracoes auditaveis aparecerao aqui." />}
          </CardContent>
        </Card>
      )}
    </>
  );
}
