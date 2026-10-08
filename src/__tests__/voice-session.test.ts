import { describe, it, expect } from 'vitest';

export type VoiceSessionState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'ai_speaking'
  | 'paused'
  | 'completed';

export interface VoiceSessionEvent {
  type:
    | 'START'
    | 'STOP_SPEAKING'
    | 'AI_RESPONSE_READY'
    | 'AI_FINISH_SPEAKING'
    | 'PAUSE'
    | 'RESUME'
    | 'END';
}

export function voiceSessionReducer(
  state: VoiceSessionState,
  event: VoiceSessionEvent
): VoiceSessionState {
  if (event.type === 'END') return 'completed';

  switch (state) {
    case 'idle':
      if (event.type === 'START') return 'listening';
      return state;

    case 'listening':
      if (event.type === 'STOP_SPEAKING') return 'processing';
      if (event.type === 'PAUSE') return 'paused';
      return state;

    case 'processing':
      if (event.type === 'AI_RESPONSE_READY') return 'ai_speaking';
      return state;

    case 'ai_speaking':
      if (event.type === 'AI_FINISH_SPEAKING') return 'listening';
      if (event.type === 'PAUSE') return 'paused';
      return state;

    case 'paused':
      if (event.type === 'RESUME') return 'listening';
      return state;

    case 'completed':
    default:
      return state;
  }
}

export function formatSessionDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

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
