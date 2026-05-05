"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Department, Employee, Position } from "@/types";

type Props = {
  departments: Department[];
  positions: Position[];
  initial?: Employee;
  onSubmit: (employee: Employee) => void;
  onCancel: () => void;
  isSaving: boolean;
};

export function EmployeeForm({ departments, positions, initial, onSubmit, onCancel, isSaving }: Props) {
  const [employee, setEmployee] = useState<Employee>(
    initial ?? {
      id: "",
      name: "",
      email: "",
      phone: "",
      departmentId: departments[0]?.id ?? "",
      positionId: positions[0]?.id ?? "",
      workSchedule: "Seg-Sex 09:00-18:00",
      status: "ACTIVE",
      hiredAt: new Date().toISOString().slice(0, 10)
    }
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(employee);
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <Field label="Nome"><Input value={employee.name} onChange={(event) => setEmployee({ ...employee, name: event.target.value })} required /></Field>
      <Field label="Email"><Input type="email" value={employee.email} onChange={(event) => setEmployee({ ...employee, email: event.target.value })} required /></Field>
      <Field label="Telefone"><Input value={employee.phone} onChange={(event) => setEmployee({ ...employee, phone: event.target.value })} required /></Field>
      <Field label="Departamento">
        <Select value={employee.departmentId} onChange={(event) => setEmployee({ ...employee, departmentId: event.target.value })}>
          {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
        </Select>
      </Field>
      <Field label="Cargo">
        <Select value={employee.positionId} onChange={(event) => setEmployee({ ...employee, positionId: event.target.value })}>
          {positions.map((position) => <option key={position.id} value={position.id}>{position.title}</option>)}
        </Select>
      </Field>
      <Field label="Jornada"><Input value={employee.workSchedule} onChange={(event) => setEmployee({ ...employee, workSchedule: event.target.value })} required /></Field>
      <Field label="Admissao"><Input type="date" value={employee.hiredAt} onChange={(event) => setEmployee({ ...employee, hiredAt: event.target.value })} required /></Field>
      <Field label="Status">
        <Select value={employee.status} onChange={(event) => setEmployee({ ...employee, status: event.target.value as Employee["status"] })}>
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
