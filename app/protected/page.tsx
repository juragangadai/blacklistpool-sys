import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlacklistApp } from "@/components/blacklist-app"

export default async function ProtectedPage() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Auth error:", error.message)
      redirect("/auth/login")
    }

    if (!data?.session) {
      redirect("/auth/login")
    }

    return <BlacklistApp />
  } catch (error) {
    console.error("Unexpected error in protected page:", error)
    redirect("/auth/login")
  }
}