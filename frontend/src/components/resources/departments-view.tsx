"use client";

import { useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DepartmentForm } from "@/components/resources/department-form";
import { PageHeading } from "@/components/shared/page-heading";
import { BackendNotice } from "@/components/shared/backend-notice";
import { ResourceSkeleton } from "@/components/shared/resource-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useDepartments } from "@/hooks/use-resources";
import { canAccess } from "@/lib/utils";
import type { Department } from "@/types";

export function DepartmentsView() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch, save, remove } = useDepartments();
  const [editing, setEditing] = useState<Department | undefined>();
  const [open, setOpen] = useState(false);
  const canManage = canAccess(user?.role, ["ADMIN"]) && !isError;

  async function handleSave(department: Department) {
    await save.mutateAsync(department);
    setOpen(false);
    setEditing(undefined);
  }

  return (
    <>
      <PageHeading
        title="Departamentos"
        description="Organize areas, gestores e capacidade operacional da empresa."
        action={{ label: "Novo departamento", icon: Plus, onClick: () => setOpen(true), disabled: !canManage }}
      />

      {isError ? <BackendNotice onRetry={() => refetch()} /> : isLoading ? <ResourceSkeleton /> : (
        <Card className="bg-card/86 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Mapa organizacional</CardTitle>
            <CardDescription>{data?.length ?? 0} departamentos cadastrados.</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.length ? (
              <Table>
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Gestor</TableHead><TableHead>Pessoas</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Acoes</TableHead></TableRow></TableHeader>
                <TableBody>
                  {data.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell><div className="font-medium">{department.name}</div><div className="text-sm text-muted-foreground">{department.description}</div></TableCell>
                      <TableCell>{department.manager}</TableCell>
                      <TableCell>{department.employeesCount}</TableCell>
                      <TableCell><Badge variant={department.status === "ACTIVE" ? "success" : "secondary"}>{department.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" disabled={!canManage} onClick={() => { setEditing(department); setOpen(true); }} aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" disabled={!canManage} onClick={() => remove.mutate(department.id)} aria-label="Remover"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <EmptyState icon={Building2} title="Nenhum departamento" description="Crie departamentos para estruturar cargos e funcionarios." />}
          </CardContent>
        </Card>
      )}

      <Dialog open={open} title={editing ? "Editar departamento" : "Novo departamento"} onOpenChange={setOpen}>
        <DepartmentForm initial={editing} onSubmit={handleSave} onCancel={() => setOpen(false)} isSaving={save.isPending} />
      </Dialog>
    </>
  );
}
