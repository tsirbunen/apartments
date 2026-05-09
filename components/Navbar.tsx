'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const link = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={`text-sm transition-colors hover:text-gray-900 ${active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4">
      <div className="max-w-6xl mx-auto flex items-center h-14 gap-6">
        {link('/', 'Etusivu')}
        {link('/apartments', 'Myytävät asunnot')}
      </div>
    </nav>
  )
}
