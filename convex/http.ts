import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { workspaceEvent } from "./zed";

const http = httpRouter();

http.route({
  path: "/api/t3-presence",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      if (!body || (body.status !== "online" && body.status !== "offline")) {
        return Response.json({ error: "status must be online or offline" }, { status: 400 });
      }

      const required = [
        "projectName",
        "threadId",
        "threadUpdatedAt",
        "machineId",
        "occurredAt",
      ];
      if (required.some((key) => typeof body[key] !== "string")) {
        return Response.json({ error: "missing or invalid event fields" }, { status: 400 });
      }

      const id = await ctx.runMutation(internal.presence.record, {
        status: body.status,
        projectName: body.projectName,
        threadId: body.threadId,
        threadUpdatedAt: body.threadUpdatedAt,
        machineId: body.machineId,
        occurredAt: body.occurredAt,
      });
      return Response.json({ ok: true, id });
    } catch {
      return Response.json({ error: "invalid JSON request" }, { status: 400 });
    }
  }),
});

// The Zed handler lives in its own module so it owns its validation and
// storage; this file only wires the path to it.
http.route({ path: "/api/zed-workspace", method: "POST", handler: workspaceEvent });

export default http;
