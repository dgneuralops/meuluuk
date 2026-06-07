import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";

export async function POST(request: Request) {
  try {
    const { client: supabase, user } = await createClient();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { lookId, basePhotoId } = body;

    if (!lookId || !basePhotoId) {
      return NextResponse.json(
        { error: "lookId e basePhotoId são obrigatórios" },
        { status: 400 }
      );
    }

    const { data: look } = await supabase
      .from("looks")
      .select("*, look_pieces(*, piece(*))")
      .eq("id", lookId)
      .eq("user_id", user.id)
      .single();

    if (!look) {
      return NextResponse.json({ error: "Look não encontrado" }, { status: 404 });
    }

    const { data: basePhoto } = await supabase
      .from("base_photos")
      .select("*")
      .eq("id", basePhotoId)
      .eq("user_id", user.id)
      .single();

    if (!basePhoto) {
      return NextResponse.json(
        { error: "Foto base não encontrada" },
        { status: 404 }
      );
    }

    const lookData: any = look;
    const basePhotoData: any = basePhoto;
    const provider = getProvider();
    const pieces = (lookData.look_pieces || []).map((lp: any) => ({
      category: lp.piece?.category || "other",
      imageUrl: lp.piece?.image_url || "",
    }));

    const input = {
      basePhotoUrl: basePhotoData.image_url,
      pieces,
      prompt: provider.buildPrompt({
        basePhotoUrl: basePhotoData.image_url,
        pieces,
      }),
    };

    const { data: generation, error: genError } = await supabase
      .from("generations")
      .insert({
        look_id: lookId,
        base_photo_id: basePhotoId,
        status: "pending",
        provider: provider.name,
        prompt_used: input.prompt,
        payload: input,
      })
      .select()
      .single();

    if (genError) {
      return NextResponse.json(
        { error: genError.message },
        { status: 500 }
      );
    }

    await supabase
      .from("looks")
      .update({ status: "generating" })
      .eq("id", lookId);

    const result = await provider.generate(input);

    return NextResponse.json({
      generationId: generation.id,
      providerJobId: result.providerJobId,
      status: result.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
