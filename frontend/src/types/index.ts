export type Role = "ADMIN" | "RH" | "GESTOR";

export type Status = "ACTIVE" | "INACTIVE";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: User;
};

export type Department = {
  id: string;
  name: string;
  description: string;
  manager: string;
  employeesCount: number;
  status: Status;
};

export type Position = {
  id: string;
  title: string;
  departmentId: string;
  level: "Junior" | "Pleno" | "Senior" | "Lead";
  salaryRange: string;
  status: Status;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  workSchedule: string;
  status: Status;
  hiredAt: string;
};

export type AuditLog = {
  id: string;
  entity: "Funcionario" | "Departamento" | "Cargo" | "Permissao";
  action: string;
  performedBy: string;
  createdAt: string;
  summary: string;
};

export type Notification = {
  id: string;
  title: string;
  channel: "Email" | "Push";
  status: "Sent" | "Queued" | "Failed";
  audience: string;
  createdAt: string;
};

export type DashboardMetrics = {
  employees: number;
  departments: number;
  positions: number;
  activeSchedules: number;
  notificationsQueued: number;
  auditEventsToday: number;
};
