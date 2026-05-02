'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      // 🔐 Not logged in
      if (!token || !user) {
        router.replace('/user/home')
        return
      }

      const userData = JSON.parse(user)

      // 🔁 Redirect based on role
      if (userData.role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/user/home')
      }
    } catch (error) {
      router.replace('/signin')
    }
  }, [router])

  return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <LoadingSpinner size={60} />
      </div>
  )
}
