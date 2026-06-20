import HomeClient from "@/components/HomeClient";
import { getCities } from "@/lib/getCities";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const { cities } = await getCities();
    return <HomeClient cities={cities} />;
  } catch (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-sand bg-cream p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-ink">Unable to load cities</h1>
          <p className="mt-4 text-sm text-muted">
            The app could not fetch retirement city data. Please check your Supabase
            configuration and try again.
          </p>
          <p className="mt-4 text-sm text-muted">
            If you're running locally, make sure <span className="font-semibold">SUPABASE_URL</span>
            and <span className="font-semibold">SUPABASE_SERVICE_ROLE_KEY</span> are set.
          </p>
        </div>
      </main>
    );
  }
}
