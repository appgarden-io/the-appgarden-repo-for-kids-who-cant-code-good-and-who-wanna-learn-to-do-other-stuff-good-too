import { delay, HttpResponse, http } from "msw";

export const handlers = [
  http.get("/api/health", async () => {
    await delay(500);
    return HttpResponse.json({ status: "ok" });
  }),
];
