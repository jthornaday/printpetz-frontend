import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(process.env.supabaseUrl, process.env.supabaseKey, {
  auth: { flowType: "pkce" },
});

export const auth = supabase.auth;
