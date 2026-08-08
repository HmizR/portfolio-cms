export interface HealthPayload {
  status: "ok";
}

export function createHealthPayload(): HealthPayload {
  return { status: "ok" };
}
