'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Keyboard,
  Send,
  Target,
  BarChart2,
  Heart,
  Star,
  ChevronDown,
  ChevronRight,
  Briefcase,
  MessageSquare,
  Users,
  Scale,
  FileText,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  mockChatMessages,
  mockDefaultScenario,
} from '@/mocks/tutor.mock';
import { ChatMessage } from '../types';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { cn } from '@/shared/lib/cn';

export function AiTutorChatView() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'speak' | 'type'>('speak');
  const [feedbackTab, setFeedbackTab] = useState<'corrections' | 'phrasing' | 'vocabulary'>('corrections');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: '10:27 AM',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'maya',
        text: 'Understood! Could you explain how this feature specifically solves user retention challenges in the current quarter?',
        timestamp: '10:27 AM',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const handleStartVoice = () => {
    router.push('/tutor/sessions/meeting-idea');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-sola-orange uppercase tracking-wider">
          AI Tutor
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
          Chat with Maya
        </h1>
        <div className="flex items-center gap-2 pt-0.5">
          <div className="w-4 h-1 bg-sola-orange rounded-full" />
          <p className="text-xs sm:text-sm text-sola-text-secondary">
            Real conversations. Real progress. A brighter you.
          </p>
        </div>
      </div>

      {/* 2. Main 2-Column Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Chat Message Stream + Input Area */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-5 sm:p-6 space-y-6 flex flex-col justify-between min-h-[620px]">
            {/* Messages Scroll Area */}
            <div className="space-y-5 flex-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
              {messages.map((msg) => {
                const isMaya = msg.sender === 'maya';

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-start gap-3',
                      isMaya ? 'justify-start' : 'justify-end'
                    )}
                  >
                    {isMaya && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={msg.avatarUrl}
                        alt="Maya"
                        className="w-10 h-10 rounded-full object-cover border border-amber-200 shrink-0 mt-0.5 shadow-sm"
                      />
                    )}

                    <div className={cn('space-y-1 max-w-lg', !isMaya && 'items-end flex flex-col')}>
                      <div
                        className={cn(
                          'p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-line',
                          isMaya
                            ? 'bg-[#fdfbf7] border border-amber-200/70 text-sola-navy rounded-tl-sm'
                            : 'bg-sola-orange-soft/40 border border-orange-200 text-sola-navy rounded-tr-sm font-medium'
                        )}
                      >
                        {msg.text}
                      </div>

                      <span className="text-[10px] text-gray-400 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    {!isMaya && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={msg.avatarUrl}
                        alt="Alex"
                        className="w-10 h-10 rounded-full object-cover border border-orange-200 shrink-0 mt-0.5 shadow-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Input Area: Speak vs Type */}
            <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-b from-white to-[#fffaf3] p-4 sm:p-5 space-y-4 shadow-sm">
              {/* Mode switch pills + Language selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200/80">
                  <button
                    onClick={() => setInputMode('speak')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      inputMode === 'speak'
                        ? 'bg-white text-sola-orange shadow-sm'
                        : 'text-sola-navy-muted hover:text-sola-navy'
                    )}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Speak</span>
                  </button>
                  <button
                    onClick={() => setInputMode('type')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                      inputMode === 'type'
                        ? 'bg-white text-sola-orange shadow-sm'
                        : 'text-sola-navy-muted hover:text-sola-navy'
                    )}
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>Type</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-sola-navy bg-white border border-sola-border px-3 py-1.5 rounded-xl cursor-pointer">
                  <span>English (US)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              {/* Mode Content: Speak Mode */}
              {inputMode === 'speak' ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <div className="flex items-center justify-center gap-6 w-full">
                    {/* Left Animated Waveforms */}
                    <div className="flex items-center gap-1">
                      {[10, 20, 32, 18, 28, 14, 22].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-sola-orange/70 rounded-full animate-pulse"
                          style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                        />
                      ))}
                    </div>

                    {/* Big Orange Center Mic Button */}
                    <button
                      onClick={handleStartVoice}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-sola-orange to-orange-400 flex items-center justify-center text-white shadow-sola-button hover:scale-105 transition-transform ring-8 ring-orange-100 cursor-pointer"
                      title="Tap to start voice practice"
                    >
                      <Mic className="w-7 h-7" />
                    </button>

                    {/* Right Animated Waveforms */}
                    <div className="flex items-center gap-1">
                      {[22, 14, 28, 18, 32, 20, 10].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-sola-orange/70 rounded-full animate-pulse"
                          style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <p className="text-xs font-extrabold text-sola-navy">
                      Start voice conversation
                    </p>
                    <p className="text-[11px] text-sola-text-secondary">
                      Tap the mic and start speaking
                    </p>
                  </div>
                </div>
              ) : (
                /* Mode Content: Type Mode */
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your reply to Maya in English..."
                    className="flex-1 bg-white border border-sola-border rounded-xl px-4 py-3 text-xs sm:text-sm text-sola-navy focus:outline-none focus:border-sola-orange"
                  />
                  <Button
                    variant="primary"
                    size="md"
                    className="shrink-0"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Conversation Prompts Bar */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-sola-navy">
                <Lightbulb className="w-4 h-4 text-sola-orange" />
                <span>Try these conversation prompts</span>
              </div>
              <button className="text-xs text-sola-orange font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                <span>See more topics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => router.push('/tutor/sessions/meeting-idea')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-orange-100 text-sola-orange border border-orange-200 text-xs font-bold shrink-0 shadow-sm cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Present a new idea in a team meeting</span>
              </button>

              <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white text-sola-navy border border-sola-border hover:bg-orange-50/50 text-xs font-semibold shrink-0 cursor-pointer">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Give your opinion politely</span>
              </button>

              <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white text-sola-navy border border-sola-border hover:bg-orange-50/50 text-xs font-semibold shrink-0 cursor-pointer">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Ask for feedback on your work</span>
              </button>

              <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white text-sola-navy border border-sola-border hover:bg-orange-50/50 text-xs font-semibold shrink-0 cursor-pointer">
                <Scale className="w-4 h-4 text-purple-600" />
                <span>Handle a different opinion</span>
              </button>

              <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white text-sola-navy border border-sola-border hover:bg-orange-50/50 text-xs font-semibold shrink-0 cursor-pointer">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Summarize key points</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Maya Tutor + Focus + Live Feedback + Score */}
        <div className="lg:col-span-4 space-y-4">
          {/* Maya Coach Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdf9f4] border border-amber-200/70 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 font-bold text-sm text-sola-navy">
                  <span>Maya</span>
                  <span>👋</span>
                </div>
                <span className="text-[11px] text-sola-text-secondary font-medium">
                  Your AI English tutor
                </span>
              </div>
              <div className="font-handwriting text-xs text-amber-900 font-bold italic text-right">
                Practice today for a brighter tomorrow. ♡
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-orange-100 shadow-sm flex items-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="Maya AI"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="relative z-10 m-3 p-3 rounded-xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-md">
                <p className="text-xs font-medium text-sola-navy leading-relaxed">
                  You&apos;re doing great! I&apos;m here to support you with real conversations, helpful feedback, and encouragement every step of the way.
                </p>
              </div>
            </div>
          </div>

          {/* Conversation Focus Card */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sola-orange" />
                <h3 className="font-extrabold text-xs text-sola-navy">
                  Conversation focus
                </h3>
              </div>
              <button className="text-xs text-sola-orange font-semibold hover:underline cursor-pointer">
                Change
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sola-orange text-white flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-sola-navy">
                  {mockDefaultScenario.title}
                </h4>
                <p className="text-[11px] text-sola-text-secondary leading-relaxed">
                  {mockDefaultScenario.tags.join(' • ')}
                </p>
              </div>
            </div>
          </Card>

          {/* Live Feedback Card */}
          <Card className="p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sola-orange" />
              <h3 className="font-extrabold text-xs text-sola-navy">
                Live feedback
              </h3>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200/70">
              <button
                onClick={() => setFeedbackTab('corrections')}
                className={cn(
                  'flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                  feedbackTab === 'corrections'
                    ? 'bg-sola-orange text-white shadow-sm'
                    : 'text-sola-navy-muted hover:text-sola-navy'
                )}
              >
                Corrections
              </button>
              <button
                onClick={() => setFeedbackTab('phrasing')}
                className={cn(
                  'flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                  feedbackTab === 'phrasing'
                    ? 'bg-sola-orange text-white shadow-sm'
                    : 'text-sola-navy-muted hover:text-sola-navy'
                )}
              >
                Better phrasing
              </button>
              <button
                onClick={() => setFeedbackTab('vocabulary')}
                className={cn(
                  'flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer',
                  feedbackTab === 'vocabulary'
                    ? 'bg-sola-orange text-white shadow-sm'
                    : 'text-sola-navy-muted hover:text-sola-navy'
                )}
              >
                Vocabulary
              </button>
            </div>

            {/* Tab Content */}
            {feedbackTab === 'corrections' && (
              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-700">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>I think it can increase user engagement.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>I believe it can help increase user engagement.</span>
                  </div>
                </div>

                <p className="text-[11px] text-sola-text-secondary leading-relaxed px-1">
                  &ldquo;believe&rdquo; sounds more confident and professional in business settings.
                </p>
              </div>
            )}

            {feedbackTab === 'phrasing' && (
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-sola-navy space-y-1">
                <span className="font-bold text-blue-800 block">More natural expression:</span>
                <p>&ldquo;How about we introduce this feature next sprint?&rdquo;</p>
              </div>
            )}

            {feedbackTab === 'vocabulary' && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['engagement', 'retention', 'feasibility'].map((w) => (
                  <span key={w} className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                    {w}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Conversation Score Card */}
          <Card className="p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-sola-orange" />
              <h3 className="font-extrabold text-xs text-sola-navy">
                Conversation score
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <ProgressRing
                  value={85}
                  size={74}
                  strokeWidth={7}
                  color="green"
                  hideValue
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-extrabold text-sola-navy leading-none">
                    85
                  </span>
                  <span className="text-[9px] text-sola-text-secondary font-medium">
                    / 100
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-sola-navy">
                  Great job!
                </p>
                <p className="text-[11px] text-sola-text-secondary leading-relaxed">
                  You spoke clearly, used relevant vocabulary, and expressed your ideas well.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sola-border/60 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                <Heart className="w-3 h-3 fill-rose-600" />
                <span>Clear ideas</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                <BarChart2 className="w-3 h-3" />
                <span>Good fluency</span>
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>More confidence</span>
              </span>
            </div>
          </Card>

          {/* Bottom Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fdf7ee] via-amber-50 to-[#faedd9] border border-amber-200/50">
            <p className="font-handwriting text-base font-bold text-amber-950 italic text-center">
              Small conversations, a bigger you. ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
