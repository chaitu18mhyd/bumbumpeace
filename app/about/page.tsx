"use client";

import Link from "next/link";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3 text-ink">
        <Info className="h-6 w-6" />
        <div>
          <h1 className="text-3xl font-bold">About me</h1>
        </div>
      </div>

      <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm sm:p-8">
        <p className="mt-2 text-base leading-8 text-muted sm:text-lg">
          This is an independent effort to help people choose a retirement city that
          lets them stretch savings, preserve dignity, and avoid running out of
          money. I built this tool to make retirement planning more transparent,
          more realistic, and more focused on living well without exhausting
          assets.
        </p>
        <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
          If you have an idea for an improvement, please request a feature so I
          can keep shaping the experience around what matters most: peace of mind,
          affordable living, and a retirement plan that feels sustainable.
        </p>

        <div className="mt-6 flex justify-between">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-3xl border border-sand px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand"
          >
            Back home
          </Link>
          <Link
            href="/request-feature"
            className="inline-flex items-center justify-center rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Request a feature
          </Link>
        </div>
      </section>
    </main>
  );
}
