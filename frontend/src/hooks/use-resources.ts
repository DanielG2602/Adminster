"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  auditService,
  dashboardService,
  departmentService,
  employeeService,
  notificationService,
  positionService
} from "@/services/resource-service";
import type { Department, Employee, Position } from "@/types";

export function useDashboardMetrics() {
  return useQuery({ queryKey: ["dashboard-metrics"], queryFn: dashboardService.metrics });
}

export function useAuditLogs() {
  return useQuery({ queryKey: ["audit-logs"], queryFn: auditService.list });
}

export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: notificationService.list });
}

export function useDepartments() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["departments"], queryFn: departmentService.list });

  const save = useMutation({
    mutationFn: (payload: Department) =>
      payload.id
        ? departmentService.update(payload.id, stripId(payload))
        : departmentService.create(stripId(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({ title: "Departamento salvo" });
    },
    onError: () => {
      toast({ title: "Backend em construcao", description: "Nao foi possivel salvar agora.", variant: "error" });
    }
  });

  const remove = useMutation({
    mutationFn: departmentService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({ title: "Departamento removido" });
    },
    onError: () => {
      toast({ title: "Backend em construcao", description: "Nao foi possivel remover agora.", variant: "error" });
    }
  });

  return { ...query, save, remove };
}

export function usePositions() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["positions"], queryFn: positionService.list });

  const save = useMutation({
    mutationFn: (payload: Position) =>
      payload.id ? positionService.update(payload.id, stripId(payload)) : positionService.create(stripId(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast({ title: "Cargo salvo" });
    },
    onError: () => {
      toast({ title: "Backend em construcao", description: "Nao foi possivel salvar agora.", variant: "error" });
    }
  });

  const remove = useMutation({
    mutationFn: positionService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast({ title: "Cargo removido" });
    },
    onError: () => {
      toast({ title: "Backend em construcao", description: "Nao foi possivel remover agora.", variant: "error" });
    }
  });

  return { ...query, save, remove };
}

export function useEmployees() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["employees"], queryFn: employeeService.list });

  const save = useMutation({
    mutationFn: (payload: Employee) =>
      payload.id ? employeeService.update(payload.id, stripId(payload)) : employeeService.create(stripId(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Funcionario salvo" });
    },
    onError: () => {
      toast({ title: "Backend em construcao", description: "Nao foi possivel salvar agora.", variant: "error" });
    }
  });

  const remove = useMutation({
    mutationFn: employeeService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Funcionario desativado" });
    },
    onError: () => {
      toast({ title: "Backend em construcao", description: "Nao foi possivel desativar agora.", variant: "error" });
    }
  });

  return { ...query, save, remove };
}

function stripId<T extends { id: string }>(payload: T): Omit<T, "id"> {
  const { id: _id, ...rest } = payload;
  return rest;
}
