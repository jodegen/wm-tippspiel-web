import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlayerProfile } from "@/lib/api/players";
import { ApiError } from "@/lib/api/client";
import { Container } from "@/components/layout/Container";
import { StatsSummary } from "@/components/profile/StatsSummary";
import { FormSparkline } from "@/components/profile/FormSparkline";
import { TipHistory } from "@/components/profile/TipHistory";
import {
  DistributionChart,
  PointsProgressionChart,
} from "@/components/profile/ProfileCharts";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { EmptyState } from "@/components/feedback/EmptyState";
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
      <div className="mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
        <Avatar name={profile.displayName} className="h-14 w-14 text-lg" />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">
            {profile.displayName}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Spielerprofil</span>
            {profile.rank != null ? <Badge>Rang {profile.rank}</Badge> : null}
          </div>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <StatsSummary profile={profile} />
        {profile.history.length > 0 ? (
          <div className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Form
            </span>
            <FormSparkline history={profile.history} />
            <span className="ml-auto text-xs text-muted-foreground">
              letzte {Math.min(12, profile.history.length)} Tipps
            </span>
          </div>
        ) : null}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="history">Historie</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Punkteverlauf</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.history.length > 0 ? (
                  <PointsProgressionChart history={profile.history} />
                ) : (
                  <EmptyState title="Noch keine Daten" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-sm">
                  Punktstufen-Verteilung
                  <InfoTooltip text="4 P = exakter Treffer · 3 P = richtige Tordifferenz · 2 P = richtige Tendenz · 0 P = daneben" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart distribution={profile.distribution} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <TipHistory
            history={profile.history}
            bestTip={profile.bestTip}
            worstTip={profile.worstTip}
          />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
