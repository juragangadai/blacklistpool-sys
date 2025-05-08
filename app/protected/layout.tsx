import { SupabaseProvider } from '@/lib/supabase/supabase-provider'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <SupabaseProvider>{children}</SupabaseProvider>
}