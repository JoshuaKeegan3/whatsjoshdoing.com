import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = "JoshuaKeegan3";

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100`,
      { headers, next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch GitHub events:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub events" },
      { status: 500 },
    );
  }
}
