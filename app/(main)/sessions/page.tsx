export default function SessionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Sessions</h1>
      <p className="text-sm text-gray-500">
        Your assigned sessions will appear here.
      </p>
      {/* Session list — coming in a later step */}
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
        No sessions loaded yet
      </div>
    </div>
  );
}
