export default async function Page({
  params,
}: {
  params: Promise<{ mistakeId: string }>;
}) {
  const { mistakeId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mistake Practice</h1>
      <p className="text-gray-600">ID: {mistakeId}</p>
    </div>
  );
}
