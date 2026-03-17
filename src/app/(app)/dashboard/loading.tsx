export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-3xl bg-slate-200/70" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-56 animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="h-56 animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="h-56 animate-pulse rounded-3xl bg-slate-200/70" />
      </div>
    </div>
  );
}
