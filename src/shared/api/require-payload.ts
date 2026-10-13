import { ApiError } from './api-error';

/**
 * A typed domain payload is *required* by endpoints such as the notebook and
 * review-queue resources. The transport layer deliberately resolves `204`/`205`
 * and empty bodies to `undefined` (see `apiClient`), which is correct for a
 * genuinely content-less endpoint but is a contract violation for these.
 *
 * Without this guard the `undefined` propagates into the loader and crashes the
 * render when a component reads `payload.mistakes` or `payload.words`. Failing
 * here instead turns the violation into an explicit, retryable error state.
 */
export function requirePayload<T>(
  payload: T | undefined | null,
  endpoint: string,
  expected: string
): T {
  if (payload === undefined || payload === null) {
    throw new ApiError(
      204,
      `The server returned no content for ${endpoint}, but ${expected} is required`
    );
  }
  return payload;
}

/**
 * Guard a payload that arrived but whose shape is not trustworthy.
 *
 * `isValid` should check the fields the UI dereferences. A missing or wrongly
 * typed member is a contract violation, not an empty collection, so it becomes
 * an error rather than a silently fabricated empty success.
 */
export function requireShape<T>(
  payload: T,
  endpoint: string,
  isValid: (candidate: T) => boolean,
  expected: string
): T {
  if (!isValid(payload)) {
    throw new ApiError(
      200,
      `The server returned an unexpected payload for ${endpoint}; expected ${expected}`
    );
  }
  return payload;
}
