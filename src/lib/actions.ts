"use server";

import { createClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";
import { validateFile, getImageDimensions } from "@/lib/utils/validators";
import { STORAGE_BUCKETS } from "@/lib/utils/constants";
import type { PieceCategory } from "@/types";
import { revalidatePath } from "next/cache";

const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log("[actions] isDemo:", isDemo, "URL:", !!process.env.NEXT_PUBLIC_SUPABASE_URL, "ANON:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// In-memory store for demo mode (persists within the server process)
const demoSavedLooks: any[] = [];

export async function uploadPiece(formData: FormData): Promise<{ success: false; error: string } | { success: true; piece: any }> {
  if (isDemo) {
    const file = formData.get("file") as File;
    const category = formData.get("category") as PieceCategory;
    const slotKey = formData.get("slotKey") as string || category;
    const base64Data = formData.get("base64") as string;

    if (!file || !category) {
      return { success: false, error: "Arquivo e categoria são obrigatórios" };
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error || "Erro de validação" };
    }

    const piece = {
      id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user_id: "demo",
      category,
      slot_key: slotKey,
      image_url: base64Data || URL.createObjectURL(file),
      mime_type: file.type,
      width: null,
      height: null,
      created_at: new Date().toISOString(),
    };

    return { success: true, piece };
  }

  const { client: supabase, user } = await createClient();

  console.log("[uploadPiece] User:", user?.id || null);

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const file = formData.get("file") as File;
  const category = formData.get("category") as PieceCategory;
  const slotKey = (formData.get("slotKey") as string) || category;

  console.log("[uploadPiece] File:", file?.name, "Category:", category, "SlotKey:", slotKey);

  if (!file || !category) {
    return { success: false, error: "Arquivo e categoria são obrigatórios" };
  }

  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error || "Erro de validação" };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  console.log("[uploadPiece] Uploading to storage:", fileName);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.pieces)
    .upload(fileName, file);

  console.log("[uploadPiece] Upload result:", uploadData, "Error:", uploadError?.message);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.pieces).getPublicUrl(uploadData.path);

  const dimensions = await getImageDimensions(file).catch(() => ({
    width: null,
    height: null,
  }));

  console.log("[uploadPiece] Inserting into DB:", { user_id: user.id, category, image_url: publicUrl });

  const { data: piece, error: dbError } = await supabase
    .from("pieces")
    .insert({
      user_id: user.id,
      category,
      slot_key: slotKey,
      image_url: publicUrl,
      mime_type: file.type,
      width: dimensions.width,
      height: dimensions.height,
    })
    .select()
    .single();

  console.log("[uploadPiece] DB result:", piece, "Error:", dbError?.message);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  revalidatePath("/pecas");
  return { success: true, piece };
}

export async function uploadBasePhoto(formData: FormData): Promise<{ success: false; error: string } | { success: true; photo: any }> {
  if (isDemo) {
    const file = formData.get("file") as File;
    const base64Data = formData.get("base64") as string;
    if (!file) {
      return { success: false, error: "Arquivo é obrigatório" };
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error || "Erro de validação" };
    }

    const photo = {
      id: `demo-photo-${Date.now()}`,
      user_id: "demo",
      image_url: base64Data || URL.createObjectURL(file),
      width: null,
      height: null,
      created_at: new Date().toISOString(),
    };

    return { success: true, photo };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "Arquivo é obrigatório" };
  }

  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error || "Erro de validação" };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.basePhotos)
    .upload(fileName, file);

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.basePhotos).getPublicUrl(uploadData.path);

  const dimensions = await getImageDimensions(file).catch(() => ({
    width: null,
    height: null,
  }));

  const { data: photo, error: dbError } = await supabase
    .from("base_photos")
    .insert({
      user_id: user.id,
      image_url: publicUrl,
      width: dimensions.width,
      height: dimensions.height,
    })
    .select()
    .single();

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  revalidatePath("/foto");
  return { success: true, photo };
}

export async function createLook(pieceIds: string[]): Promise<{ success: false; error: string } | { success: true; look: any }> {
  if (isDemo) {
    const look = {
      id: `demo-look-${Date.now()}`,
      user_id: "demo",
      status: "ready",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    revalidatePath("/composicao");
    return { success: true, look };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: look, error: lookError } = await supabase
    .from("looks")
    .insert({
      user_id: user.id,
      status: "ready",
    })
    .select()
    .single();

  if (lookError) {
    return { success: false, error: lookError.message };
  }

  const lookPieces = pieceIds.map((pieceId, index) => ({
    look_id: look.id,
    piece_id: pieceId,
    slot_name: `slot_${index}`,
    sort_order: index,
  }));

  const { error: lpError } = await supabase
    .from("look_pieces")
    .insert(lookPieces);

  if (lpError) {
    return { success: false, error: lpError.message };
  }

  revalidatePath("/composicao");
  return { success: true, look };
}

export async function startGeneration(lookId: string, basePhotoId: string): Promise<{ success: false; error: string } | { success: true; generationId: string; providerJobId?: string }> {
  if (isDemo) {
    return {
      success: true,
      generationId: `demo-gen-${Date.now()}`,
      providerJobId: undefined,
    };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: basePhoto, error: photoError } = await supabase
    .from("base_photos")
    .select("*")
    .eq("id", basePhotoId)
    .eq("user_id", user.id)
    .single();

  if (photoError || !basePhoto) {
    return { success: false, error: "Foto base não encontrada" };
  }

  const { data: lookPieces, error: lpError } = await supabase
    .from("look_pieces")
    .select("piece_id, slot_name, pieces(*)")
    .eq("look_id", lookId);

  if (lpError || !lookPieces || lookPieces.length === 0) {
    return { success: false, error: "Look sem peças" };
  }

  const pieces = lookPieces.map((lp: any) => ({
    category: lp.pieces?.category || "top",
    imageUrl: lp.pieces?.image_url || "",
  }));

  const provider = getProvider();
  const prompt = provider.buildPrompt({
    basePhotoUrl: basePhoto.image_url,
    pieces,
  });

  console.log("[startGeneration] Calling provider with:", {
    basePhotoUrl: basePhoto.image_url,
    pieces,
    prompt,
  });

  const result = await provider.generate({
    basePhotoUrl: basePhoto.image_url,
    pieces,
    prompt,
  });

  if (result.status === "failed") {
    return { success: false, error: result.errorMessage || "Falha na geração" };
  }

  const { data: generation, error: genError } = await supabase
    .from("generations")
    .insert({
      look_id: lookId,
      base_photo_id: basePhotoId,
      status: "pending",
      provider: provider.name,
      prompt_used: prompt,
      payload: { providerJobId: result.providerJobId },
    })
    .select()
    .single();

  if (genError) {
    return { success: false, error: genError.message };
  }

  await supabase
    .from("looks")
    .update({ status: "generating" })
    .eq("id", lookId);

  return { success: true, generationId: generation.id, providerJobId: result.providerJobId };
}

export async function pollGeneration(generationId: string, jobId: string): Promise<{ status: "completed"; resultId?: string; imageUrl?: string } | { status: "failed"; errorMessage?: string } | { status: "processing" }> {
  if (isDemo || !jobId) {
    return { status: "processing" };
  }

  const provider = getProvider();
  const result = await provider.getStatus(jobId);

  if (result.status === "completed") {
    const { client: supabase } = await createClient();

    const { data: savedResult, error: resultError } = await supabase
      .from("results")
      .insert({
        generation_id: generationId,
        image_url: result.imageUrl,
      })
      .select()
      .single();

    if (resultError) {
      return { status: "failed", errorMessage: resultError.message };
    }

    await supabase
      .from("generations")
      .update({ status: "completed", completed_at: new Date().toISOString() })
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

    return {
      status: "completed",
      resultId: savedResult.id,
      imageUrl: result.imageUrl,
    };
  }

  if (result.status === "failed") {
    const { client: supabase } = await createClient();
    await supabase
      .from("generations")
      .update({ status: "failed", error_message: result.errorMessage, completed_at: new Date().toISOString() })
      .eq("id", generationId);

    return { status: "failed", errorMessage: result.errorMessage };
  }

  return { status: "processing" };
}

export async function getGenerationStatus(generationId: string): Promise<{ error: string } | { generation: any }> {
  return { generation: { id: generationId, status: "completed" } };
}

export async function saveLook(resultId: string, lookId: string): Promise<{ success: false; error: string } | { success: true; savedLook: any }> {
  if (isDemo) {
    const savedLook = {
      id: `demo-saved-${Date.now()}`,
      user_id: "demo",
      result_id: resultId,
      look_id: lookId,
      favorite: false,
      created_at: new Date().toISOString(),
      result: {
        id: resultId,
        image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
      },
    };
    demoSavedLooks.unshift(savedLook);
    revalidatePath("/meus-looks");
    return { success: true, savedLook };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: savedLook, error: dbError } = await supabase
    .from("saved_looks")
    .insert({
      user_id: user.id,
      result_id: resultId,
      look_id: lookId,
      favorite: false,
    })
    .select()
    .single();

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  revalidatePath("/meus-looks");
  return { success: true, savedLook };
}

export async function getSavedLooks(): Promise<{ success: false; error: string } | { success: true; looks: any[] }> {
  if (isDemo) {
    return { success: true, looks: demoSavedLooks };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: looks, error: dbError } = await supabase
    .from("saved_looks")
    .select(`
      *,
      result:results(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  return { success: true, looks: looks || [] };
}

export async function deleteSavedLook(savedLookId: string): Promise<{ success: false; error: string } | { success: true }> {
  if (isDemo) {
    revalidatePath("/meus-looks");
    return { success: true };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { error: dbError } = await supabase
    .from("saved_looks")
    .delete()
    .eq("id", savedLookId)
    .eq("user_id", user.id);

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  revalidatePath("/meus-looks");
  return { success: true };
}

export async function toggleFavorite(savedLookId: string): Promise<{ success: false; error: string } | { success: true; savedLook: any }> {
  if (isDemo) {
    return { success: true, savedLook: { id: savedLookId, favorite: true } };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: current, error: fetchError } = await supabase
    .from("saved_looks")
    .select("favorite")
    .eq("id", savedLookId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !current) {
    return { success: false, error: "Look não encontrado" };
  }

  const { data: savedLook, error: updateError } = await supabase
    .from("saved_looks")
    .update({ favorite: !current.favorite })
    .eq("id", savedLookId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/meus-looks");
  return { success: true, savedLook };
}

export async function getProfile(): Promise<{ success: false; error: string } | { success: true; profile: any }> {
  if (isDemo) {
    return { success: true, profile: { id: "demo", name: "Demo User", email: "demo@luuk.app" } };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: profile, error: dbError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (dbError) {
    return { success: false, error: dbError.message };
  }

  return { success: true, profile };
}

export async function getUserCredits(): Promise<{ success: false; error: string } | { success: true; credits: any }> {
  if (isDemo) {
    return {
      success: true,
      credits: {
        user_id: "demo",
        total_generations: 0,
        credits_remaining: 5,
        max_credits: 5,
      },
    };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: credits, error: dbError } = await supabase
    .from("user_credits")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (dbError) {
    if (dbError.code === "PGRST116") {
      const { data: newCredits, error: insertError } = await supabase
        .from("user_credits")
        .insert({ user_id: user.id, credits_remaining: 5, max_credits: 5 })
        .select()
        .single();

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      return { success: true, credits: newCredits };
    }
    return { success: false, error: dbError.message };
  }

  return { success: true, credits };
}

export async function checkAndConsumeCredit(): Promise<{ success: false; error: string } | { success: true; creditsRemaining: number }> {
  if (isDemo) {
    return { success: true, creditsRemaining: 4 };
  }

  const { client: supabase, user } = await createClient();

  if (!user) {
    return { success: false, error: "Não autenticado" };
  }

  const { data: credits, error: fetchError } = await supabase
    .from("user_credits")
    .select("credits_remaining")
    .eq("user_id", user.id)
    .single();

  if (fetchError) {
    if (fetchError.code === "PGRST116") {
      await supabase
        .from("user_credits")
        .insert({ user_id: user.id, credits_remaining: 5, max_credits: 5 });

      const { data: newCredits } = await supabase
        .from("user_credits")
        .select("credits_remaining")
        .eq("user_id", user.id)
        .single();

      const remaining = newCredits?.credits_remaining ?? 5;

      if (remaining <= 0) {
        return { success: false, error: "Créditos esgotados. Aguarde a renovação." };
      }

      await supabase
        .from("user_credits")
        .update({
          credits_remaining: remaining - 1,
          total_generations: 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      return { success: true, creditsRemaining: remaining - 1 };
    }
    return { success: false, error: fetchError.message };
  }

  if (!credits || credits.credits_remaining <= 0) {
    return { success: false, error: "Créditos esgotados. Aguarde a renovação." };
  }

  const { error: updateError } = await supabase
    .from("user_credits")
    .update({
      credits_remaining: credits.credits_remaining - 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, creditsRemaining: credits.credits_remaining - 1 };
}
