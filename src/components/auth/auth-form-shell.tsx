import Link from "next/link";

import { BookCopy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type AuthFormShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  alternateHref: string;
  alternateLabel: string;
  footerNote?: React.ReactNode;
};

export function AuthFormShell({
  children,
  title,
  description,
  alternateHref,
  alternateLabel,
  footerNote,
}: AuthFormShellProps) {
  return (
    <Card className="border-slate-200 bg-white/90 shadow-lg shadow-slate-950/5">
      <CardHeader className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Auth
        </Badge>
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <BookCopy className="size-6 text-teal-700" />
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-600">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <Separator />
        <p className="text-sm leading-6 text-slate-600">
          Validation runs through zod in server actions and sessions are handled
          with Supabase Auth on the server.
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-4 text-sm text-slate-600">
        <span>{footerNote ?? "Need a different entry point?"}</span>
        <Link
          href={alternateHref}
          className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-muted hover:text-slate-950"
        >
          {alternateLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}
