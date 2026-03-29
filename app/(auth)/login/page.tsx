export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Ubuntu Curriculum</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* Login form — logic comes in a later step */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              disabled
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              disabled
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-400 bg-gray-50"
            />
          </div>
          <button
            disabled
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
          >
            Sign in (coming soon)
          </button>
        </div>
      </div>
    </main>
  );
}
