'use client';

import React from 'react';
import { Trophy, Globe } from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { Avatar } from '@/shared/ui/avatar/Avatar';

const studyGroups = [
  { id: '1', name: 'IELTS 7.5+ Achievers', members: 142, topic: 'Daily Task 2 writing discussions', tag: 'IELTS' },
  { id: '2', name: 'Daily Speaking Club', members: 289, topic: 'Morning voice practice with Maya', tag: 'Speaking' },
  { id: '3', name: 'Business English Leaders', members: 98, topic: 'Presentations & networking', tag: 'Career' },
];

const topLearners = [
  { name: 'Sarah M.', streak: 42, points: '4,850 pts', level: 'C1 Fluent', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { name: 'David K.', streak: 35, points: '4,120 pts', level: 'B2 Upper', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
  { name: 'Alex (You)', streak: 18, points: '2,940 pts', level: 'B1 Strong', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
];

export default function CommunityPage() {
  return (
    <div className="space-y-8 pb-16">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#fcecd7] border border-amber-200/70 p-6 sm:p-8 shadow-sm">
        <div className="space-y-2">
          <span className="text-xs font-bold text-sola-orange uppercase tracking-wider">Community</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy">SOLA Learning Community</h1>
          <p className="text-sm text-sola-text-secondary">Connect with learners, join daily study circles, and grow together.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-sola-navy flex items-center gap-2">
              <Globe className="w-5 h-5 text-sola-orange" /> Recommended Study Circles
            </h2>
            <div className="space-y-3">
              {studyGroups.map((g) => (
                <div key={g.id} className="p-4 rounded-2xl border border-sola-border bg-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sola-navy">{g.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">{g.tag}</span>
                    </div>
                    <p className="text-xs text-sola-text-secondary mt-1">{g.topic} • {g.members} learners</p>
                  </div>
                  <Button size="sm" variant="secondary" className="text-xs">Join</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sola-navy flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Weekly Leaderboard
            </h3>
            <div className="space-y-2.5">
              {topLearners.map((l, i) => (
                <div key={l.name} className="p-3 rounded-xl border border-sola-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-sola-text-secondary w-4">#{i + 1}</span>
                    <Avatar src={l.avatar} fallback={l.name[0]} size="sm" />
                    <div>
                      <div className="text-xs font-bold text-sola-navy">{l.name}</div>
                      <div className="text-[10px] text-sola-text-secondary">{l.level}</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-sola-orange">{l.streak}d 🔥</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

