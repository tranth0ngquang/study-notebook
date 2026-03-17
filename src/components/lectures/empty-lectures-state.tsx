import { NotebookPen } from "lucide-react";

type EmptyLecturesStateProps = {
  title: string;
  description: string;
};

export function EmptyLecturesState({
  title,
  description,
}: EmptyLecturesStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
          <NotebookPen className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
