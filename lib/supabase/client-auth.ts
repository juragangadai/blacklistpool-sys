import { createBrowserClient } from "@supabase/ssr"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Direct instance for components that need it
export const supabase = createClientComponentClient()

// Function for components that expect createClient
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}