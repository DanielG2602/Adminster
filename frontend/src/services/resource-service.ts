import { api } from "@/lib/api";
import type { AuditLog, DashboardMetrics, Department, Employee, Notification, Position } from "@/types";

async function requestData<T>(request: Promise<{ data: T }>): Promise<T> {
  const { data } = await request;
  return data;
}

export const dashboardService = {
  metrics: () => requestData<DashboardMetrics>(api.get("/dashboard/metrics"))
};

export const employeeService = {
  list: () => requestData<Employee[]>(api.get("/funcionarios")),
  create: (payload: Omit<Employee, "id">) => requestData<Employee>(api.post("/funcionarios", payload)),
  update: (id: string, payload: Omit<Employee, "id">) =>
    requestData<Employee>(api.put(`/funcionarios/${id}`, payload)),
  remove: (id: string) => requestData<void>(api.delete(`/funcionarios/${id}`))
};

export const departmentService = {
  list: () => requestData<Department[]>(api.get("/departamentos")),
  create: (payload: Omit<Department, "id">) => requestData<Department>(api.post("/departamentos", payload)),
  update: (id: string, payload: Omit<Department, "id">) =>
    requestData<Department>(api.put(`/departamentos/${id}`, payload)),
  remove: (id: string) => requestData<void>(api.delete(`/departamentos/${id}`))
};

export const positionService = {
  list: () => requestData<Position[]>(api.get("/cargos")),
  create: (payload: Omit<Position, "id">) => requestData<Position>(api.post("/cargos", payload)),
  update: (id: string, payload: Omit<Position, "id">) =>
    requestData<Position>(api.put(`/cargos/${id}`, payload)),
  remove: (id: string) => requestData<void>(api.delete(`/cargos/${id}`))
};

export const auditService = {
  list: () => requestData<AuditLog[]>(api.get("/auditoria"))
};

export const notificationService = {
  list: () => requestData<Notification[]>(api.get("/notificacoes"))
};
