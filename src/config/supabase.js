import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ FALTAN LAS VARIABLES DE ENTORNO DE SUPABASE EN EL BACKEND");
}

export const supabase = createClient(supabaseUrl, supabaseKey);