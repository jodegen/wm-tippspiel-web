import { redirect } from "next/navigation";

/** Einstieg: leitet auf den Spielplan weiter. */
export default function HomePage() {
  redirect("/spielplan");
}
