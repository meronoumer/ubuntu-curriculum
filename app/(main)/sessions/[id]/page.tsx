export default async function SessionPlayerPage(
  props: PageProps<"/(main)/sessions/[id]">
) {
  const { id } = await props.params;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Session Player</h1>
      <p className="text-sm text-gray-500">Session ID: {id}</p>
      {/* Step-by-step player — coming in a later step */}
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
        Session content coming soon
      </div>
    </div>
  );
}
