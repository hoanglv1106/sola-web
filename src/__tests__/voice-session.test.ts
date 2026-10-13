import { describe, it, expect } from 'vitest';
// Production domain logic (no test-local reimplementation).
import type { VoiceSessionState } from '@/modules/tutor/model';
import {
  voiceSessionReducer,
  formatSessionDuration,
  isVoiceTimerRunning,
} from '@/modules/tutor/model';

describe('Voice Tutor State Machine & Session Logic', () => {
  it('should transition through standard voice conversation cycle', () => {
    let state: VoiceSessionState = 'idle';

    state = voiceSessionReducer(state, { type: 'START' });
    expect(state).toBe('listening');

    state = voiceSessionReducer(state, { type: 'STOP_SPEAKING' });
    expect(state).toBe('processing');

    state = voiceSessionReducer(state, { type: 'AI_RESPONSE_READY' });
    expect(state).toBe('ai_speaking');

    state = voiceSessionReducer(state, { type: 'AI_FINISH_SPEAKING' });
    expect(state).toBe('listening');
  });

  it('should handle pause and resume correctly', () => {
    let state: VoiceSessionState = 'listening';

    state = voiceSessionReducer(state, { type: 'PAUSE' });
    expect(state).toBe('paused');

    state = voiceSessionReducer(state, { type: 'RESUME' });
    expect(state).toBe('listening');
  });

  it('should complete session on END from any active state', () => {
    expect(voiceSessionReducer('listening', { type: 'END' })).toBe('completed');
    expect(voiceSessionReducer('ai_speaking', { type: 'END' })).toBe('completed');
    expect(voiceSessionReducer('processing', { type: 'END' })).toBe('completed');
  });

  it('should format voice session duration cleanly', () => {
    expect(formatSessionDuration(12)).toBe('00:12');
    expect(formatSessionDuration(65)).toBe('01:05');
    expect(formatSessionDuration(600)).toBe('10:00');
  });
});

describe('Voice Tutor illegal transitions & timer ownership', () => {
  it('should ignore events that are illegal for the current state', () => {
    expect(voiceSessionReducer('idle', { type: 'AI_RESPONSE_READY' })).toBe('idle');
    expect(voiceSessionReducer('idle', { type: 'RESUME' })).toBe('idle');
    expect(voiceSessionReducer('processing', { type: 'START' })).toBe('processing');
    expect(voiceSessionReducer('processing', { type: 'PAUSE' })).toBe('processing');
    expect(voiceSessionReducer('completed', { type: 'START' })).toBe('completed');
    expect(voiceSessionReducer('completed', { type: 'RESUME' })).toBe('completed');
  });

  it('should resume into listening from paused but not into ai_speaking', () => {
    expect(voiceSessionReducer('paused', { type: 'RESUME' })).toBe('listening');
    expect(voiceSessionReducer('paused', { type: 'AI_FINISH_SPEAKING' })).toBe('paused');
  });

  it('should end the session from any active state', () => {
    for (const state of ['idle', 'listening', 'processing', 'ai_speaking', 'paused', 'completed'] as const) {
      expect(voiceSessionReducer(state, { type: 'END' })).toBe('completed');
    }
  });

  it('should only run the session timer for active listening states', () => {
    expect(isVoiceTimerRunning('listening')).toBe(true);
    expect(isVoiceTimerRunning('ai_speaking')).toBe(true);
    expect(isVoiceTimerRunning('paused')).toBe(false);
    expect(isVoiceTimerRunning('idle')).toBe(false);
    expect(isVoiceTimerRunning('processing')).toBe(false);
    expect(isVoiceTimerRunning('completed')).toBe(false);
  });

  it('should clamp negative and non-finite durations', () => {
    expect(formatSessionDuration(-10)).toBe('00:00');
    expect(formatSessionDuration(Number.NaN)).toBe('00:00');
  });
});
