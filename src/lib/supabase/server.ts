import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function createClient() {
  const cookieStore = await cookies();

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return createMockClient();
  }

  // Create server client with anon key to get user from cookies
  const authClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // No-op in server actions / server components
      },
    },
  });

  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  // Create service client using supabase-js directly to bypass RLS
  const serviceClient = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });

  return { client: serviceClient, user };
}

function createMockFilterBuilder(hasData = false) {
  const builder: any = {
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    lt: () => builder,
    gte: () => builder,
    lte: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    rangeGt: () => builder,
    rangeGte: () => builder,
    rangeLt: () => builder,
    rangeLte: () => builder,
    rangeAdjacent: () => builder,
    overlaps: () => builder,
    textSearch: () => builder,
    match: () => builder,
    not: () => builder,
    or: () => builder,
    filter: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    select: () => createMockFilterBuilder(hasData),
    single: async () => ({ data: hasData ? { id: "mock-id" } : null, error: null }),
    maybeSingle: async () => ({ data: hasData ? { id: "mock-id" } : null, error: null }),
  };
  return builder;
}

function createMockClient() {
  const mockUser = { id: "demo-user", email: "demo@luuk.app" };
  return {
    client: {
      auth: {
        getUser: async () => ({
          data: { user: mockUser },
          error: null,
        }),
      },
      from: () => ({
        select: () => createMockFilterBuilder(),
        insert: () => createMockFilterBuilder(true),
        update: () => createMockFilterBuilder(),
        upsert: () => createMockFilterBuilder(true),
        delete: () => createMockFilterBuilder(),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: "mock-path" }, error: null }),
          getPublicUrl: () => ({
            data: { publicUrl: "https://via.placeholder.com/400x600?text=Demo" },
          }),
        }),
      },
    },
    user: mockUser,
  };
}
