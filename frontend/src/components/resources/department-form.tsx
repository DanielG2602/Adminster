"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Department } from "@/types";

type Props = {
  initial?: Department;
  onSubmit: (department: Department) => void;
  onCancel: () => void;
  isSaving: boolean;
};

export function DepartmentForm({ initial, onSubmit, onCancel, isSaving }: Props) {
  const [department, setDepartment] = useState<Department>(
    initial ?? { id: "", name: "", description: "", manager: "", employeesCount: 0, status: "ACTIVE" }
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(department);
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <Field label="Nome"><Input value={department.name} onChange={(event) => setDepartment({ ...department, name: event.target.value })} required /></Field>
      <Field label="Gestor"><Input value={department.manager} onChange={(event) => setDepartment({ ...department, manager: event.target.value })} required /></Field>
      <Field label="Descricao"><Input value={department.description} onChange={(event) => setDepartment({ ...department, description: event.target.value })} required /></Field>
      <Field label="Colaboradores"><Input type="number" value={department.employeesCount} onChange={(event) => setDepartment({ ...department, employeesCount: Number(event.target.value) })} /></Field>
      <Field label="Status">
        <Select value={department.status} onChange={(event) => setDepartment({ ...department, status: event.target.value as Department["status"] })}>
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </Select>
      </Field>
      <div className="flex items-end justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button disabled={isSaving}>Salvar</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}
