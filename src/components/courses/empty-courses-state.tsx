import Link from "next/link";

import { BookOpenText } from "lucide-react";

type EmptyCoursesStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyCoursesState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyCoursesStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
          <BookOpenText className="size-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {actionHref && actionLabel ? (
          <Link
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href={actionHref}
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
