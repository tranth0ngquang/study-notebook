import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="max-w-lg space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-950">Page not found</h1>
        <p className="text-sm leading-6 text-slate-600">
          The page you requested does not exist or is no longer available in
          this workspace.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
