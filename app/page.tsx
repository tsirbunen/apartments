import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        Löydä asuntosi Helsingistä
      </h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        Selaa myytäviä asuntoja, rajaa hakua ja tallenna omat hakusi, jotta voit palata niihin myöhemmin.
      </p>
      <Link
        href="/apartments"
        className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
      >
        Selaa asuntoja
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}
