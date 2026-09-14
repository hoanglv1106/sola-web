export default async function Page({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">TOEIC Test</h1>
      <p className="text-gray-600">ID: {testId}</p>
    </div>
  );
}
