export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_35%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(226,232,240,1)_100%)] px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between rounded-[2rem] bg-slate-950 p-8 text-slate-50 shadow-xl shadow-slate-950/10">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-teal-200">
              Study workspace
            </span>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance">
                A focused workspace for lectures, notes, tasks, materials, and review.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300">
                Sign in to a private single-user study workspace backed by
                Supabase Auth, Postgres, and Storage.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
              Personal ownership model with row-level security across all user data.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
              Local video review uses manual timestamps only. No server-side video upload.
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
