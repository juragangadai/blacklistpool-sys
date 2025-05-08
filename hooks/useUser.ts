// "use client"

// import { useState, useEffect } from "react"
// import { supabase } from "@/lib/supabase/client"
// import type { User } from "@supabase/supabase-js"

// export interface UserProfile {
//   id: string
//   full_name?: string
//   email?: string
//   phone?: string
//   role?: string
//   avatar_url?: string
//   updated_at?: string
// }

// interface UseUserReturn {
//   user: User | null
//   profile: UserProfile | null
//   isLoading: boolean
//   error: Error | null
//   refreshProfile: () => Promise<void>
// }

// export function useUser(): UseUserReturn {
//   const [user, setUser] = useState<User | null>(null)
//   const [profile, setProfile] = useState<UserProfile | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [error, setError] = useState<Error | null>(null)

//   const fetchUserAndProfile = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       // First check if we have a session
//       const { data: sessionData } = await supabase.auth.getSession()

//       // If no session, don't try to get user (avoids the "Auth session missing!" error)
//       if (!sessionData.session) {
//         setUser(null)
//         setProfile(null)
//         setIsLoading(false)
//         return
//       }

//       // Get the authenticated user
//       const { data: userData, error: userError } = await supabase.auth.getUser()

//       if (userError) {
//         throw userError
//       }

//       if (!userData.user) {
//         setUser(null)
//         setProfile(null)
//         setIsLoading(false)
//         return
//       }

//       setUser(userData.user)

//       // Fetch the user's profile
//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", userData.user.id)
//         .single()

//       if (profileError && profileError.code !== "PGRST116") {
//         // PGRST116 is "no rows returned" error
//         console.error("Error fetching profile:", profileError)
//       }

//       if (profileData) {
//         setProfile(profileData as UserProfile)
//       } else {
//         // Create a default profile if none exists
//         const defaultProfile: UserProfile = {
//           id: userData.user.id,
//           full_name: userData.user.email?.split("@")[0] || "User",
//           email: userData.user.email,
//           role: "User",
//           updated_at: new Date().toISOString(),
//         }

//         const { error: insertError } = await supabase.from("profiles").insert(defaultProfile)

//         if (insertError) {
//           console.error("Error creating profile:", insertError)
//         } else {
//           setProfile(defaultProfile)
//         }
//       }
//     } catch (err) {
//       console.error("Error in useUser hook:", err)
//       setError(err instanceof Error ? err : new Error(String(err)))
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Function to manually refresh the profile
//   const refreshProfile = async () => {
//     if (user) {
//       try {
//         const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

//         if (error && error.code !== "PGRST116") {
//           throw error
//         }

//         if (data) {
//           setProfile(data as UserProfile)
//         }
//       } catch (err) {
//         console.error("Error refreshing profile:", err)
//       }
//     }
//   }

//   useEffect(() => {
//     // Only run in browser environment
//     if (typeof window !== "undefined") {
//       fetchUserAndProfile()

//       // Subscribe to auth changes
//       const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//         if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
//           fetchUserAndProfile()
//         } else if (event === "SIGNED_OUT") {
//           setUser(null)
//           setProfile(null)
//         }
//       })

//       // Cleanup
//       return () => {
//         authListener.subscription.unsubscribe()
//       }
//     }
//   }, [])

//   // Set up profile changes subscription when user is available
//   useEffect(() => {
//     if (!user || typeof window === "undefined") return

//     const profileChannel = supabase
//       .channel(`profile-changes-${user.id}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "profiles",
//           filter: `id=eq.${user.id}`,
//         },
//         (payload) => {
//           console.log("Profile change detected:", payload)
//           refreshProfile()
//         },
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(profileChannel)
//     }
//   }, [user])

//   return { user, profile, isLoading, error, refreshProfile }
// }

// "use client"

// import { useState, useEffect } from "react"
// import { supabase } from "@/lib/supabase/client"
// import type { User } from "@supabase/supabase-js"

// export interface UserProfile {
//   id: string
//   full_name?: string
//   email?: string
//   phone?: string
//   role?: string
//   avatar_url?: string
//   updated_at?: string
// }

// interface UseUserReturn {
//   user: User | null
//   profile: UserProfile | null
//   isLoading: boolean
//   error: Error | null
//   refreshProfile: () => Promise<void>
// }

// export function useUser(): UseUserReturn {
//   const [user, setUser] = useState<User | null>(null)
//   const [profile, setProfile] = useState<UserProfile | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [error, setError] = useState<Error | null>(null)

//   const fetchUserAndProfile = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const { data: sessionData } = await supabase.auth.getSession()

//       if (!sessionData.session) {
//         setUser(null)
//         setProfile(null)
//         setIsLoading(false)
//         return
//       }

//       const { data: userData, error: userError } = await supabase.auth.getUser()
//       if (userError) throw userError

//       if (!userData.user) {
//         setUser(null)
//         setProfile(null)
//         setIsLoading(false)
//         return
//       }

//       setUser(userData.user)

//       const { data: profileData, error: profileError } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", userData.user.id)
//         .single()

//       if (profileError) {
//         if (profileError.code === "PGRST116") {
//           console.warn("Profile not found.")
//         } else {
//           throw profileError
//         }
//       }

//       if (profileData) {
//         setProfile(profileData as UserProfile)
//       } else {
//         setProfile(null)
//       }
//     } catch (err) {
//       console.error("Error in useUser hook:", err)
//       setError(err instanceof Error ? err : new Error(String(err)))
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const refreshProfile = async () => {
//     if (user) {
//       try {
//         const { data, error } = await supabase
//           .from("profiles")
//           .select("*")
//           .eq("id", user.id)
//           .single()

//         if (error && error.code !== "PGRST116") throw error

//         if (data && JSON.stringify(data) !== JSON.stringify(profile)) {
//           setProfile(data as UserProfile)
//         }
//       } catch (err) {
//         console.error("Error refreshing profile:", err)
//       }
//     }
//   }

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       fetchUserAndProfile()

//       const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
//         if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
//           fetchUserAndProfile()
//         } else if (event === "SIGNED_OUT") {
//           setUser(null)
//           setProfile(null)
//         }
//       })

//       return () => {
//         authListener.subscription.unsubscribe()
//       }
//     }
//   }, [])

//   useEffect(() => {
//     if (!user || typeof window === "undefined") return
  
//     const profileChannel = supabase
//       .channel(`profile-changes-${user.id}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "profiles",
//           filter: `id=eq.${user.id}`,
//         },
//         (payload) => {
//           console.log("📡 Profile change detected:", payload)
//           refreshProfile()
//         }
//       )
  
//     // Langganan channel
//     profileChannel.subscribe((status) => {
//       if (status === "SUBSCRIBED") {
//         console.log("✅ Subscribed to profile changes")
//       }
//     })
  
//     // Cleanup saat unmount / user berubah
//     return () => {
//       supabase.removeChannel(profileChannel)
//     }
//   }, [user])
  
  

//   return { user, profile, isLoading, error, refreshProfile }
// }

"use client"

import { useSession, useUser as useSupabaseUser } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  full_name?: string
  email?: string
  phone?: string
  role?: string
  avatar_url?: string
  updated_at?: string
}

interface UseUserReturn {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  error: Error | null
  refreshProfile: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const session = useSession()
  const user = useSupabaseUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      if (!user) {
        setProfile(null)
        return
      }

      console.log("🧪 Fetching profile for user:", user.id)

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      console.log("📦 Fetched profile data:", data)
      console.log("❌ Profile error:", error)

      if (error) throw error

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = fetchProfile

  useEffect(() => {
    fetchProfile()
  }, [user])

  return { user, profile, isLoading, error, refreshProfile }
}

