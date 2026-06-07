import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client: supabase, user } = await createClient();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id: generationId } = await params;

    const { data: generation, error } = await supabase
      .from("generations")
      .select("*, results(*)")
      .eq("id", generationId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (generation.status === "pending" || generation.status === "processing") {
      const provider = getProvider();
      if (generation.payload?.providerJobId) {
        const providerResult = await provider.getStatus(
          generation.payload.providerJobId as string
        );

        if (providerResult.status === "completed" && providerResult.imageUrl) {
          await supabase
            .from("results")
            .insert({
              generation_id: generationId,
              image_url: providerResult.imageUrl,
            });

          await supabase
            .from("generations")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
            })
            .eq("id", generationId);

          await supabase
            .from("looks")
            .update({ status: "completed" })
            .eq("id", generation.look_id);

          return NextResponse.json({
            status: "completed",
            imageUrl: providerResult.imageUrl,
          });
        }

        if (providerResult.status === "failed") {
          await supabase
            .from("generations")
            .update({
              status: "failed",
              error_message: providerResult.errorMessage,
              completed_at: new Date().toISOString(),
            })
            .eq("id", generationId);

          return NextResponse.json({
            status: "failed",
            errorMessage: providerResult.errorMessage,
          });
        }
      }
    }

    return NextResponse.json({
      status: generation.status,
      result: generation.results?.[0] || null,
      errorMessage: generation.error_message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
