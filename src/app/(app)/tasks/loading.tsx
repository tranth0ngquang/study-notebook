export default function TasksLoading() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
      </div>
    </div>
  );
}
