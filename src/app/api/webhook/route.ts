import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { generationId, status, imageUrl, errorMessage } = body;

    if (!generationId) {
      return NextResponse.json(
        { error: "generationId é obrigatório" },
        { status: 400 }
      );
    }

    const { client: supabase } = await createClient();

    if (status === "completed" && imageUrl) {
      await supabase
        .from("results")
        .insert({
          generation_id: generationId,
          image_url: imageUrl,
        });

      await supabase
        .from("generations")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", generationId);

      const { data: generation } = await supabase
        .from("generations")
        .select("look_id")
        .eq("id", generationId)
        .single();

      if (generation) {
        await supabase
          .from("looks")
          .update({ status: "completed" })
          .eq("id", generation.look_id);
      }
    }

    if (status === "failed") {
      await supabase
        .from("generations")
        .update({
          status: "failed",
          error_message: errorMessage,
          completed_at: new Date().toISOString(),
        })
        .eq("id", generationId);

      const { data: generation } = await supabase
        .from("generations")
        .select("look_id")
        .eq("id", generationId)
        .single();

      if (generation) {
        await supabase
          .from("looks")
          .update({ status: "failed" })
          .eq("id", generation.look_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
