export default function CourseDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-3xl bg-slate-200/70" />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200/70" />
      </div>
    </div>
  );
}
