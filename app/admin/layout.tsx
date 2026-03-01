import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE_NAME, isAdminSessionTokenValid } from '@/lib/admin-auth'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!isAdminSessionTokenValid(token)) {
    redirect('/admin-access')
  }

  return <>{children}</>
}
