'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';
import { PasswordRequirements } from './PasswordRequirements';
import { validatePasswordRules } from '../types';

export function RegisterForm() {
  const router = useRouter();

  // Multi-step state: 1, 2, or 3
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Nguyen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 & 3 State
  const [goal, setGoal] = useState('speaking');
  const [dailyMinutes, setDailyMinutes] = useState(30);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRules = validatePasswordRules(password);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first and last name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!passwordRules.hasMinLength) {
      setError('Password must be at least 8 characters');
      return;
    }

    setStep(2);
  };

  const handleCompleteRegistration = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        sessionStorage.setItem(
          'sola_auth_user',
          JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email,
            goal,
            dailyMinutes,
            registeredAt: new Date().toISOString(),
          })
        );
      } catch {}
      setIsLoading(false);
      router.push('/home');
    }, 600);
  };

  return (
    <div className="w-full sm:w-[490px] bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.22)] border border-white/80 transition-all">
      {/* Top Header Row: Back to login / step indicators */}
      <div className="flex items-center justify-between text-xs sm:text-sm mb-4">
        {step === 1 ? (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to login</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => (s === 3 ? 2 : 1) as 1 | 2 | 3)}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Previous step</span>
          </button>
        )}

        {/* Step counter and progress bars */}
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[11px] font-semibold text-slate-600">
            Step {step} of 3
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= 1 ? 'w-6 bg-[#fa5b2d]' : 'w-4 bg-slate-200'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= 2 ? 'w-6 bg-[#fa5b2d]' : 'w-4 bg-slate-200'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= 3 ? 'w-6 bg-[#fa5b2d]' : 'w-4 bg-slate-200'
              }`}
            />
          </div>
        </div>
      </div>
      {/* Title & Subtitle */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111938] tracking-tight">
          {step === 1 && 'Create your account'}
          {step === 2 && 'Choose your primary goal'}
          {step === 3 && 'Set your daily commitment'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          {step === 1 &&
            "Join SOLA and start your English learning journey today. It's free and only takes a minute."}
          {step === 2 &&
            'Tell us what you want to achieve, and we will personalize your learning path.'}
          {step === 3 &&
            'Consistency is the secret to fluency. Small daily practice yields lasting results.'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {step === 1 && (
        <>
          <form onSubmit={handleStep1Submit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1"
                >
                  First name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#fa5b2d] focus:ring-2 focus:ring-[#fa5b2d]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1"
                >
                  Last name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nguyen"
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#fa5b2d] focus:ring-2 focus:ring-[#fa5b2d]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#fa5b2d] focus:ring-2 focus:ring-[#fa5b2d]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-9 pr-9 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#fa5b2d] focus:ring-2 focus:ring-[#fa5b2d]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <PasswordRequirements password={password} />

            <button
              type="submit"
              className="w-full mt-3 py-3 sm:py-3.5 px-6 rounded-xl bg-[#fa5b2d] hover:bg-[#eb4f22] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(250,91,45,0.32)] transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-500 font-normal">
              or sign up with
            </span>
          </div>

          <SocialAuthButtons disabled={isLoading} />

          <div className="mt-5 text-center text-[11px] sm:text-xs text-slate-500 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-[#fa5b2d] hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#fa5b2d] hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </div>
        </>
      )}

      {/* STEP 2: Goal selection */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2.5">
            {[
              {
                id: 'speaking',
                icon: '🗣️',
                title: 'Speaking & Pronunciation',
                desc: 'Build fluency, overcome hesitation, master intonation with AI tutor',
              },
              {
                id: 'exam',
                icon: '🎓',
                title: 'IELTS / TOEIC Exam Prep',
                desc: 'Practice real exam questions, band scoring, and structured feedback',
              },
              {
                id: 'career',
                icon: '💼',
                title: 'Work & Professional English',
                desc: 'Meetings, presentations, email writing, negotiations',
              },
              {
                id: 'daily',
                icon: '💬',
                title: 'Daily Casual Conversations',
                desc: 'Travel, hobbies, culture, idioms, and natural expressions',
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGoal(item.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  goal === item.id
                    ? 'border-[#fa5b2d] bg-orange-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#111938]">{item.title}</h4>
                    {goal === item.id && (
                      <span className="w-5 h-5 rounded-full bg-[#fa5b2d] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full mt-4 py-3 sm:py-3.5 px-6 rounded-xl bg-[#fa5b2d] hover:bg-[#eb4f22] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(250,91,45,0.32)] transition-all cursor-pointer"
          >
            <span>Continue to final step</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* STEP 3: Daily commitment & Complete */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2.5">
            {[
              {
                minutes: 15,
                badge: 'Casual',
                title: '15 minutes / day',
                desc: '1 bite-sized lesson + 1 quick AI tutor conversation',
              },
              {
                minutes: 30,
                badge: 'Recommended',
                title: '30 minutes / day',
                desc: '2 lessons + SRS vocabulary review + pronunciation coach',
              },
              {
                minutes: 45,
                badge: 'Intensive',
                title: '45 minutes / day',
                desc: 'Full immersive loop + exam mock section + live AI debates',
              },
            ].map((plan) => (
              <button
                key={plan.minutes}
                type="button"
                onClick={() => setDailyMinutes(plan.minutes)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  dailyMinutes === plan.minutes
                    ? 'border-[#fa5b2d] bg-orange-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#111938]">{plan.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        plan.badge === 'Recommended'
                          ? 'bg-[#fa5b2d] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{plan.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center gap-2.5 text-xs text-slate-700">
            <Sparkles className="w-4 h-4 text-[#fa5b2d] shrink-0" />
            <span>
              Your plan includes free daily AI voice sessions and real-time pronunciation analysis.
            </span>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleCompleteRegistration}
            className="w-full mt-4 py-3 sm:py-3.5 px-6 rounded-xl bg-[#fa5b2d] hover:bg-[#eb4f22] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(250,91,45,0.32)] transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating your account...</span>
              </>
            ) : (
              <>
                <span>Complete & Start learning</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
