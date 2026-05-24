import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nrazatxdcrxfqsogtxka.supabase.co";

const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yYXphdHhkY3J4ZnFzb2d0eGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTM2NTAsImV4cCI6MjA5NDA2OTY1MH0.cVSSBm7Rwucb6UiKVw_1vSGlvZLzifQ6jINM7GOF0wk";

export const supabase = createClient(supabaseUrl, supabaseKey);