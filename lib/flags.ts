/**
 * Ländername → Flaggen-Emoji, rein clientseitig (keine Backend-Änderung, keine
 * externen Requests). Unbekannte Namen liefern null (keine Flagge).
 *
 * Werte sind entweder ISO-3166-Alpha-2-Codes (werden zu Regional-Indicator-Emojis
 * konvertiert) oder direkt ein Emoji (z. B. England/Schottland/Wales).
 */
const NAME_TO_CODE: Record<string, string> = {
  // CONMEBOL
  argentina: "ar", brazil: "br", uruguay: "uy", colombia: "co", chile: "cl",
  peru: "pe", ecuador: "ec", paraguay: "py", venezuela: "ve", bolivia: "bo",
  // UEFA
  germany: "de", france: "fr", spain: "es", england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", portugal: "pt",
  netherlands: "nl", belgium: "be", italy: "it", croatia: "hr", switzerland: "ch",
  denmark: "dk", poland: "pl", serbia: "rs", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  austria: "at", ukraine: "ua", sweden: "se", norway: "no", "czechia": "cz",
  "czech republic": "cz", turkey: "tr", "türkiye": "tr", greece: "gr",
  romania: "ro", hungary: "hu", "republic of ireland": "ie", ireland: "ie",
  "northern ireland": "gb", "bosnia and herzegovina": "ba", "bosnia-herzegovina": "ba", slovenia: "si",
  slovakia: "sk", iceland: "is", finland: "fi", albania: "al", "north macedonia": "mk",
  // CONCACAF
  "united states": "us", usa: "us", mexico: "mx", canada: "ca", "costa rica": "cr",
  panama: "pa", jamaica: "jm", honduras: "hn", "el salvador": "sv", "trinidad and tobago": "tt",
  haiti: "ht", curacao: "cw", "curaçao": "cw",
  // CAF
  morocco: "ma", senegal: "sn", tunisia: "tn", "south africa": "za", ghana: "gh",
  cameroon: "cm", nigeria: "ng", algeria: "dz", egypt: "eg", "ivory coast": "ci",
  "côte d'ivoire": "ci", mali: "ml", "cape verde": "cv", "cabo verde": "cv",
  "cape verde islands": "cv", "dr congo": "cd", "congo dr": "cd",
  "democratic republic of the congo": "cd",
  // AFC
  japan: "jp", "south korea": "kr", "korea republic": "kr", "saudi arabia": "sa",
  iran: "ir", "ir iran": "ir", australia: "au", qatar: "qa", iraq: "iq",
  "united arab emirates": "ae", uae: "ae", uzbekistan: "uz", jordan: "jo",
  oman: "om", china: "cn", india: "in", indonesia: "id", thailand: "th",
  vietnam: "vn", "new zealand": "nz",
};

function codeToEmoji(code: string): string {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
}

/** Liefert das Flaggen-Emoji zu einem Teamnamen oder null. */
export function flagEmoji(name: string): string | null {
  const key = name.trim().toLowerCase();
  const value = NAME_TO_CODE[key];
  if (!value) return null;
  return value.length === 2 ? codeToEmoji(value) : value;
}
