import type { Metadata } from "next";
import LiveHero from "@/components/LiveHero";
import SessionLog from "@/components/SessionLog";
import QuietBoundary from "@/components/QuietBoundary";
import GitHubStats from "@/components/GitHubStats";

export const metadata: Metadata = {
  title: "Doing · Josh Keegan",
  description: "A live readout of what Josh Keegan has open in his editor.",
};

export default function DoingPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-32 pt-16 md:px-12 md:pt-24">
      <section className="flex min-h-[60vh] flex-col justify-center">
        <QuietBoundary
          fallback={<p className="text-xs text-trace">The readout is offline.</p>}
        >
          <LiveHero />
        </QuietBoundary>
      </section>

      <section className="border-t border-rule pt-10">
        <GitHubStats />
      </section>

      <QuietBoundary>
        <SessionLog />
      </QuietBoundary>
    </div>
  );
}
