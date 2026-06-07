import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    return {
      auth: {
        signInWithPassword: async () => ({ error: null, data: { user: { id: "demo" } } }),
        signInWithOtp: async () => ({ error: null, data: {} }),
        signUp: async () => ({ error: null, data: { user: { id: "demo" } } }),
        getUser: async () => ({ data: { user: { id: "demo", email: "demo@luuk.app" } }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: async () => ({ data: [], error: null }),
          }),
          order: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        insert: async () => ({ select: () => ({ single: async () => ({ data: { id: "mock-id" }, error: null }) }) }),
        update: async () => ({ eq: async () => ({ data: null, error: null }) }),
        delete: async () => ({ eq: async () => ({ data: null, error: null }) }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: "mock-path" }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "https://via.placeholder.com/400x600?text=Demo" } }),
        }),
      },
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
