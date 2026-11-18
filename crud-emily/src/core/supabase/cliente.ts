import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const clave = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !clave) {
  throw new Error("Faltan las variables de Supabase");
}

export const supabase = createClient(url, clave, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});