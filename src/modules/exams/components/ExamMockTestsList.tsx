'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Clock, ChevronRight } from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { ExamMockTest } from '../types';

interface ExamMockTestsListProps {
  mockTests: ExamMockTest[];
}

export function ExamMockTestsList({ mockTests }: ExamMockTestsListProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-bold text-sola-navy tracking-tight">
            Mock tests
          </h2>
          <span className="text-xs sm:text-sm text-sola-text-secondary font-medium">
            Experience the real exam. Track your progress.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTests.map((test) => (
          <Link key={test.id} href={test.href} className="group block">
            <Card className="p-5 flex items-center justify-between hover:shadow-md transition-all duration-200 border-gray-100 hover:border-orange-200/80 group-hover:-translate-y-0.5 bg-white">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-sola-navy group-hover:text-sola-orange transition-colors">
                    {test.title}
                  </h3>
                  <p className="text-xs text-sola-text-secondary mb-1">
                    {test.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-sola-navy-muted font-medium">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{test.duration}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-sola-orange group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

