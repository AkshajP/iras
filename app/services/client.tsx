import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://oqamddsbqijcyfombdaa.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYW1kZHNicWlqY3lmb21iZGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MTYzNDAsImV4cCI6MjAyMDk5MjM0MH0.NzgkqNfCE7n4e7f6_Gd4INiYJG4KMe5IvagkyFV-s74");

export default supabase;