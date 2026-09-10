import { httpRouter } from "convex/server";
import { projectEvent } from "./project";
import { scheduleEvent } from "./schedule";

const http = httpRouter();

// The handlers live in their own modules so each owns its validation and
// storage; this file only wires paths to them.
http.route({ path: "/api/project", method: "POST", handler: projectEvent });
http.route({ path: "/api/schedule", method: "POST", handler: scheduleEvent });

export default http;
