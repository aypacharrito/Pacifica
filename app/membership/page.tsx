import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ensureSchema, getSql, TERMS_VERSION } from "../../lib/db";
import MembershipClient from "./membership-client";

export const dynamic = "force-dynamic";

export default async function MembershipPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/membership");
  await currentUser();
  let alreadyAccepted = false;
  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`SELECT id FROM membership_acceptances WHERE clerk_user_id=${userId} AND terms_version=${TERMS_VERSION} LIMIT 1`;
    alreadyAccepted = rows.length > 0;
  } catch {}
  return <main className="member-page legal-page"><header><Link href="/" className="brand brand-logo" aria-label="Pacifica Legal Insurance home"/><UserButton /></header><section><MembershipClient alreadyAccepted={alreadyAccepted} /></section></main>;
}
