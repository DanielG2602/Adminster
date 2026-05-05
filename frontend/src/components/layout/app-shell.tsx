"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { cn, initials } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Funcionarios", icon: Users },
  { href: "/departments", label: "Departamentos", icon: Building2 },
  { href: "/positions", label: "Cargos", icon: BriefcaseBusiness },
  { href: "/audit", label: "Auditoria", icon: ClipboardList },
  { href: "/notifications", label: "Notificacoes", icon: Bell }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-card/80 backdrop-blur-xl lg:flex lg:flex-col">
        <Sidebar pathname={pathname} />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Adminster</p>
              <h1 className="text-base font-semibold sm:text-lg">{currentTitle(pathname)}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Badge variant="outline" className="hidden sm:inline-flex">
              <ShieldCheck className="mr-1 h-3 w-3" />
              {user?.role}
            </Badge>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user ? initials(user.name) : "AD"}
            </div>
            <Button size="icon" variant="ghost" onClick={signOut} aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b bg-card/70 px-4 py-2 lg:hidden">
          {navigation.map((item) => (
            <MobileNavItem key={item.href} item={item} active={pathname === item.href} />
          ))}
        </nav>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <>
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold">Adminster</p>
            <p className="text-sm text-muted-foreground">People admin OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function MobileNavItem({
  item,
  active
}: {
  item: (typeof navigation)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-muted-foreground",
        active && "bg-primary text-primary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

function currentTitle(pathname: string) {
  return navigation.find((item) => item.href === pathname)?.label ?? "Dashboard";
}
