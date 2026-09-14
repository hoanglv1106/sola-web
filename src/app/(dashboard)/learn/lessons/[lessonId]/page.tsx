export default async function Page({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lesson Detail</h1>
      <p className="text-gray-600">ID: {lessonId}</p>
    </div>
  );
}
