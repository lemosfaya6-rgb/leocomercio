import { createClient } from "@supabase/supabase-js";

// These are the same keys used in server.ts
// In a real production app, these should be environment variables (VITE_SUPABASE_URL, etc.)
const supabaseUrl = "https://qejgsfjxqqtbakcrdfpk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlamdzZmp4cXF0YmFrY3JkZnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjgxNzAsImV4cCI6MjA5MDAwNDE3MH0.7hKhEMu3WpIaz1BZ6uSh43jbf2qxrL2EHQ66TGjWljc";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getSupabaseData(key: string) {
  try {
    const { data, error } = await supabase.from("app_data").select("value").eq("key", key).single();
    if (error) throw error;
    return data?.value;
  } catch (err) {
    console.error(`Error fetching ${key} from Supabase:`, err);
    return null;
  }
}

export async function saveSupabaseData(key: string, value: any) {
  try {
    const { error } = await supabase.from("app_data").upsert({ key, value });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to Supabase:`, err);
    return false;
  }
}
