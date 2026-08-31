import { NextResponse } from "next/server";

const USERNAME = "JoshuaKeegan3";

/**
 * Today's count from the public contribution graph, which is the number that
 * shows on Josh's GitHub profile.
 *
 * The events API was the wrong source: it reports pushes, not commits, and
 * anonymous responses omit `payload.size` entirely. This endpoint needs no
 * token, so it cannot break when a fine-grained PAT expires, and it counts
 * private-repo work when profile visibility allows it.
 *
 * It is undocumented HTML, so a markup change must read as "unknown" rather
 * than as a wrong number: every failure path returns count: null.
 */
export async function GET() {
  // The graph is rendered in the viewer's timezone; the server runs in NZ.
  const today = new Date().toLocaleDateString("en-CA");

  try {
    const response = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
      headers: { "User-Agent": "whatsjoshdoing.com" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({ count: null, date: today }, { status: 200 });
    }

    const html = await response.text();

    const cell = html.match(new RegExp(`<td[^>]*data-date="${today}"[^>]*>`))?.[0];
    const id = cell?.match(/id="([^"]+)"/)?.[1];
    const tip = id
      ? html.match(new RegExp(`<tool-tip[^>]*for="${id}"[^>]*>([^<]*)`))?.[1]
      : undefined;

    // "No contributions on August 31st." is a real zero, not a parse failure.
    const count = tip?.trim().startsWith("No") ? 0 : Number(tip?.match(/^(\d+)/)?.[1] ?? Number.NaN);

    return NextResponse.json({
      count: Number.isNaN(count) ? null : count,
      date: today,
    });
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    return NextResponse.json({ count: null, date: today }, { status: 200 });
  }
}
