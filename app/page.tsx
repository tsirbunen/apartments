import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Apartments</h1>
        <p className="text-gray-500 mb-10 text-sm">
          Browse curated apartment listings in Helsinki.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/apartments"
            className="bg-gray-900 text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Lauttasaari, Helsinki
          </Link>
        </div>
      </div>
    </div>
  )
}
