"use client";

import { FormEvent, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BackendNotice } from "@/components/shared/backend-notice";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState("admin@adminster.local");
  const [password, setPassword] = useState("adminster");
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await signIn({ email, password });
      setBackendUnavailable(false);
      toast({ title: "Sessao iniciada", description: "Bem-vindo ao Adminster." });
    } catch {
      setBackendUnavailable(true);
      toast({
        title: "Backend em construcao",
        description: "A API de autenticacao ainda nao respondeu.",
        variant: "error"
      });
    }
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold">Adminster</p>
            <p className="text-sm text-muted-foreground">Gestao administrativa</p>
          </div>
          <ThemeToggle />
        </div>

        {backendUnavailable ? <BackendNotice /> : null}

        <Card className={backendUnavailable ? "mt-4 bg-card/86 backdrop-blur-xl" : "bg-card/86 backdrop-blur-xl"}>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Acesse o painel com perfil Admin, RH ou Gestor.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <Button className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
