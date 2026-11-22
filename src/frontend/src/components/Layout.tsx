import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();
  const host = typeof window === "undefined" ? "" : window.location.hostname;
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted/40 px-4 py-5">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-1 text-center">
          <p className="text-xs text-muted-foreground">
            小贴士：使用 5mm 拼豆 · 150–160°C 熨烫 10–15 秒
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(host)}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            © {year}. Built with love using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
  step,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-subtle",
        className,
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          {step !== undefined && (
            <span className="grid size-6 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">
              {step}
            </span>
          )}
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}
