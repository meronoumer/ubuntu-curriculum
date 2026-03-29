export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-sm text-gray-500">
        Manage sessions, facilitators, and view submitted reports.
      </p>
      {/* Dashboard panels — coming in a later step */}
      <div className="grid grid-cols-2 gap-4">
        {["Sessions", "Facilitators", "Reports", "Analytics"].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
