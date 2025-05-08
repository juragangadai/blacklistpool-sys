export function downloadCsvTemplate() {
    // Create CSV content with header
    const csvContent = "NIK,LeasingName\n"
  
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  
    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob)
  
    // Create a temporary link element
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "blacklist-template.csv")
  
    // Append the link to the body
    document.body.appendChild(link)
  
    // Trigger the download
    link.click()
  
    // Clean up
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  