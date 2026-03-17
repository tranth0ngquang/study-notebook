export default function CoursesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-3xl bg-slate-200/70" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200/70" />
      </div>
    </div>
  );
}
