import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayerProfile } from "@/lib/api/players";
import { ApiError } from "@/lib/api/client";
import { Container } from "@/components/layout/Container";
import { StatsSummary } from "@/components/profile/StatsSummary";
import { TierDistribution } from "@/components/profile/TierDistribution";
import { TipHistory } from "@/components/profile/TipHistory";
import { ErrorState } from "@/components/feedback/ErrorState";
import type { Profile } from "@/lib/api/types";

export const metadata: Metadata = { title: "Spielerprofil" };

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let profile: Profile;
  try {
    profile = await getPlayerProfile(id);
  } catch (error) {
    if (error instanceof ApiError && error.kind === "not-found") {
      notFound();
    }
    return (
      <Container>
        <ErrorState />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">
        {profile.displayName}
      </h1>
      <p className="mb-6 text-sm text-slate-500">Spielerprofil</p>

      <section className="mb-8" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Statistiken
        </h2>
        <StatsSummary profile={profile} />
      </section>

      <section className="mb-8" aria-labelledby="tiers-heading">
        <h2 id="tiers-heading" className="mb-3 text-lg font-semibold text-slate-900">
          Punktstufen-Verteilung
        </h2>
        <TierDistribution distribution={profile.distribution} />
      </section>

      <section aria-labelledby="history-heading">
        <h2
          id="history-heading"
          className="mb-3 text-lg font-semibold text-slate-900"
        >
          Tipp-Historie
        </h2>
        <TipHistory
          history={profile.history}
          bestTip={profile.bestTip}
          worstTip={profile.worstTip}
        />
      </section>
    </Container>
  );
}
