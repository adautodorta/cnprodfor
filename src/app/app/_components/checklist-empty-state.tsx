import { ClipboardX } from "lucide-react";

type ChecklistEmptyStateProps = {
  title: string;
  description: string;
};

export function ChecklistEmptyState({ title, description }: ChecklistEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center h-48">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <ClipboardX className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}