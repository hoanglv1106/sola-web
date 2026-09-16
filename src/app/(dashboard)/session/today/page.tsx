import React from 'react';
import { TodaySessionRunner } from '@/modules/learning';

export const metadata = {
  title: "Today's Session | SOLA",
  description: 'Complete your tailored daily English learning session with SOLA',
};

export default function TodaySessionPage() {
  return <TodaySessionRunner />;
}
