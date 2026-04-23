import { redirect } from 'next/navigation';

export default async function AlarmLogDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/logs?alarmId=${id}`);
}
