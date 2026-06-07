export interface TryOnPiece {
  category: string;
  imageUrl: string;
}

export interface TryOnInput {
  basePhotoUrl: string;
  pieces: TryOnPiece[];
  prompt?: string;
}

export interface TryOnOutput {
  status: "pending" | "processing" | "completed" | "failed";
  imageUrl?: string;
  errorMessage?: string;
  providerJobId?: string;
}

export interface VirtualTryOnProvider {
  name: string;
  generate(input: TryOnInput): Promise<TryOnOutput>;
  getStatus(jobId: string): Promise<TryOnOutput>;
  buildPrompt(input: TryOnInput): string;
}
