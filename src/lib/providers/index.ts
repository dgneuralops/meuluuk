import type { VirtualTryOnProvider } from "./types";
import { mockProvider } from "./mock";
import { replicateProvider } from "./replicate";

const providers: Record<string, VirtualTryOnProvider> = {
  mock: mockProvider,
  replicate: replicateProvider,
};

export function getProvider(): VirtualTryOnProvider {
  const providerName = process.env.VIRTUAL_TRYON_PROVIDER || "mock";
  return providers[providerName] || mockProvider;
}
