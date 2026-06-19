import HomeClient from "@/components/HomeClient";
import { getCities } from "@/lib/getCities";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { cities } = await getCities();
  return <HomeClient cities={cities} />;
}
