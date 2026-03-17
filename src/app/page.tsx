import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/supabase/server";

const mvpChecklist = [
  "Supabase Auth with protected personal workspace access",
  "Courses, lectures, structured lecture notes, tasks, materials, review, and search",
  "Private storage, row-level security, and per-user ownership assumptions",
  "Manual local-video review via timestamps without server-side video upload",
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.16),_transparent_35%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,1)_100%)] px-6 py-10 text-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit">
              Production MVP
            </Badge>
            <div className="space-y-2">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance">
                Study Workspace is ready for real course and lecture management.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                A focused single-user study workspace for courses, lecture
                notes, manual video review timestamps, tasks, materials, review,
                and search.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {user ? "Open workspace" : "Go to auth"}
            </Link>
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {user ? "Go to dashboard" : "Create account"}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <Card className="border-slate-200/80 bg-white/85 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle>What the app covers</CardTitle>
              <CardDescription>
                The MVP is built around one authenticated user and a private
                Supabase-backed study workflow.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {mvpChecklist.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-slate-950 text-slate-50 shadow-sm">
            <CardHeader>
              <CardTitle>Implementation notes</CardTitle>
              <CardDescription className="text-slate-300">
                Keep Supabase migrations current and verify the storage bucket
                before running live file workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-200">
              <p>
                All core flows are implemented locally and verified with type
                check, lint, and production build.
              </p>
              <p>
                Private lecture materials depend on the `lecture-materials`
                bucket and the service-role key for server-side storage actions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
