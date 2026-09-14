import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h2 className="text-4xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-6">Could not find requested resource</p>
      <Link
        href="/home"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
