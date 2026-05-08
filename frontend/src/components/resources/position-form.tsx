"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Department, Position } from "@/types";

type Props = {
  departments: Department[];
  initial?: Position;
  onSubmit: (position: Position) => void;
  onCancel: () => void;
  isSaving: boolean;
};

export function PositionForm({ departments, initial, onSubmit, onCancel, isSaving }: Props) {
  const [position, setPosition] = useState<Position>(
    initial ?? { id: "", title: "", departmentId: departments[0]?.id ?? "", level: "Pleno", salaryRange: "", status: "ACTIVE" }
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(position);
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <Field label="Titulo"><Input value={position.title} onChange={(event) => setPosition({ ...position, title: event.target.value })} required /></Field>
      <Field label="Departamento">
        <Select value={position.departmentId} onChange={(event) => setPosition({ ...position, departmentId: event.target.value })}>
          {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
        </Select>
      </Field>
      <Field label="Nivel">
        <Select value={position.level} onChange={(event) => setPosition({ ...position, level: event.target.value as Position["level"] })}>
          <option value="Junior">Junior</option>
          <option value="Pleno">Pleno</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
        </Select>
      </Field>
      <Field label="Faixa salarial"><Input value={position.salaryRange} onChange={(event) => setPosition({ ...position, salaryRange: event.target.value })} required /></Field>
      <Field label="Status">
        <Select value={position.status} onChange={(event) => setPosition({ ...position, status: event.target.value as Position["status"] })}>
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
