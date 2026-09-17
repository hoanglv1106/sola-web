'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Volume2,
  RotateCcw,
  Pause,
  Play,
  Square,
  Keyboard,
  Target,
  Trophy,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  BookOpen,
  ChevronRight,
  FileText,
  Pin,
} from 'lucide-react';
import {
  mockDefaultScenario,
} from '@/mocks/tutor.mock';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressBar } from '@/shared/ui/progress/Progress';
import { cn } from '@/shared/lib/cn';

interface AiTutorVoicePracticeProps {
  sessionId?: string;
}

export function AiTutorVoicePractice({ sessionId = 'meeting-idea' }: AiTutorVoicePracticeProps) {
  const router = useRouter();
  const scenario = mockDefaultScenario;

  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(12);
  const [isPlayingMayaAudio, setIsPlayingMayaAudio] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndSession = () => {
    router.push(`/tutor/sessions/${sessionId}/feedback`);
  };

  const handleSwitchToText = () => {
    router.push('/tutor');
  };

  const handlePlayMaya = () => {
    setIsPlayingMayaAudio(true);
    setTimeout(() => {
      setIsPlayingMayaAudio(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-sola-orange uppercase tracking-wider">
            AI Tutor
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sola-navy tracking-tight">
            Voice Practice
          </h1>
          <p className="text-xs sm:text-sm text-sola-text-secondary">
            Real conversations. Real progress. A brighter you.
          </p>
        </div>

        <div className="font-handwriting text-lg sm:text-xl font-bold text-amber-900 italic self-start sm:self-auto">
          Practice today for a brighter tomorrow. ♡
        </div>
      </div>

      {/* 2. Scenario & Goal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Scenario card (8 cols) */}
        <Card className="lg:col-span-8 p-5 flex items-start gap-4 border-amber-200/60 bg-gradient-to-r from-[#fffbf5] to-white">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0 mt-0.5">
            <Target className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-sola-orange uppercase tracking-wider block">
              Today&apos;s scenario
            </span>
            <h2 className="text-base font-extrabold text-sola-navy leading-snug">
              {scenario.title}
            </h2>
            <p className="text-xs text-sola-text-secondary leading-relaxed">
              {scenario.description}
            </p>
          </div>
        </Card>

        {/* Goal card (4 cols) */}
        <Card className="lg:col-span-4 p-5 flex items-start gap-3.5 border-amber-200/60 bg-gradient-to-r from-amber-50/50 to-white">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Your goal
            </span>
            <p className="text-xs text-sola-navy leading-relaxed font-medium">
              {scenario.goal}
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Main Practice Section (8 cols left, 4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Maya Speech + Recording Waveform + Controls */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 sm:p-7 space-y-6">
            {/* Maya Prompt Bubble */}
            <div className="flex items-start gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                alt="Maya"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-200 shrink-0 shadow-xs"
              />

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-sola-navy">
                  <span>Maya</span>
                  <span>👋</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-[#fdfbf7] border border-amber-200/70 text-xs sm:text-sm text-sola-navy leading-relaxed space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-4 font-handwriting text-sm font-bold text-amber-900/60 italic hidden sm:block">
                    Your ideas matter! Speak naturally. ♡
                  </div>

                  <p>
                    Let&apos;s get started!
                    <br />
                    Imagine you&apos;re in a team meeting. You&apos;d like to suggest a new feature for our app that helps users track their study progress with AI. What would you like to propose, and why do you think it&apos;s important?
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-xs text-sola-text-secondary">
                    <button
                      onClick={handlePlayMaya}
                      className={cn(
                        'flex items-center gap-1.5 font-bold transition-colors cursor-pointer',
                        isPlayingMayaAudio ? 'text-sola-orange' : 'hover:text-sola-orange'
                      )}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlayingMayaAudio ? 'Playing...' : 'Tap to replay'}</span>
                    </button>
                    <span className="font-mono text-[11px] text-gray-400">00:28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Recording & Waveform Arena */}
            <div className="py-8 px-4 rounded-3xl bg-gradient-to-b from-[#fffcf8] via-[#fef9f2] to-[#fcf4e8] border border-amber-200/80 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
              {/* Status badge & Timer */}
              <div className="flex items-center justify-between w-full max-w-md px-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-sola-orange bg-orange-100/80 border border-orange-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-sola-orange animate-ping" />
                  <span>Speaking...</span>
                </span>

                <span className="font-mono text-sm font-bold text-sola-navy bg-white border border-sola-border px-3 py-1 rounded-full shadow-2xs">
                  {formatTimer(seconds)}
                </span>
              </div>

              {/* Large Glowing Center Mic with Waves */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-lg py-2">
                {/* Left Waveform */}
                <div className="flex items-center gap-1">
                  {[12, 24, 38, 20, 32, 16, 28, 14].map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        'w-1 sm:w-1.5 bg-sola-orange rounded-full transition-all',
                        isRecording ? 'animate-pulse' : 'opacity-30'
                      )}
                      style={{
                        height: isRecording ? `${h}px` : '6px',
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* Big Mic Button */}
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sola-orange to-amber-400 flex items-center justify-center text-white shadow-sola-button hover:scale-105 transition-all ring-8 ring-orange-100/80 cursor-pointer shrink-0"
                  title={isRecording ? 'Click to pause' : 'Click to resume'}
                >
                  <Mic className="w-9 h-9 sm:w-10 sm:h-10" />
                </button>

                {/* Right Waveform */}
                <div className="flex items-center gap-1">
                  {[14, 28, 16, 32, 20, 38, 24, 12].map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        'w-1 sm:w-1.5 bg-sola-orange rounded-full transition-all',
                        isRecording ? 'animate-pulse' : 'opacity-30'
                      )}
                      style={{
                        height: isRecording ? `${h}px` : '6px',
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs font-semibold text-sola-text-secondary">
                Speak naturally. Take your time.
              </p>
            </div>

            {/* Control Buttons Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                onClick={handlePlayMaya}
                className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-sola-border bg-white text-xs font-bold text-sola-navy hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-sola-text-secondary" />
                <span>Replay prompt</span>
              </button>

              <button
                onClick={() => setIsRecording(!isRecording)}
                className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-sola-border bg-white text-xs font-bold text-sola-navy hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {isRecording ? (
                  <>
                    <Pause className="w-4 h-4 text-sola-text-secondary" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-sola-orange fill-sola-orange" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <Button
                variant="primary"
                size="md"
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold border-red-600 shadow-xs"
                onClick={handleEndSession}
              >
                <Square className="w-3.5 h-3.5 fill-white mr-1.5" />
                <span>End session</span>
              </Button>

              <button
                onClick={handleSwitchToText}
                className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-sola-border bg-white text-xs font-bold text-sola-navy hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Keyboard className="w-4 h-4 text-sola-text-secondary" />
                <span>Switch to text</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Right 4 cols: Live Feedback + Live Transcript + Landscape */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Feedback Card */}
          <Card className="p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-sola-navy">
                Live feedback
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-time</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {/* 1. Pronunciation */}
              <div className="p-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-sola-navy">Pronunciation</h4>
                    <p className="text-[11px] text-emerald-800">Clear and easy to understand!</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>

              {/* 2. Fluency */}
              <div className="p-3 rounded-2xl border border-orange-100 bg-orange-50/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-orange-100 text-sola-orange flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-sola-navy">Fluency</h4>
                    <p className="text-[11px] text-orange-900/80">Good flow! Try pausing a little less between ideas.</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-sola-orange shrink-0" />
              </div>

              {/* 3. Better phrasing */}
              <div className="p-3 rounded-2xl border border-amber-100 bg-amber-50/40 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-sola-navy">Better phrasing</h4>
                    <p className="text-[10px] text-gray-400 line-through">
                      &ldquo;I think it can help a lot of users.&rdquo;
                    </p>
                    <p className="text-[11px] text-sola-navy font-semibold">
                      I believe it can help <span className="bg-amber-200/80 px-1 rounded-sm">many</span> users and create real value.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 shrink-0" />
              </div>

              {/* 4. Key vocabulary */}
              <div className="p-3 rounded-2xl border border-blue-100 bg-blue-50/40 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-sola-navy">Key vocabulary</h4>
                    <p className="text-[11px] text-sola-navy leading-relaxed">
                      Great use of <span className="text-emerald-700 font-bold">feature</span> and <span className="text-emerald-700 font-bold">progress</span>! Try also using <span className="underline">engagement</span>, <span className="underline">improve</span>, or <span className="underline">enhance</span>.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
              </div>
            </div>
          </Card>

          {/* Live Transcript Card */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sola-orange" />
              <h3 className="font-extrabold text-xs text-sola-navy">
                Your conversation <span className="text-sola-text-secondary font-medium">(Live transcript)</span>
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-sola-navy flex items-center gap-1">
                  <Pin className="w-3 h-3 text-sola-orange" />
                  <span>You 00:00</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-sola-orange animate-pulse" />
              </div>
              <p className="text-xs text-sola-navy leading-relaxed">
                &ldquo;I think we could add a new feature that helps users track their study progress with AI. It can give personalized feedback and show their improvement over time...&rdquo;
              </p>
            </div>
          </Card>

          {/* Bottom Landscape Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fdf7ee] via-amber-50 to-[#faedd9] border border-amber-200/50">
            <p className="font-handwriting text-base font-bold text-amber-950 italic text-center">
              Brighter conversations lead to a brighter you. ❤️
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Progress Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="font-bold text-sm text-sola-navy">
            You&apos;re doing great, Alex.
          </p>
          <p className="text-xs text-sola-text-secondary">
            Every conversation is a step toward a more confident you.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="space-y-1 w-full sm:w-48">
            <div className="flex justify-between text-[11px] font-bold text-sola-navy">
              <span>Today&apos;s practice</span>
              <span>1 of 3 sessions</span>
            </div>
            <ProgressBar value={33} className="h-2 bg-orange-200/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
