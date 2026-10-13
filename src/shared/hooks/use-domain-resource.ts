'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type LoadState = 'loading' | 'ready' | 'error';

export interface UseDomainResourceResult<T> {
  data: T | null;
  state: LoadState;
  error: string | null;
  isEmpty: boolean;
  /**
   * Monotonic id of the *successful* load that produced `data`. Starts at 0 and
   * increments once per resolved load, so consumers can own derived state per
   * revision instead of guessing identity from aggregate counts.
   */
  revision: number;
  reload: () => void;
}

interface UseDomainResourceOptions<T> {
  /** Decide whether a successfully loaded payload should render the empty state. */
  isEmpty?: (data: T) => boolean;
  /**
   * Stable identity of the resource being loaded (a route id, a query key, ...).
   *
   * When this changes the hook re-runs the loader and ignores any response that
   * belongs to a previous key. Without this, navigating from `A` to `B` would
   * keep showing `A`'s payload until `B` arrives — and a late `A` reply could
   * overwrite `B` entirely.
   */
  resourceKey?: string;
  /**
   * Validate a successfully resolved payload; return `false` to move the
   * resource into its error state.
   *
   * This exists because `204`/`205` and empty bodies resolve to `undefined` at
   * the transport layer. Endpoints whose typed payload is *required* must turn
   * that `undefined` into an explicit error instead of storing it and crashing
   * the render. Loaders whose endpoint legitimately returns no content simply
   * omit this option.
   */
  validate?: (value: unknown) => boolean;
}

/**
 * Minimal loader for the (mock or HTTP) domain data boundary.
 *
 * Deliberately dependency-free: it exposes `loading | ready | error` plus an
 * `isEmpty` flag so views can render explicit loading/error/empty states without
 * pulling in a data-fetching library.
 */
export function useDomainResource<T>(
  loader: (signal?: AbortSignal) => Promise<T>,
  options: UseDomainResourceOptions<T> = {}
): UseDomainResourceResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [revision, setRevision] = useState(0);

  const isEmptyFn = options.isEmpty;
  const validate = options.validate;
  const resourceKey = options.resourceKey;

  // Hold the latest loader in a ref so the effect can call it without depending
  // on an unstable inline closure (which would re-run on every render and could
  // loop forever), while still re-running when the key or reload token changes.
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    const controller =
      typeof AbortController === 'function' ? new AbortController() : null;

    setState('loading');
    setError(null);
    // A key change means the current payload no longer describes this resource,
    // so it must not stay visible while the new load is in flight.
    setData(null);

    loaderRef.current(controller?.signal)
      .then((result) => {
        if (cancelled) return;

        if (validate && !validate(result)) {
          setData(null);
          setState('error');
          setError('The server returned no usable payload for this resource');
          return;
        }

        setData(result);
        setState('ready');
        setRevision((current) => current + 1);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        // Never leave the previous resource's payload on screen under a new id.
        setData(null);
        setState('error');
        setError(cause instanceof Error ? cause.message : 'Unable to load data');
      });

    return () => {
      // Both guards are needed: the flag covers a peer that ignores the signal
      // (or resolves during the same tick), and the abort actually cancels the
      // network request so a stale response is never even parsed.
      cancelled = true;
      controller?.abort();
    };
    // `loader` is intentionally excluded (see loaderRef); the identity it is
    // called with is not: a new key or an explicit reload re-runs the fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken, resourceKey]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  return {
    data,
    state,
    error,
    isEmpty: state === 'ready' && data !== null && (isEmptyFn ? isEmptyFn(data) : false),
    revision,
    reload,
  };
}
