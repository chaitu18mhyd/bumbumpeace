import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated: June 20, 2026</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-ink">
        <section>
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted">
            By accessing and using BumBumSafe, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Use License</h2>
          <p className="text-muted">
            Permission is granted to temporarily download one copy of the materials (information or software) on BumBumSafe for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the site</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Scraping and Data Mining</h2>
          <p className="text-muted">
            The automated or manual collection, scraping, or bulk downloading of content from BumBumSafe is strictly prohibited without explicit written permission. This includes:
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted">
            <li>Using bots, crawlers, or scrapers to access the API or website</li>
            <li>Downloading or reproducing our city data for competing services</li>
            <li>Circumventing rate limits or authentication mechanisms</li>
            <li>Using our data to build derivative databases or products</li>
          </ul>
          <p className="mt-2 text-muted">
            Violators will be blocked from our service and may face legal action to protect our intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Disclaimer</h2>
          <p className="text-muted">
            The materials on BumBumSafe are provided on an 'as is' basis. BumBumSafe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="mt-2 text-muted">
            Retirement estimates are for informational purposes only and not financial advice. Costs, visa requirements, and conditions vary by individual circumstance. Consult a financial advisor before making retirement decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Limitations</h2>
          <p className="text-muted">
            In no event shall BumBumSafe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BumBumSafe, even if BumBumSafe or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Accuracy of Materials</h2>
          <p className="text-muted">
            The materials appearing on BumBumSafe could include technical, typographical, or photographic errors. BumBumSafe does not warrant that any of the materials on its website are accurate, complete, or current. BumBumSafe may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Links</h2>
          <p className="text-muted">
            BumBumSafe has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by BumBumSafe of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Modifications</h2>
          <p className="text-muted">
            BumBumSafe may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Rate Limiting</h2>
          <p className="text-muted">
            To ensure fair access for all users, BumBumSafe enforces rate limits on API requests. Unauthenticated users are limited to 60 requests per minute. Exceeding this limit will result in temporary access restriction. Attempting to circumvent rate limits is a violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Governing Law</h2>
          <p className="text-muted">
            These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section className="mt-8 border-t border-sand pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-3xl border border-sand px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand"
          >
            Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}
