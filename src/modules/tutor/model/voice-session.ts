export type VoiceSessionState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'ai_speaking'
  | 'paused'
  | 'completed';

export type VoiceSessionEventType =
  | 'START'
  | 'STOP_SPEAKING'
  | 'AI_RESPONSE_READY'
  | 'AI_FINISH_SPEAKING'
  | 'PAUSE'
  | 'RESUME'
  | 'END';

export interface VoiceSessionEvent {
  type: VoiceSessionEventType;
}

/**
 * Voice practice state machine for the (simulated) AI tutor session.
 *
 * This drives the mock microphone UI only: no real speech recognition or
 * synthesis is implemented.
 */
export function voiceSessionReducer(
  state: VoiceSessionState,
  event: VoiceSessionEvent
): VoiceSessionState {
  if (event.type === 'END') return 'completed';

  switch (state) {
    case 'idle':
      return event.type === 'START' ? 'listening' : state;

    case 'listening':
      if (event.type === 'STOP_SPEAKING') return 'processing';
      if (event.type === 'PAUSE') return 'paused';
      return state;

    case 'processing':
      return event.type === 'AI_RESPONSE_READY' ? 'ai_speaking' : state;

    case 'ai_speaking':
      if (event.type === 'AI_FINISH_SPEAKING') return 'listening';
      if (event.type === 'PAUSE') return 'paused';
      return state;

    case 'paused':
      return event.type === 'RESUME' ? 'listening' : state;

    case 'completed':
    default:
      return state;
  }
}

export function formatSessionDuration(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const mins = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const secs = (safe % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

/** The microphone timer only runs while the learner is actively listening. */
export function isVoiceTimerRunning(state: VoiceSessionState): boolean {
  return state === 'listening' || state === 'ai_speaking';
}
