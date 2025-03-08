import { auth } from "@/auth";
import Console from "@/app/(tabs)/console/_components/console-container";

export default async function ConsolePage() {
  const session = await auth();

  return <Console serverUser={session?.user?.username} />;
}
