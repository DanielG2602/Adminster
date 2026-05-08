import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

type PageHeadingProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    disabled?: boolean;
  };
};

export function PageHeading({ title, description, action }: PageHeadingProps) {
  const Icon = action?.icon;

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action && Icon ? (
        <Button onClick={action.onClick} disabled={action.disabled}>
          <Icon className="h-4 w-4" />
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
