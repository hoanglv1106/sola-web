import { ApiError } from './api-error';

/**
 * Body handling for a *successful* response, declared per call site:
 *
 * - `json` (default): the body must parse as JSON. A malformed body rejects with
 *   `ApiError` so it surfaces as a loader error state instead of being cast to
 *   `T` and blowing up later during render.
 * - `void`: the endpoint is expected to return no content (`204`/`205` or an
 *   empty body); a non-empty body is then a contract violation.
 * - `text`: the endpoint returns a non-JSON payload and `T` is that string.
 */
export type ApiResponseMode = 'json' | 'text' | 'void';

export interface ApiClientOptions extends Omit<RequestInit, 'headers'> {
  headers?: HeadersInit;
  /** How to interpret a successful response body. Defaults to `'json'`. */
  responseMode?: ApiResponseMode;
}

/**
 * Merge default headers with caller-provided headers without losing either side.
 * Supports plain objects, `Headers` instances and tuple arrays. Caller values win
 * (case-insensitively) over the defaults.
 */
export function mergeHeaders(
  defaults: HeadersInit,
  overrides?: HeadersInit
): Headers {
  const merged = new Headers(defaults);
  if (overrides) {
    new Headers(overrides).forEach((value, key) => {
      merged.set(key, value);
    });
  }
  return merged;
}

/**
 * Error bodies are *tolerant*: any JSON, plain text or unreadable body must
 * still produce a human-readable message rather than masking the real status.
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) {
      return response.statusText || `Request failed with status ${response.status}`;
    }
    try {
      const payload: unknown = JSON.parse(text);
      if (payload && typeof payload === 'object' && 'message' in payload) {
        const message = (payload as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim()) return message;
      }
      if (typeof payload === 'string' && payload.trim()) return payload;
      return text.trim() || response.statusText;
    } catch {
      // Not JSON: surface the raw text (e.g. an HTML error page or plain string).
      return text.trim() || response.statusText;
    }
  } catch {
    // Body already consumed or unreadable: fall back to the status text.
    return response.statusText || `Request failed with status ${response.status}`;
  }
}

/**
 * Thin fetch wrapper for the (still mock-backed) SOLA API layer.
 *
 * Contract:
 * - the default `Content-Type: application/json` never overwrites caller headers;
 * - `204`/`205` and empty bodies resolve to `undefined` in every mode;
 * - a non-2xx response throws `ApiError` carrying a tolerant, human-readable message;
 * - a successful `json` response whose body does not parse as JSON throws
 *   `ApiError` rather than being returned as a string typed as `T`.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const { headers, responseMode = 'json', ...rest } = options;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...rest,
    headers: mergeHeaders({ 'Content-Type': 'application/json' }, headers),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  if (responseMode === 'void') {
    throw new ApiError(
      response.status,
      `Expected an empty body for a no-content endpoint, received ${text.length} bytes`
    );
  }

  if (responseMode === 'text') {
    return text as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(
      response.status,
      `Failed to parse a successful JSON response from ${endpoint}`
    );
  }
}
