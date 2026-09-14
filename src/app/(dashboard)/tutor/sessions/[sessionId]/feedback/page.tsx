export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tutor Session Feedback</h1>
      <p className="text-gray-600">ID: {sessionId}</p>
    </div>
  );
}
