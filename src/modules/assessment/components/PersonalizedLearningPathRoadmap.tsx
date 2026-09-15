import React from 'react';
import { LearningMilestone } from '../types';
import {
  ListOrdered,
  ArrowRight,
  MessageSquare,
  Headphones,
  BookOpen,
  Mic,
  BarChart3,
  Heart,
} from 'lucide-react';

interface PersonalizedLearningPathRoadmapProps {
  roadmap: LearningMilestone[];
}

export function PersonalizedLearningPathRoadmap({
  roadmap,
}: PersonalizedLearningPathRoadmapProps) {
  const getIcon = (type: LearningMilestone['icon']) => {
    switch (type) {
      case 'writing':
        return <MessageSquare className="w-5 h-5 text-sola-orange" />;
      case 'listening':
        return <Headphones className="w-5 h-5 text-sola-green" />;
      case 'vocabulary':
        return <BookOpen className="w-5 h-5 text-sola-blue" />;
      case 'speaking':
        return <Mic className="w-5 h-5 text-amber-500" />;
      case 'tests':
        return <BarChart3 className="w-5 h-5 text-sola-purple" />;
      default:
        return <BookOpen className="w-5 h-5 text-sola-orange" />;
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-sola-border shadow-sola-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sola-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
              <ListOrdered className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-sola-navy">
              Your personalized learning plan
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-sola-text-secondary mt-1">
            Based on your results and goal, we&apos;ve created a plan just for you.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sola-orange hover:text-sola-orange-hover transition-colors"
        >
          <span>View full plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Steps + Right inspirational artwork */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Step cards list */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-2 overflow-x-auto pb-2">
          {roadmap.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="w-full md:w-48 p-4 rounded-xl border border-sola-border bg-[#fffdfb] flex flex-col justify-between space-y-3 shrink-0 hover:border-orange-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                    {getIcon(step.icon)}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-sola-navy leading-snug line-clamp-2">
                    {step.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-sola-text-secondary block">
                    {step.weeks}
                  </span>
                </div>
              </div>

              {idx < roadmap.length - 1 && (
                <div className="hidden md:flex items-center justify-center shrink-0 text-gray-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right side motivational banner */}
        <div className="lg:w-72 shrink-0 p-5 rounded-xl bg-gradient-to-b from-[#fdf7ef] to-[#f8ede0] border border-amber-200/60 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <p className="font-handwriting text-xl font-bold text-amber-950 italic flex items-center gap-1.5">
              <span>A clearer plan a brighter you.</span>
              <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
            </p>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Step by step, you&apos;ll build the skills, confidence, and real-world English you need to reach your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
