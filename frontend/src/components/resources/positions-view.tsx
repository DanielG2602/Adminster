"use client";

import { useState } from "react";
import { BriefcaseBusiness, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PositionForm } from "@/components/resources/position-form";
import { PageHeading } from "@/components/shared/page-heading";
import { BackendNotice } from "@/components/shared/backend-notice";
import { ResourceSkeleton } from "@/components/shared/resource-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useDepartments, usePositions } from "@/hooks/use-resources";
import { canAccess } from "@/lib/utils";
import type { Position } from "@/types";

export function PositionsView() {
  const { user } = useAuth();
  const departments = useDepartments();
  const { data, isLoading, isError, refetch, save, remove } = usePositions();
  const [editing, setEditing] = useState<Position | undefined>();
  const [open, setOpen] = useState(false);
  const canManage = canAccess(user?.role, ["ADMIN"]) && !isError && !departments.isError;

  async function handleSave(position: Position) {
    await save.mutateAsync(position);
    setOpen(false);
    setEditing(undefined);
  }

  return (
    <>
      <PageHeading
        title="Cargos"
        description="Mantenha trilhas, niveis e faixas salariais conectadas aos departamentos."
        action={{ label: "Novo cargo", icon: Plus, onClick: () => setOpen(true), disabled: !canManage }}
      />
      {isError || departments.isError ? (
        <BackendNotice
          onRetry={() => {
            refetch();
            departments.refetch();
          }}
        />
      ) : isLoading || departments.isLoading ? <ResourceSkeleton /> : (
        <Card className="bg-card/86 backdrop-blur-xl">
          <CardHeader><CardTitle>Catalogo de cargos</CardTitle><CardDescription>{data?.length ?? 0} cargos ativos ou historicos.</CardDescription></CardHeader>
          <CardContent>
            {data?.length ? (
              <Table>
                <TableHeader><TableRow><TableHead>Cargo</TableHead><TableHead>Departamento</TableHead><TableHead>Nivel</TableHead><TableHead>Faixa</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Acoes</TableHead></TableRow></TableHeader>
                <TableBody>
                  {data.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.title}</TableCell>
                      <TableCell>{departments.data?.find((department) => department.id === position.departmentId)?.name ?? "-"}</TableCell>
                      <TableCell>{position.level}</TableCell>
                      <TableCell>{position.salaryRange}</TableCell>
                      <TableCell><Badge variant={position.status === "ACTIVE" ? "success" : "secondary"}>{position.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" disabled={!canManage} onClick={() => { setEditing(position); setOpen(true); }} aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" disabled={!canManage} onClick={() => remove.mutate(position.id)} aria-label="Remover"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <EmptyState icon={BriefcaseBusiness} title="Nenhum cargo" description="Cadastre cargos para vincular funcionarios e regras de acesso." />}
          </CardContent>
        </Card>
      )}
      <Dialog open={open} title={editing ? "Editar cargo" : "Novo cargo"} onOpenChange={setOpen}>
        <PositionForm departments={departments.data ?? []} initial={editing} onSubmit={handleSave} onCancel={() => setOpen(false)} isSaving={save.isPending} />
      </Dialog>
    </>
  );
}
