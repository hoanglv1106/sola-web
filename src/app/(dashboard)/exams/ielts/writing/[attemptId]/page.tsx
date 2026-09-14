export default async function Page({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">IELTS Writing Attempt</h1>
      <p className="text-gray-600">ID: {attemptId}</p>
    </div>
  );
}
