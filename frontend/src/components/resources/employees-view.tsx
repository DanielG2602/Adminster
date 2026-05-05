"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeForm } from "@/components/resources/employee-form";
import { PageHeading } from "@/components/shared/page-heading";
import { BackendNotice } from "@/components/shared/backend-notice";
import { ResourceSkeleton } from "@/components/shared/resource-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useDepartments, useEmployees, usePositions } from "@/hooks/use-resources";
import { canAccess } from "@/lib/utils";
import type { Employee } from "@/types";

export function EmployeesView() {
  const { user } = useAuth();
  const departments = useDepartments();
  const positions = usePositions();
  const { data, isLoading, isError, refetch, save, remove } = useEmployees();
  const [editing, setEditing] = useState<Employee | undefined>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const backendUnavailable = departments.isError || positions.isError || isError;
  const canManage = canAccess(user?.role, ["ADMIN", "RH"]) && !backendUnavailable;

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return (data ?? []).filter((employee) => `${employee.name} ${employee.email}`.toLowerCase().includes(term));
  }, [data, query]);

  async function handleSave(employee: Employee) {
    await save.mutateAsync(employee);
    setOpen(false);
    setEditing(undefined);
  }

  return (
    <>
      <PageHeading
        title="Funcionarios"
        description="Cadastro, jornada, status e relacao com cargos e departamentos."
        action={{ label: "Novo funcionario", icon: Plus, onClick: () => setOpen(true), disabled: !canManage }}
      />
      {backendUnavailable ? (
        <BackendNotice
          onRetry={() => {
            departments.refetch();
            positions.refetch();
            refetch();
          }}
        />
      ) : (
      <>
      <div className="mb-4 flex max-w-md items-center gap-2 rounded-md border bg-card/80 px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input className="border-0 bg-transparent px-0 focus-visible:ring-0" placeholder="Buscar por nome ou email" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      {isLoading || departments.isLoading || positions.isLoading ? <ResourceSkeleton /> : (
        <Card className="bg-card/86 backdrop-blur-xl">
          <CardHeader><CardTitle>Base de pessoas</CardTitle><CardDescription>{filtered.length} registros encontrados.</CardDescription></CardHeader>
          <CardContent>
            {filtered.length ? (
              <Table>
                <TableHeader><TableRow><TableHead>Funcionario</TableHead><TableHead>Departamento</TableHead><TableHead>Cargo</TableHead><TableHead>Jornada</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Acoes</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filtered.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell><div className="font-medium">{employee.name}</div><div className="text-sm text-muted-foreground">{employee.email}</div></TableCell>
                      <TableCell>{departments.data?.find((department) => department.id === employee.departmentId)?.name ?? "-"}</TableCell>
                      <TableCell>{positions.data?.find((position) => position.id === employee.positionId)?.title ?? "-"}</TableCell>
                      <TableCell>{employee.workSchedule}</TableCell>
                      <TableCell><Badge variant={employee.status === "ACTIVE" ? "success" : "secondary"}>{employee.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" disabled={!canManage} onClick={() => { setEditing(employee); setOpen(true); }} aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" disabled={!canAccess(user?.role, ["ADMIN"])} onClick={() => remove.mutate(employee.id)} aria-label="Desativar"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <EmptyState icon={Users} title="Nenhum funcionario" description="Cadastre pessoas ou ajuste os filtros de busca." />}
          </CardContent>
        </Card>
      )}
      <Dialog open={open} title={editing ? "Editar funcionario" : "Novo funcionario"} onOpenChange={setOpen}>
        <EmployeeForm departments={departments.data ?? []} positions={positions.data ?? []} initial={editing} onSubmit={handleSave} onCancel={() => setOpen(false)} isSaving={save.isPending} />
      </Dialog>
      </>
      )}
    </>
  );
}
