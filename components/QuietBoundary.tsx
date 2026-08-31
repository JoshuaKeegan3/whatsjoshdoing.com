"use client";

import { Component, type ReactNode } from "react";

/**
 * Renders `fallback` if a child throws. The live sections depend on Convex,
 * so an outage or a query that has not been deployed yet should cost one
 * section rather than the whole page.
 */
export default class QuietBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
