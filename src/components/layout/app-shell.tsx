"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sparkles,
} from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { logoutAction } from "@/lib/auth/actions";
import { appNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(30,41,59,0.98)_18%,_rgba(248,250,252,1)_18%,_rgba(248,250,252,1)_100%)]">
      <header className="border-b border-white/10 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 text-slate-50 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium uppercase tracking-[0.24em] text-teal-200">
              <Sparkles className="size-3.5" />
              Study MVP
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                Study Workspace
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Personal lecture management workspace for courses, lecture notes,
                timestamps, materials, tasks, and review.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-slate-200">
            Signed in as <span className="font-medium text-white">{userEmail}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <nav className="space-y-1">
            {appNavigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-600">
            Personal workspace with private ownership, manual local-video review
            timestamps, and course-scoped materials, tasks, review, and search.
          </div>

          <form action={logoutAction} className="mt-4">
            <LogoutButton />
          </form>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
