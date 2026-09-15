import React from 'react';
import { Lightbulb, Target, BarChart2, UserCheck } from 'lucide-react';

export function WhyThisTestMatters() {
  const points = [
    {
      title: 'We understand your current level',
      description: 'So we can create a learning plan that fits you.',
      icon: Target,
      color: 'text-sola-orange',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'You get the right practice',
      description: 'Focus on the skills you need most.',
      icon: BarChart2,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Better results, faster',
      description: 'A personalized journey helps you improve with confidence.',
      icon: UserCheck,
      color: 'text-sola-orange',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white border border-sola-border shadow-sola-card space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
          <Lightbulb className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-base text-sola-navy">
          Why this test matters
        </h3>
      </div>

      {/* Points */}
      <div className="space-y-3.5 pt-1">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl ${pt.bgColor} ${pt.color} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-sola-navy leading-snug">
                  {pt.title}
                </h4>
                <p className="text-xs text-sola-text-secondary mt-0.5 leading-relaxed">
                  {pt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
