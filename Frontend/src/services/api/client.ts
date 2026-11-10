import axios from "axios";

/**
 * Central Axios client for the AgentPay Sentinel backend.
 *
 * The base URL is taken from the `VITE_API_URL` environment variable, falling
 * back to the local development API. Real per-resource service modules
 * (payments, testing, chaos, monitoring, policies, reports, settings) are
 * added in Phase 4; this client is the single configured transport they will
 * share.
 *
 * NOTE: This client performs no authentication. Auth/token handling will be
 * introduced alongside real endpoints and must never expose signing keys.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});
