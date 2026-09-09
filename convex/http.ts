import { httpRouter } from "convex/server";
import { projectEvent } from "./project";

const http = httpRouter();

// The handler lives in its own module so it owns its validation and storage;
// this file only wires the path to it.
http.route({ path: "/api/project", method: "POST", handler: projectEvent });

export default http;
