"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle, Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { downloadCsvTemplate } from "@/utils/csv-helper"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/useUser"

interface BlacklistEntry {
  id: number
  nik: string
  leasing_name: string
  created_at: string
}

// Number of entries per page
const ENTRIES_PER_PAGE = 100

export function BlacklistApp() {
  const router = useRouter()
  const [nik, setNik] = useState("")
  const [leasingName, setLeasingName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [csvError, setCsvError] = useState<string | null>(null)
  const [allEntries, setAllEntries] = useState<BlacklistEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const { user, profile, isLoading: userLoading, refreshProfile } = useUser()
  const { toast } = useToast()

    // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch all entries on component mount
  useEffect(() => {
    fetchEntries()

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tbpooling_nik",
        },
        (payload) => {
          console.log("Change received!", payload)
          fetchEntries()
          fetchTotalCount()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [currentPage, searchQuery])

  // Fetch total count of entries (for pagination)
  const fetchTotalCount = async () => {
    try {
      let query = supabase.from("tbpooling_nik").select("id", { count: "exact" })

      // Apply search filter if there's a search query
      if (searchQuery) {
        query = query.or(`nik.ilike.%${searchQuery}%,leasing_name.ilike.%${searchQuery}%`)
      }

      const { count, error } = await query

      if (error) {
        throw error
      }

      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error fetching count:", error)
    }
  }

  const fetchEntries = async () => {
    try {
      setIsLoading(true)

      // Calculate pagination range
      const from = (currentPage - 1) * ENTRIES_PER_PAGE
      const to = from + ENTRIES_PER_PAGE - 1

      let query = supabase.from("tbpooling_nik").select("*").order("created_at", { ascending: false }).range(from, to)

      // Apply search filter if there's a search query
      if (searchQuery) {
        query = query.or(`nik.ilike.%${searchQuery}%,leasing_name.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setAllEntries(data || [])

      // Fetch total count for pagination
      fetchTotalCount()
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nik || !leasingName) {
      setError("Both NIK and Leasing Name are required")
      return
    }

    // Basic NIK validation (assuming Indonesian NIK is 16 digits)
    if (!/^\d{16}$/.test(nik)) {
      setError("NIK must be 16 digits")
      return
    }

    try {
      const { error } = await supabase.from("tbpooling_nik").insert([{ nik, leasing_name: leasingName }])

      if (error) {
        throw error
      }

      setNik("")
      setLeasingName("")
      setError(null)
    } catch (error: any) {
      setError(error.message || "Failed to add entry")
    }
  }

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string
        const lines = csvData.split("\n")

        const newEntries: { nik: string; leasing_name: string }[] = []
        let hasErrors = false

        // Skip header row if it exists
        const startIndex = lines[0].toLowerCase().includes("nik") ? 1 : 0

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          const [nik, leasingName] = line.split(",").map((item) => item.trim())

          if (!nik || !leasingName) {
            setCsvError(`Line ${i + 1}: Missing data`)
            hasErrors = true
            break
          }

          if (!/^\d{16}$/.test(nik)) {
            setCsvError(`Line ${i + 1}: NIK must be 16 digits`)
            hasErrors = true
            break
          }

          newEntries.push({ nik, leasing_name: leasingName })
        }

        if (!hasErrors && newEntries.length > 0) {
          const { error } = await supabase.from("tbpooling_nik").insert(newEntries)

          if (error) {
            throw error
          }

          setCsvError(null)
          e.target.value = ""
        }
      } catch (error: any) {
        setCsvError(error.message || "Failed to parse CSV file. Please check the format.")
      }
    }

    reader.readAsText(file)
  }

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / ENTRIES_PER_PAGE)

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
<div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <h1 className="text-2xl sm:text-3xl font-bold">Blacklist Data Pooling System</h1>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <span className="text-sm sm:text-base text-muted-foreground">Signed in as: {user?.email}</span>
      <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full sm:w-auto">
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  </div>

  <Tabs defaultValue="manual" className="w-full mb-8">
    <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <TabsTrigger value="manual">Manual Input</TabsTrigger>
      <TabsTrigger value="csv">CSV Upload</TabsTrigger>
      <TabsTrigger value="all-data">All Data</TabsTrigger>
    </TabsList>

    <TabsContent value="manual">
      <Card>
        <CardHeader>
          <CardTitle>Add Blacklist Entry</CardTitle>
          <CardDescription>Enter NIK (ID Card number) and leasing name to add to the blacklist.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (ID Card Number)</Label>
                <Input
                  id="nik"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Enter 16-digit NIK"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leasingName">Leasing Name</Label>
                <Input
                  id="leasingName"
                  value={leasingName}
                  onChange={(e) => setLeasingName(e.target.value)}
                  placeholder="Enter leasing name"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto sm:ml-auto">
              Add to Blacklist
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>

    <TabsContent value="csv">
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>Upload a CSV file with NIK and leasing name columns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {csvError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{csvError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="csvFile">CSV File</Label>
            <div className="grid w-full items-center gap-1.5">
              <Label
                htmlFor="csvFile"
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-background px-4 py-5 text-center"
              >
                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs text-muted-foreground mt-1">CSV format: NIK,LeasingName</div>
              </Label>
              <Input id="csvFile" type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={downloadCsvTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="all-data">
      <Card>
        <CardHeader>
          <CardTitle>All Blacklist Data</CardTitle>
          <CardDescription>View and search all blacklist entries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by NIK or leasing name..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading data...</div>
          ) : allEntries.length > 0 ? (
            <div className="border rounded-md overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
                <Table className="min-w-[600px]">
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>NIK (ID Card Number)</TableHead>
                      <TableHead>Leasing Name</TableHead>
                      <TableHead>Date Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEntries.map((entry, index) => (
                      <TableRow key={entry.id}>
                        <TableCell>{(currentPage - 1) * ENTRIES_PER_PAGE + index + 1}</TableCell>
                        <TableCell>{entry.nik}</TableCell>
                        <TableCell>{entry.leasing_name}</TableCell>
                        <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t gap-2 sm:gap-0">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{allEntries.length}</span> of{" "}
                  <span className="font-medium">{totalCount}</span> entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <div className="text-sm">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages || 1}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage >= totalPages}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {searchQuery ? "No matching entries found." : "No blacklist entries yet."}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>

  )
}
