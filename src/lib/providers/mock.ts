import type { VirtualTryOnProvider, TryOnInput, TryOnOutput } from "./types";

const MOCK_RESULT_IMAGE =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80";

function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockProvider: VirtualTryOnProvider = {
  name: "mock",

  async generate(input: TryOnInput): Promise<TryOnOutput> {
    const jobId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return {
      status: "processing",
      providerJobId: jobId,
    };
  },

  async getStatus(jobId: string): Promise<TryOnOutput> {
    await randomDelay(3000, 8000);

    const shouldFail = Math.random() < 0.1;

    if (shouldFail) {
      return {
        status: "failed",
        errorMessage: "Não foi possível gerar o look. Tente novamente.",
        providerJobId: jobId,
      };
    }

    return {
      status: "completed",
      imageUrl: MOCK_RESULT_IMAGE,
      providerJobId: jobId,
    };
  },

  buildPrompt(input: TryOnInput): string {
    const pieceList = input.pieces
      .map((p) => `${p.category}: ${p.imageUrl}`)
      .join("\n");

    return `Generate a hyper-realistic virtual try-on image.

BASE PHOTO: ${input.basePhotoUrl}

PIECES TO APPLY:
${pieceList}

RULES:
- Preserve the person's face, body, pose, hair, expression, proportions, framing, lighting, and environment exactly
- Replace only the clothing, shoes, and accessories with the provided pieces
- Apply each piece to the correct body position
- Maintain realistic fit, folds, shadows, and perspective
- Do not invent clothing not provided
- Prioritize photographic realism over creativity
- Output a single final image that looks like a real photograph`;
  },
};
