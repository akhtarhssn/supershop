'use client'

import { useState } from 'react'
import { Printer, Download, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

interface Props {
  orderId: string
  orderNumber: string
}

export default function OrderActionButtons({ orderId, orderNumber }: Props) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      
      // Get the token from local storage (matching api-client logic)
      const raw = localStorage.getItem("auth-storage")
      const parsed = JSON.parse(raw || '{}')
      const token = parsed?.state?.accessToken

      if (!token) {
        toast.error("You must be logged in to download the invoice.")
        return
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to download invoice')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success("Invoice downloaded successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Could not download invoice. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline" 
        onClick={handlePrint}
        className="flex-1 md:flex-none h-11 rounded-xl border-gray-100 gap-2 font-bold text-xs print:hidden"
      >
        <Printer className="w-4 h-4" />
        Print Invoice
      </Button>
      <Button 
        disabled={isDownloading}
        onClick={handleDownload}
        className="flex-1 md:flex-none h-11 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] gap-2 font-bold text-xs shadow-lg shadow-indigo-600/20 print:hidden"
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isDownloading ? "Generating..." : "Download PDF"}
      </Button>
    </div>
  )
}
