// 'use client'

// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import { SessionContextProvider } from '@supabase/auth-helpers-react'
// import { useState } from 'react'

// export function SupabaseProvider({ children }: { children: React.ReactNode }) {
//   const [supabase] = useState(() => createClientComponentClient())

//   return (
//     <SessionContextProvider supabaseClient={supabase}>
//       {children}
//     </SessionContextProvider>
//   )
// }

'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from './client'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}
