import { getGarageAccessData, getGarageSession } from "@/lib/garage-auth";
import { GarageShell } from "@/components/garage/GarageShell";

export default async function GaragePage() {
  const session = await getGarageSession();
  const access = session ? await getGarageAccessData(session.accessId) : null;

  return <GarageShell initialAccess={access} />;
}
