import { Suspense } from "react";
import DoingContent from "./DoingContent";

export default function Home() {
  return (
    <Suspense>
      <DoingContent />
    </Suspense>
  );
}
