import { Construction, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type BackendNoticeProps = {
  onRetry?: () => void;
};

export function BackendNotice({ onRetry }: BackendNoticeProps) {
  return (
    <Card className="border-amber-200 bg-amber-50 text-amber-950 shadow-none dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-amber-100 dark:bg-amber-900/60">
            <Construction className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Backend em construcao</p>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
              Esta tela ja esta pronta para conectar na API. Quando o backend responder, este aviso desaparece e os
              dados reais serao exibidos automaticamente.
            </p>
          </div>
        </div>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry} className="bg-transparent">
            <RefreshCcw className="h-4 w-4" />
            Tentar novamente
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
