// Type stubs to silence IDE errors for Supabase Edge Functions.
// These files run in Deno, not Node.js — the real types are provided at runtime.

declare module "https://esm.sh/@supabase/supabase-js@2.39.7" {
  export { createClient } from "@supabase/supabase-js";
}

declare module "jsr:@supabase/functions-js/edge-runtime.d.ts" {}

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};
